# Phase 52 / Batch B5 — Component variants & states (PLAN ONLY)

Plugin layer only. Nothing under `src/**` changes. B1 (9 collections / 200 variables), B2 (`ABox/Typography`, 19 variables), B3 (79 styles) and the B4 architecture (11 Component Sets + 3 standalone Components, 52 Variant ComponentNodes) are protected; B5 extends existing B4 objects in place.

Scope language, stated precisely (see §3b-bis): B5 creates **no new standalone Component** and **no new Component Set**, but it does create **4 new Variant ComponentNodes** inside the existing `ABox/Card/KpiCard` Component Set. Those 4 nodes are real new component nodes and are never described as "no new components".

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
| `ABox/Action/ActionPill` | variant `variant` (10) — authoritative name, see §3g-ter | text `label` |
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
| `ABox/Form/LabeledField` | none (standalone); it does contain a real nested `ABox/Control/Control` instance, asserted by `plugin.js:1814`, but that instance is **not** exposed — `isExposedInstance` is never set anywhere in `plugin.js` or `code.js` | text `label`; exposed nested instance `control` |
| `ABox/Form/Input` | none (standalone) | text `placeholder` |

B5 rule: read the live inventory; existing property = reuse in place with its id preserved; missing property = create; name/type mismatch = STOP.

## 2b. B4 / B5 boundary

Already in B4, not duplicated by B5: ActionPill `variant` (10), Button `variant` × `size`, StatusBadge `tone` (6), MetalBadge `tier` (6), Surface enumerated combinations, Control `height`/`focusRing`, KpiCard `tone` (4), PageHeader `default`/`compact`, ModuleTab `default`/`active`, WizardStep `current`/`done`/`upcoming`/`unreachable`, AboxMark `tone` (4). B5 renames nothing, recreates nothing and re-architects nothing.

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

### 3b-bis. `ABox/Card/KpiCard` — exact variant-node creation sequence

Adding a VARIANT property to an existing Component Set only assigns the property's value to the nodes already in the set; it does not produce the nodes the new axis requires. The negative branch therefore requires 4 new ComponentNodes created inside the existing set. Exact sequence:

1. Read and lock the live `ABox/Card/KpiCard` Component Set and its existing Variant ComponentNodes.
2. **Pre-write check (STOP on any mismatch):** exactly 4 originals exist, their `tone` values are exactly `default`, `primary`, `sage`, `warning`, one each, and no `deltaSign` value other than `positive` is present. Any deviation stops the run and prints the live matrix.
3. Add, or reuse if already present, the `deltaSign` VARIANT property on the existing set.
4. The 4 existing variants receive `deltaSign=positive` — the Figma-required value assignment for the new axis, not a production default (§3g-quater).
5. Create exactly 4 new ComponentNodes by duplicating the corresponding existing variants — one duplicate per tone, no other source node.
6. Append each duplicate to the same existing Component Set. No new set is created.
7. Set each duplicate's `deltaSign=negative`, preserving its source `tone`: `default+negative`, `primary+negative`, `sage+negative`, `warning+negative`.
8. Create no other tone/axis combination.
9. Duplicate no unrelated B4 component, set or variant.

**Visual mutation of each duplicated negative node** — deterministic, and the only content change B5 makes inside a variant:

10. On the duplicate, resolve the same delta node identified in §3i: third TEXT child, initial characters `"▲ 4.2%"`, named `delta`. Missing or ambiguous = STOP.
11. Set that node's characters to `"▼ 4.2%"`. This is not an invented production literal: it is the Figma construction rendering of the production branch at `kpi-card.tsx:81`, where the glyph flips on `delta.pct >= 0`.
12. Repoint that node's fill to the existing live B3 style used by the negative branch at `kpi-card.tsx:78` — `ABox/Semantic/destructive` — resolved by its live style identity. No hex, RGB, oklch or duplicate style is created, and no new style is added.
13. Change nothing else on the duplicate: tone styling, typography, geometry, spacing, elevation and every other B4 binding stay exactly as duplicated.

Positive variants are left untouched and keep `"▲ 4.2%"` with the existing `ABox/Semantic/sage` style from `kpi-card.tsx:78`.

Final state, stated exactly: `deltaSign=positive` → delta text `"▲ 4.2%"` + existing B3 `ABox/Semantic/sage`; `deltaSign=negative` → delta text `"▼ 4.2%"` + existing B3 `ABox/Semantic/destructive`. The numeric percentage remains a recorded limitation — `{delta.pct >= 0 ? "▲" : "▼"} {Math.abs(delta.pct).toFixed(1)}%` is computed at runtime, and the Figma text is sample/construction content, never a replacement for that computation.

Resulting matrix, exactly 8 nodes: `tone=default, deltaSign=positive` · `tone=default, deltaSign=negative` · `tone=primary, deltaSign=positive` · `tone=primary, deltaSign=negative` · `tone=sage, deltaSign=positive` · `tone=sage, deltaSign=negative` · `tone=warning, deltaSign=positive` · `tone=warning, deltaSign=negative`.

Idempotency for these nodes: Run 1 may create exactly 4 new negative Variant ComponentNodes. Run 2 matches existing negative variants by exact variant-property matrix (`tone` + `deltaSign`), reuses them in place, creates zero Variant ComponentNodes, and reports ids identical to Run 1. A duplicate negative variant for the same matrix is never created; encountering one is a STOP.

### 3c. Boolean properties (layer visibility — they add no variants)

Naming rule, applied uniformly: a Boolean representing an optional-render guard `{prop && …}` is named `has<Prop>`; the production prop name stays reserved for the Text or Instance Swap property carrying content.

| Object | Boolean properties | Source guard | B4 recorded name |
| --- | --- | --- | --- |
| `ABox/Header/PageHeader` | `hasEyebrow`, `hasIcon`, `hasDescription`, `hasActions` | `page-header.tsx:33,36,51,57` | `eyebrow`, `icon`, `description`, `actions` |
| `ABox/Card/KpiCard` | `hasIcon`, `hasDelta`, `hasDeltaLabel`, `hasHint` | `kpi-card.tsx:48` `{Icon && …}`, `:74` `{delta && …}`, `:84` `{delta?.label && <span className="text-muted-foreground">{delta.label}</span>}`, `:85` `{hint && …}` | `icon`, `delta`, `hint` (no B4 name for the delta label — new in B5) |
| `ABox/Feedback/EmptyState` | `hasIcon`, `hasBody`, `hasAction` | `empty-state.tsx:18,23,24` | `icon`, `body` (+ `action` slot) |

