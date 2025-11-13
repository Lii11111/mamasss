import { useState, useEffect } from 'react';

function ProductCard({ product, onAddToCart, onUpdatePrice }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(product.price.toString());

  useEffect(() => {
    if (!isEditing) {
      setEditPrice(product.price.toString());
    }
  }, [product.price, isEditing]);

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

  return (
    <div className="bg-stone-50 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-stone-200 relative">
      {/* Edit Button - Only show when not editing */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors z-10"
          title="Edit price"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      <div className="flex-1 mb-4">
        <div className="bg-white rounded-lg p-3 mb-3 border border-stone-200">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">{product.category}</p>
        </div>
        
        {isEditing ? (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price</label>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-lg font-bold text-emerald-600">₱</span>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="flex-1 px-2 py-2 border-2 border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-lg font-bold text-emerald-600 w-full"
                min="0"
                step="0.01"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePrice();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleSavePrice}
                className="flex-1 bg-emerald-500 text-white py-1.5 px-2 rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-stone-300 text-gray-700 py-1.5 px-2 rounded-lg text-xs font-semibold hover:bg-stone-400 transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-3xl font-bold text-emerald-600 mb-4">
            ₱{product.price.toFixed(2)}
          </p>
        )}
      </div>
      <button
        onClick={() => onAddToCart(product)}
        className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isEditing}
      >
        <span className="text-xl font-bold">+</span>
        <span>Add to Cart</span>
      </button>
    </div>
  );
}

export default ProductCard;

