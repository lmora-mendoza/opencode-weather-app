import type { City, DailyForecast, TemperatureUnit } from "./types.ts";

interface GeocodingResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  current?: { temperature_2m?: number };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export async function searchCities(query: string): Promise<City[]> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(query)}&count=5&language=es&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geocoding HTTP ${response.status}`);
  const data = (await response.json()) as GeocodingResponse;
  if (!data.results) return [];
  return data.results.map((item) => ({
    name: item.name,
    country: item.country ?? "",
    admin1: item.admin1 ?? "",
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}

export async function getTemperature(
  city: City,
  unit: TemperatureUnit,
): Promise<number> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=temperature_2m&temperature_unit=${unit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast HTTP ${response.status}`);
  const data = (await response.json()) as ForecastResponse;
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number") throw new Error("Sin temperatura");
  return temperature;
}

export async function getDailyForecast(
  city: City,
  unit: TemperatureUnit,
): Promise<DailyForecast[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7&temperature_unit=${unit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast HTTP ${response.status}`);
  const data = (await response.json()) as ForecastResponse;
  const dates = data.daily?.time;
  const maxValues = data.daily?.temperature_2m_max;
  const minValues = data.daily?.temperature_2m_min;
  if (!dates || !maxValues || !minValues) throw new Error("Sin pronóstico");
  return dates.map((date, index) => {
    const max = maxValues[index];
    const min = minValues[index];
    if (typeof max !== "number" || typeof min !== "number") {
      throw new Error("Sin pronóstico");
    }
    return { date, max, min };
  });
}
