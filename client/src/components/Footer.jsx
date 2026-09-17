import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#000000] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col with New Hexagon Logo */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo-mark-white.png"
                alt="Nexios Mark"
                className="w-7 h-7 object-contain"
              />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Nexios
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Nexios Developers is an elite digital engineering and creative technology agency.
              We architect high-fidelity web platforms, mobile software, and spatial interfaces built for scale.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              All Production Edge Systems Operational
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3 text-xs font-mono uppercase tracking-wider">
            <div className="text-white font-bold mb-2">Navigation</div>
            <div><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Services</a></div>
            <div><a href="#work" className="text-neutral-400 hover:text-white transition-colors">Work</a></div>
            <div><a href="#why-us" className="text-neutral-400 hover:text-white transition-colors">Capabilities</a></div>
            <div><a href="#contact" className="text-neutral-400 hover:text-white transition-colors">Initiate Inquiry</a></div>
          </div>

          {/* Disciplines */}
          <div className="md:col-span-3 space-y-3 text-xs font-mono uppercase tracking-wider">
            <div className="text-white font-bold mb-2">Disciplines</div>
            <div className="text-neutral-400">React & Next.js Architecture</div>
            <div className="text-neutral-400">WebGL & Canvas Physics</div>
            <div className="text-neutral-400">Cross-Platform App Dev</div>
            <div className="text-neutral-400">Spatial Design Systems</div>
          </div>

          {/* Portal & Top */}
          <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white hover:text-black text-xs font-mono text-neutral-400 border border-white/10 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CRM</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black text-neutral-400 border border-white/10 transition-colors mt-6 md:mt-0"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono gap-4">
          <div>
            &copy; {new Date().getFullYear()} Nexios Developers. Built For What's Next. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Security Policy</span>
            <span>&bull;</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Master Services Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
