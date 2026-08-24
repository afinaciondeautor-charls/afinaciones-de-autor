'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, MessageSquare, Mail, Bell, CheckCircle2, Clock, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: Props) {
  const { notifications } = useApp();
  const [filterChannel, setFilterChannel] = useState<'all' | 'whatsapp' | 'email'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filterChannel === 'all') return true;
    return n.channel === filterChannel;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl text-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#001E50] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#FFC72C]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight">Motor de Notificaciones</h2>
              <p className="text-xs text-blue-200">Mensajería transaccional & Follow-up</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setFilterChannel('all')}
            className={`px-3 py-1.5 text-xs rounded-xl transition font-bold ${
              filterChannel === 'all'
                ? 'bg-[#001E50] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({notifications.length})
          </button>
          <button
            onClick={() => setFilterChannel('whatsapp')}
            className={`px-3 py-1.5 text-xs rounded-xl transition font-bold flex items-center gap-1.5 ${
              filterChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button
            onClick={() => setFilterChannel('email')}
            className={`px-3 py-1.5 text-xs rounded-xl transition font-bold flex items-center gap-1.5 ${
              filterChannel === 'email'
                ? 'bg-[#00509E] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email (Resend)
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No hay notificaciones registradas en este canal.
            </div>
          ) : (
            filtered.map((item) => {
              const isWhatsApp = item.channel === 'whatsapp';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all text-xs shadow-xs ${
                    isWhatsApp
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      {isWhatsApp ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                          <Smartphone className="w-3 h-3 text-emerald-600" /> WhatsApp Cloud API
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-[#00509E] text-[10px] font-black border border-blue-200">
                          <Mail className="w-3 h-3 text-[#00509E]" /> Resend Email
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp ? format(new Date(item.timestamp), 'HH:mm dd MMM', { locale: es }) : 'Ahora'}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-700 font-mono whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200 shadow-2xs leading-relaxed">
                    {item.message}
                  </div>
                  <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Para: <strong className="text-slate-800">{item.recipient}</strong></span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Entregado
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
