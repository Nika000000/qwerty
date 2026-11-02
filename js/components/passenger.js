// Кабінет пасажира «Житомир Рух»
import { ROUTES_DATA, STOPS_DATA, EXTERNAL_SERVICES } from '../data/routes.js';
import { store } from '../services/store.js';
import { simulator } from '../services/simulator.js';

export class PassengerComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.searchQuery = '';
    this.filterType = 'all'; // 'all', 'trolleybus', 'bus'
    this.plannerFrom = 's_bohunia_term';
    this.plannerTo = 's_vokzal';
  }

  init() {
    this.render();

    // Підписка на оновлення стану
    store.subscribe('tab_changed', () => this.render());
    store.subscribe('route_selected', () => this.render());
    store.subscribe('direction_changed', () => this.render());
    store.subscribe('stop_selected', () => this.renderStopBoard());
    store.subscribe('favorites_updated', () => this.renderFavorites());
    store.subscribe('vehicles_updated', () => {
      // Оновлюємо табло зупинки при кожному тіку симулятора
      const activeTab = store.getState().passengerTab;
      if (activeTab === 'search' || activeTab === 'stop_board') {
        this.renderStopBoard();
      }
    });
  }

  render() {
    if (!this.container) return;

    const state = store.getState();
    const currentTab = state.passengerTab;

    this.container.innerHTML = `
      <div class="passenger-panel-inner">
        <!-- Навігація вкладок кабінету пасажира -->
        <div class="passenger-tabs-nav">
          <button class="nav-tab-btn ${currentTab === 'search' ? 'active' : ''}" data-tab="search">
            <span class="tab-icon">🔍</span>
            <span>Маршрути</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'schedule' ? 'active' : ''}" data-tab="schedule">
            <span class="tab-icon">🕒</span>
            <span>Розклад</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'planner' ? 'active' : ''}" data-tab="planner">
            <span class="tab-icon">🧭</span>
            <span>Планувальник</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'favorites' ? 'active' : ''}" data-tab="favorites">
            <span class="tab-icon">⭐</span>
            <span>Обране</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'links' ? 'active' : ''}" data-tab="links">
            <span class="tab-icon">🌐</span>
            <span>Сервіси</span>
          </button>
        </div>

        <!-- Контейнер вмісту вкладки -->
        <div class="passenger-tab-body">
          ${this.renderActiveTabContent(currentTab)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderActiveTabContent(tab) {
    switch (tab) {
      case 'schedule':
        return this.getScheduleHtml();
      case 'planner':
        return this.getPlannerHtml();
      case 'favorites':
        return this.getFavoritesHtml();
      case 'links':
        return this.getLinksHtml();
      case 'search':
      default:
        return this.getSearchAndRouteHtml();
    }
  }

  getSearchAndRouteHtml() {
    const state = store.getState();
    const selectedRoute = ROUTES_DATA.find(r => r.id === state.selectedRouteId) || ROUTES_DATA[0];
    const isFavRoute = state.favorites.routes.includes(selectedRoute.id);
    const direction = state.selectedDirection;
    const stopIds = direction === 'forward' ? selectedRoute.stopsForward : selectedRoute.stopsBackward;
    
    // Фільтрація списку маршрутів для бічної панелі
    const filteredRoutes = ROUTES_DATA.filter(r => {
      const matchSearch = r.number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          r.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchType = this.filterType === 'all' || r.type === this.filterType;
      return matchSearch && matchType;
    });

    return `
      <!-- Пошук та фільтри маршрутів -->
      <div class="search-filter-box">
        <div class="search-input-wrapper">
          <span class="search-icon">🔎</span>
          <input type="text" id="route-search-input" class="search-input" 
                 placeholder="Номер маршруту або назва (напр. 2, Богунія, Вокзал)..." 
                 value="${this.searchQuery}">
          ${this.searchQuery ? '<button id="btn-clear-search" class="btn-clear">✕</button>' : ''}
        </div>
        <div class="filter-pills">
          <button class="filter-pill ${this.filterType === 'all' ? 'active' : ''}" data-type="all">Всі (${ROUTES_DATA.length})</button>
          <button class="filter-pill ${this.filterType === 'trolleybus' ? 'active' : ''}" data-type="trolleybus">⚡ Тролейбуси (4)</button>
          <button class="filter-pill ${this.filterType === 'bus' ? 'active' : ''}" data-type="bus">🚌 Автобуси (4)</button>
        </div>
      </div>

      <!-- Горизонтальний скрол знайдених маршрутів -->
      <div class="routes-horizontal-list">
        ${filteredRoutes.map(route => `
          <div class="route-chip ${route.id === selectedRoute.id ? 'active' : ''}" 
               data-route-id="${route.id}" 
               style="--chip-color: ${route.color}">
            <div class="route-chip-badge">${route.number}</div>
            <div class="route-chip-info">
              <span class="route-chip-type">${route.typeLabel}</span>
              <span class="route-chip-name">${route.name}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div id="stop-search-results" class="stop-search-results" aria-live="polite"></div>

      <!-- Картка обраного маршруту -->
      <div class="selected-route-card">
        <div class="route-card-header">
          <div class="route-title-group">
            <span class="route-large-badge" style="background:${selectedRoute.color}">${selectedRoute.number}</span>
            <div>
              <div class="route-type-badge">${selectedRoute.typeLabel} • ${selectedRoute.carrier}</div>
              <h3 class="route-main-name">${selectedRoute.name}</h3>
            </div>
          </div>
          <button class="btn-star-fav ${isFavRoute ? 'is-fav' : ''}" id="btn-toggle-fav-route" title="Додати в обране">
            ${isFavRoute ? '★ В обраному' : '☆ В обране'}
          </button>
        </div>

        <div class="route-meta-strip">
          <div class="meta-item">
            <span class="meta-label">Вартість:</span>
            <span class="meta-val">${selectedRoute.fare}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Інтервал:</span>
            <span class="meta-val">${selectedRoute.interval}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Графік:</span>
            <span class="meta-val">${selectedRoute.workingHours}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">На лінії:</span>
            <span class="meta-val text-emerald">${selectedRoute.activeVehiclesCount} ТЗ у демо-парку</span>
          </div>
        </div>

        <!-- Перемикач напрямку -->
        <div class="direction-switch-bar">
          <button class="dir-btn ${direction === 'forward' ? 'active' : ''}" data-dir="forward">
            <span>Прямий:</span> ${STOPS_DATA[selectedRoute.stopsForward[0]]?.name} → ${STOPS_DATA[selectedRoute.stopsForward[selectedRoute.stopsForward.length - 1]]?.name}
          </button>
          <button class="dir-btn ${direction === 'backward' ? 'active' : ''}" data-dir="backward">
            <span>Зворотний:</span> ${STOPS_DATA[selectedRoute.stopsBackward[0]]?.name} → ${STOPS_DATA[selectedRoute.stopsBackward[selectedRoute.stopsBackward.length - 1]]?.name}
          </button>
        </div>

        <!-- Список зупинок маршруту -->
        <div class="stops-timeline-wrapper">
          <h4 class="section-subheading">Зупинки на маршруті (${stopIds.length}):</h4>
          <div class="stops-timeline">
            ${stopIds.map((stopId, index) => {
              const stop = STOPS_DATA[stopId];
              if (!stop) return '';
              const isSelected = stopId === state.selectedStopId;
              const isFirst = index === 0;
              const isLast = index === stopIds.length - 1;

              return `
                <div class="stop-timeline-node ${isSelected ? 'selected' : ''}" data-stop-id="${stop.id}">
                  <div class="node-marker ${isFirst || isLast ? 'terminal' : ''}"></div>
                  <div class="node-content">
                    <div class="node-name-row">
                      <span class="node-name">${stop.name}</span>
                      ${stop.hasDisplay ? '<span class="badge-amenity" title="Електронне табло на зупинці">🖥️</span>' : ''}
                      ${stop.hasShelter ? '<span class="badge-amenity" title="Крита зупинка">🏠</span>' : ''}
                    </div>
                    <div class="node-sub">
                      <span class="node-zone">${stop.zone}</span>
                      <button class="btn-peek-eta" data-stop-id="${stop.id}">Переглянути табло →</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Живе табло прибуття транспорту для поточної зупинки -->
      <div id="stop-board-container" class="stop-board-wrapper">
        <!-- Заповнюється в renderStopBoard() -->
      </div>
    `;
  }

  renderStopBoard() {
    const boardEl = document.getElementById('stop-board-container');
    if (!boardEl) return;

    const state = store.getState();
    const currentStop = STOPS_DATA[state.selectedStopId] || STOPS_DATA['s_sob'];
    const isFavStop = state.favorites.stops.includes(currentStop.id);
    const arrivals = simulator.getArrivalsForStop(currentStop.id);

    boardEl.innerHTML = `
      <div class="live-stop-card">
        <div class="stop-card-head">
          <div>
            <div class="badge-live-pulse">Демонстраційне табло · без GPS-даних</div>
            <h3 class="stop-headline">${currentStop.name}</h3>
            <span class="stop-zone-label">Район: ${currentStop.zone} • ${currentStop.connections.length} маршрутів через зупинку</span>
          </div>
          <button class="btn-star-fav ${isFavStop ? 'is-fav' : ''}" id="btn-toggle-fav-stop">
            ${isFavStop ? '★ Зупинка в обраному' : '☆ Зберегти зупинку'}
          </button>
        </div>

        <div class="arrivals-table-container">
          ${arrivals.length > 0 ? `
            <table class="arrivals-table">
              <thead>
                <tr>
                  <th>Маршрут</th>
                  <th>Напрямок руху</th>
                  <th>ТЗ / Модель</th>
                  <th>Статус</th>
                  <th>Прибуття</th>
                </tr>
              </thead>
              <tbody>
                ${arrivals.map(arr => `
                  <tr class="arrival-row ${arr.etaMinutes <= 2 ? 'row-imminent' : ''}">
                    <td>
                      <span class="arrival-route-badge" style="background:${arr.color}">${arr.routeNumber}</span>
                      <span class="arrival-type-sub">${arr.typeLabel}</span>
                    </td>
                    <td>
                      <div class="arrival-dest-name">${arr.destination}</div>
                      ${arr.stopsAway ? `<span class="arrival-stops-away">${arr.stopsAway} зуп. до вас</span>` : ''}
                    </td>
                    <td>
                      <div class="arrival-model">${arr.model}</div>
                      <span class="arrival-board-num">Борт №${arr.boardNumber}</span>
                      ${arr.lowFloor ? '<span class="badge-accessible" title="Низька підлога для маломобільних пасажирів">♿</span>' : ''}
                    </td>
                    <td>
                      ${arr.status === 'delayed' ? `<span class="badge-warning">+${arr.delayMinutes} хв</span>` :
                        arr.status === 'ahead' ? `<span class="badge-info">${arr.delayMinutes} хв</span>` :
                        '<span class="badge-success">В графіку</span>'}
                      ${arr.isScheduled ? '<span class="badge-sched">Демо-оцінка</span>' : '<span class="badge-gps">Демо-симуляція</span>'}
                    </td>
                    <td class="col-eta">
                      <span class="eta-big ${arr.etaMinutes <= 2 ? 'text-urgent' : ''}">${arr.etaMinutes} хв</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div class="empty-arrivals-state">
              <p>Наразі на цій зупинці немає активних рейсів.</p>
            </div>
          `}
        </div>
      </div>
    `;

    // Подія збереження зупинки в обране
    const favBtn = document.getElementById('btn-toggle-fav-stop');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        store.toggleFavoriteStop(currentStop.id);
      });
    }
  }

  getScheduleHtml() {
    const state = store.getState();
    const selectedRoute = ROUTES_DATA.find(r => r.id === state.selectedRouteId) || ROUTES_DATA[0];
    const sched = selectedRoute.schedule;

    return `
      <div class="schedule-tab-content">
        <div class="schedule-header-card">
          <div class="sched-top-row">
            <span class="route-large-badge" style="background:${selectedRoute.color}">${selectedRoute.number}</span>
            <div>
              <h3>Розклад руху: ${selectedRoute.name}</h3>
              <p class="text-muted">Демонстраційні дані, не офіційний розклад перевізників</p>
            </div>
          </div>
          <div class="sched-kpis">
            <div class="kpi-box">
              <span class="kpi-num">${sched.weekday.firstDeparture}</span>
              <span class="kpi-lbl">Перший рейс (Будні)</span>
            </div>
            <div class="kpi-box">
              <span class="kpi-num">${sched.weekday.lastDeparture}</span>
              <span class="kpi-lbl">Останній рейс (Будні)</span>
            </div>
            <div class="kpi-box">
              <span class="kpi-num">${sched.weekday.peakInterval}</span>
              <span class="kpi-lbl">Інтервал у піковий час</span>
            </div>
            <div class="kpi-box">
              <span class="kpi-num">${sched.weekday.offPeakInterval}</span>
              <span class="kpi-lbl">Інтервал у міжпік</span>
            </div>
          </div>
        </div>

        <div class="schedule-grid-box">
          <div class="sched-box-title">
            <h4>Графік відправлень з кінцевої зупинки (${STOPS_DATA[selectedRoute.stopsForward[0]]?.name})</h4>
            <span class="badge-weekday">Понеділок — П'ятниця</span>
          </div>

          ${sched.weekday.departuresFromTermA ? `
            <div class="departure-hours-grid">
              ${this.groupTimesByHour(sched.weekday.departuresFromTermA)}
            </div>
          ` : `
            <p class="text-muted p-3">Інтервальний рух з 06:00 до 22:30 кожні ${sched.weekday.peakInterval} (пік) / ${sched.weekday.offPeakInterval} (міжпік).</p>
          `}
        </div>

        <div class="schedule-weekend-card">
          <div class="sched-box-title">
            <h4>Вихідні та святкові дні (Субота — Неділя)</h4>
            <span class="badge-weekend">Вихідні дні</span>
          </div>
          <p class="weekend-note">
            Початок руху: <strong>${sched.weekend.firstDeparture}</strong> | Завершення: <strong>${sched.weekend.lastDeparture}</strong>.<br>
            Інтервал руху: <strong>${sched.weekend.peakInterval}</strong> (ранок/вечір), <strong>${sched.weekend.offPeakInterval}</strong> (вдень).
          </p>
        </div>
      </div>
    `;
  }

  groupTimesByHour(timesList) {
    const hours = {};
    timesList.forEach(t => {
      const [h, m] = t.split(':');
      if (!hours[h]) hours[h] = [];
      hours[h].push(m);
    });

    return Object.entries(hours).map(([hour, minutes]) => `
      <div class="hour-row">
        <span class="hour-label">${hour}:00</span>
        <div class="minute-pills">
          ${minutes.map(m => `<span class="min-tag">${hour}:${m}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  getPlannerHtml() {
    const stopsList = Object.values(STOPS_DATA);

    return `
      <div class="planner-tab-content">
        <div class="planner-card">
          <h3 class="planner-title">🧭 Планувальник поїздки громадським транспортом</h3>
          <p class="text-muted">Знайдіть оптимальний маршрут між зупинками Житомира без пересадок або з найшвидшим сполученням.</p>

          <div class="planner-form">
            <div class="planner-input-group">
              <label for="planner-from-select">Звідки (Початкова зупинка):</label>
              <select id="planner-from-select" class="zt-select">
                ${stopsList.map(s => `
                  <option value="${s.id}" ${s.id === this.plannerFrom ? 'selected' : ''}>${s.name} (${s.zone})</option>
                `).join('')}
              </select>
            </div>

            <div class="planner-swap-btn-row">
              <button id="btn-swap-planner" class="btn-swap" title="Поміняти місцями">⇅ Змінити напрямок</button>
            </div>

            <div class="planner-input-group">
              <label for="planner-to-select">Куди (Кінцева зупинка):</label>
              <select id="planner-to-select" class="zt-select">
                ${stopsList.map(s => `
                  <option value="${s.id}" ${s.id === this.plannerTo ? 'selected' : ''}>${s.name} (${s.zone})</option>
                `).join('')}
              </select>
            </div>

            <button id="btn-run-planner" class="btn-calculate-route">Розрахувати маршрут поїздки 🚀</button>
          </div>
        </div>

        <div id="planner-results-container" class="planner-results">
          ${this.calculateTrip(this.plannerFrom, this.plannerTo)}
        </div>
      </div>
    `;
  }

  calculateTrip(fromId, toId) {
    if (fromId === toId) {
      return '<div class="alert-box alert-warning">Ви обрали однакову початкову та кінцеву зупинку.</div>';
    }

    const fromStop = STOPS_DATA[fromId];
    const toStop = STOPS_DATA[toId];

    // Шукаємо прямі маршрути
    const directRoutes = [];
    ROUTES_DATA.forEach(route => {
      ['forward', 'backward'].forEach(direction => {
        const stops = direction === 'forward' ? route.stopsForward : route.stopsBackward;
        const fromIdx = stops.indexOf(fromId);
        const toIdx = stops.indexOf(toId);

        if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
          const stopsCount = toIdx - fromIdx;
          const estMinutes = stopsCount * 2.5 + 2;
          directRoutes.push({
            route,
            direction,
            stopsCount,
            estMinutes: Math.round(estMinutes),
            fromIdx,
            toIdx,
            intermediateStops: stops.slice(fromIdx, toIdx + 1).map(id => STOPS_DATA[id]?.name)
          });
        }
      });
    });

    if (directRoutes.length > 0) {
      directRoutes.sort((a, b) => a.estMinutes - b.estMinutes);
      return `
        <div class="trip-results-card">
          <div class="results-header">
            <h4>Знайдено прямі маршрути (${directRoutes.length}):</h4>
            <span class="badge-success">Без пересадок</span>
          </div>
          <div class="trip-variants-list">
            ${directRoutes.map((variant, i) => `
              <div class="trip-variant-card ${i === 0 ? 'recommended' : ''}">
                ${i === 0 ? '<div class="badge-recommended">🌟 Найшвидший варіант</div>' : ''}
                <div class="variant-top">
                  <div class="variant-route-badge" style="background:${variant.route.color}">
                    ${variant.route.number}
                  </div>
                  <div class="variant-info">
                    <strong>${variant.route.typeLabel} №${variant.route.number}</strong>
                    <span>${variant.route.name}</span>
                  </div>
                  <div class="variant-time">
                    <span class="est-duration">~${variant.estMinutes} хв</span>
                    <span class="est-stops">${variant.stopsCount} зупинок</span>
                  </div>
                </div>
                <div class="variant-details">
                  <div class="detail-step">🟢 <b>Посадка:</b> ${fromStop.name}</div>
                  <div class="detail-stops-list">Проїзд через: ${variant.intermediateStops.slice(1, -1).join(' → ') || 'прямий перегін'}</div>
                  <div class="detail-step">🔴 <b>Висадка:</b> ${toStop.name}</div>
                </div>
                <div class="variant-actions">
                  <button class="btn-show-on-map" onclick="window.ztSelectRoute('${variant.route.id}', '${variant.direction}')">
                    Показати маршрут на карті 🗺️
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Якщо прямих маршрутів нема, пропонуємо варіант з пересадкою в Центрі (Майдан Соборний)
    return `
      <div class="trip-results-card">
        <div class="results-header">
          <h4>Маршрут з пересадкою через Майдан Соборний (Центр):</h4>
          <span class="badge-warning">1 пересадка</span>
        </div>
        <div class="trip-variant-card recommended">
          <div class="variant-top">
            <div class="variant-info">
              <strong>Поїздка з однією пересадкою</strong>
              <span>${fromStop.name} → Майдан Соборний → ${toStop.name}</span>
            </div>
            <div class="variant-time">
              <span class="est-duration">~25-30 хв</span>
              <span class="est-stops">з урахуванням очікування</span>
            </div>
          </div>
          <div class="variant-details">
            <div class="detail-step">1️⃣ <b>Крок 1:</b> Сідайте на будь-який транспорт до зупинки <strong>Майдан Соборний</strong></div>
            <div class="detail-step">2️⃣ <b>Крок 2:</b> Пересядьте на маршрут у бік зупинки <strong>${toStop.name}</strong></div>
          </div>
        </div>
      </div>
    `;
  }

  getFavoritesHtml() {
    const state = store.getState();
    const favRoutes = state.favorites.routes.map(id => ROUTES_DATA.find(r => r.id === id)).filter(Boolean);
    const favStops = state.favorites.stops.map(id => STOPS_DATA[id]).filter(Boolean);

    return `
      <div class="favorites-tab-content">
        <div class="fav-section">
          <h3>⭐ Обрані маршрути</h3>
          ${favRoutes.length > 0 ? `
            <div class="fav-routes-grid">
              ${favRoutes.map(route => `
                <div class="fav-route-item" data-route-id="${route.id}">
                  <span class="route-badge-large" style="background:${route.color}">${route.number}</span>
                  <div class="fav-route-desc">
                    <strong>${route.typeLabel} №${route.number}</strong>
                    <span>${route.name}</span>
                  </div>
                  <button class="btn-remove-fav" data-del-route="${route.id}" title="Видалити">✕</button>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-muted">Ви ще не додали жодного маршруту в обране. Натисніть "В обране" на картці потрібного транспорту.</p>
          `}
        </div>

        <div class="fav-section mt-4">
          <h3>📍 Збережені зупинки</h3>
          ${favStops.length > 0 ? `
            <div class="fav-stops-list">
              ${favStops.map(stop => `
                <div class="fav-stop-item" data-stop-id="${stop.id}">
                  <div>
                    <strong>${stop.name}</strong>
                    <span class="d-block text-muted text-sm">${stop.zone} • ${stop.connections.join(', ')}</span>
                  </div>
                  <div class="fav-actions">
                    <button class="btn-view-stop" data-open-stop="${stop.id}">Табло →</button>
                    <button class="btn-remove-fav" data-del-stop="${stop.id}" title="Видалити">✕</button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-muted">Немає збережених зупинок. Збережіть зупинку для швидкого перегляду часу прибуття.</p>
          `}
        </div>
      </div>
    `;
  }

  getLinksHtml() {
    return `
      <div class="links-tab-content">
        <div class="links-header">
          <h3>🌐 Офіційні транспортні сервіси міста Житомир</h3>
          <p class="text-muted">Швидкий перехід до зовнішніх систем моніторингу транспорту, перевізників та розкладів міста Житомир.</p>
        </div>

        <div class="links-cards-grid">
          ${EXTERNAL_SERVICES.map(service => `
            <a href="${service.url}" target="_blank" rel="noopener noreferrer" class="service-link-card">
              <div class="card-badge-pill">${service.badge}</div>
              <h4>${service.name}</h4>
              <p>${service.desc}</p>
              <span class="link-arrow">Відкрити сервіс ↗</span>
            </a>
          `).join('')}
        </div>

        <div class="links-info-card">
          <h4>💡 Довідкова інформація</h4>
          <p>
            • Гаряча лінія КП «Житомирське ТТУ»: <strong>+38 (0412) 47-07-42</strong><br>
            • Управління транспорту і зв'язку Житомирської міської ради: <strong>(0412) 48-12-08</strong><br>
            • Вартість проїзду: Електротранспорт — 12 ₴ (картка) / Автобус — 15 ₴.
          </p>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Вкладки кабінету
    this.container.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        store.setPassengerTab(tab);
      });
    });

    // Пошук маршрутів
    const searchInput = document.getElementById('route-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.updateFilteredRoutesList();
      });
    }

    const clearBtn = document.getElementById('btn-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchQuery = '';
        if (searchInput) searchInput.value = '';
        this.updateFilteredRoutesList();
      });
    }

    // Фільтри типу транспорту (Всі / Тролейбуси / Автобуси)
    this.container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        this.filterType = e.currentTarget.dataset.type;
        this.render();
      });
    });

    // Клік по чіпу маршруту
    this.container.querySelectorAll('.route-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const routeId = e.currentTarget.dataset.routeId;
        store.setSelectedRoute(routeId);
      });
    });

    // Перемикач напрямку маршруту
    this.container.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dir = e.currentTarget.dataset.dir;
        store.setDirection(dir);
      });
    });

    // Клік по зупинці в таймлайні
    this.container.querySelectorAll('.stop-timeline-node, .btn-peek-eta').forEach(node => {
      node.addEventListener('click', (e) => {
        const stopId = e.currentTarget.dataset.stopId;
        if (stopId) {
          store.setSelectedStop(stopId);
        }
      });
    });

    // Додавання/видалення маршруту в обране
    const favRouteBtn = document.getElementById('btn-toggle-fav-route');
    if (favRouteBtn) {
      favRouteBtn.addEventListener('click', () => {
        const currentRouteId = store.getState().selectedRouteId;
        store.toggleFavoriteRoute(currentRouteId);
      });
    }

    // Планувальник поїздки
    const swapBtn = document.getElementById('btn-swap-planner');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const tmp = this.plannerFrom;
        this.plannerFrom = this.plannerTo;
        this.plannerTo = tmp;
        this.render();
      });
    }

    const runPlannerBtn = document.getElementById('btn-run-planner');
    if (runPlannerBtn) {
      runPlannerBtn.addEventListener('click', () => {
        const fromSel = document.getElementById('planner-from-select');
        const toSel = document.getElementById('planner-to-select');
        if (fromSel && toSel) {
          this.plannerFrom = fromSel.value;
          this.plannerTo = toSel.value;
          const resContainer = document.getElementById('planner-results-container');
          if (resContainer) {
            resContainer.innerHTML = this.calculateTrip(this.plannerFrom, this.plannerTo);
          }
        }
      });
    }

    // Початковий рендер табло зупинки
    this.renderStopBoard();
  }

  updateFilteredRoutesList() {
    const listEl = this.container.querySelector('.routes-horizontal-list');
    if (!listEl) return;

    const state = store.getState();
    const selectedRouteId = state.selectedRouteId;

    const filteredRoutes = ROUTES_DATA.filter(r => {
      const matchSearch = r.number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          r.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchType = this.filterType === 'all' || r.type === this.filterType;
      return matchSearch && matchType;
    });

    if (filteredRoutes.length === 0) {
      listEl.innerHTML = '<div style="padding:10px 15px;font-size:0.8rem;color:#64748b;">За вашим запитом маршрутів не знайдено</div>';
      this.renderStopSearchResults();
      return;
    }

    listEl.innerHTML = filteredRoutes.map(route => `
      <div class="route-chip ${route.id === selectedRouteId ? 'active' : ''}" 
           data-route-id="${route.id}" 
           style="--chip-color: ${route.color}">
        <div class="route-chip-badge">${route.number}</div>
        <div class="route-chip-info">
          <span class="route-chip-type">${route.typeLabel}</span>
          <span class="route-chip-name">${route.name}</span>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.route-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const routeId = e.currentTarget.dataset.routeId;
        store.setSelectedRoute(routeId);
      });
    });
    this.renderStopSearchResults();
  }

  renderStopSearchResults() {
    const resultsEl = document.getElementById('stop-search-results');
    if (!resultsEl) return;
    const query = this.searchQuery.trim().toLocaleLowerCase('uk-UA');
    if (!query) {
      resultsEl.innerHTML = '';
      return;
    }
    const stops = Object.values(STOPS_DATA).filter(stop =>
      `${stop.name} ${stop.zone}`.toLocaleLowerCase('uk-UA').includes(query)
    );
    resultsEl.innerHTML = stops.length
      ? `<div class="stop-search-heading">Зупинки за запитом (${stops.length})</div>${stops.map(stop => `<button class="stop-search-result" data-stop-id="${stop.id}">${stop.name}<span>${stop.zone} · демо-дані</span></button>`).join('')}`
      : '<div class="stop-search-empty">Зупинок за цим запитом не знайдено.</div>';
    resultsEl.querySelectorAll('.stop-search-result').forEach(button => {
      button.addEventListener('click', () => store.setSelectedStop(button.dataset.stopId));
    });
  }

  renderFavorites() {
    if (store.getState().passengerTab === 'favorites') {
      this.render();
    }
  }
}
