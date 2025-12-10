# 📋 Detailed Step-by-Step: Verify Everything is Working

## STEP 1: Check if Environment Variables are Set in Vercel ✅

### 1.1 In Vercel Dashboard:
1. Click on your project **"mamasss"** (the one with purple/yellow lightning bolt)
2. On the left sidebar, click **"Settings"**
3. Scroll down and click **"Environment Variables"** (under "Build and Deployment")
4. Look at the list - do you see these variables?
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

**If NOT there:**
- Click "Add New" button
- Add each variable one by one
- Make sure "Environments" is set to "All Environments" or select Production/Preview/Development
- Click "Save" after each one

**If already there:**
- ✅ Good! Move to Step 2

---

## STEP 2: Redeploy After Adding Variables 🔄

### 2.1 Go to Deployments:
1. Click **"Deployments"** tab (top navigation bar)
2. You'll see a list of deployments
3. Find the **latest deployment** (top of the list)
4. Click the **three dots (⋯)** on the right side of that deployment
5. Click **"Redeploy"**
6. Click **"Redeploy"** again in the popup
7. Wait for it to finish (you'll see "Building..." then "Ready")

**Why:** Environment variables only apply to NEW deployments, so you must redeploy!

---

## STEP 3: Check Firebase Security Rules 🔒

### 3.1 Open Firebase Console:
1. Go to https://console.firebase.google.com/
2. Click on your project (likely "Mamas Database" or your project name)
3. In the left sidebar, click **"Firestore Database"**
4. Click the **"Rules"** tab (at the top)

### 3.2 Check Rules:
Look at the rules - they should be EXACTLY like this:

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

**If different:**
1. Replace everything with the code above
2. Click **"Publish"** button (very important - not just Save!)
3. Wait 10-20 seconds
4. You should see "Rules published successfully" message

**If same:**
- ✅ Good! Rules are correct
- But make sure you clicked "Publish" (not just typed it)

---

## STEP 4: Open Your Deployed Site 🌐

### 4.1 Open the Site:
1. In Vercel Dashboard, go back to **"Projects"**
2. Click on **"mamasss"** project
3. Click on the URL: **"mamasss.vercel.app"** (or click "Visit" button)
4. This opens your site in a new tab

---

## STEP 5: Open Browser Console 🔍

### 5.1 Desktop Browser:
1. Press **F12** key (or right-click → Inspect)
2. Click the **"Console"** tab
3. You should see messages like:
   ```
   ✅ Firebase config loaded: { projectId: "...", ... }
   ```

### 5.2 Mobile Browser:
**Chrome (Android):**
1. Open Chrome app
2. Go to your site URL
3. Tap menu (three dots) → Settings → Developer tools
4. Enable "Remote debugging" (if available)

**Safari (iPhone):**
1. Settings → Safari → Advanced
2. Enable "Web Inspector"
3. Connect iPhone to Mac
4. On Mac: Safari → Develop → [Your iPhone] → [Your site]

**OR - Easier for Mobile:**
- Use desktop browser first to test
- Mobile will work the same way

---

## STEP 6: Test Adding Products to Cart 🛒

### 6.1 On Your Site:
1. Add some products to cart
2. Click **"Add to Cart"** on 2-3 products
3. Check console - should see no errors

---

## STEP 7: Test Checkout 💳

### 7.1 Complete a Purchase:
1. Click the **Cart icon** (bottom right or top)
2. Click **"Checkout"** button
3. Check console for:
   ```
   📤 Attempting to save purchase via Firestore client SDK...
   ✅ Purchase saved to Firestore! ID: ...
   ```

**If you see ✅:** Good! Purchases are saving!

**If you see ❌:** Note the error message and share it

---

## STEP 8: Test Ending Session 📊

### 8.1 End a Session:
1. Click **"History"** button (if visible) or find "End Session"
2. Click **"End Session"** button
3. In the modal, click **"End"** button
4. **IMPORTANT:** Watch the console!

### 8.2 Check Console Messages:

**Success looks like:**
```
💾 Saving session to Firestore: { ... }
📤 Attempting to save session via Firestore client SDK...
✅ Session saved to Firestore successfully!
```

**Failure looks like:**
```
⚠️ Firestore client SDK failed: { code: "permission-denied", ... }
OR
⚠️ Firestore client SDK failed: { message: "Firestore timeout (20s)" }
❌ Failed to save session to Firestore: ...
💾 Session saved to localStorage as backup
```

**Write down what you see!**

---

## STEP 9: Verify in Firestore Database 🗄️

### 9.1 Check Purchases:
1. Go back to Firebase Console
2. Click **"Firestore Database"** → **"Data"** tab
3. Look for **"purchases"** collection
4. Click on it - should see your checkout records
5. ✅ If you see purchases = Checkout is working!

### 9.2 Check Sessions:
1. Still in Firestore Database → Data tab
2. Look for **"sessions"** collection
3. Click on it
4. **If you see documents:**
   - ✅ Sessions are saving!
   - Check the document - should have: `earnings`, `startTime`, `endTime`, `status: "ended"`

5. **If collection doesn't exist or is empty:**
   - ❌ Sessions are not saving
   - Go back to console and check error message
   - Most likely: Security rules issue or timeout

---

## STEP 10: Common Issues & Fixes 🔧

### Issue 1: "Firestore config loaded" NOT showing in console
**Fix:**
- Environment variables not set correctly in Vercel
- Go back to Step 1
- Make sure variables start with `VITE_`
- Redeploy (Step 2)

### Issue 2: "permission-denied" error
**Fix:**
- Firestore security rules blocking writes
- Go back to Step 3
- Make sure rules allow `write: if true`
- Make sure you clicked "Publish" (not just typed)

### Issue 3: "timeout" error
**Fix:**
- Network might be slow
- Try again
- Check internet connection
- If still timeout, check Firestore rules

### Issue 4: "Backend API not available"
**Fix:**
- This is OK! Firestore client SDK should work directly
- Backend is optional fallback
- Focus on making Firestore client SDK work

---

## STEP 11: Share Results 📝

After testing, tell me:
1. ✅ What worked? (Purchases saving? Sessions saving?)
2. ❌ What errors did you see? (Copy exact error from console)
3. 🔍 What's in Firestore? (Purchases? Sessions?)

This will help me fix any remaining issues!

---

## Quick Summary Checklist ✅

- [ ] Step 1: Environment variables added in Vercel
- [ ] Step 2: Redeployed after adding variables
- [ ] Step 3: Firestore rules set to allow all (and Published!)
- [ ] Step 4: Opened deployed site
- [ ] Step 5: Opened browser console
- [ ] Step 6: Tested adding to cart (no errors)
- [ ] Step 7: Tested checkout (should save to Firestore)
- [ ] Step 8: Tested ending session (check console for errors)
- [ ] Step 9: Checked Firestore Database (purchases & sessions)
- [ ] Step 10: Documented any errors

---

**Start with Step 1 and go through each step carefully. Take your time!**