Booleans: 4 (PageHeader) + 4 (KpiCard) + 3 (EmptyState) = **11**. The renames from the B4 recorded names are forced by the collision rule and touch no existing Figma object, since no Boolean exists yet.

### 3d. Text properties

`ABox/Action/ActionPill` → `label`; `ABox/Action/Button` → `label`; `ABox/Status/StatusBadge` → `label`; `ABox/Status/MetalBadge` → `label`; `ABox/Card/KpiCard` → `label`, `value`, `deltaLabel`; `ABox/Header/PageHeader` → `title`, `eyebrow`, `description`; `ABox/Nav/ModuleTab` → `label`; `ABox/Nav/WizardStep` → `label`; `ABox/Feedback/EmptyState` → `title`, `body`; `ABox/Form/LabeledField` → `label`; `ABox/Form/Input` → `placeholder`.

Text: 1+1+1+1+3+3+1+1+2+1+1 = **16** — the 15 `textProps` recorded in `tokens-b4.js` plus `KpiCard.deltaLabel` added in §3d-bis.

### 3d-bis. `delta.label` — corrected

Source findings from `src/components/abox/kpi-card.tsx`:

1. Rendered: yes. `:84` `{delta?.label && <span className="text-muted-foreground">{delta.label}</span>}` — caller-supplied text, output verbatim with no transformation.
2. Declared at `:12` as `delta?: { pct: number; label?: string }`; it sits inside the `(delta || hint)` row opened at `:72`, beside the pct chip (`:74-83`) and `hint` (`:85`).
3. Call sites supplying `delta`, all real production routes: `app.dashboard.tsx:32,33,34` pass `{ pct: … }` with **no** label; `app.index.tsx:85,86,88` pass literal strings — `"this month"`, `"this week"`, `"vs. last month"`. So the field is optional in practice and always a literal when present; never computed.
4. It becomes a Figma **Text** property: it is caller-supplied text rendered unchanged, exactly like `label` and `value`.
5. Exact final name: `deltaLabel`. Figma property names are flat, so the nested React path `delta.label` cannot be used literally, and `delta` is already excluded by the collision rule (§3b). `deltaLabel` is the minimal flattening of the production path, introduces no new concept, and pairs with the separate presence guard `hasDeltaLabel` required by the independent `delta?.label &&` check at `:84` — that guard is distinct from `hasDelta` at `:74`, because `app.dashboard.tsx:32` proves delta can be present while its label is absent.

Mapping: `delta.label` (`kpi-card.tsx:12`, rendered `:84`) → Boolean `hasDeltaLabel` + Text `deltaLabel`. Default text content: `"this month"`, the literal at `app.index.tsx:85`; default `hasDeltaLabel = true` since a production call site supplies it. No other default is invented.

The pct chip text at `:81` (`{delta.pct >= 0 ? "▲" : "▼"} {Math.abs(delta.pct).toFixed(1)}%`) is **not** a text property: it is computed from a numeric prop through `Math.abs(...).toFixed(1)` plus a glyph chosen by the same branch that drives `deltaSign`; recorded as a limitation, not flattened into caller-editable text.

### 3d-ter. Complete final `ABox/Card/KpiCard` property inventory

| Type | Name | Values / content | Source | Production default? | Figma construction value |
| --- | --- | --- | --- | --- | --- |
| Variant | `tone` | `default`, `primary`, `sage`, `warning` | `:15`, `TONE` `:26-31` | **yes** — `:33` `tone = "default"` | `default` (same as the declared default) |
| Variant | `deltaSign` | `positive`, `negative` | `:78` `delta.pct >= 0 ? "text-sage" : "text-destructive"` | **no** — a runtime branch on `delta.pct`, not an API default | `positive`, required only because Figma selects one variant as the set's default; chosen as the branch every production call site exercises |
| Boolean | `hasIcon` | show/hide icon tile | `:13` `icon?`, `:48` | **no** — optional prop, no declared default | `true`, from observed usage (all six call sites pass `icon`) |
| Boolean | `hasDelta` | show/hide pct chip | `:12` `delta?`, `:74` | **no** — optional prop | `true`, from observed usage |
| Boolean | `hasDeltaLabel` | show/hide the delta label text | `:12` `label?`, `:84` | **no** — optional and genuinely mixed in production: absent at `app.dashboard.tsx:32,33,34`, present at `app.index.tsx:85,86,88` | `true`, an arbitrary-but-source-observed starting state so the layer and its text property are visible in the default variant; the optionality is the source fact |
| Boolean | `hasHint` | show/hide hint | `:14` `hint?`, `:85` | **no** — optional prop | `false`, reflecting observed absence at every production call site, not a declared default |
| Text | `label` | metric label | `:10`, `:46` | **no** — required prop, no default | sample content `"Active members"` (`app.index.tsx:85`) |
| Text | `value` | metric value | `:11`, `:62-70` | **no** — required prop, no default | sample content, the literal at the same call site |
| Text | `deltaLabel` | delta caption | `:12`, `:84` | **no** | sample content `"this month"` (`app.index.tsx:85`) |

KpiCard property count: 2 variant + 4 Boolean + 3 Text = **9** (variants of the set: `tone` × `deltaSign` = 8, unchanged).

### 3e. Content slots — complete audit

`addComponentProperty("name", "INSTANCE_SWAP", defaultValue)` requires a default component key as part of the definition; `preferredValues` is optional on top of it. The two content slots therefore get different mechanisms, decided per slot from production evidence, not for uniformity.

