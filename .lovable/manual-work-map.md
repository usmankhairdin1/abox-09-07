# ABox — Manual Work, Presentation & Source-of-Truth Map

Audit of the codebase as it exists today. Nothing was changed. Every path, export and count below was read or searched in the current code during this audit; where it contradicts an earlier phase record, this document is the later reading.

Two words are used strictly:
- **PRODUCTION** — editing it changes what users see.
- **REFERENCE** — documentation. Editing it changes nothing users see.

---

## 1. Management presentation map

| What | URL | Route file | Kind | Audience | What it shows | What it does NOT control |
| --- | --- | --- | --- | --- | --- | --- |
| A. Brand / Design Guide | `/design-guide` | `src/routes/design-guide.tsx` | REFERENCE | Management, non-technical | Plain-language explanation of the system: what a pattern is, who owns what, open decisions, why duplicates remain, what must be settled before Figma | Nothing. It writes no value the product reads. It is not a theme editor |
| B. Technical Design System | `/design-system` | `src/routes/design-system.tsx` | REFERENCE | Designers, engineers | Tokens as rendered, component specs, patterns, dependency graph, readiness records | Nothing. Not a theme editor |
| C. Foundation/token documentation | `/design-system`, foundation sections | same file, data from `src/lib/design/foundation*.ts`, `color-*.ts`, `spacing*.ts`, `typography*.ts` | REFERENCE | Both | The real token values, read live from CSS variables | The values themselves — those live in `src/styles.css` |
| D. Component documentation | `/design-system`, component sections | data from `src/lib/design/spec-components-*.ts`, `components.ts` | REFERENCE | Both | 64 building blocks with anatomy, props, variants, states | The components themselves, in `src/components/` |
| E. Pattern documentation | `/design-system`, pattern sections | data from `src/lib/design/pattern-*.ts` | REFERENCE | Both | 23 recurring arrangements with anatomy, states, responsive, density | Any rendered page |
| F. Experience-pattern documentation | `/design-system` and `/design-guide` | `experience-patterns.ts`, `experience-extensions.ts`, `experience-readiness.ts` | REFERENCE | Both | How the four experiences differ and why | Experience behaviour |
| G. Figma-readiness documentation | `/design-system` → Figma readiness / library blueprint | `figma-readiness.ts`, `figma-library-readiness.ts`, `pattern-figma.ts`, `spec-figma-*.ts` | REFERENCE | Both | 5 ready / 10 partial / 2 blocked areas, proposed library structure | Nothing exists in Figma |
| H. Governance / ownership | `/design-guide` → ownership and approval sections | `canonical-boundaries.ts`, `change-governance.ts` | REFERENCE | Management | Who owns each layer, what review each change needs | It is not enforced by any build step |
| I. Canonicalization decision register | `/design-system` → decision register; `/design-guide` → how decisions are recorded | `canonical-decision-register.ts` | REFERENCE | Both | 14 open decisions, real options, consequences, approvals | No decision is selected |
| J. Other management-facing | `/app/jet/branding` and `/marketplace/admin/assets` | see sections 5 and 6 | **PRODUCTION** | Admins | The real runtime brand and asset screens | These are product screens, not documentation |

**Design Guide = management-facing reference. Design System = technical reference. Neither is a runtime theme editor.** Both routes are direct-URL only and appear in no navigation, header, sidebar, menu or breadcrumb.

---

## 2. Manual production edit map

| # | Task | Exact file | Export / section | Consumed by | Affects | Does not affect |
| --- | --- | --- | --- | --- | --- | --- |
| A | Global colours | `src/styles.css` | `:root` block, lines ~92–177 (`--background`, `--foreground`, `--surface`, `--panel`, `--card`, `--popover`, `--ink`) | Every screen, through Tailwind colour utilities | The whole application, both themes | Tenant brand values chosen at runtime |
| B | Semantic colours | `src/styles.css` | `--primary`, `--primary-soft`, `--secondary`, `--sage`, `--sage-soft`, `--muted`, `--accent`, `--destructive`, `--warning`, `--info`, `--success` plus each `-foreground`; aliased in `@theme inline` lines 32–79 | StatusBadge, buttons, all tone usage | Everything using that tone | Metal tiers, which are separate variables |
| C | Typography | `src/styles.css` | `@utility text-display` (line ~282), `text-eyebrow`, `text-serial`; sizes otherwise literal per component | Headings and labels app-wide | Only those three utilities | Ordinary `text-sm` / `text-lg` sizes — **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE**, written per component |
| D | Font families | `src/styles.css` | `--font-sans` (Inter Tight), `--font-display` (Bricolage Grotesque), `--font-serif` and `--font-mono` (both alias existing families) | Everything | All text | Font loading, which is a `<link>` in `src/routes/__root.tsx` |
| E | Font weights | no central definition | — | — | — | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE**: `font-medium`, `font-semibold` etc. written per component |
| F | Spacing | no central definition; Tailwind's default scale | — | — | — | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE**: `p-5`, `gap-2`, `px-3` etc. written per file |
| G | Radius | `src/styles.css` | `--radius-sm` … `--radius-4xl` (lines 19–25) and `--radius: 0.875rem` (line 92) | `rounded-*` utilities everywhere | All rounded corners | Any hard-coded `rounded-[Npx]` |
| H | Borders | `src/styles.css` | `--border`, `--border-strong`, `--hairline`, `--input` | Every bordered surface | All borders and hairlines | Border widths, set per component |
| I | Shadows / elevation | `src/styles.css` | `--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow`; `--shadow-overlay` alias | Cards, dialogs, drawers | All elevation | Tailwind default `shadow-*` where used directly |
| J | Control heights | `src/components/abox/action-pill.ts` for pills (h-8/h-9/h-10/h-11); `src/components/ui/button.tsx` for buttons | `ACTION_PILL` map | 33 files import ACTION_PILL; 20 import Button | Those controls | Inputs and selects, which set their own heights — **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| K | Icon sizing | no central definition | — | — | — | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE**: `h-4 w-4` etc. per call site, across 144 files using lucide-react |
| L | Motion | `src/styles.css` keyframes and `.animate-fade-rise`, `.animate-hairline`, `.animate-orbit`, `.animate-orbit-slow`, `.animate-drift`, `.animate-pulse-ring`, `.animate-shimmer`; plus `src/components/abox/motion.tsx` | Decorative surfaces | Those animations | Radix transitions inside primitives |
| M | Shared UI primitives | `src/components/ui/*` (49 files) | per file | Button 20 files, Card 6, Input 5, Select 5, Label 3, Dialog 3, Skeleton 2, Badge 1, Tabs 1 | Every screen importing them | Route-local kits, which do not use them |
| N | ABox business components | `src/components/abox/*` (27 modules + `decor/`) | per file | see section 3 | Many screens at once | Route-local kits |
| O | Page headers | `src/components/abox/page-header.tsx` | `PageHeader` | 23 files | Those screens | Marketing headings in `src/routes/index.tsx` and the masthead inside `internal-shell.tsx` — separate code |
| P | Status badges | `src/components/abox/status-badge.tsx`; tiers in `src/components/abox/metal-badge.tsx` | `StatusBadge` (tones sage / primary / warning / muted / destructive / info, composed with `color-mix`), `MetalBadge` | StatusBadge 87 files; MetalBadge 2 files | All status chips | Plain text labels |
| Q | Action pills | `src/components/abox/action-pill.ts` | `ACTION_PILL` (8 variants) | 33 files | Every pill using the constant | Any pill still written as a literal class string |
| R | Cards / surfaces | `src/components/ui/card.tsx` (6 importers) **and** the literal `rounded-2xl border border-hairline bg-card` written directly in **107 files** | — | both | Only what you edit | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| S | Tables | `src/components/abox/data-table.tsx` (19 importers); `src/components/ui/table.tsx` (0 direct importers found); raw `<table>` in 5 route files and in `src/components/lucie/ui.tsx`, `src/components/lucie-app/ui.tsx` | `DataTable` | 19 files plus route-local | Only the one edited | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| T | Forms | `src/components/ui/input.tsx`, `select.tsx`, `label.tsx`; `src/components/m06/kit.tsx`; `src/components/m08/kit.tsx` | per file | primitives 3–5 files each; kits used by their module screens | Only the one edited | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| U | Navigation | `src/lib/nav-config.ts` | `WORKSPACES`, `MEMBER_NAV` | `internal-shell.tsx`, `member-shell.tsx` | Internal and member destinations | The marketplace shell, whose pill nav is written inline in `marketplace-shell.tsx` |
| V | Shells | `src/components/abox/internal-shell.tsx` (89 files), `marketplace-shell.tsx` (30), `member-shell.tsx` (4: member index, quotes, settings, messages) | each default export | those routes | Only that shell's screens | The other two shells |
| W | Patterns | no pattern file exists in production | — | — | — | Patterns are arrangements written inside components and routes; edit the parts, not a pattern file |
| X | Experience-specific layouts | `src/routes/index.tsx` (marketing), `plans.index.tsx` + `cart.tsx` (shopping), `agency.*` / `app.*` (admin), `member.*` (member) | route components | that experience | Those screens | Other experiences |
| Y | Route-specific UI | the individual file under `src/routes/` | route component | one screen | That screen only | Everything else |
| Z | Branding | `src/routes/app.jet.branding.tsx`; marks drawn in `src/components/abox/logo.tsx`; favicon `public/favicon.ico` | `AboxMark`, `AboxWordmark` | Logo used in 3 files | The brand screens and marks | Global tokens — the branding screen currently displays swatches, it does not write tokens |
| AA | Marketplace assets | `src/routes/marketplace.admin.assets.tsx` + `src/lib/marketplace-store.ts` | `AssetType`, `getAssets`, `marketplaceStore.addAsset/updateAsset` | that route and sibling marketplace admin routes | Asset records | Design tokens or components |
| AB | Navigation configuration | `src/lib/nav-config.ts` | `WORKSPACES`, `MEMBER_NAV` | two shells | Destination lists, labels, icons | Marketplace nav (inline) and route definitions (file names under `src/routes/`) |

---

## 3. Component edit map

