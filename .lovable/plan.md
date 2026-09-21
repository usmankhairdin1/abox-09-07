# Phase 53 / Batch B6 — Patterns & Interactions (revised: implementation precision)

Only the three flagged precision gaps change. Every other B6 decision stays locked: 3 pattern
assets (`ABox/Pattern/KpiRow`, `ABox/Pattern/ModuleTabBar`, `ABox/Pattern/WizardStepper`),
4 physical pattern ComponentNodes, 1 new Component Set, 2 standalone Components, 0 prototype
connections, 0 new state axes beyond KpiRow's structural `columns`, B1–B5 protected, only
`02 Patterns` populated, no `src/**` changes, same idempotency and same real-vs-mock rule.

## Object arithmetic (stated explicitly)

| Kind | Count | Names |
| --- | --- | --- |
| Component Set | 1 | `ABox/Pattern/KpiRow` |
| Variant ComponentNodes inside that set | 2 | `columns=3`, `columns=4` |
| Standalone ComponentNodes | 2 | `ABox/Pattern/ModuleTabBar`, `ABox/Pattern/WizardStepper` |
| Physical B6 pattern ComponentNodes | 4 | 2 variants + 2 standalone |

Top-level objects on `02 Patterns` = 3 (1 set + 2 components).

## 1. KpiRow — exact deterministic creation sequence

1. Resolve the page `02 Patterns` by exact name; absent = STOP.
2. Resolve the live KpiCard main components required for the instances **before** creating any
   pattern node: locate the live `ABox/Card/KpiCard` Component Set, then resolve each required
   variant by exact variant-property matrix (`tone`, `deltaSign`). Missing set, missing matrix,
   or an ambiguous match = STOP. No pattern node is created before this resolution succeeds.
3. Read the live `02 Patterns` inventory and look for `ABox/Pattern/KpiRow` by deterministic
   identity (exact name, top-level on that page). More than one match = STOP.
4. **If absent:**
   - create exactly two root `ComponentNode` objects;
   - name them exactly `columns=3` and `columns=4` (variant-matrix names, no prefix);
   - construct each root as the specified horizontal auto-layout frame (see §2 sizing rules);
   - append exactly 3 and exactly 4 live KpiCard instances respectively, in the authored order,
     each created from the resolved main variant and set through its live component properties;
   - combine **only those two new ComponentNodes** into one Component Set with the supported
     Figma variant mechanism (`figma.combineAsVariants([...], page)`);
   - rename the resulting set to exactly `ABox/Pattern/KpiRow`, and verify the name read-back;
   - read the set's live `componentPropertyDefinitions` and verify exactly one VARIANT property
     named `columns` whose options are exactly `3` and `4`.
5. **If present:**
   - resolve the live Component Set;
   - verify exactly one variant axis, named `columns`, of type VARIANT;
   - verify its values are exactly `3` and `4` (no extra, no missing);
   - resolve the two existing variant nodes by exact variant-property matrix, never by index or
     by child order;
   - reuse both in place; create no second set and no second node for an existing matrix.
6. STOP conditions (print live vs expected, overwrite nothing, delete nothing): a conflicting set
   of the same name elsewhere, a duplicate variant matrix, a wrong axis name or type, an extra
   axis, or a materially different structure against the approved signature.
7. No `addComponentProperty()` call is made for this pattern. The `columns` axis exists solely
   through variant-matrix naming plus `combineAsVariants`. No second axis is created.

## 2. Wrapped auto-layout — both gap axes specified

`ABox/Pattern/ModuleTabBar` and `ABox/Pattern/WizardStepper` both set, explicitly:

- `layoutMode = "HORIZONTAL"`
- `layoutWrap = "WRAP"`
- `itemSpacing = 6` (production `gap-1.5`)
- `counterAxisSpacing = 6` (same `gap-1.5`, wrapped axis — row gap)
- `primaryAxisSizingMode = "AUTO"` and `counterAxisSizingMode = "AUTO"` — production wraps the
  children in a plain `flex flex-wrap` container with no width or height constraint, so both axes
  hug. Both chosen values are printed in the structural signature.
- No fixed width is introduced to force wrapping; no responsive breakpoint and no responsive
  variant is created.

`ModuleTabBar` additionally keeps `paddingBottom = 12` (production `pb-3`). `WizardStepper` keeps
zero padding. `KpiRow` variants stay `HORIZONTAL` with `layoutWrap = "NO_WRAP"`, `itemSpacing = 16`
(`gap-4`), both sizing modes `AUTO`, and those values are printed in its signature too.
`WizardStepper` carries no fill, no stroke and no effect.

## 2b. WizardStepper — the complete production composition (corrected)

The pattern represents the full fixed production list, not a shortened demonstration. Any earlier
wording about "five of eight steps … the minimum that demonstrates all four real states" is removed
entirely.

- Root stays a single Component `ABox/Pattern/WizardStepper` with the §2 layout values.
- It contains exactly **8** child instances, one per entry of `DOWNLINE_WIZARD_STEPS`
  (`src/components/abox/downline-wizard-stepper.tsx:18-27`), in exact source order.
- Every child is an instance of the live B4/B5 `ABox/Nav/WizardStep` component, with its existing
  `state` and `label` properties set — no new property, no new state value.
- The state configuration is copied from one documented real production route and current-step
  condition: **`/agency/downlines/new/contacts` (SCR-M05-009, step 3 of 8)**, which is one of the 8
  step routes that render the stepper. The states follow the source branches verbatim
  (`isDone = i < currentIndex`, `isCurrent = i === currentIndex`,
  `isReachable = i <= currentIndex`, otherwise the dimmed span):

