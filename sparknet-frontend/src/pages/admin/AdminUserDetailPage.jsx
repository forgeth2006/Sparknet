import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { StatusBadge, RoleBadge, ModeBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['active', 'suspended', 'banned', 'pending_verification', 'pending_guardian_approval'];
const MODES = ['normal', 'youth'];

export const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('info');
  const [modal, setModal] = useState(null); // { type, value }
  const [reason, setReason] = useState('');

  const fetchUser = async () => {
    try {
      const [{ data: u }, { data: a }] = await Promise.all([
        adminApi.getUser(id),
        adminApi.getUserActivity(id),
      ]);
      setUser(u.user);
      setActivity(a.activity);
    } catch { toast.error('Failed to load user'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUser(); }, [id]);

  const handleStatusChange = async () => {
    try {
      await adminApi.updateUserStatus(id, modal.value, reason);
      toast.success(`Status updated to ${modal.value}`);
      setModal(null);
      setReason('');
      fetchUser();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
  };

  const handleModeChange = async (mode) => {
    try {
      await adminApi.setUserMode(id, mode);
      toast.success(`Mode set to ${mode}`);
      fetchUser();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
  };

  const handleForceLogout = async () => {
    try {
      await adminApi.forceLogout(id);
      toast.success('All sessions cleared');
      fetchUser();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!user) return <div className="text-center py-20 text-gray-500">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-mono">
        <Link to="/admin" className="text-gray-500 hover:text-white transition-colors">Admin</Link>
        <span className="text-gray-600">/</span>
        <Link to="/admin/users" className="text-gray-500 hover:text-white transition-colors">Users</Link>
        <span className="text-gray-600">/</span>
        <span className="text-gray-300">{user.username}</span>
      </div>

      {/* Header */}
      <div className="spark-card p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-spark-500 to-spark-700 flex items-center justify-center text-2xl font-display font-800 text-white">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display font-800 text-2xl text-white">{user.username}</h1>
            <p className="text-gray-400 font-mono text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
              <ModeBadge mode={user.mode} />
              {user.isGuardian && <span className="spark-badge border text-spark-400 bg-spark-400/10 border-spark-400/20">guardian ({user.linkedChildrenCount})</span>}
            </div>
          </div>
        </div>
        <button onClick={handleForceLogout} className="spark-btn-danger">
          Force Logout All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-800 rounded-xl border border-dark-600 w-fit">
        {['info', 'actions', 'activity'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-display font-600 capitalize transition-all ${tab === t ? 'bg-spark-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {tab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="spark-card p-5 space-y-0">
            <h3 className="font-display font-700 text-white mb-3">Account Info</h3>
            {[
              ['ID', <span className="font-mono text-xs">{user._id}</span>],
              ['Email Verified', user.isEmailVerified ? '✅ Yes' : '❌ No'],
              ['Login Attempts', user.loginAttempts],
              ['Last Login', formatDateTime(user.lastLoginAt)],
              ['Created', formatDateTime(user.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-dark-600 last:border-0">
                <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</span>
                <span className="text-sm text-gray-200">{value}</span>
              </div>
            ))}
          </div>

          {user.isGuardian && user.childLinks?.length > 0 && (
            <div className="spark-card p-5">
              <h3 className="font-display font-700 text-white mb-3">Linked Children</h3>
              <div className="space-y-2">
                {user.childLinks.map((link) => (
                  <div key={link._id} className="flex items-center justify-between p-3 bg-dark-700 rounded-xl">
                    <div>
                      <p className="font-display font-600 text-sm text-white">{link.childId?.username}</p>
                      <p className="text-xs text-gray-500 font-mono">{link.childId?.email}</p>
                    </div>
                    <StatusBadge status={link.childId?.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Actions */}
      {tab === 'actions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="spark-card p-5">
            <h3 className="font-display font-700 text-white mb-4">Change Status</h3>
            <div className="space-y-2">
              {STATUSES.map(s => (
                <button key={s} disabled={user.status === s}
                  onClick={() => setModal({ type: 'status', value: s })}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-display font-600 transition-all border
                    ${user.status === s
                      ? 'bg-spark-500/10 border-spark-500/30 text-spark-400 cursor-default'
                      : 'bg-dark-700 border-dark-500 text-gray-300 hover:border-dark-400 hover:text-white'}`}>
                  {s === user.status ? `✓ ${s}` : s}
                </button>
              ))}
            </div>
          </div>
          <div className="spark-card p-5">
            <h3 className="font-display font-700 text-white mb-4">Change Mode</h3>
            <div className="space-y-2">
              {MODES.map(m => (
                <button key={m} disabled={user.mode === m}
                  onClick={() => handleModeChange(m)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-display font-600 transition-all border
                    ${user.mode === m
                      ? 'bg-spark-500/10 border-spark-500/30 text-spark-400 cursor-default'
                      : 'bg-dark-700 border-dark-500 text-gray-300 hover:border-dark-400 hover:text-white'}`}>
                  {m === user.mode ? `✓ ${m}` : m}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 font-mono mt-3">Changing mode will clear all sessions</p>
          </div>
        </div>
      )}

      {/* Tab: Activity */}
      {tab === 'activity' && activity && (
        <div className="spark-card overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-600">
            <h2 className="font-display font-700 text-white">Login History</h2>
            <p className="text-xs text-gray-500 mt-0.5">Active sessions: {activity.activeSessions?.length || 0}</p>
          </div>
          <div className="divide-y divide-dark-700">
            {activity.loginHistory?.length === 0 && (
              <p className="px-5 py-8 text-center text-gray-500 text-sm">No login history.</p>
            )}
            {[...(activity.loginHistory || [])].reverse().map((entry, i) => (
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
      )}

      {/* Status change modal */}
      {modal?.type === 'status' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative spark-card p-6 w-full max-w-md animate-slide-up">
            <h3 className="font-display font-700 text-lg text-white mb-4">Change Status → <span className="text-spark-400">{modal.value}</span></h3>
            <label className="spark-label">Reason (optional)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for this status change..." rows={3} className="spark-input resize-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="spark-btn-ghost">Cancel</button>
              <button onClick={handleStatusChange} className="spark-btn-primary">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
