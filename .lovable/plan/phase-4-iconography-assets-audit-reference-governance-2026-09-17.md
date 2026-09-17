# Phase 4 — Iconography & Assets Audit + Reference Governance

Documentation and reference-layer work only. The running application stays pixel-identical
and behaviourally identical. Branding & White-Label and Marketplace Asset Management are
inspected as evidence and referenced as existing sources of truth — never duplicated or
modified.

## What the pre-plan inspection already found

These findings are confirmed from the current codebase and will shape the audit:

- **Three icon packages are installed; effectively one is used.** `lucide-react` is imported
  in 144 files. `@tabler/icons-react` is imported exactly once (`IconDental` inside
  `src/components/icons/tooth-icon.tsx`). `@fortawesome/free-solid-svg-icons` is in
  `package.json` with no import anywhere in `src` — INSTALLED BUT UNUSED.
- **There are no image files in the repository.** No PNG, JPG, WEBP, AVIF, GIF or committed
  SVG exists under `src/` or `public/`, and there is no `src/assets` directory. There is no
  `<img>` tag anywhere in `src`. The product's entire visual asset layer is code-drawn SVG
  plus icon components. The only referenced binary is `/favicon.ico` in `__root.tsx`.
- **Inline SVG lives in exactly three files**: `abox/logo.tsx` (the `AboxMark` brand mark),
  `abox/decor/index.tsx` (roughly 20 decorative/illustrative primitives such as
  `OrbitalRings`, `HealthPulseShield`, `CoverageWeave`, `FamilySilhouette`, `BlueprintGrid`),
  and `routes/auth.tsx`.
- **Brand marks**: `AboxMark` is a four-tone token-driven SVG disc (`primary`, `sage`,
  `sidebar`, `foreground`), default size 36, `aria-hidden`. `AboxWordmark` has a compact
  variant. `CarrierMark` renders deterministic initial monograms on hue-derived tinted discs
  and is documented in its own source as illustrative placeholders, not official carrier logos.
- **Icon sizing**: `h-4 w-4` (281) dominates, then `h-3.5 w-3.5` (68), `h-3 w-3` (34),
  `h-5 w-5` (32), `size-4` (31), `h-8 w-8` (18), `h-9 w-9` (14), plus smaller counts at
  `h-6/h-10/h-12` and `size-5`. Two parallel sizing syntaxes (`h-4 w-4` vs `size-4`) are an
  OBSERVED VARIATION.
- **Stroke width is never overridden on Lucide icons.** Explicit `strokeWidth` appears only
  inside the decorative primitives (0.75, 1, 1.25, 1.75).
- **Accessibility**: `aria-hidden` appears 257 times across 99 files — the dominant
  convention for decorative icons. Icon-only controls pair it with `aria-label`
  (for example the retire-asset button in the marketplace assets screen).
- **Asset management is real and runtime-owned.** `marketplace.admin.assets.tsx` governs four
  fixed asset types (LOGO, MARK, FAVICON, optional HERO) with upload, scan, validate, preview
  and retire, backed by `marketplace-store`. `app.jet.branding.tsx` owns logo/favicon/wordmark
  configuration. The reference pages will point at these, not reimplement them.

## Scope

Only these files will be created or edited:

- `src/lib/design/iconography.ts` (new)
- `src/lib/design/iconography-behavior.ts` (new)
- `src/lib/design/assets.ts` (new)
- `src/lib/design/types.ts`, `inventory.ts`, `relationships.ts`, `governance.ts` (additive only)
- `src/components/design/reference-kit.tsx` (additive display helpers only if existing
  tables are insufficient)
- `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`
- `.lovable/design-system.md`, `roadmap.md`

Nothing under `src/components/ui/`, `src/components/abox/`, `src/components/icons/`,
`src/styles.css`, or any production route will be modified.

## Audit work

1. **Icon sources** — per library: import mechanism, consumer count, semantic purpose,
   sizing/stroke/colour conventions, accessibility treatment, ownership, whether
   production-owned or installed-but-unused, centralization safety, Figma mapping.
2. **Icon inventory** — measured usage counts grouped into semantic categories (navigation,
   chevrons, dismiss, create, edit, delete, search, filter, sort, refresh, settings, account,
   organization, notification, status, visibility, upload/download, external link, commerce,
   cart, product, plan, marketplace, dashboard/analytics, communication, security, media,
   decorative). A structured summary plus representative records per category — not a dump of
   every occurrence — with exceptions kept visible. Ambiguous icons get marked, not guessed.
