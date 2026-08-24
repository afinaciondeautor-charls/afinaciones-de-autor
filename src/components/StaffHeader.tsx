'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Shield, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import NotificationDrawer from './NotificationDrawer';

export default function StaffHeader() {
  const { notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="bg-[#08101E] text-white border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Volver al Sitio Web */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-medium"
              title="Volver al Portal Público"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Sitio Web</span>
            </Link>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                AA
              </div>
              <span className="font-bold text-xs sm:text-sm text-white tracking-tight">
                PORTAL OPERATIVO
              </span>
            </div>
          </div>

          {/* Right: Centro de Mensajes / Notificaciones */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mensajes</span>
              {notifications.length > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
