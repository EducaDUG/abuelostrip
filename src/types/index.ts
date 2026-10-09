/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WorldRegionId = 
  | 'auckland'
  | 'hobbiton'
  | 'rotorua'
  | 'waiheke'
  | 'dunedin'
  | 'queenstown'
  | 'milford'
  | 'wanaka'
  | 'christchurch'
  | 'fiji'
  | 'singapore'
  | 'azerbaijan'
  | 'spain_turkey'
  | 'flight_transit'
  | 'nz_north'
  | 'nz_south';

export interface FlightSegment {
  id: string;
  flightNumber?: string;
  airline?: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  dateStr: string;
  departureTime?: string;
  arrivalTime?: string;
  durationApprox: string;
  layover?: string;
  bookingRef?: string;
  luggageLimitKg: number;
  notes?: string;
  fromCoords: [number, number]; // lat, lng
  toCoords: [number, number];
}

export interface AttractionPoint {
  id: string;
  name: string;
  category: 'landmark' | 'nature' | 'culture' | 'scenic';
  description: string;
  highlight: string;
  seniorTip: string;
  position3D: [number, number, number]; // x, y, z on local diorama
  unlocked?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  localName?: string;
  category: 'dish' | 'drink' | 'sweet' | 'snack';
  description: string;
  recommendedAt: string;
  staminaRecovery: number;
  delightBonus: number;
  tried?: boolean;
}

export interface CultureExperience {
  id: string;
  title: string;
  tradition: string;
  description: string;
  seniorComfortLevel: 'Relaxed' | 'Moderate' | 'Easy Walk';
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetType: 'eat' | 'drink' | 'explore' | 'photo' | 'sheep' | 'nap';
  rewardCoins: number;
  rewardJoy: number;
}

export interface TripDay {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Jueves 22 Octubre 2026"
  regionId: WorldRegionId;
  locationName: string;
  country: string;
  countryFlag: string;
  timezone: string;
  utcOffset: number;
  flight?: FlightSegment;
  summary: string;
  highlights: string[];
  attractions: AttractionPoint[];
  foods: FoodItem[];
  culture: CultureExperience;
  quests?: DailyQuest[];
  typicalWeather: {
    tempC: number;
    condition: string;
    windSpeedKmh: number;
    rainfallChancePct: number;
  };
  recommendedRestTimeHours: number;
}

export interface SandboxPlacedItem {
  id: string;
  itemType: 'scenic_camp' | 'photo_spot' | 'gourmet_cafe' | 'wildlife_post' | 'shuttle_stop';
  name: string;
  position: [number, number, number];
  regionId: WorldRegionId;
  createdAt: number;
  bonus: {
    energy: number;
    joy: number;
    culture: number;
  };
}

export interface PackedLuggageItem {
  id: string;
  name: string;
  weightKg: number;
  category: 'clothing' | 'comfort' | 'electronics' | 'souvenir' | 'health';
  packed: boolean;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  author: string;
  mood: 'radiant' | 'peaceful' | 'adventurous' | 'grateful';
  createdAt: number;
}

export interface SnapshotPhoto {
  id: string;
  dateStr: string;
  locationName: string;
  dataUrl: string; // base64 canvas render
  caption: string;
  createdAt: number;
}

export interface AbuelosGameState {
  currentDayIndex: number;
  vitality: number; // 0 - 100 (Energía para subir montes y pasear)
  hunger: number; // 0 - 100 (0 = Satisfecho, 100 = ¡Muerto de hambre!)
  thirst: number; // 0 - 100 (Hidratación)
  drunkenness: number; // 0 - 100 (Nivel de cerveza/vino: ¡a partir de 60 da resaca!)
  hangover: boolean; // ¿Tienen resaca hoy de la fiesta de anoche?
  coins: number; // Dólares para cervezas, cafés, bocadillos y souvenirs
  completedQuests: string[]; // IDs de misiones cumplidas
  activeBuffs: string[]; // e.g. 'resaca', 'muerto_hambre', 'a_tope', 'barriga_llena'
  joyIndex: number; // 0 - 100 (Felicidad de los abuelos)
  culturalDiscoveryScore: number;
  gourmetScore: number;
  tripPace: 'relaxed' | 'balanced' | 'explorer';
  gastronomyBudgetLevel: 'modest' | 'epicurean' | 'regal';
  waveEnergyDensity: number; // 0.1 - 2.0 (sandbox marine physics)
  timeOfDay: number; // 0 - 24 (hours)
  placedSandboxItems: SandboxPlacedItem[];
  luggageItems: PackedLuggageItem[];
  unlockedSouvenirs: string[];
  triedFoods: string[];
  visitedAttractions: string[];
  activeCameraMode: 'orbit' | 'isometric' | 'abuelo_walk' | 'drone';
  audioMuted: boolean;
}
