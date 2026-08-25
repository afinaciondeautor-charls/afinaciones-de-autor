'use client';

import React, { useState } from 'react';
import { EvidencePhoto } from '@/types';
import { Camera, CheckCircle2, Eye, RotateCcw, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';

interface Props {
  photos: EvidencePhoto[];
  onChange: (photos: EvidencePhoto[]) => void;
}

const DEFAULT_CATEGORIES = [
  {
    category: 'bujias' as const,
    label: 'Bujías',
    subtitle: 'Viejas a Reemplazar vs. Nuevas de Iridio Instaladas',
    defaultNotes: 'Bujías usadas con carbón y electrodo gastado a 1.25mm. Nuevas NGK Iridium calibradas a 0.8mm.',
  },
  {
    category: 'filtro_aire' as const,
    label: 'Filtro de Aire de Motor',
    subtitle: 'Filtro Usado Saturado vs. Nuevo Instalado',
    defaultNotes: 'Filtro usado saturado de hollín y polvo. Reemplazado por elemento filtrante Mann Filter Pro nuevo.',
  },
  {
    category: 'aceite' as const,
    label: 'Aceite de Motor & Filtro',
    subtitle: 'Aceite Usado Drenado vs. Nivel con Aceite 100% Sintético',
    defaultNotes: 'Aceite usado degradado. Relleno con Motul 100% sintético al nivel exacto de bayoneta.',
  },
  {
    category: 'cuerpo_aceleracion' as const,
    label: 'Cuerpo de Aceleración',
    subtitle: 'Mariposa con Carbón vs. Descarbonizado y Calibrado',
    defaultNotes: 'Mariposa con sedimentos de carbón. Se descarbonizó con solvente dieléctrico y se recalibró por OBD-II.',
  },
  {
    category: 'filtro_cabina' as const,
    label: 'Filtro de Cabina / Polen',
    subtitle: 'Filtro Viejo vs. Nuevo con Carbón Activado',
    defaultNotes: 'Filtro de cabina anterior sucio. Se instaló filtro nuevo anti-alérgenos con carbón activado.',
  },
];

export default function EvidenceManager({ photos, onChange }: Props) {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [processingSlots, setProcessingSlots] = useState<Record<string, boolean>>({});

  const updatePhoto = (
    category: EvidencePhoto['category'],
    type: 'before' | 'after',
    url: string,
    notes?: string
  ) => {
    const existingIndex = photos.findIndex((p) => p.category === category);
    let updatedList = [...photos];

    if (existingIndex >= 0) {
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        ...(type === 'before' ? { beforePhotoUrl: url } : { afterPhotoUrl: url }),
        ...(notes !== undefined ? { notes } : {}),
      };
    } else {
      const catConfig = DEFAULT_CATEGORIES.find((c) => c.category === category);
      updatedList.push({
        id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        category,
        label: catConfig?.label || category,
        ...(type === 'before' ? { beforePhotoUrl: url } : { afterPhotoUrl: url }),
        notes: notes !== undefined ? notes : catConfig?.defaultNotes || '',
      });
    }

    onChange(updatedList);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: EvidencePhoto['category'],
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slotKey = `${category}_${type}`;
    setProcessingSlots((prev) => ({ ...prev, [slotKey]: true }));

    try {
      // Comprime la imagen del celular a ~150KB en alta definición
      const compressedDataUrl = await compressImage(file, 1280, 1280, 0.75);
      updatePhoto(category, type, compressedDataUrl);
    } catch (err) {
      console.error('Error al comprimir foto:', err);
      // Fallback a lectura estándar si falla compresión
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updatePhoto(category, type, reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setProcessingSlots((prev) => ({ ...prev, [slotKey]: false }));
      // Reset input value para permitir tomar otra foto si se desea
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (
    category: EvidencePhoto['category'],
    type: 'before' | 'after'
  ) => {
    const existingIndex = photos.findIndex((p) => p.category === category);
    if (existingIndex < 0) return;

    let updatedList = [...photos];
    if (type === 'before') {
      delete updatedList[existingIndex].beforePhotoUrl;
    } else {
      delete updatedList[existingIndex].afterPhotoUrl;
    }
    onChange(updatedList);
  };

  return (
    <div className="space-y-4">
      {/* Header de Evidencias */}
      <div className="bg-slate-50 border border-slate-200/90 p-4 rounded-2xl space-y-1">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Camera className="w-4 h-4 text-slate-700" />
          <span>Bitácora de Evidencias Fotográficas por Refacción</span>
        </h3>
        <p className="text-xs text-slate-500">
          Toma o sube la foto de cada pieza a reemplazar (estado inicial) y de la refacción nueva instalada.
        </p>
      </div>

      {/* Grid de Refacciones para Fotos */}
      <div className="space-y-4">
        {DEFAULT_CATEGORIES.map((cat) => {
          const current = photos.find((p) => p.category === cat.category);
          const hasBefore = !!current?.beforePhotoUrl;
          const hasAfter = !!current?.afterPhotoUrl;
          const isComplete = hasBefore && hasAfter;

          return (
            <div
              key={cat.category}
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-2xs space-y-3.5 ${
                isComplete
                  ? 'bg-emerald-50/30 border-emerald-300'
                  : hasBefore || hasAfter
                  ? 'bg-amber-50/20 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Header de la refacción */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900">{cat.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{cat.subtitle}</span>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      : hasBefore || hasAfter
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isComplete ? '✓ Par Completo' : hasBefore || hasAfter ? '1/2 Fotos' : 'Pendiente'}
                </span>
              </div>

              {/* 2 Ranuras de Fotos: 1. A Reemplazar (Antes) vs 2. Reemplazada (Después) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. PIEZA A REEMPLAZAR (ANTES) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 font-mono block">
                    1. Pieza a Reemplazar (Antes)
                  </span>

                  <div className="relative min-h-[140px] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 overflow-hidden flex items-center justify-center transition">
                    {processingSlots[`${cat.category}_before`] ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-rose-700 w-full h-36">
                        <Loader2 className="w-7 h-7 animate-spin mb-2" />
                        <span className="text-xs font-bold font-mono">Optimizando evidencia...</span>
                      </div>
                    ) : current?.beforePhotoUrl ? (
                      <div className="relative w-full h-36 group">
                        <img
                          src={current.beforePhotoUrl}
                          alt="Pieza a Reemplazar"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition rounded-xl">
                          <button
                            type="button"
                            onClick={() => setActivePreview(current.beforePhotoUrl!)}
                            className="p-2 bg-white/90 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                            title="Ver imagen grande"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(cat.category, 'before')}
                            className="p-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                            title="Quitar foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center text-slate-600 hover:text-slate-900 w-full h-36">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-1.5 shadow-2xs">
                          <Camera className="w-5 h-5 text-rose-700" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">📸 Tomar Foto Antes</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Pieza usada o dañada</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, cat.category, 'before')}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 2. PIEZA REEMPLAZADA (DESPUÉS) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 font-mono block">
                    2. Pieza Reemplazada (Después)
                  </span>

                  <div className="relative min-h-[140px] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 overflow-hidden flex items-center justify-center transition">
                    {processingSlots[`${cat.category}_after`] ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-emerald-700 w-full h-36">
                        <Loader2 className="w-7 h-7 animate-spin mb-2" />
                        <span className="text-xs font-bold font-mono">Optimizando evidencia...</span>
                      </div>
                    ) : current?.afterPhotoUrl ? (
                      <div className="relative w-full h-36 group">
                        <img
                          src={current.afterPhotoUrl}
                          alt="Pieza Reemplazada"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition rounded-xl">
                          <button
                            type="button"
                            onClick={() => setActivePreview(current.afterPhotoUrl!)}
                            className="p-2 bg-white/90 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                            title="Ver imagen grande"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(cat.category, 'after')}
                            className="p-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                            title="Quitar foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center text-slate-600 hover:text-emerald-900 w-full h-36">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-700 mb-1.5 shadow-2xs">
                          <Camera className="w-5 h-5 text-emerald-700" />
                        </div>
                        <span className="text-xs font-bold text-emerald-900">📸 Tomar Foto Después</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Refacción nueva instalada</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, cat.category, 'after')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Nota técnica individual */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Nota técnica (ej. bujías calibradas a 0.8mm y torque a 28 Nm)..."
                  defaultValue={current?.notes || ''}
                  onBlur={(e) => {
                    updatePhoto(cat.category, 'before', current?.beforePhotoUrl || '', e.target.value);
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview de Foto Ampliada */}
      {activePreview && (
        <div
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="max-w-2xl max-h-[85vh] bg-white p-2 rounded-3xl border border-slate-200 shadow-2xl">
            <img src={activePreview} alt="Evidencia Ampliada" className="max-h-[80vh] w-auto rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
