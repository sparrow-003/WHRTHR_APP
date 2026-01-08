
import React from 'react';
import { DayData } from '../types';
import { Cloud, Sun, CloudRain, CloudSnow, Zap, Thermometer } from 'lucide-react';

interface Props {
  day: DayData;
  isPast?: boolean;
}

const WeatherIcon = ({ code }: { code: number }) => {
  if (code === 0) return <Sun size={18} className="text-yellow-400" />;
  if (code <= 3) return <Cloud size={18} className="text-blue-200" />;
  if (code <= 67) return <CloudRain size={18} className="text-indigo-400" />;
  if (code <= 77) return <CloudSnow size={18} className="text-white" />;
  if (code <= 99) return <Zap size={18} className="text-purple-400" />;
  return <Cloud size={18} />;
};

export const ForecastCard: React.FC<Props> = ({ day, isPast }) => {
  const dateObj = new Date(day.date);
  const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

  return (
    <div className={`min-w-[120px] flex flex-col items-center p-4 rounded-2xl border transition-all hover:scale-105 ${isPast ? 'bg-white/5 border-white/5 opacity-80' : 'bg-white/10 border-white/10 shadow-lg'}`}>
      <span className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-semibold">
        {label}
      </span>
      <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
        <WeatherIcon code={day.conditionCode} />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-white">{day.maxTemp}°</span>
        <span className="text-xs text-white/30">{day.minTemp}°</span>
      </div>
    </div>
  );
};
