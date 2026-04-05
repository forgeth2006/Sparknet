import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { isGuardian, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon, label, badge }) => (
    <Link
      to={to}
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        isActive(to)
          ? 'bg-spark-500/10 border border-spark-500/20 text-spark-400'
          : 'text-gray-400 hover:text-white hover:bg-dark-700 border border-transparent hover:border-dark-500'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-display font-600 text-sm">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-dark-600 border border-dark-500 text-xs font-mono text-gray-300">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-6">
      <div className="spark-card p-4 space-y-2">
        <h3 className="px-4 text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Main Menu</h3>
        <NavItem to="/dashboard" icon="⚡" label="Dashboard" />
        <NavItem to="/feed" icon="📝" label="Feed" />
        <NavItem to="/challenges" icon="🏆" label="Challenges" />
        <NavItem to="/notifications" icon="🔔" label="Notifications" badge="3" />
      </div>

      <div className="spark-card p-4 space-y-2">
        <h3 className="px-4 text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Personal</h3>
        <NavItem to="/profile" icon="👤" label="Profile" />
        <NavItem to="/settings" icon="⚙️" label="Settings" />
      </div>

      {(isGuardian || isAdmin) && (
        <div className="spark-card p-4 space-y-2">
          <h3 className="px-4 text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Management</h3>
          {isGuardian && <NavItem to="/guardian" icon="👨‍👩‍👧" label="Family Controls" />}
          {isAdmin && <NavItem to="/admin" icon="🛡️" label="Admin Panel" />}
        </div>
      )}
    </aside>
  );
};
