# Domain reference — freshwater aquarium stocking & bioload

Domain-expert review, 2026-09-10. Domain: freshwater aquarium fishkeeping —
bioload/waste biology, adult sizing, minimum tank requirements, schooling
welfare, temperament/compatibility. Advisory review (Read/Grep/WebSearch/
WebFetch only) — findings verified and acted on by the shipping session
before this project went live; this file is the record of what was found
and what was done about it, not an unfiltered transcript.

**Bottom line from the review: do not ship as-is.** The geometry/unit layer
(`lib/tank-volume-calculator.ts`) was exact and correct as originally
written. The bioload model had a structural error that made it
systematically *reassuring* for exactly the large, messy species where
overstocking causes real welfare harm, and the header comment overclaimed
what the model actually did. All findings below were triaged and the
critical/high ones fixed before shipping — see the "Disposition" line under
each.

## Sourcing note

Most fishkeeping "authority" is hobbyist secondary literature, not primary
research. The review distinguished peer-reviewed sources (named), hobbyist
consensus (labelled as such), and recalled-but-uncited domain knowledge
(flagged "verify"). WebFetch was denied for this project's own research and
for the review itself (confirmed via one direct attempt), so figures come
from WebSearch-snippet synthesis, cross-corroborated across multiple
sources per claim where possible.

## Critical findings

**1. The bioload model was linear in fish length; real waste production
scales roughly with length^2.25–2.67 (metabolic-scaling physiology,
Jerde et al. 2019; aquaculture ammonia-excretion allometry).** The original
factor spread (0.25–1.8, a 7x range) badly understated the real per-fish
disparity between a neon tetra and an oscar or common pleco (100x+ by
physiology). Concretely, the review computed: 4 oscars in a 75-gallon tank
read "83% moderate" with no warnings under the original model — a false
reassurance in exactly the scenario a stocking tool exists to catch.

**Disposition: fixed.** A literal `length^2.25` exponent was tried and
rejected — across this table's real size range (1.2in shrimp to 20in common
pleco) no single global calibration keeps both small and giant fish reading
sensibly (see `lib/stocking-calculator.ts`'s header comment for the full
reasoning). Instead: kept the linear-per-inch model but substantially
raised `bioloadFactor` for oscar (1.3→5), common pleco (1.6→5), and common
goldfish (1.8→3), and lowered bristlenose pleco (1.3→1.1) so it's no longer
implausibly equal to oscar. Re-verified: 4 oscars in 75 gallons now reads
"overstocked" (see the regression test in `tests/unit/stocking-calculator.spec.ts`).
Added an explicit FAQ entry and header-comment caveat: the percentage is
most reliable for small-to-medium fish; for anything above ~6 inches, the
(now quantity-scaled) minimum tank size is the authoritative check.

**2. `minTankGallons` never scaled with quantity** — a single-oscar floor
applied even to 4 oscars. **Disposition: fixed.** Added
`additionalGallonsPerFish` to every species entry (values informed by the
prose already in each note, e.g. goldfish "+10-15/additional" → 12; oscar
"2 needs ~125" → +50); `belowMinTankSize` now compares against
`minTankGallons + (quantity - 1) x additionalGallonsPerFish`.

## High-severity findings

**3. Cherry shrimp bioload factor was ~6-10x too high** against a
documented optimal density of ~10 shrimp/gallon for *Neocaridina*.
**Disposition: fixed** — factor lowered 0.25→0.07;
`additionalGallonsPerFish` (0.1) derived directly from the 10/gal figure.

**4. Goldfish "3x ammonia per body weight" was an unsourced folk figure**
stated as fact — no primary source found, only forum threads debating it.
**Disposition: fixed** — removed; kept the well-grounded parts (agastric,
near-continuous excretion, needs strong filtration).

**5. No temperature-incompatibility or predation flag for goldfish +
tropicals/small fish/shrimp.** **Disposition: fixed** — note now states
goldfish are temperate (65-75F) vs. 75-82F for tropicals, and that an adult
goldfish can eat small fish/shrimp.

