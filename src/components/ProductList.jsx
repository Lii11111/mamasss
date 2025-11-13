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
      {/* Category Title */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-wide text-center flex items-center justify-center gap-3">
          <span className="text-5xl md:text-6xl">{categoryIcons[selectedCategory] || '📦'}</span>
          <span>{selectedCategory}</span>
        </h2>
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

