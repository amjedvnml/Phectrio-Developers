import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ExternalLink, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminNavbar = ({ dbMode, dbStatus }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Portal Badge with New Hexagon Logo */}
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <img
              src="/assets/logo-mark-white.png"
              alt="Phectrio Admin Mark"
              className="w-6 h-6 object-contain"
            />
            <span className="font-display font-bold text-base tracking-tight text-white">
              Phectrio <span className="text-neutral-400 font-mono text-xs uppercase">CRM</span>
            </span>
          </Link>

          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-neutral-200 border border-white/20 uppercase">
            {user?.role || 'superadmin'}
          </span>

          {/* Database Mode Status */}
          {dbMode && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.03] text-neutral-400 border border-white/10" title={dbStatus}>
              <Database className="w-3 h-3 text-white" />
              <span>Storage: <strong className="text-white uppercase">{dbMode}</strong></span>
            </div>
          )}
        </div>

        {/* Right Actions: Public Site Link & Sign Out */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-mono text-white truncate max-w-[150px]">
                {user?.email || 'admin@Phectrio.dev'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/5 hover:bg-white hover:text-black text-neutral-400 border border-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
