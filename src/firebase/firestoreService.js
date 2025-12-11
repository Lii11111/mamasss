// Firestore Service - CRUD operations for the Sari Sari store
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

// Collections
const COLLECTIONS = {
  PRODUCTS: 'products',
  PURCHASES: 'purchases',
  SESSIONS: 'sessions'
};

// ============ PRODUCTS ============

/**
 * Get all products from Firestore
 */
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const productsSnapshot = await getDocs(productsRef);
    const products = [];
    
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by name instead of ID (since Firestore IDs are strings)
    return products.sort((a, b) => {
      // First sort by category
      const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
      const categoryA = categoryOrder.indexOf(a.category) !== -1 ? categoryOrder.indexOf(a.category) : 999;
      const categoryB = categoryOrder.indexOf(b.category) !== -1 ? categoryOrder.indexOf(b.category) : 999;
      if (categoryA !== categoryB) return categoryA - categoryB;
      // Then sort by name
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

/**
 * Add a new product
 */
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...productData
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update a product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: productId,
      ...productData
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Real-time listener for products
 */
export const subscribeToProducts = (callback) => {
  const productsRef = collection(db, COLLECTIONS.PRODUCTS);
  return onSnapshot(productsRef, (snapshot) => {
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(products.sort((a, b) => a.id - b.id));
  }, (error) => {
    console.error('Error in products subscription:', error);
    callback([]);
  });
};

// ============ PURCHASES ============

/**
 * Add a purchase/checkout to history
 */
/**
 * Test if Firestore write is allowed (quick test before actual write)
 */
export const testFirestoreWrite = async () => {
  try {
    const testRef = collection(db, COLLECTIONS.PURCHASES);
    // Try to add a test document and immediately delete it
    const testDoc = await addDoc(testRef, {
      _test: true,
      timestamp: new Date().toISOString()
    });
    
    // Delete the test document immediately
    await deleteDoc(doc(db, COLLECTIONS.PURCHASES, testDoc.id));
    
    return { success: true, message: 'Write permissions OK' };
  } catch (error) {
    return {
      success: false,
      code: error.code,
      message: error.message,
      error: error
    };
  }
};

/**
 * Remove undefined values from an object (Firestore doesn't allow undefined)
 */
const removeUndefined = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item));
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = removeUndefined(value);
    }
  }
  return cleaned;
};

