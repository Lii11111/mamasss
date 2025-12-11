// Vercel Serverless Function for sessions
import { db } from '../server/config/firebaseAdmin.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/sessions - Get all sessions
    if (req.method === 'GET' && !req.query.id) {
      const sessionsRef = db.collection('sessions');
      const snapshot = await sessionsRef.orderBy('createdAt', 'desc').get();
      
      const sessions = [];
      snapshot.forEach((doc) => {
        sessions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.json(sessions);
    }

    // GET /api/sessions?id=xxx - Get session by ID
    if (req.method === 'GET' && req.query.id) {
      const sessionRef = db.collection('sessions').doc(req.query.id);
      const sessionDoc = await sessionRef.get();
      
      if (!sessionDoc.exists) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      return res.json({
        id: sessionDoc.id,
        ...sessionDoc.data()
      });
    }

    // POST /api/sessions - Create or update a session
    if (req.method === 'POST') {
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
        
        return res.json({
          id: req.body.id,
          ...sessionDoc.data(),
          ...sessionData
        });
      } else {
        // Create new session
        sessionData.createdAt = new Date().toISOString();
        const docRef = await db.collection('sessions').add(sessionData);
        
        return res.status(201).json({
          id: docRef.id,
          ...sessionData
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in sessions API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}


