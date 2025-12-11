# 📁 Firestore Structure Explained

## How Firestore Stores Data

Firestore doesn't use "folders" - it uses **Collections** and **Documents**.

Think of it like this:
- **Collection** = Folder (like `products`, `purchases`)
- **Document** = File inside the folder (each product, each purchase)

---

## Your Current Firestore Structure

```
Firestore Database
│
├── 📁 products (Collection)
│   ├── 📄 abc123xyz (Document) - "Chippy" product
│   ├── 📄 def456uvw (Document) - "Piattos" product
│   ├── 📄 ghi789rst (Document) - "Nova" product
│   └── ... (42 products total)
│
├── 📁 purchases (Collection)
│   ├── 📄 purchase1 (Document) - First checkout
│   ├── 📄 purchase2 (Document) - Second checkout
│   └── ... (grows as you checkout)
│
└── 📁 sessions (Collection)
    └── ... (if you use sessions)
```

---

## What Happens When You Edit Price

### Before Edit:
```
products Collection
└── Document: abc123xyz
    ├── name: "Chippy"
    ├── price: 10.00  ← Old price
    ├── category: "Snacks"
    └── image: "/images/chippy.jpg"
```

### After Edit:
```
products Collection
└── Document: abc123xyz  ← SAME document!
    ├── name: "Chippy"
    ├── price: 15.00  ← Updated price
    ├── category: "Snacks"
    ├── image: "/images/chippy.jpg"
    └── updatedAt: "2025-12-09T..." ← Timestamp added
```

**No new folder/collection created!** The same document is just **updated**.

---

## What Creates New Documents

### ✅ Creates New Document:
- **Add Product** → New document in `products` collection
- **Checkout** → New document in `purchases` collection

### ❌ Does NOT Create New Document:
- **Edit Price** → Updates existing document
- **Edit Product** → Updates existing document
- **Delete Product** → Removes document (doesn't create new)

---

## How to View in Firebase Console

1. Go to **Firebase Console** → **Firestore Database**
2. Click on **`products`** collection
3. You'll see all your products listed
4. Click on any product to see its data
5. When you edit a price, refresh and you'll see the `updatedAt` field change

---

## Summary

| Action | Creates New Document? | Creates New Collection? |
|--------|---------------------|------------------------|
| Edit Price | ❌ No (updates existing) | ❌ No |
| Edit Product | ❌ No (updates existing) | ❌ No |
| Add Product | ✅ Yes (new document) | ❌ No |
| Delete Product | ❌ No (removes document) | ❌ No |
| Checkout | ✅ Yes (new document) | ❌ No |

**Answer: No folders/collections are created when you edit a price. Only the existing product document is updated!** ✅



