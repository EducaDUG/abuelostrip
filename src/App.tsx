/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TRIP_DAYS } from './data/tripData';
import {
  AbuelosGameState,
  AttractionPoint,
  FoodItem,
  PackedLuggageItem,
  JournalEntry,
  SnapshotPhoto,
} from './types';
import {
  loadGameState,
  saveGameState,
  DEFAULT_INITIAL_STATE,
  loadPhotos,
  savePhoto,
  deletePhoto,
  loadJournalEntries,
  saveJournalEntry,
  INITIAL_FAMILY_JOURNAL_ENTRIES,
} from './utils/db';
import { simulateDigitalTwin } from './utils/simulationEngine';
import { audioEngine } from './utils/audioEngine';
import { DioramaCanvas } from './components/DioramaCanvas';
import { TopBar } from './components/TopBar';
import { TimelineBar } from './components/TimelineBar';
import { DayDetailsCard } from './components/DayDetailsCard';
import { AttractionModal } from './components/AttractionModal';
import { FoodTastingModal } from './components/FoodTastingModal';
import { DigitalTwinPanel } from './components/DigitalTwinPanel';
import { SandboxToolbox } from './components/SandboxToolbox';
import { FlightRoutesModal } from './components/FlightRoutesModal';
import { LuggageModal } from './components/LuggageModal';
import { PhotoAlbumModal } from './components/PhotoAlbumModal';
import { JournalModal } from './components/JournalModal';
import { AbuelosGameHud } from './components/AbuelosGameHud';
import { GameTutorialModal } from './components/GameTutorialModal';

