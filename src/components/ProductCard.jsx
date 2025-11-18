import { useState, useEffect } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

function ProductCard({ product, onAddToCart, onUpdatePrice, onDeleteProduct }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(product.price.toString());
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(product.image);
  const [triedPaths, setTriedPaths] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditPrice(product.price.toString());
    }
  }, [product.price, isEditing]);

  useEffect(() => {
    // Reset image state when product changes
    setImageError(false);
    setCurrentImageSrc(product.image);
    setTriedPaths([product.image]);
  }, [product.image]);

  // Helper to try different extensions when image fails (first word only)
  const tryAlternativeExtension = (imagePath) => {
    if (!imagePath || imagePath.startsWith('http')) return null; // Skip URLs and invalid paths
    
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    const pathWithoutExt = imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const currentExt = imagePath.match(/\.(jpg|jpeg|png|webp)$/i)?.[1]?.toLowerCase();
    
    // Try other extensions (filename stays the same - first word only)
    for (const ext of extensions) {
      if (ext !== currentExt) {
        const newPath = `${pathWithoutExt}.${ext}`;
        if (!triedPaths.includes(newPath)) {
          setTriedPaths(prev => [...prev, imagePath, newPath]);
          return newPath;
        }
      }
    }
    
    return null;
  };

  const handleImageError = () => {
    const alternativePath = tryAlternativeExtension(currentImageSrc);
    if (alternativePath) {
      // Try the alternative extension
      setCurrentImageSrc(alternativePath);
    } else {
      // No more alternatives, show placeholder
      setImageError(true);
    }
  };

  const handleSavePrice = () => {
    const newPrice = parseFloat(editPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onUpdatePrice(product.id, newPrice);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditPrice(product.price.toString());
    setIsEditing(false);
  };

  const categoryColors = {
    'Snacks': 'bg-orange-100 text-orange-700 border-orange-200',
    'Drinks': 'bg-blue-100 text-blue-700 border-blue-200',
    'Condiments': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Biscuits': 'bg-amber-100 text-amber-700 border-amber-200',
    'Candies': 'bg-pink-100 text-pink-700 border-pink-200',
    'Canned Goods': 'bg-red-100 text-red-700 border-red-200',
    'Noodles': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const categoryColor = categoryColors[product.category] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <>
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg p-2.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 relative overflow-hidden">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/0 to-gray-50/0 group-hover:from-gray-50/50 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-lg"></div>
      
      {/* Edit Button - Only show when not editing */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 p-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-all duration-200 z-20 shadow-lg hover:shadow-xl border-2 border-emerald-600 hover:scale-110"
          title="Edit price"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      <div className="flex-1 mb-2 relative z-10">
        {/* Product Image */}
        <div className="mb-2 rounded-md overflow-hidden bg-transparent aspect-square flex items-center justify-center group-hover:scale-105 transition-transform duration-300 min-h-[120px] relative">
          {!imageError && currentImageSrc ? (
            <img 
              src={currentImageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-700 text-xs font-bold text-center px-2">
                {product.name}
              </span>
            </div>
          )}
        </div>

        {/* Product Name and Category on Same Line */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors flex-1 truncate">
            {product.name}
          </h3>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border flex-shrink-0 ${categoryColor}`}>
            {product.category}
          </span>
        </div>
        
        {isEditing ? (
          <div className="mb-2">
            <label className="block text-[9px] font-semibold text-gray-600 mb-1">Edit Price</label>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="text-base font-bold text-emerald-600">₱</span>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="flex-1 px-1.5 py-1 border-2 border-emerald-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 bg-white text-base font-bold text-emerald-600 w-full transition-all"
                min="0"
                step="0.01"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePrice();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <button
                  onClick={handleSavePrice}
                  className="flex-1 bg-emerald-500 text-white py-1.5 px-1.5 rounded-md text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-1.5 px-1.5 rounded-md text-[10px] font-bold hover:bg-gray-300 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Cancel
                </button>
              </div>
              {onDeleteProduct && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-500 text-white py-1.5 px-1.5 rounded-md text-[10px] font-bold hover:bg-red-600 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Product
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <p className="text-[9px] text-gray-500 font-medium mb-0.5">Price</p>
            <p className="text-xl font-black text-emerald-600 leading-none">
              ₱{product.price.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => {
          setIsAdding(true);
          onAddToCart(product);
          setTimeout(() => setIsAdding(false), 600);
        }}
        className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-2 rounded-md font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg relative z-10 group/btn text-xs overflow-hidden ${
          isAdding ? 'scale-95' : 'active:scale-95'
        }`}
        disabled={isEditing || isAdding}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <span className="text-base font-bold group-hover/btn:scale-110 transition-transform">+</span>
            <span>Add to Cart</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-200"></span>
          </>
        )}
      </button>
    </div>
    
    {/* Delete Confirmation Modal - Outside card container */}
    <DeleteConfirmModal
      isOpen={showDeleteModal}
      onClose={() => {
        setShowDeleteModal(false);
        setIsEditing(false);
      }}
      onConfirm={() => {
        onDeleteProduct(product.id);
        setShowDeleteModal(false);
        setIsEditing(false);
      }}
      productName={product.name}
    />
  </>
  );
}

export default ProductCard;

