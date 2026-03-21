export const Input = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="spark-label">{label}</label>}
    <input className={`spark-input ${error ? 'border-red-500/60 focus:border-red-500' : ''}`} {...props} />
    {error && <p className="text-xs text-red-400 font-mono mt-1">{error}</p>}
  </div>
);