| Component | Production file | Export | Importers (production) | Shared? | Styling comes from | Multi-screen impact | Safe as a shared source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | `src/components/ui/button.tsx` | `Button`, `buttonVariants` | 20 | shared primitive | variants in-file + tokens | yes | yes |
| ACTION_PILL | `src/components/abox/action-pill.ts` | `ACTION_PILL` | 33 | shared constant | literal Tailwind strings in-file | yes | yes |
| StatusBadge | `src/components/abox/status-badge.tsx` | `StatusBadge` | 87 | shared | tone vars + `color-mix` in-file | yes, widest of any ABox component | yes |
| MetalBadge | `src/components/abox/metal-badge.tsx` | `MetalBadge` | 2 | shared | `--metal-*` and `--metal-*-fg` tokens | limited | yes |
| PageHeader | `src/components/abox/page-header.tsx` | `PageHeader` | 23 | shared | in-file classes + tokens | yes | yes, but two other screen-opening treatments exist |
| KpiCard | `src/components/abox/kpi-card.tsx` | `KpiCard` | 16 | shared | in-file + tone tokens | yes | yes |
| DataTable | `src/components/abox/data-table.tsx` | `DataTable` | 19 | shared | in-file (`min-w-[640px]`, `text-sm`, `px-5 py-4`) | yes | yes for its own consumers; other tables exist |
| EmptyState | `src/components/abox/empty-state.tsx` | `EmptyState` | 8 | shared | in-file | yes | yes |
| PlanCard | `src/components/abox/plan-card.tsx` | `PlanCard` | 4 | shared | in-file + tier tokens | shopping only | yes |
| CarrierMark | `src/components/abox/carrier-mark.tsx` | `CarrierMark` | 1 direct (re-used inside plan surfaces) | shared | in-file, deterministic monogram | limited | yes |
| InternalShell | `src/components/abox/internal-shell.tsx` | `InternalShell` | 89 | shared | in-file + `nav-config` + sidebar tokens | highest reach in the app | yes |
| MarketplaceShell | `src/components/abox/marketplace-shell.tsx` | `MarketplaceShell` | 30 | shared | in-file, nav written inline | yes, all shopping screens | yes |
| MemberShell | `src/components/abox/member-shell.tsx` | `MemberShell` | 4 | shared | in-file + `MEMBER_NAV` | member area only | yes |
| ModuleTabs | `src/components/abox/module-tabs.tsx` | `ModuleTabs` | 2 | shared | in-file | limited | yes |
| ProductSwitcher | `src/components/abox/product-switcher.tsx` | — | 1 | shared | in-file | one surface | yes |
| QuoteEditPanel | `src/components/abox/quote-edit-panel.tsx` | — | 1 | shared | in-file | one surface | yes |
| DownlineWizardStepper | `src/components/abox/downline-wizard-stepper.tsx` | — | 8 | shared | in-file (`px-2.5 py-1.5 text-xs`) | downline flow | yes |
| OverflowText | `src/components/abox/overflow-text.tsx` | `OverflowText` | used inside `plan-card.tsx` | shared | in-file | indirect | yes |
| AboxMark / AboxWordmark | `src/components/abox/logo.tsx` | `AboxMark`, `AboxWordmark` | 3 | shared | in-file SVG + tokens | brand surfaces | yes |
| PlanOAssistant | `src/components/abox/plan-o-assistant.tsx` | `PlanOAssistant` | 1 — imported by `internal-shell.tsx`, so it renders across internal screens | shared | in-file | yes, via the shell | yes |
| PlanAI assistant module | `src/components/abox/planai-assistant.tsx` | — | **0 importers found** | currently unused file | in-file | none today | FUTURE OPPORTUNITY — NOT IMPLEMENTED: the PlanAI experience users see is written inside the shopping routes and `marketplace-shell.tsx`, not in this module |
| Form primitives | `src/components/ui/input.tsx`, `select.tsx`, `label.tsx` | `Input`, `Select*`, `Label` | 5 / 5 / 3 | shared | in-file + tokens | moderate | yes for their own consumers |
| M06 kit | `src/components/m06/kit.tsx` (+ `registry.tsx`, `workforce-page.tsx`, `screens/`) | kit exports | M06 screens | route-local | in-file | that module only | no — module-owned |
| M08 kit | `src/components/m08/kit.tsx` (+ `screens.tsx`, `selling-setup.tsx`) | kit exports | M08 screens | route-local | in-file | that module only | no — module-owned |
| Lucie kits | `src/components/lucie/ui.tsx`, `src/components/lucie-app/ui.tsx`, `src/components/lucie-app/frames.tsx` | kit exports | Lucie screens | route-local | in-file | those screens | no — module-owned |
| ai-elements | `src/components/ai-elements/conversation.tsx`, `message.tsx`, `prompt-input.tsx`, `shimmer.tsx` | per file | Lucie conversation screens | route-local | in-file | those screens | no — module-owned |
| Dialog | `src/components/ui/dialog.tsx` | `Dialog*` | 3 (`app.jet.form-configurator.tsx`, `app.jet.products.tsx`, plus `ui/command.tsx`) | shared primitive | Radix + in-file | limited | yes |
| Skeleton | `src/components/ui/skeleton.tsx` | `Skeleton` | 2 (`lucie-app/ui.tsx`, `ui/sidebar.tsx`) | shared primitive | in-file | limited | yes |
| ToothIcon | `src/components/icons/tooth-icon.tsx` | `ToothIcon` | dental product surfaces | shared | wraps Tabler `IconDental` | dental icon only | yes |
| Reference kit | `src/components/design/reference-kit.tsx` | many | only the two design routes | REFERENCE | in-file | none on the product | not a product component |

---

## 4. Design token / foundation edit map

| Category | Current file | Exact token / class | Example consumers | Global or local | Manual edit impact |
| --- | --- | --- | --- | --- | --- |
| Colour | `src/styles.css` | `--background`, `--foreground`, `--surface`, `--panel`, `--card`, `--popover`, `--ink` | every screen | global | application-wide, both themes |
| Semantic colour | `src/styles.css` | `--primary`, `--secondary`, `--sage`, `--muted`, `--accent`, `--destructive`, `--warning`, `--info`, `--success` + `-foreground` | StatusBadge, buttons | global | every tone usage |
| Brand | `src/styles.css` compatibility block | `--brand-accent: var(--primary)` | brand-tinted surfaces | global alias | follows primary unless repointed |
| Surface | `src/styles.css` | `--surface`, `--panel`, and aliases `--surface-1/2/3` | cards, panels | global | all surfaces |
| Foreground | `src/styles.css` | each `*-foreground` variable | text on tinted backgrounds | global | text contrast everywhere |
| Border | `src/styles.css` | `--border`, `--border-strong`, `--hairline` | every bordered surface | global | all borders |
| Input / ring | `src/styles.css` | `--input`, `--ring`, `--color-ring-offset-background` | form controls, focus rings | global | focus visibility app-wide |
| Status | `src/styles.css` | `--warning`, `--info`, `--success`, `--destructive` | StatusBadge tones | global | all status chips |
| Tier / metal | `src/styles.css` | `--metal-bronze`, `--metal-expanded-bronze`, `--metal-silver`, `--metal-gold`, `--metal-platinum`, `--metal-catastrophic` and each `-fg`, with separate dark values | MetalBadge, plan tiles, metal filters | global | all plan tier chips |
| Typography | `src/styles.css` | `--font-sans`, `--font-display`, `--font-serif`, `--font-mono`; `@utility text-display`, `text-eyebrow`, `text-serial` | headings, eyebrows, serial text | global for families and those three utilities; **local for sizes and weights** | families: app-wide. Sizes: **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| Spacing | none | Tailwind default scale used literally | every file | **local** | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| Radius | `src/styles.css` | `--radius`, `--radius-sm` … `--radius-4xl` | all rounded corners | global | every corner |
| Shadow | `src/styles.css` | `--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow`, `--shadow-overlay` | cards, overlays, drawers | global | all elevation |
| Opacity | none | written as `/10`, `/24` etc. inside individual colour values and classes | borders, overlays | **local** | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| Breakpoints | Tailwind defaults | `sm md lg xl` used literally | every responsive class | **local usage of a global scale** | changing a breakpoint means editing each class |
| Control sizing | `src/components/abox/action-pill.ts`; `src/components/ui/button.tsx`; each form primitive | `ACTION_PILL` heights h-8/h-9/h-10/h-11; button size variants | 33 and 20 files | **partly local** | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| Icon sizing | none | `h-4 w-4` style classes per call site | 144 files use lucide-react | **local** | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| Motion | `src/styles.css` keyframes and `.animate-*`; `src/components/abox/motion.tsx` | `abox-fade-rise`, `abox-hairline-draw`, `abox-orbit`, `abox-drift`, `abox-pulse-ring`, shimmer | decorative surfaces | global for these | those animations only |
| Density | none | padding and gap literals per surface | every surface | **local** | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** |
| Compatibility aliases | `src/styles.css` end block | `--brand-accent`, `--ai`, `--ai-foreground`, `--surface-1/2/3`, `--shadow-overlay`, plus `--color-*` mappings | assistant and surface treatments | global | repointing an alias moves everything bound to it |

---

## 5. Branding & white-label map

- **Management view** — `/app/jet/branding` (and the marketplace-scoped brand screen at `/marketplace/admin/brand`).
- **Runtime implementation** — `src/routes/app.jet.branding.tsx`: renders the palette swatches (reading `--primary`, `--sage`, `--background`, `--sidebar` live), the logo / mark / favicon upload placeholders, and the disclosures field. Marketplace brand records are typed in `src/lib/marketplace-store.ts` (`Brand` interface).
- **Marks** — `src/components/abox/logo.tsx` exports `AboxMark` and `AboxWordmark`, both drawn in code with token-bound tones (`primary`, `sage`, `sidebar`, `foreground`). There are no image files for the brand.
- **Favicon** — `public/favicon.ico`.
- **Storage / state** — marketplace-scoped brand data lives in `src/lib/marketplace-store.ts`. The JET branding screen currently displays values and holds a disclosures field; it does not write design tokens.
- **Boundary** — branding is **runtime-owned**. `/design-guide` documents that boundary; it is not the branding screen and changes nothing here.

FUTURE OPPORTUNITY — NOT IMPLEMENTED: the branding screen's upload tiles are presentational placeholders today; no upload persistence was found on that route.

---

## 6. Marketplace asset map

- **Admin URL** — `/marketplace/admin/assets`.
- **Route file** — `src/routes/marketplace.admin.assets.tsx` (documented as SCR-M04-006, REQ-M04-BRD-004).
- **Main component** — the route's own `Page`, inside `InternalShell` with `StatusBadge` and `ACTION_PILL`.
- **Asset store / state** — `src/lib/marketplace-store.ts`: `AssetType` = `LOGO | MARK | FAVICON | HERO`, `MarketplaceAsset`, `getAssets`, `useMarketplaceState`, `marketplaceStore.addAsset` / `updateAsset`.
- **Upload flow** — a file input per type; `onUpload` creates an asset record with status `SCANNING`.
- **Validation / scan flow** — the record transitions to `VALID` after the scan step in the same handler.
- **Preview** — each type renders its existing assets in its own card.
- **Retirement / delete** — a delete affordance is present on the asset rows (Trash2 control).
- **Runtime ownership** — assets are marketplace records held in the marketplace store, owned by the product at runtime.
- **Distinct from** — the design-system asset documentation (`src/lib/design/assets.ts`, `iconography*.ts`), which only describes that no image files exist in `src/` and that brand marks are code-drawn. That documentation owns nothing.

---

## 7. Design-system reference map

All 118 modules in `src/lib/design/`, the reference kit and the two design routes are REFERENCE. **Verified: no file outside `src/lib/design/`, `src/components/design/` and the two design routes imports any of them.** Editing any of them changes documentation only.

