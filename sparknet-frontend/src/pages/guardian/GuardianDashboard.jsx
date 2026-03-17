import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { guardianApi } from '../../api/guardianApi';
import { StatusBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const GuardianDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlinkTarget, setUnlinkTarget] = useState(null);

  const fetchChildren = async () => {
    try {
      const { data } = await guardianApi.getChildren();
      setChildren(data.children || []);
    } catch { toast.error('Failed to load children'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleUnlink = async () => {
    try {
      await guardianApi.unlinkChild(unlinkTarget.child._id);
      toast.success('Child unlinked');
      setUnlinkTarget(null);
      fetchChildren();
    } catch { toast.error('Failed to unlink child'); }
  };

  const handleStatusToggle = async (childId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await guardianApi.setChildStatus(childId, newStatus);
      toast.success(`Account ${newStatus}`);
      fetchChildren();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-3xl text-white">Guardian Dashboard</h1>
          <p className="text-gray-500 mt-1">{children.length} linked child{children.length !== 1 ? 'ren' : ''}</p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="spark-card p-12 text-center">
          <div className="text-5xl mb-4">👨‍👩‍👧</div>
          <h3 className="font-display font-700 text-lg text-white mb-2">No children linked yet</h3>
          <p className="text-gray-500 text-sm">Children who list your email as their guardian will appear here after you approve them.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {children.map((link) => (
            <ChildCard
              key={link.child?._id}
              link={link}
              onUnlink={() => setUnlinkTarget(link)}
              onStatusToggle={() => handleStatusToggle(link.child._id, link.child.status)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!unlinkTarget}
        title="Unlink Child Account"
        message={`Are you sure you want to unlink ${unlinkTarget?.child?.username}? Their account will be suspended.`}
        onConfirm={handleUnlink}
        onCancel={() => setUnlinkTarget(null)}
        danger
      />
    </div>
  );
};

const ChildCard = ({ link, onUnlink, onStatusToggle }) => {
  const { child, controls, approvedAt } = link;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="spark-card overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-lg font-display font-800 text-white">
            {child?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-700 text-white">{child?.username}</h3>
            <p className="text-xs text-gray-500 font-mono">{child?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={child?.status} />
              <span className="text-xs text-gray-600 font-mono">Linked {formatDateTime(approvedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/guardian/children/${child?._id}/activity`} className="spark-btn-ghost text-xs px-3 py-2">
            Activity
          </Link>
          <button
            onClick={onStatusToggle}
            className={`spark-btn text-xs px-3 py-2 ${child?.status === 'active' ? 'spark-btn-danger' : 'spark-btn bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}
          >
            {child?.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="spark-btn-ghost text-xs px-3 py-2">
            {expanded ? 'Hide' : 'Controls'}
          </button>
          <button onClick={onUnlink} className="spark-btn-danger text-xs px-3 py-2">
            Unlink
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-dark-600 p-5 bg-dark-800/50">
          <ChildControls childId={child?._id} controls={controls} />
        </div>
      )}
    </div>
  );
};

const ChildControls = ({ childId, controls: initialControls }) => {
  const [controls, setControls] = useState(initialControls || {});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await guardianApi.updateChildControls(childId, controls);
      toast.success('Controls updated');
    } catch { toast.error('Failed to save controls'); }
    finally { setSaving(false); }
  };

  const toggle = (field) => setControls({ ...controls, [field]: !controls[field] });
  const setVal = (field) => (e) => setControls({ ...controls, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <h4 className="font-display font-700 text-sm text-gray-300 uppercase tracking-wider">Parental Controls</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToggleRow label="Messaging Allowed" value={controls.messagingAllowed} onChange={() => toggle('messagingAllowed')} />
        <ToggleRow label="Friend Requests" value={controls.friendRequestsAllowed} onChange={() => toggle('friendRequestsAllowed')} />
        <ToggleRow label="Screen Time Limit" value={controls.screenTimeEnabled} onChange={() => toggle('screenTimeEnabled')} />
        <div>
          <label className="spark-label">Content Level</label>
          <select value={controls.contentLevel || 'strict'} onChange={setVal('contentLevel')} className="spark-input">
            <option value="strict">Strict</option>
            <option value="moderate">Moderate</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
        {controls.screenTimeEnabled && (
          <div>
            <label className="spark-label">Daily Limit (minutes)</label>
            <input type="number" value={controls.screenTimeLimitMinutes || 120} onChange={setVal('screenTimeLimitMinutes')} min={15} max={1440} className="spark-input" />
          </div>
        )}
      </div>
      <button onClick={save} disabled={saving} className="spark-btn-primary">
        {saving ? <><Spinner /> Saving...</> : 'Save Controls'}
      </button>
    </div>
  );
};

const ToggleRow = ({ label, value, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-dark-700 border border-dark-500 hover:border-dark-400 transition-all">
    <span className="text-sm text-gray-300 font-display font-500">{label}</span>
    <div onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-spark-500' : 'bg-dark-500'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  </label>
);
