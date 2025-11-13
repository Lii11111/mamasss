import ProductCard from './ProductCard';

function ProductList({ products, onAddToCart, onUpdatePrice }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onUpdatePrice={onUpdatePrice} />
      ))}
    </div>
  );
}

export default ProductList;

