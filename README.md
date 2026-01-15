
# �️ WHRTHR - Weather Intelligence App

A beautifully designed weather application with **Samsung-inspired animations**, **dynamic UI/UX**, **AI-powered insights**, and a modern **Express.js backend API**. Real-time weather with intelligent features and stunning visuals.

## ✨ Key Features

### Frontend
- **🎨 Samsung-Style Animations**: Smooth transitions, glassmorphism, micro-interactions
- **⚡ Dynamic UI/UX**: Gradient text, hover effects, responsive design
- **🌐 Real-time Weather**: Current conditions, 10-day forecast, past 7 days
- **🤖 AI Insights**: Google Gemini integration for weather interpretation
- **📱 Responsive Design**: Mobile-first, works on all devices
- **🌍 Geolocation**: Auto-detect location or search by city
- **3️⃣ 3D Background**: Three.js weather-based environment
- **♿ Accessibility**: WCAG contrast improvements

### Backend
- **🔄 RESTful API**: Clean, well-structured endpoints
- **💾 Response Caching**: 10-minute TTL for performance
- **🌍 Multi-source Data**: Open-Meteo + Geocoding APIs
- **📍 Reverse Geocoding**: Get city names from coordinates
- **🔍 City Search**: Autocomplete suggestions
- **🛡️ Error Handling**: Comprehensive error messages

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # Production build
```

### Backend
```bash
cd backend
npm install
npm start            # http://localhost:3000
npm run dev          # Development with auto-reload
```

## 🎬 Animation Features

- **Fade-in/Slide-in**: Page transitions with smooth timing
- **Hover Effects**: Icon scaling, background gradients
- **Pulse Animations**: Temperature display (3s duration)
- **Bounce**: Loading indicator dots
- **Gradient Glows**: Stat card hover shadows

## 🎨 Visual Enhancements

- **Glassmorphism**: Frosted glass UI with backdrop blur
- **Gradient Text**: City name with gradient coloring
- **Color Transitions**: Smooth transitions on interaction
- **Responsive Typography**: Adaptive text sizes
- **Touch-friendly**: Optimized button and input sizes

## 📊 API Endpoints

```
GET  /api/health                    # Health check
GET  /api/weather/city/:city        # Weather by city
GET  /api/weather/coords            # Weather by coordinates
GET  /api/cities/search?q=...       # City autocomplete
POST /api/cache/clear               # Clear cache
```

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Three.js** - 3D graphics
- **Lucide React** - Icons
- **Google Gemini** - AI insights

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client
- **node-cache** - In-memory caching
- **CORS** - Cross-origin support

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Type Safety

All components and services are fully typed with TypeScript:
```typescript
interface WeatherData {
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

## 🚢 Deployment

### Vercel/Netlify (Frontend)
```bash
npm run build
# Deploy dist/ folder
```

### Heroku/Railway (Backend)
```bash
git push heroku main
# or use platform CLI
```

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Backend README](./backend/README.md) - Backend API documentation

## 🐛 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Backend connection issues?**
- Ensure backend is running on port 3000
- Check CORS is enabled
- Verify API endpoints are reachable

## 📈 Performance

- **Caching**: 10-minute TTL reduces API calls
- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: Optimized assets
- **Build**: ~50KB gzipped (production)

## ♿ Accessibility

- WCAG AA contrast ratios
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where needed

## 🎯 Future Improvements

- [ ] Dark/Light mode toggle
- [ ] Historical data storage
- [ ] Weather alerts
- [ ] Social sharing
- [ ] Offline support
- [ ] PWA features
- [ ] Unit preferences (F°/C°)

## 📄 License

MIT

## 👨‍💻 Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

---

Built with ❤️ for weather enthusiasts. Inspired by Samsung's design philosophy.