## Medium-severity findings

**6. Tiger barb `minGroupSize` was 6; sources specifically say aggression
redirects onto tankmates below a full school of 8.** **Disposition: fixed**
— raised to 8.

**7. Livebearer (guppy/platy/molly) notes covered breeding only as a
bioload issue, not the sourced 1-male-to-2+-female ratio welfare
guidance** (a 1:1 pair causes chronic harassment of the female).
**Disposition: fixed** — added to all three notes.

**8. Common pleco's minimum tank size (75 gal) was presented without the
same "sources disagree, we picked conservative" framing every other
contested species gets**, despite the widest three-way split (55/75/100+).
**Disposition: fixed** — raised to 100 gal, framing added to match project
policy.

**9. "Understocked" (blue) was the wrong word for &lt;70%** — a lightly
stocked tank isn't deficient, and the label read as a nudge to add fish in
exactly the reassuring-large-fish scenario Finding 1 covers.
**Disposition: fixed** — renamed to "lightly stocked" throughout the lib,
UI, and tests.

## Low-severity findings — fixed

- Zebra danio adult size understated (1.5in → 2in) and no fin-nipping note
  — both added.
- Dwarf gourami: no mention of dwarf gourami iridovirus (DGIV/ISKNV), a
  peer-reviewed disease (~22% carriage in one farmed-stock study,
  near-100% mortality once symptomatic, no cure) — added as buyer-beware
  guidance.
- Guppy adult-size note didn't reflect the ~2x male/female size difference
  — updated.
- Common pleco "peaceful" label didn't mention slime-coat rasping of
  slower tankmates or increased territoriality with age — added.
- Tank-volume-calculator page didn't specify whether to use gross or
  usable gallons as the stocking calculator's input — left as a known
  minor gap (not fixed this round; low severity, doesn't affect either
  calculator's own correctness).
- Split-row double-counting for minimum group size — **fixed** as part of
  the Finding 2 rework: rows are now merged by species id before any check
  runs, so splitting one species across two UI rows can't double-warn or
  dodge a check.
- This file's own existence resolves the dangling `docs/domain-reference.md`
  reference already present in `app/stocking-calculator/page.tsx` and
  `app/fish-species-reference/page.tsx` before this review ran.

## What was already well-grounded (no change needed)

- `lib/tank-volume-calculator.ts` — exact geometry and exact unit
  conversions (231 in³/gal, 2.54 cm/in, 3.785411784 L/gal), correctly
  described as exact rather than sourced.
- The 90% usable-volume estimate is inside a defensible 80-90% range for a
  typical tank's substrate/decor/fill-line displacement.
- The two-independent-floor-check architecture (minimum tank size,
  minimum group size, separate from the bioload percentage) was confirmed
  as "the right architecture" — the findings were about the checks being
  too weak, not the structure.
- Bioload *ordering* was defensible everywhere except shrimp and the
  oscar/bristlenose equality, both fixed above.
- Adult sizes were accurate for 12 of 15 species; the angelfish note's
  "fin span adds vertical height" framing was called out as genuine domain
  reasoning, not a shortcut.
- The sourcing-disclosure header comments (before this review) were
  called "unusually honest for this genre."

## Confidence and remaining gaps

High confidence: unit conversions/geometry (definitional), the metabolic
scaling literature, DGIV prevalence data, and the Finding 1 failure-case
arithmetic (computed directly from the code). Medium confidence: per-species
minimum tank/group sizes, where hobbyist sources genuinely disagree — the
review's specific recommendations (tiger barb 8, common pleco 100gal) are a
conservative reading of split literature, not settled fact. Low confidence:
the exact recalibrated `bioloadFactor` magnitudes (oscar=5, common
pleco=5, goldfish=3) are this project's own extrapolation, not a published
figure — no ornamental-fish bioload coefficient database exists, a gap the
review confirmed independently. If a future session gets real WebFetch
access, re-verify the recalibrated factors against known-good real
stocking lists (a well-regarded 55-gallon community tank should still land
near a sensible percentage) rather than trusting the reasoning alone.
