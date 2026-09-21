# B6 — read-only diagnosis of the failing structural-signature check

No Figma object is created, changed, renamed or removed by this plan. It adds one read-only
report to the plugin and nothing else.

## What the failing check actually is

`verifyB6()` (plugin.js ~3404-3450) builds one "body" per approved pattern — the two KpiRow
variant nodes from the set, then ModuleTabBar, then WizardStepper — and for each compares
`await b6LiveSignature(node, body.root, body.children)` against
`b6ExpectedSignature(body.root, body.children)`. Any single mismatch clears `structOk`, which is
the one failing line: "every pattern matches its approved source-backed structural signature".
The check prints only pass/fail, never the two strings, which is why the cause is invisible today.

Signature segments (same order in both builders, `b6RootParts` / `b6LiveSignature`):
`layout | wrap | gap | cgap | primarySizing | counterSizing | pb | stroke | strokeWeights |
strokesInLayout | children=N | one INSTANCE:<main name>:<props> per child`.

Expected values come from `ABOX_B6.patterns[].root` / `.variants[].root` in `tokens-b6.js`
(KpiRow columns=4 and columns=3: HORIZONTAL, NO_WRAP, gap 16, no stroke; ModuleTabBar:
HORIZONTAL, WRAP, gap 6, counterGap 6, paddingBottom 12, stroke ABox/Semantic/hairline,
strokesIncludedInLayout false; WizardStepper: HORIZONTAL, WRAP, gap 6, counterGap 6, no stroke)
plus each declared child's `of` name and its variant/text props.

## Leading hypothesis to be confirmed or eliminated by the evidence

`b6RootParts` expects `strokeWeights=0/0/0/0` for every unstroked root. `b6ApplyRoot` only sets
`node.strokes = []` on those roots and never writes the four individual weights, and Figma's
per-side weights keep their default of 1 when the stroke list is empty. If that is what the file
holds, the live segment reads `strokeWeights=1/1/1/1` for KpiRow columns=4, KpiRow columns=3 and
WizardStepper, while ModuleTabBar (which does set weights) matches — a verifier expectation that
the approved definition does not actually back, since the production source states only "no
border", i.e. `strokes = []`. That would be category **B**, and the correct correction would be
to the signature contract, not to the Figma objects.

This is a hypothesis only. The diagnosis reports the real first differing segment for each of the
three patterns and classifies from that, whatever it turns out to be.

## Read-only diagnostic to add (plugin only)

New function `b6DiagnoseSignatures()` in `tools/figma-plugin/plugin.js`, placed next to
`b6InspectPatterns`, wired to a new `b6-signature-diff` message and a
"Diagnose B6 signature mismatch" button in `ui.html`. It only reads: `loadAllPagesAsync`,
`b4StyleIndex()` into `b6StyleIndex`, `b4FindSet` / `b4FindComponent`, then for each of the four
bodies exactly as `verifyB6` assembles them:

1. full expected signature and full live signature, printed on their own lines;
2. a segment-by-segment table of the two, marking the **first** differing segment and every
   subsequent difference (`MATCH` / `DIFF expected=… live=…`);
3. raw root evidence for that node: `type`, `id`, `layoutMode`, `layoutWrap`, `itemSpacing`,
   `counterAxisSpacing`, `primaryAxisSizingMode`, `counterAxisSizingMode`, paddings,
   `strokes.length`, `strokeStyleId` + the resolved B3 style name, the four per-side weights,
   `strokesIncludedInLayout`, `fills.length`, `variantProperties`, `reactions.length`;
4. per child: index, `name`, `type`, `await getMainComponentAsync()` name + id and the owning
   set's name + id, `componentProperties` (every key, its `#id` suffix and value),
   the declared spec child (`of`, variants, texts), and the exact
   `INSTANCE:…` segment each side produced;
5. a closing verdict block per pattern: `SIGNATURE MATCHES` or
   `FIRST DIFF: <segment name> — expected "…" live "…"`, and an overall list of which of the four
   bodies fail.

No writes, no `setProperties`, no `remove()`, no style or node mutation anywhere in the function.

## Classification the report must settle

For each failing body the report states which single category the first diff belongs to, by
construction of the segment it names:

- INSTANCE segment generation, main component name/id (`b6MainName`/`b6MainId` async conversion),
  child order, child type, child count, child props/text → compare the declared spec child with
  the live `componentProperties` printed alongside.
- Root layout properties (layout, wrap, gap, cgap, sizing, padding) → compare with `tokens-b6.js`.
- Stroke segments (`stroke`, `strokeWeights`, `strokesInLayout`) → compare with what `b6ApplyRoot`
  writes versus what `b6RootParts` demands.

Then it labels the finding:

- **A — pattern-construction defect**: the live Figma object deviates from the approved
  production-backed definition in `tokens-b6.js`.
- **B — verifier/signature-calculation defect**: the live object matches the approved definition,
  but the signature contract compares a property the definition does not specify, or normalizes
  the two sides differently.

The verifier will not be relaxed to make the check pass; any correction comes in a later,
separately approved task and must be justified against the approved definition.

## Evidence run (user-run, after re-importing the plugin)

1. `Diagnose B6 signature mismatch` — read-only; produces the four expected/live pairs and the
   first-diff verdicts.
2. `Inspect 02 Patterns` — unchanged read-only cross-check of the same three objects.
3. `B6 Verify` again — must still report the identical single FAIL, proving the diagnostic
   changed nothing.

Node ids must stay `2:611` (set), `2:554`, `2:587`, `2:612`, `2:630` throughout.

## Offline validation

`node --check tools/figma-plugin/plugin.js`; `node tools/figma-plugin/build.mjs`;
`node --check tools/figma-plugin/code.js`; `git diff --stat -- src/` empty.

## Scope confirmation

- Batch name unchanged: `Batch B6 — patterns & interactions`.
- B0-B5 artifacts untouched; no B6 object created, deleted, renamed or mutated.
- No change to B6 pattern construction or to any approved definition in this task.
- `tools/figma-plugin/**` only (`plugin.js`, regenerated `code.js`, `ui.html`, README note);
  `src/**` untouched; nothing published.
