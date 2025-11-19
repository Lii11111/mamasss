import { useState, useEffect } from 'react';

function PurchaseHistory({ purchaseHistory, sessionEarnings, onEndSession, onClose }) {
  const [imageSources, setImageSources] = useState({});
  const [triedPaths, setTriedPaths] = useState({});
  
  // Helper to get first word from product name
  const getFirstWord = (productName) => {
    return productName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .split(/\s+/)[0];
  };
  
  // Initialize image sources for all items in history
  useEffect(() => {
    setImageSources(prev => {
      const newSources = { ...prev };
      const newTriedPaths = { ...triedPaths };
      let hasChanges = false;
      
      purchaseHistory.forEach(entry => {
        entry.items.forEach(item => {
          if (item.name && !newSources[item.id]) {
            const firstWord = getFirstWord(item.name);
            const initialPath = `/images/${firstWord}.jpg`;
            newSources[item.id] = initialPath;
            newTriedPaths[item.id] = [initialPath];
            hasChanges = true;
          }
        });
      });
      
      if (hasChanges) {
        setTriedPaths(newTriedPaths);
        return newSources;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseHistory]);
  
  const handleImageError = (itemId, currentPath) => {
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    const tried = triedPaths[itemId] || [];
    
    // Find next extension to try
    const currentExt = currentPath.split('.').pop();
    const extIndex = extensions.indexOf(currentExt);
    const nextExt = extensions[extIndex + 1];
    
    if (nextExt) {
      const pathWithoutExt = currentPath.replace(/\.[^.]+$/, '');
      const nextPath = `${pathWithoutExt}.${nextExt}`;
      
      setTriedPaths(prev => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), currentPath, nextPath]
      }));
      setImageSources(prev => ({
        ...prev,
        [itemId]: nextPath
      }));
    } else {
      setImageSources(prev => ({
        ...prev,
        [itemId]: null
      }));
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-5 md:p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-100 transition-all p-2 rounded-lg hover:bg-white/20 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Purchase History</span>
            </h1>
          </div>
        </div>
      </div>
      
      {/* Session Earnings Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b-2 border-emerald-200 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border-2 border-emerald-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Current Session Earnings</p>
                <p className="text-3xl md:text-4xl font-black text-emerald-600">₱{sessionEarnings.toFixed(2)}</p>
              </div>
              <button
                onClick={onEndSession}
                className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-black text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Purchase History List */}
      <div className="container mx-auto px-4 py-6">
        {purchaseHistory.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📦</div>
            <p className="text-gray-600 text-xl font-bold mb-2">No purchases yet</p>
            <p className="text-gray-400 text-sm">Checkout items to see purchase history here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchaseHistory.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 md:p-6 border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Entry Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 pb-4 border-b-2 border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Purchase Date</p>
                    <p className="text-base font-bold text-gray-900">{formatDate(entry.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                    <p className="text-2xl md:text-3xl font-black text-emerald-600">₱{entry.total.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Items List */}
                <div className="space-y-3">
                  {entry.items.map((item) => {
                    const imageSrc = imageSources[item.id] || item.image;
                    return (
                      <div
                        key={`${entry.id}-${item.id}`}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                      >
                        {/* Product Image */}
                        {imageSrc ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={imageSrc}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(item.id, imageSrc)}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                              <span className="font-semibold">Qty:</span> {item.quantity}
                            </span>
                            <span className="text-emerald-600 font-bold">
                              ₱{item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        
                        {/* Subtotal */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                          <p className="text-lg font-black text-emerald-600">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseHistory;

