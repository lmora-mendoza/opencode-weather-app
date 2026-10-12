import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getConfigPath, loadConfig, saveConfig } from "../../src/storage/citiesStorage.ts";
import { createDefaultConfig } from "../../src/types/Config.ts";

let configPath: string;
let previousOverride: string | undefined;

beforeEach(() => {
  previousOverride = process.env.WEATHER_CONFIG_PATH;
  configPath = join(tmpdir(), `weather-cli-test-${Date.now()}-${Math.random()}.json`);
  process.env.WEATHER_CONFIG_PATH = configPath;
});

afterEach(async () => {
  if (previousOverride === undefined) delete process.env.WEATHER_CONFIG_PATH;
  else process.env.WEATHER_CONFIG_PATH = previousOverride;
  await Bun.file(configPath).unlink().catch(() => {});
});

describe("citiesStorage con WEATHER_CONFIG_PATH", () => {
  test("getConfigPath respeta el override", () => {
    expect(getConfigPath()).toBe(configPath);
  });

  test("loadConfig devuelve default si no existe el archivo", async () => {
    expect(await loadConfig()).toEqual(createDefaultConfig());
  });

  test("saveConfig y loadConfig conservan los datos", async () => {
    const config = {
      cities: [
        { name: "Lima", country: "Perú", admin1: "Lima", latitude: -12.04, longitude: -77.04 },
      ],
      defaultIndex: 0 as const,
      unit: "fahrenheit" as const,
    };
    await saveConfig(config);
    expect(await loadConfig()).toEqual(config);
  });

  test("loadConfig devuelve default con JSON inválido", async () => {
    await Bun.write(configPath, "no-json{{{");
    expect(await loadConfig()).toEqual(createDefaultConfig());
  });

  test("loadConfig devuelve default si cities no es un array", async () => {
    await Bun.write(configPath, JSON.stringify({ cities: "Lima", defaultIndex: 0 }));
    expect(await loadConfig()).toEqual(createDefaultConfig());
  });

  test("loadConfig normaliza unit desconocida a celsius", async () => {
    await Bun.write(configPath, JSON.stringify({ cities: [], defaultIndex: null, unit: "kelvin" }));
    const config = await loadConfig();
    expect(config.unit).toBe("celsius");
  });
});
