# Phase 57 / Batch B10 Plan — Documentation / Final Reference Layer

PLAN ONLY. No implementation changes are included in this plan.

## 1. Exact B10 documentation inventory

B10 will create exactly 10 native editable top-level documentation FRAME objects on `06 Documentation`:

1. `ABox/Documentation/00 Library Overview`
2. `ABox/Documentation/01 Foundations Tokens Typography Styles`
3. `ABox/Documentation/02 Components States Properties`
4. `ABox/Documentation/03 Patterns Shells`
5. `ABox/Documentation/04 Experiences`
6. `ABox/Documentation/05 Screens Route Inventory`
7. `ABox/Documentation/06 Prototype Interaction Mapping`
8. `ABox/Documentation/07 Governance Source Of Truth`
9. `ABox/Documentation/08 Import Reimport Workflow`
10. `ABox/Documentation/09 Limitations Evidence Register`

No variables, styles, components, component sets, patterns, shells, experiences, screens, screenshots, flattened images, HTML embeds, or external images will be created.

## 2. Source/audit basis

B10 will be derived from the current plugin/reference layer only:

- `tokens.js` for B0 page order and file names.
- `tokens-b1.js` through `tokens-b9.js` for exact batch inventories, counts, source references, signatures, limitations, and protection metadata.
- `plugin.js` for existing run/verify behavior, page-scope checks, metadata keys, protected asset checks, and failure wording.
- `ui.html` for actual command names exposed to users.
- `build.mjs` for the current generated-code assembly model.
- `README.md` and `.lovable/manual-work-map.md` for current source-of-truth, manual-work, evidence, limitation, and runtime-boundary documentation.
- Source inventory evidence already captured by B9: 153 route declarations, 142 audited content routes, 179 B9 frames, and 922 classified interactions.

Real Figma Desktop proof will not be assumed. If it has not been performed, documentation will label it pending / `REAL FIGMA NOT VERIFIED`.

## 3. Exact documentation grouping

The requested fourteen coverage areas will be grouped into 10 frames to avoid duplicate documentation:

- Overview stands alone because it explains the seven-page library structure.
- Foundations, Tokens, Typography, and Foundational Styles are combined because B1, B2, and B3 form one foundation model.
- Components and States are combined because B5 modifies B4-owned component assets.
- Patterns and Shells are combined because B6 patterns and B7 shells both document reusable composition layers.
- Experiences stands alone for B8 journey compositions.
- Screens / Route Inventory stands alone for the B9 bulk screen model and arithmetic.
- Prototype / Interaction Mapping stands alone because B9 adds prototype reaction rules and classification.
- Governance / Source of Truth stands alone for ownership hierarchy.
- Figma Import / Re-import Workflow stands alone for operational maintenance.
- Known Limitations / Deferred Items and Verification / Evidence Status are combined into one register so unresolved items and proof status are not separated.

## 4. Exact page placement

B10 may write only to `06 Documentation` in `ABox Design System — Library`.

The page order must remain exactly:

```text
00 Foundations
01 Components
02 Patterns
03 Shells
04 Experiences
05 Screens
06 Documentation
```

`ABox Proof — Scratch` must not be touched. B10 must stop in the wrong file.

## 5. Exact content/governance coverage

B10 documentation will cover:

- B1: 9 collections, 200 variables, Light/Dark modes, aliases, semantic/primitive/status/metal/spacing/radius/border/elevation/layout/control-sizing categories.
- B2: `ABox/Typography`, 19 variables, role-family model, identical Light/Dark values, and unsupported font-axis/OpenType items.
- B3: 79 styles: 72 color, 2 text, 5 effect, plus variable-bound style rules and excluded primitive/style cases.
- B4: 14 objects: 11 component sets, 3 standalone components, 52 initial variants, source-backed component inventory.
- B5: KpiCard `deltaSign`, 4 added negative variants, 19 component properties, 1 exposed nested instance, 10 deferred properties.
- B6: 3 pattern objects / 4 physical nodes, 0 prototype reactions in B6, deferred/rejected pattern interactions.
- B7: 3 shell assets / 4 physical nodes, Internal / Marketplace / Member shells, shell properties and deferred shell behavior.
- B8: 5 experience frames, journey/state coverage, reuse-only composition, no prototypes in B8.
- B9: 179 top-level screen/state frames, 682 Category-A prototype reactions, 135 Category-B state mappings, 102 Category-C runtime mappings, 3 Category-D unsupported mappings, and the published B9 inventory arithmetic.
- Runtime boundaries: Figma does not execute React, JavaScript, backend/API logic, database state, auth logic, pricing logic, subsidy logic, uploads, or governed runtime workflows.

