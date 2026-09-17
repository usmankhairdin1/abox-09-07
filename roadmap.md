# Roadmap — Design system

## Phase 1 — centralization (done)

- [x] Baseline screenshots (/, /plans, /cart, /agency/my-organization) at desktop/tablet/mobile
- [x] action-pill shared class helper (exact-duplicate call sites only — 64 sites, 33 files)
- [x] /design-system and /design-guide unlisted reference pages
- [x] Typecheck, lint, build, before/after comparison

## Phase 2 — foundation audit & governance (done)

- [x] Foundation inventory: colour, typography, spacing, layout, responsive, shape, opacity,
      sizing, motion, utilities, compatibility aliases
- [x] Relationship audit: spacing (page, cards, forms, inline, data, navigation/overlays)
      and typography pairings
- [x] Component, state and pattern inventories with consumer counts
- [x] Reference-only modules under src/lib/design/ + reference-kit display primitives
- [x] /design-system extended with audit, inventories, governance, experiences, Figma blueprint
- [x] /design-guide extended with governance, accessibility, experiences, Figma blueprint
- [x] .lovable/design-system.md rewritten (CURRENT IMPLEMENTATION vs FUTURE OPPORTUNITY)
- [x] Validation: tsgo, lint, build, both pages desktop+mobile, no nav links, baseline comparison

## Phase 2b — spacing & layout audit (done)

Documentation, reference and governance only. No application file was modified.

- [x] Spacing source-of-truth audit — scale, padding, vertical rhythm (`src/lib/design/spacing.ts`)
- [x] Layout audit — containers, grid/flex relationships, dimensions, layout patterns
      (`src/lib/design/layout.ts`)
- [x] Structural relationships, responsive patterns, density modes
      (`src/lib/design/spatial-relationships.ts`)
- [x] Layout governance rules, unowned areas, deferred opportunities, Figma layout mapping
      (appended to `src/lib/design/governance.ts`)
- [x] Reference-only display primitives: SpacingTable, ContainerTable, ResponsiveTable,
      DensityTable, DimensionTable, LayoutPatternList, RuleList
- [x] /design-system: spacing foundation, containers, grid & structure, responsive, density,
      dimensions, layout patterns, layout governance, extended Figma mapping
- [x] /design-guide: spacing & layout governance section with per-experience guidance
- [x] Validation: tsgo, eslint, production build, both pages desktop+mobile, no nav links,
      no application file changed

### Key findings — GOVERNANCE RULE / OBSERVED VARIATION

- CURRENT IMPLEMENTATION — no spacing token exists in `src/styles.css`; spacing lives at call sites.
- CURRENT IMPLEMENTATION — `max-w-[88rem] px-4 md:px-8` is the web-experience container (23 sites);
  the admin shell uses `max-w-[1500px]` with a three-step gutter.
- OBSERVED VARIATION — card interiors run p-3 / p-4 / p-5 / p-6 across comparable surfaces.
- OBSERVED VARIATION — marketplace controls are 40px while shadcn primitives are 36px.
- OBSERVED VARIATION — detail splits use 320px and 360px summary columns with gap-6 and gap-5.
- OBSERVED VARIATION — icon-to-text gaps are both gap-1.5 and gap-2.
- OBSERVED VARIATION — two table densities (DataTable px-5 py-4, shadcn head h-10 px-2).
- GOVERNANCE RULE — none of the above was normalized; the shipping implementation wins.

## Phase 3 — deferred (not started, each recorded as FUTURE OPPORTUNITY)

- [ ] Near-miss pill class strings (needs per-site visual verification)
- [ ] SurfaceCard / SectionHeading components (would change rendered output)
- [ ] Tokenize the plans mobile filter scrim
- [ ] Consolidate the two assistant implementations (behavioural)
- [ ] Govern breadcrumbs / pagination / avatars / charts when a feature needs them
- [ ] Machine-readable token export for the Figma library
- [ ] Web-experience container component (horizontal contract only — vertical padding differs)
- [ ] Card padding convergence (high risk — would re-space most screens)
- [ ] Detail-split width alignment (320px vs 360px)
- [ ] Results toolbar component (recurring shape, no owner)
- [ ] Icon-to-text gap convergence (gap-1.5 vs gap-2)
- [ ] Table density convergence
- [ ] Universal touch-target floor (min-h-11 applied to 16 controls today, not universally)
- [ ] Spacing/layout variable export for Figma

