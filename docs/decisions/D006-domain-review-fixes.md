# D006 · Domain-expert review found a structural flaw and several data errors; all fixed
Date: 2026-09-10 · Goal: G-001 · Status: active
Context: Mandatory domain gate before shipping.
Decision: Fixed: bioload modelled linear in fish length versus real ~length^2.25–2.67 scaling (4 oscars in 75 gal falsely read "83% moderate"); minimum tank size not scaling with quantity; shrimp bioload factor ~6–10x too high; an unsourced goldfish ammonia claim; several sizing/grouping errors. Manual security review (skill needs `origin/HEAD`): no network calls, no storage, no secrets, JSON-LD escaped — clean.
Rejected: shipping the linear model.
Consequence: 26 unit + 11 e2e green after fixes; re-run after any model change.
Evidence: `docs/domain-reference.md`; `svc-lab/GOALS.md` shipped-services row 13.
