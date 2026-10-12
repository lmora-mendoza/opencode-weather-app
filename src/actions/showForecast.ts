import type { AppConfig } from "../types/Config.ts";
import { getDefaultCity } from "../types/Config.ts";
import { getDailyForecast } from "../api/weather.ts";
import { printError, printForecast } from "../presentation/output.ts";

export async function showForecast(config: AppConfig): Promise<void> {
  const city = getDefaultCity(config);
  if (!city) {
    printError("No hay ciudad default. Usa la opción 3 o 5.");
    return;
  }
  try {
    const days = await getDailyForecast(city, config.unit);
    printForecast(city, days, config.unit);
  } catch {
    printError("No se pudo obtener el pronóstico. Revisa tu conexión.");
  }
}
