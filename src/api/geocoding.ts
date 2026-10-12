import type { City } from "../types/City.ts";
import { GEOCODING_BASE_URL, SEARCH_COUNT } from "../utils/constants.ts";

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

export async function searchCities(query: string): Promise<City[]> {
  const url =
    `${GEOCODING_BASE_URL}` +
    `?name=${encodeURIComponent(query)}&count=${SEARCH_COUNT}&language=es&format=json`;
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
