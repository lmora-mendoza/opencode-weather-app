import { describe, expect, test } from "bun:test";
import { createDefaultConfig, getDefaultCity } from "../../src/types/Config.ts";
import type { City } from "../../src/types/City.ts";

const lima: City = {
  name: "Lima",
  country: "Perú",
  admin1: "Lima",
  latitude: -12.0464,
  longitude: -77.0428,
};

const cusco: City = {
  name: "Cusco",
  country: "Perú",
  admin1: "Cusco",
  latitude: -13.5319,
  longitude: -71.9675,
};

describe("createDefaultConfig", () => {
  test("config vacía en celsius", () => {
    expect(createDefaultConfig()).toEqual({
      cities: [],
      defaultIndex: null,
      unit: "celsius",
    });
  });
});

describe("getDefaultCity", () => {
  test("null cuando no hay default", () => {
    expect(getDefaultCity(createDefaultConfig())).toBeNull();
  });

  test("devuelve la ciudad del índice", () => {
    expect(getDefaultCity({ cities: [lima, cusco], defaultIndex: 1, unit: "celsius" })).toEqual(
      cusco,
    );
  });

  test("null cuando el índice está fuera de rango", () => {
    expect(getDefaultCity({ cities: [lima], defaultIndex: 5, unit: "celsius" })).toBeNull();
  });
});
