import React from 'react';
import { Home, Dumbbell, Play, Search, TrendingUp } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

export type TabType = 'home' | 'routines' | 'workout' | 'exercises' | 'analytics';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab }) => {
  const { activeWorkout } = useWorkout();

  const tabs = [
    { id: 'home' as TabType, label: 'Inicio', icon: Home },
    { id: 'routines' as TabType, label: 'Rutinas', icon: Dumbbell },
    { 
      id: 'workout' as TabType, 
      label: 'Entrenar', 
      icon: Play,
      isAction: true,
      hasActive: !!activeWorkout
    },
    { id: 'exercises' as TabType, label: 'Ejercicios', icon: Search },
    { id: 'analytics' as TabType, label: 'Progreso', icon: TrendingUp },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0C]/95 backdrop-blur-2xl border-t border-white/[0.08]"
      style={{ bottom: 0, paddingBottom: 'max(env(safe-area-inset-bottom, 14px), 14px)' }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-3 pt-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group transition active:scale-95 px-2"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-black shadow-cyan-500/50 ring-4 ring-black scale-105' 
                    : tab.hasActive
                    ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-black shadow-cyan-500/40 animate-pulse'
                    : 'bg-[#18181B] text-cyan-400 border border-white/10 shadow-lg'
                }`}>
                  <Icon className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className={`text-[10px] font-black mt-1 tracking-tight ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {tab.hasActive ? 'En Curso' : tab.label}
                </span>
                {tab.hasActive && (
                  <span className="absolute top-0 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
