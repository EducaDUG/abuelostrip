/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbuelosGameState, JournalEntry, SnapshotPhoto, PackedLuggageItem } from '../types';
import { INITIAL_LUGGAGE } from '../data/tripData';

const DB_NAME = 'abuelos_trip_db';
const DB_VERSION = 1;

export function openTripDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('game_state')) {
        db.createObjectStore('game_state', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('journal')) {
        db.createObjectStore('journal', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('photo_album')) {
        db.createObjectStore('photo_album', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const DEFAULT_INITIAL_STATE: AbuelosGameState = {
  currentDayIndex: 1, // Starts at Day 2: 21 Octubre - Hobbiton & Las Colinas Verdes!
  vitality: 85, // 0 - 100
  hunger: 45, // 0 - 100 (algo de apetito tras el viaje)
  thirst: 30, // 0 - 100
  drunkenness: 0, // 0 - 100
  hangover: false, // sin resaca inicial
  coins: 120, // Kiwi travel coins
  completedQuests: [],
  activeBuffs: ['viajeros_felices'],
  joyIndex: 92,
  culturalDiscoveryScore: 140,
  gourmetScore: 95,
  tripPace: 'relaxed',
  gastronomyBudgetLevel: 'epicurean',
  waveEnergyDensity: 0.8,
  timeOfDay: 14, // 2 PM afternoon sunlight
  placedSandboxItems: [
    {
      id: 'default-rest-1',
      itemType: 'scenic_camp',
      name: 'Mirador de La Comarca',
      position: [2.5, 1.2, 1.8],
      regionId: 'hobbiton',
      createdAt: Date.now(),
      bonus: { energy: 20, joy: 15, culture: 10 }
    }
  ],
  luggageItems: INITIAL_LUGGAGE.map((item, idx) => ({
    id: `lug-${idx}`,
    ...item
  })),
  unlockedSouvenirs: ['Colgante Maorí Koru de Pounamu'],
  triedFoods: ['kiwi-breakfast', 'flat-white'],
  visitedAttractions: ['viaduct-harbour'],
  activeCameraMode: 'orbit',
  audioMuted: false,
};

export async function saveGameState(state: AbuelosGameState): Promise<void> {
  try {
    const db = await openTripDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('game_state', 'readwrite');
      const store = tx.objectStore('game_state');
      store.put({ key: 'current_save', state, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error saving to IndexedDB:', err);
  }
}

export async function loadGameState(): Promise<AbuelosGameState | null> {
  try {
    const db = await openTripDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('game_state', 'readonly');
      const store = tx.objectStore('game_state');
      const req = store.get('current_save');
      req.onsuccess = () => {
        if (req.result && req.result.state) {
          resolve({
            ...DEFAULT_INITIAL_STATE,
            ...req.result.state,
          });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error loading from IndexedDB:', err);
    return null;
  }
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await openTripDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('journal', 'readwrite');
    tx.objectStore('journal').put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadJournalEntries(): Promise<JournalEntry[]> {
  const db = await openTripDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('journal', 'readonly');
    const req = tx.objectStore('journal').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function savePhoto(photo: SnapshotPhoto): Promise<void> {
  const db = await openTripDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photo_album', 'readwrite');
    tx.objectStore('photo_album').put(photo);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadPhotos(): Promise<SnapshotPhoto[]> {
  const db = await openTripDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photo_album', 'readonly');
    const req = tx.objectStore('photo_album').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openTripDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photo_album', 'readwrite');
    tx.objectStore('photo_album').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export const INITIAL_FAMILY_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-1',
    date: '2026-10-22',
    title: '¡Bienvenidos a Nueva Zelanda, queridos abuelos!',
    content: 'Qué emoción ver que ya habéis aterrizado en Auckland. Esperamos que el vuelo de 15h se haya hecho llevadero. Recordad beber mucha agua, caminar despacito por Viaduct Harbour y tomaros un buen café Flat White. ¡Os queremos muchísimo!',
    author: 'Toda la familia',
    mood: 'radiant',
    createdAt: Date.now() - 100000000
  },
  {
    id: 'entry-2',
    date: '2026-10-30',
    title: 'Recuerdos desde Milford Sound',
    content: 'Papá y mamá, tenéis que fijaros bien en las cascadas gigantes de Mitre Peak. Llevad la chaquetilla impermeable a mano por la bruma. ¡Disfrutad del fiordo más bonito del mundo!',
    author: 'Vuestros hijos y nietos',
    mood: 'adventurous',
    createdAt: Date.now() - 50000000
  }
];
