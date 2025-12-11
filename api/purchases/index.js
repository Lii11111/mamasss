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
      // Remove undefined values (Firestore doesn't allow undefined)
      const removeUndefined = (obj) => {
        if (obj === null || typeof obj !== 'object') {
          return obj;
        }
        if (Array.isArray(obj)) {
          return obj.map(item => removeUndefined(item)).filter(item => item !== undefined);
        }
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
            cleaned[key] = removeUndefined(value);
          }
        }
        return cleaned;
      };
      
      const cleanedData = removeUndefined({
        ...req.body,
        date: req.body.date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      
      // Validate required fields
      if (!cleanedData.items || !Array.isArray(cleanedData.items) || cleanedData.items.length === 0) {
        return res.status(400).json({ error: 'Purchase must have at least one item' });
      }
      
      if (cleanedData.total === undefined || cleanedData.total === null) {
        return res.status(400).json({ error: 'Purchase must have a total' });
      }
      
      const docRef = await db.collection('purchases').add(cleanedData);
      
      return res.status(201).json({
        id: docRef.id,
        ...cleanedData
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in purchases API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

