// Debug utility to test Firestore connection
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  console.log('🧪 Testing Firestore connection...');
  console.log('This will help diagnose why Firestore is timing out.');
  
  // Check Firebase config first
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  };
  
  console.log('📋 Firebase Config Check:');
  console.log('  - API Key:', config.apiKey ? `${config.apiKey.substring(0, 15)}...` : '❌ MISSING');
  console.log('  - Project ID:', config.projectId || '❌ MISSING');
  console.log('  - Auth Domain:', config.authDomain || '❌ MISSING');
  
  if (!config.apiKey || !config.projectId) {
    return {
      success: false,
      message: 'Firebase config is missing. Check your .env file.',
      error: 'Missing configuration'
    };
  }
  
  try {
    // Test 1: Read products with timeout
    console.log('\nTest 1: Reading products (5 second timeout)...');
    const startTime = Date.now();
    
    const productsRef = collection(db, 'products');
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
    );
    
    const snapshot = await Promise.race([
      getDocs(productsRef),
      timeoutPromise
    ]);
    
    const loadTime = Date.now() - startTime;
    console.log(`✅ Read successful: ${snapshot.size} products found in ${loadTime}ms`);
    
    if (snapshot.size > 0) {
      const firstProduct = snapshot.docs[0];
      console.log('\nSample product:', {
        id: firstProduct.id,
        name: firstProduct.data().name,
        price: firstProduct.data().price
      });
      
      // Test 2: Try to update
      console.log('\nTest 2: Attempting to update product (5 second timeout)...');
      const updateStartTime = Date.now();
      const testUpdateData = {
        ...firstProduct.data(),
        updatedAt: new Date().toISOString(),
        testField: 'test-value-' + Date.now()
      };
      
      const updateTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Update timeout after 5 seconds')), 5000)
      );
      
      await Promise.race([
        updateDoc(doc(db, 'products', firstProduct.id), testUpdateData),
        updateTimeoutPromise
      ]);
      
      const updateTime = Date.now() - updateStartTime;
      console.log(`✅ Update successful in ${updateTime}ms!`);
      
      // Clean up test field
      console.log('\nCleaning up test field...');
      const cleanData = { ...testUpdateData };
      delete cleanData.testField;
      await updateDoc(doc(db, 'products', firstProduct.id), cleanData);
      console.log('✅ Cleanup successful');
      
      return { 
        success: true, 
        message: 'All tests passed! Firestore is working correctly.',
        readTime: loadTime,
        updateTime: updateTime
      };
    } else {
      return { 
        success: false, 
        message: 'No products found in Firestore. Run migration script first.',
        readTime: loadTime
      };
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('\n🔒 PERMISSION DENIED ERROR!');
      console.error('Your Firestore security rules are blocking access.');
      console.error('\nTo fix:');
      console.error('1. Go to Firebase Console → Firestore Database → Rules');
      console.error('2. Set rules to: allow read, write: if true;');
      console.error('3. Click "Publish"');
    } else if (error.message && error.message.includes('timeout')) {
      console.error('\n⏱️ TIMEOUT ERROR!');
      console.error('Firestore queries are timing out. Possible causes:');
      console.error('1. Firestore security rules blocking access');
      console.error('2. Network/firewall blocking Firebase');
      console.error('3. Incorrect Firebase configuration');
      console.error('4. Firebase project not properly set up');
    }
    
    return {
      success: false,
      error: error.code || error.message,
      message: `Error: ${error.code || error.message}`
    };
  }
};

// Run test when imported (for debugging)
if (typeof window !== 'undefined') {
  window.testFirestore = testFirestoreConnection;
  console.log('💡 Run testFirestore() in console to test Firestore connection');
}

