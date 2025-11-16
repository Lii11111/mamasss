import ProductCard from './ProductCard';

function ProductList({ products, selectedCategory, onAddToCart, onUpdatePrice }) {
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
      {/* Category Title with Glassmorphism Container */}
      <div className="px-4 md:px-6 pt-4 pb-3 flex justify-center">
        <div className="relative inline-block">
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
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onUpdatePrice={onUpdatePrice} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;

