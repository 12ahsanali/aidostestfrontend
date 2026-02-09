import { useState,useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { searchAirports } from '../services/airportService'
export default function AirportAutocomplete({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  placeholder,
  disabled = false 
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ suggestions, setSuggestions ] = useState([]);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null);
  useEffect(() => {
  const fetchSuggestions = async () => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setErrors(null);
      return;
    }

    setLoading(true);
    setErrors(null);
    
    try {
      const results = await searchAirports(value);
      setSuggestions(results);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setErrors('Failed to load suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const timeoutId = setTimeout(fetchSuggestions, 300);
  return () => clearTimeout(timeoutId);
}, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value.toUpperCase(); // Auto-uppercase for ICAO
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    onBlur();
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (airport) => {
    onChange(airport.icao);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={`w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] disabled:opacity-50 disabled:cursor-not-allowed ${
          error && touched ? "border-[#ef4444] focus:border-[#dc2626]" : ""
        }`}
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}

      />      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 text-[var(--text-secondary)] animate-spin" />
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && !disabled && (
        <div className="absolute top-full left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-sm mt-1 max-h-64 overflow-y-auto z-50 shadow-lg">
          {errors ? (
            <div className="px-3 py-3 text-[var(--text-error)] text-sm">
              {errors}
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((airport) => (
              <div
                key={airport.icao}
                className="px-3 py-3 hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-color)] last:border-b-0 transition-colors"
                onClick={() => handleSuggestionClick(airport)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)] text-sm">
                        {airport.icao}
                      </span>
                      {airport.coordinates && (
                        <MapPin className="w-3 h-3 text-[var(--text-secondary)] flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-[var(--text-primary)] text-xs truncate mt-1">
                      {airport.name}
                    </div>
                    <div className="text-[var(--text-secondary)] text-xs">
                      {airport.city}, {airport.country}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : value.length >= 2 ? (
            <div className="px-3 py-3 text-[var(--text-secondary)] text-sm">
              No airports found for "{value}"
            </div>
          ) : (
            <div className="px-3 py-3 text-[var(--text-secondary)] text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}

    </div>
  );
}
