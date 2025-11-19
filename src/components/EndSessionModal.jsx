function EndSessionModal({ isOpen, onClose, sessionEarnings, onResetSession }) {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Session Ended</h2>
            <p className="text-gray-600">Total earnings for this session</p>
          </div>
          
          {/* Earnings Display */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 md:p-8 mb-6 border-2 border-emerald-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium mb-2">Total Earnings</p>
              <p className="text-4xl md:text-5xl font-black text-emerald-600">
                ₱{sessionEarnings.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-gray-700 font-medium">
              Great job! Your session earnings have been recorded.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-black text-lg hover:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              Cancel
            </button>
            
            {/* Close/Confirm Button */}
            <button
              onClick={() => {
                onResetSession();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white py-4 rounded-xl font-black text-lg hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>End</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EndSessionModal;

