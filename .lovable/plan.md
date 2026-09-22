# Phase 58 — Verify B1 closure-time correction (PLAN ONLY)

## Diagnosis

Every genuine B1 check passed: 9 collections, Light/Dark modes, no Default, variable inventories, values, aliases, semantic/status/elevation/spacing/radius/border/layout/control-sizing checks, no branding leak, and the B0 page/index contract.

The five failures all come from one block at the end of `verifyB1()` in `tools/figma-plugin/plugin.js` (lines 905–919). That block was written for the moment B1 ran against a file that contained nothing but seven empty pages, and it hard-codes zero:

| Failing line | Location | Why it fails now |
|---|---|---|
| "B1 created no text styles" | plugin.js 907 | counts all local text styles; the 2 approved B3 text styles exist |
| "B1 created no effect styles" | plugin.js 908 | counts all local effect styles; the 5 approved B3 effect styles exist |
| "B1 created no components or variants" | plugin.js 917 | counts every COMPONENT node; B4/B5/B6/B7 legitimately contribute 59 + 4 + 4 physical nodes |
| "B1 created no component sets" | plugin.js 918 | counts every COMPONENT_SET; B4 (11) + B6 (1) + B7 (1) exist |
| "the seven library pages remain empty" | plugin.js 919 | sums top-level children across all pages; B4–B10 populate pages 01–06 |

These are verifier-expectation defects, not unexpected mutations — the same class already corrected for B0. Nothing in Figma changed.

## Correction scope (narrowest, closure-safe)

Rewrite only that terminal block of `verifyB1()` to compare against the governed inventories instead of zero. Everything above it stays byte-identical, and the B0 page/index assertion at 920–923 stays byte-identical.

1. **Text styles** — allowed only if the name is in `ABOX_B3.textStyles` (`ABox/Text/eyebrow`, `ABox/Text/serial`). Anything else FAILs and is named.
2. **Effect styles** — allowed only if the name is in `ABOX_B3.effectStyles` (the 5 `ABox/Elevation/*`). Anything else FAILs and is named.
3. **Components / component sets** — reuse the exact allowlist logic already proven in `verifyLibraryPages()` (plugin.js 462–499): names from `ABOX_B4.sets`, `ABOX_B4.components`, `ABOX_B6.patterns`, `ABOX_B7.shells`, plus variant children whose parent COMPONENT_SET is approved. Offenders are printed as `page › name (type) id=…` and FAIL.
4. **Page content** — replace the global "all pages empty" sum with a per-page approved top-level allowlist:
   - `00 Foundations` — still strictly empty (this is the real surviving B1 assertion)
   - `01 Components` — `ABOX_B4.sets` + `ABOX_B4.components`
   - `02 Patterns` — `ABOX_B6.patterns`
   - `03 Shells` — `ABOX_B7.shells`
   - `04 Experiences` — `ABOX_B8.experiences`
   - `05 Screens` — `ABOX_B9.screens`
   - `06 Documentation` — `ABOX_B10.documents`
   Any top-level node whose name is outside its page's approved list FAILs and is named. Labels change from "created no…" to "no … outside the approved B2–B10 inventory" so the evidence reads correctly at closure time.
5. **Evidence** — add a `B1 CLOSURE INVENTORY` block (observed styles, component nodes, per-page top-level counts) alongside the existing `B1 INVENTORY` block, matching the B0 evidence pattern.

No new token files, no new sources of truth: all identities come from the existing generated `tokens-b3/b4/b6/b7/b8/b9/b10.js` inventories already bundled into the plugin.

## Note on B2 and B3

The identical stale block exists in `verifyB2()` (plugin.js 1134–1146) and `verifyB3()` (1464–1466). The sweep will fail there for the same reason. The correction should therefore be factored as one shared helper (e.g. `closureInventoryChecks(batchLabel)`) used by B1, B2 and B3, rather than three copies. B2 keeps its own "B1 untouched" checks; B3 keeps its own style-content checks.

## Guarantees

- Verification/evidence logic only — `plugin.js` verify functions plus the regenerated `code.js` bundle.
- Zero Figma objects created, modified or deleted; no publishing.
- B1–B10 creation contracts, builders, token files and idempotency rules untouched.
- No check becomes a generic PASS: unexpected styles, components, sets or page nodes still FAIL and are named.
- B0 page/index contract and all B1 variable/mode/value/alias/limitation checks preserved exactly.
- No B11, no `src/**` changes.
