'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import TechnicalReportModal from '@/components/TechnicalReportModal';
import {
  ShieldAlert,
  Inbox,
  Calendar,
  Sparkles,
  Send,
  CheckCircle2,
  Search,
  FileText,
  Clock,
  Sliders,
  Filter,
  MessageSquare,
  Wrench,
  DollarSign,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  User,
  Car,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Plus,
  KeyRound,
  Users,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import AdminRemisionQuoter from '@/components/AdminRemisionQuoter';
import AdminScheduleCalendar from '@/components/AdminScheduleCalendar';
import AdminAccounting from '@/components/AdminAccounting';
import AdminApproveQuoteModal from '@/components/AdminApproveQuoteModal';
import AdminDirectServiceModal from '@/components/AdminDirectServiceModal';
import AdminSecurityStaff from '@/components/AdminSecurityStaff';
import { getWhatsAppQuoteLink } from '@/lib/whatsapp';
import { formatDisplayDate } from '@/lib/dateUtils';
import { Appointment } from '@/types';
import Link from 'next/link';

type AdminTab = 'cotizaciones' | 'agenda' | 'horarios' | 'contabilidad' | 'fidelizacion' | 'seguridad';
type QuoteStatusFilterType =
  | 'all'
  | 'pendientes'
  | 'enviadas'
  | 'aprobadas'
  | 'confirmadas'
  | 'programadas'
  | 'reagendadas';

export default function AdminDashboardPage() {
  const {
    appointments,
    submitDualQuote,
    acceptQuoteAndBook,
    addNotification,
    scheduleSettings,
    securitySettings,
    deleteAppointment,
    clearAllAppointments,
  } = useApp();

  const activeAdmin =
    securitySettings?.staffMembers?.find((m) => m.role === 'admin' && m.status === 'active') ||
    securitySettings?.staffMembers?.[0] || {
      id: 'staff-admin-default',
      name: 'Luis Carlos Carranza',
      phone: '3334884592',
      role: 'admin',
      status: 'active',
    };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  };

  const [activeTab, setActiveTab] = useState<AdminTab>('cotizaciones');
  const [quoteFilter, setQuoteFilter] = useState<QuoteStatusFilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointmentForReport, setSelectedAppointmentForReport] = useState<Appointment | null>(null);
  const [selectedAptForApproval, setSelectedAptForApproval] = useState<Appointment | null>(null);
  const [activeQuotingAptId, setActiveQuotingAptId] = useState<string | null>(null);
  const [showDirectServiceModal, setShowDirectServiceModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counts by status
  const pendingQuotes = appointments.filter((a) => a.status === 'solicitud_pendiente');
  const sentQuotes = appointments.filter((a) => a.status === 'cotizado' && !a.selectedOption);
  const approvedQuotes = appointments.filter(
    (a) =>
      (a.status === 'aprobada_por_cliente' || (a.status === 'cotizado' && a.selectedOption)) &&
      a.status !== 'confirmada' &&
      a.status !== 'en_camino' &&
      a.status !== 'en_servicio' &&
      a.status !== 'completada'
  );
  const confirmedQuotes = appointments.filter((a) => a.status === 'confirmada');
  const inProgressQuotes = appointments.filter((a) => a.status === 'en_camino' || a.status === 'en_servicio');
  const rebookedQuotes = appointments.filter((a) => a.status === 'completada' || a.followUpStatus === 'rebooked');
  const activeBookings = appointments.filter((a) => a.status !== 'solicitud_pendiente');
  const followUpCandidates = appointments.filter(
    (a) => a.status === 'completada' || a.nextFollowUpDate || a.followUpStatus
  );

  // Financial summary
  const totalRevenue = appointments
    .filter((a) => a.status === 'completada' || a.paymentStatus === 'paid')
    .reduce((acc, curr) => {
      const price =
        curr.selectedOption === 'agencia'
          ? curr.quote?.agency.price || 3850
          : curr.quote?.premium.price || 4450;
      return acc + price;
    }, 0);

  // Filtered quotes list
  const filteredQuotes = appointments.filter((apt) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      apt.client.name.toLowerCase().includes(query) ||
      apt.vehicle.plates.toLowerCase().includes(query) ||
      apt.vehicle.vin.toLowerCase().includes(query) ||
      apt.folio.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (quoteFilter === 'pendientes') return apt.status === 'solicitud_pendiente';
    if (quoteFilter === 'enviadas') return apt.status === 'cotizado' && !apt.selectedOption;
    if (quoteFilter === 'aprobadas')
      return (
        (apt.status === 'aprobada_por_cliente' || (apt.status === 'cotizado' && !!apt.selectedOption)) &&
        apt.status !== 'confirmada' &&
        apt.status !== 'en_camino' &&
        apt.status !== 'en_servicio' &&
        apt.status !== 'completada'
      );
    if (quoteFilter === 'confirmadas') return apt.status === 'confirmada';
    if (quoteFilter === 'programadas') return apt.status === 'en_camino' || apt.status === 'en_servicio';
    if (quoteFilter === 'reagendadas') return apt.status === 'completada' || apt.followUpStatus === 'rebooked';

    return true;
  });

  const handleManualTriggerFollowup = (apt: Appointment) => {
    addNotification({
      appointmentId: apt.id,
      channel: 'email',
      type: 'followup_5month',
      recipient: apt.client.email,
      title: `🔔 Aviso Preventivo: Tu ${apt.vehicle.brand} ${apt.vehicle.model} está próximo al ciclo de afinación`,
      message: `Hola ${apt.client.name}! Han transcurrido 5 meses desde tu último servicio de afinación. Agenda tu mantenimiento preventivo a domicilio para conservar tu garantía.`,
    });
    alert(`Recordatorio preventivo enviado a ${apt.client.name}.`);
  };

  const navItems = [
    {
      id: 'cotizaciones',
      label: 'Cotizaciones & Remisiones',
      icon: Inbox,
      badge: pendingQuotes.length > 0 ? `${pendingQuotes.length}` : null,
      badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
    },
    {
      id: 'agenda',
      label: 'Agenda de Servicios',
      icon: Calendar,
      badge: `${activeBookings.length}`,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'horarios',
      label: 'Disponibilidad & Horarios',
      icon: Clock,
      badge: `${scheduleSettings.slots.filter((s) => s.active).length}`,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'contabilidad',
      label: 'Contabilidad & Pagos',
      icon: DollarSign,
      badge: `$${totalRevenue.toLocaleString()}`,
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'fidelizacion',
      label: 'Fidelización Preventiva',
      icon: Sparkles,
      badge: `${followUpCandidates.length}`,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'seguridad',
      label: 'Usuarios & Seguridad',
      icon: KeyRound,
      badge: null,
      badgeColor: '',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* ======================================================== */}
      {/* BARRA LATERAL IZQUIERDA (PREMIUM LUXURY OBSIDIAN NAVY)   */}
      {/* ======================================================== */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#08101E] text-slate-200 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 shadow-2xl lg:shadow-none`}
      >
        <div className="space-y-7">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/10 shrink-0">
                <ShieldAlert className="w-5 h-5 text-[#08101E]" />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight text-white block">
                  Afinación de Autor
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
                  Executive Suite
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 block mb-2 font-mono">
              Gestión Operativa
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-white font-bold border border-slate-700 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Accesos Directos */}
          <div className="pt-4 border-t border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 block mb-1 font-mono">
              Vistas Rápidas
            </span>

            <Link
              href="/tecnico"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>Consola Técnico Móvil</span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-slate-600" />
            </Link>

            <Link
              href="/"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>Portal Público de Cotización</span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-slate-600" />
            </Link>
          </div>
        </div>

        {/* User Profile Footer (Dinámico con los usuarios reales del sistema) */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs font-mono shrink-0">
              {getInitials(activeAdmin.name)}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block truncate">{activeAdmin.name}</span>
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                {activeAdmin.role === 'admin' ? 'Administrador Principal' : 'Técnico Especialista'}
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Servidor Activo" />
        </div>
      </aside>

      {/* ======================================================== */}
      {/* ÁREA DE CONTENIDO PRINCIPAL (CLEAN LUXURY THEME)          */}
      {/* ======================================================== */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col pb-24">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
              title="Abrir menú"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-slate-500 font-mono hidden sm:block">
                Afinaciones de Autor • Sistema Centralizado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowDirectServiceModal(true)}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition cursor-pointer active:scale-95 shrink-0"
            >
              <span>+ Realizar Cotización</span>
            </button>

            {appointments.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearAllModal(true)}
                className="hidden sm:flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition cursor-pointer"
                title="Vaciar todas las citas y registros de prueba"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Vaciar Citas</span>
              </button>
            )}

            {pendingQuotes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('cotizaciones');
                  setQuoteFilter('pendientes');
                }}
                className="hidden sm:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-200 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{pendingQuotes.length} pendientes</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sincronizado</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* ======================================================== */}
          {/* 1. BANDEJA DE COTIZACIONES                               */}
          {/* ======================================================== */}
          {activeTab === 'cotizaciones' && (
            <div className="space-y-6">
              {/* Remisión Editor si está activo (Oculta la lista inferior para evitar confusiones) */}
              {activeQuotingAptId ? (
                <div className="scroll-mt-6" id="quoter-section">
                  {(() => {
                    const quotingApt = appointments.find((a) => a.id === activeQuotingAptId);
                    if (!quotingApt) return null;
                    return (
                      <AdminRemisionQuoter
                        appointment={quotingApt}
                        onSaveAndSend={(dualQuote) => {
                          submitDualQuote(quotingApt.id, dualQuote);
                          setActiveQuotingAptId(null);
                        }}
                        onCancel={() => setActiveQuotingAptId(null)}
                      />
                    );
                  })()}
                </div>
              ) : (
                <>
                  {/* Barra de Filtros y Búsqueda Limpia y Directa */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs">
                    {/* Pastillas de Estado */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuoteFilter('all')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          quoteFilter === 'all'
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        Todas ({appointments.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteFilter('pendientes')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          quoteFilter === 'pendientes'
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-amber-50/50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Por Cotizar ({pendingQuotes.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteFilter('enviadas')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          quoteFilter === 'enviadas'
                            ? 'bg-blue-100 text-blue-950 border border-blue-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Enviadas ({sentQuotes.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteFilter('aprobadas')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          quoteFilter === 'aprobadas'
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-amber-50/50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Aprobadas ({approvedQuotes.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteFilter('confirmadas')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          quoteFilter === 'confirmadas'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Confirmadas ({confirmedQuotes.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteFilter('programadas')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          quoteFilter === 'programadas'
                            ? 'bg-slate-800 text-white font-bold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>En Sitio ({inProgressQuotes.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteFilter('reagendadas')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          quoteFilter === 'reagendadas'
                            ? 'bg-slate-800 text-white font-bold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Finalizadas ({rebookedQuotes.length})</span>
                      </button>
                    </div>

                    {/* Buscador */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar placa o folio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400 transition"
                      />
                    </div>
                  </div>

                  {/* Lista de Cotizaciones en Cascada Vertical con Margen y Padding Generoso */}
                  <div className="space-y-4">
                    {filteredQuotes.length === 0 ? (
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-10 sm:p-12 text-center text-slate-500 space-y-3.5 shadow-2xs">
                        <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900">
                            No hay cotizaciones con este filtro
                          </h3>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Puedes registrar una nueva cotización o agendar directamente un servicio que te hayan solicitado por llamada o WhatsApp.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowDirectServiceModal(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                        >
                          <Plus className="w-4 h-4 text-amber-400" />
                          <span>+ Realizar Cotización / Nuevo Servicio Directo</span>
                        </button>
                      </div>
                    ) : (
                      filteredQuotes.map((apt) => {
                        const isPending = apt.status === 'solicitud_pendiente';
                        const isSent = apt.status === 'cotizado' && !apt.selectedOption;
                        const isClientApproved =
                          apt.status === 'aprobada_por_cliente' || (apt.status === 'cotizado' && !!apt.selectedOption);
                        const isConfirmed = apt.status === 'confirmada';
                        const isInProgress = apt.status === 'en_camino' || apt.status === 'en_servicio';
                        const isCompleted = apt.status === 'completada';

                        return (
                          <div
                            key={apt.id}
                            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5 transition"
                          >
                            {/* Header de la tarjeta con margen balanceado */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-200">
                                  {apt.folio}
                                </span>

                                {isPending && (
                                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                                    Pendiente de Enviar
                                  </span>
                                )}
                                {isSent && (
                                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                                    Enviada al Cliente
                                  </span>
                                )}
                                {isClientApproved && (
                                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold">
                                    Aprobada por Cliente
                                  </span>
                                )}
                                {isConfirmed && (
                                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                    <span>Cita Confirmada</span>
                                  </span>
                                )}
                                {isInProgress && (
                                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                                    En Proceso / En Sitio
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                                    Finalizada / Con Garantía
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedAptForApproval(apt)}
                                className="text-xs bg-[#08101E] hover:bg-slate-800 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5 transition cursor-pointer group shadow-xs"
                                title="Clic para modificar fecha, horario o confirmar cita"
                              >
                                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="text-white/80">Fecha:</span>
                                <strong className="text-white">
                                  {formatDisplayDate(apt.scheduledDate)}
                                </strong>
                                <span className="text-amber-400/50">|</span>
                                <strong className="text-amber-300">
                                  {apt.timeSlot}
                                </strong>
                                <span className="text-[10px] text-amber-400/80 bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-500/30 ml-1">✏️ Editar</span>
                              </button>
                            </div>

                            {/* Datos del Cliente y Vehículo con padding y márgenes limpios */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs py-1">
                              <div className="space-y-1">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Cliente & Contacto:</span>
                                <strong className="text-slate-900 text-sm block">{apt.client.name}</strong>
                                <span className="text-slate-600 block">{apt.client.phone}</span>
                                <span className="text-slate-500 block">{apt.client.email}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Vehículo Registrado:</span>
                                <strong className="text-slate-900 text-sm block">
                                  {apt.vehicle.brand} {apt.vehicle.model} ({apt.vehicle.year})
                                </strong>
                                <span className="font-mono text-slate-600 block">Placas: {apt.vehicle.plates}</span>
                                <span className="font-mono text-slate-700 block text-[11px]">VIN: {apt.vehicle.vin}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Ubicación de Visita:</span>
                                <p className="text-slate-800 font-medium leading-relaxed">{apt.client.address}</p>
                                {apt.client.referenceNotes && (
                                  <p className="text-slate-500 italic text-[11px] mt-1">
                                    Ref: {apt.client.referenceNotes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Botones de Acción de Cotización con margen superior */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                              <div>
                                {apt.quote && (
                                  <div className="flex items-center gap-3 text-xs font-mono">
                                    <span>Agencia OEM: <strong className="text-slate-900 font-bold">${apt.quote.agency.price.toLocaleString()}</strong></span>
                                    <span className="text-slate-300">|</span>
                                    <span>De Autor: <strong className="text-slate-900 font-bold">${apt.quote.premium.price.toLocaleString()}</strong></span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5">
                                {/* Botón Confirmar Cotización / Cita Oficial */}
                                {apt.quote && (isPending || isSent || isClientApproved) && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedAptForApproval(apt)}
                                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer active:scale-95"
                                    title="Confirmar cita, asignar técnico y notificar al cliente"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                                    <span>{isClientApproved ? 'Confirmar Cita & Notificar' : 'Confirmar / Aprobar Cita'}</span>
                                  </button>
                                )}

                                {/* Si ya está Confirmada, botón para reprogramar o re-notificar */}
                                {isConfirmed && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedAptForApproval(apt)}
                                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer active:scale-95"
                                    title="Modificar fecha, cambiar técnico o re-notificar al cliente"
                                  >
                                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Reprogramar / Re-notificar</span>
                                  </button>
                                )}

                                {/* Botón WhatsApp */}
                                {apt.quote && (
                                  <a
                                    href={getWhatsAppQuoteLink(apt)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer active:scale-95"
                                    title="Enviar cotización por WhatsApp"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Enviar por WhatsApp</span>
                                  </a>
                                )}

                                {/* Botón Abrir / Editar Remisión */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveQuotingAptId(apt.id);
                                    setTimeout(() => {
                                      document.getElementById('quoter-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 50);
                                  }}
                                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                                    isPending
                                      ? 'bg-[#08101E] hover:bg-slate-800 text-white shadow-2xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                  }`}
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{isPending ? 'Elaborar Cotización' : 'Modificar Cotización'}</span>
                                </button>

                                {/* Reporte si está completada */}
                                {apt.status === 'completada' && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedAppointmentForReport(apt)}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-slate-300" />
                                    <span>Reporte PDF</span>
                                  </button>
                                )}

                                {/* Botón Eliminar Servicio con Confirmación */}
                                <button
                                  type="button"
                                  onClick={() => setAppointmentToDelete(apt)}
                                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition cursor-pointer"
                                  title="Eliminar este servicio permanentemente"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. AGENDA & CITAS ACTIVAS                                */}
          {/* ======================================================== */}
          {activeTab === 'agenda' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Agenda de Citas & Servicios en Ruta
                  </h2>
                  <p className="text-xs text-slate-500">
                    Servicios confirmados y estado de atención en tiempo real.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                  {activeBookings.length} en agenda
                </span>
              </div>

              <div className="space-y-3">
                {activeBookings.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-500 space-y-3 shadow-2xs">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">
                        No hay servicios programados en la agenda
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Cuando apruebes una cotización o registres una cita directa, aparecerá aquí en el orden cronológico de atención.
                      </p>
                    </div>
                  </div>
                ) : (
                  activeBookings.map((apt) => (
                    <div key={apt.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-300 bg-[#08101E] px-3 py-1 rounded-xl border border-amber-400/40 inline-flex items-center gap-1.5 shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-white">{formatDisplayDate(apt.scheduledDate)}</span>
                            <span className="text-amber-400/50">|</span>
                            <span>{apt.timeSlot}</span>
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1.5">
                            {apt.vehicle.brand} {apt.vehicle.model} ({apt.vehicle.year})
                          </h3>
                          <p className="text-xs text-slate-600">Cliente: <strong className="text-slate-900">{apt.client.name}</strong> • Tel: {apt.client.phone}</p>
                        </div>
                        <span className="font-mono text-xs text-slate-400">{apt.folio}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 border border-slate-100 flex items-center justify-between gap-3">
                        <p><strong>Dirección:</strong> {apt.client.address}</p>
                        <button
                          type="button"
                          onClick={() => setAppointmentToDelete(apt)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition cursor-pointer shrink-0"
                          title="Eliminar este servicio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. HORARIOS & DÍAS DISPONIBLES                           */}
          {/* ======================================================== */}
          {activeTab === 'horarios' && (
            <AdminScheduleCalendar />
          )}

          {/* ======================================================== */}
          {/* 4. CONTABILIDAD & PAGOS                                   */}
          {/* ======================================================== */}
          {activeTab === 'contabilidad' && (
            <AdminAccounting />
          )}

          {/* ======================================================== */}
          {/* 5. FIDELIZACIÓN PREVENTIVA (6 MESES)                     */}
          {/* ======================================================== */}
          {activeTab === 'fidelizacion' && (
            <div className="space-y-4">
              <div className="bg-[#08101E] text-white p-6 rounded-2xl shadow-sm space-y-1.5 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <h2 className="text-sm font-bold tracking-tight">Campañas de Retención & Mantenimiento Preventivo</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Recordatorios al mes 5 del último servicio para garantizar reincidencia del cliente.
                </p>
              </div>

              <div className="space-y-3">
                {followUpCandidates.map((apt) => (
                  <div key={apt.id} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                        Próximo Ciclo Recomendado: {apt.nextFollowUpDate || '2026-10-15'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {apt.vehicle.brand} {apt.vehicle.model} ({apt.vehicle.plates})
                      </h3>
                      <p className="text-xs text-slate-500">Cliente: <strong className="text-slate-800">{apt.client.name}</strong> • {apt.client.phone}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleManualTriggerFollowup(apt)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Enviar Recordatorio</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. USUARIOS & SEGURIDAD (PINS & EQUIPO)                  */}
          {/* ======================================================== */}
          {activeTab === 'seguridad' && (
            <AdminSecurityStaff />
          )}
        </div>
      </main>

      {/* Modal Reporte Técnico */}
      {selectedAppointmentForReport && (
        <TechnicalReportModal
          appointment={selectedAppointmentForReport}
          isOpen={!!selectedAppointmentForReport}
          onClose={() => setSelectedAppointmentForReport(null)}
        />
      )}

      {/* Modal Aprobar Cotización & Confirmar Cita */}
      {selectedAptForApproval && (
        <AdminApproveQuoteModal
          appointment={selectedAptForApproval}
          isOpen={!!selectedAptForApproval}
          onClose={() => setSelectedAptForApproval(null)}
          onApprove={(data) => {
            acceptQuoteAndBook(
              selectedAptForApproval.id,
              data.selectedOption,
              data.date,
              data.timeSlot,
              data.paymentMethod,
              data.technicianName,
              data.technicianPhone
            );
            setSelectedAptForApproval(null);
            setQuoteFilter('confirmadas');
          }}
        />
      )}

      {/* Modal Realizar Cotización / Nuevo Servicio Directo */}
      {showDirectServiceModal && (
        <AdminDirectServiceModal
          isOpen={showDirectServiceModal}
          onClose={() => setShowDirectServiceModal(false)}
          onSuccess={() => {
            setActiveTab('cotizaciones');
          }}
        />
      )}

      {/* Modal de Confirmación para Eliminar Cita Individual */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">¿Eliminar este servicio?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estás por eliminar permanentemente el servicio <strong>{appointmentToDelete.folio}</strong> ({appointmentToDelete.vehicle.brand} {appointmentToDelete.vehicle.model}) de <strong>{appointmentToDelete.client.name}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteAppointment(appointmentToDelete.id);
                  setIsDeleting(false);
                  setAppointmentToDelete(null);
                }}
                className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Vaciar Toda la Base de Datos */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">¿Vaciar todas las citas?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se eliminarán todos los registros de citas, cotizaciones y notificaciones para dejar el sistema 100% limpio en cero (0).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await clearAllAppointments();
                  setIsDeleting(false);
                  setShowClearAllModal(false);
                }}
                className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Vaciando...' : 'Sí, Vaciar Base'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
