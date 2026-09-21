# Phase 52 / Batch B3 — Figma Foundational Styles (PLAN ONLY)

Target file `ABox Design System — Library`. Plugin layer only. `ABox Proof — Scratch`, the seven B0 pages, all B1 collections/variables, the B2 `ABox/Typography` collection, and everything under `src/**` stay untouched. No components, variants, patterns, shells, screens, documentation content, or publishing.

## 1. Source findings

Read from production, not from B1/B2 convenience:

- `src/styles.css` — 54 semantic colour roles (`@theme` + compatibility layer), 62 literal primitives, five `--shadow-*` families (lines 82–87), plus `--shadow-overlay: var(--shadow-elevated)` (line 462).
- `src/components/abox/status-badge.tsx` — six tones, each declared as `[--tone:var(--X)]`; the visible pill colours are `color-mix(in oklch, var(--tone) …)` and the dot is the raw `var(--tone)`.
- `src/components/abox/metal-badge.tsx` — six tiers, each binding `--tone`/`--tone-fg` to a `--metal-*` variable and applying them directly as `backgroundColor` / `color`.
- Typography rules: `html` (244), `body` (254), `h1,h2,h3,.font-display` (257–262), `@utility text-display` (282–288), `@utility text-eyebrow` (290–297), `@utility text-serial` (299–306).
- `src/lib/design/**` and `src/lib/design-tokens.ts` are reference layers with no production importers — used as cross-check only, never as authority.

## 2. Style architecture

Figma paint and effect styles can bind their values to variables, so each Style is a **single mode-independent wrapper around the mode-aware B1 variable**. No Light/Dark style duplicates, and no style is created just because two values match.

### Colour Styles — 72

| Group | Names | Bound to | Source |
| --- | --- | --- | --- |
| Semantic — 54 | `ABox/Semantic/<role>` for every B1 semantic role, exact production names incl. `chart/1…5`, `sidebar/*`, `ai`, `surface-1…3`, `brand-accent` | `ABox/Color/Semantic` variable of the same name | `src/styles.css` role declaration |
| Status — 6 | `ABox/Status/sage`, `/primary`, `/warning`, `/muted`, `/destructive`, `/info` | `ABox/Status` tone variable | `status-badge.tsx` tone map; the dot uses raw `var(--tone)` |
| Metal — 12 | `ABox/Metal/bronze`, `/expanded-bronze`, `/silver`, `/gold`, `/platinum`, `/catastrophic` and each `…-fg` | matching `ABox/Status` metal variable | `metal-badge.tsx` applies `var(--tone)` / `var(--tone-fg)` directly |

The 62 primitives get **no** styles: production consumes them only as alias targets, never directly.

### Text Styles — 2

Only roles whose production rule declares a font size are representable.

- `ABox/Text/eyebrow` — Inter Tight, 11px (`0.6875rem`), weight 500, letter-spacing 0, uppercase. Source `@utility text-eyebrow`.
- `ABox/Text/serial` — Inter Tight, 10px (`0.625rem`), letter-spacing 0, uppercase. Production declares no weight, so the CSS-inherited `normal` (400) is used and that inheritance is stated in the description.

`base`, `heading` and `display` are **not** text styles: production sets no font size for them (sizes come from per-usage Tailwind utilities), so a faithful Text Style cannot exist. Recorded as a limitation, not approximated.

### Effect Styles — 5

`ABox/Elevation/card`, `/elevated`, `/drawer`, `/plate`, `/glow`. Layers exactly as production, every layer a DROP_SHADOW with `x/y/blur/spread/color` **bound to the existing B1 elevation variables** — no new variables, no duplicated numbers.

| Style | Layers | Source |
| --- | --- | --- |
| card | 2 | `--shadow-card` (82) |
| elevated | 2 | `--shadow-elevated` (83) |
| drawer | 1 | `--shadow-drawer` (84) |
| plate | 2 | `--shadow-plate` (85) |
| glow | 2 | `--shadow-glow` (87) |

`--shadow-overlay` is an alias of `--shadow-elevated` with no consumer: documented, no separate style.

### Other categories — zero

No grid styles (production declares no grid definition). Decorative utilities (`noise-field`, `contour`, `aurora`, `glass`, `ember-underline`, `card-brackets`, `edge-sheen`), motion/keyframes and responsive breakpoints are out of scope by rule.

**Total B3 styles: 72 colour + 2 text + 5 effect = 79.** Every style carries a `source:` description with its production file and line.

## 3. Limitations recorded verbatim

- `status-badge.tsx` — `color-mix(in oklch, var(--tone) 88% / 12% / 34%, …)` is runtime-computed; no static Style.
- `styles.css` — `oklch()` has no Figma equivalent; values convert to sRGB with the original literal preserved.
- `styles.css:261/287` — `font-variation-settings` axes are per-node, not style-bindable.
- `styles.css:254` — `font-feature-settings: "ss01","cv11"`; `styles.css:305` — `font-variant-numeric: tabular-nums`: no Figma text-style property.
- `text-eyebrow`/`text-serial` `color: var(--muted-foreground)`: Figma text styles hold no colour; the semantic colour style covers it.
- `plan-o-assistant.tsx:27` composes `var(--shadow-glow)` with an extra inline layer: a component-level composition, not a foundational style.
- No `.dark` override exists for `--shadow-*`; elevation is mode-identical by production.
- `--shadow-overlay` alias has no consumer; documented only.

## 4. Idempotency

Exact-name matching per category. Existing style → reuse and update in place. Duplicate name in a category → STOP. Category/type mismatch → STOP. Unrelated styles never touched or deleted. Run 2 creates zero styles and reports ids identical to Run 1.

## 5. `b3-verify`

Twenty checks, printed as PASS/FAIL: (1) category counts 72/2/5; (2) exact names in each category; (3) source description present on every style; (4) every colour style fill and every effect field bound to the expected B1/B2 variable id; (5) text properties exact per role; (6) no colour style carries a hard-coded fill; (7) effect layer count, order, offsets, blur, spread, tint per style; (8) mode behaviour correct via bindings, no Light/Dark duplicate styles; (9) no duplicate names; (10) no value-equality-derived style; (11) unrelated pre-existing styles unchanged; (12) B1 still nine collections / 200 variables; (13) B2 still one collection / 19 variables; (14) zero components, component sets, variants, page content; (15) B0 pages unchanged, in order, empty; (16) `git diff --stat -- src/` empty; (17) `code.js` regenerated only by `node build.mjs`; (18) Run 1 passes; (19) Run 2 zero creations, identical ids; (20) limitations block printed verbatim. Final line: `RESULT: B3 PASSED` or `RESULT: B3 FAILED — do not proceed to B4.`

## 6. Run procedure

Offline: `node tools/figma-plugin/extract-b3.mjs` → `node build.mjs` → mock harness runs B1, B2 then B3 twice, asserting zero creations on run 2. This is a **mock**; its ids are never presented as Figma ids.

Real: in Figma Desktop, open `ABox Design System — Library`, click **Create foundational styles**, then **Verify foundational styles**, then run creation a second time, and send both verbatim outputs with style ids.

## 7. Files

Created: `tools/figma-plugin/extract-b3.mjs`. Generated: `tools/figma-plugin/tokens-b3.js`, `code.js` (via `build.mjs` only, never hand-edited). Modified: `plugin.js`, `ui.html`, `build.mjs`, `README.md`, `.lovable/manual-work-map.md`. Nothing under `src/**`; no application UI, routing, branding, assets, layout, or logic change.
