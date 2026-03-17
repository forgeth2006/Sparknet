import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Spinner } from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-display font-800 text-3xl text-white">Admin Panel <span className="text-spark-500">⚡</span></h1>
        <p className="text-gray-500 mt-1">Platform overview and user management</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers} color="text-blue-400" icon="👥" />
        <StatCard label="Children" value={stats?.totalChildren} color="text-purple-400" icon="👶" />
        <StatCard label="Guardians" value={stats?.guardians} color="text-spark-400" icon="🛡️" />
        <StatCard label="Active Accounts" value={stats?.activeUsers} color="text-emerald-400" icon="✅" />
        <StatCard label="Banned" value={stats?.bannedUsers} color="text-red-400" icon="🚫" />
        <StatCard label="Youth Mode" value={stats?.youthModeUsers} color="text-pink-400" icon="🌸" />
      </div>

      <div className="glow-line" />

      {/* Quick links */}
      <div>
        <h2 className="font-display font-700 text-lg text-white mb-4">Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/users" className="spark-card p-5 hover:border-spark-500/40 hover:bg-dark-700/50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-spark-500/10 flex items-center justify-center text-2xl">👥</div>
              <div>
                <h3 className="font-display font-700 text-white group-hover:text-spark-400 transition-colors">User Management</h3>
                <p className="text-xs text-gray-500 mt-0.5">Search, filter, ban/suspend users</p>
              </div>
            </div>
          </Link>
          <div className="spark-card p-5 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center text-2xl">📊</div>
              <div>
                <h3 className="font-display font-700 text-gray-400">Analytics</h3>
                <p className="text-xs text-gray-600 mt-0.5">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }) => (
  <div className="spark-card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
        <p className={`font-display font-800 text-3xl mt-1 ${color}`}>{value ?? '—'}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);
