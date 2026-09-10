import { describe, expect, it } from "vitest";
import { FISH_SPECIES_REFERENCE } from "@/lib/fish-species-reference";

describe("FISH_SPECIES_REFERENCE", () => {
  it("has unique ids", () => {
    const ids = FISH_SPECIES_REFERENCE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a positive adult size, minimum tank size, minimum group size, and bioload factor for every entry", () => {
    for (const entry of FISH_SPECIES_REFERENCE) {
      expect(entry.adultSizeInches).toBeGreaterThan(0);
      expect(entry.minTankGallons).toBeGreaterThan(0);
      expect(entry.additionalGallonsPerFish).toBeGreaterThanOrEqual(0);
      expect(entry.minGroupSize).toBeGreaterThanOrEqual(1);
      expect(entry.bioloadFactor).toBeGreaterThan(0);
      expect(entry.note.length).toBeGreaterThan(0);
    }
  });

  it("includes at least one heavy-bioload and one light-bioload species to demonstrate the relative scale", () => {
    const factors = FISH_SPECIES_REFERENCE.map((s) => s.bioloadFactor);
    expect(Math.max(...factors)).toBeGreaterThan(1.5);
    expect(Math.min(...factors)).toBeLessThan(0.5);
  });
});
