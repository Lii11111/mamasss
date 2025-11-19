import { useState, useEffect, useMemo } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditProductModal from './EditProductModal';

function ProductCard({ product, onAddToCart, onUpdatePrice, onUpdateProduct, onDeleteProduct, categories }) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(product.image);
  const [imageSources, setImageSources] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const sanitizeWords = (text = '') => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const generatedImageSources = useMemo(() => {
    const seen = new Set();
    const sources = [];

    const addSource = (path) => {
      if (path && !seen.has(path)) {
        sources.push(path);
        seen.add(path);
      }
    };

    const words = sanitizeWords(product.name);
    const firstWord = words[0];
    const descriptorWords = words.slice(1);
    const lastWord = words[words.length - 1];

    const baseNames = [];
    const addBaseName = (base) => {
      if (base && !baseNames.includes(base)) {
        baseNames.push(base);
      }
    };

    if (descriptorWords.length) {
      // Most specific: first word + all other words (e.g., lucky-me-beef)
      addBaseName(`/images/${firstWord}-${descriptorWords.join('-')}`);

      // Next: first word + last descriptor (e.g., lucky-beef)
      if (lastWord && lastWord !== firstWord) {
        addBaseName(`/images/${firstWord}-${lastWord}`);
      }

      // Also try entire name slug
      addBaseName(`/images/${words.join('-')}`);
    }

    // General fallback: just the first word
    if (firstWord) {
      addBaseName(`/images/${firstWord}`);
    }

    // Generate all image paths with extensions (most specific first)
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    baseNames.forEach((base) => {
      extensions.forEach((ext) => addSource(`${base}.${ext}`));
    });

    // Manual image path (if provided) should be tried last as fallback
    if (product.image && !sources.includes(product.image)) {
      addSource(product.image);
    }

    return sources;
  }, [product.image, product.name]);

  useEffect(() => {
    // Reset image state when product changes
    setImageError(false);
    setImageSources(generatedImageSources);
    setCurrentImageIndex(0);
    setCurrentImageSrc(generatedImageSources[0] || product.image || null);
    setQuantity(1); // Reset quantity when product changes
  }, [generatedImageSources, product.image, product.id]);

  const handleImageError = () => {
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < imageSources.length) {
      setCurrentImageIndex(nextIndex);
      setCurrentImageSrc(imageSources[nextIndex]);
    } else {
      // No more alternatives, show placeholder
      setImageError(true);
    }
  };

  const handleSaveEdit = (productData) => {
    // If name or category changed, use onUpdateProduct
    if (productData.name !== product.name || productData.category !== product.category) {
      if (onUpdateProduct) {
        onUpdateProduct(product.id, productData);
      } else {
        // Fallback to just updating price if onUpdateProduct not available
        onUpdatePrice(product.id, productData.price);
      }
    } else {
      // Only price changed
      onUpdatePrice(product.id, productData.price);
    }
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
      
      {/* Edit Button */}
      <button
        onClick={() => setShowEditModal(true)}
        className="absolute top-2 right-2 p-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-all duration-200 z-20 shadow-lg hover:shadow-xl border-2 border-emerald-600 hover:scale-110"
        title="Edit product"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

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
        
        <div className="mb-2">
          <p className="text-[9px] text-gray-500 font-medium mb-0.5">Price</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xl font-black text-emerald-600 leading-none">
              ₱{product.price.toFixed(2)}
            </p>
            {/* Quantity Selector */}
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg border border-gray-200 p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(prev => Math.max(1, prev - 1));
                }}
                className="w-6 h-6 flex items-center justify-center bg-white text-emerald-600 rounded hover:bg-emerald-50 transition-colors font-black text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-bold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(prev => prev + 1);
                }}
                className="w-6 h-6 flex items-center justify-center bg-white text-emerald-600 rounded hover:bg-emerald-50 transition-colors font-black text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => {
          setIsAdding(true);
          // Add the product multiple times based on quantity
          for (let i = 0; i < quantity; i++) {
            onAddToCart(product);
          }
          setTimeout(() => {
            setIsAdding(false);
            setQuantity(1); // Reset quantity after adding
          }, 600);
        }}
        className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-2 rounded-md font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg relative z-10 group/btn text-xs overflow-hidden ${
          isAdding ? 'scale-95' : 'active:scale-95'
        }`}
        disabled={isAdding}
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
    
    {/* Edit Product Modal */}
    <EditProductModal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      onSave={handleSaveEdit}
      onDelete={onDeleteProduct}
      product={product}
      categories={categories}
    />
    
    {/* Delete Confirmation Modal - Outside card container */}
    <DeleteConfirmModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={() => {
        onDeleteProduct(product.id);
        setShowDeleteModal(false);
      }}
      productName={product.name}
    />
  </>
  );
}

export default ProductCard;

