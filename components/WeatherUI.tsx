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
    <div className="relative z-10 min-h-screen w-full text-blue-950 dark:text-blue-50 px-6 py-8 md:p-16 overflow-y-auto overflow-x-hidden selection:bg-yellow-400/40 transition-colors duration-500 font-sans">
      {/* Header / Search */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 mb-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/80 dark:bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/40 shadow-lg rounded-xl">
            <Leaf className="text-yellow-500" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter leading-none text-blue-900 dark:text-white">Alex's Weather</h1>
            <p className="text-[10px] tracking-[0.4em] uppercase text-blue-400 dark:text-blue-200/60 mt-1 font-bold">Atmospheric Intelligence</p>
          </div>
        </div>

        <div ref={searchRef} className="relative w-full md:w-[450px] group z-50">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search global coordinates..."
              className="w-full bg-white/90 dark:bg-white/5 backdrop-blur-md border border-blue-200 dark:border-white/10 rounded-2xl px-8 py-4 outline-none focus:ring-4 focus:ring-blue-400/20 transition-all placeholder:text-blue-300 dark:placeholder:text-blue-200/30 text-lg shadow-xl text-blue-900 dark:text-white"
            />
            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400 dark:text-white/40 group-hover:text-yellow-500 transition-colors">
              <Search size={24} />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-blue-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.name)}
                  className="w-full text-left px-6 py-4 hover:bg-blue-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3 border-b last:border-0 border-blue-50 dark:border-white/5 group"
                >
                  <MapPin size={16} className="text-blue-300 group-hover:text-yellow-500 transition-colors" />
                  <div>
                    <span className="font-semibold text-blue-900 dark:text-white block">{s.name}</span>
                    <span className="text-xs text-blue-400 dark:text-blue-200/50 uppercase tracking-wider font-medium">
                      {[s.admin1, s.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Current & Extended Data */}
        <div className="xl:col-span-8 flex flex-col gap-8">

          {/* Main Current Card */}
          <div className="bg-gradient-to-br from-white/60 to-white/30 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-3xl border border-white/50 dark:border-white/10 p-10 md:p-14 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 blur-[120px] rounded-full group-hover:bg-yellow-400/30 transition-all duration-1000" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-500/20 px-5 py-2 rounded-full w-fit mb-6 border border-blue-100 dark:border-blue-400/20 shadow-sm">
                  <Navigation size={14} className="text-yellow-500" />
                  <span className="text-xs uppercase tracking-widest font-bold">{weather.city}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-[7rem] md:text-[10rem] font-bold tracking-tighter leading-none text-blue-900 dark:text-white drop-shadow-sm">
                    {weather.temp}°
                  </h2>
                </div>
                <p className="text-3xl md:text-4xl text-blue-800/80 dark:text-white/80 font-medium tracking-tight mt-2">
                  {weather.condition}
                </p>
              </div>

              <div className="flex flex-col gap-6 w-full md:w-auto">
                <div className="flex flex-col gap-4">
                  <StatItem icon={<Wind size={20} />} label="Wind Flow" value={`${weather.windSpeed} km/h`} color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300" />
                  <StatItem icon={<Droplets size={20} />} label="Humidity" value={`${weather.humidity}%`} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300" />
                  <StatItem icon={<Sun size={20} />} label="UV Index" value={`${weather.uvIndex}`} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Past & Future Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Past 7 Days */}
            <section className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-200 dark:bg-white/10 rounded-full text-slate-600 dark:text-white/60">
                  <History size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-widest">History</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mask-fade-edges">
                {weather.past.map((day, i) => (
                  <ForecastCard key={i} day={day} isPast />
                ))}
              </div>
            </section>

            {/* Next 7 Days */}
            <section className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-300">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-widest">Forecast</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mask-fade-edges">
                {weather.future.map((day, i) => (
                  <ForecastCard key={i} day={day} />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: AI & Nature */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <NatureInsightCard insight={insight} loading={loading} />

          <div className="bg-white/60 dark:bg-white/[0.03] border border-white/40 dark:border-white/5 p-8 rounded-[2.5rem] mt-auto backdrop-blur-xl shadow-xl">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-white/30 font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Status
            </h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-200 dark:border-white/10 pb-4">
                <span className="text-slate-500 dark:text-white/40 font-medium">Local Time</span>
                <span className="text-blue-900 dark:text-white font-mono bg-blue-50 dark:bg-white/10 px-3 py-1 rounded-lg">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-white/40 font-medium">Active Region</span>
                <span className="text-blue-900 dark:text-white font-bold">{weather.city}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 pb-8 text-center border-t border-slate-200/50 dark:border-white/5 pt-12">
        <p className="text-slate-400 dark:text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-blue-500 transition-colors cursor-default">
          Alex's Weather • <span className="text-yellow-500">v3.0</span> • Designed for Earth
        </p>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
};

const StatItem = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="flex items-center justify-between gap-5 bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/5 backdrop-blur-sm hover:translate-x-1 transition-transform cursor-default group">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-white/40 font-bold">{label}</p>
    </div>
    <p className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">{value}</p>
  </div>
);

export default WeatherUI;
