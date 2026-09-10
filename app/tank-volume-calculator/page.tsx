import type { Metadata } from "next";
import Link from "next/link";
import { TankVolumeCalculatorForm } from "../_components/tank-volume-calculator-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Aquarium Tank Volume Calculator",
  description:
    "Calculate a rectangular or cylindrical aquarium's gross and estimated usable water volume in gallons and liters.",
};

const FAQ = [
  {
    question: "How is gross volume calculated?",
    answer:
      "Exact geometry: length x width x height for a rectangular tank, or pi x radius² x height for a cylinder. Cubic inches convert to US gallons by dividing by 231 (the exact legal definition of a US gallon), and gallons convert to liters by multiplying by 3.785411784 (the exact US-gallon-to-liter conversion).",
  },
  {
    question: "Why is my tank's \"usable\" volume less than its gross volume?",
    answer:
      "A tank is never filled to the rim, and substrate, decor, a heater, and a filter's intake and media all displace water beyond the empty-tank geometry. This calculator estimates usable volume as 90% of gross volume, a commonly cited fishkeeping rule of thumb — not a physical constant. A tank with deep substrate or large decor has meaningfully less usable water than this estimate; treat it as a planning aid, not an exact figure.",
  },
  {
    question: "Why doesn't a \"10-gallon\" tank compute as exactly 10 gallons?",
    answer:
      "Manufacturer size names are marketing round numbers, not the tank's exact glass volume. A standard 10-gallon tank's real dimensions (20 x 10 x 12 inches) come out to about 10.4 gross gallons by the geometry above — and less once you subtract substrate and decor. This is normal and applies to most rated tank sizes, not just 10-gallon tanks.",
  },
  {
    question: "Does this support bowfront, hexagon, or other irregular shapes?",
    answer:
      "Not yet — only rectangular and cylindrical tanks have exact, unambiguous geometry formulas. For a bowfront, hexagon, or other irregular shape, check the manufacturer's own published volume rather than estimating from this calculator.",
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

      <h1 className="text-3xl font-semibold">Aquarium Tank Volume Calculator</h1>
      <p className="mt-3 text-gray-600">
        Enter your tank&rsquo;s dimensions to get its gross and estimated usable water volume.
      </p>

      <div className="mt-6">
        <TankVolumeCalculatorForm />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Use the result in gallons with the{" "}
        <Link href="/stocking-calculator" className="underline">
          stocking calculator
        </Link>{" "}
        to estimate a stocking level for this tank.
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
