// Vercel Serverless Function for products
import { db } from '../../server/config/firebaseAdmin.js';

// Enable CORS
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req, res) {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req;
  const productId = query.id;
  const category = query.category;

  try {
    // GET /api/products - Get all products
    if (req.method === 'GET' && !productId && !category) {
      const productsRef = db.collection('products');
      const snapshot = await productsRef.get();
      
      const products = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by category then name (same as frontend)
      const categoryOrder = ['Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
      const sorted = products.sort((a, b) => {
        const categoryA = categoryOrder.indexOf(a.category) !== -1 ? categoryOrder.indexOf(a.category) : 999;
        const categoryB = categoryOrder.indexOf(b.category) !== -1 ? categoryOrder.indexOf(b.category) : 999;
        if (categoryA !== categoryB) return categoryA - categoryB;
        return (a.name || '').localeCompare(b.name || '');
      });
      
      return res.json(sorted);
    }

    // GET /api/products?category=xxx - Get products by category
    if (req.method === 'GET' && category) {
      const productsRef = db.collection('products');
      const snapshot = await productsRef
        .where('category', '==', category)
        .get();
      
      const products = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.json(products);
    }

    // GET /api/products?id=xxx - Get product by ID
    if (req.method === 'GET' && productId) {
      const productRef = db.collection('products').doc(productId);
      const productDoc = await productRef.get();
      
      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.json({
        id: productDoc.id,
        ...productDoc.data()
      });
    }

    // POST /api/products - Create new product
    if (req.method === 'POST') {
      const productData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await db.collection('products').add(productData);
      
      return res.status(201).json({
        id: docRef.id,
        ...productData
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in products API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

