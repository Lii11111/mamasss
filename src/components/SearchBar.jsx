import { useState, useEffect, useRef } from 'react';

function SearchBar({ searchTerm, onSearchChange, onError }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

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
        const errorMessage = 'Speech recognition error: ' + event.error;
        if (onError) {
          onError(errorMessage);
        }
        console.error(errorMessage);
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

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      const errorMessage = 'Speech recognition is not supported in your browser. Please use Chrome or Edge.';
      if (onError) {
        onError(errorMessage);
      }
      alert(errorMessage);
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
    <div className="sticky top-[104px] z-40 bg-stone-100 shadow-sm px-4 py-4 border-b border-stone-200">
      <div className="max-w-2xl mx-auto flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all bg-white"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-stone-200 text-gray-700 hover:bg-stone-300'
            }`}
            title={isListening ? 'Stop listening' : 'Voice search'}
          >
            <svg
              className="w-5 h-5"
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
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;

