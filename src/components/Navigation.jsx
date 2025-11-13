import { useState, useEffect, useRef } from 'react';

function Navigation({ selectedCategory, onCategoryChange, searchTerm, onSearchChange }) {
  const categories = ['All', 'Snacks', 'Drinks', 'Condiments', 'Biscuits', 'Candies', 'Canned Goods', 'Noodles'];
  const [isListening, setIsListening] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const recognitionRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSearchChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 text-center">🛒 Janet's Sari Sari</h1>
        
        <div className="flex flex-row gap-2 md:gap-3 items-center justify-center">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <label className="text-white font-semibold text-sm md:text-lg whitespace-nowrap hidden sm:inline">Categories:</label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 md:px-6 md:py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-semibold text-sm md:text-lg min-w-[100px] md:min-w-[150px] flex items-center justify-between gap-2 transition-all"
              >
                <span>{selectedCategory}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl z-50 min-w-[180px] max-h-60 overflow-y-auto scrollbar-hide border border-stone-200">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm font-semibold transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                        selectedCategory === category
                          ? 'bg-green-700 text-white shadow-sm'
                          : 'text-gray-800 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl w-full flex gap-1.5 md:gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-3 py-2 md:px-4 md:py-3 pr-10 md:pr-12 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all bg-white text-gray-800 text-sm md:text-base"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-stone-200 text-gray-700 hover:bg-stone-300'
                }`}
                title={isListening ? 'Stop listening' : 'Voice search'}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isListening ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  )}
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="px-4 py-2 md:px-6 md:py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-semibold text-sm md:text-base transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

