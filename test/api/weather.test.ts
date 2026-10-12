import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { getDailyForecast, getTemperature } from "../../src/api/weather.ts";
import type { City } from "../../src/types/City.ts";

const lima: City = {
  name: "Lima",
  country: "Perú",
  admin1: "Lima",
  latitude: -12.0464,
  longitude: -77.0428,
};

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  spyOn(globalThis, "fetch").mockRestore?.();
});

describe("getTemperature", () => {
  test("devuelve current.temperature_2m", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ current: { temperature_2m: 21.5 } }),
    );
    expect(await getTemperature(lima, "celsius")).toBe(21.5);
    const url = String(fetchSpy.mock.calls[0]?.[0]);
    expect(url).toContain("latitude=-12.0464");
    expect(url).toContain("temperature_unit=celsius");
  });

  test("lanza error con HTTP no ok", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 500));
    expect(getTemperature(lima, "celsius")).rejects.toThrow("Forecast HTTP 500");
  });

  test("lanza error sin temperatura", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ current: {} }));
    expect(getTemperature(lima, "celsius")).rejects.toThrow("Sin temperatura");
  });
});

describe("getDailyForecast", () => {
  test("mapea los 7 días", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        daily: {
          time: ["2026-10-12", "2026-10-13"],
          temperature_2m_max: [22, 23],
          temperature_2m_min: [15, 16],
        },
      }),
    );
    expect(await getDailyForecast(lima, "fahrenheit")).toEqual([
      { date: "2026-10-12", max: 22, min: 15 },
      { date: "2026-10-13", max: 23, min: 16 },
    ]);
  });

  test("lanza error con daily incompleto", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ daily: {} }));
    expect(getDailyForecast(lima, "celsius")).rejects.toThrow("Sin pronóstico");
  });

  test("lanza error con valores no numéricos", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        daily: {
          time: ["2026-10-12"],
          temperature_2m_max: ["x"],
          temperature_2m_min: [15],
        },
      }),
    );
    expect(getDailyForecast(lima, "celsius")).rejects.toThrow("Sin pronóstico");
  });
});
