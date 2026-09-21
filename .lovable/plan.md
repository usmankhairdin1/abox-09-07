# B7 blocker — style-name resolution defect (diagnosis + minimal fix)

## Root cause (verified, plugin-side)

The B3 style inventory names the sidebar family with a **slash** segment, matching the
CSS variable path:

- `ABox/Semantic/sidebar/border` (tokens-b3.js:286)
- `ABox/Semantic/sidebar/foreground` (tokens-b3.js:256)
- `ABox/Semantic/sidebar/accent` (tokens-b3.js:274)

The internal-shell builder in `plugin.js` asks for those same three styles with a
**hyphen** instead:

- `ABox/Semantic/sidebar-border` — plugin.js:4015 (rail stroke), plugin.js:4025 (active nav item stroke)
- `ABox/Semantic/sidebar-foreground` — plugin.js:4018 (brand label), plugin.js:4026 (nav item text)
- `ABox/Semantic/sidebar-accent` — plugin.js:4024 (active nav item fill)

`b4StyleIndex()` indexes live paint styles by exact `style.name`, and `b4Style()` throws
`STOP: MISSING B3 PAINT STYLE — "<name>"` on an exact-key miss. The lookup, async page
access, and the build are all correct — `ABox/Semantic/sidebar-border` simply does not
exist and never did; the name string in the B7 builder is wrong.

This is confirmed as the complete list: an audit of every `ABox/Semantic/*` and
`ABox/Elevation/*` reference in the B7 range (plugin.js 3775–4560) against the approved
B3 inventory found exactly these three unresolvable names and no others. The same audit
over all later code (B8–B10) found none, so nothing outside B7 is affected.

The B3 styles are present and correct. No Figma object needs to be created, renamed,
recreated, or duplicated. `ABox/Brand/AboxMark` `tone="sidebar"` (plugin.js:4017) is a
component variant, not a style, and is unaffected.

Production backing is unchanged: `internal-shell.tsx` uses `bg-sidebar`,
`text-sidebar-foreground`, `bg-sidebar-accent` and the sidebar border token, so all three
styles remain the correct source-backed targets — only their Figma path spelling is wrong
in the builder.

## Minimal correction

File: `tools/figma-plugin/plugin.js` — five string literals inside `b7BuildInternal`,
nothing else:

| line | current | corrected |
| --- | --- | --- |
| 4015 | `strokeStyle: "ABox/Semantic/sidebar-border"` | `"ABox/Semantic/sidebar/border"` |
| 4018 | `colorStyle: "ABox/Semantic/sidebar-foreground"` | `"ABox/Semantic/sidebar/foreground"` |
| 4024 | `fillStyle: … "ABox/Semantic/sidebar-accent"` | `"ABox/Semantic/sidebar/accent"` |
| 4025 | `strokeStyle: … "ABox/Semantic/sidebar-border"` | `"ABox/Semantic/sidebar/border"` |
| 4026 | `colorStyle: "ABox/Semantic/sidebar-foreground"` | `"ABox/Semantic/sidebar/foreground"` |

No other change: the missing-style assertion in `b4Style` stays exactly as is, the B7
shell inventory, regions, properties, variants, guarded rollback, cleanup command and
`verifyB7` checks are untouched, and no new style is added anywhere.

`tokens-b7.js` is not involved (it carries no style names for these regions), so
`extract-b7.mjs` does not need to run.

## How B0–B6 stay unchanged

The change is five literals in a B7-only builder function. It creates, renames, and
deletes nothing; it only makes B7 request styles that already exist under their approved
B3 names. B1 variables, B2 typography, the 79 B3 styles, B4 components, B5 properties and
the B6 patterns and their ids (2:611, 2:554, 2:587, 2:612, 2:630) are never written to.

## Offline validation

```text
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/      # must print nothing
```

Plus a re-run of the read-only name audit: every `ABox/Semantic/*` and `ABox/Elevation/*`
reference in the B7 range must exist in `tokens-b3.js`.

## Figma validation sequence

1. Re-import the plugin (the failed run left no B7 objects — the rollback guard already
   removed the partial `ABox/Shell/Internal`).
2. **Remove incomplete B7 shell nodes** — expect `nodes removed: 0`, confirming `03 Shells`
   is clean.
3. **Create shells** — expect 4 physical ComponentNodes, 1 Component Set, 5 properties,
   no `STOP:` line.
4. **Verify shells** — expect `RESULT: B7 PASSED`.
5. **Create shells** again — expect 0 created and identical ids.
6. **B6 Verify** plus the B1–B5 verifiers — all PASS, ids 2:611 / 2:554 / 2:587 / 2:612 /
   2:630 unchanged.

Nothing is published, and no application file changes.
