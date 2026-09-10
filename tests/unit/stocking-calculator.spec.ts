import { describe, expect, it } from "vitest";
import { calculateStocking, StockingCalculatorError } from "@/lib/stocking-calculator";

describe("calculateStocking", () => {
  it("computes bioload units as adultSize x bioloadFactor x quantity", () => {
    const result = calculateStocking(10, [{ speciesId: "neon-tetra", quantity: 6 }]);
    expect(result.totalBioloadUnits).toBeCloseTo(1.5 * 0.7 * 6, 9);
    expect(result.stockingPercent).toBeCloseTo(((1.5 * 0.7 * 6) / 10) * 100, 6);
  });

  it("sums bioload across multiple species", () => {
    const single = calculateStocking(50, [{ speciesId: "corydoras", quantity: 6 }]);
    const combined = calculateStocking(50, [
      { speciesId: "corydoras", quantity: 6 },
      { speciesId: "platy", quantity: 4 },
    ]);
    const platyOnly = calculateStocking(50, [{ speciesId: "platy", quantity: 4 }]);
    expect(combined.totalBioloadUnits).toBeCloseTo(
      single.totalBioloadUnits + platyOnly.totalBioloadUnits,
      9
    );
  });

  it("merges multiple rows for the same species by summing quantity", () => {
    const split = calculateStocking(20, [
      { speciesId: "neon-tetra", quantity: 3 },
      { speciesId: "neon-tetra", quantity: 3 },
    ]);
    const combined = calculateStocking(20, [{ speciesId: "neon-tetra", quantity: 6 }]);
    expect(split.species).toHaveLength(1);
    expect(split.species[0].quantity).toBe(6);
    expect(split.species[0].belowMinGroupSize).toBe(false);
    expect(split.totalBioloadUnits).toBeCloseTo(combined.totalBioloadUnits, 9);
  });

  it("flags a species below its minimum tank size regardless of bioload percent", () => {
    // Oscar (min 75 gal) in a 20-gallon tank — a single fish is a tiny bioload
    // percent by the raw formula, but the tank floor must still trip.
    const result = calculateStocking(20, [{ speciesId: "oscar", quantity: 1 }]);
    expect(result.species[0].belowMinTankSize).toBe(true);
  });

  it("does not flag minimum tank size when the tank meets the species floor", () => {
    const result = calculateStocking(75, [{ speciesId: "oscar", quantity: 1 }]);
    expect(result.species[0].belowMinTankSize).toBe(false);
  });

  it("scales the minimum tank size floor with quantity via additionalGallonsPerFish", () => {
    // Regression for the domain-expert review's critical finding: 4 oscars
    // in a 75-gallon tank (the single-fish floor) must trip the minimum
    // tank size check even though the raw bioload percent alone might not
    // look extreme.
    const oneOscar = calculateStocking(75, [{ speciesId: "oscar", quantity: 1 }]);
    expect(oneOscar.species[0].requiredMinGallons).toBe(75);
    expect(oneOscar.species[0].belowMinTankSize).toBe(false);

    const fourOscars = calculateStocking(75, [{ speciesId: "oscar", quantity: 4 }]);
    expect(fourOscars.species[0].requiredMinGallons).toBe(75 + 3 * 50);
    expect(fourOscars.species[0].belowMinTankSize).toBe(true);
    expect(fourOscars.stockingLevel).toBe("overstocked");
  });

  it("flags a schooling species kept below its minimum group size", () => {
    const result = calculateStocking(20, [{ speciesId: "neon-tetra", quantity: 3 }]);
    expect(result.species[0].belowMinGroupSize).toBe(true);
  });

  it("does not flag group size when the school meets the minimum", () => {
    const result = calculateStocking(20, [{ speciesId: "neon-tetra", quantity: 6 }]);
    expect(result.species[0].belowMinGroupSize).toBe(false);
  });

  it("classifies stocking level by percent thresholds", () => {
    // 1 neon tetra (1.5 x 0.7 = 1.05 units) in varying tank sizes to hit each band.
    expect(calculateStocking(100, [{ speciesId: "neon-tetra", quantity: 1 }]).stockingLevel).toBe(
      "lightly stocked"
    ); // 1.05%
    expect(calculateStocking(1.2, [{ speciesId: "neon-tetra", quantity: 1 }]).stockingLevel).toBe(
      "moderate"
    ); // 87.5%
    expect(calculateStocking(1, [{ speciesId: "neon-tetra", quantity: 1 }]).stockingLevel).toBe(
      "heavily stocked"
    ); // 105%
    expect(calculateStocking(0.5, [{ speciesId: "neon-tetra", quantity: 1 }]).stockingLevel).toBe(
      "overstocked"
    ); // 210%
  });

  it("classifies a percentage that lands exactly on a threshold correctly despite floating-point noise", () => {
    const result = calculateStocking(9, [{ speciesId: "neon-tetra", quantity: 6 }]);
    expect(result.stockingPercent).toBe(70);
    expect(result.stockingLevel).toBe("moderate");
  });

  it("ignores zero-quantity entries", () => {
    const result = calculateStocking(20, [
      { speciesId: "neon-tetra", quantity: 6 },
      { speciesId: "platy", quantity: 0 },
    ]);
    expect(result.species).toHaveLength(1);
    expect(result.species[0].species.id).toBe("neon-tetra");
  });

  it("rejects a non-positive tank size", () => {
    expect(() => calculateStocking(0, [{ speciesId: "neon-tetra", quantity: 6 }])).toThrow(
      StockingCalculatorError
    );
    expect(() => calculateStocking(-10, [{ speciesId: "neon-tetra", quantity: 6 }])).toThrow(
      StockingCalculatorError
    );
  });

  it("rejects an empty stocking list", () => {
    expect(() => calculateStocking(20, [])).toThrow(StockingCalculatorError);
  });

  it("rejects an all-zero stocking list", () => {
    expect(() => calculateStocking(20, [{ speciesId: "neon-tetra", quantity: 0 }])).toThrow(
      StockingCalculatorError
    );
  });

  it("rejects a non-integer quantity", () => {
    expect(() => calculateStocking(20, [{ speciesId: "neon-tetra", quantity: 2.5 }])).toThrow(
      StockingCalculatorError
    );
  });

  it("rejects an unknown species id", () => {
    expect(() => calculateStocking(20, [{ speciesId: "not-a-real-fish", quantity: 1 }])).toThrow(
      StockingCalculatorError
    );
  });
});
