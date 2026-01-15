import React, { useState, useEffect, useCallback } from 'react';
import { WeatherData, GeminiInsight } from './types';
import { getWeatherData, fetchWeatherByCoords } from './services/weatherService';
import { getNatureInsight } from './services/geminiService';
import ThreeDBackground from './components/ThreeDBackground';
import WeatherUI from './components/WeatherUI';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('San Francisco');

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
      setError(err.message || 'Unable to fetch weather data.');
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

  const handleRefresh = () => {
    fetchFullWeather(city);
  };

  // Empty state
  if (!loading && !weather && !error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-8 text-center">
          <div className="space-y-3">
            <div className="text-6xl font-thin tracking-tight text-gray-900 dark:text-white">
              Weather
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Enter a city to get started
            </p>
          </div>
          <input
            type="text"
            placeholder="Search City"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
            }}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 mx-auto">
            <div className="w-full h-full rounded-full border-2 border-gray-200 dark:border-gray-800 border-t-blue-500 dark:border-t-blue-500 animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Loading Weather
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-600">
              Please wait
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !weather) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Unable to Load
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => fetchFullWeather(city)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <input
              type="text"
              placeholder="Try another city"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600"
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
    <div className="relative min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
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

      {error && weather && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-3 shadow-apple-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
