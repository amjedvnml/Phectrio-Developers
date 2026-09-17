import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ExternalLink, Sparkles, X } from 'lucide-react';
import { getProjects } from '../services/api';

const categories = ['All', 'Web', 'Mobile App', 'UI/UX Design'];

export const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const gridRef = useRef(null);

  const fetchProjectsList = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      if (data.success && data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects, using fallback state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // GSAP animation when category changes
  useEffect(() => {
    if (gridRef.current && filteredProjects.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [selectedCategory, filteredProjects.length]);

  return (
    <section id="work" className="relative py-28 px-4 sm:px-6 bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filter Controls (Monochrome) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Selected Deployments
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white">
              Engineered For Impact
            </h2>
          </div>

          {/* Filter Pills in Pure Black & White */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-glow-subtle'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-mono text-xs text-neutral-400">Hydrating portfolio deployments...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl">
            <p className="text-neutral-400 text-sm">No deployments found in this category.</p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((proj) => (
              <div
                key={proj._id || proj.id}
                onClick={() => setActiveModalProject(proj)}
                className="group relative rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-white/40 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 shadow-lg"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/15">
                      {proj.category}
                    </span>
                  </div>

                  {/* Metrics Badge */}
                  {proj.metrics && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-white text-black">
                        {proj.metrics}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-neutral-200 transition-colors flex items-center justify-between">
                      <span>{proj.title}</span>
                      <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {proj.tags && proj.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal (Monochrome) */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0C0C0C] border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={activeModalProject.imageUrl}
                alt={activeModalProject.title}
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent" />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white text-black font-semibold">
                  {activeModalProject.category}
                </span>
                {activeModalProject.metrics && (
                  <span className="text-xs font-mono text-neutral-300">
                    Impact: {activeModalProject.metrics}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                {activeModalProject.title}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {activeModalProject.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Technical Architecture
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tags && activeModalProject.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-neutral-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setActiveModalProject(null);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  Request Similar Architecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
