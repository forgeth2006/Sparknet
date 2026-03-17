import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guardianApi } from '../../api/guardianApi';
import { Spinner } from '../../components/common/Spinner';

export const GuardianApprovePage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    guardianApi.approveChild(token)
      .then(({ data: d }) => { setData(d); setStatus('success'); })
      .catch((err) => {
        const e = err?.response?.data;
        setError(e?.message || 'Approval failed');
        setStatus('error');
        if (e?.code === 'GUARDIAN_NOT_REGISTERED') setStatus('not_registered');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md spark-card p-8 text-center animate-slide-up">
        {status === 'loading' && <><Spinner size="lg" /><p className="text-gray-400 mt-4 font-mono text-sm">Processing approval...</p></>}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display font-800 text-2xl text-white mb-2">Approved!</h2>
            <p className="text-gray-400 text-sm mb-2">{data?.message}</p>
            {data?.child && <p className="text-spark-400 font-mono text-sm mb-6">Child: {data.child.username}</p>}
            {data?.guardianCapabilityUnlocked && (
              <div className="p-3 rounded-xl bg-spark-500/10 border border-spark-500/20 mb-6">
                <p className="text-spark-400 text-xs font-mono">⚡ Guardian dashboard unlocked!</p>
              </div>
            )}
            <Link to="/login" className="spark-btn-primary inline-flex">Go to Login →</Link>
          </>
        )}

        {status === 'not_registered' && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-display font-800 text-xl text-white mb-2">Register First</h2>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <Link to="/register" className="spark-btn-primary inline-flex">Register as Guardian →</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="font-display font-800 text-xl text-white mb-2">Approval Failed</h2>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <Link to="/login" className="spark-btn-ghost inline-flex">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};
