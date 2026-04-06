import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../api/profileApi';
import { StatusBadge, RoleBadge, ModeBadge } from '../components/common/Badge';
import { formatDateTime } from '../utils/helpers';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileApi.getMyProfile();
        setProfileData(data.data);
      } catch (err) {
        toast.error('Failed to load detailed profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-spark-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { profile, activity, privacy } = profileData || {};

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-3xl text-white">Profile</h1>
          <p className="text-gray-500 mt-1">Your account details</p>
        </div>
        <Link to="/edit-profile" className="spark-btn-secondary px-4 py-2 text-sm">
          Edit Profile
        </Link>
      </div>

      {/* Avatar + Name */}
      <div className="spark-card p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-spark-500 to-spark-700 flex items-center justify-center text-3xl font-display font-800 text-white shadow-lg shadow-spark-500/30">
          {profile?.avatar ? (
            <img src={`${import.meta.env.VITE_API_URL}${profile.avatar}`} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            user?.username?.[0]?.toUpperCase()
          )}
        </div>
        <div>
          <h2 className="font-display font-800 text-2xl text-white">{profile?.displayName || user?.username}</h2>
          <p className="text-gray-400 text-sm font-mono">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <RoleBadge role={user?.role} />
            <StatusBadge status={user?.status} />
            <ModeBadge mode={user?.mode} />
          </div>
        </div>
      </div>

      {/* Bio / Interests */}
      {(profile?.bio || profile?.interests?.length > 0) && (
        <div className="spark-card p-6 space-y-4">
          {profile.bio && (
            <div>
              <h3 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Bio</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )}
          {profile.interests?.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Interests</h3>
              <div className="flex gap-2 flex-wrap">
                {profile.interests.map((it, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-dark-600 text-xs text-gray-400 border border-dark-500">{it}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className="spark-card p-6">
        <h3 className="font-display font-700 text-lg text-white mb-4">Account Details</h3>
        <div className="space-y-0">
          <InfoRow label="User ID" value={<span className="font-mono text-xs text-gray-400">{user?.id}</span>} />
          <InfoRow label="Email Verified" value={user?.isEmailVerified ? <span className="text-emerald-400">✅ Verified</span> : <span className="text-red-400">❌ Not verified</span>} />
          <InfoRow label="Age" value={user?.age ? `${user.age} years old` : '—'} />
          <InfoRow label="Last Login" value={formatDateTime(user?.lastLoginAt)} />
          <InfoRow label="Profile Visibility" value={<span className="capitalize text-spark-400">{privacy?.profileVisibility || 'public'}</span>} />
          {activity && <InfoRow label="Total Posts" value={<span className="font-mono text-spark-400">{activity.postCount || 0}</span>} />}
          {user?.isGuardian && <InfoRow label="Linked Children" value={<span className="font-mono text-spark-400">{user.linkedChildrenCount}</span>} />}
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
