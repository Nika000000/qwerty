// Інтерактивна мапа OpenStreetMap / Leaflet для Житомир Рух
import { ZHYTOMYR_CENTER, DEFAULT_ZOOM, STOPS_DATA, ROUTES_DATA } from '../data/routes.js';
import { store } from '../services/store.js';
import { simulator } from '../services/simulator.js';

class MapController {
  constructor() {
    this.map = null;
    this.stopsLayerGroup = null;
    this.vehiclesLayerGroup = null;
    this.routePolylineGroup = null;
    this.vehicleMarkers = new Map(); // id -> L.marker
    this.stopMarkers = new Map(); // id -> L.marker
    this.activePolyline = null;
    this.isInitialized = false;
  }

  init(containerId = 'leaflet-map', attempt = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof L === 'undefined') {
      if (attempt < 10) {
        setTimeout(() => this.init(containerId, attempt + 1), 200);
        return;
      } else {
        container.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;font-family:sans-serif;background:#f8fafc;padding:20px;text-align:center;">
            <div>
              <div style="font-size:2.5rem;margin-bottom:10px;">🗺️</div>
              <strong style="color:#0f172a;font-size:1.1rem;">Інтерактивна схема транспорту Житомира</strong>
              <div style="font-size:0.85rem;color:#64748b;margin-top:6px;">Завантаження бібліотеки карти...</div>
            </div>
          </div>
        `;
        return;
      }
    }

    // Безпечне очищення попереднього стану карти для уникнення помилки "Map container is already initialized"
    if (this.map) {
      try {
        this.map.remove();
      } catch (err) {
        console.warn('Очищення попередньої карти:', err);
      }
      this.map = null;
    }
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }
    container.innerHTML = '';

    try {
      // Створення карти Leaflet, центрованої на Житомирі (Майдан Соборний)
      this.map = L.map(containerId, {
        center: ZHYTOMYR_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false
      });

      // Додаємо шар мапи OpenStreetMap із захистом від помилок мережі
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors | Житомир Рух'
      });
      osmLayer.on('tileerror', (e) => {
        // М'яке ігнорування окремих збоїв мережі для тайлів
      });
      osmLayer.addTo(this.map);

      // Додаємо атрибуцію та зум
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(this.map);
      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      // Створення груп шарів
      this.routePolylineGroup = L.layerGroup().addTo(this.map);
      this.stopsLayerGroup = L.layerGroup().addTo(this.map);
      this.vehiclesLayerGroup = L.layerGroup().addTo(this.map);

      // Початкове малювання зупинок та обраного маршруту
      this.renderStops();
      this.renderRoutePolyline(store.getState().selectedRouteId, store.getState().selectedDirection);
      this.fitRouteBounds(store.getState().selectedRouteId);

      // Виправляємо розміри карти після рендеру
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 250);

      this.isInitialized = true;
      console.log('Житомир Рух: Мапа успішно ініціалізована');
    } catch (e) {
      console.error('Помилка створення карти Leaflet:', e);
      container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;font-family:sans-serif;background:#f8fafc;padding:20px;text-align:center;">
          <div>
            <div style="font-size:2rem;margin-bottom:10px;">🗺️</div>
            <strong style="color:#0f172a;">Схема маршрутів Житомира</strong>
            <p style="font-size:0.85rem;color:#64748b;margin-top:6px;">Списки маршрутів, розклади та кабінети активні.</p>
          </div>
        </div>
      `;
    }

    // Підписка на оновлення стану
    store.subscribe('route_selected', (routeId) => {
      this.renderRoutePolyline(routeId, store.getState().selectedDirection);
      this.fitRouteBounds(routeId);
    });

    store.subscribe('direction_changed', (direction) => {
      this.renderRoutePolyline(store.getState().selectedRouteId, direction);
    });

    store.subscribe('stop_selected', (stopId) => {
      this.focusStop(stopId);
    });

    store.subscribe('vehicles_updated', (vehicles) => {
      this.updateVehicleMarkers(vehicles);
    });

    store.subscribe('dispatcher_filters_changed', () => {
      this.updateVehicleMarkers(store.getState().vehicles);
    });

    this.isInitialized = true;
    console.log('Житомир Рух: Мапа успішно ініціалізована');
  }

