'use client';

import React, { useState } from 'react';
import { Lock, X, ArrowRight, ShieldCheck, Wrench, ShieldAlert, KeyRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRole: 'admin' | 'technician';
}

export default function PinAuthModal({ isOpen, onClose, targetRole }: Props) {
  const router = useRouter();
  const { verifyAccessPin } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const title = targetRole === 'admin' ? 'Panel de Administración' : 'Consola Técnico Móvil';
  const Icon = targetRole === 'admin' ? ShieldAlert : Wrench;
  const redirectUrl = targetRole === 'admin' ? '/admin' : '/tecnico';

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 6) {
        // Auto verify upon 6th digit
        if (verifyAccessPin(targetRole, newPin)) {
          router.push(redirectUrl);
          onClose();
        } else {
          setError(true);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAccessPin(targetRole, pin)) {
      router.push(redirectUrl);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-[#08101E] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shrink-0">
              <Icon className="w-4 h-4 text-[#08101E]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                Acceso a {title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Introduce el PIN de 6 dígitos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Entry Area */}
        <div className="p-6 space-y-5 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
              <Lock className="w-5 h-5 text-slate-700" />
            </div>
            <p className="text-xs text-slate-600">
              Ingresa tu código de seguridad
            </p>
          </div>

          {/* PIN Dots Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isFilled = i < pin.length;
              return (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    error
                      ? 'bg-rose-500 scale-110 animate-bounce'
                      : isFilled
                      ? 'bg-slate-900 scale-110'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600 animate-in fade-in">
              PIN incorrecto. Intenta nuevamente.
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleKeyPress(n)}
                className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-base font-bold font-mono text-slate-900 transition flex items-center justify-center cursor-pointer mx-auto shadow-2xs"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="w-16 h-12 rounded-2xl text-[11px] font-bold text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer mx-auto"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-base font-bold font-mono text-slate-900 transition flex items-center justify-center cursor-pointer mx-auto shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-16 h-12 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer mx-auto"
            >
              ⌫
            </button>
          </div>

          {/* Hint */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-mono">
              PIN por defecto inicial: <strong className="text-slate-700">123456</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
