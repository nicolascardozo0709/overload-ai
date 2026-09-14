import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Exercise } from '../types';
import { getAIAdviceForExercise, calculate1RM } from '../services/progressiveOverloadAI';
import { AICoachBanner } from '../components/AICoachBanner';
import { ExerciseLibraryScreen } from './ExerciseLibraryScreen';
import { 
  Play, 
  Check, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  Trophy, 
  X, 
  AlertCircle,
  TrendingUp,
  Dumbbell
} from 'lucide-react';

interface ActiveWorkoutScreenProps {
  onFinishWorkout: () => void;
  onNavigateTab: (tab: 'home' | 'routines' | 'workout' | 'exercises' | 'analytics') => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({ 
  onFinishWorkout,
  onNavigateTab 
}) => {
  const { 
    activeWorkout, 
    workoutHistory,
    addSetToExercise, 
    updateSet, 
    removeSet, 
    finishWorkout, 
    cancelWorkout,
    addExerciseToActiveWorkout,
    startWorkout
  } = useWorkout();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showAddExercisePicker, setShowAddExercisePicker] = useState(false);
  const [showFinishSummary, setShowFinishSummary] = useState<{
    pointsEarned: number;
    prsAchieved: number;
    feedback: string;
  } | null>(null);

  // Timer del entrenamiento transcurrido
  useEffect(() => {
    if (!activeWorkout) return;

    const startMs = new Date(activeWorkout.startTime).getTime();
    const interval = setInterval(() => {
      const nowMs = Date.now();
      setElapsedSeconds(Math.floor((nowMs - startMs) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <div className="pb-24 pt-16 px-4 max-w-md mx-auto text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-cyan-400 mx-auto shadow-xl">
          <Dumbbell className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">No hay entrenamiento en curso</h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Selecciona una de tus rutinas o inicia una sesión libre para que la Inteligencia Artificial registre tu sobrecarga progresiva.
        </p>

        <div className="pt-4 flex flex-col gap-2.5">
          <button
            onClick={() => onNavigateTab('routines')}
            className="w-full py-3.5 rounded-2xl bg-cyan-500 active:bg-cyan-400 text-black font-black text-sm shadow-lg shadow-cyan-500/25 transition active:scale-98"
          >
            Elegir una Rutina ➔
          </button>
          <button
            onClick={() => {
              startWorkout();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#1C1C1E] border border-white/10 active:bg-[#2C2C2E] text-white font-bold text-sm transition"
          >
            Iniciar Entrenamiento Libre
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleCompleteWorkout = () => {
    const summary = finishWorkout();
    setShowFinishSummary(summary);
  };

  return (
    <div className="pb-32 pt-4 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      
      {/* Top Session Bar */}
      <div className="flex items-center justify-between bg-[#1C1C1E] border border-white/10 rounded-2xl p-3.5 shadow-lg">
        <div>
          <div className="text-[10px] font-extrabold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            En Vivo
          </div>
          <h2 className="text-base font-black text-white tracking-tight truncate max-w-[170px]">
            {activeWorkout.routineName}
          </h2>
        </div>

        {/* Timer & Finish button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#252528] text-xs font-mono font-bold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={handleCompleteWorkout}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 active:bg-emerald-400 text-black font-black text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            Finalizar
          </button>
        </div>
      </div>

      {/* Exercises in Session */}
      {activeWorkout.exercises.length === 0 ? (
        <div className="text-center py-10 bg-[#1C1C1E] border border-dashed border-white/10 rounded-3xl p-6 space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">Tu sesión está vacía</h3>
          <p className="text-xs text-slate-400">
            Agrega ejercicios para empezar a registrar series, pesos y ver los consejos de sobrecarga de la IA.
          </p>
          <button
            onClick={() => setShowAddExercisePicker(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-black text-xs flex items-center gap-1.5 mx-auto"
          >
            <Plus className="w-4 h-4" /> Agregar Ejercicio
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeWorkout.exercises.map((exerciseLog, exIdx) => {
            // Obtener el consejo de la IA para este ejercicio
            const aiAdvice = getAIAdviceForExercise(
              exerciseLog.exerciseId,
              exerciseLog.exerciseName,
              6,
              8,
              workoutHistory
            );

            return (
              <div 
                key={exerciseLog.exerciseId + exIdx}
                className="rounded-3xl bg-[#1C1C1E] border border-white/5 shadow-xl p-4 space-y-3 relative overflow-hidden"
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {exerciseLog.category}
                    </span>
                    <h3 className="text-base font-black text-white tracking-tight">
                      {exerciseLog.exerciseName}
                    </h3>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2C2C2E] text-slate-300 font-semibold">
                    {exerciseLog.sets.length} series
                  </span>
                </div>

                {/* IA Coach Banner for this exercise */}
                <AICoachBanner advice={aiAdvice} />

                {/* Sets Table */}
                <div className="space-y-2 pt-1">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-1.5 text-[11px] font-bold text-slate-400 px-2">
                    <span className="col-span-2 text-center">SERIE</span>
                    <span className="col-span-3 text-center">ANTERIOR</span>
                    <span className="col-span-3 text-center">PESO (KG)</span>
                    <span className="col-span-2 text-center">REPS</span>
                    <span className="col-span-2 text-center">ESTADO</span>
                  </div>

                  {/* Sets Rows */}
                  {exerciseLog.sets.map((set, setIdx) => {
                    // Comparar si supera la sesión previa para marcar feedback visual
                    const isOverloadAchieved = aiAdvice.previousRecord 
                      ? (set.weightKg > aiAdvice.previousRecord.weightKg || 
                         (set.weightKg === aiAdvice.previousRecord.weightKg && set.reps > aiAdvice.previousRecord.reps))
                      : false;

                    return (
                      <div 
                        key={set.id}
                        className={`grid grid-cols-12 gap-1.5 items-center p-2 rounded-xl transition ${
                          set.completed 
                            ? 'bg-[#252528] border border-cyan-500/30' 
                            : 'bg-[#161618] border border-white/5'
                        }`}
                      >
                        {/* Set # */}
                        <span className="col-span-2 text-center font-bold text-xs text-slate-400">
                          {set.setNumber}
                        </span>

                        {/* Previous Benchmark */}
                        <div className="col-span-3 text-center text-[10px] text-slate-400 font-mono">
                          {aiAdvice.previousRecord ? (
                            <span>{aiAdvice.previousRecord.weightKg}k × {aiAdvice.previousRecord.reps}</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>

                        {/* Weight Input */}
                        <div className="col-span-3">
                          <input
                            type="number"
                            step="0.5"
                            placeholder="0"
                            value={set.weightKg === 0 ? '' : set.weightKg}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              updateSet(exIdx, setIdx, { weightKg: val });
                            }}
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl py-2 text-center text-sm font-black text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* Reps Input */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="0"
                            value={set.reps === 0 ? '' : set.reps}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              updateSet(exIdx, setIdx, { reps: val });
                            }}
                            className={`w-full bg-[#1C1C1E] border rounded-xl py-2 text-center text-sm font-black text-white focus:outline-none ${
                              isOverloadAchieved ? 'border-emerald-400 text-emerald-400' : 'border-white/10 focus:border-cyan-400'
                            }`}
                          />
                        </div>

                        {/* Complete Button Checkbox (Large Touch Target) */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => {
                              updateSet(exIdx, setIdx, { completed: !set.completed });
                            }}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90 shadow-md ${
                              set.completed
                                ? 'bg-emerald-400 text-black shadow-emerald-500/40 ring-2 ring-emerald-400/30'
                                : 'bg-[#1C1C1E] border border-white/10 text-slate-500 hover:text-white'
                            }`}
                          >
                            <Check className="w-5 h-5 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add / Remove Set Row Buttons */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    onClick={() => addSetToExercise(exIdx)}
                    className="flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1.5 rounded-lg active:bg-cyan-500/10"
                  >
                    <Plus className="w-4 h-4" /> Agregar Serie
                  </button>

                  {exerciseLog.sets.length > 1 && (
                    <button
                      onClick={() => removeSet(exIdx, exerciseLog.sets.length - 1)}
                      className="text-slate-500 hover:text-red-400 px-2 py-1"
                    >
                      Eliminar última serie
                    </button>
                  )}
                </div>

              </div>
            );
          })}

          {/* Add Another Exercise to Workout Button */}
          <button
            onClick={() => setShowAddExercisePicker(true)}
            className="w-full py-3.5 rounded-2xl bg-[#1C1C1E] border border-cyan-500/30 text-cyan-400 active:bg-[#2C2C2E] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Agregar Otro Ejercicio a esta Sesión
          </button>

          {/* Cancel Workout link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                if (window.confirm('¿Deseas cancelar el entrenamiento actual? Los datos no guardados se perderán.')) {
                  cancelWorkout();
                }
              }}
              className="text-xs text-red-400/80 hover:text-red-300 font-semibold"
            >
              Descartar entrenamiento actual
            </button>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 max-w-md mx-auto w-full">
            <h3 className="text-base font-black text-white">Agregar Ejercicio</h3>
            <button
              onClick={() => setShowAddExercisePicker(false)}
              className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full pt-2">
            <ExerciseLibraryScreen
              isSelectionMode={true}
              onSelectExercise={(ex) => {
                addExerciseToActiveWorkout(ex);
                setShowAddExercisePicker(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Workout Completion Summary Modal */}
      {showFinishSummary && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1C1C1E] border border-cyan-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/30 animate-bounce-short">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                ¡Entrenamiento Completado!
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                +{showFinishSummary.pointsEarned} Puntos
              </h2>
            </div>

            {/* AI Summary Card */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Sparkles className="w-4 h-4" /> Feedback de la IA:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{showFinishSummary.feedback}"
              </p>
            </div>

            <button
              onClick={() => {
                setShowFinishSummary(null);
                onFinishWorkout();
                onNavigateTab('home');
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 active:bg-cyan-400 text-black font-black text-sm shadow-lg shadow-cyan-500/25 transition active:scale-98"
            >
              Ver Mi Racha y Progreso ➔
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
