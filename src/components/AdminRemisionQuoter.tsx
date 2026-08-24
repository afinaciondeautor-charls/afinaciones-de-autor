'use client';

import React, { useState } from 'react';
import { Appointment, DualQuote, QuoteRemisionItem, VehicleTechnicalSpec } from '@/types';
import { Plus, Trash2, Send, Sparkles, Calculator, ShieldCheck, Zap, ArrowDown, BookOpen, MessageSquare } from 'lucide-react';
import { findVehicleSpec } from '@/lib/vehicleKnowledgeBase';
import VehicleManualModal from '@/components/VehicleManualModal';
import { getWhatsAppQuoteLink } from '@/lib/whatsapp';

interface Props {
  appointment: Appointment;
  onSaveAndSend: (dualQuote: DualQuote) => void;
  onCancel: () => void;
}

export default function AdminRemisionQuoter({ appointment, onSaveAndSend, onCancel }: Props) {
  const [showManualModal, setShowManualModal] = useState(false);

  // Auto-find vehicle specs from OEM Knowledge Base
  const vehicleSpec = findVehicleSpec(
    appointment.vehicle.brand,
    appointment.vehicle.model,
    appointment.vehicle.vin
  );

  const getInitialItems = (spec: VehicleTechnicalSpec | null): QuoteRemisionItem[] => {
    if (!spec) {
      return [
        {
          id: 'rem-1',
          quantity: 5,
          unit: 'lts',
          description: 'Aceite 100% Sintético (Viscosidad OEM)',
          agencyBrand: `Genuino OEM ${appointment.vehicle.brand}`,
          agencyUnitPrice: 320,
          agencyTotal: 1600,
          premiumBrand: 'Motul 8100 X-cess Gen2 5W-40',
          premiumUnitPrice: 360,
          premiumTotal: 1800,
        },
        {
          id: 'rem-2',
          quantity: 4,
          unit: 'pzas',
          description: 'Juego de Bujías de Iridio / Platino',
          agencyBrand: 'Bujías Genuinas OEM',
          agencyUnitPrice: 260,
          agencyTotal: 1040,
          premiumBrand: 'NGK Laser Iridium IX (Calibradas)',
          premiumUnitPrice: 340,
          premiumTotal: 1360,
        },
        {
          id: 'rem-3',
          quantity: 1,
          unit: 'pza',
          description: 'Filtro de Aceite de Motor Blindado',
          agencyBrand: 'Filtro de Aceite OEM',
          agencyUnitPrice: 310,
          agencyTotal: 310,
          premiumBrand: 'Mann Filter Pro',
          premiumUnitPrice: 340,
          premiumTotal: 340,
        },
        {
          id: 'rem-4',
          quantity: 1,
          unit: 'pza',
          description: 'Filtro de Aire de Motor de Alto Flujo',
          agencyBrand: 'Filtro de Aire OEM',
          agencyUnitPrice: 380,
          agencyTotal: 380,
          premiumBrand: 'Mann Filter Pro',
          premiumUnitPrice: 420,
          premiumTotal: 420,
        },
        {
          id: 'rem-5',
          quantity: 1,
          unit: 'pza',
          description: 'Filtro de Cabina / Polen con Carbón Activado',
          agencyBrand: 'Filtro Cabina Básico OEM',
          agencyUnitPrice: 290,
          agencyTotal: 290,
          premiumBrand: 'Mann Filter FreciousPlus Anti-alérgenos',
          premiumUnitPrice: 390,
          premiumTotal: 390,
        },
        {
          id: 'rem-6',
          quantity: 1,
          unit: 'serv',
          description: 'Limpieza de Inyectores & Descarbonizado Cuerpo TPS',
          agencyBrand: 'Limpieza con aditivo de tanque',
          agencyUnitPrice: 400,
          agencyTotal: 400,
          premiumBrand: 'Descarbonizado ultrasónico & calibración escáner',
          premiumUnitPrice: 650,
          premiumTotal: 650,
        },
      ];
    }

    return [
      {
        id: 'rem-1',
        quantity: Math.ceil(spec.oil.capacityLiters),
        unit: 'lts',
        description: `Aceite 100% Sintético (${spec.oil.viscosity} - Norma ${spec.oil.oemNorm.split('/')[0]})`,
        agencyBrand: `Genuino OEM ${spec.brand} (${spec.oil.viscosity})`,
        agencyUnitPrice: 320,
        agencyTotal: Math.ceil(spec.oil.capacityLiters) * 320,
        premiumBrand: spec.oil.recommendedMotul,
        premiumUnitPrice: 360,
        premiumTotal: Math.ceil(spec.oil.capacityLiters) * 360,
      },
      {
        id: 'rem-2',
        quantity: spec.sparkPlugs.quantity || 4,
        unit: 'pzas',
        description: `Juego de Bujías (${spec.sparkPlugs.type} - Calibración GAP ${spec.sparkPlugs.gapMm})`,
        agencyBrand: `Bujías Originales ${spec.brand} OEM`,
        agencyUnitPrice: 260,
        agencyTotal: (spec.sparkPlugs.quantity || 4) * 260,
        premiumBrand: spec.sparkPlugs.ngkReference || 'NGK Laser Iridium',
        premiumUnitPrice: 340,
        premiumTotal: (spec.sparkPlugs.quantity || 4) * 340,
      },
      {
        id: 'rem-3',
        quantity: 1,
        unit: 'pza',
        description: 'Filtro de Aceite de Motor Blindado',
        agencyBrand: `OEM ${spec.filters.oilFilterOem}`,
        agencyUnitPrice: 310,
        agencyTotal: 310,
        premiumBrand: spec.filters.oilFilterMann || 'Mann Filter Pro',
        premiumUnitPrice: 340,
        premiumTotal: 340,
      },
      {
        id: 'rem-4',
        quantity: 1,
        unit: 'pza',
        description: 'Filtro de Aire de Motor de Microfiltración',
        agencyBrand: `OEM ${spec.filters.airFilterOem}`,
        agencyUnitPrice: 380,
        agencyTotal: 380,
        premiumBrand: spec.filters.airFilterMann || 'Mann Filter Pro',
        premiumUnitPrice: 420,
        premiumTotal: 420,
      },
      {
        id: 'rem-5',
        quantity: 1,
        unit: 'pza',
        description: 'Filtro de Cabina / Polen con Carbón Activado',
        agencyBrand: `OEM ${spec.filters.cabinFilterOem}`,
        agencyUnitPrice: 290,
        agencyTotal: 290,
        premiumBrand: spec.filters.cabinFilterMann || 'Mann Filter FreciousPlus',
        premiumUnitPrice: 390,
        premiumTotal: 390,
      },
      {
        id: 'rem-6',
        quantity: 1,
        unit: 'serv',
        description: 'Limpieza de Inyectores & Descarbonizado Cuerpo TPS',
        agencyBrand: 'Limpieza con aditivo de tanque',
        agencyUnitPrice: 400,
        agencyTotal: 400,
        premiumBrand: 'Descarbonizado ultrasónico & calibración escáner',
        premiumUnitPrice: 650,
        premiumTotal: 650,
      },
    ];
  };

  const [items, setItems] = useState<QuoteRemisionItem[]>(() => getInitialItems(vehicleSpec));
  const [laborAgency, setLaborAgency] = useState<number>(650);
  const [laborPremium, setLaborPremium] = useState<number>(650);

  // Auto calculate totals
  const agencyPartsSubtotal = items.reduce((sum, it) => sum + (it.quantity * it.agencyUnitPrice || 0), 0);
  const premiumPartsSubtotal = items.reduce((sum, it) => sum + (it.quantity * it.premiumUnitPrice || 0), 0);

  const totalAgency = agencyPartsSubtotal + (Number(laborAgency) || 0);
  const totalPremium = premiumPartsSubtotal + (Number(laborPremium) || 0);

  const handleUpdateItem = (id: string, field: keyof QuoteRemisionItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        const qty = field === 'quantity' ? Number(value) : it.quantity;
        const aPrice = field === 'agencyUnitPrice' ? Number(value) : it.agencyUnitPrice;
        const pPrice = field === 'premiumUnitPrice' ? Number(value) : it.premiumUnitPrice;

        updated.agencyTotal = (qty || 0) * (aPrice || 0);
        updated.premiumTotal = (qty || 0) * (pPrice || 0);
        return updated;
      })
    );
  };

  const handleApplySpecs = (spec: VehicleTechnicalSpec) => {
    setItems(getInitialItems(spec));
  };

  const handleAddItem = () => {
    const newItem: QuoteRemisionItem = {
      id: 'rem-' + Date.now(),
      quantity: 1,
      unit: 'pza',
      description: 'Banda de Accesorios / Refacción adicional',
      agencyBrand: `Genuino OEM ${appointment.vehicle.brand}`,
      agencyUnitPrice: 450,
      agencyTotal: 450,
      premiumBrand: 'Continental / Gates Heavy Duty',
      premiumUnitPrice: 490,
      premiumTotal: 490,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert('Debe conservar al menos una partida en la cotización.');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSubmitWithWhatsApp = (openWhatsApp: boolean) => {
    const dualQuote: DualQuote = {
      agency: {
        title: `Opción Agencia (${appointment.vehicle.brand} OEM)`,
        description: `Refacciones originales de concesionaria autorizada ${appointment.vehicle.brand}.`,
        partsBrand: `Genuino OEM ${appointment.vehicle.brand}`,
        warrantyMonths: 6,
        laborCost: Number(laborAgency) || 0,
        partsSubtotal: agencyPartsSubtotal,
        price: totalAgency,
        highlights: [
          'Refacciones 100% de concesionaria oficial',
          'Póliza de garantía legal de 6 meses',
          'Inspección y escaneo digital en tu domicilio',
        ],
      },
      premium: {
        title: 'Opción De Autor (Alto Rendimiento)',
        description: `Refacciones de especificación superior (${vehicleSpec?.oil.recommendedMotul || 'Motul 100% Sintético'}, NGK Laser Iridium, Mann Filter Pro).`,
        partsBrand: `${vehicleSpec?.oil.recommendedMotul.split('(')[0] || 'Motul 8100'} + NGK Laser Iridium + Mann Filter Pro`,
        warrantyMonths: 12,
        laborCost: Number(laborPremium) || 0,
        partsSubtotal: premiumPartsSubtotal,
        price: totalPremium,
        highlights: [
          'Marcas premium de máximo desempeño y durabilidad',
          'Garantía extendida por escrito de 12 meses / 15,000 km',
          'Descarbonización ultrasónica y calibración con escáner OBD-II',
        ],
      },
      itemsChecklist: items.map((it) => ({
        name: it.description,
        spec: `${it.quantity} ${it.unit} • Agencia: ${it.agencyBrand} / Autor: ${it.premiumBrand}`,
        includedInAgency: true,
        includedInPremium: true,
      })),
      remisionItems: items,
    };

    onSaveAndSend(dualQuote);

    if (openWhatsApp) {
      const waLink = getWhatsAppQuoteLink({ ...appointment, quote: dualQuote });
      window.open(waLink, '_blank');
    }
  };

  return (
    <>
      <div className="bg-white border-2 border-[#001E50] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-7 animate-in fade-in duration-200">
        {/* Header Nota de Remisión */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#001E50] text-[#FFC72C] flex items-center justify-center font-black shadow-md shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#001E50]">
                  Nota de Remisión & Cotizador Dual por Partidas
                </h3>
                {vehicleSpec && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full">
                    ✓ Especificaciones OEM Detectadas
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Vehículo: <strong className="text-slate-900">{appointment.vehicle.brand} {appointment.vehicle.model} ({appointment.vehicle.year})</strong>
                <span className="mx-2 text-slate-300">|</span>
                VIN: <span className="font-mono font-bold text-amber-800">{appointment.vehicle.vin}</span>
                {appointment.vehicle.currentKm && (
                  <>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="font-mono text-[#00509E] font-bold">
                      KM: {appointment.vehicle.currentKm.toLocaleString()}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 bg-[#FFC72C] hover:bg-amber-400 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Manual OEM del Auto</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. COTIZACIÓN OPCIÓN AGENCIA OEM (UNA ARRIBA)            */}
        {/* ======================================================== */}
        <div className="bg-blue-50/40 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00509E] text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#001E50]">
                  1. Cotización Opción Agencia (OEM Genuino)
                </h4>
                <p className="text-xs text-slate-500">
                  Refacciones oficiales de concesionaria autorizada • Póliza de garantía 6 meses
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#00509E] bg-blue-100 px-3 py-1 rounded-full">
                Subtotal Refacciones: ${agencyPartsSubtotal.toLocaleString()} MXN
              </span>
            </div>
          </div>

          {/* Tabla amplia de Agencia (100% visible, sin texto cortado) */}
          <div className="overflow-x-auto border border-blue-200 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-100/60 border-b border-blue-200 text-[#001E50] font-black">
                  <th className="p-3 w-16 text-center">Cant.</th>
                  <th className="p-3 w-16 text-center">Unidad</th>
                  <th className="p-3 min-w-[240px]">Descripción del Concepto / Refacción</th>
                  <th className="p-3 min-w-[220px]">Marca Agencia OEM</th>
                  <th className="p-3 text-right w-28">P. Unitario OEM</th>
                  <th className="p-3 text-right w-28 bg-blue-100/80">Subtotal OEM</th>
                  <th className="p-3 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {items.map((it) => (
                  <tr key={'agencia-' + it.id} className="hover:bg-blue-50/50 transition">
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => handleUpdateItem(it.id, 'quantity', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-300 focus:bg-white rounded-lg p-2 font-bold text-slate-900 text-xs"
                      />
                    </td>

                    <td className="p-2.5 text-center">
                      <input
                        type="text"
                        value={it.unit}
                        onChange={(e) => handleUpdateItem(it.id, 'unit', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-300 focus:bg-white rounded-lg p-2 text-slate-700 text-xs"
                      />
                    </td>

                    <td className="p-2.5">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-lg p-2 text-slate-900 font-medium text-xs"
                      />
                    </td>

                    <td className="p-2.5">
                      <input
                        type="text"
                        value={it.agencyBrand}
                        onChange={(e) => handleUpdateItem(it.id, 'agencyBrand', e.target.value)}
                        className="w-full bg-blue-50/50 border border-blue-200 focus:bg-white focus:border-[#00509E] rounded-lg p-2 text-slate-900 text-xs font-semibold"
                      />
                    </td>

                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          value={it.agencyUnitPrice}
                          onChange={(e) => handleUpdateItem(it.id, 'agencyUnitPrice', Number(e.target.value))}
                          className="w-20 text-right bg-white border border-blue-200 focus:border-[#00509E] rounded-lg p-2 font-bold text-[#00509E] text-xs"
                        />
                      </div>
                    </td>

                    <td className="p-2.5 text-right font-black text-[#001E50] bg-blue-50/60 text-xs">
                      ${(it.agencyTotal || 0).toLocaleString()}
                    </td>

                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Eliminar partida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen Totales Agencia */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-blue-200 rounded-2xl p-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#00509E] font-bold text-xs rounded-xl transition border border-blue-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Agregar Refacción a la Orden</span>
            </button>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-bold">Mano de Obra & Diagnóstico en Sitio:</span>
                <div className="flex items-center gap-1">
                  <span>$</span>
                  <input
                    type="number"
                    value={laborAgency}
                    onChange={(e) => setLaborAgency(Number(e.target.value))}
                    className="w-20 text-right bg-slate-50 border border-blue-200 rounded-lg p-1.5 font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="border-l border-blue-200 pl-4 flex items-baseline gap-2">
                <span className="font-black text-xs text-[#001E50]">TOTAL AGENCIA:</span>
                <span className="text-lg font-black text-[#001E50] font-mono">
                  ${totalAgency.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de separación vertical */}
        <div className="flex items-center justify-center gap-3 text-slate-400">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1 text-slate-600">
            <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
            <span>Propuesta de Autor Alternativa</span>
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* ======================================================== */}
        {/* 2. COTIZACIÓN OPCIÓN DE AUTOR (UNA DEBAJO DE LA OTRA)    */}
        {/* ======================================================== */}
        <div className="bg-amber-50/40 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-300 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#001E50]">
                  2. Cotización Opción De Autor (High Performance)
                </h4>
                <p className="text-xs text-slate-500">
                  Marcas premium de alto rendimiento (Motul, NGK Iridium, Mann Filter Pro) • Póliza de garantía 12 meses
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-amber-950 bg-[#FFC72C] px-3 py-1 rounded-full">
                Subtotal Refacciones: ${premiumPartsSubtotal.toLocaleString()} MXN
              </span>
            </div>
          </div>

          {/* Tabla amplia de De Autor (100% visible, sin texto cortado) */}
          <div className="overflow-x-auto border border-amber-200 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-amber-100/70 border-b border-amber-200 text-amber-950 font-black">
                  <th className="p-3 w-16 text-center">Cant.</th>
                  <th className="p-3 w-16 text-center">Unidad</th>
                  <th className="p-3 min-w-[240px]">Descripción del Concepto / Refacción</th>
                  <th className="p-3 min-w-[220px]">Marca De Autor (Premium)</th>
                  <th className="p-3 text-right w-28">P. Unitario Autor</th>
                  <th className="p-3 text-right w-28 bg-amber-100/90">Subtotal Autor</th>
                  <th className="p-3 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {items.map((it) => (
                  <tr key={'autor-' + it.id} className="hover:bg-amber-50/50 transition">
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => handleUpdateItem(it.id, 'quantity', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-300 focus:bg-white rounded-lg p-2 font-bold text-slate-900 text-xs"
                      />
                    </td>

                    <td className="p-2.5 text-center">
                      <input
                        type="text"
                        value={it.unit}
                        onChange={(e) => handleUpdateItem(it.id, 'unit', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-300 focus:bg-white rounded-lg p-2 text-slate-700 text-xs"
                      />
                    </td>

                    <td className="p-2.5">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-lg p-2 text-slate-900 font-medium text-xs"
                      />
                    </td>

                    <td className="p-2.5">
                      <input
                        type="text"
                        value={it.premiumBrand}
                        onChange={(e) => handleUpdateItem(it.id, 'premiumBrand', e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-200 focus:bg-white focus:border-amber-500 rounded-lg p-2 text-slate-900 text-xs font-semibold"
                      />
                    </td>

                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          value={it.premiumUnitPrice}
                          onChange={(e) => handleUpdateItem(it.id, 'premiumUnitPrice', Number(e.target.value))}
                          className="w-20 text-right bg-white border border-amber-300 focus:border-amber-500 rounded-lg p-2 font-bold text-amber-700 text-xs"
                        />
                      </div>
                    </td>

                    <td className="p-2.5 text-right font-black text-amber-950 bg-amber-100/60 text-xs">
                      ${(it.premiumTotal || 0).toLocaleString()}
                    </td>

                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Eliminar partida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen Totales De Autor */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-amber-300 rounded-2xl p-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition border border-amber-300 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>+ Agregar Refacción a la Orden</span>
            </button>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-bold">Mano de Obra & Descarbonizado Ultrasónico:</span>
                <div className="flex items-center gap-1">
                  <span>$</span>
                  <input
                    type="number"
                    value={laborPremium}
                    onChange={(e) => setLaborPremium(Number(e.target.value))}
                    className="w-20 text-right bg-slate-50 border border-amber-300 rounded-lg p-1.5 font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="border-l border-amber-300 pl-4 flex items-baseline gap-2">
                <span className="font-black text-xs text-[#001E50]">TOTAL DE AUTOR:</span>
                <span className="text-lg font-black text-amber-700 font-mono">
                  ${totalPremium.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones Finales de Envío y Guardado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Botón Principal: Guardar y Abrir WhatsApp Web / App */}
          <button
            type="button"
            onClick={() => handleSubmitWithWhatsApp(true)}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-900/20 transition cursor-pointer transform active:scale-[0.99]"
          >
            <MessageSquare className="w-5 h-5 text-white" />
            <span>Guardar y Enviar por WhatsApp al Cliente</span>
          </button>

          {/* Botón Secundario: Solo Guardar */}
          <button
            type="button"
            onClick={() => handleSubmitWithWhatsApp(false)}
            className="w-full py-4 px-6 rounded-2xl bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-900/20 transition cursor-pointer transform active:scale-[0.99]"
          >
            <Send className="w-5 h-5 text-[#FFC72C]" />
            <span>Guardar Nota en Sistema</span>
          </button>
        </div>
      </div>

      {/* Modal Manual de Servicio OEM */}
      {showManualModal && (
        <VehicleManualModal
          vehicle={appointment.vehicle}
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          onApplySpecsToQuote={handleApplySpecs}
        />
      )}
    </>
  );
}