| # | Label | State |
| --- | --- | --- |
| 1 | Identity | done |
| 2 | Legal & identifiers | done |
| 3 | Contacts | current |
| 4 | Addresses & offices | unreachable |
| 5 | Settings | unreachable |
| 6 | Initial administrator | unreachable |
| 7 | Readiness review | unreachable |
| 8 | Activation | unreachable |

- The B4 `upcoming` state (reachable, not current, not done) does not occur in this configuration —
  the source makes a step reachable only when `i <= currentIndex`, so no real route produces it.
  That is recorded as an observation; no state is manufactured and no states are mixed across
  routes to fake coverage.

## 3. ModuleTabBar bottom border — exact stroke binding

Implemented with individual stroke weights on the pattern root, no extra child node:

- `strokeTopWeight = 0`, `strokeLeftWeight = 0`, `strokeRightWeight = 0`, `strokeBottomWeight = 1`;
- resolve the live B3 paint style `ABox/Semantic/hairline` by exact name from the live local paint
  styles and assign its style id; if it cannot be resolved exactly, **STOP** — no new style is
  created, no colour value is hard-coded, nothing is approximated;
- `strokesIncludedInLayout = false` — production `border-b` on a `pb-3` flex row paints the rule
  outside the content box's spacing contract, so the border must not consume auto-layout space.
  The value is printed in the structural signature;
- no separate line/divider child node is created; production `module-tabs.tsx` proves the rule is
  a CSS border on the same element, not a sibling node.

Verification inspects: `strokeBottomWeight`, the three other side weights, the live stroke style
id resolved by identity, `strokesIncludedInLayout`, and the absence of any extra border/line child.

## 4. Structural signature (updated)

Signatures are computed twice — expected (from the approved source-backed definition) and live —
and compared string-for-string. Visual equality is never used.

**KpiRow:** Component Set id · variant property name · each variant node id · each variant matrix
value · root layout mode · `layoutWrap` · `itemSpacing` · `counterAxisSpacing` ·
`primaryAxisSizingMode` / `counterAxisSizingMode` · child count and order · nested KpiCard
main-component ids (and owning set id) · nested KpiCard property values.

**ModuleTabBar:** component id · layout mode · `layoutWrap` · `itemSpacing` · `counterAxisSpacing` ·
both sizing modes · padding · the four individual stroke weights, the live stroke style id and
`strokesIncludedInLayout` · nested child order · nested component identity and live id · nested
component property values · source file/line evidence.

**WizardStepper:** component id · layout mode · `layoutWrap` · `itemSpacing` · `counterAxisSpacing` ·
both sizing modes · padding · exactly 8 child nodes · exact child order 1–8 · each nested
WizardStep main-component id · each nested `state` · each nested `label` · the source route and
current-step evidence (`/agency/downlines/new/contacts`, step 3 of 8) · source file/line evidence
(`downline-wizard-stepper.tsx:18-27`, `:36-45`).

## 5. Verification (`b6-verify`) — added checks

Existing B1/B2/B3/B4/B5 preservation, page-scope, deferred/rejected, no-duplicate-primitive,
no-invented-interaction and bookkeeping checks stay. Added:

1. `ABox/Pattern/KpiRow` is exactly one Component Set holding exactly two Variant ComponentNodes.
2. Its only VARIANT property is `columns` (no second axis, no non-variant property).
3. Its values are exactly `3` and `4`.
4. No duplicate KpiRow variant matrix exists anywhere in the file.
5. `ModuleTabBar` and `WizardStepper` both report `layoutWrap = "WRAP"`.
6. Both report `itemSpacing = 6` and `counterAxisSpacing = 6`; both sizing modes match the
   signature.
7. `ModuleTabBar` has `strokeBottomWeight = 1` and top/left/right weights `0`, bound to the live
   B3 `ABox/Semantic/hairline` style id.
8. `ModuleTabBar` has no extra line/border child (child count equals the nested-tab count).
9. No hard-coded stroke or fill colour exists on any B6 node (`strokes` only via style id,
   `fills` empty).
10. No responsive breakpoint state or responsive variant was created.
11. `strokesIncludedInLayout` matches the signature value.
12. Run 2 creates zero B6 nodes and reports identical set, variant and component ids.

Any failed check prints `RESULT: B6 FAILED — do not proceed to B7.`

## 6. Files touched (plugin layer only)

- `tools/figma-plugin/extract-b6.mjs` — add `layoutWrap`, `counterAxisSpacing`, both sizing modes,
  the four individual stroke weights and `strokesIncludedInLayout` to the pattern root specs.
- `tools/figma-plugin/tokens-b6.js` — regenerated output of the extractor.
- `tools/figma-plugin/plugin.js` — KpiRow creation sequence as specified, root-application of the
  wrap/gap/sizing/stroke fields, widened expected/live signatures, the new verification checks.
- `tools/figma-plugin/README.md`, `.lovable/manual-work-map.md` — record the revised precision.
- `tools/figma-plugin/code.js` — regenerated only through `node build.mjs`, never hand-edited.
- No file under `src/**` changes.

## 7. Evidence rule

Offline dry-run ids remain mock ids and are never presented as Figma ids. Real evidence requires
running **Create patterns** → **Verify patterns** → **Create patterns** in Figma Desktop and
returning both verbatim outputs with identical real ids and zero creations on run 2.
