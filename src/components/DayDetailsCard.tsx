/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TripDay, AttractionPoint } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { MapPin, Utensils, Heart, ChevronDown, ChevronUp, Sparkles, Compass } from 'lucide-react';

interface DayDetailsCardProps {
  day: TripDay;
  onSelectAttraction: (attr: AttractionPoint) => void;
  onOpenFoodTasting: () => void;
}

export const DayDetailsCard: React.FC<DayDetailsCardProps> = ({
  day,
  onSelectAttraction,
  onOpenFoodTasting,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-24 left-4 z-20 max-w-sm w-full transition-all">
      <div className="bg-slate-900/90 hover:bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-200 text-xs transition-all">
        {/* Card Header */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{day.countryFlag}</span>
            <div>
              <span className="font-bold text-white text-xs block leading-tight">
                {day.locationName}
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {day.displayDate.split(' 2026')[0]}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expandir detalles' : 'Minimizar detalles'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Body */}
        {!isCollapsed && (
          <div className="p-3.5 space-y-2.5 max-h-[42vh] overflow-y-auto">
            {/* Summary */}
            <p className="text-slate-300 text-xs leading-snug">{day.summary}</p>

            {/* Attractions in this location */}
            {day.attractions.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 block font-semibold flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Puntos 3D:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {day.attractions.map((attr) => (
                    <button
                      key={attr.id}
                      onClick={() => {
                        audioEngine.playClick();
                        onSelectAttraction(attr);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400/50 text-[11px] text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{attr.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Traditional Food teaser & Tasting trigger */}
            {day.foods.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Plato típico:</span>
                  <span className="text-xs font-semibold text-white">
                    {day.foods[0].name.split('(')[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onOpenFoodTasting();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Degustar</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
