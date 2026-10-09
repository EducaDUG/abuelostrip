/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { TRIP_DAYS } from '../data/tripData';
import { TripDay } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { ChevronLeft, ChevronRight, Play, Pause, Plane } from 'lucide-react';

interface TimelineBarProps {
  currentDayIndex: number;
  onSelectDayIndex: (idx: number) => void;
  isPlayingTour: boolean;
  onTogglePlayTour: () => void;
  timeOfDay: number;
  onChangeTimeOfDay: (time: number) => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  currentDayIndex,
  onSelectDayIndex,
  isPlayingTour,
  onTogglePlayTour,
  timeOfDay,
  onChangeTimeOfDay,
}) => {
  const currentDay = TRIP_DAYS[currentDayIndex];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline to active day
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`[data-day="${currentDayIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentDayIndex]);

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      audioEngine.playClick();
      onSelectDayIndex(currentDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < TRIP_DAYS.length - 1) {
      audioEngine.playClick();
      onSelectDayIndex(currentDayIndex + 1);
    }
  };

  // Format time of day
  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <footer className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-200 select-none z-30 transition-all">
      {/* Upper Status & Date Scrub Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
        {/* Active Day Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 font-mono text-sm">
              Día {currentDay.dayNumber} de {TRIP_DAYS.length}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-white font-medium text-sm">{currentDay.displayDate}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>{currentDay.countryFlag}</span>
            <span className="text-slate-300 font-medium">{currentDay.locationName}</span>
          </div>

          {currentDay.flight && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 font-mono text-[11px]">
              <Plane className="w-3.5 h-3.5 rotate-45 text-sky-400" />
              <span>{currentDay.flight.originCode} → {currentDay.flight.destinationCode}</span>
              <span className="text-sky-400/80">({currentDay.flight.durationApprox})</span>
            </div>
          )}
        </div>

        {/* Play Tour, Navigation Buttons & Sun Time Slider */}
        <div className="flex items-center gap-4">
          {/* Day/Night Celestial Sun Slider */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700/60">
            <span className="text-amber-400 text-xs">☀️</span>
            <span className="text-[11px] font-mono text-slate-300 min-w-[36px]">{formatTime(timeOfDay)}</span>
            <input
              type="range"
              min={0}
              max={24}
              step={0.5}
              value={timeOfDay}
              onChange={(e) => onChangeTimeOfDay(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              title="Ajustar hora solar del diorama"
            />
          </div>

          {/* Stepper & Play Tour */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700/80">
            <button
              onClick={handlePrevDay}
              disabled={currentDayIndex === 0}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
              title="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                onTogglePlayTour();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                isPlayingTour
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
              title="Reproducir viaje día a día"
            >
              {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingTour ? 'Pausa' : 'Tour Auto'}</span>
            </button>

            <button
              onClick={handleNextDay}
              disabled={currentDayIndex === TRIP_DAYS.length - 1}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
              title="Día siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrubbable Date Ribbon */}
      <div
        ref={scrollContainerRef}
        className="max-w-7xl mx-auto px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex items-center gap-2 select-none"
      >
        {TRIP_DAYS.map((day, idx) => {
          const isActive = idx === currentDayIndex;
          const isFlightDay = !!day.flight;

          return (
            <button
              key={day.date}
              data-day={idx}
              onClick={() => {
                audioEngine.playClick();
                onSelectDayIndex(idx);
              }}
              className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-1.5 rounded-md border text-left transition-all ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span>D{day.dayNumber}</span>
                {isFlightDay && <span className="text-sky-400">✈️</span>}
                <span>{day.countryFlag}</span>
              </div>
              <div className="text-xs font-semibold whitespace-nowrap text-slate-200">
                {day.date.slice(5).replace('-', '/')}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[85px]">
                {day.locationName.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>
    </footer>
  );
};
