import { Appointment, NotificationLog, BusinessScheduleSettings, SecuritySettings } from '@/types';

/**
 * Base de datos limpia inicial para sincronización con Supabase / Backend.
 */
export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [];

export const INITIAL_SCHEDULE_SETTINGS: BusinessScheduleSettings = {
  workingDays: [
    { dayOfWeek: 1, name: 'Lunes', enabled: true },
    { dayOfWeek: 2, name: 'Martes', enabled: true },
    { dayOfWeek: 3, name: 'Miércoles', enabled: true },
    { dayOfWeek: 4, name: 'Jueves', enabled: true },
    { dayOfWeek: 5, name: 'Viernes', enabled: true },
    { dayOfWeek: 6, name: 'Sábado', enabled: true },
    { dayOfWeek: 0, name: 'Domingo', enabled: true },
  ],
  slots: [
    { id: 'slot-1', slot: '09:00 - 11:30', label: 'Mañana (Recomendado)', active: true },
    { id: 'slot-2', slot: '12:00 - 14:30', label: 'Mediodía', active: true },
    { id: 'slot-3', slot: '15:30 - 18:00', label: 'Tarde', active: true },
    { id: 'slot-4', slot: '18:30 - 20:30', label: 'Vespertino', active: true },
  ],
  blockedDates: [],
};

export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  adminPin: '123456',
  technicianPin: '123456',
  staffMembers: [
    {
      id: 'staff-1',
      name: 'Pedro Almonte',
      phone: '+52 55 9876 5432',
      role: 'admin',
      status: 'active',
      createdAt: '2026-08-20T10:00:00Z',
    },
    {
      id: 'staff-2',
      name: 'Carlos Ruiz (Master Tech)',
      phone: '+52 55 8899 1122',
      role: 'technician',
      status: 'active',
      createdAt: '2026-08-20T10:00:00Z',
    },
  ],
};
