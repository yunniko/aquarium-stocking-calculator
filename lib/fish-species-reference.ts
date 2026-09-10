// Reference table of common freshwater aquarium species: adult size,
// minimum tank size (for one specimen; see `additionalGallonsPerFish` for
// scaling to a group), minimum group size (for obligate/strongly social
// schoolers), a relative bioload factor, and temperament. This is the table
// both the stocking calculator and the species reference page draw from.
//
// Sources: retrieved 2026-09-10 via WebSearch-result synthesis (WebFetch was
// denied this session, same known limitation documented in
// svc-lab/HANDOVER.md's research-caveat decision), cross-corroborated across
// multiple independent, established fishkeeping sources per species rather
// than trusted from any one site: Aquarium Co-Op's own care guides,
// fishlore.com's hobbyist forums and care sheets, Chewy's and PetMD's fish
// care sheets, aquariumstocking.com, aquariumstoredepot.com,
// tropicaltreasureswyo.com, oscarfishlover.com, thegoldfishtank.com,
// bettacarehub.com, modestfish.com, tankzen.co, shrimpybusiness.com, and
// aquascapeaquarium.com, among others.
//
// REVISED 2026-09-10 after a domain-expert review (full report in
// docs/domain-reference.md) found real, fixable issues — not just gaps:
//   - Cherry shrimp's bioloadFactor was ~6-10x too high against a
//     peer-reviewed documented optimal density of ~10 shrimp/gallon for
//     Neocaridina — lowered, and `additionalGallonsPerFish` for shrimp is
//     derived directly from that same 10/gal figure (1/10 = 0.1 gal/shrimp).
//   - Oscar and common pleco's bioload factors were far too low relative to
//     real metabolic-scaling physiology (waste production scales with body
//     length to roughly the 2.25-2.67 power, not linearly — see
//     lib/stocking-calculator.ts's header comment for the full reasoning
//     and why this table still uses a linear-per-inch model with a wider
//     factor spread rather than a literal exponent) — raised substantially,
//     alongside common goldfish. Bristlenose pleco's factor was lowered
//     slightly so it's no longer implausibly equal to oscar's.
//   - Tiger barb's minimum group size was raised from 6 to 8 (sources
//     specifically describe aggression redirecting onto tankmates below a
//     full school of 8).
//   - Common pleco's minimum tank size was raised from 75 to 100 gallons —
//     sources are genuinely split three ways (55/75/100+), and for a fish
//     that reaches 18-24in+, the more conservative 100-gallon figure is the
//     more defensible pick; the note now says so explicitly, matching this
//     table's stated policy for every other contested figure.
//   - Common goldfish's note previously repeated an unsourced "roughly 3x a
//     tropical fish's ammonia excretion rate per body weight" figure with
//     no traceable primary source — removed. Added an explicit
//     temperature-incompatibility note (goldfish are temperate, 65-75F,
//     vs. 75-82F for most tropicals in this table) and a predation-risk
//     note (an adult goldfish can eat small fish and shrimp), neither of
//     which this table previously flagged.
//   - Zebra danio's adult size was understated (1.5in vs. 2-2.5in across
//     several independent guides) — raised to 2in, and a fin-nipping note
//     (toward slow, long-finned tankmates) was added.
//   - Dwarf gourami's note previously omitted dwarf gourami iridovirus
//     (DGIV/ISKNV), a real, peer-reviewed, no-cure disease with meaningful
//     prevalence in farmed/imported stock — added.
//   - Guppy/platy/molly notes previously framed livebearer breeding purely
//     as a bioload concern — added the sourced 1-male-to-2-or-more-female
//     ratio welfare guidance (a 1:1 ratio causes chronic harassment/stress
//     for the female), and guppy's adult size note now reflects the real
//     ~2x male/female size difference instead of one blended figure.
//
// IMPORTANT caveats surfaced by the research itself, not just this
// project's own hedging:
// 1. Sources meaningfully DISAGREE on minimum tank size for several species
//    (e.g. neon tetra: 10-20 gal; common goldfish: 30-40 gal; common pleco:
//    55-100+ gal; oscar: 55-75 gal, with 75 the current consensus and 55
//    called explicitly outdated by more recent guides). Where sources
//    disagreed, this table generally picked the more conservative (larger)
//    commonly-cited figure and says so in that species' own note — never
//    presents a disputed number as uncontested.
// 2. `bioloadFactor` is a DIRECTIONAL relative multiplier, not a
//    peer-reviewed, lab-measured ammonia/waste output coefficient — no
//    authoritative numeric bioload database exists for community
//    fishkeeping species (confirmed by both this table's original research
//    and the 2026-09-10 domain-expert review's own search). Treat it as a
//    rough relative comparison between species in this table, not an
//    absolute number. See lib/stocking-calculator.ts for how it's used and
//    what it deliberately does NOT model.
// 3. Adult size for some species (mollies, plecos, goldfish) varies widely
//    by variety/strain — this table uses a representative figure for the
//    common/standard form and flags major variants in the note.
// 4. Several specific figures below (adult sizes not otherwise cited, fin-
//    nipping/slime-coat-rasping behavior, goldfish physiology) are recalled
//    domain knowledge the review flagged as "uncited — verify" rather than
//    a source it could name directly; they're included because they matter
//    for user safety/welfare, but treat them as slightly lower-confidence
//    than the directly-cited figures elsewhere in this table.

