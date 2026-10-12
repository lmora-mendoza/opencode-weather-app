import { describe, expect, test } from "bun:test";
import { toggleUnitValue } from "../../src/storage/settingsStorage.ts";

describe("toggleUnitValue", () => {
  test("celsius pasa a fahrenheit", () => {
    expect(toggleUnitValue("celsius")).toBe("fahrenheit");
  });

  test("fahrenheit pasa a celsius", () => {
    expect(toggleUnitValue("fahrenheit")).toBe("celsius");
  });

  test("doble cambio vuelve al origen", () => {
    expect(toggleUnitValue(toggleUnitValue("celsius"))).toBe("celsius");
  });
});
