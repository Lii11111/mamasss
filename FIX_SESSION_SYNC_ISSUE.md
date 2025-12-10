# 🔧 Fix "Session saved locally but failed to sync" Error

## Quick Fix

The error means Firestore client SDK cannot write to the `sessions` collection. Most likely cause: **Firestore security rules**.

## Step 1: Check Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Make sure the rules look like this:

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

5. **IMPORTANT**: Click **"Publish"** button (not just Save)
6. Wait 10-20 seconds for rules to propagate

## Step 2: Verify Rules Were Published

After clicking "Publish", you should see a success message. The rules should now allow writes to all collections including `sessions`.

## Step 3: Test Again

1. Try ending a session again
2. Check if it saves successfully
3. In Firebase Console → Firestore Database → Data tab, check if a `sessions` collection appears

## Why This Happens

- Firestore security rules block writes by default
- The `sessions` collection needs permission to write
- Rules must be published (not just saved) to take effect

## Backup Solution (Already Implemented)

Even if Firestore fails, your session data is:
- ✅ Saved in localStorage (won't be lost)
- ✅ Stored in `PENDING_SESSIONS_KEY` for later sync
- ✅ Can be manually synced later when Firestore works

## Check Mobile Browser Console

To see the exact error:
1. On mobile browser, open developer tools (if available)
2. Check console for error messages
3. Look for error codes like:
   - `permission-denied` → Security rules issue
   - `unavailable` → Network issue
   - `timeout` → Slow connection

## Alternative: Use Backend API

If Firestore client SDK doesn't work on mobile, you can:
1. Access app using your computer's IP address
2. Make sure backend server is running and accessible
3. The app will automatically use backend API as fallback

---

**The app will still work even if session sync fails!** Purchases are saved separately and won't be affected.

