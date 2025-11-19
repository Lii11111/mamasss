function CheckoutModal({ isOpen, onClose }) {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Done</h2>
            <p className="text-gray-600">Purchase completed successfully!</p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white py-4 rounded-xl font-black text-lg hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Close</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default CheckoutModal;

