import { describe, expect, it } from "vitest";
import { calculateTankVolume, TankVolumeCalculatorError } from "@/lib/tank-volume-calculator";

describe("calculateTankVolume", () => {
  it("computes gross gallons for a rectangular tank (length x width x height / 231)", () => {
    // 23.1 x 10 x 10 = 2310 cubic inches = exactly 10 gallons.
    const result = calculateTankVolume("rectangular", "in", {
      length: 23.1,
      width: 10,
      height: 10,
    });
    expect(result.grossGallons).toBeCloseTo(10, 9);
  });

  it("computes gross liters from gallons using the exact US conversion factor", () => {
    const result = calculateTankVolume("rectangular", "in", {
      length: 23.1,
      width: 10,
      height: 10,
    });
    expect(result.grossLiters).toBeCloseTo(10 * 3.785411784, 9);
  });

  it("applies a 90% usable-volume estimate", () => {
    const result = calculateTankVolume("rectangular", "in", {
      length: 23.1,
      width: 10,
      height: 10,
    });
    expect(result.usableGallons).toBeCloseTo(9, 9);
    expect(result.usableLiters).toBeCloseTo(9 * 3.785411784, 9);
  });

  it("computes gross gallons for a cylindrical tank (pi x r^2 x height / 231)", () => {
    const result = calculateTankVolume("cylinder", "in", { diameter: 12, height: 20 });
    const expectedCubicInches = Math.PI * 6 * 6 * 20;
    expect(result.grossGallons).toBeCloseTo(expectedCubicInches / 231, 9);
  });

  it("converts centimeter dimensions to inches before computing volume", () => {
    const inches = calculateTankVolume("rectangular", "in", {
      length: 23.1,
      width: 10,
      height: 10,
    });
    const cm = calculateTankVolume("rectangular", "cm", {
      length: 23.1 * 2.54,
      width: 10 * 2.54,
      height: 10 * 2.54,
    });
    expect(cm.grossGallons).toBeCloseTo(inches.grossGallons, 6);
  });

  it("rejects a non-positive dimension", () => {
    expect(() =>
      calculateTankVolume("rectangular", "in", { length: 0, width: 10, height: 10 })
    ).toThrow(TankVolumeCalculatorError);
    expect(() =>
      calculateTankVolume("rectangular", "in", { length: 10, width: -5, height: 10 })
    ).toThrow(TankVolumeCalculatorError);
  });

  it("rejects a missing required dimension for the selected shape", () => {
    expect(() => calculateTankVolume("rectangular", "in", { length: 10, width: 10 })).toThrow(
      TankVolumeCalculatorError
    );
    expect(() => calculateTankVolume("cylinder", "in", { diameter: 10 })).toThrow(
      TankVolumeCalculatorError
    );
  });
});
