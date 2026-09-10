// Freshwater aquarium stocking / bioload calculator.
//
// The core percentage is a deliberately coarse extension of the classic
// "inch of fish per gallon" rule of thumb (1 bioload-unit-inch per gallon =
// 100%), adjusted per species with a relative `bioloadFactor` instead of
// treating every fish's length as equally "worth" the same tank capacity.
//
// REVISED 2026-09-10 after a domain-expert review (full report in
// docs/domain-reference.md) found the original factor spread badly
// understated large fish: real waste production scales with body length to
// roughly the 2.25-2.67 power (from metabolic-scaling physiology), not
// linearly, so an oscar or common pleco produces on the order of 100x+ the
// waste of a neon tetra per FISH, not the ~2x the original narrow factor
// range implied. A literal L^2.25 exponent was tried during this fix and
// rejected: across this table's real size range (1.2in shrimp to 20in
// common pleco), no single global calibration constant keeps BOTH small
// fish and giant fish reading sensibly — whatever constant makes a
// 6-neon-tetra community tank read like a believable percentage makes a
// single oscar at its own sourced minimum tank size read as wildly
// "overstocked" for merely existing, and whatever constant keeps a lone
// oscar reasonable makes small-fish percentages nearly meaningless. Given
// that, this file keeps the simpler linear-per-inch model but substantially
// widens the factor spread for the largest/messiest species (oscar, common
// pleco, common goldfish) so that ADDING MORE of a large fish reliably
// crosses into "overstocked" well before a real welfare risk — see each
// species' own bioloadFactor in fish-species-reference.ts.
//
// PRACTICAL CONSEQUENCE, stated plainly for anyone extending this file: the
// percentage is most reliable for small-to-medium community fish. For any
// species with an adult size above roughly 6 inches, treat that species'
// own minimum tank size (see `additionalGallonsPerFish` below) as the
// authoritative check, not the percentage — this is also explained on the
// /stocking-calculator page's own FAQ so users aren't relying on a number
// this file's own author doesn't fully trust either.
//
// This is explicitly a ROUGH GUIDE, not a scientific verdict. It does NOT
// model: filtration capacity/maturity, water change frequency, actual
// nitrogen cycle state, plant load, feeding amount, or per-species-pair
// aggression and territory beyond the flat temperament label. Two checks
// are applied independently of the bioload percentage, because a fish can
// fail either one even at a low percentage:
//   - belowMinTankSize: this species' minimum tank size (a floor driven by
//     adult size/territory/swimming room, not just bioload), SCALED by
//     quantity via `additionalGallonsPerFish` — e.g. 4 oscars require the
//     single-fish floor plus 3x the per-additional-fish increment, not just
//     the single-fish floor regardless of how many are kept. This is the
//     fix for the single worst failure case the domain-expert review found:
//     without quantity scaling, 4 oscars in a 75-gallon tank read as merely
//     "moderate" with no warnings at all.
//   - belowMinGroupSize: a schooling species kept below its documented
//     minimum group size — a welfare issue, not a bioload issue.
//
// Multiple rows for the SAME species (e.g. a user adds a species twice) are
// merged by species id before any of the above is computed, so splitting a
// quantity across rows can't accidentally dodge either check or produce a
// duplicate result entry.

import { FISH_SPECIES_REFERENCE, type FishSpeciesEntry } from "./fish-species-reference";

export class StockingCalculatorError extends Error {}

export interface StockingEntryInput {
  speciesId: string;
  quantity: number;
}

export interface StockingSpeciesResult {
  species: FishSpeciesEntry;
  quantity: number;
  bioloadUnits: number;
  requiredMinGallons: number;
  belowMinTankSize: boolean;
  belowMinGroupSize: boolean;
}

export type StockingLevel = "lightly stocked" | "moderate" | "heavily stocked" | "overstocked";

export interface StockingResult {
  tankGallons: number;
  totalBioloadUnits: number;
  stockingPercent: number;
  stockingLevel: StockingLevel;
  species: StockingSpeciesResult[];
}

function findSpecies(id: string): FishSpeciesEntry {
  const entry = FISH_SPECIES_REFERENCE.find((s) => s.id === id);
  if (!entry) {
    throw new StockingCalculatorError(`Unknown species: ${id}`);
  }
  return entry;
}

function stockingLevelFor(percent: number): StockingLevel {
  if (percent < 70) return "lightly stocked";
  if (percent <= 100) return "moderate";
  if (percent <= 130) return "heavily stocked";
  return "overstocked";
}

export function calculateStocking(
  tankGallons: number,
  entries: StockingEntryInput[]
): StockingResult {
  if (!Number.isFinite(tankGallons) || tankGallons <= 0) {
    throw new StockingCalculatorError("Tank size must be a positive number of gallons.");
  }

  const active = entries.filter((e) => e.quantity > 0);
  if (active.length === 0) {
    throw new StockingCalculatorError("Add at least one fish with a quantity greater than zero.");
  }
  for (const e of active) {
    if (!Number.isFinite(e.quantity) || e.quantity <= 0 || !Number.isInteger(e.quantity)) {
      throw new StockingCalculatorError("Quantity must be a positive whole number.");
    }
  }

  // Merge rows by species id so splitting one species across multiple rows
  // (e.g. before a newly-added row's species is changed away from its
  // default) can't dodge the minimum-tank or minimum-group checks, or
  // produce two result entries for the same species.
  const quantityBySpecies = new Map<string, number>();
  for (const e of active) {
    quantityBySpecies.set(e.speciesId, (quantityBySpecies.get(e.speciesId) ?? 0) + e.quantity);
  }

  const species: StockingSpeciesResult[] = Array.from(quantityBySpecies.entries()).map(
    ([speciesId, quantity]) => {
      const entry = findSpecies(speciesId);
      const bioloadUnits = entry.adultSizeInches * entry.bioloadFactor * quantity;
      const requiredMinGallons =
        entry.minTankGallons + Math.max(0, quantity - 1) * entry.additionalGallonsPerFish;
      return {
        species: entry,
        quantity,
        bioloadUnits,
        requiredMinGallons,
        belowMinTankSize: tankGallons < requiredMinGallons,
        belowMinGroupSize: quantity < entry.minGroupSize,
      };
    }
  );

  const totalBioloadUnits = species.reduce((sum, s) => sum + s.bioloadUnits, 0);
  // Rounded to 6 decimal places before threshold classification so ordinary
  // floating-point noise (e.g. 1.5 x 0.7 x 6 / 9 x 100 landing on
  // 69.99999999999999 instead of exactly 70) can't put a value on the wrong
  // side of a stocking-level boundary from what a user reads in the
  // (1-decimal, rounded) displayed percentage.
  const stockingPercent = Math.round((totalBioloadUnits / tankGallons) * 100 * 1e6) / 1e6;

  return {
    tankGallons,
    totalBioloadUnits,
    stockingPercent,
    stockingLevel: stockingLevelFor(stockingPercent),
    species,
  };
}
