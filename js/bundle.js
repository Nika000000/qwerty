/**
 * ЖИТОМИР РУХ — Універсальний клієнтський бандл
 * Працює як через локальний/віддалений веб-сервер, так і при відкритті файлу напряму (file:///)
 */
(function() {
  'use strict';

  // Спільний набір піктограм
  // Єдиний набір простих контурних піктограм для інтерфейсу.
const ZT_ICON_PATHS = {
  bus: '<path d="M8 6v6m8-6v6M5 18h14l1-8a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3l1 8Z"/><path d="M5 14h14M7 18v2m10-2v2M7 15h.01M17 15h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
  driver: '<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0M9 12l3 2 3-2"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  landmark: '<path d="m3 10 9-7 9 7M5 10v10m4-10v10m6-10v10m4-10v10M3 20h18"/>',
  locate: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/>',
  route: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h5a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  swap: '<path d="m16 3 4 4-4 4M4 7h16M8 21l-4-4 4-4m12 4H4"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  trolley: '<path d="M5 17h14l1-7H4l1 7Zm2-7 2-5m8 5-2-5M7 20h.01M17 20h.01"/><path d="M10 5 8 3m6 2 2-2"/>',
  shelter: '<path d="m3 11 9-8 9 8M5 10v10h14V10m-9 10v-6h4v6"/>',
  accessibility: '<circle cx="12" cy="4" r="2"/><path d="m10 8 2 4 5 1m-7-5-3 5 2 3h5l2 4m-7-7-3 4"/>',
  warning: '<path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>',
  alert: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M12 5v14m-7-7h14"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  trash: '<path d="M3 6h18m-2 0-1 14H6L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
  car: '<path d="m5 11 1.5-5h11L19 11m1 0 1 2v5h-2v-2H5v2H3v-5l1-2h16Zm-13 2h.01M17 13h.01"/>',
  tools: '<path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L15 12l-3-3 2.7-2.7Z"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>'
};

function ztIcon(name, size = 18, extraClass = '') {
  const paths = ZT_ICON_PATHS[name] || ZT_ICON_PATHS.info;
  return `<svg class="ui-icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}


  // 1. ДАНІ МАРШРУТІВ ТА ЗУПИНОК
  // Дані громадського транспорту міста Житомир
// Маршрути, зупинки, геокоординати, розклади руху
const ZHYTOMYR_CENTER = [50.2546, 28.6587]; // Майдан Соборний
const DEFAULT_ZOOM = 13;
const STOPS_DATA = {
  's_sob': {
    id: 's_sob',
    name: 'Майдан Соборний',
    lat: 50.2546,
    lng: 28.6587,
    zone: 'Центр',
    connections: ['Тр 1', 'Тр 2', 'Тр 3', 'Тр 15А', 'Авт 10', 'Авт 19', 'Авт 23', 'Авт 58'],
    hasShelter: true,
    hasDisplay: true
  },
  's_per': {
    id: 's_per',
    name: 'Майдан Перемоги',
    lat: 50.2570,
    lng: 28.6520,
    zone: 'Центр',
    connections: ['Тр 2', 'Тр 3', 'Авт 10', 'Авт 23'],
    hasShelter: true,
    hasDisplay: true
  },
  's_tsum': {
    id: 's_tsum',
    name: 'ЦУМ / Театральна',
    lat: 50.2582,
    lng: 28.6655,
    zone: 'Центр',
    connections: ['Тр 1', 'Тр 2', 'Тр 15А', 'Авт 10', 'Авт 23'],
    hasShelter: true,
    hasDisplay: true
  },
  's_pokrovska_sinniy': {
    id: 's_pokrovska_sinniy',
    name: 'вул. Покровська (Сінний ринок)',
    lat: 50.2680,
    lng: 28.6605,
    zone: 'Покровська',
    connections: ['Авт 10'],
    hasShelter: true,
    hasDisplay: false
  },
  's_global': {
    id: 's_global',
    name: 'ТРЦ "Глобал UA" (вул. Київська)',
    lat: 50.2631,
    lng: 28.6820,
    zone: 'Київська',
    connections: ['Тр 1', 'Тр 2', 'Тр 15А', 'Авт 10', 'Авт 19', 'Авт 23'],
    hasShelter: true,
    hasDisplay: true
  },
  's_vokzal': {
    id: 's_vokzal',
    name: 'Залізничний вокзал',
    lat: 50.2647,
    lng: 28.6924,
    zone: 'Вокзал',
    connections: ['Тр 1', 'Тр 2', 'Тр 15А', 'Авт 23'],
    hasShelter: true,
    hasDisplay: true
  },
  's_avtovokzal': {
    id: 's_avtovokzal',
    name: 'Автовокзал (вул. Київська, 93)',
    lat: 50.2662,
    lng: 28.6968,
    zone: 'Вокзал',
    connections: ['Тр 1', 'Тр 2', 'Авт 23'],
    hasShelter: true,
    hasDisplay: false
  },
  's_myru_market': {
    id: 's_myru_market',
    name: 'просп. Миру (Ринок "Хмільники")',
    lat: 50.2745,
    lng: 28.6210,
    zone: 'Богунія',
    connections: ['Тр 2', 'Тр 3', 'Авт 23'],
    hasShelter: true,
    hasDisplay: true
  },
  's_bohunia_term': {
    id: 's_bohunia_term',
    name: 'м-н Богунія (Ялинка)',
    lat: 50.2798,
    lng: 28.6075,
    zone: 'Богунія',
    connections: ['Тр 2', 'Тр 3', 'Авт 23'],
    hasShelter: true,
    hasDisplay: true
  },
  's_politekh': {
    id: 's_politekh',
    name: 'Державний університет "Житомирська політехніка"',
    lat: 50.2460,
    lng: 28.6340,
    zone: 'Корбутівка',
    connections: ['Тр 15А', 'Авт 19'],
    hasShelter: true,
    hasDisplay: true
  },
  's_hydropark': {
    id: 's_hydropark',
    name: 'Гідропарк (Корбутівка)',
    lat: 50.2395,
    lng: 28.6140,
    zone: 'Корбутівка',
    connections: ['Тр 15А', 'Авт 19'],
    hasShelter: true,
    hasDisplay: false
  },
  's_poliova_vitruka': {
    id: 's_poliova_vitruka',
    name: 'пл. Польова (вул. Вітрука)',
    lat: 50.2452,
    lng: 28.7060,
    zone: 'Польова',
    connections: ['Тр 1', 'Авт 23', 'Авт 58'],
    hasShelter: true,
    hasDisplay: true
  },
  's_smolyanka': {
    id: 's_smolyanka',
    name: 'Смолянка (пл. Смолянська)',
    lat: 50.2415,
    lng: 28.6830,
    zone: 'Смолянка',
    connections: ['Тр 1', 'Тр 3', 'Авт 58'],
    hasShelter: true,
    hasDisplay: true
  },
  's_univ_franka': {
    id: 's_univ_franka',
    name: 'Університет ім. І. Франка (вул. Велика Бердичівська)',
    lat: 50.2520,
    lng: 28.6720,
    zone: 'Центр',
    connections: ['Тр 1', 'Тр 3', 'Авт 58'],
    hasShelter: true,
    hasDisplay: true
  },
  's_kroshnya_svitankova': {
    id: 's_kroshnya_svitankova',
    name: 'вул. Світанкова (Крошня)',
    lat: 50.2870,
    lng: 28.6630,
    zone: 'Крошня',
    connections: ['Авт 10'],
    hasShelter: true,
    hasDisplay: false
  },
  's_kroshnya_term': {
    id: 's_kroshnya_term',
    name: 'Крошня (Кінцева, вул. Покровська)',
    lat: 50.2980,
    lng: 28.6640,
    zone: 'Крошня',
    connections: ['Авт 10'],
    hasShelter: true,
    hasDisplay: true
  },
  's_malovanka': {
    id: 's_malovanka',
    name: 'Мальованка (вул. Героїв Пожежників)',
    lat: 50.2475,
    lng: 28.6410,
    zone: 'Мальованка',
    connections: ['Авт 58'],
    hasShelter: true,
    hasDisplay: false
  },
  's_silikat': {
    id: 's_silikat',
    name: 'Силікатний завод (вул. Промислова)',
    lat: 50.2910,
    lng: 28.7200,
    zone: 'Промзона',
    connections: ['Авт 10', 'Авт 19'],
    hasShelter: true,
    hasDisplay: false
  }
};
const ROUTES_DATA = [
  {
    id: 'tr-2',
    number: '2',
    name: 'Богунія — Вокзал — Смолянка',
    type: 'trolleybus',
    typeLabel: 'Тролейбус',
    color: '#0284c7',
    textColor: '#ffffff',
    fare: 'Картка 15 ₴ · банківська 17 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/1',
    stopsForward: [
      's_bohunia_term',
      's_myru_market',
      's_per',
      's_sob',
      's_tsum',
      's_global',
      's_vokzal'
    ],
    stopsBackward: [
      's_vokzal',
      's_global',
      's_tsum',
      's_sob',
      's_per',
      's_myru_market',
      's_bohunia_term'
    ],
  },
  {
    id: 'tr-1',
    number: '1А',
    name: 'Вокзал — Театральна — Смолянка — Вокзал (кільцевий)',
    type: 'trolleybus',
    typeLabel: 'Тролейбус',
    color: '#0284c7',
    textColor: '#ffffff',
    fare: 'Картка 15 ₴ · банківська 17 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/47',
    stopsForward: [
      's_vokzal',
      's_global',
      's_tsum',
      's_sob',
      's_univ_franka',
      's_smolyanka',
      's_poliova_vitruka',
      's_avtovokzal',
      's_vokzal'
    ],
    stopsBackward: [
      's_vokzal',
      's_avtovokzal',
      's_poliova_vitruka',
      's_smolyanka',
      's_univ_franka',
      's_sob',
      's_tsum',
      's_global',
      's_vokzal'
    ],
  },
  {
    id: 'tr-3',
    number: '3',
    name: 'Богунія — Смолянка — Вокзал',
    type: 'trolleybus',
    typeLabel: 'Тролейбус',
    color: '#0284c7',
    textColor: '#ffffff',
    fare: 'Картка 15 ₴ · банківська 17 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/5',
    stopsForward: [
      's_bohunia_term',
      's_myru_market',
      's_per',
      's_sob',
      's_univ_franka',
      's_smolyanka'
    ],
    stopsBackward: [
      's_smolyanka',
      's_univ_franka',
      's_sob',
      's_per',
      's_myru_market',
      's_bohunia_term'
    ],
  },
  {
    id: 'tr-15a',
    number: '15А',
    name: 'Гідропарк — Вокзал — Смолянка',
    type: 'trolleybus',
    typeLabel: 'Тролейбус',
    color: '#0284c7',
    textColor: '#ffffff',
    fare: 'Картка 15 ₴ · банківська 17 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/77',
    stopsForward: [
      's_hydropark',
      's_politekh',
      's_sob',
      's_tsum',
      's_global',
      's_vokzal'
    ],
    stopsBackward: [
      's_vokzal',
      's_global',
      's_tsum',
      's_sob',
      's_politekh',
      's_hydropark'
    ],
  },
  {
    id: 'bus-10',
    number: '10',
    name: 'Крошня (ТЦ «Ринг») — Паперова фабрика',
    type: 'bus',
    typeLabel: 'Автобус',
    color: '#16a34a',
    textColor: '#ffffff',
    fare: 'Картка 22 ₴ · банківська 24 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/122',
    stopsForward: [
      's_kroshnya_term',
      's_kroshnya_svitankova',
      's_pokrovska_sinniy',
      's_per',
      's_sob',
      's_tsum',
      's_global',
      's_silikat'
    ],
    stopsBackward: [
      's_silikat',
      's_global',
      's_tsum',
      's_sob',
      's_per',
      's_pokrovska_sinniy',
      's_kroshnya_svitankova',
      's_kroshnya_term'
    ],
  },
  {
    id: 'bus-19',
    number: '19',
    name: 'с-ще Лісове — Біомедскло',
    type: 'bus',
    typeLabel: 'Автобус',
    color: '#16a34a',
    textColor: '#ffffff',
    fare: 'Картка 22 ₴ · банківська 24 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/110',
    stopsForward: [
      's_silikat',
      's_global',
      's_tsum',
      's_sob',
      's_politekh',
      's_hydropark'
    ],
    stopsBackward: [
      's_hydropark',
      's_politekh',
      's_sob',
      's_tsum',
      's_global',
      's_silikat'
    ],
  },
  {
    id: 'bus-23',
    number: '23',
    name: 'Богунія — Комбінат силікатних виробів / Слобода-Селець',
    type: 'bus',
    typeLabel: 'Автобус',
    color: '#ea580c',
    textColor: '#ffffff',
    fare: 'Картка 22 ₴ · банківська 24 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/86',
    stopsForward: [
      's_bohunia_term',
      's_myru_market',
      's_per',
      's_sob',
      's_tsum',
      's_global',
      's_vokzal',
      's_avtovokzal',
      's_poliova_vitruka'
    ],
    stopsBackward: [
      's_poliova_vitruka',
      's_avtovokzal',
      's_vokzal',
      's_global',
      's_tsum',
      's_sob',
      's_per',
      's_myru_market',
      's_bohunia_term'
    ],
  },
  {
    id: 'bus-58',
    number: '58',
    name: 'Мальованка — Обласна лікарня / Діагностичний центр',
    type: 'bus',
    typeLabel: 'Автобус',
    color: '#9333ea',
    textColor: '#ffffff',
    fare: 'Картка 22 ₴ · банківська 24 ₴ · QR 25 ₴',
    officialScheduleUrl: 'https://zt.rozklad.in.ua/home/schedule/106',
    stopsForward: [
      's_poliova_vitruka',
      's_smolyanka',
      's_univ_franka',
      's_sob',
      's_malovanka'
    ],
    stopsBackward: [
      's_malovanka',
      's_sob',
      's_univ_franka',
      's_smolyanka',
      's_poliova_vitruka'
    ],
  }
];

// Ініціальний парк рухомого складу для симуляції GPS
const INITIAL_VEHICLES = [
  // Тролейбуси маршруту 2
  {
    id: 'vh-201',
    boardNumber: '201',
    model: 'Богдан Т701.17',
    routeId: 'tr-2',
    direction: 'forward',
    driverName: 'Мельник Сергій П.',
    driverId: 'DRV-102',
    speed: 34,
    status: 'on_time', // on_time, delayed, ahead, maintenance
    delayMinutes: 0,
    progress: 0.15, // від 0 до 1 вздовж маршруту
    speedKmH: 34,
    batteryFuel: 88,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },
  {
    id: 'vh-204',
    boardNumber: '204',
    model: 'БКМ 321',
    routeId: 'tr-2',
    direction: 'forward',
    driverName: 'Ковальчук Олексій В.',
    driverId: 'DRV-108',
    speed: 28,
    status: 'delayed',
    delayMinutes: 3,
    progress: 0.65,
    speedKmH: 28,
    batteryFuel: 76,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },
  {
    id: 'vh-211',
    boardNumber: '211',
    model: 'Богдан Т701.17',
    routeId: 'tr-2',
    direction: 'backward',
    driverName: 'Ткачук Василь М.',
    driverId: 'DRV-115',
    speed: 32,
    status: 'on_time',
    delayMinutes: -1,
    progress: 0.35,
    speedKmH: 32,
    batteryFuel: 92,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },
  {
    id: 'vh-218',
    boardNumber: '218',
    model: 'Škoda 14TrM',
    routeId: 'tr-2',
    direction: 'backward',
    driverName: 'Сидоренко Ігор Д.',
    driverId: 'DRV-122',
    speed: 25,
    status: 'ahead',
    delayMinutes: -2,
    progress: 0.85,
    speedKmH: 25,
    batteryFuel: 64,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },

  // Тролейбуси маршруту 1
  {
    id: 'vh-101',
    boardNumber: '101',
    model: 'БКМ 321',
    routeId: 'tr-1',
    direction: 'forward',
    driverName: 'Гончарук Петро С.',
    driverId: 'DRV-105',
    speed: 30,
    status: 'on_time',
    delayMinutes: 0,
    progress: 0.40,
    speedKmH: 30,
    batteryFuel: 85,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },
  {
    id: 'vh-107',
    boardNumber: '107',
    model: 'Богдан Т701.17',
    routeId: 'tr-1',
    direction: 'backward',
    driverName: 'Бондар Андрій В.',
    driverId: 'DRV-119',
    speed: 31,
    status: 'delayed',
    delayMinutes: 4,
    progress: 0.70,
    speedKmH: 31,
    batteryFuel: 70,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },

  // Тролейбус 15А
  {
    id: 'vh-151',
    boardNumber: '151',
    model: 'БКМ 321',
    routeId: 'tr-15a',
    direction: 'forward',
    driverName: 'Павлюк Віталій К.',
    driverId: 'DRV-133',
    speed: 36,
    status: 'on_time',
    delayMinutes: 0,
    progress: 0.25,
    speedKmH: 36,
    batteryFuel: 95,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },

  // Автобуси маршруту 10
  {
    id: 'vh-401',
    boardNumber: '401',
    model: 'МАЗ 206',
    routeId: 'bus-10',
    direction: 'forward',
    driverName: 'Шевченко Дмитро О.',
    driverId: 'DRV-201',
    speed: 40,
    status: 'on_time',
    delayMinutes: 0,
    progress: 0.20,
    speedKmH: 40,
    batteryFuel: 82,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },
  {
    id: 'vh-405',
    boardNumber: '405',
    model: 'ISUZU Ataman A092',
    routeId: 'bus-10',
    direction: 'backward',
    driverName: 'Лисенко Олег І.',
    driverId: 'DRV-205',
    speed: 35,
    status: 'delayed',
    delayMinutes: 5,
    progress: 0.60,
    speedKmH: 35,
    batteryFuel: 68,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },

  // Автобуси маршруту 23
  {
    id: 'vh-231',
    boardNumber: '231',
    model: 'Богдан А092',
    routeId: 'bus-23',
    direction: 'forward',
    driverName: 'Кравчук Юрій М.',
    driverId: 'DRV-212',
    speed: 38,
    status: 'on_time',
    delayMinutes: 1,
    progress: 0.50,
    speedKmH: 38,
    batteryFuel: 79,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },
  {
    id: 'vh-238',
    boardNumber: '238',
    model: 'Богдан А092',
    routeId: 'bus-23',
    direction: 'backward',
    driverName: 'Захарчук Михайло В.',
    driverId: 'DRV-216',
    speed: 32,
    status: 'on_time',
    delayMinutes: 0,
    progress: 0.10,
    speedKmH: 32,
    batteryFuel: 90,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },

  // Автобус 19
  {
    id: 'vh-191',
    boardNumber: '191',
    model: 'Рута 25 Нова',
    routeId: 'bus-19',
    direction: 'forward',
    driverName: 'Іванов Роман П.',
    driverId: 'DRV-230',
    speed: 29,
    status: 'on_time',
    delayMinutes: -1,
    progress: 0.45,
    speedKmH: 29,
    batteryFuel: 84,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  },

  // Автобус 58
  {
    id: 'vh-581',
    boardNumber: '581',
    model: 'ISUZU Ataman A092',
    routeId: 'bus-58',
    direction: 'forward',
    driverName: 'Кузьменко Тарас В.',
    driverId: 'DRV-245',
    speed: 33,
    status: 'on_time',
    delayMinutes: 0,
    progress: 0.72,
    speedKmH: 33,
    batteryFuel: 77,
    lastPing: new Date().toLocaleTimeString('uk-UA')
  }
];
const EXTERNAL_SERVICES = [
  {
    name: 'Актуальні розклади Житомира',
    desc: 'Графіки, напрямки та зупинки; сервіс вказаний на сайті КП «Житомиртранспорт».',
    url: 'https://zt.rozklad.in.ua/',
    icon: 'clock',
    badge: 'Партнерський сервіс'
  },
  {
    name: 'Тарифи та оплата',
    desc: 'Чинні тарифи за способом оплати, пільгові ціни та проїзні від КП «Житомиртранспорт».',
    url: 'https://transport.zt.ua/?page_id=284',
    icon: 'info',
    badge: 'Джерело тарифів'
  },
  {
    name: 'Dozor City (Житомир)',
    desc: 'Зовнішній сервіс моніторингу; фактична наявність транспорту залежить від джерел даних сервісу.',
    url: 'https://city.dozor.tech/ua/zhytomyr/city',
    icon: 'compass',
    badge: 'Зовнішній сервіс'
  },
  {
    name: 'EasyWay Житомир',
    desc: 'Розклади, маршрути міських тролейбусів та автобусів',
    url: 'https://www.eway.in.ua/ua/cities/zhytomyr',
    icon: 'map-pin',
    badge: 'Схеми ліній'
  },
  {
    name: 'КП "Житомирське ТТУ"',
    desc: 'Офіційний портал перевізника: тарифи, новини, зміни в русі',
    url: 'https://ttu.zt.ua/',
    icon: 'building',
    badge: 'ТТУ'
  },
  {
    name: 'Транспорт Житомира (Telegram-чат)',
    desc: 'Оперативні повідомлення про перекриття та аварійні ситуації',
    url: 'https://t.me/transport_zt',
    icon: 'message-circle',
    badge: 'Сповіщення'
  }
];


  // 2. СХОВИЩЕ СТАНУ
  // Менеджер глобального стану додатку "Житомир Рух"


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
          time: 'Демо',
          level: 'warning',
          title: 'Приклад повідомлення про уповільнення руху',
          text: 'Демонстраційний текст для інтерфейсу. Він не підтверджує фактичний затор чи затримку.',
          route: 'Демо-подія'
        },
        {
          id: 'alt-2',
          time: 'Демо',
          level: 'info',
          title: 'Приклад оголошення про транспорт',
          text: 'Демонстраційний текст. Фактична кількість машин і виконання графіка не надходять до прототипу.',
          route: 'Демо-подія'
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
const store = new StateStore();


  // 3. СИМУЛЯТОР GPS РУХУ
  // Симулятор GPS руху громадського транспорту м. Житомир



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
const simulator = new TransitSimulator();


  // 4. КОНТРОЛЕР МАПИ
  // Інтерактивна мапа OpenStreetMap / Leaflet для Житомир Рух





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
              <div style="margin-bottom:10px;">${ztIcon('map', 38)}</div>
              <strong style="color:#0f172a;font-size:1.1rem;">Карта маршрутів Житомира</strong>
              <div style="font-size:0.85rem;color:#64748b;margin-top:6px;">Завантажуємо карту…</div>
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
            <div style="margin-bottom:10px;">${ztIcon('map', 32)}</div>
            <strong style="color:#0f172a;">Карта тимчасово недоступна</strong>
            <p style="font-size:0.85rem;color:#64748b;margin-top:6px;">Спробуйте оновити сторінку. Список маршрутів доступний.</p>
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
          <span class="popup-zone">Демо-зупинка · ${stop.zone}</span>
          <h4 class="popup-title">${stop.name}</h4>
        </div>
        <div class="popup-arrivals-title">Демо-оцінка прибуття · не GPS:</div>
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
        <div class="vehicle-marker-box ${isTrolley ? 'is-trolley' : 'is-bus'} ${statusClass}" style="--route-color: ${route.color}" aria-label="${isTrolley ? 'Тролейбус' : 'Автобус'} №${route.number}, демо-маркер">
          <div class="vehicle-bearing-arrow" style="transform: rotate(${vehicle.bearing || 0}deg)">▲</div>
          <svg class="vehicle-icon" viewBox="0 0 64 46" aria-hidden="true" focusable="false">
            ${isTrolley ? '<path class="trolley-pole" d="M28 9 24 2m10 7 5-7" />' : ''}
            <path class="vehicle-body" d="M13 7h34c5 0 9 4 9 9v17H7V15c0-5 2-8 6-8Z" />
            <rect class="vehicle-route-sign" x="14" y="10" width="19" height="8" rx="1.5" />
            <rect class="vehicle-window" x="35" y="10" width="8" height="8" rx="1" />
            <rect class="vehicle-window" x="12" y="21" width="12" height="9" rx="1" />
            <rect class="vehicle-window" x="26" y="21" width="9" height="9" rx="1" />
            <rect class="vehicle-window" x="37" y="21" width="12" height="9" rx="1" />
            <path class="vehicle-bumper" d="M7 33h49" />
            <circle class="vehicle-wheel" cx="18" cy="35" r="4" />
            <circle class="vehicle-wheel" cx="47" cy="35" r="4" />
          </svg>
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
          iconSize: [64, 54],
          iconAnchor: [32, 27]
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
                       `<span class="badge-ontime">За графіком · демо</span>`;

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
    const geolocation = window.navigator?.geolocation;

    if (!window.isSecureContext) {
      this.setLocationStatus('Геолокація працює лише на захищеній сторінці HTTPS або localhost.', 'error');
      return;
    }
    if (!geolocation?.getCurrentPosition) {
      this.setLocationStatus('Цей браузер не надає доступ до геолокації. Відкрийте сайт у повному Chrome/Edge та дозвольте доступ до місця.', 'error');
      return;
    }

    const locateButton = document.getElementById('btn-map-my-location');
    if (locateButton) {
      locateButton.disabled = true;
      locateButton.setAttribute('aria-busy', 'true');
    }
    this.setLocationStatus('Запитуємо ваше місце. Підтвердіть дозвіл у браузері.', 'pending');

    const finishRequest = () => {
      if (locateButton) {
        locateButton.disabled = false;
        locateButton.removeAttribute('aria-busy');
      }
    };

    try {
      geolocation.getCurrentPosition(({ coords }) => {
        finishRequest();
        if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
          this.setLocationStatus('Браузер повернув некоректні координати. Спробуйте ще раз.', 'error');
          return;
        }

        const userPos = [coords.latitude, coords.longitude];
        const accuracy = Number.isFinite(coords.accuracy) ? Math.max(1, Math.round(coords.accuracy)) : null;
        const popupText = accuracy ? `Ваше місце · точність близько ±${accuracy} м` : 'Ваше місце';
        this.map.flyTo(userPos, Math.max(this.map.getZoom(), 16), { duration: 1.2 });

        if (this.userMarker) {
          this.userMarker.setLatLng(userPos);
          this.userMarker.getPopup()?.setContent(`<b>${popupText}</b>`);
          this.userMarker.openPopup();
        } else {
          const userIcon = L.divIcon({
            className: 'user-loc-wrapper',
            html: `<div class="user-loc-pulse"><div class="user-loc-core"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          this.userMarker = L.marker(userPos, { icon: userIcon, title: 'Ваше поточне місце' })
            .addTo(this.map)
            .bindPopup(`<b>${popupText}</b>`)
            .openPopup();
        }

        this.setLocationStatus(accuracy ? `Ваше місце показано на карті · точність близько ±${accuracy} м.` : 'Ваше місце показано на карті.', 'success');
      }, (error) => {
        finishRequest();
        const messages = {
          1: 'Доступ до місця заборонено. Дозвольте геолокацію в налаштуваннях сайту браузера.',
          2: 'Браузеру не вдалося визначити місце. Перевірте, чи ввімкнено служби геолокації на пристрої.',
          3: 'Пошук місця тривав надто довго. Спробуйте ще раз.'
        };
        this.setLocationStatus(messages[error.code] || 'Не вдалося визначити ваше місце. Спробуйте ще раз.', 'error');
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    } catch (error) {
      finishRequest();
      this.setLocationStatus('Браузер не дозволив запит геолокації. Перевірте дозвіл для цього сайту.', 'error');
    }
  }

  setLocationStatus(message, state = 'info') {
    const status = document.getElementById('map-location-status');
    if (!status) return;
    window.clearTimeout(this.locationStatusTimer);
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
    if (state === 'success') {
      this.locationStatusTimer = window.setTimeout(() => {
        status.hidden = true;
      }, 7000);
    }
  }
}
const mapController = new MapController();


  // 5. КАБІНЕТ ПАСАЖИРА
  // Кабінет пасажира «Житомир Рух»
