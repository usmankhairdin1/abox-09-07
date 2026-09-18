# Phase 35 — Production Navigation & Page-Level Composition Centralization (PLAN ONLY)

PLAN ONLY. No production file is created, modified, deleted, renamed, migrated, refactored or formatted during planning. No route, navigation behaviour, layout, DOM, CSS, token, component, business rule, branding, asset or responsive behaviour changes. Implementation begins only after separate approval. Exact-preservation contract stays absolute: NOT ONE PIXEL, NOT ONE DOT.

## 1. Fresh inventory methodology

At execution start, a fresh read-only repo-wide sweep of production `src/**` (excluding `src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`). Search terms: `<nav`, `role="navigation"`, `aria-current`, `aria-selected`, `aria-expanded`, `aria-controls`, `<Link`, `useNavigate`, `useRouterState`, `activeProps`, `activeOptions`, `NavLink`, `Tabs`, `TabsList`, `breadcrumb`, `sticky`, `fixed`, `overflow-x-auto`, `justify-between` title rows, `text-eyebrow` section headings, `mb-6`/`mb-8`/`mb-12` page-opening spacing, `PageHeader`, route-local `Header`/`SectionHeader`/`Toolbar`/`FilterBar` helpers, and every shell file.

Every candidate is opened and read in source. Nothing is classified from grep counts. Each candidate is recorded with the full field list in the request: file, line, route, component name, category, native element, exact DOM, exact class string, child order, props/API, link destination, active/selected/disabled state source, hover/focus/pressed behaviour, keyboard and pointer behaviour, ARIA attributes, accessible name, role, keyboard navigation model, responsive/breakpoint behaviour, geometry, spacing, typography, icon usage and size, separators/borders/backgrounds, overflow/scroll, sticky/fixed, state-dependent styles, route/business coupling, shell ownership, existing canonical source, alternate source, eligibility and reason.

## 2. Candidate taxonomy

Exactly one bucket per candidate, no ranking: A existing canonical shared production source; B existing canonical UI/shadcn source; C repeated ordinary production structure with exact semantic/behavioural parity; D shell-specific; E experience-specific; F route-local; G native one-off; H bespoke/business-coupled navigation; I explicit exclusion.

## 3. Existing canonical-source discovery (pre-plan reads, to be re-verified at execution)

Confirmed by reading source in this turn:

- `src/lib/nav-config.ts` — the workspace/navigation data source (`WorkspaceConfig`, `NavSection`, `NavItem`, `MEMBER_NAV`). Navigation destinations and grouping are already configured as data, not inline, for the shells that consume it.
- `src/components/abox/internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx` — three intentional shell families, each rendering its own presentation of nav items.
- `src/components/abox/module-tabs.tsx` — `ModuleTabs({ tabs })`, a rounded-pill tab rail using router `activeProps`/`activeOptions`. Confirmed consumers: `src/components/m06/workforce-page.tsx:46` and `src/components/lucie-app/frames.tsx:21` — both inside excluded systems (M06, Lucie-app).
- `src/components/abox/page-header.tsx` — canonical `PageHeader` with `default` and `compact` variants; ~32 route consumers.
- `src/components/ui/tabs.tsx`, `src/components/ui/breadcrumb.tsx`, `src/components/ui/pagination.tsx`, `src/components/ui/sidebar.tsx` — primitives; actual production consumer counts to be established at execution. Unused primitives are recorded as unused, never treated as canonical.

Source hashes captured now and treated as locked: page-header.tsx `5be9e6ea…`, module-tabs.tsx `3bfae9ac…`, nav-config.ts `26989380…`, internal-shell.tsx `37dbf66f…`, marketplace-shell.tsx `dcdc36a6…`, member-shell.tsx `4a9dd8dd…`, surface.tsx `51b51b31…`, control.tsx `1c6efd5c…`, field.tsx `f35b2364…`.

## 4–6. Ownership maps (produced at execution)

Three deliverable maps: navigation ownership (global / ABox-family shared / shell-specific / experience-specific / route-local, per candidate), shell ownership (which shell owns which destination list, collapse breakpoint, account control, sticky header, mobile behaviour), and page-composition ownership (PageHeader consumers vs route-local opening structures, title/action rows, toolbars, filter rows, section headings, content wrappers).

The three shell families are not merged, normalized or replaced. `PageHeader` stays the single title/header component; no second header component is created under any name.

## 7. Duplicate / fragmentation register

Every concept found in more than one place is listed with the real file list, the concrete difference between implementations, and consumers — no winner, no ranking, no cleanup advice. Early signals to confirm: multiple tab presentations (`ui/tabs.tsx` vs `ModuleTabs` vs route-local pill rows), section-heading compositions repeated inside `quote.tsx`, `marketplace.admin.*`, `agency.organizations.*` and `platform.*`, and title/action rows in `agency.organizations.$organizationId.index.tsx`, `agency.my-organization.tsx`, `marketplace.admin.index.tsx`.

## 8–9. Eligibility decisions and exclusions

A candidate is eligible only when a shared source reproduces the existing output exactly: DOM hierarchy, native semantic element, child order, byte-identical class output, attributes, link/button semantics, routing and `to`/`href` behaviour, active-state calculation, selected state, keyboard and focus behaviour, ARIA semantics, responsive and overflow behaviour, sticky/fixed positioning, spacing, typography, icons, transitions, event handling and business logic. No wrapper is introduced to facilitate centralization. No `Link`→`button`, `button`→`Link`, anchor→`div`, `nav`→`div` or list→container conversion. No Slot/`asChild` polymorphism.

