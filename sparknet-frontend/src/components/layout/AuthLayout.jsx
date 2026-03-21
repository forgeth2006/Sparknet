import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Logo } from '../common/Logo';

export const AuthLayout = () => (
  <div className="min-h-screen bg-dark-900 flex flex-col">
    {/* Background decoration */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-spark-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-spark-700/5 rounded-full blur-[80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-spark-500/3 via-transparent to-transparent" />
    </div>

    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="mb-8"><Logo size="lg" /></div>
      <Outlet />
    </div>

    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1a1a24', color: '#e2e2f0', border: '1px solid #2e2e3e', fontFamily: 'DM Sans' },
        success: { iconTheme: { primary: '#f97316', secondary: '#0a0a0f' } },
      }}
    />
  </div>
);
