import { useState, useEffect } from 'react';

function ErrorNotification({ error, onClose }) {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in-right">
      <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 max-w-md">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-red-600 rounded p-1 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ErrorNotification;



