// Vercel Serverless Function for product by ID (PUT, DELETE)
import { db } from '../../../server/config/firebaseAdmin.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    // PUT /api/products/:id - Update product by ID
    if (req.method === 'PUT') {
      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      await productRef.update(updateData);

      return res.json({
        id: id,
        ...productDoc.data(),
        ...updateData
      });
    }

    // DELETE /api/products/:id - Delete product
    if (req.method === 'DELETE') {
      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await productRef.delete();

      return res.json({ message: 'Product deleted successfully' });
    }

    // GET /api/products/:id - Get product by ID (fallback)
    if (req.method === 'GET') {
      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json({
        id: productDoc.id,
        ...productDoc.data()
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in product API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

