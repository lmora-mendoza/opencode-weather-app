import type { City } from "../types/City.ts";
import type { TemperatureUnit } from "../types/Weather.ts";

export function formatCity(city: City): string {
  const region = [city.admin1, city.country].filter(Boolean).join(", ");
  return region ? `${city.name} (${region})` : city.name;
}

export function unitLabel(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}
