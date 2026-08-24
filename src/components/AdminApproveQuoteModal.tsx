'use client';

import React, { useState } from 'react';
import { Appointment, QuoteOptionType, PaymentMethod } from '@/types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  CreditCard,
  Banknote,
  Sparkles,
  ShieldCheck,
  X,
  AlertCircle,
  Car,
  User,
  MapPin,
} from 'lucide-react';

interface Props {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: {
    selectedOption: QuoteOptionType;
    date: string;
    timeSlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
}

export default function AdminApproveQuoteModal({
  appointment,
  isOpen,
  onClose,
  onApprove,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<QuoteOptionType>(
    appointment.selectedOption || 'premium'
  );
  const [date, setDate] = useState(
    appointment.scheduledDate || new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState(
    appointment.timeSlot || '09:00 - 11:30'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    appointment.paymentMethod || 'online_card'
  );
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const agencyPrice = appointment.quote?.agency.price || 4670;
  const premiumPrice = appointment.quote?.premium.price || 5610;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert('Por favor selecciona la fecha de servicio.');
      return;
    }
    if (!timeSlot) {
      alert('Por favor selecciona el horario de servicio.');
      return;
    }

    onApprove({
      selectedOption,
      date,
      timeSlot,
      paymentMethod,
      notes,
    });
  };

  const timeSlots = [
    '09:00 - 11:30',
    '12:00 - 14:30',
    '15:30 - 18:00',
    '18:30 - 20:30',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150 border border-slate-200 my-8">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0 border border-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Aprobar Cotización & Confirmar Cita
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {appointment.folio}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Valida la opción autorizada por el cliente y confirma fecha/horario de visita.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ficha Resumen del Auto & Cliente */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{appointment.client.name}</span>
              <span className="text-slate-400 font-normal">({appointment.client.phone})</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Car className="w-3.5 h-3.5 text-slate-500" />
              <span>{appointment.vehicle.brand} {appointment.vehicle.model} ({appointment.vehicle.year})</span>
              <span className="font-mono text-slate-500 text-[11px]">• Placas: {appointment.vehicle.plates}</span>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span>{appointment.client.address}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ======================================================== */}
          {/* 1. SELECCIÓN DE OPCIÓN DE COTIZACIÓN AUTORIZADA          */}
          {/* ======================================================== */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              1. Opción Autorizada por el Cliente:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción De Autor (Recomendada / Premium) */}
              <button
                type="button"
                onClick={() => setSelectedOption('premium')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedOption === 'premium'
                    ? 'bg-amber-50/70 border-amber-500 shadow-xs ring-2 ring-amber-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Opción De Autor
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                      ★ Máximo Desempeño
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Motul 100% Sintético + NGK Laser Iridium + Filtros Pro
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    ✓ Garantía 12 meses / 15,000 km
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-500">Total:</span>
                  <span className="text-lg font-black text-amber-900 font-mono">
                    ${premiumPrice.toLocaleString()} <span className="text-[10px] font-normal">MXN</span>
                  </span>
                </div>
              </button>

              {/* Opción Agencia OEM */}
              <button
                type="button"
                onClick={() => setSelectedOption('agencia')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedOption === 'agencia'
                    ? 'bg-blue-50/70 border-[#00509E] shadow-xs ring-2 ring-blue-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Opción Agencia OEM
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                      Concesionaria
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Refacciones originales de concesionaria autorizada
                  </p>
                  <span className="text-[10px] text-blue-700 font-bold block">
                    ✓ Garantía 6 meses
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-500">Total:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ${agencyPrice.toLocaleString()} <span className="text-[10px] font-normal">MXN</span>
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. FECHA Y HORARIO DE SERVICIO (MODIFICAR O CONFIRMAR)    */}
          {/* ======================================================== */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              2. Fecha y Horario de Atención (Modificar o Confirmar):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fecha */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Fecha del Servicio:
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 focus:bg-white rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-slate-500 transition"
                  />
                </div>
              </div>

              {/* Horario */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Horario de Visita:
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 focus:bg-white rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-slate-500 transition"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. FORMA DE PAGO ACORDADA                                */}
          {/* ======================================================== */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              3. Forma de Pago Acordada con el Cliente:
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('online_card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  paymentMethod === 'online_card'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta en Línea</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('on_site_card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  paymentMethod === 'on_site_card'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span>Terminal en Sitio</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('on_site_cash')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  paymentMethod === 'on_site_cash'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-500" />
                <span>Efectivo al Técnico</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. NOTAS O INSTRUCCIONES ADICIONALES                     */}
          {/* ======================================================== */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">
              Notas u Observaciones del Acuerdo (Opcional):
            </label>
            <input
              type="text"
              placeholder="Ej. Cliente confirmó por WhatsApp, solicitó aviso 15 min antes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-slate-500 transition"
            />
          </div>

          {/* Botones de Acción Final */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-2/3 py-3.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar & Pasar a Aprobada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