| Group | Files | Purpose | Kind | Production imports it? | Changing it changes the app? |
| --- | --- | --- | --- | --- | --- |
| Foundations | `foundation.ts`, `foundation-model.ts`, `foundation-*.ts`, `color-foundation.ts`, `color-roles.ts`, `status-tone.ts`, `spacing*.ts`, `layout*.ts`, `typography*.ts`, `icon-motion-density.ts`, `token-naming.ts`, `design-tokens.ts` (in `src/lib/`) | Documents the real token values, read live from CSS variables | current documentation | no | no |
| Components | `components.ts`, `component-*.ts`, `inventory.ts`, `canonical-components.ts`, `spec-*.ts`, `spec-components-*.ts`, `spec-registry.ts` | Inventory and specification of 64 building blocks | mixed: inventory is current, specs are future specification | no | no |
| Patterns | `pattern-*.ts`, `screen-pattern-map.ts`, `pattern-registry.ts` | 23 patterns with anatomy, variants, states, responsive, density | current documentation plus future targets | no | no |
| Experiences | `experience-patterns.ts`, `experience-extensions.ts`, `foundation-experience.ts`, `experience-readiness.ts` | Four experiences and their differences | current documentation | no | no |
| Graph | `graph-*.ts` (19 modules), `graph-registry.ts` | One dependency graph from foundation to screen | current documentation | no | no |
| Governance | `governance.ts`, `spec-governance.ts`, `pattern-governance.ts`, `foundation-governance.ts`, `change-governance.ts`, `canonical-boundaries.ts`, `canonical-candidates.ts`, `canonical-decision-register.ts`, `migration-readiness.ts`, `regression-contract.ts`, `naming-readiness.ts`, `accessibility-readiness.ts`, `content-readiness.ts`, `readiness-registry.ts`, `canonical-readiness-types.ts` | Ownership, open decisions, approval process, protection contract | future specification | no | no |
| Figma | `figma-variables.ts`, `figma-library.ts`, `spec-figma-mapping.ts`, `spec-figma-library.ts`, `pattern-figma.ts`, `figma-readiness.ts`, `figma-library-readiness.ts` | Proposed library structure and readiness | future specification — nothing exists in Figma | no | no |
| Reference UI | `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx` | The two unlisted reference pages and their display helpers | reference UI | the two routes only | no, beyond those two pages |
| Documentation | `.lovable/design-system.md`, `roadmap.md` | Written record of phases 1–11 | documentation | no | no |

---

## 8. "If I want to change X" quick map

| I want to change… | Go here | Responsibility | Expected impact |
| --- | --- | --- | --- |
| Global primary colour | `src/styles.css` → `--primary` (and `--primary-foreground`, `--primary-soft`, plus the `.dark` values) | single global source | every primary surface in the app, both themes |
| A button | `src/components/ui/button.tsx` | shared primitive | 20 importing files |
| An action pill | `src/components/abox/action-pill.ts` → `ACTION_PILL` | shared constant | 33 files; any pill still written inline is unaffected |
| A status badge | `src/components/abox/status-badge.tsx`; tiers in `metal-badge.tsx` | shared | 87 files for StatusBadge |
| A page header | `src/components/abox/page-header.tsx` | shared | 23 files — **but** marketing headings (`src/routes/index.tsx`) and the shell masthead (`internal-shell.tsx`) are separate and need editing too |
| A card | **multiple**: `src/components/ui/card.tsx` (6 files) **and** the literal surface string in 107 files | no single owner | editing the component reaches only its 6 importers |
| Table styling | **multiple**: `src/components/abox/data-table.tsx` (19 files), `src/components/ui/table.tsx`, raw `<table>` in 5 routes and the two Lucie kits | no single owner | only the one you edit |
| Form styling | **multiple**: `src/components/ui/input.tsx`, `select.tsx`, `label.tsx`, `src/components/m06/kit.tsx`, `src/components/m08/kit.tsx` | no single owner | only the one you edit |
| Typography | `src/styles.css` for families and the three text utilities; otherwise **per component** | split | families change everything; sizes must be edited per file |
| Spacing | **per file** — no central definition | no single owner | only the file you edit |
| Radius | `src/styles.css` → `--radius*` | single global source | all rounded corners |
| Shadows | `src/styles.css` → `--shadow-*` | single global source | all elevation |
| Icon size | **per call site** across 144 files | no single owner | only where you edit |
| One specific page only | that file under `src/routes/` | route-local | that screen only |
| A shell | `internal-shell.tsx` (89 screens), `marketplace-shell.tsx` (30), or `member-shell.tsx` (4) | one shell each | every screen inside that shell |
| Navigation | `src/lib/nav-config.ts` → `WORKSPACES` / `MEMBER_NAV`; marketplace nav is inline in `marketplace-shell.tsx` | split | internal and member destinations; marketplace needs the shell file |
| Branding & white-label | `src/routes/app.jet.branding.tsx`, `src/components/abox/logo.tsx`, `public/favicon.ico`, `Brand` in `src/lib/marketplace-store.ts` | runtime-owned | brand screens and marks |
| Marketplace assets | `src/routes/marketplace.admin.assets.tsx` + `src/lib/marketplace-store.ts` | runtime-owned | asset records and that admin screen |
| Management documentation | `src/routes/design-guide.tsx` (+ the `src/lib/design/*` data it reads) | reference | the `/design-guide` page only |
| Technical design-system documentation | `src/routes/design-system.tsx` (+ `src/lib/design/*`) | reference | the `/design-system` page only |
| Something for Figma | `src/lib/design/figma-readiness.ts`, `figma-library-readiness.ts`, `pattern-figma.ts`, `spec-figma-*.ts` | reference proposal | documentation only; nothing exists in Figma |

---

## 9. "What not to edit" map

**Reference only — editing these documents or specifies the system but does NOT change the running product:**
- `src/lib/design/*` (118 modules)
- `src/lib/design-tokens.ts` (read only by the two design routes and the reference kit)
- `src/components/design/reference-kit.tsx`
- `src/routes/design-system.tsx`
- `src/routes/design-guide.tsx`
- `.lovable/design-system.md`
- `roadmap.md`

**Production — editing these DOES change the running product:**
- `src/styles.css`
- `src/components/ui/*`
- `src/components/abox/*`
- `src/components/m06/*`, `m08/*`, `lucie/*`, `lucie-app/*`, `ai-elements/*`, `icons/*`
- everything under `src/routes/` except the two design routes
- `src/lib/nav-config.ts`, `marketplace-store.ts`, `cart-store.ts`, `quote-store.ts`, `org-store.ts` and the other stores in `src/lib/`
- `public/favicon.ico`

---

## 10. Production vs reference matrix

| Area | Live production? | Reference only? | Management view? | Manual edit location | Impact scope |
| --- | --- | --- | --- | --- | --- |
| Foundations | yes | documented separately | `/design-system` | `src/styles.css` | application-wide |
| Components | yes | documented separately | `/design-system` | `src/components/ui/*`, `src/components/abox/*` | many screens |
| Patterns | yes, as written code | documented separately | `/design-system` | the components and routes that form them | varies |
| Experiences | yes | documented separately | `/design-guide` | route files per experience | that experience |
| Branding | yes | described only | `/app/jet/branding` | that route, `logo.tsx`, `favicon.ico` | brand surfaces |
| Marketplace assets | yes | described only | `/marketplace/admin/assets` | that route + `marketplace-store.ts` | asset records |
| Navigation | yes | documented separately | none | `nav-config.ts` + `marketplace-shell.tsx` | internal + member, or marketplace |
| Routes | yes | inventoried | none | `src/routes/*` | one screen each |
| Design System page | no | yes | `/design-system` | `design-system.tsx` | that page only |
| Design Guide page | no | yes | `/design-guide` | `design-guide.tsx` | that page only |
| Figma blueprint | no | yes | `/design-system` | `figma-*.ts` | nothing — no Figma exists |
| Governance | no | yes | `/design-guide` | governance modules | nothing enforced |
| Documentation | no | yes | in repo | `.lovable/design-system.md`, `roadmap.md` | nothing |

---

## 11. Source-of-truth warnings

No winner is chosen, nothing is ranked, nothing is fixed.

| Concept | Current multiple sources | Consumers | Difference | Impact if edited manually |
| --- | --- | --- | --- | --- |
| Card / surface | `src/components/ui/card.tsx`; the literal `rounded-2xl border …  bg-card` string | 6 files vs 107 files | padding and border token differ per site | editing the component reaches 6 files; the other 107 keep their own |
| Table | `abox/data-table.tsx`; `ui/table.tsx`; raw `<table>` in 5 routes; `lucie/ui.tsx`; `lucie-app/ui.tsx` | 19 vs 0 direct vs route-local | cell padding, min width, empty handling, labelling | a change lands in one only |
| Form fields | `ui/input.tsx` + `select.tsx` + `label.tsx`; `m06/kit.tsx`; `m08/kit.tsx` | 5 / 5 / 3 vs module screens | label placement, help and error text, validation wiring | governed module screens are unaffected by primitive edits |
| Screen opening header | `abox/page-header.tsx`; marketing headings in `routes/index.tsx`; masthead inside `internal-shell.tsx` | 23 vs landing vs internal screens | eyebrow, icon tile, hairline, heading level | three edits needed to change "the page header" everywhere |
| Shell navigation | `internal-shell.tsx`; `marketplace-shell.tsx`; `member-shell.tsx` | 89 / 30 / 4 | rail vs floating pill vs arc rail; different collapse points; nav-config vs inline | a navigation change needs up to three files |
| Navigation configuration | `nav-config.ts` for internal and member; inline in `marketplace-shell.tsx` | two shells vs one | data-driven vs written in the component | marketplace destinations are not in nav-config |
| Assistant surface | `abox/plan-o-assistant.tsx` (rendered via `internal-shell.tsx`); `abox/planai-assistant.tsx` (**no importers**); PlanAI text inside shopping routes and `marketplace-shell.tsx`; `ai-elements/*` for Lucie | internal screens / none / shopping / Lucie | different message models, composers and persistence | editing `planai-assistant.tsx` changes nothing visible today |
| Control sizing | `action-pill.ts` (h-8/h-9/h-10/h-11); `ui/button.tsx` size variants; form primitives | 33 / 20 / 5 | 36px and 40px both in use | one change does not align the others |
| Icon sizing | per call site | 144 files | `h-4 w-4` and others chosen locally | no single edit can change icon size globally |
| Spacing, density, opacity | per file literals | application-wide | `p-5` vs `p-6`, `gap-1.5` vs `gap-2` | only the file you edit changes |
| Typography sizes and weights | per component (families are central) | application-wide | several heading sizes, five uppercase tracking values | a global type change means many files |
| `.story-link` | used 89 times, **no definition found** in `src/styles.css` | 89 sites | the class currently styles nothing | defining it would visibly change 89 links |

---

## 12. Management handoff

Five destinations, and what each is for:

1. **Design Guide — `/design-guide`.** The plain-language reference: what the system contains, who owns which part, which decisions are open and what each would cost. Read this for status and decisions. It changes nothing in the product.
2. **Design System — `/design-system`.** The technical counterpart: exact values, components, patterns and how they connect. For designers and engineers. It also changes nothing in the product.
3. **Branding & White-Label — `/app/jet/branding`.** A real product screen for brand configuration: palette, logo, mark, favicon and disclosures.
4. **Marketplace Asset Management — `/marketplace/admin/assets`.** A real product screen for uploading, validating, previewing and retiring marketplace artwork.
5. **Future Figma blueprint — the Figma readiness and library sections of `/design-guide` and `/design-system`.** A written proposal only. Nothing exists in Figma today.

The first two are documentation. The next two are the live product. Keeping that line clear matters: changing a page in the guide does not change what a customer sees.

---

## 13. Developer handoff

Start here, by intent:

- **Global foundation** — `src/styles.css`. Colour, semantic tone, tier, border, radius, shadow, font family, the three text utilities, animations and the compatibility aliases. One file, application-wide effect.
- **Shared components** — `src/components/ui/*` for primitives, `src/components/abox/*` for ABox components. Check the consumer count in section 3 before editing: StatusBadge reaches 87 files and InternalShell 89.
- **Patterns** — there is no pattern file. A pattern is an arrangement of the above; change the parts.
- **Experience / page** — the specific file under `src/routes/`. Changes there stay on that screen.
- **Branding** — `src/routes/app.jet.branding.tsx`, `src/components/abox/logo.tsx`, `public/favicon.ico`, `Brand` in `src/lib/marketplace-store.ts`.
- **Marketplace assets** — `src/routes/marketplace.admin.assets.tsx` with `src/lib/marketplace-store.ts`.
- **Navigation** — `src/lib/nav-config.ts` for internal and member; marketplace navigation is inline in `marketplace-shell.tsx`.
- **Route-local** — `src/components/m06/*`, `m08/*`, `lucie/*`, `lucie-app/*`, `ai-elements/*`: owned by their module, not shared.

**Warning:** several concepts are implemented in more than one place — cards, tables, form fields, screen headers, navigation, assistants, control sizing, icon size, spacing and type scale. Section 11 lists every one with its real files. Editing one of them does not change the others.

Nothing in `src/lib/design/`, `src/components/design/`, `/design-system`, `/design-guide`, `.lovable/design-system.md` or `roadmap.md` affects the running product.

## Phase 31 — Group B surface exceptions (2026-09-18)

Canonical source: `src/components/abox/surface.tsx` (`surfaceClass`). Migrated Group B consumers: `src/routes/quote.tsx:499` (elevated), `src/routes/coverage.tsx:49` (elevated + consumer layout classes).

Left literal, with reason:
- `src/routes/app.employer.ichra.tsx:39,60` — decorated panels (`card-brackets edge-sheen`, one with an inline `boxShadow`); route is sign-in gated and no test session could be minted, so exact-preservation evidence is NOT CAPTURED. Re-audit once a session is available.
- `src/routes/index.tsx:188`, `src/routes/app.index.tsx:101,133,167,190` — `border-hairline` / `shadow-card` vocabulary and/or interactive card semantics; not the canonical Surface base string.
- `src/components/abox/kpi-card.tsx`, `plan-card.tsx`, `src/components/lucie/ui.tsx`, `src/components/m08/*`, `src/components/m06/*` — excluded component systems.

## Phase 32 — Group C interactive card surfaces (2026-09-18)

Canonical source unchanged (`src/components/abox/surface.tsx`, md5 `51b51b31bee3283794f6a05af03f2878`); no API extension was justified. Interactive consumers keep their own native element and compose `surfaceClass()` via `cn()`; the canonical source never owns interaction, state or accessibility.

Migrated (measured byte-identical parity at 1440/834/390, rest + hover + focus):
- `src/routes/agent-unavailable.tsx:26` — `<Link to="/select">`, `cn(surfaceClass({ padding: "sm" }), "hover:bg-accent")`.
- `src/routes/agent-unavailable.tsx:27` — `<Link to="/">`, same usage.
- `src/routes/journey-choice.tsx:36` — `<button onClick={startNew}>`, `cn("w-full", surfaceClass(), "text-left hover:bg-accent")`.

Left literal, with reason:
- `src/routes/app.agency.index.tsx:28,33,38,42` — four `Link` cards whose string is reproducible, but `/app/agency` renders nothing without a session, so exact-preservation evidence is NOT CAPTURED. Re-audit once a session is available.
- `src/routes/agent-unavailable.tsx:25`, `src/routes/journey-choice.tsx:32` — `border-primary/40 bg-primary/5` emphasis variants, not the canonical base string.
- `src/routes/quote.tsx:896,959,1142` — `label` selection cards on `bg-surface` / `bg-sage-soft/40`; not the canonical base.
- `src/routes/app.index.tsx:190`, `src/routes/index.tsx:188` — `border-hairline` / `shadow-card` vocabulary with translate/border hover.
- `src/routes/plans.$planId.tsx:218` — dashed-border placeholder link, no `bg-card`.
- `src/components/abox/plan-card.tsx:44`, `kpi-card.tsx`, Lucie, Lucie-app, M06, M08, shells, overlays — excluded systems, untouched.

## Phase 33 — Form control surface (2026-09-18)

New canonical class source: `src/components/abox/control.tsx` (`controlClass({ height, focusRing })`, md5 `1c6efd5cf752b69d16458b6af82b5d4f`). Class-level only: consumers keep their own native element, props, value, handlers, label association and accessibility attributes. Emission order height -> base -> focusRing. `src/components/abox/surface.tsx` unchanged (`51b51b31bee3283794f6a05af03f2878`).

Migrated (measured byte-identical parity at 1440/834/390 — rest, hover, focus, filled; class string, DOM, attributes, required/disabled/validity, label rect, geometry, overflow, zero console errors):
- `src/routes/auth.tsx:210` email, `:195` full name, `:244` mobile phone — `cn("mt-1", controlClass({ height: "lg", focusRing: true }))`.
- `src/routes/schedule.tsx:86,92,97` name, phone, topic select — same usage.

Left literal, with reason:
- `src/routes/auth.tsx:226` (password, `pl-9 pr-3` icon padding) and `:257` (OTP, `tracking-widest tabular-nums`, only rendered after a code is sent) — not the canonical control string / not reachable for measurement.
- All `h-10`/`h-11` controls in `member.settings`, `app.*`, `agency.*`, `platform.*`, `marketplace.admin.*` — routes redirect to `/auth` or render blank without a session, so parity evidence is NOT CAPTURED. Re-audit once a session is available.
- `src/routes/quote.tsx` control kit (`bg-surface`, `py-2.5`, `focus-visible:ring-2`), `src/routes/apply.tsx:319` `Field` (`py-2`, `focus:border-primary`), `app.off-exchange.tsx:113`, `app.jet.module1.tsx:97` — route-local kits on different vocabularies.
- `src/components/ui/*` (shadcn `h-9 rounded-md border-input`), `m06/kit.tsx`, `lucie-app/ui.tsx`, M08, ai-elements — separate systems, untouched; no competing source created for them.

Foundation gaps recorded, not fixed: `h-10` vs `h-11` control heights; `focus:ring-2 focus:ring-ring` vs `focus-visible:ring-1` vs `focus:border-primary`; `border-border` vs `border-input`; `bg-background` vs `bg-surface`.

## Phase 34 — Wrapping-label field composition (2026-09-18)

New canonical composition: `src/components/abox/field.tsx` — `LabeledField({ label, className, children })`, md5 `f35b23647e16f71451ce95a584a9951e`. Renders exactly `<label className="block text-sm"><span className="text-eyebrow">{label}</span>{children}</label>`. Control element, props, value, handlers, validation, required semantics and classes stay consumer-owned as children. Label association stays implicit through the wrapping label; no htmlFor/id pairing, no generated ids, no ARIA added. `control.tsx` (`1c6efd5cf752b69d16458b6af82b5d4f`) and `surface.tsx` (`51b51b31bee3283794f6a05af03f2878`) unchanged.

Migrated (6 consumers, byte-identical `outerHTML`, full element tree, computed styles, geometry, control state — required/validity/value/labels/tabIndex — and zero console errors at 1440/834/390 in rest, focus and filled states):
- Batch 1: `src/routes/schedule.tsx` Your name.
- Batch 2: `src/routes/schedule.tsx` Best phone, What's the call about? (select).
- Batch 3: `src/routes/auth.tsx` Full name (register), Email, Password (keeps its `relative mt-1` wrapper and icon as children), Mobile phone (phone-OTP method).

Left literal, with reason:
- `src/routes/auth.tsx:246` Verification code — only rendered after an OTP is sent, not reachable for measurement; also carries a trailing help `<p>` inside the label. NOT CAPTURED.
- `<label className="mb-1 block text-eyebrow">` family (~52 across `marketplace.admin.*`, `platform.*`, `agency.organizations.*`) and remaining `block text-sm` labels in `agency.downlines.new.*`, `app.*` — different composition and/or auth-gated routes that redirect to `/auth` or render blank without a session. NOT CAPTURED; no migration attempted.
- Route-local helpers left untouched on their own vocabularies: `quote.tsx` `Field` (htmlFor pairing, `mt-1.5` slot, `role="alert"` error / hint with generated `-error`/`-hint` ids and aria-describedby), `apply.tsx` `Field`, `app.off-exchange.tsx`, `app.jet.module1.tsx`.
- `src/components/ui/form.tsx` has no production consumers (reference layer only) — recorded as unused, not canonical; no competing ABox FormField created and its DOM/classes differ from every route composition.

Deferred, not implemented: two competing label shapes (`block text-sm` + inner `text-eyebrow` span vs `mb-1 block text-eyebrow` label), `mt-1` vs `mt-1.5` label/control gaps, control-height and focus-ring vocabulary normalization, help/error message spacing, aria-describedby coverage outside `quote.tsx`.

---

*Audit only. No file under `src/` or `public/` was created, modified or deleted while producing this map.*

## Phase 35 — Navigation & page-level composition (executed)

**Audit result.** Navigation is intentionally fragmented and stays that way. Three shell families (`internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx`) each render their own presentation of destinations from `src/lib/nav-config.ts`; none were merged. `ModuleTabs` (consumers: `m06/workforce-page.tsx:46`, `lucie-app/frames.tsx:21`) and `ui/tabs.tsx` (consumer: `app.jet.platform.tsx:128`) are separate tab systems in excluded/gated systems — untouched. Four distinct step/progress bars (`quote.tsx:388` button+ol wizard, `apply.tsx:112` pill ol, `app.off-exchange.tsx:23` pill ol, `downline-wizard-stepper.tsx` Link-based route stepper) differ in element semantics, class strings (`mb-6`, active-class ordering) and state models — left literal. `ui/breadcrumb.tsx`, `ui/pagination.tsx`, `ui/sidebar.tsx`, `ui/navigation-menu.tsx`, `ui/menubar.tsx` have zero production consumers: recorded as unused, not canonical. `text-eyebrow` is a single CSS utility, not a composition.

**New canonical source.** `src/components/abox/notice-page.tsx` — `NoticePage({ tone, icon, title, description, children })`. Owns only the centred standalone-notice opening: `section.mx-auto.max-w-lg.px-4.py-32.text-center` > medallion `span` (tone map: muted / destructive / warning / primary) > `h1.text-display.mt-6.text-2xl` > `p.mt-3.text-sm.text-muted-foreground` > consumer-owned children. It is NOT a second PageHeader: PageHeader owns the in-shell workspace header (eyebrow, left-aligned title, actions, hairline). PageHeader source unchanged (md5 5be9e6ea…).

**Legitimate consumers (migrated, byte-identical HTML/DOM/geometry at 1440/834/390, zero console output, no overflow):** `no-options.tsx` (proof consumer, tone muted), `unavailable.pathway.tsx` (muted), `unavailable.unresolved.tsx` (destructive), `agent-unavailable.tsx` (warning).

**Excluded consumers.** `support.tsx` — different padding (`py-24`), runtime-content title and conditional description; left literal. All auth-gated navigation (`/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*`) — NOT CAPTURED, left literal.

**Rules.** Future standalone notice screens use `NoticePage`; no second notice/header component may be created. Any new tone requires two consumers. Actions stay consumer-owned as children. Rollback point: restore the literal `section`/`span`/`h1`/`p` markup in the four routes and delete `notice-page.tsx`; nothing in Phases 29–34 is affected.

