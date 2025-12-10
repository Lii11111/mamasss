# Firebase & Express Setup Guide

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **Mamas Database**
3. Click the gear icon ⚙️ > **Project Settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app yet, click **Add app** > **Web** (</> icon)
6. Register your app with a nickname (e.g., "Sari Sari Store")
7. Copy the Firebase configuration object

## Step 2: Configure Frontend (React)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=mamas-database.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=mamas-database
   VITE_FIREBASE_STORAGE_BUCKET=mamas-database.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Update `src/firebase/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

## Step 3: Setup Firebase Admin SDK (Backend)

### Option A: Service Account Key (Recommended)

1. Go to Firebase Console > Project Settings > **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file (e.g., `serviceAccountKey.json`)
4. Copy the content and add to `.env`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'
   ```
   ⚠️ **Important**: Keep the quotes and use single quotes outside!

### Option B: Individual Credentials

1. Go to Firebase Console > Project Settings > **Service Accounts**
2. Generate a new key and open the JSON
3. Extract these values:
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   ```

## Step 4: Setup Firestore Security Rules

1. Go to Firebase Console > **Firestore Database** > **Rules**
2. For development, use these rules (⚠️ **NOT for production**):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // ⚠️ Allows all access - for development only!
       }
     }
   }
   ```
3. Click **Publish**

## Step 5: Initialize Firestore Collections

The app expects these collections:
- `products` - Store product information
- `purchases` - Store purchase/checkout history
- `sessions` - Store session earnings

You can create them manually or they'll be created automatically when you add data.

## Step 6: Running the Application

### Frontend (React)
```bash
npm run dev
```
Runs on: http://localhost:5173

### Backend (Express)
```bash
npm run server
```
Runs on: http://localhost:3000

### Run Both (Development)
Open two terminals:
- Terminal 1: `npm run dev` (Frontend)
- Terminal 2: `npm run server` (Backend)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/batch` - Batch add products

### Purchases
- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `GET /api/purchases/session/:sessionId` - Get purchases by session
- `POST /api/purchases` - Create new purchase (checkout)
- `DELETE /api/purchases/:id` - Delete purchase

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create or update session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

## Migration from localStorage

To migrate your existing localStorage data to Firestore, you can use the batch endpoint:

```javascript
// Example: Migrate products
const products = [
  { name: 'Chippy', price: 10, category: 'Snacks', image: '/images/chippy.jpg' },
  // ... more products
];

fetch('http://localhost:3000/api/products/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ products })
});
```

## Troubleshooting

### "Firebase Admin not initialized"
- Make sure your `.env` file has the correct Firebase Admin credentials
- Check that the service account key JSON is valid
- Ensure you're using single quotes for the JSON string in `.env`

### "Permission denied" errors
- Check your Firestore security rules
- Make sure you've published the rules after editing them

### CORS errors
- The Express server has CORS enabled for all origins (development)
- For production, configure CORS to only allow your frontend domain


