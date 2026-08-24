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
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function TrackingPage() {
  const params = useParams();
  const appointmentId = params?.id as string;
  const { appointments, rebookAppointment1Click } = useApp();
  const [showReportModal, setShowReportModal] = useState(false);
  const [rebookSuccessFolio, setRebookSuccessFolio] = useState<string | null>(null);

  const appointment = appointments.find((a) => a.id === appointmentId);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-600 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-black text-slate-900">Cita no encontrada</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          No pudimos localizar la cita con el identificador proporcionado. Revisa tu enlace o regresa al inicio.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#001E50] text-[#FFC72C] rounded-2xl font-black text-sm hover:bg-[#00509E] transition"
        >
          Ir al Inicio
        </Link>
      </div>
    );
  }

  const isComplete = appointment.status === 'completada';
  const isEnCamino = appointment.status === 'en_camino';
  const isEnServicio = appointment.status === 'en_servicio';
  const isConfirmada = appointment.status === 'confirmada';

  const handle1ClickRebook = () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    const dateStr = futureDate.toISOString().split('T')[0];

    const newId = rebookAppointment1Click(appointment.id, dateStr, '10:00 - 12:30');
    const newApt = appointments.find((a) => a.id === newId);
    setRebookSuccessFolio(newApt?.folio || 'ADA-NUEVO');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-black text-[#00509E]">
                Seguimiento de Cita en Tiempo Real
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2.5 py-0.5 rounded-full font-bold">
                Folio: {appointment.folio}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#001E50]">
              {appointment.vehicle.brand} {appointment.vehicle.model} ({appointment.vehicle.plates})
            </h1>
          </div>

          {isComplete && (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] font-black text-sm rounded-2xl shadow-sm transition"
            >
              <FileText className="w-4 h-4 text-[#FFC72C]" />
              <span>Ver Reporte Técnico & Garantía</span>
            </button>
          )}
        </div>

        {/* Live Timeline Stepper */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Estatus del Servicio a Domicilio
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 1. Confirmada */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                isConfirmada || isEnCamino || isEnServicio || isComplete
                  ? 'bg-emerald-50/50 border-emerald-400 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">Paso 1</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-sm font-black text-slate-900">Cita Confirmada</div>
              <p className="text-xs text-slate-600 mt-1">Refacciones reservadas para tu VIN.</p>
            </div>

            {/* 2. En Camino */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                isEnCamino || isEnServicio || isComplete
                  ? 'bg-blue-50/60 border-[#00509E] text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">Paso 2</span>
                {isEnCamino ? (
                  <span className="w-3 h-3 rounded-full bg-[#00509E] animate-ping" />
                ) : isEnServicio || isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="text-sm font-black text-slate-900">Técnico en Camino</div>
              <p className="text-xs text-slate-600 mt-1">Unidad móvil en ruta a tu dirección.</p>
            </div>

            {/* 3. En Servicio */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                isEnServicio || isComplete
                  ? 'bg-amber-50/70 border-amber-500 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">Paso 3</span>
                {isEnServicio ? (
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                ) : isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="text-sm font-black text-slate-900">En Servicio & Evidencias</div>
              <p className="text-xs text-slate-600 mt-1">Fotos Antes/Después y escaneo.</p>
            </div>

            {/* 4. Finalizado */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                isComplete
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">Paso 4</span>
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="text-sm font-black text-slate-900">Servicio Finalizado</div>
              <p className="text-xs text-slate-600 mt-1">Firma & Reporte PDF entregado.</p>
            </div>
          </div>
        </div>

        {/* Details & Technician Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00509E]" />
              <span>Detalles de la Cita</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Fecha:</span>
                <strong className="text-slate-900">{appointment.scheduledDate}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Horario:</span>
                <strong className="text-[#00509E]">{appointment.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Paquete:</span>
                <strong className="text-slate-900">
                  {appointment.selectedOption === 'agencia' ? 'Opción Agencia (OEM)' : 'Opción Premium de Autor'}
                </strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Pago:</span>
                <span className="text-slate-800 font-semibold">
                  {appointment.paymentMethod === 'online_card' ? 'Tarjeta en Línea (Pagado)' : 'Contra Entrega en Sitio'}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Dirección:</span>
                <span className="text-slate-800 text-xs sm:text-sm flex items-start gap-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{appointment.client.address}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00509E]" />
              <span>Master Tech Asignado</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#001E50] text-[#FFC72C] flex items-center justify-center font-black text-base shadow-sm">
                  PA
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">{appointment.technicianName}</div>
                  <span className="text-xs text-emerald-700 font-bold">
                    Certificado en Diagnóstico & Afinaciones
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`tel:${appointment.technicianPhone}`}
                  className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Llamar</span>
                </a>
                <a
                  href={`https://wa.me/${appointment.technicianPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Follow-up Preventive Alert */}
        {isComplete && (
          <div className="bg-gradient-to-r from-amber-50 via-white to-white border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ciclo Preventivo de 6 Meses / 10,000 km</span>
              </div>
              <span className="text-xs bg-[#FFC72C] text-slate-950 px-3 py-1 rounded-full font-black">
                1-Click Rebooking
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-[#001E50]">
                Mantén la garantía y respuesta de tu {appointment.vehicle.brand} {appointment.vehicle.model}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Agenda tu próximo mantenimiento en 2 clics. Precargamos tu VIN, refacciones preferidas y dirección sin tener que volver a llenar datos.
              </p>
            </div>

            {rebookSuccessFolio ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  ¡Re-agendamiento exitoso! Se ha generado tu cita con folio <strong>{rebookSuccessFolio}</strong>.
                </span>
              </div>
            ) : (
              <button
                onClick={handle1ClickRebook}
                className="px-6 py-3.5 bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#FFC72C]" />
                <span>Programar Próximo Ciclo Preventivo (1-Click)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Report */}
      <TechnicalReportModal
        appointment={appointment}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}
