
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
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-50 text-blue-950 dark:bg-[#020617] dark:text-blue-50 p-6 transition-colors duration-500">
        <div className="max-w-lg w-full text-center space-y-8">
          <h1 className="text-6xl font-bold tracking-tighter text-blue-900 dark:text-white">Alex's Weather</h1>
          <p className="text-blue-400 dark:text-blue-200/50 tracking-[0.3em] uppercase text-sm font-bold">System Online</p>

          <div className="relative group max-w-sm mx-auto w-full">
            <input
              type="text"
              placeholder="Enter habitat name..."
              className="w-full bg-white border border-blue-200 dark:bg-white/5 dark:border-white/10 py-4 px-6 outline-none focus:ring-4 focus:ring-blue-400/20 rounded-xl transition-all text-blue-900 dark:text-white text-center placeholder:text-blue-300 dark:placeholder:text-white/20 shadow-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
              }}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 dark:text-white/20" size={18} />
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading && !weather) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-50 dark:bg-[#020617] text-blue-900 dark:text-white transition-colors duration-500">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse rounded-full" />
          <Loader2 className="animate-spin text-blue-500 relative z-10" size={84} strokeWidth={1.5} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-4 relative z-10">
          <h2 className="text-blue-900 dark:text-white font-bold text-4xl animate-pulse tracking-tight">Initializing</h2>
          <p className="text-blue-400 dark:text-blue-200/40 text-[10px] uppercase tracking-[0.5em] font-bold">Syncing Atmospheric Data</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error && !weather) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-50 dark:bg-[#0f0505] text-slate-900 dark:text-white p-6 transition-colors duration-500">
        <div className="max-w-lg w-full bg-white dark:bg-white/5 border border-red-100 dark:border-red-500/10 p-12 backdrop-blur-3xl text-center shadow-2xl rounded-3xl">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-100 dark:border-red-500/20 rounded-full">
            <CloudOff className="text-red-400" size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-red-900 dark:text-red-100">Connection Failed</h2>
          <p className="text-red-400 dark:text-red-200/50 mb-10 leading-relaxed">{error}</p>

          <div className="grid gap-4">
            <button
              onClick={() => fetchFullWeather(city)}
              className="w-full bg-red-500 text-white font-bold py-4 hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-lg rounded-xl"
            >
              <RefreshCw size={20} /> Retry Connection
            </button>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search a different habitat..."
                className="w-full bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 py-4 px-8 outline-none focus:ring-2 focus:ring-red-500/30 rounded-xl transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20"
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
