import React, { useState, useEffect, useRef } from 'react';
import { WeatherData, GeminiInsight } from '../types';
import {
  Search,
  Wind,
  Droplets,
  Sun,
  Leaf,
  Navigation,
  History,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ForecastCard } from './ForecastCard';
import { NatureInsightCard } from './NatureInsightCard';
import { fetchCitySuggestions } from '../services/weatherService';

interface Props {
  weather: WeatherData;
  insight: GeminiInsight | null;
  onSearch: (city: string) => void;
  loading: boolean;
}

const WeatherUI: React.FC<Props> = ({ weather, insight, onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; admin1?: string; country?: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        const results = await fetchCitySuggestions(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    onSearch(city);
    setShowSuggestions(false);
  };

  return (
    <div className="relative z-10 min-h-screen w-full text-white px-4 sm:px-6 py-6 md:py-12 lg:p-20 overflow-y-auto overflow-x-hidden transition-all duration-500 font-sans">
      {/* Header / Search */}
      <header className="max-w-4xl mx-auto mb-16 lg:mb-24 flex flex-col items-center">
        <div ref={searchRef} className="relative w-full max-w-md group z-50">
          <form onSubmit={handleSubmit} className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city"
              className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 px-6 py-3 rounded-full outline-none focus:bg-white/20 transition-all placeholder:text-white/40 text-center text-lg"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              <Search size={18} />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 glass-dark rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 z-50 border border-white/10">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.name)}
                  className="w-full text-left px-6 py-4 hover:bg-white/10 transition-colors flex items-center gap-4 border-b border-white/5 last:border-0"
                >
                  <MapPin size={16} className="text-white/40" />
                  <div>
                    <span className="font-semibold text-white block">{s.name}</span>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {[s.admin1, s.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-20 text-center space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{weather.city}</h1>
          <div className="flex flex-col items-center">
            <span className="text-[10rem] font-light leading-none tracking-tighter">
              {weather.temp}°
            </span>
            <span className="text-2xl font-medium text-white/70 capitalize mt-2">
              {weather.condition}
            </span>
            <div className="flex gap-3 text-lg font-medium text-white/60 mt-2">
              <span>H:{weather.future[0]?.maxTemp}°</span>
              <span>L:{weather.future[0]?.minTemp}°</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem icon={<Wind size={20} />} label="WIND" value={`${weather.windSpeed} km/h`} />
          <StatItem icon={<Droplets size={20} />} label="HUMIDITY" value={`${weather.humidity}%`} />
          <StatItem icon={<Sun size={20} />} label="UV INDEX" value={weather.uvIndex.toString()} />
          <StatItem icon={<Navigation size={20} />} label="VISIBILITY" value="10 km" />
        </div>

        {/* Forecast Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* History */}
          <section className="glass-dark p-6 rounded-[2.5rem] border border-white/10">
            <div className="flex items-center gap-2 mb-6 text-white/40 px-2">
              <History size={14} />
              <h3 className="text-xs font-bold uppercase tracking-widest">History</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {weather.past.map((day, i) => (
                <ForecastCard key={i} day={day} isPast />
              ))}
            </div>
          </section>

          {/* Forecast */}
          <section className="glass-dark p-6 rounded-[2.5rem] border border-white/10">
            <div className="flex items-center gap-2 mb-6 text-white/40 px-2">
              <TrendingUp size={14} />
              <h3 className="text-xs font-bold uppercase tracking-widest">10-Day Forecast</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {weather.future.map((day, i) => (
                <ForecastCard key={i} day={day} />
              ))}
            </div>
          </section>
        </div>

        {/* AI Insight */}
        <NatureInsightCard insight={insight} loading={loading} />

        {/* Bottom Stats */}
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-2 mb-8 text-white/20">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Atmospheric Data Active</h4>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Local Time</span>
              <p className="text-xl font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Coordinates</span>
              <p className="text-xl font-medium">Auto-synced</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 pb-12 text-center">
        <p className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">
          Weather Data • Precise to Region
        </p>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="glass-dark p-5 rounded-[2rem] border border-white/10 flex flex-col justify-between h-40 group hover:bg-white/5 transition-all">
    <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-medium tracking-tight">{value}</p>
      {label === "UV INDEX" && (
        <div className="w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 rounded-full mt-2" />
      )}
    </div>
  </div>
);

export default WeatherUI;
