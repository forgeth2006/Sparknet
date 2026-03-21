import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Spinner } from '../../components/common/Spinner';

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    authApi.verifyEmail(token)
      .then(({ data }) => { setStatus('success'); setMessage(data.message); })
      .catch((err) => { setStatus('error'); setMessage(err?.response?.data?.message || 'Verification failed'); });
  }, [token]);

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="spark-card p-8 text-center">
        {status === 'loading' && (<><Spinner size="lg" /><p className="text-gray-400 mt-4 font-mono text-sm">Verifying your email...</p></>)}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-display font-800 text-xl text-white mb-2">Email Verified!</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <Link to="/login" className="spark-btn-primary inline-flex">Go to Login →</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="font-display font-800 text-xl text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <Link to="/resend-verification" className="spark-btn-ghost inline-flex">Resend Verification</Link>
          </>
        )}
      </div>
    </div>
  );
};
