# Phase 55 / Batch B8 — Experiences / Journey Compositions — PLAN ONLY

This is plan-only. No implementation files, app source, production UI, Figma file, variables, styles, components, patterns, shells, routes, branding, navigation, behavior, or publishing changes are made by this plan. The eventual implementation stays in the existing Figma/plugin reference layer and may populate only `04 Experiences`.

## 1. B8 source audit findings

### Shell evidence

- **Internal shell**: `src/components/abox/internal-shell.tsx:30-140` exposes `children`, `workspace`, `entity`, `pageTitle`, `eyebrow`, `actions`, plus local `railCollapsed` state. B7 already represents this as `ABox/Shell/Internal` with page title, eyebrow, and entity text properties (`tools/figma-plugin/tokens-b7.js:42-99`).
- **Marketplace shell**: `src/components/abox/marketplace-shell.tsx:26-190` exposes `variant="flow" | "landing"`, `showAssistant`, `product`, and `showProducts`; flow renders the product switcher and landing does not. B7 already represents this as `ABox/Shell/Marketplace` with `variant=flow|landing`, `showProducts` bound only to the flow product region, and `showAssistant` on launcher regions (`tools/figma-plugin/tokens-b7.js:102-166`).
- **Member shell**: `src/components/abox/member-shell.tsx:19-145` is auth-gated and owns member navigation/content structure. B7 already represents this as `ABox/Shell/Member` with a structural content region only (`tools/figma-plugin/tokens-b7.js:169-193`).

### Existing foundation and pattern evidence

- B6 live patterns are exactly `ABox/Pattern/KpiRow`, `ABox/Pattern/ModuleTabBar`, and `ABox/Pattern/WizardStepper` (`tools/figma-plugin/tokens-b6.js:30-383`).
- `ABox/Pattern/KpiRow` is source-backed by repeated KPI rows, including dashboard, agency, marketplace admin, and member routes (`tools/figma-plugin/tokens-b6.js:32-52`).
- `ABox/Pattern/WizardStepper` is source-backed only by the downline agency wizard and its recorded route state is `/agency/downlines/new/contacts` step 3 of 8 (`tools/figma-plugin/tokens-b6.js:241-381`).
- `ShoppingPathBar`, `PlanCard`, data tables, overlays, and route-local field groups were deliberately deferred or rejected in B6/B4, so B8 may show their source-backed route content as editable native composition, but must not create them as new foundations (`tools/figma-plugin/tokens-b6.js:432-486`).

### Strongest journey evidence by shell family

- **Internal — Downline agency creation**: eight related routes from `/agency/downlines/new/identity` through `/agency/downlines/new/activate`; contacts step consumes `DownlineWizardStepper` at `src/routes/agency.downlines.new.contacts.tsx:43-45`, validates and persists data at `src/routes/agency.downlines.new.contacts.tsx:25-40`, and uses back/continue actions at `src/routes/agency.downlines.new.contacts.tsx:98-110`. Readiness and activation states are source-backed at `src/routes/agency.downlines.new.readiness.tsx:43-89` and `src/routes/agency.downlines.new.activate.tsx:105-154`.
- **Internal — Marketplace activation governance**: admin hub summarizes lifecycle/readiness/participants/issues using `InternalShell`, action slot, KPI cards, quick actions, blockers, history, and participants at `src/routes/marketplace.admin.index.tsx:66-155`; readiness recalculation and canonical owner/next action rows are at `src/routes/marketplace.admin.readiness.tsx:25-61`; initial activation submission and pending approval are at `src/routes/marketplace.admin.activation.tsx:25-73`.
- **Marketplace — PlanAI guided shopping path**: `/select` offers PlanAI guided vs self-serve path choice at `src/routes/select.tsx:31-95`; `/quote` defines a persisted, URL-synced six-step quote wizard and side panel at `src/routes/quote.tsx:378-545`, with the final subsidy result at `src/routes/quote.tsx:1235-1363`; `/plans` turns quote/cart/browse state into ranked, filterable results, PlanAI explanation, compare bar, and cart actions at `src/routes/plans.index.tsx:47-190` and `src/routes/plans.index.tsx:276-369`.
- **Marketplace — enrollment review and submission**: `/cart` groups selected products and routes to review at `src/routes/cart.tsx:36-199`; `/review` checks quote, cart, and account readiness and routes to handoff or off-exchange application at `src/routes/review.tsx:36-136`; `/handoff` records on-exchange and off-exchange next steps at `src/routes/handoff.tsx:27-119`; `/apply` is a five-step off-exchange carrier application with readiness, signature, generated PDF/EDI state, and pending carrier confirmation at `src/routes/apply.tsx:38-292` and `src/routes/apply.tsx:296-313`.
- **Member — continuation workspace**: `/member` resumes persisted quote/cart/tasks using `MemberShell`, `PageHeader`, `KpiCard`, and `StatusBadge` at `src/routes/member.index.tsx:28-110`; `/member/quotes` shows saved plan continuation at `src/routes/member.quotes.tsx:19-46`; `/member/messages` adds unread/message state at `src/routes/member.messages.tsx:15-37`; `/member/settings` is a support route but not a journey centerpiece at `src/routes/member.settings.tsx:39-103`.

