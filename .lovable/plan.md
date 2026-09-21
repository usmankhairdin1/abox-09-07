# PHASE 53 / BATCH B6 — PATTERNS & INTERACTIONS (PLAN ONLY)

Plugin layer only. Nothing under `src/**` changes. B1–B5 are read-only and protected.

## 1. Source audit performed

Read before writing this plan (evidence base for every decision below):

- `src/components/abox/*` — 33 files, including `page-header.tsx`, `module-tabs.tsx`, `data-table.tsx`, `empty-state.tsx`, `kpi-card.tsx`, `surface.tsx`, `downline-wizard-stepper.tsx`, `shopping-path-bar.tsx`, `field.tsx`, `control.tsx`, `notice-page.tsx`, `placeholder-screen.tsx`, the three shells.
- All non-reference routes under `src/routes/**` (design-system/design-guide excluded as reference layers), plus `src/components/m06/workforce-page.tsx` and `src/components/lucie-app/frames.tsx`.
- `src/components/ui/*` consumption counts outside the reference layer.
- `src/styles.css`, `tools/figma-plugin/*` (`tokens-b4.js`, `tokens-b5.js`, `plugin.js`, `build.mjs`).

Measured usage (non-reference files): StatusBadge 91, PageHeader 35, ActionPill 28, DataTable 26, KpiCard 19, EmptyState 12, DownlineWizardStepper 9, PlanCard 7, MetalBadge 6, NoticePage 5, ModuleTabs 3 hosts, LabeledField 3, Surface 3, ShoppingPathBar 3.

Overlay primitive consumption outside the reference layer: dialog 3, sheet 3, dropdown-menu 3, tooltip 4, tabs 1, popover 1, command 1, accordion 0.

Live B4/B5 inventory (from `tokens-b4.js` / `tokens-b5.js`, to be re-resolved live at run time, never from mock ids): 11 Component Sets + 3 Components; `ABox/Nav/ModuleTab` `state = default|active`; `ABox/Nav/WizardStep` `state = current|done|upcoming|unreachable`; `ABox/Card/KpiCard` `tone × deltaSign` = 8.

## 2. Candidate pattern inventory

