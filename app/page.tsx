import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aquarium Stocking Calculator",
  description:
    "Free tools for freshwater fishkeepers: a species-aware stocking/bioload calculator, a tank volume calculator, and a sourced fish species reference chart.",
};

const TOOLS = [
  {
    href: "/stocking-calculator",
    title: "Stocking / bioload calculator",
    description:
      "Enter your tank size and fish list — get a rough, species-aware stocking estimate with minimum-tank-size and minimum-school-size checks.",
  },
  {
    href: "/tank-volume-calculator",
    title: "Tank volume calculator",
    description:
      "Enter your tank's dimensions (rectangular or cylindrical) — get gross and estimated usable volume in gallons and liters.",
  },
  {
    href: "/fish-species-reference",
    title: "Fish species reference chart",
    description:
      "Sourced adult size, minimum tank size, minimum group size, relative bioload, and temperament for common freshwater species.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Aquarium Stocking Calculator</h1>
      <p className="mt-3 text-gray-600">
        Free tools for freshwater fishkeepers — a species-aware stocking estimate, a tank volume
        calculator, and a sourced species reference chart.
      </p>

      <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Before you stock a tank:</strong> the stocking calculator is a rough guide based
        on a widely-used rule-of-thumb heuristic, not a scientific verdict. It doesn&rsquo;t
        replace testing your water, cycling your tank first, or researching whether your specific
        fish get along. See the{" "}
        <Link href="/stocking-calculator" className="underline">
          stocking calculator
        </Link>{" "}
        page for the full caveats.
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            data-testid={`tool-card-${tool.href.slice(1)}`}
            className="rounded-lg border border-gray-200 p-5 hover:border-gray-400"
          >
            <h2 className="font-semibold text-blue-700">{tool.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
