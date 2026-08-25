'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import EvidenceManager from '@/components/EvidenceManager';
import SignaturePad from '@/components/SignaturePad';
import TechnicalReportModal from '@/components/TechnicalReportModal';
import VehicleManualModal from '@/components/VehicleManualModal';
import {
  Wrench,
  BookOpen,
  Navigation,
  CheckCircle2,
  Clock,
  Car,
  FileCheck,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  Square,
  MapPin,
  Camera,
  RotateCcw,
  Check,
  Phone,
  Gauge,
  Sparkles,
  Calendar,
  Layers,
  User,
  Users,
  UserCheck,
  LogOut,
  ArrowRight,
  MessageSquare,
  Menu,
  X,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  CreditCard,
  Banknote,
  DollarSign,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { Appointment, EvidencePhoto, InstalledPart, ServiceRecord } from '@/types';
import {
  getWhatsAppEnRouteLink,
  getWhatsAppCompletedLink,
  getWhatsAppWorkFinishedReadyForReviewLink,
} from '@/lib/whatsapp';
import { getLocalDateString, formatDisplayDate } from '@/lib/dateUtils';
import Link from 'next/link';

type TechnicianTab = 'ruta' | 'agendados' | 'realizados' | 'manual';

export default function TechnicianPage() {
  const { appointments, updateAppointmentStatus, saveServiceRecord, finalizeService, securitySettings } = useApp();

  const activeTechs = (securitySettings?.staffMembers || []).filter(
    (m) => m.role === 'technician' && m.status === 'active'
  );

  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [isSelectingTech, setIsSelectingTech] = useState(false);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);
  const [isHandoverStep, setIsHandoverStep] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<Appointment['paymentMethod']>('on_site_card');

  useEffect(() => {
    if (activeTechs.length > 0 && !selectedTechId) {
      setSelectedTechId(activeTechs[0].id);
    }
    setIsLoadedFromStorage(true);
  }, [activeTechs, selectedTechId]);

  const currentTech =
    activeTechs.find((t) => t.id === selectedTechId) ||
    activeTechs[0] || {
      id: 'default-tech',
      name: 'Carlos Carranza',
      phone: '3334884592',
      role: 'technician' as const,
      status: 'active' as const,
    };

  const [activeTab, setActiveTab] = useState<TechnicianTab>('ruta');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isExecutingAptId, setIsExecutingAptId] = useState<string | null>(null);
  const [routeFilter, setRouteFilter] = useState<'today' | 'upcoming' | 'all'>('today');

  // Filtrar citas asignadas para campo
  const activeAppointments = appointments.filter(
    (a) => a.status !== 'solicitud_pendiente' && (a.status !== 'cotizado' || !!a.selectedOption)
  );

  const todayStr = getLocalDateString();

  const todayAppointments = activeAppointments.filter((a) => {
    const aptDate = a.scheduledDate ? a.scheduledDate.slice(0, 10) : todayStr;
    const isToday = aptDate === todayStr;
    const isLive = a.status === 'en_camino' || a.status === 'en_servicio';
    const isPendingPast = aptDate < todayStr && a.status !== 'completada';
    return isToday || isLive || isPendingPast;
  });

  const upcomingAppointments = activeAppointments.filter((a) => {
    const aptDate = a.scheduledDate ? a.scheduledDate.slice(0, 10) : '';
    return aptDate > todayStr && a.status !== 'en_camino' && a.status !== 'en_servicio';
  });

  const displayedRouteAppointments =
    routeFilter === 'today'
      ? todayAppointments
      : routeFilter === 'upcoming'
      ? upcomingAppointments
      : activeAppointments;

  const scheduledServices = activeAppointments.filter(
    (a) => a.status === 'confirmada' || a.status === 'en_camino'
  );
  const inProgressServices = activeAppointments.filter(
    (a) => a.status === 'en_servicio'
  );
  const completedServices = activeAppointments.filter(
    (a) => a.status === 'completada'
  );

  const selectedAppointmentId = isExecutingAptId || inProgressServices[0]?.id || scheduledServices[0]?.id || activeAppointments[0]?.id || '';

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalApt, setReportModalApt] = useState<Appointment | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [initialKmInput, setInitialKmInput] = useState<string>('');
  const [observationsInput, setObservationsInput] = useState<string>('');
  const [recommendationsInput, setRecommendationsInput] = useState<string>('');
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Live timer for ongoing service (persisted via startedAt)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWorkTimerRunning, setIsWorkTimerRunning] = useState<boolean>(true);

  const currentAppointment =
    appointments.find((a) => a.id === selectedAppointmentId) || activeAppointments[0] || null;

  useEffect(() => {
    if (currentAppointment) {
      setInitialKmInput(String(currentAppointment.vehicle?.currentKm || currentAppointment.serviceRecord?.initialKm || ''));
      setObservationsInput(
        currentAppointment.serviceRecord?.mechanicalObservations ||
          'Servicio de afinación mayor realizado con éxito. Inyectores descarbonizados por ultrasonido, bujías calibradas y escaneo OBD-II sin códigos de falla.'
      );
      setRecommendationsInput(
        currentAppointment.serviceRecord?.futureRecommendations ||
          'Realizar próxima afinación en 10,000 km o 6 meses para conservar la garantía.'
      );
      setSignatureData(currentAppointment.serviceRecord?.clientSignatureUrl || null);

      // Calcular segundos transcurridos reales desde startedAt
      const startedAt = currentAppointment.serviceRecord?.startedAt;
      if (startedAt && currentAppointment.status === 'en_servicio') {
        const startMs = new Date(startedAt).getTime();
        const nowMs = Date.now();
        const diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
        setElapsedSeconds(diff);
      }
    }
  }, [currentAppointment?.id, currentAppointment?.serviceRecord?.startedAt]);

  useEffect(() => {
    let interval: any;
    if (currentAppointment?.status === 'en_servicio' && isWorkTimerRunning) {
      interval = setInterval(() => {
        const startedAt = currentAppointment.serviceRecord?.startedAt;
        if (startedAt) {
          const startMs = new Date(startedAt).getTime();
          const nowMs = Date.now();
          const diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
          setElapsedSeconds(diff);
        } else {
          setElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentAppointment?.status, currentAppointment?.serviceRecord?.startedAt, isWorkTimerRunning]);

  const record = currentAppointment?.serviceRecord;
  const status = currentAppointment?.status;

  const handleStartRoute = (aptId: string) => {
    updateAppointmentStatus(aptId, 'en_camino');
    setIsExecutingAptId(aptId);
  };

  const handleStartRouteAndNotify = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'en_camino');
    setIsExecutingAptId(apt.id);
    const waUrl = getWhatsAppEnRouteLink({ ...apt, status: 'en_camino' });
    window.open(waUrl, '_blank');
  };

  const handleStartService = () => {
    if (!currentAppointment) return;
    const arrivalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Obtener refacciones reales cotizadas para esta cita
    const quoteRemision = currentAppointment.quote?.remisionItems;
    const chosenOption = currentAppointment.selectedOption || 'premium';
    let defaultParts: InstalledPart[] = [];

    if (quoteRemision && quoteRemision.length > 0) {
      defaultParts = quoteRemision.map((it) => ({
        id: it.id,
        name: it.description,
        brand: chosenOption === 'agency' || chosenOption === 'agencia' ? it.agencyBrand : it.premiumBrand,
        installed: true,
      }));
    } else {
      defaultParts = [
        { id: 'p1', name: '4x Bujías Iridio / Platino', brand: 'NGK Laser Iridium', installed: true },
        { id: 'p2', name: 'Aceite 100% Sintético (5L)', brand: 'Motul 8100 X-cess', installed: true },
        { id: 'p3', name: 'Filtro de Aceite Blindado', brand: 'Mann Filter W712', installed: true },
        { id: 'p4', name: 'Filtro de Aire Motor', brand: 'Mann Filter C30005', installed: true },
        { id: 'p5', name: 'Filtro de Cabina Carbón', brand: 'Mann Filter CUK', installed: true },
      ];
    }

    saveServiceRecord(currentAppointment.id, {
      arrivalTime,
      startedAt: new Date().toISOString(),
      initialKm: Number(initialKmInput) || currentAppointment.vehicle?.currentKm || 42350,
      evidencePhotos: record?.evidencePhotos || [],
      installedParts: record?.installedParts && record.installedParts.length > 0 ? record.installedParts : defaultParts,
      mechanicalObservations: observationsInput,
      futureRecommendations: recommendationsInput,
    });
    updateAppointmentStatus(currentAppointment.id, 'en_servicio');
    setIsWorkTimerRunning(true);
  };

  const handleEvidencesChange = (newPhotos: EvidencePhoto[]) => {
    if (!currentAppointment) return;
    saveServiceRecord(currentAppointment.id, {
      evidencePhotos: newPhotos,
    });
  };

  const handlePartToggle = (partId: string) => {
    if (!currentAppointment) return;
    const parts = record?.installedParts || [];
    const updated = parts.map((p) => (p.id === partId ? { ...p, installed: !p.installed } : p));
    saveServiceRecord(currentAppointment.id, { installedParts: updated });
  };

  const handleCompleteMechanicalWork = () => {
    if (!currentAppointment) return;

    saveServiceRecord(currentAppointment.id, {
      mechanicalObservations: observationsInput || record?.mechanicalObservations || 'Servicio de afinación mayor completado satisfactoriamente.',
      futureRecommendations: recommendationsInput || record?.futureRecommendations || 'Próximo servicio en 6 meses o 10,000 KM.',
      initialKm: Number(initialKmInput) || record?.initialKm || currentAppointment.vehicle?.currentKm || 0,
      evidencePhotos: record?.evidencePhotos || [],
      installedParts: record?.installedParts || [],
    });

    setIsWorkTimerRunning(false);
    setIsHandoverStep(true);

    // Enviar WhatsApp al cliente avisándole que el trabajo mecánico terminó y se procederá a la entrega/revisión
    const waUrl = getWhatsAppWorkFinishedReadyForReviewLink(currentAppointment);
    window.open(waUrl, '_blank');
  };

  const handleConfirmHandoverAndPayment = () => {
    if (!currentAppointment) return;

    let signatureToSave = signatureData || record?.clientSignatureUrl;
    if (!signatureToSave) {
      signatureToSave = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120"><rect width="320" height="120" fill="%23F8FAFC" rx="10"/><path d="M 30 70 Q 70 30 110 65 T 190 60 T 270 50" fill="none" stroke="%2308101E" stroke-width="3" stroke-linecap="round"/><text x="30" y="95" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2308101E">${encodeURIComponent(currentAppointment.client?.name || 'Cliente')}</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%23666666">Firma de Satisfacción • Afinaciones de Autor</text></svg>`;
    }

    const methodLabels: Record<string, string> = {
      cash: 'Efectivo',
      on_site_card: 'Tarjeta en Sitio (Clip/TPV)',
      transfer: 'Transferencia Bancaria (SPEI)',
      online_card: 'Tarjeta Online',
    };
    const paymentLabel = methodLabels[paymentMethodSelected || 'on_site_card'] || 'Pago en Sitio';

    const currentRec = currentAppointment.serviceRecord || {
      id: 'rec-' + Date.now(),
      appointmentId: currentAppointment.id,
      evidencePhotos: [],
      installedParts: [],
      mechanicalObservations: '',
      futureRecommendations: '',
      initialKm: Number(initialKmInput) || currentAppointment.vehicle?.currentKm || 0,
    };

    const updatedApt: Appointment = {
      ...currentAppointment,
      status: 'completada' as const,
      paymentMethod: paymentMethodSelected,
      paymentStatus: 'paid' as const,
      serviceRecord: {
        ...currentRec,
        clientSignatureUrl: signatureToSave,
        signedByName: currentAppointment.client?.name || 'Cliente',
        completedAt: new Date().toISOString(),
        mechanicalObservations: observationsInput || record?.mechanicalObservations || 'Servicio de afinación mayor a domicilio completado satisfactoriamente.',
        futureRecommendations: recommendationsInput || record?.futureRecommendations || 'Realizar siguiente servicio en 6 meses o 10,000 KM.',
        initialKm: Number(initialKmInput) || record?.initialKm || currentAppointment.vehicle?.currentKm || 0,
      },
    };

    finalizeService(
      currentAppointment.id,
      {
        clientSignatureUrl: signatureToSave,
        signedByName: currentAppointment.client?.name || 'Cliente',
        completedAt: new Date().toISOString(),
        mechanicalObservations: observationsInput || record?.mechanicalObservations || 'Servicio de afinación mayor a domicilio completado satisfactoriamente.',
        futureRecommendations: recommendationsInput || record?.futureRecommendations || 'Realizar siguiente servicio en 6 meses o 10,000 KM.',
        initialKm: Number(initialKmInput) || record?.initialKm || currentAppointment.vehicle?.currentKm || 0,
      },
      {
        paymentMethod: paymentMethodSelected,
        paymentStatus: 'paid',
      }
    );

    setIsHandoverStep(false);
    setIsWorkTimerRunning(false);
    setIsExecutingAptId(null);
    setActiveTab('realizados');
    setReportModalApt(updatedApt);
    setShowReportModal(true);

    const waCompletedUrl = getWhatsAppCompletedLink(
      updatedApt,
      paymentLabel
    );
    window.open(waCompletedUrl, '_blank');
  };

  const formatTimer = (seconds: number) => {
    const s = typeof seconds === 'number' && !isNaN(seconds) && seconds >= 0 ? seconds : 0;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const navItems = [
    {
      id: 'ruta',
      label: 'Ruta de Hoy (Itinerario)',
      icon: Navigation,
      badge: activeAppointments.length > 0 ? `${activeAppointments.length} paradas` : null,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'agendados',
      label: 'Citas Agendadas',
      icon: Calendar,
      badge: `${scheduledServices.length}`,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'realizados',
      label: 'Servicios Realizados (Historial)',
      icon: CheckCircle2,
      badge: `${completedServices.length}`,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'manual',
      label: 'Manual OEM & Torques',
      icon: BookOpen,
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
                <Wrench className="w-5 h-5 text-[#08101E]" />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight text-white block">
                  Afinación de Autor
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
                  Técnico Master Tech
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 block mb-2 font-mono">
              Operación en Campo
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isExecutingAptId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIsExecutingAptId(null);
                    if (item.id === 'manual') {
                      setShowManualModal(true);
                    } else {
                      setActiveTab(item.id as TechnicianTab);
                    }
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
              Cambio de Perfil
            </span>

            <Link
              href="/admin"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                <span>Panel Administrativo</span>
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

        {/* User Profile Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs font-mono">
              {currentTech?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'CC'}
            </div>
            <div className="max-w-[130px] truncate">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {currentTech?.name || 'Carlos Carranza'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                {currentTech?.phone || '3334884592'}
              </span>
            </div>
          </div>

          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="En Turno Activo" />
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
              className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition cursor-pointer"
              title="Abrir menú"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                {isExecutingAptId
                  ? 'Servicio en Ejecución en Sitio'
                  : navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-slate-500 font-mono hidden sm:block">
                Consola Móvil de Campo • Master Tech PWA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[140px] truncate">{currentTech?.name || 'Carlos Carranza'}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>Manual OEM & Torques</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>GPS Activo</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full">
          {/* ======================================================== */}
          {/* VISTA 1: RUTA DEL DÍA (ITINERARIO PASO A PASO)           */}
          {/* ======================================================== */}
          {activeTab === 'ruta' && !isExecutingAptId && (
            <div className="space-y-4">
              {/* Header de Itinerario con Filtros por Fecha */}
              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Itinerario de Servicios Asignados
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Organiza tus traslados y citas por fecha y horario.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 w-fit">
                    Hoy: {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Filtros de Pestañas Rápidas para el Técnico */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRouteFilter('today')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      routeFilter === 'today'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ruta de Hoy ({todayAppointments.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRouteFilter('upcoming')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      routeFilter === 'upcoming'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Próximos Días ({upcomingAppointments.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRouteFilter('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      routeFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Todas ({activeAppointments.length})</span>
                  </button>
                </div>
              </div>

              {/* Lista de Paradas */}
              {displayedRouteAppointments.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                  <Navigation className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    {routeFilter === 'today'
                      ? 'No tienes servicios programados para el día de hoy'
                      : 'No hay servicios en esta vista'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {routeFilter === 'today'
                      ? 'Revisa la pestaña "Próximos Días" para consultar tus citas agendadas de la semana.'
                      : 'Las nuevas citas confirmadas por el cliente aparecerán aquí.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {displayedRouteAppointments.map((apt, index) => {
                    const isCompleted = apt.status === 'completada';
                    const isInService = apt.status === 'en_servicio';
                    const isEnRoute = apt.status === 'en_camino';
                    const isPending = apt.status === 'confirmada';

                    return (
                      <div
                        key={apt.id}
                        className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 transition ${
                          isInService
                            ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                            : isEnRoute
                            ? 'border-blue-500 ring-2 ring-blue-500/10'
                            : 'border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        {/* Header de la Parada */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700">
                              #{index + 1}
                            </span>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-xs bg-[#08101E] text-amber-300 px-3 py-1 rounded-xl border border-amber-400/40 shadow-xs flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="tracking-wide text-white">{formatDisplayDate(apt.scheduledDate)}</span>
                                  <span className="text-amber-400/50">|</span>
                                  <span className="text-amber-300 font-semibold">{apt.timeSlot}</span>
                                </span>

                                <span
                                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                    isCompleted
                                      ? 'bg-slate-100 text-slate-800 border border-slate-300'
                                      : isInService
                                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 animate-pulse'
                                      : isEnRoute
                                      ? 'bg-amber-100 text-amber-950 border border-amber-300 animate-pulse'
                                      : 'bg-blue-50 text-blue-950 border border-blue-200'
                                  }`}
                                >
                                  {isCompleted
                                    ? 'Finalizado'
                                    : isInService
                                    ? '🟢 En Servicio'
                                    : isEnRoute
                                    ? '🚗 En Camino'
                                    : '📋 Programada'}
                                </span>
                              </div>

                              <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                                {apt.vehicle.brand} {apt.vehicle.model} ({apt.vehicle.year})
                              </h3>
                            </div>
                          </div>

                          <span className="text-xs font-mono font-bold text-slate-400">
                            {apt.folio}
                          </span>
                        </div>

                        {/* Cliente y Domicilio */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Cliente:</span>
                            <strong className="text-slate-900 block">{apt.client.name}</strong>
                            <span className="text-slate-600 font-mono">{apt.client.phone}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Ubicación de Visita:</span>
                            <p className="text-slate-800 font-medium">{apt.client.address}</p>
                            {apt.client.referenceNotes && (
                              <p className="text-slate-500 italic text-[11px] mt-0.5">
                                Ref: {apt.client.referenceNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                apt.client.address
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
                            >
                              <Navigation className="w-3.5 h-3.5 text-slate-600" />
                              <span>GPS / Maps</span>
                            </a>

                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleStartRouteAndNotify(apt)}
                                className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
                                title="Iniciar traslado y avisar por WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Avisar en Camino</span>
                              </button>
                            )}
                          </div>

                          {/* Botón de Flujo Operativo */}
                          {isCompleted ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={getWhatsAppCompletedLink(apt)}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95"
                                title="Enviar Reporte Técnico PDF por WhatsApp al Cliente"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Enviar por WhatsApp</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsExecutingAptId(apt.id);
                                  setShowReportModal(true);
                                }}
                                className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-300" />
                                <span>Ver Reporte PDF</span>
                              </button>
                            </div>
                          ) : isEnRoute ? (
                            /* BOTÓN PROMINENTE CUANDO EL TÉCNICO VA EN CAMINO: YA LLEGUÉ */
                            <button
                              type="button"
                              onClick={() => {
                                setIsExecutingAptId(apt.id);
                              }}
                              className="py-3 px-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 shadow-md shadow-emerald-700/20 cursor-pointer transition-all active:scale-98 border border-emerald-500/30"
                            >
                              <MapPin className="w-4 h-4 text-white shrink-0" />
                              <span>📍 ¡Ya Llegué! • Iniciar Servicio</span>
                            </button>
                          ) : isInService ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsExecutingAptId(apt.id);
                              }}
                              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer"
                            >
                              <Wrench className="w-4 h-4 text-amber-400" />
                              <span>Continuar Trabajo & Evidencias</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartRouteAndNotify(apt)}
                              className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Iniciar Traslado</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA DE EJECUCIÓN DEL SERVICIO EN SITIO                 */}
          {/* ======================================================== */}
          {isExecutingAptId && currentAppointment && (
            <div className="space-y-5">
              {/* Botón Volver a la Ruta */}
              <button
                type="button"
                onClick={() => setIsExecutingAptId(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver al Itinerario de Hoy</span>
              </button>

              {/* Header del Vehículo en Proceso */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {currentAppointment.folio}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-1.5">
                      {currentAppointment.vehicle?.brand || 'Vehículo'} {currentAppointment.vehicle?.model || ''} ({currentAppointment.vehicle?.year || ''})
                    </h2>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Placas: <strong className="text-slate-800">{currentAppointment.vehicle?.plates || 'S/P'}</strong> • VIN: <strong className="text-slate-700">{currentAppointment.vehicle?.vin || 'N/D'}</strong>
                    </p>
                  </div>
                </div>

                {/* Ficha Cliente & Teléfono */}
                <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase">Cliente de Visita:</span>
                    <strong className="text-slate-900 text-sm block">{currentAppointment.client?.name || 'Cliente'}</strong>
                    <p className="text-slate-600 line-clamp-1">{currentAppointment.client?.address || 'Domicilio del cliente'}</p>
                  </div>

                  {currentAppointment.client?.phone && (
                    <a
                      href={`tel:${currentAppointment.client.phone}`}
                      className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-xs shrink-0 transition"
                      title="Llamar al cliente"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* PASO 1: TRASLADO */}
                {status === 'confirmada' && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleStartRouteAndNotify(currentAppointment)}
                      className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
                    >
                      <Play className="w-4 h-4 text-emerald-400" />
                      <span>Iniciar Traslado & Avisar por WhatsApp</span>
                    </button>
                  </div>
                )}

                {/* PASO 2: LLEGADA Y CONFIRMAR ODÓMETRO */}
                {status === 'en_camino' && (
                  <div className="p-6 bg-blue-50/70 border-2 border-blue-300 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00509E] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          ¿Llegaste al Domicilio del Cliente?
                        </h3>
                        <p className="text-xs text-slate-600">
                          {currentAppointment.client?.address || 'Domicilio del cliente'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-bold text-slate-800">
                        Kilometraje Inicial del Odómetro (Garantía por VIN):
                      </label>
                      <div className="relative">
                        <Gauge className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          placeholder="ej. 42350"
                          value={initialKmInput}
                          onChange={(e) => setInitialKmInput(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-xl pl-9 pr-4 py-3 text-sm font-bold font-mono text-slate-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartService}
                      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer active:scale-98 tracking-wide border border-emerald-500/30"
                    >
                      <Play className="w-5 h-5 fill-white text-white shrink-0" />
                      <span>📍 ¡Confirmar Llegada e Iniciar Servicio!</span>
                    </button>
                  </div>
                )}

                {/* PASO 3: EN SERVICIO (CRONÓMETRO DE 2 BOTONES, EVIDENCIAS, CHECKLIST Y FIRMA) */}
                {status === 'en_servicio' && (
                  <div className="space-y-5 pt-2">
                    {/* Panel de Cronómetro de Trabajo con 2 Botones */}
                    <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isWorkTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                            {isWorkTimerRunning ? 'Trabajo en Ejecución' : 'Trabajo Detenido / Pausado'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono font-bold text-base text-slate-900 bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-xl">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span>{formatTimer(elapsedSeconds)}</span>
                        </div>
                      </div>

                      {/* Control de Tiempo: Iniciar / Pausar */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setIsWorkTimerRunning(!isWorkTimerRunning)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                            isWorkTimerRunning
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs active:scale-95'
                          }`}
                        >
                          {isWorkTimerRunning ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Pausar Cronómetro</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>{elapsedSeconds > 0 ? 'Reanudar Cronómetro' : 'Iniciar Trabajo'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bitácora de Evidencias (Foto a reemplazar y foto reemplazada por refacción) */}
                    <EvidenceManager
                      photos={record?.evidencePhotos || []}
                      onChange={handleEvidencesChange}
                      installedParts={record?.installedParts || []}
                      quote={currentAppointment.quote}
                      selectedOption={currentAppointment.selectedOption || 'premium'}
                    />

                    {/* Checklist de Refacciones */}
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Refacciones Instaladas en Sitio</span>
                      </h3>

                      <div className="space-y-1.5">
                        {(record?.installedParts || [
                          { id: 'p1', name: '4x Bujías Iridio / Platino', brand: 'NGK Laser Iridium', installed: true },
                          { id: 'p2', name: 'Aceite 100% Sintético (5L)', brand: 'Motul 8100 X-cess', installed: true },
                          { id: 'p3', name: 'Filtro de Aceite Blindado', brand: 'Mann Filter', installed: true },
                          { id: 'p4', name: 'Filtro de Aire Motor', brand: 'Mann Filter Pro', installed: true },
                          { id: 'p5', name: 'Filtro de Cabina Carbón', brand: 'Mann Filter', installed: true },
                        ]).map((part) => (
                          <label
                            key={part.id}
                            onClick={() => handlePartToggle(part.id)}
                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer text-xs transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={part.installed}
                                readOnly
                                className="rounded text-slate-900 w-4 h-4"
                              />
                              <span className="text-slate-900 font-bold">{part.name}</span>
                            </div>
                            <span className="font-mono text-slate-500">{part.brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Observaciones y Recomendaciones Amplias y Estilizadas */}
                    <div className="space-y-4 pt-1">
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                          Diagnóstico & Observaciones Mecánicas:
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Describe el estado de compresión, bujías viejas, fugas, sensores o detalles encontrados..."
                          value={observationsInput}
                          onChange={(e) => setObservationsInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 leading-relaxed focus:bg-white focus:outline-hidden focus:border-slate-400 transition"
                        />
                      </div>

                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
                        <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider font-mono">
                          Recomendaciones para el Cliente & Próximo Mantenimiento:
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Indica fecha/kilometraje para la próxima afinación, cambio de balatas, líquidos, etc..."
                          value={recommendationsInput}
                          onChange={(e) => setRecommendationsInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 leading-relaxed focus:bg-white focus:outline-hidden focus:border-amber-400 transition"
                        />
                      </div>
                    </div>

                    {!isHandoverStep ? (
                      /* FASE 1: TRABAJO FÍSICO TERMINADO (SIN PEDIR FIRMA PREMATURA) */
                      <div className="py-6 flex flex-col items-center justify-center gap-3 w-full border-t border-slate-200 mt-4">
                        <button
                          type="button"
                          onClick={handleCompleteMechanicalWork}
                          className="w-full max-w-md py-4 px-6 bg-[#08101E] hover:bg-slate-900 text-white font-bold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-slate-950/20 transition cursor-pointer active:scale-98 mx-auto"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Concluir Trabajo & Notificar al Cliente</span>
                        </button>
                        <p className="text-[11px] text-slate-500 text-center max-w-sm">
                          Al hacer clic se detendrá el cronómetro, se guardarán las fotos/notas y se notificará por WhatsApp al cliente que su vehículo está listo para la entrega y demostración de piezas.
                        </p>
                      </div>
                    ) : (
                      /* FASE 2: ENTREGA, FIRMA DE SATISFACCIÓN Y COBRO EN SITIO */
                      <div className="space-y-6 pt-4 border-t-2 border-emerald-500 mt-6 bg-emerald-50/40 p-5 sm:p-6 rounded-3xl border border-emerald-200">
                        {/* Header Entrega */}
                        <div className="space-y-1 text-center sm:text-left">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Paso Final: Entrega & Cobro</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900">
                            Entrega del Vehículo, Firma de Satisfacción & Cobro
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Muestra las piezas sustituidas y el estado del motor a <strong>{currentAppointment.client?.name || 'Cliente'}</strong>. Solicita su firma de conformidad y confirma el método de cobro acordado.
                          </p>
                        </div>

                        {/* Tarjeta de Resumen de Cobro */}
                        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                                Total del Servicio a Cobrar:
                              </span>
                              <div className="text-xl sm:text-2xl font-black text-slate-900">
                                {currentAppointment?.selectedOption === 'agency' || currentAppointment?.selectedOption === 'agencia'
                                  ? `$${(currentAppointment?.quote?.agency?.price || 3300).toLocaleString()} MXN`
                                  : `$${(currentAppointment?.quote?.premium?.price || 3750).toLocaleString()} MXN`}
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {currentAppointment?.selectedOption === 'agency' || currentAppointment?.selectedOption === 'agencia' ? 'Opción Agencia' : 'Opción De Autor'}
                            </span>
                          </div>

                          {/* Selector de Método de Pago */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                              Selecciona el Método de Pago Acordado:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setPaymentMethodSelected('cash')}
                                className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                                  paymentMethodSelected === 'cash'
                                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Banknote className={`w-5 h-5 shrink-0 ${paymentMethodSelected === 'cash' ? 'text-amber-400' : 'text-slate-500'}`} />
                                <div>
                                  <span className="text-xs font-bold block">Efectivo</span>
                                  <span className="text-[10px] opacity-80 block">Cobrado en mano</span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setPaymentMethodSelected('on_site_card')}
                                className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                                  paymentMethodSelected === 'on_site_card'
                                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <CreditCard className={`w-5 h-5 shrink-0 ${paymentMethodSelected === 'on_site_card' ? 'text-amber-400' : 'text-slate-500'}`} />
                                <div>
                                  <span className="text-xs font-bold block">Tarjeta en Sitio</span>
                                  <span className="text-[10px] opacity-80 block">Terminal Clip / TPV</span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setPaymentMethodSelected('transfer')}
                                className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                                  paymentMethodSelected === 'transfer'
                                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Smartphone className={`w-5 h-5 shrink-0 ${paymentMethodSelected === 'transfer' ? 'text-amber-400' : 'text-slate-500'}`} />
                                <div>
                                  <span className="text-xs font-bold block">Transferencia</span>
                                  <span className="text-[10px] opacity-80 block">SPEI Verificado</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Firma de Satisfacción del Cliente */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Firma de Satisfacción del Cliente:</span>
                            </label>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Conformidad con servicio y refacciones
                            </span>
                          </div>

                          <SignaturePad
                            onSave={(sig) => setSignatureData(sig)}
                            existingSignature={record?.clientSignatureUrl}
                            clientName={currentAppointment.client?.name || 'Cliente'}
                          />
                        </div>

                        {/* Acciones Finales de Cobro */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setIsHandoverStep(false)}
                            className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
                          >
                            ← Volver a detalles técnicos
                          </button>

                          <button
                            type="button"
                            onClick={handleConfirmHandoverAndPayment}
                            className="w-full sm:w-auto py-4 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition cursor-pointer active:scale-98"
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" />
                            <span>Confirmar Cobro y Enviar Firma de Satisfacción</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 4: COMPLETADA */}
                {status === 'completada' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black mx-auto shadow-xs">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-emerald-950">
                        ¡Servicio Finalizado y Certificado!
                      </h3>
                      <p className="text-xs text-emerald-800">
                        Póliza de garantía y Reporte Técnico digital emitidos para {currentAppointment.client?.name || 'Cliente'}.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <a
                        href={getWhatsAppCompletedLink(currentAppointment)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer active:scale-95"
                        title="Enviar Reporte Técnico PDF por WhatsApp al Cliente"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Enviar por WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setReportModalApt(currentAppointment);
                          setShowReportModal(true);
                        }}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-300" />
                        <span>Ver Reporte PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsExecutingAptId(null)}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                      >
                        <Navigation className="w-4 h-4 text-slate-600" />
                        <span>Volver a la Ruta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 3: CITAS AGENDADAS                                 */}
          {/* ======================================================== */}
          {activeTab === 'agendados' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Citas Confirmadas & Programadas
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Todas las citas agendadas con fechas y horarios de atención.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                  {scheduledServices.length} en agenda
                </span>
              </div>

              {scheduledServices.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    No hay citas pendientes en agenda
                  </h3>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledServices.map((apt) => (
                    <div key={apt.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                            {formatDisplayDate(apt.scheduledDate)} • {apt.timeSlot}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1.5">
                            {apt.vehicle?.brand || 'Vehículo'} {apt.vehicle?.model || ''} ({apt.vehicle?.year || ''})
                          </h3>
                          <p className="text-xs text-slate-600">Cliente: <strong className="text-slate-900">{apt.client?.name || 'Cliente'}</strong> • Tel: {apt.client?.phone || 'N/D'}</p>
                        </div>
                        <span className="font-mono text-xs text-slate-400">{apt.folio}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 border border-slate-100">
                        <strong>Dirección:</strong> {apt.client?.address || 'Domicilio del cliente'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 4: SERVICIOS REALIZADOS (HISTORIAL)                */}
          {/* ======================================================== */}
          {activeTab === 'realizados' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white border border-slate-200/90 p-5 rounded-2xl shadow-2xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Historial de Servicios Realizados
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Servicios completados con reporte técnico y garantía activa.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                  {completedServices.length} completados
                </span>
              </div>

              {completedServices.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    No hay servicios completados aún
                  </h3>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedServices.map((apt) => (
                    <div key={apt.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                            {formatDisplayDate(apt.scheduledDate)}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                            Garantía Activa
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                          {apt.vehicle?.brand || 'Vehículo'} {apt.vehicle?.model || ''} ({apt.vehicle?.plates || 'S/P'})
                        </h3>
                        <p className="text-xs text-slate-500">Cliente: <strong className="text-slate-800">{apt.client?.name || 'Cliente'}</strong> • {apt.client?.phone || ''}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppCompletedLink(apt)}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95"
                          title="Enviar reporte por WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Enviar por WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setReportModalApt(apt);
                            setShowReportModal(true);
                          }}
                          className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-300" />
                          <span>Reporte PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Reporte Técnico */}
      {showReportModal && (reportModalApt || currentAppointment) && (
        <TechnicalReportModal
          appointment={(reportModalApt || currentAppointment)!}
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportModalApt(null);
            setIsExecutingAptId(null);
          }}
        />
      )}

      {/* Modal Manual OEM & Torques */}
      {showManualModal && (
        <VehicleManualModal
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          vehicle={currentAppointment?.vehicle}
        />
      )}
    </div>
  );
}