| Production prop | Source type | Source evidence | Figma mechanism | Final name | Required default | Preferred values | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PageHeader `actions` | `React.ReactNode` | declared `page-header.tsx:16`; rendered `:55` `{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}`; call sites pass real B4 components — `ActionPill` at `marketplace.admin.readiness.tsx:28`, `StatusBadge` at `app.jet.branding.tsx:26` and `app.jet.platform.tsx:95` | Boolean `hasActions` + **INSTANCE_SWAP** | `hasActions`, `actions` | **Figma-required construction default** (INSTANCE_SWAP cannot be defined without one): the existing B4 variant `ABox/Action/ActionPill` `variant=primaryMd`, whose `key` is read live from the file and never hard-coded. Production declares no default for `actions`; this value is selected from the real call site `marketplace.admin.readiness.tsx:28` and is labelled a construction default everywhere | `ABox/Action/ActionPill` (all 10 variants), `ABox/Status/StatusBadge` (all 6 tones) | Instance Swap is faithful because production genuinely supplies reusable ABox components into this region, so a real component can satisfy Figma's required default without inventing one |
| EmptyState `action` | `React.ReactNode` | declared `empty-state.tsx:9`; rendered `:24` as bare `{action}`; every call site passes a raw inline `<Link>`/`<button>` with pill utility classes — `plans.index.tsx:344`, `cart.tsx:59`, `review.tsx:50`, `apply.tsx:96`, `compare.tsx:83`, `member.quotes.tsx:29`, `handoff.tsx:37` | Boolean `hasAction` + **SLOT** (see §3e-ter for the runtime capability gate) | `hasAction`, `action` | none — a SLOT takes no default component | n/a | No B4 component is ever passed here, so INSTANCE_SWAP could only be defined by nominating a component production never uses. Naming `ActionPill` because its pill classes look similar would be exactly the value-equality inference this batch forbids. A SLOT is the faithful representation of an arbitrary consumer-owned content region |
| PageHeader `icon` | `ComponentType<{className?: string}>` | `page-header.tsx:15,30-35` | Boolean only | `hasIcon` | — | — | no B4 icon Component exists; non-swappable, limitation preserved |
| KpiCard `icon` | `ComponentType<{className?: string}>` | `kpi-card.tsx:20,60` | Boolean only | `hasIcon` | — | — | same |
| EmptyState `icon` | `ComponentType<{className?: string}>` | `empty-state.tsx:6,18-22` | Boolean only | `hasIcon` | — | — | same |
| LabeledField control slot | `children: React.ReactNode` | `field.tsx:16-30`; control explicitly consumer-owned `field.tsx:11-14` | exposed nested instance (node flag, not a property) | nested instance layer `control` | — | — | B4 already nests a real `ABox/Control/Control` instance (`plugin.js:1814`) but never exposed it — see §3e-bis |

### 3e-ter. SLOT decision for `EmptyState.action` — two conditions, deterministic outcome

Runtime capability alone cannot authorise creation. A SLOT is created only when **both** hold:

1. the runtime supports SLOT, **and**
2. the exact production-equivalent EmptyState action target region exists in the B4 object and can be attached or converted without rebuilding unrelated B4 structure.

