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
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 group-hover:from-emerald-50/50 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-2xl"></div>
      
      {/* Edit Button - Only show when not editing */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 z-10 shadow-sm hover:shadow-md"
          title="Edit price"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      <div className="flex-1 mb-5 relative z-10">
        {/* Category Badge */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${categoryColor}`}>
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        
        {isEditing ? (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Edit Price</label>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-emerald-600">₱</span>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="flex-1 px-3 py-2.5 border-2 border-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 bg-white text-xl font-bold text-emerald-600 w-full transition-all"
                min="0"
                step="0.01"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePrice();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePrice}
                className="flex-1 bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-bold hover:bg-gray-300 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-medium mb-1">Price</p>
            <p className="text-4xl font-black text-emerald-600 leading-none">
              ₱{product.price.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 px-4 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl relative z-10 group/btn"
        disabled={isEditing}
      >
        <span className="text-2xl font-bold group-hover/btn:scale-110 transition-transform">+</span>
        <span className="text-base">Add to Cart</span>
      </button>
    </div>
  );
}

export default ProductCard;

