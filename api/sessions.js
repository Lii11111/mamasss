// Vercel Serverless Function for sessions
// This allows backend API to work on Vercel
import express from 'express';
import { db } from '../server/config/firebaseAdmin.js';

const router = express.Router();

// Create or update a session
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const sessionData = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      // Create new session
      sessionData.createdAt = new Date().toISOString();
      const docRef = await db.collection('sessions').add(sessionData);
      
      return res.status(201).json({
        id: docRef.id,
        ...sessionData
      });
    } catch (error) {
      console.error('Error saving session:', error);
      return res.status(500).json({ error: 'Failed to save session' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