  renderStops() {
    if (!this.map || !this.stopsLayerGroup) return;
    this.stopsLayerGroup.clearLayers();
    this.stopMarkers.clear();

    const currentRouteId = store.getState().selectedRouteId;
    const currentRoute = ROUTES_DATA.find(r => r.id === currentRouteId);
    const routeStopIds = currentRoute ? [...currentRoute.stopsForward, ...currentRoute.stopsBackward] : [];

    Object.values(STOPS_DATA).forEach(stop => {
      const isRouteStop = routeStopIds.includes(stop.id);

      // Кастомна іконка зупинки
      const stopIcon = L.divIcon({
        className: 'custom-stop-marker-wrapper',
        html: `
          <div class="custom-stop-marker ${isRouteStop ? 'active-route-stop' : ''}" data-stop-id="${stop.id}">
            <div class="stop-dot"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon });

      marker.on('click', () => {
        store.setSelectedStop(stop.id);
        this.openStopPopup(stop, marker);
      });

      marker.addTo(this.stopsLayerGroup);
      this.stopMarkers.set(stop.id, marker);
    });
  }

  openStopPopup(stop, marker) {
    const arrivals = simulator.getArrivalsForStop(stop.id);
    const arrivalsHtml = arrivals.slice(0, 4).map(arr => `
      <div class="popup-arrival-row">
        <span class="route-badge-mini" style="background:${arr.color}">${arr.routeNumber}</span>
        <span class="popup-route-dest">${arr.destination}</span>
        <span class="popup-eta ${arr.etaMinutes <= 2 ? 'imminent' : ''}">${arr.etaMinutes} хв</span>
      </div>
    `).join('') || '<div class="popup-empty">Найближчих рейсів не виявлено</div>';

    const content = `
      <div class="stop-leaflet-popup">
        <div class="popup-header">
          <span class="popup-zone">${stop.zone}</span>
          <h4 class="popup-title">${stop.name}</h4>
        </div>
        <div class="popup-arrivals-title">Очікуваний транспорт:</div>
        <div class="popup-arrivals-list">
          ${arrivalsHtml}
        </div>
        <div class="popup-footer">
          <button class="btn-popup-select" onclick="window.ztSelectStop('${stop.id}')">Відкрити табло зупинки →</button>
        </div>
      </div>
    `;

    marker.bindPopup(content, { maxWidth: 300, className: 'zt-map-popup' }).openPopup();
  }

  focusStop(stopId) {
    const stop = STOPS_DATA[stopId];
    if (stop && this.map) {
      this.map.flyTo([stop.lat, stop.lng], 15, { duration: 1.2 });
      const marker = this.stopMarkers.get(stopId);
      if (marker) {
        this.openStopPopup(stop, marker);
      }
    }
  }

  renderRoutePolyline(routeId, direction) {
    if (!this.map || !this.routePolylineGroup) return;
    this.routePolylineGroup.clearLayers();
    const route = ROUTES_DATA.find(r => r.id === routeId);
    if (!route) return;

    const stopIds = direction === 'forward' ? route.stopsForward : route.stopsBackward;
    const coords = stopIds.map(id => {
      const s = STOPS_DATA[id];
      return s ? [s.lat, s.lng] : null;
    }).filter(Boolean);

    if (coords.length > 1) {
      // Підсвітка маршруту
      const glowLine = L.polyline(coords, {
        color: route.color,
        weight: 8,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(this.routePolylineGroup);

      // Основна лінія
      this.activePolyline = L.polyline(coords, {
        color: route.color,
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        dashArray: null
      }).addTo(this.routePolylineGroup);
    }

    // Оновлюємо підсвітку зупинок
    this.renderStops();
  }

  fitRouteBounds(routeId) {
    const route = ROUTES_DATA.find(r => r.id === routeId);
    if (!route || !this.map) return;

    const stopIds = route.stopsForward;
    const coords = stopIds.map(id => {
      const s = STOPS_DATA[id];
      return s ? [s.lat, s.lng] : null;
    }).filter(Boolean);

    if (coords.length > 1) {
      this.map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], maxZoom: 15 });
    }
  }

  updateVehicleMarkers(vehicles) {
    if (!this.map || !this.vehiclesLayerGroup) return;

    const state = store.getState();
    const role = state.role;
    const filters = state.dispatcherFilters;
    const selectedRouteId = state.selectedRouteId;

    // Фільтрація відображення ТЗ залежно від ролі:
    const visibleVehicles = vehicles.filter(v => {
      const route = ROUTES_DATA.find(r => r.id === v.routeId);
      if (!route) return false;

      // У кабінеті пасажира фокусуємося або на вибраному маршруті, або показуємо весь транспорт
      if (role === 'passenger' && selectedRouteId && selectedRouteId !== 'all') {
        if (v.routeId !== selectedRouteId) return false;
      }

      // У панелі диспетчера застосовуємо його фільтри
      if (role === 'dispatcher') {
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
      }

      return true;
    });

    const currentIds = new Set(visibleVehicles.map(v => v.id));

    // Видаляємо маркери, які більше не активні / відфільтровані
    this.vehicleMarkers.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        this.vehiclesLayerGroup.removeLayer(marker);
        this.vehicleMarkers.delete(id);
      }
    });

    // Створюємо або оновлюємо маркери
    visibleVehicles.forEach(vehicle => {
      const route = ROUTES_DATA.find(r => r.id === vehicle.routeId);
      if (!route || !vehicle.lat || !vehicle.lng) return;

      const isTrolley = route.type === 'trolleybus';
      const statusClass = vehicle.status === 'delayed' ? 'status-delayed' :
                          vehicle.status === 'ahead' ? 'status-ahead' : 'status-ontime';

      const htmlContent = `
        <div class="vehicle-marker-box ${isTrolley ? 'is-trolley' : 'is-bus'} ${statusClass}" style="--route-color: ${route.color}">
          <div class="vehicle-bearing-arrow" style="transform: rotate(${vehicle.bearing || 0}deg)">▲</div>
          <span class="vehicle-badge-num">${route.number}</span>
          <span class="vehicle-sub-board">#${vehicle.boardNumber}</span>
        </div>
      `;

      if (this.vehicleMarkers.has(vehicle.id)) {
        // Оновлюємо положення і поворот
        const marker = this.vehicleMarkers.get(vehicle.id);
        marker.setLatLng([vehicle.lat, vehicle.lng]);
        const el = marker.getElement();
        if (el) {
          const arrow = el.querySelector('.vehicle-bearing-arrow');
          if (arrow) arrow.style.transform = `rotate(${vehicle.bearing || 0}deg)`;
        }
      } else {
        const icon = L.divIcon({
          className: 'custom-vehicle-marker-wrapper',
          html: htmlContent,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([vehicle.lat, vehicle.lng], { icon, zIndexOffset: 1000 });

        marker.on('click', () => {
          store.setSelectedVehicle(vehicle.id);
          this.openVehiclePopup(vehicle, route, marker);
        });

        marker.addTo(this.vehiclesLayerGroup);
        this.vehicleMarkers.set(vehicle.id, marker);
      }
    });
  }

  openVehiclePopup(vehicle, route, marker) {
    const statusText = vehicle.status === 'delayed' ? `<span class="badge-delayed">Запізнення +${vehicle.delayMinutes} хв</span>` :
                       vehicle.status === 'ahead' ? `<span class="badge-ahead">Випередження ${vehicle.delayMinutes} хв</span>` :
                       `<span class="badge-ontime">В графіку</span>`;

    const content = `
      <div class="vehicle-leaflet-popup">
        <div class="vpopup-header" style="background:${route.color}">
          <span class="vpopup-type">${route.typeLabel} №${route.number}</span>
          <span class="vpopup-board">Борт №${vehicle.boardNumber}</span>
        </div>
        <div class="vpopup-body">
          <div class="vpopup-route-name">${route.name}</div>
          <div class="vpopup-row"><strong>Водій:</strong> <span>${vehicle.driverName}</span></div>
          <div class="vpopup-row"><strong>Модель:</strong> <span>${vehicle.model}</span></div>
          <div class="vpopup-row"><strong>Швидкість:</strong> <span>${vehicle.speedKmH} км/год</span></div>
          <div class="vpopup-row"><strong>Графік:</strong> <span>${statusText}</span></div>
          <div class="vpopup-row"><strong>Наступна зупинка:</strong> <span>${vehicle.nextStop || 'За розкладом'}</span></div>
          <div class="vpopup-row"><strong>Демо-координати:</strong> <span>${vehicle.lat?.toFixed(4)}, ${vehicle.lng?.toFixed(4)}</span></div>
        </div>
      </div>
    `;

    marker.bindPopup(content, { maxWidth: 320, className: 'zt-map-popup' }).openPopup();
  }

  resetView() {
    if (this.map) {
      this.map.flyTo(ZHYTOMYR_CENTER, DEFAULT_ZOOM, { duration: 1 });
    }
  }

  locateUser() {
    if (!this.map) return;
    if (!navigator.geolocation) {
      window.alert('Браузер не підтримує визначення місцезнаходження.');
      return;
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const userPos = [coords.latitude, coords.longitude];
      this.map.flyTo(userPos, 16, { duration: 1.2 });
      if (this.userMarker) this.map.removeLayer(this.userMarker);

      const userIcon = L.divIcon({
        className: 'user-loc-wrapper',
        html: `<div class="user-loc-pulse"><div class="user-loc-core"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      this.userMarker = L.marker(userPos, { icon: userIcon }).addTo(this.map)
        .bindPopup('<b>Ваше поточне місцезнаходження</b>')
        .openPopup();
    }, (error) => {
      const messages = {
        1: 'Дозвіл на визначення місцезнаходження не надано.',
        2: 'Не вдалося визначити місцезнаходження.',
        3: 'Час очікування визначення місцезнаходження минув.'
      };
      window.alert(`${messages[error.code] || 'Помилка визначення місцезнаходження.'} Карта залишилася в центрі Житомира.`);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  }
}

export const mapController = new MapController();
