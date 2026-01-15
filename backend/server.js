import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // 10-minute cache

// Middleware
app.use(cors());
app.use(express.json());

const OPEN_METEO_API = 'https://api.open-meteo.com/v1';
const GEO_API = 'https://geocoding-api.open-meteo.com/v1';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'dev-admin-key';

/**
 * Authentication middleware for admin endpoints
 */
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (token !== ADMIN_API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }

  next();
};

/**
 * Helper: Compute wind chill (Celsius)
 */
const computeWindChill = (tempC, windSpeedKmh) => {
  if (tempC > 10) return null; // Wind chill only applies below 10°C
  const tempF = (tempC * 9) / 5 + 32;
  const windMph = windSpeedKmh / 1.60934;
  const wc = 35.74 + 0.6215 * tempF - 35.75 * Math.pow(windMph, 0.16) + 0.4275 * tempF * Math.pow(windMph, 0.16);
  return Math.round(((wc - 32) * 5) / 9);
};

/**
 * Helper: Compute heat index (Celsius)
 */
const computeHeatIndex = (tempC, humidity) => {
  if (tempC < 26.7 || humidity < 40) return null; // Heat index only applies above 26.7°C with humidity > 40%
  const tempF = (tempC * 9) / 5 + 32;
  const c1 = -42.379;
  const c2 = 2.04901523;
  const c3 = 10.14333127;
  const c4 = -0.22475541;
  const c5 = -0.00683783;
  const c6 = -0.05481717;
  const c7 = 0.00122874;
  const c8 = 0.00085282;
  const c9 = -0.00000199;
  
  const hi = c1 + c2 * tempF + c3 * humidity + c4 * tempF * humidity + c5 * tempF * tempF +
    c6 * humidity * humidity + c7 * tempF * tempF * humidity + c8 * tempF * humidity * humidity +
    c9 * tempF * tempF * humidity * humidity;
  
  return Math.round(((hi - 32) * 5) / 9);
};

/**
 * Helper: Normalize date to date-only (midnight)
 */
const getDateOnly = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/**
 * Helper: Get weather condition with proper WMO code ranges
 */
