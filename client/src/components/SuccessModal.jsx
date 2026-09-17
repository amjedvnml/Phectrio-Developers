import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle, X } from 'lucide-react';

export const SuccessModal = ({ isOpen, onClose, inquiryData }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.85, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-lg rounded-3xl bg-[#0C0C0C] border border-white/20 p-6 sm:p-8 shadow-[0_0_50px_rgba(255,255,255,0.15)] text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated Monochrome Check Icon */}
        <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/20 p-[1px] mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="w-full h-full bg-[#000000] rounded-[15px] flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          Inquiry Transmitted
        </h3>
        <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4">
          Status: Received & Queued For Principal Review
        </p>

        <p className="text-sm text-neutral-300 leading-relaxed mb-6">
          Thank you, <strong className="text-white">{inquiryData?.name || 'Partner'}</strong>.
          We have securely routed your project brief to our principal engineering desk. Expect our initial technical response and scheduling link within 24 hours.
        </p>

        {/* Transmission Summary Box */}
        <div className="bg-black/60 rounded-2xl p-4 text-left font-mono text-xs text-neutral-300 mb-6 space-y-2 border border-white/10">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-neutral-500">Service:</span>
            <span className="text-white font-semibold">{inquiryData?.service}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-neutral-500">Allocated Budget:</span>
            <span className="text-white font-semibold">{inquiryData?.budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Client Email:</span>
            <span className="text-neutral-200 truncate max-w-[200px]">{inquiryData?.email}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
        >
          Return to Experience
        </button>
      </div>
    </div>
  );
};
