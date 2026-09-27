# D002 · Minimum tank size and minimum group size are independent floor checks
Date: 2026-09-10 · Goal: G-001 · Status: active
Context: One oscar in a 20-gallon tank has a low raw bioload percentage but the tank is still far too small for its territorial needs.
Decision: Both floors fire as separate warnings regardless of the computed percentage; they are never folded into the bioload number.
Rejected: encoding spatial needs into the percentage (needs per-species enclosure research out of scope).
Consequence: Don't collapse the two floors into the percentage; they represent different risks.
Evidence: `lib/stocking-calculator.ts`; `tests/unit/`.
