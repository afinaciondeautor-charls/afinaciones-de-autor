'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Appointment, PaymentMethod } from '@/types';
import {
  DollarSign,
  CreditCard,
  Banknote,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Download,
  Printer,
  Receipt,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export default function AdminAccounting() {
  const { appointments } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [selectedAppointmentForReceipt, setSelectedAppointmentForReceipt] = useState<Appointment | null>(null);

  // Filter only appointments that have a quote or price
  const quotedAppointments = appointments.filter(
    (apt) => apt.quote || apt.status === 'completada' || apt.status === 'en_servicio' || apt.status === 'confirmada'
  );

  // Financial calculations
  const getAppointmentAmount = (apt: Appointment): number => {
    if (!apt.quote) return 0;
    if (apt.selectedOption === 'agencia') return apt.quote.agency.price;
    if (apt.selectedOption === 'premium') return apt.quote.premium.price;
    return apt.quote.premium.price;
  };

  const getLaborAmount = (apt: Appointment): number => {
    if (!apt.quote) return 0;
    if (apt.selectedOption === 'agencia') return apt.quote.agency.laborCost || 850;
    return apt.quote.premium.laborCost || 950;
  };

  const getPartsAmount = (apt: Appointment): number => {
    const total = getAppointmentAmount(apt);
    const labor = getLaborAmount(apt);
    return Math.max(0, total - labor);
  };

  // KPIs
  const totalRevenue = quotedAppointments.reduce((acc, apt) => acc + getAppointmentAmount(apt), 0);
  
  const totalPaidOnline = quotedAppointments
    .filter((a) => a.paymentMethod === 'online_card' && a.paymentStatus === 'paid')
    .reduce((acc, apt) => acc + getAppointmentAmount(apt), 0);

  const totalPaidOnSite = quotedAppointments
    .filter((a) => (a.paymentMethod === 'on_site_card' || a.paymentMethod === 'on_site_cash') && a.paymentStatus === 'paid')
    .reduce((acc, apt) => acc + getAppointmentAmount(apt), 0);

  const totalPaid = totalPaidOnline + totalPaidOnSite;

  const totalPending = quotedAppointments
    .filter((a) => a.paymentStatus === 'pending')
    .reduce((acc, apt) => acc + getAppointmentAmount(apt), 0);

  const totalLaborRevenue = quotedAppointments
    .filter((a) => a.paymentStatus === 'paid')
    .reduce((acc, apt) => acc + getLaborAmount(apt), 0);

  const totalPartsCost = quotedAppointments
    .filter((a) => a.paymentStatus === 'paid')
    .reduce((acc, apt) => acc + getPartsAmount(apt), 0);

  // Filtered list
  const filteredAppointments = quotedAppointments.filter((apt) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      apt.folio.toLowerCase().includes(query) ||
      apt.client.name.toLowerCase().includes(query) ||
      apt.vehicle.brand.toLowerCase().includes(query) ||
      apt.vehicle.model.toLowerCase().includes(query) ||
      apt.vehicle.plates.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paid' && apt.paymentStatus === 'paid') ||
      (statusFilter === 'pending' && apt.paymentStatus === 'pending');

    const matchesMethod = methodFilter === 'all' || apt.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleExportCSV = () => {
    const headers = 'Folio,Fecha,Cliente,Telefono,Vehiculo,Placas,Paquete,Total,ManoDeObra,Refacciones,MetodoPago,EstadoPago\n';
    const rows = filteredAppointments
      .map((apt) => {
        const total = getAppointmentAmount(apt);
        const labor = getLaborAmount(apt);
        const parts = getPartsAmount(apt);
        const option = apt.selectedOption === 'agencia' ? 'Agencia OEM' : 'De Autor';
        const method =
          apt.paymentMethod === 'online_card'
            ? 'En Linea'
            : apt.paymentMethod === 'on_site_card'
            ? 'Terminal en Sitio'
            : 'Efectivo';
        const status = apt.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente';

        return `"${apt.folio}","${apt.scheduledDate}","${apt.client.name}","${apt.client.phone}","${apt.vehicle.brand} ${apt.vehicle.model} ${apt.vehicle.year}","${apt.vehicle.plates}","${option}",${total},${labor},${parts},"${method}","${status}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `corte_contable_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Contabilidad */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Control Financiero & Cobranza
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresos liquidados, desglose de mano de obra neta y costo de partes OEM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Cards (Clean, Centered & Generous Margins) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cobrado */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-500">
              Total Cobrado
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight py-1">
            ${totalPaid.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">MXN</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Proyectado: <span className="font-mono font-bold text-slate-700">${totalRevenue.toLocaleString()} MXN</span>
          </p>
        </div>

        {/* Cobrado en Línea */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-500">
              En Línea / Card
            </span>
            <CreditCard className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight py-1">
            ${totalPaidOnline.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">MXN</span>
          </div>
          <p className="text-xs text-slate-500">
            Mercado Pago / Tarjetas
          </p>
        </div>

        {/* Cobrado en Sitio */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-500">
              En Sitio / Terminal
            </span>
            <Banknote className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight py-1">
            ${totalPaidOnSite.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">MXN</span>
          </div>
          <p className="text-xs text-slate-500">
            Terminal móvil o efectivo
          </p>
        </div>

        {/* Pendiente por Cobrar */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-500">
              Por Liquidar
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700 font-mono tracking-tight py-1">
            ${totalPending.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">MXN</span>
          </div>
          <p className="text-xs text-slate-500">
            Órdenes en proceso
          </p>
        </div>
      </div>

      {/* Margen Ejecutivo: Refacciones vs Mano de Obra */}
      <div className="bg-[#08101E] text-white p-6 sm:p-7 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
              Rendimiento Operativo
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Separación de margen de mano de obra y costo de insumos certificados.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-800/90 px-6 py-3.5 rounded-xl border border-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Mano de Obra</span>
            <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">${totalLaborRevenue.toLocaleString()} MXN</span>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Refacciones</span>
            <span className="text-base font-bold text-slate-200 font-mono mt-0.5 block">${totalPartsCost.toLocaleString()} MXN</span>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar transacción por folio, cliente, vehículo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({quotedAppointments.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'paid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pagados ({quotedAppointments.filter((a) => a.paymentStatus === 'paid').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendientes ({quotedAppointments.filter((a) => a.paymentStatus === 'pending').length})
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Contable */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4">Folio & Fecha</th>
                <th className="py-3 px-4">Cliente & Auto</th>
                <th className="py-3 px-4">Paquete</th>
                <th className="py-3 px-4 text-right">M. de Obra</th>
                <th className="py-3 px-4 text-right">Refacciones</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Método</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron transacciones contables.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const total = getAppointmentAmount(apt);
                  const labor = getLaborAmount(apt);
                  const parts = getPartsAmount(apt);
                  const isPaid = apt.paymentStatus === 'paid';

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-900 block">{apt.folio}</span>
                        <span className="text-[10px] text-slate-400">{apt.scheduledDate}</span>
                      </td>

                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{apt.client.name}</strong>
                        <span className="text-[11px] text-slate-500">
                          {apt.vehicle.brand} {apt.vehicle.model} ({apt.vehicle.plates})
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {apt.selectedOption === 'agencia' ? 'Agencia OEM' : 'De Autor'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${labor.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${parts.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-xs">
                        ${total.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="text-[11px] text-slate-600 font-mono">
                          {apt.paymentMethod === 'online_card'
                            ? 'En Línea'
                            : apt.paymentMethod === 'on_site_card'
                            ? 'Terminal'
                            : 'Efectivo'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{isPaid ? 'Pagado' : 'Pendiente'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAppointmentForReceipt(apt)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition cursor-pointer mx-auto block"
                          title="Ver Comprobante"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Recibo Contable */}
      {selectedAppointmentForReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Comprobante de Servicio & Pago
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {selectedAppointmentForReceipt.folio}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente:</span>
                <strong className="text-slate-900">{selectedAppointmentForReceipt.client.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehículo:</span>
                <span className="text-slate-800">
                  {selectedAppointmentForReceipt.vehicle.brand} {selectedAppointmentForReceipt.vehicle.model} ({selectedAppointmentForReceipt.vehicle.plates})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha:</span>
                <span className="font-mono text-slate-800">{selectedAppointmentForReceipt.scheduledDate}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Importe Liquidado:</span>
                <strong className="font-mono text-slate-900 font-bold">
                  ${getAppointmentAmount(selectedAppointmentForReceipt).toLocaleString()} MXN
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Imprimir Recibo</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAppointmentForReceipt(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
