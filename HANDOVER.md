# Handover — aquarium-stocking-calculator
Last verified: 2026-09-12 at a8f9dd4

svc-lab service #13. Goal: `GOALS.md` G-001. Shared conventions: `E:\CLAUDE\projects\svc-lab\`;
charter: `E:\CLAUDE\COMPANY\`.

## Current state

- **Live** at https://aquarium-stocking-calculator.svc.julienika.cz (deployed 2026-09-10,
  port 30180; HTTP 200 re-checked 2026-09-12). Linked from the `julienika-home` hub and sitemap
  index.
- Three tools, no database, no accounts: `/stocking-calculator` (tank size + fish list →
  species-aware stocking estimate with independent tank-size and group-size floors),
  `/tank-volume-calculator`, `/fish-species-reference` (15 sourced species).
- Verification on 2026-09-12: `npm run test:unit` 26/26. e2e (11 specs) last green 2026-09-10.
- Domain-expert and manual security reviews done (D006). Git tree clean.

## How things fit together

Standard svc-lab stateless Next.js service. Pure logic: `lib/fish-species-reference.ts`
(sourced data), `lib/stocking-calculator.ts` (bioload sum + two floor checks),
`lib/tank-volume-calculator.ts` (exact geometry + one disclosed estimate). Forms in
`app/_components/`, pages under `app/<tool>/`.

## Rules in force

- Bioload scales with length^2.25–2.67, not linearly (D006). Floors stay separate from the
  percentage (D002).
- `bioloadFactor` values are directional; change one only with a cited source (D003).
- `npm ci --legacy-peer-deps`; run unit, e2e and `npm run build` before calling work done.

## Next steps and open questions

- With working WebFetch, check the species table and the heuristic's framing against a primary
  source with real bioload/ammonia measurements (a university aquaculture extension).
- AdSense per-domain approval unconfirmed (portfolio-wide).

## Deploy log

| Date | Commit | What changed | Verified how |
|---|---|---|---|
| 2026-09-10 | a8f9dd4 | First deploy (port 30180); hub + sitemap index updated | Routes curl 200, sibling sites unaffected |

## Decisions

`docs/decisions/README.md` (D001–D006).
