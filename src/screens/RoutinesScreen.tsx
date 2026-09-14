import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Routine, Exercise } from '../types';
import { Play, Plus, Trash2, Edit3, Dumbbell, Clock, X, Check, Flame } from 'lucide-react';
import { ExerciseLibraryScreen } from './ExerciseLibraryScreen';

interface RoutinesScreenProps {
  onStartWorkout: () => void;
}

export const RoutinesScreen: React.FC<RoutinesScreenProps> = ({ onStartWorkout }) => {
  const { routines, exercises, addRoutine, deleteRoutine, startWorkout } = useWorkout();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [routineDesc, setRoutineDesc] = useState('');
  const [routineColor, setRoutineColor] = useState('#0A84FF');
  const [selectedExercises, setSelectedExercises] = useState<{
    exerciseId: string;
    targetSets: number;
    targetRepsMin: number;
    targetRepsMax: number;
    restSeconds: number;
  }[]>([]);

  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const handleStart = (routine: Routine) => {
    startWorkout(routine);
    onStartWorkout();
  };

  const handleAddExerciseToRoutine = (ex: Exercise) => {
    // Evitar duplicados
    if (selectedExercises.some(item => item.exerciseId === ex.id)) return;

    setSelectedExercises(prev => [
      ...prev,
      {
        exerciseId: ex.id,
        targetSets: 3,
        targetRepsMin: ex.defaultRepsMin || 8,
        targetRepsMax: ex.defaultRepsMax || 12,
        restSeconds: 90
      }
    ]);
    setShowExercisePicker(false);
  };

  const handleRemoveExerciseFromRoutine = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName.trim() || selectedExercises.length === 0) return;

    addRoutine({
      name: routineName.trim(),
      description: routineDesc.trim() || `${selectedExercises.length} ejercicios`,
      iconName: 'Flame',
      color: routineColor,
      exercises: selectedExercises
    });

    setShowCreateModal(false);
    setRoutineName('');
    setRoutineDesc('');
    setSelectedExercises([]);
  };

  const COLOR_OPTIONS = ['#FF6B00', '#0A84FF', '#30D158', '#AF52DE', '#FF2D55', '#FFCC00'];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Planificador
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Mis Rutinas ({routines.length})
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 active:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nueva Rutina
        </button>
      </div>

      {/* Routine Cards */}
      <div className="space-y-3 pt-1">
        {routines.length === 0 ? (
          <div className="text-center py-12 px-5 rounded-3xl bg-[#121214] border border-dashed border-white/10 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">No tienes rutinas todavía</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Pásame tus rutinas aquí en el chat para configurártelas de inmediato con sus ejercicios y sobrecarga progresiva, o pulsa el botón para crear una a tu gusto.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-2xl bg-cyan-400 active:bg-cyan-300 text-black font-black text-xs shadow-xl shadow-cyan-500/25 active:scale-95 transition"
            >
              + Crear Nueva Rutina
            </button>
          </div>
        ) : (
          routines.map(routine => {
            return (
              <div 
                key={routine.id}
                className="rounded-3xl p-5 bg-[#18181B] border border-white/5 hover:border-white/10 shadow-xl space-y-4 transition"
              >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: routine.color }}
                  >
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight">{routine.name}</h3>
                    <p className="text-xs text-slate-400">{routine.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteRoutine(routine.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition"
                  title="Eliminar rutina"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Exercises in routine preview */}
              <div className="space-y-1.5 pt-1">
                {routine.exercises.slice(0, 4).map((item, idx) => {
                  const exData = exercises.find(e => e.id === item.exerciseId);
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#252528]">
                      <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                        {exData?.name || 'Ejercicio'}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold shrink-0">
                        {item.targetSets} series × {item.targetRepsMin}-{item.targetRepsMax} reps
                      </span>
                    </div>
                  );
                })}
                {routine.exercises.length > 4 && (
                  <div className="text-[11px] text-center text-slate-400 font-semibold py-0.5">
                    + {routine.exercises.length - 4} ejercicios más
                  </div>
                )}
              </div>

              {/* Start Workout Button */}
              <button
                onClick={() => handleStart(routine)}
                className="w-full py-3 rounded-2xl bg-cyan-500 active:bg-cyan-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                Iniciar este Entrenamiento
              </button>
            </div>
          );
        }))}
      </div>

      {/* Create Routine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-slideUp">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Nueva Rutina</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoutine} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Nombre de la Rutina *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Torso Hipertrofia o Push A"
                  value={routineName}
                  onChange={e => setRoutineName(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="ej. Pecho, Espalda y Hombros pesado"
                  value={routineDesc}
                  onChange={e => setRoutineDesc(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Color Temático</label>
                <div className="flex gap-2.5">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setRoutineColor(c)}
                      className={`w-8 h-8 rounded-full transition ${routineColor === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#1C1C1E]' : 'opacity-70'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Exercises in Routine List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-400">
                    Ejercicios ({selectedExercises.length}) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExercisePicker(true)}
                    className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Ejercicio
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedExercises.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-xs text-slate-500">
                      No has agregado ejercicios todavía. Pulsa "+ Agregar Ejercicio".
                    </div>
                  ) : (
                    selectedExercises.map((item, idx) => {
                      const ex = exercises.find(e => e.id === item.exerciseId);
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-[#252528] border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate max-w-[220px]">
                              {idx + 1}. {ex?.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExerciseFromRoutine(idx)}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Sets and Reps Config */}
                          <div className="grid grid-cols-3 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block">Series:</span>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={item.targetSets}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 1;
                                  setSelectedExercises(prev => prev.map((it, i) => i === idx ? { ...it, targetSets: val } : it));
                                }}
                                className="w-full bg-[#1C1C1E] rounded-lg px-2 py-1 text-center text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-slate-400 block">Reps Mín:</span>
                              <input
                                type="number"
                                min={1}
                                max={30}
                                value={item.targetRepsMin}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 1;
                                  setSelectedExercises(prev => prev.map((it, i) => i === idx ? { ...it, targetRepsMin: val } : it));
                                }}
                                className="w-full bg-[#1C1C1E] rounded-lg px-2 py-1 text-center text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-slate-400 block">Reps Máx:</span>
                              <input
                                type="number"
                                min={1}
                                max={30}
                                value={item.targetRepsMax}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 1;
                                  setSelectedExercises(prev => prev.map((it, i) => i === idx ? { ...it, targetRepsMax: val } : it));
                                }}
                                className="w-full bg-[#1C1C1E] rounded-lg px-2 py-1 text-center text-white font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#2C2C2E] text-slate-300 font-bold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={selectedExercises.length === 0 || !routineName.trim()}
                  className="flex-1 py-3 rounded-xl bg-cyan-500 active:bg-cyan-400 disabled:opacity-50 text-black font-black text-sm shadow-lg shadow-cyan-500/25"
                >
                  Guardar Rutina
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Exercise Picker Modal for Routine */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 max-w-md mx-auto w-full">
            <h3 className="text-base font-black text-white">Selecciona Ejercicio para tu Rutina</h3>
            <button
              onClick={() => setShowExercisePicker(false)}
              className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full pt-2">
            <ExerciseLibraryScreen
              isSelectionMode={true}
              onSelectExercise={handleAddExerciseToRoutine}
            />
          </div>
        </div>
      )}

    </div>
  );
};
