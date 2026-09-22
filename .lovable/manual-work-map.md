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

---

## Phase 44 — Governance enforcement & canonical-source drift audit (executed: zero production migrations)

**Outcome.** ZERO production migrations and ZERO production modifications. No lint rule, script or registry was created — the phase brief prohibits implementing enforcement now. This documentation block is the only change. `.lovable/manual-work-map.md` remains the single human governance source; any future generated report or registry is a derived implementation aid, never a competing source.

**Canonical-source matrix (measured as files importing each source).** styles.css foundations (app-wide); status-badge 89; surface / surfaceClass 82; action-pill-component 38; page-header 25; data-table 20; kpi-card 18; empty-state 10; marketplace-page-layout 10; notice-page 4; action-pill.ts 2; control / controlClass 2; field 2; motion 1; nav-config plus three independent shells for navigation; Brand record in `marketplace-store.ts` for White-Label; store assets plus `marketplace.admin.assets.tsx` for Marketplace Asset Management. Typography, spacing/layout, border/radius/elevation, motion and accessibility remain distributed across `styles.css` and per-owner components as recorded in Phases 36–41.

**Drift inventory.** Surface base string `rounded-2xl border border-hairline bg-card` appears 54 times outside `surface.tsx` (Group B/C exceptions, Phases 29–32). Control base string `h-10 w-full rounded-lg border border-border bg-background` appears in 16 files (Phase 33 exceptions: differing height, radius, padding or text role). `.story-link` is used 59 times with no owning declaration — still unowned since Phase 3. Zero `#rrggbb` literals in production routes/components; `oklch()` literals outside `styles.css` exist only in `carrier-mark.tsx` (3) and `app.jet.branding.tsx` (4 display copies). Tables: one canonical plus five auth-gated route-local implementations. Pagination: zero consumers. Twenty-two shadcn primitives have zero production importers, including `ui/table.tsx` and `ui/pagination.tsx` — the principal accidental-second-source hazard.

**Import / ownership boundaries (verified clean).** Zero production files import `@/lib/design/**` or `@/components/design/**` outside the two unlisted reference routes `/design-system` and `/design-guide`. Zero files under `src/lib/design/**` import `@/components/abox/**`. No circular ownership. The three shells do not import one another. Branding data is read only through `marketplace-store.ts`.

**Enforcement candidates — accepted for a future approved phase.** E1 ban production imports from `@/lib/design/**` and `@/components/design/**` (ESLint restricted-import with overrides for the two reference routes). E2 keep `@/components/ui/table` and `@/components/ui/pagination` unconsumed. E3 ban `@/lib/marketplace-store` imports inside design/reference layers. E4 ban shell-to-shell imports. E5 report-only scan for new raw hex/oklch literals with a frozen allowlist. E6 report-only canonical-consumer-count report. E7 report-only duplicate-export-name scan.

**Explicitly non-enforceable domains.** Class-cluster matching against `surfaceClass` / `controlClass` is rejected — roughly 70 legitimate variants would produce mass false positives. A generic "design system is followed" rule is rejected: every rule must name an exact invariant. Visual/DOM equivalence, responsive parity, accessibility parity, White-Label propagation and table behaviour equivalence require runtime evidence on auth-gated surfaces and stay audit-driven per phase.

**Exception register (owner / reason / migratability).** Three shells — each shell file, deliberately independent, never merged. Lucie, M06, M08 — separate governed subtrees, not migratable. AI elements — vendored primitives, migration would need upstream divergence analysis. Branding & White-Label runtime and Marketplace Asset Management — runtime-owned, never absorbed by the design layer. Group B/C surfaces (54 sites) and control-shape variants (16 files) — case by case, require exact parity at 1440/834/390. Five route-local tables — case by case, additionally require authenticated runtime access. Consumed shadcn/Radix primitives — library-owned. Business-coupled route components and responsive-specific structures — per route, per site.

**Audit cadence and rules.** Re-run the drift inventory at the start of any future centralization phase. Zero migration remains a valid outcome. Visual similarity alone never establishes duplication. Enforcement must protect source ownership, not resemblance, and must be additive, independently reversible and free of false positives against existing legitimate architecture before being promoted from report-only to error.

**Validation evidence.** No production source touched; `git diff --check` clean; working tree shows only this governance file. Harness build OK. Import-boundary scans, consumer counts and class-cluster counts recorded above are fresh measurements from this phase.

**Rollback.** Production rollback surface is empty. Roll back Phase 44 by deleting only this documentation block; Phases 1–43 are unaffected.

## Phase 45 — Governance Enforcement Batch A: static import & ownership boundaries (IMPLEMENTED)

**Outcome.** Configuration-only. The single changed source file is `eslint.config.js`; zero `src/` files, routes, components, styles, assets, branding or business logic changed. Full lint total is unchanged at the 16,783 pre-existing baseline and `no-restricted-imports` reports zero findings — the three rules freeze an already-compliant repository rather than change it.

