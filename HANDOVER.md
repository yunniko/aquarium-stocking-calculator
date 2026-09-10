# Handover — aquarium-stocking-calculator

Read this before touching the project. Goal in `GOALS.md` (G-001).
Company-wide standards in `E:\CLAUDE\COMPANY\`. Parent initiative:
`E:\CLAUDE\projects\svc-lab\`.

## Current state

Built, locally verified (ESLint, production build, unit tests, e2e tests —
see the latest `GOALS.md` progress-log entry for the exact counts from the
most recent run). Domain-expert review and shipping are still open — see
`GOALS.md`'s milestones. Three tools: `/stocking-calculator` (tank size +
fish list → a species-aware stocking estimate), `/tank-volume-calculator`
(dimensions → gross/usable volume), `/fish-species-reference` (sourced
15-entry species table). No database, no accounts.

## How things fit together

Standard svc-lab stateless Next.js service — see `svc-lab/HANDOVER.md` for
the shared template/deploy pattern. Business logic lives in
`lib/fish-species-reference.ts` (the sourced per-species data table),
`lib/stocking-calculator.ts` (bioload summation + two independent floor
checks), and `lib/tank-volume-calculator.ts` (exact geometry + unit
conversion + a disclosed usable-volume estimate) — all pure
functions/data, unit-tested in `tests/unit/`. UI forms are in
`app/_components/`, pages in `app/stocking-calculator`,
`app/tank-volume-calculator`, `app/fish-species-reference`.

## Decision record

**D1 — The stocking heuristic is a species-adjusted extension of the
classic "inch of fish per gallon" rule, not a from-scratch model.** This
project's own research (svc-lab `GOALS.md` backlog idea #16) found the
dominant existing tool, AqAdvisor, repeatedly criticized across independent
sources for a model that doesn't account for disproportionate waste from
larger/messier species (e.g. an oscar vs. an equivalent length of small
schooling fish). Rather than invent a more "precise"-looking formula with
no real backing, this project keeps the well-known, widely-taught baseline
(1 inch-equivalent per gallon = 100%) and adds one adjustable factor per
species (`bioloadFactor`) informed by qualitative research on relative
waste production — an honest, incremental improvement on a known
heuristic, not a claim to have solved bioload modeling. See
`lib/stocking-calculator.ts`'s header comment and the calculator page's own
FAQ for the full framing, including everything this model does NOT
account for (filtration maturity, real water test results, plant load,
per-pair aggression/territory beyond a flat temperament label).

**D2 — Minimum tank size and minimum group size are independent floor
checks, not folded into the bioload percentage.** A single oscar produces
a low RAW bioload percentage in a 20-gallon tank by the formula alone (one
fish, moderate adjusted size), but a 20-gallon tank is still far too small
for an oscar's territorial/spatial needs — exactly the kind of gap the
research found in AqAdvisor's pure-bioload model. Rather than try to
encode territory/spatial needs into the bioload number itself (which would
require real per-species enclosure-size research well beyond this
project's scope), this project keeps them as separate, always-checked
warnings that fire regardless of the computed percentage. Same reasoning
for minimum group size (a welfare issue for schooling fish, unrelated to
bioload capacity).

**D3 — `bioloadFactor` is explicitly framed as a directional relative
scale, not a lab-measured coefficient — disclosed in three places (the
lib file's header comment, the species reference page's FAQ, and each
entry's own note where relevant).** No authoritative numeric bioload
database was found for common aquarium species during this project's
research; the factors synthesize qualitative descriptions (e.g. "produces
waste equivalent to about four medium community fish," "ammonia
excretion roughly 3x a tropical fish per body weight," "much lower
bioload than common plecos"). This is the same honesty standard
`ad-revenue-calculator` applied to its own CPM benchmark ranges
(distinguishing "directional" from "sourced") — flagged explicitly for the
mandatory domain-expert review rather than presented as more precise than
it is.

**D4 — `lib/tank-volume-calculator.ts` is deliberately split into exact
math (geometry, unit conversion) and one disclosed estimate (90% usable
volume).** Unlike the bioload model, gallon/liter/cubic-inch conversions
and rectangular/cylinder volume formulas are exact by definition — no
sourcing risk there. The only rule-of-thumb figure in this file is the 90%
usable-volume fraction (substrate/decor/fill-line display), which is
called out explicitly as an estimate on the calculator page rather than
folded silently into the "real" numbers.

**D5 — Sourcing: WebFetch denied this session (confirmed via one direct
attempt against a seriouslyfish.com species page, per the daily-loop
playbook), so every species figure comes from WebSearch-snippet synthesis,
not a directly-read primary document.** Same known limitation documented
in `svc-lab/HANDOVER.md`'s research-caveat decision. Cross-corroborated
per species across multiple independent, established fishkeeping sources
(see `lib/fish-species-reference.ts`'s header comment for the full
citation list) rather than trusted from one source. Where sources
genuinely disagreed on a figure (several species — goldfish and oscar
minimum tank size are the clearest examples), the table picked the more
conservative commonly-cited figure and says so explicitly in that
species' own note, rather than presenting a disputed number as settled.
Flagged for the mandatory domain-expert review (M1b in `GOALS.md`) before
shipping, per `docs/domain-reference.md` once that review has run.

## Next steps and open questions

- M1b (domain-expert review) and M2 (ship) are still open as of this
  entry — see `GOALS.md`'s milestones for what's left.
- If a future session gets real WebFetch/forum access, both the species
  reference table and the stocking heuristic's own framing would benefit
  from being checked against a primary source with real bioload/ammonia
  measurements (e.g. a university aquaculture extension publication)
  rather than WebSearch snippet synthesis of hobbyist care guides.
