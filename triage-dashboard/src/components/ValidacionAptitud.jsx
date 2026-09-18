"use client";
import React, { useState } from 'react';

export default function ValidacionAptitud({ nombreEstudiante = "Cristobal Gutierrez", nivelSugeridoIA = 'A3' }) {
  const [nivelSeleccionado, setNivelSeleccionado] = useState(nivelSugeridoIA);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const niveles = [
    { id: 'A1', label: 'Riesgo', txt: 'text-red-600', borderActivo: 'border-red-600', bgActivo: 'bg-red-50' },
    { id: 'A2', label: 'Precaución', txt: 'text-orange-500', borderActivo: 'border-orange-500', bgActivo: 'bg-orange-50' },
    { id: 'A3', label: 'Apto', txt: 'text-yellow-500', borderActivo: 'border-yellow-500', bgActivo: 'bg-yellow-50' },
    { id: 'A4', label: 'Apto', txt: 'text-green-600', borderActivo: 'border-green-600', bgActivo: 'bg-green-50' },
  ];

  const handleSeleccion = (id) => {
    setNivelSeleccionado(id);
    setMostrarConfirmacion(id !== nivelSugeridoIA);
  };

  const getLabel = (id) => niveles.find(n => n.id === id)?.label;

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-bold text-slate-800">Validar aptitud</h3>
        <span className="text-sm text-slate-400 font-medium">Confirma o ajusta la clasificación IA</span>
      </div>

      <div className="flex gap-3">
        {niveles.map((nivel) => {
          const activo = nivelSeleccionado === nivel.id;
          return (
             <button key={nivel.id} onClick={() => handleSeleccion(nivel.id)} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-200 bg-white ${activo ? `${nivel.borderActivo} ${nivel.bgActivo}` : `border-slate-100 hover:border-slate-300 hover:bg-slate-50`}`}>
              <span className={`text-xl font-bold ${activo ? nivel.txt : nivel.txt}`}>{nivel.id}</span>
              <span className="text-xs font-semibold mt-1 text-slate-600">{nivel.label}</span>
            </button>
          );
        })}
      </div>

      {mostrarConfirmacion && (
        <div className="mt-5 bg-slate-50 rounded-xl p-4 border-l-4 border-orange-500 shadow-sm animate-fade-in-up">
          <p className="text-sm text-slate-700 mb-2">Validar aptitud de <strong>{nombreEstudiante}</strong> como <strong className="text-orange-500">{getLabel(nivelSeleccionado)}</strong>. Difiere de la clasificación IA ({getLabel(nivelSugeridoIA)} moderado).</p>
          <p className="text-sm text-slate-500 mb-4">Al confirmar se registra tu decisión final y se guarda el registro del estudiante.</p>
          <div className="flex gap-3">
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors">Confirmar y registrar</button>
            <button onClick={() => handleSeleccion(nivelSugeridoIA)} className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}