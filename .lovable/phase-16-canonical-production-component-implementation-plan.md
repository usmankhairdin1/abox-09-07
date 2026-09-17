# Phase 16 — Canonical Production Component Implementation Plan

STATUS: PLAN ONLY. Nothing in this document has been implemented. No production component was created, edited, renamed, moved or deleted. No consumer was migrated. No import, route, style, token, branding value or marketplace behaviour was changed. The running application is unchanged.

---

## 1. Scope, preservation contract and status vocabulary

### 1.1 Preservation contract

The current application is the source of truth. A future migration is permitted only if it produces output that is pixel-identical and behaviourally identical: no visual, spacing, typography, colour, border, radius, shadow, icon, control-size, responsive, route, navigation, content, interaction, accessibility, animation, business-logic, data-flow, branding or asset difference. "Visually close" is not acceptance. Where exact parity cannot be guaranteed in advance, the item is recorded as BLOCKED rather than changed.

No cleanup, normalisation, redesign or opportunistic refactoring is authorised by this document.

### 1.2 Status vocabulary

| Status | Meaning |
| --- | --- |
| READY FOR FUTURE MIGRATION | Evidence is complete; migration may be scheduled after approval |
| REQUIRES VISUAL BASELINE | Screenshot baselines must exist before migration is scheduled |
| REQUIRES BEHAVIOR BASELINE | Interaction/keyboard/state behaviour must be recorded first |
| REQUIRES API ADAPTER | Call site shape differs from the canonical API; an adapter must be documented |
| EXPERIENCE-SPECIFIC | Belongs to one experience; shared ownership is not assumed |
| ROUTE-LOCAL | Owned by a route-local kit; not migrated automatically |
| RUNTIME-OWNED | Owned by runtime configuration (branding, marketplace assets) |
| BLOCKED | Parity cannot currently be guaranteed |
| DO NOT MIGRATE | Deliberately excluded |
| FUTURE DECISION | Open question, no answer guessed |
| MIGRATION PREREQUISITE | Must be resolved elsewhere before this work can proceed |

---

## 2. Re-measured production inventory

