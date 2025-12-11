# 🔒 Fix Permission Denied Error

## What the Error Means

`PERMISSION_DENIED` means your Firestore security rules are blocking write operations.

## Quick Fix (2 minutes)

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Select your project: **Mamas Database**
3. Click **"Firestore Database"** in the left menu

### Step 2: Open Rules Tab
1. Click the **"Rules"** tab at the top

### Step 3: Replace the Rules
Copy and paste this code:

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

### Step 4: Publish
1. Click the **"Publish"** button (top right)
2. Wait for confirmation: "Rules published successfully"

### Step 5: Try Migration Again
Run:
```bash
npm run migrate
```

---

## ⚠️ Important Note

These rules allow **anyone** to read/write your database. This is:
- ✅ **OK for development/testing**
- ❌ **NOT safe for production**

For production, you'll need proper authentication and rules later.

---

## Still Having Issues?

If you still get errors after updating rules:
1. Make sure you clicked **"Publish"** (not just saved)
2. Wait 10-20 seconds for rules to propagate
3. Try the migration again



