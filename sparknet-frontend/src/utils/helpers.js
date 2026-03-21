export const getStatusColor = (status) => {
  const map = {
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    suspended: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    banned: 'text-red-400 bg-red-400/10 border-red-400/20',
    pending_verification: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    pending_guardian_approval: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };
  return map[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
};

export const getRoleColor = (role) => {
  const map = {
    admin: 'text-spark-400 bg-spark-400/10 border-spark-400/20',
    user: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    child: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };
  return map[role] || 'text-gray-400 bg-gray-400/10';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'An unexpected error occurred';
