
import { WeatherData, DayData } from '../types';

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export const getWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!geoRes.ok) throw new Error(`Geocoding service unavailable: ${geoRes.statusText}`);

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Habitat "${city}" not found in our records.`);
    }

    const { latitude, longitude, name } = geoData.results[0];
    return fetchWeatherByCoords(latitude, longitude, name);
  } catch (error) {
    console.error("Weather Service Error:", error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number, name: string = "Current Location"): Promise<WeatherData> => {
  try {
    const weatherRes = await fetch(
      `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&past_days=7&forecast_days=8`
    );

    if (!weatherRes.ok) throw new Error(`Atmospheric data stream interrupted: ${weatherRes.statusText}`);

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
      uvIndex: data.daily.uv_index_max[7] || 0, // Current day usually index 7 if past_days=7 (0-6 are past, 7 is today)
      past: allDaily.slice(0, 7),
      future: allDaily.slice(8, 15)
    };
  } catch (error) {
    console.error("Forecast Retrieval Error:", error);
    throw error;
  }
};

export const getWeatherCondition = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "Pure Sunlight";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast Clouds";
  if (code === 45 || code === 48) return "Ethereal Mist";
  if (code >= 51 && code <= 55) return "Gentle Drizzle";
  if (code >= 56 && code <= 57) return "Freezing Drizzle";
  if (code >= 61 && code <= 65) return "Rain showers";
  if (code >= 66 && code <= 67) return "Freezing Rain";
  if (code >= 71 && code <= 77) return "Silent Snowfall";
  if (code >= 80 && code <= 82) return "Passing Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95 && code <= 99) return "Electric Storm";
  return "Nature's Mystery";
};
