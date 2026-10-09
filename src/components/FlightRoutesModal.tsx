/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FLIGHTS, TRIP_DAYS } from '../data/tripData';
import { FlightSegment } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, Plane, Clock, Luggage, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface FlightRoutesModalProps {
  onSelectFlightDay: (dayIndex: number) => void;
  onClose: () => void;
}

export const FlightRoutesModal: React.FC<FlightRoutesModalProps> = ({
  onSelectFlightDay,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-950/50 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <Plane className="w-3.5 h-3.5 rotate-45" />
              <span>Itinerario Oficial · 6 Vuelos Comprados 2026</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Los 6 Vuelos Alrededor del Mundo
            </h2>
            <p className="text-xs text-slate-400">
              Todos los trayectos comprados con sus horarios, aerolíneas, escalas y límites de maletas. Haz clic en cualquiera para navegar a esa fecha.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flight Cards Grid */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FLIGHTS.map((flight, idx) => {
              // Find matching dayIndex
              const dayIndex = TRIP_DAYS.findIndex((d) => d.flight?.id === flight.id);

              return (
                <div
                  key={flight.id}
                  onClick={() => {
                    if (dayIndex !== -1) {
                      audioEngine.playFlightJet();
                      onSelectFlightDay(dayIndex);
                      onClose();
                    }
                  }}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-400/60 transition-all cursor-pointer group shadow-lg space-y-3"
                >
                  {/* Top flight badge */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-amber-400">
                      Vuelo #{idx + 1}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {flight.dateStr}
                    </span>
                  </div>

                  {/* Route trajectory */}
                  <div className="flex items-center justify-between py-1 border-y border-slate-700/60">
                    <div className="text-left">
                      <span className="font-mono text-lg font-bold text-white block">
                        {flight.originCode}
                      </span>
                      <span className="text-[11px] text-slate-400">{flight.origin}</span>
                    </div>

                    <div className="flex flex-col items-center px-3">
                      <span className="text-[11px] font-mono text-sky-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {flight.durationApprox}
                      </span>
                      <div className="flex items-center gap-1 text-slate-600 mt-0.5">
                        <span className="w-8 h-[1px] bg-slate-600" />
                        <Plane className="w-3.5 h-3.5 text-sky-400 rotate-45 group-hover:translate-x-1 transition-transform" />
                        <span className="w-8 h-[1px] bg-slate-600" />
                      </div>
                      {flight.layover && (
                        <span className="text-[10px] text-amber-400/90 font-mono mt-1">
                          {flight.layover}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-lg font-bold text-white block">
                        {flight.destinationCode}
                      </span>
                      <span className="text-[11px] text-slate-400">{flight.destination}</span>
                    </div>
                  </div>

                  {/* Airline, Booking ref & Luggage */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Aerolínea / Vuelo:</span>
                      <span className="font-medium text-slate-200">
                        {flight.airline} {flight.flightNumber && `(${flight.flightNumber})`}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Equipaje por Persona:</span>
                      <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <Luggage className="w-3 h-3" /> {flight.luggageLimitKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Booking notes & code */}
                  {(flight.bookingRef || flight.notes) && (
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[11px] text-slate-400 space-y-0.5">
                      {flight.bookingRef && (
                        <div className="text-sky-300 font-mono">
                          Ref / Tarifa: <strong>{flight.bookingRef}</strong>
                        </div>
                      )}
                      {flight.notes && <p className="text-[10px] italic">{flight.notes}</p>}
                    </div>
                  )}

                  <div className="flex items-center justify-end text-[11px] text-sky-400 group-hover:text-sky-300 font-medium gap-1 pt-1">
                    <span>Teletransportar a esta fecha</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Itinerario 100% confirmado para el viaje de los abuelos en 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
