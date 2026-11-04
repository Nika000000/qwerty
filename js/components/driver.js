// Кабінет водія «Житомир Рух»
import { ROUTES_DATA, STOPS_DATA, INITIAL_VEHICLES } from '../data/routes.js';
import { store } from '../services/store.js';
import { ztIcon } from './icons.js';

export class DriverComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.shiftTimer = null;
    this.shiftElapsedMinutes = 75; // симулюємо 1 год 15 хв на лінії
  }

  init() {
    this.render();

    // Підписка на оновлення стану водія та симуляції
    store.subscribe('driver_updated', () => this.renderHUD());
    store.subscribe('vehicles_updated', () => this.renderHUD());
  }

  render() {
    if (!this.container) return;

    const state = store.getState();
    const driver = state.driver;

    this.container.innerHTML = `
      <div class="driver-cabinet-view">
        <!-- Верхня картка профілю та керування зміною -->
        <div class="driver-card-dark">
          <div class="driver-profile-header">
            <div class="driver-avatar-circle">${ztIcon('driver', 30)}</div>
            <div class="driver-meta">
              <div class="driver-sub-id">Водій · №${driver.badgeNumber} · Депо 1</div>
              <h2 class="driver-name-text">${driver.driverName}</h2>
              <span class="driver-depot-tag" style="color: #38bdf8;">Закріплений ТЗ: Борт №${driver.boardNumber} (${driver.model})</span>
            </div>
          </div>

          <div class="shift-controls-bar">
            <div class="shift-status-text">
              <div class="pulse-dot" style="${driver.shiftStarted ? 'background:#10b981;' : 'background:#94a3b8;'}"></div>
              <span class="${driver.shiftStarted ? 'shift-active' : 'shift-idle'}">
                ${driver.shiftStarted ? 'Зміна розпочата' : 'Зміну ще не розпочато'}
              </span>
            </div>
            
            <div class="shift-action-buttons">
              ${!driver.shiftStarted ? `
                <button id="btn-start-shift" class="btn-shift-toggle btn-shift-start">
                  ${ztIcon('check', 17)} Розпочати зміну
                </button>
              ` : `
                <button id="btn-end-shift" class="btn-shift-toggle btn-shift-end">
                  ${ztIcon('close', 17)} Завершити зміну
                </button>
              `}
            </div>
          </div>
        </div>

        <!-- Налаштування рейсу та ТЗ -->
        <div class="driver-card-dark">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Параметри поточного випуску</h4>
          <div class="setup-grid">
            <div class="setup-field">
              <label style="color: #cbd5e1;">Ваш маршрут:</label>
              <select id="driver-route-select" class="zt-select" style="background:#0f172a;color:#ffffff;border-color:rgba(255,255,255,0.15);" ${driver.shiftStarted ? 'disabled' : ''}>
                ${ROUTES_DATA.map(r => `
                  <option value="${r.id}" ${r.id === driver.routeId ? 'selected' : ''}>
                    ${r.typeLabel} №${r.number}: ${r.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="setup-field">
              <label style="color: #cbd5e1;">Транспортний засіб:</label>
              <select id="driver-vehicle-select" class="zt-select" style="background:#0f172a;color:#ffffff;border-color:rgba(255,255,255,0.15);" ${driver.shiftStarted ? 'disabled' : ''}>
                ${INITIAL_VEHICLES.map(v => `
                  <option value="${v.boardNumber}" ${v.boardNumber === driver.boardNumber ? 'selected' : ''}>
                    Борт №${v.boardNumber} (${v.model})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Бортовий комп'ютер / Cockpit HUD водія -->
        <div id="driver-hud-container" class="driver-hud-wrapper">
          <!-- Заповнюється в renderHUD() -->
        </div>

        <!-- Контрольний похвилинний розклад рейсу -->
        <div class="driver-card-dark">
          <div class="checklist-header" style="display:flex;justify-content:space-between;align-items:center;">
            <h4 style="font-size:0.95rem;font-weight:800;color:#cbd5e1;">Демо-журнал проходження зупинок</h4>
            <span style="background:rgba(2,132,199,0.25);color:#38bdf8;padding:0.25rem 0.65rem;border-radius:999px;font-size:0.75rem;font-weight:700;">
              ${ROUTES_DATA.find(r => r.id === driver.routeId)?.name}
            </span>
          </div>
          <p style="font-size:0.78rem;color:#94a3b8;">Плановий розклад і фактичні відмітки не підключені. <a href="${ROUTES_DATA.find(r => r.id === driver.routeId)?.officialScheduleUrl}" target="_blank" rel="noopener noreferrer" style="color:#7dd3fc;">Відкрити графік маршруту ↗</a></p>

          <div class="schedule-table-scroll">
            <table class="driver-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Зупинка</th>
          <th>План</th>
                  <th>Факт</th>
                  <th>Різниця</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody id="driver-waypoints-tbody">
                ${this.getWaypointsRowsHtml(driver)}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Панель швидких екстрених сповіщень диспетчера -->
        <div class="driver-card-dark">
          <h4 style="font-size:0.95rem;font-weight:800;color:#f87171;">${ztIcon('message', 17)} Зв'язок із диспетчером</h4>
          <p style="font-size:0.78rem;color:#94a3b8;">Оберіть подію. Повідомлення буде додано до демонстраційного журналу.</p>
          <div class="incident-buttons-row">
            <button class="btn-incident" data-incident="Затор на вул. Київська">${ztIcon('car', 17)} Затор</button>
            <button class="btn-incident" data-incident="ДТП на маршруті">${ztIcon('warning', 17)} ДТП на маршруті</button>
            <button class="btn-incident" data-incident="Технічна несправність">${ztIcon('tools', 17)} Технічна несправність</button>
            <button class="btn-incident" data-incident="Потрібна допомога пасажиру">${ztIcon('accessibility', 17)} Допомога пасажиру</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderHUD();
  }

  renderHUD() {
    const hudEl = document.getElementById('driver-hud-container');
    if (!hudEl) return;

    const state = store.getState();
    const driver = state.driver;
    const currentRoute = ROUTES_DATA.find(r => r.id === driver.routeId) || ROUTES_DATA[0];

    const delay = driver.delayMinutes || 0;
    let delayStatusClass = 'badge-success';
    let delayStatusText = 'За графіком · демо';
    let deviationDesc = 'Це локальна симуляція; фактичні GPS-дані та графік не підключені.';

    if (delay > 0) {
      delayStatusClass = 'badge-warning';
      delayStatusText = `Запізнення: +${delay} хв`;
      deviationDesc = 'Ви відстаєте від графіка. За можливості скоротіть тривалість посадки на зупинках.';
    } else if (delay < 0) {
      delayStatusClass = 'badge-info';
      delayStatusText = `Випередження: ${delay} хв`;
      deviationDesc = 'Увага! Ви випереджаєте графік. Знизьте швидкість або затримайтеся на зупинці.';
    }

    hudEl.innerHTML = `
      <div class="driver-card-dark" style="background: linear-gradient(135deg, #070d19 0%, #0b132b 100%);">
        <div class="hud-top-status-bar" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <span style="font-size:0.78rem;color:#94a3b8;font-weight:700;">СТАТУС ГРАФІКА:</span>
            <span class="hud-status-badge ${delayStatusClass}" style="font-size:0.82rem;font-weight:800;padding:0.25rem 0.65rem;border-radius:999px;">${delayStatusText}</span>
          </div>
          <div class="hud-coords" style="font-family:var(--font-mono);font-size:0.75rem;color:#38bdf8;">
            Демо-координати: ${driver.lat ? driver.lat.toFixed(4) : '—'}, ${driver.lng ? driver.lng.toFixed(4) : '—'}
          </div>
        </div>

        <div class="cockpit-gauges-grid" style="margin-top:0.75rem;">
          <!-- Цифровий спідометр -->
          <div class="cockpit-gauge-box">
            <div class="speed-lcd">${driver.speed || 0}</div>
            <div class="speed-unit-tag">км/год</div>
            <div class="gauge-caption">ШВИДКІСТЬ</div>
          </div>

          <!-- Зупинки -->
          <div class="cockpit-gauge-box next-stop-callout">
            <div style="margin-bottom:0.45rem;">
              <span style="font-size:0.68rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">Пройдена:</span>
              <span style="font-size:0.82rem;color:#cbd5e1;font-weight:600;display:block;">${driver.currentStopName || STOPS_DATA[currentRoute.stopsForward[0]]?.name}</span>
            </div>
            <div>
              <span class="callout-label">Наступна зупинка:</span>
              <span class="callout-name">${driver.nextStopName || STOPS_DATA[currentRoute.stopsForward[1]]?.name}</span>
            </div>
            <button id="btn-next-stop-driver" class="btn-announce-stop">
              ${ztIcon('alert', 17)} Повідомити про прибуття
            </button>
          </div>

          <!-- Відхилення від графіка -->
          <div class="cockpit-gauge-box">
            <div class="deviation-lcd ${delay > 0 ? 'text-delayed' : delay < 0 ? 'text-ahead' : 'text-ontime'}">
              ${delay > 0 ? `+${delay}` : delay}
              <span class="dev-unit-sub">хв</span>
            </div>
            <div class="gauge-caption" style="color:${delay > 0 ? '#f87171' : delay < 0 ? '#38bdf8' : '#34d399'};font-weight:800;">
              ${delay === 0 ? 'В ГРАФІКУ' : delay > 0 ? 'ЗАПІЗНЕННЯ' : 'ВИПЕРЕДЖЕННЯ'}
            </div>
          </div>
        </div>
      </div>
    `;

    const nextStopBtn = document.getElementById('btn-next-stop-driver');
    if (nextStopBtn) {
      nextStopBtn.addEventListener('click', () => {
        // Симуляція прибуття до наступної зупинки
        const newDelay = Math.max(-2, Math.min(6, (driver.delayMinutes || 0) + (Math.random() > 0.5 ? 1 : -1)));
        store.updateDriver({ delayMinutes: newDelay });
        alert(`Зупинка "${driver.nextStopName || 'Чергова'}" успішно відзначена в бортовому журналі!`);
      });
    }
  }

  getWaypointsRowsHtml(driver) {
    const route = ROUTES_DATA.find(r => r.id === driver.routeId) || ROUTES_DATA[0];
    const stops = route.stopsForward.map(id => STOPS_DATA[id]).filter(Boolean);

    return stops.map((stop, idx) => {
      const isPassed = idx < (driver.currentStopIndex || 2);
      const isCurrent = idx === (driver.currentStopIndex || 2);
      const factTime = 'Не підключено';
      const diffText = '—';
      const statusBadge = isPassed ? '<span class="badge-success">Пройдено</span>' :
                          isCurrent ? '<span class="badge-warning">У процесі</span>' :
                          '<span class="badge-sched">Очікується</span>';

      return `
        <tr class="${isCurrent ? 'row-current-waypoint' : ''}">
          <td>${idx + 1}</td>
          <td><strong>${stop.name}</strong></td>
          <td>Немає даних</td>
          <td>${factTime}</td>
          <td>${diffText}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  bindEvents() {
    // Початок та завершення зміни
    const startBtn = document.getElementById('btn-start-shift');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        store.updateDriver({
          shiftStarted: true,
          shiftStartTime: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
        });
        store.addAlert({
          level: 'info',
          title: `Водій виїхав на лінію: Борт №${store.getState().driver.boardNumber}`,
          text: `${store.getState().driver.driverName} розпочав зміну на маршруті №${ROUTES_DATA.find(r => r.id === store.getState().driver.routeId)?.number}`,
          route: `Борт #${store.getState().driver.boardNumber}`
        });
        this.render();
      });
    }

    const endBtn = document.getElementById('btn-end-shift');
    if (endBtn) {
      endBtn.addEventListener('click', () => {
        if (confirm('Ви дійсно бажаєте завершити робочу зміну та здати транспортний засіб у депо?')) {
          store.updateDriver({ shiftStarted: false });
          store.addAlert({
            level: 'warning',
            title: `Завершення зміни: Борт №${store.getState().driver.boardNumber}`,
            text: `${store.getState().driver.driverName} здав зміну. ТЗ повертається до депо.`,
            route: `Борт #${store.getState().driver.boardNumber}`
          });
          this.render();
        }
      });
    }

    // Вибір маршруту та ТЗ
    const routeSelect = document.getElementById('driver-route-select');
    if (routeSelect) {
      routeSelect.addEventListener('change', (e) => {
        store.updateDriver({ routeId: e.target.value });
        this.render();
      });
    }

    const vehicleSelect = document.getElementById('driver-vehicle-select');
    if (vehicleSelect) {
      vehicleSelect.addEventListener('change', (e) => {
        store.updateDriver({ boardNumber: e.target.value });
        this.render();
      });
    }

    // Сповіщення про інцидент диспетчеру
    this.container.querySelectorAll('.btn-incident').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.currentTarget.dataset.incident;
        const driver = store.getState().driver;
        const route = ROUTES_DATA.find(r => r.id === driver.routeId);

        store.addAlert({
          level: 'warning',
          title: `Повідомлення від водія (Борт №${driver.boardNumber})`,
          text: `${text}. Поточне місце: ${driver.nextStopName || 'вул. Київська'}.`,
          route: `${route?.typeLabel} №${route?.number}`
        });

        alert(`Демо: повідомлення «${text}» додано до локального журналу. Диспетчер не отримав реальне сповіщення.`);
      });
    });
  }
}
