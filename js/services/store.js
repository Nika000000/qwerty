// Менеджер глобального стану додатку "Житомир Рух"
import { INITIAL_VEHICLES, ROUTES_DATA, STOPS_DATA } from '../data/routes.js';

class StateStore {
  constructor() {
    this.listeners = {};
    
    // Завантаження збережених даних з localStorage
    const savedFavorites = this.loadFromStorage('zt_favorites', { routes: ['tr-2', 'bus-23'], stops: ['s_sob', 's_vokzal'] });
    const savedDriver = this.loadFromStorage('zt_driver', {
      isLoggedIn: true,
      driverId: 'DRV-108',
      driverName: 'Ковальчук Олексій В.',
      badgeNumber: '482',
      depot: 'Тролейбусне депо №1 (вул. Ольжича)',
      routeId: 'tr-2',
      boardNumber: '204',
      model: 'БКМ 321 (Низькопідлоговий)',
      shiftStarted: true,
      shiftStartTime: '06:30',
      currentStopIndex: 2,
      delayMinutes: 2, // +2 хв
      speed: 32
    });

    this.state = {
      role: 'passenger', // 'passenger' | 'driver' | 'dispatcher'
      passengerTab: 'search', // 'search' | 'schedule' | 'planner' | 'favorites' | 'links'
      selectedRouteId: 'tr-2',
      selectedDirection: 'forward', // 'forward' | 'backward'
      selectedStopId: 's_sob',
      selectedVehicleId: null,
      favorites: savedFavorites,
      driver: savedDriver,
      dispatcherFilters: {
        search: '',
        routeId: 'all',
        type: 'all',
        status: 'all',
        zone: 'all'
      },
      vehicles: [...INITIAL_VEHICLES],
      alerts: [
        {
          id: 'alt-1',
          time: '19:35',
          level: 'warning',
          title: 'Уповільнений рух на вул. Київська',
          text: 'Затор від ЦУМу до майдану Перемоги. Можливі затримки рейсів №1, 2, 23 до 4 хвилин.',
          route: 'Тр 1, 2'
        },
        {
          id: 'alt-2',
          time: '19:10',
          level: 'info',
          title: 'Плановий випуск ТТУ на вечірню зміну',
          text: 'Всі 24 тролейбуси працюють за графіком. Останні рейси з кінцевих після 22:15.',
          route: 'Мережа ТТУ'
        }
      ]
    };
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }

  getState() {
    return this.state;
  }

  setRole(role) {
    this.state.role = role;
    this.emit('role_changed', role);
  }

  setPassengerTab(tab) {
    this.state.passengerTab = tab;
    this.emit('tab_changed', tab);
  }

  setSelectedRoute(routeId) {
    this.state.selectedRouteId = routeId;
    this.emit('route_selected', routeId);
  }

  setDirection(direction) {
    this.state.selectedDirection = direction;
    this.emit('direction_changed', direction);
  }

  setSelectedStop(stopId) {
    this.state.selectedStopId = stopId;
    this.emit('stop_selected', stopId);
  }

  setSelectedVehicle(vehicleId) {
    this.state.selectedVehicleId = vehicleId;
    this.emit('vehicle_selected', vehicleId);
  }

  toggleFavoriteRoute(routeId) {
    const list = this.state.favorites.routes;
    const index = list.indexOf(routeId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(routeId);
    }
    this.saveToStorage('zt_favorites', this.state.favorites);
    this.emit('favorites_updated', this.state.favorites);
  }

  toggleFavoriteStop(stopId) {
    const list = this.state.favorites.stops;
    const index = list.indexOf(stopId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(stopId);
    }
    this.saveToStorage('zt_favorites', this.state.favorites);
    this.emit('favorites_updated', this.state.favorites);
  }

  updateDriver(updates) {
    this.state.driver = { ...this.state.driver, ...updates };
    this.saveToStorage('zt_driver', this.state.driver);
    this.emit('driver_updated', this.state.driver);
  }

  updateDispatcherFilters(filters) {
    this.state.dispatcherFilters = { ...this.state.dispatcherFilters, ...filters };
    this.emit('dispatcher_filters_changed', this.state.dispatcherFilters);
  }

  updateVehicles(vehicles) {
    this.state.vehicles = vehicles;
    this.emit('vehicles_updated', vehicles);
  }

  addAlert(alert) {
    this.state.alerts.unshift({
      id: 'alt-' + Date.now(),
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      ...alert
    });
    this.emit('alerts_updated', this.state.alerts);
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const store = new StateStore();
