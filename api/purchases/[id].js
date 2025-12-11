// Vercel Serverless Function for purchase by ID (GET, DELETE)
import { db } from '../../../server/config/firebaseAdmin.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    const purchaseRef = db.collection('purchases').doc(id);
    const purchaseDoc = await purchaseRef.get();

    // GET /api/purchases/:id - Get purchase by ID
    if (req.method === 'GET') {
      if (!purchaseDoc.exists) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      return res.json({
        id: purchaseDoc.id,
        ...purchaseDoc.data()
      });
    }

    // DELETE /api/purchases/:id - Delete purchase
    if (req.method === 'DELETE') {
      if (!purchaseDoc.exists) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      await purchaseRef.delete();

      return res.json({ message: 'Purchase deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in purchase API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

