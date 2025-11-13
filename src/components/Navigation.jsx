function Navigation({ selectedCategory, onCategoryChange }) {
  const categories = ['All', 'Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];

  return (
    <nav className="bg-emerald-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">🛒 Sari-Sari Store</h1>
        <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-3 rounded-full text-base md:text-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-stone-100 text-emerald-700 shadow-md'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

