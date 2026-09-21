# Phase 52 / Batch B5 — Component variants & states (PLAN ONLY)

Plugin layer only. Nothing under `src/**` changes. B1 (9 collections / 200 variables), B2 (`ABox/Typography`, 19 variables), B3 (79 styles) and the B4 architecture (11 sets + 3 components, 52 variants) are protected; B5 extends existing B4 objects in place and creates no new component or set.

## 1. Source findings

Inspected: `src/components/abox/*` (control, field, page-header, kpi-card, status-badge, metal-badge, module-tabs, downline-wizard-stepper, empty-state, logo, surface, action-pill, save-continue-button, plan-card, quote-edit-panel), `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/styles.css`, all non-reference routes, and the existing `tools/figma-plugin/*` data.

What production actually exposes beyond the B4 variant axes:

| Finding | Source |
| --- | --- |
| Optional render slots declared as `prop?:` and rendered behind `{prop && …}` | `page-header.tsx:14-20,33-58`, `kpi-card.tsx:17-23,50-88`, `empty-state.tsx:6-12,16-27` |
| `disabled` passed as a real prop with a stable visual definition (`disabled:opacity-50`) | `ui/button.tsx:8`; call site `plan-card.tsx:116` (`size="sm"`, `disabled={inCart}`) |
| Delta sign branch, two declared colour outcomes | `kpi-card.tsx:78` `delta.pct >= 0 ? "text-sage" : "text-destructive"` |
| Text content driven by required props | `status-badge.tsx` children, `kpi-card.tsx` label/value, `page-header.tsx` title/description, `module-tabs.tsx` label, `field.tsx` label, `empty-state.tsx` title/body, `ui/input.tsx` placeholder |
| `disabled:opacity-50` declared but with **no** production call site | `ui/input.tsx:11` |
| `aria-invalid` / validation styling | only `routes/design-system.tsx:1177` and `routes/design-guide.tsx:550` — reference layers |
| Hover / focus / active / transition rules | `ui/button.tsx:8`, `action-pill.ts`, `surface.tsx` `SURFACE_INTERACTIVE_HOVER`, `control.tsx` `CONTROL_FOCUS_RING`, `module-tabs.tsx:28`, `kpi-card.tsx:41,62` |
| `disabled` explicitly declared consumer-owned | `control.tsx:11-12` ("disabled variants … stays consumer-owned") |

## 2. Actual B4 property audit (read before anything else)

Evidence read this turn from the real B4 implementation, not from the B4 prose:

- `tools/figma-plugin/plugin.js` and generated `code.js` contain **no** call to `addComponentProperty` and no assignment to `componentPropertyDefinitions`. The single occurrence of `componentPropertyDefinitions` (`plugin.js:307`, `code.js:5213`) is a **read** inside the B0/proof verification, checking the `tone` VARIANT definition.
- The only Figma component properties B4 actually creates are the VARIANT properties produced by `figma.combineAsVariants` (`plugin.js:238`, `plugin.js:1650`).
- `tokens-b4.js` does carry `textProps`, `boolProps`, `instanceProps` and `exposedInstances`, but `plugin.js:1664-1690` only **prints** them into the inventory/description output. No Figma object is created from them.

Conclusion, now evidence-backed: after B4 the file contains VARIANT properties only. The recorded `textProps` / `boolProps` / `instanceProps` are documented intent that B5 realises as real Figma properties for the first time. B5 still reads the live property inventory first and reuses in place anything that already exists.

