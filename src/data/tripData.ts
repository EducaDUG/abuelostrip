/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TripDay, FlightSegment, WorldRegionId } from '../types';
import { FAITH_ACTIVITIES } from './faithActivities';

export const FLIGHTS: FlightSegment[] = [
  {
    id: 'fl-1',
    origin: 'Houston',
    originCode: 'IAH',
    destination: 'Auckland',
    destinationCode: 'AKL',
    dateStr: 'Mar 20 oct 2026',
    departureTime: '21:00 (Mar 20)',
    arrivalTime: '05:30 (Jue 22)',
    durationApprox: '~15h (directo)',
    airline: 'Air New Zealand / United',
    flightNumber: 'NZ29',
    luggageLimitKg: 23,
    notes: 'Cruza la línea internacional de cambio de fecha (+1 día)',
    fromCoords: [29.9902, -95.3368],
    toCoords: [-37.0082, 174.7850],
  },
  {
    id: 'fl-2',
    origin: 'Auckland',
    originCode: 'AKL',
    destination: 'Dunedin',
    destinationCode: 'DUD',
    dateStr: 'Lun 26 oct 2026',
    departureTime: '12:35',
    arrivalTime: '14:30',
    durationApprox: '1 h 55 min',
    airline: 'Air New Zealand',
    flightNumber: 'NZ675',
    luggageLimitKg: 23,
    bookingRef: 'seat+bag (W)',
    notes: 'Festivo nacional en Nueva Zelanda (Labour Day). Vuelo doméstico escénico hacia la Isla Sur.',
    fromCoords: [-37.0082, 174.7850],
    toCoords: [-45.9281, 170.1983],
  },
  {
    id: 'fl-3',
    origin: 'Christchurch',
    originCode: 'CHC',
    destination: 'Nadi',
    destinationCode: 'NAN',
    dateStr: 'Sáb 7 nov 2026',
    departureTime: '14:10',
    arrivalTime: '17:15',
    durationApprox: '4 h 05 min',
    airline: 'Fiji Airways',
    flightNumber: 'FJ450',
    luggageLimitKg: 30,
    notes: 'Rumbo al paraíso tropical de Fiji en el Pacífico Sur.',
    fromCoords: [-43.4894, 172.5322],
    toCoords: [-17.7554, 177.4433],
  },
  {
    id: 'fl-4',
    origin: 'Nadi',
    originCode: 'NAN',
    destination: 'Singapur',
    destinationCode: 'SIN',
    dateStr: 'Mié 18 nov 2026',
    departureTime: '22:20',
    arrivalTime: '04:55 (Jue 19)',
    durationApprox: '10 h 35 min',
    airline: 'Fiji Airways',
    flightNumber: 'FJ363',
    luggageLimitKg: 30,
    bookingRef: 'DZPTWK',
    notes: '30 kg por persona permitidos. Vuelo nocturno sobre el Pacífico y el Sudeste Asiático.',
    fromCoords: [-17.7554, 177.4433],
    toCoords: [1.3644, 103.9915],
  },
  {
    id: 'fl-5',
    origin: 'Singapur',
    originCode: 'SIN',
    destination: 'Bakú',
    destinationCode: 'GYD',
    dateStr: 'Sáb 21 nov 2026',
    departureTime: '02:30',
    arrivalTime: '12:00',
    durationApprox: '7 h 30 min + 4 h',
    layover: '2h de escala en Dubái (DXB)',
    airline: 'Emirates + flydubai',
    flightNumber: 'EK349 + EK2198',
    luggageLimitKg: 25,
    bookingRef: 'Economy Saver',
    notes: 'Escala rápida en Dubái y llegada a orillas del Mar Caspio.',
    fromCoords: [1.3644, 103.9915],
    toCoords: [40.4675, 50.0467],
  },
  {
    id: 'fl-6',
    origin: 'Bakú',
    originCode: 'GYD',
    destination: 'Madrid',
    destinationCode: 'MAD',
    dateStr: 'Jue 26 nov 2026',
    departureTime: '07:55',
    arrivalTime: '16:25',
    durationApprox: '3 h 15 min + 4 h 45 min',
    layover: '1h 30m de escala en Estambul (IST)',
    airline: 'Turkish Airlines',
    flightNumber: 'TK339 + TK1859',
    luggageLimitKg: 23,
    bookingRef: 'VJRR8Q',
    notes: '23 kg por persona. Llegada triunfal a Madrid con la familia esperando.',
    fromCoords: [40.4675, 50.0467],
    toCoords: [40.4839, -3.5679],
  },
];

export interface RegionMeta {
  id: WorldRegionId;
  title: string;
  subtitle: string;
  country: string;
  flag: string;
  primaryColor: string;
  themeStyle: string;
  defaultCamera: { x: number; y: number; z: number; targetY: number };
  musicMood: string;
  postcardUrl?: string;
}

