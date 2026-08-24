'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Ban,
  Plus,
  Trash2,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function AdminScheduleCalendar() {
  const {
    scheduleSettings,
    toggleWorkingDay,
    toggleSlotActive,
    addScheduleSlot,
    removeScheduleSlot,
    toggleBlockedDate,
    appointments,
  } = useApp();

  // Calendar navigation state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed: 7 = Agosto

  // Selected date in format YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState('2026-08-25');

  // New slot form state
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotLabel, setNewSlotLabel] = useState('');

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

  // Calendar grid calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create array of days for grid
  const calendarCells = [];
  // Empty padding cells before start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  // Days of month
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

  // Selected date details
  const selectedDateParts = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(selectedDateParts[0], selectedDateParts[1] - 1, selectedDateParts[2]);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const selectedDayConfig = scheduleSettings.workingDays.find((d) => d.dayOfWeek === selectedDayOfWeek);
  const isSelectedDateBlocked = scheduleSettings.blockedDates.includes(selectedDate);
  const isDayEnabled = selectedDayConfig ? selectedDayConfig.enabled && !isSelectedDateBlocked : !isSelectedDateBlocked;

  // Appointments on selected date
  const appointmentsOnSelectedDate = appointments.filter((a) => a.scheduledDate === selectedDate);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) {
      alert('Ingresa el rango de horario (ej. 07:30 - 09:30)');
      return;
    }
    addScheduleSlot(newSlotTime.trim(), newSlotLabel.trim() || 'Turno Adicional');
    setNewSlotTime('');
    setNewSlotLabel('');
  };

  return (
    <div className="space-y-6">
      {/* Contenedor Principal en 2 Columnas (Calendario visual a la izquierda + Panel de Horarios a la derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ======================================================== */}
        {/* 1. CALENDARIO VISUAL INTERACTIVO (7 COLUMNAS)             */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          {/* Header del Calendario con Navegación de Mes */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#001E50] text-[#FFC72C] flex items-center justify-center font-black shadow-xs">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#001E50]">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <p className="text-xs text-slate-500">
                  Haz clic en cualquier día para activar/bloquear y configurar sus horarios
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition cursor-pointer"
                title="Mes Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition cursor-pointer"
                title="Siguiente Mes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días de la Semana */}
          <div className="grid grid-cols-7 gap-1 text-center font-black text-xs text-slate-600 py-1">
            {DAY_NAMES.map((name, i) => (
              <div key={name} className={i === 0 || i === 6 ? 'text-[#00509E] font-black' : ''}>
                {name} {i === 0 || i === 6 ? '★' : ''}
              </div>
            ))}
          </div>

          {/* Cuadrícula de Celdas del Calendario */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div
                    key={'empty-' + idx}
                    className="min-h-[64px] sm:min-h-[76px] rounded-2xl bg-slate-50/50 border border-transparent"
                  />
                );
              }

              const isSelected = cell.dateString === selectedDate;
              const isBlocked = scheduleSettings.blockedDates.includes(cell.dateString);
              const dayConfig = scheduleSettings.workingDays.find((d) => d.dayOfWeek === cell.dayOfWeek);
              const isDayActive = dayConfig ? dayConfig.enabled && !isBlocked : !isBlocked;

              // Count booked appointments on this day
              const bookedOnDay = appointments.filter((a) => a.scheduledDate === cell.dateString);

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateString)}
                  className={`min-h-[60px] sm:min-h-[70px] p-2 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs z-10'
                      : isBlocked
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : !isDayActive
                      ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected
                          ? 'text-white'
                          : cell.dayOfWeek === 0 || cell.dayOfWeek === 6
                          ? 'text-slate-900 font-black'
                          : 'text-slate-700'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {isBlocked ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Fecha Bloqueada" />
                    ) : isDayActive ? (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-emerald-600'} shrink-0`} title="Día Abierto" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Día Cerrado" />
                    )}
                  </div>

                  {/* Badges de Estado / Citas */}
                  <div className="w-full space-y-0.5">
                    {bookedOnDay.length > 0 ? (
                      <span className={`block text-[9px] font-bold px-1.5 py-0.2 rounded font-mono truncate ${
                        isSelected ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {bookedOnDay.length} cita{bookedOnDay.length > 1 ? 's' : ''}
                      </span>
                    ) : isBlocked ? (
                      <span className="block text-[9px] font-bold text-rose-600 truncate">
                        Bloqueado
                      </span>
                    ) : isDayActive ? (
                      <span className={`block text-[9px] font-medium truncate ${
                        isSelected ? 'text-slate-300' : 'text-emerald-700'
                      }`}>
                        {scheduleSettings.slots.filter((s) => s.active).length} turnos
                      </span>
                    ) : (
                      <span className="block text-[9px] font-medium text-slate-400 truncate">
                        Cerrado
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guía de Simbología del Calendario */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Bloqueado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>No Laborable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-mono text-[9px] font-bold">1 cita</span>
              <span>Agendadas</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. PANEL DE CONFIGURACIÓN DEL DÍA SELECCIONADO (5 COLS)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Header del Día Seleccionado */}
          <div className="border-b border-slate-100 pb-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Configuración del Día Seleccionado:
              </span>
              <span className="text-xs font-mono font-bold text-[#00509E] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {selectedDate}
              </span>
            </div>

            <h4 className="text-xl font-black text-[#001E50]">
              {selectedDayConfig?.name || 'Día'} {selectedDateParts[2]} de {MONTH_NAMES[selectedDateParts[1] - 1]}
            </h4>

            {/* Toggle de Bloqueo o Disponibilidad para este día específico */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleBlockedDate(selectedDate)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                  isSelectedDateBlocked
                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isSelectedDateBlocked ? (
                  <>
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Día Bloqueado (Clic para Habilitar)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Día Abierto para Citas (Clic para Bloquear)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Citas Programadas en este Día */}
          {appointmentsOnSelectedDate.length > 0 && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 space-y-2 text-xs">
              <span className="font-bold text-[#001E50] block">
                🚗 Citas Programadas en esta fecha ({appointmentsOnSelectedDate.length}):
              </span>
              <div className="space-y-1.5">
                {appointmentsOnSelectedDate.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-slate-900">{apt.vehicle.brand} {apt.vehicle.model}</strong>
                      <span className="text-slate-500 block text-[11px]">{apt.client.name} • {apt.timeSlot}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-50 text-[#00509E] rounded-md">
                      {apt.folio}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Horarios Activos y Disponibles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#001E50] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00509E]" />
                <span>Horarios de Atención Disponibles:</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                {scheduleSettings.slots.filter((s) => s.active).length} activos
              </span>
            </div>

            <div className="space-y-2">
              {scheduleSettings.slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition ${
                    slot.active
                      ? 'bg-white border-slate-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00509E]" />
                      <span className="font-mono font-bold text-xs text-slate-900">{slot.slot}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{slot.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleSlotActive(slot.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        slot.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {slot.active ? 'Disponible' : 'Pausado'}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeScheduleSlot(slot.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Eliminar horario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario para Agregar Nuevo Horario */}
          <form
            onSubmit={handleCreateSlot}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
          >
            <span className="text-xs font-bold text-[#001E50] block">
              + Agregar Nuevo Horario de Servicio:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 font-bold mb-1">
                  Horario (ej. 07:30 - 09:30):
                </label>
                <input
                  type="text"
                  required
                  placeholder="07:30 - 09:30"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-[#00509E]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-bold mb-1">
                  Etiqueta:
                </label>
                <input
                  type="text"
                  placeholder="Turno Matutino Extra"
                  value={newSlotLabel}
                  onChange={(e) => setNewSlotLabel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#00509E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span>Guardar Horario en la Agenda</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
