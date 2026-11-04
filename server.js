// Простий локальний HTTP-сервер для «Житомир Рух» без зовнішніх залежностей
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8097;
const BASE_DIR = __dirname;
const sessions = new Map();
const loginFailures = new Map();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 10;
const PUBLIC_FILES = new Set([
  '/index.html', '/passenger.html', '/driver.html', '/dispatcher.html', '/staff-login.html',
  '/css/styles.css', '/js/bundle.js', '/assets/leaflet.js', '/assets/leaflet.css',
  '/assets/images/marker-shadow.png', '/assets/images/marker-icon.png', '/assets/images/layers.png'
]);

// Локальні паролі не комітяться й не доступні через HTTP. Environment-змінні мають пріоритет.
try {
  const secretsText = fs.readFileSync(path.join(BASE_DIR, '.staff-secrets.json'), 'utf8').replace(/^\uFEFF/, '');
  const localSecrets = JSON.parse(secretsText);
  if (!process.env.DRIVER_PASSWORD && typeof localSecrets.driverPassword === 'string') process.env.DRIVER_PASSWORD = localSecrets.driverPassword;
  if (!process.env.DISPATCHER_PASSWORD && typeof localSecrets.dispatcherPassword === 'string') process.env.DISPATCHER_PASSWORD = localSecrets.dispatcherPassword;
} catch (error) {
  if (error.code !== 'ENOENT') console.warn('Не вдалося прочитати локальні паролі службових ролей.');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => part.trim().split(/=(.*)/s).slice(0, 2)).filter(([key, value]) => key && value !== undefined));
}

function getSession(req) {
  const token = parseCookies(req.headers.cookie).zt_session;
  const session = token && sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return null;
  }
  return session;
}

function safeEqual(input, expected) {
  if (typeof input !== 'string' || !expected) return false;
  const actualBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 4096) reject(new Error('Запит завеликий'));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Некоректний формат запиту')); }
    });
    req.on('error', reject);
  });
}

// Прибирає цілий блок <div id="..."> з HTML і не залишає службову розмітку в публічній відповіді.
function removeDivById(html, id) {
  const opening = new RegExp(`<div\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>`, 'i');
  const match = opening.exec(html);
  if (!match) return html;
  const tagPattern = /<\/?div\b[^>]*>/gi;
  tagPattern.lastIndex = match.index;
  let depth = 0;
  let tag;
  while ((tag = tagPattern.exec(html))) {
    if (/^<\s*div\b/i.test(tag[0])) depth++;
    else depth--;
    if (depth === 0) return html.slice(0, match.index) + html.slice(tagPattern.lastIndex);
  }
  return html;
}

function replaceRoleButtonWithLogin(html, role) {
  const re = new RegExp(`<button\\b([^>]*\\bdata-role=["']${role}["'][^>]*)>([\\s\\S]*?)<\\/button>`, 'i');
  return html.replace(re, (_match, attributes, content) => {
    const title = attributes.match(/\btitle=["']([^"']*)["']/i)?.[1] || 'Службовий вхід';
    return `<button class="role-nav-link staff-nav-button" type="button" data-staff-login="${role}" title="${title}">${content}</button>`;
  });
}

function renderForRole(html, role) {
  const visibleRole = role === 'driver' || role === 'dispatcher' ? role : 'passenger';
  for (const candidate of ['passenger', 'driver', 'dispatcher']) {
    if (candidate !== visibleRole && !(visibleRole !== 'passenger' && candidate === 'passenger')) html = removeDivById(html, `page-${candidate}`);
  }
  for (const candidate of ['passenger', 'driver', 'dispatcher']) {
    if (candidate !== visibleRole && !(visibleRole !== 'passenger' && candidate === 'passenger')) html = replaceRoleButtonWithLogin(html, candidate);
  }
  html = html.replace(/<body\b([^>]*)data-page=["'][^"']*["']([^>]*)>/i, `<body$1data-page="${visibleRole}"$2>`);
  const control = visibleRole === 'passenger' ? '' : '<button class="staff-login-link" type="button" data-staff-logout>Вийти</button>';
  return html.replace('</nav>', `${control}</nav>`);
}

