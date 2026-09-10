import type { Metadata } from "next";
import Link from "next/link";
import { StockingCalculatorForm } from "../_components/stocking-calculator-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Freshwater Aquarium Stocking Calculator",
  description:
    "Estimate your freshwater tank's stocking level from a species-aware bioload model, with minimum-tank-size and minimum-school-size checks.",
};

const FAQ = [
  {
    question: "How is the stocking percentage calculated?",
    answer:
      "It extends the classic \"inch of fish per gallon\" rule of thumb: each species' adult size (inches) is multiplied by a relative bioload factor (how much waste it produces compared to an average community fish of the same length) and by how many you're keeping, summed across every species, then divided by your tank's gallons. 100% roughly corresponds to the classic rule's own ceiling — this tool adjusts it per species instead of treating every inch of fish as equal.",
  },
  {
    question: "Is this a scientifically precise measurement?",
    answer:
      "No — treat it as a rough starting guide, not a verdict. It doesn't model your filtration's actual capacity or maturity, water change frequency, real ammonia/nitrite/nitrate levels, plant load, feeding amount, or fish-pair aggression and territory beyond the flat temperament label shown on the species reference chart. Bioload factors themselves come from qualitative research synthesis, not lab-measured waste output — see the species reference chart's own sourcing note.",
  },
  {
    question: "Why did it warn me even though my stocking percent looks fine?",
    answer:
      "Two checks apply independently of the bioload percentage: a minimum tank size floor (driven by a species' adult size, territory, or swimming room — e.g. an oscar needs 75+ gallons no matter how low its bioload math comes out at) and a minimum group size for schooling species (a welfare issue, not a bioload issue). Either can trigger even at a low overall percentage.",
  },
  {
    question: "Does this replace testing my water?",
    answer:
      "No. A tank can read \"moderate\" here and still have an ammonia or nitrite spike if the nitrogen cycle isn't established, or if filtration/maintenance falls behind. Always test your water with a real test kit, especially when adding new fish.",
  },
  {
    question: "Is the percentage reliable for large fish (oscars, plecos, goldfish)?",
    answer:
      "Less so — treat the per-species minimum tank size (which grows with how many you keep) as the authoritative check for anything much larger than about 6 inches, not the percentage number itself. This tool's own review confirmed that no simple \"inches per gallon\"-style formula can stay accurate across the full range from shrimp to a foot-plus oscar in one number. The percentage still trends up correctly as you add more large fish, but don't read the exact figure the same way you would for a small community tank.",
  },
  {
    question: "Does this check whether my fish are compatible with each other?",
    answer:
      "Only loosely — the temperament label (peaceful/semi-aggressive/aggressive) on each species is a general flag, not a pairwise compatibility check. Research specific species combinations separately before stocking a mixed tank; the reference chart's notes call out some well-known conflicts (e.g. tiger barbs and cherry shrimp) but don't cover every combination.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
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

      <h1 className="text-3xl font-semibold">Freshwater Aquarium Stocking Calculator</h1>
      <p className="mt-3 text-gray-600">
        Enter your tank size and the fish you&rsquo;re keeping (or considering) to get a rough,
        species-aware stocking estimate.
      </p>

      <div className="mt-6">
        <StockingCalculatorForm />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Species data is sourced and cited in this project&rsquo;s{" "}
        <code className="mx-1 rounded bg-gray-100 px-1">
          lib/fish-species-reference.ts
        </code>
        (see also{" "}
        <code className="mx-1 rounded bg-gray-100 px-1">docs/domain-reference.md</code> for the
        full review) — see the{" "}
        <Link href="/fish-species-reference" className="underline">
          full species reference chart
        </Link>{" "}
        for details and sourcing notes on every species.
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
