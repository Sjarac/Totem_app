"use client";
import React, { useState, useEffect } from 'react';
import ValidacionAptitud from './ValidacionAptitud';

export default function DashboardAptitud() {
  const [colaEstudiantes, setColaEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    // Conexión con tu backend en Python FastAPI
    const socket = new WebSocket('ws://localhost:8000/ws/dashboard');

    socket.onmessage = (event) => {
      const nuevoEstudiante = JSON.parse(event.data);
      setColaEstudiantes((prevCola) => [nuevoEstudiante, ...prevCola]);
      setEstudianteSeleccionado((prev) => prev ? prev : nuevoEstudiante);
    };

    return () => socket.close();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col font-sans">
      <div className="flex gap-4 mb-6">
        {[
          { l: 'POR VALIDAR', v: colaEstudiantes.length, c: 'text-slate-800' },
          { l: 'VALIDADOS', v: '0', c: 'text-green-500' }, 
          { l: 'DERIVADOS', v: '0', c: 'text-red-500' }, 
          { l: 'CON ALERTA', v: colaEstudiantes.filter(e => e.alerta).length, c: 'text-orange-400' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm flex-1 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 block mb-1">{kpi.l}</span>
            <span className={`text-2xl font-bold ${kpi.c}`}>{kpi.v}</span>
          </div>
        ))}
      </div>

      <main className="flex gap-6 h-[calc(100vh-160px)]">
        
        {/* Columna Izquierda: Cola */}
        <section className="w-[450px] flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <h2 className="text-sm font-bold mb-4 text-slate-800">Distribución de aptitud</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><span className="w-24 text-slate-600">Riesgo alto</span><div className="flex-1 bg-slate-100 h-2 rounded-full"></div><span className="text-slate-400">0</span></div>
              <div className="flex items-center gap-3"><span className="w-24 text-slate-600">Precaución</span><div className="flex-1 bg-slate-100 h-2 rounded-full"><div className="bg-orange-500 w-1/4 h-2 rounded-full"></div></div><span className="text-slate-400">0</span></div>
              <div className="flex items-center gap-3"><span className="w-24 text-slate-600">Apto moderado</span><div className="flex-1 bg-slate-100 h-2 rounded-full"><div className="bg-yellow-500 w-2/5 h-2 rounded-full"></div></div><span className="text-slate-400">0</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-0 border border-slate-100 flex-1 overflow-y-auto">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-800">Cola de evaluación</h2>
                <span className="text-xs text-slate-400">{colaEstudiantes.length} estudiantes</span>
             </div>
             
             {colaEstudiantes.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Esperando evaluaciones desde el Tótem...
                </div>
             )}

             {colaEstudiantes.map((estudiante, index) => (
               <div key={index} onClick={() => setEstudianteSeleccionado(estudiante)} className={`p-4 flex items-center gap-3 cursor-pointer border-b border-slate-100 transition-colors ${estudianteSeleccionado?.id === estudiante.id ? 'bg-orange-50 border-l-4 border-orange-400' : 'bg-white hover:bg-slate-50 border-l-4 border-transparent'}`}>
                  <div className={`w-10 h-10 text-white font-bold rounded-lg flex items-center justify-center ${estudiante.iaSugerida === 'A2' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                    {estudiante.iaSugerida}
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-800 text-sm">{estudiante.nombre}</span>
                       <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">SUGERIDA</span>
                       {estudiante.alerta && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">{estudiante.alerta}</span>}
                     </div>
                     <div className="text-xs text-slate-500 mt-0.5">{estudiante.objetivo} · {estudiante.carrera}</div>
                  </div>
                  <div className="text-right text-xs">
                     <div className="font-medium text-slate-700">{estudiante.id}</div>
                     <div className="text-slate-400">{estudiante.tiempoEspera}</div>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Columna Derecha: Detalle Dinámico */}
        <section className="flex-1 bg-white rounded-xl shadow-sm p-8 border border-slate-100 overflow-y-auto">
          {estudianteSeleccionado ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{estudianteSeleccionado.nombre}</h1>
                  <p className="text-sm text-slate-500 font-mono mt-1">{estudianteSeleccionado.id} · {estudianteSeleccionado.edad} años · {estudianteSeleccionado.carrera}</p>
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">Tomar caso</button>
              </div>

              <div className={`${estudianteSeleccionado.iaSugerida === 'A2' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'} rounded-xl p-5 border mb-6`}>
                 <div className="flex justify-between items-center mb-3">
                   <span className={`text-xs font-bold uppercase tracking-wider ${estudianteSeleccionado.iaSugerida === 'A2' ? 'text-orange-800' : 'text-yellow-800'}`}>Clasificación IA · Aptitud Física</span>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                     CONFIANZA <div className={`w-16 h-1.5 rounded-full ${estudianteSeleccionado.iaSugerida === 'A2' ? 'bg-orange-500' : 'bg-red-500'}`}></div> 70%
                   </div>
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 text-white font-bold text-xl rounded-xl flex items-center justify-center ${estudianteSeleccionado.iaSugerida === 'A2' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                      {estudianteSeleccionado.iaSugerida}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{estudianteSeleccionado.iaSugerida === 'A2' ? 'Precaución' : 'Apto moderado'}</h3>
                      <p className="text-sm text-slate-600">Revisión recomendada antes del esfuerzo</p>
                    </div>
                 </div>
                 {estudianteSeleccionado.alerta && (
                   <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg flex gap-2 items-start mt-2">
                     <span className="font-bold">⚠</span>
                     <p>Confianza bajo el umbral: presenta {estudianteSeleccionado.salud.sintomas.length} síntoma(s) de riesgo. Derivar a evaluación profesional.</p>
                   </div>
                 )}
              </div>

              <div className="mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Mediciones del tótem</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-slate-200 p-3 rounded-lg bg-white"><span className="text-[10px] font-bold text-slate-400 block mb-1">PA</span><span className="text-xl font-bold text-slate-800">{estudianteSeleccionado.mediciones?.presionSys || '--'}/{estudianteSeleccionado.mediciones?.presionDia || '--'}</span> <span className="text-xs text-slate-400 ml-1">mmHg</span></div>
                  <div className="border border-slate-200 p-3 rounded-lg bg-white"><span className="text-[10px] font-bold text-slate-400 block mb-1">FC REPOSO</span><span className="text-xl font-bold text-slate-800">{estudianteSeleccionado.mediciones?.fcReposo || '--'}</span> <span className="text-xs text-slate-400 ml-1">lpm</span></div>
                  <div className="border border-slate-200 p-3 rounded-lg bg-white"><span className="text-[10px] font-bold text-slate-400 block mb-1">FC RECUP.</span><span className="text-xl font-bold text-slate-800">{estudianteSeleccionado.mediciones?.fcRecup || '--'}</span> <span className="text-xs text-slate-400 ml-1">lpm</span></div>
                  <div className="border border-slate-200 p-3 rounded-lg bg-white"><span className="text-[10px] font-bold text-slate-400 block mb-1">IMC</span><span className="text-xl font-bold text-slate-800">{estudianteSeleccionado.mediciones?.imc || '--'}</span> <span className="text-xs text-slate-400 ml-1">kg/m²</span></div>
                  <div className="border border-slate-200 p-3 rounded-lg bg-white"><span className="text-[10px] font-bold text-slate-400 block mb-1">GRASA</span><span className="text-xl font-bold text-slate-800">{estudianteSeleccionado.mediciones?.grasa || '--'}</span> <span className="text-xs text-slate-400 ml-1">%</span></div>
                  <div className="border border-slate-200 p-3 rounded-lg bg-white"><span className="text-[10px] font-bold text-slate-400 block mb-1">VO₂ MÁX</span><span className="text-xl font-bold text-slate-800">{estudianteSeleccionado.mediciones?.vo2Max || '--'}</span> <span className="text-xs text-slate-400 ml-1">ml/kg</span></div>
                </div>
              </div>

              <div className="mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Objetivo y cuestionario</span>
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">{estudianteSeleccionado.objetivo}</span>
                   {estudianteSeleccionado.salud?.sintomas?.map((sintoma, idx) => (<span key={idx} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-xs rounded-full font-medium">{sintoma}</span>))}
                   {estudianteSeleccionado.salud?.condiciones?.map((cond, idx) => (<span key={idx} className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 text-xs rounded-full font-medium">{cond}</span>))}
                </div>
              </div>
              <ValidacionAptitud nombreEstudiante={estudianteSeleccionado.nombre} nivelSugeridoIA={estudianteSeleccionado.iaSugerida} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <span className="text-4xl mb-4">📋</span>
               <p>Esperando que un estudiante termine su evaluación en el tótem.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}