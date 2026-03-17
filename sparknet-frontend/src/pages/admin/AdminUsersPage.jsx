import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { StatusBadge, RoleBadge, ModeBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['', 'active', 'suspended', 'banned', 'pending_verification', 'pending_guardian_approval'];
const ROLES = ['', 'user', 'child', 'admin'];

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', role: '', status: '', isGuardian: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      if (filters.isGuardian) params.isGuardian = 'true';
      const { data } = await adminApi.getUsers(params);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, debouncedSearch, filters.role, filters.status, filters.isGuardian]);

  useEffect(() => { setPage(1); }, [debouncedSearch, filters.role, filters.status, filters.isGuardian]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const setFilter = (f) => (e) => setFilters({ ...filters, [f]: e.target.value });

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-3xl text-white">Users</h1>
          <p className="text-gray-500 mt-1">{total} total users</p>
        </div>
        <Link to="/admin" className="spark-btn-ghost text-sm">← Admin</Link>
      </div>

      {/* Filters */}
      <div className="spark-card p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search username or email..."
          value={filters.search}
          onChange={setFilter('search')}
          className="spark-input flex-1 min-w-48"
        />
        <select value={filters.role} onChange={setFilter('role')} className="spark-input w-36">
          {ROLES.map(r => <option key={r} value={r}>{r || 'All Roles'}</option>)}
        </select>
        <select value={filters.status} onChange={setFilter('status')} className="spark-input w-48">
          {STATUSES.map(s => <option key={s} value={s}>{s?.replace(/_/g,' ') || 'All Statuses'}</option>)}
        </select>
        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 spark-input w-auto">
          <input type="checkbox" checked={!!filters.isGuardian} onChange={(e) => setFilters({ ...filters, isGuardian: e.target.checked })} className="accent-spark-500" />
          <span className="text-sm text-gray-400 whitespace-nowrap">Guardians only</span>
        </label>
      </div>

      {/* Table */}
      <div className="spark-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  {['User', 'Role', 'Status', 'Mode', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-dark-700/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-spark-500 to-spark-700 flex items-center justify-center text-xs font-display font-700 text-white flex-shrink-0">
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-display font-600 text-sm text-white">{u.username}</p>
                          <p className="text-xs text-gray-500 font-mono">{u.email}</p>
                          {u.isGuardian && <span className="text-xs text-spark-400 font-mono">⚡ guardian ({u.linkedChildrenCount})</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3"><ModeBadge mode={u.mode} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">{formatDateTime(u.lastLoginAt)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/users/${u._id}`} className="spark-btn-ghost text-xs px-3 py-1.5">
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-mono">Page {page} of {pages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="spark-btn-ghost text-sm px-4 py-2 disabled:opacity-30">← Prev</button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="spark-btn-ghost text-sm px-4 py-2 disabled:opacity-30">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
};
