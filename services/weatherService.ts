
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

    // Validate response shape
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid weather payload: missing root object');
    }
    if (!data.daily || typeof data.daily !== 'object') {
      throw new Error('Invalid weather payload: missing "daily" object');
    }
    if (!data.current || typeof data.current !== 'object') {
      throw new Error('Invalid weather payload: missing "current" object');
    }

    const daily = data.daily;
    const timeArr: string[] = Array.isArray(daily.time) ? daily.time : [];
    const tMaxArr: number[] = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
    const tMinArr: number[] = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
    const wCodeArr: number[] = Array.isArray(daily.weather_code) ? daily.weather_code : [];
    const uvArr: number[] = Array.isArray(daily.uv_index_max) ? daily.uv_index_max : [];

    // Determine safe iteration length to avoid out-of-range access
    const minDailyLen = Math.min(timeArr.length, tMaxArr.length, tMinArr.length, wCodeArr.length);

    const allDaily: DayData[] = [];
    for (let i = 0; i < minDailyLen; i++) {
      allDaily.push({
        date: timeArr[i],
        maxTemp: Number.isFinite(tMaxArr[i]) ? Math.round(tMaxArr[i]) : 0,
        minTemp: Number.isFinite(tMinArr[i]) ? Math.round(tMinArr[i]) : 0,
        conditionCode: typeof wCodeArr[i] === 'number' ? wCodeArr[i] : -1
      });
    }

    // Safe lookups for current values
    const current = data.current;
    const temp = Number.isFinite(current.temperature_2m) ? Math.round(current.temperature_2m) : 0;
    const currentCode = typeof current.weather_code === 'number' ? current.weather_code : -1;
    const humidity = Number.isFinite(current.relative_humidity_2m) ? current.relative_humidity_2m : 0;
    const windSpeed = Number.isFinite(current.wind_speed_10m) ? current.wind_speed_10m : 0;

    // uv index: when past_days=7 the current day is often at index 7; guard against out-of-range
    const uvIndex = (uvArr.length > 7 && Number.isFinite(uvArr[7])) ? uvArr[7] : (uvArr.length > 0 && Number.isFinite(uvArr[uvArr.length - 1]) ? uvArr[uvArr.length - 1] : 0);

    const pastSliceEnd = Math.min(7, allDaily.length);
    const futureStart = Math.min(8, allDaily.length);
    const futureEnd = Math.min(15, allDaily.length);

    return {
      city: name,
      temp,
      condition: getWeatherCondition(currentCode),
      conditionCode: currentCode,
      humidity,
      windSpeed,
      uvIndex,
      past: allDaily.slice(0, pastSliceEnd),
      future: allDaily.slice(futureStart, futureEnd)
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
