// Vercel Serverless Function for purchases
import { db } from '../../server/config/firebaseAdmin.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/purchases - Get all purchases
    if (req.method === 'GET') {
      const purchasesRef = db.collection('purchases');
      const snapshot = await purchasesRef.orderBy('date', 'desc').get();
      
      const purchases = [];
      snapshot.forEach((doc) => {
        purchases.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.json(purchases);
    }

    // POST /api/purchases - Create a new purchase (checkout)
    if (req.method === 'POST') {
      const purchaseData = {
        ...req.body,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      const docRef = await db.collection('purchases').add(purchaseData);
      
      return res.status(201).json({
        id: docRef.id,
        ...purchaseData
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in purchases API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

