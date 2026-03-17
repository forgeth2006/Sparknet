import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resendVerification(email);
      setSent(true);
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="spark-card p-8 text-center">
        <div className="text-5xl mb-4">📨</div>
        <h2 className="font-display font-800 text-xl text-white mb-2">Email Sent</h2>
        <p className="text-gray-400 text-sm mb-6">Check your inbox for the verification link.</p>
        <Link to="/login" className="spark-btn-primary inline-flex">Back to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="spark-card p-8">
        <h1 className="font-display font-800 text-2xl text-white mb-1">Resend Verification</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your email to receive a new link</p>
        <div className="glow-line mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          <button type="submit" disabled={loading} className="spark-btn-primary w-full">
            {loading ? <><Spinner /> Sending...</> : 'Send Link →'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-spark-400 hover:text-spark-300 font-mono transition-colors">← Back to login</Link>
        </p>
      </div>
    </div>
  );
};
