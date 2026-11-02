// Автоматична збірка універсального скрипта для «Житомир Рух»
// Об'єднує всі модулі в єдиний bundle.js без ES6 import/export,
// щоб додаток працював ЯК через HTTP сервер, ТАК І при простому подвійному кліку на index.html (file:///)

const fs = require('fs');
const path = require('path');

function cleanModule(code) {
  // Видаляємо import та export вирази
  return code
    .replace(/^\s*import\s+[^;]+;?/gm, '')
    .replace(/^\s*export\s+default\s+/gm, '')
    .replace(/^\s*export\s+(const|let|var|class|function)\s+/gm, '$1 ')
    .replace(/^\s*export\s*\{[^}]*\};?/gm, '');
}

const routesCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/data/routes.js'), 'utf8'));
const storeCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/services/store.js'), 'utf8'));
const simCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/services/simulator.js'), 'utf8'));
const mapCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/components/map.js'), 'utf8'));
const passengerCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/components/passenger.js'), 'utf8'));
const driverCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/components/driver.js'), 'utf8'));
const dispatcherCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/components/dispatcher.js'), 'utf8'));
const appCode = cleanModule(fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8'));

const bundleContent = `/**
 * ЖИТОМИР РУХ — Універсальний клієнтський бандл
 * Працює як через локальний/віддалений веб-сервер, так і при відкритті файлу напряму (file:///)
 */
(function() {
  'use strict';

  // 1. ДАНІ МАРШРУТІВ ТА ЗУПИНОК
  ${routesCode}

  // 2. СХОВИЩЕ СТАНУ
  ${storeCode}

  // 3. СИМУЛЯТОР GPS РУХУ
  ${simCode}

  // 4. КОНТРОЛЕР МАПИ
  ${mapCode}

  // 5. КАБІНЕТ ПАСАЖИРА
  ${passengerCode}

  // 6. КАБІНЕТ ВОДІЯ
  ${driverCode}

  // 7. ПАНЕЛЬ ДИСПЕТЧЕРА
  ${dispatcherCode}

  // 8. ГОЛОВНИЙ ДОДАТОК
  ${appCode}

  // Безпечний запуск при завантаженні сторінки
  function startApp() {
    if (window.__ztApp) return;
    try {
      console.log('Житомир Рух: Старт додатку...');
      const app = new ZhytomyrRukhApp();
      app.init();
      window.__ztApp = app;
    } catch (err) {
      console.error('Помилка ініціалізації Житомир Рух:', err);
      const container = document.getElementById('passenger-container');
      if (container) {
        container.innerHTML = '<div style="padding:20px;color:red;font-weight:bold;">Помилка запуску: ' + err.message + '</div>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
`;

fs.writeFileSync(path.join(__dirname, 'js/bundle.js'), bundleContent, 'utf8');
console.log('js/bundle.js успішно зібрано! Розмір:', bundleContent.length, 'байт');
