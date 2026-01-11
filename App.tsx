
import React, { useState, useEffect, useCallback } from 'react';
import { WeatherData, GeminiInsight } from './types';
import { getWeatherData, fetchWeatherByCoords } from './services/weatherService';
import { getNatureInsight } from './services/geminiService';
import ThreeDBackground from './components/ThreeDBackground';
import WeatherUI from './components/WeatherUI';
import { Loader2, Trees, RefreshCw, Search, CloudOff } from 'lucide-react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('New York');

  const fetchFullWeather = useCallback(async (searchCity?: string, coords?: { lat: number, lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      let data: WeatherData;
      if (coords) {
        data = await fetchWeatherByCoords(coords.lat, coords.lon);
      } else {
        data = await getWeatherData(searchCity || city);
      }

      setWeather(data);
      setCity(data.city);

      // Attempt to load AI insights in the background
      getNatureInsight(data).then(setInsight).catch(() => setInsight(null));

    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || 'The connection to Earth data was interrupted.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    // Initial Sync
    const startApp = async () => {
      if ("geolocation" in navigator) {
        // We set a small timeout for the prompt to feel natural
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchFullWeather(undefined, { lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => fetchFullWeather(city), // Fallback if denied
          { timeout: 5000 }
        );
      } else {
        fetchFullWeather(city);
      }
    };
    startApp();
  }, []);

  const handleSearch = (newCity: string) => {
    fetchFullWeather(newCity);
  };

  // Initial State / Fallback (Prevent Blank Screen)
  if (!loading && !weather && !error) {
    // If for some reason we aren't loading, have no weather, and no error, 
    // show a manual entry screen.
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 text-slate-900 dark:bg-[#020617] dark:text-white p-6 transition-colors duration-500">
        <div className="max-w-lg w-full text-center space-y-8">
          <h1 className="text-6xl font-serif italic text-emerald-600 dark:text-emerald-400 transition-colors">Alex's Weather</h1>
          <p className="text-slate-500 dark:text-white/40 tracking-[0.3em] uppercase text-sm">Initiate Connection</p>

          <div className="relative group max-w-sm mx-auto w-full">
            <input
              type="text"
              placeholder="Enter habitat name..."
              className="w-full bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 py-4 px-6 outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white text-center placeholder:text-slate-400 dark:placeholder:text-white/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
              }}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={18} />
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading && !weather) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] animate-pulse rounded-full" />
          <Loader2 className="animate-spin text-emerald-400 relative z-10" size={84} strokeWidth={1} />
          <Trees className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600/40" size={32} />
        </div>
        <div className="text-center space-y-4 relative z-10">
          <h2 className="text-emerald-600 dark:text-emerald-400 font-serif italic text-4xl animate-pulse tracking-[0.1em]">Alex's Weather is Starting</h2>
          <p className="text-slate-500 dark:text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold">Synchronizing Atmospheric Layers</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error && !weather) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#050505] text-slate-900 dark:text-white p-6 transition-colors duration-500">
        <div className="max-w-lg w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 backdrop-blur-3xl text-center shadow-2xl">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-200 dark:border-red-500/20 shadow-inner">
            <CloudOff className="text-red-400" size={40} />
          </div>
          <h2 className="text-4xl font-serif italic mb-6 text-red-600 dark:text-red-100">Frequency Interrupted</h2>
          <p className="text-slate-500 dark:text-white/40 mb-10 leading-relaxed text-lg">{error}</p>

          <div className="grid gap-4">
            <button
              onClick={() => fetchFullWeather(city)}
              className="w-full bg-emerald-500 text-emerald-950 font-bold py-5 hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <RefreshCw size={20} /> Re-Establish Connection
            </button>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search a different habitat..."
                className="w-full bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 py-5 px-8 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
                }}
              />
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={20} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-emerald-500/30 bg-gray-50 dark:bg-[#020617] overflow-x-hidden transition-colors duration-500">
      {weather && (
        <>
          <ThreeDBackground weatherCode={weather.conditionCode} windSpeed={weather.windSpeed} />
          <WeatherUI
            weather={weather}
            insight={insight}
            onSearch={handleSearch}
            loading={loading}
          />
        </>
      )}

      {/* Toast Error Notification (for failed searches while data exists) */}
      {error && weather && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500/10 backdrop-blur-3xl border border-red-500/20 text-red-200 px-8 py-5 flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-sm font-semibold tracking-wide">{error}</span>
          <button onClick={() => setError(null)} className="hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
