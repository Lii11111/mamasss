import express from 'express';
import { db } from '../config/firebaseAdmin.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
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
    res.json(products.sort((a, b) => {
      const categoryA = categoryOrder.indexOf(a.category) !== -1 ? categoryOrder.indexOf(a.category) : 999;
      const categoryB = categoryOrder.indexOf(b.category) !== -1 ? categoryOrder.indexOf(b.category) : 999;
      if (categoryA !== categoryB) return categoryA - categoryB;
      return (a.name || '').localeCompare(b.name || '');
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef
      .where('category', '==', req.params.category)
      .get();
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({ error: 'Failed to get products by category' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('products').add(productData);
    
    res.status(201).json({
      id: docRef.id,
      ...productData
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product by name and category (for products with numeric IDs)
// MUST be before /:id route to avoid matching "find" as an ID
router.put('/find/update', async (req, res) => {
  try {
    console.log('📥 Received PUT /find/update request:', req.body);
    const { name, category, ...updateData } = req.body;
    
    if (!name || !category) {
      console.warn('❌ Missing name or category:', { name, category });
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    console.log('🔍 Searching for product:', { name, category });
    
    // Find product by name and category
    const productsRef = db.collection('products');
    const snapshot = await productsRef
      .where('name', '==', name)
      .where('category', '==', category)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      console.warn('❌ Product not found:', { name, category });
      return res.status(404).json({ error: `Product not found: ${name} (${category})` });
    }
    
    const productDoc = snapshot.docs[0];
    console.log('✅ Found product:', { id: productDoc.id, name, category });
    
    const finalUpdateData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('💾 Updating product with data:', finalUpdateData);
    await productDoc.ref.update(finalUpdateData);
    
    const response = {
      id: productDoc.id,
      ...productDoc.data(),
      ...finalUpdateData
    };
    
    console.log('✅ Product updated successfully:', response.id);
    res.json(response);
  } catch (error) {
    console.error('❌ Error updating product by name:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await productRef.update(updateData);
    
    res.json({
      id: req.params.id,
      ...updateData
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await productRef.delete();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Batch add products (useful for initial data migration)
router.post('/batch', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }
    
    const batch = db.batch();
    const productsRef = db.collection('products');
    
    products.forEach((product) => {
      const docRef = productsRef.doc();
      batch.set(docRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    
    res.status(201).json({ message: `${products.length} products added successfully` });
  } catch (error) {
    console.error('Error batch adding products:', error);
    res.status(500).json({ error: 'Failed to batch add products' });
  }
});

export default router;

