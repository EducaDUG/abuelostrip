/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnapshotPhoto } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, Camera, Trash2, Download, Image as ImageIcon } from 'lucide-react';

interface PhotoAlbumModalProps {
  photos: SnapshotPhoto[];
  onDeletePhoto: (id: string) => void;
  onClose: () => void;
}

const DEFAULT_POSTCARDS = [
  {
    id: 'pc-1',
    locationName: 'Nueva Zelanda · Milford Sound Fiords',
    dateStr: 'Octubre 2026',
    caption: 'Majestuosos fiords de la Isla Sur con cascadas cristalinas entre picos de niebla.',
    url: '/src/assets/images/nz_fiordland_postcard_1791499816726.jpg',
  },
  {
    id: 'pc-2',
    locationName: 'Archipiélago de Fiji · Paraíso del Pacífico',
    dateStr: 'Noviembre 2026',
    caption: 'Aguas turquesas y arrecifes de coral en el cálido mar de Fiji.',
    url: '/src/assets/images/fiji_tropical_postcard_1791499829519.jpg',
  },
  {
    id: 'pc-3',
    locationName: 'Singapur · Gardens by the Bay & Marina Bay',
    dateStr: 'Noviembre 2026',
    caption: 'Los Supertrees iluminados y las torres de Marina Bay reflejadas en la bahía.',
    url: '/src/assets/images/singapore_gardens_postcard_1791499840371.jpg',
  },
  {
    id: 'pc-4',
    locationName: 'Bakú, Azerbaiyán · Torres de Fuego & Mar Caspio',
    dateStr: 'Noviembre 2026',
    caption: 'La fusión milenaria entre las murallas de piedra dorada y la arquitectura de vanguardia.',
    url: '/src/assets/images/baku_flame_towers_postcard_1791499850470.jpg',
  },
];

export const PhotoAlbumModal: React.FC<PhotoAlbumModalProps> = ({
  photos,
  onDeletePhoto,
  onClose,
}) => {
  const downloadImage = (dataUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${name.replace(/\s+/g, '_')}.jpg`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Álbum de Recuerdos & Postales del Mundo</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Instantáneas de la Gran Travesía 2026
            </h2>
            <p className="text-xs text-slate-400">
              Capturas fotográficas tomadas en vivo en el mundo 3D y postales de alta resolución de cada destino.
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
          {/* User 3D Snapshots */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <span>Fotos 3D Capturadas ({photos.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-amber-500/50 shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={photo.dataUrl}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => downloadImage(photo.dataUrl, `abuelos_trip_${photo.dateStr}`)}
                          className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-sm transition-colors"
                          title="Descargar foto"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            audioEngine.playClick();
                            onDeletePhoto(photo.id);
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 backdrop-blur-sm transition-colors"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{photo.locationName}</span>
                          <span>{photo.dateStr}</span>
                        </div>
                        <p className="text-xs text-white font-medium mt-1 leading-snug">{photo.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Postcards of the Key World Destinations */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Postales de los Grandes Destinos del Viaje</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEFAULT_POSTCARDS.map((pc) => (
                <div
                  key={pc.id}
                  className="group rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shadow-md hover:border-slate-600 transition-all flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={pc.url}
                      alt={pc.locationName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                        {pc.dateStr}
                      </span>
                      <h4 className="text-sm font-bold tracking-tight">{pc.locationName}</h4>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-300 leading-relaxed">{pc.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Cerrar Álbum
          </button>
        </div>
      </div>
    </div>
  );
};
