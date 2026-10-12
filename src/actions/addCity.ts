import type { Interface } from "node:readline/promises";
import type { AppConfig } from "../types/Config.ts";
import { searchCities } from "../api/geocoding.ts";
import { saveConfig } from "../storage/citiesStorage.ts";
import { askText } from "../presentation/input.ts";
import { printCities, printError, printSuccess } from "../presentation/output.ts";
import { formatCity } from "../utils/format.ts";

export async function addCity(prompt: Interface, config: AppConfig): Promise<void> {
  const query = await askText(prompt, "  Ciudad a buscar: ");
  if (!query) return;
  let found;
  try {
    found = await searchCities(query);
  } catch {
    printError("Error de red buscando la ciudad.");
    return;
  }
  if (found.length === 0) {
    printError("Sin resultados.");
    return;
  }
  printCities(found, null);
  const choice = await askText(prompt, "  Elige número (0 cancela): ");
  const selected = Number(choice) - 1;
  if (!Number.isInteger(selected + 1) || choice === "0") return;
  const city = found[selected];
  if (!city) {
    printError("Selección inválida.");
    return;
  }
  config.cities.push(city);
  if (config.defaultIndex === null) config.defaultIndex = 0;
  await saveConfig(config);
  printSuccess(`Agregada: ${formatCity(city)}`);
}
