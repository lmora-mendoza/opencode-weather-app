import type { Interface } from "node:readline/promises";
import type { AppConfig } from "../types/Config.ts";
import { saveConfig } from "../storage/citiesStorage.ts";
import { askText } from "../presentation/input.ts";
import { printCities, printError, printSuccess } from "../presentation/output.ts";
import { formatCity } from "../utils/format.ts";

export async function removeCity(prompt: Interface, config: AppConfig): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades para eliminar.");
    return;
  }
  printCities(config.cities, config.defaultIndex);
  const choice = await askText(prompt, "  Elige número a eliminar (0 cancela): ");
  const index = Number(choice) - 1;
  if (choice === "0") return;
  const city = config.cities[index];
  if (!city) {
    printError("Selección inválida.");
    return;
  }
  config.cities.splice(index, 1);
  if (config.cities.length === 0) {
    config.defaultIndex = null;
  } else if (config.defaultIndex !== null) {
    if (config.defaultIndex === index) config.defaultIndex = 0;
    else if (config.defaultIndex > index) config.defaultIndex -= 1;
  }
  await saveConfig(config);
  printSuccess(`Eliminada: ${formatCity(city)}`);
}
