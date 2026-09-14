import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { ProfileModal } from '../components/ProfileModal';
import { 
  Flame, 
  Trophy, 
  Play, 
  Sparkles, 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  Award,
  Zap,
  ChevronDown,
  Plus
} from 'lucide-react';

interface HomeScreenProps {
  onNavigateTab: (tab: 'home' | 'routines' | 'workout' | 'exercises' | 'analytics') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateTab }) => {
  const { stats, routines, workoutHistory, activeWorkout, startWorkout, activeProfile } = useWorkout();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleStartRoutine = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (routine) {
      startWorkout(routine);
      onNavigateTab('workout');
    }
  };

  const recentWorkout = workoutHistory[0];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-fadeIn">
      
      {/* Top Header / User Profile Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18181B] border border-white/10 hover:border-cyan-400/40 active:scale-95 transition text-[11px] font-bold text-slate-300 shadow-sm mb-1"
          >
            <span className="text-sm">{activeProfile.avatarEmoji}</span>
            <span className="text-white font-black">{activeProfile.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            ¡A Entrenar! 💥
          </h1>
        </div>

        {/* Level / Points Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-cyan-400" />
          <span>{stats.points} PTS</span>
        </div>
      </div>

      {/* Streak & Consistency Card (Rachas) */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1C1C1E] via-[#161618] to-[#121214] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Racha Actual</div>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                {stats.streakDays} <span className="text-sm font-semibold text-slate-400">días seguidos</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-400">Meta Semanal</div>
            <div className="text-sm font-black text-cyan-400">
              {stats.weeklyCompleted} / {stats.weeklyGoal} sesiones
            </div>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="w-full bg-[#2C2C2E] h-2.5 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (stats.weeklyCompleted / stats.weeklyGoal) * 100)}%` }}
          ></div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>{stats.weeklyCompleted >= stats.weeklyGoal ? '🎉 ¡Meta semanal alcanzada!' : `Faltan ${stats.weeklyGoal - stats.weeklyCompleted} días para completar la semana`}</span>
          <span className="font-semibold text-white">{stats.totalWorkouts} entrenos totales</span>
        </div>
      </div>

      {/* Active Workout Resumed Card or Start Today Workout */}
      {activeWorkout ? (
        <div className="rounded-3xl p-5 bg-gradient-to-r from-cyan-950/70 via-[#121620] to-[#121214] border border-cyan-500/40 shadow-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              Sesión en Curso
            </div>
            <h3 className="text-lg font-black text-white">{activeWorkout.routineName}</h3>
            <p className="text-xs text-slate-400">
              {activeWorkout.exercises.length} ejercicios en entrenamiento
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('workout')}
            className="px-5 py-3 rounded-2xl bg-cyan-400 active:bg-cyan-300 text-black font-black text-xs flex items-center gap-1.5 shadow-xl shadow-cyan-500/30 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Continuar
          </button>
        </div>
      ) : (
        <div className="rounded-3xl p-5 bg-[#121214] border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-400" />
              Entrenar Hoy
            </h2>
            <button 
              onClick={() => onNavigateTab('routines')}
              className="text-xs font-bold text-cyan-400 flex items-center gap-0.5 hover:underline"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Routines List or Empty State */}
          {routines.length === 0 ? (
            <div className="text-center py-7 px-4 rounded-2xl bg-[#18181B] border border-dashed border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                <Plus className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white">Sin rutinas configuradas</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Pásale tus rutinas al chat para cargarlas o crea una desde cero a tu medida.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('routines')}
                className="px-4 py-2 rounded-xl bg-cyan-400 active:bg-cyan-300 text-black font-black text-xs shadow-lg shadow-cyan-500/25 transition active:scale-95"
              >
                + Crear Mi Primera Rutina
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {routines.slice(0, 3).map(r => (
                <div 
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#18181B] active:bg-[#202024] border border-white/[0.06] hover:border-white/10 flex items-center justify-between transition cursor-pointer group"
                  onClick={() => handleStartRoutine(r.id)}
                >
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shrink-0"
                      style={{ backgroundColor: r.color }}
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition">{r.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{r.description}</p>
                    </div>
                  </div>

                  <span className="shrink-0 ml-2 text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition flex items-center gap-1">
                    Iniciar <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Daily Coach Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1A1429] via-[#13111C] to-[#0D0D10] border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-300">
            Consejo del Día • Sobrecarga Progresiva
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed italic">
          "La sobrecarga progresiva no solo es subir peso. Si la semana pasada hiciste <strong className="text-white font-bold not-italic">6 repeticiones</strong> con 30 kg en press banca con mancuernas, tu mayor victoria de hoy es sacar <strong className="text-cyan-400 font-black not-italic">7 repeticiones limpias</strong>. Una sola repetición extra es una señal inequívoca de hipertrofia y adaptación muscular."
        </p>
      </div>

      {/* Recent Activity Quick Peek */}
      {recentWorkout && (
        <div className="rounded-2xl p-4 bg-[#18181B] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Última Sesión</span>
            <span>{new Date(recentWorkout.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">{recentWorkout.routineName}</div>
              <div className="text-xs text-slate-400">
                Volumen total: <strong className="text-cyan-400 font-semibold">{recentWorkout.totalVolumeKg.toLocaleString()} kg</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-bold text-slate-300 bg-[#252528] hover:bg-[#2C2C2E] px-3 py-1.5 rounded-lg transition"
            >
              Ver Análisis ➔
            </button>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

    </div>
  );
};
