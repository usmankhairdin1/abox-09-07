# Phase 52 / Batch B2 — Typography Foundation (PLAN ONLY)

Target: `ABox Design System — Library`. `ABox Proof — Scratch` untouched. B0 pages unchanged, unpopulated. B1 collections/variables read-only (reused only for alias targets and the "no extra objects" checks). No `src/**` change, no app change, no B3 work.

## 1. Source-authority findings

There is **no `tailwind.config.*` file** in this project; Tailwind v4 is configured entirely through `src/styles.css`. Every typography declaration production owns lives there.

Font families — `src/styles.css` lines 27–30 (`@theme`):

```text
--font-sans:    "Inter Tight", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif
--font-display: "Bricolage Grotesque", "Inter Tight", ui-sans-serif, system-ui, sans-serif
--font-serif:   "Bricolage Grotesque", "Inter Tight", ui-sans-serif, system-ui, sans-serif
--font-mono:    "Inter Tight", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif
```

`--font-serif` and `--font-display` carry identical stacks, and `--font-mono` matches `--font-sans`. They stay **four distinct variables**: production declares four roles, and value equality is not alias evidence.

Typography roles, all declared in `src/styles.css`:

| Role | Source | Declared properties |
| --- | --- | --- |
| base | `html` (line 244) | `font-family: var(--font-sans)` |
| heading | `h1, h2, h3, .font-display` (lines 257–262) | family `var(--font-display)`, weight 600, letter-spacing -0.028em, `font-variation-settings: "wdth" 102, "opsz" 32` |
| display | `@utility text-display` (282–288) | family `var(--font-display)`, weight 600, letter-spacing -0.032em, line-height 1.02, `font-variation-settings: "wdth" 102, "opsz" 48` |
| eyebrow | `@utility text-eyebrow` (290–297) | family `var(--font-mono)`, size 0.6875rem, weight 500, letter-spacing 0, `text-transform: uppercase`, `color: var(--muted-foreground)` |
| serial | `@utility text-serial` (299–306) | family `var(--font-mono)`, size 0.625rem, letter-spacing 0, `text-transform: uppercase`, `color: var(--muted-foreground)`, `font-variant-numeric: tabular-nums` |

Production declares **no** `--text-*`, `--leading-*`, `--tracking-*` or `--font-weight-*` scale tokens. Sizes used elsewhere come from Tailwind's built-in utilities (`text-xs`, `text-sm`, …), which are library-owned defaults, not ABox tokens — they are **not** imported as variables, consistent with the B1 treatment of the 22 unconsumed shadcn primitives and Tailwind breakpoints.

`body` sets `font-feature-settings: "ss01", "cv11"` (line 254) — an OpenType feature setting, not a variable-representable value.

`src/routes/__root.tsx:100` loads Bricolage Grotesque (opsz 12..96, weights 400/500/600/700), Inter Tight (400/500/600/700) and JetBrains Mono (400/500). **JetBrains Mono is loaded but referenced by no token or component** — `--font-mono` resolves to Inter Tight. This is recorded as an observation; B2 follows the token declarations, not the font link, and creates no JetBrains variable.

`src/lib/design/**` contains prior typography extraction data (reference layer, zero production importers). It is documentation, not authority, and is not used as a source.

## 2. Collection architecture

Production keeps all typography in one `@theme` block plus three utilities, so B2 uses **one collection**, matching that architecture:

**`ABox/Typography`** — modes `Light` and `Dark` only, no `Default`.

Production declares **no `.dark` typography override**. Both modes therefore carry **intentionally identical values**. This is stated explicitly in the report rather than collapsing to a single mode, so the collection stays mode-compatible with the nine B1 collections.

## 3. Exact inventory — 19 variables

Family (STRING, 4):

- `family/sans`, `family/display`, `family/serif`, `family/mono` — each stores the production stack verbatim.

Roles (15):

| Variable | Type | Value | Source |
| --- | --- | --- | --- |
| `role/base/family` | STRING alias → `family/sans` | — | `html` |
| `role/heading/family` | STRING alias → `family/display` | — | `h1,h2,h3,.font-display` |
| `role/heading/weight` | FLOAT | 600 | same |
| `role/heading/letter-spacing` | FLOAT | -2.8 | same (`-0.028em`) |
| `role/display/family` | STRING alias → `family/display` | — | `@utility text-display` |
| `role/display/weight` | FLOAT | 600 | same |
| `role/display/letter-spacing` | FLOAT | -3.2 | same (`-0.032em`) |
| `role/display/line-height` | FLOAT | 1.02 | same |
| `role/eyebrow/family` | STRING alias → `family/mono` | — | `@utility text-eyebrow` |
| `role/eyebrow/size` | FLOAT | 11 | same (`0.6875rem`) |
| `role/eyebrow/weight` | FLOAT | 500 | same |
| `role/eyebrow/letter-spacing` | FLOAT | 0 | same |
| `role/serial/family` | STRING alias → `family/mono` | — | `@utility text-serial` |
| `role/serial/size` | FLOAT | 10 | same (`0.625rem`) |
| `role/serial/letter-spacing` | FLOAT | 0 | same |

### Type totals (arithmetic check)

| Group | Type | Count |
| --- | --- | --- |
| `family/sans`, `family/display`, `family/serif`, `family/mono` | STRING | 4 |
| `role/base/family`, `role/heading/family`, `role/display/family`, `role/eyebrow/family`, `role/serial/family` | STRING | 5 |
| heading: `weight`, `letter-spacing` | FLOAT | 2 |
| display: `weight`, `letter-spacing`, `line-height` | FLOAT | 3 |
| eyebrow: `size`, `weight`, `letter-spacing` | FLOAT | 3 |
| serial: `size`, `letter-spacing` | FLOAT | 2 |

