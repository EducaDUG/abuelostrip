/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PackedLuggageItem } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, Luggage, Plus, Trash2, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface LuggageModalProps {
  items: PackedLuggageItem[];
  onTogglePackItem: (id: string) => void;
  onAddItem: (item: Omit<PackedLuggageItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  activeAllowanceKg: number;
  onClose: () => void;
}

export const LuggageModal: React.FC<LuggageModalProps> = ({
  items,
  onTogglePackItem,
  onAddItem,
  onDeleteItem,
  activeAllowanceKg,
  onClose,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('1.5');
  const [newItemCategory, setNewItemCategory] = useState<'clothing' | 'comfort' | 'electronics' | 'souvenir' | 'health'>('souvenir');

  const totalPackedWeight = +items
    .filter((i) => i.packed)
    .reduce((sum, i) => sum + i.weightKg, 0)
    .toFixed(1);

  const isOverweight = totalPackedWeight > activeAllowanceKg;
  const remainingKg = +(activeAllowanceKg - totalPackedWeight).toFixed(1);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    audioEngine.playClick();
    onAddItem({
      name: newItemName.trim(),
      weightKg: parseFloat(newItemWeight) || 1.0,
      category: newItemCategory,
      packed: true,
    });

    setNewItemName('');
    setNewItemWeight('1.5');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Luggage className="w-3.5 h-3.5" />
              <span>Gestión de Maletas & Límite de Peso Aéreo</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Control de Equipaje para los Abuelos
            </h2>
            <p className="text-xs text-slate-400">
              Límite del vuelo actual: <strong className="text-white font-mono">{activeAllowanceKg} kg por persona</strong> (Fiji Airways permite hasta 30kg; Turkish 23kg).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weight Gauge Card */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <span className="text-xs text-slate-400">Peso Total Facturado:</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold font-mono ${isOverweight ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {totalPackedWeight} kg
                </span>
                <span className="text-slate-500 font-mono">/ {activeAllowanceKg} kg máx</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              {isOverweight ? (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Exceso de equipaje: {Math.abs(remainingKg)} kg sobre el límite</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Espacio disponible: {remainingKg} kg para recuerdos y compras</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverweight ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (totalPackedWeight / activeAllowanceKg) * 100)}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Artículos en la Maleta:
            </h3>

            <div className="space-y-1.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    item.packed
                      ? 'bg-slate-800/80 border-slate-700/80'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => {
                        audioEngine.playClick();
                        onTogglePackItem(item.id);
                      }}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className={`text-xs font-medium block ${item.packed ? 'text-white' : 'line-through text-slate-400'}`}>
                        {item.name}
                      </span>
                      {item.notes && <span className="text-[10px] text-slate-400 italic">{item.notes}</span>}
                    </div>
                  </label>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60">
                      {item.weightKg} kg
                    </span>
                    <button
                      onClick={() => {
                        audioEngine.playClick();
                        onDeleteItem(item.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                      title="Eliminar artículo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom item form */}
          <form onSubmit={handleCreateItem} className="pt-3 border-t border-slate-800 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Añadir Recuerdo o Prenda a la Maleta:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Nombre (ej. Alfombra de seda de Bakú)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 sm:col-span-2"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="15"
                  value={newItemWeight}
                  onChange={(e) => setNewItemWeight(e.target.value)}
                  className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-400"
                />
                <span className="text-xs text-slate-400">kg</span>
                <button
                  type="submit"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Cerrar Maleta
          </button>
        </div>
      </div>
    </div>
  );
};
