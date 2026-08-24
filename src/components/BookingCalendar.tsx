'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Ban,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  onConfirm: (data: { date: string; timeSlot: string }) => void;
  onBack: () => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function BookingCalendar({ onConfirm, onBack }: Props) {
  const { scheduleSettings, appointments } = useApp();

  const now = new Date();
  const [currentYear, setCurrentYear] = useState(() => now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => now.getMonth());

  // Default selected date: next available active date
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [selectedSlot, setSelectedSlot] = useState('');

  const activeSlots = scheduleSettings.slots.filter((s) => s.active);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar cells calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0=Domingo
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDay = String(d).padStart(2, '0');
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
    calendarCells.push({
      dayNumber: d,
      dateString,
      dayOfWeek: new Date(currentYear, currentMonth, d).getDay(),
    });
  }

  // Check booked slots on selected date
  const bookedSlotsOnSelectedDate = appointments
    .filter((a) => a.scheduledDate === selectedDate && a.status !== 'cancelada')
    .map((a) => a.timeSlot);

  // Auto select slot only when the selected date changes and current slot is no longer valid
  useEffect(() => {
    setSelectedSlot((currentSlot) => {
      if (currentSlot && !bookedSlotsOnSelectedDate.includes(currentSlot)) {
        return currentSlot;
      }
      const firstAvailable = activeSlots.find(
        (s) => !bookedSlotsOnSelectedDate.includes(s.slot)
      );
      return firstAvailable ? firstAvailable.slot : '';
    });
  }, [selectedDate]);

  // Selected date details
  const selectedDateParts = selectedDate.split('-').map(Number);
  const selectedDayOfWeek = new Date(
    selectedDateParts[0],
    selectedDateParts[1] - 1,
    selectedDateParts[2]
  ).getDay();

  const selectedDayConfig = scheduleSettings.workingDays.find(
    (d) => d.dayOfWeek === selectedDayOfWeek
  );
  const isSelectedDateBlocked =
    scheduleSettings.blockedDates.includes(selectedDate) ||
    (selectedDayConfig && !selectedDayConfig.enabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelectedDateBlocked) {
      alert('La fecha seleccionada no está disponible. Por favor elige otro día habilitado en el calendario.');
      return;
    }
    if (!selectedSlot) {
      alert('Por favor selecciona un horario disponible.');
      return;
    }
    onConfirm({
      date: selectedDate,
      timeSlot: selectedSlot,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 space-y-6 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#001E50] font-black text-base">
            <CalendarIcon className="w-5 h-5 text-[#00509E]" />
            <span>Selecciona tu Fecha y Horario de Visita</span>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Agenda en Tiempo Real
          </span>
        </div>

        {/* ======================================================== */}
        {/* 1. CALENDARIO VISUAL COMPLETO DEL MES                    */}
        {/* ======================================================== */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3 sm:p-5 space-y-3">
          {/* Navegación del Mes */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Mes Seleccionado</span>
              <h3 className="text-base sm:text-lg font-black text-[#001E50]">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Mes Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Siguiente Mes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días de la semana (Dom, Lun, Mar, Mié, Jue, Vie, Sáb) */}
          <div className="grid grid-cols-7 gap-1 text-center font-black text-xs text-slate-600 py-1">
            {DAY_NAMES.map((name, idx) => (
              <div key={name} className={idx === 0 || idx === 6 ? 'text-[#00509E] font-black' : ''}>
                {name} {idx === 0 || idx === 6 ? '★' : ''}
              </div>
            ))}
          </div>

          {/* Cuadrícula de Celdas del Calendario (Móvil perfecto sin texto encimado) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div
                    key={'empty-' + idx}
                    className="min-h-[52px] sm:min-h-[68px] rounded-2xl bg-slate-100/30 border border-transparent"
                  />
                );
              }

              const isSelected = cell.dateString === selectedDate;
              const isBlocked = scheduleSettings.blockedDates.includes(cell.dateString);
              const dayConfig = scheduleSettings.workingDays.find((d) => d.dayOfWeek === cell.dayOfWeek);
              const isDayActive = dayConfig ? dayConfig.enabled && !isBlocked : !isBlocked;

              // Compare with today to disable past days
              const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
              const isPast = cell.dateString < todayStr;

              // Appointments on this day
              const bookedOnDay = appointments.filter(
                (a) => a.scheduledDate === cell.dateString && a.status !== 'cancelada'
              );

              const isClickable = isDayActive && !isPast;
              const totalSlots = activeSlots.length;
              const freeSlots = Math.max(0, totalSlots - bookedOnDay.length);

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => setSelectedDate(cell.dateString)}
                  className={`min-h-[52px] sm:min-h-[68px] p-1 sm:p-2 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/90 border-2 border-[#001E50] ring-2 ring-[#001E50]/20 shadow-md z-10'
                      : isBlocked
                      ? 'bg-rose-50/50 border-rose-200 text-rose-400 cursor-not-allowed opacity-80'
                      : !isDayActive
                      ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : isPast
                      ? 'bg-slate-100/40 border-slate-200 text-slate-300 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-2xs hover:bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-black font-mono leading-none ${
                        isSelected
                          ? 'text-[#001E50]'
                          : isBlocked
                          ? 'text-rose-700'
                          : !isClickable
                          ? 'text-slate-400'
                          : cell.dayOfWeek === 0 || cell.dayOfWeek === 6
                          ? 'text-[#00509E]'
                          : 'text-slate-900'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Indicador de Punto de Color */}
                    {isBlocked ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Bloqueado" />
                    ) : !isDayActive ? (
                      <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Cerrado" />
                    ) : isPast ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                    ) : bookedOnDay.length > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Con citas" />
                    ) : freeSlots > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Disponible" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Lleno" />
                    )}
                  </div>

                  {/* Sub-etiqueta de Estado Limpia y Responsiva */}
                  <div className="w-full text-left truncate leading-tight">
                    {isBlocked ? (
                      <span className="text-[8px] sm:text-[10px] text-rose-600 font-bold block truncate">
                        Bloqueado
                      </span>
                    ) : !isDayActive ? (
                      <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium block truncate">
                        Cerrado
                      </span>
                    ) : isPast ? (
                      <span className="text-[8px] block opacity-0">—</span>
                    ) : freeSlots === 0 ? (
                      <span className="text-[8px] sm:text-[10px] text-amber-700 font-bold block truncate">
                        Lleno
                      </span>
                    ) : (
                      <span className="text-[8px] sm:text-[10px] text-emerald-700 font-bold block truncate">
                        <span className="sm:hidden">{freeSlots} disp</span>
                        <span className="hidden sm:inline">{freeSlots} {freeSlots === 1 ? 'turno' : 'turnos'}</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Leyenda de Días */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-600 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Bloqueado / Festivo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>No Laborable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Citas Agendadas</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. HORARIOS DE ATENCIÓN (CON DETECCIÓN DE OCUPADO)        */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Horarios de Visita para el{' '}
              <strong className="text-[#001E50] font-black">
                {selectedDayConfig?.name || 'Día'} {selectedDateParts[2]} de {MONTH_NAMES[selectedDateParts[1] - 1]}
              </strong>:
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Duración: 2 horas en tu cochera
            </span>
          </div>

          {isSelectedDateBlocked ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <Ban className="w-4 h-4 shrink-0 text-rose-600" />
              <span>
                Este día se encuentra bloqueado o fuera de servicio. Por favor selecciona otra fecha habilitada (en verde) del calendario.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeSlots.map((s) => {
                const isBooked = bookedSlotsOnSelectedDate.includes(s.slot);
                const isSelected = selectedSlot === s.slot && !isBooked;

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(s.slot)}
                    className={`p-3.5 rounded-2xl text-xs flex items-center justify-between border-2 transition cursor-pointer ${
                      isBooked
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                        : isSelected
                        ? 'bg-amber-50 border-amber-500 text-[#001E50] font-black shadow-xs ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock
                        className={`w-4 h-4 ${
                          isBooked
                            ? 'text-slate-300'
                            : isSelected
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      />
                      <div className="text-left">
                        <span className="font-mono font-bold text-xs block">
                          {s.slot}
                        </span>
                        <span className="text-[10px] text-slate-500">{s.label}</span>
                      </div>
                    </div>

                    <div>
                      {isBooked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <Lock className="w-3 h-3" />
                          <span>Ocupado</span>
                        </span>
                      ) : isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Seleccionado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Disponible
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* BOTONES DE ACCIÓN: REGRESAR / CONFIRMAR                   */}
        {/* ======================================================== */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-1/3 py-4 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Atrás</span>
          </button>

          <button
            type="submit"
            disabled={isSelectedDateBlocked || !selectedSlot}
            className={`w-2/3 py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
              isSelectedDateBlocked || !selectedSlot
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] shadow-blue-900/20 active:scale-[0.99]'
            }`}
          >
            <span>Confirmar Cita & Generar Folio</span>
            <ArrowRight className="w-4 h-4 text-[#FFC72C]" />
          </button>
        </div>
      </div>
    </form>
  );
}