| Component | Real Figma properties existing after B4 | Recorded-but-not-created in `tokens-b4.js` |
| --- | --- | --- |
| `ABox/Action/ActionPill` | variant `action` (10) | text `label` |
| `ABox/Action/Button` | variant `variant`, variant `size` (9 combos) | text `label` |
| `ABox/Status/StatusBadge` | variant `tone` (6) | text `label` |
| `ABox/Status/MetalBadge` | variant `tier` (6) | text `label` |
| `ABox/Surface/Surface` | enumerated variant axes | — |
| `ABox/Control/Control` | variant `height`, `focusRing` | — |
| `ABox/Card/KpiCard` | variant `tone` (4) | text `label`, `value`; bool `icon`, `delta`, `hint` |
| `ABox/Header/PageHeader` | variant `variant` (2) | text `title`, `eyebrow`, `description`; bool `eyebrow`, `description`, `icon`, `actions` |
| `ABox/Nav/ModuleTab` | variant `state` (2) | text `label` |
| `ABox/Nav/WizardStep` | variant `state` (4) | text `label` |
| `ABox/Brand/AboxMark` | variant `tone` (4) | — |
| `ABox/Feedback/EmptyState` | none (standalone) | text `title`, `body`; bool `icon`, `body`; instance-swap `action` |
| `ABox/Form/LabeledField` | none (standalone) | text `label`; exposed nested instance `control` |
| `ABox/Form/Input` | none (standalone) | text `placeholder` |

B5 rule: read the live inventory; existing property = reuse in place with its id preserved; missing property = create; name/type mismatch = STOP.

## 2b. B4 / B5 boundary

Already in B4, not duplicated by B5: ActionPill `action` (10), Button `variant` × `size`, StatusBadge `tone` (6), MetalBadge `tier` (6), Surface enumerated combinations, Control `height`/`focusRing`, KpiCard `tone` (4), PageHeader `default`/`compact`, ModuleTab `default`/`active`, WizardStep `current`/`done`/`upcoming`/`unreachable`, AboxMark `tone` (4). B5 renames nothing, recreates nothing and re-architects nothing.

## 3. Included B5 states

### 3a. Button `disabled` — resolution A: no new variant axis

A Figma Variant property belongs to the whole Component Set: introducing `state` would force a value onto all nine existing Button variants, and production provides no name for the non-disabled condition. `ui/button.tsx` declares no `state`, `status` or equivalent prop — `disabled` is the native HTML attribute, styled by `disabled:opacity-50` (line 8) and used at exactly one call site, `plan-card.tsx:116`. There is therefore no production-backed value for the other eight combinations, and inventing "enabled"/"default" would be exactly the fabrication this batch forbids.

**Decision:** `ABox/Action/Button` gains **no** `state` axis and **no** new variant. Button stays at 9 variants with axes `variant` × `size` unchanged. The disabled treatment is recorded verbatim as a limitation (see §10), citing `ui/button.tsx:8` and `plan-card.tsx:116`. No Boolean substitute is created either, because a Boolean cannot alter the fill opacity of the existing bound styles without a layer B4 never built.

### 3b. KpiCard delta — schema-complete variant matrix

`kpi-card.tsx:19` declares one optional prop, `delta?: { pct: number; label?: string }`, carrying two distinct meanings Figma cannot hold in one property: presence (`{delta && …}`, line 73) and colour branch (`delta.pct >= 0 ? "text-sage" : "text-destructive"`, line 78).

- Presence → Boolean **`hasDelta`**. The `has` prefix names the source guard and is applied uniformly to every optional-render guard in B5, so nothing is invented for this one case.
- Sign → Variant property **`deltaSign`**, values **`positive`** / **`negative`**, named after the production comparison on `delta.pct`. It must be a variant because it changes colour, which a visibility Boolean cannot express.

Set-wide schema test: the ternary at line 78 is unconditional and independent of `tone`, so both values are structurally required by the production API for every tone. The complete matrix is therefore `tone` (4) × `deltaSign` (2) = **8 variants**, i.e. 4 → 8, **+4**. When `hasDelta = false` the delta layer is hidden while `deltaSign` still carries a value, because Figma requires one — recorded as a limitation, not resolved by invention.

The production prop name `delta` is used for neither Figma property, so no component holds two properties called `delta`.

### 3c. Boolean properties (layer visibility — they add no variants)

