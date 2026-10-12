import { homedir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../types/Config.ts";
import { createDefaultConfig } from "../types/Config.ts";
import { CONFIG_FILE_NAME } from "../utils/constants.ts";

const DEFAULT_CONFIG_PATH = join(homedir(), CONFIG_FILE_NAME);

function resolveConfigPath(): string {
  const override = process.env.WEATHER_CONFIG_PATH;
  return override && override.length > 0 ? override : DEFAULT_CONFIG_PATH;
}

export function getConfigPath(): string {
  return resolveConfigPath();
}

export async function loadConfig(): Promise<AppConfig> {
  try {
    const file = Bun.file(resolveConfigPath());
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
  await Bun.write(resolveConfigPath(), JSON.stringify(config, null, 2));
}
