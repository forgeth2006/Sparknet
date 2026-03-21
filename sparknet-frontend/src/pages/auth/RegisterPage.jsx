import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const calcAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', dateOfBirth: '',
    guardianEmail: '', termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const age = calcAge(form.dateOfBirth);
  const isMinor = age !== null && age < 18;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.termsAccepted) { toast.error('You must accept the terms'); return; }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!isMinor) delete payload.guardianEmail;
      const { data } = await authApi.register(payload);
      toast.success(data.message, { duration: 6000 });
      navigate('/login');
    } catch (err) {
      const errData = err?.response?.data;
      if (errData?.errors) {
        errData.errors.forEach((e) => toast.error(e));
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="spark-card p-8 shadow-2xl shadow-black/40">
        <div className="mb-6">
          <h1 className="font-display font-800 text-2xl text-white mb-1">Create account</h1>
          <p className="text-gray-500 text-sm">Join SparkNet today</p>
        </div>
        <div className="glow-line mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" type="text" placeholder="cooluser" value={form.username} onChange={set('username')} required minLength={3} maxLength={30} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />

          <div className="space-y-1">
            <label className="spark-label">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="Min 8 chars" value={form.password} onChange={set('password')} required minLength={8} className="spark-input pr-12" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs font-mono transition-colors">
                {showPw ? 'hide' : 'show'}
              </button>
            </div>
            <p className="text-xs text-gray-600 font-mono">Must include uppercase, number, and special character</p>
          </div>

          <div className="space-y-1">
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} required max={new Date().toISOString().split('T')[0]} />
            {age !== null && (
              <p className={`text-xs font-mono ${isMinor ? 'text-purple-400' : 'text-emerald-400'}`}>
                Age: {age} — {isMinor ? '🔒 Child account (requires guardian)' : '✓ Adult account'}
              </p>
            )}
          </div>

          {isMinor && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
              <p className="text-xs text-purple-300 font-mono">⚠ Child accounts require guardian approval</p>
              <Input label="Guardian Email" type="email" placeholder="guardian@example.com" value={form.guardianEmail} onChange={set('guardianEmail')} required={isMinor} />
            </div>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" checked={form.termsAccepted} onChange={set('termsAccepted')} className="mt-0.5 accent-spark-500 w-4 h-4" />
            <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              I agree to the{' '}
              <span className="text-spark-400 underline cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-spark-400 underline cursor-pointer">Privacy Policy</span>
            </span>
          </label>

          <button type="submit" disabled={loading} className="spark-btn-primary w-full mt-2">
            {loading ? <><Spinner /> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Have an account?{' '}
          <Link to="/login" className="text-spark-400 hover:text-spark-300 font-display font-600 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
