# ✅ How to Verify Updates

## 1. Check Environment Variables in Vercel ✅

### After Adding Variables:
1. **In Vercel Dashboard** (current page):
   - Scroll down to see the list of existing environment variables
   - Your variables should appear in the list
   - Look for: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.

2. **Verify They're Saved:**
   - Click on the variable name to see its value (if not sensitive)
   - Make sure "Environments" shows: Production, Preview, Development (or "All Environments")

### Important:
- After adding/changing variables, you MUST redeploy for changes to take effect
- Click "Redeploy" button in Vercel Dashboard → Deployments

---

## 2. Check If Deployment Updated 🚀

### Method 1: Vercel Dashboard
1. Go to **Deployments** tab (top navigation)
2. Look for the latest deployment
3. Check:
   - Status: Should be "Ready" (green)
   - Commit message: Shows latest git commit
   - Time: Should be recent

### Method 2: Visit Your Site
1. Open your Vercel URL (e.g., `your-app.vercel.app`)
2. Open browser console (F12)
3. Look for:
   ```
   ✅ Firebase config loaded: { projectId: "...", ... }
   ```
   If you see this, environment variables are loaded!

---

## 3. Test Session Save 🔍

### Step 1: Open Browser Console
1. Go to your deployed site on mobile/desktop
2. Open browser console:
   - **Mobile Chrome**: Menu → More Tools → Developer Tools
   - **Desktop**: Press F12
   - **Mobile Safari**: Settings → Advanced → Web Inspector

### Step 2: Try Ending a Session
1. Add some items to cart
2. Checkout (to create purchases)
3. Click "End Session"

### Step 3: Check Console Logs
Look for these messages:

**Success:**
```
💾 Saving session to Firestore: { ... }
📤 Attempting to save session via Firestore client SDK...
✅ Session saved to Firestore successfully!
```

**If Failed:**
```
⚠️ Firestore client SDK failed: { code: "permission-denied", ... }
❌ Failed to save session to Firestore: ...
💾 Session saved to localStorage as backup
```

---

## 4. Check Firestore Database 📊

### Method 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Data** tab
4. Look for `sessions` collection
5. Should see documents with:
   - `startTime`
   - `endTime`
   - `earnings`
   - `purchaseCount`
   - `status: "ended"`

### Method 2: Check Console Logs
If session saved successfully, console will show:
```
✅ Session saved to Firestore successfully!
```

---

## 5. Verify Code Changes 📝

### Check Git Status:
```bash
git status
git log --oneline -5  # Last 5 commits
```

### Check Vercel Deployment:
1. Vercel Dashboard → Deployments
2. Latest deployment should show your latest commit
3. Check "Build Logs" to see if build succeeded

---

## 6. Quick Verification Checklist ✅

- [ ] Environment variables added in Vercel
- [ ] Environment variables show "All Environments" or specific environments
- [ ] Clicked "Save" button in Vercel
- [ ] Redeployed after adding variables
- [ ] Browser console shows Firebase config loaded
- [ ] Tried ending a session
- [ ] Checked console for success/error messages
- [ ] Checked Firestore Database for `sessions` collection
- [ ] Verified session data appears in Firestore

---

## Common Issues & Solutions

### Issue: "Environment variable not found"
**Solution:**
1. Make sure variable name starts with `VITE_` (for Vite)
2. Redeploy after adding variables
3. Check "Environments" is set correctly

### Issue: "Firestore timeout"
**Solution:**
1. Check Firestore security rules (must allow writes)
2. Check network connection
3. Increase timeout (already done - 20 seconds)

### Issue: "Permission denied"
**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Update rules to allow writes
3. Click "Publish" (important!)
4. Wait 10-20 seconds

---

## Test Right Now:

1. **Add Environment Variables:**
   - Key: `VITE_FIREBASE_API_KEY`
   - Value: (your Firebase API key)
   - Click "Add Another" for each variable
   - Click "Save"

2. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment

3. **Test:**
   - Open your site
   - Check console for Firebase config
   - Try ending a session
   - Check Firestore for new session

---

**Need help?** Share:
- Console error messages
- Screenshot of Vercel environment variables
- Firestore security rules

