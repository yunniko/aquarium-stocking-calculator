# aquarium-stocking-calculator

> **SUSPENDED (Owner, 2026-09-27)** — part of the svc-lab family, suspended because it did not work out as expected.
> No new work; security upkeep only while anything of it is live. Treat its code, formulas and
> decisions as a **lower-reliability reference**: they may or may not still work, so re-verify before
> reusing anything. Rules: `E:\CLAUDE\COMPANY\GOALS.md` → "Suspended projects".

Three tools for freshwater aquarium keepers: a species-aware stocking/bioload
calculator (tank size + fish list → a rough stocking estimate, with
minimum-tank-size and minimum-school-size checks independent of the bioload
math), a tank volume calculator (rectangular or cylindrical dimensions →
gross and estimated usable volume), and a sourced fish species reference
chart. Part of the `svc-lab` portfolio (see `E:\CLAUDE\projects\svc-lab\`).

## Running it

```
npm install --legacy-peer-deps
npm run dev
```

Production build/run: `docker compose --profile app up -d --build`
(no database — stateless).

## Tests

```
npx vitest run        # unit tests — lib/*.ts stocking/volume math and reference data
npx playwright test   # e2e — real browser flows for all three tools
```

## Current state

See `HANDOVER.md` for the math/sourcing notes and `GOALS.md` for the full
build and deploy history.
