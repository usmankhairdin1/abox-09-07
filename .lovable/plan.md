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

## 2. B4 / B5 boundary

Already in B4, not duplicated by B5: ActionPill `action` (10), Button `variant` × `size`, StatusBadge `tone` (6), MetalBadge `tier` (6), Surface enumerated prop combinations, Control `height`/`focusRing`, KpiCard `tone` (4), PageHeader `default`/`compact`, ModuleTab `default`/`active`, WizardStep `current`/`done`/`upcoming`/`unreachable`, AboxMark `tone` (4). B5 renames nothing, recreates nothing and re-architects nothing.

## 3. Included B5 states

### 3a. New variant values — 5 added variants (52 → 57)

| Set | New variant property / values | Production evidence | Rule |
| --- | --- | --- | --- |
| `ABox/Action/Button` | `state` = `disabled`, created **only** on the one production combination `variant=default, size=sm` | `ui/button.tsx:8` + `plan-card.tsx:116` | +1 variant. No disabled variant for any other variant/size pair — those combinations do not occur. |
| `ABox/Card/KpiCard` | `deltaSign` = `positive` \| `negative`, across the 4 existing tones | `kpi-card.tsx:78` `delta.pct >= 0 ? "text-sage" : "text-destructive"` — both outcomes declared unconditionally, independent of `tone` | 4 → 8 variants (+4). The sign is runtime-computed; the absence of a negative literal at any call site is recorded verbatim rather than used to drop `negative`. |

### 3a-bis. Collision resolution — `KpiCard.delta`

Production `kpi-card.tsx:19` declares one optional prop, `delta?: { pct: number; label?: string }`, which carries **two separate** pieces of meaning that Figma cannot express in one property: whether the delta chip renders at all (`{delta && …}`, line 73) and which colour branch the chip takes (`delta.pct >= 0`, line 78). Two Figma properties are therefore required, and per the Figma property namespace they must carry distinct names.

- Presence → Boolean property **`hasDelta`**. The `has` prefix names the source guard `{delta && …}` exactly and is applied uniformly to every optional-render guard in B5 (see 3b), so nothing is invented for this one case.
- Sign → Variant property **`deltaSign`**, values **`positive`** and `negative`, named after the production comparison on `delta.pct`. It is a variant axis because it changes colour, which a Boolean visibility property cannot express — not to work around the naming conflict.

The production prop name `delta` is deliberately not used for either Figma property, so no component carries two properties called `delta`.

### 3b. Boolean component properties (layer visibility — they add no variants)

Naming rule, applied uniformly: a Figma Boolean that represents an optional-render guard `{prop && …}` is named `has<Prop>`; the production prop name itself stays reserved for the Text or Instance Swap property that carries the prop's content.

| Object | Boolean properties | Source guard |
| --- | --- | --- |
| `ABox/Header/PageHeader` | `hasEyebrow`, `hasIcon`, `hasDescription`, `hasActions` | `page-header.tsx:33,36,51,57` |
| `ABox/Card/KpiCard` | `hasIcon`, `hasDelta`, `hasHint` | `kpi-card.tsx:60,73,76,86` |
| `ABox/Feedback/EmptyState` | `hasIcon`, `hasBody`, `hasAction` | `empty-state.tsx:19,25,26` |

Total Boolean properties: 4 + 3 + 3 = **10**.

### 3c. Text component properties

`ABox/Action/Button` → `label`; `ABox/Status/StatusBadge` → `label`; `ABox/Card/KpiCard` → `label`, `value`; `ABox/Header/PageHeader` → `eyebrow`, `title`, `description`; `ABox/Nav/ModuleTab` → `label`; `ABox/Nav/WizardStep` → `label`; `ABox/Feedback/EmptyState` → `title`, `body`; `ABox/Form/LabeledField` → `label`; `ABox/Form/Input` → `placeholder`.

Total Text properties: 1 + 1 + 2 + 3 + 1 + 1 + 2 + 1 + 1 = **13**.

### 3c-bis. Instance Swap properties

Two production props are `React.ReactNode` slots filled by the caller, which is exactly what an Instance Swap represents: `ABox/Header/PageHeader` → `actions` (`page-header.tsx:19,57`) and `ABox/Feedback/EmptyState` → `action` (`empty-state.tsx:10,26`). Their presence is carried by the separately named Booleans `hasActions` / `hasAction`, so no name is used twice.

