'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Wrench, ShieldAlert, Bell, RotateCcw } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

export default function RoleSwitcher() {
  const { activeRole, setActiveRole, notifications, resetToMockData } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-xs py-2.5 px-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#001E50] flex items-center justify-center font-black text-[#FFC72C] text-sm shadow-md">
              A
            </div>
            <div>
              <span className="font-black tracking-tight text-[#001E50] text-sm sm:text-base block leading-none">
                AFINACIONES <span className="text-amber-500">DE AUTOR</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 hidden sm:inline">
                Mecánica de Precisión a Domicilio
              </span>
            </div>
          </div>

          {/* Quick Role Navigation */}
          <nav aria-label="Selector de rol" className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <Link
              href="/"
              onClick={() => setActiveRole('client')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
                pathname === '/' || pathname.startsWith('/seguimiento')
                  ? 'bg-[#001E50] text-[#FFC72C] shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </Link>

            <Link
              href="/tecnico"
              onClick={() => setActiveRole('technician')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
                pathname.startsWith('/tecnico')
                  ? 'bg-[#00509E] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Técnico PWA</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
                pathname.startsWith('/admin')
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-2 rounded-xl border border-amber-200 transition-colors font-bold text-xs"
              title="Notificaciones WhatsApp / Email"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Notificaciones</span>
              {notifications.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[10px]">
                  {notifications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (confirm('¿Restablecer datos de prueba a valores iniciales?')) {
                  resetToMockData();
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Restablecer datos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
