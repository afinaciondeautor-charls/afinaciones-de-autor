'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Wrench,
  Car,
  User,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Shield,
  FileText,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Settings2,
} from 'lucide-react';
import {
  ServicePackageType,
  PaymentMethod,
  QuoteOptionType,
  DualQuote,
} from '@/types';
import { useApp } from '@/context/AppContext';
import { getWhatsAppQuoteLink, getWhatsAppEnRouteLink } from '@/lib/whatsapp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointmentId: string) => void;
}

export default function AdminDirectServiceModal({ isOpen, onClose, onSuccess }: Props) {
  const { createDirectAdminService, scheduleSettings } = useApp();

  // 1. Tipo de Servicio
  const [packageType, setPackageType] = useState<ServicePackageType>('afinacion_mayor');
  const [serviceDescription, setServiceDescription] = useState('');

  // 2. Datos del Cliente
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // 3. Datos del Auto
  const [brand, setBrand] = useState('Volkswagen');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [plates, setPlates] = useState('');
  const [vin, setVin] = useState('');
  const [km, setKm] = useState<string>('');

  // 4. Modo de Presupuesto
  const [quoteMode, setQuoteMode] = useState<'dual' | 'single'>('dual');
  const [agencyPrice, setAgencyPrice] = useState<number>(3850);
  const [premiumPrice, setPremiumPrice] = useState<number>(4750);
  const [singlePrice, setSinglePrice] = useState<number>(2500);
  const [laborCost, setLaborCost] = useState<number>(850);

  // 5. Estado Inicial: ¿Cotización o Cita Aprobada?
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<QuoteOptionType>('premium');
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('09:00 - 11:30');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('on_site_card');

  // Error validation
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim()) {
      setErrorMessage('Por favor ingresa el nombre del cliente.');
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMessage('Por favor ingresa el teléfono / WhatsApp del cliente.');
      return;
    }
    if (!model.trim()) {
      setErrorMessage('Por favor ingresa el modelo del vehículo.');
      return;
    }
    if (!clientAddress.trim()) {
      setErrorMessage('Por favor ingresa el domicilio para la atención a domicilio.');
      return;
    }

    // Construir DualQuote
    let finalQuote: DualQuote | undefined = undefined;

    if (quoteMode === 'dual') {
      finalQuote = {
        agency: {
          title: `Opción Agencia (${brand} OEM)`,
          description: `Refacciones originales certificadas de agencia ${brand}.`,
          partsBrand: `OEM ${brand} Genuine Parts`,
          warrantyMonths: 6,
          laborCost: laborCost,
          partsSubtotal: Math.max(0, agencyPrice - laborCost),
          price: agencyPrice,
          highlights: ['Refacciones oficiales de concesionaria', 'Garantía por escrito de 6 meses'],
        },
        premium: {
          title: 'Opción De Autor (Alto Rendimiento)',
          description: 'Insumos de especificación superior (Motul 100% Sintético, NGK Iridium, Mann Filter).',
          partsBrand: 'Motul 8100 + NGK Laser Iridium + Mann Filter Pro',
          warrantyMonths: 12,
          laborCost: laborCost + 100,
          partsSubtotal: Math.max(0, premiumPrice - (laborCost + 100)),
          price: premiumPrice,
          highlights: [
            'Aceite 100% Sintético Motul 8100',
            'Bujías NGK Laser Iridium calibradas con galga',
            'Filtros Mann Filter Microfiltración',
            'Garantía extendida por escrito de 12 meses',
          ],
        },
        itemsChecklist: [
          { name: 'Aceite 100% Sintético con filtro blindado', spec: 'Norma OEM de fabricante', includedInAgency: true, includedInPremium: true },
          { name: 'Bujías Iridio / Platino calibradas', spec: 'Calibración GAP oficial', includedInAgency: true, includedInPremium: true },
          { name: 'Filtro de Aire y Cabina', spec: 'Mann Filter / OEM', includedInAgency: false, includedInPremium: true },
          { name: 'Descarbonizado de cuerpo y diagnóstico OBD-II', spec: 'Escaneo y reseteo', includedInAgency: true, includedInPremium: true },
        ],
      };
    } else {
      // Single price / Reparación específica
      finalQuote = {
        agency: {
          title: 'Servicio Mecánico Estándar',
          description: serviceDescription || 'Servicio acordado directamente con el cliente.',
          partsBrand: 'Refacciones OEM / Certificadas',
          warrantyMonths: 6,
          laborCost: laborCost,
          partsSubtotal: Math.max(0, singlePrice - laborCost),
          price: singlePrice,
          highlights: ['Mano de obra especializada a domicilio', 'Garantía por escrito de 6 meses'],
        },
        premium: {
          title: 'Servicio De Autor Certificado',
          description: serviceDescription || 'Servicio de alta calidad con refacciones premium.',
          partsBrand: 'Refacciones de Alto Rendimiento',
          warrantyMonths: 12,
          laborCost: laborCost,
          partsSubtotal: Math.max(0, singlePrice - laborCost),
          price: singlePrice,
          highlights: ['Mano de obra certificada', 'Garantía extendida de 12 meses'],
        },
        itemsChecklist: [
          { name: serviceDescription || 'Servicio mecánico en sitio', spec: 'Especificación de autor', includedInAgency: true, includedInPremium: true },
        ],
      };
    }

    const newAptId = createDirectAdminService({
      client: {
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@correo.com`,
        address: clientAddress.trim(),
        referenceNotes: clientNotes.trim(),
      },
      vehicle: {
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year) || new Date().getFullYear(),
        plates: plates.trim().toUpperCase() || 'S/P',
        vin: vin.trim().toUpperCase() || 'DIRECTO',
        currentKm: Number(km) || 0,
      },
      packageType,
      serviceDescription: serviceDescription.trim() || (packageType === 'afinacion_mayor' ? 'Afinación Mayor de Autor' : 'Servicio Mecánico Especial'),
      isApproved,
      selectedOption: isApproved ? selectedOption : undefined,
      quote: finalQuote,
      scheduledDate,
      timeSlot,
      paymentMethod,
    });

    if (onSuccess) onSuccess(newAptId);
    onClose();
  };

  const packageOptions: { type: ServicePackageType; label: string; icon: any }[] = [
    { type: 'afinacion_mayor', label: 'Afinación Mayor', icon: Wrench },
    { type: 'afinacion_menor', label: 'Afinación Menor', icon: Settings2 },
    { type: 'frenos', label: 'Frenos & Balatas', icon: Shield },
    { type: 'reparacion_menor', label: 'Reparación Menor', icon: Wrench },
    { type: 'diagnostico', label: 'Diagnóstico OBD-II', icon: Sparkles },
    { type: 'otro_servicio', label: 'Otro Servicio', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-5 animate-in fade-in">
      <div className="bg-white border-0 sm:border border-slate-200 w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-3xl rounded-none shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header (Obsidian Navy Institutional) */}
        <div className="p-4 sm:p-5 bg-[#08101E] text-white border-b border-slate-800 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/10 shrink-0">
              <Plus className="w-5 h-5 text-[#08101E]" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white">
                Realizar Cotización / Nuevo Servicio Directo
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                Registra servicios solicitados por llamada, WhatsApp o taller móvil
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-7 pb-24 sm:pb-8 space-y-6 bg-[#F8FAFC]">
          
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-900 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SELECCIÓN DEL TIPO DE SERVICIO */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              1. Tipo de Servicio a Realizar
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {packageOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = packageType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setPackageType(opt.type);
                      if (opt.type !== 'afinacion_mayor' && opt.type !== 'afinacion_menor') {
                        setQuoteMode('single');
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Descripción detallada si es reparación o trabajo específico */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Concepto / Descripción Detallada del Trabajo:
              </label>
              <textarea
                rows={2}
                placeholder="ej. Reemplazo de balatas delanteras de cerámica, purgado de líquido DOT4 y cambio de bujías Iridium..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
              />
            </div>
          </div>

          {/* 2. DATOS DEL CLIENTE */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-slate-700" />
              <span>2. Datos del Cliente & Ubicación</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nombre Completo *:
                </label>
                <input
                  type="text"
                  placeholder="ej. Carlos Mendoza"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  WhatsApp / Teléfono *:
                </label>
                <input
                  type="tel"
                  placeholder="ej. 55 1234 5678"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400 font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Dirección para el Servicio a Domicilio *:
                </label>
                <input
                  type="text"
                  placeholder="ej. Calle Insurgentes Sur 1450, Col. Actipan, Benito Juárez, CDMX"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Referencias de Cochera / Notas Adicionales (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="ej. Portón café, timbre 2, estacionamiento techado"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          {/* 3. DATOS DEL VEHÍCULO */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              <Car className="w-4 h-4 text-slate-700" />
              <span>3. Datos del Vehículo</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Marca *:
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                >
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Seat">Seat</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Honda">Honda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Renault">Renault</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="BMW">BMW</option>
                  <option value="Audi">Audi</option>
                  <option value="Otra">Otra Marca</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Modelo *:
                </label>
                <input
                  type="text"
                  placeholder="ej. Jetta 1.4 TSI, Swift Boosterjet, RAV4..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Año:
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Placas:
                </label>
                <input
                  type="text"
                  placeholder="ej. NXZ-88-21"
                  value={plates}
                  onChange={(e) => setPlates(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden font-mono uppercase"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kilometraje Odómetro:
                </label>
                <input
                  type="number"
                  placeholder="ej. 45000"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  VIN / Número de Serie (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="ej. 3VW2K7AJ..."
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* 4. CONFIGURACIÓN DE PRECIO & COTIZACIÓN */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>4. Presupuesto & Costos del Servicio</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setQuoteMode('dual')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition ${
                    quoteMode === 'dual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Dual (Agencia vs Autor)
                </button>
                <button
                  type="button"
                  onClick={() => setQuoteMode('single')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition ${
                    quoteMode === 'single' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Precio Único
                </button>
              </div>
            </div>

            {quoteMode === 'dual' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Opción Agencia (OEM)</span>
                    <span className="text-[10px] text-slate-500 font-mono">6 Meses Gar.</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={agencyPrice}
                      onChange={(e) => setAgencyPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-950">Opción De Autor (High Performance)</span>
                    <span className="text-[10px] text-amber-800 font-mono font-bold">12 Meses Gar.</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(Number(e.target.value))}
                      className="w-full bg-white border border-amber-300 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="block text-xs font-bold text-slate-700">Precio Total del Servicio ($ MXN):</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={singlePrice}
                      onChange={(e) => setSinglePrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="block text-xs font-bold text-slate-700">Mano de Obra Estimada ($ MXN):</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. ESTADO INICIAL: ¿SOLO COTIZACIÓN O YA ESTÁ APROBADA Y AGENDADA? */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              <span>5. Estatus Inicial de la Orden</span>
            </div>

            {/* Switch de Modo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                onClick={() => setIsApproved(false)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  !isApproved
                    ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="status_choice"
                  checked={!isApproved}
                  onChange={() => setIsApproved(false)}
                  className="mt-0.5 text-slate-900"
                />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    📋 Guardar como Cotización Pendiente
                  </strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Se guarda en la bandeja para enviarle el presupuesto por WhatsApp al cliente.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setIsApproved(true)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  isApproved
                    ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="status_choice"
                  checked={isApproved}
                  onChange={() => setIsApproved(true)}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <strong className="text-xs text-emerald-950 block font-bold">
                    ✅ Cita Aprobada & Agendada Directamente
                  </strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    El cliente ya confirmó; se programa fecha, horario y pasa al técnico.
                  </p>
                </div>
              </label>
            </div>

            {/* Campos de Fecha y Horario si ya está aprobada */}
            {isApproved && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Fecha del Servicio:
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Horario de Atención:
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                    >
                      {scheduleSettings.slots.map((s) => (
                        <option key={s.id} value={s.slot}>
                          {s.slot} ({s.label})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Forma de Pago Acordada:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                    >
                      <option value="on_site_card">💳 Terminal en Sitio</option>
                      <option value="online_card">⚡ Tarjeta en Línea</option>
                      <option value="on_site_cash">💵 Efectivo al Terminar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de Envío */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{isApproved ? 'Guardar y Programar Cita' : 'Generar y Guardar Cotización'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
