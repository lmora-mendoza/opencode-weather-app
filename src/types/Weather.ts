export type TemperatureUnit = "celsius" | "fahrenheit";

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
}
