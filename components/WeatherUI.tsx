import React, { useState, useEffect, useRef } from 'react';
import { WeatherData, GeminiInsight } from '../types';
import { Search, Wind, Droplets, Sun, Eye, Navigation, History, TrendingUp, MapPin, RefreshCw } from 'lucide-react';
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

  const visibilityStr = weather.visibility != null ? `${weather.visibility} km` : '—';
  const firstDay = weather.future && weather.future.length > 0 ? weather.future[0] : undefined;
  const highStr = firstDay ? `${firstDay.maxTemp}°` : '—';
  const lowStr = firstDay ? `${firstDay.minTemp}°` : '—';
  
  // Compute feels like temperature using proper formulas if available
  let feelsLike = weather.temp;
  if (weather.feelsLike !== undefined && weather.feelsLike !== null) {
    feelsLike = weather.feelsLike;
  } else if (weather.temp && weather.windSpeed !== undefined) {
    // Wind chill formula for cold temps, heat index for warm temps
    if (weather.temp < 10) {
      feelsLike = Math.round(weather.temp - (weather.windSpeed * 0.2));
    } else if (weather.temp > 26 && weather.humidity) {
      feelsLike = Math.round(weather.temp + (weather.humidity * 0.1));
    }
  }

  return (
    <div className="relative z-10 min-h-screen text-gray-900 dark:text-white px-4 sm:px-6 py-6 md:py-8 lg:p-12 overflow-y-auto">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 md:mb-16">
        <div ref={searchRef} className="relative w-full max-w-md mx-auto mb-12">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-apple-lg z-50">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.name)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {[s.admin1, s.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Temp Display */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white">
            {weather.city}
          </h1>
          <div className="space-y-2">
            <div className="text-8xl md:text-9xl font-thin leading-none text-gray-900 dark:text-white">
              {weather.temp}°
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 capitalize">
              {weather.condition}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Feels like {feelsLike}°
            </p>
          </div>

          {/* High/Low */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-tight font-medium">H</p>
              <p className="text-xl font-medium text-gray-900 dark:text-white">{highStr}</p>
            </div>
            <div className="w-px bg-gray-200 dark:bg-gray-800"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-tight font-medium">L</p>
              <p className="text-xl font-medium text-gray-900 dark:text-white">{lowStr}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8 md:space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatCard icon={<Wind className="w-5 h-5" />} label="Wind" value={`${weather.windSpeed} km/h`} />
          <StatCard icon={<Droplets className="w-5 h-5" />} label="Humidity" value={`${weather.humidity}%`} />
          <StatCard icon={<Sun className="w-5 h-5" />} label="UV" value={weather.uvIndex.toFixed(1)} />
          <StatCard icon={<Eye className="w-5 h-5" />} label="Visibility" value={visibilityStr} />
        </div>

        {/* Forecast Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Past */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-gray-600 dark:text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Past</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weather.past.map((day, i) => (
                <ForecastCard key={i} day={day} isPast />
              ))}
            </div>
          </section>

          {/* Future */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Forecast</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weather.future.map((day, i) => (
                <ForecastCard key={i} day={day} />
              ))}
            </div>
          </section>
        </div>

        {/* AI Insight */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <NatureInsightCard insight={insight} loading={loading} />
        </div>
      </main>

      <footer className="mt-12 pb-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-600 tracking-wider uppercase font-medium">
          Weather Data • Real-time Updates
        </p>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
    <div className="flex items-start gap-2 mb-3">
      <span className="w-5 h-5 text-gray-600 dark:text-gray-500">{icon}</span>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-tight">{label}</p>
    </div>
    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default WeatherUI;
