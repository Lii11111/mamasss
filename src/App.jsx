import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CategorySidebar from './components/CategorySidebar';
import { products as initialProducts, categories } from './data/products';

const STORAGE_KEY = 'janet-sari-sari-product-prices';

function App() {
  // Load saved prices from localStorage on mount
  const [products, setProducts] = useState(() => {
    const savedPrices = localStorage.getItem(STORAGE_KEY);
    if (savedPrices) {
      try {
        const priceMap = JSON.parse(savedPrices);
        return initialProducts.map(product => ({
          ...product,
          price: priceMap[product.id] !== undefined ? priceMap[product.id] : product.price
        }));
      } catch (error) {
        console.error('Error loading saved prices:', error);
        return initialProducts;
      }
    }
    return initialProducts;
  });
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter products based on category and search term
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Add product to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Update product price
  const handleUpdatePrice = (productId, newPrice) => {
    const updatedPrice = parseFloat(newPrice);
    
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId ? { ...product, price: updatedPrice } : product
      );
      
      // Save to localStorage
      const priceMap = {};
      updatedProducts.forEach(product => {
        // Only save prices that differ from initial prices
        const initialProduct = initialProducts.find(p => p.id === product.id);
        if (initialProduct && product.price !== initialProduct.price) {
          priceMap[product.id] = product.price;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(priceMap));
      
      return updatedProducts;
    });
    
    // Also update price in cart if item exists
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, price: updatedPrice } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-4">
      <Navigation
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cart={cart}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
      />
      <div className="flex">
        {/* Category Sidebar - Desktop Only */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {/* Main Content - Adjusted for sidebar on desktop */}
        <main className="flex-1 md:ml-64">
          <ProductList 
            products={filteredProducts} 
            selectedCategory={selectedCategory}
            onAddToCart={handleAddToCart} 
            onUpdatePrice={handleUpdatePrice} 
          />
        </main>
      </div>
      <Cart
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
      />
    </div>
  );
}

export default App;
