/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Camera, Compass, Sparkles, HelpCircle } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface TopBarProps {
  activeTab: 'diorama' | 'flights' | 'journal' | 'luggage' | 'photos';
  onSelectTab: (tab: 'diorama' | 'flights' | 'journal' | 'luggage' | 'photos') => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
  cameraMode: 'orbit' | 'isometric' | 'abuelo_walk' | 'drone';
  onChangeCameraMode: (mode: 'orbit' | 'isometric' | 'abuelo_walk' | 'drone') => void;
  onTakeSnapshot: () => void;
  onOpenTutorial?: () => void;
  vitality: number;
  joyIndex: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  audioMuted,
  onToggleAudio,
  cameraMode,
  onChangeCameraMode,
  onTakeSnapshot,
  onOpenTutorial,
  vitality,
  joyIndex,
}) => {
  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 z-30 select-none">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title (Single Wordmark Element) */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('diorama');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">🌍</span>
            <span style={{ fontFamily: 'Cinzel, serif' }}>Abuelos Trip</span>
          </a>

          {/* Quick Vitality / Joy Indicators */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 pl-3 border-l border-slate-800">
            <div className="flex items-center gap-1.5" title="Vitalidad y energía de los abuelos">
              <span>⚡</span>
              <span className="font-mono text-emerald-400 font-semibold">{vitality}%</span>
              <span className="text-slate-500">Energía</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5" title="Índice de felicidad y disfrute">
              <span>💖</span>
              <span className="font-mono text-pink-400 font-semibold">{joyIndex}%</span>
              <span className="text-slate-500">Alegría</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Text Links with Hover Underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-slate-300">
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectTab('diorama');
            }}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              activeTab === 'diorama'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Mundo 3D
          </button>
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectTab('flights');
            }}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              activeTab === 'flights'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            6 Vuelos
          </button>
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectTab('journal');
            }}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              activeTab === 'journal'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Diario Familiar
          </button>
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectTab('luggage');
            }}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              activeTab === 'luggage'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Equipaje & Maletas
          </button>
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectTab('photos');
            }}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              activeTab === 'photos'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Álbum de Recuerdos
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Camera Mode Selector */}
          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => {
                audioEngine.playClick();
                onChangeCameraMode('orbit');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                cameraMode === 'orbit' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Cámara orbital libre"
            >
              Órbita
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                onChangeCameraMode('isometric');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                cameraMode === 'isometric' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista isométrica de diorama maqueta"
            >
              Isométrica
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                onChangeCameraMode('abuelo_walk');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                cameraMode === 'abuelo_walk' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista baja de paseo a pie con los abuelos"
            >
              Paseo Abuelo
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                onChangeCameraMode('drone');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                cameraMode === 'drone' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Vuelo cinemático panorámico de dron"
            >
              Dron 360°
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              onToggleAudio();
              audioEngine.playClick();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
            title={audioMuted ? 'Activar sonido ambiental' : 'Silenciar sonido'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* How to Play Tutorial Button */}
          {onOpenTutorial && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenTutorial();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-semibold text-xs transition-colors"
              title="Cómo jugar: Ver tutorial interactivo"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tutorial</span>
            </button>
          )}

          {/* 3D Snapshot Camera Button */}
          <button
            onClick={() => {
              audioEngine.playCameraShutter();
              onTakeSnapshot();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-sm shadow-amber-500/20 transition-colors whitespace-nowrap"
            title="Tomar fotografía 3D del diorama y guardar en el Álbum"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Foto 3D</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer row */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-slate-800/60 text-[11px] font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('diorama')}
          className={activeTab === 'diorama' ? 'text-amber-400 font-semibold' : ''}
        >
          Mundo 3D
        </button>
        <button
          onClick={() => onSelectTab('flights')}
          className={activeTab === 'flights' ? 'text-amber-400 font-semibold' : ''}
        >
          6 Vuelos
        </button>
        <button
          onClick={() => onSelectTab('journal')}
          className={activeTab === 'journal' ? 'text-amber-400 font-semibold' : ''}
        >
          Diario
        </button>
        <button
          onClick={() => onSelectTab('luggage')}
          className={activeTab === 'luggage' ? 'text-amber-400 font-semibold' : ''}
        >
          Maletas
        </button>
        <button
          onClick={() => onSelectTab('photos')}
          className={activeTab === 'photos' ? 'text-amber-400 font-semibold' : ''}
        >
          Fotos
        </button>
      </div>
    </header>
  );
};
