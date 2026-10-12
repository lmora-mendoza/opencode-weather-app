import type { Interface } from "node:readline/promises";
import type { AppConfig } from "../types/Config.ts";
import { unitLabel } from "../utils/format.ts";
import { MENU_LINE } from "../utils/constants.ts";
import { cyan } from "../utils/colors.ts";

export function printMenu(config: AppConfig): void {
  console.log(cyan(MENU_LINE));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(MENU_LINE));
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${config.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico 7 días (default)");
  console.log(`  8. Ajustes (${unitLabel(config.unit)})`);
  console.log("  9. Salir");
  console.log(cyan(MENU_LINE));
}

export async function askOption(prompt: Interface): Promise<string> {
  return (await prompt.question("  Selecciona una opción: ")).trim();
}
