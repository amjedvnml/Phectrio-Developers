import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Smartphone, Palette, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: 'web-dev',
    title: 'Web Development',
    serviceKey: 'Web Development',
    subtitle: 'Next-Gen Platforms & WebGL',
    icon: Globe,
    badge: 'Flagship Core',
    description: 'We build enterprise-grade web architectures powered by React, Next.js, and WebGL. Sub-second initial load, zero-drift state hydration, and fluid interactive physics.',
    features: [
      'React 19 & Next.js App Router Architectures',
      'Interactive WebGL & 3D Three.js Visualizations',
      'Micro-Frontend & Edge Compute Integrations',
      'Lighthouse 98+ Core Web Vitals Guaranteed'
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'WebGL', 'Node.js', 'GraphQL']
  },
  {
    id: 'app-dev',
    title: 'App Development',
    serviceKey: 'App Development',
    subtitle: 'Cross-Platform & Native Mobile',
    icon: Smartphone,
    badge: 'High Performance',
    description: 'Bespoke mobile software designed for scale and biometric safety. We merge React Native and Flutter with native modules for effortless cross-platform synchronization.',
    features: [
      'iOS & Android Cross-Platform via React Native & Flutter',
      'Hardware-Accelerated 120Hz Micro-Interactions',
      'Offline-First Local Storage & Zero-Latency Sync',
      'Biometric Security & Edge Hardware Integrations'
    ],
    techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'SQLite', 'WebSockets', 'Firebase']
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    serviceKey: 'UI/UX Design',
    subtitle: 'Spatial Systems & Design Tokens',
    icon: Palette,
    badge: 'Creative Tech',
    description: 'We construct living, tokenized design systems that unify multi-surface brands. From precision micro-interactions to high-fidelity clickable prototypes that command authority.',
    features: [
      'Multi-Tier Design Tokens & Comprehensive Guidelines',
      'Spatial UX, Glassmorphism & Dynamic Dark Theming',
      'Interactive Prototypes & Complex Physics Rigging',
      'Accessibility (WCAG AAA) & Usability Research'
    ],
    techStack: ['Figma', 'Tokens Studio', 'Spline 3D', 'After Effects', 'Design Systems', 'Design QA']
  }
];

export const Services = ({ onSelectService }) => {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);

  cardRefs.current = [];
  const addToCardRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  // GSAP 3D Hover Tilt Physics
  const handleCardMouseMove = (e, cardEl) => {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(cardEl, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.3
    });
  };

  const handleCardMouseLeave = (cardEl) => {
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.6
    });
  };

  // GSAP ScrollTrigger Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.services-header-anim', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Cards staggered reveal
      gsap.from(cardRefs.current, {
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleConsultService = (serviceKey) => {
    if (onSelectService) {
      onSelectService(serviceKey);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-28 px-4 sm:px-6 bg-[#000000] overflow-hidden"
    >
      {/* Background Subtle Monochrome Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div className="services-header-anim max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-white" />
              Specialized Core Disciplines
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              High-Velocity Digital Craft
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base">
              Precision engineering tailored for enterprise disruption. We do not build templates;
              every solution is architected from clean fundamentals.
            </p>
          </div>

          <div className="services-header-anim mt-6 md:mt-0">
            <span className="font-mono text-xs text-neutral-400 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/10">
              Interactive 3D Motion Grid
            </span>
          </div>
        </div>

        {/* 3D Tilt Services Grid (Monochrome) */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000"
        >
          {servicesData.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                ref={addToCardRefs}
                onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
                className="relative rounded-3xl p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/40 hover:shadow-[0_0_35px_rgba(255,255,255,0.12)] transition-all duration-300 flex flex-col justify-between preserve-3d group cursor-pointer"
              >
                {/* Specular White Line on Hover */}
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full shadow-[0_0_10px_white]" />

                <div>
                  {/* Top Header & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center group-hover:border-white transition-colors">
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                      {srv.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-neutral-200 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      {srv.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                    {srv.description}
                  </p>

                  {/* Key Deliverables */}
                  <div className="space-y-2.5 mb-8">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tech Stack & CTA */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-white/5">
                    {srv.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleConsultService(srv.serviceKey)}
                    className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white text-white hover:text-black text-xs font-bold tracking-wider uppercase border border-white/15 hover:border-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