**Validation.** tsgo clean; build OK; `notice-page.tsx` lints clean; remaining lint on the four routes is the pre-existing prettier backlog on untouched `Link` lines. Locked source hashes unchanged: page-header, surface, control, field, module-tabs, nav-config, all three shells.

## Phase 36 — Typography roles & text-style source of truth (executed: zero migrations)

**Outcome: zero migrations.** No production file was created, modified, deleted or reformatted. Every locked source hash is unchanged. Zero migrations was an approved valid outcome and is the correct result of the exact-parity gate.

**Canonical typography ownership map.**
- `src/styles.css` (md5 534cd653f5aae3c9a8e042345d53d852) owns the font families (`--font-sans`/`--font-mono` Inter Tight, `--font-display`/`--font-serif` Bricolage Grotesque) and the only three semantic text aliases: `@utility text-display` (display family, weight 600, tracking -0.032em, line-height 1.02), `@utility text-eyebrow` (mono, 0.6875rem, weight 500, uppercase, muted), `@utility text-serial` (mono, 0.625rem, uppercase, muted, tabular-nums). Size and weight are always composed at the call site with raw Tailwind utilities — this is the existing contract, not a defect to repair here.
- Role typography owned by completed components, ownership left intact: `page-header.tsx` 5be9e6ea… (context eyebrow + page title), `kpi-card.tsx` 9279cd20… (KPI eyebrow + `text-display … text-5xl tabular-nums` value), `empty-state.tsx` 6cfba448… (`text-display text-2xl` title), `field.tsx` f35b2364… (field label caption), `notice-page.tsx` 81ee6c0f… (notice title/description), `control.tsx` 1c6efd5c… and `surface.tsx` 51b51b31… (no typography role).
- `src/lib/design/**` (incl. `graph-typography.ts`) and `src/components/design/**` are reference documentation, not production owners. `src/components/ui/*` typography carries no independent production ownership.

**Measured inventory (production `src/routes` + `src/components/abox`).** `text-sm` 983, `text-xs` 571, `text-eyebrow` 267, `text-display` 246, `font-semibold` 194, `uppercase` 93, `text-2xl` 86, `tracking-tight` 12. Eyebrow shapes: bare `text-eyebrow` 125, `mb-1 block text-eyebrow` 52, remainder one-off spacing/layout variants. Muted body: `text-sm text-muted-foreground` 64, `text-xs text-muted-foreground` 116.

**Why no candidate cleared the gate.**
- `text-display text-xl` (55 occurrences) is not one semantic role. Opened in source it renders at least four different roles on different elements: true section headings `<h2>` (`privacy.tsx:41`, `terms.tsx:40`, both inside a `.map()` — one call site per file), card titles `<p>` after an icon medallion (`ichra.tsx:44`, `shared.$token.tsx:113`), panel labels `<p>` (`plans.index.tsx:379`, `faq.tsx:77`, `accessibility.tsx:93`), and numeric price values `<p className="text-display text-xl tabular-nums">` (`index.tsx:136/146/156`). Identical class string, different semantic roles — the semantic-role rule forbids conflating them. The only exactly-matching pair (privacy/terms `<h2>`) is two single call sites; a shared source there is abstraction without benefit, and the other 53 occurrences are auth-gated.
- `mb-1 block text-eyebrow` (52) occurs exclusively on auth-gated routes (`marketplace.admin.*`, `platform.*`, `agency.organizations.*`); with `LOVABLE_BROWSER_AUTH_STATUS=signed_out` no parity can be measured. NOT CAPTURED — left literal, no migration from source similarity.
- Bare `text-eyebrow` (125) is already the canonical alias applied directly; there is nothing to centralize and a wrapper would only add DOM.
- `text-sm text-muted-foreground` / `text-xs text-muted-foreground` are inline colour+size compositions on heterogeneous elements (`p`, `span`, `td`, `div`) with different ancestry, wrapping and truncation behaviour; no shared semantic contract.
- Pricing/quote values, plan names, organization names and status text are geometry- and business-coupled (tabular-nums width, wrapping) — excluded by rule.
- Shells, Lucie, Lucie-app, M06, M08, ai-elements, Branding & White-Label runtime, Marketplace Asset Management runtime and the reference layers were not inspected for centralization and not touched.

**Rules going forward.** `src/styles.css` remains the single owner of typography aliases; no duplicate alias and no universal `Typography`/`Text` component may be created. Component-intrinsic typography stays inside its component. A new shared text role requires >=2 measurable consumers with identical semantic role, element, class string and no business coupling.

**Fragmentation register (documented, deliberately not repaired).** Section-heading size drift (`text-display text-xl` / `text-2xl` / `text-lg` / `mb-3 text-xl`); the same class serving heading, card title, panel label and numeric value; caption vocabulary split across `text-eyebrow`, `text-xs text-muted-foreground`, `text-serial`; redundant `font-semibold` layered on `text-display` (already weight 600); `<h2>` vs `<p>` used for visually equivalent headings (heading hierarchy issue — never fixed by a typography change alone).

**Rollback.** Nothing to roll back; no diff was produced. Phases 29-35 untouched.

**Validation.** `git status` clean before and after apart from this map entry; latest build log reports `build OK`; no source edits, therefore no lint or typecheck delta. Locked hashes re-verified: styles.css 534cd653…, page-header 5be9e6ea…, kpi-card 9279cd20…, empty-state 6cfba448…, field f35b2364…, control 1c6efd5c…, surface 51b51b31…, notice-page 81ee6c0f….

## Phase 37 — Control sizing & icon sizing source of truth (executed)

**Canonical control-sizing owners (unchanged in ownership).** `abox/action-pill.ts` + `action-pill-component.tsx` own the rounded-full action pill treatment; `abox/control.tsx` owns the form-control surface (height, width, radius, border, background, px, opt-in focus ring) and its API was deliberately NOT expanded; shadcn `ui/button.tsx` (default h-9, sm h-8, lg h-10 px-8, icon h-9 w-9, icon-sm h-8 w-8), `ui/input.tsx` h-9, `ui/checkbox.tsx` h-4 w-4, `ui/switch.tsx` h-5 w-9, `ui/tabs.tsx` h-9 own their own primitives — the ABox pill system stays a separate system and was not merged into Button. PageHeader, KpiCard, EmptyState, field, NoticePage, StatusBadge keep component-intrinsic sizing.

**Canonical icon-sizing owner: none, deliberately.** Inventory: `h-4 w-4` 146, `h-3.5 w-3.5` 44, `h-3 w-3` 29, `h-5 w-5` 14, `h-8 w-8` 6, `h-6 w-6` 1, `size-5` 1, `size-3.5` 1. `h-4 w-4` spans leading control icons, nav icons, table action icons, status icons and decorative icons — identical dimensions, different semantic roles. A token would emit the identical string while conflating roles and inviting wrapper/gap geometry to drift into an icon abstraction. No icon token, no icon registry, no `size-*` normalization, no icon replacement. The two stray `size-*` uses are recorded as fragmentation only.

**Source change (additive only).** `action-pill.ts` gained two variants copied byte-for-byte from existing production literals; all eight pre-existing variants are untouched. New hash a5bc83a678aacb67c1209f3bd2bcb405 (was 64024bf5f0ed7f4c1b714a9d3939e9fe).
- `outlineMdPlain` = `inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent` (distinct from `outlineMd`: no `gap-1.5`, no `font-medium`).
- `primaryLgPlain` = `inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground` (distinct from `primaryLg`: no gap, `px-5` not `px-6`, no hover rule).

**Legitimate consumers (migrated, each independently gated and measured identical at 1440/834/390 — DOM, attributes, byte-identical class string, computed box/padding/border/radius/typography, bounding rect, hover and focus geometry, scroll dimensions, zero page overflow change, zero console errors):**
- `coverage.tsx:41` Link — `actionPillClass("outlineMdPlain")` (Batch 1 proof consumer)
- `plans.$planId.tsx:77` button — `actionPillClass("outlineMdPlain")`
- `schedule.tsx:67` button — `actionPillClass("primaryLgPlain", "disabled:opacity-60")` (extra class appended last by `cn()`, preserving original order)
- `ai-review.tsx:132` button — `actionPillClass("primaryLgPlain", "disabled:opacity-60")`
- `ichra.tsx:79` Link — `actionPillClass("primaryLgPlain")`

**Intentionally literal / NOT CAPTURED.**
- `compare.tsx:72` "Clear comparison" — renders only when the compare list is non-empty; not present on load, so no before/after could be measured.
- `schedule.tsx:108` "Confirm call" — only exists at the form step; in this environment the slot buttons do not register a click (pre-existing, no console error), so the form step is unreachable. Migrated briefly, then reverted to the literal string under the unmeasurable rule.
- All repeated pill literals on `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*` — the 7x `h-10 px-5 hover` group, the 6x and 5x `h-10 px-4` groups, the 3x `h-8` outline group and the long tail. `LOVABLE_BROWSER_AUTH_STATUS=signed_out`; blank without a session. NOT CAPTURED, left literal. Prerequisite for future migration: an authenticated session.

**Fragmentation register (documented, not repaired).** Six near-miss pill strings differing from canonical variants only by a missing `gap-*`, a missing `font-medium`, a missing hover rule or px-4/px-5/px-6; one-off destructive, sage and ghost pills; square icon-control wrappers at h-7/h-8/h-9/h-10/h-11; `size-*` vs `h-N w-N` icon vocabulary; shadcn Button heights (h-9/h-8/h-10) coexisting with the ABox pill heights (h-8/h-9/h-10/h-11).

**Rules.** New text-only secondary/primary pills use the two new variants; no third pill source may be created; a new variant requires >=2 independently measurable consumers and must be a byte-for-byte copy of an existing literal. Icon sizing stays at the call site. `control.tsx` is not extended to cover buttons.

**Rollback.** Per consumer: restore the literal class string and drop the `actionPillClass` import. Per source: delete the two additive keys. Independent per consumer; Phases 29-36 unaffected.

**Validation.** `npx tsgo --noEmit` clean; build OK; `action-pill.ts` lints clean; route lint output is the pre-existing prettier backlog on untouched lines (coverage 17, plans.$planId 22, ichra 12, ai-review 13, schedule 78 — all formatting, none on a migrated line). Locked hashes unchanged: action-pill-component 4c9fb916…, control 1c6efd5c…, ui/button f7a5102d…, page-header 5be9e6ea…, surface 51b51b31…, field f35b2364…, notice-page 81ee6c0f…, styles.css 534cd653….

## Phase 38 — Spacing & layout source of truth (executed)

**Canonical source.** `abox/marketplace-page-layout.ts` owns exactly two marketplace page-wrapper class strings. It is a class-level source only: consumers retain native elements, DOM position, children, state and behavior. `wide` is the public marketplace content-page relationship (`max-w-[88rem]`, 16/32px horizontal padding and 16→24px top, 32→40px bottom). `narrow` is the public workflow-page relationship (`max-w-4xl`, the same horizontal/top contract and 40→56px bottom). Numeric resemblance alone does not qualify a consumer.

**Legitimate consumers (migrated).** Wide: `coverage.tsx`, `compare.tsx`, `cart.tsx`, `review.tsx`, `plans.$planId.tsx`, `plans.index.tsx`. Narrow: `schedule.tsx`, `ai-review.tsx`, `handoff.tsx`, and only the empty-state branch in `apply.tsx`. Each retains the byte-identical rendered class string.

