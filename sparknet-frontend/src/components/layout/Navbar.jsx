import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { StatusBadge, RoleBadge } from '../common/Badge';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout, isAdmin, isGuardian } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAdmin ? '/admin' : '/dashboard'}>
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-6 mr-4">
              <Link to="/feed" className="text-sm text-gray-400 hover:text-white font-display font-600 transition-colors">
                Home
              </Link>
              <Link to="/challenges" className="text-sm text-gray-400 hover:text-white font-display font-600 transition-colors">
                Challenges
              </Link>
              <Link to="/notifications" className="text-sm text-gray-400 hover:text-white font-display font-600 transition-colors relative">
                Notifications
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-spark-500 rounded-full animate-pulse"></span>
              </Link>
            </div>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-700 border border-dark-500 hover:border-dark-400 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-spark-500 to-spark-700 flex items-center justify-center text-xs font-display font-700 text-white">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-display font-600 text-gray-300">{user?.username}</span>
                <svg className={`w-3 h-3 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 spark-card shadow-xl shadow-black/40 p-2 animate-fade-in">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-xs text-gray-500 font-mono">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <RoleBadge role={user?.role} />
                      <StatusBadge status={user?.status} />
                      {isGuardian && <span className="spark-badge border text-spark-400 bg-spark-400/10 border-spark-400/20">guardian</span>}
                    </div>
                  </div>
                  <div className="glow-line my-2" />
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                  >
                    <span>👤</span> Profile & Settings
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                  >
                    <span>🔑</span> Change Password
                  </Link>
                  <div className="glow-line my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
