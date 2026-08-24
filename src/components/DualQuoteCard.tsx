'use client';

import React from 'react';
import { DualQuote, QuoteOptionType } from '@/types';
import { Check, ShieldCheck, Zap, Sparkles, Award } from 'lucide-react';

interface Props {
  quote: DualQuote;
  selectedOption?: QuoteOptionType;
  onSelect: (option: QuoteOptionType) => void;
  interactive?: boolean;
}

export default function DualQuoteCard({ quote, selectedOption, onSelect, interactive = true }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Presupuesto Dual Personalizado por VIN</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#001E50] tracking-tight">
          Elige la Configuración para tu Auto
        </h2>
        <p className="text-sm text-slate-600">
          Compara refacciones originales de concesionaria contra nuestras marcas de alto desempeño con garantía por escrito.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {/* OPCIÓN AGENCIA */}
        <div
          onClick={() => interactive && onSelect('agencia')}
          className={`relative rounded-3xl p-6 sm:p-7 transition-all border-2 flex flex-col justify-between ${
            interactive ? 'cursor-pointer' : ''
          } ${
            selectedOption === 'agencia'
              ? 'bg-blue-50/50 border-[#00509E] shadow-xl ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Opción 1
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#001E50] flex items-center gap-2 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-[#00509E]" />
                  <span>{quote.agency.title}</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-[#00509E] text-xs font-bold">
                Genuino OEM
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {quote.agency.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 space-y-2 text-xs">
              <div className="text-slate-600 flex justify-between">
                <span>Refacciones:</span>
                <strong className="text-slate-900">{quote.agency.partsBrand}</strong>
              </div>
              <div className="text-slate-600 flex justify-between">
                <span>Garantía Legal:</span>
                <strong className="text-[#00509E] font-bold">{quote.agency.warrantyMonths} meses / 10,000 km</strong>
              </div>
            </div>

            <div className="space-y-2.5 mb-6">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Incluye:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {quote.agency.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00509E] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Inversión total:</span>
              <div className="text-right">
                <span className="text-3xl font-black text-[#001E50]">
                  ${quote.agency.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-bold ml-1">MXN</span>
              </div>
            </div>

            {interactive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect('agencia');
                }}
                className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition flex items-center justify-center gap-2 ${
                  selectedOption === 'agencia'
                    ? 'bg-[#001E50] text-[#FFC72C] shadow-lg shadow-blue-900/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {selectedOption === 'agencia' ? (
                  <>
                    <Check className="w-5 h-5 text-[#FFC72C]" />
                    <span>Opción Agencia Seleccionada</span>
                  </>
                ) : (
                  <span>Seleccionar Opción Agencia</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* OPCIÓN PREMIUM DE AUTOR */}
        <div
          onClick={() => interactive && onSelect('premium')}
          className={`relative rounded-3xl p-6 sm:p-7 transition-all border-2 flex flex-col justify-between overflow-hidden ${
            interactive ? 'cursor-pointer' : ''
          } ${
            selectedOption === 'premium'
              ? 'bg-amber-50/60 border-amber-500 shadow-2xl ring-2 ring-amber-400/30'
              : 'bg-white border-amber-300/80 hover:border-amber-400 shadow-sm'
          }`}
        >
          {/* Badge Recomendado */}
          <div className="absolute top-0 right-0 bg-[#FFC72C] text-slate-950 font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Recomendado de Autor</span>
          </div>

          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  Opción 2 • Alto Rendimiento
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#001E50] flex items-center gap-2 mt-0.5">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>{quote.premium.title}</span>
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {quote.premium.description}
            </p>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 mb-5 space-y-2 text-xs shadow-xs">
              <div className="text-slate-700 flex justify-between">
                <span>Marcas de alto desempeño:</span>
                <strong className="text-slate-900">{quote.premium.partsBrand}</strong>
              </div>
              <div className="text-slate-700 flex justify-between">
                <span>Garantía Extendida:</span>
                <strong className="text-amber-600 font-black text-sm">{quote.premium.warrantyMonths} meses / 15,000 km</strong>
              </div>
            </div>

            <div className="space-y-2.5 mb-6">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Ventajas exclusivas:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                {quote.premium.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 font-black" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between mb-4">
              <span className="text-xs font-bold text-slate-500">Inversión total:</span>
              <div className="text-right">
                <span className="text-3xl font-black text-[#001E50]">
                  ${quote.premium.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-bold ml-1">MXN</span>
              </div>
            </div>

            {interactive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect('premium');
                }}
                className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition flex items-center justify-center gap-2 ${
                  selectedOption === 'premium'
                    ? 'bg-[#FFC72C] text-slate-950 shadow-lg shadow-amber-400/30'
                    : 'bg-amber-100 hover:bg-[#FFC72C] text-slate-900 border border-amber-300'
                }`}
              >
                {selectedOption === 'premium' ? (
                  <>
                    <Check className="w-5 h-5 text-slate-950 font-black" />
                    <span>Opción Premium Seleccionada</span>
                  </>
                ) : (
                  <span>Seleccionar Opción Premium</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
