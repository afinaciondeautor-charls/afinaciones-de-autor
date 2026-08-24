'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  existingSignature?: string;
  clientName?: string;
}

export default function SignaturePad({ onSave, existingSignature, clientName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!existingSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#001E50'; // Volkswagen Deep Blue ink
    ctx.lineWidth = 3;

    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width * 2, rect.height * 2);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[#001E50] text-sm sm:text-base font-black">
          <PenTool className="w-5 h-5 text-[#00509E]" />
          <span>Firma Digital de Conformidad</span>
        </div>
        {clientName && (
          <span className="text-xs text-slate-600 font-medium">Cliente: <strong className="text-slate-900">{clientName}</strong></span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-600 mb-3">
        Firme con el dedo en la pantalla para validar la recepción de su servicio y sellar la póliza de garantía.
      </p>

      {/* Signature Canvas Area */}
      <div className="relative w-full h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden shadow-inner touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Guideline watermark */}
        <div className="absolute bottom-6 inset-x-8 border-b border-slate-300 pointer-events-none flex justify-between text-xs text-slate-400 font-bold">
          <span>X___________________________</span>
          <span>Firma del Cliente</span>
        </div>

        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs sm:text-sm font-medium text-slate-400">
            Trace su firma aquí con su dedo
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={clearCanvas}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Borrar y Repetir</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
          {hasDrawn && (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Firma registrada OK</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
