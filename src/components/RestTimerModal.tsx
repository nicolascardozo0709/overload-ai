import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Clock, Plus, Minus, X, Bell } from 'lucide-react';

export const RestTimerModal: React.FC = () => {
  const { restTimer, stopRestTimer, adjustRestTimer } = useWorkout();

  if (!restTimer.active || restTimer.remainingSeconds <= 0) return null;

  const minutes = Math.floor(restTimer.remainingSeconds / 60);
  const seconds = restTimer.remainingSeconds % 60;
  const progressPercent = ((restTimer.totalSeconds - restTimer.remainingSeconds) / restTimer.totalSeconds) * 100;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-bounce-short">
      <div className="bg-[#1C1C1E] border border-cyan-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between">
        
        {/* Left: Timer visual */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-11 h-11 transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#2C2C2E"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#0A84FF"
                strokeWidth="3.5"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <Clock className="w-4 h-4 text-cyan-400 absolute" />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Bell className="w-3 h-3 text-cyan-400 animate-pulse" /> Descanso Activo
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tight">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>
        </div>

        {/* Right: Quick Adjust Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => adjustRestTimer(-15)}
            className="w-8 h-8 rounded-full bg-[#2C2C2E] active:bg-[#3A3A3C] text-slate-300 flex items-center justify-center text-xs font-bold transition"
            title="-15 seg"
          >
            -15s
          </button>
          <button
            onClick={() => adjustRestTimer(30)}
            className="w-8 h-8 rounded-full bg-[#2C2C2E] active:bg-[#3A3A3C] text-cyan-400 flex items-center justify-center text-xs font-bold transition"
            title="+30 seg"
          >
            +30s
          </button>
          <button
            onClick={stopRestTimer}
            className="w-8 h-8 rounded-full bg-red-500/20 active:bg-red-500/30 text-red-400 flex items-center justify-center ml-1 transition"
            title="Saltar descanso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
