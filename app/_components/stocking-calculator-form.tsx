"use client";

import { useMemo, useState } from "react";
import {
  calculateStocking,
  StockingCalculatorError,
  type StockingLevel,
} from "@/lib/stocking-calculator";
import { FISH_SPECIES_REFERENCE } from "@/lib/fish-species-reference";

interface Row {
  id: number;
  speciesId: string;
  quantity: string;
}

let nextRowId = 1;

function newRow(): Row {
  return { id: nextRowId++, speciesId: FISH_SPECIES_REFERENCE[0].id, quantity: "6" };
}

function round(n: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

const LEVEL_STYLES: Record<StockingLevel, string> = {
  "lightly stocked": "bg-blue-50 text-blue-900",
  moderate: "bg-green-50 text-green-900",
  "heavily stocked": "bg-amber-50 text-amber-900",
  overstocked: "bg-red-50 text-red-900",
};

export function StockingCalculatorForm() {
  const [tankGallons, setTankGallons] = useState("29");
  const [rows, setRows] = useState<Row[]>([newRow()]);

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, newRow()]);
  }
  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const result = useMemo(() => {
    try {
      return {
        error: null as string | null,
        value: calculateStocking(
          Number(tankGallons),
          rows.map((r) => ({ speciesId: r.speciesId, quantity: Number(r.quantity) }))
        ),
      };
    } catch (e) {
      return {
        error: e instanceof StockingCalculatorError ? e.message : "Invalid input.",
        value: null,
      };
    }
  }, [tankGallons, rows]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Tank size (gallons)</span>
        <input
          className="w-32 rounded border border-gray-300 px-3 py-2"
          value={tankGallons}
          onChange={(e) => setTankGallons(e.target.value)}
          aria-label="Tank size in gallons"
          inputMode="decimal"
        />
      </label>

      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div key={row.id} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Species {index + 1}</span>
              <select
                className="w-64 rounded border border-gray-300 px-3 py-2"
                value={row.speciesId}
                onChange={(e) => updateRow(row.id, { speciesId: e.target.value })}
                aria-label={`Species ${index + 1}`}
              >
                {FISH_SPECIES_REFERENCE.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Quantity</span>
              <input
                className="w-20 rounded border border-gray-300 px-3 py-2"
                value={row.quantity}
                onChange={(e) => updateRow(row.id, { quantity: e.target.value })}
                aria-label={`Quantity ${index + 1}`}
                inputMode="numeric"
              />
            </label>
            {rows.length > 1 && (
              <button
                type="button"
                className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => removeRow(row.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 rounded border border-blue-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
        onClick={addRow}
      >
        + Add another species
      </button>

      <div className="mt-6" data-testid="result">
        {result.error ? (
          <p className="text-red-600" role="alert">
            {result.error}
          </p>
        ) : (
          <div>
            <div className={`rounded-lg p-4 ${LEVEL_STYLES[result.value!.stockingLevel]}`}>
              <p className="text-lg font-semibold" data-testid="stocking-summary">
                {round(result.value!.stockingPercent)}% stocked — {result.value!.stockingLevel}
              </p>
              <p className="mt-1 text-sm">
                Rough guide only — not a substitute for testing your water or researching each
                species&rsquo; compatibility. See the FAQ below.
              </p>
            </div>

            <ul className="mt-4 space-y-2">
              {result.value!.species.map((s) => (
                <li key={s.species.id} className="rounded border border-gray-200 p-3 text-sm">
                  <span className="font-medium">
                    {s.quantity}x {s.species.name}
                  </span>
                  {s.belowMinTankSize && (
                    <p className="mt-1 text-red-600" role="alert">
                      Needs at least {s.requiredMinGallons} gallons for {s.quantity} — this tank
                      is too small for this species/quantity, regardless of the stocking percent
                      above.
                    </p>
                  )}
                  {s.belowMinGroupSize && (
                    <p className="mt-1 text-amber-700" role="alert">
                      Recommended minimum group size is {s.species.minGroupSize} — {s.quantity} may
                      cause stress.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