**E1 — reference/design layers are documentation-only.** Production code may not import `@/lib/design`, `@/lib/design/*`, `@/lib/design-tokens`, `@/components/design` or `@/components/design/*`. Severity `error`, global. Documented exceptions enumerated file-by-file: `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `src/components/design/**`, `src/lib/design/**`, `src/lib/design-tokens.ts`. The exception list is explicit, so no new production file inherits it. The reverse direction (design importing production) is not restricted by this rule; Phase 44 found no violation there.

**E2 — one table source, no pagination system.** No file may import `@/components/ui/table` or `@/components/ui/pagination`. Severity `error`, applied everywhere including the reference surfaces. `src/components/abox/data-table.tsx` remains the only ABox table source; the two shadcn files remain in the tree, unmodified and unconsumed. Adopting them requires an explicitly approved phase.

**E4 — the three shells stay independent.** Per-file restrictions on `internal-shell.tsx`, `marketplace-shell.tsx` and `member-shell.tsx`: each may not import either sibling shell, by relative or `@/components/abox/...` path. Severity `error`, scoped to those three files only, so routes continue importing whichever single shell they render. Only the merge direction is forbidden; no universal shell exists or is permitted.

**Config shape.** The pre-existing `server-only` `no-restricted-imports` path entry is preserved in every block. E1/E2 patterns and the shell restriction are defined once as shared constants at the top of `eslint.config.js` and reused across the main block, the reference override and the three shell overrides, so per-file overrides cannot silently drop a boundary.

**Validation evidence.** Baseline lint 16,783 findings before; 16,783 after, `no-restricted-imports` findings 0. Negative controls via `eslint --stdin` confirmed: a `@/components/ui/table` import is blocked in a production route and in a reference route; a `@/lib/design/*` import is blocked in a production route and allowed in `design-system.tsx`; a sibling-shell import is blocked inside `internal-shell.tsx` and allowed in a route; the `server-only` restriction still fires. Typecheck clean; harness build OK; `git diff --check` clean; all twenty-one locked SHA-256 hashes (canonical ABox sources, three shells, `marketplace-store.ts`, `logo.tsx`, `ui/table.tsx`, `ui/pagination.tsx`, `styles.css`, `__root.tsx`) unchanged. Import counts unchanged: reference-layer importers 3 (both reference routes plus `reference-kit.tsx`), `ui/table` 0, `ui/pagination` 0, shell-to-shell 0.

**Not included.** E3 (ban `@/lib/marketplace-store` imports inside design/reference layers), E5 (raw hex/oklch scan), E6 (consumer-count report), E7 (duplicate-export scan) are not implemented. No script, scanner, report generator or registry was created.

**Rollback.** Deterministic and single-file: restore `eslint.config.js` to its prior form (one `no-restricted-imports` `paths` entry for `server-only`, no patterns, no overrides) and delete this governance block. No production source rollback is required because none changed. Then rerun typecheck, build and full lint, and confirm the locked hashes. Phases 1–44 are unaffected.

## Phase 46 — Governance Enforcement Batch B: E3 runtime branding / reference boundary (IMPLEMENTED)

**Invariant.** Reference/design material is documentation-only and must not depend on runtime branding ownership. Files under `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `src/components/design/**`, `src/lib/design/**` and `src/lib/design-tokens.ts` may not import `@/lib/marketplace-store`, `@/routes/marketplace.admin.*`, or their relative equivalents (`**/lib/marketplace-store`, `**/marketplace.admin.*`). Severity `error`, scoped to exactly that file set.

**Restricted runtime ownership paths.** `src/lib/marketplace-store.ts` is the canonical White-Label owner (`Brand`, `marketplaceStore`, `useMarketplaceState`, `getActiveBrand`, `getDraftBrand`, `getActiveContent`, `getDraftContent`) and also owns Marketplace Asset Management (`AssetType`, `MarketplaceAsset`, `getAssets`); there is no separate asset module, so one pattern covers both boundaries. The branding/asset admin routes (`marketplace.admin.brand`, `.preview`, `.compare`, `.releases*`, `.assets`) are restricted alongside it.

**Documented exception.** `src/components/abox/logo.tsx` is NOT restricted. The ABox mark/wordmark is a static presentation source, not runtime White-Label state, and both reference routes legitimately render it as a documented example.

**Audit result.** Current E3 importer count: 0. `src/lib/design/**` (118 files) imports only relative sibling reference modules plus `lucide-react`; `reference-kit.tsx` imports `react`, `@/lib/utils`, `@/lib/design-tokens`; `design-tokens.ts` imports nothing; the two reference routes import shadcn primitives, canonical ABox presentation components and `@/lib/sample-data` / `@/lib/products` only. No barrel export bypasses the boundary. Brand strings, colour literals and file-path strings inside reference data are documentation content, not imports, and are outside the rule's target.

**Accepted false negatives.** `@/lib/cart-store`, `@/lib/auth-session` and `@/integrations/supabase/*` are runtime state but fall outside the named E3 scope; they are deliberately not restricted in this batch rather than broadening the pattern. Any future reference route added outside the enumerated paths must be added to both the E1 exception list and the E3 scope in the same change.

**Interaction with Phase 45.** E1 (production → reference) and E3 (reference → runtime branding) run in opposite directions and share no path; no cycle or contradiction exists. The reference override retains the `server-only` path entry and the E2 patterns verbatim and now appends E3. The main production block and the three shell overrides were not edited.

**Validation evidence.** Full lint total 16,783 before and after, `no-restricted-imports` findings 0. `eslint --stdin` probes confirmed: `@/lib/marketplace-store` blocked in `design-system.tsx`, `../../lib/marketplace-store` blocked in `src/lib/design/**`, reference-to-reference (`./types`, `@/lib/design-tokens`) allowed, the same store import still allowed in production (`src/routes/plans.tsx`), and E1, E2, E4 and the `server-only` restriction all still firing. Typecheck clean; harness build OK; `git diff --check` clean; no `src/` file changed; all Phase 45 locked hashes unchanged, and `marketplace-store.ts`, `logo.tsx`, the three shells, `styles.css`, the reference sources and the branding/asset admin routes unchanged.

**Changed files.** `eslint.config.js` (E3 constant plus its addition to the reference override) and this governance block. No script, registry or production source.

**Deferred.** E5 (raw hex/oklch scan), E6 (consumer-count report), E7 (duplicate-definition scan) remain unimplemented.

**Rollback.** Delete the `RUNTIME_BRANDING_PATTERNS` constant and its spread in the reference override (returning that block to `server-only` + E2), and delete this governance block. Phase 45 E1/E2/E4 remain intact and are re-probed after rollback; no production source rollback is required.

---

## Phase 47 — Governance Enforcement Batch C: report-only drift detection (E5 + E6 + E7)

**Outcome.** Implemented as report-only diagnostics. Zero production migrations, zero `src/` changes, zero ESLint changes. Phase 45/46 enforcement (E1/E2/E3/E4 and the `server-only` restriction) is untouched and re-probed as still firing.

**Mechanism.** One script, `scripts/governance-report.mjs`, run on demand (`npm run governance:report`). Three separate analyzer functions share one exception table. Dependencies: Node built-ins plus the already-installed `typescript` compiler API for E7/E6 parsing. Not referenced by `build`, `build:dev`, `dev`, `preview`, the Vite config, CI, or any `src/` file.

**Outputs.** `.lovable/governance-report.json` (machine readable) and `.lovable/governance-report.md` (human readable). Nothing is written under `src/`. Each finding carries: rule, file, line, type, canonical owner, exception classification, reason, future-action category, and category. No numeric score and no ranking is assigned.

**Determinism.** Inputs are file contents only — no timestamps, git state, environment values or network. Sorted recursive walk, fixed output ordering. Two consecutive runs produced byte-identical JSON and Markdown (SHA-256 compared).

**E5 — raw colour literal classification.** Scans `src/routes/**` and `src/components/**` for `#rgb`/`#rrggbb`/`#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`. `src/styles.css` (131 colour declarations) is the canonical foundation and is never scanned as a finding source. 15 findings, all classified, zero `review-required`. Frozen allowlist with reasons: `carrier-mark.tsx` (computed per-carrier hue, one-off visual treatment), `app.jet.branding.tsx` (token values as display copy), `plan-o-assistant.tsx` (`rgb(0 0 0 / 0.6)` inside a `boxShadow` alongside `var(--shadow-glow)`), `marketplace.admin.brand.tsx` and `marketplace.admin.preview.tsx` (`#fff` contrast colour over a tenant-supplied background, runtime-owned), `src/components/ui/**` (library-owned; the `#ccc`/`#fff` matches in `chart.tsx` are recharts selector strings, not applied colours). The allowlist is snippet-matched, so a new literal in an allowlisted file still surfaces as `review-required`.

**E6 — canonical consumer counts.** 21 canonical symbols inventoried across ActionPill/`actionPillClass`, `ACTION_PILL`, StatusBadge, KpiCard, PageHeader, DataTable/`Column`, EmptyState, Surface/`surfaceClass`, `controlClass`, `LabeledField`, NoticePage, `MARKETPLACE_PAGE_LAYOUT`, motion helpers, `AboxMark`/`AboxWordmark`. **Two counting units are always reported separately and neither corrects the other**: `importerFiles` and `usageSites`, plus `typeOnlyImporters`, `referenceImporters` (excluded from production totals), `reExports` and `independentSystems`. Measured examples: `ActionPill` importerFiles 27 / usageSites 84; `actionPillClass` 15 / 27; `DataTable` importerFiles 19 / usageSites 26 (AST-import unit; the Phase 42 figure of 20 importer files and Phase 44 figure of 23 call sites were measured with different tooling units and are preserved as recorded, not overwritten); `controlClass` 2 / 6; `ACTION_PILL` production importerFiles 0 with 2 reference importers.

**E7 — duplicate canonical definitions.** Exact exported-name analysis via the TypeScript AST across `src/routes/**` and `src/components/**`. No similarity heuristic: JSX shape, class strings, Tailwind utilities and prop shapes are never used as evidence. 165 findings, all classified as documented exceptions or route-local implementations; zero `review-required`. Canonical-name collisions all resolve to intentionally independent systems — Lucie subtree (`DataTable`, `Field`, `LoadingRows` in `lucie-app/ui.tsx`), M06 (`Field` in `m06/kit.tsx`), M08 (`LoadingRows` in `m08/kit.tsx`), shadcn/Radix primitives, three shells, AI elements. Unparseable files would be reported as `parse-skipped`; none occurred.

**Shared exception taxonomy (Phase 44, unchanged).** Three independent shells; Lucie; M06; M08; AI elements; shadcn/Radix primitives; route-local tables; business-coupled experiences; Group B/C Surface exceptions; documented control variants; runtime branding; Marketplace Asset Management; the `logo.tsx` static-mark distinction from runtime White-Label. Declared once in the script so no analyzer can contradict another.

**Validation.** Full lint 16,783 findings before and after (the script's own 24 initial Prettier findings were formatted away, restoring the exact baseline); `no-restricted-imports` findings 0. E1/E2/E3/E4 `eslint --stdin` probes all still fire. `tsgo` typecheck clean. Build OK. `git diff --check` clean. No `src/` file changed. All locked hashes unchanged: logo.tsx 957837a6, marketplace-shell 126ceb89, internal-shell 287a3715, member-shell 24e0660c, marketplace-store 7af80f80, marketplace.admin.brand cb4c78ce, app.jet.branding a9be565b, marketplace.admin.assets 9c27ea99, styles.css c88dbdab, __root 3d65167f, data-table dacf8c29, empty-state ab024eba, status-badge 0ee08a42, ui/table 1e945e56, ui/pagination cbe8559c, eslint.config.js 07bf5562. Reports contain only file paths, line numbers, symbol names and classifications; the scanner never reads `.env` or `process.env`, and no generated artifact enters the build output.

**Known limitations (accepted).** E5 cannot see a literal composed at runtime by string concatenation. E6 does not count dynamic or computed usage. E7 cannot detect a duplicate implementation published under a different name — name-free detection would require the rejected similarity heuristics. Anything unclassifiable is reported as `review-required`, never as a violation.

**Status.** E5, E6 and E7 remain REPORT-ONLY. No ESLint severity was added for them, no finding authorises an import change, component replacement, deletion, wrapper, API change, DOM change or migration. Converting any of them into blocking enforcement requires a separately approved plan.

**Changed files.** `scripts/governance-report.mjs` (new), `package.json` (one additive `governance:report` script), `.lovable/governance-report.json` and `.lovable/governance-report.md` (generated artifacts), and this governance block.

**Rollback.** Delete `scripts/governance-report.mjs`, both generated reports, the `governance:report` package script, and this governance block; then rerun typecheck, build and full lint, verify `git diff --check` and the locked hashes. `eslint.config.js` is not edited in this batch, so Phase 45/46 enforcement is untouched by construction. No production source rollback is required.

---

## Phase 48 — Governance reconciliation & audit-trail model

**Outcome.** Documentation only. Zero production changes, zero `src/` diff, zero ESLint changes, zero report-schema changes. E5/E6/E7 remain report-only; E1/E2/E3/E4 and the `server-only` restriction remain enforced. This block is the reconciliation record between `.lovable/manual-work-map.md` (the single human governance source) and the Phase 47 generated reports. **The generated reports are diagnostics and are never a definition of ownership.**

### A. Governance inventory (measured at this tree state)

`.lovable/` holds: `manual-work-map.md` (this file, Phases 1–48), `design-system.md`, `project.json`, nine archived phase plan documents, the `plan/` archive, and the two Phase 47 artifacts `governance-report.json` / `governance-report.md`. Phase 47 report: 201 findings; schema fields `rule, file, line, type, canonicalOwner, exception, reason, futureAction, category`.

| Rule | Type | Count |
| --- | --- | --- |
| E5 | documented-exception | 10 |
| E5 | library-owned | 5 |
| E6 | canonical-consumer-count | 21 |
| E7 | canonical-name-collision | 5 |
| E7 | duplicate-export-name | 160 |

**Reconciliation discrepancy found and recorded (not repaired in code).** Of the 160 E7 `duplicate-export-name` findings, **154 are the exported `Route` constant** that TanStack file-based routing requires in every route module. The Phase 47 analyzer buckets them as `route-local-implementation`. They are a framework convention, not duplicate definitions, and carry `futureAction: no-action`. The remaining 6 are `Section` (2: `lucie-app/ui.tsx`, `lucie/ui.tsx`), `LoadingRows` (2: `lucie-app/ui.tsx`, `m08/kit.tsx`) and `Field` (2: `lucie-app/ui.tsx`, `m06/kit.tsx`) — all inside documented independent subtrees. The report's real E7 signal is therefore 6 entries, all accepted. Refining the analyzer to emit a `framework-convention` type is recorded below as a report-only future candidate; it is **not** authorised by this phase. No other discrepancy exists between this governance record and the generated reports.

### B. Finding reconciliation record structure

```text
rule            E5 | E6 | E7
file            repository-relative path
site            line or symbol, where applicable
findingType     report `type` value, verbatim
classification  one of the Section C classes
owner           canonical source, runtime owner, shell, subtree, or library
canonicalSource path, when a canonical owner exists
exceptionReason prose reason, only for accepted exceptions
evidence        what was read to reach the disposition
disposition     accepted | review-required | stale | false-positive
reviewStatus    reviewed | not-reviewed
phaseMarker     phase number only — no timestamps, no machine paths
blockingEligible  no | conditional (with the exact condition)
```

No decision is invented. A finding without an evidence-backed disposition is recorded `review-required` / `not-reviewed`, never silently resolved. `phaseMarker` replaces dates so records stay deterministic.

### C. Classification vocabulary (unordered; no ranking, scoring or prioritisation)

accepted/documented exception · canonical usage · intentional one-off · route or business-coupled · shell-specific · reference/runtime boundary · review-required · stale/false-positive.

Plus one descriptive E7-only class, **framework convention** — an export the framework requires in every module of a kind (the 154 `Route` exports). Descriptive only; grants no migration authority.

### D. Dispositions for the 201 Phase 47 findings (phaseMarker: Phase 48)

- **E5, 10 findings, `documented-exception`** — classification: accepted/documented exception or intentional one-off. Owners: `carrier-mark.tsx` (computed per-carrier hue), `app.jet.branding.tsx` (token values as display copy), `plan-o-assistant.tsx` (shadow alongside `var(--shadow-glow)`), `marketplace.admin.brand.tsx` and `marketplace.admin.preview.tsx` (`#fff` contrast over a tenant-supplied background — runtime branding owner). Disposition accepted, reviewed. blockingEligible: no.
- **E5, 5 findings, `library-owned`** — `src/components/ui/chart.tsx` recharts selector strings (`[stroke='#ccc']`, `[stroke='#fff']`), not colours we apply. Accepted, reviewed. blockingEligible: no.
- **E6, 21 findings, `canonical-consumer-count`** — classification: canonical usage. Inventory only; a count is not an invariant. Accepted, reviewed. blockingEligible: no.
- **E7, 5 findings, `canonical-name-collision`** — `DataTable`, `Field`, `LoadingRows` in the Lucie subtree, `Field` in M06, `LoadingRows` in M08. Classification: accepted/documented exception (intentionally independent systems). Accepted, reviewed. blockingEligible: no.
- **E7, 154 findings, exported `Route`** — classification: framework convention (TanStack file-based routing). Accepted, reviewed. blockingEligible: no.
- **E7, 6 remaining `duplicate-export-name`** — `Section`/`LoadingRows`/`Field` across Lucie, M06, M08. Classification: accepted/documented exception. Accepted, reviewed. blockingEligible: no.

**Review-required after reconciliation: zero.** No finding was silently resolved; each class above names the evidence (the current source at the cited file) behind its disposition. No finding authorises a migration, deletion, wrapper, import change, token normalisation or DOM change.

### E. Exception governance

All existing exceptions remain intact and unmerged: three independent shells; Lucie; M06; M08; AI elements; shadcn/Radix primitives; the five route-local tables; business-coupled UI; Group B/C Surface cases; documented control variants; runtime branding; Marketplace Asset Management; reference content; the static ABox logo distinction from runtime White-Label. Report detection of similar code is never grounds to remove or merge an exception. Exceptions change only through a separately approved phase carrying exact parity evidence at 1440/834/390.

### F. E5 review model

Review classifies; it never edits. No colour change, no literal-to-token replacement, no runtime branding change, no library/visualisation change. The frozen allowlist is preserved as recorded in Phase 47. All 15 current E5 findings are classified and none is `review-required`, so the allowlist is evidenced complete at this tree state. A future unclassified literal is recorded `review-required` — never allowlisted retroactively, never normalised.

### G. E6 counting model

`importerFiles` and `usageSites` remain two separate, separately labelled numbers for all 21 canonical symbols, alongside `typeOnlyImporters`, `referenceImporters`, `reExports` and `independentSystems`. **Neither is a correction of the other and no combined "consumer count" may be emitted.** The divergent DataTable measurements are preserved side by side with their tooling named: Phase 42 — 20 importer files (ripgrep import scan); Phase 44 — 23 call sites (call-site count); Phase 47 — 19 importer files / 26 usage sites (TypeScript AST run).

### H. E7 duplicate-definition model

Exact exported-name detection only: no JSX, class-string, utility, prop-shape or visual heuristic; no automatic winner selection; no deletion or merge. An apparent duplicate becomes an **accepted intentional duplicate** when inside a documented exception or a framework convention; **review-required** when an exact canonical export name is declared outside its canonical owner with no documented exception; a **confirmed canonical adoption opportunity** only after a separate phase supplies exact parity evidence at 1440/834/390 and names two measurable consumers. Phase 48 produced zero adoption opportunities.

### I. Staleness / drift model

A recorded finding is stale when the current source no longer contains the cited construct at the cited file, or the file no longer exists. Detection is a re-run of the deterministic report plus a diff of finding identity tuples `(rule, file, findingType)` against the recorded set — no timestamps, machine paths, network or randomness. Stale findings are marked `stale` here; production code is never touched to make a finding stale or non-stale.

### J. Future blocking eligibility (nothing implemented; nothing authorised)

- **E5** — blocking only for a precisely enumerated literal form in a precisely enumerated directory, with the frozen allowlist proven complete across at least one further phase and zero findings at enable time. Repetition is never evidence.
- **E6** — inherently non-blocking; an inventory is not an invariant. No blocking form proposed.
- **E7** — blocking only for exact canonical export names redeclared outside their canonical owner, after the framework-convention class and every documented exception are encoded and a full run shows zero unexplained findings.

Each would require its own approved plan, negative controls and independent rollback.

### K. Report-only future candidates (recorded, not authorised)

1. Emit a distinct `framework-convention` type for the exported `Route` constant so genuine E7 signal is not buried among 154 conventional entries. Report-only, no severity, no production effect.

### L. Validation

Full lint 16,783 findings, `no-restricted-imports` 0 — unchanged. `tsgo` typecheck clean. Build OK. E1/E2/E3/E4 and `server-only` negative controls all still fire. Phase 47 report re-run twice: byte-identical JSON and Markdown (SHA-256 compared); schema field set unchanged. `git diff --stat -- src/` empty; all locked canonical-source hashes unchanged. No generated runtime asset. `manual-work-map.md` remains the sole human governance source; no generated report is cited as a definition of ownership.

### M. Changed files

`.lovable/manual-work-map.md` (this block) and `roadmap.md` (heading-only correction: the deferred backlog section previously titled "Phase 3 — deferred" collided with the completed "Phase 3 — Typography audit & governance" section; the heading now reads "Deferred items carried forward" and the list contents are unchanged). No `src/` change.

### N. Rollback

Documentation only: delete this block and restore the previous `roadmap.md` heading. No production rollback is possible or necessary. Phases 45–47 enforcement and diagnostics remain intact by construction.

---

## Phase 49 — Final production design-system gap audit & closure (audit only; no `src/` change)

Fresh production-side audit after Phases 1–48. Evidence gathered at this tree state; nothing migrated, normalised, created or enforced. Dispositions are unranked and unscored.

### A. Canonical component completeness

One canonical source, one owner, measured production consumers (importer files, ripgrep import scan at this tree state — a distinct counting unit from the AST `usageSites` in the Phase 47 report, which is preserved separately and is not corrected by this number):

ActionPill component 38 · `action-pill.ts` tokens 2 · StatusBadge 89 · KpiCard 18 · PageHeader 25 · DataTable 20 · EmptyState 10 · Surface 82 · controlClass 2 · Field 2 · NoticePage 4 · MARKETPLACE_PAGE_LAYOUT 10 · motion helpers 1 · logo 5 · PlanCard 6.

Exactly one exported definition of each canonical name exists inside `src/components/abox/**`. The only same-name exports elsewhere are the Lucie subtree (`PageHeader`, `DataTable`, `EmptyState`, `Field`) and M06 (`Field`) — documented independent systems, unchanged. **COMPLETE / canonical**, with the Lucie and M06 collisions **COMPLETE / intentional exception**.

### B. Remaining production fragmentation

No new family with two production implementations was found. Items examined and classified:

- `planai-assistant.tsx` — zero production importers; all three shells import `plan-o-assistant.tsx`. The two files are not duplicates (different imports, different DOM, ai-elements based vs. native pill/panel). Not a duplicate canonical source and not a migration candidate. **DOCUMENTATION GAP** — recorded here as an unconsumed production component; removal is not proposed and is not authorised by this audit.
- Route-local `<table>` — 5 files (`agency.organization-defaults.apply`, `agency.organization-imports.$importJobId`, `agency.organization-imports.index`, `app.employer.ichra`, `marketplace.admin.releases.compare`), unchanged from Phase 44, all auth-gated and therefore NOT CAPTURED for parity evidence. **COMPLETE / intentional exception**.
- `metal-badge.tsx` (25 importers) vs `status-badge.tsx` (89) — different semantic role (metal tier vs status tone), different token sets. **COMPLETE / intentional variant**.
- `getHistory` / `getTasks` / `getReadiness` / `getOpenTaskCount` / `getOverrides` exported by both `org-store.ts` and `marketplace-store.ts` — different state types, different signatures, different domains; not design-system surfaces. **COMPLETE / intentional exception (business-coupled)**.
- Exported `Route` in every route module. **COMPLETE / framework convention**.

Zero FUTURE MIGRATION CANDIDATEs survive the evidence bar (two independently measurable consumers, same semantic role, same element semantics, same relevant DOM, same or provably equivalent class output, same responsive behaviour, same accessibility behaviour, no business coupling, no shell ownership, no library conflict).

### C. Foundation ownership

`src/styles.css` holds 198 custom-property declarations and is the canonical foundation for colours, semantic roles, radius, elevation, motion keyframes and the reduced-motion block — **COMPLETE / canonical**. Typography, spacing, layout widths, control sizing, icon sizing, border and density remain Tailwind-utility expressed at the call site with narrow owners where proven (`controlClass`, `MARKETPLACE_PAGE_LAYOUT`, `action-pill.ts`) — **COMPLETE / intentionally decentralised**, as adjudicated in Phases 33–37; repetition alone was not treated as a gap. Responsive breakpoints are Tailwind-owned — **COMPLETE / library-owned**. Interaction states remain per-component — **COMPLETE / intentional exception** (Phase 41).

### D. Token drift

Zero arbitrary colour literals (`[#rrggbb]`) in production outside the design/reference layers. 139 arbitrary numeric Tailwind values across `src/routes` + `src/components` — per-site one-offs with no repeated identical cluster that meets the migration bar; **FUTURE AUDIT REQUIRED** only if a later phase can show identical output across two independent consumers. Local CSS variables outside `styles.css` are all `[--tone:var(--token)]` style channels in `status-badge.tsx` and `metal-badge.tsx` (canonical owners feeding foundation tokens) plus vendored `ui/calendar.tsx` and `ai-elements/shimmer.tsx` — **COMPLETE / canonical** and **COMPLETE / library-owned**. E5 remains 15 findings, unchanged from Phase 47; no stale finding. No token was renamed, merged or replaced.

### E. Component API / ownership drift

No canonical component has a second source, a conflicting owner or an undocumented API divergence. `asChild` appears only on Radix triggers (`DropdownMenuTrigger`, `SheetTrigger`, `PopoverTrigger`, `TooltipTrigger`, `Button asChild` in `plan-card.tsx`) — library-required composition, not ABox polymorphism; `surface.tsx` still documents and enforces no `as`, no Slot, no polymorphism. **COMPLETE / canonical**.

### F. Production vs reference boundary

Only `src/routes/design-system.tsx` and `src/routes/design-guide.tsx` import the design/reference layers — the two recorded reference-route exceptions. No reference module imports runtime branding/marketplace ownership. E1/E2/E3/E4 and the server-only restriction all fire in negative controls (see L). **COMPLETE / canonical**.

### G. Branding / White-Label

The Brand record in `src/lib/marketplace-store.ts` remains the sole runtime White-Label owner; `logo.tsx` remains the distinct static brand-mark source with 5 importers; Marketplace Asset Management remains separate; no design/reference duplication; no production component has become a hidden branding owner. The 37 literal brand strings recorded in Phase 43 remain as recorded (auth-gated shells and static titles) — **COMPLETE / intentional exception**, unchanged.

### H. Shell architecture

`internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx` contain zero imports of one another. E4 negative control fires. **COMPLETE / canonical**. No merge proposed.

### I. Table / data display

`data-table.tsx` remains the sole ABox table source (20 importer files). `src/components/ui/table.tsx` and `src/components/ui/pagination.tsx` remain at zero importers and E2-protected. No second table system exists outside the five documented route-local tables and the independent Lucie subtrees. **COMPLETE / canonical**.

### J. Forms / controls

`controlClass` (2), `field.tsx` (2), ActionPill (38) own their families. shadcn/Radix boundaries intact; 20 `ui/*` primitives remain at zero importers (the principal hazard, already E2-guarded for `table` and `pagination`). No exact duplicate control implementation found; similar-looking controls were not centralised. **COMPLETE / canonical** with **COMPLETE / library-owned** primitives.

### K. Surface / card system

`surface.tsx` (82 importers) remains the canonical Group A base; Group B/C variants, KpiCard, PlanCard, Lucie, M06 and M08 remain separately owned and documented. No second canonical Surface definition exists. **COMPLETE / canonical** + **COMPLETE / intentional exception**.

### L. Navigation / page composition

`page-header.tsx` (25) remains the canonical title/header source, `notice-page.tsx` (4) the canonical notice surface; shell navigation stays independent and route-local navigation stays documented. No universal navigation abstraction is implied or proposed. **COMPLETE / canonical**.

### M. Governance completeness

`.lovable/manual-work-map.md` remains the single human governance source. The Phase 47 report re-runs byte-identical (JSON `854bb6a3…`, Markdown `e1588e1a…`) with the same 201 findings and same schema; no stale finding, no contradictory record. The one counting-unit divergence for DataTable (Phase 42: 20 importer files · Phase 44: 23 call sites · Phase 47: 19 importer files / 26 usage sites · Phase 49: 20 importer files) is preserved side by side with its tooling named and is deliberately not reconciled. Generated reports remain diagnostic only. **COMPLETE / canonical**, with the Phase 48 report-only candidate (a distinct `framework-convention` finding type for `Route`) still recorded and still unauthorised.

### N. Final gap classification summary

COMPLETE/canonical: A, C (styles.css), E, F, G, H, I, J, K, L, M. COMPLETE/intentional exception: route-local tables, metal vs status badge, store selector names, Phase 43 brand strings, Group B/C Surface, interaction states. COMPLETE/library-owned: Tailwind breakpoints, unconsumed shadcn primitives, vendored CSS vars. COMPLETE/framework convention: exported `Route`. DOCUMENTATION GAP: unconsumed `planai-assistant.tsx` (recorded only). FUTURE AUDIT REQUIRED: arbitrary numeric Tailwind values (139 sites) — only if exact-equivalence evidence ever appears. FUTURE MIGRATION CANDIDATE: **none**. REVIEW-REQUIRED: **none**.

### O. Production completion checklist (evidence-based)

1. Every canonical family has exactly one ABox source with a named owner — met. 2. Each canonical source has measured production consumers — met. 3. Every non-adopting consumer is a documented exception — met. 4. Foundation ownership is recorded as canonical / decentralised / library-owned per dimension — met. 5. Runtime branding ownership is single and distinct from the static mark — met. 6. The three shells import none of each other — met. 7. Production imports no reference layer outside the two reference routes; reference imports no runtime ownership — met. 8. E1–E4 enforced with passing negative controls — met. 9. E5/E6/E7 drift detection deterministic and report-only — met. 10. Exact-preservation verified (no `src/` diff, locked hashes unchanged) — met. 11. No unexplained duplicate canonical definition — met. 12. No unresolved ownership ambiguity — met.

On this evidence the production-side architecture is effectively complete: outcome **B** — no further controlled migration phase is required for closure, and only documentation and periodic verification remain. Completion is recorded as an evidence state, not a claim of perfection.

### P. Future work boundaries

1. Required before production-side completion: nothing. 2. Optional / intentionally deferred: the Phase 48 report-only `framework-convention` finding type; a decision on the unconsumed `planai-assistant.tsx`; the 139-site arbitrary-value audit; the pre-existing lint backlog (16,783) and the `/quote?step=1` 390px overflow, both still unrepaired by design. 3. Figma: out of scope here and never a production migration — any Figma work is a separate track on top of the frozen production system.

### Q. Validation

Lint total 16,783 · `no-restricted-imports` 0 (unchanged). `tsgo --noEmit` clean. Build OK. Negative controls: E1 (`@/lib/design-tokens` from a production route) and E2 (`@/components/ui/table`) both blocked; E3 (`@/lib/marketplace-store` from `src/lib/design/**`) blocked; E4 (`./internal-shell` from `member-shell.tsx`) blocked; all temporary control files removed and `git status -- src/` clean afterwards. Report determinism: two consecutive runs byte-identical. Locked hashes (cksum) unchanged: logo 1815638579 · marketplace-shell 117403653 · internal-shell 3748215771 · member-shell 3790977838 · marketplace-store 1939291487 · styles.css 2128787410 · data-table 3115368089 · ui/table 905065594 · ui/pagination 2648877993 · eslint.config.js 4117328763. `git diff --stat -- src/` empty. No runtime asset, branding, route, token or behaviour change.

### R. Changed files

`.lovable/manual-work-map.md` (this block) only. No `src/` change.

### S. Rollback

Delete this block. No production rollback is possible or necessary. Any future migration requires its own separately approved plan-only phase with exact parity evidence at 1440/834/390.

---

## Phase 50 — Figma-native ABox design system & library generation blueprint (plan/extraction only; no `src/` change, no Figma mutation)

Blueprint for converting the completed production architecture (Phases 1–49) into a native Figma library. Nothing is implemented here. Phase 49 decisions are respected and not reopened.

### 1. Executive scope

Target chain: ABox canonical production sources → Figma variables/styles → Figma component sets with real variants and properties → patterns → shell assets → representative screens. Not screenshots, not flattened images, not a hand-rebuilt catalogue. The production implementation is the source of truth for what exists; nothing is redesigned, renamed, merged or normalised on the way into Figma.

**Tooling prerequisite.** Lovable has no cloud Figma connector. A future write phase needs the Lovable Desktop app + Figma Desktop in Dev Mode with the local MCP server enabled; that connector is **read-only**, so Figma *writes* must run through a supported plugin/Make path. Batch 0 cannot start until that path is confirmed.

### 2. Exact source inventory (extraction sources; consumer counts = Phase 49 importer-file scan)

`src/styles.css` — 198 custom properties, two `@theme inline` blocks, `@custom-variant dark`, 13 `@utility` rules, 6 `abox-*` keyframes, `@layer base` typography/reduced-motion/selection rules.
Components: `action-pill.ts` (`ACTION_PILL` 10 keys, `ActionPillVariant`; 2) · `action-pill-component.tsx` (`ActionPill`, `actionPillClass`; 38) · `status-badge.tsx` (89) · `kpi-card.tsx` (18) · `page-header.tsx` (25) · `data-table.tsx` (`DataTable`, `Column`; 20) · `empty-state.tsx` (10) · `surface.tsx` (`Surface`, `surfaceClass`, `SurfacePadding`; 82) · `control.tsx` (`controlClass`; 2) · `field.tsx` (2) · `notice-page.tsx` (`NoticePage`, `NoticeTone`; 4) · `marketplace-page-layout.ts` (10) · `logo.tsx` (`AboxMark`, `AboxWordmark`; 5) · `motion.tsx` (`FadeRise`, `Stagger`, `StaggerItem`, `CountUp`; 1) · `plan-card.tsx` (6) · `metal-badge.tsx` (25) · `internal-shell.tsx` / `marketplace-shell.tsx` / `member-shell.tsx` · `src/lib/marketplace-store.ts` (Brand record, `getActiveBrand`, `getDraftBrand`) · consumed shadcn/Radix primitives only. No additional canonical ABox component is invented.

### 3. Foundation mapping (disposition per item)

**Colour → Figma variable.** Light `:root` and `.dark` give exactly two modes. Semantic roles: background, foreground, surface/-foreground, panel, ink, card/-foreground, popover/-foreground, primary/-foreground/-soft, secondary/-foreground, sage/-foreground/-soft, muted/-foreground, accent/-foreground, destructive, warning, info, success (+ foregrounds). Status/tier: six `--metal-*` plus six `--metal-*-fg`. Line/field: border, border-strong, hairline, input, ring. Data-vis: `--chart-1..5`. Sidebar: eight `--sidebar-*`. All values are `oklch()`; Figma stores resolved sRGB, so the oklch source string is carried in the variable description (limitation R-3).
**Runtime-only (never a variable):** Brand `primary_color`, `accent_color`, `logo_asset_id`, `favicon_asset_id`, `display_name`, taglines/headlines/intros.
**Typography → Figma text style** for the centrally owned roles only: `text-display`, `text-eyebrow`, `text-serial`, plus the `@layer base` `h1,h2,h3/.font-display` role. Families: `--font-sans`/`--font-mono` "Inter Tight", `--font-display`/`--font-serif` "Bricolage Grotesque". `font-variation-settings` (`wdth 102`, `opsz 32/48`) and `font-feature-settings` (`ss01`, `cv11`) are recorded as style descriptions — Figma cannot bind them as variables (R-3). All other typography stays **code-only** (Phase 33).
**Spacing → Figma variable** only for proven owners: `MARKETPLACE_PAGE_LAYOUT.wide` (`max-w-[88rem]`, px-4/md:px-8, pt-4/md:pt-6, pb-8/md:pb-10) and `.narrow` (`max-w-4xl`, px-4/md:px-8, pt-4/md:pt-6, pb-10/md:pb-14); `ACTION_PILL` geometry (h-8/9/10/11, px-3/4/5/6, gap-1/1.5); `controlClass` heights (h-10/h-11) and `px-3`; Surface padding none/p-4/p-5/p-6. The 139 one-off arbitrary values stay **code-only** (Phase 49 deferral, not reopened).
**Shape → variable + effect style.** Radius variables `--radius-sm 6 / md 10 / lg 14 / xl 18 / 2xl 22 / 3xl 28 / 4xl 36` and `--radius 0.875rem`. Borders: border / border-strong / hairline / input. Effect styles: `--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow` (each a two-layer oklch stack — representable as two Figma drop shadows).
**Decoration vocabulary:** `card-brackets`, `edge-sheen`, `ember-underline`, `ring-pill`, `divider-warm` → component/effect representation where exact; `glass`, `noise-field`, `contour`, `aurora` → **documentation-only** (R-3).
**Layout.** Frame widths 1440 / 834 / 390; `md:` (768px) is the only breakpoint the wrappers use; the `max-width: 640px` base rule enforcing 44px minimum tap targets on `button, a` is documented as an accessibility intent, not a variable. Breakpoints themselves are **library-owned** (Tailwind).
**Iconography.** lucide-react is the single family; sizes observed h-5 w-5 (EmptyState glyph), icon tiles h-9/h-12/md:h-14 (PageHeader). Decorative icons carry `aria-hidden`; functional ones carry a label. Icons become **instance-swap properties**, never duplicated sets.
**Motion.** `abox-fade-rise`, `abox-orbit`, `abox-pulse-ring`, `abox-hairline-draw`, `abox-drift`, `abox-shimmer` plus the `prefers-reduced-motion` block → **documentation-only** with optional prototype notes; never components.

### 4. Variable collection blueprint

Collections: `Color/Primitive`, `Color/Semantic`, `Color/Status`, `Color/Sidebar`, `Color/Chart`, `Spacing`, `Radius`, `Border`, `Elevation`, `Layout`, `Control`. Modes: **Light / Dark only**. Record per variable: collection · name (token name verbatim, `/`-scoped) · type · value per mode · code source (file + line) · semantic purpose · scope (global / component-scoped / runtime-owned) · designer-exposed yes/no. Tenant branding excluded by rule.

### 5. Typography mapping

`Display` (Bricolage Grotesque 600, ls −0.032em, lh 1.02), `Heading h1–h3` (Bricolage 600, ls −0.028em), `Eyebrow` (mono 0.6875rem/500, uppercase, muted-foreground), `Serial` (mono, per `text-serial`), `Body` (Inter Tight, base). Everything else component-owned.

### 6. Component mapping (Figma dispositions)

| Source | Export | Importers | Figma disposition |
| --- | --- | --- | --- |
| action-pill-component.tsx | `ActionPill` | 38 | component set |
| action-pill.ts | `ACTION_PILL` | 2 | variables + documentation (not a component) |
| status-badge.tsx | `StatusBadge` | 89 | component set |
| kpi-card.tsx | `KpiCard` | 18 | component set |
| page-header.tsx | `PageHeader` | 25 | component set |
| data-table.tsx | `DataTable`/`Column` | 20 | component + nested row/cell parts |
| empty-state.tsx | `EmptyState` | 10 | component |
| surface.tsx | `Surface`/`surfaceClass` | 82 | component set (class entry point = documentation) |
| control.tsx | `controlClass` | 2 | variables + documentation |
| field.tsx | `Field` | 2 | component |
| notice-page.tsx | `NoticePage` | 4 | component set (tone axis) |
| marketplace-page-layout.ts | `MARKETPLACE_PAGE_LAYOUT` | 10 | layout variables + frame templates |
| logo.tsx | `AboxMark` | 5 | component set (tone axis) |
| logo.tsx | `AboxWordmark` | 5 | component set (compact boolean) |
| motion.tsx | `FadeRise`/`Stagger`/`StaggerItem`/`CountUp` | 1 | documentation-only |
| plan-card.tsx | `PlanCard` | 6 | component (marketplace pattern) |
| metal-badge.tsx | `MetalBadge` | 25 | component set (6 tiers) — intentionally separate from StatusBadge |

Each entry additionally carries anatomy, props, states, responsive and accessibility notes, composition relationships and a traceability id in the Batch-2 worksheet.

### 7. Component-property / variant blueprint

- **ActionPill** — variant axis with the exact 10 production keys (`primaryXs`, `primaryMd`, `primaryLg`, `primaryLgPlain`, `outlineXs`, `outlineSm`, `outlineSmCard`, `outlineMd`, `outlineMdPlain`, `outlineLg`) plus a Hover state axis and a boolean+instance-swap icon slot. The `*Plain` keys keep no icon gap — the icon boolean must be unavailable on them (impossible combination). No new sizes are synthesised.
- **StatusBadge** — tone axis `sage | primary | warning | muted | destructive | info`; the leading dot is structural, not optional; label is a text property. Colours derive from `color-mix(var(--tone) 88/12/34%)` — recorded as three resolved fills per tone (R-3).
- **Surface** — padding `none | sm | md | lg` × booleans `elevated`, `interactiveHover`, `decor`; content is a slot. Interactive hover is a state, never a separate component.
- **KpiCard** — tone `default | primary | sage | warning`; booleans delta / hint / icon; text properties label, value, delta label. `CountUp` is behaviour, not a variant.
- **PageHeader** — variant `default | compact`; booleans eyebrow, description, icon, actions.
- **DataTable** — column count and alignment as nested row/cell components; hover state; boolean caption; empty slot pointing at EmptyState. No pagination, sorting or selection is added — none exists in production.
- **EmptyState** — booleans icon, body, action.
- **Field** — label text property, control instance swap.
- **NoticePage** — tone `muted | destructive | warning | primary`.
- **AboxMark** — tone `primary | sage | sidebar | foreground`; size is a numeric prop → Figma sizes documented at the real call sites (34px header, 40px footer, default 36). **AboxWordmark** — boolean `compact` (20px vs 24px + "Agency in a Box" line).
Business data never becomes a variant; code props with no design representation stay code-only.

### 8. Pattern mapping

Foundation → Component → Compound (KPI row; Field group; DataTable + EmptyState; PageHeader + actions) → Pattern (marketplace wide/narrow page wrapper; notice screen) → Experience (quote/shopping flow, admin brand workspace) → Screen. No new pattern is invented.

### 9. Shell mapping

Three independent shell families, never merged: **MarketplaceShell** (public header with `AboxMark` 34px + "ABox | AGENCY IN A BOX", dropdown nav, footer mark 40px), **InternalShell** (navy sidebar rail using the `--sidebar-*` collection, sheet nav at small widths, product switcher), **MemberShell**. Each documents shell-owned navigation, layout, responsive behaviour, the shared ABox components it consumes, and the deliberately independent elements. Shared components are represented once in `01 Components` and instanced per shell.

### 10. Branding boundary

Documented relationship only: Brand record → `getActiveBrand` → marketplace shell/landing; `getDraftBrand` → admin brand / preview / compare / releases. Figma holds the **static ABox mark** and design-time foundation colours. Tenant colours, runtime asset references and favicon stay runtime-owned. Figma must never become the runtime branding source, and the admin brand/preview `#fff` contrast literals stay runtime-owned exceptions.

### 11. Screen inventory and evidence levels

**Runtime-captured (public, measurable):** `/`, `/faq`, `/select`, `/quote?step=1`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff` — frames at 1440 / 834 / 390. (`/quote?step=1` carries the recorded 390px overflow; it is reproduced as-is, never "fixed" in Figma.)
**Source-inspected / structurally represented (NOT CAPTURED):** `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*` — including the five route-local tables and the admin brand/preview screens. No visual capture is claimed for these.
Per screen record: route · shell · state · viewport · evidence level · components demonstrated · Figma frame candidate · responsive frames needed · exactness confidence.

### 12. Automation map

**A. Fully automatable** — variable collections and values; text styles; effect styles; component-set scaffolds with variant axes and properties; Auto Layout from extracted geometry; naming; library page structure; traceability records.
**B. Automatable with review** — component anatomy fidelity; decoration utilities; icon mapping; pattern compositions; representative screen assembly.
**C. Manual Figma judgment** — canvas organisation; documentation annotations; prototype/motion notes; limitation write-ups where Figma cannot express a CSS treatment.
**D. Must stay code/runtime-owned** — runtime branding, live data, business logic, routing, governance enforcement and E5/E6/E7 state, Marketplace Asset Management.

### 13. Manual-work map

Only the C-list above. No canonical component may be hand-rebuilt when its variants and geometry are derivable from source.

### 14. Code ↔ Figma traceability

Stable id `abox/<export-name>` (e.g. `abox/ActionPill`, `abox/Surface`). Record per id: source file · export name · canonical phase decision · content hash (cksum baseline: logo 1815638579 · marketplace-shell 117403653 · internal-shell 3748215771 · member-shell 3790977838 · marketplace-store 1939291487 · styles.css 2128787410 · data-table 3115368089) · Figma target key once created. The register lives under `.lovable/`; **production source is not modified to carry Figma metadata**.

### 15. Library / file architecture and naming

Pages `00 Foundations` · `01 Components` · `02 Patterns` · `03 Shells` · `04 Experiences` · `05 Screens` · `06 Documentation`. Naming uses production terminology verbatim: variables mirror token names (`Color/Semantic/primary-soft`), text styles mirror utility names (`Eyebrow` ← `text-eyebrow`), component sets use export names (`ActionPill`), variant values use production keys (`primaryLgPlain`), screens use route paths, shells use shell export names.

### 16. Exactness / validation model (for the future build, not now)

Compare geometry, spacing, typography, colour, radius, border, elevation, states, responsive behaviour at 1440/834/390, accessibility intent, shell boundaries, branding boundaries and ownership. Screenshots alone never establish parity. Pre-implementation baselines: production source fingerprints; canonical source inventory; Figma variable and component inventories; naming and property validation; traceability check; shell- and branding-boundary checks; `git diff --stat -- src/` empty.

### 17. Risks and limitations

R-1 no cloud Figma connector; desktop MCP read-only, writes need a plugin/Make path. R-2 auth-gated screens cannot be runtime-captured. R-3 Figma cannot express oklch source notation, variable font axes, `color-mix()`, `noise-field`, `contour`, `aurora`, `glass`, `edge-sheen`, or keyframe motion exactly — each is recorded as a limitation and never used to justify changing production. R-4 Tailwind responsive utilities have no variable equivalent; frames encode them. R-5 library drift once production changes — mitigated by the hash-based traceability register.

### 18. Future implementation batches (each needs its own approved plan; none executed)

Batch 0 library/file foundation (blocked on R-1) · Batch 1 variables, text styles, effect styles · Batch 2 canonical component sets · Batch 3 patterns and shell assets · Batch 4 representative screens · Batch 5 traceability register · Batch 6 exactness and responsive validation · Batch 7 library governance and handoff.

### 19. Must NOT be automated or moved into Figma

Runtime branding values and assets; Marketplace Asset Management; live data; business logic; routing; governance enforcement and E5/E6/E7 state; Lucie; M06; M08; AI-elements; shadcn/Radix internals treated as ABox-owned; shell merging; route-local/business-coupled components as generic Figma components; the unused `planai-assistant.tsx`; the deferred one-off spacing values.

### 20. Changed files, validation and rollback

Changed: `.lovable/manual-work-map.md` (this block) only. No `src/` change, no Figma mutation, no runtime/asset/branding/route/token/behaviour change; canonical hashes above unchanged. Rollback: delete this block.

## Phase 51 — Figma Write-Path & Automation Environment Validation (audit only, zero migrations)

Audit-only. No Figma file, component, variable, style or library was created, changed or published. No plugin installed. No production code, UI, behaviour, route, asset, branding, token or governance-enforcement change. Batch 0 of Phase 50 not started. Phases 1–50 stand unchanged.

### 1. Executive finding

**NOT READY — USER/ENVIRONMENT SETUP REQUIRED.**

No write-capable Figma path is verified in the current environment. Verified facts: (a) the workspace connector catalogue returns no Figma app MCP and Lovable has no cloud Figma connector; (b) no desktop MCP session is active; (c) the documented Lovable Desktop + Figma Desktop Dev Mode local MCP connection is read-only and cannot create Figma objects; (d) the only Figma-related code in the repository is reference/blueprint data under `src/lib/design/` (`figma-variables.ts`, `figma-library.ts`, `figma-readiness.ts`, `figma-library-readiness.ts`), which is documentation, not a write mechanism. A write path therefore requires either code executing inside Figma (a plugin) or an authorised Figma API / Make workflow, and neither can be verified from this environment.

### 2. Candidate workflows and classification

| # | Workflow | Class | Verification status |
|---|---|---|---|
| W1 | Lovable cloud Figma connector | NOT AVAILABLE IN CURRENT ENVIRONMENT | Verified absent (catalogue query returned no Figma MCP) |
| W2 | Lovable Desktop + Figma Desktop Dev Mode local MCP | VERIFIED READ-ONLY | Verified read-only by platform contract; no active session |
| W3 | Figma plugin executed by the user inside Figma | AVAILABLE BUT REQUIRES USER SETUP | UNVERIFIED — no plugin exists, none identified, none installed |
| W4 | Figma REST API with a user personal access token | AVAILABLE BUT REQUIRES USER SETUP | UNVERIFIED — no token present; REST variable/component write coverage unverified here |
| W5 | Figma Make | UNVERIFIED | No access from this environment; capabilities not observable |
| W6 | Manual construction in Figma by a designer | AVAILABLE BUT REQUIRES USER SETUP | Verified possible; UNSUITABLE as the primary path for deterministic native library generation at this scale |

### 3. Read vs write capability matrix (only what is observable)

| Capability | W1 | W2 | W3 | W4 | W5 | W6 |
|---|---|---|---|---|---|---|
| Read Figma file structure | n/a | yes | unverified | unverified | unverified | yes |
| Create variables | n/a | no | unverified | unverified | unverified | yes |
| Create text/effect styles | n/a | no | unverified | unverified | unverified | yes |
| Create components | n/a | no | unverified | unverified | unverified | yes |
| Create component sets, variants, properties | n/a | no | unverified | unverified | unverified | yes |
| Auto Layout | n/a | no | unverified | unverified | unverified | yes |
| Instances | n/a | no | unverified | unverified | unverified | yes |
| Pages / sections | n/a | no | unverified | unverified | unverified | yes |
| Update existing objects in place | n/a | no | unverified | unverified | unverified | yes |
| Publish library | n/a | no | unverified | unverified | unverified | yes (with permission) |
| Deterministic batch execution | n/a | n/a | unverified | unverified | unverified | no |

"unverified" is a status, not a capability claim. No entry in this table may be upgraded without direct evidence from the environment in a later phase.

### 4. Required desktop applications and permissions (per workflow, not yet required of the user)

W2: Lovable Desktop app, Figma Desktop in Dev Mode with the local MCP server enabled, connected under Settings → Connectors → Local MCP servers. Grants read access only. W3: Figma Desktop or web, edit access to the target file, plugin run permission; a plugin must exist first — none does. W4: a Figma account with file edit access and a personal access token held outside the repository. W5/W6: Figma account with edit access; publishing additionally requires library-publish permission on the target team/file.

### 5. MCP boundary

The desktop local MCP connection is an inspection channel. It is explicitly NOT a write path and must never be described as one. Plugin execution and Make execution are separate mechanisms with separate permission models, neither connected nor verified.

### 6. User-action prerequisite checklist

Mandatory before any Phase 52 write attempt: (M1) decide and confirm the write mechanism — plugin (W3) or REST token (W4); (M2) provide or create a dedicated scratch Figma file and confirm edit access on it; (M3) confirm whether library publishing permission exists on the target team.
Conditional: (C1) install Lovable Desktop and enable the Figma Dev Mode local MCP — required only if read-back inspection is used for validation; (C2) install/enable a plugin — only if W3 is chosen; (C3) supply a Figma token into the local environment — only if W4 is chosen, and never into source.
Not required: nothing else. No setup is requested for workflows that are not chosen.

### 7. Native-object validation strategy (for a future phase only)

Each generated object type is proven native by structural inspection, never by screenshot: variables (exist in a named collection with typed values and modes, and are bound to consuming nodes); text styles and effect styles (exist as named styles, applied by reference); components (`COMPONENT` node type, not `FRAME` or `RECTANGLE` with an image fill); component sets (`COMPONENT_SET` with declared variant axes); variants and component properties (property definitions readable with their allowed values); instances (`INSTANCE` nodes resolving to the master); Auto Layout (layout mode, padding, gap and sizing set, not absolute positions); editable text (`TEXT` nodes with readable characters); editable vector/icon layers (`VECTOR`/`BOOLEAN_OPERATION`, not images); page/section hierarchy (named pages and sections at the expected depth). Failure condition: any `IMAGE` fill or flattened node standing in for a component, style, icon or text anywhere in the target file fails the whole validation run.

### 8. Determinism strategy

Required of whichever path is chosen: stable collection/variable names, stable component and component-set names, stable variant and property names, stable page/section hierarchy, and `abox/<export-name>` traceability identity carried in naming or plugin data. Re-running generation must not duplicate components; update-in-place is preferred. If the chosen path cannot guarantee deterministic update-in-place, that limitation is recorded before Batch 0 and the batch is re-scoped rather than worked around.

### 9. Rollback strategy

All generation targets a dedicated scratch file. Nothing is published into a shared or production-facing library until validation passes. Existing Figma libraries and unrelated files are never written to. Production code, runtime branding and ABox architecture are outside the write surface entirely, so no rollback touches them. Failed run rollback: discard or delete the scratch file.

### 10. Security model

Authentication happens in the user's Figma session (plugin path) or via a personal token held in the local environment (REST path). No credential, token, plugin ID or file key is stored in ABox source or committed. No secret is required for this phase. Generated reports must be screened for file keys and tokens before being written, and must not embed them.

### 11. Traceability readiness

The Phase 50 scheme `abox/<export-name>` can be preserved through any of W3, W4 or W6 via Figma object naming, with optional plugin data on the plugin path. No production source needs Figma metadata, and none is added. Traceability is not implemented in this phase.

### 12. Batch 0 readiness criteria

All mandatory, all currently unmet unless noted: verified write-capable path (NOT MET); authenticated user on that path (NOT MET); correct Figma permissions (NOT MET); target file available (NOT MET); native variable creation proven (NOT MET); native component creation proven (NOT MET); native component-property/variant creation proven (NOT MET); native Auto Layout proven (NOT MET); re-run/update behaviour understood (NOT MET); rollback understood (MET — scratch-file model defined); no production mutation (MET); no runtime branding transfer (MET); no flattened screenshot workflow (MET, by rule). Status: **NOT READY**.

### 13. Exact blockers

B-1 no verified write-capable mechanism (W1 absent, W2 read-only, W3/W4/W5 unverified). B-2 no chosen mechanism. B-3 no target Figma file with confirmed edit access. B-4 no proof of native variable/component/variant/Auto Layout creation. B-5 update-in-place behaviour unknown. B-6 library publishing permission unknown.

### 14. Recommended future sequence (each step needs its own approved plan)

S1 choose the write mechanism with the user and record the decision. S2 confirm the target scratch file and permissions. S3 minimal capability probe — create one variable, one text style, one component with one variant property and Auto Layout in the scratch file, then validate natively per §7. S4 determine re-run/update-in-place behaviour. S5 re-evaluate Batch 0 readiness against §12. Only then does Phase 52 / Batch 0 begin.

### 15. Runtime boundaries preserved

The future Figma workflow never takes ownership of tenant runtime branding, Marketplace Asset Management, live data, business logic, routing, authentication, production governance, E5/E6/E7 enforcement, shell merging, or route-local/business-coupled production ownership. Production remains the canonical design-system source; Figma is a generated representation.

### 16. Changed files, validation and rollback

Changed: `.lovable/manual-work-map.md` (this block) only. No `src/` diff, no Figma mutation, no asset/branding/route/token/behaviour change; Phase 49 canonical hashes unchanged. Rollback: delete this block.

## Pre-Phase-52 Final Verification & Regression Gate (audit only; no `src/` change, no Figma mutation)

**Verdict: CLEAR FOR PHASE 52.** Zero B0. Zero B1. Six B2 records, all documentation/measurement-unit only.

### 1. Integrity baseline

`git status --porcelain` empty; `git diff --stat -- src/ public/ eslint.config.js package.json` empty. All ten Phase 49 locked `cksum` values recomputed and identical: logo 1815638579 · marketplace-shell 117403653 · internal-shell 3748215771 · member-shell 3790977838 · marketplace-store 1939291487 · styles.css 2128787410 · data-table 3115368089 · ui/table 905065594 · ui/pagination 2648877993 · eslint.config.js 4117328763.

### 2. Static health

Typecheck clean (no diagnostics). Lint total 16,783 — byte-identical to the recorded baseline; `no-restricted-imports` findings 0. Harness build log newest entry `build OK`.

### 3. Enforcement gate (five negative controls, all fired)

Exercised with `eslint --stdin --stdin-filename`, writing nothing to disk; working tree confirmed clean afterwards.
E1 reference-layer import from `src/routes/**` — blocked. E2 `@/components/ui/table` — blocked. E3 `@/lib/marketplace-store` from `src/lib/design/**` — blocked. E4 shell-to-shell (`member-shell` from `internal-shell.tsx`) — blocked. `server-only` package import — blocked. All four rule groups plus `SERVER_ONLY_PATHS` present in `eslint.config.js` at severity `error`; the reference-surface override still relaxes E1 only and still applies E2 + E3.

### 4. Canonical ownership sweep (re-measured, not copied)

All 21 canonical files present at their recorded paths. Importer-file counts outside `src/components/abox/`, re-measured this gate: action-pill 2 · action-pill-component 38 · status-badge 89 · kpi-card 18 · page-header 25 · data-table 20 · empty-state 10 · surface 82 · control 2 · field 2 · notice-page 4 · marketplace-page-layout 10 · plan-card 6 · motion 1. Every figure matches the Phase 49/50 record under the same measurement method. `src/components/ui/table.tsx` and `ui/pagination.tsx` remain at zero importers.

Foundation re-measured: `src/styles.css` 198 custom-property declarations, two `@theme inline` blocks, one `@custom-variant dark`, 6 `abox-*` keyframes — all matching. `<table>` elements: 1 canonical (`data-table.tsx`) + 5 auth-gated route-local + 1 unconsumed shadcn primitive + Lucie/reference occurrences, unchanged.

### 5. Boundary sweep

**Reference → production:** zero files under `src/routes/**` or `src/components/**` (excluding the two reference routes and `src/components/design/**`) import `@/lib/design/**`, `@/lib/design-tokens` or `@/components/design/**`. Reference modules that mention canonical component paths do so as documentation strings, not imports.
**Branding:** `Brand`, `getActiveBrand` (line 569) and `getDraftBrand` (line 572) remain solely in `src/lib/marketplace-store.ts`. No brand field, colour or asset id appears anywhere under `src/lib/design/**`, `src/components/design/**` or `src/lib/design-tokens.ts`. Marketplace Asset Management remains runtime-owned and undocumented into the reference layer.
**Shells:** no shell file imports another shell. Three independent families intact.

### 6. Zero-migration phases

Phases 35–42 and 44 remain zero-migration: no new centralizing abstraction exists for navigation, typography, control/icon sizing, spacing, radius/elevation, motion, accessibility or tables. No canonical component has been forked or duplicated.

### 7. Governance artifacts

`bun run governance:report` run twice; `.lovable/governance-report.json` and `.md` byte-identical across runs, and `git diff --stat -- src/` still empty afterwards. 201 findings: E5 15 · E6 21 · E7 165. Types: documented-exception 10 · library-owned 5 · canonical-consumer-count 21 · duplicate-export-name `Route` 154 · remaining name collisions 11. Review-required 0. E5/E6/E7 remain report-only.

### 8. Intentional exceptions re-tested

Each was re-tested against the migration-eligibility criteria, not assumed. All fail at least one criterion and remain verified-still-valid exceptions: three shells (shell conflict), Lucie / M06 / M08 / AI-elements (independent systems, same-name exports only), Branding/White-Label runtime and Marketplace Asset Management (runtime ownership, business coupling), five auth-gated route-local tables (NOT CAPTURED — no measurable parity evidence obtainable while signed out; never fabricated), metal vs status badge (different semantic role; `MetalBadge` used at 5 sites, tier semantics not status tone), store selector naming, Surface groups B and C (distinct decoration/interaction output), interaction states, Tailwind breakpoints and the 22 unconsumed shadcn primitives (library-owned), exported `Route` (framework convention). Zero exception was reclassified.

### 9. Runtime verification

Nine public routes loaded headless at 1440×900, 834×1112 and 390×844: `/`, `/faq`, `/select`, `/quote?step=1`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff`. All HTTP 200, zero console errors, zero page errors at all three viewports. Document scroll width equals viewport width everywhere except the already-recorded `/quote?step=1` mobile overflow (scrollWidth 666 at 390 — unchanged pre-existing item, B2, not repaired in this gate). Auth-gated areas were not entered and no session was fabricated.

### 10. Phase 50 and Phase 51 consistency

Every file, export and token named in the Phase 50 blueprint still exists with that name; the section-2 inventory counts reconcile with this gate's re-measurement under their stated method. Phase 51 remains a readiness conclusion only: the repository contains no Figma file reference, plugin, manifest, token or generated library artifact. The only Figma-named modules are reference documentation data under `src/lib/design/` (figma-library, figma-variables, figma-readiness, graph-figma, pattern-figma, spec-figma-*), which no production file imports. Phase 51's NOT READY write-path status is therefore not represented anywhere as a completed build.

### 11. Findings

**B0 (blockers): none.**
**B1 (required corrections): none.**
**B2 (recorded, non-blocking):**
1. Phase 46 validation prose names `src/routes/plans.tsx` as an allowed-import probe filename; the real route file is `src/routes/plans.index.tsx`. Probe filename in a past narrative only; no rule or code affected.
2. Phase 50 records 13 `@utility` rules in `src/styles.css`; the current file contains 12 (`text-display`, `text-eyebrow`, `text-serial`, `noise-field`, `contour`, `aurora`, `glass`, `ember-underline`, `ring-pill`, `divider-warm`, `card-brackets`, `edge-sheen`). Count discrepancy in documentation; the file hash is unchanged since Phase 49, so no rule was removed.
3. `metal-badge` is recorded at 25 in the Phase 50 inventory, which counts all files mentioning the path including reference-layer documentation strings; production importer files are 4 and `<MetalBadge` usage sites are 5 across 5 files. Measurement-unit divergence, same class as the existing DataTable 19/20/23/26 note; deliberately not reconciled.
4. `logo.tsx` recorded at 5 counts `planai-assistant.tsx` (itself inside `src/components/abox/`); the outside-abox importer count is 4. Same measurement-unit class.
5. `planai-assistant.tsx` remains a zero-importer production file — unchanged DOCUMENTATION GAP from Phase 49, not a defect.
6. Pre-existing lint backlog (16,783) and the `/quote?step=1` 390px overflow remain unrepaired by standing instruction.

### 12. Completion criteria

All twelve gate criteria met with evidence: clean tree, matching hashes, clean typecheck, `build OK`, `no-restricted-imports` 0, five enforcement controls firing, deterministic report, every canonical family single-sourced with re-measured consumers, reference layer with zero production importers, branding and Marketplace Asset Management runtime-owned only, three shells independent, Phase 50 blueprint internally consistent, Phase 51 correctly represented, every finding classified with zero B0 outstanding.

### 13. Changed files, validation and rollback

Changed: `.lovable/manual-work-map.md` (this block) only. No `src/` diff, no Figma mutation, no asset/branding/route/token/behaviour/responsive change; all Phase 49 locked hashes unchanged. Rollback: delete this block.

---

## Phase 52 / Batch B1 — Foundation variables: inventory reconciliation (2026-09-21)

Scope: plugin layer only (`tools/figma-plugin/`). No `src/` diff; `git diff --stat -- src/` empty; all Phase 49 locked hashes unchanged; no Figma mutation from this workspace.

### 1. Status tone names — approved brief vs production

The B1 brief named six tones `sage, primary, amber, red, sky, neutral`. The mapping authority `src/components/abox/status-badge.tsx` declares:

```
type Tone = "sage" | "primary" | "warning" | "muted" | "destructive" | "info";
sage: "[--tone:var(--sage)]"      primary: "[--tone:var(--primary)]"
warning: "[--tone:var(--warning)]"  muted: "[--tone:var(--foreground)]"
destructive: "[--tone:var(--destructive)]"  info: "[--tone:var(--info)]"
```

Referenced tokens exist in `src/styles.css` (`--sage`, `--primary`, `--warning`, `--foreground`, `--destructive`, `--info`), each with a `.dark` counterpart. No `--amber`, `--red`, `--sky`, `--neutral` exists anywhere in `src/`.

FINDING: the brief's generic list is superseded by production; the implementation did not deviate. Final `ABox/Status` tone names: `sage`, `primary`, `warning`, `muted`, `destructive`, `info`, each aliasing the semantic variable named by its `[--tone:var(--X)]` declaration (`muted` -> semantic `foreground`, by declaration, never by colour equality). Correction required: none.

### 2. Metal tier names — approved brief vs production

The brief named `platinum, gold, silver, bronze, iron, lead` (+ `-fg`). `src/components/abox/metal-badge.tsx` `TIER_VAR` maps: Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic to `--metal-<tier>` / `--metal-<tier>-fg`; declared in `src/styles.css` lines 140-151 (`:root`) and 206-217 (`.dark`). The tier union is `src/lib/sample-data.ts:12`. No `--metal-iron` or `--metal-lead` exists in `src/`.

FINDING: superseded by production; implementation correct. Final 12 names: `metal/bronze(-fg)`, `metal/expanded-bronze(-fg)`, `metal/silver(-fg)`, `metal/gold(-fg)`, `metal/platinum(-fg)`, `metal/catastrophic(-fg)`, each aliasing the primitive of the same role path. Correction required: none.

### 3. Resolved B1 inventory (9 collections, 200 variables, Light + Dark only, no Default mode)

Primitive 62 (one per production role path declared with an `oklch()` literal, `ink` and the 12 metal tokens included; a Light/Dark literal difference is two mode values on ONE variable) · Semantic 54 (both `@theme inline` blocks: 48 + `ai`, `ai-foreground`, `surface-1`, `surface-2`, `surface-3`, `brand-accent`; `ink` absent — production declares no `--color-ink`) · Status 18 (6 tones + 12 metals) · Spacing 4 · Radius 9 · Border 2 · Layout 2 · Control sizing 4 · Elevation 45 (9 layers across `card`, `elevated`, `drawer`, `plate`, `glow`, each x/y/blur/spread FLOAT + tint COLOR).

Aliasing is source-mapping authoritative: a semantic variable aliases a primitive only because production declares `--color-X: var(--Y)`, resolved independently per mode. Colour equality never implies an alias.

### 4. Execution status — OPEN

Evidence to date is an offline dry-run only (mocked `figma.*` API driving the generated `code.js` twice: all structural checks PASS, `RESULT: B1 PASSED` both runs, zero objects created on run 2). Its ids are mock ids and must never be presented as Figma ids. This workspace has no Figma write path (no cloud connector; desktop MCP read-only), so real runtime evidence can only come from the user running the plugin in Figma Desktop against `ABox Design System — Library`. B1 remains OPEN until two real runs return `RESULT: B1 PASSED` with identical collection and variable ids.

### 5. Recorded limitations (verbatim from the plugin report block)

- StatusBadge colour/background/border use color-mix(in oklch, var(--tone) ..., ...) (src/components/abox/status-badge.tsx): runtime-computed, no static Figma variable created.
- Composite box-shadow is not a Figma variable type: --shadow-* is decomposed into x/y/blur/spread/tint variables. Effect Styles are a later batch.
- oklch() has no Figma equivalent: values are stored as sRGB and the original oklch literal is preserved in each variable description.
- Production declares no .dark override for --shadow-*: the Light value is duplicated into Dark because Figma has no CSS cascade.
- Decorative utilities, motion keyframes and responsive breakpoints are not variables.
- No publishing performed; library publishing is a separate step.

### 6. Changed files and rollback

Changed: `.lovable/manual-work-map.md` (this block) only. Rollback: delete this block. The plugin layer (`extract-b1.mjs`, `tokens-b1.js`, `plugin.js`, `ui.html`, `README.md`, generated `code.js` via `node build.mjs`) is unchanged by this reconciliation.

---

## Phase 52 / Batch B2 — Typography foundation (2026-09-21)

Scope: plugin layer only. No `src/` diff; B0 pages unchanged and empty; B1's nine collections and 200 variables untouched (read-only, asserted in `b2-verify`); proof file untouched; no publishing; no B3 work.

### 1. Source authority

No `tailwind.config.*` exists; Tailwind v4 is configured through `src/styles.css`, which holds every production typography declaration. Four font tokens (`--font-sans` 27, `--font-display` 28, `--font-serif` 29, `--font-mono` 30) and five roles: `html` (244), `h1,h2,h3,.font-display` (257-262), `@utility text-display` (282-288), `@utility text-eyebrow` (290-297), `@utility text-serial` (299-306). Production declares no `--text-*`, `--leading-*`, `--tracking-*` or `--font-weight-*` scale tokens; Tailwind's built-in utilities are library-owned defaults and are not imported. `src/lib/design/**` typography data is reference documentation with zero production importers and was not used as a source.

### 2. Inventory — 1 collection, 19 variables, Light + Dark, no Default

`ABox/Typography`. STRING 9 = 4 `family/*` (production stack verbatim) + 5 `role/*/family` (aliases). FLOAT 10 = heading `weight`,`letter-spacing`; display `weight`,`letter-spacing`,`line-height`; eyebrow `size`,`weight`,`letter-spacing`; serial `size`,`letter-spacing`. Arithmetic check 9 + 10 = 19 is asserted at runtime and printed in the report.

Light and Dark values are intentionally identical: production declares no `.dark` typography override. No variable exists for a property a role does not declare (`role/base` has family only; `role/serial` has no weight). `--font-serif`/`--font-display` and `--font-mono`/`--font-sans` share stacks but remain four distinct variables; equality is never alias evidence. Aliases exist only where production writes `font-family: var(--font-X)`.

Conversions: rem to px at the 16px root (`0.6875rem`->11, `0.625rem`->10); em letter-spacing to Figma percentage (`-0.028em`->-2.8, `-0.032em`->-3.2); line-height keeps the unitless 1.02. Original literals and `src/styles.css:<line>` stay in every description.

### 3. Recorded limitations

`font-variation-settings` (heading `"wdth" 102, "opsz" 32`; display `"wdth" 102, "opsz" 48`), `font-feature-settings: "ss01", "cv11"` (body), `font-variant-numeric: tabular-nums` (serial), `text-transform: uppercase` (eyebrow, serial) — no Figma variable type; recorded verbatim, not approximated. Eyebrow/serial `color: var(--muted-foreground)` is already a B1 semantic variable and is not duplicated. Font stacks are stored whole though Figma has no fallback concept. JetBrains Mono is loaded in `src/routes/__root.tsx:100` but referenced by no token (`--font-mono` resolves to Inter Tight); no variable created. No text styles, effect styles, components, component sets, variants or page content created.

### 4. Execution status — OPEN

Offline dry-run only: `RESULT: B2 PASSED` on both runs, all 23 structural checks PASS, strict "created" line count in run 2 = 0, totals 10 collections / 219 variables (200 B1 + 19 B2). Its ids are mock ids and are never presented as Figma ids. This workspace has no Figma write path, so real evidence requires the user running the plugin in Figma Desktop twice with identical ids.

### 5. Changed files

Created `tools/figma-plugin/extract-b2.mjs` and generated `tokens-b2.js`. Modified `plugin.js` (B2 create/verify + entry), `ui.html` (two buttons), `build.mjs` (concatenates `tokens-b2.js`), `README.md`, `.lovable/manual-work-map.md`. `code.js` regenerated only via `node build.mjs`, never hand-edited. No `src/` change. Rollback: revert the plugin-layer files and this block.

---

## Phase 52 / Batch B3 — Foundational styles (2026-09-21)

Scope: plugin layer only. No `src/` diff; B0 pages unchanged and empty; B1 (9 collections / 200 variables) and B2 (`ABox/Typography`, 19 variables) read-only and asserted untouched; proof file untouched; no publishing; no B4 work.

### 1. Architecture decision

Figma paint and effect styles bind to variables, so every B3 style is a single mode-independent wrapper around the mode-aware B1 variable. No Light/Dark style duplicates exist, no colour style carries a literal fill, and no style was created because two values matched.

### 2. Inventory — 79 styles

Colour 72: `ABox/Semantic/<role>` for all 54 production roles (bound to `ABox/Color/Semantic`), `ABox/Status/<tone>` for the six StatusBadge tones and `ABox/Metal/<tier>` plus `<tier>-fg` for the twelve MetalBadge entries (bound to `ABox/Status`). The 62 primitives get no style: production consumes them only as alias targets.

Text 2: `ABox/Text/eyebrow` (Inter Tight, 11px, 500, 0 tracking, uppercase) and `ABox/Text/serial` (Inter Tight, 10px, 0 tracking, uppercase; production declares no weight, so the CSS-inherited 400 is used and stated). `base`, `heading` and `display` are not text styles — production declares no font-size for them.

Effect 5: `ABox/Elevation/{card,elevated,drawer,plate,glow}`, nine layers total, each layer's `offsetX`/`offsetY`/`radius`/`spread`/`color` bound to the existing `ABox/Elevation` variables so no number is duplicated.

### 3. Limitations recorded verbatim

`color-mix()` badge tints (runtime-computed); `oklch()` -> sRGB with the literal preserved; heading/display/base have no production font-size; `font-variation-settings` (261, 287), `font-feature-settings` (254), `font-variant-numeric` (305) have no Text Style property; eyebrow/serial `color: var(--muted-foreground)` is carried by a colour style, not the text style; `plan-o-assistant.tsx:27` composes `--shadow-glow` with an inline layer (component-level); `--shadow-overlay` (462) is an unused alias of `--shadow-elevated`; no `.dark` shadow override exists; decorative utilities, motion keyframes and responsive breakpoints are not styles; grid styles = zero.

### 4. Idempotency

Exact-name matching per category. Existing style reused and updated in place. Duplicate name in a category = STOP. Same name in another category = STOP. Unrelated non-ABox styles counted and never touched.

### 5. Execution status — OPEN

Offline dry-run only: `RESULT: B3 PASSED` on both runs, all 24 structural checks PASS, strict "created" line count in run 2 = 0, 79 styles, B1 200 and B2 19 variables unchanged. Its ids are mock ids and are never presented as Figma ids. Real evidence requires the user running the plugin in Figma Desktop twice with identical style ids.

### 6. Changed files

Created `tools/figma-plugin/extract-b3.mjs` and generated `tokens-b3.js`. Modified `plugin.js` (B3 create/verify + entry), `ui.html` (two buttons), `build.mjs` (concatenates `tokens-b3.js`), `README.md`, `.lovable/manual-work-map.md`. `code.js` regenerated only via `node build.mjs`, never hand-edited. No `src/` change. Rollback: revert the plugin-layer files and this block.

## Phase 52 / Batch B4 — Component foundation (2026-09-21)

Scope: plugin layer only. No `src/` diff; B1 (9 collections / 200 variables), B2 (`ABox/Typography`, 19 variables) and B3 (79 styles) read-only and asserted untouched; proof file untouched; no publishing; no B5 work.

### 1. Architecture decision

11 Component Sets + 3 standalone Components = 14 objects; 38 fixed variants + 14 enumerated = 52. `ABox/Brand/AboxMark` is a Component Set with exactly four `tone` variants (primary, sage, sidebar, foreground), each backed by a distinct branch of the production `TONES` record in `abox/logo.tsx:15-20`; `size` is a free numeric prop with no finite production set and is therefore not a variant axis. Every enumerated variant on Button, Surface and Control comes from literal prop values at real production call sites; combinations production never uses are not created.

### 2. Bindings

Colours -> B3 Colour Styles (already bound to B1 variables). Elevation -> B3 Effect Styles. Typography -> `ABox/Text/eyebrow` and `ABox/Text/serial` where production declares the role, otherwise the production font size/weight literal. Tailwind numeric utilities are literal and explicitly not bound to the B1 spacing/radius/control-sizing variables, because production does not declare them through those variables — no binding is inferred from value equality.

### 3. Exclusions

Zero-importer `ui/*` primitives; reference-route-only primitives (alert, checkbox, switch, drawer); assistant-surface-only primitives; behavioural overlays/navigation (dialog, sheet, popover, tooltip, dropdown-menu, tabs) deferred to B6; composite surfaces and shells deferred to B6/B7/B8; `carrier-mark.tsx` (runtime-computed hue, no finite variant set); zero-importer assistants. Each exclusion is printed with its reason in `b4-verify`.

### 4. Limitations recorded verbatim

`color-mix()` badge tints; `oklch()` -> sRGB; Tailwind numeric utilities literal; hover/group-hover/focus-visible/active/transition are not Figma variants; CountUp and FadeRise motion; `card-brackets`, `edge-sheen`, `glass`, `DiagonalWeave`; responsive `md:`/`xl:` rules deferred to composition; `logo.tsx` free numeric `size`; `carrier-mark.tsx` hash-derived hue; Button `shadow`/`shadow-sm` are Tailwind defaults, not production `--shadow-*`; three `<Button>` call sites with computed variant/size expressions. Deviation recorded, not worked around: Figma requires component nodes to belong to a page, so the 14 objects live on the existing B0 page `01 Components`; the other six pages remain empty and no page is created, renamed or reordered.

### 5. Idempotency

Exact-name matching for sets, standalone components and variants. Existing objects reused and rebuilt in place. Duplicate name = STOP. Component/set type mismatch = STOP. Nothing unrelated is ever deleted.

### 6. Execution status — OPEN

Offline dry-run only: `RESULT: B4 PASSED` on both runs, all 25 structural checks PASS, strict "created" line count in run 2 = 0, ids identical between runs, 14 objects / 52 variants, B1 200, B2 19 and B3 79 unchanged. Its ids are mock ids and are never presented as Figma ids. Real evidence requires the user running the plugin in Figma Desktop twice with identical component, set and variant ids.

### 7. Changed files

Created `tools/figma-plugin/extract-b4.mjs` and generated `tokens-b4.js`. Modified `plugin.js` (B4 create/verify + entry), `ui.html` (two buttons), `build.mjs` (concatenates `tokens-b4.js`), `README.md`, `.lovable/manual-work-map.md`. `code.js` regenerated only via `node build.mjs`, never hand-edited. No `src/` change. Rollback: revert the plugin-layer files and this block.

## Phase 52 / Batch B5 — Component variants & states (2026-09-21)

Scope: plugin layer only. No `src/` diff (`git diff --stat -- src/` empty); B0 pages unchanged;
B1 (9 collections / 200 variables), B2 (`ABox/Typography`, 19 variables) and B3 (72 colour + 2
text + 5 effect styles) asserted untouched; proof file untouched; no publishing; no B6 work.

Created `tools/figma-plugin/extract-b5.mjs` and generated `tokens-b5.js`. Modified `plugin.js`
(B5 create/verify + entry; plus `b4MatchVariant`, so B4 stays idempotent once B5 has widened the
KpiCard variant names — a re-run of B4 after B5 creates zero objects and still reports
`RESULT: B4 PASSED`), `ui.html` (two buttons), `build.mjs` (concatenates `tokens-b5.js`),
`README.md`, this file. `code.js` regenerated only via `node build.mjs`, never hand-edited.
Rollback: revert the plugin-layer files and this block.

Offline dry-run only: `RESULT: B5 PASSED` on both runs, all 25 structural checks PASS, strict
"created" count in run 2 = 0, ids identical between runs, 4 new negative KpiCard Variant
ComponentNodes in run 1, 19 properties bound, 1 exposed instance, 0 INSTANCE_SWAP, 0 SLOT. Those
ids are mock ids and are never presented as Figma ids. Real evidence requires the user running
the plugin in Figma Desktop twice with identical ids.

Recorded deviation, not silently corrected: B4 bound the positive KpiCard delta chip to the
per-tone status style (`ABox/Status/primary | sage | warning`), while `kpi-card.tsx:78` declares
`text-sage` for every positive delta regardless of tone. B5 does not rewrite existing B4
bindings; the deviation is printed as a limitation and left for a B4 amendment decision.

Human decision required: whether to amend B4 so the 10 deferred properties gain real target
layers (icon tiles, delta-label text, actions wrapper, EmptyState action region), and whether to
correct the positive delta-chip binding above.

## Phase 53 / Batch B6 — patterns & interactions (plugin layer)

Implemented in `tools/figma-plugin/` only; `git diff --stat -- src/` is empty and the build is OK.
`extract-b6.mjs` → `tokens-b6.js`; `plugin.js` gained the B6 section, `b6-run` / `b6-verify`
handlers, and the two page-scope amendments that let `verifyB4` / `verifyB5` ignore the
`ABox/Pattern/*` objects on `02 Patterns`. `code.js` regenerated only via `node build.mjs`.

Created: 3 patterns / 4 ComponentNodes — `ABox/Pattern/KpiRow` (set, `columns = 3 | 4`),
`ABox/Pattern/ModuleTabBar`, `ABox/Pattern/WizardStepper` — all on `02 Patterns`, composed from
live B4/B5 instances. 0 prototype connections, 9 deferred candidates, 3 rejected, 7 limitations.

Offline dry run only: B6 PASSED on both runs, 0 objects created on run 2, identical ids; B5 and
B4 still PASS afterwards. Those ids are mock ids and are never presented as Figma ids.

Human action required: run **Create patterns** → **Verify patterns** → **Create patterns** in
Figma Desktop and return both outputs with the real Figma ids.

Human decision still open (carried from B5): whether to amend B4 for the 10 deferred properties
and the positive delta-chip binding. B6 preserved both as-is.

## B6 revised precision (plugin layer)

- KpiRow: 1 Component Set, 2 variant nodes (`columns=3`, `columns=4`), created only via
  `combineAsVariants`; live sets are resolved and verified, never rebuilt.
- ModuleTabBar / WizardStepper: wrapped auto-layout, gap 6 on both axes, hug on both axes.
- ModuleTabBar bottom border: individual stroke weight 1 bound to the live B3
  `ABox/Semantic/hairline` style, `strokesIncludedInLayout=false`, no extra child node.
- WizardStepper: complete 8-step production list, state configuration copied from
  `/agency/downlines/new/contacts`; `upcoming` is unreachable in production and not created.
- Offline dry run only — real Figma ids still require two runs in Figma Desktop.

## Phase 54 / Batch B7 — shells (plugin layer)

Implemented in `tools/figma-plugin/` only; no `src/` files were edited. `extract-b7.mjs` generates
`tokens-b7.js`; `plugin.js` gained B7 create/verify handlers; `ui.html`, `build.mjs`, `README.md`
and generated `code.js` were updated. Rollback: revert those plugin-layer files and delete this
block.

Approved inventory: 3 shell assets on `03 Shells` only — standalone `ABox/Shell/Internal`, Component
Set `ABox/Shell/Marketplace` with exactly `variant=flow|landing`, and standalone
`ABox/Shell/Member`. Physical B7 ComponentNodes total: 4. No B1-B6 object is recreated, renamed,
deleted or mutated; nested mark usage resolves live `ABox/Brand/AboxMark` instances.

Shell API representation is explicit: Internal `pageTitle`, `eyebrow` and `entity` are TEXT
properties bound through `componentPropertyReferences`; Internal `actions` is a structural region
unless faithful SLOT support exists. Marketplace `showAssistant` is a BOOLEAN visibility binding.
Marketplace `showProducts` binds only to the `variant=flow` product-switcher region; `variant=landing`
has no product-switcher target and no synthetic hidden placeholder. Member `children` is a structural
content region only.

Offline/static validation only in this environment; real Figma ids still require two runs in Figma
Desktop with identical ids and zero creation count on run 2. No publishing performed.

## Phase 55 / Batch B8 — experiences (plugin layer)

Implemented in `tools/figma-plugin/` only; no `src/` files were edited. `extract-b8.mjs` generates
`tokens-b8.js`; `plugin.js` gained B8 create/verify handlers; `ui.html`, `build.mjs`, `README.md`
and generated `code.js` were updated. Rollback: revert those plugin-layer files and delete this
block.

Approved inventory: five top-level editable FRAME reference compositions on `04 Experiences` only —
`ABox/Experience/Internal/DownlineAgencyCreation`,
`ABox/Experience/Internal/MarketplaceActivationGovernance`,
`ABox/Experience/Marketplace/PlanAIShoppingPath`,
`ABox/Experience/Marketplace/EnrollmentReviewAndSubmission`, and
`ABox/Experience/Member/ContinuationWorkspace`.

B8 consumes existing B7 shells, B6 patterns and B4/B5 components by live instance reference. It
creates no new foundations, styles, variables, components, component sets, patterns, component
properties, responsive variants, prototype links, screenshots, HTML embeds or flattened substitutes.
Where B7 shell slots cannot receive arbitrary route content, representative route content is placed as
sibling editable regions and recorded with source metadata.

Offline/static validation only in this environment; real Figma ids still require Create experiences →
Verify experiences → Create experiences in Figma Desktop with identical ids and zero creation count on
run 2. No publishing performed.


---

## Phase 56 / Batch B9 — Complete screens / bulk application import (reference-layer implementation)

B9 is implemented only in the Figma/plugin reference layer. It does not change `src/**`, backend data, migrations, runtime behavior, publishing, or ownership boundaries. The single user-facing action is **Create All Screens**; there is no manual per-screen import and no permanent Lovable-to-Figma sync.

### Source-backed inventory rule

The B9 extractor derives the screen list from production route declarations, `SCREENS`, the governed M06 registry, the governed M08 registry, shell/component/pattern sources, and B1-B8 generated token outputs. Redirect-only routes, layout-only route gates, internal design-reference routes, and shared host routes replaced by governed screen registries are excluded rather than represented as invented screens. Dynamic route parameters stay source metadata and are not expanded into fake records.

### Native Figma output

B9 creates editable top-level FRAME nodes on `05 Screens` only. It reuses existing B1 variables, B2 typography, B3 styles, B4/B5 components, B6 patterns, B7 shells, and B8 references where applicable. It creates no variables, styles, components, component sets, patterns, component properties, screenshots, HTML embeds, flattened imports, or objects on protected B0-B8 pages.

### Interaction/prototype boundary

Every source-backed interaction is classified as:

1. directly representable as a native Figma prototype reaction;
2. represented through existing B4/B5 component state or variant behavior;
3. runtime/business-logic dependent metadata only, unless a source-backed visual target exists;
4. unsupported or ambiguous metadata only.

Category-A reactions are created only when source and target resolve to generated B9 screen/state frames. Signatures include prototype source identity, target identity, trigger, action, transition/animation mapping and state target where applicable. Conflicting live reactions stop the run and are not overwritten.

### Runtime boundary

B9 recreates the application's design and prototype representation. It does not execute React, JavaScript, backend APIs, database operations, authentication logic, pricing engines, subsidy calculations, validation side effects, uploads, or other runtime business logic inside Figma. Runtime-only behavior is reported as limitation metadata rather than simulated.

### Verification

Offline checks can verify extractor determinism, generated token structure and plugin syntax, but they are not native write/read evidence. Real proof requires Figma Desktop execution: **Create All Screens**, **Verify All Screens**, repeat **Create All Screens**, repeat verification, confirm zero duplicate frames and zero duplicate reactions on the second run, then open representative Internal, Marketplace and Member flows in Presentation/Prototype mode and verify mapped navigation/state behavior and runtime-only limitation reporting.


---

## Phase 57 / Batch B10 — Documentation / final reference layer (reference-layer implementation)

B10 is implemented only in the Figma/plugin reference layer. It does not change `src/**`, backend data, migrations, runtime behavior, publishing, or ownership boundaries. It populates only `06 Documentation` and does not touch `ABox Proof — Scratch`.

### Approved documentation inventory

B10 creates exactly 10 top-level editable FRAME documentation assets:

1. `ABox/Documentation/00 Library Overview`
2. `ABox/Documentation/01 Foundations Tokens Typography Styles`
3. `ABox/Documentation/02 Components States Properties`
4. `ABox/Documentation/03 Patterns Shells`
5. `ABox/Documentation/04 Experiences`
6. `ABox/Documentation/05 Screens Route Inventory`
7. `ABox/Documentation/06 Prototype Interaction Mapping`
8. `ABox/Documentation/07 Governance Source Of Truth`
9. `ABox/Documentation/08 Import Reimport Workflow`
10. `ABox/Documentation/09 Limitations Evidence Register`

### Source-backed documentation rule

The B10 extractor reads B1-B9 generated token outputs and the existing plugin/reference documentation. It documents only the established architecture: seven B0 pages, B1 foundations, B2 typography, B3 styles, B4/B5 components and states, B6 patterns, B7 shells, B8 experiences, and B9 screen/prototype mappings. It does not create new foundation assets, component variants, patterns, shells, experiences or screens.

### Native Figma output

B10 outputs native editable Figma FRAME and TEXT nodes on `06 Documentation`. It stores source references, deterministic signatures and reference metadata in plugin data. Reference chips resolve to existing B1-B9 assets where Figma exposes an id; source-file and batch references remain metadata. No screenshots, HTML embeds, flattened imports or external image substitutes are used.

### Evidence and limitations

B10 preserves the evidence distinction used by prior batches: offline extractor/build/syntax checks are not native Figma proof. Real proof requires Figma Desktop execution of **Create documentation**, **Verify documentation**, a second **Create documentation**, and a second verification with identical ids and zero new B10 frames on run 2. Until then, report `REAL FIGMA NOT VERIFIED`.

### Re-import and ownership boundary

Re-import is explicit and user-triggered through the plugin. There is no permanent Lovable-to-Figma sync. Production source remains the authority for runtime behavior, routing, data, auth, pricing, subsidy, uploads and governed business logic; the Figma file remains a standalone documentation and prototype reference artifact.

---

## Phase 59 — Current application fidelity import (additive plugin layer)

Phase 59 adds only `07 Current App`. It derives 179 fidelity artifacts from current route,
governed-screen and B9 identities, grouped deterministically by product/module. Every artifact
is native editable Figma structure; screenshots, HTML, rasterized screens and detached copies
of approved components are forbidden.

Existing B1–B3 bindings and B4–B7 instances are reused by live ID. Structures without an
approved foundation remain route-local editable composition and do not become components.
The 682 deterministic source-backed B9 interactions are remapped within this additive layer;
runtime and ambiguous behavior remains metadata. B0–B10 names, IDs, counts and signatures are
protected and reverified. Re-import is explicit, signature-guarded and must create zero objects
on its second unchanged run. Real-Figma evidence is pending.
