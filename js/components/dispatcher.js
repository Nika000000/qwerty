// Панель диспетчера «Житомир Рух»
import { ROUTES_DATA, STOPS_DATA } from '../data/routes.js';
import { store } from '../services/store.js';
import { simulator } from '../services/simulator.js';
import { ztIcon } from './icons.js';

export class DispatcherComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    this.render();

    // Підписка на оновлення парку та фільтрів
    store.subscribe('vehicles_updated', () => {
      this.updateKPIs();
      this.updateTripsTable();
    });
    store.subscribe('alerts_updated', () => this.updateAlertsFeed());
    store.subscribe('dispatcher_filters_changed', () => this.updateTripsTable());
  }

  render() {
    if (!this.container) return;

    const state = store.getState();
    const filters = state.dispatcherFilters;

    this.container.innerHTML = `
      <div class="dispatcher-view">
        <!-- Смуга ключових показників (KPI) -->
        <div class="dispatcher-kpi-bar">
          <div class="kpi-card">
            <div class="kpi-icon-wrap bg-blue-subtle">${ztIcon('bus', 21)}</div>
            <div>
              <div class="kpi-val" id="kpi-total-vehicles">—</div>
              <div class="kpi-label">Машин у моделі</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap bg-cyan-subtle">${ztIcon('trolley', 21)}</div>
            <div>
              <div class="kpi-val" id="kpi-trolleybuses">—</div>
              <div class="kpi-label">Тролейбуси в моделі</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap bg-green-subtle">${ztIcon('check', 21)}</div>
            <div>
              <div class="kpi-val text-green" id="kpi-ontime-percent">—%</div>
              <div class="kpi-label">За графіком · демо</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap bg-red-subtle">${ztIcon('warning', 21)}</div>
            <div>
              <div class="kpi-val text-red" id="kpi-delayed-count">—</div>
              <div class="kpi-label">Затримка понад 3 хв · демо</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap bg-purple-subtle">${ztIcon('timer', 21)}</div>
            <div>
              <div class="kpi-val" id="kpi-sim-speed">1x</div>
              <div class="kpi-label">Темп симуляції</div>
            </div>
          </div>
        </div>

        <!-- Панель керування симуляцією та фільтрами -->
        <div class="dispatcher-controls-card">
          <div class="controls-row-top">
            <div class="search-box-flex">
              <input type="text" id="disp-search" class="zt-input"
                     placeholder="Номер борта, ім'я водія або маршрут"
                     value="${filters.search}"
                     style="background: #0f172a; color: #ffffff; border-color: rgba(255,255,255,0.15);">
            </div>

            <div class="filters-flex">
              <select id="disp-route-filter" class="zt-select" style="background: #0f172a; color: #ffffff; border-color: rgba(255,255,255,0.15);">
                <option value="all">Усі маршрути Житомира</option>
                ${ROUTES_DATA.map(r => `
                  <option value="${r.id}" ${filters.routeId === r.id ? 'selected' : ''}>
                    ${r.typeLabel} №${r.number}: ${r.name}
                  </option>
                `).join('')}
              </select>

              <select id="disp-type-filter" class="zt-select" style="background: #0f172a; color: #ffffff; border-color: rgba(255,255,255,0.15);">
                <option value="all" ${filters.type === 'all' ? 'selected' : ''}>Усі види ТЗ</option>
                <option value="trolleybus" ${filters.type === 'trolleybus' ? 'selected' : ''}>Тролейбуси</option>
                <option value="bus" ${filters.type === 'bus' ? 'selected' : ''}>Автобуси</option>
              </select>

              <select id="disp-status-filter" class="zt-select" style="background: #0f172a; color: #ffffff; border-color: rgba(255,255,255,0.15);">
                <option value="all" ${filters.status === 'all' ? 'selected' : ''}>Усі статуси</option>
                <option value="on_time" ${filters.status === 'on_time' ? 'selected' : ''}>За графіком · демо</option>
                <option value="delayed" ${filters.status === 'delayed' ? 'selected' : ''}>Затримка (відстають)</option>
                <option value="ahead" ${filters.status === 'ahead' ? 'selected' : ''}>Випередження</option>
              </select>
            </div>

            <div class="sim-speed-buttons">
              <span class="sim-label">Темп моделі:</span>
              <button class="btn-sim-speed active" data-speed="1">1x</button>
              <button class="btn-sim-speed" data-speed="2">2x</button>
              <button class="btn-sim-speed" data-speed="5">5x</button>
            </div>
          </div>
        </div>

        <div class="dispatcher-split-grid">
          <!-- Таблиця активних рейсів -->
          <div class="active-trips-card">
            <div class="table-top-bar">
              <h4>Транспорт у демо-моделі (<span id="disp-visible-count">0</span>)</h4>
              <button id="btn-export-log" class="btn-sm-action">${ztIcon('file', 16)} Експортувати CSV</button>
            </div>

            <div class="dispatcher-table-wrapper">
              <table class="dispatcher-table">
                <thead>
                  <tr>
                    <th>Борт</th>
                    <th>Маршрут</th>
                    <th>Водій</th>
                    <th>Швидкість</th>
                    <th>Демо-координати</th>
                    <th>Наступна зупинка</th>
                    <th>Відхилення</th>
                    <th>Дії диспетчера</th>
                  </tr>
                </thead>
                <tbody id="disp-trips-tbody">
                  <!-- Заповнюється в updateTripsTable() -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Стрічка сповіщень та оперативних журналів -->
          <div class="alerts-log-card">
            <div class="table-top-bar">
              <h4>Події та повідомлення</h4>
              <button id="btn-add-manual-alert" class="btn-sm-action">${ztIcon('plus', 16)} Додати подію</button>
            </div>

            <div id="disp-alerts-feed" class="alerts-feed-wrapper">
              <!-- Заповнюється в updateAlertsFeed() -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateKPIs();
    this.updateTripsTable();
    this.updateAlertsFeed();
  }

  updateKPIs() {
    const state = store.getState();
    const vehicles = state.vehicles;

    const total = vehicles.length;
    const trolleys = vehicles.filter(v => {
      const r = ROUTES_DATA.find(x => x.id === v.routeId);
      return r && r.type === 'trolleybus';
    }).length;
    const delayed = vehicles.filter(v => v.status === 'delayed').length;
    const onTime = vehicles.filter(v => v.status === 'on_time').length;
    const percentOnTime = total > 0 ? Math.round((onTime / total) * 100) : 100;

    const elTotal = document.getElementById('kpi-total-vehicles');
    const elTrolleys = document.getElementById('kpi-trolleybuses');
    const elDelayed = document.getElementById('kpi-delayed-count');
    const elPercent = document.getElementById('kpi-ontime-percent');

    if (elTotal) elTotal.textContent = `${total} од.`;
    if (elTrolleys) elTrolleys.textContent = `${trolleys} од.`;
    if (elDelayed) elDelayed.textContent = `${delayed} ТЗ`;
    if (elPercent) elPercent.textContent = `${percentOnTime}%`;
  }

  updateTripsTable() {
    const tbody = document.getElementById('disp-trips-tbody');
    const counter = document.getElementById('disp-visible-count');
    if (!tbody) return;

    const state = store.getState();
    const filters = state.dispatcherFilters;

    const filtered = state.vehicles.filter(v => {
      const route = ROUTES_DATA.find(r => r.id === v.routeId);
      if (!route) return false;

      if (filters.routeId !== 'all' && v.routeId !== filters.routeId) return false;
      if (filters.type !== 'all' && route.type !== filters.type) return false;
      if (filters.status !== 'all' && v.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchNum = v.boardNumber.toLowerCase().includes(q);
        const matchDriver = v.driverName.toLowerCase().includes(q);
        const matchRoute = route.number.toLowerCase().includes(q);
        if (!matchNum && !matchDriver && !matchRoute) return false;
      }
      return true;
    });

    if (counter) counter.textContent = filtered.length;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center p-4 text-muted">За заданими фільтрами активних транспортних засобів не знайдено.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(v => {
      const route = ROUTES_DATA.find(r => r.id === v.routeId);
      const isDelayed = v.status === 'delayed';
      const isAhead = v.status === 'ahead';
      const delayBadge = isDelayed ? `<span class="badge-delayed">+${v.delayMinutes} хв (Запізнення)</span>` :
                         isAhead ? `<span class="badge-ahead">${v.delayMinutes} хв (Випередження)</span>` :
                         `<span class="badge-ontime">За графіком · демо</span>`;

      return `
        <tr class="${isDelayed ? 'row-delayed-highlight' : ''}">
          <td>
            <strong>№${v.boardNumber}</strong>
            <span class="d-block text-xs text-muted">${v.model}</span>
          </td>
          <td>
            <span class="route-badge-mini" style="background:${route.color}">${route.number}</span>
            <span class="text-xs">${route.name}</span>
          </td>
          <td>
            <div class="font-medium">${v.driverName}</div>
            <span class="text-xs text-muted">${v.driverId}</span>
          </td>
          <td>
            <span class="font-mono">${v.speedKmH} км/год</span>
          </td>
          <td>
            <span class="font-mono text-xs">${v.lat?.toFixed(4)}, ${v.lng?.toFixed(4)}</span>
            <span class="d-block text-xs text-muted">Оновлено: ${v.lastPing}</span>
          </td>
          <td>
            <span class="text-sm font-medium">${v.nextStop || 'За розкладом'}</span>
          </td>
          <td>
            ${delayBadge}
          </td>
          <td>
            <div class="disp-action-buttons">
              <button class="btn-table-action" onclick="window.ztMsgDriver('${v.boardNumber}', '${v.driverName}')" title="Демо: створити повідомлення">${ztIcon('message', 16)}</button>
              <button class="btn-table-action" onclick="window.ztFixSchedule('${v.boardNumber}')" title="Демо: скинути відхилення">${ztIcon('timer', 16)}</button>
              <button class="btn-table-action" onclick="window.ztFocusVehicle('${v.id}')" title="Показати маркер на карті">${ztIcon('map', 16)}</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  updateAlertsFeed() {
    const feed = document.getElementById('disp-alerts-feed');
    if (!feed) return;

    const alerts = store.getState().alerts;

    feed.innerHTML = alerts.map(a => `
      <div class="alert-feed-item ${a.level === 'warning' ? 'alert-border-warning' : 'alert-border-info'}">
        <div class="alert-item-header">
          <span class="alert-badge ${a.level === 'warning' ? 'badge-warning' : 'badge-info'}">${a.route}</span>
          <span class="alert-time">${a.time}</span>
        </div>
        <div class="alert-item-title">${a.title}</div>
        <div class="alert-item-text">${a.text}</div>
      </div>
    `).join('');
  }

  bindEvents() {
    // Пошук
    const searchInput = document.getElementById('disp-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.updateDispatcherFilters({ search: e.target.value });
      });
    }

    // Фільтри селектів
    const routeSelect = document.getElementById('disp-route-filter');
    if (routeSelect) {
      routeSelect.addEventListener('change', (e) => {
        store.updateDispatcherFilters({ routeId: e.target.value });
      });
    }

    const typeSelect = document.getElementById('disp-type-filter');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        store.updateDispatcherFilters({ type: e.target.value });
      });
    }

    const statusSelect = document.getElementById('disp-status-filter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        store.updateDispatcherFilters({ status: e.target.value });
      });
    }

    // Перемикач швидкості симулятора
    this.container.querySelectorAll('.btn-sim-speed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.btn-sim-speed').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const speed = parseInt(e.currentTarget.dataset.speed, 10);
        simulator.setSimulationSpeed(speed);
        const speedKpi = document.getElementById('kpi-sim-speed');
        if (speedKpi) speedKpi.textContent = `${speed}x`;
      });
    });

    // Додавання ручного оголошення
    const addAlertBtn = document.getElementById('btn-add-manual-alert');
    if (addAlertBtn) {
      addAlertBtn.addEventListener('click', () => {
        const title = prompt('Введіть заголовок оперативного сповіщення:', 'Тимчасова затримка руху');
        if (!title) return;
        const text = prompt('Введіть деталі для водіїв та пасажирів:', 'Через дорожні роботи рух ускладнено.');
        if (!text) return;

        store.addAlert({
          level: 'warning',
          title,
          text,
          route: 'Диспетчер ТТУ'
        });
      });
    }

    // Експорт логу
    const exportBtn = document.getElementById('btn-export-log');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const vehicles = store.getState().vehicles;
        let csv = 'Борт;Маршрут;Водій;Швидкість;Широта;Довгота;Затримка(хв);Статус\n';
        vehicles.forEach(v => {
          const r = ROUTES_DATA.find(x => x.id === v.routeId);
          csv += `${v.boardNumber};${r?.number || ''};${v.driverName};${v.speedKmH};${v.lat};${v.lng};${v.delayMinutes};${v.status}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zhytomyr-transit-dispatch-log-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }
}