| Pattern | Production source | Repeated/reusable evidence | Existing B4/B5 components used | Interaction? | Figma representation | Target page | Decision |
|---|---|---|---|---|---|---|---|
| KPI metric row | `app.dashboard.tsx:31`, `app.agency.index.tsx:21`, `app.my-work.tsx:36`, `app.commissions.tsx:71`, `agency.my-organization.tsx:62`, `agency.organization-admin.tsx:75`, `marketplace.admin.index.tsx:89`, `member.index.tsx:34`, `platform.organizations.index.tsx:86`, `platform.marketplaces.index.tsx:56`, `app.partner.tsx:30`, `app.employer.ichra.tsx:30`, `app.agency.statements.tsx:29`, `app.jet.platform.tsx:102`, `app.index.tsx:84` | Rule A — 15 non-reference routes, materially identical `grid gap-4` row of KpiCards; two real column counts (3 and 4) | `ABox/Card/KpiCard` instances | No (static) | Component Set `ABox/Pattern/KpiRow`, axis `columns = 3 \| 4` | `02 Patterns` | CREATE |
| Module tab bar | `src/components/abox/module-tabs.tsx:14-32`; hosts `components/m06/workforce-page.tsx:47`, `components/lucie-app/frames.tsx:21` | Rule B + A — component explicitly owns the multi-tab composition; two hosts | `ABox/Nav/ModuleTab` (`state=active` ×1, `state=default` ×4) | Documented only | Component `ABox/Pattern/ModuleTabBar` | `02 Patterns` | CREATE |
| Downline wizard stepper | `src/components/abox/downline-wizard-stepper.tsx:18-63`; 8 step routes `agency.downlines.new.*` | Rule B + A — fixed 8-step list owned by the component, consumed by 8 routes | `ABox/Nav/WizardStep` (`done` ×2, `current` ×1, `upcoming`/`unreachable` per source rule) | Documented only | Component `ABox/Pattern/WizardStepper` | `02 Patterns` | CREATE |
| Page header + actions region | `page-header.tsx:52` `{actions && …}` | Real, but B4 PageHeader has no actions wrapper layer (B5 deferred `hasActions`/`actions`) | — | — | Would require adding layers to a B4 primitive | — | DEFER — insufficient representation |
| Empty state with action | `empty-state.tsx:25` `{action}`; `app.customers.index.tsx:129` | Real, but B4 EmptyState has no action region (B5 deferred `hasAction`/`action`) | — | — | Would require rebuilding a B4 primitive | — | DEFER — insufficient representation |
| Data table + empty row | `data-table.tsx:50-58` | Real branch, but DataTable was excluded from B4; no table primitive exists | — | — | Would require new primitive architecture | — | DEFER — insufficient representation |
| Table row hover ember | `data-table.tsx:62,77-81` | Real CSS hover | — | Hover | No table primitive to host it | — | DEFER — insufficient representation |
| Shell + header + content | `internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx` | Real and repeated | — | — | Shell composition | `03 Shells` | DEFER — later shell/screen phase (B7) |
| Notice screen | `notice-page.tsx`, 5 routes | Real standalone screen composition | — | — | Screen-level | `05 Screens` | DEFER — later shell/screen phase (B8) |
| Placeholder screen | `placeholder-screen.tsx`, 1 route | Screen-level, single consumer | — | — | Screen-level | — | DEFER — later shell/screen phase (B8) |
| Shopping path bar | `shopping-path-bar.tsx`, 3 consumers | Consumer-flow navigation, no B4 primitive for its steps | — | — | Would need new primitives | — | DEFER — insufficient representation |
| Labelled field group | `field.tsx`, 3 consumers | Each route composes its own ad-hoc field set; no fixed repeated grouping | — | — | — | — | REJECT — not actually reusable |
| Filter / toolbar + results | route-level searches | No repeated structural composition found | — | — | — | — | REJECT — not actually reusable |
| Dialog / sheet / dropdown / tooltip / tabs compositions | `components/ui/*`, 1–4 consumers each | Used, but no B4 overlay primitives exist; composition differs per consumer | — | Open/close | Would require new primitive architecture | — | DEFER — insufficient representation |
| Action-group arrangement | ActionPill appears 103× | Groupings are route-specific; no fixed reusable arrangement | — | — | — | — | REJECT — not actually reusable |
| Card-group (PlanCard) | `plan-card.tsx`, 7 consumers | PlanCard is not a B4 component | — | — | Would require new primitive | — | DEFER — insufficient representation |

CREATE total: 3 pattern assets (1 Component Set with 2 variants, 2 Components) → 4 pattern ComponentNodes on `02 Patterns`.

## 3. Exact representation for each CREATE

### 3a. `ABox/Pattern/KpiRow` — Component Set, axis `columns = 3 | 4`

- Root per variant: FRAME, HORIZONTAL auto-layout, `itemSpacing = 16` (production `gap-4` = 1rem), no fill, no stroke, no effect — the row wrapper in production carries only grid/gap classes, so no foundation value is invented.
- Children: N instances of the live `ABox/Card/KpiCard` main component (`columns=3` → 3, `columns=4` → 4), resolved live by component key/id; never rebuilt.
- Instance property values, source-backed from `app.dashboard.tsx:32-35` (the 4-column canonical row) and `app.agency.statements.tsx:29` (3-column): `tone` per call site (`default`, `primary`, `sage`, `primary`), `deltaSign = positive`, `label`/`value` set to the real call-site literals ("Visits (30d)" / "2,140", "Quotes sent" / "214", "Enrollments" / "92", "Projected earnings" / "$15,200"); `columns=3` uses the first three.
- No new property is added to KpiCard. No KpiCard layer is mutated.
- Variant axis justification: production uses both `md:grid-cols-3` and `md:grid-cols-4` in multiple routes — a real documented structural alternative (rule in §4 of the brief). Responsive breakpoints themselves are not modelled; the axis encodes the two authored column counts only, recorded as such.

### 3b. `ABox/Pattern/ModuleTabBar` — single Component

