function CategorySidebar({ categories, selectedCategory, onCategoryChange }) {
  const categoryIcons = {
    'All': '📦',
    'Snacks': '🍿',
    'Drinks': '🥤',
    'Condiments': '🧂',
    'Biscuits': '🍪',
    'Candies': '🍬',
    'Canned Goods': '🥫',
    'Noodles': '🍜'
  };

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-stone-200 overflow-y-auto z-40 pt-24">
      <div className="p-4">
        <h2 className="text-base font-bold text-gray-800 mb-3 px-2">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === category
                  ? 'bg-green-700 text-white shadow-md font-semibold'
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium'
              }`}
            >
              <span className="text-xl">{categoryIcons[category] || '📦'}</span>
              <span className="text-sm">{category}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default CategorySidebar;

