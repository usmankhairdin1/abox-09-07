# B6 `deltaSign` failure — diagnosis and minimal fix

Plan only. No Figma writes, no `src/**` changes, no B4 changes, no B7 work.

## 1. Root cause

`deltaSign` is a **B5-owned** property, not a B4 one. B5 was never run in the current
Figma file, so the live `ABox/Card/KpiCard` set (B4, id 4:142) carries only its `tone`
axis. B6 then asked for a property B5 had not yet created, and `b6Key()`
(`plugin.js:2647-2655`) correctly refused to guess:

```text
STOP: component property "deltaSign" resolves to 0 live definitions; B6 never guesses.
```

Nothing is misdeclared, misnamed or invented. The run order B4 → **B5** → B6 was skipped.

## 2. Source and spec evidence

Production (`src/components/abox/kpi-card.tsx`):

- line 12: `delta?: { pct: number; label?: string }` — one optional prop.
- line 74: `{delta && …}` — presence.
- lines 78 / 81: `delta.pct >= 0 ? "text-sage" : "text-destructive"` and
  `{delta.pct >= 0 ? "▲" : "▼"}` — the sign branch.

So production has **no prop named `deltaSign`**. One prop, `delta`, carries both presence
and sign. Figma cannot express both in one property, so the approved **B5** spec splits it
into `hasDelta` and `deltaSign`, and this is already recorded as an explicit limitation
(`tokens-b5.js:401-404`, mirrored in `tokens-b10.js:5576-5606`):

> one production prop `delta?` carries both presence and sign; Figma cannot express both
> in a single property, so it is split into `hasDelta` and `deltaSign`, and the production
> prop name `delta` is used for neither.

`tokens-b5.js:3-12` declares the axis: set `ABox/Card/KpiCard`, existing property `tone`,
new property `deltaSign = positive | negative`, source `kpi-card.tsx:78`. `plugin.js:2096`
and `2283` implement it; `README.md:344-346` states the final matrix `tone × deltaSign` = 8
nodes. B6's own extractor is explicit about the ownership: `extract-b6.mjs:56` —
"A variant value must exist in B4, **or (for deltaSign) in the B5 axis**" — and
`assertVariant` validates it against `ABOX_B5.variantAxis`, not against B4.

So `deltaSign` is: declared by the approved B5 spec, derived from a real production source
branch, recorded as a documented split of the `delta` prop, and **not** a runtime-only
value or a B6 invention.

## 3. Responsibility

Neither B4 nor the B6 spec is wrong.

- B4 is correct and complete: its contract is `tone` only, 11 sets / 3 components / 52
  variants, all verified. Adding `deltaSign` to B4 would violate the approved B4 inventory.
- B6 is correct: it instances `{ tone, deltaSign: "positive" }` and depends on B5's axis
  plus B5's TEXT bindings (`label`, `value` — `assertText` in `extract-b6.mjs:70-76`), so
  every KPI pattern in B6 requires B5 regardless of `deltaSign`.
- The gap is operational: **B5 has not been executed**, and the plugin has no preflight
  telling the operator that, so the failure surfaces mid-build as a property lookup.

## 4. Minimal fix

**Primary fix — sequencing, no code change:** run **B5 Create** then **B5 Verify**, then
retry **B6 Create**. B5 adds the `deltaSign` axis to the live KpiCard set (existing 4
variants become `deltaSign=positive`, 4 `negative` duplicates added → 8) and installs the
TEXT/BOOL bindings B6 instances.

Note, recorded not resolved here: the B5 builder still contains the synchronous style-id
setters (`b5KpiVariants`), which `documentAccess: dynamic-page` rejects — B5 Create will
throw the same `set_fillStyleId` error B4 hit until that conversion is done **in B5's own
batch**, which is out of scope for this plan.

**Optional plugin-only hardening (one file, one function):** in
`tools/figma-plugin/plugin.js`, at the top of `ensureB6Patterns()` (line 2947), add a
read-only preflight that checks the live `ABox/Card/KpiCard` set exposes
`ABOX_B5.variantAxis.property` before any instance is created, and stops with:

```text
STOP: B6 PREREQUISITE — B5 has not been applied to this file (ABox/Card/KpiCard has no
"deltaSign" axis). Run B5 Create + B5 Verify first. B6 creates nothing.
```

It only reads live component-property definitions, creates and deletes nothing, and does
not relax `b6Key()`. If you prefer zero code change for now, skip it — the fix is purely
the run order.

## 5. Explicitly not changed

- No Figma writes of any kind in this stage.
- No `src/**` changes; `delta` stays the single production prop.
- No B4 changes: 11 sets, 3 standalone components, 52 variants, names, properties and
  source mappings untouched; `deltaSign` is never added to the B4 spec.
- No B1/B2/B3 asset changes.
- No B7 work, and no B6 implementation in this plan.
- `b6Key()`'s "never guesses" rule stays exactly as written; no property is renamed,
  invented or defaulted.

## 6. Offline validation

If the optional preflight is implemented:

```bash
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/     # must print nothing
```

Plus an offline re-read confirming `tokens-b4.js` still lists 11 sets / 3 components / 52
variants and that `deltaSign` appears only in the B5-owned spec files.

Real-Figma sequence stays `REAL FIGMA NOT VERIFIED` until B5 is actually run.
