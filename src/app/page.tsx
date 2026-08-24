'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import QuoteRequestForm from '@/components/QuoteRequestForm';
import BookingCalendar from '@/components/BookingCalendar';
import { Sparkles, CheckCircle2, Clock, Shield, MapPin, Mail, MessageSquare, Wrench, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface ClientFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  referenceNotes: string;
  brand: string;
  model: string;
  year: number;
  plates: string;
  vin: string;
  currentKm: number;
}

export default function HomePage() {
  const { createQuoteRequest, appointments } = useApp();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<ClientFormData | null>(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);

  const createdAppointment = appointments.find((a) => a.id === createdAppointmentId);

  const handleStep1Submit = (data: ClientFormData) => {
    setFormData(data);
    setActiveStep(2);
  };

  const handleStep2Submit = ({ date, timeSlot }: { date: string; timeSlot: string }) => {
    if (!formData) return;

    const newId = createQuoteRequest({
      client: {
        id: 'cli-' + Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        referenceNotes: formData.referenceNotes,
      },
      vehicle: {
        id: 'veh-' + Date.now(),
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        plates: formData.plates,
        vin: formData.vin,
        currentKm: formData.currentKm,
      },
      packageType: 'afinacion_mayor',
      scheduledDate: date,
      timeSlot: timeSlot,
      status: 'solicitud_pendiente',
    });

    setCreatedAppointmentId(newId);
    setActiveStep(3);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      {/* HEADER / HERO SECTION (Empieza directamente desde lo azul sin barras sobrepuestas) */}
      <div>
        <header className="bg-gradient-to-b from-[#001E50] via-[#002666] to-[#001E50] text-white pt-8 pb-14 px-4 sm:px-6 shadow-md">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {/* Logo oficial */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFC72C] text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                AA
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight">
                AFINACIONES <span className="text-[#FFC72C]">DE AUTOR</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFC72C] text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FFC72C]" />
              <span>Mecánica de Precisión a Domicilio</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
              <span className="text-[#FFC72C] block sm:inline">
                Afinación de Autor
              </span>{' '}
              <span className="text-white">
                Especializada para tu Auto en la Puerta de tu Casa
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              Sin dejar tu auto días enteros en el taller. Cotizamos por número de serie (VIN), instalamos refacciones certificadas y te entregamos tu Reporte Técnico digital con garantía.
            </p>

            {/* Ventajas clave */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs text-blue-100">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC72C]" /> Garantía por escrito
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <Shield className="w-3.5 h-3.5 text-blue-300" /> Presupuesto Transparente por VIN
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <Clock className="w-3.5 h-3.5 text-[#FFC72C]" /> 2 horas en tu cochera
              </span>
            </div>
          </div>
        </header>

        {/* MAIN WIZARD CONTAINER (Centrado, alineado, sin elementos montados) */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6">
            {/* Stepper Header */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {/* Paso 1 */}
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition ${
                      activeStep === 1
                        ? 'bg-[#001E50] text-[#FFC72C] ring-4 ring-blue-100 shadow-sm'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs font-bold text-slate-700">Datos & VIN</span>
                </div>

                <div className="h-1 flex-1 mx-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      activeStep > 1 ? 'bg-[#00509E]' : 'w-0'
                    }`}
                  />
                </div>

                {/* Paso 2 */}
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition ${
                      activeStep === 2
                        ? 'bg-[#001E50] text-[#FFC72C] ring-4 ring-blue-100 shadow-sm'
                        : activeStep === 3
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs font-bold text-slate-700">Agenda Fecha</span>
                </div>

                <div className="h-1 flex-1 mx-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      activeStep === 3 ? 'bg-[#00509E]' : 'w-0'
                    }`}
                  />
                </div>

                {/* Paso 3 */}
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition ${
                      activeStep === 3
                        ? 'bg-[#001E50] text-[#FFC72C] ring-4 ring-blue-100 shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs font-bold text-slate-700">Envío & Folio</span>
                </div>
              </div>
            </div>

            {/* PASO 1: DATOS DEL VEHÍCULO Y CONTACTO */}
            {activeStep === 1 && (
              <div className="animate-in fade-in duration-300">
                <QuoteRequestForm onSubmitData={handleStep1Submit} />
              </div>
            )}

            {/* PASO 2: SELECCIÓN DE DÍA Y HORA */}
            {activeStep === 2 && (
              <div className="animate-in fade-in duration-300">
                <BookingCalendar
                  onConfirm={handleStep2Submit}
                  onBack={() => setActiveStep(1)}
                />
              </div>
            )}

            {/* PASO 3: CONFIRMACIÓN DE ENVÍO DE DATOS */}
            {activeStep === 3 && createdAppointment && (
              <div className="animate-in fade-in duration-300 max-w-xl mx-auto text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                    ¡Solicitud Enviada con Éxito!
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#001E50]">
                    Folio: <span className="text-[#00509E] font-mono">{createdAppointment.folio}</span>
                  </h2>
                </div>

                {/* Mensaje explicativo claro de cotización en proceso */}
                <div className="bg-blue-50/70 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 text-left space-y-3 text-xs sm:text-sm text-slate-800">
                  <div className="flex items-center gap-2 text-[#001E50] font-black text-sm">
                    <Mail className="w-4 h-4 text-[#00509E]" />
                    <span>¿Qué sigue ahora?</span>
                  </div>
                  <p className="leading-relaxed">
                    Hemos recibido correctamente la información de tu <strong>{createdAppointment.vehicle.brand} {createdAppointment.vehicle.model}</strong>.
                  </p>
                  <p className="leading-relaxed">
                    Nuestro equipo técnico especializado está cotizando manualmente las refacciones correspondientes al número de serie <strong>(VIN: {createdAppointment.vehicle.vin})</strong>.
                  </p>
                  <div className="p-3.5 bg-white rounded-2xl border border-blue-200 font-bold text-[#001E50] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Recibirás tu presupuesto personalizado directamente en tu WhatsApp ({createdAppointment.client.phone}) y en tu correo electrónico.</span>
                  </div>
                </div>

                {/* Resumen de la solicitud */}
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-left space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Servicio Solicitado:</span>
                    <strong className="text-[#001E50]">Afinación de Autor a Domicilio</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Fecha Tentativa Elegida:</span>
                    <strong className="text-[#00509E]">{createdAppointment.scheduledDate} ({createdAppointment.timeSlot})</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Placas del Auto:</span>
                    <span className="font-mono font-bold text-slate-900">{createdAppointment.vehicle.plates}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Kilometraje Actual:</span>
                    <span className="font-mono font-bold text-[#001E50]">{createdAppointment.vehicle.currentKm ? createdAppointment.vehicle.currentKm.toLocaleString() + ' KM' : 'No especificado'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Dirección:</span>
                    <span className="text-slate-800 text-right max-w-[260px] truncate">{createdAppointment.client.address}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/seguimiento/${createdAppointment.id}`}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] font-black text-sm shadow-md transition"
                  >
                    <MapPin className="w-4 h-4 text-[#FFC72C]" />
                    <span>Ver Estatus de tu Solicitud en Vivo</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FOOTER DISCRETO Y ELEGANTE */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-black text-[#001E50] text-sm">
              AFINACIONES <span className="text-amber-600">DE AUTOR</span>
            </div>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} Afinaciones de Autor. Todos los derechos reservados.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/ops"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition border border-slate-200"
            >
              <Wrench className="w-3.5 h-3.5 text-[#00509E]" />
              <span>Portal Operativo / Staff</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
