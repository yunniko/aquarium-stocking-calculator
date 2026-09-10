# aquarium-stocking-calculator — project conventions

Read `HANDOVER.md` first: current state, decision record (especially the
bioload-model sourcing caveat and the domain-expert review outcome), next
steps. Goal in `GOALS.md` (G-001). Parent initiative in
`E:\CLAUDE\projects\svc-lab\`; company-wide standards in
`E:\CLAUDE\COMPANY\`.

- Stack: Next.js App Router, TypeScript, Tailwind. No database, no auth,
  no accounts.
- `lib/fish-species-reference.ts` holds the sourced per-species data
  (adult size, minimum tank size, minimum group size, relative bioload
  factor, temperament) that both the stocking calculator and the species
  reference page draw from — sourced and cited in the file's own header
  comment (see HANDOVER.md's decision record). Don't change a figure
  without re-checking it against a real source; the bioload factors are
  explicitly a directional synthesis, not a lab-measured coefficient — see
  the file's own honesty notes before treating them as more precise than
  they are.
- `lib/stocking-calculator.ts` is the bioload math (species-adjusted
  extension of the classic "inch per gallon" rule) plus two independent
  floor checks (minimum tank size, minimum group size) that can trigger
  regardless of the bioload percentage — don't collapse those into the
  percentage itself, they represent different real risks.
- `lib/tank-volume-calculator.ts` is exact geometry plus exact unit
  conversions (231 in³/gallon, 3.785411784 L/gallon) — the only
  rule-of-thumb figure in that file is the 90% usable-volume estimate,
  which is disclosed as an estimate, not fact.
- `npm install`/`npm ci` need `--legacy-peer-deps` (a live npm/arborist
  bug, not specific to this project — see `svc-lab/HANDOVER.md`).
- Two test layers: `npx vitest run` (unit) and `npx playwright test`
  (e2e — real browser flows for all three tools). Both must pass before
  calling a change done; also run `npm run build` — it catches
  server/client boundary bugs the others don't.
- See `E:\CLAUDE\COMPANY\INFRASTRUCTURE_DEPLOY.md` for the redeploy
  command once live.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
