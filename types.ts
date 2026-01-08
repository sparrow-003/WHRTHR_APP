
export interface DayData {
  date: string;
  maxTemp: number;
  minTemp: number;
  conditionCode: number;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  past: DayData[];
  future: DayData[];
}

export enum WeatherType {
  CLEAR = 'clear',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  STORM = 'storm'
}

export interface GeminiInsight {
  natureDescription: string;
  tips: string[];
}
