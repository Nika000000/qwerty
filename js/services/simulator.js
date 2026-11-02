// Симулятор GPS руху громадського транспорту м. Житомир
import { ROUTES_DATA, STOPS_DATA } from '../data/routes.js';
import { store } from './store.js';

class TransitSimulator {
  constructor() {
    this.timer = null;
    this.intervalMs = 2000; // оновлення кожні 2 секунди
    this.isRunning = false;
    this.simulationSpeed = 1; // множник швидкості (1x, 2x, 5x)
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => this.tick(), this.intervalMs);
    console.log('Житомир Рух: Симулятор GPS запущено');
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  setSimulationSpeed(speedMultiplier) {
    this.simulationSpeed = speedMultiplier;
  }

  // Отримати геокоординати на маршруті за відносним прогресом (0.0 ... 1.0)
  getCoordinatesAtProgress(route, direction, progress) {
    const stopIds = direction === 'forward' ? route.stopsForward : route.stopsBackward;
    if (!stopIds || stopIds.length < 2) return null;

    const stops = stopIds.map(id => STOPS_DATA[id]).filter(Boolean);
    if (stops.length < 2) return null;

    const totalSegments = stops.length - 1;
    const scaledProgress = Math.min(Math.max(progress, 0), 1) * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentFactor = scaledProgress - segmentIndex;

    const p1 = stops[segmentIndex];
    const p2 = stops[segmentIndex + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * segmentFactor;
    const lng = p1.lng + (p2.lng - p1.lng) * segmentFactor;

    // Розрахунок кута повороту (bearing)
    const y = Math.sin(p2.lng - p1.lng) * Math.cos(p2.lat);
    const x = Math.cos(p1.lat) * Math.sin(p2.lat) -
              Math.sin(p1.lat) * Math.cos(p2.lat) * Math.cos(p2.lng - p1.lng);
    const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

    return {
      lat,
      lng,
      bearing,
      currentStopIndex: segmentIndex,
      nextStopIndex: Math.min(segmentIndex + 1, stops.length - 1),
      currentStop: p1,
      nextStop: p2,
      totalStops: stops.length
    };
  }

  tick() {
    const state = store.getState();
    const updatedVehicles = state.vehicles.map(vehicle => {
      const route = ROUTES_DATA.find(r => r.id === vehicle.routeId);
      if (!route) return vehicle;

      // Приріст прогресу: при швидкості 30 км/год ~ 0.008 за крок
      const speedKmH = vehicle.speedKmH || 30;
      const baseStep = 0.008 * (speedKmH / 30) * this.simulationSpeed;
      
      let newProgress = (vehicle.progress || 0) + baseStep;
      let newDirection = vehicle.direction;

      // Розворот на кінцевій зупинці
      if (newProgress >= 1) {
        newProgress = 0;
        newDirection = vehicle.direction === 'forward' ? 'backward' : 'forward';
      }

      // Невеликі випадкові коливання швидкості
      const randomSpeedOffset = (Math.random() - 0.5) * 4;
      const currentSpeed = Math.round(Math.max(15, Math.min(50, speedKmH + randomSpeedOffset)));

      const loc = this.getCoordinatesAtProgress(route, newDirection, newProgress);

      // Визначаємо затримку / відхилення
      let delayMinutes = vehicle.delayMinutes;
      if (Math.random() < 0.04) {
        // Рідкісна зміна графіка
        const delta = Math.floor((Math.random() - 0.48) * 3);
        delayMinutes = Math.max(-3, Math.min(8, delayMinutes + delta));
      }

      let status = 'on_time';
      if (delayMinutes >= 3) status = 'delayed';
      else if (delayMinutes <= -2) status = 'ahead';

      return {
        ...vehicle,
        progress: newProgress,
        direction: newDirection,
        speedKmH: currentSpeed,
        lat: loc ? loc.lat : 50.2546,
        lng: loc ? loc.lng : 28.6587,
        bearing: loc ? loc.bearing : 0,
        currentStop: loc ? loc.currentStop.name : '',
        nextStop: loc ? loc.nextStop.name : '',
        nextStopId: loc ? loc.nextStop.id : '',
        delayMinutes,
        status,
        lastPing: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    });

    store.updateVehicles(updatedVehicles);

    // Якщо водій активний і керує обраним ТЗ, синхронізуємо дані водія
    const activeDriver = state.driver;
    if (activeDriver && activeDriver.shiftStarted) {
      const myVehicle = updatedVehicles.find(v => v.boardNumber === activeDriver.boardNumber);
      if (myVehicle) {
        store.updateDriver({
          speed: myVehicle.speedKmH,
          delayMinutes: myVehicle.delayMinutes,
          currentStopName: myVehicle.currentStop,
          nextStopName: myVehicle.nextStop,
          nextStopId: myVehicle.nextStopId,
          lat: myVehicle.lat,
          lng: myVehicle.lng
        });
      }
    }
  }

  // Розрахунок прогнозного часу прибуття (ETA) транспорту на конкретну зупинку
  getArrivalsForStop(stopId) {
    const state = store.getState();
    const stop = STOPS_DATA[stopId];
    if (!stop) return [];

    const arrivals = [];

    // Шукаємо всі маршрути, що проходять через зупинку
    ROUTES_DATA.forEach(route => {
      ['forward', 'backward'].forEach(direction => {
        const stopsList = direction === 'forward' ? route.stopsForward : route.stopsBackward;
        const targetIndex = stopsList.indexOf(stopId);

        if (targetIndex !== -1) {
          // Шукаємо активні ТЗ на цьому маршруті і напрямку
          const routeVehicles = state.vehicles.filter(
            v => v.routeId === route.id && v.direction === direction
          );

          routeVehicles.forEach(v => {
            const totalStops = stopsList.length;
            const currentVehicleIndex = Math.floor(v.progress * (totalStops - 1));

            // Якщо ТЗ ще не проїхало цю зупинку
            if (currentVehicleIndex <= targetIndex) {
              const stopsAway = targetIndex - currentVehicleIndex;
              // Орієнтовний час: 2 хвилини на зупинку + затримка ТЗ
              let etaMinutes = Math.max(1, Math.round(stopsAway * 2.2 + (v.delayMinutes > 0 ? v.delayMinutes : 0)));
              
              if (stopsAway === 0) {
                etaMinutes = 1; // під'їжджає
              }

              arrivals.push({
                routeId: route.id,
                routeNumber: route.number,
                routeName: route.name,
                routeType: route.type,
                typeLabel: route.typeLabel,
                color: route.color,
                vehicleId: v.id,
                boardNumber: v.boardNumber,
                model: v.model,
                etaMinutes,
                stopsAway,
                status: v.status,
                delayMinutes: v.delayMinutes,
                destination: STOPS_DATA[stopsList[stopsList.length - 1]]?.name || 'Кінцева',
                lowFloor: v.model.includes('Богдан Т701') || v.model.includes('БКМ') || v.model.includes('МАЗ')
              });
            }
          });

          // Якщо живих ТЗ на цій дистанції нема, додаємо прогноз за регулярним розкладом
          const existingForRoute = arrivals.filter(a => a.routeId === route.id);
          if (existingForRoute.length === 0) {
            arrivals.push({
              routeId: route.id,
              routeNumber: route.number,
              routeName: route.name,
              routeType: route.type,
              typeLabel: route.typeLabel,
              color: route.color,
              vehicleId: null,
              boardNumber: 'Графіковий',
              model: 'За розкладом руху',
              etaMinutes: 10,
              stopsAway: 4,
              status: 'on_time',
              delayMinutes: 0,
              destination: STOPS_DATA[stopsList[stopsList.length - 1]]?.name || 'Кінцева',
              lowFloor: true,
              isScheduled: true
            });
          }
        }
      });
    });

    // Сортуємо за часом прибуття
    return arrivals.sort((a, b) => a.etaMinutes - b.etaMinutes);
  }
}

export const simulator = new TransitSimulator();
