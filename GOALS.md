# Goals — aquarium-stocking-calculator

> **SUSPENDED (Owner, 2026-09-27)** — part of the svc-lab family, suspended because it did not work out as expected.
> No new work; security upkeep only while anything of it is live. Treat its code, formulas and
> decisions as a **lower-reliability reference**: they may or may not still work, so re-verify before
> reusing anything. Rules: `E:\CLAUDE\COMPANY\GOALS.md` → "Suspended projects".

Owner writes goals here; The Company plans, executes, and logs against them.
Statuses: `DRAFT` · `ACTIVE` · `BLOCKED` · `DONE`.
Parent initiative: `E:\CLAUDE\projects\svc-lab\` (same milestone-gate waiver
and standing deploy pre-approval apply here). Template/numbering
conventions in `E:\CLAUDE\COMPANY\GOALS.md`.

## Active goals

### G-001 · Freshwater aquarium stocking, tank-volume, and species reference calculators — SUSPENDED
- **What:** Three tools: a species-aware stocking/bioload calculator
  (`/stocking-calculator` — tank size + fish list → a rough stocking
  estimate, with minimum-tank-size and minimum-school-size checks
  independent of the bioload math), a tank volume calculator
  (`/tank-volume-calculator` — rectangular or cylindrical dimensions →
  gross and estimated usable volume in gallons/liters), and a sourced fish
  species reference chart (`/fish-species-reference`). No database, no
  accounts.
- **Why:** svc-lab backlog idea #16 — real multi-source signal: the
  dominant existing tool (AqAdvisor) is independently documented across
  several sources as outdated (algorithm/database not meaningfully updated
  in over a decade) and as having an oversimplified bioload model that
  doesn't capture that, e.g., a large aggressive fish produces
  disproportionately more waste than its raw body length implies — the
  same "dominant-but-dated" competitor-gap pattern that justified
  soap-lye-calculator and candle-fragrance-calculator. A genuine
  craft/science domain (fishkeeping bioload and aquatic biology) that fits
  the mandatory domain-expert-review gate well.
- **Acceptance criteria:** Stocking math unit-tested (bioload summation,
  minimum-tank-size and minimum-group-size floor checks, stocking-level
  thresholds), tank volume math unit-tested (rectangular and cylindrical
  geometry, unit conversion, usable-volume estimate), species reference
  data sourced and cross-corroborated across independent references,
  domain-expert-reviewed before shipping, a real browser flow verified
  (e2e-tested), live and reachable over HTTPS, sitemap present, honest
  caveats on the stocking calculator's own limitations (not a substitute
  for water testing or compatibility research).
- **Constraints:** No database, no accounts, no paid dependencies.

**Milestones:**
- [x] M1 — Build: species-adjusted stocking/bioload calculator (extends the
      classic inch-per-gallon rule with a per-species bioload factor, plus
      independent minimum-tank-size and minimum-group-size floor checks), a
      tank volume calculator (rectangular/cylindrical geometry, exact unit
      conversions, a disclosed 90% usable-volume estimate), a sourced
      15-entry freshwater species reference table, 3 tool pages, unit
      tests, e2e tests. ✔ 2026-09-10.
- [x] M1b — Domain-expert review (freshwater fishkeeping bioload/aquatic
      biology). Found real, serious issues, not a rubber stamp: a critical
      structural flaw where the bioload percentage was linear in fish
      length while real waste production scales ~length^2.25-2.67, making
      the tool falsely reassuring for large fish (4 oscars in 75 gallons
      read "83% moderate"); minimum tank size never scaled with quantity;
      plus cherry shrimp bioload ~6-10x too high, an unsourced goldfish
      ammonia claim, tiger barb group size too low, common pleco tank size
      too low, missing goldfish/tropical incompatibility and dwarf gourami
      disease notes, and more. All critical/high findings fixed same run
      and re-verified. ✔ 2026-09-10 — see `docs/domain-reference.md` and
      `HANDOVER.md` D6.
- [x] M2 — Ship: git init, security review, push via `init-repo.ps1`,
      deploy via `deploy-service.ps1`, verify live, update hub page and
      sitemap index. ✔ 2026-09-10 — https://aquarium-stocking-calculator.svc.julienika.cz.
- [ ] M3 — Monetization once an ad account exists for this domain (already
      wired via the shared `ADSENSE_PUBLISHER_ID` env var, awaiting
      AdSense's own per-domain approval, same as every other svc-lab
      service).

**Progress log** (newest first):
- 2026-09-10 — M1 complete this run (svc-lab daily automation). Sourcing
  note: WebFetch was denied this session (confirmed via one direct attempt
  against a seriouslyfish.com species page, same known limitation as every
  prior svc-lab service — see `svc-lab/HANDOVER.md`'s research-caveat
  decision), so the species reference table is sourced via WebSearch
  synthesis, cross-corroborated across multiple independent, established
  fishkeeping sources per species (Aquarium Co-Op, fishlore.com forums,
  Chewy, PetMD, aquariumstocking.com, aquariumstoredepot.com,
  tropicaltreasureswyo.com, oscarfishlover.com, thegoldfishtank.com,
  bettacarehub.com, modestfish.com, tankzen.co, shrimpybusiness.com,
  aquascapeaquarium.com). Full citations and honesty notes (including
  every place sources genuinely disagreed, e.g. goldfish/oscar minimum
  tank size) in `lib/fish-species-reference.ts`'s header comment and each
  entry's own note. Flagging this explicitly for the mandatory
  domain-expert review (M1b) before shipping, same pattern as every prior
  svc-lab service's sourcing caveat — in particular, the `bioloadFactor`
  values are a qualitative-synthesis-derived relative scale, not a
  lab-measured coefficient, and should get real scrutiny.
- 2026-09-10 — M1b complete this run. Domain-expert review found and this
  run fixed real, serious issues: a critical structural flaw (bioload
  percentage linear in fish length vs. real ~length^2.25-2.67 waste
  scaling, making 4 oscars in 75gal read "83% moderate"), minimum tank
  size never scaling with quantity, a ~6-10x too-high shrimp bioload
  factor, an unsourced goldfish "3x ammonia" claim, tiger barb group size
  too low, common pleco tank size too low, and missing
  goldfish/tropical-incompatibility and dwarf-gourami-disease notes.
  Fixed: raised bioloadFactor for oscar/common-pleco/goldfish, lowered
  bristlenose, added additionalGallonsPerFish so minimum tank size scales
  with quantity (4 oscars/75gal now correctly reads "overstocked" with a
  tripped warning - regression test added), fixed shrimp factor, removed
  the unsourced claim, added the missing compatibility/disease notes,
  raised tiger barb's minimum group to 8, raised common pleco's minimum
  tank to 100gal, renamed "understocked" to "lightly stocked", and merged
  same-species rows before checks run. Full detail and disposition of
  every finding in docs/domain-reference.md. Re-ran the full verification
  suite fresh after every fix: ESLint clean, production build clean, 26
  Vitest unit tests, 11 Playwright e2e tests, all passing. BLOCKED:
  session budget ran out immediately after this - M2 (security review,
  push, deploy, hub page update) has not started; nothing has left the
  workspace, no git repo exists yet. Next session: git init (repo-local
  user.email 12hv89@gmail.com), commit, /security-review, push via
  init-repo.ps1, deploy via deploy-service.ps1 (port 30180 reserved,
  re-verify live per usual policy), update julienika-home's hub page and
  sitemap index and redeploy, then close out svc-lab's GOALS.md per the
  usual resume pattern (see epub-metadata-fixer's and soap-lye-calculator's
  own resume entries).
- 2026-09-10 — M2 complete this run (svc-lab automation resume). Full
  suite independently re-verified fresh before touching git (ESLint, 26
  Vitest tests, production build, 11 Playwright e2e tests, all clean).
  Manual security review clean (no network calls, no client-side storage,
  no secrets, safe JSON-LD escaping, no server endpoints) — the
  `/security-review` skill's `origin/HEAD` precondition still can't run
  before a remote exists, same known gap as every prior service. `git
  init`, repo-local `user.email`, committed, pushed via `init-repo.ps1`
  (https://github.com/yunniko/aquarium-stocking-calculator, public),
  deployed via `deploy-service.ps1` on the first attempt (port 30180,
  bound to 127.0.0.1). Live at
  https://aquarium-stocking-calculator.svc.julienika.cz — every route
  (home, `/stocking-calculator`, `/tank-volume-calculator`,
  `/fish-species-reference`, `/ads.txt`, `/sitemap.xml`, `/robots.txt`)
  independently confirmed 200 via curl, three other live host sites
  confirmed unaffected. SEO review via curl (sitemap/robots correct,
  per-page titles/descriptions distinct, FAQPage JSON-LD present).
  julienika-home hub page and sitemap index updated, pushed, redeployed,
  and independently verified live. Full detail in `svc-lab/GOALS.md`'s
  own progress log for this date.
