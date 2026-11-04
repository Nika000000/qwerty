// Головний скрипт ініціалізації «Житомир Рух»
import { store } from './services/store.js';
import { simulator } from './services/simulator.js';
import { mapController } from './components/map.js';
import { PassengerComponent } from './components/passenger.js';
import { DriverComponent } from './components/driver.js';
import { DispatcherComponent } from './components/dispatcher.js';
import { ROUTES_DATA, STOPS_DATA } from './data/routes.js';

class ZhytomyrRukhApp {
  constructor() {
    this.passengerComp = null;
    this.driverComp = null;
    this.dispatcherComp = null;
  }

  init() {
    console.log('Ініціалізація додатку «Житомир Рух» (версія 2.0)...');

    // 1. Прив'язка навігації 3-х сторінок (Пасажир / Водій / Диспетчер)
    this.bindRoleSwitcher();

    // 2. Ініціалізація компонентів для кожної сторінки
    try {
      this.passengerComp = new PassengerComponent('passenger-container');
      this.passengerComp.init();
    } catch (e) {
      console.error('Помилка ініціалізації PassengerComponent:', e);
    }

    try {
      this.driverComp = new DriverComponent('driver-container');
      this.driverComp.init();
    } catch (e) {
      console.error('Помилка ініціалізації DriverComponent:', e);
    }

    try {
      this.dispatcherComp = new DispatcherComponent('dispatcher-container');
      this.dispatcherComp.init();
    } catch (e) {
      console.error('Помилка ініціалізації DispatcherComponent:', e);
    }

    // 3. Ініціалізація єдиної автономної карти Leaflet
    try {
      mapController.init('leaflet-map');
    } catch (e) {
      console.warn('Помилка старту мапи:', e);
    }

    // 4. Визначаємо початкову сторінку за хешем у URL або роллю
    const hash = window.location.hash.replace('#', '');
    const validPages = ['passenger', 'driver', 'dispatcher'];
    const initialPage = validPages.includes(hash) ? hash : (document.body.dataset.page || 'passenger');
    this.switchRole(initialPage);

    // Слухаємо зміну хешу в URL (кнопки вперед/назад у браузері)
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      if (validPages.includes(newHash)) {
        this.switchRole(newHash);
      }
    });

    // 5. Запуск фонового симулятора руху
    try {
      simulator.start();
    } catch (e) {
      console.warn('Помилка старту симулятора:', e);
    }

    // 6. Цифровий годинник у шапці
    const updateClock = () => {
      const clockEl = document.getElementById('header-clock');
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString('uk-UA');
      }
    };
    setInterval(updateClock, 1000);
    updateClock();

    // 7. Кнопки плаваючого тулбара мапи
    this.bindMapControls();

    // 8. Глобальні методи зворотного виклику для попапів та дій
    this.exposeGlobalHelpers();

    // 9. Слідкування за оновленнями парку для лічильника в шапці
    store.subscribe('vehicles_updated', (vehicles) => {
      const counterEl = document.getElementById('header-live-counter');
      if (counterEl) {
        counterEl.textContent = `${vehicles.length} машин у демо-моделі`;
      }
    });
    const counterEl = document.getElementById('header-live-counter');
    if (counterEl) counterEl.textContent = `${store.getState().vehicles.length} машин у демо-моделі`;

    console.log('«Житомир Рух» готовий до роботи!');
  }

  bindRoleSwitcher() {
    const roleButtons = document.querySelectorAll('.role-nav-link, .role-btn');
    roleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetRole = e.currentTarget.dataset.role;
        if (targetRole) {
          this.switchRole(targetRole);
        }
      });
    });
  }

  switchRole(role) {
    store.setRole(role);

    // Оновлення активної кнопки в шапці
    document.querySelectorAll('.role-nav-link, .role-btn').forEach(btn => {
      const isTarget = btn.dataset.role === role;
      btn.classList.toggle('active', isTarget);
      btn.classList.toggle('driver-active', role === 'driver' && isTarget);
      btn.classList.toggle('dispatcher-active', role === 'dispatcher' && isTarget);
    });

    // Перемикання сторінок усередині сайту
    document.querySelectorAll('.page-view').forEach(p => {
      p.classList.remove('active-page');
    });

    const targetPage = document.getElementById(`page-${role}`);
    if (targetPage) {
      targetPage.classList.add('active-page');

      // Переміщуємо мапу в монтажну точку активної сторінки
      const mountPoint = targetPage.querySelector('.map-mount-point');
      const mapWrapper = document.getElementById('shared-map-wrapper');
      if (mountPoint && mapWrapper && mapWrapper.parentElement !== mountPoint) {
        mountPoint.appendChild(mapWrapper);
      }
    }

    // Синхронізація хешу в адресному рядку браузера
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      if (window.location.hash !== `#${role}`) {
        window.history.replaceState(null, '', `#${role}`);
      }
    }

    // Оновлення маркерів мапи для обраної ролі
    mapController.updateVehicleMarkers(store.getState().vehicles);

    // Фокусування карти залежно від сторінки
    if (role === 'driver') {
      const driver = store.getState().driver;
      if (driver && driver.routeId) {
        mapController.renderRoutePolyline(driver.routeId, 'forward');
        mapController.fitRouteBounds(driver.routeId);
      }
    } else if (role === 'passenger') {
      const selectedRouteId = store.getState().selectedRouteId;
      mapController.renderRoutePolyline(selectedRouteId, store.getState().selectedDirection);
    } else if (role === 'dispatcher') {
      mapController.resetView();
    }

    // Перерахунок розміру мапи
    setTimeout(() => {
      if (mapController.map) {
        mapController.map.invalidateSize({ pan: false });
        if (role === 'driver') {
          const driver = store.getState().driver;
          if (driver?.routeId) mapController.fitRouteBounds(driver.routeId);
        } else if (role === 'passenger') {
          mapController.fitRouteBounds(store.getState().selectedRouteId);
        }
      }
    }, 180);
  }

  bindMapControls() {
    const btnReset = document.getElementById('btn-map-center-city');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        mapController.resetView();
      });
    }

    const btnLocate = document.getElementById('btn-map-my-location');
    if (btnLocate) {
      btnLocate.addEventListener('click', () => {
        mapController.locateUser();
      });
    }
  }

  exposeGlobalHelpers() {
    // Відкриття табло зупинки з попапу карти
    window.ztSelectStop = (stopId) => {
      store.setSelectedStop(stopId);
      store.setRole('passenger');
      store.setPassengerTab('search');
      this.switchRole('passenger');
      // Скрол до табло
      setTimeout(() => {
        const board = document.getElementById('stop-board-container');
        if (board) board.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    // Вибір маршруту з планувальника або списку
    window.ztSelectRoute = (routeId, direction = 'forward') => {
      store.setSelectedRoute(routeId);
      store.setDirection(direction);
      store.setRole('passenger');
      store.setPassengerTab('search');
      this.switchRole('passenger');
    };

    // Відправка повідомлення водію з диспетчерської
    window.ztMsgDriver = (boardNumber, driverName) => {
      const msg = prompt(`Надіслати оперативне повідомлення водію (${driverName}, Борт №${boardNumber}):`, 'Зменшити інтервал на 2 хвилини');
      if (msg) {
        alert(`Демо: повідомлення підготовлено для борта №${boardNumber}. Воно не було надіслане водієві.`);
      }
    };

    // Коригування графіка ТЗ диспетчером
    window.ztFixSchedule = (boardNumber) => {
      const vehicles = store.getState().vehicles.map(v => {
        if (v.boardNumber === boardNumber) {
          return { ...v, delayMinutes: 0, status: 'on_time' };
        }
        return v;
      });
      store.updateVehicles(vehicles);
      alert(`Демо: локальний статус борта №${boardNumber} скинуто до «в графіку». Зовнішня система не оновлювалася.`);
    };

    // Фокусування на конкретному ТЗ на мапі
    window.ztFocusVehicle = (vehicleId) => {
      const vehicle = store.getState().vehicles.find(v => v.id === vehicleId);
      if (vehicle && vehicle.lat && vehicle.lng && mapController.map) {
        mapController.map.flyTo([vehicle.lat, vehicle.lng], 16, { duration: 1 });
        const marker = mapController.vehicleMarkers.get(vehicleId);
        if (marker) {
          const route = ROUTES_DATA.find(r => r.id === vehicle.routeId);
          mapController.openVehiclePopup(vehicle, route, marker);
        }
      }
    };
  }
}

// Запуск після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  if (window.__ztApp) return;
  const app = new ZhytomyrRukhApp();
  app.init();
  window.__ztApp = app;
});
