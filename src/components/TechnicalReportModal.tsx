'use client';

import React from 'react';
import { Appointment } from '@/types';
import { X, Printer, CheckCircle2, Shield, MapPin, Gauge, UserCheck, MessageSquare, Download } from 'lucide-react';
import { formatDisplayDate } from '@/lib/dateUtils';
import { getWhatsAppCompletedLink } from '@/lib/whatsapp';

interface Props {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

export default function TechnicalReportModal({ appointment, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const record = appointment.serviceRecord;
  const quote = appointment.quote;
  const chosenQuote =
    appointment.selectedOption === 'agencia' ? quote?.agency : quote?.premium;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 sm:backdrop-blur-xs flex items-center justify-center p-0 sm:p-6 print:p-0 print:bg-white animate-in fade-in">
      {/* Modal Container: Fullscreen on Mobile, Rounded Card on Desktop */}
      <div className="bg-white border-0 sm:border border-slate-200 w-full h-full sm:h-auto sm:max-h-[94vh] sm:max-w-4xl sm:rounded-3xl rounded-none shadow-2xl overflow-hidden flex flex-col print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none text-slate-900">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#08101E] text-white no-print shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <h2 className="font-bold text-xs sm:text-sm text-white truncate">
                Reporte Técnico Certificado
              </h2>
              <span className="text-[10px] sm:text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono font-bold whitespace-nowrap shrink-0 border border-slate-700">
                {appointment.folio}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Botón WhatsApp */}
              <a
                href={getWhatsAppCompletedLink(appointment)}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-2xs cursor-pointer active:scale-95"
                title="Enviar Reporte Técnico por WhatsApp al Cliente"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Enviar WhatsApp</span>
              </a>

              {/* Botón Imprimir */}
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Report Scrollable Body (Safe area for iPhone scrolling) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-10 pb-28 sm:pb-10 space-y-6 sm:space-y-8 bg-white print:p-8">
          {/* 1. MEMBRETE Y ENCABEZADO */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#08101E] text-amber-400 font-black text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0">
                AA
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  AFINACIONES DE AUTOR
                </h1>
                <p className="text-xs text-amber-800 font-bold font-mono">
                  Mecánica de Precisión a Domicilio • Certificación Oficial
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  WhatsApp Directo: +52 55 9876 5432 • www.afinacionesdeautor.com
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto text-left sm:text-right bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-0.5 font-mono">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Folio de Certificación
              </div>
              <div className="text-base sm:text-xl font-bold text-slate-900 whitespace-nowrap">
                {appointment.folio}
              </div>
              <div className="text-xs text-slate-600">
                Fecha: {formatDisplayDate(appointment.scheduledDate)}
              </div>
            </div>
          </div>

          {/* 2. DATOS DEL CLIENTE Y VEHÍCULO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Cliente */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[10px] font-mono">
                <UserCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Titular del Vehículo</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{appointment.client?.name || 'Cliente'}</div>
              <div className="text-slate-600 font-mono">Tel: {appointment.client?.phone || 'N/D'}</div>
              <div className="text-slate-600">{appointment.client?.email || ''}</div>
              <div className="text-slate-600 flex items-start gap-1 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{appointment.client?.address || 'Domicilio'}</span>
              </div>
            </div>

            {/* Vehículo */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[10px] font-mono">
                <Gauge className="w-3.5 h-3.5 text-slate-700" />
                <span>Especificaciones del Auto</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {appointment.vehicle?.brand || 'Vehículo'} {appointment.vehicle?.model || ''} ({appointment.vehicle?.year || ''})
              </div>
              <div className="font-mono text-slate-600">Placas: {appointment.vehicle?.plates || 'S/P'}</div>
              <div className="font-mono text-slate-600">VIN: {appointment.vehicle?.vin || 'N/D'}</div>
              <div className="text-slate-600 font-mono pt-0.5">
                Odómetro de Entrada: <strong className="text-slate-900 font-bold">{record?.initialKm || appointment.vehicle?.currentKm || 'N/A'} KM</strong>
              </div>
            </div>
          </div>

          {/* 3. REFACCIONES INSTALADAS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Insumos & Refacciones Instaladas en Sitio</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4">Componente</th>
                      <th className="py-2.5 px-3 sm:px-4">Marca / Especificación</th>
                      <th className="py-2.5 px-3 sm:px-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {(record?.installedParts || [
                      { id: '1', name: 'Aceite 100% Sintético (4.5L)', brand: 'Motul 8100 5W-40', installed: true },
                      { id: '2', name: '4x Bujías Laser Iridium', brand: 'NGK Laser Iridium (0.8mm)', installed: true },
                      { id: '3', name: 'Filtro de Aceite Blindado', brand: 'Mann Filter W712', installed: true },
                      { id: '4', name: 'Filtro de Aire Motor', brand: 'Mann Filter Pro', installed: true },
                      { id: '5', name: 'Filtro de Cabina Carbón', brand: 'Mann Filter CUK', installed: true },
                    ]).map((part) => (
                      <tr key={part.id}>
                        <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">{part.name}</td>
                        <td className="py-2.5 px-3 sm:px-4 font-mono text-slate-600">{part.brand}</td>
                        <td className="py-2.5 px-3 sm:px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-emerald-800 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 whitespace-nowrap">
                            ✓ Instalado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. BITÁCORA DE EVIDENCIAS FOTOGRÁFICAS */}
          {record?.evidencePhotos && record.evidencePhotos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Evidencias Fotográficas (Antes vs Después)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {record.evidencePhotos.map((photo) => (
                  <div key={photo.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-slate-900">{photo.label}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {photo.beforePhotoUrl && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-rose-800 block font-mono">Antes:</span>
                          <img src={photo.beforePhotoUrl} alt="Antes" className="w-full h-24 object-cover rounded-xl border border-slate-200" />
                        </div>
                      )}
                      {photo.afterPhotoUrl && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block font-mono">Después:</span>
                          <img src={photo.afterPhotoUrl} alt="Después" className="w-full h-24 object-cover rounded-xl border border-slate-200" />
                        </div>
                      )}
                    </div>
                    {photo.notes && <p className="text-[11px] text-slate-600 italic mt-1">{photo.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. DIAGNÓSTICO Y RECOMENDACIONES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="font-bold uppercase tracking-wider text-slate-900 text-[10px] font-mono">
                Diagnóstico & Observaciones Técnicas:
              </div>
              <p className="text-slate-700 leading-relaxed text-xs">
                {record?.mechanicalObservations || 'Servicio de afinación mayor a domicilio completado satisfactoriamente.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-1">
              <div className="font-bold uppercase tracking-wider text-amber-950 text-[10px] font-mono">
                Recomendaciones para el Cliente:
              </div>
              <p className="text-slate-700 leading-relaxed text-xs">
                {record?.futureRecommendations || 'Realizar siguiente servicio en 6 meses o 10,000 KM.'}
              </p>
            </div>
          </div>

          {/* 6. PÓLIZA DE GARANTÍA Y FIRMAS */}
          <div className="border-t-2 pt-5 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#08101E] text-white p-4 sm:p-5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Shield className="w-7 h-7 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Póliza de Garantía por Escrito: {chosenQuote?.warrantyMonths || 12} Meses
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Cubre mano de obra y refacciones certificadas instaladas en sitio.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-800 text-amber-400 font-mono font-bold text-xs rounded-lg border border-slate-700 whitespace-nowrap">
                Garantía Certificada
              </span>
            </div>

            {/* Firmas */}
            <div className="grid grid-cols-2 gap-4 pt-3 text-center">
              <div className="space-y-1.5">
                <div className="h-16 flex items-center justify-center border-b border-slate-300 pb-2">
                  {record?.clientSignatureUrl ? (
                    <img src={record.clientSignatureUrl} alt="Firma Cliente" className="max-h-14 object-contain mx-auto" />
                  ) : (
                    <span className="text-xs text-slate-400 font-mono italic">Firma Digital Registrada</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 block truncate">{appointment.client?.name || 'Cliente'}</span>
                <span className="text-[10px] text-slate-500 font-mono block">Firma de Conformidad</span>
              </div>

              <div className="space-y-1.5">
                <div className="h-16 flex items-center justify-center border-b border-slate-300 pb-2">
                  <div className="font-mono font-bold text-xs text-slate-800 truncate">
                    {appointment.technicianName || 'Especialista de Autor'}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 block">Afinaciones de Autor</span>
                <span className="text-[10px] text-slate-500 font-mono block">Certificación Técnica</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating / Sticky Mobile Action Bar at Bottom of iPhone */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center gap-2 z-50">
          <a
            href={getWhatsAppCompletedLink(appointment)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition text-center"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Enviar por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="py-3 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs shrink-0"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shrink-0 border border-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