Naming rule, applied uniformly: a Boolean representing an optional-render guard `{prop && …}` is named `has<Prop>`; the production prop name stays reserved for the Text or Instance Swap property carrying content.

| Object | Boolean properties | Source guard | B4 recorded name |
| --- | --- | --- | --- |
| `ABox/Header/PageHeader` | `hasEyebrow`, `hasIcon`, `hasDescription`, `hasActions` | `page-header.tsx:33,36,51,57` | `eyebrow`, `icon`, `description`, `actions` |
| `ABox/Card/KpiCard` | `hasIcon`, `hasDelta`, `hasHint` | `kpi-card.tsx:60,73,76,86` | `icon`, `delta`, `hint` |
| `ABox/Feedback/EmptyState` | `hasIcon`, `hasBody`, `hasAction` | `empty-state.tsx:18,23,24` | `icon`, `body` (+ `action` slot) |

Booleans: 4 + 3 + 3 = **10**. The renames from the B4 recorded names are forced by the collision rule and touch no existing Figma object, since no Boolean exists yet.

### 3d. Text properties

`ABox/Action/ActionPill` → `label`; `ABox/Action/Button` → `label`; `ABox/Status/StatusBadge` → `label`; `ABox/Status/MetalBadge` → `label`; `ABox/Card/KpiCard` → `label`, `value`; `ABox/Header/PageHeader` → `title`, `eyebrow`, `description`; `ABox/Nav/ModuleTab` → `label`; `ABox/Nav/WizardStep` → `label`; `ABox/Feedback/EmptyState` → `title`, `body`; `ABox/Form/LabeledField` → `label`; `ABox/Form/Input` → `placeholder`.

Text: 1+1+1+1+2+3+1+1+2+1+1 = **15**, exactly the `textProps` inventory recorded in `tokens-b4.js`.

### 3e. Instance Swap properties and complete slot audit

Two production props are caller-supplied `React.ReactNode` content slots, and each is represented by **both** a visibility Boolean and a content Instance Swap — the Boolean never absorbs the slot.

| Production prop | Type | Source | Figma type | Final Figma name | Meaning | Real component available to swap |
| --- | --- | --- | --- | --- | --- | --- |
| PageHeader `actions` | `React.ReactNode` | `page-header.tsx:16` declared, `:55` rendered `{actions && <div …>{actions}</div>}` | Boolean + Instance Swap | `hasActions` + `actions` | both — presence guard and content slot | yes; production call sites pass real B4 components: `ActionPill` (`marketplace.admin.readiness.tsx:28`), `StatusBadge` (`app.jet.branding.tsx:26`, `app.jet.platform.tsx:95`), `SaveContinueButton` (`review.tsx:43`). Preferred swap values: `ABox/Action/ActionPill`, `ABox/Status/StatusBadge`. |
| EmptyState `action` | `React.ReactNode` | `empty-state.tsx:9` declared, `:24` rendered `{action}` | Boolean + Instance Swap | `hasAction` + `action` | both | yes, but production passes raw inline `<Link>`/`<button>` elements styled with pill classes (`plans.index.tsx:344`, `cart.tsx:59`, `review.tsx:50`, `apply.tsx:96`, `compare.tsx:83`, `member.quotes.tsx:29`, `handoff.tsx:37`), not a B4 component. The Instance Swap is created with **no** default preferred value; no placeholder component is invented. Recorded as a limitation. |
| PageHeader `icon` | `ComponentType<{className?: string}>` | `page-header.tsx:15,30-35` | Boolean only | `hasIcon` | visibility-only | no — B4 created no icon Component; non-swappable, limitation preserved |
| KpiCard `icon` | `ComponentType<{className?: string}>` | `kpi-card.tsx:20,60` | Boolean only | `hasIcon` | visibility-only | no — same limitation |
| EmptyState `icon` | `ComponentType<{className?: string}>` | `empty-state.tsx:6,18-22` | Boolean only | `hasIcon` | visibility-only | no — same limitation |
| LabeledField `control` | children | `field.tsx` | exposed nested instance (not a property) | `control` | content, already exposed in B4 | existing `ABox/Control/Control` instance |

