import type { AppConfig } from "../types/Config.ts";
import { printCities, printError } from "../presentation/output.ts";

export function listCities(config: AppConfig): void {
  if (config.cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3.");
    return;
  }
  printCities(config.cities, config.defaultIndex);
}
