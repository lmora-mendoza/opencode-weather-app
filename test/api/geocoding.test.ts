import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { searchCities } from "../../src/api/geocoding.ts";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  spyOn(globalThis, "fetch").mockRestore?.();
});

describe("searchCities", () => {
  test("mapea results a City", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        results: [
          { name: "Lima", country: "Perú", admin1: "Lima", latitude: -12.04, longitude: -77.04 },
        ],
      }),
    );
    const cities = await searchCities("Lima");
    expect(cities).toEqual([
      { name: "Lima", country: "Perú", admin1: "Lima", latitude: -12.04, longitude: -77.04 },
    ]);
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain("name=Lima");
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain("count=5");
  });

  test("codifica la consulta en la URL", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ results: [] }));
    await searchCities("San José");
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain(`name=${encodeURIComponent("San José")}`);
  });

  test("devuelve [] cuando no hay results", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}));
    expect(await searchCities("Xyz")).toEqual([]);
  });

  test("lanza error con HTTP no ok", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 500));
    expect(searchCities("Lima")).rejects.toThrow("Geocoding HTTP 500");
  });

  test("usa cadena vacía cuando faltan country y admin1", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ results: [{ name: "Lima", latitude: 1, longitude: 2 }] }),
    );
    expect(await searchCities("Lima")).toEqual([
      { name: "Lima", country: "", admin1: "", latitude: 1, longitude: 2 },
    ]);
  });
});