Instance Swap properties: **2** (`PageHeader.actions`, `EmptyState.action`). No other production prop is a content slot: every remaining optional prop is a string or a `ComponentType` icon.

### 3f. Collision audit — complete

Names must be unique within a component; repetition across components is fine.

| Component | All Figma properties after B5 | Collision |
| --- | --- | --- |
| `ABox/Action/ActionPill` | variant `action`, text `label` | none |
| `ABox/Action/Button` | variant `variant`, variant `size`, text `label` | none |
| `ABox/Status/StatusBadge` | variant `tone`, text `label` | none |
| `ABox/Status/MetalBadge` | variant `tier`, text `label` | none |
| `ABox/Surface/Surface` | B4 axes only | none |
| `ABox/Control/Control` | B4 axes only | none |
| `ABox/Card/KpiCard` | variant `tone`, variant `deltaSign`, bool `hasIcon`, `hasDelta`, `hasHint`, text `label`, `value` | resolved (`delta` → `hasDelta` + `deltaSign`) |
| `ABox/Header/PageHeader` | variant `variant`, bool `hasEyebrow`, `hasIcon`, `hasDescription`, `hasActions`, text `title`, `eyebrow`, `description`, swap `actions` | resolved (Booleans renamed `has…`; `actions` kept as the content slot) |
| `ABox/Nav/ModuleTab` | variant `state`, text `label` | none |
| `ABox/Nav/WizardStep` | variant `state`, text `label` | none |
| `ABox/Brand/AboxMark` | variant `tone` | none |
| `ABox/Feedback/EmptyState` | bool `hasIcon`, `hasBody`, `hasAction`, text `title`, `body`, swap `action` | resolved (`body` → `hasBody` + text `body`; `action` → `hasAction` + swap `action`) |
| `ABox/Form/LabeledField` | text `label` (+ exposed nested instance `control`, not a property) | none |
| `ABox/Form/Input` | text `placeholder` | none |

### 3g. Recalculated totals — actual Figma objects

| Count | Value | Arithmetic |
| --- | --- | --- |
| Component Sets | 11 | unchanged |
| Standalone Components | 3 | unchanged |
| Total component objects | 14 | 11 + 3 |
| Variants before B5 | 52 | B4 |
| Variants after B5 | 56 | 52 + 4 (KpiCard 4 → 8); Button unchanged at 9 |
| Variant properties existing after B4 | 13 axes | ActionPill 1, Button 2, StatusBadge 1, MetalBadge 1, Surface n, Control 2, KpiCard 1, PageHeader 1, ModuleTab 1, WizardStep 1, AboxMark 1 — printed and asserted at run time |
| Variant properties created by B5 | 1 | `KpiCard.deltaSign` |
| Variant properties reused unchanged | all B4 axes | none renamed, none removed |
| Boolean properties created | 10 | 4 (PageHeader) + 3 (KpiCard) + 3 (EmptyState) |
| Text properties created | 15 | 1+1+1+1+2+3+1+1+2+1+1 |
| Instance Swap properties created | 2 | PageHeader `actions` + EmptyState `action` |
| Non-variant properties created | 27 | 10 + 15 + 2 |
| Properties reused in place (already real in Figma) | 0 Boolean / 0 Text / 0 Swap | proven by §2 audit; re-proven at run time against the live inventory |

### 3h. Combinations that must NOT be created

No Button `state` axis and no Button variant added. PageHeader `hasEyebrow = true` together with `compact` (`page-header.tsx:33` suppresses it) is not a supported combination. MetalBadge, AboxMark, ActionPill, Surface, Control gain no second axis. No Boolean or Text property is expanded into a variant, and no property is converted into a variant to avoid a name clash. No Cartesian expansion beyond the schema-complete KpiCard matrix required by the Figma Component Set model.

