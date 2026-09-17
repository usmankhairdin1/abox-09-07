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

## Phase 3 — deferred (not started, each recorded as FUTURE OPPORTUNITY)

- [ ] Near-miss pill class strings (needs per-site visual verification)
- [ ] SurfaceCard / SectionHeading components (would change rendered output)
- [ ] Tokenize the plans mobile filter scrim
- [ ] Consolidate the two assistant implementations (behavioural)
- [ ] Govern breadcrumbs / pagination / avatars / charts when a feature needs them
- [ ] Machine-readable token export for the Figma library
