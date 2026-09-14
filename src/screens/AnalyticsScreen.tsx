import React, { useState, useMemo } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { calculate1RM } from '../services/progressiveOverloadAI';
import { storageService } from '../services/storageService';
import { 
  TrendingUp, 
  Flame, 
  Award, 
  Calendar, 
  Download, 
  Upload, 
  ChevronDown, 
  Dumbbell, 
  Clock,
  Sparkles
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { workoutHistory, exercises, stats } = useWorkout();

  // Ejercicio seleccionado para ver la gráfica de sobrecarga progresiva
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ex-pecho-01');

  // Obtener puntos históricos de 1RM para el ejercicio seleccionado
  const exercise1RMHistory = useMemo(() => {
    const points: { date: string; weightKg: number; reps: number; oneRM: number }[] = [];

    // Ordenar cronológicamente
    const sortedHistory = [...workoutHistory]
      .filter(w => w.completed)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    sortedHistory.forEach(session => {
      const foundEx = session.exercises.find(e => e.exerciseId === selectedExerciseId);
      if (foundEx) {
        const completedSets = foundEx.sets.filter(s => s.completed && s.reps > 0 && s.weightKg > 0);
        if (completedSets.length > 0) {
          // Tomar el mejor 1RM de esa sesión
          const bestSet = completedSets.sort((a, b) => calculate1RM(b.weightKg, b.reps) - calculate1RM(a.weightKg, a.reps))[0];
          const oneRM = calculate1RM(bestSet.weightKg, bestSet.reps);
          const dateStr = new Date(session.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
          points.push({
            date: dateStr,
            weightKg: bestSet.weightKg,
            reps: bestSet.reps,
            oneRM
          });
        }
      }
    });

    return points;
  }, [workoutHistory, selectedExerciseId]);

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId);

  // Calcular mejora porcentual de 1RM
  const percentageImprovement = useMemo(() => {
    if (exercise1RMHistory.length < 2) return null;
    const first = exercise1RMHistory[0].oneRM;
    const latest = exercise1RMHistory[exercise1RMHistory.length - 1].oneRM;
    if (first <= 0) return null;
    const diff = Math.round(((latest - first) / first) * 100);
    return diff;
  }, [exercise1RMHistory]);

  const handleExportData = () => {
    const backupJson = storageService.exportBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overload-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Progreso y Métricas
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Sobrecarga y Rachas 📈
        </h1>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1C1E] to-[#141416] border border-orange-500/20 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-orange-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Racha</div>
            <div className="text-lg font-black text-white">{stats.streakDays} Días</div>
          </div>
        </div>

        {/* Total volume card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1C1E] to-[#141416] border border-cyan-500/20 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Volumen</div>
            <div className="text-lg font-black text-white">
              {(stats.totalVolumeKg / 1000).toFixed(1)}k kg
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Overload Chart Section */}
      <div className="rounded-3xl p-5 bg-[#1C1C1E] border border-white/10 shadow-xl space-y-4">
        
        {/* Exercise Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Evolución de Fuerza (1RM)
              </div>
              <h3 className="text-sm font-black text-white truncate max-w-[200px]">
                {selectedExercise?.name}
              </h3>
            </div>
          </div>

          {percentageImprovement !== null && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
              percentageImprovement >= 0 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {percentageImprovement >= 0 ? `+${percentageImprovement}%` : `${percentageImprovement}%`}
            </span>
          )}
        </div>

        {/* Dropdown to pick which exercise to chart */}
        <div className="relative">
          <select
            value={selectedExerciseId}
            onChange={e => setSelectedExerciseId(e.target.value)}
            className="w-full bg-[#252528] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 appearance-none pr-8 cursor-pointer"
          >
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.category})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* SVG Interactive Line Chart */}
        <div className="pt-2">
          {exercise1RMHistory.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl p-4 text-xs text-slate-500">
              Aún no has registrado series completadas para este ejercicio. Al entrenar y completar series, aquí se graficará automáticamente tu sobrecarga.
            </div>
          ) : exercise1RMHistory.length === 1 ? (
            <div className="text-center py-8 bg-[#252528] rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-cyan-400">Primer registro de 1RM:</span>
              <div className="text-2xl font-black text-white">{exercise1RMHistory[0].oneRM} kg</div>
              <p className="text-[11px] text-slate-400">
                Marca: {exercise1RMHistory[0].weightKg} kg × {exercise1RMHistory[0].reps} reps ({exercise1RMHistory[0].date}).
                ¡Completa otra sesión para ver tu curva de mejora!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* SVG Curve */}
              <div className="h-44 w-full relative pt-4 pb-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 140">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#2C2C2E" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="320" y2="70" stroke="#2C2C2E" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="320" y2="120" stroke="#2C2C2E" strokeDasharray="3 3" />

                  {/* Compute Points */}
                  {(() => {
                    const min = Math.min(...exercise1RMHistory.map(p => p.oneRM)) * 0.9;
                    const max = Math.max(...exercise1RMHistory.map(p => p.oneRM)) * 1.1;
                    const range = max - min || 1;

                    const coords = exercise1RMHistory.map((p, idx) => {
                      const x = (idx / (exercise1RMHistory.length - 1)) * 300 + 10;
                      const y = 120 - ((p.oneRM - min) / range) * 100;
                      return { x, y, p };
                    });

                    const pathD = coords.reduce((acc, curr, idx) => {
                      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                    }, '');

                    return (
                      <>
                        {/* Area gradient under line */}
                        <path
                          d={`${pathD} L ${coords[coords.length - 1].x} 130 L ${coords[0].x} 130 Z`}
                          fill="url(#cyanGradient)"
                          opacity="0.25"
                        />
                        <defs>
                          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0A84FF" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Polyline */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#0A84FF"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Point Circles */}
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r="5"
                              fill="#000000"
                              stroke="#0A84FF"
                              strokeWidth="3"
                            />
                            <text
                              x={c.x}
                              y={c.y - 10}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              {c.p.oneRM}k
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Date labels below */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                {exercise1RMHistory.map((h, i) => (
                  <span key={i}>{h.date}</span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Workout History List */}
      <div className="rounded-3xl p-5 bg-[#1C1C1E] border border-white/10 shadow-xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Historial de Sesiones ({workoutHistory.length})
        </h3>

        {workoutHistory.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            Aún no has finalizado entrenamientos.
          </div>
        ) : (
          <div className="space-y-2.5">
            {workoutHistory.slice(0, 5).map(session => (
              <div 
                key={session.id}
                className="p-3.5 rounded-2xl bg-[#252528] border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {session.routineName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {new Date(session.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{session.exercises.length} ejercicios registrados</span>
                  <span className="font-bold text-cyan-400">
                    {session.totalVolumeKg.toLocaleString()} kg volumen
                  </span>
                </div>

                {session.aiFeedbackSummary && (
                  <div className="text-[11px] text-slate-300 bg-black/20 p-2 rounded-xl flex items-center gap-1.5 mt-1 border border-white/5">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{session.aiFeedbackSummary}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management & Backup */}
      <div className="pt-2">
        <button
          onClick={handleExportData}
          className="w-full py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#252528] border border-white/10 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          Descargar Copia de Seguridad (JSON)
        </button>
      </div>

    </div>
  );
};