## 4. Excluded states, with reasons

| Candidate | Reason |
| --- | --- |
| Button `disabled` as a variant or property | `ui/button.tsx:8` styles the native HTML attribute; production names no non-disabled counterpart, so a set-wide axis would require an invented value (§3a). Documentation-only. |
| hover, group-hover, focus-visible, focus, active/pressed | CSS pseudo-classes; production treats them as interaction behaviour, not reusable design-system states. Documentation-only. |
| Input `disabled` | `ui/input.tsx:11` declares it, no production call site uses it; adding it would convert the standalone `ABox/Form/Input` into a set and change B4 architecture. |
| Control `disabled` | `control.tsx:11-12` explicitly leaves it consumer-owned; no canonical definition exists. |
| error / validation / `aria-invalid` | Only reference routes. |
| loading, checked, open/closed, expanded/collapsed, success | No production definition on any B4 object. |
| dialog, sheet, popover, tooltip, dropdown-menu, tabs states | Behavioural primitives — B6. |
| responsive `md:`/`xl:` branches (`page-header.tsx:37,44,46`, `kpi-card.tsx`, `ui/input.tsx:11`) | Layout composition, not component-level states — B7/B8. |
| motion: `CountUp`, `FadeRise`, `animate-hairline`, `transition-all`, `group-hover` rotate/scale | Motion; no reusable resting state beyond what already exists. |

## 5. Foundation bindings

Every B5 state reuses the existing foundations, taken from the production declaration and never from value equality: KpiCard `deltaSign=positive` binds the B3 colour style backed by `ABox/Semantic/sage`, `deltaSign=negative` the one backed by `ABox/Semantic/destructive` (`kpi-card.tsx:78`); all other colour, elevation and typography references stay on the B3 styles and B1/B2 variables already attached in B4. Boolean, Text and Instance Swap properties change no fill, stroke, effect or type binding. No hard-coded foundation value is introduced, and B1/B2/B3 are read-only throughout.

## 6. Idempotency

The live property inventory of each B4 object is read before any write. Exact-name matching on set, variant, property and value. Existing variant or property = reuse and update in place, id preserved. Duplicate property or value = STOP. Property-type mismatch (Boolean vs Text vs Instance Swap vs Variant) = STOP. Attempting to create a set or component that B4 already owns = STOP. Nothing is deleted. Run 2 creates zero B5 objects and reports ids identical to Run 1, including every pre-existing B4 id.

## 7. `b5-verify` — 25 checks

1. B4 existing property inventory is read and printed first. 2. No existing B4 property is recreated; every pre-existing property id is preserved. 3. No B4 component, set or variant is renamed, deleted or re-architected. 4. Exactly one new variant property exists: `KpiCard.deltaSign` with values `positive`, `negative`. 5. Component Set schema consistency: every variant of every set carries a value for every variant property of that set — asserted for all 11 sets, KpiCard included at `tone` × `deltaSign` = 8. 6. `ABox/Action/Button` still has exactly the axes `variant` × `size` and exactly 9 variants; no `state` property exists on it. 7. Per component, every property name is unique and no name is used for two property types — asserted against the §3f table. 8. Boolean = 9, Text = 15, Instance Swap = 1, non-variant total = 25, with arithmetic printed. 9. Exact property names per component match §3c–§3e. 10. Per-state production source mapping printed for every B5 property and value. 11. B1/B2/B3 bindings resolve to existing objects. 12. No hard-coded duplicate foundation value. 13. No value-equality-derived state. 14. No invented state and no invented variant value. 15. No property converted into a variant to avoid a name clash. 16. No pseudo-class rendered as a variant. 17. Responsive only where justified (zero); motion only where justified (zero). 18. B1 = 9 collections / 200 variables. 19. B2 = 1 collection / 19 variables. 20. B3 = 79 styles. 21. Objects = 11 sets + 3 components, `11 + 3 = 14`; variants `52 + 4 = 56` printed. 22. Pages unchanged: 7, in order, only `01 Components` populated; no patterns, shells, screens or documentation content. 23. `git diff --stat -- src/` empty. 24. `code.js` regenerated only by `node build.mjs`. 25. Offline Run 1 passes and Run 2 creates zero objects with identical ids; offline mock execution is explicitly distinguished from real Figma Desktop execution and mock ids are never presented as Figma ids.

