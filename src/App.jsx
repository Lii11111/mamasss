import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CategorySidebar from './components/CategorySidebar';
import AddProductModal from './components/AddProductModal';
import PurchaseHistory from './components/PurchaseHistory';
import EndSessionModal from './components/EndSessionModal';
import CheckoutModal from './components/CheckoutModal';
import { products as initialProducts, categories } from './data/products';
import { getProductImage } from './data/products';

const STORAGE_KEY = 'janet-sari-sari-product-prices';
const PRODUCTS_STORAGE_KEY = 'janet-sari-sari-custom-products';
const DELETED_PRODUCTS_KEY = 'janet-sari-sari-deleted-products';
const EDITED_PRODUCTS_KEY = 'janet-sari-sari-edited-products';
const PURCHASE_HISTORY_KEY = 'janet-sari-sari-purchase-history';
const SESSION_EARNINGS_KEY = 'janet-sari-sari-session-earnings';

function App() {
  // Load saved prices and custom products from localStorage on mount
  const [products, setProducts] = useState(() => {
    const savedPrices = localStorage.getItem(STORAGE_KEY);
    const savedCustomProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    const savedDeletedProducts = localStorage.getItem(DELETED_PRODUCTS_KEY);
    
    // Get list of deleted product IDs
    let deletedProductIds = [];
    if (savedDeletedProducts) {
      try {
        deletedProductIds = JSON.parse(savedDeletedProducts);
      } catch (error) {
        console.error('Error loading deleted products:', error);
      }
    }
    
    // Filter out deleted products from initial products
    let allProducts = initialProducts.filter(product => !deletedProductIds.includes(product.id));
    
    // Load edited products (initial products that have been modified)
    const savedEditedProducts = localStorage.getItem(EDITED_PRODUCTS_KEY);
    if (savedEditedProducts) {
      try {
        const editedProducts = JSON.parse(savedEditedProducts);
        // Apply edits to initial products
        allProducts = allProducts.map(product => {
          const edited = editedProducts[product.id];
          if (edited) {
            return {
              ...product,
              name: edited.name || product.name,
              category: edited.category || product.category,
              price: edited.price !== undefined ? edited.price : product.price,
              image: (edited.name || edited.category) 
                ? getProductImage(edited.name || product.name, edited.category || product.category)
                : product.image
            };
          }
          return product;
        });
      } catch (error) {
        console.error('Error loading edited products:', error);
      }
    }
    
    // Load custom products and insert them in the correct category position
    if (savedCustomProducts) {
      try {
        const customProducts = JSON.parse(savedCustomProducts);
        // Also filter out deleted custom products
        const activeCustomProducts = customProducts.filter(product => !deletedProductIds.includes(product.id));
        
        // Insert each custom product in the correct position based on category
        const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
        
        activeCustomProducts.forEach(customProduct => {
          let insertIndex = allProducts.length;
          
          // Find the last product of the same category
          for (let i = allProducts.length - 1; i >= 0; i--) {
            if (allProducts[i].category === customProduct.category) {
              insertIndex = i + 1;
              break;
            }
          }
          
          // If category not found, find where to insert based on category order
          if (insertIndex === allProducts.length) {
            const newCategoryIndex = categoryOrder.indexOf(customProduct.category);
            if (newCategoryIndex !== -1) {
              for (let i = 0; i < allProducts.length; i++) {
                const productCategoryIndex = categoryOrder.indexOf(allProducts[i].category);
                if (productCategoryIndex > newCategoryIndex) {
                  insertIndex = i;
                  break;
                }
              }
            }
          }
          
          // Insert the custom product
          allProducts = [
            ...allProducts.slice(0, insertIndex),
            customProduct,
            ...allProducts.slice(insertIndex)
          ];
        });
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
  
  // Purchase history and session management
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const savedHistory = localStorage.getItem(PURCHASE_HISTORY_KEY);
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (error) {
        console.error('Error loading purchase history:', error);
        return [];
      }
    }
    return [];
  });
  
  const [sessionEarnings, setSessionEarnings] = useState(() => {
    const savedEarnings = localStorage.getItem(SESSION_EARNINGS_KEY);
    if (savedEarnings) {
      try {
        return parseFloat(savedEarnings) || 0;
      } catch (error) {
        console.error('Error loading session earnings:', error);
        return 0;
      }
    }
    return 0;
  });
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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
      const updatedProduct = prevProducts.find(p => p.id === productId);
      if (!updatedProduct) return prevProducts;
      
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId ? { ...product, price: updatedPrice } : product
      );
      
      // Save edited products (for initial products that have been modified)
      // Load existing edited products first
      const savedEditedProducts = localStorage.getItem(EDITED_PRODUCTS_KEY);
      let existingEditedProducts = {};
      if (savedEditedProducts) {
        try {
          existingEditedProducts = JSON.parse(savedEditedProducts);
        } catch (error) {
          console.error('Error loading edited products:', error);
        }
      }
      
      // Check specifically the product being edited
      const initialProduct = initialProducts.find(p => p.id === productId);
      if (initialProduct) {
        // Get current product state (after price update)
        const currentProduct = updatedProducts.find(p => p.id === productId);
        
        // Check if the product matches the initial state (all fields)
        const matchesInitial = 
          currentProduct.name === initialProduct.name && 
          currentProduct.category === initialProduct.category && 
          currentProduct.price === initialProduct.price;
        
        if (matchesInitial) {
          // If it matches initial state, remove it from edited products
          delete existingEditedProducts[productId];
        } else {
          // If it doesn't match, save the edit (preserve name and category if they were edited)
          existingEditedProducts[productId] = {
            name: currentProduct.name,
            category: currentProduct.category,
            price: currentProduct.price
          };
        }
      }
      
      // Save the updated edited products map
      localStorage.setItem(EDITED_PRODUCTS_KEY, JSON.stringify(existingEditedProducts));
      
      // Save to localStorage (for backward compatibility)
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

  // Update product (name, category, price)
  const handleUpdateProduct = (productId, productData) => {
    setProducts((prevProducts) => {
      const productIndex = prevProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) return prevProducts;
      
      const oldProduct = prevProducts[productIndex];
      const categoryChanged = oldProduct.category !== productData.category;
      const nameChanged = oldProduct.name !== productData.name;
      
      // Update product
      const updatedProduct = {
        ...oldProduct,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        // Update image path if name or category changed
        image: (nameChanged || categoryChanged) 
          ? getProductImage(productData.name, productData.category)
          : oldProduct.image
      };
      
      let updatedProducts = [...prevProducts];
      updatedProducts[productIndex] = updatedProduct;
      
      // If category changed, reorder products to maintain category grouping
      if (categoryChanged) {
        const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
        
        // Remove product from current position
        updatedProducts = updatedProducts.filter(p => p.id !== productId);
        
        // Find insertion point in new category
        let insertIndex = updatedProducts.length;
        for (let i = updatedProducts.length - 1; i >= 0; i--) {
          if (updatedProducts[i].category === productData.category) {
            insertIndex = i + 1;
            break;
          }
        }
        
        // If category not found, find where to insert based on category order
        if (insertIndex === updatedProducts.length) {
          const newCategoryIndex = categoryOrder.indexOf(productData.category);
          if (newCategoryIndex !== -1) {
            for (let i = 0; i < updatedProducts.length; i++) {
              const productCategoryIndex = categoryOrder.indexOf(updatedProducts[i].category);
              if (productCategoryIndex > newCategoryIndex) {
                insertIndex = i;
                break;
              }
            }
          }
        }
        
        // Insert product at new position
        updatedProducts = [
          ...updatedProducts.slice(0, insertIndex),
          updatedProduct,
          ...updatedProducts.slice(insertIndex)
        ];
      }
      
      // Update localStorage
      const customProducts = updatedProducts.filter(p => p.id > initialProducts.length);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts));
      
      // Save edited products (for initial products that have been modified)
      // Load existing edited products first
      const savedEditedProducts = localStorage.getItem(EDITED_PRODUCTS_KEY);
      let existingEditedProducts = {};
      if (savedEditedProducts) {
        try {
          existingEditedProducts = JSON.parse(savedEditedProducts);
        } catch (error) {
          console.error('Error loading edited products:', error);
        }
      }
      
      // Check specifically the product being edited
      const initialProduct = initialProducts.find(p => p.id === productId);
      if (initialProduct) {
        // Check if the edited product matches the initial state
        const matchesInitial = 
          updatedProduct.name === initialProduct.name && 
          updatedProduct.category === initialProduct.category && 
          updatedProduct.price === initialProduct.price;
        
        if (matchesInitial) {
          // If it matches initial state, remove it from edited products
          delete existingEditedProducts[productId];
        } else {
          // If it doesn't match, save the edit
          existingEditedProducts[productId] = {
            name: updatedProduct.name,
            category: updatedProduct.category,
            price: updatedProduct.price
          };
        }
      }
      
      // Save the updated edited products map
      localStorage.setItem(EDITED_PRODUCTS_KEY, JSON.stringify(existingEditedProducts));
      
      // Save price if changed (for backward compatibility)
      const priceMap = {};
      updatedProducts.forEach(product => {
        const initialProduct = initialProducts.find(p => p.id === product.id);
        if (initialProduct && product.price !== initialProduct.price) {
          priceMap[product.id] = product.price;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(priceMap));
      
      // Update cart if item exists
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId 
            ? { ...item, name: productData.name, category: productData.category, price: productData.price }
            : item
        )
      );
      
      // Switch to new category if category changed
      if (categoryChanged) {
        setSelectedCategory(productData.category);
      }
      
      return updatedProducts;
    });
  };

  // Add new product
  const handleAddProduct = (productData) => {
    setProducts((prevProducts) => {
      // Check for duplicate product (same name and category)
      const isDuplicate = prevProducts.some(
        product => product.name.toLowerCase().trim() === productData.name.toLowerCase().trim() 
        && product.category === productData.category
      );
      
      if (isDuplicate) {
        alert(`A product named "${productData.name}" already exists in the ${productData.category} category.`);
        return prevProducts;
      }
      
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
      
      // Define category order
      const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
      
      // Find the insertion point - after the last product of the same category
      let insertIndex = prevProducts.length;
      
      // First, try to find products of the same category
      let foundSameCategory = false;
      for (let i = prevProducts.length - 1; i >= 0; i--) {
        if (prevProducts[i].category === productData.category) {
          insertIndex = i + 1;
          foundSameCategory = true;
          break;
        }
      }
      
      // If no products of the same category exist, find where to insert based on category order
      if (!foundSameCategory) {
        const newCategoryIndex = categoryOrder.indexOf(productData.category);
        
        if (newCategoryIndex !== -1) {
          // Find the first product of a category that comes after this one
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

  // Handle checkout - add cart to purchase history
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const timestamp = Date.now();
    const purchaseEntry = {
      id: timestamp,
      date: new Date().toISOString(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: total
    };
    
    // Add to purchase history
    const updatedHistory = [purchaseEntry, ...purchaseHistory];
    setPurchaseHistory(updatedHistory);
    localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    // Update session earnings
    const newEarnings = sessionEarnings + total;
    setSessionEarnings(newEarnings);
    localStorage.setItem(SESSION_EARNINGS_KEY, newEarnings.toString());
    
    // Clear cart
    setCart([]);
    setIsCartOpen(false);
    
    // Show checkout confirmation modal
    setIsCheckoutModalOpen(true);
  };
  
  // Handle end session - show modal with total earnings
  const handleEndSession = () => {
    setIsEndSessionModalOpen(true);
  };
  
  // Handle reset session - clear session earnings, purchase history, and close modal
  const handleResetSession = () => {
    setSessionEarnings(0);
    setPurchaseHistory([]);
    localStorage.setItem(SESSION_EARNINGS_KEY, '0');
    localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify([]));
    setIsEndSessionModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) => {
      const productToDelete = prevProducts.find(p => p.id === productId);
      if (!productToDelete) return prevProducts;
      
      const updatedProducts = prevProducts.filter(product => product.id !== productId);
      
      // Save deleted product ID to localStorage (permanent deletion)
      const savedDeletedProducts = localStorage.getItem(DELETED_PRODUCTS_KEY);
      let deletedProductIds = [];
      if (savedDeletedProducts) {
        try {
          deletedProductIds = JSON.parse(savedDeletedProducts);
        } catch (error) {
          console.error('Error loading deleted products:', error);
        }
      }
      if (!deletedProductIds.includes(productId)) {
        deletedProductIds.push(productId);
        localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deletedProductIds));
      }
      
      // Remove from custom products if it was a custom product
      const savedCustomProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedCustomProducts) {
        try {
          const customProducts = JSON.parse(savedCustomProducts);
          const filteredCustomProducts = customProducts.filter(p => p.id !== productId);
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredCustomProducts));
        } catch (error) {
          console.error('Error updating custom products:', error);
        }
      }
      
      // Also update the current custom products list
      const customProducts = updatedProducts.filter(p => p.id > initialProducts.length);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts));
      
      // Remove from edited products if it was edited
      const savedEditedProducts = localStorage.getItem(EDITED_PRODUCTS_KEY);
      if (savedEditedProducts) {
        try {
          const editedProducts = JSON.parse(savedEditedProducts);
          delete editedProducts[productId];
          localStorage.setItem(EDITED_PRODUCTS_KEY, JSON.stringify(editedProducts));
        } catch (error) {
          console.error('Error removing from edited products:', error);
        }
      }
      
      // Remove from cart if it exists there
      setCart((prevCart) => prevCart.filter(item => item.id !== productId));
      
      // Remove price from saved prices if it exists
      const savedPrices = localStorage.getItem(STORAGE_KEY);
      if (savedPrices) {
        try {
          const priceMap = JSON.parse(savedPrices);
          delete priceMap[productId];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(priceMap));
        } catch (error) {
          console.error('Error updating prices:', error);
        }
      }
      
      return updatedProducts;
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-4">
      {isHistoryOpen ? (
        // Purchase History View
        <PurchaseHistory
          purchaseHistory={purchaseHistory}
          sessionEarnings={sessionEarnings}
          onEndSession={handleEndSession}
          onClose={() => setIsHistoryOpen(false)}
        />
      ) : (
        // Main Store View
        <>
          <Navigation
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            cart={cart}
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            onToggleHistory={() => setIsHistoryOpen(true)}
            purchaseHistoryCount={purchaseHistory.length}
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
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddProductClick={() => setIsAddProductModalOpen(true)}
                categories={categories}
              />
            </main>
          </div>
          <Cart
            cart={cart}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            isOpen={isCartOpen}
            onToggle={() => setIsCartOpen(!isCartOpen)}
            onCheckout={handleCheckout}
          />
          
          {/* Add Product Modal */}
          <AddProductModal
            isOpen={isAddProductModalOpen}
            onClose={() => setIsAddProductModalOpen(false)}
            onAddProduct={handleAddProduct}
            categories={categories}
          />
        </>
      )}
      
      {/* End Session Modal */}
      <EndSessionModal
        isOpen={isEndSessionModalOpen}
        onClose={() => setIsEndSessionModalOpen(false)}
        sessionEarnings={sessionEarnings}
        onResetSession={handleResetSession}
      />
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
}

export default App;