Measured against the current codebase. The reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`) is excluded from every count. Counts are importing production files.

### 2.1 ABox modules

| Module | Importing production files |
| --- | --- |
| InternalShell | 89 |
| StatusBadge | 87 |
| ACTION_PILL | 34 files / 99 references |
| MarketplaceShell | 30 |
| PageHeader | 23 |
| DataTable | 19 |
| KpiCard | 16 |
| EmptyState | 8 |
| MemberShell | 4 |
| PlanCard | 4 |
| ModuleTabs | 2 |
| MetalBadge | 2 |
| CarrierMark | 1 |

### 2.2 UI primitives

| Primitive | Importing production files |
| --- | --- |
| button | 20 |
| card | 6 |
| input | 5 |
| select | 5 |
| tooltip | 4 |
| dialog | 3 |
| sheet | 3 |
| dropdown-menu | 3 |
| label | 3 |
| skeleton | 2 |
| textarea | 2 |
| tabs | 1 |
| badge | 1 |
| table | 0 |
| pagination | 0 |
| alert | 0 |
| form | 0 |

49 primitives exist in `src/components/ui`; the ones absent from the table above have no production consumer.

### 2.3 Other production areas

- Shells: three independent implementations — `internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx`. No shared base.
- Cards / surfaces: `ui/card` (6 consumers) plus literal `rounded-2xl border border-hairline bg-card` surfaces written per screen, with p-5 and p-6 both in use.
- Forms: `ui/input`, `ui/label`, `ui/select`, `ui/textarea`, plus independent field compositions inside the M06 and M08 kits. `ui/form.tsx` has no production consumer.
- Tables: `DataTable` (19), route-local tables, and `ui/table` with zero consumers.
- Loading: `ui/skeleton` in 2 files; error presentation written per route.
- Icon plates: rounded icon tiles written inline in headers, cards and empty states; no owning component.
- Route-local kits: `components/m06/*`, `components/m06/screens/common.tsx`, `components/m08/*`, `components/lucie/ui.tsx`, `components/lucie-app/*`, `components/ai-elements/*`, `components/icons/tooth-icon.tsx`.

### 2.4 Action pill reference detail

Variant usage across the 34 consuming files (99 references, including the source file's own definitions):

| Variant | References |
| --- | --- |
| primaryMd | 19 |
| outlineXs | 10 |
| primaryLg | 9 |
| outlineLg | 7 |
| outlineSmCard | 6 |
| outlineSm | 6 |
| outlineMd | 4 |
| primaryXs | 3 |

Element usage at call sites: 52 `<button>` elements and 22 `<Link>` elements. Every measured call site applies the class string directly as `className={ACTION_PILL.<variant>}`. There are zero `cn(ACTION_PILL.…, …)` compositions and zero appended class strings.

---

## 3. First implementation family — selection evidence

No numeric scoring is used and no candidate is described as best. The evidence below is factual.

### 3.1 Proposed first family: the action pill

| Criterion | Evidence |
| --- | --- |
| Existing shared source | `src/components/abox/action-pill.ts` already owns the class strings for all consumers |
| Clear ownership | One file, one export, no competing copy of these strings in production |
| Stable API | Eight frozen variant keys; the shape has not changed since centralisation |
| Limited foundation dependencies | `bg-primary`, `text-primary-foreground`, `border-border`, `bg-card`, `hover:bg-accent`, `rounded-full`, fixed heights h-8/h-9/h-10/h-11, `text-xs`/`text-sm`, `font-medium` — all defined in `src/styles.css` |
| Limited behavioural variation | The strings carry no state, no data flow, no responsive branching, no animation beyond hover colour |
| Clear consumer boundary | 34 files, enumerated in section 8 |
| Measurable consumers | 99 references, variant distribution measured in 2.4 |
| Low migration ambiguity | Every call site is `className={ACTION_PILL.<variant>}` with no composition |
| Exact parity feasibility | A component that emits the identical class string on the identical element produces byte-identical markup |

### 3.2 Alternatives, recorded factually — FUTURE DECISION

- **StatusBadge (87), KpiCard (16), EmptyState (8), PlanCard (4), MetalBadge (2)** — already single-source components. No new canonical source is needed to give them one owner; promoting them is a naming/placement question, not an implementation need.
- **DataTable (19)** — coexists with route-local tables and an unused `ui/table`; cell padding, minimum width and empty-row handling differ. Structural variation is unresolved.
- **PageHeader (23)** — three page-opening structures exist (ABox PageHeader, Lucie PageHead, shell masthead). Convergence is an open decision.
- **Button (20)** — overlaps the pill treatments and depends on the unresolved 36px vs 40px control-height decision recorded in Phase 13.

The decision on which family is implemented first remains with management (section 22). This document presents the action pill as the proposal supported by the existing architecture; it does not declare a winner among the alternatives.

---

## 4. Implementation boundary for the proposed family

| Aspect | Definition |
| --- | --- |
| Future source file | `src/components/abox/action-pill.tsx` (new file alongside the existing `.ts`, which is not modified) |
| Future export | `ActionPill` component; `ACTION_PILL` and `ActionPillVariant` continue to be re-exported unchanged from the existing `.ts` module |
| Current source file | `src/components/abox/action-pill.ts` |
| Current implementation status | CURRENT SHARED — active, imported by 34 production files |
| Direct consumers | 34 files, enumerated in section 8 |
| Indirect consumers | Screens rendered inside `InternalShell` (89) and `MarketplaceShell` (30) that contain those call sites; the shells themselves do not import the pill |
| Dependencies | `src/styles.css` colour/radius tokens; `cn` from `src/lib/utils`; `Link` from `@tanstack/react-router` at call sites only |
| Variants | primaryXs, primaryMd, primaryLg, outlineXs, outlineSm, outlineSmCard, outlineMd, outlineLg |
| States | default, hover (`hover:bg-primary/90`, `hover:bg-accent`), focus per browser/base styles, active per browser, disabled only where a call site sets `disabled` on the button |
| Sizes | h-8 (Xs), h-9 (Sm, SmCard), h-10 (Md), h-11 (Lg) — preserved exactly, no universal control height introduced |
| Density | Horizontal padding px-3 / px-4 / px-5 / px-6 and gap-1 / gap-1.5 as currently defined per variant |
| Icon behaviour | Icons are passed as children by call sites; the strings supply only the gap. No icon sizing is owned by the pill |
| Typography | text-xs (Xs), text-sm (all others), font-medium |
| Spacing | As encoded per variant; no change |
| Colours | `--primary`, `--primary-foreground`, `--border`, `--card`, `--accent` |
| Borders / radius | `border border-border` on outline variants; `rounded-full` on all |
| Shadows | None |
| Motion | None beyond the default colour transition supplied by base styles |
| Responsive behaviour | None inside the pill; call sites control wrapping and layout |
| Accessibility | Element semantics belong to the call site (`<button>` / `<Link>`); existing `aria-*`, `title` and `disabled` attributes must pass through unchanged |
| Content behaviour | Children rendered verbatim; no truncation, no casing transformation |
| Experience boundaries | Measured consumers are Dashboard/Admin and Marketplace-Admin routes. Marketing hero pills on `/` use their own inline classes and are not in scope |

Nothing in this table is altered by this document.

---

## 5. Exact API preservation

Derived only from current code. No prop is invented.

### 5.1 Contract

| Prop | Requirement | Derivation |
| --- | --- | --- |
| `variant` | Required. One of the eight existing keys | The only axis consumers select today |
| `children` | Required | Every call site passes label text, often with a leading icon |
| `className` | Optional, appended through `cn` | Not used today, but must exist so the component can never be less capable than the string |
| `asChild` / element choice | Required capability | 52 call sites render `<button>`, 22 render `<Link>`. The component must render either without wrapping extra DOM |
| `type`, `disabled`, `onClick`, other button attributes | Optional passthrough | Present at existing `<button>` call sites |
| `to`, `params`, `search`, other router link props | Optional passthrough | Present at existing `<Link>` call sites |
| `aria-*`, `title`, `id`, `data-*` | Optional passthrough | Present at some call sites |

### 5.2 Defaults

No default variant. No default element. No default size. Introducing any default would risk silently changing a call site and is explicitly excluded.

### 5.3 Adapter note

Because every measured call site uses the bare class string with no composition, no adapter is required for the 34 files. If a future call site composes classes or wraps the pill in a third element type, that call site is classified REQUIRES API ADAPTER and the adapter is documented before migration. No adapter is implemented in this phase.

### 5.4 Non-negotiable output rule

The component must emit exactly `ACTION_PILL[variant]` — imported from the existing module, never re-typed — plus any caller `className`. It must not add a wrapper element, must not reorder classes, and must not add default attributes.

---

## 6. Source-level propagation

```text
FOUNDATION            src/styles.css tokens (--primary, --border, --card, --accent, radius)
   ->
SEMANTIC ROLE         action / secondary action treatment
   ->
CANONICAL COMPONENT   src/components/abox/action-pill.tsx (ActionPill)
   ->
VERIFIED CONSUMER     a migrated route file, verified by regression
   ->
PATTERN               page header action group, toolbar action group, wizard footer actions
   ->
EXPERIENCE            Dashboard/Admin, Marketplace Admin
   ->
SCREEN                the individual route
```

The canonical file becomes the genuine production source after verified migration: it imports the class map rather than duplicating it, so the map keeps a single owner and a change to either the map or the component reaches every verified consumer at build time. This is not a documentation-only abstraction and not a style copy — the wrapper is only acceptable because it becomes the shared source once consumers are migrated.

Unmigrated files continue importing the class map directly. Both paths resolve to the same strings, so the two populations can never diverge visually during a partial migration.

---

## 7. Legacy preservation

| Item | Detail |
| --- | --- |
| Source | `src/components/abox/action-pill.ts` |
| Consumers | 34 production files at the time of writing |
| Migration candidate | Yes — but the file itself is never deleted or edited during migration |
| Migration blocker | None measured |
| Parity requirements | Class strings remain byte-identical; no key renamed, removed or reordered |
| Rollback strategy | Reverting a consumer's import restores the original call site exactly |
| Final status after future migration | Remains the owner of the class strings; the component consumes it. Retirement of the direct-string path is a separate decision, never automatic |

No legacy implementation is retired merely because a canonical component exists. Inline marketing hero pills on `/`, `ui/button` and route-local action treatments all remain untouched and available.

---

## 8. Consumer migration register

All 34 measured consumers. Current density is the variant's own padding/gap; current visual behaviour is the variant's own class string; current interaction behaviour is hover colour change plus the element's native behaviour, unless noted. Proposed canonical mapping is `<ActionPill variant="<same key>">` on the same element. Compatibility concerns are none unless noted, because no call site composes classes.

| # | File | Variants used | Element(s) | Baseline requirement | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | routes/agency.organization-admin.tsx | outlineSmCard ×4, primaryMd | button | Desktop/tablet/mobile + hover/focus | READY FOR FUTURE MIGRATION |
| 2 | routes/agency.organizations.$organizationId.index.tsx | outlineSm ×3, primaryMd | button, Link | Desktop/tablet/mobile + hover/focus | READY FOR FUTURE MIGRATION |
| 3 | routes/agency.organizations.$organizationId.identifiers.tsx | outlineXs ×2, primaryMd | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 4 | routes/agency.organizations.$organizationId.settings.tsx | primaryMd | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 5 | routes/agency.organizations.$organizationId.readiness.tsx | primaryMd, outlineXs | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 6 | routes/agency.organizations.$organizationId.locations.tsx | primaryMd | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 7 | routes/agency.organizations.$organizationId.contacts.tsx | primaryMd | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 8 | routes/agency.organization-structure.tsx | outlineSm ×2, outlineSmCard | button | Desktop/tablet/mobile | REQUIRES VISUAL BASELINE |
| 9 | routes/agency.organization-work.tsx | primaryXs, outlineXs | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 10 | routes/agency.organization-imports.index.tsx | primaryMd, outlineMd | button, Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 11 | routes/agency.organization-imports.$importJobId.tsx | primaryMd | Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 12 | routes/agency.my-organization.tsx | primaryMd | Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 13 | routes/agency.downlines.new.identity.tsx | primaryLg | button | Wizard footer, desktop/mobile, disabled state | REQUIRES BEHAVIOR BASELINE |
| 14 | routes/agency.downlines.new.contacts.tsx | primaryLg, outlineLg | button | Wizard footer, disabled state | REQUIRES BEHAVIOR BASELINE |
| 15 | routes/agency.downlines.new.legal.tsx | primaryLg, outlineLg | button | Wizard footer, disabled state | REQUIRES BEHAVIOR BASELINE |
| 16 | routes/agency.downlines.new.administrator.tsx | primaryLg, outlineLg | button | Wizard footer, disabled state | REQUIRES BEHAVIOR BASELINE |
| 17 | routes/agency.downlines.new.locations.tsx | primaryLg, outlineLg | button | Wizard footer, disabled state | REQUIRES BEHAVIOR BASELINE |
| 18 | routes/agency.downlines.new.settings.tsx | primaryLg, outlineLg | button | Wizard footer, disabled state | REQUIRES BEHAVIOR BASELINE |
| 19 | routes/agency.downlines.new.readiness.tsx | outlineLg | button | Wizard footer, disabled state | REQUIRES BEHAVIOR BASELINE |
| 20 | routes/agency.downlines.new.activate.tsx | primaryMd, primaryLg, outlineMd, outlineLg | button, Link | Wizard completion, all four variants | REQUIRES BEHAVIOR BASELINE |
| 21 | routes/marketplace.admin.index.tsx | primaryMd ×2, outlineSmCard | Link | Desktop/tablet/mobile | READY FOR FUTURE MIGRATION |
| 22 | routes/marketplace.admin.work.tsx | primaryXs, outlineXs | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 23 | routes/marketplace.admin.readiness.tsx | primaryMd | Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 24 | routes/marketplace.admin.content.tsx | primaryMd | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 25 | routes/marketplace.admin.brand.tsx | primaryMd | button | Desktop + states | RUNTIME-OWNED SURFACE — pill may migrate, branding logic untouched |
| 26 | routes/marketplace.admin.assets.tsx | outlineSm | button | Desktop + states | RUNTIME-OWNED SURFACE — pill may migrate, asset logic untouched |
| 27 | routes/marketplace.admin.referral-links.index.tsx | outlineXs ×2, primaryMd | button, Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 28 | routes/marketplace.admin.domains.index.tsx | primaryXs, primaryMd, outlineXs | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 29 | routes/platform.organizations.index.tsx | outlineXs | Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 30 | routes/platform.organizations.$organizationId.override.tsx | primaryLg | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 31 | routes/platform.marketplaces.index.tsx | outlineXs | Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 32 | routes/platform.marketplaces.$marketplaceId.override.tsx | primaryLg | button | Desktop + states | READY FOR FUTURE MIGRATION |
| 33 | routes/app.jet.module1.tsx | outlineMd ×2, primaryMd | Link | Desktop + states | READY FOR FUTURE MIGRATION |
| 34 | src/components/abox/action-pill.ts | source of the map | n/a | n/a | DO NOT MIGRATE — remains the class owner |

### 8.1 Explicitly excluded consumers

| Area | Reason | Status |
| --- | --- | --- |
| Landing hero pills in `src/routes/index.tsx` | Inline marketing classes, not the shared map; height treatment is a marketing decision | DO NOT MIGRATE |
| `ui/button` consumers (20 files) | Different component family; depends on the unresolved control-height decision | DO NOT MIGRATE in this family |
| M06, M06 screen-common, M08, Lucie, Lucie-app, ai-elements, icon helpers | Route-local ownership | ROUTE-LOCAL |
| Branding configuration and marketplace asset behaviour | Runtime-owned | RUNTIME-OWNED |

Nothing above has been migrated.

---

## 9. Experience preservation

| Experience | Relationship to the proposed component |
| --- | --- |
| Web / Marketing | Not a consumer. Hero pills stay experience-specific |
| Shopping / Commerce | Not a measured consumer of the shared map |
| Dashboard / Admin | Primary consumer (agency and platform routes) |
| Member / Account | Not a measured consumer |
| Marketplace Admin | Consumer, with runtime-owned surfaces preserved |

The component is therefore shared across selected experiences only. Convergence is not forced and no experience is asked to adopt it.

---

## 10. Foundation safety

No foundation is modified in this phase. The dependencies are the existing production sources: `src/styles.css` colour/radius tokens, existing utility classes, existing typography classes, existing spacing utilities, existing radius scale, no shadow, no icon sizing ownership, no motion definitions.

| Dependency | Status |
| --- | --- |
| `--primary`, `--primary-foreground`, `--border`, `--card`, `--accent` | Centralised in `src/styles.css` — safe |
| `rounded-full` | Centralised — safe |
| Heights h-8 / h-9 / h-10 / h-11 | Not centralised; the 36px vs 40px control-height question is open | MIGRATION PREREQUISITE (documented, not solved) |
| Relationship between pill treatments and `ui/button` variants | Unresolved overlap recorded in Phase 13/14 | MIGRATION PREREQUISITE (documented, not solved) |
| `text-xs` / `text-sm` / `font-medium` | Literal utilities, not named roles | MIGRATION PREREQUISITE for any future typography role work only; it does not block byte-identical migration |

Neither prerequisite is solved here. Because the component reuses the exact strings, migration parity does not depend on resolving them; they block only future changes to the values.

---

## 11. Baseline requirements

Baselines are mandatory before any consumer migration and must be captured from the unmodified application.

**Viewports:** desktop 1440×900, tablet 834×1112, mobile 390×844.

**Per viewport:** full route screenshot for each consumer scheduled in the current step, plus an element screenshot of each pill instance.

**Interaction states to capture per variant:** default, hover, focus, focus-visible, active, disabled (where a call site sets it), selected (where applicable), loading (where a call site shows one), error, success, open/closed (where the pill toggles an overlay).

**Recorded metadata per capture:** route, viewport, dpr, browser/runtime conditions, authentication state, component variant, size, density, content state (label length, icon present or absent), and timestamp.

Baselines are stored outside the application source and are never committed into production folders.

---

## 12. Post-migration regression

After each migrated consumer, compare against its baseline:

screenshot output, rendered element dimensions, spacing, typography, colours, borders, radius, shadows, icons, animations, responsive behaviour at all three viewports, interaction behaviour, keyboard behaviour and tab order, focus ring appearance, accessibility tree and attributes, content, routes, navigation, business logic, network/data behaviour where relevant, and console output.

Additionally compare the rendered `class` attribute string and the emitted DOM element type for every migrated pill; both must be identical.

Any unexplained difference means: STOP. DO NOT ACCEPT. ROLL BACK. "Visually close" is not acceptance.

---

## 13. Rollback

Rollback is reversion of the single migration step, not visual repair.

1. Restore the consumer file's original import of `ACTION_PILL`.
2. Restore the original `className={ACTION_PILL.<variant>}` call sites and original element markup.
3. Leave the canonical component file in place, unreferenced, or remove it if it was created in the same step.
4. Re-run typecheck, build and the route's baseline comparison to confirm the original output is restored.
5. Record the failure and its cause in the migration register; reclassify the consumer as BLOCKED.

No manual visual repair is permitted as a substitute.

---

## 14. One-family-at-a-time sequence

1. Create one canonical component family (`ActionPill`), importing the existing class map.
2. Verify its source and API against section 5.
3. Build exact baselines per section 11 for the first target consumer.
4. Validate the new component in isolation (typecheck, build, class-string equality check) with zero consumers migrated.
5. Migrate one controlled consumer — proposed first target: `routes/marketplace.admin.readiness.tsx` (single `primaryMd` Link, smallest surface).
6. Run the full regression of section 12.
7. Continue only after parity is proven.
8. Migrate the next verified consumer, one at a time, grouped by variant so each variant's parity is proven once before repetition.
9. Update the dependency and consumer record after each step.
10. Only after all intended consumers pass, evaluate legacy retirement as a separate, separately approved decision.

Bulk search-and-replace across the application is forbidden.

---

## 15. Validation plan for the future implementation

Run before accepting each migration: TypeScript, ESLint, production build, route rendering for every affected route, desktop/tablet/mobile rendering, accessibility checks, keyboard traversal, focus behaviour, interaction checks, console output (zero new messages), screenshots, baseline regression comparison, import-graph check confirming the component resolves to the existing class map, and duplicate/unused source detection confirming no second copy of the strings appeared.

---

## 16. Branding and marketplace safety

Branding & white-label remains runtime-owned (`/app/jet/branding`, `/marketplace/admin/brand`, `logo.tsx`, `public/favicon.ico`). Marketplace assets remain runtime-owned (`/marketplace/admin/assets`, `marketplace-store.ts`). Neither is absorbed into canonical component ownership. Branding configuration, logo/mark/favicon behaviour, and asset upload/scan/validate/preview/retire behaviour are unchanged. Where a pill happens to sit on one of those screens, only the pill's own markup is in scope.

---

## 17. Route-local safety

M06, M06 screen-common, M08, Lucie, Lucie-app, ai-elements and local icon helpers are classified ROUTE-LOCAL. None is migrated automatically. Each would require its own evidence, its own baselines and its own parity verification before any future consideration. None is changed here.

---

## 18. Future dependency graph

```text
src/styles.css tokens
   -> semantic role: action treatment
      -> src/components/abox/action-pill.ts  (class map, single owner)
         -> src/components/abox/action-pill.tsx  (ActionPill)
            -> verified consumer route file
               -> compound: action group / wizard footer
                  -> pattern: page header actions, toolbar, wizard navigation
                     -> experience: Dashboard/Admin, Marketplace Admin
                        -> screen
```

**Allowed:** downward dependencies only — component imports the map and `cn`; consumers import the component.

**Forbidden:** the component importing a route, a store, a shell, a route-local kit, branding state, marketplace state, or anything under `src/lib/design/**`. Consumers must not re-declare the class strings.

**Circular-dependency prevention:** the component's import set is limited to the class map, `cn` and React. It never imports a consumer or a shell.

**Ownership:** class strings owned by `action-pill.ts`; component contract owned by `action-pill.tsx`; element semantics owned by the consumer.

**Source of truth:** production code, not the reference layer and not Figma.

---

## 19. Change-impact examples

**If `ActionPill` changes** (for example, a new state class is added):
- Changes: every verified, migrated consumer.
- Does not change: unmigrated consumers still importing the map directly.
- Patterns possibly affected: page header action groups, admin toolbars, wizard footers.
- Experiences possibly affected: Dashboard/Admin, Marketplace Admin.
- Screens possibly affected: the migrated subset of the 33 route files.
- Regression to run: full section 12 comparison for every migrated route at all three viewports.

**If `ACTION_PILL` class strings change:**
- Changes: all 34 consumers at once, migrated or not. This is the reason the map keeps a single owner and the reason no value change is authorised here.

**What must not change under any circumstance:** marketing hero pills, `ui/button` output, shells, navigation, branding, marketplace assets, route-local kits, and any unmigrated consumer.

---

## 20. Future file map

| Path | Purpose | Exports | Dependencies | Current source evidence | Consumers | Creation condition | Migration condition | Retirement condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/abox/action-pill.tsx` | Canonical action pill component | `ActionPill`, `ActionPillProps` | `action-pill.ts`, `cn`, React | 34 files apply the map's strings directly | initially zero, then verified consumers only | Approval of section 22 gates | Per-consumer, after baselines and regression | Not applicable — this is the future canonical source |
| `src/components/abox/action-pill.ts` | Class-string owner | `ACTION_PILL`, `ActionPillVariant` | none | Exists today | component plus unmigrated consumers | Already exists | Not modified | Only after a separate approved decision, never automatic |

No other file is proposed. Neither file is created in this phase.

---

## 21. Future Figma relationship

| Aspect | Mapping |
| --- | --- |
| Figma component name | Action Pill |
| Component set | ABox / Actions |
| Variants | Primary, Outline, Outline on Card |
| States | Default, Hover, Focus, Active, Disabled |
| Sizes | XS (32), SM (36), MD (40), LG (44) — mirroring h-8/h-9/h-10/h-11 |
| Density | Horizontal padding and gap bound per size, matching the production strings |
| Slots | Leading icon (optional), Label (required), Trailing icon (optional) |
| Semantic variables | primary, primary-foreground, border, card, accent, radius-full |
| Experience extensions | Marketing hero treatment documented as an extension, not as a size of this set |
| Accessibility notes | Semantics belong to the implementation element; Figma records label contrast and minimum target size only |

No Figma asset is created. Production remains the source of truth for this migration.

---

## 22. Management approval gates

No production implementation may begin until each item is explicitly approved.

| Gate | Item | Current state |
| --- | --- | --- |
| G1 | Selected first component family (action pill) | AWAITING APPROVAL |
| G2 | Future source file `src/components/abox/action-pill.tsx` | AWAITING APPROVAL |
| G3 | API contract of section 5, including no defaults | AWAITING APPROVAL |
| G4 | Eight variants, states and sizes preserved exactly | AWAITING APPROVAL |
| G5 | Migration list of section 8 | AWAITING APPROVAL |
| G6 | Excluded consumers of section 8.1 | AWAITING APPROVAL |
| G7 | Foundation prerequisites of section 10 remaining unsolved | AWAITING APPROVAL |
| G8 | Baseline requirements of section 11 | AWAITING APPROVAL |
| G9 | Regression contract of section 12 | AWAITING APPROVAL |
| G10 | Rollback procedure of section 13 | AWAITING APPROVAL |
| G11 | First controlled consumer target | AWAITING APPROVAL |

### Open items

| Item | Classification |
| --- | --- |
| Whether the action pill or a different family is implemented first | FUTURE DECISION |
| Relationship between pill treatments and `ui/button` | FUTURE DECISION |
| Whether the marketing hero height becomes a variant | FUTURE DECISION |
| Whether the direct class-string import path is eventually retired | FUTURE DECISION |
| 36px vs 40px default control height | MIGRATION PREREQUISITE |
| Any consumer that cannot produce a byte-identical class attribute | BLOCKED |

---

## 23. Final validation of this plan-only phase

- Exactly one new file created: `.lovable/phase-16-canonical-production-component-implementation-plan.md`
- No production file changed
- No reference file changed
- No import changed
- No route changed
- No style or token changed
- No component implemented
- No consumer migrated
- No legacy code deleted
- No branding changed
- No marketplace behaviour changed
- Application still builds
- Change scope is this single plan file

END PHASE 16 — PLAN ONLY.
