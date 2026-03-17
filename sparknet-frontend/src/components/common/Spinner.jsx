export const Spinner = ({ size = 'sm' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return <div className={`${s[size]} border-2 border-spark-500 border-t-transparent rounded-full animate-spin`} />;
};

export const FullPageSpinner = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-gray-500 font-mono text-sm">Loading...</p>
    </div>
  </div>
);
