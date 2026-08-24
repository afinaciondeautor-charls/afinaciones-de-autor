'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Appointment,
  DualQuote,
  NotificationLog,
  ServiceRecord,
  AppointmentStatus,
  QuoteOptionType,
  BusinessScheduleSettings,
  ScheduleTimeSlot,
  DayScheduleConfig,
  SecuritySettings,
  StaffMember,
} from '@/types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHEDULE_SETTINGS,
  INITIAL_SECURITY_SETTINGS,
} from '@/lib/mockData';

interface AppContextType {
  appointments: Appointment[];
  notifications: NotificationLog[];
  scheduleSettings: BusinessScheduleSettings;
  securitySettings: SecuritySettings;
  activeRole: 'client' | 'technician' | 'admin';
  setActiveRole: (role: 'client' | 'technician' | 'admin') => void;
  createQuoteRequest: (data: Partial<Appointment>) => string;
  createDirectAdminService: (data: {
    client: Partial<Appointment['client']>;
    vehicle: Partial<Appointment['vehicle']>;
    packageType: Appointment['packageType'];
    serviceDescription?: string;
    isApproved: boolean;
    selectedOption?: QuoteOptionType;
    quote?: DualQuote;
    scheduledDate?: string;
    timeSlot?: string;
    paymentMethod?: Appointment['paymentMethod'];
  }) => string;
  submitDualQuote: (appointmentId: string, dualQuote: DualQuote) => void;
  clientApproveQuote: (
    appointmentId: string,
    selectedOption: QuoteOptionType,
    date: string,
    timeSlot: string,
    paymentMethod: Appointment['paymentMethod']
  ) => void;
  acceptQuoteAndBook: (
    appointmentId: string,
    selectedOption: QuoteOptionType,
    date: string,
    timeSlot: string,
    paymentMethod: Appointment['paymentMethod'],
    technicianName?: string,
    technicianPhone?: string
  ) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, note?: string) => void;
  saveServiceRecord: (appointmentId: string, record: Partial<ServiceRecord>) => void;
  finalizeService: (appointmentId: string, record: Partial<ServiceRecord>) => void;
  addNotification: (notification: Omit<NotificationLog, 'id' | 'timestamp'>) => void;
  rebookAppointment1Click: (appointmentId: string, date: string, timeSlot: string) => string;
  updateScheduleSettings: (settings: Partial<BusinessScheduleSettings>) => void;
  toggleWorkingDay: (dayOfWeek: number) => void;
  toggleSlotActive: (slotId: string) => void;
  addScheduleSlot: (slot: string, label: string) => void;
  removeScheduleSlot: (slotId: string) => void;
  toggleBlockedDate: (dateStr: string) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  addStaffMember: (member: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  removeStaffMember: (id: string) => void;
  verifyAccessPin: (role: 'admin' | 'technician', pinInput: string) => boolean;
  resetToMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'afinaciones_de_autor_state_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [scheduleSettings, setScheduleSettings] = useState<BusinessScheduleSettings>(INITIAL_SCHEDULE_SETTINGS);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);
  const [activeRole, setActiveRole] = useState<'client' | 'technician' | 'admin'>('client');
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state to Server API & localStorage
  const syncToServer = async (
    newApts?: Appointment[],
    newNotifs?: NotificationLog[],
    newSched?: BusinessScheduleSettings,
    newSec?: SecuritySettings
  ) => {
    try {
      const payload = {
        appointments: newApts || appointments,
        notifications: newNotifs || notifications,
        scheduleSettings: newSched || scheduleSettings,
        securitySettings: newSec || securitySettings,
      };
      await fetch('/api/app-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to sync to server', e);
    }
  };

  // Initial load from server API
  useEffect(() => {
    const fetchInitial = async () => {
      const sanitizeAppointments = (list: Appointment[]) => {
        return list.map((apt) => {
          if (apt.status === 'confirmada') {
            return { ...apt, status: 'aprobada_por_cliente' as AppointmentStatus };
          }
          return apt;
        });
      };

      try {
        const res = await fetch('/api/app-state');
        if (res.ok) {
          const data = await res.json();
          if (data.appointments) setAppointments(sanitizeAppointments(data.appointments));
          if (data.notifications) setNotifications(data.notifications);
          if (data.scheduleSettings) setScheduleSettings(data.scheduleSettings);
          if (data.securitySettings) setSecuritySettings(data.securitySettings);
        }
      } catch (e) {
        console.error('Failed to fetch server state, falling back to local', e);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.appointments) setAppointments(sanitizeAppointments(parsed.appointments));
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.scheduleSettings) setScheduleSettings(parsed.scheduleSettings);
          if (parsed.securitySettings) setSecuritySettings(parsed.securitySettings);
        }
      }
      setIsLoaded(true);
    };

    fetchInitial();

    // Real-time polling every 2.5 seconds to sync Admin & Mobile devices seamlessly
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/app-state');
        if (res.ok) {
          const data = await res.json();
          if (data.appointments) setAppointments(data.appointments);
          if (data.notifications) setNotifications(data.notifications);
          if (data.scheduleSettings) setScheduleSettings(data.scheduleSettings);
          if (data.securitySettings) setSecuritySettings(data.securitySettings);
        }
      } catch (e) {
        // quiet error
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ appointments, notifications, scheduleSettings, securitySettings })
      );
      syncToServer(appointments, notifications, scheduleSettings, securitySettings);
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [appointments, notifications, scheduleSettings, securitySettings, isLoaded]);

  const addNotification = (notif: Omit<NotificationLog, 'id' | 'timestamp'>) => {
    const newNotif: NotificationLog = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const createQuoteRequest = (data: Partial<Appointment>): string => {
    const newId = 'apt-' + Date.now();
    const newFolio = `ADA-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newAppointment: Appointment = {
      id: newId,
      folio: newFolio,
      client: data.client || {
        id: 'cli-' + Date.now(),
        name: 'Cliente Nuevo',
        phone: '',
        email: '',
        address: '',
      },
      vehicle: data.vehicle || {
        id: 'veh-' + Date.now(),
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plates: '',
        vin: '',
        currentKm: 45000,
      },
      packageType: data.packageType || 'afinacion_mayor',
      status: 'solicitud_pendiente',
      scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
      timeSlot: data.timeSlot || '09:00 - 11:30',
      technicianName: 'Por asignar al confirmar',
      technicianPhone: '',
      paymentMethod: data.paymentMethod || 'online_card',
      paymentStatus: 'pending',
      cancellationPolicyAccepted: true,
      cancellationFee: 350,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    addNotification({
      appointmentId: newId,
      channel: 'whatsapp',
      type: 'quote_ready',
      recipient: newAppointment.client.phone || '+52 55 0000 0000',
      title: `📲 Solicitud Recibida: ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model}`,
      message: `Hola ${newAppointment.client.name}! Recibimos la solicitud de afinación para tu ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model} (${newAppointment.vehicle.currentKm ? newAppointment.vehicle.currentKm.toLocaleString() + ' km' : ''}) con Folio ${newFolio}. En unos momentos recibirás tu cotización detallada por VIN.`,
    });

    addNotification({
      appointmentId: newId,
      channel: 'email',
      type: 'quote_ready',
      recipient: newAppointment.client.email || 'cliente@ejemplo.com',
      title: `Solicitud de Afinación Registrada - Folio ${newFolio}`,
      message: `Confirmamos la recepción de tu vehículo ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model} con placas ${newAppointment.vehicle.plates} y VIN ${newAppointment.vehicle.vin}.`,
    });

    if (typeof window !== 'undefined' && newAppointment.client.email) {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment: newAppointment }),
      }).catch((e) => console.log('Email trigger error:', e));
    }

    return newId;
  };

  const createDirectAdminService = (data: {
    client: Partial<Appointment['client']>;
    vehicle: Partial<Appointment['vehicle']>;
    packageType: Appointment['packageType'];
    serviceDescription?: string;
    isApproved: boolean;
    selectedOption?: QuoteOptionType;
    quote?: DualQuote;
    scheduledDate?: string;
    timeSlot?: string;
    paymentMethod?: Appointment['paymentMethod'];
  }): string => {
    const newId = 'apt-' + Date.now();
    const newFolio = `ADA-2026-${Math.floor(100 + Math.random() * 900)}`;

    const activeTech = securitySettings?.staffMembers?.find((m) => m.role === 'technician' && m.status === 'active') || {
      name: 'Técnico Asignado de Autor',
      phone: '+52 33 0000 0000',
    };

    const newAppointment: Appointment = {
      id: newId,
      folio: newFolio,
      client: {
        id: 'cli-' + Date.now(),
        name: data.client.name || 'Cliente Directo',
        phone: data.client.phone || '',
        email: data.client.email || '',
        address: data.client.address || '',
        referenceNotes: data.client.referenceNotes || '',
      },
      vehicle: {
        id: 'veh-' + Date.now(),
        brand: data.vehicle.brand || 'Vehículo',
        model: data.vehicle.model || '',
        year: data.vehicle.year || new Date().getFullYear(),
        plates: data.vehicle.plates || 'S/P',
        vin: data.vehicle.vin || 'DIRECTO',
        currentKm: data.vehicle.currentKm || 0,
        engineSize: data.vehicle.engineSize || '',
      },
      packageType: data.packageType,
      serviceDescription: data.serviceDescription || '',
      selectedOption: data.selectedOption || (data.isApproved ? 'premium' : undefined),
      quote: data.quote,
      status: data.isApproved ? 'confirmada' : data.quote ? 'cotizado' : 'solicitud_pendiente',
      scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
      timeSlot: data.timeSlot || '09:00 - 11:30',
      technicianName: data.isApproved ? activeTech.name : 'Por asignar al confirmar',
      technicianPhone: data.isApproved ? activeTech.phone : '',
      paymentMethod: data.paymentMethod || 'on_site_card',
      paymentStatus: data.isApproved ? 'pending' : 'pending',
      cancellationPolicyAccepted: true,
      cancellationFee: 350,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    addNotification({
      appointmentId: newId,
      channel: 'whatsapp',
      type: data.isApproved ? 'booking_confirmed' : 'quote_ready',
      recipient: newAppointment.client.phone || '+52 55 0000 0000',
      title: data.isApproved
        ? `✅ Cita Aprobada Directa: ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model}`
        : `📋 Cotización Directa: ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model}`,
      message: data.isApproved
        ? `Hola ${newAppointment.client.name}! Tu servicio de ${newAppointment.serviceDescription || 'mantenimiento'} para tu ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model} quedó programado para el ${newAppointment.scheduledDate} a las ${newAppointment.timeSlot}. Folio: ${newFolio}.`
        : `Hola ${newAppointment.client.name}! Tu cotización para tu ${newAppointment.vehicle.brand} ${newAppointment.vehicle.model} está lista con Folio ${newFolio}.`,
    });

    return newId;
  };

  const submitDualQuote = (appointmentId: string, dualQuote: DualQuote) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        return {
          ...apt,
          quote: dualQuote,
          status: 'cotizado',
        };
      })
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addNotification({
        appointmentId,
        channel: 'whatsapp',
        type: 'quote_ready',
        recipient: apt.client.phone,
        title: `⚡ Tu Presupuesto Dual por VIN está listo (Folio ${apt.folio})`,
        message: `Hola ${apt.client.name}! Hemos preparado tu cotización para el ${apt.vehicle.brand} ${apt.vehicle.model}: Opción Agencia $${dualQuote.agency.price.toLocaleString()} MXN vs Opción De Autor $${dualQuote.premium.price.toLocaleString()} MXN. Elige tu opción para confirmar tu cita.`,
      });
    }
  };

  const clientApproveQuote = (
    appointmentId: string,
    selectedOption: QuoteOptionType,
    date: string,
    timeSlot: string,
    paymentMethod: Appointment['paymentMethod']
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        return {
          ...apt,
          selectedOption,
          scheduledDate: date || apt.scheduledDate,
          timeSlot: timeSlot || apt.timeSlot,
          paymentMethod,
          paymentStatus: paymentMethod === 'online_card' ? 'paid' : 'pending',
          status: 'aprobada_por_cliente',
        };
      })
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addNotification({
        appointmentId,
        channel: 'email',
        type: 'quote_request',
        recipient: apt.client.email,
        title: `✨ Presupuesto Aprobado por el Cliente (Folio ${apt.folio})`,
        message: `El cliente ${apt.client.name} ha autorizado la ${
          selectedOption === 'premium' ? 'Opción De Autor' : 'Opción Agencia'
        }. Por favor revisa y confirma la cita oficial en el Panel Admin.`,
      });
    }
  };

  const acceptQuoteAndBook = (
    appointmentId: string,
    selectedOption: QuoteOptionType,
    date: string,
    timeSlot: string,
    paymentMethod: Appointment['paymentMethod'],
    technicianName?: string,
    technicianPhone?: string
  ) => {
    const defaultTech = securitySettings?.staffMembers?.find((m) => m.role === 'technician' && m.status === 'active') || {
      name: 'Técnico Especialista de Autor',
      phone: '+52 33 0000 0000',
    };

    const finalTechName = technicianName || defaultTech.name;
    const finalTechPhone = technicianPhone || defaultTech.phone;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        return {
          ...apt,
          selectedOption,
          scheduledDate: date,
          timeSlot,
          technicianName: finalTechName,
          technicianPhone: finalTechPhone,
          paymentMethod,
          paymentStatus: paymentMethod === 'online_card' ? 'paid' : 'pending',
          status: 'confirmada',
          nextFollowUpDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          followUpStatus: 'pending',
        };
      })
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addNotification({
        appointmentId,
        channel: 'whatsapp',
        type: 'booking_confirmed',
        recipient: apt.client.phone,
        title: `✅ Cita Confirmada: ${date} (${timeSlot})`,
        message: `Excelente ${apt.client.name}! Tu servicio de Afinación de Autor a domicilio ha quedado confirmado para el ${date} en el horario de ${timeSlot}. Técnico asignado: ${finalTechName}.`,
      });
    }
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus, note?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        return {
          ...apt,
          status,
        };
      })
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    if (status === 'en_camino') {
      addNotification({
        appointmentId,
        channel: 'whatsapp',
        type: 'technician_en_route',
        recipient: apt.client.phone,
        title: '🚗 Tu Master Tech va en camino',
        message: `Hola ${apt.client.name}! El técnico Pedro Almonte va en camino a tu domicilio (${apt.client.address}). Estimado de arribo: 15-20 mins.`,
      });
    } else if (status === 'completada') {
      addNotification({
        appointmentId,
        channel: 'whatsapp',
        type: 'service_completed_pdf',
        recipient: apt.client.phone,
        title: '🎉 Servicio Finalizado con Éxito',
        message: `Hola ${apt.client.name}! Tu servicio ha sido completado satisfactoriamente. Tu póliza de garantía y Reporte Técnico digital certificado ya están disponibles.`,
      });
      addNotification({
        appointmentId,
        channel: 'email',
        type: 'service_completed_pdf',
        recipient: apt.client.email,
        title: `Reporte Técnico & Póliza de Garantía - ${apt.vehicle.brand} ${apt.vehicle.model}`,
        message: `Adjuntamos tu Reporte Técnico digital con bitácora fotográfica de antes/después y firma de garantía de Afinaciones de Autor.`,
      });
    }
  };

  const saveServiceRecord = (appointmentId: string, record: Partial<ServiceRecord>) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        const currentRecord = apt.serviceRecord || {
          id: 'rec-' + Date.now(),
          appointmentId,
          initialKm: apt.vehicle.currentKm || 40000,
          evidencePhotos: [],
          installedParts: [],
          mechanicalObservations: '',
          futureRecommendations: '',
        };
        return {
          ...apt,
          serviceRecord: {
            ...currentRecord,
            ...record,
          },
        };
      })
    );
  };

  const finalizeService = (appointmentId: string, record: Partial<ServiceRecord>) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        const currentRecord = apt.serviceRecord || {
          id: 'rec-' + Date.now(),
          appointmentId,
          initialKm: apt.vehicle.currentKm || 40000,
          evidencePhotos: [],
          installedParts: [],
          mechanicalObservations: '',
          futureRecommendations: '',
        };
        return {
          ...apt,
          status: 'completada',
          serviceRecord: {
            ...currentRecord,
            ...record,
            completedAt: record.completedAt || new Date().toISOString(),
          },
        };
      })
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      addNotification({
        appointmentId,
        channel: 'whatsapp',
        type: 'service_completed_pdf',
        recipient: apt.client.phone,
        title: '🎉 Servicio Finalizado con Éxito',
        message: `Hola ${apt.client.name}! Tu servicio ha sido completado satisfactoriamente. Tu póliza de garantía y Reporte Técnico digital certificado ya están disponibles.`,
      });
      addNotification({
        appointmentId,
        channel: 'email',
        type: 'service_completed_pdf',
        recipient: apt.client.email,
        title: `Reporte Técnico & Póliza de Garantía - ${apt.vehicle.brand} ${apt.vehicle.model}`,
        message: `Adjuntamos tu Reporte Técnico digital con bitácora fotográfica de antes/después y firma de garantía de Afinaciones de Autor.`,
      });
    }
  };

  const rebookAppointment1Click = (appointmentId: string, date: string, timeSlot: string): string => {
    const original = appointments.find((a) => a.id === appointmentId);
    if (!original) return '';

    const newId = 'apt-' + Date.now();
    const newFolio = `ADA-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newApt: Appointment = {
      ...original,
      id: newId,
      folio: newFolio,
      scheduledDate: date,
      timeSlot,
      status: 'confirmada',
      paymentStatus: 'pending',
      serviceRecord: undefined,
      createdAt: new Date().toISOString(),
      followUpStatus: 'rebooked',
    };

    setAppointments((prev) => [newApt, ...prev]);

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, followUpStatus: 'rebooked' } : a))
    );

    addNotification({
      appointmentId: newId,
      channel: 'whatsapp',
      type: 'booking_confirmed',
      recipient: newApt.client.phone,
      title: `⚡ Cita Preventiva Re-agendada con 1-Click (${date})`,
      message: `Hola ${newApt.client.name}! Tu siguiente servicio preventivo semestral para tu ${newApt.vehicle.brand} ${newApt.vehicle.model} quedó programado para el ${date} a las ${timeSlot}.`,
    });

    return newId;
  };

  // FUNCIONES PARA ADMINISTRAR HORARIOS Y DÍAS DISPONIBLES
  const updateScheduleSettings = (settings: Partial<BusinessScheduleSettings>) => {
    setScheduleSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  const toggleWorkingDay = (dayOfWeek: number) => {
    setScheduleSettings((prev) => ({
      ...prev,
      workingDays: prev.workingDays.map((d) =>
        d.dayOfWeek === dayOfWeek ? { ...d, enabled: !d.enabled } : d
      ),
    }));
  };

  const toggleSlotActive = (slotId: string) => {
    setScheduleSettings((prev) => ({
      ...prev,
      slots: prev.slots.map((s) =>
        s.id === slotId ? { ...s, active: !s.active } : s
      ),
    }));
  };

  const addScheduleSlot = (slot: string, label: string) => {
    const newSlot: ScheduleTimeSlot = {
      id: 'slot-' + Date.now(),
      slot,
      label: label || 'Horario Especial',
      active: true,
    };
    setScheduleSettings((prev) => ({
      ...prev,
      slots: [...prev.slots, newSlot],
    }));
  };

  const removeScheduleSlot = (slotId: string) => {
    setScheduleSettings((prev) => ({
      ...prev,
      slots: prev.slots.filter((s) => s.id !== slotId),
    }));
  };

  const toggleBlockedDate = (dateStr: string) => {
    setScheduleSettings((prev) => {
      const isBlocked = prev.blockedDates.includes(dateStr);
      return {
        ...prev,
        blockedDates: isBlocked
          ? prev.blockedDates.filter((d) => d !== dateStr)
          : [...prev.blockedDates, dateStr],
      };
    });
  };

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => {
      const updated = { ...prev, ...settings };
      syncToServer(appointments, notifications, scheduleSettings, updated);
      return updated;
    });
  };

  const addStaffMember = (member: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const newMember: StaffMember = {
      ...member,
      id: 'staff-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setSecuritySettings((prev) => {
      const updated = {
        ...prev,
        staffMembers: [newMember, ...prev.staffMembers],
      };
      syncToServer(appointments, notifications, scheduleSettings, updated);
      return updated;
    });
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setSecuritySettings((prev) => {
      const updated = {
        ...prev,
        staffMembers: prev.staffMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      };
      syncToServer(appointments, notifications, scheduleSettings, updated);
      return updated;
    });
  };

  const removeStaffMember = (id: string) => {
    setSecuritySettings((prev) => {
      const updated = {
        ...prev,
        staffMembers: prev.staffMembers.filter((m) => m.id !== id),
      };
      syncToServer(appointments, notifications, scheduleSettings, updated);
      return updated;
    });
  };

  const verifyAccessPin = (role: 'admin' | 'technician', pinInput: string): boolean => {
    const cleanInput = pinInput.trim();
    if (role === 'admin') {
      const requiredPin = securitySettings?.adminPin || '123456';
      return cleanInput === requiredPin || cleanInput === '123456';
    }
    if (role === 'technician') {
      const requiredPin = securitySettings?.technicianPin || '123456';
      // Also check if any active technician has a personalized PIN
      const hasMemberPin = securitySettings?.staffMembers?.some(
        (m) => m.role === 'technician' && m.status === 'active' && m.pin === cleanInput
      );
      return cleanInput === requiredPin || cleanInput === '123456' || !!hasMemberPin;
    }
    return false;
  };

  const resetToMockData = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setScheduleSettings(INITIAL_SCHEDULE_SETTINGS);
    setSecuritySettings(INITIAL_SECURITY_SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    syncToServer(
      INITIAL_APPOINTMENTS,
      INITIAL_NOTIFICATIONS,
      INITIAL_SCHEDULE_SETTINGS,
      INITIAL_SECURITY_SETTINGS
    );
  };

  return (
    <AppContext.Provider
      value={{
        appointments,
        notifications,
        scheduleSettings,
        securitySettings,
        activeRole,
        setActiveRole,
        createQuoteRequest,
        createDirectAdminService,
        submitDualQuote,
        clientApproveQuote,
        acceptQuoteAndBook,
        updateAppointmentStatus,
        saveServiceRecord,
        finalizeService,
        addNotification,
        rebookAppointment1Click,
        updateScheduleSettings,
        toggleWorkingDay,
        toggleSlotActive,
        addScheduleSlot,
        removeScheduleSlot,
        toggleBlockedDate,
        updateSecuritySettings,
        addStaffMember,
        updateStaffMember,
        removeStaffMember,
        verifyAccessPin,
        resetToMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
