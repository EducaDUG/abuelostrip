/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AVAILABLE_SANDBOX_ASSETS } from '../data/tripData';
import { audioEngine } from '../utils/audioEngine';
import { Wrench, Sliders, Trash2, Sparkles, Plus } from 'lucide-react';
import { SandboxPlacedItem, WorldRegionId } from '../types';

interface SandboxToolboxProps {
  currentRegionId: WorldRegionId;
  activePlacementType: 'scenic_camp' | 'photo_spot' | 'gourmet_cafe' | 'wildlife_post' | 'shuttle_stop' | null;
  onSelectPlacementType: (type: 'scenic_camp' | 'photo_spot' | 'gourmet_cafe' | 'wildlife_post' | 'shuttle_stop' | null) => void;
  placedItems: SandboxPlacedItem[];
  onRemovePlacedItem: (id: string) => void;
  tripPace: 'relaxed' | 'balanced' | 'explorer';
  onChangeTripPace: (pace: 'relaxed' | 'balanced' | 'explorer') => void;
  gastronomyBudget: 'modest' | 'epicurean' | 'regal';
  onChangeGastronomyBudget: (budget: 'modest' | 'epicurean' | 'regal') => void;
  waveEnergy: number;
  onChangeWaveEnergy: (density: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const SandboxToolbox: React.FC<SandboxToolboxProps> = ({
  currentRegionId,
  activePlacementType,
  onSelectPlacementType,
  placedItems,
  onRemovePlacedItem,
  tripPace,
  onChangeTripPace,
  gastronomyBudget,
  onChangeGastronomyBudget,
  waveEnergy,
  onChangeWaveEnergy,
  isOpen,
  onToggleOpen,
}) => {
  const currentRegionItems = placedItems.filter((i) => i.regionId === currentRegionId);

  return (
    <div className="absolute top-16 left-4 z-20 max-w-xs w-full transition-all">
      {/* Toggle button */}
      <div className="flex justify-start mb-2">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-mono shadow-xl backdrop-blur-md transition-colors"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>Caja Sandbox & Gestión Tycoon</span>
          <span className="text-[10px] text-slate-400 font-sans">[{isOpen ? 'Ocultar' : 'Abrir'}]</span>
        </button>
      </div>

      {isOpen && (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-4 text-slate-200 text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 block">
                Herramientas del Mundo 3D
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">Construcción & Variables</h3>
            </div>
          </div>

          {/* Asset Placement Palette */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 block">
              1. Colocar Elementos en el Diorama:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {AVAILABLE_SANDBOX_ASSETS.map((asset) => {
                const isSelected = activePlacementType === asset.type;

                return (
                  <button
                    key={asset.type}
                    onClick={() => {
                      audioEngine.playClick();
                      onSelectPlacementType(isSelected ? null : asset.type);
                    }}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                        : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{asset.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white truncate">{asset.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 rounded">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{asset.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-400 font-mono">
                        <span>+{asset.bonus.energy} Energía</span>
                        <span>·</span>
                        <span>+{asset.bonus.joy} Alegría</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {activePlacementType && (
              <p className="text-[10px] text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-500/30">
                👉 Ahora haz clic con el ratón en cualquier punto del agua o suelo del diorama para colocarlo.
              </p>
            )}
          </div>

          {/* Placed items list in current diorama */}
          {currentRegionItems.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Elementos Colocados Aquí ({currentRegionItems.length}):
              </span>
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {currentRegionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px]"
                  >
                    <span className="text-slate-200 truncate">{item.name}</span>
                    <button
                      onClick={() => {
                        audioEngine.playClick();
                        onRemovePlacedItem(item.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                      title="Eliminar elemento"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sandbox Variables & Tycoon Tuning */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Parámetros de Simulación Tycoon:</span>
            </span>

            {/* Travel Pace */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block">Ritmo de Viaje de los Abuelos:</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => onChangeTripPace('relaxed')}
                  className={`py-1 text-[10px] rounded font-medium transition-colors ${
                    tripPace === 'relaxed' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tranquilo
                </button>
                <button
                  onClick={() => onChangeTripPace('balanced')}
                  className={`py-1 text-[10px] rounded font-medium transition-colors ${
                    tripPace === 'balanced' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Equilibrado
                </button>
                <button
                  onClick={() => onChangeTripPace('explorer')}
                  className={`py-1 text-[10px] rounded font-medium transition-colors ${
                    tripPace === 'explorer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Explorador
                </button>
              </div>
            </div>

            {/* Gastronomy Budget Level */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block">Estilo Gastronómico:</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => onChangeGastronomyBudget('modest')}
                  className={`py-1 text-[10px] rounded font-medium transition-colors ${
                    gastronomyBudget === 'modest' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Típico
                </button>
                <button
                  onClick={() => onChangeGastronomyBudget('epicurean')}
                  className={`py-1 text-[10px] rounded font-medium transition-colors ${
                    gastronomyBudget === 'epicurean' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sibarita
                </button>
                <button
                  onClick={() => onChangeGastronomyBudget('regal')}
                  className={`py-1 text-[10px] rounded font-medium transition-colors ${
                    gastronomyBudget === 'regal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Banquete
                </button>
              </div>
            </div>

            {/* Marine Wave Energy Density */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Oleaje & Energía Marina:</span>
                <span className="font-mono text-cyan-300 font-semibold">{waveEnergy}x</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2.0}
                step={0.1}
                value={waveEnergy}
                onChange={(e) => onChangeWaveEnergy(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
