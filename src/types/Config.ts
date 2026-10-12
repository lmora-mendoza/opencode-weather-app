import type { City } from "./City.ts";
import type { TemperatureUnit } from "./Weather.ts";

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
  return config.cities[config.defaultIndex] ?? null;
}
