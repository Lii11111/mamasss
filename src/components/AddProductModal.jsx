import { useState, useEffect, useRef } from 'react';

function AddProductModal({ isOpen, onClose, onAddProduct, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Snacks',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Category icons mapping
  const categoryIcons = {
    'Snacks': '🍿',
    'Drinks': '🥤',
    'Condiments': '🧂',
    'Biscuits': '🍪',
    'Candies': '🍬',
    'Canned Goods': '🥫',
    'Noodles': '🍜'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCategoryOpen]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: '',
        category: 'Snacks',
        price: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setIsCategoryOpen(false);
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddProduct({
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price)
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const availableCategories = categories ? categories.filter(cat => cat !== 'All') : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span>Add New Product</span>
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-100 transition-all p-2 rounded-lg hover:bg-white/20 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-800 mb-2.5">
              <span>Product Name</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-emerald-400 focus:border-emerald-500 bg-gray-50 hover:bg-white focus:bg-white'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Category - Custom Dropdown */}
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-800 mb-2.5">
              <span>Category</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between font-medium ${
                  errors.category
                    ? 'border-red-400 focus:ring-red-400 bg-red-50'
                    : 'border-gray-300 focus:ring-emerald-400 focus:border-emerald-500 bg-gray-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{categoryIcons[formData.category] || '📦'}</span>
                  <span className="text-gray-900">{formData.category || 'Select category'}</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-fadeIn">
                  <div className="max-h-64 overflow-y-auto">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full px-4 py-3.5 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all ${
                          formData.category === category
                            ? 'bg-emerald-100 border-l-4 border-emerald-500'
                            : 'hover:border-l-4 hover:border-emerald-300'
                        }`}
                      >
                        <span className="text-xl">{categoryIcons[category] || '📦'}</span>
                        <span className={`font-semibold ${
                          formData.category === category ? 'text-emerald-700' : 'text-gray-700'
                        }`}>
                          {category}
                        </span>
                        {formData.category === category && (
                          <svg className="w-5 h-5 text-emerald-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.category}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-gray-800 mb-2.5">
              <span>Price</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₱</div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 font-bold text-lg ${
                  errors.price
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-emerald-400 focus:border-emerald-500 bg-gray-50 hover:bg-white focus:bg-white'
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.price}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-sm hover:shadow-md active:scale-95 border-2 border-transparent hover:border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;

