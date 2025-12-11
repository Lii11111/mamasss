# 🚀 Vercel Deployment Guide

## Important Notes

### Frontend (Vercel) ✅
- Your React app is deployed on Vercel
- Frontend works perfectly
- Firestore client SDK works directly from browser (no backend needed!)

### Backend (Not on Vercel) ⚠️
- Express backend server does NOT automatically run on Vercel
- You have two options:

---

## Option 1: Use Firestore Client SDK Only (Recommended) ✅

**No backend needed!** The app uses Firestore client SDK directly from the browser.

**What works:**
- ✅ Products (load, add, update, delete)
- ✅ Purchases/Checkout
- ✅ Sessions (should work if Firestore rules allow)

**Requirements:**
1. Firestore security rules must allow writes
2. Firebase config in `.env` must be set in Vercel environment variables

### Set Environment Variables in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Redeploy

---

## Option 2: Deploy Backend Separately

If you need the backend API, deploy it separately:

### Option A: Vercel Serverless Functions
1. Create `api/` folder in project root
2. Convert Express routes to serverless functions
3. Deploy to Vercel (functions auto-deploy)

### Option B: Separate Backend Hosting
Deploy backend to:
- **Railway** (recommended - easy setup)
- **Render** (free tier available)
- **Heroku** (paid)
- **DigitalOcean** App Platform

Then update `VITE_API_BASE_URL` in Vercel environment variables.

---

## Fix Session Timeout Issue

The timeout error suggests Firestore is taking too long. Possible causes:

1. **Firestore Security Rules** - Must allow writes
2. **Network Speed** - Mobile network might be slow
3. **Firestore Config** - Check environment variables

### Check Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **"Publish"** after updating rules!

---

## Current Status

- ✅ Frontend: Deployed on Vercel
- ✅ Firestore Client SDK: Works directly (no backend needed)
- ⚠️ Backend API: Not deployed (optional fallback)
- ⏳ Session Save: Should work via Firestore client SDK

---

## Testing

1. Make sure Firestore rules allow writes
2. Check Vercel environment variables are set
3. Try ending a session
4. Check browser console for detailed errors

The app will save sessions to localStorage as backup if Firestore fails!


