# 🎯 Step-by-Step Guide: Connect Your App to Firebase

Follow these steps **in order**. Each step takes 2-5 minutes.

---

## ✅ Step 1: Get Firebase Web App Configuration (5 minutes)

### What you need:
Your Firebase project's web app configuration values.

### How to get it:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Sign in if needed

2. **Select Your Project**
   - Click on **"Mamas Database"** (your project)

3. **Open Project Settings**
   - Click the **⚙️ Gear Icon** (top left)
   - Click **"Project Settings"**

4. **Scroll Down to "Your apps"**
   - You should see a section called "Your apps"
   - If you see a web app already, skip to step 5
   - If not, click **"Add app"** > Select the **Web icon** (`</>`)

5. **Register Your App**
   - Enter app nickname: `Sari Sari Store` (or any name)
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click **"Register app"**

6. **Copy Configuration**
   - You'll see a code block that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "mamas-database.firebaseapp.com",
     projectId: "mamas-database",
     storageBucket: "mamas-database.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   };
   ```
   - **Copy these values** - you'll need them in Step 2!

---

## ✅ Step 2: Create .env File (2 minutes)

1. **In your project folder** (`C:\Users\Lester\Desktop\LII\mamasss`)

2. **Create a new file** named exactly: `.env`
   - ⚠️ Important: It starts with a dot (`.`)
   - ⚠️ No file extension (not `.env.txt`)

3. **Copy this template** into the `.env` file:

```env
# Firebase Web App Configuration (from Step 1)
VITE_FIREBASE_API_KEY=paste_your_apiKey_here
VITE_FIREBASE_AUTH_DOMAIN=paste_your_authDomain_here
VITE_FIREBASE_PROJECT_ID=paste_your_projectId_here
VITE_FIREBASE_STORAGE_BUCKET=paste_your_storageBucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=paste_your_messagingSenderId_here
VITE_FIREBASE_APP_ID=paste_your_appId_here

# Server Port
PORT=3000

# Firebase Admin SDK (we'll do this in Step 3)
FIREBASE_SERVICE_ACCOUNT_KEY=
```

4. **Replace the placeholder values** with the actual values from Step 1

   **Example:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdef
   VITE_FIREBASE_AUTH_DOMAIN=mamas-database.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=mamas-database
   VITE_FIREBASE_STORAGE_BUCKET=mamas-database.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

---

## ✅ Step 3: Get Firebase Admin SDK Credentials (5 minutes)

This is for the backend (Express server).

### Option A: Service Account Key (Easier - Recommended)

1. **Still in Firebase Console** (Project Settings page)

2. **Go to "Service Accounts" tab** (at the top)

3. **Click "Generate New Private Key"**
   - A popup will appear
   - Click **"Generate Key"**

4. **JSON file downloads**
   - A file like `mamas-database-firebase-adminsdk-xxxxx.json` downloads
   - **Keep this file safe!** (It's secret credentials)

5. **Copy the entire JSON content**
   - Open the downloaded file
   - Select ALL content (Ctrl+A)
   - Copy it (Ctrl+C)

6. **Add to .env file**
   - Open your `.env` file
   - Find the line: `FIREBASE_SERVICE_ACCOUNT_KEY=`
   - Replace with: `FIREBASE_SERVICE_ACCOUNT_KEY='[paste entire JSON here]'`
   
   ⚠️ **IMPORTANT**: 
   - Use **single quotes** (`'`) around the JSON
   - The JSON must be on ONE line (no line breaks)
   
   **Example:**
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"mamas-database",...}'
   ```

---

## ✅ Step 4: Configure Firestore Security Rules (2 minutes)

This allows your app to read/write data.

1. **In Firebase Console**
   - Click **"Firestore Database"** in the left menu
   - Click the **"Rules"** tab (at the top)

2. **Replace the rules** with this (for development):

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

⚠️ **Warning**: These rules allow anyone to read/write. Perfect for testing, but NOT for production!

3. **Click "Publish"** button

---

## ✅ Step 5: Test the Connection (3 minutes)

### Start the Backend Server:

1. **Open Terminal/Command Prompt**
   - Navigate to your project folder:
     ```bash
     cd C:\Users\Lester\Desktop\LII\mamasss
     ```

2. **Start Express server:**
   ```bash
   npm run server
   ```

3. **You should see:**
   ```
   🚀 Server running on http://localhost:3000
   📦 API endpoints available at http://localhost:3000/api
   ```

   ✅ If you see this, **backend is working!**

### Start the Frontend:

4. **Open a NEW Terminal/Command Prompt**
   - Keep the first one running!

5. **Navigate to project folder again:**
   ```bash
   cd C:\Users\Lester\Desktop\LII\mamasss
   ```

6. **Start React app:**
   ```bash
   npm run dev
   ```

7. **You should see:**
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

8. **Open your browser** to: `http://localhost:5173/`

   ✅ If the app loads, **frontend is working!**

---

## ✅ Step 6: Verify Firebase Connection

### Test Backend API:

1. **Open browser** or use a tool like Postman
2. **Visit:** `http://localhost:3000/api/health`
3. **You should see:**
   ```json
   {"status":"ok","message":"Sari Sari Store API is running"}
   ```

### Test Firebase Connection:

4. **Check browser console** (F12)
   - Look for any Firebase errors
   - Should see no errors about missing config

---

## 🎉 You're Done!

If everything works:
- ✅ Backend server running on port 3000
- ✅ Frontend running on port 5173
- ✅ No errors in console
- ✅ Health check endpoint responds

---

## ❓ Troubleshooting

### Problem: "Firebase configuration is missing"
- **Solution**: Check your `.env` file exists and has correct values
- Make sure file is named `.env` (not `.env.txt`)

### Problem: Backend won't start
- **Solution**: Check if port 3000 is already in use
- Make sure `.env` has `FIREBASE_SERVICE_ACCOUNT_KEY` filled in

### Problem: "Permission denied" errors
- **Solution**: Make sure you published Firestore Rules (Step 4)

### Problem: Can't find .env file
- **Solution**: 
  - Make sure it's in the root folder (same level as `package.json`)
  - Make sure it's named `.env` (not `.env.txt` or `.env.txt.txt`)
  - Some editors hide files starting with `.` - show hidden files

---

## 📝 Next Steps (After Connection Works)

Once connected, we can:
1. Migrate localStorage data to Firestore
2. Update React components to use Firestore
3. Test adding/editing products in Firestore
4. View data in Firebase Console

**But first, complete Steps 1-6 above!** ✅