**Evidence.** Thirty public route/viewport states were captured before and after at 1440, 834 and 390. All 30 retained identical wrapper classes, computed margins/padding/gaps/min-max dimensions, wrapper rectangles, scroll/client dimensions, overflow, headings, links, buttons, routing and zero console errors. Parent/first-child y values showed nondeterministic fractional movement during entrance animation (generally under 1px, one `/plans` tablet sample 2.46px); wrapper geometry and every computed style remained exact, and paired screenshots showed no visual change. This was classified as capture-time animation noise rather than layout output.

**Intentionally literal / NOT CAPTURED.** The populated `/apply` workflow has a distinct wide wrapper and vertical rhythm. Shell geometry, landing sections, quote/select/ICHRA/auth/footer/product-switcher containers, tables outside `DataTable`, route-local stacks/rows/error regions, arbitrary/calc geometry, overlays, and component-intrinsic spacing remain with their owners. Signed-in `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, and `/member/*` routes were not capturable and remain literal. Schedule form/done, compare populated, and other unreachable dynamic states were not used as migration evidence; the migrated wrapper itself was proven in each route's captured public state.

**Ownership and boundaries.** Internal, marketplace and member shells stay independent. Surface, ActionPill, control, PageHeader, KpiCard, DataTable, EmptyState, Field, NoticePage and shadcn primitives retain intrinsic spacing. Reference layers, Branding & White-Label runtime, Marketplace Asset Management runtime, Lucie/Lucie-app, M06, M08 and AI-elements were untouched. No CSS token, universal Layout/Stack/Container/Spacing component, route, content, asset, dependency, business logic or responsive rule changed.

**Rules and rollback.** A new consumer must match the semantic role, marketplace-shell ancestry, native element, full class contract and responsive/content/overflow behavior exactly, with independent measurable proof. Exceptions remain literal. Roll back a consumer by restoring its original literal class and removing its import when unused; remove a source key only if its complete family is rolled back. Phases 29–37 are independent.

**Validation.** `npx tsgo --noEmit` clean; build OK; `git diff --check` clean; the new source lints clean after its trailing-newline correction. Touched-route lint findings are the pre-existing formatting backlog on untouched lines; no migrated line introduced a lint finding. Locked hashes remained unchanged: styles 534cd653…, internal shell 37dbf66f…, marketplace shell dcdc36a6…, member shell 4a9dd8dd…, Surface 51b51b31…, PageHeader 5be9e6ea…, KpiCard 9279cd20…, DataTable 63c1e60e…, EmptyState 6cfba448…, Field f35b2364…, NoticePage 81ee6c0f…, ActionPill a5bc83a6…, ActionPill component 4c9fb916….

## Phase 39 — Border, radius & elevation source of truth (executed: zero migrations)

**Outcome.** Zero production migrations and zero new canonical sources. The fresh post-Phase-38 audit found no pair of independently measurable consumers with the same semantic role, element context, complete class output, responsive/state/pseudo-element behavior, geometry relationship and ownership. No file under `src/` or `public/` was created, modified, deleted or reformatted. This governance entry is the only Phase 39 change.

**Canonical ownership map.** `src/styles.css` remains the single token/utility owner for radius tiers, border colours, `--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow`, `card-brackets`, `edge-sheen`, `glass`, `ring-pill` and `divider-warm`. `Surface` retains `rounded-2xl border border-border bg-card` plus its approved padding/elevated/interactive/decor options. ActionPill owns pill actions; `controlClass` owns its established control geometry; PageHeader, KpiCard, PlanCard, DataTable, EmptyState, StatusBadge, Field and NoticePage retain intrinsic treatments; shadcn primitives retain their own treatments. Internal, marketplace and member shells remain independent.

**Fresh inventory and taxonomy.** The eligible production scan recorded 957 border-token occurrences across 27 spellings, 632 radius occurrences across 8 spellings, 32 Tailwind shadow occurrences across 5 spellings, and 25 inline `boxShadow`/`box-shadow` call sites. High frequency was treated only as discovery evidence. Existing canonical sources are A; shadcn owners C; component-intrinsic patterns D; shells E; experience-specific patterns F; route-local patterns G; business-coupled visuals H; intentional exceptions I; auth-gated/unmeasurable consumers J; and superficially similar but behaviorally distinct patterns K. No pattern qualified for B.

**Rejected candidates.** P39-E1 (`shadow-[var(--shadow-card|elevated|drawer)]` versus generated `shadow-card|elevated|drawer`) has equivalent variable ownership but would change the rendered class string, so every call site stays literal. P39-S1 hairline elevated/decorated cards differ in role, native element, radius, padding, hover translation/border, pseudo-elements, responsive behavior or established KpiCard/PlanCard ownership. P39-P1 active segmented pills share fragments but differ in surrounding control geometry, labels, state models, option counts and experience ownership. P39-B1 dividers, rounded-full borders, status borders and dashed containers span tables, headers, controls, actions, notices, dropzones and empty states, many already owned by established components. P39-S2 residual Surface-like literals remain coupled to divide/overflow/sticky/interaction/business behavior or were excluded by the prior exact Surface audit.

**Intentional exceptions.** Keep premium `border-hairline` cards distinct from Surface's `border-border`; keep KpiCard, PlanCard, landing, PlaceholderScreen and DownlineContextBanner shadow expressions intrinsic; keep each `card-brackets`/`edge-sheen` combination literal or component-owned; keep dashed EmptyState, PlaceholderScreen, coverage, handoff, quote, plan-detail and quote-edit treatments with their current owners; keep responsive table/card borders, business-state warning/sage/destructive treatments, overlays, drawers and assistants literal; do not replace shadcn treatments. No `Surface` hairline variant, radius alias, border/shadow class constant or universal Card/Border/Radius/Shadow wrapper was created.

**NOT CAPTURED.** Signed-in `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*` and `/member/*` states were source-inspected only where a legitimate session was unavailable. This includes segmented selectors, employer ICHRA decorated panels, dashboard cards, downline treatments and administrative status panels. No session or public data was fabricated, no runtime parity was inferred, and no unmeasurable consumer was migrated.

**Admission rule.** A future source requires at least two independently measurable consumers with identical semantic role, element context, complete class output, responsive and state behavior, pseudo-element behavior, geometry relationship, no business coupling and no current canonical owner. Proof requires one consumer first, then independent gates at 1440/834/390. Otherwise the consumer stays literal.

**Validation and locked sources.** The normal harness build reports `build OK`; the production tree has no Phase 39 diff, so DOM, class, computed-style and browser output are unchanged by construction. `git diff --check` is clean. Full lint remains the pre-existing formatting backlog and no production lint delta was introduced. SHA-256 locks remained unchanged: styles `c88dbdab…`; Surface `bcf6247e…`; ActionPill source `63837c0d…`; ActionPill component `e4c55a00…`; control `921f7f3c…`; PageHeader `a9ecdacc…`; KpiCard `c4ae4e7c…`; PlanCard `aa496285…`; DataTable `dacf8c29…`; EmptyState `ab024eba…`; Field `0a5e63e8…`; NoticePage `2039a29d…`; StatusBadge `0ee08a42…`; shadcn Card `f13878a0…`, Button `674547d4…`, Input `92debb7d…`, Dialog `e3a6de15…`, Sheet `a82f9341…`; internal shell `287a3715…`; marketplace shell `126ceb89…`; member shell `24e0660c…`.

**Rollback.** There is no production rollback because there is no production change. Roll back Phase 39 by deleting only this documentation block. Do not alter Phases 29–38.

## Phase 40 — Motion, transition & interaction-style source of truth (executed: zero migrations)

**Outcome.** Zero production migrations and zero new canonical sources. The fresh post-Phase-39 audit found no pair of independently measurable consumers with the same semantic interaction role, element context, complete class output, start/end state, transition property, duration, easing, transform, responsive and reduced-motion behavior, accessibility behavior and ownership. No file under `src/` or `public/` was created, modified, deleted or reformatted. This governance entry is the only Phase 40 implementation change.

**Fresh inventory.** The eligible production scan found 110 motion-bearing files. It recorded 77 transition occurrences across six spellings (`transition-colors` 35, `transition-all` 18, `transition-transform` 16, generic/JS `transition` 5, `transition-opacity` 2, `transition-[width]` 1); 12 explicit durations (`duration-300` 9, `duration-200` 3); no eligible Tailwind `ease-*`; eight ABox/Tailwind animation uses across seven names; and 31 interaction transforms across 11 spellings. The leading transform fragments were `hover:-translate-y-0.5` 8, `hover:scale-[1.03]` 6, `group-hover:translate-x-1` 3, `group-hover:-rotate-6` 3 and `group-hover:scale-105` 3. No eligible View Transition API, `AnimatePresence`, layout animation, motion CSS custom property, `motion-safe:*` or `motion-reduce:*` consumer was found. Static transforms were not treated as motion candidates.

**Canonical ownership map (taxonomy A/C/D/E/L/M).** `src/styles.css` remains the ABox CSS owner for the global reduced-motion override, `ember-underline`, `card-brackets`, `edge-sheen`, six `abox-*` keyframes and seven `animate-*` helpers. `motion.tsx` owns `FadeRise`, `Stagger`, `StaggerItem` and `CountUp`, including their `useReducedMotion()` paths. ActionPill retains its existing action hover states; Surface owns only `transition-colors hover:bg-accent` through `interactiveHover`; `controlClass` owns only its established focus ring. PageHeader, KpiCard, PlanCard, DataTable, EmptyState, Field, NoticePage, StatusBadge, ThemeToggle, ProductSwitcher and ShoppingPathBar retain component-intrinsic behavior. The three shells retain independent shell-specific transitions. shadcn primitives retain their classes; Radix owns lifecycle/state mechanics and `tw-animate-css` supplies their animate/fade/zoom/slide utilities. No ownership was duplicated.

**Rejected candidates.** P40-C1 quote's two primary advance actions have an exact class string but use different native elements and navigation/handler semantics in mutually exclusive route-local states. P40-C2 ShoppingPathBar's two option links are already intrinsic to one component. P40-C3 PlanCard's Save/Compare actions are intrinsic to PlanCard and compose different pressed-state classes. P40-C4 select's two exact arrow-icon strings sit under different parent interaction semantics in one route-local choice. P40-C5 root recovery actions differ as Link versus retry button, and the error-boundary state is not legitimately measurable. P40-C6 card-lift/icon-transform fragments differ in complete classes, role, translate/scale distance, border/color/pseudo-element behavior, responsive state or established owner. P40-C7 FAQ/compare disclosure chevrons differ in complete expression, parent state and data requirements. P40-C8 has only one eligible auth-gated pulse placeholder; matching M06/M08 skeletons are excluded. These are D/F/G/H/J/K/M, not new B candidates.

**Reduced motion and third-party boundaries.** At `prefers-reduced-motion: reduce`, `styles.css` forces animation and transition durations to `0.01ms` and animation iteration count to one. `motion.tsx` independently returns static/final states for its JS-driven primitives. Public browser samples confirmed computed `0.00001s` durations and one iteration at 1440, 834 and 390. shadcn/Radix/tw-animate behavior remains third-party/library-owned and receives the global override. The CSS `animate-fade-rise` 500ms helper and `FadeRise` 420ms runtime primitive remain intentionally separate because timing, implementation and ownership differ.

**Intentional exceptions and NOT CAPTURED.** Keep all existing lift amounts (`-0.5`/`-1`), scale amounts (`1.02`/`1.03`/`1.04`/`1.05`), arrow travel (`0.5`/`1`), transition-property scopes, focus/disabled/disclosure behavior, shell transitions, assistants, decor and route-local interactions literal or with their current owner. Signed-in `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*` and `/member/*` states were source-inspected only because the environment was signed out; dashboard lifts, agent-profile loading, admin controls, downline flows, member navigation and internal-shell content are NOT CAPTURED. No session, failure or public data was fabricated and no unmeasurable consumer was migrated. Branding & White-Label runtime, Marketplace Asset Management runtime, Lucie/Lucie-app, M06, M08, AI-elements and reference layers remain outside centralization.

**Validation evidence.** `npx tsgo --noEmit` is clean; the normal harness reports `build OK`; `git diff --check` is clean; and there is no production/reference diff, so DOM, class output, timing, easing, handlers, routing and accessibility output are unchanged by construction. Browser checks covered `/`, `/faq`, `/select` and `/quote?step=1` in normal and reduced-motion contexts at 1440/834/390 (24 states) with no network failures. Existing signals were recorded rather than repaired: the full lint baseline remains 16,783 findings (16,753 errors and 30 warnings, overwhelmingly formatting); `/quote?step=1` has pre-existing 276px mobile horizontal overflow; reduced-motion contexts surfaced existing development hydration-attribute diagnostics. None has a Phase 40 production delta. Targeted production lint was not applicable because no production file changed.

**Locked sources.** SHA-256 locks remained unchanged: styles `c88dbdab…`; motion `779d9a9c…`; ActionPill `63837c0d…`; ActionPill component `e4c55a00…`; Surface `bcf6247e…`; control `921f7f3c…`; PageHeader `a9ecdacc…`; KpiCard `c4ae4e7c…`; PlanCard `aa496285…`; DataTable `dacf8c29…`; EmptyState `ab024eba…`; Field `0a5e63e8…`; NoticePage `2039a29d…`; StatusBadge `0ee08a42…`; internal shell `287a3715…`; marketplace shell `126ceb89…`; member shell `24e0660c…`; shadcn Button `674547d4…`, Input `92debb7d…`, Dialog `e3a6de15…`, Sheet `a82f9341…`, DropdownMenu `c6eb5ff2…`, Tooltip `9682690…`, Switch `c3c298df…`, Select `6d4deee1…`, Tabs `e9b454d2…`, Popover `861c1857…`, HoverCard `69dc172e…`, AlertDialog `ee4d7f33…`, ContextMenu `9ba8c0fc…`, Menubar `e8a3269d…`, NavigationMenu `755aecc7…`, Accordion `0903efcd…`, Toggle `62e6e219…`, ToggleGroup `d59cd393…`.

**Admission and rollback.** A future motion source requires at least two independently measurable consumers with identical semantic role, element context, complete class output or exact runtime output, transition and transform trajectories, all interaction states, responsive/reduced-motion/accessibility behavior, no business coupling and no existing owner. Prove one consumer first and gate each later consumer independently at 1440/834/390; otherwise leave it literal. There is no production rollback because there is no production change. Roll back Phase 40 by deleting only this documentation block; do not alter Phases 29–39.

---

## Phase 41 — Production accessibility & interaction-state source-of-truth audit

**Outcome: zero migrations.** No production or reference file changed. This documentation block is the only Phase 41 change.

**Scope.** Eligible production surface: `src/routes/**`, `src/components/abox/**`, production utilities, `src/styles.css` and the consumed shadcn primitives — 187 files after excluding `/design-system`, `/design-guide`, `src/lib/design/**`, `src/components/design/**`, Lucie/Lucie-app, M06, M08, AI-elements, Branding & White-Label runtime and Marketplace Asset Management runtime.

**Fresh inventory.** ARIA occurrences: `aria-hidden` 233, `aria-label` 68, `aria-pressed` 26, `aria-current` 8, `aria-expanded` 6, `aria-invalid` 5, `aria-labelledby` 4, `aria-live` 2, `aria-describedby` 2, `aria-modal` 1, `aria-haspopup` 1, `aria-controls` 1. Explicit roles: alert 8, radiogroup 3, status 2, dialog 2, group 1, banner 1. Keyboard handlers: `onKeyDown` 7, no `onKeyUp`/`onKeyPress`; all other keyboard behavior is native or Radix-managed. Focus visuals: `focus:ring-2 focus:ring-ring` across 19 files (including the canonical `controlClass`), `focus-visible:ring-2 focus-visible:ring-ring` 3, one skip-link focus cluster per shell; `styles.css` carries `:focus-visible` only inside the decorative `ember-underline` and `card-brackets` utilities. Disabled classes: `disabled:opacity-40` 17, `disabled:bg-muted` 15, `disabled:text-muted-foreground` 15, `disabled:opacity-60` 13, `disabled:opacity-50` 3, `disabled:cursor-not-allowed` 2, `disabled:opacity-70` 1. Visually hidden text: `quote.tsx` 4, `data-table.tsx` 1, one per shell. Label association: explicit `htmlFor` in `quote.tsx` (9), `quote-edit-panel.tsx` (8), `app.jet.products.tsx` (4) and three single-use routes; elsewhere implicit through `LabeledField`. Accessible names: all 68 `aria-label` values distinct except `"Filters"` (2) and `"Available products"` (2), which are per-context labels rather than a shared pattern.

**Semantic ownership map.** ActionPill owns action-control class output and hover/disabled treatment but not element choice. `controlClass` owns control surface styling and the opt-in focus ring only, never semantic form behavior. `LabeledField` owns the wrapping-label composition (consumers: `auth.tsx`, `schedule.tsx`). PageHeader, KpiCard, DataTable, EmptyState, NoticePage, StatusBadge and PlanCard own their own intrinsic semantics. Surface stays a visual owner and is explicitly not an accessibility abstraction. shadcn/Radix own overlay focus trapping and restoration, roving tabindex, Escape handling and managed `aria-expanded`/`aria-selected`/`aria-checked`. Native HTML owns Enter/Space activation, tab order, label association, table header semantics and `disabled`. The three shells independently own their landmarks, navigation labelling, `aria-current` and skip link.

**Candidate decisions.** P41-C1 skip-to-content link (byte-identical in all three shells) — REJECT (J+E): internal and member shells render only behind `requireSessionIfEnforced` with `ENFORCE_LOGIN = true`, leaving one independently measurable consumer; recorded as FUTURE OPPORTUNITY, not implemented. P41-C2 raw focus-ring form controls — REJECT (A+J+K): `controlClass({ focusRing: true })` already owns the canonical form and the remaining literals differ in height, radius, padding, text size and adjacent classes; 15 of 19 files are auth-gated. P41-C3 `aria-current` items — REJECT (K+D+J): two different contracts (`page` vs `step`) on different elements, each component- or route-intrinsic. P41-C4 `aria-pressed` toggles — REJECT (K+D): unrelated toggles with different elements, labels, visuals and state models. P41-C5 `role="alert"` errors — REJECT (G+K): six of eight are `quote.tsx`-internal with distinct wrappers. P41-C6 decorative `aria-hidden` glyphs — REJECT (L+D): centralizing would require a DOM-changing wrapper. P41-C7 disabled-state class clusters — REJECT (K+D): already emitted by ActionPill or consumer-owned, no shared semantic contract. P41-C8 live regions — REJECT (K+J): an sr-only polite step announcement and a visible status banner are not equivalent.

**Migrated consumers.** None.

**Intentional exceptions.** Three independent shell skip links and landmark implementations; per-context `aria-label` strings; the `quote.tsx` route-local error and live-region system; inline decorative `aria-hidden`; `controlClass` remaining a styling owner rather than a semantic one.

**NOT CAPTURED (auth-gated).** `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*`, covering InternalShell (40+ routes), MemberShell (4 routes), the downline wizard, `member.settings.tsx` and the agency form routes. Source inspected and recorded; runtime parity never inferred and no session fabricated.

**Native semantic and library boundaries.** No `<button>`/`<a>` conversion, no custom replacement for native inputs, no JavaScript substitute for native keyboard behavior, no heading downgrade, no generic wrapper replacing `<label>`. Radix and shadcn keep their existing semantic and class contracts; AI-elements and other library-owned semantics stay out of scope. Phase 40 reduced-motion ownership is unchanged.

**Validation evidence.** `npx tsgo --noEmit` clean; harness reports `build OK`; `git diff --check` clean; no production/reference diff. Browser accessibility verification covered `/`, `/faq`, `/select`, `/quote?step=1` and `/plans` at 1440/834/390: the first Tab on every viewport lands on the marketplace skip link (`A`, "Skip to content", `href="#main"`, visible outline); landmarks resolve as HEADER, NAV[Marketplace navigation], NAV[Available products], MAIN, FOOTER with exactly one `h1` per route; no icon-only button lacks an accessible name on any measured route; `aria-current` resolves as `page` in navigation and `step` in the quote wizard; the polite live region is present on every route and doubles on `/quote?step=1`; `/plans` exposes 30 `aria-pressed` controls; no console errors were recorded. Pre-existing signals were recorded rather than repaired: full lint baseline 16,783 findings and the `/quote?step=1` 276px mobile horizontal overflow. Targeted production lint not applicable — no production file changed.

**Locked sources (post-Phase-40, unchanged after Phase 41).** action-pill.ts `63837c0d…`; action-pill-component.tsx `e4c55a00…`; surface.tsx `bcf6247e…`; control.tsx `921f7f3c…`; field.tsx `0a5e63e8…`; page-header.tsx `a9ecdacc…`; kpi-card.tsx `c4ae4e7c…`; plan-card.tsx `aa496285…`; data-table.tsx `dacf8c29…`; empty-state.tsx `ab024eba…`; notice-page.tsx `2039a29d…`; status-badge.tsx `0ee08a42…`; motion.tsx `779d9a9c…`; marketplace-page-layout.ts `b9e60214…`; internal-shell.tsx `287a3715…`; marketplace-shell.tsx `126ceb89…`; member-shell.tsx `24e0660c…`; styles.css `c88dbdab…`; shadcn button `674547d4…`, input `92debb7d…`, dialog `e3a6de15…`, sheet `a82f9341…`, select `6d4deee1…`, tabs `e9b454d2…`, switch `c3c298df…`, dropdown-menu `c6eb5ff2…`, popover `861c1857…`, tooltip `9682690f…`, accordion `0903efcd…`, toggle `62e6e219…`.

**Admission rule and rollback.** A future accessibility/interaction canonical source requires at least two independently measurable production consumers sharing semantic role, native element or an exactly equivalent semantic contract, accessible name and description behavior, keyboard behavior, focus behavior, ARIA contract, state model, disabled/readonly/invalid behavior, visual focus/state treatment and responsive behavior, with no business coupling, no existing owner, no polymorphic abstraction and exact DOM/runtime preservation. Prove one consumer first; gate every later consumer independently at 1440/834/390 with accessibility-tree and keyboard evidence. There is no production rollback because there is no production change; roll back Phase 41 by deleting only this documentation block, leaving Phases 29–40 untouched.

---

## Phase 42 — Production data-display, table & pagination source-of-truth audit

**Outcome: zero migrations.** No production or reference file changed; `data-table.tsx` was not modified, forked or duplicated. This documentation block is the only Phase 42 change.

**Fresh inventory (187 eligible files).** Table elements: `<table>` 6, `<thead>` 6, `<tbody>` 6, `<th` 22, `<td` 23. Six implementations: the canonical `src/components/abox/data-table.tsx` plus five route-local tables — `marketplace.admin.releases.compare.tsx:45`, `app.employer.ichra.tsx:39`, `agency.organization-imports.index.tsx:110`, `agency.organization-imports.$importJobId.tsx:65`, `agency.organization-defaults.apply.tsx:103`. `DataTable` has 23 production consumers. `src/components/ui/table.tsx` and `src/components/ui/pagination.tsx` exist with zero production importers (referenced only by `src/lib/design/*` documentation). No pagination of any kind exists in production: no Previous/Next, numbered pages, page-size control, infinite loading or route-local pattern. No sorting, filtering, selection, expansion or row-action column is implemented in any table; page-level search inputs sit above `DataTable`, not inside it. Responsive: canonical wrapper `overflow-hidden rounded-lg border border-hairline bg-card` → `overflow-x-auto` → `min-w-[640px]`; route-local min-widths are 720/720/640/560 and `app.employer.ichra.tsx` has neither min-width nor scroll wrapper; no stacked-row, hidden-column or alternate mobile table markup exists. Data states: `DataTable` owns its in-table empty row (`colSpan`, `px-5 py-10 text-center`, default "No results."); page-level `EmptyState` has 8 consumers and never renders inside a table body; only two `animate-pulse` occurrences exist in eligible production (auth-gated placeholder block, decorative assistant ring); no table skeleton, no `aria-busy`, no retry. Styling vocabulary diverges: cell padding `px-5 py-4` canonical versus `px-4 py-3` / `px-3 py-2` / `py-2`; dividers `border-b border-hairline/60` per row canonical versus `divide-y divide-border` on tbody in all five route-local tables; hover tint and ember indicator canonical only; `tabular-nums` automatic on right-aligned canonical cells versus manual per cell in `ichra`. Non-table value rows: `flex items-center justify-between` 36 bare and 18 with `gap-2`, longest exact repeats 4; `<dl>` in 7 files with different shapes.

**Ownership map.** `data-table.tsx` is the sole canonical ABox table source and owns wrapper, scroll behaviour, header typography, cell padding, alignment, numeric treatment, dividers, hover tint and indicator, `sr-only` caption, `aria-label` and the in-table empty row. `empty-state.tsx` owns page-level empty presentation. `status-badge.tsx` owns cell-level status. The unconsumed shadcn `table.tsx` and `pagination.tsx` are recorded as the principal duplication hazard. The five route-local tables are route-owned. The three shells own no table behaviour.

**Candidate register and decisions.** P42-C1 route-local tables → `DataTable`: REJECT — padding, divider mechanism, border token, wrapper, min-width and hover behaviour all differ; `releases.compare` renders through a local `Row` fragment and `ichra` derives monthly cost per row; migrating would change pixels and DOM; all five are auth-gated. P42-C2 header typography idiom and P42-C3 `divide-y divide-border`: REJECT — shared fragments on structurally different tables; fragment matching is not equivalence. P42-C4 pagination: REJECT — no production consumer exists; adopting the unconsumed primitive would invent a system. P42-C5 table loading/skeleton: REJECT — nothing to own. P42-C6 in-table empty row versus `EmptyState`: KEEP AS IS — distinct semantic roles and DOM positions. P42-C7/C8/C9 value rows, `<dl>` displays and `overflow-x-auto` wrappers: REJECT — generic layout fragments spanning unrelated semantics, including non-table consumers.

**Migrated consumers.** None. No new source, wrapper, helper or abstraction was created; no `DataDisplay`, `TableCell`, `DataRow`, `ListItem` or `Pagination` abstraction, no Slot, no `asChild`, no polymorphism.

**NOT CAPTURED (auth-gated).** All 23 `DataTable` consumers under `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, plus all five route-local tables. Source inspected and recorded; runtime parity never inferred, no session fabricated, no state manufactured.

**Validation evidence.** `npx tsgo --noEmit` clean; harness `build OK`; `git diff --check` clean; no production/reference diff. Browser verification of the measurable public data-display routes `/plans`, `/compare`, `/cart`, `/review`, `/handoff`, `/quote?step=1` at 1440/834/390 recorded zero `<table>`, `<th>` and `<td>` elements on every route at every viewport — confirming there is no publicly measurable table consumer, which alone blocks the two-measurable-consumer rule for any table candidate. One `overflow-x-auto` wrapper per route (two on the quote step), 4–5 list/definition structures per route, no console errors, and no horizontal overflow except the pre-existing 276px on `/quote?step=1` at 390px. Pre-existing lint baseline (16,783 findings) not repaired; targeted production lint not applicable because no production file changed.

**Locked sources (unchanged after Phase 42).** data-table.tsx `dacf8c29…`; empty-state.tsx `ab024eba…`; status-badge.tsx `0ee08a42…`; unconsumed ui/table.tsx `1e945e56…`; unconsumed ui/pagination.tsx `cbe8559c…`; styles.css `c88dbdab…`. All Phase 40/41 ABox, shell and shadcn locks remain as recorded in those blocks.

**Governance rules established.** No second canonical table source may be introduced. `src/components/ui/table.tsx` and `src/components/ui/pagination.tsx` remain unconsumed and may not be adopted without an explicit approved phase. No table abstraction may alter DOM semantics. Pagination may never be centralized from visual similarity alone. Responsive variants must remain behaviorally equivalent. Business-coupled data displays stay independently owned. Every future migration requires exact parity evidence at 1440/834/390 covering DOM, class output, computed styles, geometry, wrapping, overflow, interaction states, keyboard behaviour, accessibility tree and business behaviour. Zero migration remains a valid outcome.

**Rollback.** No production change, so production rollback is empty. Roll back Phase 42 by deleting only this documentation block; Phases 29–41 are unaffected.

---

## Phase 43 — Production Branding / White-Label Propagation & Asset Ownership Audit

**Outcome: ZERO production migrations.** No production file, asset, logo, colour, route, content or runtime ownership changed. This documentation block is the only change.

**Canonical runtime White-Label owner.** The versioned `Brand` record in `src/lib/marketplace-store.ts` (`display_name`, `tagline_en/es`, `headline_en/es`, `intro_en/es`, `primary_color`, `accent_color`, `logo_asset_id`, `favicon_asset_id`, `status`, `version`), read through `getActiveBrand` / `getDraftBrand` and published through Publication Review. Seeded active brand `brand-active-001` (`ABox`, `Agency in a Box`, `#c05a2e`, `#2e6b5e`). Runtime-owned; never a design token.

**Canonical brand-mark source.** `src/components/abox/logo.tsx` (`AboxMark`, `AboxWordmark`), code-drawn inline SVG with nine production consumers: marketplace-shell, internal-shell, member-shell, placeholder-screen, planai-assistant, plan-o-assistant, `routes/index.tsx`, `routes/quote.tsx`, `routes/app.jet.branding.tsx`. No logo image file ships; `public/favicon.ico` is the only brand-adjacent image asset. All 26 other `AboxMark` references live in `src/lib/design/**`, `/design-system` and `/design-guide` and are documentation only.

**Marketplace Asset Management boundary.** Asset lifecycle (upload, scan, validate, retire) and `logo_asset_id` / `favicon_asset_id` belong to `marketplace.admin.assets.tsx` plus the store's asset collection. Assets may never be copied, mirrored or re-owned by the design/reference layer.

**Shell-specific branding presentation.** `marketplace-shell.tsx` consumes `getActiveBrand` and owns presentation plus its own `?? "ABox"` / `?? "Agency in a Box"` fallbacks. `internal-shell.tsx` and `member-shell.tsx` render literal `ABox` and do not read the brand record. The three shells remain intentionally independent; no merge, no universal shell, no shared branding wrapper.

**Duplicate-source register (documented, not fixed).** D1 — 37 literal `ABox` / `Agency in a Box` occurrences in production source while a runtime `display_name` exists (both non-marketplace shells and all route `head()` titles bypass the runtime owner). D2 — fallback strings duplicated inside marketplace-shell. D3 — foundation oklch values re-typed as literals in the JET branding swatch list. D4 — brand `primary_color` / `accent_color` reach no rendered style outside the admin live-preview blocks. D5 — design/reference layer documents brand components but no production file imports it; boundary intact.

**Candidates, all rejected for now.** C1 wire shells to `display_name` — both shells auth-gated, behaviour would change on tenant rename. C2 move marketplace-shell fallbacks to the store — no output change and no defect fixed. C3 route `head()` titles — static prerendered metadata; runtime brand unavailable at head time. C4 `favicon_asset_id` → static favicon — crosses the Marketplace Asset Management boundary. C5 brand colours → theme — no application path; would repaint the app. C6 `AboxMark` — already single-sourced. C7 JET branding swatch literals — route-specific display copy.

**Prohibited duplication.** Runtime branding and White-Label values may never be duplicated into `src/lib/design/**`, `src/components/design/**`, `/design-system` or `/design-guide`. Design tokens may define semantic roles such as "brand primary" but must never replace tenant values. No asset may be consolidated, renamed, moved or deleted on visual similarity.

**Runtime mutation mechanism.** A non-destructive path exists for a future proof: `marketplace.admin.brand.tsx` creates a DRAFT brand and `marketplace.admin.preview.tsx` renders it, so a tenant value can be varied without publishing. Both are auth-gated, so it was not exercised in this phase; no temporary branding code or test-only branch was created.

**Measurable public evidence.** `/`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff`, `/quote?step=1`, `/select`, `/faq` at 1440/834/390. Every route exposed the marketplace-shell home link with accessible name `ABox home`, header text `ABox | AGENCY IN A BOX` at 1440 and 834 and visually hidden at 390 (responsive, link and accessible name preserved), the footer brand block `ABox / AGENCY IN A BOX`, a 34px header mark and a 40px footer mark on every route (plus a 30px in-page mark on `/quote?step=1`). Zero console errors at all three viewports.

**NOT CAPTURED (auth-gated).** `/app/*` including `app.jet.branding`, `/agency/*`, `/platform/*`, `/marketplace/admin/*` (brand, preview, compare, releases, assets), `/member/*`. Source inspected only; no runtime parity inferred, no session or tenant state fabricated.

**Future migration parity requirements.** Any approved branding migration must prove identical runtime source, asset identity/path, rendered text, mark geometry, DOM tree, class output, attributes, computed styles, responsive behaviour at 1440/834/390, fallback behaviour when the brand record is absent, loading behaviour, accessibility tree and accessible names, keyboard behaviour where relevant, navigation behaviour, unchanged tenant/organization coupling, an uncrossed Marketplace Asset Management boundary, clean console, `tsgo`, build, lint against the existing baseline, locked hashes and `git diff`.

**Locked sources (Phase 43 baseline).** logo.tsx `957837a6…`; marketplace-shell.tsx `126ceb89…`; internal-shell.tsx `287a3715…`; member-shell.tsx `24e0660c…`; marketplace-store.ts `7af80f80…`; marketplace.admin.brand.tsx `cb4c78ce…`; app.jet.branding.tsx `a9be565b…`; marketplace.admin.assets.tsx `9c27ea99…`; styles.css `c88dbdab…`; __root.tsx `3d65167f…`.

**Zero-migration validity and rollback.** Zero migration is a valid and recorded outcome. Production rollback surface is empty; roll back Phase 43 by deleting only this documentation block. Phases 29–42 are unaffected.
