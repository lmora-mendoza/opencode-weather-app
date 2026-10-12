export type TemperatureUnit = "celsius" | "fahrenheit";

export interface City {
  name: string;
  country: string;
  admin1: string;
  latitude: number;
  longitude: number;
}

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
}

export interface AppConfig {
  cities: City[];
  defaultIndex: number | null;
  unit: TemperatureUnit;
}

export function createDefaultConfig(): AppConfig {
  return { cities: [], defaultIndex: null, unit: "celsius" };
}

export function getDefaultCity(config: AppConfig): City | null {
  if (config.defaultIndex === null) return null;
  const city = config.cities[config.defaultIndex];
  return city ?? null;
}

export function unitLabel(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}
