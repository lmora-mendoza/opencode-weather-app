import { createInterface, type Interface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { AppConfig, City, DailyForecast, TemperatureUnit } from "./types.ts";
import { unitLabel } from "./types.ts";
import { cyan, green, red, yellow } from "./colors.ts";

const LINE = "════════════════════════════════════════";

export function printMenu(config: AppConfig): void {
  console.log(cyan(LINE));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(LINE));
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${config.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico 7 días (default)");
  console.log(`  8. Ajustes (${unitLabel(config.unit)})`);
  console.log("  9. Salir");
  console.log(cyan(LINE));
}

export function createPrompt(): Interface {
  return createInterface({ input: stdin, output: stdout });
}

export async function askOption(prompt: Interface): Promise<string> {
  return (await prompt.question("  Selecciona una opción: ")).trim();
}

export async function askText(prompt: Interface, label: string): Promise<string> {
  return (await prompt.question(label)).trim();
}

export async function pause(prompt: Interface): Promise<void> {
  await prompt.question("\n  Pulsa Enter para continuar...");
}

export function formatCity(city: City): string {
  const region = [city.admin1, city.country].filter(Boolean).join(", ");
  return region ? `${city.name} (${region})` : city.name;
}

export function printCities(cities: City[], defaultIndex: number | null): void {
  cities.forEach((city, index) => {
    const mark = index === defaultIndex ? ` ${cyan("[default]")}` : "";
    console.log(`  ${index + 1}. ${formatCity(city)}${mark}`);
  });
}

export function printTemperature(city: City, temperature: number, unit: TemperatureUnit): void {
  console.log(`  ${formatCity(city)}: ${yellow(`${temperature} ${unitLabel(unit)}`)}`);
}

export function printForecast(city: City, days: DailyForecast[], unit: TemperatureUnit): void {
  console.log(`  ${formatCity(city)}:`);
  for (const day of days) {
    console.log(`    ${day.date}: ${yellow(`${day.max} / ${day.min} ${unitLabel(unit)}`)}`);
  }
}

export function printSuccess(message: string): void {
  console.log(green(`  ${message}`));
}

export function printError(message: string): void {
  console.log(red(`  ${message}`));
}