3. **Size audit** — the measured size ladder, wrapper and container dimensions, and the real
   relationships (icon→text, icon→button label, icon→control height, icon→badge,
   icon→nav item, icon→heading, icon→status label, icon→empty state).
4. **Stroke / fill / treatment** — `currentColor` inheritance, token colour usage, muted and
   disabled treatments, circular and bordered icon containers, surfaces behind icons, opacity,
   and the decorative-primitive stroke values that are the only explicit overrides.
5. **Interaction & accessibility** — icon-only buttons, icon+text buttons, dismiss controls,
   tooltip pairing, `aria-label` vs `aria-hidden` vs `sr-only` vs `title`, focus treatment,
   the 44px mobile touch-target rule, and disabled behaviour. Inconsistencies recorded as
   FUTURE OPPORTUNITY only.
6. **Icon states** — which states exist and whether each is carried by colour, opacity,
   background, border, wrapper state, icon replacement or animation.
7. **Logo & brand marks** — `AboxMark` tones and sizes, `AboxWordmark` variants, `CarrierMark`
   determinism and its explicit placeholder status, the favicon reference, and the
   white-label/marketplace-managed asset types, each attributed to its owning system.
8. **Image & media** — records the confirmed absence of raster and file-based imagery, the
   code-drawn decorative primitives that stand in for illustration, and the runtime-uploaded
   asset types that exist only through Asset Management.
9. **Naming & organization** — observed conventions across `components/icons/`,
   `components/abox/decor/`, the decor compatibility aliases (`HairlineGrid`,
   `ConcentricArcs`, `DiagonalWeave` pointing at other primitives), and the marketplace asset
   type identifiers.
10. **Variants, asset behaviour, and relationships** — tone/size/compact variants, rounded
    containers, borders, overlays and gradients on decorative art, fallback behaviour
    (CarrierMark's neutral fallback, the "approved baseline" when no asset is uploaded), plus
    logo→header/nav/shell and icon→label/button/status/input/table-action relationships.
11. **Component cross-reference** — icon and asset usage per existing component: Button,
    Badge, StatusBadge, MetalBadge, CarrierMark, PlanCard, KpiCard, DataTable, EmptyState,
    PageHeader, the three shells, form controls, dialogs, sheets, dropdowns, tooltips, and the
    branding/asset-management screens.
12. **Experience guidance** — Web/Marketing, Shopping/Marketplace, Dashboard/Admin, plus a
    reserved Future Experiences slot. Contextual usage only; one shared icon system.
13. **Governance, maturity, unused findings, Figma mapping** — ownership per asset category,
    what may change freely vs what needs application review, descriptive maturity categories
    (no scores), clearly labelled INSTALLED BUT UNUSED / POSSIBLY UNUSED / OBSERVED DUPLICATE
    findings, and an icon-library→Figma-component-library mapping specification.

## Reference pages

`/design-system` gains technical sections for icon sources, inventory, semantic categories,
sizes, treatment, states, accessibility, logos and brand marks, media findings, asset
organization and variants, component cross-reference, experience usage, unused findings,
Figma mapping and deferred opportunities — using the existing table helpers and the
established CURRENT IMPLEMENTATION / OBSERVED VARIATION / UNOWNED AREA / GOVERNANCE RULE /
FUTURE OPPORTUNITY labels.

`/design-guide` gains one management-facing "Iconography & asset governance" section covering
shared icon and asset governance, the white-label boundary, the Marketplace Asset Management
boundary, semantic icon usage, accessibility expectations, ownership, change propagation,
duplication avoidance, Figma expectations, and the four experience notes. It stays a guide,
never an asset editor.

Both routes remain unlisted and reachable by direct URL only.

## Documentation

`.lovable/design-system.md` gains a Phase 4 section using the same labels.
`roadmap.md` records Phase 4 completion and carries forward all deferred opportunities.

## Anticipated deferred opportunities (recorded, not applied)

Removing the unused Font Awesome dependency; consolidating the single Tabler import;
converging `h-4 w-4` and `size-4`; a shared icon-size token or `Icon` wrapper; resolving the
decor compatibility aliases; a shared icon-only-button accessibility helper; and a generated
Figma icon-library export.

## Validation

Typecheck, lint, production build; both reference pages at desktop and mobile with no console
errors; confirmation they carry no navigation links; representative application routes
(`/`, `/plans`, `/cart`, an admin page, the branding screen and the marketplace assets screen)
rendered at desktop and mobile and confirmed unchanged; and a scope check that no file outside
the allowed list was modified.