Condition 1 is still checked, and the check is **non-mutating**: the plugin inspects the runtime surface only (`typeof figma.createSlot === "function"` and the SLOT entry in the runtime's component-property type surface) before any write. It never calls `addComponentProperty()` to discover support, never creates a probe property, never creates-then-deletes anything, and no temporary property may exist in the document at any point.

Condition 2 is **false** in the audited B4 object: EmptyState has exactly two TEXT children and no action region, wrapper or nested instance (§3i).

Deterministic outcome, regardless of the runtime answer: `runtime SLOT supported?` → reported · `target region exists?` → **false** · SLOT properties created → **0** · `EmptyState.action` content properties created → **0**. The plugin prints both results, plus the verbatim limitation citing `empty-state.tsx:9,24` and every call site. No detached SLOT, no probe property, no invented wrapper, frame, button or link, no B4 layer added to make a slot possible, and no fallback to INSTANCE_SWAP. Run 1 and Run 2 report the same capability result, the same target-absence result and the same zero creation.

Counts: INSTANCE_SWAP properties **0**; SLOT properties **0**; exposed nested instances **1**. No other production prop is a content slot: every remaining optional prop is a string or a `ComponentType` icon.

### 3e-bis. `LabeledField.control` — corrected

Audit result, from the real implementation: `plugin.js:1811-1814` builds `ABox/Form/LabeledField` with a genuine nested `ABox/Control/Control` **instance** and verifies it ("LabeledField nests a real ABox/Control/Control instance"). But `isExposedInstance` appears nowhere in `plugin.js` or `code.js`; the only `exposedInstances` occurrences are the `tokens-b4.js` data (`code.js:4787`) and the description printer (`plugin.js:1690`). **B4 therefore did not expose the nested instance in the live Figma component.** The earlier plan wording "already exposed in B4" was wrong and is withdrawn.

B5 correction, using the exact Figma mechanism rather than a property:

- Representation: set `isExposedInstance = true` on the existing nested `ABox/Control/Control` instance inside `ABox/Form/LabeledField`. This is a node flag on an instance, not an Instance Swap component property and not a Boolean.
- Why not an Instance Swap property: production `children` is an arbitrary consumer-owned node (`field.tsx:11-14`, `:23`) with no single swappable production default; exposing the nested instance gives the designer the real Control's own properties without inventing a swap target. Figma's native swap on the exposed instance still allows substitution.
- Exact name: the nested instance layer keeps the name `control`, matching the `exposedInstances` entry already recorded in `tokens-b4.js`. Figma derives the exposed-instance label from that layer name, so no technical rename is required.
- Affected object: `ABox/Form/LabeledField` (standalone Component, id read live and printed in the report) → nested instance of `ABox/Control/Control` (id read live and printed). Both ids are reported from the real Figma run, never from the offline mock.
- Idempotency: if `isExposedInstance` is already true, it is left in place and counted as reused. If the nested instance is missing, STOP — B5 does not rebuild B4 structure.

Exposed nested instances: **1**. It adds nothing to the Boolean, Text or Instance Swap counts, because it is not a component property.

### 3f. Collision audit — complete

Names must be unique within a component; repetition across components is fine.

| Component | All Figma properties after B5 | Collision |
| --- | --- | --- |
| `ABox/Action/ActionPill` | variant `variant`, text `label` | none — no `action` variant axis exists (§3g-ter) |
| `ABox/Action/Button` | variant `variant`, variant `size`, text `label` | none |
| `ABox/Status/StatusBadge` | variant `tone`, text `label` | none |
| `ABox/Status/MetalBadge` | variant `tier`, text `label` | none |
| `ABox/Surface/Surface` | B4 axes only | none |
| `ABox/Control/Control` | B4 axes only | none |
| `ABox/Card/KpiCard` | variant `tone`, variant `deltaSign`, bool `hasIcon`, `hasDelta`, `hasDeltaLabel`, `hasHint`, text `label`, `value`, `deltaLabel` | resolved (`delta` → `hasDelta` + `deltaSign`; `delta.label` → `hasDeltaLabel` + `deltaLabel`, §3d-bis); all nine names unique within the component |
| `ABox/Header/PageHeader` | variant `variant`, bool `hasEyebrow`, `hasIcon`, `hasDescription`, `hasActions`, text `title`, `eyebrow`, `description`, swap `actions` | resolved (Booleans renamed `has…`; `actions` kept as the content slot) |
| `ABox/Nav/ModuleTab` | variant `state`, text `label` | none |
| `ABox/Nav/WizardStep` | variant `state`, text `label` | none |
| `ABox/Brand/AboxMark` | variant `tone` | none |
| `ABox/Feedback/EmptyState` | bool `hasIcon`, `hasBody`, `hasAction`, text `title`, `body`, slot `action` (subject to the §3e-ter gate) | resolved (`body` → `hasBody` + text `body`; `action` → `hasAction` + slot `action`) |
| `ABox/Form/LabeledField` | text `label`; plus the nested `ABox/Control/Control` instance named `control` flagged `isExposedInstance = true` — a node flag, not a property (§3e-bis) | none |
| `ABox/Form/Input` | text `placeholder` | none |

### 3g. Recalculated totals — actual Figma objects

| Count | Value | Arithmetic |
| --- | --- | --- |
| Component Sets | 11 | unchanged |
| Standalone Components | 3 | unchanged |
| Top-level component objects | 14 | 11 sets + 3 standalone Components — this is **not** a count of physical ComponentNodes |
| Variant ComponentNodes before B5 | 52 | B4 |
| Variant ComponentNodes after B5 | 56 | 52 + 4 (KpiCard 4 → 8); Button unchanged at 9 |
| **Newly created B5 Variant ComponentNodes** | **4** | KpiCard `default/primary/sage/warning` × `deltaSign=negative`, per §3b-bis |
| Total physical ComponentNodes after B5 | 59 | 56 Variant ComponentNodes + 3 standalone Components (was 55 after B4) |
| New standalone Components created by B5 | 0 | none |
| New Component Sets created by B5 | 0 | none |
| Variant properties existing after B4 | **16 axes** (corrected from the earlier "13"; see §3g-bis) | 1 + 2 + 1 + 1 + 4 + 2 + 1 + 1 + 1 + 1 + 1 = 16, read from `tokens-b4.js` and re-read from the live sets at run time |
| Variant properties created by B5 | 1 | `KpiCard.deltaSign` |
| Variant properties reused unchanged | all B4 axes | none renamed, none removed |
| Boolean properties created | **4** (documented target 11) | only those with a real target layer: KpiCard `hasDelta`, PageHeader `hasEyebrow`, `hasDescription`, EmptyState `hasBody` — see §3i |
| Text properties created | **15** (documented target 16) | 1+1+1+1+2+3+1+1+2+1+1 = 15; `KpiCard.deltaLabel` has no target layer — see §3i |
| Instance Swap properties created | **0** (documented target 1) | PageHeader has no nested actions instance in B4; creating a detached swap = STOP — see §3i |
| SLOT properties created | **0** (documented target 1) | EmptyState has no action region to convert; capability still detected read-only and printed — see §3e-ter, §3i |
| Non-variant properties created | **19** | 4 + 15 + 0 + 0 = 19 |
| Exposed nested instances flagged | 1 | `LabeledField` → existing nested `ABox/Control/Control` named `control`; not a property, so not part of the 19 |
| Blocked properties, deferred to a B4 amendment | **10** | 7 Boolean + 1 Text + 1 Instance Swap + 1 SLOT = 10, itemised in §3i; none created, each recorded verbatim. Created 19 + deferred 10 = 29, the documented production-faithful non-variant target |
| Total B5 object additions/updates | 20 changes + 4 new Variant ComponentNodes | 19 properties + 1 exposed instance flag; variants 52 → 56 |
| Properties reused in place (already real in Figma) | 0 Boolean / 0 Text / 0 Swap | proven by §2 audit; re-proven at run time against the live inventory |

### 3g-bis. B4 variant-axis audit — corrected

The earlier figure "13 axes" was prose, and it was wrong: it counted `Surface` as one axis and omitted the multi-axis structure. The table below is read directly from the authoritative B4 definition in `tools/figma-plugin/tokens-b4.js` — the same data the plugin feeds to `combineAsVariants` — and is re-read from the live `componentPropertyDefinitions` of every set at run time before any B5 change, with the live output printed in the report.

| Component Set | Axis count | Axis names | Variant values | Variant count |
| --- | --- | --- | --- | --- |
| `ABox/Action/ActionPill` | 1 | `variant` | primaryXs, primaryMd, primaryLg, outlineXs, outlineSm, outlineSmCard, outlineMd, outlineLg, outlineMdPlain, primaryLgPlain | 10 |
| `ABox/Action/Button` | 2 | `variant`, `size` | default/default, default/sm, ghost/default, ghost/icon, ghost/icon-sm, ghost/sm, outline/default, outline/icon, outline/sm | 9 |
| `ABox/Status/StatusBadge` | 1 | `tone` | sage, primary, warning, muted, destructive, info | 6 |
| `ABox/Status/MetalBadge` | 1 | `tier` | Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic | 6 |
| `ABox/Surface/Surface` | **4** | `padding`, `elevated`, `interactiveHover`, `decor` | padding=lg/false/false/false, padding=md/false/false/false, padding=md/true/false/false, padding=sm/false/false/false | 4 |
| `ABox/Control/Control` | 2 | `height`, `focusRing` | height=lg, focusRing=true | 1 |
| `ABox/Card/KpiCard` | 1 → 2 after B5 | `tone` (+ `deltaSign`) | default, primary, sage, warning | 4 → 8 |
| `ABox/Header/PageHeader` | 1 | `variant` | default, compact | 2 |
| `ABox/Nav/ModuleTab` | 1 | `state` | default, active | 2 |
| `ABox/Nav/WizardStep` | 1 | `state` | current, done, upcoming, unreachable | 4 |
| `ABox/Brand/AboxMark` | 1 | `tone` | primary, sage, sidebar, foreground | 4 |

`ABox/Surface/Surface` is confirmed: four real variant axes, four enumerated variants — the sparse set of combinations actually present at production call sites, not the 4-axis Cartesian product. `ABox/Control/Control` likewise has two axes with a single enumerated combination.

Arithmetic:

- Live B4 axes: `1 + 2 + 1 + 1 + 4 + 2 + 1 + 1 + 1 + 1 + 1 = 16`.
- Live B4 variants: `10 + 9 + 6 + 6 + 4 + 1 + 4 + 2 + 2 + 4 + 4 = 52`. Confirms the locked B4 baseline.
- B5 new axes: `1` (`KpiCard.deltaSign`) → `16 + 1 = 17` after B5.
- B5 new variants: KpiCard `4 → tone(4) × deltaSign(2) = 8`, `+4` → `52 + 4 = 56`.
- Recomputed total after B5: `10 + 9 + 6 + 6 + 4 + 1 + 8 + 2 + 2 + 4 + 4 = 56`. Both routes agree.

This is a count correction to the plan text only. No B4 component, set, variant, axis or property is recreated, renamed, reordered or re-architected; Surface and Control are read and left exactly as they are.

### 3g-ter. `ABox/Action/ActionPill` axis name — authoritative resolution

The earlier B4 audit line called this axis `action`; §3g-bis called it `variant`. Resolved from the generated source rather than prose:

- `tools/figma-plugin/tokens-b4.js:19` — `"property": "variant"` on the ActionPill set entry.
- `tools/figma-plugin/plugin.js:1613` — `b4VariantName()` returns `set.property + "=" + value.value`, so the live single-axis variant names are built from exactly that string.
- `code.js` is generated from those two by `build.mjs` and carries the same value.

**Authoritative name: `variant`.** Every occurrence of `action` as this axis name is a plan-text error and is corrected throughout — B4 audit, boundary section, tables, axis audit, verification, idempotency, final report. The production prop is also literally `variant` in `action-pill.ts` usage, so no rename of any live object is implied.

Live-vs-source guard: before any B5 change the plugin reads the live `componentPropertyDefinitions` of `ABox/Action/ActionPill` and asserts a single axis named exactly `variant`. If the live file reports a different name, the run **STOPs** and prints both names. It never renames, recreates or re-architects the property to make them agree.

### 3g-quater. Production defaults vs Figma construction values

Rule for the whole plan: a value is a **production default** only when the production source literally declares it. Everything else is either a **Figma construction value** (Figma cannot define the property or the set without one) or **sample content** (a real production literal authored into a text layer). No observed call-site value is described as a production default anywhere.

| Component | Property | Production default? | Production evidence | Figma construction value | Reason |
| --- | --- | --- | --- | --- | --- |
| KpiCard | `tone` | yes | `kpi-card.tsx:33` `tone = "default"` | `default` | genuine declared default |
| KpiCard | `deltaSign` | no | `:78` runtime branch on `delta.pct` | `positive` | Figma requires one variant to be the set default; `positive` is the only branch exercised by production call sites, `negative` remains a real value from the source branch |
| KpiCard | `hasIcon` | no | `:13` `icon?` optional | `true` | Boolean needs an initial value; taken from observed usage |
| KpiCard | `hasDelta` | no | `:12` `delta?` optional | `true` | same |
| KpiCard | `hasDeltaLabel` | no | `:12` `label?` optional; absent at `app.dashboard.tsx:32-34`, present at `app.index.tsx:85,86,88` | `true` | same; optionality is the source fact and is preserved |
| KpiCard | `hasHint` | no | `:14` `hint?` optional | `false` | observed absence at every call site, not a declared default |
| KpiCard | `label` / `value` / `deltaLabel` | no | required/optional props, no declared defaults | sample content from `app.index.tsx:85` | Figma text layers must contain characters |
| PageHeader | `variant` | yes | `page-header.tsx` declares the default variant | `default` | genuine declared default |
| PageHeader | `hasEyebrow` / `hasIcon` / `hasDescription` / `hasActions` | no | all optional props | from observed usage, labelled construction values | Boolean needs an initial value |
| PageHeader | `actions` (INSTANCE_SWAP) | no | `:16` `React.ReactNode`, no default | `ABox/Action/ActionPill` `variant=primaryMd` | INSTANCE_SWAP cannot be defined without a default component; a real production-passed component is used, none invented |
| PageHeader / ModuleTab / WizardStep / StatusBadge / MetalBadge / ActionPill / Button / Surface / Control / AboxMark | text properties | no | required props | sample content from real call sites | text layers must contain characters |
| EmptyState | `hasIcon` / `hasBody` / `hasAction` | no | all optional props | from observed usage | Boolean needs an initial value |
| EmptyState | `action` (SLOT) | no | `:9` `React.ReactNode` | none — SLOT takes no default | no fake default component is introduced |
| AboxMark | `tone` | yes | `logo.tsx` declares `tone` with a default branch | declared value | genuine declared default |


### 3h. Combinations that must NOT be created

No Button `state` axis and no Button variant added. PageHeader `hasEyebrow = true` together with `compact` (`page-header.tsx:33` suppresses it) is not a supported combination. MetalBadge, AboxMark, ActionPill, Surface, Control gain no second axis. No Boolean or Text property is expanded into a variant, and no property is converted into a variant to avoid a name clash. No Cartesian expansion beyond the schema-complete KpiCard matrix required by the Figma Component Set model.

### 3i. Property-to-layer binding — layer reality audit (supersedes the counts above)

A Figma component property is inert until it is attached to a sublayer through `componentPropertyReferences`: BOOLEAN → `visible`, TEXT → `characters`, INSTANCE_SWAP → `mainComponent`, SLOT → the slot-content reference. Creating a definition without attaching it produces a property that controls nothing, so B5 creates a property **only** when its exact target layer exists.

**Audit of what B4 actually built** (`tokens-b4.js` node trees, built by `b4Build()` at `plugin.js:1550-1581`). Two facts govern everything below:

1. `b4Build()` never assigns `name` to any sublayer — every frame, text, ellipse and instance it creates is unnamed. Targets must therefore be resolved structurally (child index + node type + exact `characters` + bound text style) and then **named** by B5 so the binding is addressable and auditable. Naming an existing layer changes no geometry, style, variant or id; it is recorded as the only B5 mutation of B4 node metadata.
2. Several layers assumed by the earlier property list **do not exist**. KpiCard has exactly three TEXT children (`"METRIC"`, `"1,280"`, `"▲ 4.2%"`) — no icon tile, no hint layer, no separate delta-label text. PageHeader has exactly three TEXT children (`"SECTION"`, `"Page title"`, `"Supporting description."`) — no icon layer, no actions wrapper, no nested instance. EmptyState has exactly two TEXT children (`"Nothing here yet"`, `"Supporting copy."`) — no icon layer, no action region.

Per the STOP rule, a property whose target layer is missing is **not created**. Adding those layers would be B4 re-architecture, which is out of scope. They are recorded as blocked and carried to a B4 amendment decision.

**Bindings B5 creates (19 properties + 1 exposed instance):**

| Component | Figma property | Type | Production source / guard | Exact target layer | Reference field | Binding rule |
| --- | --- | --- | --- | --- | --- | --- |
| ActionPill | `label` | TEXT | `action-pill-component.tsx` children | sole TEXT child, chars `"Action"` → named `label` | `characters` | resolve by index 0 + type TEXT; missing or duplicated = STOP |
| Button | `label` | TEXT | `ui/button.tsx` children | sole TEXT child, chars `"Button"` → named `label` | `characters` | as above |
| StatusBadge | `label` | TEXT | `status-badge.tsx` children | TEXT child at index 1 (index 0 is the ELLIPSE dot), chars `"STATUS"` → named `label` | `characters` | ELLIPSE must be present at index 0, else STOP |
| MetalBadge | `label` | TEXT | `metal-badge.tsx` children | sole TEXT child, chars `"TIER"` → named `label` | `characters` | as above |
| KpiCard | `label` | TEXT | `kpi-card.tsx:10,46` | TEXT index 0, chars `"METRIC"`, text style `ABox/Text/eyebrow` → named `label` | `characters` | style + chars must both match, else STOP |
| KpiCard | `value` | TEXT | `:11,62-70` | TEXT index 1, chars `"1,280"` → named `value` | `characters` | as above |
| KpiCard | `hasDelta` | BOOLEAN | `:12,74` `{delta && …}` | TEXT index 2, chars `"▲ 4.2%"` → named `delta` | `visible` | guards only this chip, never the card frame |
| PageHeader | `eyebrow` | TEXT | `page-header.tsx:14` | TEXT index 0, chars `"SECTION"`, style `ABox/Text/eyebrow` → named `eyebrow` | `characters` | STOP on mismatch |
| PageHeader | `hasEyebrow` | BOOLEAN | `:14,33` | same `eyebrow` node | `visible` | subregion only |
| PageHeader | `title` | TEXT | `:13` | TEXT index 1, chars `"Page title"` → named `title` | `characters` | |
| PageHeader | `description` | TEXT | `:17` | TEXT index 2, chars `"Supporting description."` → named `description` | `characters` | |
| PageHeader | `hasDescription` | BOOLEAN | `:17` optional | same `description` node | `visible` | subregion only |
| ModuleTab | `label` | TEXT | `module-tabs.tsx` | sole TEXT child → named `label` | `characters` | |
| WizardStep | `label` | TEXT | `downline-wizard-stepper.tsx` | sole TEXT child → named `label` | `characters` | |
| EmptyState | `title` | TEXT | `empty-state.tsx:7` | TEXT index 0, chars `"Nothing here yet"` → named `title` | `characters` | |
| EmptyState | `body` | TEXT | `:8` | TEXT index 1, chars `"Supporting copy."` → named `body` | `characters` | |
| EmptyState | `hasBody` | BOOLEAN | `:8` optional | same `body` node | `visible` | subregion only |
| LabeledField | `label` | TEXT | `field.tsx:15` | TEXT index 0, chars `"LABEL"` → named `label` | `characters` | |
| Input | `placeholder` | TEXT | `ui/input.tsx` | sole TEXT child, chars `"Placeholder"` → named `placeholder` | `characters` | |
| LabeledField | `control` | exposed nested instance | `field.tsx:16-30` | INSTANCE child at index 1, main component `ABox/Control/Control` → named `control` | `isExposedInstance = true` | node flag, not a property; instance must already exist, else STOP; never recreated |

Totals created: **15 TEXT + 4 BOOLEAN = 19 properties**, plus 1 exposed nested instance, plus the `deltaSign` variant axis and its 4 new Variant ComponentNodes (§3b-bis).

**Blocked — property not created because its target layer does not exist in B4:**

| Component | Property | Missing target | Consequence |
| --- | --- | --- | --- |
| KpiCard | `hasIcon` | no icon tile layer (`kpi-card.tsx:48-58` not built by B4) | not created; recorded verbatim |
| KpiCard | `hasHint` | no hint layer (`:85`) | not created; recorded verbatim |
| KpiCard | `hasDeltaLabel` / `deltaLabel` | no delta-label TEXT (`:84`); the third TEXT is the computed pct chip, already a recorded limitation | neither Boolean nor Text created |
| PageHeader | `hasIcon` | no icon layer (`:15`) | not created |
| PageHeader | `hasActions` / `actions` | no actions wrapper and no nested instance (`:16,55`) | Boolean and INSTANCE_SWAP both not created; INSTANCE_SWAP with no nested instance = STOP per the binding rule |
| EmptyState | `hasIcon` | no icon layer (`:6`) | not created |
| EmptyState | `hasAction` / `action` | no action region (`:9,24`) — nothing exists to convert into a slot without rebuilding B4 structure | Boolean and SLOT both not created; SLOT capability is still detected read-only and printed, but no detached SLOT is created |

Revised inventory, superseding §3g: BOOLEAN **4**, TEXT **15**, INSTANCE_SWAP **0**, SLOT **0**, non-variant total **19**; exposed nested instances **1**; new variant axes **1**; new Variant ComponentNodes **4**. The wider set (11 Boolean / 16 Text / 1 Swap / 1 SLOT) remains the documented production-faithful target and is deferred to a B4 amendment that adds the missing layers; B5 does not add them.

**Attachment procedure, every property:** read live property definitions first → if missing, create → immediately attach the returned property id to the exact resolved sublayer and reference field → if it already exists, verify its reference points at the correct layer and field → wrong layer = STOP, never silently re-pointed → target layer missing, ambiguous or duplicated = STOP → never create a second property because a reference is missing. Text properties additionally verify the target's initial `characters` equal the approved construction/sample value from §3g-quater; Booleans verify the initial value and that the reference is the subregion node, never the component frame.

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

Variant ComponentNodes specifically: Run 1 creates exactly 4 (the KpiCard negative row, §3b-bis); Run 2 creates 0, matching each negative variant by its exact `tone` + `deltaSign` matrix and reusing it with the same id. A second negative node for an existing matrix is never created; finding one is a STOP.

SLOT capability: detected read-only before any write, deterministic, and asserted identical on Run 1 and Run 2. No probe property is ever created, and none may exist in the document.

## 7. `b5-verify` — 25 checks

1. B4 existing property inventory is read and printed first. 1a. Every live B4 variant-property name matches the expected name exactly, `ABox/Action/ActionPill` asserted as the single axis `variant` per §3g-ter; any mismatch between live Figma and the generated source data is a STOP with both names printed, never a silent rename or recreate. 1b. Default audit: every property carrying an initial value is printed with its classification — production default, Figma construction value, or sample content — matching §3g-quater row for row; no observed call-site value is labelled a production default, every Figma-required construction value is labelled as such, and no value appears that is not either declared in production or a literal read from a real production call site. 2. No existing B4 property is recreated; every pre-existing property id is preserved, and no B4 property is renamed. 3. No B4 component, set or variant is renamed, deleted or re-architected. 4. Exactly one new variant property exists: `KpiCard.deltaSign` with values `positive`, `negative`. 4a. Live B4 axis audit printed before any change and matching §3g-bis exactly — per set: axis count, axis names, variant values, variant count; totals `1+2+1+1+4+2+1+1+1+1+1 = 16` axes and `10+9+6+6+4+1+4+2+2+4+4 = 52` variants; `ABox/Surface/Surface` asserted at 4 axes (`padding`, `elevated`, `interactiveHover`, `decor`) with 4 variants and `ABox/Control/Control` at 2 axes with 1 variant; after B5, `16 + 1 = 17` axes and `10+9+6+6+4+1+8+2+2+4+4 = 56` variants, both routes agreeing; any live deviation from this table is a STOP. 5. Component Set schema consistency: every variant of every set carries a value for every variant property of that set — asserted for all 11 sets, KpiCard included at `tone` × `deltaSign` = 8. 6. `ABox/Action/Button` still has exactly the axes `variant` × `size` and exactly 9 variants; no `state` property exists on it. 7. Per component, every property name is unique and no name is used for two property types — asserted against the §3f table. 8. Boolean = 4, Text = 15, Instance Swap = 0, SLOT = 0, non-variant total = `4 + 15 + 0 + 0 = 19`, with the arithmetic printed, matching §3i row for row. 8a. **Binding verification, every property:** property id, property name, property type, default/construction value, target node id, target node name, reference field (`visible`, `characters`, `mainComponent`, slot-content reference or exposed-instance flag), expected relationship and actual relationship are all printed; a property with the correct name and type but attached to the wrong layer, or attached to nothing, FAILS. Boolean references must point at the subregion node, never the component frame. Text references must point at a TEXT node whose initial characters equal the approved construction/sample value. 8b. **Layer resolution audit:** every target is resolved structurally (child index, node type, exact characters, bound text style) and then named per the §3i table; missing, ambiguous or duplicated target = STOP; no generic or guessed layer name is used. 8c. **Blocked inventory printed:** exactly the 10 deferred properties of §3i (7 Boolean + 1 Text + 1 Instance Swap + 1 SLOT), with the arithmetic `19 created + 10 deferred = 29` printed, are absent, each with its missing target layer and production source, recorded verbatim; none is substituted, approximated or created detached. 8d. `ABox/Card/KpiCard` carries exactly five properties — variant `tone`, variant `deltaSign`, Boolean `hasDelta` bound to the `delta` chip's `visible`, Text `label` and `value` bound to their `characters` — and `hasIcon`, `hasHint`, `hasDeltaLabel`, `deltaLabel` are absent with their reasons printed. 9. Exact property names per component match §3i; no content slot is collapsed into a Boolean and no substitute content mechanism is invented — `PageHeader.actions` and `EmptyState.action` are absent because their target layers are absent, printed verbatim rather than created detached; every `ComponentType` icon prop remains unrepresented for the same reason. 10. Per-state production source mapping printed for every B5 property and value; `ABox/Form/LabeledField` contains exactly one nested `ABox/Control/Control` instance named `control` with `isExposedInstance === true`, printed with the component id and the nested instance id, and it is counted as an exposed nested instance (1), not as a component property. 11. B1/B2/B3 bindings resolve to existing objects. 12. No hard-coded duplicate foundation value. 13. No value-equality-derived state. 14. No invented state and no invented variant value. 15. No property converted into a variant to avoid a name clash. 16. No pseudo-class rendered as a variant. 17. Responsive only where justified (zero); motion only where justified (zero). 18. B1 = 9 collections / 200 variables. 19. B2 = 1 collection / 19 variables. 20. B3 = 79 styles. 21. Component Sets = 11, standalone Components = 3, Variant ComponentNodes = `52 + 4 = 56`, newly created B5 Variant ComponentNodes = 4, total physical ComponentNodes = `56 + 3 = 59`; each figure printed separately and the 14 top-level objects never reported as a ComponentNode count. 21a. KpiCard pre-write check printed: exactly 4 originals with tones `default`/`primary`/`sage`/`warning`, one each — mismatch = STOP; post-write matrix printed as the exact 8 `tone` × `deltaSign` pairs with node ids, and no unrelated B4 node duplicated. 21a-bis. **KpiCard visual-state verification, all 8 final variants:** each node's `deltaSign` value matches its intended matrix position; the 4 positive nodes carry delta text `"▲ 4.2%"` and a fill resolving to the existing B3 `ABox/Semantic/sage` style; the 4 negative nodes carry delta text `"▼ 4.2%"` and a fill resolving to the existing B3 `ABox/Semantic/destructive` style; no duplicated or hard-coded foundation style, hex, RGB or oklch value exists on any of them; no other layer, style, typography, geometry, spacing or elevation binding differs between a negative node and its positive source. 21b. No temporary or probe SLOT property exists anywhere in the document. 21c. No `EmptyState.action` property of any type exists; no temporary or probe SLOT exists anywhere; the runtime SLOT capability result is printed and may be true or false, while the structural target-region result is printed as absent and is what prevents creation; SLOT properties created = 0, identical on Run 1 and Run 2, with the limitation verbatim. 21d. The capability branch taken is printed and is identical on Run 1 and Run 2. 22. Pages unchanged: 7, in order, only `01 Components` populated; no patterns, shells, screens or documentation content. 23. `git diff --stat -- src/` empty. 24. `code.js` regenerated only by `node build.mjs`. 25. Offline Run 1 passes with exactly 4 Variant ComponentNodes created and Run 2 creates zero objects of any kind, with identical ids; offline mock execution is explicitly distinguished from real Figma Desktop execution and mock ids are never presented as Figma ids.

Final line: `RESULT: B5 PASSED` or `RESULT: B5 FAILED — do not proceed to B6.`

## 8. Run procedure

Offline: `node tools/figma-plugin/extract-b5.mjs` → `node tools/figma-plugin/build.mjs` → mock harness runs B1, B2, B3, B4, then B5 twice; assert zero creations and identical ids on Run 2. Real: in Figma Desktop, inside `ABox Design System — Library`, **Create component states** → **Verify component states** → **Create component states** again; both outputs, with real ids, form the B5 final report. Mock ids are never presented as Figma ids.

## 9. Files

Created: `tools/figma-plugin/extract-b5.mjs`. Generated: `tools/figma-plugin/tokens-b5.js`, `tools/figma-plugin/code.js` (via `build.mjs` only, never hand-edited). Modified: `tools/figma-plugin/plugin.js` (B5 section + entry), `ui.html` (two buttons), `build.mjs` (concatenate `tokens-b5.js`), `README.md`, `.lovable/manual-work-map.md`.

No file under `src/**` is created, modified or deleted; no application UI, routing, navigation, branding, asset, responsiveness, business-logic or layout change; the proof file and every B0 page stay as they are.

## 10. Limitations recorded verbatim in the report

`ui/button.tsx:8` `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed`, used at `plan-card.tsx:116` (`size="sm" disabled={inCart}`) — not converted to a Figma variant or property: a set-wide `state` axis would require a production-backed value for the other eight Button combinations, and production names none; only the opacity is visual in any case, and pointer-events and cursor have no Figma representation. `kpi-card.tsx:19,73,78` — with `hasDelta = false` the hidden delta layer still carries a `deltaSign` value, because Figma requires every variant to hold a value for every axis of its set; recorded rather than resolved by invention. `ui/input.tsx:11` `disabled:cursor-not-allowed disabled:opacity-50` — declared, never used in production; not converted. `control.tsx:11-12` — disabled variants consumer-owned. `kpi-card.tsx:19,73,78` — one production prop `delta?` carries both presence and sign; Figma cannot express both in a single property, so it is split into `hasDelta` and `deltaSign`, and the production prop name `delta` is used for neither. `kpi-card.tsx:81` — the delta chip text `{delta.pct >= 0 ? "▲" : "▼"} {Math.abs(delta.pct).toFixed(1)}%` is computed from the numeric `pct` and is not exposed as a Text property; the static chip text authored per variant matches a production literal and the computation is recorded rather than reproduced. `kpi-card.tsx:78` — no negative `pct` literal occurs at any production call site; `deltaSign=negative` is included on the strength of the source branch and this absence is recorded. `page-header.tsx:33` — `eyebrow` is suppressed in `compact`; the combination is not created. `page-header.tsx:15` / `kpi-card.tsx:20` / `empty-state.tsx:6` — `icon?: ComponentType<{className?: string}>` cannot be an Instance Swap because B4 created no icon Component; only `hasIcon` and the existing placeholder vector exist, and no placeholder component is invented to make a swap possible. `empty-state.tsx:9,24` — production passes raw inline `<Link>`/`<button>` elements styled with pill classes rather than any B4 component, so `action` cannot be an INSTANCE_SWAP: that property type requires a default component, and nominating `ActionPill` on class similarity would be value-equality inference. It is represented as a SLOT, and if the runtime does not support SLOT (manifest `"api": "1.0.0"`), only the `hasAction` Boolean is created and this limitation is printed verbatim. Hover/focus/active/transition rules in `ui/button.tsx:8`, `action-pill.ts`, `surface.tsx`, `control.tsx`, `module-tabs.tsx:28`, `kpi-card.tsx:41,62`. Motion: `CountUp`, `FadeRise`, `animate-hairline`, `group-hover:-rotate-6 group-hover:scale-105`. Responsive `md:`/`xl:` rules deferred to B7/B8. `color-mix()` tints and `oklch()`, as already recorded in B3/B4.

## 11. Out of scope

B6 patterns/interactions, B7 shells, B8 screens, page population beyond the existing B4 placement, documentation content, library publishing, application changes, redesign, new standalone components, generic state or accessibility libraries.
