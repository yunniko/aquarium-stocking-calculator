import type { Metadata } from "next";
import Link from "next/link";
import { FISH_SPECIES_REFERENCE } from "@/lib/fish-species-reference";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Freshwater Fish Species Reference Chart",
  description:
    "Sourced adult size, minimum tank size, minimum group size, relative bioload, and temperament for common freshwater aquarium species.",
};

const FAQ = [
  {
    question: "Where does this data come from?",
    answer:
      "WebSearch-result synthesis cross-corroborated across multiple established fishkeeping sources per species (Aquarium Co-Op, fishlore.com, Chewy, PetMD, and several other specialist care-guide sites) — not a single primary document read directly. See this project's docs/domain-reference.md for the full sourcing review, and lib/fish-species-reference.ts's own header comment for the full source list and honesty notes.",
  },
  {
    question: "Why do minimum tank sizes here differ from other sites?",
    answer:
      "Sources genuinely disagree on several species (e.g. common goldfish: 30-40 gallons cited; oscar: 55-75 gallons cited). Where they disagreed, this table generally used the more conservative (larger) commonly-cited figure and says so in that species' own note — it never presents a disputed number as settled fact.",
  },
  {
    question: "What is \"bioload factor\" and how precise is it?",
    answer:
      "A directional multiplier representing how much waste a species produces relative to an average community fish of the same body length — synthesized from qualitative descriptions found during research (e.g. \"produces waste equivalent to about four medium community fish\"), not a lab-measured ammonia output coefficient. No authoritative numeric bioload database exists for community fishkeeping species; treat these as relative comparisons within this table, not absolute figures.",
  },
  {
    question: "What does \"minimum group size\" mean?",
    answer:
      "For schooling species, the smallest group size below which the fish reliably shows stress (clamped fins, faded color, hiding, or shortened lifespan) from perceived predation risk. It's a welfare guideline, independent of tank bioload capacity — a schooling species kept below this number is a problem even in an otherwise lightly stocked tank.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">Freshwater Fish Species Reference Chart</h1>
      <p className="mt-3 text-gray-600">
        Sourced adult size, minimum tank size, minimum group size, relative bioload, and
        temperament for {FISH_SPECIES_REFERENCE.length} common freshwater species.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 pr-4">Species</th>
              <th className="py-2 pr-4">Adult size</th>
              <th className="py-2 pr-4">Min. tank</th>
              <th className="py-2 pr-4">Min. group</th>
              <th className="py-2 pr-4">Bioload</th>
              <th className="py-2">Temperament</th>
            </tr>
          </thead>
          <tbody>
            {FISH_SPECIES_REFERENCE.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 font-medium">
                  {s.name}
                  <p className="mt-1 text-xs font-normal text-gray-500">{s.note}</p>
                </td>
                <td className="py-2 pr-4">{s.adultSizeInches}in</td>
                <td className="py-2 pr-4">{s.minTankGallons} gal</td>
                <td className="py-2 pr-4">{s.minGroupSize > 1 ? s.minGroupSize : "—"}</td>
                <td className="py-2 pr-4">{s.bioloadFactor}x</td>
                <td className="py-2 capitalize">{s.temperament}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Retrieved via web research and cross-corroborated across multiple independent
        fishkeeping sources, cited in this project&rsquo;s{" "}
        <code className="mx-1 rounded bg-gray-100 px-1">
          lib/fish-species-reference.ts
        </code>{" "}
        (see also{" "}
        <code className="mx-1 rounded bg-gray-100 px-1">docs/domain-reference.md</code> for the
        domain-expert review) — not independently re-measured for every species. Use the{" "}
        <Link href="/stocking-calculator" className="underline">
          stocking calculator
        </Link>{" "}
        to apply these values to your own tank.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-gray-900">{item.question}</dt>
              <dd className="mt-1 text-gray-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