export const addPurchase = async (purchaseData) => {
  try {
    const purchasesRef = collection(db, COLLECTIONS.PURCHASES);
    
    // Deep clean the data - remove undefined, null for optional fields, validate types
    const cleanedData = removeUndefined({
      date: purchaseData.date || new Date().toISOString(),
      items: (purchaseData.items || []).map(item => {
        const cleanedItem = removeUndefined({
          id: item.id !== undefined && item.id !== null ? String(item.id) : undefined,
          name: item.name !== undefined && item.name !== null ? String(item.name) : undefined,
          price: item.price !== undefined && item.price !== null ? Number(item.price) : undefined,
          quantity: item.quantity !== undefined && item.quantity !== null ? Number(item.quantity) : undefined,
          image: item.image !== undefined && item.image !== null && item.image !== '' ? String(item.image) : undefined,
          category: item.category !== undefined && item.category !== null && item.category !== '' ? String(item.category) : undefined
        });
        return cleanedItem;
      }).filter(item => item.id && item.name && item.price !== undefined && item.quantity !== undefined),
      total: purchaseData.total !== undefined && purchaseData.total !== null ? Number(purchaseData.total) : undefined,
      createdAt: new Date().toISOString()
    });
    
    // Final validation
    if (!cleanedData.items || !Array.isArray(cleanedData.items) || cleanedData.items.length === 0) {
      throw new Error('Purchase must have at least one valid item');
    }
    
    if (cleanedData.total === undefined || cleanedData.total === null || isNaN(cleanedData.total)) {
      throw new Error('Purchase must have a valid total');
    }
    
    // Log what we're trying to write (for debugging)
    console.log('📝 Writing to Firestore purchases collection:', {
      itemCount: cleanedData.items.length,
      total: cleanedData.total,
      date: cleanedData.date,
      sampleItem: cleanedData.items[0]
    });
    console.log('📝 Full cleaned data:', JSON.stringify(cleanedData, null, 2));
    
    const docRef = await addDoc(purchasesRef, cleanedData);
    
    console.log('✅ Purchase document created in Firestore:', docRef.id);
    return {
      id: docRef.id,
      ...cleanedData
    };
  } catch (error) {
    console.error('❌ Error adding purchase to Firestore:', {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack,
      fullError: error
    });
    
    // Provide more helpful error messages
    if (error.code === 'permission-denied') {
      const permissionError = new Error('PERMISSION DENIED: Firestore security rules are blocking writes to "purchases" collection. Check Firebase Console → Firestore → Rules.');
      permissionError.code = 'permission-denied';
      throw permissionError;
    } else if (error.code === 'unavailable') {
      const unavailableError = new Error('FIRESTORE UNAVAILABLE: Check your internet connection and try again.');
      unavailableError.code = 'unavailable';
      throw unavailableError;
    } else if (error.code === 'deadline-exceeded') {
      const timeoutError = new Error('TIMEOUT: Firestore request took too long. Check your internet connection.');
      timeoutError.code = 'deadline-exceeded';
      throw timeoutError;
    } else if (error.message && error.message.includes('undefined')) {
      // More specific error for undefined values
      const undefinedError = new Error('Invalid data: Some fields have undefined values. Please check cart items have all required fields (id, name, price, quantity).');
      undefinedError.code = 'invalid-data';
      throw undefinedError;
    }
    
    // Preserve error code for better error handling
    error.code = error.code || 'unknown';
    throw error;
  }
};

/**
 * Get all purchases
 */
export const getAllPurchases = async () => {
  try {
    const purchasesRef = collection(db, COLLECTIONS.PURCHASES);
    const q = query(purchasesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const purchases = [];
    
    querySnapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return purchases;
  } catch (error) {
    console.error('Error getting purchases:', error);
    throw error;
  }
};

/**
 * Get purchases for a specific session
 */
export const getSessionPurchases = async (sessionId) => {
  try {
    const purchasesRef = collection(db, COLLECTIONS.PURCHASES);
    const q = query(purchasesRef, where('sessionId', '==', sessionId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const purchases = [];
    
    querySnapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return purchases;
  } catch (error) {
    console.error('Error getting session purchases:', error);
    throw error;
  }
};

// ============ SESSIONS ============

/**
 * Create or update a session
 */
export const saveSession = async (sessionData) => {
  try {
    const sessionsRef = collection(db, COLLECTIONS.SESSIONS);
    
    // If sessionId exists, update it; otherwise create new
    if (sessionData.id) {
      const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionData.id);
      await updateDoc(sessionRef, {
        ...sessionData,
        updatedAt: new Date().toISOString()
      });
      return { id: sessionData.id, ...sessionData };
    } else {
      // Remove id from sessionData if it exists (Firestore will generate one)
      const { id, ...dataToSave } = sessionData;
      const docRef = await addDoc(sessionsRef, {
        ...dataToSave,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...dataToSave };
    }
  } catch (error) {
    console.error('Error saving session to Firestore:', {
      code: error.code,
      message: error.message,
      fullError: error
    });
    
    // Provide more helpful error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied: Check Firestore security rules for "sessions" collection');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore unavailable: Check your internet connection');
    } else if (error.message && error.message.includes('timeout')) {
      throw new Error('Firestore timeout: Network may be slow, try again');
    }
    
    throw error;
  }
};

/**
 * Get session by ID
 */
export const getSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      return {
        id: sessionSnap.id,
        ...sessionSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

/**
 * Batch operations - useful for syncing initial products
 */
export const batchAddProducts = async (products) => {
  try {
    const batch = writeBatch(db);
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    
    products.forEach((product) => {
      const docRef = doc(productsRef);
      batch.set(docRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error batch adding products:', error);
    throw error;
  }
};

