# B7 — diagnose the failing empty-page assertion (PLAN ONLY)

## Exact code location

`tools/figma-plugin/plugin.js`, inside `verifyB7()`:

```
4469:  const writable = [B4_PAGE, B6_PAGE, B7_PAGE, B8_PAGE];
4470:  add(figma.root.children.filter((p) => writable.indexOf(p.name) === -1).every((p) => p.children.length === 0),
      "00 Foundations, 05 Screens and 06 Documentation remain empty; B8 may populate 04 Experiences");
```

Page constants confirmed: `B4_PAGE = "01 Components"`, `B6_PAGE = "02 Patterns"`, `B7_PAGE = "03 Shells"`, `B8_PAGE = "04 Experiences"`. Since the B0 page check passed (exactly 7 pages, original order), the filtered set is precisely `00 Foundations`, `05 Screens`, `06 Documentation`.

## Expected vs actual

- Expected by this assertion: all three of those pages have `children.length === 0`.
- Actual: at least one of them has at least one child. The assertion is a bare boolean — it prints no page name, no node name, no id — so the run output cannot say which page or node tripped it. That missing evidence is the reason the failure is currently undiagnosable, and it is the first thing to correct.

## Is the condition itself wrong?

Two defects are present in this one line, independent of what the live page state turns out to be:

1. **Inconsistent contract inherited from an earlier batch state.** The B5 verifier (plugin.js 2591–2605) and the B9 verifier already carry an explicit allowance: `06 Documentation` passes when it is empty **or** holds exactly the approved B10 frames (`b10ApprovedNames()`). `verifyB7()` never received that amendment and still demands `06 Documentation` be strictly empty. If B10 frames exist in this file, B7 fails on a page state every other verifier accepts — a stale-contract defect, not a B7 scope violation.
2. **No evidence output.** Unlike `verifyB5()`, which builds a `B5 PAGE EVIDENCE` list of `page › node (TYPE) id=…` lines, `verifyB7()` reports only PASS/FAIL.

Neither defect is a licence to assume the live pages are clean. Whether this specific FAIL is defect (1) or a genuine foreign node on `00 Foundations` / `05 Screens` / `06 Documentation` can only be settled by the evidence the corrected check prints.

## Minimal correction (verifier only)

Replace the single line 4470 with the same shape `verifyB5()` already uses, and nothing else:

- Iterate `figma.root.children`; skip the writable pages (`01`, `02`, `03`, `04`) exactly as now.
- For `06 Documentation`, continue when it is empty or its child names equal `b10ApprovedNames().join("|")` — copied verbatim from `verifyB5()` so the two contracts match.
- For every remaining child, push `"  " + page.name + " › " + child.name + " (" + child.type + ")  id=" + child.id` into a `b7PageEvidence` array (cap 40, as B5 does).
- `add(b7PageEvidence.length === 0, "00 Foundations and 05 Screens remain empty; 06 Documentation may hold the approved B10 frames; B8 may populate 04 Experiences — unexpected nodes: " + b7PageEvidence.length)`.
- When the array is non-empty, print a `B7 PAGE EVIDENCE` block after the checks, mirroring `B5 PAGE EVIDENCE`.

No other line of `verifyB7()` changes. The assertion is not removed or weakened for `00 Foundations` or `05 Screens` — those must still be strictly empty; only the B10 allowance already approved elsewhere is added, and the failure now names the offender.

## Why this preserves everything already passing

- Read-only: `verifyB7()` creates, renames, moves and deletes nothing. The four physical B7 ComponentNodes, the Marketplace set with `variant=flow|landing`, and the five component properties are untouched, as are all B0–B6 objects and ids.
- Every other B7 check — shell inventory, object types, physical node count, regions, marketplace axis, nested-component resolution, no raw style leaks, no invented state axis, no prototype reactions, run bookkeeping — is left byte-identical.
- The rollback guard, `b7CleanupIncompleteShells()`, the approved inventory, `tokens-b7.js` and the API audit are not touched.
- No node is created on `00`, `05` or `06` to satisfy anything.

## Two possible outcomes after the correction

- **Evidence list empty → the check passes.** The failure was the stale `06 Documentation` contract (defect 1); B7 is PASS with zero Figma mutations.
- **Evidence list non-empty.** The printed page/node/type/id names the real content. That result is reported back before any further step — no node is removed, and the B7 scope question is decided from that evidence, not assumed.

## Offline validation

```
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/      # expect: empty
```

## Figma validation (no mutation, no re-create)

1. Copy the rebuilt `code.js` to the local plugin folder and reload the development plugin.
2. Run **Verify shells** only. Do not run Create shells.
3. Expect `RESULT: B7 PASSED` with 0 objects created, or a `B7 PAGE EVIDENCE` block naming the unexpected nodes.
4. Re-run B6 Verify and the B1–B5 verifiers to confirm all still PASS and ids `2:611 / 2:554 / 2:587 / 2:612 / 2:630` are unchanged.

## Out of scope

No `src/**` change; no Figma object created, renamed, moved or deleted; no B0–B6 change; no re-run of Create shells; no change to the B7 inventory, properties, regions, variants, rollback guard, cleanup logic or API audit; no B8 work.
