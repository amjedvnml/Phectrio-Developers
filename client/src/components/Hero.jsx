import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Code2, Cpu, Globe2, Terminal } from 'lucide-react';

export const Hero = () => {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  // Interactive mouse-tracking monochrome ambient glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP Staggered Reveal Load Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1 }
      )
      .fromTo(
        titleRef.current?.children || [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
        '-=0.4'
      )
      .fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden bg-grid-pattern"
    >
      {/* Monochrome Mouse-Tracking Spotlight */}
      <div
        className="pointer-events-none absolute -inset-[100px] opacity-60 blur-[130px] transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle 550px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03), transparent 70%)`
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Badge with Logo Mark */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-card border border-white/15 mb-8 shadow-glow-subtle"
        >
          <img
            src="/assets/logo-mark-white.png"
            alt="Phectrio Icon"
            className="w-3.5 h-3.5 object-contain"
          />
          <span className="font-mono text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Creative Technologists & Engineers
          </span>
          <span className="text-white/20">|</span>
          <span className="text-xs text-neutral-400 font-mono">
            2026 Edition
          </span>
        </div>

        {/* Dynamic Main Headline (Space Grotesk & Monochrome) */}
        <div ref={titleRef} className="space-y-3 mb-6">
          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white">
            Phectrio Developers
          </h1>
          <div className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            <span className="gradient-text-hero glow-text-white">
              Built For What's Next
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-neutral-400 font-normal leading-relaxed mb-10"
        >
          We engineer high-performance web platforms, cross-platform mobile architectures,
          and spatial UI/UX systems for ambitious teams pioneering the future of digital experiences.
        </p>

        {/* CTA Actions (Monochrome Black & White) */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16"
        >
          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-neutral-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Your Build</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={scrollToWork}
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/[0.08] text-neutral-300 hover:text-white font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-white/15"
          >
            <Terminal className="w-4 h-4 text-white" />
            <span>Explore Portfolio</span>
          </button>
        </div>

        {/* Metric Badges in Monochrome */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/30 transition-all text-left">
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              &lt;100<span className="text-neutral-400 text-lg">ms</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-white" />
              Runtime Latency
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/30 transition-all text-left">
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              99.98<span className="text-neutral-400 text-lg">%</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-white" />
              Deployment SLA
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/30 transition-all text-left">
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              45<span className="text-neutral-400 text-lg">+</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-white" />
              Production Ships
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/30 transition-all text-left">
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              $150M<span className="text-neutral-400 text-lg">+</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-white" />
              Client Pipeline
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