- Root: FRAME, HORIZONTAL, wrap enabled, `itemSpacing = 6` (`gap-1.5`), bottom padding 12 (`pb-3`), bottom stroke 1 bound to the live `ABox/Semantic/hairline` colour style (`border-b border-hairline`, `module-tabs.tsx:19`). No hard-coded colour.
- Children: 5 instances of live `ABox/Nav/ModuleTab` — child 1 `state=active`, children 2–5 `state=default`; labels from `workforce-page.tsx:18-22` ("Overview", "Roster", "Person", "Onboarding", "Structure") via the existing B5 `label` TEXT property. Five is the minimum count that demonstrates the active/default relationship without importing all twelve route labels.
- Exactly one `state=active` instance, matching `activeProps` in `module-tabs.tsx:24` (router-driven single active tab).

### 3c. `ABox/Pattern/WizardStepper` — single Component

- Root: FRAME, HORIZONTAL, wrap enabled, `itemSpacing = 6` (`gap-1.5`, `downline-wizard-stepper.tsx:36`), no fill/stroke.
- Children: 5 instances of live `ABox/Nav/WizardStep` — `done`, `done`, `current`, `upcoming`, `unreachable` — the exact state set produced by `isCurrent` / `isDone` / `isReachable` at `downline-wizard-stepper.tsx:41-43`. Labels from `DOWNLINE_WIZARD_STEPS` entries 1–5 ("Identity", "Legal & identifiers", "Contacts", "Addresses & offices", "Settings") via the existing B5 `label` TEXT property.
- Five of eight steps: the minimum that demonstrates all four real states. The 8-step full list is recorded as sample-content scope, not a redesign.

## 4. Interaction representation

Interaction candidates and outcomes (§6 of the brief):

| Candidate | Source | Trigger | Result | Representation | Outcome |
|---|---|---|---|---|---|
| Tab active | `module-tabs.tsx:24` `activeProps` | route match | active tab styling | already the existing B4 `ModuleTab state=active` variant, used in the pattern | Represented by existing variant — no new state, no prototype |
| Tab hover | `module-tabs.tsx:26` `hover:bg-accent` | pointer hover | accent background | no B4 hover variant exists; creating one would add a state axis to a B4 set | DEFER — documented limitation |
| Wizard step current/done/upcoming/unreachable | `downline-wizard-stepper.tsx:41-57` | route position | step styling | existing B4 `WizardStep state` variants, used in the pattern | Represented by existing variants |
| Wizard step navigation | `Link to=` per step | click | route change | destination screens do not exist (B8) | No prototype connection — a prototype here would imply navigation not representable |
| Table row hover ember | `data-table.tsx:77-81` | hover | 2px primary left bar scales in | no table primitive | DEFER — documented limitation |
| Control focus ring | `control.tsx:36` `focus:ring-2` | focus-visible | ring | no focus variant on B4 Control; CSS pseudo-class, not a design-system state | DEFER — documented limitation |
| Dialog / sheet / dropdown / tooltip open-close | `components/ui/*` | trigger | overlay open | no B4 overlay primitives | DEFER — documented limitation |

**B6 creates 0 Figma prototype connections and 0 new state axes.** Every interaction that B6 represents is represented through an already-existing B4 variant consumed by a pattern instance. `b6-verify` fails if any prototype reaction exists on a B6 node.

## 5. Protection rules (B1–B5)

- No B1 variable, B2 variable, or B3 style is created, renamed, deleted, or rebound.
- No B4/B5 component, set, variant node, property, property id, binding, or exposed instance is created, renamed, moved, reordered, or mutated.
- B6 uses `figma.createInstance()` / `mainComponent` against live-resolved B4/B5 main components only; no primitive is duplicated or rebuilt inside a pattern.
- Existing placement on `01 Components` is untouched; the only permitted side effect is Figma's automatic instance→main-component relationship.
- Pages `00 Foundations`, `01 Components`, `03 Shells`, `04 Experiences`, `05 Screens`, `06 Documentation` receive no B6 content. B6 writes only to `02 Patterns`.
- B5's recorded deviation (B4 colours positive KpiCard delta chips per tone while production always uses sage) is preserved as-is: `KpiRow` consumes the live component unchanged, creates no second KpiCard, and the deviation is reprinted verbatim in the B6 report because `KpiRow` displays it.

