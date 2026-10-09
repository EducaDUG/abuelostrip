/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FoodItem } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, Utensils, Check, Sparkles, Coffee } from 'lucide-react';

interface FoodTastingModalProps {
  foods: FoodItem[];
  triedFoodIds: string[];
  onTasteFood: (food: FoodItem) => void;
  onClose: () => void;
}

export const FoodTastingModal: React.FC<FoodTastingModalProps> = ({
  foods,
  triedFoodIds,
  onTasteFood,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Utensils className="w-3.5 h-3.5" />
              <span>Gastronomía Típica & Sabores Auténticos</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Qué Saborear en Este Destino
            </h2>
            <p className="text-xs text-slate-400">
              Prueba los platos emblemáticos para recargar energía física y elevar el placer gourmet de los abuelos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Food List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {foods.map((food) => {
            const isTried = triedFoodIds.includes(food.id);

            return (
              <div
                key={food.id}
                className={`p-4 rounded-xl border transition-all ${
                  isTried
                    ? 'bg-slate-800/40 border-slate-700/60'
                    : 'bg-slate-800/80 border-slate-700 hover:border-amber-500/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-white">{food.name}</span>
                      {food.localName && (
                        <span className="text-xs text-amber-400/90 font-mono italic">
                          ({food.localName})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{food.description}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span>Lugar recomendado: <strong className="text-slate-300">{food.recommendedAt}</strong></span>
                      <span>·</span>
                      <span className="text-emerald-400 font-mono">+{food.staminaRecovery}% Vitalidad</span>
                      <span>·</span>
                      <span className="text-pink-400 font-mono">+{food.delightBonus} Deleite</span>
                    </div>
                  </div>

                  <div className="sm:self-center flex-shrink-0">
                    {isTried ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Degustado</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          audioEngine.playFanfare();
                          onTasteFood(food);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Probar Bocado</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cerrar Menú
          </button>
        </div>
      </div>
    </div>
  );
};
