import type { Interface } from "node:readline/promises";
import type { AppConfig, City } from "./src/types.ts";
import { getDefaultCity, unitLabel } from "./src/types.ts";
import { getTemperature, searchCities } from "./src/api.ts";
import { loadConfig, saveConfig } from "./src/storage.ts";
import {
  askOption,
  askText,
  createPrompt,
  formatCity,
  pause,
  printCities,
  printError,
  printMenu,
  printSuccess,
  printTemperature,
} from "./src/ui.ts";

async function showDefaultWeather(config: AppConfig): Promise<void> {
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

async function showAllWeather(config: AppConfig): Promise<void> {
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

async function addCity(prompt: Interface, config: AppConfig): Promise<void> {
  const query = await askText(prompt, "  Ciudad a buscar: ");
  if (!query) return;
  let found: City[];
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

async function removeCity(prompt: Interface, config: AppConfig): Promise<void> {
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

async function setDefaultCity(prompt: Interface, config: AppConfig): Promise<void> {
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

async function toggleUnit(config: AppConfig): Promise<void> {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveConfig(config);
  printSuccess(`Unidad actual: ${unitLabel(config.unit)}`);
}

async function main(): Promise<void> {
  const config = await loadConfig();
  const prompt = createPrompt();
  let running = true;

  while (running) {
    printMenu(config);
    const option = await askOption(prompt);
    console.log("");

    switch (option) {
      case "1":
        await showDefaultWeather(config);
        break;
      case "2":
        await showAllWeather(config);
        break;
      case "3":
        await addCity(prompt, config);
        break;
      case "4":
        await removeCity(prompt, config);
        break;
      case "5":
        await setDefaultCity(prompt, config);
        break;
      case "8":
        await toggleUnit(config);
        break;
      case "9":
        running = false;
        break;
      default:
        printError("Opción inválida.");
        break;
    }

    if (running) await pause(prompt);
  }

  prompt.close();
}

await main();