export type FishTemperament = "peaceful" | "semi-aggressive" | "aggressive";

export interface FishSpeciesEntry {
  id: string;
  name: string;
  category: "fish" | "invertebrate";
  adultSizeInches: number;
  minTankGallons: number;
  /** Additional gallons recommended per fish beyond the first, when keeping more than one. A rough, source-informed increment, not a precise per-species study. */
  additionalGallonsPerFish: number;
  minGroupSize: number;
  bioloadFactor: number;
  temperament: FishTemperament;
  note: string;
}

export const FISH_SPECIES_REFERENCE: FishSpeciesEntry[] = [
  {
    id: "neon-tetra",
    name: "Neon Tetra",
    category: "fish",
    adultSizeInches: 1.5,
    minTankGallons: 10,
    additionalGallonsPerFish: 1,
    minGroupSize: 6,
    bioloadFactor: 0.7,
    temperament: "peaceful",
    note: "Sources disagree on the exact floor — some hobbyist forums cite 10 gallons as a practical minimum for a school of 6, while other care guides recommend 15-20 for better long-term water stability; this table uses the more commonly cited 10-gallon figure. Must be kept in a group of 6 or more: smaller schools show clamped fins, faded color, hiding, and shortened lifespan from perceived predation risk. Some current guides recommend 8+ for a fuller, more secure-feeling school — 6 remains a widely-cited practical floor, but more tank length matters more here than the extra 2 fish.",
  },
  {
    id: "guppy",
    name: "Guppy",
    category: "fish",
    adultSizeInches: 1.8,
    minTankGallons: 10,
    additionalGallonsPerFish: 1,
    minGroupSize: 1,
    bioloadFactor: 0.8,
    temperament: "peaceful",
    note: "Males run smaller (~1.2in) and females noticeably larger (~1.8-2.4in) — this table uses a representative figure closer to the female size most commonly kept in numbers. Livebearers that breed readily; a small starting group can quietly outgrow a tank's bioload capacity within months if fry aren't managed. Keep at least 1 male to 2-3 females, not a 1:1 ratio — a lone female receiving constant mating attention from a single male shows chronic stress and can die prematurely from the harassment alone, independent of tank size.",
  },
  {
    id: "platy",
    name: "Platy",
    category: "fish",
    adultSizeInches: 2,
    minTankGallons: 15,
    additionalGallonsPerFish: 2,
    minGroupSize: 1,
    bioloadFactor: 0.85,
    temperament: "peaceful",
    note: "Another livebearer — expect ongoing fry from a mixed-sex group, which adds to bioload over time even though this table's number is per adult. Same welfare guidance as guppies: keep at least 1 male to 2+ females rather than a 1:1 pair, to avoid one female being over-harassed.",
  },
  {
    id: "molly",
    name: "Molly",
    category: "fish",
    adultSizeInches: 4,
    minTankGallons: 20,
    additionalGallonsPerFish: 3,
    minGroupSize: 1,
    bioloadFactor: 1.1,
    temperament: "peaceful",
    note: "\"Molly\" covers several sizes — short-fin common mollies run smaller, sailfin mollies noticeably larger (up to 5-6in) and need more room than this table's representative figure. Also a livebearer; a mixed-sex group breeds continuously — use the same 1 male to 2+ female ratio guidance as guppies and platies to avoid over-harassing a single female.",
  },
  {
    id: "betta",
    name: "Betta (Siamese fighting fish)",
    category: "fish",
    adultSizeInches: 2.75,
    minTankGallons: 5,
    additionalGallonsPerFish: 15,
    minGroupSize: 1,
    bioloadFactor: 0.9,
    temperament: "semi-aggressive",
    note: "Sources range from a bare 2.5 gallons up to 10+ gallons as \"minimum\"; this table uses 5 gallons, commonly cited as the floor for stable temperature and water chemistry, matching current consensus. Territorial, especially toward other bettas (never house two males together) and toward long-finned or brightly colored tankmates that can trigger flaring. Keeping more than one betta isn't primarily a volume question this table's per-fish gallon increment can capture — males will often fight regardless of tank size, and even a divided or heavily planted multi-betta setup needs real experience and close monitoring, not just more gallons.",
  },
  {
    id: "zebra-danio",
    name: "Zebra Danio",
    category: "fish",
    adultSizeInches: 2,
    minTankGallons: 20,
    additionalGallonsPerFish: 1.5,
    minGroupSize: 6,
    bioloadFactor: 0.8,
    temperament: "peaceful",
    note: "A fast, active swimmer that needs horizontal swimming room, which is why the minimum tank size (a 20-gallon long, not just 20 gallons of any shape) is driven more by footprint than by bioload. Keep in a school of 6 or more. Generally a good community fish, but a documented occasional fin-nipper toward slow-moving, long-finned tankmates (e.g. bettas, fancy guppies, angelfish) — watch new introductions.",
  },
  {
    id: "corydoras",
    name: "Corydoras Catfish (medium species, e.g. panda/julii)",
    category: "fish",
    adultSizeInches: 2.2,
    minTankGallons: 20,
    additionalGallonsPerFish: 2,
    minGroupSize: 6,
    bioloadFactor: 0.7,
    temperament: "peaceful",
    note: "Covers medium corydoras species specifically (panda, trilineatus, julii, ~2-2.2in). Dwarf species (pygmy, habrosus, hastatus, ~1-1.2in) are smaller and not separately listed here — don't apply this row's numbers to them. Peaceful bottom-dwelling schooler; keep in a group of 6 or more.",
  },
  {
    id: "angelfish",
    name: "Freshwater Angelfish",
    category: "fish",
    adultSizeInches: 6,
    minTankGallons: 29,
    additionalGallonsPerFish: 9,
    minGroupSize: 1,
    bioloadFactor: 1.2,
    temperament: "semi-aggressive",
    note: "6in is body length — fin span can add well over a foot of vertical height, so a tall tank matters as much as gallons. 29 gallons is commonly cited as a floor for a single adult or pair; a school of 4+ angelfish is more often recommended at 55+ gallons (the per-fish increment used here approximates that jump). A cichlid at heart: can turn territorial, especially when breeding, and may prey on fish or shrimp small enough to fit in its mouth (e.g. neon tetras, cherry shrimp).",
  },
  {
    id: "dwarf-gourami",
    name: "Dwarf Gourami",
    category: "fish",
    adultSizeInches: 3,
    minTankGallons: 10,
    additionalGallonsPerFish: 5,
    minGroupSize: 1,
    bioloadFactor: 1,
    temperament: "semi-aggressive",
    note: "Can survive at 10 gallons but sources consistently recommend 20+ for better quality of life, plus roughly 5 more gallons per additional fish. Can become territorial toward its own species or similarly shaped/colored fish in a tank on the smaller side. Buyer-beware note not about tank size: dwarf gourami iridovirus (DGIV), a real, peer-reviewed, incurable viral disease, has been documented in a meaningful share of farmed/imported stock (~22% in one Singapore-farm study) with near-total mortality once symptoms appear — quarantine new fish and buy from a source you trust, since no tank size fixes this.",
  },
  {
    id: "tiger-barb",
    name: "Tiger Barb",
    category: "fish",
    adultSizeInches: 2.5,
    minTankGallons: 30,
    additionalGallonsPerFish: 2,
    minGroupSize: 8,
    bioloadFactor: 1.2,
    temperament: "semi-aggressive",
    note: "30 gallons is cited for a full school of 8, which this table treats as the real minimum group size — sources are specific that keeping fewer redirects this species' natural aggression onto tankmates rather than within the school itself. A well-known fin-nipper even at a full school size — incompatible with slow-moving, long-finned fish (e.g. bettas, fancy guppies) and with shrimp.",
  },
  {
    id: "bristlenose-pleco",
    name: "Bristlenose Pleco",
    category: "fish",
    adultSizeInches: 4.5,
    minTankGallons: 20,
    additionalGallonsPerFish: 10,
    minGroupSize: 1,
    bioloadFactor: 1.1,
    temperament: "peaceful",
    note: "Males can reach 5in. 20 gallons is a commonly cited single-fish floor; a male/female pair is more often recommended at 30+ gallons. Peaceful toward other species but can be territorial toward its own kind over hiding spots. Meaningfully messier than a similarly sized community fish, but much less so than a common pleco — don't confuse the two when buying (see the common pleco entry).",
  },
  {
    id: "common-pleco",
    name: "Common Pleco",
    category: "fish",
    adultSizeInches: 20,
    minTankGallons: 100,
    additionalGallonsPerFish: 25,
    minGroupSize: 1,
    bioloadFactor: 5,
    temperament: "peaceful",
    note: "Frequently sold small (~2in) in a generic \"algae eater\" tank, but reaches 18-24in+ as an adult. Sources are genuinely split on the real minimum tank size (55/75/100+ gallons all cited) — this table uses the more conservative 100-gallon figure given how large and messy this fish gets; a fish this size reliably outgrows a 55-gallon tank within a few years, and even 75 gallons is contested as too tight by several sources. Check adult size before buying, not just what's in the store tank. A heavy, messy bottom feeder whose waste output some sources compare to roughly ten large tetras; adults can also rasp the slime coat of slower, flat-bodied tankmates (e.g. angelfish, discus, goldfish) and can become more territorial with age.",
  },
  {
    id: "oscar",
    name: "Oscar",
    category: "fish",
    adultSizeInches: 12,
    minTankGallons: 75,
    additionalGallonsPerFish: 50,
    minGroupSize: 1,
    bioloadFactor: 5,
    temperament: "aggressive",
    note: "Reaches 10-14in typically, some individuals larger. 75 gallons is the current consensus minimum for a single adult; an older, still commonly repeated figure of 55 gallons is now explicitly called outdated by more recent care guides, and some sources recommend 100+. A territorial cichlid that will eat fish and invertebrates small enough to fit in its mouth — not a community-tank fish. A single oscar produces disproportionately more waste than its length alone suggests (large carnivorous cichlids are messy, heavy eaters), which this table's bioload factor reflects with a substantially higher-than-average per-inch weighting.",
  },
  {
    id: "common-goldfish",
    name: "Common/Comet Goldfish",
    category: "fish",
    adultSizeInches: 14,
    minTankGallons: 40,
    additionalGallonsPerFish: 12,
    minGroupSize: 1,
    bioloadFactor: 3,
    temperament: "peaceful",
    note: "Single-tail (common/comet/shubunkin) goldfish reach 12-18in in a large enough tank or pond — this is not a bowl fish. Sources disagree on the exact minimum (30-40 gallons cited for the first fish); this table uses the more conservative 40 gallons, plus roughly 10-15 more per additional fish. Goldfish lack a true stomach and feed/excrete almost continuously, needing strong filtration regardless of the bioload percentage below. Two compatibility issues not captured by the temperament label: goldfish are cold-water/temperate fish (comfortable around 65-75F) rather than tropical (most fish in this table want 75-82F), making most of this table poor tankmates on temperature grounds alone; and an adult goldfish is large enough to eat small fish and shrimp it can fit in its mouth.",
  },
  {
    id: "cherry-shrimp",
    name: "Cherry Shrimp",
    category: "invertebrate",
    adultSizeInches: 1.2,
    minTankGallons: 5,
    additionalGallonsPerFish: 0.1,
    minGroupSize: 1,
    bioloadFactor: 0.07,
    temperament: "peaceful",
    note: "A single shrimp can live in as little as 5 gallons; a breeding colony is more often recommended at 20+ gallons. A documented healthy density for Neocaridina shrimp (the common \"cherry shrimp\" species) is around 10 shrimp per gallon in a mature, planted tank — this table's per-shrimp gallon increment is derived directly from that figure. Produces minimal bioload for its size, but is itself vulnerable prey to many semi-aggressive or larger fish (tiger barbs, angelfish, goldfish, and others in this table) — check predation risk separately from the bioload math below.",
  },
];
