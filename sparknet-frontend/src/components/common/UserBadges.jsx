const badgeThemes = {
  creator: {
    icon: '🎨',
    label: 'Creative Thinker',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400'
  },
  mentor: {
    icon: '🌟',
    label: 'Helpful Mentor',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400'
  },
  learner: {
    icon: '📚',
    label: 'Consistent Learner',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400'
  },
  explorer: {
    icon: '🧭',
    label: 'Explorer',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400'
  }
};

export const UserBadgeDisplay = ({ badges = [] }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {badges.map((badgeKey) => {
        const theme = badgeThemes[badgeKey];
        if (!theme) return null;
        return (
          <div 
            key={badgeKey}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${theme.bg} ${theme.border} group relative`}
            title={theme.label}
          >
            <span className="text-sm transform group-hover:scale-125 transition-transform">{theme.icon}</span>
            <span className={`text-xs font-mono tracking-tight hidden sm:block ${theme.text}`}>
              {theme.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
