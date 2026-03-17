import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export const AppLayout = () => (
  <div className="min-h-screen bg-dark-900">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1a1a24', color: '#e2e2f0', border: '1px solid #2e2e3e', fontFamily: 'DM Sans' },
        success: { iconTheme: { primary: '#f97316', secondary: '#0a0a0f' } },
      }}
    />
  </div>
);
