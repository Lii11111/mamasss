import { useState, useMemo, useEffect } from 'react';
import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CategorySidebar from './components/CategorySidebar';
import AddProductModal from './components/AddProductModal';
import PurchaseHistory from './components/PurchaseHistory';
import EndSessionModal from './components/EndSessionModal';
import CheckoutModal from './components/CheckoutModal';
import ErrorNotification from './components/ErrorNotification';
import { products as initialProducts, categories } from './data/products';
import { getProductImage } from './data/products';
import { getAllProducts, addProduct, updateProduct, deleteProduct, addPurchase, getAllPurchases, saveSession } from './firebase/firestoreService';
import { updateProductViaAPI, updateProductByNameViaAPI, addPurchaseViaAPI, checkAPIAvailability, getAllProductsViaAPI, getAPIBaseURL } from './utils/apiService';
import './utils/firestoreDebug'; // Load debug utilities

const STORAGE_KEY = 'janet-sari-sari-product-prices';
const PRODUCTS_STORAGE_KEY = 'janet-sari-sari-custom-products';
const DELETED_PRODUCTS_KEY = 'janet-sari-sari-deleted-products';
const EDITED_PRODUCTS_KEY = 'janet-sari-sari-edited-products';
const PURCHASE_HISTORY_KEY = 'janet-sari-sari-purchase-history';
const SESSION_EARNINGS_KEY = 'janet-sari-sari-session-earnings';
const CART_STORAGE_KEY = 'janet-sari-sari-cart';

