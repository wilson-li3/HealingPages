import { useEffect, useRef, useState, useCallback } from 'react';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

// Promise-based script loader — resolves when Google Maps is ready
let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (!apiKey) return Promise.reject(new Error('No API key'));
  if (window.google?.maps?.places) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface Suggestion {
  placeId: string;
  text: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
}

export default function AddressAutocomplete({ value, onChange, onBlur, error, placeholder }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = 'address-suggestions';
  const [mapsLoaded, setMapsLoaded] = useState(() => !!window.google?.maps?.places);

  // Load script and track readiness
  useEffect(() => {
    if (mapsLoaded) return;
    loadScript().then(() => setMapsLoaded(true)).catch(() => {});
  }, [mapsLoaded]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim() || !window.google?.maps?.places?.AutocompleteSuggestion) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ['us'],
      });

      setSuggestions(
        response.suggestions
          .filter((s) => s.placePrediction)
          .map((s) => ({
            placeId: s.placePrediction!.placeId,
            text: s.placePrediction!.text.toString(),
          }))
      );
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (!mapsLoaded) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
      setOpen(true);
    }, 300);
  };

  const handleSelect = (text: string) => {
    onChange(text);
    setSuggestions([]);
    setOpen(false);
  };

  const showSuggestions = open && suggestions.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id="donate-address"
        type="text"
        value={value}
        onChange={handleInput}
        onBlur={onBlur}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        onKeyDown={(e) => {
          if (!showSuggestions) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
          else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelect(suggestions[activeIndex].text); }
          else if (e.key === 'Escape') { setOpen(false); }
        }}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-body placeholder:text-white/25 focus:border-accent-yellow/40 focus:bg-white/[0.06] outline-none transition-colors duration-200"
        style={{ padding: '0.75rem 1rem' }}
        autoComplete="off"
        role="combobox"
        aria-expanded={showSuggestions}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
      />
      {showSuggestions && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 left-0 right-0 border border-white/[0.08] bg-[#1a1f2e] rounded-xl overflow-hidden overflow-y-auto shadow-lg"
          style={{ marginTop: '0.25rem', maxHeight: 'min(240px, 50vh)' }}
        >
          {suggestions.map((suggestion, i) => (
            <li
              key={suggestion.placeId}
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(suggestion.text)}
              className={`text-sm font-body text-white/70 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors duration-150 ${i === activeIndex ? 'bg-white/[0.06] text-white' : ''}`}
              style={{ padding: '0.625rem 1rem' }}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-400/80 text-xs font-body" style={{ marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}
