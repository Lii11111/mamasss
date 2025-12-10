import express from 'express';
import { db } from '../config/firebaseAdmin.js';

const router = express.Router();

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchasesRef = db.collection('purchases');
    const snapshot = await purchasesRef.orderBy('date', 'desc').get();
    
    const purchases = [];
    snapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(purchases);
  } catch (error) {
    console.error('Error getting purchases:', error);
    res.status(500).json({ error: 'Failed to get purchases' });
  }
});

// Get purchase by ID
router.get('/:id', async (req, res) => {
  try {
    const purchaseRef = db.collection('purchases').doc(req.params.id);
    const purchaseDoc = await purchaseRef.get();
    
    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    res.json({
      id: purchaseDoc.id,
      ...purchaseDoc.data()
    });
  } catch (error) {
    console.error('Error getting purchase:', error);
    res.status(500).json({ error: 'Failed to get purchase' });
  }
});

// Get purchases by session ID
router.get('/session/:sessionId', async (req, res) => {
  try {
    const purchasesRef = db.collection('purchases');
    const snapshot = await purchasesRef
      .where('sessionId', '==', req.params.sessionId)
      .orderBy('date', 'desc')
      .get();
    
    const purchases = [];
    snapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(purchases);
  } catch (error) {
    console.error('Error getting session purchases:', error);
    res.status(500).json({ error: 'Failed to get session purchases' });
  }
});

// Create a new purchase (checkout)
router.post('/', async (req, res) => {
  try {
    const purchaseData = {
      ...req.body,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('purchases').add(purchaseData);
    
    res.status(201).json({
      id: docRef.id,
      ...purchaseData
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Delete a purchase
router.delete('/:id', async (req, res) => {
  try {
    const purchaseRef = db.collection('purchases').doc(req.params.id);
    const purchaseDoc = await purchaseRef.get();
    
    if (!purchaseDoc.exists) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    await purchaseRef.delete();
    
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
});

export default router;

