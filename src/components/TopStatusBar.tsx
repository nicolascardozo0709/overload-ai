import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Sparkles } from 'lucide-react';

export const TopStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5 px-5 py-2.5 flex items-center justify-between text-xs text-slate-300 select-none">
      {/* Time */}
      <span className="font-bold tracking-tight text-white font-mono text-[13px]">
        {timeStr}
      </span>

      {/* Dynamic Island / Notch pill */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-white/10 shadow-inner">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
          OVERLOAD AI
        </span>
      </div>

      {/* Battery & Signal Icons */}
      <div className="flex items-center gap-2">
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-300">100%</span>
          <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
        </div>
      </div>
    </header>
  );
};
