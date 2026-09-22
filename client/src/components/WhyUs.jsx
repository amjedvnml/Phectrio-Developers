import React from 'react';
import { Cpu, ShieldCheck, Zap, Gauge, Terminal } from 'lucide-react';

const pillars = [
  {
    icon: Gauge,
    title: 'Zero Latency Tolerance',
    description: 'We optimize every bundle down to the millisecond. Sub-100ms Time-To-Interactive and 60fps frame budgeting are built into our CI test gates.',
    metric: '99+ Lighthouse Core'
  },
  {
    icon: ShieldCheck,
    title: 'Hardened Security By Default',
    description: 'Cryptographic hashing with bcryptjs, strictly scoped JWT bearer authorization, sanitization guards, and OWASP compliance come standard.',
    metric: 'A+ Security Score'
  },
  {
    icon: Cpu,
    title: 'Full-Stack Modernity',
    description: 'No obsolete legacy cruft. We deploy React 19, Node.js asynchronous runtimes, Vite HMR, and resilient database architectures that auto-recover.',
    metric: '100% Modern Stack'
  },
  {
    icon: Zap,
    title: 'Agile Velocity & Transparency',
    description: 'Direct Slack/Discord access to senior lead architects. Continuous staging deployments, interactive PR previews, and transparent velocity metrics.',
    metric: '2-Week Sprint Cadence'
  }
];

export const WhyUs = () => {
  return (
    <section id="why-us" className="relative py-28 px-4 sm:px-6 bg-[#000000] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5 text-white" />
            Engineering Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Built For What's Next. No Compromises.
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            The difference between standard agencies and Phectrio is our obsession with performance physics,
            resilient architectures, and modern minimalist distinction.
          </p>
        </div>

        {/* 4 Pillars Matrix (Monochrome) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 group overflow-hidden"
              >
                {/* Subtle White Specular Glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/[0.03] rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/40 transition-colors">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-neutral-200 transition-colors">
                        {pillar.title}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                        {pillar.metric}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
