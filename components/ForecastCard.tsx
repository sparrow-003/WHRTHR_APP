import React from 'react';
import { DayData } from '../types';
import { Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

interface Props {
  day: DayData;
  isPast?: boolean;
}

const WeatherIcon = ({ code }: { code: number }) => {
  if (code === 0) return <Sun size={22} className="text-yellow-400" />;
  if (code <= 3) return <Cloud size={22} className="text-zinc-400" />;
  if (code <= 67) return <CloudRain size={22} className="text-blue-400" />;
  if (code <= 77) return <CloudSnow size={22} className="text-white" />;
  if (code <= 99) return <Zap size={22} className="text-yellow-500" />;
  return <Cloud size={22} className="text-zinc-400" />;
};

export const ForecastCard: React.FC<Props> = ({ day, isPast }) => {
  const dateObj = new Date(day.date);
  const label = isPast 
    ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  
  const isToday = new Date().toDateString() === dateObj.toDateString();

  return (
    <div className={`flex flex-col items-center gap-4 min-w-[60px] py-2 transition-all hover:scale-110 ${isPast ? 'opacity-40' : ''}`}>
      <span className="text-sm font-bold tracking-tight">
        {isToday ? 'Today' : label}
      </span>
      <div className="h-10 flex items-center justify-center">
        <WeatherIcon code={day.conditionCode} />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold">{day.maxTemp}°</span>
        <span className="text-sm font-medium text-white/30">{day.minTemp}°</span>
      </div>
    </div>
  );
};