## Phase 3 — Typography audit & governance (complete)

- Added reference-only `src/lib/design/typography.ts` (families, weights, measured scale,
  line height & tracking, utilities, semantic roles, numeric typography) and
  `src/lib/design/typography-behavior.ts` (responsive, states, text behaviour,
  readability conventions, component cross-reference).
- Added typography governance, maturity, unowned areas, deferred opportunities and Figma
  text-style mapping to `src/lib/design/governance.ts`.
- Extended `/design-system` with ten technical typography sections and `/design-guide`
  with a management typography governance section plus experience guidance.
- Updated `.lovable/design-system.md` with CURRENT IMPLEMENTATION / OBSERVED VARIATION /
  INSTALLED BUT UNUSED / FUTURE OPPORTUNITY.
- No application screen, route, component, token or style value was changed.

### Deferred (carried forward)
- All Phase 1 and Phase 2 deferred opportunities remain open.
- Typography: JetBrains Mono binding/removal, `.story-link` definition/removal,
  SectionHeading component, tracking convergence, sub-scale tokens, micro-type floor,
  success token convergence, tabular dates, Figma text-style export.

## Phase 4 — Iconography & assets audit (complete)

- Added reference-only `src/lib/design/iconography.ts` (sources, semantic inventory, size
  audit, stroke/fill/colour treatment), `src/lib/design/iconography-behavior.ts`
  (accessibility, states, relationships, experience conventions) and
  `src/lib/design/assets.ts` (logos and brand marks, imagery, naming and organization,
  asset behaviour, unused findings, ownership, maturity, deferred work, Figma mapping).
- Added `IconEntry`, `IconCategory`, `AssetEntry` and `AssetGroup` types, plus `IconTable`
  and `AssetTable` display helpers.
- Extended `/design-system` with thirteen technical iconography and asset sections and
  `/design-guide` with a management-facing "Iconography & asset governance" section.
- Updated `.lovable/design-system.md` with the Phase 4 findings.
- No production icon, mark, asset, component, route or style was changed. Branding &
  White-Label and Marketplace Asset Management were inspected only.

### Deferred (carried forward)
- All Phase 1–3 deferred opportunities remain open.
- Icons & assets: remove unused Font Awesome dependency; consolidate the single Tabler
  import; converge `h-4 w-4` / `size-4`; shared Icon wrapper or icon-size tokens;
  IconButton with a required label; IconDisc for the circular wrapper; resolve decor
  aliases and unused primitives; negative-status glyph mapping; define imagery conventions
  before the first image ships; generated Figma icon-library export.

## Phase 5 — Complete component inventory + reference governance (complete)

Reference/documentation layer only. No production component, route, style or behaviour changed.

Added `src/lib/design/components.ts`, `component-variants.ts`, `component-states.ts`,
`component-relationships.ts`; extended `types.ts`, `governance.ts`, `reference-kit.tsx`,
`/design-system` (19 new sections), `/design-guide` (one management section) and
`.lovable/design-system.md`.

Inventoried: 27 ABox modules, 49 UI primitives (29 consumed, 20 not), 3 shells covering 123
routes, 1 icon component, 6 route-local kits, 1 reference-only kit. Recorded taxonomy, ownership,
consumer map, shared vs experience-specific, anatomy, variants, sizes, states, responsive
behaviour, relationships, composition classification, duplication, unused findings, accessibility
and the Phase 2/3/4 cross-references.

### Deferred component opportunities (carried forward)

- Converge the four table implementations — high risk.
- Converge the parallel page headers and empty states — medium.
- Unify the 15-value status tone vocabulary — high.
- Give the card surface a component owner — high.
- Introduce a shared Field component; `ui/form.tsx` is installed and unused — high.
- Resolve the two coexisting assistant implementations — medium.
- Decide the fate of the 20 unused primitives and the `ai-elements` tree — low.
- Keyboard path for clickable DataTable rows — low.
- Announce loading states to assistive technology — low.
- Shared accessible-name helper for icon-only controls — low.
- Reconcile the Button and ACTION_PILL action ladders — medium.

