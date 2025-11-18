import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CategorySidebar from './components/CategorySidebar';
import AddProductModal from './components/AddProductModal';
import { products as initialProducts, categories } from './data/products';
import { getProductImage } from './data/products';

const STORAGE_KEY = 'janet-sari-sari-product-prices';
const PRODUCTS_STORAGE_KEY = 'janet-sari-sari-custom-products';

function App() {
  // Load saved prices and custom products from localStorage on mount
  const [products, setProducts] = useState(() => {
    const savedPrices = localStorage.getItem(STORAGE_KEY);
    const savedCustomProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    
    let allProducts = [...initialProducts];
    
    // Load custom products
    if (savedCustomProducts) {
      try {
        const customProducts = JSON.parse(savedCustomProducts);
        allProducts = [...allProducts, ...customProducts];
      } catch (error) {
        console.error('Error loading custom products:', error);
      }
    }
    
    // Load saved prices
    if (savedPrices) {
      try {
        const priceMap = JSON.parse(savedPrices);
        allProducts = allProducts.map(product => ({
          ...product,
          price: priceMap[product.id] !== undefined ? priceMap[product.id] : product.price
        }));
      } catch (error) {
        console.error('Error loading saved prices:', error);
      }
    }
    
    return allProducts;
  });
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

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

  // Add new product
  const handleAddProduct = (productData) => {
    setProducts((prevProducts) => {
      // Find the highest ID and add 1
      const maxId = prevProducts.reduce((max, product) => 
        product.id > max ? product.id : max, 0
      );
      const newId = maxId + 1;
      
      // Create new product with image
      const newProduct = {
        id: newId,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: getProductImage(productData.name, productData.category)
      };
      
      // Find the insertion point - after the last product of the same category
      let insertIndex = prevProducts.length;
      for (let i = prevProducts.length - 1; i >= 0; i--) {
        if (prevProducts[i].category === productData.category) {
          insertIndex = i + 1;
          break;
        }
      }
      
      // If category not found, find where to insert based on category order
      if (insertIndex === prevProducts.length) {
        const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
        const newCategoryIndex = categoryOrder.indexOf(productData.category);
        
        if (newCategoryIndex !== -1) {
          // Find the first product of the next category
          for (let i = 0; i < prevProducts.length; i++) {
            const productCategoryIndex = categoryOrder.indexOf(prevProducts[i].category);
            if (productCategoryIndex > newCategoryIndex) {
              insertIndex = i;
              break;
            }
          }
        }
      }
      
      // Insert the new product at the correct position
      const updatedProducts = [
        ...prevProducts.slice(0, insertIndex),
        newProduct,
        ...prevProducts.slice(insertIndex)
      ];
      
      // Save custom products to localStorage
      const customProducts = updatedProducts.filter(p => p.id > initialProducts.length);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts));
      
      // Switch to the product's category
      setSelectedCategory(productData.category);
      
      return updatedProducts;
    });
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter(product => product.id !== productId);
      
      // Update localStorage - remove from custom products if it was a custom product
      const customProducts = updatedProducts.filter(p => p.id > initialProducts.length);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts));
      
      // Also remove from cart if it exists there
      setCart((prevCart) => prevCart.filter(item => item.id !== productId));
      
      return updatedProducts;
    });
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
            onDeleteProduct={handleDeleteProduct}
            onAddProductClick={() => setIsAddProductModalOpen(true)}
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
      
      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        categories={categories}
      />
      
    </div>
  );
}

export default App;