## 6. Deterministic identity and structural signature

Identity = exact pattern name (`ABox/Pattern/KpiRow`, `ABox/Pattern/ModuleTabBar`, `ABox/Pattern/WizardStepper`) plus, for the set, the variant name `columns=3` / `columns=4`.

Stored signature per created node: pattern name; root node type and layout mode; child count and ordering; each child node type; each nested instance's main-component name and live id; each nested instance's relevant property values (`tone`, `state`, `deltaSign`, `label`, `value`); text sample values; foundation style bindings (hairline stroke on `ModuleTabBar`); interaction metadata (empty); source file/line evidence. Verification compares signatures, never visual equality.

## 7. Idempotency

Run 1: resolve the live `02 Patterns` page; read every existing child; create only the missing approved assets; capture all ids.
Run 2: read the live inventory first; match by name + variant name + structural signature; reuse everything; create zero objects; print identical ids.
If a name matches but the signature differs materially: STOP, print live vs expected structure, overwrite nothing. Nothing is ever deleted. Duplicate name on the page: STOP.

## 8. `b6-verify` — checks

1. `git diff --stat -- src/` empty. 2. B1 = 9 collections / 200 variables. 3. B2 = 1 collection / 19 variables. 4. B3 = 79 styles. 5. B4 architecture unchanged (11 sets + 3 components, 16 original axes). 6. B5 architecture unchanged (56 variant nodes, 59 physical, 19 non-variant properties, 1 exposed instance). 7. Every B4/B5 component id preserved. 8. Every B4/B5 property id preserved. 9. No B4/B5 primitive duplicated (no second component with a B4/B5 name). 10. No new B4/B5 Component Set. 11. All B6 nodes parented to `02 Patterns`; all other pages' child counts unchanged. 12. Each pattern matches its approved inventory row. 13. Every nested instance resolves to the expected live B4/B5 main component id. 14. No hard-coded fill/stroke/effect value on any B6 node (bindings only). 15. No invented pattern state (variant axes limited to `columns` on `KpiRow`). 16. No invented interaction — zero prototype reactions on B6 nodes. 17. No B4/B5 primitive mutated (compare captured pre/post signatures). 18. No shell/screen/experience pattern created. 19. No responsive layout constructs created. 20. Run 2 creates zero objects and reports identical ids. 21. Ids labelled `REAL FIGMA` or `OFFLINE MOCK` explicitly; mock ids never presented as real. 22. KpiRow deviation notice printed verbatim. 23. Exactly 3 pattern assets / 4 pattern ComponentNodes. 24. Deferred/rejected candidates created = 0. 25. Full final inventory table printed.

Final inventory printed by `b6-verify`:

| Pattern | Root id | Root name | Nested component ids | Source evidence | Interaction definition | Page |

Plus the §14 interaction table (pattern id, trigger, source file/line, source behaviour, Figma representation, target node, before state, after state, prototype connection — `none` for all, reuse confirmation, limitation).

Failure line: `RESULT: B6 FAILED — do not proceed to B7.`

## 9. Files

- `tools/figma-plugin/extract-b6.mjs` — new; reads the production sources listed in §1 and emits the pattern definitions with source file/line evidence.
- `tools/figma-plugin/tokens-b6.js` — new, generated; `ABOX_B6` (patterns, nested instance specs, sample content, limitations, counts).
- `tools/figma-plugin/plugin.js` — new B6 section: live-inventory read, `b6Page()`, `b6ResolveMain()`, `b6EnsurePattern()`, `b6Signature()`, `ensureB6Patterns()`, `verifyB6()`, `b6-run` / `b6-verify` entries.
- `tools/figma-plugin/ui.html` — two buttons: "Create patterns", "Verify patterns".
- `tools/figma-plugin/build.mjs` — concatenate `tokens-b6.js`.
- `tools/figma-plugin/README.md` and `.lovable/manual-work-map.md` — B6 sections.
- `code.js` regenerated only via `node build.mjs`; never hand-edited.
- Nothing under `src/**`.

## 10. Out of scope

B7 shells, B8 screens, publishing, application routing/navigation, production code, new primitives, accessibility/state libraries, new foundations, responsive compositions, fabricated interaction states.
