import { loadConfig } from "./storage/citiesStorage.ts";
import { createPrompt, pause } from "./presentation/input.ts";
import { askOption, printMenu } from "./presentation/menu.ts";
import { printError } from "./presentation/output.ts";
import { showAllWeather, showDefaultWeather } from "./actions/getWeather.ts";
import { addCity } from "./actions/addCity.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { showForecast } from "./actions/showForecast.ts";
import { toggleUnit } from "./actions/toggleUnit.ts";

async function main(): Promise<void> {
  const config = await loadConfig();
  const prompt = createPrompt();
  let running = true;

  while (running) {
    printMenu(config);
    const option = await askOption(prompt);
    console.log("");

    switch (option) {
      case "1": {
        await showDefaultWeather(config);
        break;
      }
      case "2": {
        await showAllWeather(config);
        break;
      }
      case "3": {
        await addCity(prompt, config);
        break;
      }
      case "4": {
        await removeCity(prompt, config);
        break;
      }
      case "5": {
        await setDefaultCity(prompt, config);
        break;
      }
      case "6": {
        await showForecast(config);
        break;
      }
      case "8": {
        await toggleUnit(config);
        break;
      }
      case "9": {
        running = false;
        break;
      }
      default: {
        printError("Opción inválida.");
        break;
      }
    }

    if (running) await pause(prompt);
  }

  prompt.close();
}

await main();
