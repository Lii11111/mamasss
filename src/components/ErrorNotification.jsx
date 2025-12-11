import { useState, useEffect } from 'react';

function ErrorNotification({ error, onClose }) {
  useEffect(() => {
    if (error) {
      // Show error longer for important sync failures (15 seconds instead of 5)
      const isSyncError = error.toLowerCase().includes('failed to sync') || 
                         error.toLowerCase().includes('permission denied') ||
                         error.toLowerCase().includes('timeout');
      const duration = isSyncError ? 15000 : 5000;
      
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  const isSyncError = error?.toLowerCase().includes('failed to sync') || 
                     error?.toLowerCase().includes('permission denied') ||
                     error?.toLowerCase().includes('timeout');
  
  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in-right">
      <div className={`${isSyncError ? 'bg-red-600 border-2 border-red-800' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 max-w-lg ${isSyncError ? 'ring-4 ring-red-300' : ''}`}>
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
          <p className="font-bold text-base">{isSyncError ? '⚠️ Sync Error' : 'Error'}</p>
          <p className={`${isSyncError ? 'text-sm font-medium mt-1' : 'text-sm'} break-words`}>{error}</p>
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



