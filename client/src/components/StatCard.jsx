import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtext, color = 'cyan' }) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'from-cyan-500/10 to-transparent'
    },
    violet: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'from-purple-500/10 to-transparent'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'from-emerald-500/10 to-transparent'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'from-amber-500/10 to-transparent'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`relative rounded-3xl p-6 glass-card border border-white/10 ${scheme.border} transition-all duration-300 overflow-hidden group`}>
      {/* Background Subtle Ambient Glow */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-tl ${scheme.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform`} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${scheme.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="text-3xl font-display font-extrabold text-white mb-2 tracking-tight">
        {value}
      </div>

      {subtext && (
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          {subtext}
        </div>
      )}
    </div>
  );
};
