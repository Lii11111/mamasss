// Migration script: Upload initial products to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Firebase configuration from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Products data (from src/data/products.js)
const products = [
  // Snacks
  { id: 1, name: 'Chippy', price: 10, category: 'Snacks', image: '/images/chippy.jpg' },
  { id: 2, name: 'Piattos', price: 15, category: 'Snacks', image: '/images/piattos.png' },
  { id: 3, name: 'Nova', price: 12, category: 'Snacks', image: '/images/nova.jpg' },
  { id: 4, name: 'Oishi', price: 8, category: 'Snacks' },
  { id: 5, name: 'Clover Chips', price: 20, category: 'Snacks' },
  
  // Drinks
  { id: 6, name: 'Coca Cola', price: 15, category: 'Drinks' },
  { id: 7, name: 'Sprite', price: 15, category: 'Drinks' },
  { id: 8, name: 'Royal', price: 15, category: 'Drinks' },
  { id: 9, name: 'Pepsi', price: 15, category: 'Drinks' },
  { id: 10, name: 'Mountain Dew', price: 15, category: 'Drinks' },
  { id: 11, name: 'Zesto', price: 12, category: 'Drinks' },
  { id: 12, name: 'C2', price: 18, category: 'Drinks' },
  
  // Condiments
  { id: 13, name: 'Silver Swan Soy Sauce', price: 25, category: 'Condiments' },
  { id: 14, name: 'Datu Puti Vinegar', price: 20, category: 'Condiments' },
  { id: 15, name: 'Mang Tomas', price: 35, category: 'Condiments' },
  { id: 16, name: 'Jufran Banana Ketchup', price: 30, category: 'Condiments' },
  { id: 17, name: 'Knorr Seasoning', price: 5, category: 'Condiments' },
  { id: 39, name: 'Bawang', price: 8, category: 'Condiments' },
  { id: 40, name: 'Sibuyas', price: 8, category: 'Condiments' },
  { id: 41, name: 'Vetsin', price: 5, category: 'Condiments' },
  { id: 42, name: 'Magic Sarap', price: 6, category: 'Condiments' },
  
  // Biscuits
  { id: 18, name: 'Rebisco', price: 12, category: 'Biscuits' },
  { id: 19, name: 'Skyflakes', price: 15, category: 'Biscuits' },
  { id: 20, name: 'Fita', price: 15, category: 'Biscuits' },
  { id: 21, name: 'Cracklings', price: 10, category: 'Biscuits' },
  { id: 22, name: 'M.Y. San Grahams', price: 18, category: 'Biscuits' },
  
  // Candies
  { id: 23, name: 'Chocnut', price: 5, category: 'Candies' },
  { id: 24, name: 'Hany', price: 5, category: 'Candies' },
  { id: 25, name: 'Maxx', price: 5, category: 'Candies' },
  { id: 26, name: 'Stick-O', price: 8, category: 'Candies' },
  { id: 27, name: 'Flat Tops', price: 5, category: 'Candies' },
  
  // Canned Goods
  { id: 28, name: 'Corned Beef', price: 45, category: 'Canned Goods' },
  { id: 29, name: 'Sardines', price: 20, category: 'Canned Goods' },
  { id: 30, name: 'Tuna Flakes', price: 35, category: 'Canned Goods' },
  { id: 31, name: 'Beef Loaf', price: 25, category: 'Canned Goods' },
  { id: 32, name: 'Spam', price: 120, category: 'Canned Goods' },
  
  // Noodles
  { id: 33, name: 'Lucky Me Pancit Canton', price: 12, category: 'Noodles' },
  { id: 34, name: 'Lucky Me Beef', price: 12, category: 'Noodles' },
  { id: 35, name: 'Lucky Me Chicken', price: 12, category: 'Noodles' },
  { id: 36, name: 'Payless Pancit Canton', price: 10, category: 'Noodles' },
  { id: 37, name: 'Indomie', price: 15, category: 'Noodles' },
  { id: 38, name: 'Lucky Me Bulalo', price: 12, category: 'Noodles' },
];

async function migrateProducts() {
  try {
    console.log('📦 Starting product migration to Firestore...\n');
    
    // Check if products already exist
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.size > 0) {
      console.log(`⚠️  Warning: ${snapshot.size} products already exist in Firestore.`);
      console.log('   Skipping migration to avoid duplicates.');
      console.log('   If you want to migrate anyway, delete existing products first in Firebase Console.');
      return;
    }

    // Add products to Firestore
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      const productData = {
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        const docRef = await addDoc(productsRef, productData);
        console.log(`✅ Added: ${product.name} (Firestore ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error adding ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   ✅ Successfully migrated: ${successCount} products`);
    if (errorCount > 0) {
      console.log(`   ❌ Errors: ${errorCount} products`);
    }
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Check Firebase Console > Firestore Database to see your products`);
    console.log(`   2. Your React app can now load products from Firestore!`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateProducts();
