import type { City } from "../types/City.ts";
import type { DailyForecast } from "../types/Weather.ts";
import type { TemperatureUnit } from "../types/Weather.ts";
import { formatCity, unitLabel } from "../utils/format.ts";
import { cyan, green, red, yellow } from "../utils/colors.ts";

export function printCities(cities: City[], defaultIndex: number | null): void {
  cities.forEach((city, index) => {
    const mark = index === defaultIndex ? ` ${cyan("[default]")}` : "";
    console.log(`  ${index + 1}. ${formatCity(city)}${mark}`);
  });
}

export function printTemperature(
  city: City,
  temperature: number,
  unit: TemperatureUnit,
): void {
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
