# Centralize the existing design system + add two reference pages

Goal: same ABox application, cleaner architecture. No visual, behavioural, routing, branding or business-logic change anywhere in the existing app.

## What the audit found (verified in code)

- **Tokens already centralized.** `src/styles.css` holds the full token set: colors (background/surface/panel/card/popover/primary/secondary/sage/muted/accent/success/warning/destructive/info/border/input/ring/sidebar/chart), metal tiers (Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic + foregrounds), radius scale (sm→4xl), fonts (Inter Tight / Bricolage Grotesque), shadows (card, elevated, drawer, plate, glow), utilities (`glass`, `ring-pill`, `edge-sheen`, `card-brackets`, `ember-underline`), animations, and a compatibility layer (`--ai`, `--surface-1/2/3`, `--brand-accent`). No new token system is needed — this stays the source of truth.
- **Component layers already separated.** `src/components/ui/*` (49 shadcn primitives) and `src/components/abox/*` (28 ABox components: PageHeader, PlanCard, MetalBadge, StatusBadge, KpiCard, CarrierMark, DataTable, EmptyState, ProductSwitcher, the three shells, etc.).
- **One genuine duplication:** the "pill" action button is hand-written as an inline class string in ~37 route files (`inline-flex h-10 items-center … rounded-full bg-primary px-4 … text-primary-foreground hover:bg-primary/90`, plus a bordered secondary variant). These are `Link`/`button` elements, not the shared `Button`.
- **Almost no hardcoded colors** outside tokens (one `bg-black/40` scrim on the plans filter drawer).

## What will change

### 1. Shared pill-action styling (safe-only refactor)
Add one small module (`src/components/abox/action-pill.ts`) exporting a class helper whose output is **byte-identical** to the strings already in use (variants: primary / outline / ghost; sizes: h-9 / h-10). Update only the call sites whose current class string matches the helper output exactly. Any call site with a bespoke string is left alone and recorded as a documented opportunity. Rendered HTML stays identical.

### 2. Token and pattern documentation
Rewrite `.lovable/design-system.md` (currently an old pre-build proposal) to describe the system as implemented: token architecture and where each decision lives, component ownership rules (ui vs abox), typography/spacing/radius/shadow conventions, metal tiers, status tones, shells and page patterns, the relationship to the existing branding/white-label system, reuse rules, and a Figma mapping table (token → variable, component → component, variant → variant). Plus a short list of remaining centralization opportunities, honestly marked as not done.

### 3. Internal Design System reference — `/design-system` (unlisted route)
A live technical reference that imports the **production** tokens and components, no copies: token swatches read from CSS variables at runtime, typography scale, radius/shadow/spacing samples, icon inventory, real `Button`/`Input`/`Select`/`Tabs`/`Table`/`Dialog`/`Drawer`, real `PlanCard`, `MetalBadge`, `StatusBadge`, `KpiCard`, `CarrierMark`, `EmptyState`, `PageHeader`, component states, and layout/shell patterns. Uses governed sample data already in the project.

### 4. Management Design Guide — `/design-guide` (unlisted route)
A polished, presentation-ready page for leadership: brand overview and logo usage, brand/semantic colors as named swatches, typography hierarchy, design tokens explained in plain language, key production components, component states, product/plan/marketplace/cart patterns, layout and navigation patterns, iconography, and recurring UI patterns. It renders the same production components and reads the same tokens — no static duplicates, no branding editor, no overlap with the existing Branding & White-Label screens.

Neither page is added to any navigation; both are reachable by direct link only.

## Explicitly not changing

Existing pages, layouts, spacing, colors, typography, icons, dimensions, responsive behaviour, navigation, routes, permissions, business logic, branding configuration, white-label behaviour, asset management, dashboards. No new libraries, no new fonts, no redesign.

## Technical notes

- New files: `src/components/abox/action-pill.ts`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`; rewritten `.lovable/design-system.md`.
- Both routes get their own `head()` metadata and are excluded from nav config.
- Token swatches resolve values via `getComputedStyle` on the document root at runtime, so light/dark and any future token edit flow through automatically.
- Validation: `bunx tsgo`, lint, build, plus Playwright screenshots of the two new pages and of `/`, `/plans`, `/cart`, and one internal admin page compared against current rendering to confirm nothing shifted.
