# 🔍 Debugging Firestore Issues

## Common Issues & Solutions

### Issue 1: "Failed to update price" Error

**Possible Causes:**
1. Firestore permissions not set correctly
2. Product ID format mismatch
3. Firebase config not loaded

**Quick Fixes:**

#### Check 1: Verify Firestore Rules
1. Go to Firebase Console → Firestore Database → Rules
2. Make sure rules are:
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
3. Click **"Publish"**

#### Check 2: Check Browser Console
1. Open browser console (F12)
2. Look for Firebase errors
3. Check Network tab for failed requests

#### Check 3: Verify Product IDs
Products from Firestore have **string IDs** (like "abc123xyz"), not numbers.

---

### Issue 2: Checkout Button Not Working

**Possible Causes:**
1. Cart is empty
2. Error preventing checkout
3. Async function issue

**Quick Fixes:**

#### Check 1: Verify Cart Has Items
- Make sure items are in cart before checkout

#### Check 2: Check Browser Console
- Look for errors when clicking checkout

---

## Debug Steps

1. **Open Browser Console** (F12)
2. **Check for errors** - Look for red error messages
3. **Check Network tab** - See if Firestore requests are failing
4. **Check Firebase Console** - Verify data exists

---

## Quick Test

Try this in browser console:
```javascript
// Check if Firebase is configured
console.log('Firebase config:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Loaded' : 'Missing');

// Check products
// (You'll need to access your products state)
```

---

## Need More Help?

Share:
1. Browser console errors (F12 → Console tab)
2. Network tab errors (F12 → Network tab → Filter by "firestore")
3. What happens when you click update price



