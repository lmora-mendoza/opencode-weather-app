import type { TemperatureUnit } from "../types/Weather.ts";
import { loadConfig, saveConfig } from "./citiesStorage.ts";

export async function loadUnit(): Promise<TemperatureUnit> {
  const config = await loadConfig();
  return config.unit;
}

export async function saveUnit(unit: TemperatureUnit): Promise<void> {
  const config = await loadConfig();
  config.unit = unit;
  await saveConfig(config);
}

export function toggleUnitValue(unit: TemperatureUnit): TemperatureUnit {
  return unit === "celsius" ? "fahrenheit" : "celsius";
}
