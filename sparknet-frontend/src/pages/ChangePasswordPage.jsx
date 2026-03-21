import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

export const ChangePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.changePassword(form);
      toast.success(data.message || 'Password changed. Please log in again.');
      await logout();
      navigate('/login');
    } catch (err) {
      const errData = err?.response?.data;
      if (errData?.errors) errData.errors.forEach((e) => toast.error(e));
      else toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto page-enter">
      <div className="mb-6">
        <h1 className="font-display font-800 text-3xl text-white">Change Password</h1>
        <p className="text-gray-500 mt-1">You'll be logged out after changing your password</p>
      </div>

      <div className="spark-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Current Password" type="password" placeholder="••••••••" value={form.currentPassword} onChange={set('currentPassword')} required />
          <Input label="New Password" type="password" placeholder="••••••••" value={form.newPassword} onChange={set('newPassword')} required minLength={8} />
          <p className="text-xs text-gray-600 font-mono">Must include uppercase, number, and special character</p>
          <button type="submit" disabled={loading} className="spark-btn-primary w-full mt-2">
            {loading ? <><Spinner /> Changing...</> : 'Change Password →'}
          </button>
        </form>
      </div>
    </div>
  );
};
