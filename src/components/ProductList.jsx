import ProductCard from './ProductCard';

function ProductList({ products, selectedCategory, onAddToCart, onUpdatePrice, onUpdateProduct, onDeleteProduct, onAddProductClick, categories }) {
  // Category icons mapping
  const categoryIcons = {
    'All': '📦',
    'Snacks': '🍿',
    'Drinks': '🥤',
    'Condiments': '🧂',
    'Biscuits': '🍪',
    'Candies': '🍬',
    'Canned Goods': '🥫',
    'Noodles': '🍜'
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category Title with Glassmorphism Container and Add Button */}
      <div className="px-4 md:px-6 pt-4 pb-3 flex items-center justify-between">
        {/* Add Item Button - Far Left */}
        {onAddProductClick && (
          <button
            onClick={onAddProductClick}
            className="px-4 py-2 md:px-6 md:py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 whitespace-nowrap"
            title="Add new product"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Item</span>
          </button>
        )}
        
        {/* Category Title - Centered */}
        <div className="relative flex-1 flex justify-center">
          {/* Glassmorphism Container */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-50/80 via-white/70 to-emerald-50/80 border border-emerald-200/30 rounded-2xl px-5 md:px-6 py-2.5 md:py-3 shadow-xl shadow-emerald-200/20">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide flex items-center justify-center gap-2">
              <span className="text-2xl md:text-3xl">{categoryIcons[selectedCategory] || '📦'}</span>
              <span>{selectedCategory}</span>
            </h2>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 via-emerald-200/20 to-emerald-300/30 rounded-2xl blur-xl -z-10"></div>
        </div>
        
        {/* Spacer for balance */}
        <div className="w-[120px] md:w-[140px]"></div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 p-2 md:p-4 lg:p-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
            onUpdatePrice={onUpdatePrice}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;

