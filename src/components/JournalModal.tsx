/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, BookOpen, Plus, Heart, Calendar } from 'lucide-react';

interface JournalModalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  currentDateStr: string;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  entries,
  onAddEntry,
  currentDateStr,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Los Hijos & Nietos');
  const [mood, setMood] = useState<'radiant' | 'peaceful' | 'adventurous' | 'grateful'>('radiant');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    audioEngine.playFanfare();
    onAddEntry({
      date: currentDateStr,
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || 'Familia',
      mood,
    });

    setTitle('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Diario de Viaje & Mensajes de la Familia</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Cuaderno de Recuerdos de los Abuelos
            </h2>
            <p className="text-xs text-slate-400">
              Palabras de aliento, felicitaciones y anécdotas guardadas permanentemente en el viaje.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Entries list */}
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-300 font-mono flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> {entry.author}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" /> {entry.date}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{entry.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>

          {/* Form to leave a family message */}
          <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>Escribir una Nota o Deseo para los Abuelos:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Título del mensaje"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
              <input
                type="text"
                placeholder="Firma / De quién (ej. Familia y amigos)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            <textarea
              placeholder="Escribe tu mensaje cariñoso para los abuelos..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Guardar en el Diario</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Cerrar Diario
          </button>
        </div>
      </div>
    </div>
  );
};
