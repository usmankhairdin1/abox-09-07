# Phase 58 — Verify B4 closure-time correction (PLAN ONLY)

## Diagnosis

Every B4-specific check passed: component inventory, bindings, source mappings, exclusions, B0/B1/B2/B3 preservation, and the exact "01 Components holds exactly the 14 B4 objects and nothing else" assertion.

The single failure comes from one stale line in `verifyB4()` in `tools/figma-plugin/plugin.js`:

- **Line 2129** builds `others` = every page except `01 Components` and `02 Patterns`.
- **Line 2134**: `add(others.every((p) => p.children.length === 0), "pages 00, 03, 04, 05, 06 remain empty (02 Patterns is B6-owned)")`

That block was written when B4 ran against a file whose only populated page was `01 Components`. At closure time `03 Shells` (B7), `04 Experiences` (B8), `05 Screens` (B9) and `06 Documentation` (B10) are legitimately populated, so the hard zero fails. It is a verifier-expectation defect, not a Figma mutation — the same class already corrected for B0, B1, B2 and B3.

## Correction scope (narrowest, closure-safe)

Replace only lines 2129–2134 (the `others` construction, the `pageEvidence` loop that feeds it, and the emptiness assertion). Everything above and below stays byte-identical, including the `01 Components` exact-inventory assertion at 2135–2143 and its `pageEvidence` extras loop, which continues to push into the same array.

The replacement reuses the approved-identity boundary already established for B0–B3, `aboxApprovedPageTopLevel()` (plugin.js 547), rather than inventing a new source:

- For every page other than `01 Components` (which keeps its own stricter exact-inventory check), look up the page's approved top-level name list.
- Any top-level node whose name is not in that page's approved list is recorded in `pageEvidence` as `page › name (type) id=…` and FAILs.
- `00 Foundations` has an empty approved list, so it must still be strictly empty.
- `02 Patterns` → `ABOX_B6.patterns`, `03 Shells` → `ABOX_B7.shells`, `04 Experiences` → `ABOX_B8.experiences`, `05 Screens` → `ABOX_B9.screens`, `06 Documentation` → `ABOX_B10.documents`.
- Assertion label becomes: `pages 00, 02–06 hold only their approved B6–B10 inventory (00 Foundations must stay empty)`.

No generic "anything allowed" branch: an unnamed or unexpected node on any page still fails and is printed.

## Expected post-fix behaviour

- B4 PASSES against the final library: 0 nodes on `00 Foundations`, 3 approved pattern objects, 3 approved shells, 5 experiences, 179 screens, 10 documentation frames.
- `01 Components` still checked by the untouched exact 14-object contract.
- Any stray or renamed top-level node on any page still FAILs, named with page, name, type and id.
- All B4 component, binding, source-mapping, exclusion and B0–B3 preservation checks are unchanged.

## Guarantees

- Verification/evidence logic only: `plugin.js` `verifyB4()` plus the regenerated `code.js` bundle.
- Zero Figma objects created, modified or deleted; no publishing.
- B4's 14-object inventory contract and all B1–B10 creation contracts untouched.
- No `src/**` changes. No B11.
