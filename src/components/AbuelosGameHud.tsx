/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AbuelosGameState,
  TripDay,
  DailyQuest
} from '../types';
import { audioEngine } from '../utils/audioEngine';
import {
  Beer,
  Utensils,
  Mountain,
  Heart,
  Zap,
  Coffee,
  Coins,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Smile,
  Frown,
  Camera,
  Compass
} from 'lucide-react';

interface AbuelosGameHudProps {
  gameState: AbuelosGameState;
  onUpdateGameState: (updater: (prev: AbuelosGameState) => AbuelosGameState) => void;
  currentDay: TripDay;
  onOpenFoodTasting: () => void;
  onTakeSnapshot: () => void;
  onOpenTutorial: () => void;
}

// Regional mountain and summit destinations
const REGION_PEAKS: Record<string, { name: string; altitude: string; challenge: string }> = {
  hobbiton: {
    name: 'Colina de Bolsón Cerrado & Molino de Agua',
    altitude: '240 m',
    challenge: 'Subida entre setos, puertas hobbit redondas y jardines de flores.',
  },
  rotorua: {
    name: 'Cráter Volcánico & Mirador Te Puia',
    altitude: '380 m',
    challenge: 'Caminata entre fumarolas de azufre y géiseres humeantes.',
  },
  auckland: {
    name: 'Cráter de Mount Eden (Maungawhau)',
    altitude: '196 m',
    challenge: 'Cráter de hierba volcánica con vistas 360° al skyline y los dos puertos.',
  },
  queenstown: {
    name: "Bob's Peak & Cresta de The Remarkables",
    altitude: '450 m',
    challenge: 'Ascensión vertiginosa frente al Lago Wakatipu y las cumbres nevadas.',
  },
  wanaka: {
    name: "Roy's Peak & Mirador del Lago Wanaka",
    altitude: '520 m',
    challenge: 'Crestas alpinas doradas con vista al árbol solitario en el agua.',
  },
  milford: {
    name: 'Paso de Homer & Cascadas Glaciares',
    altitude: '945 m',
    challenge: 'Murallas de roca vertical donde caen cataratas desde las nubes.',
  },
  dunedin: {
    name: 'Baldwin Street & Signal Hill Lookout',
    altitude: '390 m',
    challenge: '¡La calle más empinada del planeta! Prueba de piernas para los abuelos.',
  },
  christchurch: {
    name: 'Port Hills & Cráter del Puerto Lyttelton',
    altitude: '495 m',
    challenge: 'Vistas panorámicas de los Alpes del Sur y la llanura de Canterbury.',
  },
  waiheke: {
    name: 'Colina de Viñedos de Oneroa & Mirador del Golfo',
    altitude: '180 m',
    challenge: 'Senderos entre olivos, cepas de vino y mar azul turquesa.',
  },
  fiji: {
    name: 'Monte Batilamu & Mirador del Arrecife de Coral',
    altitude: '320 m',
    challenge: 'Sendero tropical con brisa marina entre cocoteros y lagunas.',
  },
  singapore: {
    name: 'Skyway de los Supertrees & Monte Faber',
    altitude: '105 m',
    challenge: 'Pasarelas futuristas suspendidas entre jardines verticales gigantes.',
  },
  azerbaijan: {
    name: 'Colina de los Mártires & Montaña de Fuego Yanar Dag',
    altitude: '210 m',
    challenge: 'Terrazas con fuego eterno y vista panorámica al Mar Caspio.',
  },
  spain_turkey: {
    name: 'Torre de Gálata & Colina de Çamlıca',
    altitude: '268 m',
    challenge: 'Vistas gloriosas a los minaretes y el estrecho del Bósforo.',
  },
  flight_transit: {
    name: 'Paseo por el Pasillo del Boeing 787 en el Aire',
    altitude: '11.000 m',
    challenge: 'Estiramiento de gemelos y paseo para la circulación sobre el Pacífico.',
  },
};

