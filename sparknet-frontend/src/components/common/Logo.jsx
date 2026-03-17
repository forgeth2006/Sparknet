export const Logo = ({ size = 'md' }) => {
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' };
  return (
    <div className={`font-display font-800 ${sizes[size]} flex items-center gap-2`}>
      <span className="text-spark-500">⚡</span>
      <span className="text-white">Spark</span>
      <span className="text-spark-500">Net</span>
    </div>
  );
};
