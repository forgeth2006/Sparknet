export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, danger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative spark-card p-6 w-full max-w-md animate-slide-up">
        <h3 className="font-display font-700 text-lg text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="spark-btn-ghost">Cancel</button>
          <button
            onClick={onConfirm}
            className={danger ? 'spark-btn bg-red-500 hover:bg-red-600 text-white' : 'spark-btn-primary'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