export const AbuelosGameHud: React.FC<AbuelosGameHudProps> = ({
  gameState,
  onUpdateGameState,
  currentDay,
  onOpenFoodTasting,
  onTakeSnapshot,
  onOpenTutorial,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'status' | 'quests'>('status');
  const [alertMessage, setAlertMessage] = useState<{ type: 'warn' | 'success' | 'resaca'; text: string } | null>(null);
  const [mountainTriumph, setMountainTriumph] = useState<{ peakName: string; rewards: string } | null>(null);

  // Dynamic dialogue calculation based on state (concise & punchy)
  const getAbuelosDialogue = () => {
    if (gameState.hangover) {
      return {
        speaker: 'Padre Borque 🤕',
        quote: '¡Uff, qué resaca! Capellan Dailos, dame un café y un ibuprofeno.',
        mood: 'resaca',
      };
    }
    if (gameState.drunkenness >= 45) {
      return {
        speaker: 'Padre Borque 🍺',
        quote: '¡Qué rica la cerveza kiwi! ¡A disfrutar del viaje!',
        mood: 'alegre',
      };
    }
    if (gameState.hunger >= 70) {
      return {
        speaker: 'Capellan Dailos 🤤',
        quote: '¡Tengo mucha hambre! Paremos a comer antes de seguir.',
        mood: 'hambre',
      };
    }
    if (gameState.vitality <= 25) {
      return {
        speaker: 'Padre Borque 😫',
        quote: 'Cansancio total. Hora de recargar pilas comiendo.',
        mood: 'cansado',
      };
    }
    if (gameState.joyIndex >= 90) {
      return {
        speaker: 'Capellan Dailos 😊',
        quote: '¡Qué paisaje tan bonito! Estamos disfrutando a tope.',
        mood: 'feliz',
      };
    }
    return {
      speaker: 'Abuelos 🎒',
      quote: `Explorando ${currentDay.locationName}. ¡Buen ritmo!`,
      mood: 'neutral',
    };
  };

  const currentDialogue = getAbuelosDialogue();
  const currentPeak = REGION_PEAKS[currentDay.regionId] || REGION_PEAKS.auckland;

  const showTempAlert = (type: 'warn' | 'success' | 'resaca', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // ACTION 1: Subir al Monte / Gran Excursión
  const handleClimbMountain = () => {
    // 1. Check Hangover
    if (gameState.hangover) {
      audioEngine.playDizzyGroan();
      showTempAlert('resaca', '🚫 ¡Tienen resaca! Toma Café & Anti-Resaca primero.');
      return;
    }

    // 2. Check Hunger
    if (gameState.hunger >= 75) {
      audioEngine.playDizzyGroan();
      showTempAlert('warn', '🚫 ¡Tienen demasiada hambre! Come antes de subir.');
      return;
    }

    // 3. Check Vitality / Energy
    if (gameState.vitality < 35) {
      audioEngine.playDizzyGroan();
      showTempAlert('warn', '🚫 ¡Falta energía (mín 35%)! Come algo rico para recargar.');
      return;
    }

    // SUCCESS! Mountain conquered!
    audioEngine.playMountainHikeTriumph();
    onUpdateGameState((prev) => ({
      ...prev,
      vitality: Math.max(5, prev.vitality - 30),
      hunger: Math.min(100, prev.hunger + 25),
      coins: prev.coins + 50,
      joyIndex: Math.min(100, prev.joyIndex + 35),
      culturalDiscoveryScore: prev.culturalDiscoveryScore + 40,
      activeBuffs: Array.from(new Set([...prev.activeBuffs, 'conquistador_cimas'])),
      completedQuests: Array.from(new Set([...prev.completedQuests, `hike-${currentDay.dayNumber}`])),
    }));

    setMountainTriumph({
      peakName: currentPeak.name,
      rewards: '+50 Monedas NZD, +35 Alegría, Logro "Cima Conquistada"',
    });
  };

  // ACTION 2: Beber Cerveza Artesanal
  const handleDrinkBeer = () => {
    if (gameState.coins < 8) {
      showTempAlert('warn', '⚠️ ¡No tienes suficientes dólares kiwi! Necesitas $8 NZD para una pinta.');
      return;
    }

    audioEngine.playBeerGulp();

    onUpdateGameState((prev) => {
      const newDrunkenness = prev.drunkenness + 35;
      const willHangover = newDrunkenness >= 65;
      const newCoins = prev.coins - 8;

      if (willHangover && !prev.hangover) {
        setTimeout(() => {
          audioEngine.playDizzyGroan();
          showTempAlert(
            'resaca',
            '🤕 ¡AY MI CABEZA! El abuelo se ha pasado con las pintas y le ha entrado una RESACA MONUMENTAL. ¡No podrá subir al monte hasta curarse!'
          );
        }, 500);
      } else {
        showTempAlert('success', '🍻 ¡Qué rica la pinta! Alegría +20, pero ojo con el puntillo...');
      }

      return {
        ...prev,
        coins: newCoins,
        joyIndex: Math.min(100, prev.joyIndex + 20),
        drunkenness: newDrunkenness,
        hangover: willHangover,
        vitality: willHangover ? Math.max(10, prev.vitality - 25) : prev.vitality,
        completedQuests: Array.from(new Set([...prev.completedQuests, `beer-${currentDay.dayNumber}`])),
      };
    });
  };

  // ACTION 3: Comer Plato Típico
  const handleEatFoodQuick = () => {
    if (gameState.coins < 15) {
      showTempAlert('warn', '⚠️ Necesitas $15 NZD para comer. Acaricia ovejas o completa misiones para ganar monedas.');
      return;
    }

    audioEngine.playEatMunch();
    onUpdateGameState((prev) => ({
      ...prev,
      coins: prev.coins - 15,
      hunger: 0,
      vitality: Math.min(100, prev.vitality + 45),
      drunkenness: Math.max(0, prev.drunkenness - 20),
      gourmetScore: prev.gourmetScore + 25,
      joyIndex: Math.min(100, prev.joyIndex + 15),
      activeBuffs: Array.from(new Set([...prev.activeBuffs, 'barriga_llena'])),
      completedQuests: Array.from(new Set([...prev.completedQuests, `eat-${currentDay.dayNumber}`])),
    }));

    showTempAlert(
      'success',
      '🍖 ¡Festín delicioso! Hambre a cero, Energía +45%. ¡Ahora sí tienen fuerzas para subir al monte!'
    );
  };

  // ACTION 4: Remedio Anti-Resaca & Café Flat White
  const handleCureHangover = () => {
    if (!gameState.hangover && gameState.drunkenness < 20) {
      showTempAlert('warn', '💡 Los abuelos no tienen resaca ahora mismo. ¡Están frescos como una lechuga!');
      return;
    }

    if (gameState.coins < 6) {
      showTempAlert('warn', '⚠️ Necesitas $6 NZD para el café con leche y el botellín de agua.');
      return;
    }

    audioEngine.playCoinReward();
    onUpdateGameState((prev) => ({
      ...prev,
      coins: prev.coins - 6,
      hangover: false,
      drunkenness: 0,
      vitality: Math.min(100, prev.vitality + 30),
      joyIndex: Math.min(100, prev.joyIndex + 15),
      activeBuffs: prev.activeBuffs.filter((b) => b !== 'resaca'),
    }));

    showTempAlert(
      'success',
      '☕💊 ¡Mano de santo! Café Flat White bien cargado, agua fresca y una pastillita. ¡Resaca curada y listos para la montaña!'
    );
  };

  // ACTION 5: Acariciar Oveja Kiwi
  const handlePetSheep = () => {
    audioEngine.playSheepBaa();
    onUpdateGameState((prev) => ({
      ...prev,
      coins: prev.coins + 15,
      joyIndex: Math.min(100, prev.joyIndex + 15),
      activeBuffs: Array.from(new Set([...prev.activeBuffs, 'amigo_de_las_ovejas'])),
      completedQuests: Array.from(new Set([...prev.completedQuests, `sheep-${currentDay.dayNumber}`])),
    }));

    showTempAlert(
      'success',
      '🐑 ¡Beee! La oveja kiwi se ha dejado acariciar la lana suave. ¡Los abuelos sonríen y ganan +$15 NZD!'
    );
  };

  // ACTION 6: Oración / Misa
  const handlePray = () => {
    audioEngine.playCoinReward();
    onUpdateGameState((prev) => ({
      ...prev,
      coins: prev.coins + 20,
      joyIndex: Math.min(100, prev.joyIndex + 20),
      vitality: Math.min(100, prev.vitality + 10),
      completedQuests: Array.from(new Set([...prev.completedQuests, `pray-${currentDay.dayNumber}`])),
    }));

    showTempAlert(
      'success',
      '🙏 Padre Borque y Capellan Dailos rezan juntos con calma. ¡Paz en el corazón, +$20 NZD y energía renovada!'
    );
  };

  // Quests for the day
  const dailyQuests: { id: string; title: string; desc: string; icon: string; reward: number; done: boolean }[] = [
    {
      id: `hike-${currentDay.dayNumber}`,
      title: `Subir a ${currentPeak.name.split('&')[0]}`,
      desc: 'Requiere tener energía (>=35%), no tener hambre ni resaca.',
      icon: '🏔️',
      reward: 50,
      done: gameState.completedQuests.includes(`hike-${currentDay.dayNumber}`),
    },
    {
      id: `eat-${currentDay.dayNumber}`,
      title: 'Comer plato típico antes del monte',
      desc: 'Cargar la barra de energía para no desfallecer en el camino.',
      icon: '🍽️',
      reward: 25,
      done: gameState.completedQuests.includes(`eat-${currentDay.dayNumber}`),
    },
    {
      id: `beer-${currentDay.dayNumber}`,
      title: 'Tomar cerveza artesanal (¡con cuidado!)',
      desc: 'Disfrutar de la taberna local sin pasarse de la raya o curarse si da resaca.',
      icon: '🍺',
      reward: 30,
      done: gameState.completedQuests.includes(`beer-${currentDay.dayNumber}`),
    },
    {
      id: `sheep-${currentDay.dayNumber}`,
      title: 'Acariciar una oveja o fauna de la región',
      desc: 'Conectar con la naturaleza rural de Nueva Zelanda.',
      icon: '🐑',
      reward: 15,
      done: gameState.completedQuests.includes(`sheep-${currentDay.dayNumber}`),
    },
    {
      id: `pray-${currentDay.dayNumber}`,
      title: 'Rezar o asistir a misa',
      desc: 'Un momento de oración, Eucaristía o visita a una iglesia del lugar.',
      icon: '🙏',
      reward: 20,
      done: gameState.completedQuests.includes(`pray-${currentDay.dayNumber}`),
    },
  ];

  return (
    <>
      {/* Floating Alert Toast */}
      {alertMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-all">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md border text-xs font-semibold flex items-center gap-2 ${
              alertMessage.type === 'resaca'
                ? 'bg-purple-900/95 border-purple-400 text-purple-100 shadow-purple-900/50'
                : alertMessage.type === 'warn'
                ? 'bg-amber-900/95 border-amber-400 text-amber-100 shadow-amber-900/50'
                : 'bg-emerald-900/95 border-emerald-400 text-emerald-100 shadow-emerald-900/50'
            }`}
          >
            <span>{alertMessage.text}</span>
          </div>
        </div>
      )}

      {/* Mountain Triumph Victory Popup */}
      {mountainTriumph && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center relative animate-in fade-in zoom-in duration-200">
            <div className="text-5xl mb-2 animate-bounce">🏔️👑🎉</div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              ¡RETO DEL MONTE CONQUISTADO!
            </span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">{mountainTriumph.peakName}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ¡Increíble hazaña de los abuelos! Subieron la pendiente con paso firme, disfrutaron de la brisa en la
              cumbre y saludaron a todos los excursionistas jóvenes que iban jadeando.
            </p>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-emerald-300 font-medium mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{mountainTriumph.rewards}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onTakeSnapshot();
                  setMountainTriumph(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Foto de Cima para el Álbum</span>
              </button>
              <button
                onClick={() => setMountainTriumph(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                ¡Olé!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Game HUD Panel */}
      <div className="absolute top-16 right-4 z-20 max-w-sm w-full select-none transition-all">
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-200 text-xs">
          {/* Header Bar */}
          <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <div>
                <span className="font-bold text-white text-xs block leading-tight flex items-center gap-1.5">
                  <span>Ritmo & Estado de los Abuelos</span>
                  {gameState.hangover && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/30 text-purple-300 border border-purple-400 animate-pulse font-mono">
                      RESACA 🤕
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  Dólares Kiwi: <strong className="text-white">${gameState.coins} NZD</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenTutorial();
                }}
                className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                title="Ver Tutorial de Juego"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Tutorial</span>
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Minimizar' : 'Expandir'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          {isExpanded && (
            <div className="p-3.5 space-y-3 max-h-[55vh] overflow-y-auto">
              {/* Tab Selector */}
              <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-[11px] font-medium">
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setActiveTab('status');
                  }}
                  className={`flex-1 py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    activeTab === 'status' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Estado & Acciones</span>
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setActiveTab('quests');
                  }}
                  className={`flex-1 py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    activeTab === 'quests' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🎯</span>
                  <span>Misiones ({dailyQuests.filter((q) => q.done).length}/{dailyQuests.length})</span>
                </button>
              </div>

              {/* TAB 1: Live Status & Interactive Actions */}
              {activeTab === 'status' && (
                <div className="space-y-3">
                  {/* Dialogue Bubble */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all text-[11px] leading-relaxed relative ${
                      gameState.hangover
                        ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                        : gameState.hunger >= 70
                        ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-[10px] text-amber-400 font-mono mb-0.5">
                      {currentDialogue.speaker}
                    </span>
                    <p className="italic">"{currentDialogue.quote}"</p>
                  </div>

                  {/* 4 Core Game Gauges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {/* 1. Vitalidad / Energía */}
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>Energía:</span>
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            gameState.vitality < 30 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                          }`}
                        >
                          {gameState.vitality}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            gameState.vitality < 30
                              ? 'bg-rose-500'
                              : gameState.vitality < 60
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${gameState.vitality}%` }}
                        />
                      </div>
                    </div>

                    {/* 2. Hambre */}
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-amber-400" />
                          <span>Hambre:</span>
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            gameState.hunger >= 70 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                          }`}
                        >
                          {gameState.hunger}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            gameState.hunger >= 70
                              ? 'bg-rose-500'
                              : gameState.hunger >= 40
                              ? 'bg-amber-400'
                              : 'bg-blue-400'
                          }`}
                          style={{ width: `${gameState.hunger}%` }}
                        />
                      </div>
                    </div>

                    {/* 3. Embriaguez / Cerveza */}
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Beer className="w-3 h-3 text-amber-300" />
                          <span>Cerveza:</span>
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            gameState.hangover
                              ? 'text-purple-400 font-extrabold animate-pulse'
                              : gameState.drunkenness >= 45
                              ? 'text-amber-300'
                              : 'text-slate-300'
                          }`}
                        >
                          {gameState.hangover ? '¡RESACA!' : `${gameState.drunkenness}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            gameState.hangover
                              ? 'bg-purple-500'
                              : gameState.drunkenness >= 50
                              ? 'bg-amber-500'
                              : 'bg-amber-300'
                          }`}
                          style={{ width: `${Math.min(100, gameState.drunkenness)}%` }}
                        />
                      </div>
                    </div>

                    {/* 4. Felicidad / Alegría */}
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-pink-400" />
                          <span>Alegría:</span>
                        </span>
                        <span className="font-mono font-bold text-pink-400">{gameState.joyIndex}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 transition-all duration-300"
                          style={{ width: `${gameState.joyIndex}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* GAME ACTIONS: "Cosas que hacer" */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 block font-semibold">
                      Acciones de Juego Disponibles:
                    </span>

                    {/* 1. Subir al Monte */}
                    <button
                      onClick={handleClimbMountain}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-between group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-black/20 text-base">🏔️</span>
                        <div className="text-left">
                          <span className="block leading-tight group-hover:text-amber-200">
                            Subir al Monte ({currentPeak.name.split('&')[0]})
                          </span>
                          <span className="text-[10px] text-emerald-100 font-normal block">
                            Requiere: ⚡ &gt;35% · Sin Resaca · Sin Hambre
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-[10px] font-mono text-emerald-200">
                        +50$
                      </span>
                    </button>

                    {/* Grid of secondary actions */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Comer Plato Típico */}
                      <button
                        onClick={handleEatFoodQuick}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-slate-200 transition-all text-left flex items-start gap-1.5 active:scale-[0.98]"
                      >
                        <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[11px] block text-white">Comer Típico</span>
                          <span className="text-[9px] text-slate-400 block leading-tight">
                            Hambre a 0 · Energía +45% ($15)
                          </span>
                        </div>
                      </button>

                      {/* Tomar Pinta / Cerveza */}
                      <button
                        onClick={handleDrinkBeer}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-slate-200 transition-all text-left flex items-start gap-1.5 active:scale-[0.98]"
                      >
                        <Beer className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[11px] block text-white">Pedir Pinta</span>
                          <span className="text-[9px] text-slate-400 block leading-tight">
                            Alegría +20 · ¡Ojo resaca! ($8)
                          </span>
                        </div>
                      </button>

                      {/* Curar Resaca con Café + Ibuprofeno */}
                      <button
                        onClick={handleCureHangover}
                        className={`p-2 rounded-xl border transition-all text-left flex items-start gap-1.5 active:scale-[0.98] ${
                          gameState.hangover
                            ? 'bg-purple-900/60 border-purple-400 text-purple-100 hover:bg-purple-900/80 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <Coffee className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[11px] block text-white">Café & Anti-Resaca</span>
                          <span className="text-[9px] text-slate-400 block leading-tight">
                            Quita resaca · Energía +30% ($6)
                          </span>
                        </div>
                      </button>

                      {/* Acariciar Oveja Kiwi */}
                      <button
                        onClick={handlePetSheep}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-400/50 text-slate-200 transition-all text-left flex items-start gap-1.5 active:scale-[0.98]"
                      >
                        <span className="text-sm shrink-0">🐑</span>
                        <div>
                          <span className="font-semibold text-[11px] block text-white">Acariciar Oveja</span>
                          <span className="text-[9px] text-slate-400 block leading-tight">
                            Gana +$15 NZD · Alegría +15
                          </span>
                        </div>
                      </button>

                      {/* Rezar / Misa */}
                      <button
                        onClick={handlePray}
                        className="col-span-2 p-2 rounded-xl bg-sky-900/50 hover:bg-sky-900/70 border border-sky-700 hover:border-sky-400/60 text-slate-200 transition-all text-left flex items-start gap-1.5 active:scale-[0.98]"
                      >
                        <span className="text-sm shrink-0">🙏</span>
                        <div>
                          <span className="font-semibold text-[11px] block text-white">Rezar / Asistir a Misa</span>
                          <span className="text-[9px] text-slate-400 block leading-tight">
                            Gana +$20 NZD · Alegría +20 · Energía +10
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Daily Quests */}
              {activeTab === 'quests' && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 block font-semibold">
                    Objetivos de {currentDay.locationName}:
                  </span>

                  {dailyQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                        quest.done
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base">{quest.icon}</span>
                        <div>
                          <span
                            className={`font-semibold text-[11px] block leading-tight ${
                              quest.done ? 'line-through text-emerald-400' : 'text-white'
                            }`}
                          >
                            {quest.title}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-snug">{quest.desc}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end">
                        {quest.done ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hecho</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-400 font-semibold">
                            +${quest.reward}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
