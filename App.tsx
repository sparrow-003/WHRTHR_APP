import React, { useState, useEffect, useCallback } from 'react';
import { WeatherData, GeminiInsight } from './types';
import { getWeatherData, fetchWeatherByCoords } from './services/weatherService';
import { getNatureInsight } from './services/geminiService';
import ThreeDBackground from './components/ThreeDBackground';
import WeatherUI from './components/WeatherUI';
import { Loader2, RefreshCw, Search, CloudOff } from 'lucide-react';

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

      getNatureInsight(data).then(setInsight).catch(() => setInsight(null));

    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || 'The connection to Earth data was interrupted.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    const startApp = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchFullWeather(undefined, { lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => fetchFullWeather(city),
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

  if (!loading && !weather && !error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="max-w-md w-full space-y-8 animate-in fade-in duration-1000">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight">Weather</h1>
            <p className="text-zinc-400 font-medium">Enter a city to get started</p>
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="Search City"
              className="w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center text-lg placeholder:text-zinc-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
              }}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
          </div>
        </div>
      </div>
    );
  }

  if (loading && !weather) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-zinc-400 font-medium animate-pulse uppercase tracking-widest text-xs">Updating...</p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="max-w-md w-full glass-dark p-10 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 flex items-center justify-center mx-auto rounded-full">
            <CloudOff className="text-red-500" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Location Unreachable</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => fetchFullWeather(city)}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              Try Again
            </button>
            <input
              type="text"
              placeholder="Search another city"
              className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 text-center text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      {weather && (
        <div className="animate-in fade-in duration-1000">
          <ThreeDBackground weatherCode={weather.conditionCode} windSpeed={weather.windSpeed} />
          <WeatherUI
            weather={weather}
            insight={insight}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>
      )}

      {error && weather && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass-dark px-6 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-500">
          <span className="text-sm font-medium text-zinc-300">{error}</span>
          <button onClick={() => setError(null)} className="text-zinc-500 hover:text-white">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