function App() {
  // Start with empty products, will load from Firestore
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsFromFirestore, setProductsFromFirestore] = useState(false); // Track if products came from Firestore
  const [apiAvailable, setApiAvailable] = useState(false); // Track if backend API is available
  
  // Check API availability on mount
  useEffect(() => {
    checkAPIAvailability().then(available => {
      setApiAvailable(available);
      if (available) {
        console.log('✅ Backend API is available (fallback for Firestore writes)');
      } else {
        console.warn('⚠️ Backend API not available. Firestore writes only.');
      }
    });
  }, []);
  
  // Load products from Firestore on mount
  useEffect(() => {
    const loadProducts = async () => {
      // Show initial products immediately (don't wait)
      setProducts(initialProducts);
      setIsLoadingProducts(false);
      
      // Check if API is available first (more reliable than Firestore client SDK)
      const apiAvailable = await checkAPIAvailability();
      
      // Priority 1: Try backend API first (most reliable, has latest data)
      if (apiAvailable) {
        try {
          console.log('📦 Loading products from backend API (priority 1)...');
          const startTime = Date.now();
          const apiProducts = await Promise.race([
            getAllProductsViaAPI(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout (5s)')), 5000))
          ]);
          
          const loadTime = Date.now() - startTime;
          if (apiProducts && apiProducts.length > 0) {
            console.log(`✅ Loaded ${apiProducts.length} products from backend API in ${loadTime}ms`);
            console.log('Sample product IDs:', apiProducts.slice(0, 3).map(p => ({ id: p.id, type: typeof p.id, name: p.name, price: p.price })));
            setProducts(apiProducts);
            setProductsFromFirestore(true);
            return; // Success! Stop here
          }
        } catch (apiError) {
          console.warn('⚠️ Backend API load failed:', apiError.message);
          // Continue to Firestore fallback below
        }
      }
      
      // Priority 2: Try Firestore client SDK (fallback if API not available or failed)
      try {
        console.log('📦 Loading products from Firestore (priority 2)...');
        const startTime = Date.now();
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore query timeout (8s)')), 8000)
        );
        
        const firestoreProducts = await Promise.race([
          getAllProducts(),
          timeoutPromise
        ]);
        
        const loadTime = Date.now() - startTime;
        console.log(`✅ Loaded ${firestoreProducts.length} products from Firestore in ${loadTime}ms`);
        console.log('Sample product IDs:', firestoreProducts.slice(0, 3).map(p => ({ id: p.id, type: typeof p.id, name: p.name, price: p.price })));
        
        if (firestoreProducts && firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
          setProductsFromFirestore(true);
          return; // Success! Stop here
        } else {
          console.warn('⚠️ No products in Firestore, keeping initial products');
          setProductsFromFirestore(false);
        }
      } catch (error) {
        console.error('❌ Error loading products from Firestore:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // If both API and Firestore failed, keep initial products as last resort
        console.warn('⚠️ Both API and Firestore failed. Using initial products (may have old prices).');
        setProductsFromFirestore(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Sync cart with current products after products are loaded
  // This ensures cart items have correct IDs, prices, and names
  useEffect(() => {
    if (products.length === 0) return; // Wait for products to load
    
    setCart((prevCart) => {
      if (prevCart.length === 0) return prevCart;
      
      // Sync each cart item with current products
      const syncedCart = prevCart
        .map((cartItem) => {
          // Try to find product by ID first
          let product = products.find(p => p.id === cartItem.id);
          
          // If not found by ID, try to find by name (in case ID changed)
          if (!product) {
            product = products.find(p => 
              p.name.toLowerCase().trim() === cartItem.name?.toLowerCase().trim()
            );
          }
          
          if (product) {
            // Update cart item with latest product data (price, image, etc.)
            return {
              ...cartItem,
              id: product.id, // Update ID in case it changed
              name: product.name,
              price: product.price, // Use latest price
              category: product.category,
              image: product.image || cartItem.image
            };
          }
          
          // Product not found (might have been deleted), keep it for now
          // User can remove it manually if needed
          return cartItem;
        })
        .filter((cartItem) => {
          // Remove items if product was deleted (optional - you can keep them)
          // For now, we'll keep them so user can see what was removed
          return true;
        });
      
      // Only update if there were changes
      if (JSON.stringify(syncedCart) !== JSON.stringify(prevCart)) {
        console.log('🔄 Synced cart with current products');
        return syncedCart;
      }
      
      return prevCart;
    });
  }, [products]); // Sync whenever products change
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load cart from localStorage on mount
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      return [];
    }
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [cart]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  // Purchase history and session management
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [sessionEarnings, setSessionEarnings] = useState(0);
  
  // Track session start time (initialize from localStorage or current time)
  const [sessionStartTime, setSessionStartTime] = useState(() => {
    try {
      const saved = localStorage.getItem('janet-sari-sari-session-start-time');
      return saved ? new Date(saved) : new Date();
    } catch {
      return new Date();
    }
  });
  
  // Check API availability on mount
  useEffect(() => {
    checkAPIAvailability().then(available => {
      setApiAvailable(available);
      if (available) {
        console.log('✅ Backend API is available (fallback for Firestore writes)');
      } else {
        console.warn('⚠️ Backend API not available. Firestore writes only.');
      }
    });
  }, []);

  // Load purchase history from Firestore
  useEffect(() => {
    const loadPurchaseHistory = async () => {
      try {
        const purchases = await getAllPurchases();
        setPurchaseHistory(purchases);
        
        // Calculate session earnings from purchases
        const totalEarnings = purchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
        setSessionEarnings(totalEarnings);
      } catch (error) {
        console.error('Error loading purchase history:', error);
        // Fallback to localStorage
        const savedHistory = localStorage.getItem(PURCHASE_HISTORY_KEY);
        if (savedHistory) {
          try {
            const history = JSON.parse(savedHistory);
            setPurchaseHistory(history);
            const totalEarnings = history.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
            setSessionEarnings(totalEarnings);
          } catch (e) {
            showError('Error loading purchase history');
          }
        }
      }
    };
    
    loadPurchaseHistory();
  }, []);
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // Helper function to show errors in the browser UI
  const showError = (message) => {
    setError(message);
    // Also log to browser console for developers
    console.error(message);
  };

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
  const handleUpdatePrice = async (productId, newPrice) => {
    const updatedPrice = parseFloat(newPrice);
    const product = products.find(p => p.id === productId);
    if (!product) {
      showError('Product not found');
      return;
    }
    
    // Check if product has a Firestore ID (string) or is from initial data (number)
    // Firestore products have string IDs, initial products have numeric IDs
    // Firestore IDs are strings that are NOT numbers
    const isFirestoreProduct = typeof productId === 'string' && !productId.startsWith('temp-') && isNaN(Number(productId));
    const shouldSaveToFirestore = isFirestoreProduct || productsFromFirestore;
    
    console.log('🔧 Updating price:', { 
      productId, 
      type: typeof productId, 
      isFirestoreProduct,
      productsFromFirestore,
      shouldSaveToFirestore,
      productName: product.name,
      newPrice: updatedPrice
    });
    
    try {
      // Always update local state first for immediate feedback
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, price: updatedPrice } : product
        )
      );
      
      // Also update price in cart if item exists
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, price: updatedPrice } : item
        )
      );
      
      // ALWAYS try to save to Firestore (either via client SDK or backend API)
      // Even if product has numeric ID, we can find it by name+category
      const updateData = {
        name: product.name,
        category: product.category,
        price: updatedPrice,
        image: product.image
      };
      
      let saved = false;
      
      // Try Firestore client SDK first (only if we have Firestore ID)
      if (isFirestoreProduct) {
        try {
          console.log('📤 Attempting Firestore client SDK update:', {
            productId,
            productName: product.name,
            newPrice: updatedPrice
          });
          const result = await Promise.race([
            updateProduct(productId, updateData),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);
          console.log('✅ Firestore client SDK update successful!', result);
          // Update local state with updated product
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === productId ? { ...p, price: updatedPrice } : p
            )
          );
          saved = true;
        } catch (firestoreError) {
          console.warn('⚠️ Firestore client SDK failed:', firestoreError.code || firestoreError.message);
          // Will fall through to API fallback below
        }
      }
      
      // Fallback to backend API if client SDK failed or product has numeric ID
      if (!saved && apiAvailable) {
        try {
          if (isFirestoreProduct) {
            // Try API with Firestore ID
            console.log('📤 Attempting backend API update with ID (fallback)...');
            const result = await updateProductViaAPI(productId, updateData);
            console.log('✅ Backend API update successful!', result);
            // Update local state with the updated product from server
            setProducts((prevProducts) =>
              prevProducts.map((p) =>
                p.id === productId ? { ...p, ...result } : p
              )
            );
            saved = true;
          } else {
            // Try API with name+category (for numeric IDs)
            console.log('📤 Attempting backend API update by name+category...');
            const result = await updateProductByNameViaAPI(updateData);
            console.log('✅ Backend API update by name successful!', result);
            // Update local product ID and data to match Firestore
            setProducts((prevProducts) =>
              prevProducts.map((p) =>
                p.id === productId ? { ...result } : p
              )
            );
            setProductsFromFirestore(true); // Mark that we now have Firestore products
            saved = true;
          }
        } catch (apiError) {
          console.error('❌ Backend API update failed:', apiError);
          showError(`Failed to save price: ${apiError.message || 'Check console for details'}`);
        }
      }
      
      // Reload products after successful save to ensure consistency
      if (saved) {
        console.log('🔄 Reloading products after price update to ensure latest data...');
        try {
          // Priority 1: Try API first (most reliable)
          if (apiAvailable) {
            try {
              const apiProducts = await Promise.race([
                getAllProductsViaAPI(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('API reload timeout')), 3000))
              ]);
              if (apiProducts && apiProducts.length > 0) {
                setProducts(apiProducts);
                setProductsFromFirestore(true);
                console.log(`✅ Products reloaded from API after update (${apiProducts.length} products)`);
                return;
              }
            } catch (apiReloadError) {
              console.warn('⚠️ API reload failed, trying Firestore...', apiReloadError.message);
            }
          }
          
          // Priority 2: Try Firestore as fallback
          try {
            const reloadedProducts = await Promise.race([
              getAllProducts(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore reload timeout')), 3000))
            ]);
            if (reloadedProducts && reloadedProducts.length > 0) {
              setProducts(reloadedProducts);
              setProductsFromFirestore(true);
              console.log(`✅ Products reloaded from Firestore after update (${reloadedProducts.length} products)`);
              return;
            }
          } catch (firestoreReloadError) {
            console.warn('⚠️ Both API and Firestore reload failed (non-critical):', firestoreReloadError.message);
            // Non-critical - local state is already updated with new price
          }
        } catch (reloadError) {
          console.warn('⚠️ Failed to reload products after update (non-critical):', reloadError.message);
          // Non-critical - local state is already updated with new price
        }
      }
      
      if (!saved) {
        if (apiAvailable) {
          console.error('❌ Both Firestore client SDK and API failed');
          showError('Failed to save price. Check console for details.');
        } else {
          console.warn('⚠️ Cannot save: Firestore client SDK failed and API not available');
          showError('Failed to save price. Backend API is not running.');
        }
      }
    } catch (error) {
      console.error('Error updating price:', error);
      showError(`Failed to update price: ${error.message || 'Unknown error'}`);
    }
  };

  // Update product (name, category, price)
  const handleUpdateProduct = async (productId, productData) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const categoryChanged = product.category !== productData.category;
    const nameChanged = product.name !== productData.name;
    
    try {
      // Update product data
      const updatedProductData = {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: (nameChanged || categoryChanged) 
          ? getProductImage(productData.name, productData.category)
          : product.image
      };
      
      // Update in Firestore
      await updateProduct(productId, updatedProductData);
      
      // Update local state
      setProducts((prevProducts) => {
        const productIndex = prevProducts.findIndex(p => p.id === productId);
        if (productIndex === -1) return prevProducts;
        
        const updatedProduct = {
          ...prevProducts[productIndex],
          ...updatedProductData
        };
        
        let updatedProducts = [...prevProducts];
        updatedProducts[productIndex] = updatedProduct;
        
        // If category changed, reorder products
        if (categoryChanged) {
          const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
          updatedProducts = updatedProducts.filter(p => p.id !== productId);
          
          let insertIndex = updatedProducts.length;
          for (let i = updatedProducts.length - 1; i >= 0; i--) {
            if (updatedProducts[i].category === productData.category) {
              insertIndex = i + 1;
              break;
            }
          }
          
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
          
          updatedProducts = [
            ...updatedProducts.slice(0, insertIndex),
            updatedProduct,
            ...updatedProducts.slice(insertIndex)
          ];
        }
        
        return updatedProducts;
      });
      
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
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Failed to update product. Please try again.');
    }
  };

  // Add new product
  const handleAddProduct = async (productData) => {
    // Check for duplicate product (same name and category)
    const isDuplicate = products.some(
      product => product.name.toLowerCase().trim() === productData.name.toLowerCase().trim() 
      && product.category === productData.category
    );
    
    if (isDuplicate) {
      alert(`A product named "${productData.name}" already exists in the ${productData.category} category.`);
      return;
    }
    
    try {
      // Create new product with image
      const newProductData = {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: getProductImage(productData.name, productData.category)
      };
      
      // Save to Firestore
      const addedProduct = await addProduct(newProductData);
      
      // Update local state
      const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
      setProducts((prevProducts) => {
        let insertIndex = prevProducts.length;
        
        // Find insertion point
        for (let i = prevProducts.length - 1; i >= 0; i--) {
          if (prevProducts[i].category === productData.category) {
            insertIndex = i + 1;
            break;
          }
        }
        
        if (insertIndex === prevProducts.length) {
          const newCategoryIndex = categoryOrder.indexOf(productData.category);
          if (newCategoryIndex !== -1) {
            for (let i = 0; i < prevProducts.length; i++) {
              const productCategoryIndex = categoryOrder.indexOf(prevProducts[i].category);
              if (productCategoryIndex > newCategoryIndex) {
                insertIndex = i;
                break;
              }
            }
          }
        }
        
        return [
          ...prevProducts.slice(0, insertIndex),
          { ...addedProduct, id: addedProduct.id },
          ...prevProducts.slice(insertIndex)
        ];
      });
      
      // Switch to the product's category
      setSelectedCategory(productData.category);
    } catch (error) {
      console.error('Error adding product:', error);
      showError('Failed to add product. Please try again.');
    }
  };

  // Handle checkout - add cart to purchase history
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const purchaseEntry = {
      date: new Date().toISOString(),
      items: cart.map(item => {
        // Build item object, only include fields that are not undefined
        const cartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        };
        // Only add image if it exists and is not undefined
        if (item.image) {
          cartItem.image = item.image;
        }
        // Only add category if it exists
        if (item.category) {
          cartItem.category = item.category;
        }
        return cartItem;
      }).filter(item => item.id && item.name && item.price !== undefined && item.quantity !== undefined), // Filter out invalid items
      total: total
    };
    
    // Validate purchase entry before proceeding
    if (!purchaseEntry.items || purchaseEntry.items.length === 0) {
      showError('Cannot checkout: Cart is empty or contains invalid items');
      return;
    }
    
    // Update local state first (optimistic update - don't wait for Firestore)
    const tempPurchaseId = `temp-${Date.now()}`;
    const purchaseWithId = {
      id: tempPurchaseId,
      ...purchaseEntry
    };
    const updatedHistory = [purchaseWithId, ...purchaseHistory];
    setPurchaseHistory(updatedHistory);
    
    // Update session earnings
    const newEarnings = sessionEarnings + total;
    setSessionEarnings(newEarnings);
    
    // Clear cart
    setCart([]);
    setIsCartOpen(false);
    
    // Show checkout confirmation modal
    setIsCheckoutModalOpen(true);
    
    // Try to save to Firestore in background (don't block UI)
    // Try Firestore client SDK first, then fallback to API
    let saved = false;
    
    // Try Firestore client SDK first
    try {
      console.log('📤 Attempting to save purchase via Firestore client SDK...');
      console.log('📦 Purchase data:', purchaseEntry);
      
      const addedPurchase = await Promise.race([
        addPurchase(purchaseEntry),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout (20s)')), 20000))
      ]);
      
      console.log('✅ Purchase saved to Firestore! ID:', addedPurchase.id);
      // Update with real Firestore ID
      setPurchaseHistory((prevHistory) => {
        return prevHistory.map(p => 
          p.id === tempPurchaseId ? { ...p, id: addedPurchase.id } : p
        );
      });
      saved = true;
    } catch (firestoreError) {
      console.error('❌ Firestore client SDK failed to save purchase:');
      console.error('   Error code:', firestoreError.code);
      console.error('   Error message:', firestoreError.message);
      console.error('   Full error:', firestoreError);
      
      // Provide specific error messages
      if (firestoreError.code === 'permission-denied') {
        console.error('🔒 PERMISSION DENIED: Check Firestore security rules for "purchases" collection!');
        console.error('   Rules should allow: allow read, write: if true;');
      } else if (firestoreError.code === 'unavailable' || firestoreError.message?.includes('timeout')) {
        console.error('⏱️ TIMEOUT or UNAVAILABLE: Firestore is taking too long or unavailable');
        console.error('   This could be due to slow network or Firestore being down');
      }
      
      // Fallback to backend API if available
      if (apiAvailable) {
        try {
          console.log('📤 Attempting to save purchase via backend API (fallback)...');
          const addedPurchase = await Promise.race([
            addPurchaseViaAPI(purchaseEntry),
            new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout (10s)')), 10000))
          ]);
          console.log('✅ Purchase saved via backend API! ID:', addedPurchase.id);
          // Update with real Firestore ID
          setPurchaseHistory((prevHistory) => {
            return prevHistory.map(p => 
              p.id === tempPurchaseId ? { ...p, id: addedPurchase.id } : p
            );
          });
          saved = true;
        } catch (apiError) {
          console.error('❌ Backend API save also failed:', apiError);
          console.error('   API error details:', {
            message: apiError.message,
            stack: apiError.stack
          });
          
          // Show user-friendly error
          const errorMsg = firestoreError.code === 'permission-denied' 
            ? 'Permission denied: Check Firestore security rules!'
            : firestoreError.message || apiError.message || 'Check console for details';
          showError(`Purchase saved locally but failed to sync: ${errorMsg}`);
        }
      } else {
        console.error('❌ Firestore save FAILED and API not available');
        
        // Save to localStorage as backup
        try {
          const existingBackup = localStorage.getItem(PURCHASE_HISTORY_KEY);
          const backupHistory = existingBackup ? JSON.parse(existingBackup) : [];
          const failedPurchases = backupHistory.filter(p => p.id?.startsWith('temp-') || p.syncFailed);
          const successfulPurchases = backupHistory.filter(p => !p.id?.startsWith('temp-') && !p.syncFailed);
          
          // Add new purchase with syncFailed flag
          const purchaseToBackup = {
            ...purchaseWithId,
            syncFailed: true,
            syncError: firestoreError.code || firestoreError.message,
            syncAttemptedAt: new Date().toISOString()
          };
          
          localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify([
            purchaseToBackup,
            ...successfulPurchases,
            ...failedPurchases
          ]));
          
          console.log('💾 Purchase saved to localStorage as backup (will retry on next sync)');
        } catch (backupError) {
          console.error('Failed to save purchase to localStorage backup:', backupError);
        }
        
        // Show user-friendly error with specific details
        let errorMsg = '⚠️ Purchase saved locally but failed to sync to database. ';
        if (firestoreError.code === 'permission-denied') {
          errorMsg += 'PERMISSION DENIED - Check Firestore security rules! Error code: permission-denied';
        } else if (firestoreError.code === 'unavailable') {
          errorMsg += 'NETWORK UNAVAILABLE - Check internet connection. Error code: unavailable';
        } else if (firestoreError.message?.includes('timeout')) {
          errorMsg += 'TIMEOUT - Firestore is taking too long. Error: timeout';
        } else {
          errorMsg += `Error: ${firestoreError.code || firestoreError.message || 'Unknown error'}`;
        }
        errorMsg += ' | Check console (F12) for details. Purchase is saved locally.';
        
        showError(errorMsg);
      }
    }
    
    if (saved) {
      console.log('✅ Purchase successfully saved to database!');
      // Also save to localStorage for redundancy
      try {
        const existingBackup = localStorage.getItem(PURCHASE_HISTORY_KEY);
        const backupHistory = existingBackup ? JSON.parse(existingBackup) : [];
        const updatedBackup = [purchaseWithId, ...backupHistory.filter(p => p.id !== tempPurchaseId)];
        localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(updatedBackup));
      } catch (backupError) {
        console.warn('Failed to save purchase to localStorage backup:', backupError);
      }
    } else {
      console.warn('⚠️ Purchase saved locally only - not synced to database');
    }
  };
  
  // Handle end session - show modal with total earnings
  const handleEndSession = () => {
    setIsEndSessionModalOpen(true);
  };
  
  // Handle reset session - save to Firestore, then clear session earnings, purchase history, and close modal
  const handleResetSession = async () => {
    // Save session data to Firestore before clearing
    const sessionData = {
      startTime: sessionStartTime.toISOString(),
      endTime: new Date().toISOString(),
      earnings: sessionEarnings,
      purchaseCount: purchaseHistory.length,
      purchaseIds: purchaseHistory.map(p => p.id).filter(id => id && !id.toString().startsWith('temp-')), // Only real Firestore IDs
      status: 'ended'
    };
    
    console.log('💾 Saving session to Firestore:', sessionData);
    
    let saved = false;
    
    // Try Firestore client SDK first (should work from mobile)
    try {
      console.log('📤 Attempting to save session via Firestore client SDK...');
      // Increase timeout for mobile/slow networks (20 seconds)
      await Promise.race([
        saveSession(sessionData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout (20s)')), 20000))
      ]);
      console.log('✅ Session saved to Firestore successfully!');
      saved = true;
    } catch (firestoreError) {
      console.error('⚠️ Firestore client SDK failed:', {
        code: firestoreError.code,
        message: firestoreError.message,
        fullError: firestoreError
      });
      
      // Fallback to backend API (if available and accessible)
      if (apiAvailable) {
        try {
          console.log('📤 Attempting to save session via backend API (fallback)...');
          const apiUrl = `${getAPIBaseURL()}/sessions`;
          console.log('🔗 API URL:', apiUrl);
          
          const response = await Promise.race([
            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(sessionData)
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout (5s)')), 5000))
          ]);
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          }
          
          const result = await response.json();
          console.log('✅ Session saved via backend API:', result);
          saved = true;
        } catch (apiError) {
          console.error('❌ Backend API also failed:', {
            message: apiError.message,
            fullError: apiError
          });
          // Don't show error yet - will show below if both failed
        }
      } else {
        console.warn('⚠️ Backend API not available (not reachable from this device)');
      }
    }
    
    // Save session data to localStorage as backup if Firestore fails
    if (!saved) {
      try {
        // Get existing pending sessions
        const existingPending = localStorage.getItem(PENDING_SESSIONS_KEY);
        const pendingSessions = existingPending ? JSON.parse(existingPending) : [];
        
        // Add this session to pending list
        pendingSessions.push({
          ...sessionData,
          failedAt: new Date().toISOString(),
          retryCount: 0
        });
        
        // Save to localStorage (max 10 pending sessions)
        const sessionsToKeep = pendingSessions.slice(-10);
        localStorage.setItem(PENDING_SESSIONS_KEY, JSON.stringify(sessionsToKeep));
        
        console.log('💾 Session saved to localStorage as backup (will retry later)');
        console.log(`📋 Total pending sessions: ${sessionsToKeep.length}`);
      } catch (storageError) {
        console.warn('⚠️ Failed to save session to localStorage backup:', storageError);
      }
      
      const errorMsg = 'Session saved locally but failed to sync to Firestore. ';
      const details = apiAvailable 
        ? 'Both Firestore and backend API failed. Session saved as backup.'
        : 'Firestore failed. Session saved as backup. Check network/Firestore rules.';
      console.error('❌ Failed to save session to Firestore:', errorMsg + details);
      
      // Show warning but don't block - session data is in localStorage
      setTimeout(() => {
        showError('Session saved locally (backup). Will retry syncing to Firestore later.');
      }, 100);
    } else {
      console.log('✅ Session successfully saved to Firestore!');
    }
    
    // Clear session data after saving
    setSessionEarnings(0);
    setPurchaseHistory([]);
    setSessionStartTime(new Date()); // Start new session
    localStorage.setItem(SESSION_EARNINGS_KEY, '0');
    localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify([]));
    localStorage.setItem('janet-sari-sari-session-start-time', new Date().toISOString());
    setIsEndSessionModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      // Delete from Firestore
      await deleteProduct(productId);
      
      // Update local state
      setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
      
      // Remove from cart if it exists there
      setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product. Please try again.');
    }
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
            onError={showError}
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
                isLoading={isLoadingProducts}
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
      
      {/* Error Notification */}
      <ErrorNotification
        error={error}
        onClose={() => setError(null)}
      />
    </div>
  );
}

export default App;