## 2. Exact proposed B8 Experience inventory

B8 will create exactly five top-level editable native Figma frames on `04 Experiences`:

| Order | Exact B8 asset name | Kind | Representative type | Why selected |
|---:|---|---|---|---|
| 1 | `ABox/Experience/Internal/DownlineAgencyCreation` | FRAME | Flow | Strongest internal linear multi-step wizard with persisted state, validation, review, activation, and B6 stepper evidence. |
| 2 | `ABox/Experience/Internal/MarketplaceActivationGovernance` | FRAME | Journey slice | Internal operational journey from marketplace status summary to readiness controls to activation submission. |
| 3 | `ABox/Experience/Marketplace/PlanAIShoppingPath` | FRAME | Flow | Main shopper path from product/path choice to quote outcome to ranked plan results. |
| 4 | `ABox/Experience/Marketplace/EnrollmentReviewAndSubmission` | FRAME | Journey slice with documented branch | Cart/review handoff plus off-exchange application path; captures completion/review states without duplicating every route. |
| 5 | `ABox/Experience/Member/ContinuationWorkspace` | FRAME | Continuation composition | Member-side continuation of quote, saved plans, cart, messages, and tasks after shopping/enrollment. |

Not selected for B8: standalone plan detail, compare-only, individual settings/support pages, every admin sub-route, every wizard step, and generic galleries. Those are either detailed screen inventory for `05 Screens`, unsupported by B4/B6 foundations, or route-specific rather than journey-level.

## 3. Exact source references for each Experience

- `ABox/Experience/Internal/DownlineAgencyCreation`
  - `src/routes/agency.downlines.new.identity.tsx:67-125`
  - `src/routes/agency.downlines.new.contacts.tsx:43-113`
  - `src/routes/agency.downlines.new.readiness.tsx:43-89`
  - `src/routes/agency.downlines.new.activate.tsx:105-154`
  - `src/components/abox/downline-wizard-stepper.tsx:18-63`
  - `tools/figma-plugin/tokens-b6.js:241-381`
- `ABox/Experience/Internal/MarketplaceActivationGovernance`
  - `src/routes/marketplace.admin.index.tsx:66-155`
  - `src/routes/marketplace.admin.readiness.tsx:25-61`
  - `src/routes/marketplace.admin.activation.tsx:25-73`
  - `tools/figma-plugin/tokens-b6.js:32-52`
- `ABox/Experience/Marketplace/PlanAIShoppingPath`
  - `src/routes/select.tsx:31-95`
  - `src/routes/quote.tsx:378-545`
  - `src/routes/quote.tsx:1235-1363`
  - `src/routes/plans.index.tsx:47-190`
  - `src/routes/plans.index.tsx:276-369`
  - `src/components/abox/product-switcher.tsx:20-78`
- `ABox/Experience/Marketplace/EnrollmentReviewAndSubmission`
  - `src/routes/cart.tsx:36-199`
  - `src/routes/review.tsx:36-136`
  - `src/routes/handoff.tsx:27-119`
  - `src/routes/apply.tsx:38-292`
  - `src/routes/apply.tsx:296-313`
  - `src/lib/cart-store.ts:1-131`
- `ABox/Experience/Member/ContinuationWorkspace`
  - `src/routes/member.index.tsx:28-110`
  - `src/routes/member.quotes.tsx:19-46`
  - `src/routes/member.messages.tsx:15-37`
  - `src/routes/member.settings.tsx:39-103`

