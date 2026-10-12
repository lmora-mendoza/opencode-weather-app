import type { City } from "../types/City.ts";
import type { DailyForecast, TemperatureUnit } from "../types/Weather.ts";
import { FORECAST_BASE_URL, FORECAST_DAYS } from "../utils/constants.ts";

interface ForecastResponse {
  current?: { temperature_2m?: number };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export async function getTemperature(city: City, unit: TemperatureUnit): Promise<number> {
  const url =
    `${FORECAST_BASE_URL}` +
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
    `${FORECAST_BASE_URL}` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=${FORECAST_DAYS}&temperature_unit=${unit}`;
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
