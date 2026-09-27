# D003 · `bioloadFactor` is a directional relative scale, disclosed three ways
Date: 2026-09-10 · Goal: G-001 · Status: active
Context: Factors synthesise qualitative descriptions ("about four medium community fish", "3x ammonia per body weight"), not lab coefficients.
Decision: Disclose that in the lib header, the reference page FAQ and per-entry notes; flag for domain review rather than present as precise.
Rejected: presenting factors as measured.
Consequence: Any factor change must cite a real source (the review already corrected shrimp by ~6–10x).
Evidence: `lib/fish-species-reference.ts` header.
