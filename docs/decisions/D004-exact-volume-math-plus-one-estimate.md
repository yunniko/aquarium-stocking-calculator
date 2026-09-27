# D004 · Tank-volume calculator: exact geometry/conversion plus one disclosed 90% estimate
Date: 2026-09-10 · Goal: G-001 · Status: active
Context: Volume formulas and 231 in³/gal, 3.785411784 L/gal are exact by definition.
Decision: Only the usable-volume fraction (90%, for substrate/decor/fill line) is a rule of thumb, and the page says so.
Rejected: folding the estimate silently into the "real" numbers.
Consequence: Keep the exact/estimate split visible in the UI.
Evidence: `lib/tank-volume-calculator.ts`.