## 4. Exact shell/pattern/component composition mapping

| Experience | Shell instance | B6 pattern instances | B4/B5 component instances | Source-backed native content allowed only as route composition |
|---|---|---|---|---|
| DownlineAgencyCreation | `ABox/Shell/Internal`; existing text overrides `pageTitle=Create downline agency`, `eyebrow=Contacts · SCR-M05-009`, `entity=Cedar Grove Insurance` | `ABox/Pattern/WizardStepper` once, using its protected Contacts route configuration | `ABox/Header/PageHeader`, `ABox/Action/ActionPill`, `ABox/Status/StatusBadge`, `ABox/Form/LabeledField`, `ABox/Form/Input` | identity/contact form summaries, readiness PASS/WARNING/FAIL list, activation completed/pending state labels |
| MarketplaceActivationGovernance | `ABox/Shell/Internal`; text overrides `pageTitle=Marketplace administration`, `eyebrow=Marketplace · {internal_code}` | `ABox/Pattern/KpiRow` with `columns=4` | `ABox/Header/PageHeader`, `ABox/Card/KpiCard`, `ABox/Action/ActionPill`, `ABox/Status/StatusBadge` | quick-action rail, release summary, blockers, recent changes, participants, readiness rows |
| PlanAIShoppingPath | `ABox/Shell/Marketplace` `variant=flow`, existing `showProducts=true`, existing `showAssistant=true`, `product=ifp` metadata | none; quote stepper and ShoppingPathBar are not B6 patterns | `ABox/Header/PageHeader`, `ABox/Status/StatusBadge`, `ABox/Action/ActionPill`, `ABox/Feedback/EmptyState` where applicable | PlanAI path cards, quote final subsidy card, PlanAI side-panel summary, filter/sort/compare/results composition, plan cards as editable route content because `PlanCard` is not B4 |
| EnrollmentReviewAndSubmission | `ABox/Shell/Marketplace` `variant=flow`, existing `showProducts=true`, existing `showAssistant=false` for apply/handoff states where source disables it | none | `ABox/Header/PageHeader`, `ABox/Status/StatusBadge`, `ABox/Action/ActionPill`, `ABox/Feedback/EmptyState` where applicable | cart grouped selections, review checklist, handoff packet, off-exchange application readiness ladder and generated output |
| ContinuationWorkspace | `ABox/Shell/Member` | `ABox/Pattern/KpiRow` with `columns=3` | `ABox/Header/PageHeader`, `ABox/Card/KpiCard`, `ABox/Status/StatusBadge`, `ABox/Feedback/EmptyState` where applicable | quote resume card, cart summary, task rows, saved plans route content, message rows |

B8 will not create `ShoppingPathBar`, `PlanCard`, data table, overlay, checklist, field group, or application-stepper foundations. Those areas remain editable native route content inside the Experience frame and are documented as limitations where no B4/B6 foundation exists.

## 5. Exact object, variant, and property representation

- Each B8 asset is a top-level **FRAME**, not a Component or Component Set.
- B8 creates **zero** Figma component properties, variants, variables, styles, components, component sets, patterns, or prototype reactions.
- Each Experience frame uses canonical desktop composition only.
- Responsive behavior is metadata only; no desktop/mobile variants are created.
- Interaction behavior is metadata only; no prototype links are created.
- Existing B7 shell properties may be set as instance overrides only:
  - Internal shell: `pageTitle`, `eyebrow`, `entity`.
  - Marketplace shell: `variant`, `showProducts`, `showAssistant`; `showProducts` still follows the B7 asymmetric rule and is never targeted on landing.
  - Member shell: no new properties; content remains structural.
- Each Experience frame contains deterministic child regions:
  1. `metadata/source-and-limitations`
  2. `shell-reference` using the existing B7 shell instance
  3. `journey-sequence` with source-backed state cards
  4. `representative-content` with editable native Figma objects and allowed existing instances
- Content inside a B7 shell instance is not inserted as a fake `children` slot. If Figma cannot place content into a live shell instance without detaching or mutating B7, B8 keeps route content as a sibling `representative-content` region and records that limitation.

## 6. Exact page-placement plan for `04 Experiences`