const getWeatherCondition = (code) => {
  if (code === 0 || code === 1) return 'Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Drizzle';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain';
  if (code === 83 || code === 84) return 'Extreme Rain';
  if (code >= 85 && code <= 86) return 'Heavy Snow';
  if (code >= 87 && code <= 94) return 'Mixed Precipitation';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Get Weather by City Name
 */
app.get('/api/weather/city/:city', async (req, res) => {
  const { city } = req.params;
  const cacheKey = `city:${city}`;

  try {
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Get coordinates from city name
    const geoRes = await axios.get(`${GEO_API}/search`, {
      params: { name: city, count: 1, language: 'en', format: 'json' }
    });

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const location = geoRes.data.results[0];
    const { latitude, longitude, name, country } = location;

    // Get weather data
    const weatherRes = await axios.get(`${OPEN_METEO_API}/forecast`, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,weather_code,humidity,wind_speed_10m,uv_index',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 16
      }
    });

    const current = weatherRes.data.current;
    const daily = weatherRes.data.daily;
    const todayDateOnly = getDateOnly(new Date());

    // Compute feels like with proper formulas
    const temp = current.temperature_2m;
    const windSpeed = current.wind_speed_10m;
    const humidity = current.humidity;
    const windChillTemp = computeWindChill(temp, windSpeed);
    const heatIndexTemp = computeHeatIndex(temp, humidity);
    const feelsLike = windChillTemp !== null ? windChillTemp : (heatIndexTemp !== null ? heatIndexTemp : Math.round(temp));

    const response = {
      city: name,
      country,
      temp: Math.round(temp),
      condition: getWeatherCondition(current.weather_code),
      conditionCode: current.weather_code,
      humidity,
      windSpeed: Math.round(windSpeed),
      uvIndex: Math.round(current.uv_index * 10) / 10,
      feelsLike,
      approximatedFields: ['feelsLike'], // Mark computed fields
      past: [],
      future: []
    };

    // Split daily forecasts into past and future (normalized dates)
    for (let i = 0; i < daily.time.length; i++) {
      const dateOnly = getDateOnly(new Date(daily.time[i]));
      const dayData = {
        date: daily.time[i],
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        conditionCode: daily.weather_code[i]
      };

      if (dateOnly < todayDateOnly) {
        response.past.push(dayData);
      } else {
        response.future.push(dayData);
      }
    }

    // Cache the response
    cache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * Get Weather by Coordinates
 */
app.get('/api/weather/coords', async (req, res) => {
  let lat = req.query.lat;
  let lon = req.query.lon;

  // Validate presence
  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  // Parse and validate
  lat = parseFloat(lat);
  lon = parseFloat(lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude: must be numeric' });
  }

  if (lat < -90 || lat > 90) {
    return res.status(400).json({ error: 'Invalid latitude: must be between -90 and 90' });
  }

  if (lon < -180 || lon > 180) {
    return res.status(400).json({ error: 'Invalid longitude: must be between -180 and 180' });
  }

  const cacheKey = `coords:${lat}:${lon}`;

  try {
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Get city name from coordinates (reverse geocode)
    const geoRes = await axios.get(`${GEO_API}/reverse`, {
      params: { latitude: lat, longitude: lon, format: 'json' }
    });

    const cityName = geoRes.data.address?.city || geoRes.data.address?.town || 'Unknown Location';

    // Get weather data
    const weatherRes = await axios.get(`${OPEN_METEO_API}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,weather_code,humidity,wind_speed_10m,uv_index',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 16
      }
    });

    const current = weatherRes.data.current;
    const daily = weatherRes.data.daily;
    const todayDateOnly = getDateOnly(new Date());

    // Compute feels like with proper formulas
    const temp = current.temperature_2m;
    const windSpeed = current.wind_speed_10m;
    const humidity = current.humidity;
    const windChillTemp = computeWindChill(temp, windSpeed);
    const heatIndexTemp = computeHeatIndex(temp, humidity);
    const feelsLike = windChillTemp !== null ? windChillTemp : (heatIndexTemp !== null ? heatIndexTemp : Math.round(temp));

    const response = {
      city: cityName,
      temp: Math.round(temp),
      condition: getWeatherCondition(current.weather_code),
      conditionCode: current.weather_code,
      humidity,
      windSpeed: Math.round(windSpeed),
      uvIndex: Math.round(current.uv_index * 10) / 10,
      feelsLike,
      approximatedFields: ['feelsLike'],
      past: [],
      future: []
    };

    // Split daily forecasts into past and future (normalized dates)
    for (let i = 0; i < daily.time.length; i++) {
      const dateOnly = getDateOnly(new Date(daily.time[i]));
      const dayData = {
        date: daily.time[i],
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        conditionCode: daily.weather_code[i]
      };

      if (dateOnly < todayDateOnly) {
        response.past.push(dayData);
      } else {
        response.future.push(dayData);
      }
    }

    cache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * Get City Suggestions
 */
app.get('/api/cities/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.json([]);
  }

  try {
    const geoRes = await axios.get(`${GEO_API}/search`, {
      params: { name: q, count: 5, language: 'en', format: 'json' }
    });

    const suggestions = (geoRes.data.results || []).map((r) => ({
      name: r.name,
      admin1: r.admin1,
      country: r.country
    }));

    res.json(suggestions);
  } catch (error) {
    console.error('Geocoding Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

/**
 * Clear Cache (ADMIN ONLY - REQUIRES AUTHENTICATION)
 * 
 * Usage:
 *   curl -X POST http://localhost:3000/api/cache/clear \
 *     -H "Authorization: Bearer YOUR_ADMIN_API_KEY"
 * 
 * Authentication required: Yes (Bearer token/API key)
 * Role required: admin
 */
app.post('/api/cache/clear', requireAdminAuth, (req, res) => {
  const remoteAddr = req.ip || req.connection.remoteAddress;
  console.log(`[AUDIT] Cache cleared by ${remoteAddr} at ${new Date().toISOString()}`);
  
  cache.flushAll();
  res.json({ message: 'Cache cleared', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌤️  Weather API Server running on http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Admin endpoints require: Authorization: Bearer ${ADMIN_API_KEY.substring(0, 10)}...`);
});
  console.log(`🌤️  Weather API Server running on http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
});
