export type ServicePackageType =
  | 'afinacion_mayor'
  | 'afinacion_menor'
  | 'frenos'
  | 'reparacion_menor'
  | 'diagnostico'
  | 'otro_servicio';

export type QuoteOptionType = 'agencia' | 'premium';

export type AppointmentStatus =
  | 'solicitud_pendiente'
  | 'cotizado'
  | 'aprobada_por_cliente'
  | 'confirmada'
  | 'en_camino'
  | 'en_servicio'
  | 'completada'
  | 'cancelada';

export type PaymentMethod = 'online_card' | 'on_site_card' | 'on_site_cash';
export type PaymentStatus = 'pending' | 'paid' | 'penalized' | 'refunded';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plates: string;
  vin: string;
  currentKm?: number;
  engineSize?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  referenceNotes?: string;
}

export interface QuoteItem {
  name: string;
  spec: string;
  includedInAgency: boolean;
  includedInPremium: boolean;
}

export interface QuoteRemisionItem {
  id: string;
  quantity: number;
  unit: string; // 'pza', 'lts', 'jgo', 'kit'
  description: string;
  agencyBrand: string;
  agencyUnitPrice: number;
  agencyTotal: number;
  premiumBrand: string;
  premiumUnitPrice: number;
  premiumTotal: number;
}

export interface DualQuote {
  agency: {
    title: string;
    description: string;
    partsBrand: string;
    warrantyMonths: number;
    laborCost?: number;
    partsSubtotal?: number;
    price: number;
    highlights: string[];
  };
  premium: {
    title: string;
    description: string;
    partsBrand: string;
    warrantyMonths: number;
    laborCost?: number;
    partsSubtotal?: number;
    price: number;
    highlights: string[];
  };
  itemsChecklist: QuoteItem[];
  remisionItems?: QuoteRemisionItem[];
}

export interface EvidencePhoto {
  id: string;
  category: 'bujias' | 'filtro_aire' | 'filtro_cabina' | 'aceite' | 'cuerpo_aceleracion' | 'general';
  label: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  notes?: string;
  timestamp?: string;
}

export interface InstalledPart {
  id: string;
  name: string;
  brand: string;
  partNumber?: string;
  installed: boolean;
}

export interface ServiceRecord {
  id: string;
  appointmentId: string;
  startedAt?: string;
  arrivalTime?: string;
  initialKm: number;
  completedAt?: string;
  evidencePhotos: EvidencePhoto[];
  installedParts: InstalledPart[];
  mechanicalObservations: string;
  futureRecommendations: string;
  clientSignatureUrl?: string;
  signedByName?: string;
  pdfUrl?: string;
}

export interface Appointment {
  id: string;
  folio: string; // e.g. "ADA-2026-0842"
  client: Client;
  vehicle: Vehicle;
  packageType: ServicePackageType;
  serviceDescription?: string;
  selectedOption?: QuoteOptionType;
  quote?: DualQuote;
  status: AppointmentStatus;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // "09:00 - 11:30"
  technicianName: string;
  technicianPhone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cancellationPolicyAccepted: boolean;
  cancellationFee?: number;
  serviceRecord?: ServiceRecord;
  createdAt: string;
  nextFollowUpDate?: string; // 5-6 months later
  followUpStatus?: 'pending' | 'reminded_month_5' | 'rebooked' | 'completed';
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  type: 'quote_ready' | 'booking_confirmed' | 'technician_en_route' | 'service_completed_pdf' | 'cancellation_alert' | 'followup_5month';
  channel: 'email' | 'whatsapp';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ScheduleTimeSlot {
  id: string;
  slot: string; // e.g. "09:00 - 11:30"
  label: string; // e.g. "Mañana (Recomendado)"
  active: boolean;
}

export interface DayScheduleConfig {
  dayOfWeek: number; // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
  name: string;
  enabled: boolean;
}

export interface BusinessScheduleSettings {
  workingDays: DayScheduleConfig[];
  slots: ScheduleTimeSlot[];
  blockedDates: string[]; // YYYY-MM-DD
}

export interface OperationalZone {
  id: string;
  name: string;
  travelBufferMinutes: number;
  availableDays: number[];
}

export interface VehicleTechnicalSpec {
  id: string;
  brand: string;
  model: string;
  yearRange: string;
  engine: string;
  vinPrefix?: string;
  oil: {
    viscosity: string;
    capacityLiters: number;
    oemNorm: string;
    drainPlugTorqueNm: number;
    filterTorqueNm: number;
    recommendedMotul: string;
  };
  sparkPlugs: {
    type: string;
    gapInches: string;
    gapMm: string;
    torqueNm: number;
    hexSize: string;
    quantity: number;
    ngkReference: string;
  };
  filters: {
    oilFilterOem: string;
    oilFilterMann: string;
    airFilterOem: string;
    airFilterMann: string;
    cabinFilterOem: string;
    cabinFilterMann: string;
  };
  throttleAndInjectors: {
    throttleProcedure: string;
    injectorNotes: string;
  };
  serviceReset: {
    dashboardSteps: string[];
    obdProtocol: string;
  };
  criticalChecklist: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'technician';
  status: 'active' | 'inactive';
  pin?: string;
  createdAt: string;
}

export interface SecuritySettings {
  adminPin: string;
  technicianPin: string;
  staffMembers: StaffMember[];
}


