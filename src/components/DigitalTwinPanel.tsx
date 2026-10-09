/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DigitalTwinReport } from '../utils/simulationEngine';
import { TripDay } from '../types';
import { Activity, Waves, Clock, Scale, CloudSun, Wind, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DigitalTwinPanelProps {
  report: DigitalTwinReport;
  currentDay: TripDay;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const DigitalTwinPanel: React.FC<DigitalTwinPanelProps> = ({
  report,
  currentDay,
  isOpen,
  onToggleOpen,
}) => {
  return (
    <div className="absolute top-16 right-4 z-20 max-w-sm w-full transition-all">
      {/* Toggle button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono shadow-xl backdrop-blur-md transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gemelo Digital · Telemetría Física</span>
          <span className="text-[10px] text-slate-400 font-sans">[{isOpen ? 'Ocultar' : 'Ver'}]</span>
        </button>
      </div>

      {isOpen && (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-4 text-slate-200 text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 block">
                Física & Ecuaciones en Tiempo Real
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Digital Twin: {currentDay.locationName.split(' ')[0]}
              </h3>
            </div>
            <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              Modo Activo
            </div>
          </div>

          {/* 1. Marine Hydrodynamics Equation Block */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-cyan-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" /> Hidrodinámica Marina & Mareas
              </span>
              <span className="font-mono text-[11px] text-slate-400">P = 0.49 · H² · T</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block">Marea (M2/K1):</span>
                <span className="text-white font-semibold">{report.marine.tideHeightMeters > 0 ? `+${report.marine.tideHeightMeters}` : report.marine.tideHeightMeters} m</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Corriente:</span>
                <span className="text-cyan-400 font-semibold">{report.marine.tidalCurrentKnots} nudos</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Oleaje (Hs):</span>
                <span className="text-white font-semibold">{report.marine.waveSwellMeters} m</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Densidad Flujo:</span>
                <span className="text-amber-400 font-semibold">{report.marine.waveEnergyFluxKWperM} kW/m</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
              <span>Temp. Agua: <strong className="text-slate-200">{report.marine.waterTemperatureC}°C</strong></span>
              <span>Confort Acuático: <strong className="text-emerald-400">{report.marine.oceanicComfortScore}%</strong></span>
            </div>
          </div>

          {/* 2. Circadian Desynchronization & Jetlag Model */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-amber-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Ritmo Circadiano & Jetlag
              </span>
              <span className="font-mono text-[11px]">{currentDay.timezone}</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Desfase Huso Horario:</span>
                <span className="font-mono text-white">+{report.circadian.circadianPhaseOffsetHours} h residuales</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Severidad de Jetlag:</span>
                <span className={`font-mono font-semibold ${report.circadian.jetlagSeverityPct > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {report.circadian.jetlagSeverityPct}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ventana Óptima de Alerta:</span>
                <span className="font-mono text-cyan-300">{report.circadian.peakAlertnessWindow}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sueño Recomendado:</span>
                <span className="font-mono text-white">{report.circadian.recommendedSleepDurationHours} horas</span>
              </div>
            </div>
          </div>

          {/* 3. Luggage Weight Physics & Flight Limit */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-indigo-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" /> Física del Equipaje
              </span>
              <span className="font-mono text-[11px] text-slate-400">Límite Vuelo</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Peso Total Empacado:</span>
              <span className={`font-mono font-bold text-sm ${report.luggageUnderLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {report.luggageTotalKg} kg / {report.luggageAllowanceKg} kg
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  report.luggageUnderLimit ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (report.luggageTotalKg / report.luggageAllowanceKg) * 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] pt-1">
              {report.luggageUnderLimit ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Equipaje dentro de norma de la aerolínea
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Exceso de peso: reordenar recuerdos
                </span>
              )}
            </div>
          </div>

          {/* 4. Microclimate Atmospheric Conditions */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentDay.typicalWeather.condition}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-slate-400">
              <span className="text-white">{currentDay.typicalWeather.tempC}°C</span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3" /> {currentDay.typicalWeather.windSpeedKmh} km/h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