- Confirm exactly one page named `04 Experiences` exists before creating anything.
- Page `04 Experiences` receives only the five top-level B8 frames, in this order and with deterministic coordinates:
  1. `ABox/Experience/Internal/DownlineAgencyCreation` at `x=0`, `y=0`
  2. `ABox/Experience/Internal/MarketplaceActivationGovernance` at `x=1600`, `y=0`
  3. `ABox/Experience/Marketplace/PlanAIShoppingPath` at `x=3200`, `y=0`
  4. `ABox/Experience/Marketplace/EnrollmentReviewAndSubmission` at `x=4800`, `y=0`
  5. `ABox/Experience/Member/ContinuationWorkspace` at `x=6400`, `y=0`
- Each top-level frame is `1440` wide, uses vertical auto-layout, and contains only native editable frames/text plus instances of existing B7/B6/B4/B5 assets.
- `00 Foundations`, `01 Components`, `02 Patterns`, `03 Shells`, `05 Screens`, and `06 Documentation` remain untouched.

## 7. Exact deterministic and idempotency strategy

- Creation order is exactly the inventory order above.
- Asset lookup key is the exact top-level frame name on `04 Experiences`.
- Each frame receives plugin data:
  - `aboxBatch = B8`
  - `aboxKind = experience`
  - `aboxName = <exact asset name>`
  - `aboxSignature = <deterministic signature>`
  - `aboxSources = <sorted source-reference list>`
- Signature input per asset is normalized JSON containing: asset name, object type `FRAME`, canonical page `04 Experiences`, ordered source references, B7 shell reference and configured existing-property overrides, B6 pattern references, B4/B5 component references, ordered child-region names, representative state names, no-new-foundation flag, no-prototype flag, no-responsive-variant flag, and limitation keys.
- Exact signature labels:
  - `ABox/Experience/Internal/DownlineAgencyCreation|FRAME|shell=Internal|states=identity,contacts,readiness,activation|patterns=WizardStepper|props=none|prototypes=0`
  - `ABox/Experience/Internal/MarketplaceActivationGovernance|FRAME|shell=Internal|states=admin,readiness,activation|patterns=KpiRow-4|props=none|prototypes=0`
  - `ABox/Experience/Marketplace/PlanAIShoppingPath|FRAME|shell=Marketplace-flow|states=select,quote-final,ranked-results|patterns=none|props=none|prototypes=0`
  - `ABox/Experience/Marketplace/EnrollmentReviewAndSubmission|FRAME|shell=Marketplace-flow|states=cart,review,handoff,offexchange-application|patterns=none|props=none|prototypes=0`
  - `ABox/Experience/Member/ContinuationWorkspace|FRAME|shell=Member|states=dashboard,saved-quotes,messages|patterns=KpiRow-3|props=none|prototypes=0`
- If no same-name frame exists: create it.
- If exactly one same-name frame exists with matching B8 plugin data and signature: reuse it and create nothing.
- If a same-name object has a missing, different, or non-B8 signature: STOP that asset and report the conflict. Do not silently mutate it.
- If duplicate same-name objects exist: STOP B8 verification and report duplicates.
- Run 1 expected B8 top-level creation count: `5` frames.
- Run 1 expected new variables/styles/components/component sets/patterns/prototype links: `0`.
- Run 2 expected B8 top-level creation count: `0`.

## 8. Exact verification checklist

The eventual `b8-verify` must check:

1. Exactly seven B0 pages exist, in the original order.
2. Only `04 Experiences` receives B8 top-level objects during B8.
3. `00 Foundations`, `01 Components`, `02 Patterns`, `03 Shells`, `05 Screens`, and `06 Documentation` are not populated or changed by B8 beyond their pre-B8 state.
4. B1 remains `9` collections and `200` variables.
5. B2 remains `19` typography variables.
6. B3 remains `79` styles.
7. B4 remains `11` component sets and `3` standalone components on `01 Components`.
8. B5 remains `56` variant nodes, `59` physical component nodes, `19` non-variant properties, and `1` exposed nested control.
9. B6 remains `3` top-level patterns and `4` physical component nodes on `02 Patterns`.
10. B7 remains `3` top-level shell assets and `4` physical component nodes on `03 Shells`.
11. `04 Experiences` contains exactly the five approved B8 frame names in deterministic order.
12. Every B8 top-level object is type `FRAME`, not Component or Component Set.
13. Every B8 frame has matching B8 plugin data and deterministic signature.
14. Every B8 frame includes at least one existing B7 shell instance matching its mapped shell.
15. Downline uses the existing B6 `ABox/Pattern/WizardStepper` instance and does not create a new stepper pattern.
16. MarketplaceActivationGovernance uses the existing B6 `ABox/Pattern/KpiRow` instance with `columns=4`.
17. ContinuationWorkspace uses the existing B6 `ABox/Pattern/KpiRow` instance with `columns=3`.
18. All referenced B4/B5 component instances resolve to existing library nodes.
19. No B8 top-level component properties exist; no generic `children`, `content`, navigation, responsive, or synthetic state properties are added.
20. No invented responsive variants exist.
21. No prototype reactions exist.
22. No screenshots, HTML embeds, flattened images, or external image substitutions are used.
23. Every dynamic or unsupported area is documented in the frame metadata/notes.
24. Run 2 creates zero new B8 top-level objects and signatures remain identical.
25. App source remains untouched; existing syntax/build checks are unaffected.

