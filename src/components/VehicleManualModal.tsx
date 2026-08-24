'use client';

import React, { useState } from 'react';
import {
  VehicleTechnicalSpec,
  Vehicle,
} from '@/types';
import {
  VEHICLE_KNOWLEDGE_BASE,
  findVehicleSpec,
  searchVehicleSpecs,
} from '@/lib/vehicleKnowledgeBase';
import {
  BookOpen,
  X,
  Search,
  CheckCircle2,
  Droplet,
  Zap,
  Shield,
  Wrench,
  RotateCcw,
  Sparkles,
  Send,
  AlertTriangle,
  FileText,
  HelpCircle,
  Car,
  Bot,
  ListChecks,
} from 'lucide-react';

interface Props {
  vehicle?: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onApplySpecsToQuote?: (spec: VehicleTechnicalSpec) => void;
}

type ManualTab = 'torques' | 'reseteo' | 'copiloto';

export default function VehicleManualModal({
  vehicle,
  isOpen,
  onClose,
  onApplySpecsToQuote,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ManualTab>('torques');

  const [selectedSpecId, setSelectedSpecId] = useState<string>(() => {
    if (vehicle) {
      const found = findVehicleSpec(vehicle.brand, vehicle.model, vehicle.vin);
      return found?.id || VEHICLE_KNOWLEDGE_BASE[0].id;
    }
    return VEHICLE_KNOWLEDGE_BASE[0].id;
  });

  // AI Mechanic Chat State
  const [aiQuestion, setAiQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: '¡Hola Master Tech! Soy tu copiloto de manuales OEM. Pregúntame sobre torques de apriete, calibración de bujías, litros exactos de aceite o procedimientos de reseteo de testigo para cualquier vehículo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const currentSpec =
    VEHICLE_KNOWLEDGE_BASE.find((s) => s.id === selectedSpecId) ||
    VEHICLE_KNOWLEDGE_BASE[0];

  const searchResults = searchVehicleSpecs(searchQuery);

  const handleSendAiQuestion = (questionText?: string) => {
    const textToSend = questionText || aiQuestion;
    if (!textToSend.trim()) return;

    const q = textToSend.trim().toLowerCase();
    const newMsg = {
      sender: 'user' as const,
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setAiQuestion('');

    // Generate intelligent AI response grounded in OEM spec
    setTimeout(() => {
      let aiReply = '';
      if (q.includes('aceite') || q.includes('litro') || q.includes('viscosidad') || q.includes('capacidad')) {
        aiReply = `Para el ${currentSpec.brand} ${currentSpec.model} (${currentSpec.engine}):\n• Capacidad exacta: ${currentSpec.oil.capacityLiters} Litros (con cambio de filtro).\n• Viscosidad recomendada: ${currentSpec.oil.viscosity}.\n• Norma OEM: ${currentSpec.oil.oemNorm}.\n• Recomendación De Autor: ${currentSpec.oil.recommendedMotul}.\n• Torque tapón de cárter: ${currentSpec.oil.drainPlugTorqueNm} Nm.`;
      } else if (q.includes('bujia') || q.includes('calibracion') || q.includes('gap') || q.includes('torque')) {
        aiReply = `Especificación de Bujías para ${currentSpec.brand} ${currentSpec.model}:\n• Tipo: ${currentSpec.sparkPlugs.type} (${currentSpec.sparkPlugs.ngkReference}).\n• Calibración (GAP): ${currentSpec.sparkPlugs.gapInches} (${currentSpec.sparkPlugs.gapMm}).\n• Torque de apriete: ${currentSpec.sparkPlugs.torqueNm} Nm.\n• Medida de dado: ${currentSpec.sparkPlugs.hexSize}.`;
      } else if (q.includes('reset') || q.includes('testigo') || q.includes('servicio') || q.includes('borrar') || q.includes('luz')) {
        aiReply = `Procedimiento de Reseteo de Servicio para ${currentSpec.brand} ${currentSpec.model}:\n${currentSpec.serviceReset.dashboardSteps.join('\n')}`;
      } else if (q.includes('filtro') || q.includes('mann') || q.includes('parte')) {
        aiReply = `Filtros compatibles Mann Filter para ${currentSpec.brand} ${currentSpec.model}:\n• Aceite: ${currentSpec.filters.oilFilterMann} (OEM: ${currentSpec.filters.oilFilterOem})\n• Aire: ${currentSpec.filters.airFilterMann} (OEM: ${currentSpec.filters.airFilterOem})\n• Cabina: ${currentSpec.filters.cabinFilterMann}`;
      } else {
        aiReply = `Información Oficial ${currentSpec.brand} ${currentSpec.model} (${currentSpec.engine}):\n• Aceite: ${currentSpec.oil.capacityLiters}L ${currentSpec.oil.viscosity} (Torque ${currentSpec.oil.drainPlugTorqueNm} Nm)\n• Bujías: ${currentSpec.sparkPlugs.ngkReference} a ${currentSpec.sparkPlugs.gapMm} (${currentSpec.sparkPlugs.torqueNm} Nm)\n• Reseteo: Consulta la pestaña 'Procedimiento de Reseteo' en el panel superior.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 sm:backdrop-blur-xs flex items-center justify-center p-0 sm:p-5 animate-in fade-in">
      {/* Modal Container: Fullscreen on mobile, rounded card on desktop */}
      <div className="bg-white border-0 sm:border border-slate-200 w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-3xl rounded-none shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header (Obsidian Navy Institutional) */}
        <div className="p-4 sm:p-5 bg-[#08101E] text-white border-b border-slate-800 shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shrink-0">
                <BookOpen className="w-4 h-4 text-[#08101E]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm sm:text-base text-white truncate">
                  Manual de Servicio OEM & Torques
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">
                  Base de Conocimiento Técnico • Datos Oficiales de Fabricante
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onApplySpecsToQuote && (
                <button
                  type="button"
                  onClick={() => {
                    onApplySpecsToQuote(currentSpec);
                    onClose();
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aplicar a Cotización</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar vehículo por marca, modelo o motor (ej. Suzuki, Jetta, Duster, Civic)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-amber-400/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          {/* Selector de Modelos (Pills horizontales limpias) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {searchResults.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecId(spec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  spec.id === selectedSpecId
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70'
                }`}
              >
                <span>{spec.brand} {spec.model}</span>
              </button>
            ))}
          </div>

          {/* 3 Sub-pestañas para Móvil y Desktop */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('torques')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'torques'
                  ? 'bg-slate-800 text-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Ficha & Torques</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reseteo')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'reseteo'
                  ? 'bg-slate-800 text-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset de Servicio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('copiloto')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'copiloto'
                  ? 'bg-slate-800 text-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Copiloto IA</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 pb-24 sm:pb-8 space-y-4 bg-[#F8FAFC]">
          {/* Vehículo Seleccionado Info Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                {currentSpec.brand} • {currentSpec.yearRange}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {currentSpec.brand} {currentSpec.model}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Motorización OEM:</span>
              <strong className="text-xs sm:text-sm text-slate-800 font-mono">{currentSpec.engine}</strong>
            </div>
          </div>

          {/* ======================================================== */}
          {/* PESTAÑA 1: FICHA TÉCNICA & TORQUES DE APRIETE            */}
          {/* ======================================================== */}
          {activeTab === 'torques' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Aceite & Lubricación */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2 font-mono">
                    <Droplet className="w-4 h-4 text-amber-500" />
                    <span>Lubricación & Aceite de Motor</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Capacidad con Filtro:</span>
                      <strong className="text-slate-900 font-mono text-sm">{currentSpec.oil.capacityLiters} L</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Viscosidad OEM:</span>
                      <strong className="text-slate-900 font-bold">{currentSpec.oil.viscosity}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Norma Oficial:</span>
                      <span className="font-mono text-[11px] text-slate-700">{currentSpec.oil.oemNorm}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Torque Tapón Cárter:</span>
                      <strong className="text-amber-900 font-mono text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {currentSpec.oil.drainPlugTorqueNm} Nm
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Torque Filtro Aceite:</span>
                      <strong className="text-slate-900 font-mono">{currentSpec.oil.filterTorqueNm} Nm</strong>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Recomendación De Autor:</span>
                      <strong className="text-slate-900">{currentSpec.oil.recommendedMotul}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Bujías & Encendido */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2 font-mono">
                    <Zap className="w-4 h-4 text-slate-800" />
                    <span>Sistema de Encendido & Bujías</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Tipo de Bujía:</span>
                      <strong className="text-slate-900">{currentSpec.sparkPlugs.type}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Calibración / GAP:</span>
                      <strong className="text-emerald-900 font-mono text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {currentSpec.sparkPlugs.gapInches} ({currentSpec.sparkPlugs.gapMm})
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Torque de Apriete:</span>
                      <strong className="text-slate-900 font-mono">{currentSpec.sparkPlugs.torqueNm} Nm</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-slate-500">Medida de Dado:</span>
                      <span className="font-mono text-slate-800">{currentSpec.sparkPlugs.hexSize}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Cantidad:</span>
                      <span className="font-bold text-slate-900">{currentSpec.sparkPlugs.quantity} bujías</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Ref. NGK Laser Iridium:</span>
                      <strong className="text-slate-900 font-mono">{currentSpec.sparkPlugs.ngkReference}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Filtros y Referencias */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
                  <Shield className="w-4 h-4 text-slate-700" />
                  <span>Referencias Cruzadas de Filtros (OEM vs Mann Filter)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Filtro de Aceite:</span>
                    <strong className="text-slate-900 block font-mono">{currentSpec.filters.oilFilterMann}</strong>
                    <span className="text-[11px] text-slate-500 block font-mono">OEM: {currentSpec.filters.oilFilterOem}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Filtro de Aire:</span>
                    <strong className="text-slate-900 block font-mono">{currentSpec.filters.airFilterMann}</strong>
                    <span className="text-[11px] text-slate-500 block font-mono">OEM: {currentSpec.filters.airFilterOem}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Filtro de Cabina:</span>
                    <strong className="text-slate-900 block font-mono">{currentSpec.filters.cabinFilterMann}</strong>
                    <span className="text-[11px] text-slate-500 block font-mono">Carbón Activado</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 2: PROCEDIMIENTO DE RESETEO DE SERVICIO          */}
          {/* ======================================================== */}
          {activeTab === 'reseteo' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span>Procedimiento Oficial de Reseteo de Testigo en Tablero</span>
                </div>

                <div className="space-y-2.5">
                  {currentSpec.serviceReset.dashboardSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>

                {currentSpec.serviceReset.obdProtocol && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-slate-700 uppercase text-[10px] font-mono block">
                      Protocolo de Diagnóstico OBD-II:
                    </span>
                    <p className="text-slate-800 font-mono leading-relaxed">{currentSpec.serviceReset.obdProtocol}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 3: COPILOTO IA MECÁNICO                          */}
          {/* ======================================================== */}
          {activeTab === 'copiloto' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-slate-800" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    Consultas Técnicas para {currentSpec.brand} {currentSpec.model}
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSendAiQuestion(`¿Cuál es el torque de bujías y calibración gap para ${currentSpec.model}?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer border border-slate-200"
                >
                  Torque de bujías
                </button>
                <button
                  type="button"
                  onClick={() => handleSendAiQuestion(`¿Cuántos litros exactos de aceite lleva el ${currentSpec.model}?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer border border-slate-200"
                >
                  Litros de aceite
                </button>
                <button
                  type="button"
                  onClick={() => handleSendAiQuestion(`¿Cómo borro la luz de servicio del ${currentSpec.model}?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer border border-slate-200"
                >
                  Resetear servicio
                </button>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiQuestion();
                }}
                className="flex items-center gap-2 pt-2 border-t border-slate-100"
              >
                <input
                  type="text"
                  placeholder="Escribe tu pregunta técnica..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
