import { homedir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../types/Config.ts";
import { createDefaultConfig } from "../types/Config.ts";
import { CONFIG_FILE_NAME } from "../utils/constants.ts";

const CONFIG_PATH = join(homedir(), CONFIG_FILE_NAME);

export function getConfigPath(): string {
  return CONFIG_PATH;
}

export async function loadConfig(): Promise<AppConfig> {
  try {
    const file = Bun.file(CONFIG_PATH);
    if (!(await file.exists())) return createDefaultConfig();
    const parsed = (await file.json()) as Partial<AppConfig>;
    if (!Array.isArray(parsed.cities)) return createDefaultConfig();
    return {
      cities: parsed.cities,
      defaultIndex:
        typeof parsed.defaultIndex === "number" ? parsed.defaultIndex : null,
      unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return createDefaultConfig();
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
