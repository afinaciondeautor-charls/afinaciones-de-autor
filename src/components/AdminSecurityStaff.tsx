'use client';

import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle2,
  RotateCcw,
  Wrench,
  ShieldAlert,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StaffMember } from '@/types';

export default function AdminSecurityStaff() {
  const {
    securitySettings,
    updateSecuritySettings,
    addStaffMember,
    updateStaffMember,
    removeStaffMember,
  } = useApp();

  // PIN states
  const [adminPinInput, setAdminPinInput] = useState(securitySettings?.adminPin || '123456');
  const [techPinInput, setTechPinInput] = useState(securitySettings?.technicianPin || '123456');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showTechPin, setShowTechPin] = useState(false);
  const [pinSavedFeedback, setPinSavedFeedback] = useState(false);

  // New staff modal/form
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'technician'>('technician');
  const [newPin, setNewPin] = useState('');
  const [formError, setFormError] = useState('');

  const handleSavePins = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput.trim().length < 4 || techPinInput.trim().length < 4) {
      alert('Los PINs deben tener al menos 4 a 6 dígitos numéricos.');
      return;
    }

    updateSecuritySettings({
      adminPin: adminPinInput.trim(),
      technicianPin: techPinInput.trim(),
    });

    setPinSavedFeedback(true);
    setTimeout(() => setPinSavedFeedback(false), 3000);
  };

  const handleResetPinsDefault = () => {
    if (confirm('¿Restablecer los PINs de Administrador y Técnico al valor por defecto (123456)?')) {
      setAdminPinInput('123456');
      setTechPinInput('123456');
      updateSecuritySettings({
        adminPin: '123456',
        technicianPin: '123456',
      });
      setPinSavedFeedback(true);
      setTimeout(() => setPinSavedFeedback(false), 3000);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newName.trim()) {
      setFormError('Por favor ingresa el nombre del colaborador.');
      return;
    }
    if (!newPhone.trim()) {
      setFormError('Por favor ingresa el teléfono / WhatsApp.');
      return;
    }

    addStaffMember({
      name: newName.trim(),
      phone: newPhone.trim(),
      role: newRole,
      status: 'active',
      pin: newPin.trim() || undefined,
    });

    setNewName('');
    setNewPhone('');
    setNewPin('');
    setShowAddStaffModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior */}
      <div className="bg-[#08101E] text-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-800 space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400">
          <KeyRound className="w-4 h-4" />
          <h2 className="text-sm sm:text-base font-bold tracking-tight">
            Seguridad de Acceso & Gestión de Equipo
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl">
          Configura las contraseñas numéricas (PIN) para el ingreso a la Consola Técnico y Panel Admin, y administra los miembros autorizados de tu equipo de trabajo.
        </p>
      </div>

      {pinSavedFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Contraseñas y PINs de acceso actualizados correctamente!</span>
        </div>
      )}

      {/* 1. SECCIÓN DE PINS DE ACCESO */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-700" />
              <span>1. Contraseñas de Acceso (PIN Numérico)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              PIN requerido para abrir el Panel Admin o la Consola de Técnico desde el Portal Operativo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetPinsDefault}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer a 123456</span>
          </button>
        </div>

        <form onSubmit={handleSavePins} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PIN Panel Admin */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>PIN Panel Admin:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAdminPin(!showAdminPin)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  {showAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <input
                type={showAdminPin ? 'text' : 'password'}
                maxLength={6}
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg px-3 py-2 text-base font-bold font-mono text-slate-900 tracking-widest focus:outline-hidden"
                placeholder="123456"
                required
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                PIN de 4 a 6 dígitos para administradores
              </span>
            </div>

            {/* PIN Técnico PWA */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-600" />
                  <span>PIN Técnico PWA:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowTechPin(!showTechPin)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  {showTechPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <input
                type={showTechPin ? 'text' : 'password'}
                maxLength={6}
                value={techPinInput}
                onChange={(e) => setTechPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg px-3 py-2 text-base font-bold font-mono text-slate-900 tracking-widest focus:outline-hidden"
                placeholder="123456"
                required
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                PIN de 4 a 6 dígitos para técnicos en campo
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Guardar Nuevas Contraseñas</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. SECCIÓN DE GESTIÓN DE EQUIPO / USUARIOS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-700" />
              <span>2. Directorio de Colaboradores (Técnicos & Administradores)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal autorizado para realizar visitas a domicilio o administrar la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddStaffModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer active:scale-95 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Agregar Colaborador</span>
          </button>
        </div>

        {/* Lista de Miembros */}
        <div className="space-y-3">
          {(securitySettings?.staffMembers || []).map((member) => (
            <div
              key={member.id}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-bold font-mono text-sm flex items-center justify-center shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full font-mono ${
                        member.role === 'admin'
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {member.role === 'admin' ? 'Administrador' : 'Técnico Master Tech'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Activo" />
                  </div>

                  <p className="text-xs text-slate-600 font-mono mt-0.5 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{member.phone}</span>
                    {member.pin && (
                      <span className="text-slate-400 text-[10px]">• PIN Personal: {member.pin}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    const newPhone = prompt('Editar teléfono de ' + member.name, member.phone);
                    if (newPhone) {
                      updateStaffMember(member.id, { phone: newPhone });
                    }
                  }}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg text-xs transition"
                  title="Editar colaborador"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Eliminar a ' + member.name + ' del equipo?')) {
                      removeStaffMember(member.id);
                    }
                  }}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs transition"
                  title="Eliminar colaborador"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Agregar Miembro */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-slate-900" />
                <h3 className="text-sm font-bold text-slate-900">
                  Agregar Nuevo Colaborador
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre Completo *:
                </label>
                <input
                  type="text"
                  placeholder="ej. Juan Pérez"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teléfono / WhatsApp *:
                </label>
                <input
                  type="tel"
                  placeholder="ej. +52 55 1234 5678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rol en el Taller / Operación:
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'technician')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
                >
                  <option value="technician">🛠️ Técnico Master Tech (En Domicilio)</option>
                  <option value="admin">💼 Administrador / Staff de Taller</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  PIN Personal de 6 Dígitos (Opcional):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="ej. 654321 (Opcional)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono tracking-widest focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition"
                >
                  Guardar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
