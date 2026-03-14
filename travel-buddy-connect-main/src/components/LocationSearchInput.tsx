import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type LocationValue = {
  name: string;
  lat: number;
  lng: number;
  fullAddress: string;
};

type PhotonFeature = {
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
  };
};

interface Props {
  label: string;
  placeholder?: string;
  value: LocationValue | null;
  onChange: (val: LocationValue | null) => void;
}

const LocationSearchInput = ({
  label,
  placeholder,
  value,
  onChange,
}: Props) => {
  // ✅ show only NAME in input
  const [query, setQuery] = useState(value?.name || "");

  const [suggestions, setSuggestions] = useState<LocationValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ prevent dropdown reopening after select
  const isSelectingRef = useRef(false);

  // close dropdown when click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // if value changes from parent
  useEffect(() => {
    setQuery(value?.name || "");
  }, [value]);

  // Photon API fetch with debounce
  useEffect(() => {
    // ✅ if user just selected, don't fetch again
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`
        );

        const features: PhotonFeature[] = res.data?.features || [];

        const formatted: LocationValue[] = features.map((f) => {
          const lng = f.geometry.coordinates[0];
          const lat = f.geometry.coordinates[1];

          const p = f.properties;

          // ✅ better name
          const name =
            [p.name, p.city, p.state].filter(Boolean).join(", ") ||
            "Unknown place";

          const fullAddress = [
            p.street,
            p.city,
            p.state,
            p.postcode,
            p.country,
          ]
            .filter(Boolean)
            .join(", ");

          return {
            name,
            lat,
            lng,
            fullAddress: fullAddress || name,
          };
        });

        setSuggestions(formatted);
        setOpen(true);
      } catch (err) {
        console.error("Photon API error:", err);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (item: LocationValue) => {
    // ✅ prevent re-fetch after select
    isSelectingRef.current = true;

    onChange(item);

    // ✅ show only NAME
    setQuery(item.name);

    // ✅ close dropdown
    setOpen(false);

    // ✅ clear list
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
        />

        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 w-full bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
          >
            {suggestions.map((s, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-3 hover:bg-secondary transition flex flex-col"
              >
                <span className="font-semibold text-foreground">{s.name}</span>
                <span className="text-xs text-muted-foreground">
                  {s.fullAddress}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearchInput;
