// Migration script using Express API (bypasses Firestore rules)
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:3000/api';

// Products data
const products = [
  // Snacks
  { name: 'Chippy', price: 10, category: 'Snacks', image: '/images/chippy.jpg' },
  { name: 'Piattos', price: 15, category: 'Snacks', image: '/images/piattos.png' },
  { name: 'Nova', price: 12, category: 'Snacks', image: '/images/nova.jpg' },
  { name: 'Oishi', price: 8, category: 'Snacks' },
  { name: 'Clover Chips', price: 20, category: 'Snacks' },
  
  // Drinks
  { name: 'Coca Cola', price: 15, category: 'Drinks' },
  { name: 'Sprite', price: 15, category: 'Drinks' },
  { name: 'Royal', price: 15, category: 'Drinks' },
  { name: 'Pepsi', price: 15, category: 'Drinks' },
  { name: 'Mountain Dew', price: 15, category: 'Drinks' },
  { name: 'Zesto', price: 12, category: 'Drinks' },
  { name: 'C2', price: 18, category: 'Drinks' },
  
  // Condiments
  { name: 'Silver Swan Soy Sauce', price: 25, category: 'Condiments' },
  { name: 'Datu Puti Vinegar', price: 20, category: 'Condiments' },
  { name: 'Mang Tomas', price: 35, category: 'Condiments' },
  { name: 'Jufran Banana Ketchup', price: 30, category: 'Condiments' },
  { name: 'Knorr Seasoning', price: 5, category: 'Condiments' },
  { name: 'Bawang', price: 8, category: 'Condiments' },
  { name: 'Sibuyas', price: 8, category: 'Condiments' },
  { name: 'Vetsin', price: 5, category: 'Condiments' },
  { name: 'Magic Sarap', price: 6, category: 'Condiments' },
  
  // Biscuits
  { name: 'Rebisco', price: 12, category: 'Biscuits' },
  { name: 'Skyflakes', price: 15, category: 'Biscuits' },
  { name: 'Fita', price: 15, category: 'Biscuits' },
  { name: 'Cracklings', price: 10, category: 'Biscuits' },
  { name: 'M.Y. San Grahams', price: 18, category: 'Biscuits' },
  
  // Candies
  { name: 'Chocnut', price: 5, category: 'Candies' },
  { name: 'Hany', price: 5, category: 'Candies' },
  { name: 'Maxx', price: 5, category: 'Candies' },
  { name: 'Stick-O', price: 8, category: 'Candies' },
  { name: 'Flat Tops', price: 5, category: 'Candies' },
  
  // Canned Goods
  { name: 'Corned Beef', price: 45, category: 'Canned Goods' },
  { name: 'Sardines', price: 20, category: 'Canned Goods' },
  { name: 'Tuna Flakes', price: 35, category: 'Canned Goods' },
  { name: 'Beef Loaf', price: 25, category: 'Canned Goods' },
  { name: 'Spam', price: 120, category: 'Canned Goods' },
  
  // Noodles
  { name: 'Lucky Me Pancit Canton', price: 12, category: 'Noodles' },
  { name: 'Lucky Me Beef', price: 12, category: 'Noodles' },
  { name: 'Lucky Me Chicken', price: 12, category: 'Noodles' },
  { name: 'Payless Pancit Canton', price: 10, category: 'Noodles' },
  { name: 'Indomie', price: 15, category: 'Noodles' },
  { name: 'Lucky Me Bulalo', price: 12, category: 'Noodles' },
];

async function migrateViaAPI() {
  try {
    console.log('📦 Starting product migration via Express API...\n');
    console.log('⚠️  Make sure your backend server is running (npm run server)\n');

    // Check if server is running
    try {
      const healthCheck = await fetch(`${API_URL}/health`);
      if (!healthCheck.ok) {
        throw new Error('Server not responding');
      }
      console.log('✅ Backend server is running\n');
    } catch (error) {
      console.error('❌ Backend server is not running!');
      console.error('   Please start it with: npm run server');
      process.exit(1);
    }

    // Check if products already exist
    try {
      const existingProducts = await fetch(`${API_URL}/products`);
      const productsData = await existingProducts.json();
      
      if (productsData.length > 0) {
        console.log(`⚠️  Warning: ${productsData.length} products already exist.`);
        console.log('   Skipping migration to avoid duplicates.\n');
        return;
      }
    } catch (error) {
      console.log('ℹ️  Could not check existing products, proceeding...\n');
    }

    // Add products via API
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Added: ${product.name} (ID: ${result.id})`);
          successCount++;
        } else {
          const error = await response.json();
          console.error(`❌ Error adding ${product.name}:`, error.error || 'Unknown error');
          errorCount++;
        }
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
    console.log(`\n📝 Check Firebase Console > Firestore Database to see your products!`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateViaAPI();


