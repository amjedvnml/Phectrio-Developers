import React, { useState, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Loader2, MessageSquare, Mail } from 'lucide-react';
import { submitInquiry } from '../services/api';
import { SuccessModal } from './SuccessModal';

const serviceOptions = [
  'Web Development',
  'App Development',
  'UI/UX Design'
];

const budgetOptions = [
  '$5k-$10k',
  '$10k-$25k',
  '$25k-$50k',
  '$50k+'
];

export const ContactSection = ({ preselectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web Development',
    budget: '$10k-$25k',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  useEffect(() => {
    if (preselectedService && serviceOptions.includes(preselectedService)) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSelectService = (srv) => {
    setFormData((prev) => ({ ...prev, service: srv }));
  };

  const handleSelectBudget = (bdg) => {
    setFormData((prev) => ({ ...prev, budget: bdg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please provide your name or organization.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please include a project message of at least 10 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await submitInquiry(formData);
      if (res.success) {
        setSubmittedInquiry(res.inquiry || formData);
        setShowSuccessModal(true);
        // Reset form fields
        setFormData({
          name: '',
          email: '',
          service: 'Web Development',
          budget: '$10k-$25k',
          message: ''
        });
      } else {
        setErrorMessage(res.message || 'Submission was unsuccessful.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit inquiry. Please ensure server is running.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 bg-[#000000] overflow-hidden">
      {/* Subtle Background Monochrome Glow */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Initialize Collaboration
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                Let's Build What's Next.
              </h2>
              <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
                Have a breakthrough product, an enterprise overhaul, or an ambitious technical vision?
                Our lead engineers review every submission directly.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4 font-mono text-xs text-neutral-300">
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Direct Executive Line</div>
                  <a href="mailto:partner@nexios.dev" className="text-sm font-sans font-semibold text-white hover:text-neutral-300 transition-colors">
                    partner@nexios.dev
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Average Response Velocity</div>
                  <div className="text-sm font-sans font-semibold text-white">
                    Within 24 Hours Guaranteed
                  </div>
                </div>
              </div>
            </div>

            {/* Commitment Note */}
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 text-xs text-neutral-400 leading-relaxed">
              <span className="font-semibold text-white">NDA Standard:</span> We are happy to execute mutual non-disclosure agreements prior to reviewing proprietary technical roadmaps.
            </div>
          </div>

          {/* Right Column: Interactive Lead Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative">
              <h3 className="text-xl font-display font-bold text-white mb-6">
                Project Inquiry Dispatch
              </h3>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-neutral-900 border border-white/20 text-neutral-200 text-xs flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Service Selection Pills */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    1. Primary Service Needed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {serviceOptions.map((srv) => (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => handleSelectService(srv)}
                        className={`py-3 px-3 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border transition-all text-center ${
                          formData.service === srv
                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                            : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Client Identity Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Your Name / Org *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Work Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Budget Range Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    2. Estimated Investment Range
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetOptions.map((bdg) => (
                      <button
                        type="button"
                        key={bdg}
                        onClick={() => handleSelectBudget(bdg)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                          formData.budget === bdg
                            ? 'bg-white text-black border-white'
                            : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {bdg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Project Message */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    3. Project Summary & Goals *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about what you want to build, current challenges, timeline targets..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Submit Action (Pure Black & White) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-neutral-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" />
                      <span>Submit Inquiry to Nexios</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        inquiryData={submittedInquiry}
      />
    </section>
  );
};
