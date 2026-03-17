import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset! Please log in.');
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
    <div className="w-full max-w-md animate-slide-up">
      <div className="spark-card p-8">
        <h1 className="font-display font-800 text-2xl text-white mb-1">Reset password</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>
        <div className="glow-line mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="New Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoFocus />
          <p className="text-xs text-gray-600 font-mono">Must include uppercase, number, and special character</p>
          <button type="submit" disabled={loading} className="spark-btn-primary w-full">
            {loading ? <><Spinner /> Resetting...</> : 'Reset Password →'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-spark-400 hover:text-spark-300 font-mono transition-colors">← Back to login</Link>
        </p>
      </div>
    </div>
  );
};
