/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AttractionPoint } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, CheckCircle, Compass, Heart, Award } from 'lucide-react';

interface AttractionModalProps {
  attraction: AttractionPoint | null;
  onClose: () => void;
  isVisited: boolean;
  onMarkVisited: (id: string) => void;
}

export const AttractionModal: React.FC<AttractionModalProps> = ({
  attraction,
  onClose,
  isVisited,
  onMarkVisited,
}) => {
  if (!attraction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Atracción & Qué Ver · {attraction.category}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{attraction.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Main Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Descripción</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{attraction.description}</p>
          </div>

          {/* Highlight Callout */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-1">Punto Inolvidable:</span>
            {attraction.highlight}
          </div>

          {/* Senior / Abuelos Accessible Travel Tip */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consejo de Comodidad & Accesibilidad para Abuelos</span>
            </div>
            <p className="text-emerald-200/90">{attraction.seniorTip}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isVisited ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Ya visitado y guardado en recuerdos
              </span>
            ) : (
              <span>Gana +25 Alegría y +20 Puntos Culturales</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isVisited && (
              <button
                onClick={() => {
                  audioEngine.playFanfare();
                  onMarkVisited(attraction.id);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Explorar & Visitar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
