
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

  const fetchFullWeather = useCallback(async (searchCity?: string, coords?: {lat: number, lon: number}) => {
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

  // Loading Screen
  if (loading && !weather) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] animate-pulse rounded-full" />
          <Loader2 className="animate-spin text-emerald-400 relative z-10" size={84} strokeWidth={1} />
          <Trees className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600/40" size={32} />
        </div>
        <div className="text-center space-y-4 relative z-10">
          <h2 className="text-emerald-400 font-serif italic text-4xl animate-pulse tracking-[0.1em]">Gaia is Awakening</h2>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold">Synchronizing Atmospheric Layers</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error && !weather) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505] text-white p-6">
        <div className="max-w-lg w-full bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl text-center shadow-2xl">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-inner">
            <CloudOff className="text-red-400" size={40} />
          </div>
          <h2 className="text-4xl font-serif italic mb-6 text-red-100">Frequency Interrupted</h2>
          <p className="text-white/40 mb-10 leading-relaxed text-lg">{error}</p>
          
          <div className="grid gap-4">
            <button 
              onClick={() => fetchFullWeather(city)}
              className="w-full bg-emerald-500 text-emerald-950 font-bold py-5 rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <RefreshCw size={20} /> Re-Establish Connection
            </button>
            <div className="relative group">
               <input 
                type="text" 
                placeholder="Search a different habitat..." 
                className="w-full bg-white/5 border border-white/10 py-5 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-white/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
                }}
               />
               <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-emerald-500/30 bg-[#020617] overflow-x-hidden">
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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500/10 backdrop-blur-3xl border border-red-500/20 text-red-200 px-8 py-5 rounded-3xl flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-sm font-semibold tracking-wide">{error}</span>
          <button onClick={() => setError(null)} className="hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