### Carried forward from earlier phases

Card padding and border-token variation, section-heading and card-description size variation,
uppercase tracking values, unused Font Awesome dependency, single Tabler import, `h-4 w-4` vs
`size-4`, the circular icon container, decor compatibility aliases, machine-readable Figma token
export, breadcrumbs / pagination / avatars / charts awaiting real feature use.

## Phase 6 — Architecture & Normalization Blueprint (complete)

- [x] Unified ABox Core architecture, component hierarchy and dependency rules
- [x] Component-vs-pattern classification framework with observable criteria
- [x] Future canonical component map, current evidence paired with proposed target
- [x] Anatomy, variant, state, accessibility, responsive and density blueprints
- [x] Architecture relationship map and token → screen dependency model
- [x] Duplicate / overlap normalization map — documented, no winner chosen
- [x] Route-local kit architecture and three shell families across 123 routes
- [x] Brand and asset ownership boundaries (Branding & Marketplace untouched)
- [x] Naming conventions compatible with the current codebase
- [x] Future Figma library blueprint and variable mapping (nothing built)
- [x] Architecture governance, change propagation, experience architecture
- [x] Migration roadmap with risk, validation, rollback and visual-diff requirements
- [x] `/design-system` and `/design-guide` extended; both still unlisted
- [x] `.lovable/design-system.md` updated

### Deferred (requires separate approval)

- [ ] Resolve duplicate implementations — each needs an explicit decision
- [ ] Assign owners to unowned patterns (card surface, form field, results toolbar, loading)
- [ ] Name the literal values that currently bypass the token chain
- [ ] Build the design library; it does not exist
- [ ] Execute any migration phase

## Phase 7 — Foundation Specification & Token Governance (complete)

- [x] Foundation model: primitive → semantic → component → pattern → screen
- [x] Complete colour foundation with copied values, both themes, usage counts
- [x] Colour role chains, role overlaps and theme-mode map
- [x] Status tone vocabulary and separate tier foundation with governance
- [x] Typography foundation: families, weights, scale, rhythm, roles, responsive
- [x] Spacing scale and spacing relationship specifications
- [x] Layout, container, breakpoint, shape, elevation and opacity foundation
- [x] Icon, motion and density foundation with measured evidence
- [x] Component foundation role maps for 11 canonical candidates
- [x] Token naming system and primitive → semantic → component map
- [x] Figma variable/style mapping including what cannot be mapped
- [x] Foundation-level accessibility records
- [x] Ownership boundaries: core vs white-label vs marketplace assets
- [x] Experience expression guidance — one system, contextual use
- [x] Foundation maturity (descriptive, unscored) and governance rules
- [x] `/design-system` and `/design-guide` extended; both still unlisted
- [x] `.lovable/design-system.md` updated

### Deferred (requires separate approval)

- [ ] Decide between 36px and 40px control heights
- [ ] Choose a canonical card padding and heading scale
- [ ] Consolidate the focus treatment into one foundation rule
- [ ] Replace opacity-based disabled state with tokens
- [ ] Retire the five compatibility aliases and the unused icon dependency
- [ ] Decide whether tone mixing is precomputed for Figma
- [ ] Build any Figma library; none exists

## Phase 8 — ABox Core canonical component library specification

- [x] Shared specification shape extending the existing reference types
- [x] Anatomy vocabulary, property model, variant, state, size/density and icon governance
- [x] Component specifications across 11 categories, assembled by one registry
- [x] Composition, relationship and foundation dependency chains
- [x] Duplicate and overlap register — recorded side by side, no winner selected
- [x] Route-local kit relationships and experience extension boundaries
- [x] Accessibility per category and content/text behavior rules
- [x] Figma library blueprint and per-component property mapping, with stated limits
- [x] Naming governance, documentation template, maturity categories, open decisions
- [x] `/design-system` and `/design-guide` extended; both still unlisted
- [x] `.lovable/design-system.md` updated

### Deferred (requires separate approval)

- [ ] Resolve the nine open decisions recorded in the specification
- [ ] Choose between any of the ten recorded duplicate implementations
- [ ] Give the recorded unowned patterns a component owner
- [ ] Any production migration towards a canonical target
- [ ] Build any Figma library; none exists