## 9. Exact files that would change during implementation

Read-only source/audit inputs:

- `src/components/abox/internal-shell.tsx`
- `src/components/abox/marketplace-shell.tsx`
- `src/components/abox/member-shell.tsx`
- `src/components/abox/downline-wizard-stepper.tsx`
- `src/components/abox/product-switcher.tsx`
- `src/routes/agency.downlines.new.*.tsx`
- `src/routes/marketplace.admin*.tsx`
- `src/routes/select.tsx`
- `src/routes/quote.tsx`
- `src/routes/plans.index.tsx`
- `src/routes/cart.tsx`
- `src/routes/review.tsx`
- `src/routes/handoff.tsx`
- `src/routes/apply.tsx`
- `src/routes/member*.tsx`
- `tools/figma-plugin/tokens-b1.js` through `tools/figma-plugin/tokens-b7.js`
- `tools/figma-plugin/plugin.js`
- `tools/figma-plugin/build.mjs`
- `tools/figma-plugin/ui.html`
- `tools/figma-plugin/README.md`
- `.lovable/manual-work-map.md`

Implementation changes, only after approval:

- Create `tools/figma-plugin/extract-b8.mjs`.
- Create generated `tools/figma-plugin/tokens-b8.js`.
- Modify `tools/figma-plugin/plugin.js` to add B8 create/verify handlers, page guards, live asset resolution, signatures, and read-only protection checks for B1-B7.
- Modify `tools/figma-plugin/build.mjs` to include `tokens-b8.js` before `plugin.js` in `code.js` generation.
- Modify `tools/figma-plugin/ui.html` to add `Create experiences` and `Verify experiences` controls.
- Modify `tools/figma-plugin/README.md` to document B8 scope, limitations, offline vs real-Figma evidence, and run sequence.
- Modify `.lovable/manual-work-map.md` only to append the B8 governance entry.
- Regenerate `tools/figma-plugin/code.js` only through `tools/figma-plugin/build.mjs`.

No files under `src/**` will be changed.

## 10. App source remains untouched

B8 is reference-layer only. The production app remains the source of truth and will not be edited, renamed, normalized, redesigned, rerouted, reformatted, or otherwise modified.

## 11. Offline/plugin-layer versus real Figma Desktop verification

Offline/plugin-layer checks may prove only that extraction, generated token data, bundled plugin code, syntax, deterministic signatures, and mock idempotency are stable. Offline output is not evidence that native editable Figma objects were created.

Real Figma Desktop verification must be reported separately and must use this exact sequence in the ABox Design System — Library file:

1. Open the existing Library file, not `ABox Proof — Scratch`.
2. Run `Verify shells` to confirm B7 references exist and B1-B7 are intact.
3. Run `Create experiences`.
4. Run `Verify experiences`.
5. Run `Create experiences` again.
6. Run `Verify experiences` again.
7. Confirm the second create reports `0` new B8 top-level frames.
8. Confirm all five B8 frame ids and signatures are identical between runs.
9. Confirm `ABox Proof — Scratch` was not touched.
10. If editable-object creation, permissions, live B7/B6/B4/B5 resolution, deterministic readback, rollback, or security checks fail, STOP and report `REAL FIGMA NOT VERIFIED`.

## 12. No implementation changes yet

No implementation is performed by this plan. B8 implementation begins only after this plan is approved.
