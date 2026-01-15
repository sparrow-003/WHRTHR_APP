import React from 'react';
import { DayData } from '../types';
import { Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

interface Props {
  day: DayData;
  isPast?: boolean;
}

const WeatherIcon = ({ code }: { code: number }) => {
  const iconProps = { size: 20, className: "text-gray-700 dark:text-gray-300" };
  if (code === 0 || code === 1) return <Sun {...iconProps} />;
  if (code <= 3) return <Cloud {...iconProps} />;
  if (code <= 67) return <CloudRain {...iconProps} />;
  if (code <= 77) return <CloudSnow {...iconProps} />;
  if (code <= 99) return <Zap {...iconProps} />;
  return <Cloud {...iconProps} />;
};

export const ForecastCard: React.FC<Props> = ({ day, isPast }) => {
  const dateObj = new Date(day.date);
  const label = isPast 
    ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  
  const isToday = new Date().toDateString() === dateObj.toDateString();

  return (
    <div className={`flex flex-col items-center gap-3 p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
      isPast 
        ? 'bg-gray-50 dark:bg-gray-950/50 opacity-60 hover:opacity-80'
        : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 border border-gray-200 dark:border-gray-800'
    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
      <span className={`text-xs font-semibold tracking-tight ${
        isToday 
          ? 'text-blue-500' 
          : 'text-gray-600 dark:text-gray-500'
      }`}>
        {isToday ? 'Today' : label}
      </span>
      <div className="h-8 flex items-center justify-center">
        <WeatherIcon code={day.conditionCode} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{day.maxTemp}°</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{day.minTemp}°</span>
      </div>
    </div>
  );
};