Total Instance Swap properties: **2**. The `icon?: ComponentType` props are **not** Instance Swaps: B4 created no icon component, so there is no swappable source; only the `hasIcon` Boolean and a placeholder vector exist, recorded as a limitation.

### 3d. Collision audit — complete

Every property name is checked for uniqueness inside its own component; a name may repeat across different components.

| Component | All Figma properties after B5 | Collision |
| --- | --- | --- |
| `ABox/Action/Button` | variant `variant`, variant `size`, variant `state`, text `label` | none |
| `ABox/Status/StatusBadge` | variant `tone`, text `label` | none |
| `ABox/Card/KpiCard` | variant `tone`, variant `deltaSign`, bool `hasIcon`, bool `hasDelta`, bool `hasHint`, text `label`, text `value` | resolved (`delta` → `hasDelta` + `deltaSign`) |
| `ABox/Header/PageHeader` | variant `variant`, bool `hasEyebrow`, bool `hasIcon`, bool `hasDescription`, bool `hasActions`, text `eyebrow`, text `title`, text `description`, swap `actions` | resolved (`eyebrow`/`description`/`actions` Booleans renamed to `has…`) |
| `ABox/Feedback/EmptyState` | bool `hasIcon`, bool `hasBody`, bool `hasAction`, text `title`, text `body`, swap `action` | resolved (`body`/`action` Booleans renamed to `has…`) |
| `ABox/Nav/ModuleTab` | variant `state`, text `label` | none |
| `ABox/Nav/WizardStep` | variant `state`, text `label` | none |
| `ABox/Form/LabeledField` | text `label` | none |
| `ABox/Form/Input` | text `placeholder` | none |
| `ABox/Action/ActionPill`, `ABox/Status/MetalBadge`, `ABox/Surface/Surface`, `ABox/Control/Control`, `ABox/Brand/AboxMark` | B4 variant axes only, no B5 property | none |

No B4 Figma object is renamed or recreated: the B4 descriptions merely recorded the intended properties in text, so B5 creates every property for the first time under its final name.

### 3e. Recalculated totals

| Count | Value | Arithmetic |
| --- | --- | --- |
| Component Sets | 11 | unchanged from B4 |
| Standalone Components | 3 | unchanged from B4 |
| Total component objects | 14 | 11 + 3 |
| Total variants | 57 | 52 + 1 (Button) + 4 (KpiCard) |
| Variant properties added by B5 | 2 | `Button.state`, `KpiCard.deltaSign` |
| Boolean properties | 10 | 4 + 3 + 3 |
| Text properties | 13 | 1+1+2+3+1+1+2+1+1 |
| Instance Swap properties | 2 | 1 + 1 |
| Total B5 non-variant properties | 25 | 10 + 13 + 2 |

### 3f. Combinations that must NOT be created

Button `state=disabled` on any variant/size other than `default`/`sm`; PageHeader `hasEyebrow=true` together with the `compact` variant (`page-header.tsx:33` suppresses it); MetalBadge, AboxMark, ActionPill, Surface, Control — no second axis; no Boolean or Text property is expanded into a variant; no Cartesian expansion of any axis.

## 4. Excluded states, with reasons

| Candidate | Reason |
| --- | --- |
| hover, group-hover, focus-visible, focus, active/pressed | CSS pseudo-classes; production treats them as interaction behaviour, not reusable design-system states. Documentation-only. |
| Input `disabled` | `ui/input.tsx:11` declares it but no production call site uses it; adding it would require converting the standalone `ABox/Form/Input` component into a set and changing B4 architecture. Documentation-only. |
| Control `disabled` | `control.tsx:11-12` explicitly leaves it consumer-owned; no canonical definition exists. |
| error / validation / `aria-invalid` | Only reference routes. |
| loading, checked, open/closed, expanded/collapsed, success | No production definition on any B4 object. |
| dialog, sheet, popover, tooltip, dropdown-menu, tabs states | Behavioural primitives — B6. |
| responsive `md:`/`xl:` branches (`page-header.tsx:37,44,46`, `kpi-card.tsx`, `ui/input.tsx:11`) | Layout composition, not component-level states — B7/B8. |
| motion: `CountUp`, `FadeRise`, `animate-hairline`, `transition-all`, `group-hover` rotate/scale | Motion; no reusable resting state beyond what already exists. |

