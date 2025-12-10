import express from 'express';
import { db } from '../config/firebaseAdmin.js';

const router = express.Router();

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessionsRef = db.collection('sessions');
    const snapshot = await sessionsRef.orderBy('createdAt', 'desc').get();
    
    const sessions = [];
    snapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(sessions);
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    const sessionDoc = await sessionRef.get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      id: sessionDoc.id,
      ...sessionDoc.data()
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Create or update a session
router.post('/', async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // If session ID is provided, update existing session
    if (req.body.id) {
      const sessionRef = db.collection('sessions').doc(req.body.id);
      const sessionDoc = await sessionRef.get();
      
      if (!sessionDoc.exists) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      await sessionRef.update(sessionData);
      
      res.json({
        id: req.body.id,
        ...sessionData
      });
    } else {
      // Create new session
      sessionData.createdAt = new Date().toISOString();
      const docRef = await db.collection('sessions').add(sessionData);
      
      res.status(201).json({
        id: docRef.id,
        ...sessionData
      });
    }
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    const sessionDoc = await sessionRef.get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await sessionRef.update(updateData);
    
    res.json({
      id: req.params.id,
      ...updateData
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    const sessionDoc = await sessionRef.get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    await sessionRef.delete();
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;