Final line: `RESULT: B5 PASSED` or `RESULT: B5 FAILED — do not proceed to B6.`

## 8. Run procedure

Offline: `node tools/figma-plugin/extract-b5.mjs` → `node tools/figma-plugin/build.mjs` → mock harness runs B1, B2, B3, B4, then B5 twice; assert zero creations and identical ids on Run 2. Real: in Figma Desktop, inside `ABox Design System — Library`, **Create component states** → **Verify component states** → **Create component states** again; both outputs, with real ids, form the B5 final report. Mock ids are never presented as Figma ids.

## 9. Files

Created: `tools/figma-plugin/extract-b5.mjs`. Generated: `tools/figma-plugin/tokens-b5.js`, `tools/figma-plugin/code.js` (via `build.mjs` only, never hand-edited). Modified: `tools/figma-plugin/plugin.js` (B5 section + entry), `ui.html` (two buttons), `build.mjs` (concatenate `tokens-b5.js`), `README.md`, `.lovable/manual-work-map.md`.

No file under `src/**` is created, modified or deleted; no application UI, routing, navigation, branding, asset, responsiveness, business-logic or layout change; the proof file and every B0 page stay as they are.

## 10. Limitations recorded verbatim in the report

`ui/button.tsx:8` `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed`, used at `plan-card.tsx:116` (`size="sm" disabled={inCart}`) — not converted to a Figma variant or property: a set-wide `state` axis would require a production-backed value for the other eight Button combinations, and production names none; only the opacity is visual in any case, and pointer-events and cursor have no Figma representation. `kpi-card.tsx:19,73,78` — with `hasDelta = false` the hidden delta layer still carries a `deltaSign` value, because Figma requires every variant to hold a value for every axis of its set; recorded rather than resolved by invention. `ui/input.tsx:11` `disabled:cursor-not-allowed disabled:opacity-50` — declared, never used in production; not converted. `control.tsx:11-12` — disabled variants consumer-owned. `kpi-card.tsx:19,73,78` — one production prop `delta?` carries both presence and sign; Figma cannot express both in a single property, so it is split into `hasDelta` and `deltaSign`, and the production prop name `delta` is used for neither. `kpi-card.tsx:78` — no negative `pct` literal occurs at any production call site; `deltaSign=negative` is included on the strength of the source branch and this absence is recorded. `page-header.tsx:33` — `eyebrow` is suppressed in `compact`; the combination is not created. `page-header.tsx:18` / `kpi-card.tsx:20` / `empty-state.tsx:7` — `icon?: ComponentType` cannot be an Instance Swap because B4 created no icon component; only `hasIcon` and a placeholder vector exist. Hover/focus/active/transition rules in `ui/button.tsx:8`, `action-pill.ts`, `surface.tsx`, `control.tsx`, `module-tabs.tsx:28`, `kpi-card.tsx:41,62`. Motion: `CountUp`, `FadeRise`, `animate-hairline`, `group-hover:-rotate-6 group-hover:scale-105`. Responsive `md:`/`xl:` rules deferred to B7/B8. `color-mix()` tints and `oklch()`, as already recorded in B3/B4.

## 11. Out of scope

B6 patterns/interactions, B7 shells, B8 screens, page population beyond the existing B4 placement, documentation content, library publishing, application changes, redesign, new standalone components, generic state or accessibility libraries.
