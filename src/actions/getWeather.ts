import type { AppConfig } from "../types/Config.ts";
import { getDefaultCity } from "../types/Config.ts";
import type { City } from "../types/City.ts";
import { getTemperature } from "../api/weather.ts";
import { formatCity } from "../utils/format.ts";
import { printError, printTemperature } from "../presentation/output.ts";

export async function showDefaultWeather(config: AppConfig): Promise<void> {
  const city = getDefaultCity(config);
  if (!city) {
    printError("No hay ciudad default. Usa la opción 3 o 5.");
    return;
  }
  try {
    const temperature = await getTemperature(city, config.unit);
    printTemperature(city, temperature, config.unit);
  } catch {
    printError("No se pudo obtener el clima. Revisa tu conexión.");
  }
}

export async function showAllWeather(config: AppConfig): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3.");
    return;
  }
  const results = await Promise.allSettled(
    config.cities.map((city) => getTemperature(city, config.unit)),
  );
  results.forEach((result, index) => {
    const city = config.cities[index] as City;
    if (result.status === "fulfilled") {
      printTemperature(city, result.value, config.unit);
    } else {
      printError(`${formatCity(city)}: error`);
    }
  });
}