- **STRING = 4 + 5 = 9**
- **FLOAT = 2 + 3 + 3 + 2 = 10**
- **Check: 9 + 10 = 19 = total variables.**

The earlier "4 + 5 family variables STRING, the 10 numeric variables FLOAT" phrasing implied 4 and 5 were separate totals; they are two STRING groups summing to 9. The 19-variable inventory itself is unchanged — only the type arithmetic is now stated explicitly.

Total: **1 collection, 19 variables (9 STRING + 10 FLOAT), 2 modes**. No variable is created for a property production does not declare on that role — `role/base` has family only, `role/serial` has no weight.

## 4. Mapping rules

- Aliases exist only where production writes `var(--font-X)` in the role declaration. Resolved per mode, identically in both. Equal stacks never imply an alias.
- `rem` → px at the 16px root: `0.6875rem`→11, `0.625rem`→10. Original rem literal preserved in the variable description.
- `em` letter-spacing → Figma's percentage unit (`-0.028em` → `-2.8`). Original em literal preserved in the description.
- Line-height stays the unitless production number (1.02), applied as a percentage at bind time.
- Every variable description carries `source: <file>:<line> — <verbatim declaration>`.

## 5. Recorded limitations (no approximation, nothing dropped silently)

1. `font-variation-settings: "wdth" 102, "opsz" 32` (heading) and `"wdth" 102, "opsz" 48` (display) — Figma exposes variable-font axes per text node, not as variables. Recorded verbatim in the role descriptions; no variable created.
2. `font-feature-settings: "ss01", "cv11"` (body) and `font-variant-numeric: tabular-nums` (serial) — OpenType features, no variable type. Recorded verbatim.
3. `text-transform: uppercase` (eyebrow, serial) — a text-node property, not variable-bindable. Recorded verbatim.
4. `color: var(--muted-foreground)` (eyebrow, serial) — already a B1 semantic variable; not duplicated into Typography.
5. Font-family stacks are CSS fallback chains. Figma has no fallback concept; the full stack is stored as the STRING value and only the first family renders when bound.
6. JetBrains Mono is loaded in the document head but referenced by no production token; no variable created.
7. Tailwind's built-in size/leading/tracking utilities are library-owned defaults, not ABox tokens; not imported.
8. No Text Styles are created in B2 — Text Styles, Effect Styles, components, variants, patterns, shells, screens and documentation content are all out of scope for this batch.

## 6. Idempotency

Identical to B1: exact-name matching; existing collection reused in place; existing variable reused/updated in place; duplicate collection STOP; duplicate variable STOP; type mismatch STOP without deleting; nothing outside the B2 inventory is touched or deleted; Run 2 creates zero objects and reports ids identical to Run 1.

## 7. `b2-verify` checks

1. Exactly one B2 collection, named `ABox/Typography`, appearing once.
2. Its modes are exactly `Light` and `Dark`; no `Default` mode.
3. Exactly 19 variables, names matching the inventory exactly — no missing, no extras.
4. Types correct: 4 + 5 family variables STRING, the 10 numeric variables FLOAT.
5. Every literal value matches its production source, per mode.
6. Light and Dark values identical for every variable (the intentional-parity check).
7. Every alias resolves to the family variable named by the production `var(--font-X)` declaration, per mode.
8. Every description carries its `source:` line; no variable lacks a production source.
9. The nine B1 collections still exist with 200 variables and unchanged ids.
10. Zero text styles, zero effect styles, zero components, zero component sets.
11. The seven B0 pages exist at indices 0..6 in exact order and remain empty.
12. Prints the B2 inventory: collection id, and every variable name, id, type and per-mode value.
13. Prints `RECORDED LIMITATIONS / EXCEPTIONS` verbatim.
14. Final line `RESULT: B2 PASSED` or `RESULT: B2 FAILED — do not proceed to B3.`

Outside Figma, before and after: `git diff --stat -- src/` empty, and `code.js` byte-identical to a fresh `node build.mjs` (never hand-edited).

## 8. Run 1 / Run 2 procedure

1. I implement, run `node tools/figma-plugin/build.mjs`, and confirm the offline dry-run passes twice with zero creations on run 2. **The dry-run mocks the Figma API — its ids are mock ids and are never presented as Figma evidence.** This workspace has no Figma write path.
2. You re-import the plugin in Figma Desktop, open `ABox Design System — Library`, click **Create typography variables** → Run 1.
3. Click it again → Run 2. Then **Verify typography variables**.
4. You send both verbatim outputs; I assemble the final report: both inventories, identical ids, zero-creation proof for Run 2, mapping and alias proof, limitations verbatim, `git diff --stat -- src/`, and the `RESULT:` line.

## 9. Files touched

Created: `tools/figma-plugin/extract-b2.mjs`, `tools/figma-plugin/tokens-b2.js` (generated, never hand-edited).
Modified: `tools/figma-plugin/plugin.js` (B2 section + verify), `ui.html` (two buttons), `build.mjs` (include `tokens-b2.js`), `README.md`, `code.js` (generated by `build.mjs`), `.lovable/manual-work-map.md` (B2 governance block).

Untouched, and verified so: `src/**`, the running application, the B0 pages, every B1 collection and variable, and the proof file.
