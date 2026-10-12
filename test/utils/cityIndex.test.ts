import { describe, expect, test } from "bun:test";
import { nextDefaultIndexAfterRemove } from "../../src/utils/cityIndex.ts";

describe("nextDefaultIndexAfterRemove", () => {
  test("sin ciudades restantes devuelve null", () => {
    expect(nextDefaultIndexAfterRemove(0, 0, 0)).toBeNull();
  });

  test("sin default devuelve null", () => {
    expect(nextDefaultIndexAfterRemove(2, null, 0)).toBeNull();
  });

  test("elimina el default y apunta al primero", () => {
    expect(nextDefaultIndexAfterRemove(2, 1, 1)).toBe(0);
  });

  test("elimina antes del default y decrementa", () => {
    expect(nextDefaultIndexAfterRemove(2, 2, 0)).toBe(1);
  });

  test("elimina después del default y lo conserva", () => {
    expect(nextDefaultIndexAfterRemove(2, 0, 2)).toBe(0);
  });
});
