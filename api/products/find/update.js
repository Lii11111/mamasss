// Vercel Serverless Function for updating product by name and category
import { db } from '../../../../server/config/firebaseAdmin.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    return res.json(response);
  } catch (error) {
    console.error('❌ Error updating product by name:', error);
    return res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
}