function readSessionRole(req) {
  return getSession(req)?.role || 'passenger';
}

const server = http.createServer((req, res) => {
  let reqPath;
  try { reqPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('400 Bad Request'); return; }

  if (req.method === 'POST' && reqPath === '/api/login') {
    readJson(req).then(({ role, password }) => {
      if (!['driver', 'dispatcher'].includes(role)) return sendJson(res, 400, { error: 'Оберіть службову роль.' });
      const expected = role === 'driver' ? process.env.DRIVER_PASSWORD : process.env.DISPATCHER_PASSWORD;
      if (!expected) return sendJson(res, 503, { error: `Вхід для ролі «${role === 'driver' ? 'водій' : 'диспетчер'}» ще не налаштовано адміністратором.` });
      const ip = req.socket.remoteAddress || 'unknown';
      const attempt = loginFailures.get(ip);
      if (attempt && attempt.expiresAt < Date.now()) loginFailures.delete(ip);
      else if (attempt?.count >= MAX_LOGIN_FAILURES) return sendJson(res, 429, { error: 'Забагато спроб входу. Спробуйте через 15 хвилин.' });
      if (!safeEqual(password, expected)) {
        const current = loginFailures.get(ip) || { count: 0, expiresAt: Date.now() + LOGIN_WINDOW_MS };
        current.count++;
        loginFailures.set(ip, current);
        return sendJson(res, 401, { error: 'Неправильний пароль.' });
      }
      loginFailures.delete(ip);
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, { role, expiresAt: Date.now() + SESSION_TTL_MS });
      const secure = req.socket.encrypted ? '; Secure' : '';
      sendJson(res, 200, { ok: true }, { 'Set-Cookie': `zt_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}` });
    }).catch(error => sendJson(res, 400, { error: error.message }));
    return;
  }

  if (req.method === 'POST' && reqPath === '/api/logout') {
    const token = parseCookies(req.headers.cookie).zt_session;
    if (token) sessions.delete(token);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Set-Cookie': 'zt_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD, POST' }); res.end('405 Method Not Allowed'); return;
  }

  const role = readSessionRole(req);
  if (reqPath === '/staff-login') reqPath = '/staff-login.html';
  if ((reqPath === '/driver.html' && role !== 'driver') || (reqPath === '/dispatcher.html' && role !== 'dispatcher')) {
    res.writeHead(302, { Location: role === 'passenger' ? '/staff-login.html' : '/' });
    res.end();
    return;
  }
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  // Сервер публікує лише файли, потрібні браузеру, а не вихідний код/налаштування проєкту.
  if (!PUBLIC_FILES.has(reqPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const filePath = path.resolve(BASE_DIR, `.${reqPath}`);

  // Безпека від path traversal
  if (!filePath.startsWith(BASE_DIR + path.sep) && filePath !== BASE_DIR) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=3600' });

    if (ext === '.html') {
      fs.readFile(filePath, 'utf8', (readErr, html) => {
        if (readErr) { res.writeHead(500); res.end('500 Internal Server Error'); return; }
        const effectiveRole = reqPath === '/driver.html' ? 'driver' : reqPath === '/dispatcher.html' ? 'dispatcher' : (reqPath === '/index.html' || reqPath === '/passenger.html') ? role : 'passenger';
        const page = renderForRole(html, effectiveRole);
        if (req.method === 'HEAD') { res.end(); return; }
        res.end(page);
      });
      return;
    }

    if (req.method === 'HEAD') { res.end(); return; }
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Вебсайт «Житомир Рух» успішно запущено!`);
  console.log(`  Відкрийте у браузері: http://localhost:${PORT}`);
  if (!process.env.DRIVER_PASSWORD || !process.env.DISPATCHER_PASSWORD) {
    console.log('  Увага: вхід до ролей без налаштованих паролів вимкнено. Перевірте DRIVER_PASSWORD і DISPATCHER_PASSWORD.');
  }
  console.log(`======================================================\n`);
});
