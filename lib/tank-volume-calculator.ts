// Tank volume calculator: rectangular or cylindrical tank dimensions ->
// gross volume (the tank's full physical capacity) and a usable-volume
// estimate.
//
// Gross volume formulas are exact geometry, not sourced approximations:
//   - Rectangular: length x width x height.
//   - Cylinder: pi x radius^2 x height.
// Unit conversions are exact by definition, not measured figures:
//   - 1 US gallon = 231 cubic inches (US legal definition).
//   - 1 US gallon = 3.785411784 liters (NIST-published exact conversion).
//
// USABLE_VOLUME_FRACTION (90%) is a widely-cited fishkeeping rule of thumb,
// not a physical constant: a tank is never filled to the rim, and substrate,
// decor, a heater, and a filter's intake/media all displace water beyond
// what the rated/gross volume implies. This is an approximation for
// planning purposes — a tank with deep substrate or large decor pieces has
// meaningfully less usable water than this 90% estimate, and this is
// disclosed on the calculator page rather than presented as exact.

export class TankVolumeCalculatorError extends Error {}

export type TankShape = "rectangular" | "cylinder";
export type LengthUnit = "in" | "cm";

export interface TankDimensions {
  length?: number;
  width?: number;
  height?: number;
  diameter?: number;
}

export interface TankVolumeResult {
  grossGallons: number;
  grossLiters: number;
  usableGallons: number;
  usableLiters: number;
}

const GALLONS_PER_CUBIC_INCH = 1 / 231;
const LITERS_PER_GALLON = 3.785411784;
const CM_PER_INCH = 2.54;
const USABLE_VOLUME_FRACTION = 0.9;

function toInches(value: number, unit: LengthUnit): number {
  return unit === "cm" ? value / CM_PER_INCH : value;
}

function assertPositive(value: number | undefined, label: string): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    throw new TankVolumeCalculatorError(`${label} must be a positive number.`);
  }
  return value;
}

export function calculateTankVolume(
  shape: TankShape,
  unit: LengthUnit,
  dims: TankDimensions
): TankVolumeResult {
  let cubicInches: number;

  if (shape === "rectangular") {
    const length = toInches(assertPositive(dims.length, "Length"), unit);
    const width = toInches(assertPositive(dims.width, "Width"), unit);
    const height = toInches(assertPositive(dims.height, "Height"), unit);
    cubicInches = length * width * height;
  } else {
    const diameter = toInches(assertPositive(dims.diameter, "Diameter"), unit);
    const height = toInches(assertPositive(dims.height, "Height"), unit);
    const radius = diameter / 2;
    cubicInches = Math.PI * radius * radius * height;
  }

  const grossGallons = cubicInches * GALLONS_PER_CUBIC_INCH;
  const grossLiters = grossGallons * LITERS_PER_GALLON;

  return {
    grossGallons,
    grossLiters,
    usableGallons: grossGallons * USABLE_VOLUME_FRACTION,
    usableLiters: grossLiters * USABLE_VOLUME_FRACTION,
  };
}
