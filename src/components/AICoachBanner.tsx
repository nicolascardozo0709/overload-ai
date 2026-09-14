import React from 'react';
import { AIAdvice } from '../types';
import { Sparkles, TrendingUp, Award, Target, Info } from 'lucide-react';

interface AICoachBannerProps {
  advice: AIAdvice;
  compact?: boolean;
}

export const AICoachBanner: React.FC<AICoachBannerProps> = ({ advice, compact = false }) => {
  const isIncreaseWeight = advice.type === 'increase_weight';
  const isIncreaseReps = advice.type === 'increase_reps';

  const badgeColors = isIncreaseWeight
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : isIncreaseReps
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';

  const cardGradient = isIncreaseWeight
    ? 'from-amber-950/40 to-[#1C1C1E] border-amber-500/30'
    : isIncreaseReps
    ? 'from-emerald-950/40 to-[#1C1C1E] border-emerald-500/30'
    : 'from-blue-950/40 to-[#1C1C1E] border-cyan-500/20';

  if (compact) {
    return (
      <div className={`p-2.5 rounded-xl border bg-gradient-to-r ${cardGradient} flex items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-tight">{advice.headline}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColors}`}>
          {advice.badgeText}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border bg-gradient-to-b ${cardGradient} p-4 shadow-lg backdrop-blur-md relative overflow-hidden`}>
      {/* Glow background accent */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header with badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Coach IA • Sobrecarga Progresiva
          </span>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${badgeColors} flex items-center gap-1`}>
          {isIncreaseWeight && <TrendingUp className="w-3.5 h-3.5" />}
          {isIncreaseReps && <Target className="w-3.5 h-3.5" />}
          {advice.badgeText}
        </span>
      </div>

      {/* Main Target Headline */}
      <h4 className="text-base font-black text-white tracking-tight mb-1.5 flex items-center gap-1.5">
        {advice.headline}
      </h4>

      {/* Speech Coach explanation */}
      <p className="text-xs text-slate-300 leading-relaxed font-normal bg-black/30 p-2.5 rounded-xl border border-white/5">
        "{advice.coachAdvice}"
      </p>

      {/* Prior Record info if available */}
      {advice.previousRecord && (
        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
          <Award className="w-3.5 h-3.5 text-yellow-400" />
          <span>Marca sesión anterior: <strong className="text-white font-semibold">{advice.previousRecord.weightKg} kg × {advice.previousRecord.reps} reps</strong></span>
        </div>
      )}
    </div>
  );
};