## 5. Foundation bindings

Every B5 state reuses the existing foundations, from the production declaration and never from value equality: `disabled` = 50% layer opacity over the unchanged bound B3 styles (`disabled:opacity-50`); KpiCard `delta=up` binds `ABox/Semantic/sage`, `delta=down` binds `ABox/Semantic/destructive`; all other colour, elevation and typography references stay on the B3 styles and B1/B2 variables already attached in B4. No hard-coded foundation value is introduced.

## 6. Idempotency

Exact-name matching on set, variant, property and value. Existing variant or property = reuse and update in place. Duplicate property or value = STOP. Property-type mismatch (Boolean vs Text vs Variant) = STOP. Attempting to create a set or component that B4 already owns = STOP. Nothing is deleted. Run 2 creates zero B5 objects and reports ids identical to Run 1, including every pre-existing B4 id.

## 7. `b5-verify` — 25 checks

Exact affected objects; exact new variant property names; exact values; exact supported combinations; no duplication of any B4 variant; per-state production source mapping; B1/B2/B3 bindings resolve to existing objects; no hard-coded duplicate foundation value; no value-equality-derived state; no invented state; no pseudo-class rendered as a variant; responsive only where justified (zero); motion only where justified (zero); B4 architecture preserved with all pre-existing ids; B1 = 9/200; B2 = 1/19; B3 = 79; B4 objects = 11 sets + 3 components, variants 52 → 57 with arithmetic printed; pages unchanged (7, in order, only `01 Components` populated); no patterns/shells/screens/documentation; `git diff --stat -- src/` empty; `code.js` regenerated only by `node build.mjs`; offline Run 1 passes; offline Run 2 zero creations with identical ids; offline mock execution explicitly distinguished from real Figma Desktop execution.

Final line: `RESULT: B5 PASSED` or `RESULT: B5 FAILED — do not proceed to B6.`

## 8. Run procedure

Offline: `node tools/figma-plugin/extract-b5.mjs` → `node tools/figma-plugin/build.mjs` → mock harness runs B1, B2, B3, B4, then B5 twice; assert zero creations and identical ids on Run 2. Real: in Figma Desktop, inside `ABox Design System — Library`, **Create component states** → **Verify component states** → **Create component states** again; both outputs, with real ids, form the B5 final report. Mock ids are never presented as Figma ids.

## 9. Files

Created: `tools/figma-plugin/extract-b5.mjs`. Generated: `tools/figma-plugin/tokens-b5.js`, `tools/figma-plugin/code.js` (via `build.mjs` only, never hand-edited). Modified: `tools/figma-plugin/plugin.js` (B5 section + entry), `ui.html` (two buttons), `build.mjs` (concatenate `tokens-b5.js`), `README.md`, `.lovable/manual-work-map.md`.

No file under `src/**` is created, modified or deleted; no application UI, routing, navigation, branding, asset, responsiveness, business-logic or layout change; the proof file and every B0 page stay as they are.

## 10. Limitations recorded verbatim in the report

`ui/button.tsx:8` `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed` — only the opacity is visual; pointer-events and cursor have no Figma representation. `ui/input.tsx:11` `disabled:cursor-not-allowed disabled:opacity-50` — declared, never used in production; not converted. `control.tsx:11-12` — disabled variants consumer-owned. `kpi-card.tsx:78` — no negative `pct` literal occurs at any production call site; `delta=down` is included on the strength of the source branch and this absence is recorded. `page-header.tsx:33` — `eyebrow` is suppressed in `compact`; the combination is not created. Hover/focus/active/transition rules in `ui/button.tsx:8`, `action-pill.ts`, `surface.tsx`, `control.tsx`, `module-tabs.tsx:28`, `kpi-card.tsx:41,62`. Motion: `CountUp`, `FadeRise`, `animate-hairline`, `group-hover:-rotate-6 group-hover:scale-105`. Responsive `md:`/`xl:` rules deferred to B7/B8. `color-mix()` tints and `oklch()`, as already recorded in B3/B4.

## 11. Out of scope

B6 patterns/interactions, B7 shells, B8 screens, page population beyond the existing B4 placement, documentation content, library publishing, application changes, redesign, new standalone components, generic state or accessibility libraries.
