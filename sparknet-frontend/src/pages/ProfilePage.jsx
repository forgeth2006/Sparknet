import { useAuth } from '../context/AuthContext';
import { StatusBadge, RoleBadge, ModeBadge } from '../components/common/Badge';
import { formatDate, formatDateTime } from '../utils/helpers';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      <div>
        <h1 className="font-display font-800 text-3xl text-white">Profile</h1>
        <p className="text-gray-500 mt-1">Your account details</p>
      </div>

      {/* Avatar + Name */}
      <div className="spark-card p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-spark-500 to-spark-700 flex items-center justify-center text-3xl font-display font-800 text-white shadow-lg shadow-spark-500/30 animate-pulse-glow">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-display font-800 text-2xl text-white">{user?.username}</h2>
          <p className="text-gray-400 text-sm font-mono">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <RoleBadge role={user?.role} />
            <StatusBadge status={user?.status} />
            <ModeBadge mode={user?.mode} />
            {user?.isGuardian && <span className="spark-badge border text-spark-400 bg-spark-400/10 border-spark-400/20">guardian</span>}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="spark-card p-6">
        <h3 className="font-display font-700 text-lg text-white mb-4">Account Details</h3>
        <div className="space-y-0">
          <InfoRow label="User ID" value={<span className="font-mono text-xs text-gray-400">{user?.id}</span>} />
          <InfoRow label="Email Verified" value={user?.isEmailVerified ? <span className="text-emerald-400">✅ Verified</span> : <span className="text-red-400">❌ Not verified</span>} />
          <InfoRow label="Age" value={user?.age ? `${user.age} years old` : '—'} />
          <InfoRow label="Last Login" value={formatDateTime(user?.lastLoginAt)} />
          <InfoRow label="Active Sessions" value={<span className="font-mono text-spark-400">{user?.activeSessions ?? 1}</span>} />
          {user?.isGuardian && <InfoRow label="Linked Children" value={<span className="font-mono text-spark-400">{user.linkedChildrenCount}</span>} />}
          {user?.guardianId && <InfoRow label="Guardian" value={<span className="text-purple-400 text-xs font-mono">Linked</span>} />}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-dark-600 last:border-0">
    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</span>
    <span className="text-sm text-gray-200">{value}</span>
  </div>
);
