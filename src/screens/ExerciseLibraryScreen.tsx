import React, { useState, useMemo } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Exercise, MuscleGroup, EquipmentType } from '../types';
import { Search, Plus, Dumbbell, Filter, Info, ChevronRight, X, Check } from 'lucide-react';

const CATEGORIES: ('Todos' | MuscleGroup)[] = [
  'Todos',
  'Pecho',
  'Espalda',
  'Cuádriceps',
  'Isquios y Glúteo',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Core y Abdomen'
];

interface ExerciseLibraryScreenProps {
  onSelectExercise?: (exercise: Exercise) => void;
  isSelectionMode?: boolean;
}

export const ExerciseLibraryScreen: React.FC<ExerciseLibraryScreenProps> = ({ 
  onSelectExercise,
  isSelectionMode = false 
}) => {
  const { exercises, addExercise, activeWorkout, addExerciseToActiveWorkout } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | MuscleGroup>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('Todos');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Nuevo ejercicio state
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState<MuscleGroup>('Pecho');
  const [newExEquipment, setNewExEquipment] = useState<EquipmentType>('Mancuerna');
  const [newExMuscle, setNewExMuscle] = useState('');
  const [newExTips, setNewExTips] = useState('');

  const normalizeText = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Filtrado reactivo en tiempo real con normalización de tildes
  const filteredExercises = useMemo(() => {
    const term = normalizeText(searchTerm.trim());
    return exercises.filter(ex => {
      const name = normalizeText(ex.name);
      const muscle = normalizeText(ex.targetMuscle);
      const category = normalizeText(ex.category);
      const equipment = normalizeText(ex.equipment);

      const matchesSearch = !term || 
        name.includes(term) || 
        muscle.includes(term) || 
        category.includes(term) || 
        equipment.includes(term);
      
      const matchesCategory = selectedCategory === 'Todos' || ex.category === selectedCategory;
      const matchesEquipment = selectedEquipment === 'Todos' || ex.equipment === selectedEquipment;

      return matchesSearch && matchesCategory && matchesEquipment;
    });
  }, [exercises, searchTerm, selectedCategory, selectedEquipment]);

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    addExercise({
      name: newExName.trim(),
      category: newExCategory,
      equipment: newExEquipment,
      targetMuscle: newExMuscle.trim() || newExCategory,
      tips: newExTips.trim() || 'Controla la fase excéntrica y mantén rango de movimiento completo.',
      defaultRepsMin: 8,
      defaultRepsMax: 12
    });

    setShowCreateModal(false);
    setNewExName('');
    setNewExMuscle('');
    setNewExTips('');
  };

  const handleAddToActiveWorkout = (ex: Exercise) => {
    if (activeWorkout) {
      addExerciseToActiveWorkout(ex);
      setActiveExerciseModal(null);
      if (onSelectExercise) onSelectExercise(ex);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Catálogo Oficial
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Ejercicios ({exercises.length})
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 active:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Crear
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar ejercicio (ej. press banca con mancuernas)..."
          className="w-full bg-[#1C1C1E] border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Muscle Category Chips Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                : 'bg-[#1C1C1E] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="space-y-2 pt-1">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12 bg-[#1C1C1E] rounded-2xl border border-white/5 p-6">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2.5" />
            <h3 className="text-sm font-bold text-white mb-1">No se encontraron ejercicios</h3>
            <p className="text-xs text-slate-400 mb-4">
              ¿No está en el catálogo? Puedes agregarlo como ejercicio personalizado.
            </p>
            <button
              onClick={() => {
                setNewExName(searchTerm);
                setShowCreateModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
            >
              + Crear "{searchTerm || 'Nuevo Ejercicio'}"
            </button>
          </div>
        ) : (
          filteredExercises.map(ex => (
            <div
              key={ex.id}
              onClick={() => {
                if (isSelectionMode && onSelectExercise) {
                  onSelectExercise(ex);
                } else {
                  setActiveExerciseModal(ex);
                }
              }}
              className="p-3.5 rounded-2xl bg-[#1C1C1E] active:bg-[#252528] border border-white/5 hover:border-white/10 flex items-center justify-between transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2C2C2E] flex items-center justify-center text-cyan-400 font-bold group-hover:scale-105 transition shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-400 transition">
                    {ex.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {ex.category}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#2C2C2E] text-slate-300 font-medium">
                      {ex.equipment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeWorkout && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToActiveWorkout(ex);
                    }}
                    className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold transition"
                    title="Agregar a sesión activa"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Exercise Detail Modal */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-slideUp">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeExerciseModal.category}
                </span>
                <span className="text-xs text-slate-400">
                  {activeExerciseModal.equipment}
                </span>
              </div>
              <button 
                onClick={() => setActiveExerciseModal(null)}
                className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {activeExerciseModal.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Músculo principal: <strong className="text-slate-200">{activeExerciseModal.targetMuscle}</strong>
              </p>
              {activeExerciseModal.secondaryMuscles && activeExerciseModal.secondaryMuscles.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Secundarios: {activeExerciseModal.secondaryMuscles.join(', ')}
                </p>
              )}
            </div>

            {/* Biomechanical Tips */}
            <div className="p-3.5 rounded-2xl bg-[#252528] border border-white/5 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Tips de Ejecución Técnica
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeExerciseModal.tips}
              </p>
            </div>

            {/* Overload Target Specs */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Rango Hipertrófico Base</div>
                <div className="text-base font-black text-white">
                  {activeExerciseModal.defaultRepsMin} - {activeExerciseModal.defaultRepsMax} Reps
                </div>
              </div>
              <span className="text-xs text-cyan-300 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                Doble Progresión
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2.5">
              {activeWorkout ? (
                <button
                  onClick={() => handleAddToActiveWorkout(activeExerciseModal)}
                  className="w-full py-3 rounded-2xl bg-cyan-500 active:bg-cyan-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  Agregar al Entrenamiento Activo
                </button>
              ) : (
                <button
                  onClick={() => setActiveExerciseModal(null)}
                  className="w-full py-3 rounded-2xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-bold text-sm transition"
                >
                  Cerrar
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Create Custom Exercise Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-slideUp">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Crear Ejercicio</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Nombre del Ejercicio *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Press inclinado en máquina Smith"
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Grupo Muscular</label>
                  <select
                    value={newExCategory}
                    onChange={e => setNewExCategory(e.target.value as MuscleGroup)}
                    className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Equipamiento</label>
                  <select
                    value={newExEquipment}
                    onChange={e => setNewExEquipment(e.target.value as EquipmentType)}
                    className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {['Mancuerna', 'Barra', 'Máquina', 'Polea', 'Peso Corporal', 'Kettlebell'].map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Músculo Específico Enfocado</label>
                <input
                  type="text"
                  placeholder="ej. Pectoral clavicular superior"
                  value={newExMuscle}
                  onChange={e => setNewExMuscle(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Consejo Técnico o Posición</label>
                <textarea
                  rows={2}
                  placeholder="ej. Banco a 30°, retraer escápulas y controlar la bajada."
                  value={newExTips}
                  onChange={e => setNewExTips(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
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
                  className="flex-1 py-3 rounded-xl bg-cyan-500 active:bg-cyan-400 text-black font-black text-sm shadow-lg shadow-cyan-500/25"
                >
                  Guardar Ejercicio
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