export default function App() {
  const [gameState, setGameState] = useState<AbuelosGameState>(DEFAULT_INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Modals & Overlay state
  const [activeTab, setActiveTab] = useState<'diorama' | 'flights' | 'journal' | 'luggage' | 'photos'>('diorama');
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionPoint | null>(null);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState(false);
  const [isSandboxToolboxOpen, setIsSandboxToolboxOpen] = useState(false);

  // Snapshot photos & family journal
  const [photos, setPhotos] = useState<SnapshotPhoto[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_FAMILY_JOURNAL_ENTRIES);

  // Sandbox placement active type
  const [sandboxPlaceType, setSandboxPlaceType] = useState<'scenic_camp' | 'photo_spot' | 'gourmet_cafe' | 'wildlife_post' | 'shuttle_stop' | null>(null);

  // Tour Auto-Play state
  const [isPlayingTour, setIsPlayingTour] = useState(false);
  const tourTimerRef = useRef<number | null>(null);

  // Capture callback from DioramaCanvas
  const canvasCaptureRef = useRef<(() => string) | null>(null);

  // Current day data
  const currentDayIndex = gameState.currentDayIndex;
  const currentDay = TRIP_DAYS[currentDayIndex] || TRIP_DAYS[0];

  // Digital Twin calculation
  const twinReport = simulateDigitalTwin(gameState, currentDay);

  // 1. Load initial game state from IndexedDB on startup
  useEffect(() => {
    async function initDB() {
      try {
        const loaded = await loadGameState();
        if (loaded) {
          setGameState(loaded);
        }
        const hasSeenTutorial = localStorage.getItem('abuelos_tutorial_seen');
        if (!hasSeenTutorial) {
          setIsTutorialOpen(true);
          localStorage.setItem('abuelos_tutorial_seen', 'true');
        }
        const loadedPhotos = await loadPhotos();
        if (loadedPhotos && loadedPhotos.length > 0) {
          setPhotos(loadedPhotos);
        }
        const loadedEntries = await loadJournalEntries();
        if (loadedEntries && loadedEntries.length > 0) {
          setJournalEntries(loadedEntries);
        }
      } catch (err) {
        console.error('Failed to load from IndexedDB:', err);
      } finally {
        setIsLoaded(true);
      }
    }
    initDB();
  }, []);

  // 2. Auto-save game state every 20 seconds
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      saveGameState(gameState);
    }, 20000);
    return () => clearInterval(interval);
  }, [gameState, isLoaded]);

  // 3. Tour Auto-play controller (moves day forward every 6 seconds)
  useEffect(() => {
    if (isPlayingTour) {
      tourTimerRef.current = window.setInterval(() => {
        setGameState((prev) => {
          const nextIndex = (prev.currentDayIndex + 1) % TRIP_DAYS.length;
          // Trigger audio flight jet if next day has a flight
          if (TRIP_DAYS[nextIndex]?.flight) {
            audioEngine.playFlightJet();
          }
          return { ...prev, currentDayIndex: nextIndex };
        });
      }, 6500);
    } else {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
    }
    return () => {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
    };
  }, [isPlayingTour]);

  // Handle Day Navigation
  const handleSelectDayIndex = (idx: number) => {
    if (TRIP_DAYS[idx]?.flight) {
      audioEngine.playFlightJet();
    }
    setGameState((prev) => ({
      ...prev,
      currentDayIndex: idx,
    }));
  };

  // Handle Attraction Discovery
  const handleMarkVisitedAttraction = (id: string) => {
    setGameState((prev) => {
      if (prev.visitedAttractions.includes(id)) return prev;
      return {
        ...prev,
        visitedAttractions: [...prev.visitedAttractions, id],
        joyIndex: Math.min(100, prev.joyIndex + 25),
        culturalDiscoveryScore: prev.culturalDiscoveryScore + 20,
      };
    });
  };

  // Handle Food Tasting
  const handleTasteFood = (food: FoodItem) => {
    audioEngine.playEatMunch();
    setGameState((prev) => {
      const alreadyTried = prev.triedFoods.includes(food.id);
      return {
        ...prev,
        triedFoods: alreadyTried ? prev.triedFoods : [...prev.triedFoods, food.id],
        vitality: Math.min(100, prev.vitality + food.staminaRecovery),
        hunger: 0,
        drunkenness: Math.max(0, (prev.drunkenness || 0) - 15),
        joyIndex: Math.min(100, prev.joyIndex + food.delightBonus),
        gourmetScore: prev.gourmetScore + (alreadyTried ? 5 : 30),
        activeBuffs: Array.from(new Set([...prev.activeBuffs, 'barriga_llena'])),
        completedQuests: Array.from(new Set([...prev.completedQuests, `eat-${currentDay.dayNumber}`])),
      };
    });
  };

  // Handle Sandbox Item Placement
  const handlePlaceSandboxItem = (coords: [number, number, number]) => {
    if (!sandboxPlaceType) return;

    const newItem = {
      id: `placed-${Date.now()}`,
      itemType: sandboxPlaceType,
      name:
        sandboxPlaceType === 'scenic_camp' ? 'Cenador Panorámico' :
        sandboxPlaceType === 'photo_spot' ? 'Mirador Fotográfico' :
        sandboxPlaceType === 'gourmet_cafe' ? 'Puesto Gourmet' :
        sandboxPlaceType === 'wildlife_post' ? 'Observatorio de Fauna' : 'Lanzadera Eléctrica',
      position: coords,
      regionId: currentDay.regionId,
      createdAt: Date.now(),
      bonus: {
        energy: sandboxPlaceType === 'scenic_camp' ? 20 : 10,
        joy: sandboxPlaceType === 'photo_spot' ? 25 : 15,
        culture: sandboxPlaceType === 'gourmet_cafe' ? 20 : 10,
      },
    };

    setGameState((prev) => ({
      ...prev,
      placedSandboxItems: [...prev.placedSandboxItems, newItem],
      joyIndex: Math.min(100, prev.joyIndex + 10),
      vitality: Math.min(100, prev.vitality + 5),
    }));

    setSandboxPlaceType(null); // Return to navigation cursor
  };

  const handleRemovePlacedItem = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      placedSandboxItems: prev.placedSandboxItems.filter((i) => i.id !== id),
    }));
  };

  // Virtual 3D Snapshot Camera capture
  const handleTakeSnapshot = () => {
    if (!canvasCaptureRef.current) return;
    const dataUrl = canvasCaptureRef.current();
    if (!dataUrl) return;

    const newPhoto: SnapshotPhoto = {
      id: `photo-${Date.now()}`,
      dateStr: currentDay.date,
      locationName: currentDay.locationName,
      dataUrl,
      caption: `Recuerdo 3D en ${currentDay.locationName} (${currentDay.displayDate})`,
      createdAt: Date.now(),
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    savePhoto(newPhoto);

    // Boost joy on capturing snapshot!
    setGameState((prev) => ({
      ...prev,
      joyIndex: Math.min(100, prev.joyIndex + 15),
    }));

    // Switch to Photos tab to review snapshot
    setActiveTab('photos');
  };

  // Handle Luggage packing toggles
  const handleTogglePackItem = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      luggageItems: prev.luggageItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      ),
    }));
  };

  const handleAddLuggageItem = (item: Omit<PackedLuggageItem, 'id'>) => {
    const newItem: PackedLuggageItem = {
      ...item,
      id: `lug-${Date.now()}`,
    };
    setGameState((prev) => ({
      ...prev,
      luggageItems: [...prev.luggageItems, newItem],
    }));
  };

  const handleDeleteLuggageItem = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      luggageItems: prev.luggageItems.filter((i) => i.id !== id),
    }));
  };

  // Handle Family Journal entries
  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      createdAt: Date.now(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    saveJournalEntry(newEntry);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    deletePhoto(id);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Header Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        audioMuted={gameState.audioMuted}
        onToggleAudio={() => {
          const newMuted = !gameState.audioMuted;
          audioEngine.setMuted(newMuted);
          setGameState((prev) => ({ ...prev, audioMuted: newMuted }));
        }}
        cameraMode={gameState.activeCameraMode}
        onChangeCameraMode={(mode) => {
          setGameState((prev) => ({ ...prev, activeCameraMode: mode }));
        }}
        onTakeSnapshot={handleTakeSnapshot}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        vitality={twinReport.staminaEstimate}
        joyIndex={twinReport.joyForecast}
      />

      {/* 2. Main 3D Viewport Stage */}
      <main className="relative flex-1 w-full min-h-0 overflow-hidden">
        {/* Living 3D Diorama Canvas */}
        <DioramaCanvas
          regionId={currentDay.regionId}
          timeOfDay={gameState.timeOfDay}
          waveEnergy={gameState.waveEnergyDensity}
          cameraMode={gameState.activeCameraMode}
          placedItems={gameState.placedSandboxItems}
          attractions={currentDay.attractions}
          selectedAttractionId={selectedAttraction?.id ?? null}
          onSelectAttraction={setSelectedAttraction}
          sandboxPlaceType={sandboxPlaceType}
          onPlaceSandboxItem={handlePlaceSandboxItem}
          onCanvasReady={(captureFn) => {
            canvasCaptureRef.current = captureFn;
          }}
          locationName={currentDay.locationName}
          displayDate={currentDay.displayDate}
          isHangover={gameState.hangover}
          onSelectRegion={(regId) => {
            const foundIdx = TRIP_DAYS.findIndex((d) => d.regionId === regId);
            if (foundIdx !== -1) {
              handleSelectDayIndex(foundIdx);
            }
          }}
        />

        {/* Video Game Mode HUD: Ritmo del Viaje, Cerveza, Resaca, Hambre, Monte */}
        <AbuelosGameHud
          gameState={gameState}
          onUpdateGameState={(updater) => setGameState(updater)}
          currentDay={currentDay}
          onOpenFoodTasting={() => setIsFoodModalOpen(true)}
          onTakeSnapshot={handleTakeSnapshot}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />

        {/* Floating Sandbox Toolbox */}
        <SandboxToolbox
          currentRegionId={currentDay.regionId}
          activePlacementType={sandboxPlaceType}
          onSelectPlacementType={setSandboxPlaceType}
          placedItems={gameState.placedSandboxItems}
          onRemovePlacedItem={handleRemovePlacedItem}
          tripPace={gameState.tripPace}
          onChangeTripPace={(pace) => setGameState((prev) => ({ ...prev, tripPace: pace }))}
          gastronomyBudget={gameState.gastronomyBudgetLevel}
          onChangeGastronomyBudget={(budget) => setGameState((prev) => ({ ...prev, gastronomyBudgetLevel: budget }))}
          waveEnergy={gameState.waveEnergyDensity}
          onChangeWaveEnergy={(waveEnergyDensity) => setGameState((prev) => ({ ...prev, waveEnergyDensity }))}
          isOpen={isSandboxToolboxOpen}
          onToggleOpen={() => setIsSandboxToolboxOpen(!isSandboxToolboxOpen)}
        />

        {/* Floating Digital Twin Telemetry Panel */}
        <DigitalTwinPanel
          report={twinReport}
          currentDay={currentDay}
          isOpen={isDigitalTwinOpen}
          onToggleOpen={() => setIsDigitalTwinOpen(!isDigitalTwinOpen)}
        />

        {/* Floating Day Summary Card */}
        <DayDetailsCard
          day={currentDay}
          onSelectAttraction={setSelectedAttraction}
          onOpenFoodTasting={() => setIsFoodModalOpen(true)}
        />
      </main>

      {/* 3. Bottom Timeline Scrubber */}
      <TimelineBar
        currentDayIndex={currentDayIndex}
        onSelectDayIndex={handleSelectDayIndex}
        isPlayingTour={isPlayingTour}
        onTogglePlayTour={() => setIsPlayingTour(!isPlayingTour)}
        timeOfDay={gameState.timeOfDay}
        onChangeTimeOfDay={(time) => setGameState((prev) => ({ ...prev, timeOfDay: time }))}
      />

      {/* 4. MODALS */}

      {/* Landmark Inspection Modal */}
      {selectedAttraction && (
        <AttractionModal
          attraction={selectedAttraction}
          onClose={() => setSelectedAttraction(null)}
          isVisited={gameState.visitedAttractions.includes(selectedAttraction.id)}
          onMarkVisited={handleMarkVisitedAttraction}
        />
      )}

      {/* Traditional Food Tasting Menu Modal */}
      {isFoodModalOpen && (
        <FoodTastingModal
          foods={currentDay.foods}
          triedFoodIds={gameState.triedFoods}
          onTasteFood={handleTasteFood}
          onClose={() => setIsFoodModalOpen(false)}
        />
      )}

      {/* 6 Official Flights Route Navigator Modal */}
      {activeTab === 'flights' && (
        <FlightRoutesModal
          onSelectFlightDay={(dayIdx) => {
            handleSelectDayIndex(dayIdx);
            setActiveTab('diorama');
          }}
          onClose={() => setActiveTab('diorama')}
        />
      )}

      {/* Luggage Weight Physics & Packing Modal */}
      {activeTab === 'luggage' && (
        <LuggageModal
          items={gameState.luggageItems}
          onTogglePackItem={handleTogglePackItem}
          onAddItem={handleAddLuggageItem}
          onDeleteItem={handleDeleteLuggageItem}
          activeAllowanceKg={currentDay.flight?.luggageLimitKg ?? 23}
          onClose={() => setActiveTab('diorama')}
        />
      )}

      {/* Photo Album & Postcard Gallery Modal */}
      {activeTab === 'photos' && (
        <PhotoAlbumModal
          photos={photos}
          onDeletePhoto={handleDeletePhoto}
          onClose={() => setActiveTab('diorama')}
        />
      )}

      {/* Family Diary & Memories Modal */}
      {activeTab === 'journal' && (
        <JournalModal
          entries={journalEntries}
          onAddEntry={handleAddJournalEntry}
          currentDateStr={currentDay.displayDate}
          onClose={() => setActiveTab('diorama')}
        />
      )}

      {/* Interactive Video Game Tutorial Modal */}
      <GameTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
