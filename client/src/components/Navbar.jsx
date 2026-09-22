import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4 transition-all duration-300">
      <nav 
        className={`w-full max-w-7xl mx-auto rounded-full px-6 py-3 transition-all duration-300 flex items-center justify-between ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border border-white/15 shadow-glass' 
            : 'bg-transparent border border-white/5'
        }`}
      >
        {/* Brand Logo with New Interlocking Hexagon & Exact Typography */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-7 h-7 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/logo-mark-white.png"
              alt="Phectrio Logo Mark"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-neutral-300 transition-colors">
            Phectrio
          </span>
        </a>

        {/* Desktop Navigation Links (Monochrome) */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-neutral-400">
          <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">Services</button>
          <button onClick={() => scrollTo('work')} className="hover:text-white transition-colors">Work</button>
          <button onClick={() => scrollTo('why-us')} className="hover:text-white transition-colors">Capabilities</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">Contact</button>
        </div>

        {/* Desktop CTA & Admin Portal Trigger */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
            title="Admin Management Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
          </Link>

          <button
            onClick={() => scrollTo('contact')}
            className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs tracking-wide hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            Launch Project
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-300"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-black/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 md:hidden">
          <button onClick={() => scrollTo('services')} className="text-left text-sm font-mono uppercase text-neutral-300 hover:text-white py-2 border-b border-white/5">Services</button>
          <button onClick={() => scrollTo('work')} className="text-left text-sm font-mono uppercase text-neutral-300 hover:text-white py-2 border-b border-white/5">Work</button>
          <button onClick={() => scrollTo('why-us')} className="text-left text-sm font-mono uppercase text-neutral-300 hover:text-white py-2 border-b border-white/5">Capabilities</button>
          <button onClick={() => scrollTo('contact')} className="text-left text-sm font-mono uppercase text-neutral-300 hover:text-white py-2 border-b border-white/5">Contact</button>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => scrollTo('contact')}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase text-center hover:bg-neutral-200"
            >
              Launch Project
            </button>
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-center text-xs font-mono flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Admin Management Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
