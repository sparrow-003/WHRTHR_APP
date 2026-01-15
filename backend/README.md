# WHRTHR App Backend

A lightweight Express.js server providing a RESTful API for weather data and city search.

## Features

- 🌍 Weather data by city name or coordinates
- 🏙️ City search/autocomplete
- ⚡ Response caching (10-minute TTL)
- 🔄 Multiple data sources (Open-Meteo API for weather, Geocoding API for locations)
- 📍 Reverse geocoding for coordinate lookups
- ✅ Health check endpoint

## Quick Start

```bash
cd backend
npm install
npm start
```

Server will run on `http://localhost:3000`

## Available Endpoints

### Health Check
```
GET /api/health
```

### Get Weather by City
```
GET /api/weather/city/:city
```
Example: `/api/weather/city/New%20York`

### Get Weather by Coordinates
```
GET /api/weather/coords?lat=40.7128&lon=-74.0060
```

### City Search/Autocomplete
```
GET /api/cities/search?q=New
```

### Clear Cache
```
POST /api/cache/clear
```
**⚠️ AUTHENTICATION REQUIRED**: This endpoint requires Bearer token authentication.

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_API_KEY
```

**Response (Success - 200):**
```json
{
  "message": "Cache cleared",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Unauthorized: Missing authorization header"
}
```

**Response (Forbidden - 403):**
```json
{
  "error": "Forbidden: Invalid API key"
}
```

## Environment Variables

Create a `.env` file:
```
PORT=3000
NODE_ENV=development
ADMIN_API_KEY=your-super-secret-api-key
```

**Important**: Always set a strong `ADMIN_API_KEY` in production. Generate one with:
```bash
openssl rand -base64 32
```

## Data Response Format

```json
{
  "city": "New York",
  "temp": 15,
  "condition": "Clear",
  "conditionCode": 0,
  "humidity": 65,
  "windSpeed": 10,
  "uvIndex": 3,
  "visibility": 10,
  "pressure": 1013,
  "feelsLike": 12,
  "past": [...],
  "future": [...]
}
```

## Architecture

- **Express.js**: Web framework
- **axios**: HTTP client for external APIs
- **node-cache**: In-memory response caching
- **cors**: Cross-Origin Resource Sharing
- **Open-Meteo API**: Free weather data source
- **Geocoding API**: Free location lookup

## Future Improvements

- Database integration (PostgreSQL/MongoDB)
- Authentication & rate limiting
- WebSocket support for real-time updates
- Historical data storage
- Advanced caching strategies
