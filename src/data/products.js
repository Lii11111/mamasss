// ============================================
// AUTOMATIC IMAGE SYSTEM - SUPER SIMPLE!
// ============================================
// 
// HOW IT WORKS:
// 1. Just drop your images in: public/images/
// 2. Name them using ONLY THE FIRST WORD of the product name (lowercase)
// 3. Supports: .jpg, .jpeg, .png, .webp
// 4. If image not found, shows a nice placeholder automatically
//
// EXAMPLES:
// - Product: "Coca Cola" → filename: "coca.jpg" or "coca.png"
// - Product: "Toyo Datu Puti" → filename: "toyo.jpg" or "toyo.png"
// - Product: "Clover Chips" → filename: "clover.jpg" or "clover.png"
// - Product: "Lucky Me Pancit Canton" → filename: "lucky.jpg" or "lucky.png"
//
// MANUAL OVERRIDE (optional):
// If you want to specify exact image path, just add: image: '/images/my-custom-name.jpg'
// ============================================

// Helper function to get first word from product name
const getFirstWord = (productName) => {
  return productName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .split(/\s+/)[0]; // Get first word only
};

// Smart image getter - automatically finds images using first word only
export const getProductImage = (productName, category, manualImage = null) => {
  // If manual image path provided, use it
  if (manualImage) {
    return manualImage;
  }
  
  // Use first word only for image filename
  const firstWord = getFirstWord(productName);
  
  // Try .jpg first (most common), then .png, .jpeg, .webp
  // The ProductCard component will try other extensions if this fails
  return `/images/${firstWord}.jpg`;
};

// Placeholder generator (fallback)
const getPlaceholderImage = (name, category) => {
  const encodedName = encodeURIComponent(name);
  const colors = {
    'chips': 'FF6B6B,4ECDC4',
    'soft drink': '45B7D1,96CEB4',
    'juice': 'FFE66D,FF6B6B',
    'tea': '95E1D3,F38181',
    'condiment': 'FCE38A,EAFFD0',
    'sauce': 'FF9A9E,FAD0C4',
    'seasoning': 'FFECD2,FCB69F',
    'garlic': 'FFD89B,19547B',
    'onion': 'FDC830,F37335',
    'biscuit': 'F09819,EDDE5D',
    'cracker': 'F5AF19,F12711',
    'candy': 'FF6B9D,C44569',
    'canned food': 'FF6B6B,C92A2D',
    'canned meat': 'FF6B6B,8B0000',
    'noodles': 'FFA07A,FF7F50'
  };
  const colorPair = colors[category] || 'E5E7EB,9CA3AF';
  return `https://via.placeholder.com/400x400/${colorPair}?text=${encodedName}`;
};

// Example: If you have local images, import them here:
// import chippyImage from '../assets/images/chippy.jpg';
// import piattosImage from '../assets/images/piattos.jpg';
// etc...

// Helper to add image property automatically
const addImageToProduct = (product) => {
  // If image already specified, use it
  if (product.image) {
    return product;
  }
  // Otherwise, auto-generate from product name
  return {
    ...product,
    image: getProductImage(product.name, product.category)
  };
};

export const products = [
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
].map(addImageToProduct); // Automatically add images to all products

export const categories = ['All', 'Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];

