# D001 · Stocking model = species-adjusted "inch per gallon", not a new bioload model
Date: 2026-09-10 · Goal: G-001 · Status: active
Context: AqAdvisor, the dominant tool, is criticised for not modelling disproportionate waste from large/messy species. No authoritative numeric bioload database exists for aquarium species.
Decision: Keep the widely taught baseline (1 inch-equivalent per gallon = 100%) and add one per-species `bioloadFactor`. The domain review (D006) later replaced linear length scaling with the real ~length^2.25–2.67 waste scaling.
Rejected: inventing a precise-looking formula with no backing.
Consequence: The model is an honest incremental improvement; its FAQ lists what it ignores (filtration maturity, water tests, plant load, per-pair aggression).
Evidence: `lib/stocking-calculator.ts` header; `docs/domain-reference.md`.