## 6. Exact reference-link strategy

Each documentation frame will use native text and tables plus plugin metadata references. Where the Figma API supports it safely, documentation rows will store references to existing asset names and resolved node IDs after real creation/readback.

Reference strategy:

- Foundations reference existing variable collection names and style names rather than duplicating every variable value.
- Components reference B4/B5 component and component-set names.
- Patterns reference B6 pattern names and their source components.
- Shells reference B7 shell names and mapped component/pattern dependencies.
- Experiences reference B8 frame names.
- Screens reference B9 generated screen names, route keys, screen IDs where present, shell mapping, and source files.
- Prototype documentation references B9 interaction IDs, source screen key, target screen/state key, trigger, action, navigation type, transition, and category.

If a referenced asset cannot be resolved during real Figma verification, B10 must report the broken reference rather than creating a substitute.

## 7. Exact evidence-status strategy

B10 will use this status model consistently:

- `PLAN APPROVED` — the user approved the plan, but no implementation evidence exists yet.
- `OFFLINE / PLUGIN-LAYER IMPLEMENTED` — plugin/reference files exist for the batch.
- `OFFLINE VERIFIED` — extractor/build/syntax checks pass outside Figma.
- `REAL FIGMA CREATED` — the relevant command created/read native Figma objects in Figma Desktop.
- `REAL FIGMA VERIFIED` — the verify command and manual Figma inspection confirmed native objects and references.

Current evidence to document:

- B0-B9 have plugin/reference-layer implementation records.
- B9 offline checks have passed in the repository record.
- Real Figma Desktop creation/verification must remain marked pending unless actually performed in Figma Desktop.
- B10 begins at `PLAN APPROVED` only until implemented and verified.

## 8. Exact limitation/deferred register strategy

B10 will create a consolidated register from B1-B9 token/documentation data, grouped by cause:

- Figma representation gaps: oklch conversion, `color-mix()`, variable font axes, OpenType features, numeric variants, and runtime-computed shadows/tints.
- Missing target-layer limitations: B5 deferred component properties where B4 created no attachable layer.
- Component/property limitations: no invented icon components, no unsupported SLOT/INSTANCE_SWAP creation, no value-equality aliases.
- Pattern/shell limitations: route-driven navigation, local shell state, ReactNode action regions, asymmetrical Marketplace `showProducts` handling.
- Experience/screen limitations: route-local tables/forms/cards/message rows remain editable compositions, not promoted foundations.
- Runtime-only limitations: auth, backend/API/database, pricing, subsidy, uploads, file processing, business rules, and governed workflows are metadata only.
- Responsive limitations: represented as canonical desktop frames plus metadata, not as responsive Figma variants unless an earlier phase already created one.
- Motion limitations: only source-backed and Figma-supported transitions are documented; unsupported CSS/Radix/runtime animations are recorded as limitations.
- Proof limitations: real Figma Desktop evidence remains pending unless performed.
- Stop conditions: duplicate names, wrong page/file, missing dependency, signature mismatch, protected B0-B9 mutation, conflicting prototype mapping, or broken documentation references.

## 9. Exact deterministic/idempotency strategy

Each B10 top-level frame will have deterministic identity:

- deterministic name from the 10-frame inventory;
- deterministic x/y placement on `06 Documentation`;
- deterministic section order inside each frame;
- deterministic sorted source references;
- deterministic signature built from frame name, section keys, source references, covered batch keys, inventory counts, evidence statuses, limitation keys, and referenced asset names.

Each B10 frame will store plugin metadata:

- `aboxBatch = B10`
- `aboxKind = documentation`
- `aboxName = <exact name>`
- `aboxSignature = <deterministic signature>`
- `aboxSources = <sorted source references>`

Run 1 creates missing documentation frames. Run 2 creates zero duplicate documentation frames. Matching B10 signatures are reused. A same-name object without matching B10 metadata, a same-name object with a mismatched signature, or duplicate same-identity documentation assets must stop and report the conflict.

## 10. Exact verification checklist

The eventual B10 verifier will check:

