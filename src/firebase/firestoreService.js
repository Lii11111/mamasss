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
export const addPurchase = async (purchaseData) => {
  try {
    const purchasesRef = collection(db, COLLECTIONS.PURCHASES);
    const docRef = await addDoc(purchasesRef, {
      ...purchaseData,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...purchaseData
    };
  } catch (error) {
    console.error('Error adding purchase:', error);
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
      const docRef = await addDoc(sessionsRef, {
        ...sessionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...sessionData };
    }
  } catch (error) {
    console.error('Error saving session:', error);
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