Excluded outright: Branding & White-Label runtime, Marketplace Asset Management runtime, reference/design layers, foundation/token normalization, ActionPill, StatusBadge, KpiCard, PageHeader internals, DataTable, EmptyState, Surface, control.tsx, field.tsx, Lucie, Lucie-app, M06, M08, ai-elements, shell architecture, overlay/drawer/modal navigation, business-workflow navigation, and Phase 32 interactive cards.

## 10–11. Proposed canonical sources

None proposed in advance. A new source is proposed only if the fresh inventory shows at least two eligible consumers sharing the exact DOM, class string and behavioural contract with no existing owner. If proposed, the plan section written at execution states exact path, ownership, API, variants, defaults, native element semantics, and why it is narrower than a universal navigation abstraction. No universal Navigation or PageComposition component will be created.

## 12–13. Proof consumer and batch sequence

If eligible candidates exist: pick the safest repeated family, capture before-evidence for exactly one proof consumer, migrate only that consumer, prove parity, then gate each subsequent consumer independently. Batches are never collapsed. Zero migrations is a valid and complete outcome.

## 14–18. Evidence required per batch

Per batch, before and after: exact DOM tree, byte-identical class strings, attributes, computed styles, geometry (bounding rects for nav region, each item, icon, label, header title/description/action row), overflow, sticky/fixed offsets, zero new console output — at 1440, 834 and 390, plus any additional meaningful breakpoint the implementation defines.

Navigation state matrix per family, only for states that exist: rest, hover, focus-visible, active/current, selected, pressed, disabled, expanded, collapsed, nested, visited, loading, keyboard focus, mobile/tablet/desktop, overflow/scroll, route transition. Page-composition matrix: title only, title + description, title + actions, action group, filter state, loading, empty, error, responsive wrapping, mobile stacking, long title, long supporting text, overflow, optional elements.

Accessibility: landmarks, accessible names, role, `aria-current`/`aria-selected`/`aria-expanded`/`aria-controls`, tab order, keyboard model, focus-visible, disabled semantics, link vs button semantics, no duplicate or conflicting ARIA. Routing: identical destinations, params, search params, guards, auth gates, role checks, active-route calculation, and org/marketplace/plan/scheduling context.

Auth-gated candidates (`/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*` render blank without a session): inspected fully in source, documented as NOT CAPTURED, and left literal. No migration from source similarity alone. Evidence is never manufactured.

## 19. Validation commands

Per batch: `npx tsgo --noEmit`; production build; ESLint on touched files; full lint compared against the pre-existing prettier baseline (pre-existing findings reported separately, unfixed); route render and console verification; DOM, class-string, computed-style and geometry comparison; responsive, accessibility, keyboard, navigation/routing and overflow verification; `git status`/diff review before and after; `md5sum` of any canonical source touched.

## 20. Rollback

Each batch is independently reversible by restoring the consumer's original DOM, class strings, imports and event/route wiring. No canonical source is modified unless justified by two verified consumers; if one is, every existing consumer is re-proved byte-identical. Rollback of any Phase 35 batch leaves Phases 29–34 untouched.

## 21. Governance

Governance notes are written only after implementation, into `.lovable/manual-work-map.md`: canonical owner, legitimate consumers, excluded consumers, future-use rule, duplication-prevention rule, exception-recording rule, rollback point. Branding and Marketplace stay runtime-owned and are not absorbed.

## 22. Risk register

Active-state calculation drift; `activeOptions.exact` semantics differing per consumer; ARIA `aria-current` drift; keyboard/tab-order drift; semantic element substitution pressure; sticky/fixed offset drift; mobile collapse/overflow-scroll drift; shell-boundary erosion; PageHeader duplication pressure; abstraction hiding routing or authorization logic; class reordering mistaken for parity; auth-gated inference; unrelated formatting churn.

## 23. Deferred opportunities (documented, not implemented)

Tab-system fragmentation, section-heading vocabulary, page-opening spacing scale, focus-ring vocabulary, control-height normalization, icon sizing, Figma mapping, Phase 30 batches 2–7 measured-parity backfill, Phase 31/32 outstanding evidence, remaining EmptyState evidence.

## 24. Expected changed files

Unknown until the fresh inventory. Possibly zero. At most: eligible consumer route files, one narrow new source only if justified, and `.lovable/manual-work-map.md` after implementation. `control.tsx`, `field.tsx`, `surface.tsx`, `page-header.tsx` and the three shells must remain unchanged unless a direct defect is proven.

## 25. Success criteria

Fresh inventory complete and source-read; every candidate classified; existing canonical sources identified; no competing source created; every migration backed by measured byte-identical parity; navigation semantics, routing and accessibility unchanged; responsive parity proven at 1440/834/390; shells and completed families untouched; boundaries preserved; zero migrations remains a valid success; final report distinguishes migrated, literal, excluded, NOT CAPTURED, source changes, consumer changes, regressions and unresolved decisions.

## 26. Authorization

PLAN ONLY. No implementation occurs under this document. Nothing in the repository is edited until this plan is reviewed and approved.
