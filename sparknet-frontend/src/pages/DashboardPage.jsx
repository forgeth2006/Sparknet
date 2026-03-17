import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { StatusBadge, RoleBadge, ModeBadge } from '../components/common/Badge';
import { formatDateTime } from '../utils/helpers';

export const DashboardPage = () => {
  const { user, isGuardian, isAdmin } = useAuth();

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div>
        <h1 className="font-display font-800 text-3xl text-white">
          Hey, <span className="text-spark-500">{user?.username}</span> ⚡
        </h1>
        <p className="text-gray-500 mt-1">Welcome to your SparkNet dashboard</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Account Status" value={<StatusBadge status={user?.status} />} />
        <StatCard label="Role" value={<RoleBadge role={user?.role} />} />
        <StatCard label="Mode" value={<ModeBadge mode={user?.mode} />} />
        <StatCard label="Active Sessions" value={
          <span className="font-mono font-600 text-spark-400 text-lg">{user?.activeSessions ?? 1}</span>
        } />
      </div>

      <div className="glow-line" />

      {/* Account info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="spark-card p-6 space-y-4">
          <h2 className="font-display font-700 text-lg text-white">Account Info</h2>
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Username" value={user?.username} />
          <InfoRow label="Email Verified" value={user?.isEmailVerified ? '✅ Yes' : '❌ No'} />
          <InfoRow label="Last Login" value={formatDateTime(user?.lastLoginAt)} />
          {user?.age && <InfoRow label="Age" value={`${user.age} years old`} />}
        </div>

        <div className="spark-card p-6 space-y-4">
          <h2 className="font-display font-700 text-lg text-white">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/change-password" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-dark-400 transition-all group">
              <span className="text-xl">🔑</span>
              <div>
                <p className="font-display font-600 text-sm text-white group-hover:text-spark-400 transition-colors">Change Password</p>
                <p className="text-xs text-gray-500">Update your security credentials</p>
              </div>
            </Link>
            {isGuardian && (
              <Link to="/guardian" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-dark-400 transition-all group">
                <span className="text-xl">👨‍👩‍👧</span>
                <div>
                  <p className="font-display font-600 text-sm text-white group-hover:text-spark-400 transition-colors">Guardian Dashboard</p>
                  <p className="text-xs text-gray-500">{user?.linkedChildrenCount} linked child{user?.linkedChildrenCount !== 1 ? 'ren' : ''}</p>
                </div>
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-spark-500/10 hover:bg-spark-500/20 border border-spark-500/20 hover:border-spark-500/40 transition-all group">
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="font-display font-600 text-sm text-spark-400">Admin Panel</p>
                  <p className="text-xs text-gray-500">Manage users and platform</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Child account notice */}
      {user?.role === 'child' && (
        <div className="spark-card p-6 border border-purple-500/20 bg-purple-500/5">
          <h2 className="font-display font-700 text-lg text-white mb-2">👶 Child Account</h2>
          <p className="text-gray-400 text-sm">
            Your account is managed by a guardian.
            {user?.guardianId && ' A guardian has been linked to your account.'}
          </p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="spark-card p-4">
    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">{label}</p>
    <div>{value}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-dark-600 last:border-0">
    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</span>
    <span className="text-sm text-gray-200 font-display font-500">{value}</span>
  </div>
);
