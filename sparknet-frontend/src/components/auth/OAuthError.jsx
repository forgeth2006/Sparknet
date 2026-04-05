import React from 'react';
import { motion } from 'framer-motion';

const errorVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.6 } }
};

export default function OAuthError({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg shadow-lg text-center"
        initial="hidden"
        animate="visible"
        whileHover="shake"
        variants={errorVariants}
      >
        <svg className="mx-auto mb-4 animate-bounce" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">OAuth Error</h2>
        <p className="mb-2">{message || 'An unknown error occurred during authentication.'}</p>
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => window.location.href = '/login'}>
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
