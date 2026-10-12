import type { Interface } from "node:readline/promises";
import type { AppConfig } from "../types/Config.ts";
import type { City } from "../types/City.ts";
import { saveConfig } from "../storage/citiesStorage.ts";
import { askText } from "../presentation/input.ts";
import { printCities, printError, printSuccess } from "../presentation/output.ts";
import { formatCity } from "../utils/format.ts";

export async function setDefaultCity(prompt: Interface, config: AppConfig): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades. Usa la opción 3.");
    return;
  }
  printCities(config.cities, config.defaultIndex);
  const choice = await askText(prompt, "  Elige número como default (0 cancela): ");
  const index = Number(choice) - 1;
  if (choice === "0") return;
  if (!config.cities[index]) {
    printError("Selección inválida.");
    return;
  }
  config.defaultIndex = index;
  await saveConfig(config);
  printSuccess(`Default: ${formatCity(config.cities[index] as City)}`);
}
