/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Zap, Beer, Utensils, Mountain, Heart, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface GameTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameTutorialModal: React.FC<GameTutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const TUTORIAL_STEPS = [
    {
      title: '¡Bienvenido al Viaje!',
      subtitle: 'Guía a los abuelos por Nueva Zelanda',
      badge: 'Paso 1 de 4',
      icon: '🌍',
      visual: (
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="w-24 h-24 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex flex-col items-center justify-center text-3xl shadow-lg shadow-amber-500/10 animate-bounce">
            👴
            <span className="text-[10px] font-bold text-amber-300 font-mono mt-0.5">Padre Borque</span>
          </div>
          <span className="text-2xl text-slate-500 font-bold">+</span>
          <div className="w-24 h-24 rounded-2xl bg-sky-500/20 border-2 border-sky-400 flex flex-col items-center justify-center text-3xl shadow-lg shadow-sky-500/10 animate-bounce delay-150">
            🙏
            <span className="text-[10px] font-bold text-sky-300 font-mono mt-0.5">Capellan Dailos</span>
          </div>
        </div>
      ),
      description: 'Tu misión es mantener el ritmo del viaje: administrar su energía, alimentarlos bien, divertirse y conquistar los montes sin agotarlos.',
      keyPoints: [
        'Explora las 8 etapas (Auckland, Rotorua, Hobbiton, Queenstown...)',
        'Cada día tiene misiones locales y atracciones 3D interactivas.',
      ],
    },
    {
      title: 'Cuida sus 4 Barras de Estado',
      subtitle: 'El equilibrio perfecto entre diversión y descanso',
      badge: 'Paso 2 de 4',
      icon: '⚡',
      visual: (
        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Energía</span>
              <span>100%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-400 w-full" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Baja al caminar o subir montes</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
              <span className="flex items-center gap-1"><Utensils className="w-3.5 h-3.5" /> Hambre</span>
              <span>0%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-400 w-1/4" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Sube con el tiempo; ¡dales comida!</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
              <span className="flex items-center gap-1"><Beer className="w-3.5 h-3.5" /> Cerveza</span>
              <span>Resaca</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-500 w-3/4" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Demasiadas pintas causan mareo</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold text-pink-400 mb-1">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> Alegría</span>
              <span>85%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-pink-500 w-[85%]" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Sube al pasear, comer o acariciar ovejas</span>
          </div>
        </div>
      ),
      description: 'Si la energía cae por debajo del 35% o el hambre supera el 75%, los abuelos no tendrán fuerzas para subir montes.',
      keyPoints: [
        'Verde = Todo bien · Naranja = Atención · Rojo = Peligro de fatiga',
      ],
    },
    {
      title: '¡Cerveza, Hambre & Resaca!',
      subtitle: 'Mecánicas divertidas de causa y efecto',
      badge: 'Paso 3 de 4',
      icon: '🍺',
      visual: (
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-purple-500/40 text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <span className="text-xl">🥴</span>
            <span>Efecto Resaca (Cámara mareada + Bloqueo)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              <span className="font-bold block text-rose-300 mb-0.5">🍺 Tomar pintas:</span>
              Ganan alegría pero si pasan de 65% ¡tendrán resaca y no podrán subir montes!
            </div>
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-200">
              <span className="font-bold block text-cyan-300 mb-0.5">☕ Solución rápida:</span>
              Usa <strong>"Café & Anti-Resaca"</strong> ($6 NZD) para quitar la resaca al instante.
            </div>
          </div>
        </div>
      ),
      description: '¡Cuidado con las rondas de cerveza artesanal! Si tienen resaca o hambre voraz, no podrán conquistar las cimas.',
      keyPoints: [
        '🍖 Comer Plato Típico: Hambre a 0% y recarga +45% de energía.',
        '🐑 Acariciar Oveja: Da +$15 NZD gratis y +15 de alegría.',
      ],
    },
    {
      title: 'El Gran Reto: Subir al Monte',
      subtitle: 'La recompensa reina del viaje',
      badge: 'Paso 4 de 4',
      icon: '🏔️',
      visual: (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 p-3.5 rounded-2xl border border-emerald-500/50 text-center space-y-2">
          <div className="text-3xl animate-bounce">🏔️✨🎉</div>
          <span className="text-xs font-bold text-emerald-300 block">
            ¡Conquistar Cimas (Eden, Bob's Peak, Signal Hill...)!
          </span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-[11px] font-mono">
            <span>Recompensa: +$50 NZD + Foto Álbum + Logro</span>
          </div>
        </div>
      ),
      description: 'Prepara a los abuelos: quita la resaca, aliméntalos, dale al botón verde "Subir al Monte" y saca una foto para el álbum familiar.',
      keyPoints: [
        'Puedes abrir el tutorial en cualquier momento pulsando el botón ❓',
        '¡Todo listo! Que empiece la gran aventura kiwi.',
      ],
    },
  ];

  const step = TUTORIAL_STEPS[currentStep];

  const handleNext = () => {
    audioEngine.playClick();
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    audioEngine.playClick();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 text-slate-200">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-xl border border-amber-400/40">
              🎮
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                {step.badge}
              </span>
              <h2 className="text-sm font-bold text-white leading-tight">
                Tutorial de Juego: Abuelos Trip
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{step.icon}</span>
              <span>{step.title}</span>
            </h3>
            <p className="text-xs text-amber-300 font-medium">{step.subtitle}</p>
          </div>

          {/* Interactive visual widget */}
          {step.visual}

          <p className="text-xs text-slate-300 leading-relaxed">
            {step.description}
          </p>

          <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
            {step.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5 font-bold">✓</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer controls & step dots */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playClick();
                  setCurrentStep(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-amber-400'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Ir al paso ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>{currentStep === TUTORIAL_STEPS.length - 1 ? '¡A Jugar!' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