export const REGIONS_META: Record<WorldRegionId, RegionMeta> = {
  auckland: {
    id: 'auckland',
    title: 'Auckland & Hauraki Gulf',
    subtitle: 'La Ciudad de las Velas, Viaduct Harbour & Sky Tower',
    country: 'Nueva Zelanda (Isla Norte)',
    flag: '🇳🇿',
    primaryColor: '#10B981',
    themeStyle: 'harbor_emerald',
    defaultCamera: { x: 18, y: 16, z: 22, targetY: 1.5 },
    musicMood: 'breeze_seagulls',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  hobbiton: {
    id: 'hobbiton',
    title: 'Hobbiton & La Comarca',
    subtitle: 'Colinas verdes, puertas redondas, chimeneas y jardín idílico',
    country: 'Nueva Zelanda (Waikato)',
    flag: '🏡',
    primaryColor: '#84CC16',
    themeStyle: 'fairytale_shire',
    defaultCamera: { x: 16, y: 14, z: 20, targetY: 1.2 },
    musicMood: 'shire_acoustic',
    postcardUrl: '/src/assets/images/hobbiton_shire_postcard_1791501686332.jpg',
  },
  rotorua: {
    id: 'rotorua',
    title: 'Rotorua Geotermal & Cultura Maorí',
    subtitle: 'Géiseres Pōhutu humeantes, lagunas turquesa y Wharenui ancestral',
    country: 'Nueva Zelanda (Bay of Plenty)',
    flag: '🌋',
    primaryColor: '#F59E0B',
    themeStyle: 'geothermal_sulfur',
    defaultCamera: { x: 17, y: 15, z: 21, targetY: 1.4 },
    musicMood: 'maori_flute',
    postcardUrl: '/src/assets/images/rotorua_geothermal_postcard_1791501697598.jpg',
  },
  waiheke: {
    id: 'waiheke',
    title: 'Isla Waiheke & Viñedos',
    subtitle: 'Colinas vitivinícolas, olivares y aguas esmeralda',
    country: 'Nueva Zelanda',
    flag: '🍷',
    primaryColor: '#10B981',
    themeStyle: 'vineyard_hills',
    defaultCamera: { x: 18, y: 15, z: 22, targetY: 1.2 },
    musicMood: 'breeze_seagulls',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  dunedin: {
    id: 'dunedin',
    title: 'Dunedin & Península de Otago',
    subtitle: 'Estación de trenes renacentista, Castillo Larnach y Albatros Reales',
    country: 'Nueva Zelanda (Isla Sur)',
    flag: '🏰',
    primaryColor: '#0284C7',
    themeStyle: 'victorian_stone',
    defaultCamera: { x: 19, y: 16, z: 22, targetY: 1.8 },
    musicMood: 'scottish_strings',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  queenstown: {
    id: 'queenstown',
    title: 'Queenstown & Los Remarkables',
    subtitle: 'Lago Wakatipu, teleférico Skyline, vapor TSS Earnslaw y cumbres alpinas',
    country: 'Nueva Zelanda (Isla Sur)',
    flag: '🏔️',
    primaryColor: '#0EA5E9',
    themeStyle: 'alpine_adventure',
    defaultCamera: { x: 20, y: 18, z: 24, targetY: 2.0 },
    musicMood: 'alpine_echoes',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  milford: {
    id: 'milford',
    title: 'Milford Sound (Fiordland)',
    subtitle: 'La octava maravilla del mundo: Mitre Peak y cascadas atronadoras',
    country: 'Nueva Zelanda',
    flag: '🌊',
    primaryColor: '#0369A1',
    themeStyle: 'giant_fjord',
    defaultCamera: { x: 20, y: 17, z: 24, targetY: 2.2 },
    musicMood: 'waterfall_mist',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  wanaka: {
    id: 'wanaka',
    title: 'Wanaka & Monte Cook / Aoraki',
    subtitle: 'El Árbol Solitario en el lago, la Iglesia de piedra y glaciares',
    country: 'Nueva Zelanda',
    flag: '🌲',
    primaryColor: '#0284C7',
    themeStyle: 'glacial_lakes',
    defaultCamera: { x: 18, y: 16, z: 22, targetY: 1.5 },
    musicMood: 'alpine_echoes',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  christchurch: {
    id: 'christchurch',
    title: 'Christchurch: La Ciudad Jardín',
    subtitle: 'Paseos en barca por el Río Avon, sauces llorones y tranvía patrimonial',
    country: 'Nueva Zelanda',
    flag: '🛶',
    primaryColor: '#059669',
    themeStyle: 'garden_city',
    defaultCamera: { x: 18, y: 15, z: 22, targetY: 1.2 },
    musicMood: 'garden_peace',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  fiji: {
    id: 'fiji',
    title: 'Archipiélago de Fiji',
    subtitle: 'Aguas cristalinas, arrecifes, bures sobre el agua y bienvenida Bula',
    country: 'Fiji',
    flag: '🇫🇯',
    primaryColor: '#06B6D4',
    themeStyle: 'tropical_coral',
    defaultCamera: { x: 16, y: 14, z: 20, targetY: 1.0 },
    musicMood: 'warm_waves',
    postcardUrl: '/src/assets/images/fiji_tropical_postcard_1791499829519.jpg',
  },
  singapore: {
    id: 'singapore',
    title: 'Singapur Ciudad Jardín',
    subtitle: 'Arquitectura futurista, Supertrees, Marina Bay y gastronomía Hawker',
    country: 'Singapur',
    flag: '🇸🇬',
    primaryColor: '#EC4899',
    themeStyle: 'futuristic_bay',
    defaultCamera: { x: 18, y: 17, z: 22, targetY: 2.2 },
    musicMood: 'modern_chime',
    postcardUrl: '/src/assets/images/singapore_gardens_postcard_1791499840371.jpg',
  },
  azerbaijan: {
    id: 'azerbaijan',
    title: 'Bakú & el Mar Caspio',
    subtitle: 'Las Torres de Fuego, la Torre de la Doncella y la Ruta de la Seda',
    country: 'Azerbaiyán',
    flag: '🇦🇿',
    primaryColor: '#F59E0B',
    themeStyle: 'caspian_silk',
    defaultCamera: { x: 19, y: 16, z: 22, targetY: 2.0 },
    musicMood: 'oriental_strings',
    postcardUrl: '/src/assets/images/baku_flame_towers_postcard_1791499850470.jpg',
  },
  spain_turkey: {
    id: 'spain_turkey',
    title: 'Estambul & Gran Llegada a Madrid',
    subtitle: 'El Bósforo, la Puerta del Sol y el emotivo reencuentro familiar',
    country: 'España / Turquía',
    flag: '🇪🇸',
    primaryColor: '#EF4444',
    themeStyle: 'imperial_heritage',
    defaultCamera: { x: 18, y: 16, z: 22, targetY: 1.5 },
    musicMood: 'tapas_celebration',
    postcardUrl: '/src/assets/images/baku_flame_towers_postcard_1791499850470.jpg',
  },
  flight_transit: {
    id: 'flight_transit',
    title: 'Vuelo Intercontinental sobre el Pacífico',
    subtitle: 'Crucero aéreo nocturno Boeing 787 entre nubes y estrellas',
    country: 'En Tránsito Internacional',
    flag: '✈️',
    primaryColor: '#38BDF8',
    themeStyle: 'high_altitude_clouds',
    defaultCamera: { x: 18, y: 14, z: 22, targetY: 1.5 },
    musicMood: 'clouds_drone',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  nz_north: {
    id: 'nz_north',
    title: 'Auckland & Hauraki Gulf',
    subtitle: 'La Ciudad de las Velas, Viaduct Harbour & Sky Tower',
    country: 'Nueva Zelanda (Isla Norte)',
    flag: '🇳🇿',
    primaryColor: '#10B981',
    themeStyle: 'harbor_emerald',
    defaultCamera: { x: 18, y: 16, z: 22, targetY: 1.5 },
    musicMood: 'breeze_seagulls',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  nz_south: {
    id: 'nz_south',
    title: 'Queenstown & Los Remarkables',
    subtitle: 'Lago Wakatipu, teleférico Skyline y cumbres alpinas',
    country: 'Nueva Zelanda (Isla Sur)',
    flag: '🏔️',
    primaryColor: '#0EA5E9',
    themeStyle: 'alpine_adventure',
    defaultCamera: { x: 20, y: 18, z: 24, targetY: 2.0 },
    musicMood: 'alpine_echoes',
    postcardUrl: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
};

const BASE_TRIP_DAYS: TripDay[] = [
  {
    dayNumber: 1,
    date: '2026-10-20',
    displayDate: 'Martes 20 Octubre 2026',
    regionId: 'flight_transit',
    locationName: 'Houston → En Vuelo sobre el Pacífico',
    country: 'En Tránsito Internacional',
    countryFlag: '✈️',
    timezone: 'GMT-5 → GMT+13',
    utcOffset: -5,
    flight: FLIGHTS[0],
    summary: 'Comienza la gran aventura. Vuelo directo nocturno cruzando el océano Pacífico hacia Nueva Zelanda.',
    highlights: [
      'Embarque preferente y acomodación con almohadas ergonómicas',
      'Cruce de la Línea Internacional de Cambio de Fecha',
      'Cena a bordo y descanso guiado para sincronizar huso horario'
    ],
    attractions: [
      {
        id: 'sky-flight',
        name: 'Vuelo Intercontinental Boeing 787',
        category: 'landmark',
        description: 'Vuelo escénico nocturno sobre el inmenso Océano Pacífico.',
        highlight: 'Estrellas del hemisferio sur visibles desde la ventanilla',
        seniorTip: 'Beber abundante agua cada hora y realizar suaves estiramientos de tobillo en el asiento.',
        position3D: [0, 6, 0]
      }
    ],
    foods: [
      {
        id: 'flight-tea',
        name: 'Té de Hierbas con Miel de Manuka',
        category: 'drink',
        description: 'Infusión relajante que facilita el sueño y la digestión en altura.',
        recommendedAt: 'Servicio a bordo Air NZ',
        staminaRecovery: 15,
        delightBonus: 10
      }
    ],
    culture: {
      id: 'cult-cross',
      title: 'El Salto del Tiempo',
      tradition: 'Al cruzar el meridiano 180°, se adelanta un día entero en el calendario.',
      description: 'El martes se transforma en jueves en pleno vuelo sobre el Océano.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 18, condition: 'Cielo despejado en altitud', windSpeedKmh: 45, rainfallChancePct: 0 },
    recommendedRestTimeHours: 9
  },
  {
    dayNumber: 2,
    date: '2026-10-21',
    displayDate: 'Miércoles 21 Octubre 2026',
    regionId: 'hobbiton',
    locationName: 'Llegada a las Colinas de la Comarca (Hobbiton)',
    country: 'Nueva Zelanda (Waikato)',
    countryFlag: '🏡',
    timezone: 'GMT+13',
    utcOffset: 13,
    summary: 'Primer contacto con la campiña neozelandesa en el idílico pueblo de Hobbiton: colinas de terciopelo verde, puertas redondas y flores.',
    highlights: [
      'El famoso agujero Hobbit de Bolsón Cerrado con puerta redonda verde',
      'El Árbol de la Fiesta (Party Tree) y puentecito de piedra',
      'Paseo suave y llano con paradas de descanso en la Posada del Dragón Verde'
    ],
    attractions: [
      {
        id: 'hobbit-hole',
        name: 'Casita Hobbit de Bolsón Cerrado (Bag End)',
        category: 'landmark',
        description: 'La entrañable casa hobbit excavada en la colina verde con puerta redonda y pomo de latón.',
        highlight: 'El jardín de flores y la chimenea de piedra humeante',
        seniorTip: 'Caminos llanos de tierra compactada con bancos de madera cada pocos metros.',
        position3D: [0, 2.2, 0]
      },
      {
        id: 'party-tree',
        name: 'El Gran Árbol de la Fiesta (The Party Tree)',
        category: 'nature',
        description: 'Roble centenario con farolillos colgantes donde se celebran las fiestas hobbits.',
        highlight: 'Vistas panorámicas a los prados ondulados salpicados de ovejas',
        seniorTip: 'Sombra fresca y suelo de césped mullido y cómodo.',
        position3D: [4, 1.4, 2]
      }
    ],
    foods: [
      {
        id: 'hobbit-ale',
        name: 'Cerveza de Jengibre y Tarta de Ternera Tradicional',
        category: 'dish',
        description: 'Pastel de hojaldre crujiente horneado con ternera y cerveza artesanal suave sin alcohol en la Green Dragon Inn.',
        recommendedAt: 'The Green Dragon Inn',
        staminaRecovery: 35,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-hobbit',
      title: 'La Calidez de la Comarca',
      tradition: 'La hospitalidad hobbit de disfrutar de siete comidas al día y celebrar la vida tranquila.',
      description: 'Un remanso de paz perfecto para que los abuelos sonrían con ternura.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 18, condition: 'Soleado y colinas verdes', windSpeedKmh: 12, rainfallChancePct: 5 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 3,
    date: '2026-10-22',
    displayDate: 'Jueves 22 Octubre 2026',
    regionId: 'rotorua',
    locationName: 'Rotorua: Valle Geotermal de Te Puia & Géiser Pōhutu',
    country: 'Nueva Zelanda (Bay of Plenty)',
    countryFlag: '🌋',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Ruta geotérmica hacia el corazón maorí de Rotorua. Impresionante columna de vapor del géiser Pōhutu, piscinas de lodo caliente y bienvenida ancestral.',
    highlights: [
      'El colosal géiser Pōhutu expulsando agua hirviendo a 30 metros de altura',
      'Laguna turquesa con ribetes de azufre amarillo brillante y fumarolas termales',
      'Visita a la gran casa comunal tallada maorí (Wharenui) y bienvenida con cantos Waiata'
    ],
    attractions: [
      {
        id: 'pohutu-geyser',
        name: 'Géiser Pōhutu & Piscinas de Lodo Hirviente',
        category: 'nature',
        description: 'El géiser más potente del hemisferio sur, activo de forma natural.',
        highlight: 'El calor natural de las rocas geotérmicas y bancos térmicos para descanso',
        seniorTip: 'Pasarelas de madera llanas y accesibles con asientos cómodos.',
        position3D: [0, 2.5, 0]
      },
      {
        id: 'maori-wharenui',
        name: 'Casa Comunal Sagrada (Wharenui de Te Puia)',
        category: 'culture',
        description: 'Edificio ceremonial de madera roja tallada a mano con ojos de concha Paua iridiscente.',
        highlight: 'El Tekoteko guardián ancestral tallado en madera en la fachada principal',
        seniorTip: 'Completamente accesible con rampa suave y asientos acolchados en primera fila.',
        position3D: [4, 1.8, -2]
      }
    ],
    foods: [
      {
        id: 'rotorua-hangi',
        name: 'Banquete Tradicional Hāngi Cocinado en Vapor Geotérmico',
        localName: 'Geothermal Hāngi',
        category: 'dish',
        description: 'Carnes tiernísimas de cerdo y cordero con kumara (batata dulce) cocinadas lentamente con el vapor natural de la tierra.',
        recommendedAt: 'Restaurante Pātaka Kai en Te Puia',
        staminaRecovery: 45,
        delightBonus: 40
      }
    ],
    culture: {
      id: 'cult-manaakitanga',
      title: 'Manaakitanga & Cultura Te Arawa',
      tradition: 'La reverencia hacia los mayores (Kaumātua) y la hospitalidad sin reservas.',
      description: 'En Rotorua los abuelos recibirán el saludo tradicional Hongi de paz y bienvenida.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 17, condition: 'Vapor termal y cielo soleado', windSpeedKmh: 14, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 4,
    date: '2026-10-23',
    displayDate: 'Viernes 23 Octubre 2026',
    regionId: 'hobbiton',
    locationName: 'Paseo Fotográfico por Hobbiton & Jardines',
    country: 'Nueva Zelanda',
    countryFlag: '🏡',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Día de cuento de hadas: visita guiada en carrito accesible entre las 44 casitas de hobbit con chimeneas y huertos.',
    highlights: [
      'Visita al molino de agua de madera y el puente de piedra',
      'Degustación de bollos ingleses recién horneados con crema de leche',
      'Fotografía de los abuelos frente a la puerta redonda amarilla'
    ],
    attractions: [
      {
        id: 'hobbit-mill',
        name: 'Molino de Agua y Puente de Piedra de Hobbiton',
        category: 'landmark',
        description: 'Rueda hidráulica de madera girando sobre el arroyo de aguas cristalinas.',
        highlight: 'El reflejo del molino y los cisnes negros nadando',
        seniorTip: 'Carritos de golf eléctricos disponibles para visitantes mayores.',
        position3D: [-3, 1.2, 2]
      }
    ],
    foods: [
      {
        id: 'hobbit-scones',
        name: 'Scones Calientes con Nata y Mermelada de Frambuesa',
        category: 'sweet',
        description: 'Bollos tiernos salidos del horno de leña, perfumados con vainilla.',
        recommendedAt: 'The Shires Rest Cafe',
        staminaRecovery: 30,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-nature-peace',
      title: 'La Magia de la Naturaleza Neozelandesa',
      tradition: 'La armonía entre el campo trabajado con respeto y los bosques autóctonos.',
      description: 'Paz y quietud absoluta para el cuerpo y la mente.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 19, condition: 'Cálido y templado', windSpeedKmh: 10, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 5,
    date: '2026-10-24',
    displayDate: 'Sábado 24 Octubre 2026',
    regionId: 'rotorua',
    locationName: 'Rotorua: Valle Geotermal de Te Puia & Géiser Pōhutu',
    country: 'Nueva Zelanda (Bay of Plenty)',
    countryFlag: '🌋',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Visita a Rotorua, el corazón geotérmico y maorí del país. El colosal géiser Pōhutu expulsando agua a 30 metros y danzas Haka.',
    highlights: [
      'Erupción en directo del géiser Pōhutu con nubes de vapor caliente',
      'Laguna turquesa de aguas termales minerales con orillas de azufre dorado',
      'Ceremonia Haka y bienvenida maorí frente a la casa comunal tallada Wharenui'
    ],
    attractions: [
      {
        id: 'pohutu-geyser',
        name: 'Géiser Pōhutu & Piscinas de Lodo Hirviente',
        category: 'nature',
        description: 'El géiser más potente del hemisferio sur, activo hasta 20 veces al día.',
        highlight: 'El calor natural de las rocas geotérmicas donde los abuelos pueden sentarse a descansar las piernas',
        seniorTip: 'Miradores accesibles en madera con bancos térmicos naturales.',
        position3D: [0, 2.5, 0]
      },
      {
        id: 'maori-wharenui',
        name: 'Casa Comunal Sagrada (Wharenui de Te Puia)',
        category: 'culture',
        description: 'Edificio ceremonial de madera roja tallada a mano con ojos de concha Paua iridiscente.',
        highlight: 'Demostración del canto Waiata y danza ceremonial de bienvenida',
        seniorTip: 'Completamente accesible con rampa suave y asientos acolchados en primera fila.',
        position3D: [4, 1.8, -2]
      }
    ],
    foods: [
      {
        id: 'rotorua-hangi',
        name: 'Banquete Tradicional Hāngi Cocinado en Vapor Geotérmico',
        localName: 'Geothermal Hāngi',
        category: 'dish',
        description: 'Carnes tiernísimas de cerdo y cordero con kumara (batata dulce) cocinadas lentamente con el vapor natural de la tierra.',
        recommendedAt: 'Restaurante Pātaka Kai en Te Puia',
        staminaRecovery: 45,
        delightBonus: 40
      }
    ],
    culture: {
      id: 'cult-whakarewarewa',
      title: 'La Fuerza Geotérmica y el Espíritu Maorí',
      tradition: 'La tribu Te Arawa convive con las fumarolas desde hace siglos, utilizándolas para cocinar y calentarse.',
      description: 'Una conexión sagrada entre el ser humano y el fuego de la Madre Tierra (Papatūānuku).',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 17, condition: 'Vapor termal y cielo despejado', windSpeedKmh: 14, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 6,
    date: '2026-10-25',
    displayDate: 'Domingo 25 Octubre 2026',
    regionId: 'waiheke',
    locationName: 'Isla Waiheke: Viñedos, Olivares & Mar Esmeralda',
    country: 'Nueva Zelanda',
    countryFlag: '🍷',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Travesía en ferry por el Golfo de Hauraki hasta Waiheke. Almuerzo entre colinas de viñedos y cata de aceites de oliva.',
    highlights: [
      'Navegación apacible viendo aves marinas y el perfil de las islas',
      'Cata de vino Syrah y aceite de oliva virgen extra en terraza con vistas al mar',
      'Tarde de descanso previo al vuelo a la Isla Sur'
    ],
    attractions: [
      {
        id: 'waiheke-vineyards',
        name: 'Viñedos de Mudbrick & Cable Bay',
        category: 'culture',
        description: 'Fincas vitivinícolas de colinas onduladas frente al mar.',
        highlight: 'Jardines de lavanda y degustación guiada sentados en terraza',
        seniorTip: 'Traslado en minibús privado directo desde el muelle de Matiatia.',
        position3D: [0, 1.4, 0]
      }
    ],
    foods: [
      {
        id: 'waiheke-oysters',
        name: 'Ostras Frescas de Clevedon y Tabla de Quesos de Granja',
        category: 'dish',
        description: 'Ostras recién recolectadas con limón y quesos artesanos de leche de oveja.',
        recommendedAt: 'Restaurante Mudbrick',
        staminaRecovery: 35,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-wine',
      title: 'Cultura Vitivinícola Neozelandesa',
      tradition: 'Tradición de vinos de clima fresco respetando la pureza del suelo (Tiaki Promise).',
      description: 'Los abuelos aprenderán el arte del cuidado de la tierra en un entorno idílico.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 18, condition: 'Soleado y templado', windSpeedKmh: 12, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 7,
    date: '2026-10-26',
    displayDate: 'Lunes 26 Octubre 2026 (Festivo Nacional)',
    regionId: 'dunedin',
    locationName: 'Auckland → Dunedin (Vuelo 12:35 → 14:30)',
    country: 'Nueva Zelanda (Isla Sur)',
    countryFlag: '🏰',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    flight: FLIGHTS[1],
    summary: 'Vuelo de Air New Zealand (festivo nacional, Labour Day). Llegada a la histórica Dunedin y su célebre estación renacentista flamenca.',
    highlights: [
      'Vuelo escénico de 1h 55m sobrevolando los Alpes del Sur',
      'La Estación de Trenes de Dunedin, joya de basalto negro y piedra blanca de Oamaru',
      'Alojamiento en hotel señorial con chimeneas encendidas'
    ],
    attractions: [
      {
        id: 'dunedin-railway',
        name: 'Estación de Trenes de Dunedin (Gingerbread House)',
        category: 'landmark',
        description: 'La estación más fotografiada de Oceanía con su torre de reloj de 37 metros y vidrieras ornamentadas.',
        highlight: 'Mosaico de 750.000 azulejos Royal Doulton en el suelo del vestíbulo',
        seniorTip: 'Completamente llano en planta baja, con cafetería y tienda de recuerdos.',
        position3D: [0, 2.2, 0]
      }
    ],
    foods: [
      {
        id: 'cheese-roll',
        name: 'Dunedin Cheese Roll ("Southland Sushi")',
        localName: 'Southern Cheese Roll',
        category: 'snack',
        description: 'El bocado emblemático de la Isla Sur: pan tostado enrollado con queso fundido, cebolla y mantequilla dorada.',
        recommendedAt: 'Vogel St Kitchen',
        staminaRecovery: 25,
        delightBonus: 22
      }
    ],
    culture: {
      id: 'cult-scottish',
      title: 'Herencia Escocesa de Dunedin',
      tradition: 'Dunedin es el nombre gaélico de Edimburgo; se respira tradición de gaitas y lana merino.',
      description: 'Una atmósfera acogedora con chimeneas encendidas y casas señoriales.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 14, condition: 'Fresco y despejado', windSpeedKmh: 18, rainfallChancePct: 20 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 8,
    date: '2026-10-27',
    displayDate: 'Martes 27 Octubre 2026',
    regionId: 'dunedin',
    locationName: 'Península de Otago, Castillo Larnach & Albatros Reales',
    country: 'Nueva Zelanda',
    countryFlag: '🏰',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Paseo panorámico por la costa de Otago. Visita al único castillo de Nueva Zelanda y colonia de albatros gigantes.',
    highlights: [
      'Jardines del Castillo Larnach con vistas al puerto',
      'Avistamiento de albatros gigantes con alas de 3 metros en Taiaroa Head',
      'Té victoriano servido en porcelana fina'
    ],
    attractions: [
      {
        id: 'larnach-castle',
        name: 'Castillo Larnach & Jardines de Otago',
        category: 'landmark',
        description: 'Majestuosa mansión histórica de 1871 en lo alto de la península.',
        highlight: 'Salón de baile victoriano y colección botánica de plantas nativas',
        seniorTip: 'Acceso en coche hasta la puerta principal y salas principales en planta baja.',
        position3D: [0, 2.4, 0]
      },
      {
        id: 'albatross-colony',
        name: 'Royal Albatross Centre en Taiaroa Head',
        category: 'nature',
        description: 'La única colonia continental del mundo donde anidan albatros reales.',
        highlight: 'Observatorio acristalado interior para ver polluelos y vuelos majestuosos',
        seniorTip: 'Rampa cubierta sin frío ni viento directo exterior.',
        position3D: [6, 1.2, 4]
      }
    ],
    foods: [
      {
        id: 'high-tea-larnach',
        name: 'High Tea con Scones de Crema y Mermelada',
        category: 'sweet',
        description: 'Scones recién horneados, sándwiches de pepino y salmón, y té Earl Grey.',
        recommendedAt: 'Salón del Castillo Larnach',
        staminaRecovery: 30,
        delightBonus: 28
      }
    ],
    culture: {
      id: 'cult-wildlife-guard',
      title: 'Protección de la Fauna Austral',
      tradition: 'Respeto absoluto y silencio ceremonial para no perturbar las aves sagradas Toroa.',
      description: 'Una lección viva de conservación de la naturaleza en estado puro.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 13, condition: 'Viento costero tonificante', windSpeedKmh: 24, rainfallChancePct: 15 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 9,
    date: '2026-10-28',
    displayDate: 'Miércoles 28 Octubre 2026',
    regionId: 'queenstown',
    locationName: 'Dunedin → Queenstown: Lago Wakatipu & Los Remarkables',
    country: 'Nueva Zelanda',
    countryFlag: '🏔️',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Ruta hacia la capital alpina. Las imponentes cumbres dentadas de Los Remarkables reflejadas en el lago Wakatipu.',
    highlights: [
      'Paso por Cromwell, capital de los huertos frutales',
      'Desfiladero de Kawarau Gorge con aguas turquesas',
      'Llegada a Queenstown, la joya alpina de Nueva Zelanda'
    ],
    attractions: [
      {
        id: 'lake-wakatipu',
        name: 'Lago Wakatipu & Cordillera The Remarkables',
        category: 'scenic',
        description: 'Lago glacial de forma de relámpago con un misterioso ritmo de marea interior.',
        highlight: 'El reflejo perfecto de las cumbres nevadas en el agua cristalina',
        seniorTip: 'Paseo costero llano con miradores y cafeterías acogedoras.',
        position3D: [0, 1.8, 0]
      }
    ],
    foods: [
      {
        id: 'pinot-central',
        name: 'Copa de Pinot Noir de Bannockburn & Cordero Glaseado',
        category: 'dish',
        description: 'El célebre vino tinto de la región acompañado de cordero asado con romero y miel.',
        recommendedAt: 'Restaurante junto al lago en Queenstown',
        staminaRecovery: 35,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-tiaki',
      title: 'Tiaki Promise',
      tradition: 'Compromiso de cuidar Nueva Zelanda para las futuras generaciones.',
      description: 'La armonía entre turistas y naturaleza donde cada visitante es tratado como whānau (familia).',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 15, condition: 'Soleado entre montañas', windSpeedKmh: 10, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 10,
    date: '2026-10-29',
    displayDate: 'Jueves 29 Octubre 2026',
    regionId: 'queenstown',
    locationName: 'Queenstown: Teleférico Skyline & Vapor TSS Earnslaw',
    country: 'Nueva Zelanda',
    countryFlag: '🏔️',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Crucero histórico en el barco a vapor de 1912 TSS Earnslaw y subida en teleférico Skyline a la cima de Bob’s Peak.',
    highlights: [
      'Crucero a vapor por el lago Wakatipu escuchando música de piano',
      'Teleférico panorámico cerrado y confortable subiendo a Bob’s Peak',
      'Almuerzo gourmet BBQ en los jardines de Walter Peak'
    ],
    attractions: [
      {
        id: 'tss-earnslaw',
        name: 'Vapor Histórico TSS Earnslaw & Teleférico Skyline',
        category: 'landmark',
        description: 'El único barco de vapor a carbón en servicio regular en el hemisferio sur.',
        highlight: 'Paseo en cubierta con vistas a las montañas The Remarkables',
        seniorTip: 'Totalmente estable, con cubiertas interiores climatizadas y música en vivo.',
        position3D: [0, 1.5, 0]
      }
    ],
    foods: [
      {
        id: 'walter-peak-bbq',
        name: 'Almuerzo Campestre Walter Peak Farm',
        category: 'dish',
        description: 'Carnes locales asadas a fuego lento, ensaladas de la huerta y postres caseros de manzana.',
        recommendedAt: 'Walter Peak Homestead',
        staminaRecovery: 40,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-farming',
      title: 'Tradición Rural de las Altas Cumbres',
      tradition: 'Demostración de esquila de ovejas merinas y perros pastores trabajando con silbidos.',
      description: 'Una experiencia entrañable de la vida pionera en el campo de Nueva Zelanda.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 16, condition: 'Cielo azul despejado', windSpeedKmh: 12, rainfallChancePct: 10 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 11,
    date: '2026-10-30',
    displayDate: 'Viernes 30 Octubre 2026',
    regionId: 'milford',
    locationName: 'Milford Sound: Fiordos Colosales & Mitre Peak',
    country: 'Nueva Zelanda',
    countryFlag: '🌊',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'La gran jornada del viaje: Crucero panorámico bajo las imponentes paredes de granito y cascadas atronadoras de Milford Sound.',
    highlights: [
      'Mitre Peak elevándose 1.692 metros directo desde las aguas oscuras',
      'Cascadas de Stirling y Bowen cayendo a metros del barco',
      'Focas marinas descansando sobre las rocas de granito'
    ],
    attractions: [
      {
        id: 'mitre-peak',
        name: 'Mitre Peak & Cascadas de Milford Sound',
        category: 'nature',
        description: 'El fiordo glaciar más espectacular del planeta, esculpido durante millones de años.',
        highlight: 'Cascadas cristalinas que refrescan con su bruma a los visitantes',
        seniorTip: 'Crucero en catamarán amplio y estable con salón interior panorámico y café caliente.',
        position3D: [0, 3.6, 0]
      }
    ],
    foods: [
      {
        id: 'fiordland-salmon',
        name: 'Salmón Glaciar Ahumado de Fiordland',
        category: 'dish',
        description: 'Salmón criado en aguas frías y puras de montaña, acompañado de espárragos locales.',
        recommendedAt: 'Almuerzo a bordo de Milford Sound Cruise',
        staminaRecovery: 45,
        delightBonus: 40
      }
    ],
    culture: {
      id: 'cult-fiordland-myth',
      title: 'Piopiotahi: La Leyenda Maorí',
      tradition: 'Según la mitología, el semidiós Tū Te Rakiwhānoa talló los fiordos con su azuela ceremonial.',
      description: 'La majestuosidad y serenidad del lugar sobrecogen el espíritu.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 14, condition: 'Cascadas en su máximo esplendor', windSpeedKmh: 15, rainfallChancePct: 35 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 12,
    date: '2026-10-31',
    displayDate: 'Sábado 31 Octubre 2026',
    regionId: 'wanaka',
    locationName: 'Te Anau & Cuevas de Luciérnagas Subterráneas',
    country: 'Nueva Zelanda',
    countryFlag: '🌲',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Día tranquilo a orillas del lago Te Anau. Paseo silencioso en barca bajo una bóveda de miles de luciérnagas luminosas.',
    highlights: [
      'Paseo apacible a orillas del lago Te Anau',
      'Navegación subterránea en silencio total viendo la galaxia de luciérnagas (Glowworms)',
      'Cena reconfortante junto al fuego'
    ],
    attractions: [
      {
        id: 'te-anau-glowworms',
        name: 'Cuevas de Luciérnagas de Te Anau',
        category: 'nature',
        description: 'Sistema de cuevas subterráneas de 12.000 años iluminado naturalmente.',
        highlight: 'El cielo estrellado biológico que crea una sensación mágica',
        seniorTip: 'Pasarelas con barandillas y barca suave guiada por cable sin sacudidas.',
        position3D: [0, 1.2, 0]
      }
    ],
    foods: [
      {
        id: 'venison-pot',
        name: 'Estofado de Venado de Te Anau con Puré de Chirivía',
        category: 'dish',
        description: 'Guiso tierno de carne salvaje local cocinada a fuego lento con vino tinto y verduras de raíz.',
        recommendedAt: 'Redcliff Cafe Te Anau',
        staminaRecovery: 35,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-glowworm',
      title: 'Titiwai: Las Luces Vivientes',
      tradition: 'Llamadas titiwai en maorí ("luces reflejadas en el agua"), son consideradas guardianes espirituales.',
      description: 'Una atmósfera de calma y meditación única.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 15, condition: 'Fresco y calmo', windSpeedKmh: 8, rainfallChancePct: 20 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 13,
    date: '2026-11-01',
    displayDate: 'Domingo 1 Noviembre 2026',
    regionId: 'wanaka',
    locationName: 'Lago Wanaka: El Árbol Solitario & Cardrona',
    country: 'Nueva Zelanda',
    countryFlag: '🌲',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Excursión a Wanaka. Fotografía del célebre árbol que brota dentro del lago y visita a la histórica taberna de Cardrona (1863).',
    highlights: [
      'Foto icónica de "That Wanaka Tree" sumergido en el agua',
      'Paseo relajado por el bulevar del lago Wanaka',
      'Cardrona Hotel, una de las tabernas históricas más antiguas con chimenea de piedra'
    ],
    attractions: [
      {
        id: 'wanaka-tree',
        name: 'El Árbol Solitario de Wanaka (That Wanaka Tree)',
        category: 'scenic',
        description: 'Un sauce sauceño que crece milagrosamente sumergido en las aguas cristalinas del lago.',
        highlight: 'Fondo de los picos nevados del Parque Nacional Mount Aspiring',
        seniorTip: 'Camino de gravilla fina completamente plano desde el estacionamiento.',
        position3D: [0, 1.0, 0]
      }
    ],
    foods: [
      {
        id: 'cardrona-scones',
        name: 'Café Caliente y Tarta de Nueces en Cardrona',
        category: 'sweet',
        description: 'Pastelería casera servida junto a la chimenea histórica del Cardrona Hotel.',
        recommendedAt: 'Historic Cardrona Pub',
        staminaRecovery: 25,
        delightBonus: 25
      }
    ],
    culture: {
      id: 'cult-pioneers',
      title: 'La Fiebre del Oro de Otago',
      tradition: 'La época de los pioneros mineros de 1860 que forjaron los pueblos de montaña.',
      description: 'Historias fascinantes de resiliencia y búsqueda de fortuna.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 17, condition: 'Soleado y límpido', windSpeedKmh: 10, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 14,
    date: '2026-11-02',
    displayDate: 'Lunes 2 Noviembre 2026',
    regionId: 'wanaka',
    locationName: 'Monte Cook / Aoraki & Lago Turquesa Pukaki',
    country: 'Nueva Zelanda',
    countryFlag: '🌲',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Ruta hacia el corazón de los Alpes del Sur. El agua turquesa lechosa del lago Pukaki y la montaña más alta de Nueva Zelanda.',
    highlights: [
      'Mirador del Monte Cook (3.724 m) cubierto de nieve perpetua',
      'El asombroso color azul turquesa del lago Pukaki producido por la harina de roca glaciar',
      'Visita al Centro Edmund Hillary en The Hermitage Hotel'
    ],
    attractions: [
      {
        id: 'mount-cook',
        name: 'Aoraki / Monte Cook',
        category: 'nature',
        description: 'El pico más alto de Oceanía, donde Sir Edmund Hillary entrenó para conquistar el Everest.',
        highlight: 'El mirador de Kea Point con vista al glaciar Mueller',
        seniorTip: 'Excelente mirador interior con calefacción y telescopios en el Hermitage.',
        position3D: [3, 4.5, -4]
      }
    ],
    foods: [
      {
        id: 'pukaki-salmon',
        name: 'Sashimi de Salmón Alpino de Mount Cook',
        category: 'dish',
        description: 'El salmón de agua dulce más puro del mundo criado en los canales de deshielo alpino.',
        recommendedAt: 'Mt Cook Alpine Salmon Shop',
        staminaRecovery: 35,
        delightBonus: 38
      }
    ],
    culture: {
      id: 'cult-aoraki',
      title: 'Aoraki: El Ancestro Sagrado',
      tradition: 'Para los maoríes Ngāi Tahu, Aoraki es el ancestro sagrado personificado en montaña.',
      description: 'Una presencia sobrecogedora que transmite paz y reverencia.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 12, condition: 'Cielo alpino brillante', windSpeedKmh: 15, rainfallChancePct: 10 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 15,
    date: '2026-11-03',
    displayDate: 'Martes 3 Noviembre 2026',
    regionId: 'wanaka',
    locationName: 'Lago Tekapo & Iglesia del Buen Pastor',
    country: 'Nueva Zelanda',
    countryFlag: '🌲',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Parada en el lago Tekapo. Visita a la pequeña iglesia de piedra con ventanal al lago y campos de altramuces florecidos.',
    highlights: [
      'La ventana del altar de la Iglesia del Buen Pastor enmarcando el lago',
      'Termas Tekapo Springs para un baño relajante con vistas',
      'Cielo nocturno clasificado como Reserva Internacional de Cielo Oscuro'
    ],
    attractions: [
      {
        id: 'good-shepherd',
        name: 'Iglesia del Buen Pastor (Church of the Good Shepherd)',
        category: 'landmark',
        description: 'Construida en 1935 con piedras recolectadas a mano sin romper ninguna.',
        highlight: 'La ventana panorámica que reemplaza cualquier retablo tradicional',
        seniorTip: 'Acceso directo a nivel de calle con sendero de fácil pisada.',
        position3D: [0, 1.2, 0]
      }
    ],
    foods: [
      {
        id: 'lamb-shank-tekapo',
        name: 'Jarrete de Cordero Confitado con Miel y Romero',
        category: 'dish',
        description: 'Carne tan tierna que se deshace con el tenedor, cocinada durante 8 horas.',
        recommendedAt: 'Mackenzies Cafe Bar & Grill',
        staminaRecovery: 40,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-dark-sky',
      title: 'Santuario de Estrellas del Mackenzie',
      tradition: 'Uno de los cielos más limpios del planeta, protegido por ley contra contaminación lumínica.',
      description: 'Contemplar la Cruz del Sur y la Vía Láctea como nunca antes en la vida.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 16, condition: 'Cielo despejado estrellado', windSpeedKmh: 10, rainfallChancePct: 5 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 16,
    date: '2026-11-04',
    displayDate: 'Miércoles 4 Noviembre 2026',
    regionId: 'christchurch',
    locationName: 'Christchurch: Paseos en Barca por el Río Avon & Jardines',
    country: 'Nueva Zelanda',
    countryFlag: '🛶',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Llegada a Christchurch. Paseo en barca tradicional estilo "punting" por el sereno río Avon, sauces llorones y tranvía patrimonial.',
    highlights: [
      'Punt on the Avon: paseo en barca con remero de época con sombrero de paja',
      'Rosaleda y árboles centenarios de los Jardines Botánicos',
      'Paseo en el tranvía histórico restaurado por el centro'
    ],
    attractions: [
      {
        id: 'avon-river',
        name: 'Paseo en Barca por el Río Avon & Jardines Botánicos',
        category: 'scenic',
        description: 'Navegación apacible rodeada de sauces llorones y flores de primavera.',
        highlight: 'Sensación de flotar en un cuadro impresionista inglés',
        seniorTip: 'Se embarca cómodamente sentado con mantas de terciopelo incluidas.',
        position3D: [0, 0.5, 2]
      },
      {
        id: 'chch-tram',
        name: 'Tranvía Histórico de Christchurch',
        category: 'landmark',
        description: 'Tranvía eléctrico patrimonial que recorre los puntos clave de la ciudad.',
        highlight: 'Ideal para descansar las piernas mientras se conoce la historia de la ciudad',
        seniorTip: 'Billetes de subida y bajada ilimitada con escalón accesible.',
        position3D: [3, 0.8, -2]
      }
    ],
    foods: [
      {
        id: 'canterbury-apple',
        name: 'Tarta Templada de Manzana de Canterbury con Helado Hokey Pokey',
        category: 'sweet',
        description: 'El célebre helado neozelandés de vainilla con tropezones crujientes de toffee honeycomb.',
        recommendedAt: 'Curators House Restaurant',
        staminaRecovery: 30,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-resilience',
      title: 'El Espíritu Resiliente de Christchurch',
      tradition: 'La capacidad de renovación de la ciudad combinando patrimonio histórico con arquitectura de vanguardia.',
      description: 'Ejemplo mundial de optimismo y renacimiento cívico.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 18, condition: 'Primaveral suave', windSpeedKmh: 12, rainfallChancePct: 10 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 17,
    date: '2026-11-05',
    displayDate: 'Jueves 5 Noviembre 2026',
    regionId: 'christchurch',
    locationName: 'Península de Banks & Pueblo Francés de Akaroa',
    country: 'Nueva Zelanda',
    countryFlag: '🛶',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Excursión a Akaroa, el único asentamiento histórico fundado por colonos franceses en Nueva Zelanda.',
    highlights: [
      'Calles con nombres franceses como Rue Lavaud y panaderías artesanales',
      'Avistamiento de delfines de Héctor (los más pequeños del mundo) en la bahía',
      'Quesería artesanal de Barrys Bay'
    ],
    attractions: [
      {
        id: 'akaroa-village',
        name: 'Pueblo Histórico de Akaroa',
        category: 'culture',
        description: 'Encantadora villa enclavada en el cráter inundado de un volcán extinto.',
        highlight: 'Casas de madera con persianas de colores y terrazas de café',
        seniorTip: 'Paseo totalmente llano a lo largo de la bahía.',
        position3D: [0, 0.7, 0]
      }
    ],
    foods: [
      {
        id: 'french-crepes',
        name: 'Crepes Suzette & Café Au Lait en Akaroa',
        category: 'sweet',
        description: 'Crepes finas caramelizadas con mantequilla de naranja y licor Grand Marnier.',
        recommendedAt: 'The Little Bistro Akaroa',
        staminaRecovery: 25,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-french-nz',
      title: 'El Legado Francés de Aotearoa',
      tradition: 'Fusión de la elegancia culinaria francesa con los productos de la tierra neozelandesa.',
      description: 'Una sorpresa europea en las antípodas del mundo.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 19, condition: 'Soleado y apacible', windSpeedKmh: 10, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 18,
    date: '2026-11-06',
    displayDate: 'Viernes 6 Noviembre 2026',
    regionId: 'christchurch',
    locationName: 'Christchurch & Preparativos para Fiji',
    country: 'Nueva Zelanda',
    countryFlag: '🛶',
    timezone: 'NZDT (UTC+13)',
    utcOffset: 13,
    summary: 'Día de descanso reparador en Christchurch. Compras de recuerdos de lana merino y preparación para la etapa tropical.',
    highlights: [
      'Visita al Riverside Market con productos artesanos',
      'Descanso en el hotel y repaso del itinerario de vuelos',
      'Cena de despedida de Nueva Zelanda'
    ],
    attractions: [
      {
        id: 'riverside-market',
        name: 'Riverside Market de Christchurch',
        category: 'culture',
        description: 'Mercado cubierto vibrante con puestos de chocolate, miel y artesanías.',
        highlight: 'Atmósfera animada con música suave en vivo',
        seniorTip: 'Totalmente climatizado con ascensores y asientos de descanso.',
        position3D: [0, 0.8, 0]
      }
    ],
    foods: [
      {
        id: 'manuka-icecream',
        name: 'Helado de Miel de Manuka UMF 15+ y Lavanda',
        category: 'sweet',
        description: 'Delicadeza cremosa con propiedades reconstituyentes para la garganta y vitalidad.',
        recommendedAt: 'Riverside Market Artisans',
        staminaRecovery: 30,
        delightBonus: 25
      }
    ],
    culture: {
      id: 'cult-whanau',
      title: 'Poroporoaki: La Despedida Agradecida',
      tradition: 'Costumbre maorí de dar gracias al lugar que nos ha acogido con salud.',
      description: 'Nueva Zelanda queda guardada en el corazón de los abuelos.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 18, condition: 'Agradable', windSpeedKmh: 14, rainfallChancePct: 15 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 19,
    date: '2026-11-07',
    displayDate: 'Sábado 7 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Christchurch → Nadi (Fiji) (Vuelo 14:10 → 17:15)',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    flight: FLIGHTS[2],
    summary: 'Vuelo directo de Fiji Airways FJ450 de Christchurch a Nadi (4h 05m). Llegada al paraíso tropical de aguas turquesas.',
    highlights: [
      'Bienvenida tradicional con guitarristas locales cantando "Bula Maleya" al aterrizar',
      'Collares de flores naturales salusalu para los abuelos',
      'Traslado al resort costero en Denarau Island'
    ],
    attractions: [
      {
        id: 'denarau-marina',
        name: 'Puerto de Denarau & Paseo de Palmeras',
        category: 'landmark',
        description: 'La puerta de entrada a los archipiélagos Mamanuca y Yasawa con jardines tropicales.',
        highlight: 'Atardecer púrpura sobre el mar de Fiji',
        seniorTip: 'Senderos llanos y carritos de golf de cortesía para moverse por el complejo.',
        position3D: [0, 0.6, 1]
      }
    ],
    foods: [
      {
        id: 'kokoda-dish',
        name: 'Kokoda Tradicional de Fiji',
        localName: 'Kokoda (pronunciado ko-kón-da)',
        category: 'dish',
        description: 'Pescado blanco marinado en zumo de lima fresca con leche de coco recién rallada, tomate y cebolleta.',
        recommendedAt: 'Restaurante del resort frente al mar',
        staminaRecovery: 35,
        delightBonus: 40
      }
    ],
    culture: {
      id: 'cult-bula',
      title: 'El Espíritu "Bula" & Fijian Time',
      tradition: 'Bula significa "vida"; se pronuncia con una sonrisa radiante hacia todo el mundo.',
      description: 'El reloj se detiene: aquí no hay prisa, solo relajación profunda.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 28, condition: 'Cálido tropical y brisa marina', windSpeedKmh: 16, rainfallChancePct: 10 },
    recommendedRestTimeHours: 7
  },
  {
    dayNumber: 20,
    date: '2026-11-08',
    displayDate: 'Domingo 8 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Isla Denarau & Jardín del Gigante Dormido',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Mañana de descanso en piscina climatizada. Por la tarde, visita a los jardines de orquídeas del actor Raymond Burr.',
    highlights: [
      'Colección de más de 2.000 variedades de orquídeas asiáticas y polinesias',
      'Senderos a la sombra de grandes helechos y estanques de nenúfares',
      'Degustación de zumo de mango y maracuyá recién exprimido'
    ],
    attractions: [
      {
        id: 'sleeping-giant',
        name: 'Garden of the Sleeping Giant',
        category: 'nature',
        description: 'Fascinante jardín botánico ubicado al pie de la montaña con forma de gigante durmiente.',
        highlight: 'Pasarelas de madera techadas y bancos rodeados de flores fragantes',
        seniorTip: 'Paseo accesible con descansos sombreados y personal atento.',
        position3D: [-4, 1.8, -2]
      }
    ],
    foods: [
      {
        id: 'fresh-coconut',
        name: 'Agua de Coco Bu Fresca',
        localName: 'Bu (Coco verde)',
        category: 'drink',
        description: 'Abierto en el momento con pajita de bambú, repleto de electrolitos naturales y frescor.',
        recommendedAt: 'Puesto artesano del jardín',
        staminaRecovery: 25,
        delightBonus: 25
      }
    ],
    culture: {
      id: 'cult-lovo-prep',
      title: 'El Lovo: Cocina Bajo Tierra',
      tradition: 'La técnica ancestral fijiana de cocinar en horno de tierra con piedras volcánicas calientes.',
      description: 'Los abuelos verán cómo se envuelven los alimentos en hojas de plátano.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 29, condition: 'Sol tropical radiante', windSpeedKmh: 14, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 21,
    date: '2026-11-09',
    displayDate: 'Lunes 9 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Islas Mamanuca (Crucero Catamarán South Sea)',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Excursión marítima en catamarán de alta estabilidad por las islas de coral de Mamanuca.',
    highlights: [
      'Visita al barco semisumergible con ventanas submarinas para ver peces de colores sin mojarse',
      'Aguas turquesas transparentes de ensueño',
      'Música de ukelele fijiano en vivo durante la travesía'
    ],
    attractions: [
      {
        id: 'mamanuca-reef',
        name: 'Arrecife de Coral de Mamanuca',
        category: 'nature',
        description: 'Atolón coralino habitado por tortugas marinas, peces payaso y estrellas de mar azules.',
        highlight: 'Observatorio submarino climatizado accesible en escalerilla suave',
        seniorTip: 'El catamarán South Sea Cruises es grande y minimiza el balanceo.',
        position3D: [5, 0.3, 3]
      }
    ],
    foods: [
      {
        id: 'lovo-feast',
        name: 'Banquete Lovo de Pollo y Taro con Crema de Coco',
        category: 'dish',
        description: 'Pollo tierno cocinado durante 3 horas sobre piedras volcánicas, acompañado de raíz de dalo.',
        recommendedAt: 'South Sea Island BBQ',
        staminaRecovery: 40,
        delightBonus: 38
      }
    ],
    culture: {
      id: 'cult-kava',
      title: 'Ceremonia Tradicional de Kava (Yaqona)',
      tradition: 'El ritual de hospitalidad fijiano: se ofrece la bebida en una cáscara de coco (bilo).',
      description: 'Se aplaude una vez antes de beber y tres veces después diciendo ¡Bula! Produce una relajación suave y placentera.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 28, condition: 'Cálido y brisa del océano', windSpeedKmh: 16, rainfallChancePct: 15 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 22,
    date: '2026-11-10',
    displayDate: 'Martes 10 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Coral Coast & Aguas Termales de Sabeto',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Día de bienestar termal: Baños de lodo terapéutico natural y piscinas de aguas termales volcánicas en Sabeto.',
    highlights: [
      'Tratamiento de lodo mineral rejuvenecedor para articulaciones',
      'Baño en cuatro piscinas termales de temperatura graduada',
      'Masaje fijiano tradicional con aceite de coco virgen (Bobo)'
    ],
    attractions: [
      {
        id: 'sabeto-mud-pools',
        name: 'Termas Naturales y Lodos de Sabeto',
        category: 'landmark',
        description: 'Manantiales termales geotérmicos rodeados de bosque tropical.',
        highlight: 'Sensación de alivio y ligereza en piernas y espalda',
        seniorTip: 'Rampas de acceso gradual y aguas a 36°C-38°C ideales para personas mayores.',
        position3D: [-3, 0.8, -4]
      }
    ],
    foods: [
      {
        id: 'papaya-lime',
        name: 'Papaya Roja Dulce con Zumo de Lima y Miel',
        category: 'snack',
        description: 'Fruta recién recogida de la selva con toque cítrico refrescante.',
        recommendedAt: 'Cafetería de Sabeto',
        staminaRecovery: 30,
        delightBonus: 28
      }
    ],
    culture: {
      id: 'cult-bobo-massage',
      title: 'El Masaje Bobo Fijiano',
      tradition: 'Técnica curativa transmitida de abuelas a nietas para revitalizar la energía vital.',
      description: 'Pura relajación y bienestar para el cuerpo y el alma.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 27, condition: 'Soleado con brisa', windSpeedKmh: 12, rainfallChancePct: 5 },
    recommendedRestTimeHours: 7
  },
  {
    dayNumber: 23,
    date: '2026-11-11',
    displayDate: 'Miércoles 11 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Costa de Coral & Mercado de Artesanías de Sigatoka',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Viaje a Sigatoka, el valle ensaladera de Fiji. Mercado local de frutas exóticas y alfarería tradicional de Lapita.',
    highlights: [
      'Paseo por el colorido mercado municipal de Sigatoka',
      'Taller de alfarería con arcilla de río de la aldea Lawai',
      'Vistas a las dunas de arena fósil de Sigatoka'
    ],
    attractions: [
      {
        id: 'sigatoka-market',
        name: 'Mercado de Sigatoka & Aldea de Lawai',
        category: 'culture',
        description: 'El corazón agrícola y cultural de la isla de Viti Levu.',
        highlight: 'Demostración de alfarería moldeada a mano sin torno',
        seniorTip: 'Puestos ordenados a nivel de suelo con pasillos anchos.',
        position3D: [3, 0.9, -3]
      }
    ],
    foods: [
      {
        id: 'rou-rou',
        name: 'Rourou: Crema de Hojas de Taro en Leche de Coco',
        localName: 'Rourou Soup',
        category: 'dish',
        description: 'Sopa espesa y aterciopelada similar a las espinacas a la crema pero con el aroma dulce del coco.',
        recommendedAt: 'Restaurante junto al río Sigatoka',
        staminaRecovery: 35,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-mats',
      title: 'Tejido Tradicional de Esteras (Ibe)',
      tradition: 'Esteras tejidas con hojas de pandanus que las abuelas fijianas preparan para eventos importantes.',
      description: 'Una artesanía de paciencia y devoción familiar.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 29, condition: 'Soleado templado', windSpeedKmh: 15, rainfallChancePct: 10 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 24,
    date: '2026-11-12',
    displayDate: 'Jueves 12 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Paseo en Barco Tradicional Drua',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Navegación apacible a bordo de una réplica de canoa sagrada de doble casco Drua con vela tejida.',
    highlights: [
      'Navegación silenciosa impulsada por el viento alisio',
      'Historias de los grandes navegantes polinesios que se guiaban por las constelaciones',
      'Tiempo de lectura y baño suave en laguna poco profunda'
    ],
    attractions: [
      {
        id: 'drua-sailing',
        name: 'Canoa Tradicional Drua Experience',
        category: 'landmark',
        description: 'Las legendarias embarcaciones polinesias de madera tallada.',
        highlight: 'Paz absoluta sobre aguas turquesas sin ruido de motor',
        seniorTip: 'Tripulación atenta que ayuda a embarcar y desembarcar con escalón suave.',
        position3D: [0, 0.3, 4]
      }
    ],
    foods: [
      {
        id: 'tropical-fruit-platter',
        name: 'Bandeja de Frutas Tropicales con Piña de Fiji y Plátanos Dulces',
        category: 'snack',
        description: 'Piña dulce como miel y plátanos baby de sabor concentrado.',
        recommendedAt: 'A bordo de la Drua',
        staminaRecovery: 25,
        delightBonus: 28
      }
    ],
    culture: {
      id: 'cult-wayfinding',
      title: 'Navegación Estelar Polinesia',
      tradition: 'La sabiduría ancestral de orientarse por las olas, las aves y las estrellas.',
      description: 'Una conexión íntima con el océano pacífico.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 28, condition: 'Brisa refrescante', windSpeedKmh: 18, rainfallChancePct: 5 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 25,
    date: '2026-11-13',
    displayDate: 'Viernes 13 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Templo Hindú Sri Siva Subramaniya & Nadi',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Visita cultural al templo hindú más grande del hemisferio sur en Nadi, famoso por sus tallas policromadas de la India.',
    highlights: [
      'Fachada con esculturas de deidades talladas por artesanos de Tamil Nadu',
      'Ambiente pacífico con incienso de sándalo',
      'Almuerzo vegetariano indio-fijiano'
    ],
    attractions: [
      {
        id: 'hindu-temple-nadi',
        name: 'Templo Sri Siva Subramaniya Swami',
        category: 'culture',
        description: 'El templo multicolor más majestuoso del Pacífico.',
        highlight: 'Frescos en el techo que narran epopeyas sagradas',
        seniorTip: 'Se camina descalzo sobre suelo de mármol fresco y limpio.',
        position3D: [-2, 1.2, 0]
      }
    ],
    foods: [
      {
        id: 'fiji-curry',
        name: 'Curry Indo-Fijiano de Calabaza y Roti recién hecho',
        category: 'dish',
        description: 'Guiso aromático con especias suaves no picantes y pan plano caliente para mojar.',
        recommendedAt: 'Curry House Nadi',
        staminaRecovery: 35,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-harmony',
      title: 'Convivencia Multicultural de Fiji',
      tradition: 'La armoniosa coexistencia entre la cultura melanesia indígena y la herencia india de más de un siglo.',
      description: 'Respeto mutuo y festivales compartidos.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 30, condition: 'Cálido y soleado', windSpeedKmh: 12, rainfallChancePct: 15 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 26,
    date: '2026-11-14',
    displayDate: 'Sábado 14 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Día de Spa & Relajación en Laguna',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Día dedicado a la recarga de energía física y vital en el resort. Paseo descalzo por la arena y siesta bajo las palmeras.',
    highlights: [
      'Baño apacible en aguas saladas tibias sin oleaje',
      'Lectura frente al arrecife con café helado',
      'Sesión de yoga suave en silla orientada a la respiración'
    ],
    attractions: [],
    foods: [
      {
        id: 'mango-smoothie',
        name: 'Batido Helado de Mango y Maracuyá de Fiji',
        category: 'drink',
        description: '100% fruta fresca triturada con hielo picado.',
        recommendedAt: 'Bar de la piscina',
        staminaRecovery: 30,
        delightBonus: 25
      }
    ],
    culture: {
      id: 'cult-island-peace',
      title: 'Sega Na Lega (Sin Preocupaciones)',
      tradition: 'El lema fijiano equivalente al "Hakuna Matata": no hay estrés que no se disuelva con una sonrisa.',
      description: 'El mejor regalo de salud para los abuelos.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 28, condition: 'Brisa apacible', windSpeedKmh: 14, rainfallChancePct: 10 },
    recommendedRestTimeHours: 8
  },
  {
    dayNumber: 27,
    date: '2026-11-15',
    displayDate: 'Domingo 15 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Aldea Tradicional Navala',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Excursión a Navala, la última aldea de Fiji construida 100% con cabañas bures tradicionales con tejados de paja.',
    highlights: [
      'Más de 200 bures idénticos construidos con bambú y madera autóctona',
      'Bienvenida del jefe de la aldea con bendición y cantos corales infantiles',
      'Paisaje de colinas verdes escarpadas que recuerdan a un cuento'
    ],
    attractions: [
      {
        id: 'navala-village',
        name: 'Aldea Patrimonial de Navala',
        category: 'culture',
        description: 'La joya arquitectónica indígena preservada con orgullo comunal.',
        highlight: 'El coro de niños cantando a cuatro voces',
        seniorTip: 'Se visita en coche con llegada directa al centro comunal.',
        position3D: [-5, 1.5, 2]
      }
    ],
    foods: [
      {
        id: 'tavioka-honey',
        name: 'Vakalavalava: Pastel de Yuca Dulce con Coco Rallado',
        category: 'sweet',
        description: 'Dulce tradicional cocido al vapor en hojas de plátano, suave y muy reconfortante.',
        recommendedAt: 'Navala Community Hall',
        staminaRecovery: 30,
        delightBonus: 32
      }
    ],
    culture: {
      id: 'cult-sevusevu',
      title: 'El Ritual Sevusevu',
      tradition: 'Ofrenda formal de raíz de Yaqona al jefe de la aldea pidiendo permiso para entrar.',
      description: 'Una muestra de profundo respeto que abre todas las puertas con honores.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 27, condition: 'Colinas frescas', windSpeedKmh: 12, rainfallChancePct: 20 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 28,
    date: '2026-11-16',
    displayDate: 'Lunes 16 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Península de Nadi & Museo de Artesanía',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Día tranquilo eligiendo recuerdos para la familia: cuencos de madera de Vesi tallados a mano y perlas negras de Fiji.',
    highlights: [
      'Mercado de artesanos de Nadi Handicraft Centre',
      'Explicación del significado de los símbolos geométricos de la tela Masi',
      'Cena al atardecer frente al puerto'
    ],
    attractions: [],
    foods: [
      {
        id: 'grilled-mahimahi',
        name: 'Filete de Mahi-Mahi a la Plancha con Salsa de Vainilla',
        category: 'dish',
        description: 'Pescado fresco del día con salsa emulsionada de vainilla silvestre de Fiji.',
        recommendedAt: 'Cardo’s Steak & Seafood Denarau',
        staminaRecovery: 35,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-masi',
      title: 'Tela Masi (Tapa Cloth)',
      tradition: 'Tela hecha con la corteza interior de la morera de papel teñida con tintes vegetales de barro y carbón.',
      description: 'Un regalo sagrado de bendición matrimonial y familiar.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 29, condition: 'Soleado', windSpeedKmh: 14, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 29,
    date: '2026-11-17',
    displayDate: 'Martes 17 Noviembre 2026',
    regionId: 'fiji',
    locationName: 'Víspera de Partida & Ceremonia Isa Lei',
    country: 'Fiji',
    countryFlag: '🇫🇯',
    timezone: 'FJT (UTC+12)',
    utcOffset: 12,
    summary: 'Último día completo en Fiji. El personal del resort canta la emocionante canción de despedida Isa Lei.',
    highlights: [
      'La conmovedora balada "Isa Lei" que conmueve hasta las lágrimas a todos los viajeros',
      'Pesaje y organización de maletas (30 kg por persona para el vuelo a Singapur)',
      'Brindis al atardecer en la playa'
    ],
    attractions: [],
    foods: [
      {
        id: 'pineapple-pie',
        name: 'Tarta Fijiana de Piña Caramelizada con Crema',
        category: 'sweet',
        description: 'Tarta casera con trozos dorados de piña y masa hojaldrada quebradiza.',
        recommendedAt: 'Denarau Bakery',
        staminaRecovery: 25,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-isa-lei',
      title: 'Isa Lei: El Adiós del Paraíso',
      tradition: 'Himno de despedida fijiano: "Isa, isa vulagi lasa dina..." (Oh, huésped tan querido, nunca te olvidaremos).',
      description: 'Un momento inolvidable grabado para siempre en la memoria.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 28, condition: 'Atardecer despejado', windSpeedKmh: 10, rainfallChancePct: 5 },
    recommendedRestTimeHours: 7
  },
  {
    dayNumber: 30,
    date: '2026-11-18',
    displayDate: 'Miércoles 18 Noviembre 2026',
    regionId: 'singapore',
    locationName: 'Nadi → En Vuelo hacia Singapur (Vuelo 22:20)',
    country: 'En Tránsito Internacional',
    countryFlag: '✈️',
    timezone: 'FJT (UTC+12) → SGT (UTC+8)',
    utcOffset: 8,
    flight: FLIGHTS[3],
    summary: 'Día de descanso en Fiji hasta la tarde. Traslado al aeropuerto de Nadi para tomar el vuelo Fiji Airways FJ363 rumbo a Singapur.',
    highlights: [
      'Check-in prioritario con 30 kg por persona (Ref: DZPTWK)',
      'Vuelo nocturno de 10h 35m rumbo a Asia',
      'Aterrizaje en el galardonado Aeropuerto Changi a las 04:55 del jueves'
    ],
    attractions: [],
    foods: [
      {
        id: 'fiji-water',
        name: 'Agua Artesiana de Fiji y Té Caliente a Bordo',
        category: 'drink',
        description: 'La célebre agua mineral pura de los acuíferos volcánicos de Viti Levu.',
        recommendedAt: 'Fiji Airways FJ363',
        staminaRecovery: 20,
        delightBonus: 15
      }
    ],
    culture: {
      id: 'cult-sky-cross',
      title: 'Travesía hacia el Sudeste Asiático',
      tradition: 'El vuelo sobrevuela el mar del Coral, Papúa Nueva Guinea y el mar de Java.',
      description: 'Transición del ritmo apacible del Pacífico a la metrópolis más vanguardista del mundo.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 26, condition: 'Vuelo nocturno sereno', windSpeedKmh: 35, rainfallChancePct: 0 },
    recommendedRestTimeHours: 8
  },
  {
    dayNumber: 31,
    date: '2026-11-19',
    displayDate: 'Jueves 19 Noviembre 2026',
    regionId: 'singapore',
    locationName: 'Singapur (Llegada 04:55) & Marina Bay',
    country: 'Singapur',
    countryFlag: '🇸🇬',
    timezone: 'SGT (UTC+8)',
    utcOffset: 8,
    summary: 'Llegada al paraíso futurista de Singapur. Descanso reparador por la mañana y paseo por Marina Bay y Gardens by the Bay.',
    highlights: [
      'La cascada interior más alta del mundo en Jewel Changi Airport',
      'Cúpulas bioclimáticas Flower Dome y Cloud Forest con aire acondicionado fresco',
      'Espectáculo de luces y música Garden Rhapsody en los Supertrees al anochecer'
    ],
    attractions: [
      {
        id: 'supertree-grove',
        name: 'Gardens by the Bay & Supertree Grove',
        category: 'landmark',
        description: 'Estructuras verticales de 50 metros cubiertas de orquídeas y helechos con pasarela elevada OCBC Skyway.',
        highlight: 'El espectáculo de luces de las 19:45 bajo los gigantes botánicos',
        seniorTip: 'Completamente pavimentado, ascensores en todos los niveles y alquiler de scooters eléctricos si se desea.',
        position3D: [3, 2.5, 1]
      },
      {
        id: 'marina-bay-sands',
        name: 'Marina Bay Sands & Merlion Park',
        category: 'landmark',
        description: 'El icono de Singapur con sus tres torres y el parque flotante SkyPark.',
        highlight: 'La estatua del Merlion expulsando agua hacia la bahía con los rascacielos de fondo',
        seniorTip: 'Paseo perimetral 100% accesible sin barreras arquitectónicas.',
        position3D: [-3, 3.8, -2]
      }
    ],
    foods: [
      {
        id: 'hainanese-chicken-rice',
        name: 'Arroz con Pollo de Hainan (Hainanese Chicken Rice)',
        localName: 'Hainanese Chicken Rice',
        category: 'dish',
        description: 'El plato nacional: pollo cocido tiernísimo sobre arroz aromatizado con caldo, jengibre y hojas de pandan, acompañado de salsas.',
        recommendedAt: 'Maxwell Food Centre (Puesto Tian Tian)',
        staminaRecovery: 40,
        delightBonus: 40
      }
    ],
    culture: {
      id: 'cult-hawker',
      title: 'Cultura Hawker UNESCO',
      tradition: 'La cultura de los centros de comida callejera de Singapur fue declarada Patrimonio de la Humanidad.',
      description: 'Seguridad alimentaria número 1 del mundo, limpieza impecable y platos de calidad Michelin a precio accesible.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 29, condition: 'Cálido y húmedo con interiores refrigerados', windSpeedKmh: 8, rainfallChancePct: 25 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 32,
    date: '2026-11-20',
    displayDate: 'Viernes 20 Noviembre 2026',
    regionId: 'singapore',
    locationName: 'Chinatown, Jardín Botánico & Crucero por el Río',
    country: 'Singapur',
    countryFlag: '🇸🇬',
    timezone: 'SGT (UTC+8)',
    utcOffset: 8,
    summary: 'Visita al Templo de la Reliquia del Diente de Buda, paseo por los Jardines Botánicos UNESCO y crucero nocturno por el río.',
    highlights: [
      'Templo de Buda con su estupa de oro de 420 kg en Chinatown',
      'Jardín Nacional de Orquídeas con más de 60.000 ejemplares',
      'Crucero en barcaza eléctrica tradicional (bumboat) desde Clarke Quay'
    ],
    attractions: [
      {
        id: 'singapore-river-cruise',
        name: 'Crucero por el Río Singapur & Clarke Quay',
        category: 'scenic',
        description: 'Paseo en barco tradicional de madera convertido en propulsión eléctrica silenciosa.',
        highlight: 'Ver la iluminación nocturna de los puentes históricos Anderson y Cavenagh',
        seniorTip: 'Se embarca por rampa con barandilla y asientos acolchados.',
        position3D: [0, 0.4, 3]
      }
    ],
    foods: [
      {
        id: 'kaya-toast',
        name: 'Desayuno Tradicional Kaya Toast con Café Kopi',
        category: 'snack',
        description: 'Tostadas crujientes con mermelada de coco (kaya) y mantequilla, huevos pasados por agua y salsa de soja oscura.',
        recommendedAt: 'Ya Kun Kaya Toast',
        staminaRecovery: 25,
        delightBonus: 30
      },
      {
        id: 'satay-street',
        name: 'Brochetas Satay de Pollo con Salsa de Cacahuete',
        category: 'dish',
        description: 'Brochetas a la parrilla sobre carbón con pepino, cebolla y densa salsa de maní aromatizada con hierba limón.',
        recommendedAt: 'Lau Pa Sat (Satay Street)',
        staminaRecovery: 35,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-peranakan',
      title: 'Herencia Peranakan (Baba-Nyonya)',
      tradition: 'La fascinante fusión de la cultura china y malaya en arquitectura, cerámica y vestimenta.',
      description: 'Casas de colores pastel con azulejos vitrificados únicos en el mundo.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 28, condition: 'Tropical cálido', windSpeedKmh: 10, rainfallChancePct: 20 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 33,
    date: '2026-11-21',
    displayDate: 'Sábado 21 Noviembre 2026',
    regionId: 'azerbaijan',
    locationName: 'Singapur → Dubái → Bakú (02:30 → 12:00)',
    country: 'Azerbaiyán',
    countryFlag: '🇦🇿',
    timezone: 'AZT (UTC+4)',
    utcOffset: 4,
    flight: FLIGHTS[4],
    summary: 'Vuelo Emirates EK349 + EK2198. Escala de 2h en Dubái y aterrizaje en Bakú al mediodía. Primera vista de las Torres de Fuego.',
    highlights: [
      'Escala cómoda en la moderna terminal de Dubái con tiendas libres de impuestos',
      'Aterrizaje en el Aeropuerto Heydar Aliyev de Bakú, premiado por su diseño interior',
      'Paseo al atardecer por el Bulevar Marítimo a orillas del Mar Caspio'
    ],
    attractions: [
      {
        id: 'flame-towers',
        name: 'Flame Towers de Bakú (Torres de Fuego)',
        category: 'landmark',
        description: 'Tres rascacielos en forma de llamas de fuego visibles desde cualquier rincón del Caspio.',
        highlight: 'Al anochecer, 10.000 pantallas LED proyectan gigantescas llamas ondulantes',
        seniorTip: 'Se pueden admirar desde el mirador accesible de Highland Park tomando el funicular.',
        position3D: [-3, 3.6, -1]
      },
      {
        id: 'baku-boulevard',
        name: 'Baku Boulevard & Paseo Marítimo del Caspio',
        category: 'scenic',
        description: 'Parque costero de más de 100 años con palmeras, canales de Pequeña Venecia y fuentes musicales.',
        highlight: 'La noria gigante Baku Eye y la fresca brisa marina del Caspio',
        seniorTip: 'Completamente plano, con bancos a la sombra y trenecitos eléctricos de paseo.',
        position3D: [2, 0.5, 2]
      }
    ],
    foods: [
      {
        id: 'azerbaijani-tea',
        name: 'Té Azerí en Vaso Armudu con Confitura de Cereza Blanca',
        localName: 'Çay və Mürəbbə',
        category: 'drink',
        description: 'Té negro servido en vaso con forma de pera (armudu) acompañado de azúcar cande y dulces tradicionales.',
        recommendedAt: 'Chaykhana tradicional en el Bulevar',
        staminaRecovery: 30,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-land-of-fire',
      title: 'Odlar Yurdu: La Tierra del Fuego',
      tradition: 'La veneración del fuego eterno que brota espontáneamente de la tierra rica en gas natural.',
      description: 'Una encrucijada fascinante entre Oriente y Occidente donde la hospitalidad es ley de honor.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 13, condition: 'Fresco y despejado con brisa del Caspio', windSpeedKmh: 20, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 34,
    date: '2026-11-22',
    displayDate: 'Domingo 22 Noviembre 2026',
    regionId: 'azerbaijan',
    locationName: 'Ciudad Vieja de Bakú (Icherisheher) & Torre de la Doncella',
    country: 'Azerbaiyán',
    countryFlag: '🇦🇿',
    timezone: 'AZT (UTC+4)',
    utcOffset: 4,
    summary: 'Inmersión en la Ciudad Vieja amurallada (Patrimonio UNESCO). Visita a la Torre de la Doncella y el Palacio de los Shirvanshahs.',
    highlights: [
      'Laberinto de calles empedradas de piedra arenisca dorada',
      'La misteriosa Torre de la Doncella (Qız Qalası) del siglo XII',
      'Visita al singular Museo de Libros Miniatura con libros del tamaño de una uña'
    ],
    attractions: [
      {
        id: 'maiden-tower',
        name: 'Torre de la Doncella (Qız Qalası)',
        category: 'landmark',
        description: 'La fortaleza más enigmática del Cáucaso, símbolo imperecedero de Bakú.',
        highlight: 'Vistas panorámicas a la bahía del Caspio desde la explanada',
        seniorTip: 'Rampas de acceso por la puerta de Gosha Gala y explanada sin desniveles.',
        position3D: [1, 2.0, -1]
      },
      {
        id: 'carpet-museum',
        name: 'Museo de Alfombras de Azerbaiyán',
        category: 'culture',
        description: 'Edificio diseñado con la forma exacta de una gigantesca alfombra enrollada.',
        highlight: 'Alfombras de seda tejidas a mano con más de 400 años de antigüedad',
        seniorTip: 'Moderno, con ascensores amplios y asientos ergonómicos en cada sala.',
        position3D: [4, 1.2, 1]
      }
    ],
    foods: [
      {
        id: 'qutab-plov',
        name: 'Qutab de Hierbas y Plov Tradicional Shah con Azafrán',
        category: 'dish',
        description: 'Finas tortas rellenas de espinacas y queso feta a la plancha con zumaque, seguidas del majestuoso arroz persa Shah Plov horneado en masa crujiente con cordero y castañas.',
        recommendedAt: 'Restaurante Shirvanshah Museum',
        staminaRecovery: 45,
        delightBonus: 40
      }
    ],
    culture: {
      id: 'cult-carpet-weaving',
      title: 'El Arte Milenario de la Alfombra Azerí',
      tradition: 'Patrimonio Inmaterial de la Humanidad: cada diseño es un poema tejido que cuenta la historia de una familia.',
      description: 'Los abuelos verán a las maestras tejedoras trabajar con paciencia virtuosa.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 12, condition: 'Soleado con viento fresco', windSpeedKmh: 18, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 35,
    date: '2026-11-23',
    displayDate: 'Lunes 23 Noviembre 2026',
    regionId: 'azerbaijan',
    locationName: 'Volcanes de Lodo & Petroglifos de Gobustan',
    country: 'Azerbaiyán',
    countryFlag: '🇦🇿',
    timezone: 'AZT (UTC+4)',
    utcOffset: 4,
    summary: 'Excursión al paisaje lunar de Gobustan: más de 6.000 grabados rupestres de 40.000 años y los volcanes de lodo burbujeante.',
    highlights: [
      'Visita a los conos de lodo frío que burbujean continuamente gas y arcilla mineral',
      'Petroglifos prehistóricos que muestran cazadores, danzas ceremoniales Yalli y barcos de juncos',
      'Piedra musical Gaval Dash que suena como un pandero al golpearla con una piedra'
    ],
    attractions: [
      {
        id: 'gobustan-petroglyphs',
        name: 'Reserva Nacional de Gobustan & Volcanes de Lodo',
        category: 'nature',
        description: 'Uno de los yacimientos de arte rupestre y fenómenos geotérmicos más antiguos del mundo.',
        highlight: 'El museo interactivo 3D de Gobustan y las vistas al desierto y al Caspio',
        seniorTip: 'El museo es ultramoderno y accesible; el recorrido exterior cuenta con pasarelas.',
        position3D: [-6, 1.4, 3]
      }
    ],
    foods: [
      {
        id: 'dolma-baku',
        name: 'Yarpag Dolma: Hojas de Parra Rellenas de Cordero y Menta',
        category: 'dish',
        description: 'Bocados diminutos del tamaño de un dedal, cocinados con jugo de limón y servidos con salsa de yogur de ajo.',
        recommendedAt: 'Restaurante Firuza en la Plaza de las Fuentes',
        staminaRecovery: 35,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-mugham',
      title: 'Música Mugham Tradicional',
      tradition: 'Poesía modal clásica interpretada con el laúd Tar, la vihuela Kamancha y el pandero Daf.',
      description: 'Música declarada Patrimonio Cultural que eriza la piel de emoción.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 11, condition: 'Fresco y ventoso', windSpeedKmh: 22, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 36,
    date: '2026-11-24',
    displayDate: 'Martes 24 Noviembre 2026',
    regionId: 'azerbaijan',
    locationName: 'Centro Heydar Aliyev & Fuego Eterno Yanar Dag',
    country: 'Azerbaiyán',
    countryFlag: '🇦🇿',
    timezone: 'AZT (UTC+4)',
    utcOffset: 4,
    summary: 'La obra maestra de la arquitecta Zaha Hadid: el Centro Heydar Aliyev con sus curvas blancas fluidas sin una sola línea recta.',
    highlights: [
      'El edificio curvilíneo más premiado del siglo XXI',
      'Visita a Yanar Dag, la ladera donde arde una llama continua desde hace más de 4.000 años',
      'Paseo nocturno por la Plaza de las Fuentes con iluminación navideña incipiente'
    ],
    attractions: [
      {
        id: 'heydar-center',
        name: 'Centro Heydar Aliyev (Zaha Hadid)',
        category: 'landmark',
        description: 'Escultura arquitectónica monumental de color blanco inmaculado.',
        highlight: 'La sensación de fluidez y belleza espacial interior',
        seniorTip: 'Completamente accesible con rampas suaves, ascensores de cristal y zonas de descanso.',
        position3D: [0, 2.2, -4]
      }
    ],
    foods: [
      {
        id: 'pakhlava-baku',
        name: 'Pakhlava de Bakú con Nueces del Cáucaso y Azafrán',
        category: 'sweet',
        description: 'Capas finísimas de masa hojaldrada empapadas en almíbar de azafrán con nueces machacadas y cardamomo.',
        recommendedAt: 'Pastelería Sheki Pakhlavasi',
        staminaRecovery: 30,
        delightBonus: 35
      }
    ],
    culture: {
      id: 'cult-zaha',
      title: 'Vanguardia Arquitectónica de Bakú',
      tradition: 'La transformación de la capital petrolera en una metrópoli de diseño futurista.',
      description: 'El diálogo deslumbrante entre los minaretes medievales y el diseño de vanguardia.',
      seniorComfortLevel: 'Easy Walk'
    },
    typicalWeather: { tempC: 12, condition: 'Despejado', windSpeedKmh: 16, rainfallChancePct: 5 },
    recommendedRestTimeHours: 5
  },
  {
    dayNumber: 37,
    date: '2026-11-25',
    displayDate: 'Miércoles 25 Noviembre 2026',
    regionId: 'azerbaijan',
    locationName: 'Último Día en Bakú & Plaza de las Fuentes',
    country: 'Azerbaiyán',
    countryFlag: '🇦🇿',
    timezone: 'AZT (UTC+4)',
    utcOffset: 4,
    summary: 'Día de descanso tranquilo, compras de azafrán de Absheron y caviar en el Bazar Yasil (Bazar Verde). Preparación de maletas.',
    highlights: [
      'Aromas a azafrán, frutos secos y granadas rojas en el bazar',
      'Comprobación de pesos de equipaje (23 kg por persona para Turkish Airlines)',
      'Cena de despedida frente al Mar Caspio con vistas a las Torres de Fuego iluminadas'
    ],
    attractions: [],
    foods: [
      {
        id: 'pomegranate-fresh',
        name: 'Zumo de Granada Silvestre Recién Exprimido',
        category: 'drink',
        description: 'Antioxidante natural por excelencia de Azerbaiyán, dulce y vigorizante.',
        recommendedAt: 'Yashil Bazaar',
        staminaRecovery: 35,
        delightBonus: 30
      }
    ],
    culture: {
      id: 'cult-guest-honor',
      title: 'Qonaq Pərvərlik: La Hospitalidad Sagrada',
      tradition: 'Proverbio azerí: "La casa que no recibe invitados no tiene luz".',
      description: 'Los abuelos se llevarán en el corazón el cariño y respeto de la gente local.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 11, condition: 'Fresco otoñal', windSpeedKmh: 14, rainfallChancePct: 10 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 38,
    date: '2026-11-26',
    displayDate: 'Jueves 26 Noviembre 2026',
    regionId: 'spain_turkey',
    locationName: 'Bakú → Estambul → Madrid (07:55 → 16:25)',
    country: 'Turquía / España',
    countryFlag: '🇪🇸',
    timezone: 'AZT (UTC+4) → CET (UTC+1)',
    utcOffset: 1,
    flight: FLIGHTS[5],
    summary: 'Vuelo Turkish Airlines TK339 + TK1859. Escala de 1h 30m en el magnífico aeropuerto de Estambul y llegada a Madrid a las 16:25.',
    highlights: [
      'Vista aérea del estrecho del Bósforo y las mezquitas de Estambul en la aproximación',
      'Aterrizaje en Madrid-Barajas T4 (arquitectura de Richard Rogers con techos de bambú)',
      '¡EL GRAN REENCUENTRO con hijos y nietos esperando con pancartas y abrazos!'
    ],
    attractions: [
      {
        id: 'puerta-del-sol',
        name: 'Puerta del Sol & Kilómetro Cero',
        category: 'landmark',
        description: 'El corazón palpitante de Madrid y de toda España.',
        highlight: 'La estatua del Oso y el Madroño y el reloj de las campanadas',
        seniorTip: 'Completamente peatonalizada y llana desde la reforma reciente.',
        position3D: [0, 1.2, 0]
      },
      {
        id: 'plaza-mayor',
        name: 'Plaza Mayor de Madrid',
        category: 'landmark',
        description: 'Plaza porticada de estilo herreriano con cuatro siglos de historia.',
        highlight: 'Iluminación cálida y aroma a castañas asadas de finales de noviembre',
        seniorTip: 'Paseo accesible con numerosas terrazas con calefactores.',
        position3D: [-3, 1.5, 2]
      }
    ],
    foods: [
      {
        id: 'churros-san-gines',
        name: 'Chocolate con Churros en San Ginés (Desde 1894)',
        category: 'sweet',
        description: 'Chocolate a la taza espeso y brillante con churros y porras recién fritas doradas.',
        recommendedAt: 'Chocolatería San Ginés',
        staminaRecovery: 40,
        delightBonus: 45
      },
      {
        id: 'jamon-iberico',
        name: 'Tabla de Jamón Ibérico de Bellota 100% con Picos',
        category: 'snack',
        description: 'Cortado a cuchillo en finas lonchas que se deshacen en el paladar con grasa entreverada.',
        recommendedAt: 'Taberna centenaria en La Latina',
        staminaRecovery: 45,
        delightBonus: 50
      }
    ],
    culture: {
      id: 'cult-homecoming',
      title: '¡Bienvenidos a Casa, Abuelos!',
      tradition: 'La celebración de la familia unida compartiendo las anécdotas del viaje de su vida.',
      description: 'El viaje alrededor del mundo culmina con el amor de los seres queridos.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 12, condition: 'Cielo azul velazqueño y sol de Madrid', windSpeedKmh: 8, rainfallChancePct: 5 },
    recommendedRestTimeHours: 6
  },
  {
    dayNumber: 39,
    date: '2026-11-27',
    displayDate: 'Viernes 27 Noviembre 2026',
    regionId: 'spain_turkey',
    locationName: 'Madrid: Banquete Familiar & Álbum de Recuerdos',
    country: 'España',
    countryFlag: '🇪🇸',
    timezone: 'CET (UTC+1)',
    utcOffset: 1,
    summary: 'Gran comida familiar de bienvenida. Apertura de maletas, reparto de regalos (jade maorí, madera de Fiji, especias del Caspio) y proyección de fotos.',
    highlights: [
      'Almuerzo de celebración con arroz y mariscos en familia',
      'Los nietos escuchando maravillados las historias de los albatros y las islas',
      'Entrega del Álbum Digital y el Trofeo de Super Abuelos Viajeros del Mundo'
    ],
    attractions: [
      {
        id: 'palacio-real',
        name: 'Palacio Real de Madrid & Jardines de Sabatini',
        category: 'landmark',
        description: 'La residencia real más grande de Europa Occidental, con 3.418 habitaciones.',
        highlight: 'Atardecer dorado sobre la fachada de granito blanco y la Catedral de la Almudena',
        seniorTip: 'Ascensores y sillas de ruedas disponibles con pase preferente familiar.',
        position3D: [3, 2.0, -2]
      }
    ],
    foods: [
      {
        id: 'cocido-madrileno',
        name: 'Cocido Madrileño Tradicional en Tres Vuelcos',
        category: 'dish',
        description: 'Sopa de fideos dorada, garbanzos castellanos con verduras tiernas y carnes nobles.',
        recommendedAt: 'Restaurante tradicional en Madrid',
        staminaRecovery: 50,
        delightBonus: 50
      }
    ],
    culture: {
      id: 'cult-legacy',
      title: 'El Legado del Viaje',
      tradition: 'Viajar abre la mente y el corazón: el regalo más hermoso de vida para los abuelos.',
      description: 'Una experiencia compartida que recordarán con emoción el resto de sus vidas.',
      seniorComfortLevel: 'Relaxed'
    },
    typicalWeather: { tempC: 14, condition: 'Soleado y templado', windSpeedKmh: 6, rainfallChancePct: 0 },
    recommendedRestTimeHours: 8
  }
];

export const TRIP_DAYS: TripDay[] = BASE_TRIP_DAYS.map((day) => ({
  ...day,
  attractions: [...day.attractions, ...(FAITH_ACTIVITIES[day.dayNumber] || [])],
}));

export const INITIAL_LUGGAGE: { name: string; weightKg: number; category: any; packed: boolean; notes?: string }[] = [
  { name: 'Ropa cómoda de viaje y chaquetas ligeras cortaviento', weightKg: 6.5, category: 'clothing', packed: true, notes: 'Ideal para capas en Nueva Zelanda y Bakú' },
  { name: 'Calzado ergonómico de senderismo urbano con amortiguación', weightKg: 1.8, category: 'comfort', packed: true, notes: 'Evita la fatiga plantar en museos y paseos' },
  { name: 'Medicamentos personales en neceser con receta médica', weightKg: 1.2, category: 'health', packed: true, notes: 'Llevar siempre en equipaje de mano' },
  { name: 'Almohada cervical hinchable y antifaz para vuelos largos', weightKg: 0.6, category: 'comfort', packed: true, notes: 'Imprescindible para el vuelo de 15h Houston-Auckland' },
  { name: 'Cámara fotográfica, móvil y cargadores universales', weightKg: 1.5, category: 'electronics', packed: true, notes: 'Adaptadores para enchufes tipo I (NZ/Fiji) y G (Singapur)' },
  { name: 'Gafas de sol polarizadas y protector solar biodegradable', weightKg: 0.5, category: 'comfort', packed: true, notes: 'Vital para el sol del Pacífico y Fiji' },
  { name: 'Bañadores y sandalias acuáticas para aguas termales y lagunas', weightKg: 1.2, category: 'clothing', packed: true, notes: 'Para los lodos de Sabeto y arrecifes de Fiji' },
  { name: 'Guía de viaje impresa con números de emergencia y reservas', weightKg: 0.4, category: 'comfort', packed: true, notes: 'Copia física en español de todos los vuelos' },
];

export const AVAILABLE_SANDBOX_ASSETS = [
  {
    type: 'scenic_camp' as const,
    name: 'Cenador de Descanso Panorámico',
    description: 'Carpa con sofás sombreados, agua fresca y mantas para reponer energías.',
    icon: '⛺',
    costJoy: 10,
    bonus: { energy: 20, joy: 15, culture: 5 }
  },
  {
    type: 'photo_spot' as const,
    name: 'Mirador Fotográfico Polaroid',
    description: 'Poste con encuadre óptimo para capturar la foto perfecta de la postal.',
    icon: '📷',
    costJoy: 15,
    bonus: { energy: 5, joy: 25, culture: 15 }
  },
  {
    type: 'gourmet_cafe' as const,
    name: 'Puesto de Degustación Gourmet',
    description: 'Café o quiosco artesano con delicias tradicionales de la región.',
    icon: '☕',
    costJoy: 20,
    bonus: { energy: 15, joy: 20, culture: 20 }
  },
  {
    type: 'wildlife_post' as const,
    name: 'Puesto de Observación de Fauna',
    description: 'Prismáticos fijos para avistar delfines, albatros o aves exóticas.',
    icon: '🐬',
    costJoy: 15,
    bonus: { energy: 5, joy: 22, culture: 18 }
  },
  {
    type: 'shuttle_stop' as const,
    name: 'Lanzadera Eléctrica Preferente',
    description: 'Microbús accesible para transportar cómodamente a los abuelos.',
    icon: '🚐',
    costJoy: 25,
    bonus: { energy: 30, joy: 15, culture: 5 }
  }
];
