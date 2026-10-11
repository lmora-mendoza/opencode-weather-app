import type { City, TemperatureUnit } from "./types.ts";

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
