// ============================================
// HOW TO ADD PRODUCT IMAGES:
// ============================================
// 
// METHOD 1: Using Local Images (Recommended)
// -------------------------------------------
// 1. Create a folder: src/assets/images/
// 2. Put your product images there (e.g., chippy.jpg, coca-cola.png)
// 3. Import them at the top of this file:
//    import chippyImage from '../assets/images/chippy.jpg';
//    import cocaColaImage from '../assets/images/coca-cola.png';
// 4. Use them in products:
//    { id: 1, name: 'Chippy', price: 10, category: 'Snacks', image: chippyImage },
//
// METHOD 2: Using External URLs
// -------------------------------
// Simply replace the image property with a direct URL:
//    { id: 1, name: 'Chippy', price: 10, category: 'Snacks', image: 'https://example.com/chippy.jpg' },
//
// METHOD 3: Using Public Folder
// -------------------------------
// 1. Put images in: public/images/
// 2. Use: image: '/images/chippy.jpg'
// ============================================

// Helper function to generate product image URL (placeholder)
const getProductImage = (name, category) => {
  // Using placeholder service - you can replace these with actual product image URLs
  // Format: placeholder.com with product name as text
  const encodedName = encodeURIComponent(name);
  // Using a colorful placeholder that matches the product category
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

export const products = [
  // Snacks
  { id: 1, name: 'Chippy', price: 10, category: 'Snacks', image: '/images/chippy.jpg' },
  { id: 2, name: 'Piattos', price: 15, category: 'Snacks', image: '/images/piattos.png' },
  { id: 3, name: 'Nova', price: 12, category: 'Snacks', image: '/images/nova.jpg' },
  { id: 4, name: 'Oishi', price: 8, category: 'Snacks', image: getProductImage('Oishi', 'chips') },
  { id: 5, name: 'Clover Chips', price: 20, category: 'Snacks', image: getProductImage('Clover Chips', 'chips') },
  
  // Drinks
  { id: 6, name: 'Coca Cola', price: 15, category: 'Drinks', image: getProductImage('Coca Cola', 'soft drink') },
  { id: 7, name: 'Sprite', price: 15, category: 'Drinks', image: getProductImage('Sprite', 'soft drink') },
  { id: 8, name: 'Royal', price: 15, category: 'Drinks', image: getProductImage('Royal', 'soft drink') },
  { id: 9, name: 'Pepsi', price: 15, category: 'Drinks', image: getProductImage('Pepsi', 'soft drink') },
  { id: 10, name: 'Mountain Dew', price: 15, category: 'Drinks', image: getProductImage('Mountain Dew', 'soft drink') },
  { id: 11, name: 'Zesto', price: 12, category: 'Drinks', image: getProductImage('Zesto', 'juice') },
  { id: 12, name: 'C2', price: 18, category: 'Drinks', image: getProductImage('C2', 'tea') },
  
  // Condiments
  { id: 13, name: 'Silver Swan Soy Sauce', price: 25, category: 'Condiments', image: getProductImage('Soy Sauce', 'condiment') },
  { id: 14, name: 'Datu Puti Vinegar', price: 20, category: 'Condiments', image: getProductImage('Vinegar', 'condiment') },
  { id: 15, name: 'Mang Tomas', price: 35, category: 'Condiments', image: getProductImage('Mang Tomas', 'sauce') },
  { id: 16, name: 'Jufran Banana Ketchup', price: 30, category: 'Condiments', image: getProductImage('Banana Ketchup', 'ketchup') },
  { id: 17, name: 'Knorr Seasoning', price: 5, category: 'Condiments', image: getProductImage('Knorr Seasoning', 'seasoning') },
  { id: 39, name: 'Bawang', price: 8, category: 'Condiments', image: getProductImage('Garlic', 'garlic') },
  { id: 40, name: 'Sibuyas', price: 8, category: 'Condiments', image: getProductImage('Onion', 'onion') },
  { id: 41, name: 'Vetsin', price: 5, category: 'Condiments', image: getProductImage('MSG', 'seasoning') },
  { id: 42, name: 'Magic Sarap', price: 6, category: 'Condiments', image: getProductImage('Magic Sarap', 'seasoning') },
  
  // Biscuits
  { id: 18, name: 'Rebisco', price: 12, category: 'Biscuits', image: getProductImage('Rebisco', 'biscuit') },
  { id: 19, name: 'Skyflakes', price: 15, category: 'Biscuits', image: getProductImage('Skyflakes', 'cracker') },
  { id: 20, name: 'Fita', price: 15, category: 'Biscuits', image: getProductImage('Fita', 'biscuit') },
  { id: 21, name: 'Cracklings', price: 10, category: 'Biscuits', image: getProductImage('Cracklings', 'cracker') },
  { id: 22, name: 'M.Y. San Grahams', price: 18, category: 'Biscuits', image: getProductImage('Grahams', 'biscuit') },
  
  // Candies
  { id: 23, name: 'Chocnut', price: 5, category: 'Candies', image: getProductImage('Chocnut', 'candy') },
  { id: 24, name: 'Hany', price: 5, category: 'Candies', image: getProductImage('Hany', 'candy') },
  { id: 25, name: 'Maxx', price: 5, category: 'Candies', image: getProductImage('Maxx', 'candy') },
  { id: 26, name: 'Stick-O', price: 8, category: 'Candies', image: getProductImage('Stick-O', 'candy') },
  { id: 27, name: 'Flat Tops', price: 5, category: 'Candies', image: getProductImage('Flat Tops', 'candy') },
  
  // Canned Goods
  { id: 28, name: 'Corned Beef', price: 45, category: 'Canned Goods', image: getProductImage('Corned Beef', 'canned food') },
  { id: 29, name: 'Sardines', price: 20, category: 'Canned Goods', image: getProductImage('Sardines', 'canned food') },
  { id: 30, name: 'Tuna Flakes', price: 35, category: 'Canned Goods', image: getProductImage('Tuna', 'canned food') },
  { id: 31, name: 'Beef Loaf', price: 25, category: 'Canned Goods', image: getProductImage('Beef Loaf', 'canned food') },
  { id: 32, name: 'Spam', price: 120, category: 'Canned Goods', image: getProductImage('Spam', 'canned meat') },
  
  // Noodles
  { id: 33, name: 'Lucky Me Pancit Canton', price: 12, category: 'Noodles', image: getProductImage('Pancit Canton', 'noodles') },
  { id: 34, name: 'Lucky Me Beef', price: 12, category: 'Noodles', image: getProductImage('Instant Noodles', 'noodles') },
  { id: 35, name: 'Lucky Me Chicken', price: 12, category: 'Noodles', image: getProductImage('Instant Noodles', 'noodles') },
  { id: 36, name: 'Payless Pancit Canton', price: 10, category: 'Noodles', image: getProductImage('Pancit Canton', 'noodles') },
  { id: 37, name: 'Indomie', price: 15, category: 'Noodles', image: getProductImage('Indomie', 'noodles') },
  { id: 38, name: 'Lucky Me Bulalo', price: 12, category: 'Noodles', image: getProductImage('Instant Noodles', 'noodles') },
];

export const categories = ['All', 'Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];