1. Exactly seven B0 pages exist in the original order.
2. B10 top-level assets exist only on `06 Documentation`.
3. The 10 B10 documentation frames exist in deterministic order and placement.
4. Every B10 frame is a native editable FRAME with native text/table layout.
5. No screenshots, flattened images, HTML embeds, or external documentation images exist in B10 frames.
6. B1 remains 9 collections / 200 variables.
7. B2 remains `ABox/Typography` with 19 variables.
8. B3 remains 79 styles.
9. B4/B5 remain 11 component sets, 3 standalone components, 56 variant nodes, 59 physical component nodes, 19 non-variant properties, and 1 exposed nested instance.
10. B6 remains 3 top-level pattern objects / 4 physical nodes.
11. B7 remains 3 shell assets / 4 physical nodes.
12. B8 remains 5 top-level experience frames on `04 Experiences`.
13. B9 remains 179 top-level screen/state frames and source-backed reaction metadata on `05 Screens`.
14. No new variables/styles/components/component sets/patterns/shells/experiences/screens were created by B10.
15. Documentation references resolve to existing B1-B9 assets by name and, where available, node ID.
16. Documentation does not claim unverified real-Figma evidence.
17. Runtime behavior and Figma prototype behavior are separated in the text.
18. B9 `Create All Screens` bulk-import model is documented exactly as one user operation.
19. Permanent Lovable-Figma sync is explicitly excluded.
20. Limitations/deferred items from B1-B9 are present and not hidden.
21. Run 2 creates zero duplicate B10 documentation frames.
22. B10 signatures remain deterministic.
23. `ABox Proof — Scratch` remains untouched.
24. `src/**` remains untouched, verified outside Figma.
25. Existing extractor/build/syntax checks remain unaffected.

## 11. Exact real-Figma verification sequence

After approval and implementation, real evidence requires this Figma Desktop sequence:

1. Open `ABox Design System — Library`.
2. Verify the seven pages are present in order.
3. Verify B1-B9 preservation using the existing verify commands:
   - `b1-verify` — Verify foundation variables.
   - `b2-verify` — Verify typography variables.
   - `b3-verify` — Verify foundational styles.
   - `b4-verify` — Verify components.
   - `b5-verify` — Verify component states.
   - `b6-verify` — Verify patterns.
   - `b7-verify` — Verify shells.
   - `b8-verify` — Verify experiences.
   - `b9-verify` — Verify All Screens.
4. Run B10 create command: proposed UI label `Create documentation`, message type `b10-run`.
5. Run B10 verify command: proposed UI label `Verify documentation`, message type `b10-verify`.
6. Run `Create documentation` again.
7. Confirm the second run reports zero duplicate documentation creation.
8. Confirm deterministic documentation IDs/signatures are stable between runs.
9. Open representative documentation frames and verify references resolve to the actual library assets.
10. Confirm no B0-B9 asset was modified.
11. Confirm `ABox Proof — Scratch` remains untouched.
12. If any native creation/readback step is not actually performed, report `REAL FIGMA NOT VERIFIED`.

## 12. Exact files that would change

Minimum expected files after approval:

- `tools/figma-plugin/extract-b10.mjs` — new extractor for B10 documentation data, derived from B1-B9 tokens and current reference docs.
- `tools/figma-plugin/tokens-b10.js` — generated B10 documentation inventory and signatures; never hand-edited.
- `tools/figma-plugin/plugin.js` — B10 create/verify logic, page protection, metadata, conflict handling, and command routing.
- `tools/figma-plugin/build.mjs` — include `tokens-b10.js` before `plugin.js` when building `code.js`.
- `tools/figma-plugin/ui.html` — add `Create documentation` and `Verify documentation` buttons using `b10-run` and `b10-verify`.
- `tools/figma-plugin/README.md` — append B10 usage, inventory, evidence, and limitation documentation.
- `.lovable/manual-work-map.md` — append final reference-layer ownership and maintenance notes.
- `tools/figma-plugin/code.js` — regenerated by `build.mjs` only.

No other files are planned.

## 13. B1-B9 protection statement

B1-B9 remain protected. B10 will read and reference existing B1-B9 data and assets, but it will not modify, recreate, normalize, or clean up any B1-B9 foundation, component, pattern, shell, experience, screen, or prototype asset.

## 14. `src/**` untouched statement

`src/**` remains untouched. B10 is limited to the Figma/plugin reference layer and supporting documentation files listed above.

## 15. Permanent sync exclusion statement

B10 does not implement permanent Lovable-Figma sync. The Figma library remains a standalone design/prototype reference artifact generated by explicit plugin commands and verified by explicit plugin/manual checks.
