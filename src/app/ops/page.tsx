'use client';

import React, { useState } from 'react';
import { Wrench, ShieldAlert, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StaffHeader from '@/components/StaffHeader';
import PinAuthModal from '@/components/PinAuthModal';

export default function OpsHubPage() {
  const { appointments } = useApp();
  const pendingQuotes = appointments.filter((a) => a.status === 'solicitud_pendiente');

  const [authRole, setAuthRole] = useState<'admin' | 'technician' | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      <StaffHeader />

      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        <div className="text-center space-y-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-mono">
            Centro de Operaciones
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Portal Operativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Acceso seguro para técnicos en campo y administradores de taller.
          </p>
        </div>

        {/* Tarjetas de Acceso Principal con Autenticación por PIN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Tarjeta 1: Técnico PWA */}
          <button
            type="button"
            onClick={() => setAuthRole('technician')}
            className="group text-left bg-white border border-slate-200/90 hover:border-slate-400 rounded-3xl p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between cursor-pointer active:scale-98"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black group-hover:bg-[#08101E] group-hover:text-amber-400 transition shadow-2xs">
                <Wrench className="w-6 h-6 text-slate-800 group-hover:text-amber-400 transition" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Técnico PWA
                  </h2>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Requiere PIN</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Herramienta mobile-first para el técnico en domicilio: Check-in de llegada y odómetro, bitácora de fotos Antes/Después, checklist de refacciones, firma digital en pantalla y reporte PDF.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-slate-900 group-hover:text-amber-700 transition">
              <span>Ingresar con PIN</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Tarjeta 2: Panel Admin */}
          <button
            type="button"
            onClick={() => setAuthRole('admin')}
            className="group text-left bg-white border border-slate-200/90 hover:border-slate-400 rounded-3xl p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between cursor-pointer active:scale-98"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black group-hover:bg-[#08101E] group-hover:text-amber-400 transition shadow-2xs">
                <ShieldAlert className="w-6 h-6 text-slate-800 group-hover:text-amber-400 transition" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Panel Admin
                  </h2>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Requiere PIN</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bandeja para cotizar solicitudes entrantes por VIN, control de agenda, asignación de horarios, métricas financieras, fidelización y gestión de equipo.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-slate-900 group-hover:text-amber-700 transition">
              <span>Ingresar con PIN {pendingQuotes.length > 0 && `(${pendingQuotes.length} pendientes)`}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </main>

      {/* Modal de PIN */}
      {authRole && (
        <PinAuthModal
          isOpen={!!authRole}
          onClose={() => setAuthRole(null)}
          targetRole={authRole}
        />
      )}
    </div>
  );
}
