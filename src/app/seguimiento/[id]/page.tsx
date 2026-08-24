'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import TechnicalReportModal from '@/components/TechnicalReportModal';
import {
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertCircle,
  Wrench,
  Navigation,
  Check,
  Layers,
  ArrowRight,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { QuoteOptionType, PaymentMethod } from '@/types';

export default function TrackingPage() {
  const params = useParams();
  const appointmentId = params?.id as string;
  const { appointments, acceptQuoteAndBook, scheduleSettings } = useApp();
  const [showReportModal, setShowReportModal] = useState(false);

  // Quote approval form states (if client approves online)
  const [selectedQuoteOption, setSelectedQuoteOption] = useState<QuoteOptionType>('premium');
  const [confirmDate, setConfirmDate] = useState('');
  const [confirmTimeSlot, setConfirmTimeSlot] = useState('');
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState<PaymentMethod>('on_site_card');
  const [isApproving, setIsApproving] = useState(false);

  const appointment = appointments.find((a) => a.id === appointmentId);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-600 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900">Cita no encontrada</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          No pudimos localizar la cita con el folio proporcionado. Revisa tu enlace o regresa al inicio.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#08101E] text-amber-400 rounded-2xl font-bold text-sm hover:bg-slate-800 transition"
        >
          Ir al Inicio
        </Link>
      </div>
    );
  }

  // 6 Real Lifecycle Stages
  const isPending = appointment.status === 'solicitud_pendiente';
  const isQuoted = appointment.status === 'cotizado';
  const isConfirmed = appointment.status === 'confirmada';
  const isEnCamino = appointment.status === 'en_camino';
  const isEnServicio = appointment.status === 'en_servicio';
  const isCompleted = appointment.status === 'completada';

  // Determine active step index (1 to 6)
  let currentStep = 1;
  if (isPending) currentStep = 1;
  else if (isQuoted) currentStep = 2;
  else if (isConfirmed) currentStep = 3;
  else if (isEnCamino) currentStep = 4;
  else if (isEnServicio) currentStep = 5;
  else if (isCompleted) currentStep = 6;

  const handleClientApproveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApproving(true);

    acceptQuoteAndBook(
      appointment.id,
      selectedQuoteOption,
      confirmDate || appointment.scheduledDate,
      confirmTimeSlot || appointment.timeSlot,
      confirmPaymentMethod
    );

    setIsApproving(false);
  };

  const stepsList = [
    { num: 1, label: 'Cotización Solicitada', desc: 'Revisión técnica de VIN' },
    { num: 2, label: 'Propuestas Enviadas', desc: 'Presupuesto dual listo' },
    { num: 3, label: 'Cotización Aprobada', desc: 'Cita y refacciones listas' },
    { num: 4, label: 'Técnico en Camino', desc: 'En ruta a tu domicilio' },
    { num: 5, label: 'En Servicio & Fotos', desc: 'Diagnóstico y afinación' },
    { num: 6, label: 'Orden Realizada', desc: 'Garantía y reporte PDF' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-700 bg-slate-100 px-3 py-0.5 rounded-md font-mono border border-slate-200">
                Seguimiento en Vivo
              </span>
              <span className="text-xs bg-[#08101E] text-amber-400 font-mono px-3 py-0.5 rounded-md font-bold">
                Folio: {appointment.folio}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {appointment.vehicle.brand} {appointment.vehicle.model} ({appointment.vehicle.year})
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Placas: <strong className="text-slate-800">{appointment.vehicle.plates || 'S/P'}</strong> • VIN: <strong className="text-slate-800">{appointment.vehicle.vin}</strong>
            </p>
          </div>

          {isCompleted && (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#08101E] hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-2xl shadow-xs transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ver Reporte Técnico & Garantía</span>
            </button>
          )}
        </div>

        {/* 6-Step Visual Stepper */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Estatus del Servicio en Tiempo Real
            </h2>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              Paso {currentStep} de 6
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {stepsList.map((st) => {
              const isPast = st.num < currentStep;
              const isCurrent = st.num === currentStep;
              const isFuture = st.num > currentStep;

              return (
                <div
                  key={st.num}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 text-slate-900'
                      : isPast
                      ? 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">Paso {st.num}</span>
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {st.label}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* BANNER DINÁMICO SEGÚN ESTADO                              */}
        {/* ======================================================== */}

        {/* ESTADO 1: COTIZACIÓN SOLICITADA (PENDIENTE) */}
        {isPending && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Estamos elaborando tu cotización con base en tu VIN
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  Hemos recibido tu solicitud para tu <strong>{appointment.vehicle.brand} {appointment.vehicle.model}</strong>. Nuestro equipo de taller móvil está calculando las piezas originales y de alto rendimiento. En unos momentos recibirás las opciones detalladas directamente en tu WhatsApp (<strong>{appointment.client.phone}</strong>) y por correo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ESTADO 2: PROPUESTAS ENVIADAS (CLIENTE PUEDE REVISAR Y APROBAR EN 1-CLICK) */}
        {isQuoted && appointment.quote && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-mono">
                Presupuesto Listo para Elección
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Selecciona tu opción de servicio para confirmar tu cita
              </h3>
              <p className="text-xs text-slate-500">
                Elige entre refacciones originales de Agencia o especificación de Alto Rendimiento De Autor.
              </p>
            </div>

            {/* Selector de Paquete Dual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opción Agencia */}
              <div
                onClick={() => setSelectedQuoteOption('agencia')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  selectedQuoteOption === 'agencia'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Opción 1</span>
                    <h4 className="text-sm font-bold text-slate-900">{appointment.quote.agency.title}</h4>
                  </div>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    ${appointment.quote.agency.price.toLocaleString()} <span className="text-xs font-normal">MXN</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600">{appointment.quote.agency.description}</p>

                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <span>Garantía: <strong>{appointment.quote.agency.warrantyMonths} meses</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span>Refacciones: {appointment.quote.agency.partsBrand}</span>
                  </div>
                </div>
              </div>

              {/* Opción De Autor */}
              <div
                onClick={() => setSelectedQuoteOption('premium')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                  selectedQuoteOption === 'premium'
                    ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="absolute -top-2.5 right-4 bg-slate-900 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-xs">
                  Recomendada
                </span>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700 font-mono">Opción 2</span>
                    <h4 className="text-sm font-bold text-slate-900">{appointment.quote.premium.title}</h4>
                  </div>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    ${appointment.quote.premium.price.toLocaleString()} <span className="text-xs font-normal">MXN</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600">{appointment.quote.premium.description}</p>

                <div className="pt-2 border-t border-amber-200/60 space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Garantía extendida: <strong>{appointment.quote.premium.warrantyMonths} meses</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Insumos: {appointment.quote.premium.partsBrand}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Aprobación en 1-Click */}
            <form onSubmit={handleClientApproveQuote} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Confirmar Horario y Forma de Pago
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Fecha de Visita:</label>
                  <input
                    type="date"
                    defaultValue={appointment.scheduledDate}
                    onChange={(e) => setConfirmDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Horario:</label>
                  <select
                    defaultValue={appointment.timeSlot}
                    onChange={(e) => setConfirmTimeSlot(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {scheduleSettings.slots.map((s) => (
                      <option key={s.id} value={s.slot}>
                        {s.slot} ({s.label})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Forma de Pago:</label>
                  <select
                    defaultValue={confirmPaymentMethod}
                    onChange={(e) => setConfirmPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="on_site_card">💳 Terminal en Sitio</option>
                    <option value="online_card">⚡ Tarjeta en Línea</option>
                    <option value="on_site_cash">💵 Efectivo al Terminar</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isApproving}
                  className="w-full sm:w-auto px-7 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Aprobar Cotización y Confirmar Cita</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Details & Technician Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles de la Cita */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              <span>Detalles del Servicio</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Fecha Programada:</span>
                <strong className="text-slate-900 font-mono">{appointment.scheduledDate}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Horario de Atención:</span>
                <strong className="text-slate-900 font-mono">{appointment.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Paquete Seleccionado:</span>
                <strong className="text-slate-900">
                  {appointment.selectedOption === 'agencia'
                    ? 'Opción Agencia (OEM)'
                    : appointment.selectedOption === 'premium'
                    ? 'Opción De Autor (Alto Rendimiento)'
                    : 'Por elegir cotización'}
                </strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Estatus de Pago:</span>
                <span className="font-bold font-mono text-xs text-slate-800">
                  {appointment.paymentStatus === 'paid' ? '✅ Liquidado' : '⏳ Pendiente al finalizar'}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Dirección a Domicilio:</span>
                <span className="text-slate-800 text-xs sm:text-sm flex items-start gap-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{appointment.client.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Master Tech Asignado */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Master Tech Asignado</span>
            </h3>

            {isPending ? (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <Clock className="w-6 h-6 text-slate-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">Asignación en Proceso</h4>
                <p className="text-[11px] text-slate-500">
                  Se asignará al técnico especialista certificado de tu zona en cuanto se confirme tu cotización.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#08101E] text-amber-400 flex items-center justify-center font-black text-sm shadow-xs font-mono">
                    {appointment.technicianName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{appointment.technicianName}</div>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certificado en Afinaciones & Diagnóstico</span>
                    </span>
                  </div>
                </div>

                {appointment.technicianPhone && (
                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={`tel:${appointment.technicianPhone}`}
                      className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Llamar</span>
                    </a>
                    <a
                      href={`https://wa.me/${appointment.technicianPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Reporte Técnico */}
      {showReportModal && (
        <TechnicalReportModal
          appointment={appointment}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
