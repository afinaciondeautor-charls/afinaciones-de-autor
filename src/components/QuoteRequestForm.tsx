'use client';

import React, { useState } from 'react';
import { Car, User, ArrowRight, Sparkles, Gauge } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  referenceNotes: string;
  brand: string;
  model: string;
  year: number;
  plates: string;
  vin: string;
  currentKm: number;
}

interface Props {
  onSubmitData: (data: FormData) => void;
}

export default function QuoteRequestForm({ onSubmitData }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [referenceNotes, setReferenceNotes] = useState('');

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [plates, setPlates] = useState('');
  const [currentKm, setCurrentKm] = useState<number | ''>('');
  const [vin, setVin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitData({
      name,
      phone,
      email,
      address,
      referenceNotes,
      brand,
      model,
      year: Number(year) || new Date().getFullYear(),
      plates,
      currentKm: Number(currentKm) || 0,
      vin: vin.toUpperCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SERVICIO OFICIAL: AFINACIÓN DE AUTOR */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-400 p-5 rounded-3xl space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-base font-black text-[#001E50]">Servicio: Afinación de Autor</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Servicio mecánico integral y personalizado con refacciones certificadas, diagnóstico por escáner OBD-II, bitácora de evidencias fotográficas y garantía legal por escrito.
        </p>
      </div>

      {/* 1. DATOS DEL VEHÍCULO, KILOMETRAJE Y NÚMERO DE SERIE / VIN */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#001E50] font-black text-base border-b border-slate-100 pb-3">
          <Car className="w-5 h-5 text-[#00509E]" />
          <span>1. Ficha del Auto, Kilometraje & Número de Serie / VIN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Marca (ej. Volkswagen, BMW, Mazda)
            </label>
            <input
              type="text"
              required
              placeholder="Volkswagen"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Modelo / Versión
            </label>
            <input
              type="text"
              required
              placeholder="Golf GTI / Jetta / CX-5"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Año del Vehículo
            </label>
            <input
              type="number"
              required
              min={1990}
              max={2027}
              value={year}
              onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Placas
            </label>
            <input
              type="text"
              required
              placeholder="NZA-48-22"
              value={plates}
              onChange={(e) => setPlates(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base font-mono uppercase text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#001E50] mb-1.5 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[#00509E]" />
              <span>Kilometraje Actual:</span>
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={0}
                placeholder="ej. 45000"
                value={currentKm}
                onChange={(e) => setCurrentKm(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">
                KM
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#001E50] mb-1.5 flex items-center justify-between">
              <span>Número de Serie / VIN:</span>
              <span className="text-[10px] text-slate-500 font-normal">17 dígitos</span>
            </label>
            <input
              type="text"
              required
              maxLength={17}
              placeholder="3VW2T7AU8MM054129"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              className="w-full bg-amber-50/50 border-2 border-amber-400 focus:bg-white rounded-xl px-4 py-3.5 text-base font-mono uppercase text-[#001E50] font-black tracking-wider focus:outline-hidden focus:border-[#001E50] focus:ring-2 focus:ring-amber-400/30 transition"
            />
          </div>
        </div>
      </div>

      {/* 2. DATOS DE CONTACTO Y DIRECCIÓN */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#001E50] font-black text-base border-b border-slate-100 pb-3">
          <User className="w-5 h-5 text-[#00509E]" />
          <span>2. Datos de Contacto y Dirección a Domicilio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Carlos Mendoza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Teléfono WhatsApp
            </label>
            <input
              type="tel"
              required
              placeholder="+52 55 4123 9876"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="carlos@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Dirección Exacta (Calle, Número, Colonia, Alcaldía/Municipio)
          </label>
          <input
            type="text"
            required
            placeholder="Av. Insurgentes Sur 1450, Col. Actipan, Benito Juárez, CDMX"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Referencias de Acceso (Cochera, portón, timbre, etc.)
          </label>
          <input
            type="text"
            placeholder="Cochera techada, portón gris, timbre 201..."
            value={referenceNotes}
            onChange={(e) => setReferenceNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-4 py-3.5 text-base text-slate-900 focus:outline-hidden focus:border-[#00509E] focus:ring-2 focus:ring-[#00509E]/20 transition"
          />
        </div>
      </div>

      {/* NEXT STEP BUTTON */}
      <button
        type="submit"
        className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-[#001E50] hover:bg-[#00509E] text-[#FFC72C] font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 transition-all cursor-pointer transform active:scale-[0.99]"
      >
        <span>Solicitar Cotización</span>
      </button>
    </form>
  );
}
