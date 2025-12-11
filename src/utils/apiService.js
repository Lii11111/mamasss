// API Service - Fallback to backend API when Firestore client SDK fails
// Use environment variable or detect local IP for mobile access
export const getAPIBaseURL = () => {
  // First, try environment variable (can be set in .env)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  const hostname = window.location.hostname;
  
  // If localhost (same device), use localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // If on Vercel, backend API is not available (unless deployed as serverless functions)
  // Return null to disable API fallback - rely on Firestore client SDK only
  if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
    console.log('🌐 Vercel deployment detected - API fallback disabled. Using Firestore client SDK only.');
    return null; // API not available on Vercel
  }
  
  // If accessing from mobile/remote, try to use same host but different port
  // This assumes frontend and backend are on same network
  const protocol = window.location.protocol;
  const baseUrl = `${protocol}//${hostname}:3000/api`;
  
  return baseUrl;
};

const API_BASE_URL = getAPIBaseURL();

/**
 * Update product via backend API (fallback when Firestore client SDK fails)
 */
export const updateProductViaAPI = async (productId, productData) => {
  if (!API_BASE_URL) {
    throw new Error('API not available (Vercel deployment)');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API update failed:', error);
    throw error;
  }
};

/**
 * Update product by name and category (for products with numeric IDs)
 */
export const updateProductByNameViaAPI = async (productData) => {
  if (!API_BASE_URL) {
    throw new Error('API not available (Vercel deployment)');
  }
  
  try {
    console.log('📤 API request to /products/find/update:', {
      url: `${API_BASE_URL}/products/find/update`,
      method: 'PUT',
      body: productData
    });
    
    const response = await fetch(`${API_BASE_URL}/products/find/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });

    console.log('📥 API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ API response error:', errorMsg, errorData);
      throw new Error(errorMsg);
    }

    const result = await response.json();
    console.log('✅ API update by name successful:', result);
    return result;
  } catch (error) {
    console.error('❌ API update by name failed:', error);
    throw error;
  }
};

/**
 * Add purchase via backend API (fallback when Firestore client SDK fails)
 */
export const addPurchaseViaAPI = async (purchaseData) => {
  if (!API_BASE_URL) {
    throw new Error('API not available (Vercel deployment)');
  }
  
  try {
    console.log('📤 API request to /purchases:', {
      url: `${API_BASE_URL}/purchases`,
      method: 'POST',
      body: purchaseData
    });
    
    const response = await fetch(`${API_BASE_URL}/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData)
    });

    console.log('📥 API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ API purchase error:', errorMsg, errorData);
      throw new Error(errorMsg);
    }

    const result = await response.json();
    console.log('✅ API purchase successful:', result);
    return result;
  } catch (error) {
    console.error('❌ API purchase failed:', error);
    throw error;
  }
};

/**
 * Get all products via backend API (fallback when Firestore client SDK fails)
 */
export const getAllProductsViaAPI = async () => {
  if (!API_BASE_URL) {
    throw new Error('API not available (Vercel deployment)');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error('API get products failed:', error);
    throw error;
  }
};

/**
 * Check if backend API is available
 */
export const checkAPIAvailability = async () => {
  // If API_BASE_URL is null (e.g., on Vercel), API is not available
  if (!API_BASE_URL) {
    console.log('⚠️ Backend API not available (Vercel deployment or not configured)');
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    const isAvailable = response.ok;
    if (isAvailable) {
      console.log('✅ Backend API is available (fallback for Firestore writes)');
    } else {
      console.warn('⚠️ Backend API health check returned:', response.status);
    }
    return isAvailable;
  } catch (error) {
    console.warn('⚠️ Backend API is not available:', error.message);
    return false;
  }
};

