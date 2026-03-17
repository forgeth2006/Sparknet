import { getStatusColor, getRoleColor } from '../../utils/helpers';

export const StatusBadge = ({ status }) => (
  <span className={`spark-badge border ${getStatusColor(status)}`}>
    {status?.replace(/_/g, ' ')}
  </span>
);

export const RoleBadge = ({ role }) => (
  <span className={`spark-badge border ${getRoleColor(role)}`}>
    {role}
  </span>
);

export const ModeBadge = ({ mode }) => (
  <span className={`spark-badge border ${mode === 'youth' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
    {mode}
  </span>
);
