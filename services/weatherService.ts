
import { WeatherData, DayData } from '../types';

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export const getWeatherData = async (city: string): Promise<WeatherData> => {
  const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!geoRes.ok) throw new Error("Geocoding service unavailable");
  
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Habitat "${city}" not found in our records.`);
  }
  
  const { latitude, longitude, name } = geoData.results[0];
  return fetchWeatherByCoords(latitude, longitude, name);
};

export const fetchWeatherByCoords = async (lat: number, lon: number, name: string = "Current Location"): Promise<WeatherData> => {
  const weatherRes = await fetch(
    `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&past_days=7&forecast_days=8`
  );
  
  if (!weatherRes.ok) throw new Error("Atmospheric data stream interrupted");
  
  const data = await weatherRes.json();

  const allDaily: DayData[] = data.daily.time.map((time: string, i: number) => ({
    date: time,
    maxTemp: Math.round(data.daily.temperature_2m_max[i]),
    minTemp: Math.round(data.daily.temperature_2m_min[i]),
    conditionCode: data.daily.weather_code[i]
  }));

  return {
    city: name,
    temp: Math.round(data.current.temperature_2m),
    condition: getWeatherCondition(data.current.weather_code),
    conditionCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    uvIndex: data.daily.uv_index_max[7] || 0,
    past: allDaily.slice(0, 7),
    future: allDaily.slice(8, 15)
  };
};

export const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Pure Sunlight";
  if (code <= 3) return "Drifting Clouds";
  if (code <= 48) return "Ethereal Mist";
  if (code <= 57) return "Gentle Drizzle";
  if (code <= 67) return "Steady Rainfall";
  if (code <= 77) return "Silent Snowfall";
  if (code <= 82) return "Passing Showers";
  if (code <= 99) return "Electric Storm";
  return "Nature's Mystery";
};
