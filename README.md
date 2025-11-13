# Sari-Sari Store

A modern, mobile-responsive sari-sari store management system built with React and Tailwind CSS. Features product browsing, shopping cart, voice search, and price editing capabilities.

## Features

- 🛒 **Shopping Cart System** - Add items, manage quantities, and calculate totals
- 🔍 **Search Functionality** - Search products by name with text or voice input
- 🎤 **Voice Search** - Use your voice to search for products (Chrome/Edge recommended)
- 📱 **Mobile Responsive** - Optimized for mobile devices with touch-friendly interface
- 🏷️ **Product Categories** - Browse by category: Snacks, Drinks, Condiments, Biscuits, Candies, Canned Goods, Noodles
- ✏️ **Price Editing** - Edit product prices directly from the product card
- 🎨 **Modern UI** - Soft green and beige color theme with Roboto font

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

To create a production build:

```bash
npm run build
```

### Preview

To preview the production build:

```bash
npm run preview
```

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Web Speech API** - Voice recognition for search
- **Roboto Font** - Clean, modern typography
- **ESLint** - Code linting

## Project Structure

```
mami/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx    # Category navigation
│   │   ├── SearchBar.jsx     # Search with voice input
│   │   ├── ProductCard.jsx   # Product card with edit functionality
│   │   ├── ProductList.jsx   # Product grid display
│   │   └── Cart.jsx          # Shopping cart sidebar
│   ├── data/
│   │   └── products.js      # Product data
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles with Tailwind directives
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Usage

1. **Browse Products**: Use the category buttons to filter products
2. **Search**: Type in the search bar or click the microphone icon for voice search
3. **Add to Cart**: Click the "+ Add to Cart" button on any product
4. **View Cart**: Click the cart button (red button on desktop, floating button on mobile)
5. **Edit Price**: Click the pencil icon on any product card to edit its price
6. **Checkout**: Review your cart and click "Checkout" when ready

## Browser Support

- **Voice Search**: Works best in Chrome and Edge browsers
- **General Usage**: Compatible with all modern browsers

## License

This project is open source and available for personal use.

