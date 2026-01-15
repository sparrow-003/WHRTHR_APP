# WHRTHR App - Complete Setup & Deployment Guide

A modern, Samsung-inspired weather application with AI-powered insights, dynamic UI/UX, and a backend API.

## 📁 Project Structure

```
WHRTHR_APP/
├── frontend/              # React/Vite frontend
│   ├── components/        # UI Components (WeatherUI, ForecastCard, etc.)
│   ├── services/          # API services (weatherService, geminiService)
│   ├── App.tsx            # Main App component
│   ├── index.tsx          # Entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── backend/               # Node.js/Express API
│   ├── server.js          # Main backend server
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment template
│   └── README.md          # Backend documentation
├── index.html             # HTML entry point
├── types.ts               # TypeScript type definitions
└── README.md              # Project overview
```

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend runs on: `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start server
npm start

# Development with auto-reload
npm run dev
```

Backend API runs on: `http://localhost:3000`

## 📊 Features

### Frontend
- ✨ **Samsung-Style Animations**: Smooth transitions, glassmorphism, micro-interactions
- 🎨 **Modern UI/UX**: Gradient backgrounds, responsive design, dark theme
- 📱 **Responsive**: Mobile-first design, works on all devices
- 🌐 **Real-time Weather**: Current conditions, 10-day forecast
- 🤖 **AI Insights**: Gemini API integration for weather interpretation
- 🌍 **Geolocation**: Auto-detect location or search by city
- ♿ **Accessibility**: WCAG contrast improvements, semantic HTML

### Backend
- 🔄 **RESTful API**: Well-structured endpoints
- 💾 **Response Caching**: 10-minute TTL for improved performance
- 🌍 **Multi-source Data**: Open-Meteo (weather) + Geocoding API
- 📍 **Reverse Geocoding**: Get city names from coordinates
- 🔍 **City Search**: Autocomplete suggestions
- 🛡️ **Error Handling**: Comprehensive error messages
- 📊 **Data Validation**: Safe type checking

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{ "status": "ok", "timestamp": "2026-01-15T..." }
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

### City Search
```
GET /api/cities/search?q=New
```

### Clear Cache
```
POST /api/cache/clear
```

## 📦 Data Response Format

```typescript
{
  city: string;
  temp: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility?: number;
  pressure?: number;
  feelsLike?: number;
  past: DayData[];
  future: DayData[];
}
```

## 🎨 UI/UX Improvements

### Animation Enhancements
- **Fade-in/Slide-in**: Page transitions with smooth timing
- **Hover Effects**: Icon scaling, background gradients on interaction
- **Pulse Animations**: Temperature pulse effect (3s duration)
- **Bounce**: Loading indicator dots
- **Gradient Glows**: Glow effects on stat cards

### Visual Polish
- **Glassmorphism**: Frosted glass effect with backdropBlur
- **Gradient Text**: City name gradient text
- **Gradient Backgrounds**: Stat card hover overlays
- **Color Transitions**: Smooth color shifts on interaction
- **Border Glow**: Box shadows on hover

### Responsive Design
- Mobile-first approach
- Responsive text sizes (text-4xl → text-5xl on larger screens)
- Adaptive grid (2 cols → 4 cols on medium screens)
- Touch-friendly button sizes

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Three.js & react-three-fiber**: 3D background
- **Lucide React**: Icons
- **Google Gemini API**: AI insights

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Axios**: HTTP client
- **node-cache**: In-memory caching
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment management

## 🔐 Environment Variables

### Frontend
No special env vars needed (uses CDN for Tailwind)

### Backend
Create `.env` file in `backend/` folder:
```
PORT=3000
NODE_ENV=development
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Push to git
git push heroku main

# Or use platform CLI
```

### Docker Deployment
```dockerfile
# Frontend
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]

# Backend
FROM node:18
WORKDIR /app
COPY backend/ .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Type Definitions

```typescript
// WeatherData
{
  city: string;
  temp: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility?: number;
  pressure?: number;
  feelsLike?: number;
  dewPoint?: number;
  past: DayData[];
  future: DayData[];
}

// DayData
{
  date: string;
  maxTemp: number;
  minTemp: number;
  conditionCode: number;
}

// GeminiInsight
{
  natureDescription: string;
  tips: string[];
}
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Backend Connection Issues
- Ensure backend is running: `cd backend && npm start`
- Check port 3000 is available
- Verify CORS is enabled
- Check network connectivity to APIs

### API Rate Limits
- Open-Meteo: 10,000 requests/day (free)
- Geocoding API: Unlimited
- Response caching helps reduce API calls

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)
- [Express.js Docs](https://expressjs.com)
- [Open-Meteo API](https://open-meteo.com)
- [Gemini API](https://ai.google.dev)

## 📄 License

MIT

## 👨‍💻 Development

### Running Both Frontend & Backend

**Terminal 1 (Frontend):**
```bash
npm run dev
# Frontend: http://localhost:5173
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
# Backend: http://localhost:3000
```

### Code Quality
- TypeScript enabled throughout
- Tailwind CSS for styling
- Component-based architecture
- Responsive mobile-first design

---

Built with ❤️ for weather enthusiasts
