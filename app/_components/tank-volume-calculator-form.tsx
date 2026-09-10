"use client";

import { useMemo, useState } from "react";
import {
  calculateTankVolume,
  TankVolumeCalculatorError,
  type LengthUnit,
  type TankShape,
} from "@/lib/tank-volume-calculator";

function round(n: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

export function TankVolumeCalculatorForm() {
  const [shape, setShape] = useState<TankShape>("rectangular");
  const [unit, setUnit] = useState<LengthUnit>("in");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("12");
  const [diameter, setDiameter] = useState("12");

  const result = useMemo(() => {
    try {
      return {
        error: null as string | null,
        value: calculateTankVolume(shape, unit, {
          length: Number(length),
          width: Number(width),
          height: Number(height),
          diameter: Number(diameter),
        }),
      };
    } catch (e) {
      return {
        error: e instanceof TankVolumeCalculatorError ? e.message : "Invalid input.",
        value: null,
      };
    }
  }, [shape, unit, length, width, height, diameter]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Tank shape</span>
          <select
            className="w-40 rounded border border-gray-300 px-3 py-2"
            value={shape}
            onChange={(e) => setShape(e.target.value as TankShape)}
            aria-label="Tank shape"
          >
            <option value="rectangular">Rectangular</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Unit</span>
          <select
            className="w-28 rounded border border-gray-300 px-3 py-2"
            value={unit}
            onChange={(e) => setUnit(e.target.value as LengthUnit)}
            aria-label="Unit"
          >
            <option value="in">inches</option>
            <option value="cm">centimeters</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {shape === "rectangular" ? (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Length</span>
              <input
                className="w-24 rounded border border-gray-300 px-3 py-2"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                aria-label="Length"
                inputMode="decimal"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Width</span>
              <input
                className="w-24 rounded border border-gray-300 px-3 py-2"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                aria-label="Width"
                inputMode="decimal"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Height</span>
              <input
                className="w-24 rounded border border-gray-300 px-3 py-2"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                aria-label="Height"
                inputMode="decimal"
              />
            </label>
          </>
        ) : (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Diameter</span>
              <input
                className="w-24 rounded border border-gray-300 px-3 py-2"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                aria-label="Diameter"
                inputMode="decimal"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Height</span>
              <input
                className="w-24 rounded border border-gray-300 px-3 py-2"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                aria-label="Height"
                inputMode="decimal"
              />
            </label>
          </>
        )}
      </div>

      <div className="mt-6" data-testid="result">
        {result.error ? (
          <p className="text-red-600" role="alert">
            {result.error}
          </p>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-lg">
              Gross volume:{" "}
              <span className="font-semibold">
                {round(result.value!.grossGallons)} gal ({round(result.value!.grossLiters)} L)
              </span>
            </p>
            <p className="text-lg">
              Usable volume (est.):{" "}
              <span className="font-semibold">
                {round(result.value!.usableGallons)} gal ({round(result.value!.usableLiters)} L)
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Usable estimate assumes roughly 10% of gross volume is displaced by substrate,
              decor, and equipment, and that the tank isn&rsquo;t filled to the rim — see the FAQ
              below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
