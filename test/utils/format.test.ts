import { describe, expect, test } from "bun:test";
import { formatCity, unitLabel } from "../../src/utils/format.ts";
import type { City } from "../../src/types/City.ts";

function makeCity(overrides: Partial<City> = {}): City {
  return {
    name: "Madrid",
    country: "España",
    admin1: "Comunidad de Madrid",
    latitude: 40.4168,
    longitude: -3.7038,
    ...overrides,
  };
}

describe("formatCity", () => {
  test("incluye región y país", () => {
    expect(formatCity(makeCity())).toBe("Madrid (Comunidad de Madrid, España)");
  });

  test("solo país cuando no hay admin1", () => {
    expect(formatCity(makeCity({ admin1: "" }))).toBe("Madrid (España)");
  });

  test("solo nombre cuando no hay región ni país", () => {
    expect(formatCity(makeCity({ admin1: "", country: "" }))).toBe("Madrid");
  });
});

describe("unitLabel", () => {
  test("celsius es °C", () => {
    expect(unitLabel("celsius")).toBe("°C");
  });

  test("fahrenheit es °F", () => {
    expect(unitLabel("fahrenheit")).toBe("°F");
  });
});
