
import React, { useState } from 'react';
import { WeatherData, GeminiInsight } from '../types';
import {
  Search,
  Wind,
  Droplets,
  Sun,
  Leaf,
  Navigation,
  History,
  TrendingUp
} from 'lucide-react';
import { ForecastCard } from './ForecastCard';
import { NatureInsightCard } from './NatureInsightCard';

interface Props {
  weather: WeatherData;
  insight: GeminiInsight | null;
  onSearch: (city: string) => void;
  loading: boolean;
}

const WeatherUI: React.FC<Props> = ({ weather, insight, onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="relative z-10 min-h-screen w-full text-slate-900 dark:text-white px-6 py-8 md:p-16 overflow-y-auto overflow-x-hidden selection:bg-emerald-500/40 transition-colors duration-500">
      {/* Header / Search */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 backdrop-blur-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
            <Leaf className="text-emerald-400" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-serif italic tracking-tighter leading-none text-emerald-900 dark:text-white">Alex's Weather</h1>
            <p className="text-[10px] tracking-[0.4em] uppercase text-slate-500 dark:text-white/30 mt-1 font-bold">Precision Forecasting</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full md:w-[450px] group">
          <div className="absolute inset-0 bg-emerald-500/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a different habitat..."
            className="w-full bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 px-8 py-5 outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all placeholder:text-slate-400 dark:placeholder:text-white/20 text-lg shadow-2xl relative text-slate-900 dark:text-white"
          />
          <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-emerald-400 transition-colors">
            <Search size={24} />
          </button>
        </form>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Current & Extended Data */}
        <div className="xl:col-span-8 flex flex-col gap-10">

          {/* Main Current Card */}
          <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white/20 dark:border-white/10 p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px]" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-4 py-1.5 w-fit mb-8 border border-emerald-200 dark:border-emerald-500/20 shadow-inner">
                  <Navigation size={14} className="animate-pulse" />
                  <span className="text-xs uppercase tracking-widest font-bold">{weather.city}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[8rem] md:text-[12rem] font-extrabold tracking-tighter leading-none text-slate-900 dark:text-white drop-shadow-2xl transition-colors">
                    {weather.temp}°
                  </h2>
                  <span className="text-4xl md:text-6xl font-light text-slate-400 dark:text-white/20 font-serif italic">C</span>
                </div>
                <p className="text-3xl md:text-5xl text-slate-700 dark:text-white/80 font-serif italic mt-6 tracking-tight transition-colors">
                  {weather.condition}
                </p>
              </div>

              <div className="flex flex-col gap-8 w-full md:w-auto">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                  <StatItem icon={<Wind size={18} />} label="Breeze" value={`${weather.windSpeed} km/h`} color="text-blue-300" />
                  <StatItem icon={<Droplets size={18} />} label="Mist" value={`${weather.humidity}%`} color="text-indigo-300" />
                  <StatItem icon={<Sun size={18} />} label="Radiation" value={`${weather.uvIndex} UV`} color="text-yellow-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Past 7 Days */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-4">
              <History size={20} className="text-slate-400 dark:text-white/40" />
              <h3 className="text-lg font-serif italic text-slate-600 dark:text-white/60 tracking-wide">Last 7 Days (Retrospective)</h3>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-4 mask-fade-edges">
              {weather.past.map((day, i) => (
                <ForecastCard key={i} day={day} isPast />
              ))}
            </div>
          </section>

          {/* Next 7 Days */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-4">
              <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400/60" />
              <h3 className="text-lg font-serif italic text-slate-600 dark:text-white/60 tracking-wide">Next 7 Days (Atmospheric Journey)</h3>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-4 mask-fade-edges">
              {weather.future.map((day, i) => (
                <ForecastCard key={i} day={day} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: AI & Nature */}
        <div className="xl:col-span-4 flex flex-col gap-10">
          <NatureInsightCard insight={insight} loading={loading} />

          <div className="bg-white/40 dark:bg-white/[0.02] border border-white/20 dark:border-white/5 p-8 mt-auto backdrop-blur-md">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-white/30 font-bold mb-6">Celestial Alignment</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-white/40">Timestamp</span>
                <span className="text-slate-700 dark:text-white/80 font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-white/40">Earth Region</span>
                <span className="text-slate-700 dark:text-white/80">{weather.city} Basin</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 pb-16 text-center border-t border-slate-200 dark:border-white/5 pt-12">
        <p className="text-slate-400 dark:text-white/10 text-xs font-light tracking-[0.5em] uppercase hover:text-emerald-600 dark:hover:text-emerald-500/40 transition-colors cursor-default">
          Alex's Weather Engine v2.0 • Live Data Feed • Infinite Nature
        </p>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </div>
  );
};

const StatItem = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="flex items-center gap-5 bg-white/60 dark:bg-white/5 p-6 border border-white/40 dark:border-white/5 backdrop-blur-lg hover:bg-white/80 dark:hover:bg-white/10 transition-all group min-w-[180px] shadow-sm dark:shadow-none">
    <div className={`p-3 bg-white/50 dark:bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/30 font-bold mb-1">{label}</p>
      <p className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default WeatherUI;