class PassengerComponent {
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
            <span class="tab-icon">${ztIcon('route', 18)}</span>
            <span>Маршрути</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'schedule' ? 'active' : ''}" data-tab="schedule">
            <span class="tab-icon">${ztIcon('clock', 18)}</span>
            <span>Розклад</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'planner' ? 'active' : ''}" data-tab="planner">
            <span class="tab-icon">${ztIcon('compass', 18)}</span>
            <span>План поїздки</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'favorites' ? 'active' : ''}" data-tab="favorites">
            <span class="tab-icon">${ztIcon('star', 18)}</span>
            <span>Збережене</span>
          </button>
          <button class="nav-tab-btn ${currentTab === 'links' ? 'active' : ''}" data-tab="links">
            <span class="tab-icon">${ztIcon('globe', 18)}</span>
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
          <span class="search-icon">${ztIcon('search', 18)}</span>
          <input type="text" id="route-search-input" class="search-input"
                 placeholder="Введіть номер маршруту або назву зупинки"
                 value="${this.searchQuery}">
          ${this.searchQuery ? `<button id="btn-clear-search" class="btn-clear" title="Очистити пошук">${ztIcon('close', 15)}</button>` : ''}
        </div>
        <div class="filter-pills">
          <button class="filter-pill ${this.filterType === 'all' ? 'active' : ''}" data-type="all">Усі маршрути (${ROUTES_DATA.length})</button>
          <button class="filter-pill ${this.filterType === 'trolleybus' ? 'active' : ''}" data-type="trolleybus">${ztIcon('trolley', 16)} Тролейбуси</button>
          <button class="filter-pill ${this.filterType === 'bus' ? 'active' : ''}" data-type="bus">${ztIcon('bus', 16)} Автобуси</button>
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
              <div class="route-type-badge">${selectedRoute.typeLabel} · демо-модель маршруту</div>
              <h3 class="route-main-name">${selectedRoute.name}</h3>
            </div>
          </div>
          <button class="btn-star-fav ${isFavRoute ? 'is-fav' : ''}" id="btn-toggle-fav-route" title="Зберегти цей маршрут">
            ${ztIcon('star', 16)} ${isFavRoute ? 'Збережено' : 'Зберегти маршрут'}
          </button>
        </div>

        <div class="route-meta-strip">
          <div class="meta-item">
            <span class="meta-label">Оплата:</span>
            <span class="meta-val">${selectedRoute.fare}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Джерело тарифу:</span>
            <a class="meta-val verified-data-link" href="https://transport.zt.ua/?page_id=284" target="_blank" rel="noopener noreferrer">КП «Житомиртранспорт» · 15.08.2026 ↗</a>
          </div>
        </div>

        <div class="route-data-notice">
          Демонстраційна схема: зупинки, координати та рух машин у цьому прототипі не є актуальними даними перевізника.
          <a href="${selectedRoute.officialScheduleUrl}" target="_blank" rel="noopener noreferrer">Перевірити маршрут і розклад ↗</a>
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
          <h4 class="section-subheading">Демо-схема зупинок (${stopIds.length}):</h4>
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
                    </div>
                    <div class="node-sub">
                      <span class="node-zone">Демо-схема</span>
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
            <span class="stop-zone-label">Демонстраційна зупинка · район: ${currentStop.zone}</span>
          </div>
          <button class="btn-star-fav ${isFavStop ? 'is-fav' : ''}" id="btn-toggle-fav-stop">
            ${ztIcon('star', 16)} ${isFavStop ? 'Зупинку збережено' : 'Зберегти зупинку'}
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
                      ${arr.lowFloor ? `<span class="badge-accessible" title="Низька підлога">${ztIcon('accessibility', 16)}</span>` : ''}
                    </td>
                    <td>
                      ${arr.status === 'delayed' ? `<span class="badge-warning">+${arr.delayMinutes} хв</span>` :
                        arr.status === 'ahead' ? `<span class="badge-info">${arr.delayMinutes} хв</span>` :
                        '<span class="badge-success">За графіком · демо</span>'}
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

    return `
      <div class="schedule-tab-content">
        <div class="schedule-header-card">
          <div class="sched-top-row">
            <span class="route-large-badge" style="background:${selectedRoute.color}">${selectedRoute.number}</span>
            <div>
              <span class="schedule-eyebrow">Розклад маршруту ${selectedRoute.number}</span>
              <h3>${selectedRoute.name}</h3>
              <p class="schedule-disclaimer">Відкрийте чинний графік у сервісі, партнером якого в Житомирі є КП «Житомиртранспорт». Графік може змінюватися — перевірте дату його дії та напрямок руху.</p>
            </div>
          </div>
        </div>
        <a class="official-schedule-cta" href="${selectedRoute.officialScheduleUrl}" target="_blank" rel="noopener noreferrer">Відкрити актуальний графік маршруту ${selectedRoute.number} ↗</a>
        <p class="schedule-disclaimer">У сервісі доступні напрямки, зупинки та графіки на будні й вихідні. Оперативні зміни публікує КП «Житомирське ТТУ».</p>
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

    return Object.entries(hours).sort(([hourA], [hourB]) => Number(hourA) - Number(hourB)).map(([hour, minutes]) => `
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
          <div class="planner-heading">
            <span class="planner-heading-icon">${ztIcon('compass', 22)}</span>
            <div><span class="schedule-eyebrow">МАРШРУТ МІЖ ЗУПИНКАМИ</span><h3 class="planner-title">План поїздки</h3></div>
          </div>
          <p class="planner-intro">Оберіть початкову й кінцеву зупинки — покажемо доступні варіанти на схемі маршрутів.</p>
          <p class="planner-demo-note">Час у дорозі — орієнтовна оцінка за демонстраційною схемою. Офіційні розклади й GPS не підключені.</p>

          <div class="planner-form">
            <div class="planner-input-group">
              <label for="planner-from-select">Звідки</label>
              <select id="planner-from-select" class="zt-select">
                ${stopsList.map(s => `
                  <option value="${s.id}" ${s.id === this.plannerFrom ? 'selected' : ''}>${s.name} (${s.zone})</option>
                `).join('')}
              </select>
            </div>

            <div class="planner-swap-btn-row">
              <button id="btn-swap-planner" class="btn-swap" title="Поміняти місцями" aria-label="Поміняти початок і кінець місцями">${ztIcon('swap', 17)} <span>Змінити напрямок</span></button>
            </div>

            <div class="planner-input-group">
              <label for="planner-to-select">Куди</label>
              <select id="planner-to-select" class="zt-select">
                ${stopsList.map(s => `
                  <option value="${s.id}" ${s.id === this.plannerTo ? 'selected' : ''}>${s.name} (${s.zone})</option>
                `).join('')}
              </select>
            </div>

            <button id="btn-run-planner" class="btn-calculate-route">${ztIcon('route', 17)} Знайти маршрут</button>
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
                ${i === 0 ? `<div class="badge-recommended">${ztIcon('timer', 15)} Найшвидший варіант</div>` : ''}
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
                  <div class="detail-step">${ztIcon('pin', 16)} <b>Посадка:</b> ${fromStop.name}</div>
                  <div class="detail-stops-list">Проїзд через: ${variant.intermediateStops.slice(1, -1).join(' → ') || 'прямий перегін'}</div>
                  <div class="detail-step">${ztIcon('pin', 16)} <b>Висадка:</b> ${toStop.name}</div>
                </div>
                <div class="variant-actions">
                  <button class="btn-show-on-map" onclick="window.ztSelectRoute('${variant.route.id}', '${variant.direction}')">
                    Показати маршрут на карті
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Шукаємо лише пересадки, які підтверджуються зупинками у двох різних маршрутах.
    const segments = ROUTES_DATA.flatMap(route => ['forward', 'backward'].map(direction => ({
      route,
      direction,
      stops: direction === 'forward' ? route.stopsForward : route.stopsBackward
    })));
    const transfers = [];
    segments.forEach(first => {
      const fromIdx = first.stops.indexOf(fromId);
      if (fromIdx < 0) return;
      first.stops.slice(fromIdx + 1).forEach((transferId, offset) => {
        const firstToTransfer = offset + 1;
        segments.forEach(second => {
          if (second.route.id === first.route.id) return;
          const transferIdx = second.stops.indexOf(transferId);
          const toIdx = second.stops.indexOf(toId);
          if (transferIdx < 0 || toIdx <= transferIdx) return;
          const secondToEnd = toIdx - transferIdx;
          const key = `${first.route.id}:${first.direction}:${transferId}:${second.route.id}:${second.direction}`;
          if (transfers.some(item => item.key === key)) return;
          transfers.push({
            key, first, second, transferId,
            firstStops: first.stops.slice(fromIdx, fromIdx + firstToTransfer + 1),
            secondStops: second.stops.slice(transferIdx, toIdx + 1),
            stopsCount: firstToTransfer + secondToEnd,
            estMinutes: Math.round((firstToTransfer + secondToEnd) * 2.5 + 7)
          });
        });
      });
    });
    transfers.sort((a, b) => a.estMinutes - b.estMinutes || a.stopsCount - b.stopsCount);

    if (!transfers.length) {
      return `<div class="trip-results-card"><div class="planner-no-route"><strong>Варіант не знайдено</strong><span>У демонстраційній схемі немає прямого маршруту або підтвердженої пересадки між цими зупинками. Спробуйте іншу пару.</span></div></div>`;
    }

    return `
      <div class="trip-results-card">
        <div class="results-header"><h4>Маршрути з пересадкою (${transfers.length})</h4><span class="badge-warning">1 пересадка</span></div>
        <div class="trip-variants-list">
          ${transfers.slice(0, 3).map((variant, i) => `
            <div class="trip-variant-card ${i === 0 ? 'recommended' : ''}">
              ${i === 0 ? `<div class="badge-recommended">${ztIcon('timer', 15)} Найшвидший варіант · демо</div>` : ''}
              <div class="transfer-legs">
                <div class="transfer-leg"><span class="variant-route-badge" style="background:${variant.first.route.color}">${variant.first.route.number}</span><span><strong>${variant.first.route.typeLabel} №${variant.first.route.number}</strong><small>${fromStop.name} → ${STOPS_DATA[variant.transferId]?.name}</small></span></div>
                <div class="transfer-leg"><span class="variant-route-badge" style="background:${variant.second.route.color}">${variant.second.route.number}</span><span><strong>${variant.second.route.typeLabel} №${variant.second.route.number}</strong><small>${STOPS_DATA[variant.transferId]?.name} → ${toStop.name}</small></span></div>
              </div>
              <div class="variant-time"><span class="est-duration">~${variant.estMinutes} хв</span><span class="est-stops">${variant.stopsCount} перегонів · 1 пересадка</span></div>
              <div class="variant-actions"><button class="btn-show-on-map" onclick="window.ztSelectRoute('${variant.first.route.id}', '${variant.first.direction}')">Показати перший маршрут на карті</button></div>
            </div>
          `).join('')}
        </div>
        <p class="planner-demo-note">Оцінка часу й пересадки демонстраційні; перевірте фактичний рух перед поїздкою.</p>
      </div>
    `;
  }

  getFavoritesHtml() {
    const state = store.getState();
    const favRoutes = state.favorites.routes.map(id => ROUTES_DATA.find(r => r.id === id)).filter(Boolean);
    const favStops = state.favorites.stops.map(id => STOPS_DATA[id]).filter(Boolean);

    return `
      <div class="favorites-tab-content">
        <div class="favorites-heading"><div><span class="schedule-eyebrow">ШВИДКИЙ ДОСТУП</span><h3>Збережене</h3><p>Ваші маршрути та зупинки в одному місці.</p></div><span class="favorites-total">${favRoutes.length + favStops.length} збережено</span></div>
        <div class="fav-section">
          <h3>${ztIcon('route', 18)} Маршрути <span class="fav-count">${favRoutes.length}</span></h3>
          ${favRoutes.length > 0 ? `
            <div class="fav-routes-grid">
              ${favRoutes.map(route => `
                <div class="fav-route-item" data-route-id="${route.id}">
                  <span class="route-badge-large" style="background:${route.color}">${route.number}</span>
                  <div class="fav-route-desc">
                    <strong>${route.typeLabel} №${route.number}</strong>
                    <span>${route.name}</span>
                  </div>
                  <button class="btn-remove-fav" data-del-route="${route.id}" title="Видалити">${ztIcon('trash', 15)}</button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="favorites-empty"><span class="favorites-empty-icon">${ztIcon('star', 20)}</span><strong>Тут з’являться ваші маршрути</strong><span>Збережіть маршрут кнопкою «Зберегти маршрут» у вкладці «Маршрути».</span></div>
          `}
        </div>

        <div class="fav-section mt-4">
          <h3>${ztIcon('pin', 18)} Зупинки <span class="fav-count">${favStops.length}</span></h3>
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
                    <button class="btn-remove-fav" data-del-stop="${stop.id}" title="Видалити">${ztIcon('trash', 15)}</button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="favorites-empty"><span class="favorites-empty-icon">${ztIcon('pin', 20)}</span><strong>Тут з’являться ваші зупинки</strong><span>Збережіть зупинку, щоб швидко відкрити її табло.</span></div>
          `}
        </div>
      </div>
    `;
  }

  getLinksHtml() {
    return `
      <div class="links-tab-content">
        <div class="links-header">
          <h3>${ztIcon('globe', 18)} Транспортні сервіси Житомира</h3>
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
          <h4>${ztIcon('info', 18)} Корисна інформація</h4>
          <p>
            • Гаряча лінія з питань якості перевезень: <strong>067 503 21 26, 093 503 21 26</strong><br>
            • Повний тариф: тролейбус/трамвай — транспортна картка 15 ₴, банківська картка/NFC 17 ₴, QR-квиток 25 ₴; автобус/маршрутка — транспортна картка 22 ₴, банківська картка/NFC 24 ₴, QR-квиток 25 ₴.<br>
            • Пільгові тарифи та проїзні: перевіряйте на <a href="https://transport.zt.ua/?page_id=284" target="_blank" rel="noopener noreferrer">сторінці тарифів КП «Житомиртранспорт» ↗</a>. Дані перевірено 04.11.2026.
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

    this.container.querySelectorAll('[data-del-route]').forEach(button => button.addEventListener('click', () => {
      store.toggleFavoriteRoute(button.dataset.delRoute);
    }));
    this.container.querySelectorAll('[data-del-stop]').forEach(button => button.addEventListener('click', () => {
      store.toggleFavoriteStop(button.dataset.delStop);
    }));
    this.container.querySelectorAll('[data-open-stop]').forEach(button => button.addEventListener('click', () => {
      store.setPassengerTab('search');
      store.setSelectedStop(button.dataset.openStop);
    }));
    this.container.querySelectorAll('.fav-route-item').forEach(card => card.addEventListener('click', event => {
      if (event.target.closest('[data-del-route]')) return;
      store.setPassengerTab('search');
      store.setSelectedRoute(card.dataset.routeId);
    }));

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


  // 6. КАБІНЕТ ВОДІЯ
  // Кабінет водія «Житомир Рух»
class DriverComponent {
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


  // 7. ПАНЕЛЬ ДИСПЕТЧЕРА
  // Панель диспетчера «Житомир Рух»
class DispatcherComponent {
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


  // 8. ГОЛОВНИЙ ДОДАТОК
  // Головний скрипт ініціалізації «Житомир Рух»








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

    // Вихід завершує серверну сесію службового кабінету.
    const logoutButton = document.querySelector('[data-staff-logout]');
    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        logoutButton.disabled = true;
        try { await fetch('/api/logout', { method: 'POST' }); }
        finally { window.location.assign('/'); }
      });
    }

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
    const roleButtons = document.querySelectorAll('.role-nav-link[data-role], .role-btn[data-role]');
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
    const pageRole = document.body.dataset.page || 'passenger';
    const allowedRoles = pageRole === 'passenger' ? ['passenger'] : ['passenger', pageRole];
    if (!allowedRoles.includes(role)) role = pageRole;
    store.setRole(role);

    // Оновлення активної кнопки в шапці
    document.querySelectorAll('.role-nav-link[data-role], .role-btn[data-role]').forEach(btn => {
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
