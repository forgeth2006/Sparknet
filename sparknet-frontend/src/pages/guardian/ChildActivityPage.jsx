import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guardianApi } from '../../api/guardianApi';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const ChildActivityPage = () => {
  const { childId } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guardianApi.getChildActivity(childId)
      .then(({ data }) => setActivity(data.activity))
      .catch(() => toast.error('Failed to load activity'))
      .finally(() => setLoading(false));
  }, [childId]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!activity) return <div className="text-center py-20 text-gray-500">Activity not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/guardian" className="text-gray-500 hover:text-white transition-colors font-mono text-sm">← Guardian</Link>
        <span className="text-gray-600">/</span>
        <span className="text-gray-300 font-display font-600">{activity.username}</span>
      </div>

      <div>
        <h1 className="font-display font-800 text-3xl text-white">{activity.username}'s Activity</h1>
        <p className="text-gray-500 mt-1">Monitoring & login history</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Status" value={<StatusBadge status={activity.status} />} />
        <StatCard label="Active Sessions" value={<span className="font-mono text-spark-400 text-lg font-700">{activity.activeSessions}</span>} />
        <StatCard label="Last Login" value={<span className="text-xs text-gray-300 font-mono">{formatDateTime(activity.lastLoginAt)}</span>} />
        <StatCard label="Last IP" value={<span className="text-xs text-gray-300 font-mono">{activity.lastLoginIp || '—'}</span>} />
      </div>

      {/* Login history */}
      <div className="spark-card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-600">
          <h2 className="font-display font-700 text-white">Login History</h2>
          <p className="text-xs text-gray-500 mt-0.5">Last 30 logins</p>
        </div>
        <div className="divide-y divide-dark-600">
          {activity.loginHistory?.length === 0 && (
            <p className="px-5 py-8 text-center text-gray-500 text-sm">No login history yet.</p>
          )}
          {[...activity.loginHistory].reverse().map((entry, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-dark-700/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.success ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <div>
                  <p className="text-sm text-gray-300 font-mono">{entry.ip}</p>
                  <p className="text-xs text-gray-600 truncate max-w-xs">{entry.device}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-mono font-600 ${entry.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {entry.success ? 'Success' : 'Failed'}
                </p>
                <p className="text-xs text-gray-600">{formatDateTime(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="spark-card p-4">
    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">{label}</p>
    <div>{value}</div>
  </div>
);
