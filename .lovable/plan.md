# Phase 52 / Batch B1 — Figma Foundation Variables (PLAN ONLY)

Target file: `ABox Design System — Library`. Proof file `ABox Proof — Scratch` is never touched. Nothing under `src/**` changes.

## Blocking discrepancy to resolve before implementation

The B0 page list already created and validated in Figma (and recorded in `tools/figma-plugin/tokens.js`, `library.pages`) is:

```text
00 Foundations · 01 Components · 02 Patterns · 03 Shells · 04 Experiences · 05 Screens · 06 Documentation
```

Section 1 of this request lists a different set:

```text
00 Foundations · 01 Brand · 02 Components · 03 Patterns · 04 Shells · 05 Screens · 06 Documentation
```

B1 does not create or rename pages, and Section 2 forbids page changes, so this plan keeps the existing B0 page list as the verification baseline (item 30 checks the seven B0 pages at indices 0–6, empty). If the new list is the intended library structure, it needs its own approved page-rename batch before or after B1 — it is not silently applied here.

## Files inspected (read-only)

- `src/styles.css` — `:root`, `.dark`, `@theme inline --color-*`, `--radius-*`, `--shadow-*`
- `src/components/abox/surface.tsx` (`SURFACE_PADDING`), `control.tsx`, `status-badge.tsx`, `metal-badge.tsx`
- `src/components/abox/marketplace-shell.tsx`, `internal-shell.tsx`, `member-shell.tsx`, `marketplace-page-layout.ts` (max-widths)
- `tools/figma-plugin/*` (existing plugin, tokens, build)

## Files modified / generated

Modified: `tools/figma-plugin/extract-b1.mjs`, `tokens-b1.js` (regenerated data), `plugin.js`, `ui.html`, `README.md`.
Generated: `tools/figma-plugin/code.js` via `node build.mjs` only — never hand-edited.
No other file in the repository changes.

## Implementation sequence

1. **Extraction** — `extract-b1.mjs` parses `src/styles.css` and the named component sources, converts every `oklch()` literal to sRGB, and emits `tokens-b1.js` as a pure data module (no `src/` import at plugin runtime). Each colour entry carries its original `oklch()` literal string for the Figma variable description.
2. **Collections** — nine collections, each with exactly the modes `Light` and `Dark`; the Figma default mode is renamed to `Light` and a second mode `Dark` added. No `Default` mode anywhere, including `ABox/Elevation`.
3. **Variables** — created per the approved inventory below.
4. **Verification** — `verifyVariables()` runs the 31 checks and prints the final result line.
5. **Build** — `node build.mjs` regenerates `code.js`.

## Collection + variable inventory

| Collection | Type | Contents |
| --- | --- | --- |
| `ABox/Color/Primitive` | COLOR | one variable per distinct production primitive role path from `:root`/`.dark`; `--color-` stripped, path preserved (`chart/1`); a Light/Dark literal difference stays ONE variable with two mode values; no `.dark` override means Light value copied into Dark |
| `ABox/Color/Semantic` | COLOR | exactly 54 variables — every `--color-*` role declared in the two `@theme inline` blocks of `src/styles.css` (see resolved inventory below); `ink` is NOT included |
| `ABox/Status` | COLOR | tones `sage`, `primary`, `amber`, `red`, `sky`, `neutral` aliased to semantic; 12 metal variables (`metal/{platinum,gold,silver,bronze,iron,lead}` and each `-fg`) aliased per production mapping |
| `ABox/Spacing` | FLOAT | `surface/none 0`, `surface/sm 16`, `surface/md 20`, `surface/lg 24` |
| `ABox/Radius` | FLOAT | `sm 6`, `md 10`, `lg 14`, `xl 18`, `2xl 22`, `3xl 28`, `4xl 36`, `base 14`, `full 9999` |
| `ABox/Border` | FLOAT | `hairline 1`, `ring 2` |
| `ABox/Elevation` | FLOAT + COLOR | per family (`card`, `elevated`, `drawer`, `plate`, `glow`) and per actual layer `i`: `{family}/{i}/{x,y,blur,spread}` FLOAT and `{family}/{i}/tint` COLOR; both modes populated, Light/Dark differences preserved independently |
| `ABox/Layout` | FLOAT | `container/wide 1408`, `container/shell 1500` |
| `ABox/Control sizing` | FLOAT | `height/md 40`, `height/lg 44`, `padding-x 12`, `min-touch-target 44` |

Non-colour collections carry identical values in both modes. No STRING or BOOLEAN variables.

## Resolved semantic inventory (exact)

`src/styles.css` declares `--color-*` roles in two `@theme inline` blocks:

- Block 1, lines 32–79 — 48 roles: `background`, `foreground`, `surface`, `surface-foreground`, `panel`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `primary-soft`, `secondary`, `secondary-foreground`, `sage`, `sage-foreground`, `sage-soft`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `warning`, `warning-foreground`, `info`, `info-foreground`, `success`, `success-foreground`, `border`, `border-strong`, `hairline`, `input`, `ring`, `ring-offset-background`, `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `sidebar`, `sidebar/foreground`, `sidebar/primary`, `sidebar/primary-foreground`, `sidebar/accent`, `sidebar/accent-foreground`, `sidebar/border`, `sidebar/ring`
- Block 2, lines 473–480 — 6 roles: `ai`, `ai-foreground`, `surface-1`, `surface-2`, `surface-3`, `brand-accent`

**Exact semantic count: 54.** `ink` is excluded — production declares `--ink` only as a `:root`/`.dark` primitive (lines 100 and 185) with no `--color-ink` theme role, so it belongs to `ABox/Color/Primitive` and must not be duplicated into the Semantic collection. The earlier "48 plus ink" wording is superseded by this resolved list.

Recorded discrepancy: the approved inventory figure of 48 covers Block 1 only. This plan treats the production source as authoritative and includes Block 2's 6 roles, bringing the total to 54. If the 6 Block-2 roles are meant to be excluded, say so before implementation.

Each variable's source declaration is the `--color-<name>: var(--<token>)` line above; the referenced token's `:root` and `.dark` declarations supply the Light and Dark mappings.

## Alias strategy — source-mapping authoritative

Aliasing is derived from the production declaration graph in `src/styles.css`, never from colour-value equality.

- A semantic variable aliases a primitive only when the production source explicitly maps it: `--color-X: var(--Y)` and `--Y` is a declared primitive role. The alias target is `--Y`, resolved separately for `Light` (`:root`) and `Dark` (`.dark`).
- Two distinct production roles that happen to resolve to identical oklch/sRGB literals remain two distinct variables. Equal values never imply an alias.
- Where a role's Light and Dark declarations reference different primitives, each mode gets its own alias independently.
- Where a role resolves through `color-mix(in oklch, …)` or another unsupported runtime computation, no alias and no hard-coded approximation is written; it is recorded as a runtime-computed limitation with its verbatim production source line.
- Status tones and the 12 metal variables alias according to their actual production source mapping in `status-badge.tsx` / `metal-badge.tsx` and the tokens they reference — again never by colour equality.
- A raw sRGB value is written only where production declares a literal directly at that role; every such case is reported as a mapping exception in the verification output.

## Recorded limitations (never silently approximated)

- `oklch()` → sRGB conversion; original literal preserved in each variable description.
- `color-mix(in oklch, …)` — no fabricated static variable; recorded as runtime-computed with its production source reference in the verification output.
- Composite `box-shadow` — decomposed only; Effect Styles are later work.
- Decorative utilities (`noise-field`, `contour`, `aurora`, `glass`, `ember-underline`, `card-brackets`, `edge-sheen`), motion keyframes, and responsive breakpoints are not variables.

## Idempotency

Collections and variables match by exact name. Existing ones are reused/updated in place, ids preserved. Duplicate collection → STOP with a duplicate-collection error. Type mismatch → STOP with a type-mismatch error. Nothing outside the approved inventory is deleted.

## Verification (`b1-verify`)

Implements all 31 listed checks — collection count/modes, per-variable existence, `resolvedType`, one primitive per role path, independent Light/Dark comparison against `:root` and `.dark`, 48 semantic roles, alias correctness, 6 tones + 12 metals, exact numeric matches for Spacing/Radius/Border/Layout/Control sizing, 5 variables per elevation layer with both modes and no `Default`, no extra variables in B1 collections, no runtime/tenant/branding values, and unchanged counts of text styles, effect styles, components, component sets and variants against a pre-run baseline, plus B0 pages at indices 0–6 and empty.

Output includes per-collection variable counts, collection ids, per-variable ids, structural summary, mapping exceptions/limitations, and exactly one of `RESULT: B1 PASSED` or `RESULT: B1 FAILED — do not proceed to B2.`

## Run 1 / Run 2

Run 1: file-isolation guard → B0 page validation → create/reuse collections → create/update variables → verify → must end `RESULT: B1 PASSED`.
Run 2: identical operation; every line must read `reused` or `updated`, zero collections and zero variables created, all ids identical to Run 1, B0 pages unchanged — must also end `RESULT: B1 PASSED`.

## Safeguards

`requireFile("ABox Design System — Library")` rejects any other file. The plugin reads no `src/` module at runtime. After implementation, `git diff --stat -- src/` is checked and must be empty, and `code.js` is confirmed regenerated through `build.mjs`.

## Out of scope

B2 Typography and all later batches, text/effect styles, components, component sets, variants, patterns, shells, screens, documentation content, library publishing, and any application change.
