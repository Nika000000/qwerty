// Дані громадського транспорту міста Житомир
// Маршрути, зупинки, геокоординати, розклади руху

export const ZHYTOMYR_CENTER = [50.2546, 28.6587]; // Майдан Соборний
export const DEFAULT_ZOOM = 13;

export const STOPS_DATA = {
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

export const ROUTES_DATA = [
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
export const INITIAL_VEHICLES = [
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

export const EXTERNAL_SERVICES = [
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
