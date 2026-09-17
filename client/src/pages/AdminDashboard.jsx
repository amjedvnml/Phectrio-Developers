import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  RefreshCw, 
  Plus, 
  Layers, 
  FolderPlus, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Database,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminNavbar } from '../components/AdminNavbar';
import { StatCard } from '../components/StatCard';
import { InquiriesTable } from '../components/InquiriesTable';
import { 
  getAdminStats, 
  getAdminInquiries, 
  getProjects, 
  createProject, 
  deleteProject, 
  reSeedData 
} from '../services/api';

export const AdminDashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'projects'
  const [loadingData, setLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Project Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Web',
    description: '',
    imageUrl: '',
    tags: '',
    metrics: '',
    featured: false
  });
  const [addingProject, setAddingProject] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const [statsRes, inqRes, projRes] = await Promise.all([
        getAdminStats(),
        getAdminInquiries(),
        getProjects()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (inqRes.success) setInquiries(inqRes.inquiries);
      if (projRes.success) setProjects(projRes.projects);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const handleReSeed = async () => {
    if (!window.confirm('Reset and re-populate database with default showcase inquiries & portfolio items?')) return;
    try {
      await reSeedData();
      await loadDashboardData();
      alert('Database re-seeded successfully!');
    } catch (err) {
      console.error('Re-seed failed:', err);
    }
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      alert('Please fill in title and description.');
      return;
    }

    try {
      setAddingProject(true);
      const tagsArray = newProject.tags
        ? newProject.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await createProject({
        ...newProject,
        tags: tagsArray
      });

      setShowAddProjectModal(false);
      setNewProject({
        title: '',
        category: 'Web',
        description: '',
        imageUrl: '',
        tags: '',
        metrics: '',
        featured: false
      });
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to publish project.');
    } finally {
      setAddingProject(false);
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await deleteProject(projId);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project.');
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-electric-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-slate-100 flex flex-col">
      <AdminNavbar dbMode={stats?.dbMode} dbStatus={stats?.dbStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Executive CRM Dashboard &bull; Real-Time Node.js Express Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Inquiry Pipeline & Deployments
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReSeed}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-400 hover:text-white border border-white/5 transition-colors flex items-center gap-1.5"
              title="Reset with rich showcase demo data"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Re-Seed Data</span>
            </button>

            <button
              onClick={loadDashboardData}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-electric-cyan ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Pipeline</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Client Leads"
            value={stats?.totalInquiries ?? '...'}
            icon={Users}
            subtext={`Across ${inquiries.length} live submissions`}
            color="violet"
          />

          <StatCard
            title="Pending Review"
            value={stats?.pendingLeads ?? '...'}
            icon={Clock}
            subtext="Requires executive partner review"
            color="cyan"
          />

          <StatCard
            title="Active Engagements"
            value={stats?.inProgress ?? '...'}
            icon={TrendingUp}
            subtext="Currently in design & sprint"
            color="amber"
          />

          <StatCard
            title="Conversion Rate"
            value={`${stats?.conversionRate ?? 0}%`}
            icon={CheckCircle}
            subtext={`${stats?.completed ?? 0} closed deals to date`}
            color="emerald"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 bg-[#0E0F17] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-electric-violet text-white shadow-glow-subtle'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Inquiries Pipeline ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-electric-cyan text-slate-900 shadow-glow-subtle'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Portfolio Projects ({projects.length})</span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-electric-violet to-electric-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deployment</span>
            </button>
          )}
        </div>

        {/* Tab Content 1: Inquiries Table */}
        {activeTab === 'inquiries' && (
          <InquiriesTable
            inquiries={inquiries}
            onRefresh={loadDashboardData}
            loading={loadingData}
          />
        )}

        {/* Tab Content 2: Portfolio Projects Manager */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj._id || proj.id}
                className="rounded-3xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {proj.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(proj._id || proj.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/30 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-white text-base mb-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-3 border-t border-white/5">
                    {proj.tags && proj.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-400 border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0F101A] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowAddProjectModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-electric-cyan" />
              <span>Publish New Deployment</span>
            </h3>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Apex Trading Engine"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D0E15] border border-white/10 text-white text-xs focus:outline-none focus:border-electric-cyan"
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Impact Metric
                  </label>
                  <input
                    type="text"
                    value={newProject.metrics}
                    onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                    placeholder="e.g. 50k+ Active Users"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-electric-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newProject.imageUrl}
                  onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Tech Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  placeholder="React, WebGL, Node.js, Tailwind"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-electric-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Brief architectural overview and business outcomes..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-electric-violet resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProject}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-electric-violet to-electric-cyan text-white text-xs font-semibold shadow-glow-subtle disabled:opacity-50"
                >
                  {addingProject ? 'Publishing...' : 'Publish Deployment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
