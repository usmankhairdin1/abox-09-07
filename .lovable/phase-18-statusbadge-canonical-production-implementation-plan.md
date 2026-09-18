# Phase 18 — Canonical StatusBadge Production Implementation Plan

STATUS: PLAN ONLY. No production file, reference file, token, route, shell, kit, branding or marketplace behaviour was changed while producing this document.

All counts below were re-measured from the current repository. Historical Phase 5–16 numbers were not reused. The following paths are excluded from every count: `src/lib/design/**`, `src/components/design/**`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`.

---

## 1. Current production StatusBadge source

Path: `src/components/abox/status-badge.tsx` (30 lines).

It is the only definition of a semantic status badge in production. No second implementation, no alias module, no class-map module. Unlike ActionPill — where `action-pill.ts` already owned the module specifier and forced a `-component` sibling file — nothing occupies this specifier.

Full current source, verbatim:

```tsx
import { cn } from "@/lib/utils";
type Tone = "sage" | "primary" | "warning" | "muted" | "destructive" | "info";
export function StatusBadge({ tone = "muted", children, className }: { tone?: Tone; children: React.ReactNode; className?: string; }) {
  const tones: Record<Tone, string> = {
    sage:        "[--tone:var(--sage)]",
    primary:     "[--tone:var(--primary)]",
    warning:     "[--tone:var(--warning)]",
    muted:       "[--tone:var(--foreground)]",
    destructive: "[--tone:var(--destructive)]",
    info:        "[--tone:var(--info)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        "border",
        tones[tone],
        className,
      )}
      style={{
        color: "color-mix(in oklch, var(--tone) 88%, var(--foreground))",
        background: "color-mix(in oklch, var(--tone) 12%, var(--card))",
        borderColor: "color-mix(in oklch, var(--tone) 34%, transparent)",
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--tone)" }} />
      {children}
    </span>
  );
}
```

---

## 2. Fresh consumer count and measurement method

| Measurement | Value |
|---|---|
| Production files importing `StatusBadge` | **89** |
| Production `<StatusBadge …>` call sites | **163** |
| Call sites with a literal `tone="…"` | **64** |
| Call sites with a dynamic `tone={…}` | **99** |
| Call sites passing `className` | **1** |
| Call sites passing any other prop | **0** |
| Competing StatusBadge definitions | **0** |

Method: `rg -l "StatusBadge" src` with the reference-layer globs excluded for the file count; `rg -o "<StatusBadge"` for call sites; `rg -o '<StatusBadge[^>]*tone="[a-z]+"'` for literal tones; `rg -c '<StatusBadge[^>]*tone=\{'` summed for dynamic tones; `rg -n '<StatusBadge[^>]*className'` for className composition.

The earlier 87–91 range is confirmed as still accurate at the file level; the exact current figure is 89.

---

## 3. Consumer inventory

Three are components, 86 are route files. Call-site counts per file:

**Shared components (3)**
- `src/components/abox/plan-card.tsx` — 6
- `src/components/m06/kit.tsx` — 1 (inside `StatusTag`)
- `src/components/lucie-app/ui.tsx` — 1 (inside `StatusChip`)

**Agency / organization (21)**
`agency.downlines.new.identity` 1 · `agency.downlines.new.readiness` 2 · `agency.marketplace-participation` 3 · `agency.my-organization` 1 · `agency.organization-admin` 2 · `agency.organization-defaults.apply` 1 · `agency.organization-imports.$importJobId` 2 · `agency.organization-imports.index` 1 · `agency.organization-structure` 1 · `agency.organization-work` 3 · `agency.organizations.$organizationId.contacts` 1 · `.ending` 1 · `.identifiers` 1 · `.index` 9 · `.lifecycle` 1 · `.locations` 2 · `.readiness` 2 · `.relationships` 1 · `.settings` 1 · `agency.organizations.index` 3 · `agency.reference-organizations.request` 2

**Agent / JET dashboard (27)**
`ai-review` 3 · `app.agency.entities` 2 · `app.agency.producers` 1 · `app.agency.revenue` 1 · `app.agency.statements` 1 · `app.commissions` 1 · `app.communications` 2 · `app.customers.$id` 3 · `app.customers.index` 1 · `app.employer.ichra` 1 · `app.index` 2 · `app.jet.acl` 2 · `app.jet.ai-governance` 1 · `app.jet.appointments` 1 · `app.jet.audit` 1 · `app.jet.branding` 1 · `app.jet.form-configurator` 1 · `app.jet.integrations` 1 · `app.jet.notifications` 2 · `app.jet.platform` 8 · `app.jet.product-builder` 3 · `app.jet.products` 1 · `app.my-work` 3 · `app.off-exchange` 1 · `app.partner` 2 · `app.schedule` 1 · `app.tasks` 3

**Marketplace admin (20)**
`marketplace.admin.activation` 1 · `.assets` 1 · `.availability.$availabilityEntryId` 2 · `.availability.index` 2 · `.brand` 2 · `.domains.index` 2 · `.health` 1 · `.index` 1 · `.lifecycle` 2 · `.participants.$participantId` 3 · `.participants.index` 2 · `.preview` 1 · `.readiness` 2 · `.referral-links.$referralLinkId` 1 · `.referral-links.index` 1 · `.releases.review` 2 · `.releases.schedule` 1 · `.routing-support` 1 · `.work` 3 · plus `marketplace.admin.*` shared usage inside the shell-hosted pages listed above

**Platform (4)**
`platform.marketplaces.index` 2 · `platform.marketplaces.$marketplaceId.override` 1 · `platform.organizations.index` 2 · `platform.organizations.$organizationId.override` 1

**Shopping / commerce (7)**
`plans.index` 3 · `plans.$planId` 1 · `cart` 1 · `compare` 2 · `apply` 2 · `review` 1 · `shared.$token` 2 · (plus `plan-card.tsx` above)

**Member / account (3)**
`member.index` 2 · `member.messages` 2 · `member.quotes` 1

**Workflow / shared flows (5)**
`app.quick-quote` 3 · `app.send-quote` 3 · `handoff` 2 · `compliance` 1 · `agency.*` flows counted above

---

## 4. Current API (exactly as coded, nothing invented)

| Prop | Type | Required | Default | Behaviour |
|---|---|---|---|---|
| `tone` | `"sage" \| "primary" \| "warning" \| "muted" \| "destructive" \| "info"` | optional | `"muted"` | selects the `[--tone:var(--x)]` utility class |
| `children` | `React.ReactNode` | required | — | rendered as the badge label after the dot |
| `className` | `string` | optional | — | appended through `cn`, last in order, so it can override |

Not present today, therefore FUTURE DECISION if ever requested: `ref` forwarding, `asChild`, event handlers, `icon`, `size`, `density`, `as`, `title`, explicit `role`, `data-*` passthrough, loading state, disabled state, selected state, interactive state. The component is a plain function component — it does **not** spread rest props, so a consumer cannot pass arbitrary attributes today.

---

## 5. Tone inventory

| Tone | Class | CSS variable | Literal call sites | Evidenced meaning from consumers |
|---|---|---|---|---|
| `muted` | `[--tone:var(--foreground)]` | `--foreground` | 29 | neutral / informational / not-applicable / default label (also the implicit default) |
| `primary` | `[--tone:var(--primary)]` | `--primary` | 10 | active, booked, off-exchange, brand-affirmative state |
| `sage` | `[--tone:var(--sage)]` | `--sage` | 9 | pass, ready, healthy, available, HSA-eligible |
| `warning` | `[--tone:var(--warning)]` | `--warning` | 7 | warning, pending, needs attention |
| `info` | `[--tone:var(--info)]` | `--info` | 7 | on-exchange, informational classification |
| `destructive` | `[--tone:var(--destructive)]` | `--destructive` | 2 | fail, blocked, expired |

Dynamic tone (99 call sites) resolves through per-route maps and ternaries, e.g. `RESULT_TONE` in `agency.organizations.$organizationId.readiness.tsx`, `BADGE_TONE` in `m06/kit.tsx`, `CHIP_TONE` in `lucie-app/ui.tsx`, and inline ternaries such as `plan.onExchange ? "info" : "primary"`.

Foreground/background model is identical for every tone: text `color-mix(--tone 88%, --foreground)`, background `color-mix(--tone 12%, --card)`, border `color-mix(--tone 34%, transparent)`. Light/dark behaviour is automatic because `--tone`, `--foreground` and `--card` are all themed in `src/styles.css` (light block from line 102, dark block from line 186). No tone carries an interaction state — there are no hover, focus, active, disabled or selected styles.

No tone is declared superior. Overlaps are recorded in section 21 as open decisions, not resolved.

---

## 6. DOM structure

Every consumer receives exactly the same structure:

```
<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] border [--tone:var(--x)] [consumer className]"
      style="color: color-mix(…); background: color-mix(…); border-color: color-mix(…)">
  <span aria-hidden class="h-1.5 w-1.5 rounded-full" style="background: var(--tone)"></span>
  {children}
</span>
```

- Outer element: always `<span>`. Never conditional, never polymorphic.
- Inline `style` attribute is always present with all three properties.
- The dot is always rendered, always `aria-hidden`.
- No consumer attaches a ref, event handler, `aria-*`, `data-*` or `title` — the component would silently drop them, so none exists.
- Only `app.employer.ichra.tsx:68` adds a className (`mt-3`), which appends after the tone class and changes margin only.
- Conditional rendering happens at the consumer (`{plan.hsaEligible && <StatusBadge …>}`), never inside the component.

Conclusion: there is **no consumer with a structurally different DOM contract**. Nothing needs to be excluded on structural grounds.

---

## 7. Foundation dependencies

Colour: `--sage`, `--primary`, `--warning`, `--foreground`, `--destructive`, `--info`, `--card` — all defined in `src/styles.css` for both themes.
Radius: `rounded-full` (component and dot).
Typography: `text-[10px]`, `font-semibold`, `uppercase`, `tracking-[0.12em]`.
Spacing: `px-2.5`, `py-0.5`, `gap-1.5`.
Icon: none — the dot is `h-1.5 w-1.5`, not an icon-system dependency.
Border: 1px via the `border` utility, colour computed inline.
Shadow, motion, opacity: none.

No foundation is modified, normalized or added by this plan.

---

## 8. Experience distribution

- **Dashboard / Admin** — agency (21 files), agent + JET (27), platform (4). Largest concentration; mainly table cells, list rows and detail-page header chips.
- **Marketplace admin** — 20 files, hosted inside `MarketplaceShell`. Component usage only; marketplace behaviour is out of scope.
- **Shopping / Commerce** — 7 route files plus `plan-card.tsx`; network/exchange/HSA chips on plan tiles, cart and compare.
- **Member / Account** — 3 files inside `MemberShell`.
- **Web / Marketing** — effectively none; `src/routes/index.tsx` uses a hand-built inline chip instead (section 10).

Usage contexts: table cells (`DataTable` columns), card lists, detail-page headers, wizard step summaries, list rows. No modal/drawer-only usage found; no form-field usage; no shell chrome usage (`InternalShell`, `MarketplaceShell`, `MemberShell` do not import it).

Experience boundaries are recorded, not altered.

---

## 9. Duplicate / overlap inventory (unranked, unmerged, untouched)

| Implementation | Path | Relationship | Consumers |
|---|---|---|---|
| `StatusTag` | `src/components/m06/kit.tsx:53` | wraps StatusBadge through a `BADGE_TONE` map | M06 workforce screens |
| `StatusChip` | `src/components/lucie-app/ui.tsx:102` | wraps StatusBadge through a `CHIP_TONE` map | Lucie app frames |
| `Tag` + `Note` | `src/components/lucie/ui.tsx:39`, `:275` | independent `TONE_CLASS` vocabulary (`neutral/good/warn/bad/stop/info/hairline/sidebar/default`), does **not** use StatusBadge | Lucie spine screens, `m08/kit.tsx` |
| `ui/badge` | `src/components/ui/badge.tsx` | shadcn primitive | 1 production consumer: `lucie-app/ui.tsx:277` |
| `MetalBadge` | `src/components/abox/metal-badge.tsx` | tier presentation, separate token family (`--metal-*` plus explicit `--tone-fg`) | `plan-card.tsx`, `plans.index.tsx`, `cart.tsx` |
| Inline chip | `src/routes/index.tsx` | one hand-built `rounded-full text-[10px] uppercase` span | 1 |

`MetalBadge` (E) and `StatusBadge` (F) are kept strictly separate: MetalBadge uses solid tier backgrounds with a paired explicit foreground token, StatusBadge uses computed `color-mix` tinting. The code does not prove them to be the same system. No merge is proposed.

No winner is selected anywhere in this table.

---

## 10. Inline / alternate status implementations

Searching production for chip-shaped labels (`rounded-full` + `text-[10px]` + `uppercase`) returns only: `status-badge.tsx`, `metal-badge.tsx`, `plan-card.tsx` (which composes both) and `src/routes/index.tsx`. Other state representations found in production that are deliberately **not** status badges and stay untouched: `Note` banners, coloured helper text (e.g. `text-warning-foreground` in `app.agency.producers.tsx`), inline dot indicators inside shells, and plain text status strings in some tables.

None of these is migrated or normalized in any future step without a separately approved decision.

---

## 11. Accessibility behaviour (current)

- Non-interactive `<span>`; not focusable, not in the tab order, no `role`, no `aria-label`.
- The colour dot is `aria-hidden`, so meaning is carried entirely by the text child — colour is never the sole signal.
- The accessible name is the rendered children text exactly.
- No live region, no `aria-live`, no announcement on state change: when a status changes, the text simply re-renders.
- Contrast is produced by `color-mix(--tone 88%, --foreground)` on a 12% tint, which the current themes already ship.

Nothing here is changed. Any addition (`role="status"`, `aria-live`) is FUTURE DECISION.

---

## 12. Responsive behaviour (current)

There is none. No breakpoint-prefixed class exists in the component; the badge renders at the same type size, padding and dot size at every viewport. Responsive differences visible in the app come from the surrounding table/card layout, not the badge. Preserve exactly.

---

## 13. Density behaviour (current)

Single density. No `size` prop, no compact variant, no table-density coupling. The badge is identical inside a dense `DataTable` row and inside a detail-page header. Preserve exactly.

---

## 14. Current propagation model

```text
src/styles.css token (--sage / --primary / --warning / --foreground / --destructive / --info / --card)
  → [--tone:var(--x)] utility class chosen by the `tone` prop
    → inline color-mix computation in status-badge.tsx
      → <span> DOM
        → 89 verified consumers (163 call sites)
          → patterns (table cell, card row, detail header, wizard summary)
            → experiences (Agency, JET, Platform, Marketplace admin, Shopping, Member)
              → screens
```

Propagates automatically today: any change to the seven CSS variables; any change to the shared class string, padding, radius, typography, dot size or the color-mix ratios.

Requires consumer-level change: adding/removing/renaming a tone key; changing the default tone; changing children semantics; anything relying on the per-route `RESULT_TONE` / `BADGE_TONE` / `CHIP_TONE` maps, which live in consumers and are not reachable from the component.

No reverse dependency exists — the component imports only `cn`.

---

## 15. Future canonical source decision

**The existing `src/components/abox/status-badge.tsx` becomes the canonical source as-is. No new file is created.**

Evidence: it is already the single definition; all 89 semantic-status consumers already import it; no class-map module competes for the specifier; only one call site composes a className; no consumer needs a ref, event handler or alternate element. The ActionPill situation — where a class map lived separately and consumers spread the string onto bare elements — does not exist here.

Therefore Phase 19 (implementation) is expected to be a **zero-diff confirmation phase** for the component itself: the canonical declaration is documentation plus proof, not a rewrite. If any code change to the component is ever proposed, it must be justified against a specific consumer requirement and re-approved.

---

## 16. Migration eligibility rules

A consumer is ELIGIBLE only if it already imports and renders `StatusBadge` directly. By that rule all 89 files are eligible and, because the canonical source is the existing file, their migration diff is empty.

A consumer is BLOCKED if it is any of the following, and stays blocked until a separately approved decision exists:
- `StatusTag`, `StatusChip` — wrapper components with their own tone maps.
- `Tag` / `Note` in `lucie/ui.tsx` and `m08/kit.tsx` — independent tone vocabulary.
- `ui/badge` usage in `lucie-app/ui.tsx`.
- The inline chip in `src/routes/index.tsx`.
- `MetalBadge` and its three consumers — a different system entirely.
- Any coloured text, dot or plain-text status representation.

Visual similarity is explicitly **not** grounds for migration.

---

## 17. First-consumer proof-gate candidates

Four consumers, chosen because together they exercise every distinct usage shape present in the codebase.

| # | Route | File | Usage | Tone shape | Why representative |
|---|---|---|---|---|---|
| 1 | `/agency/organizations/:organizationId/readiness` | `src/routes/agency.organizations.$organizationId.readiness.tsx` | 2 call sites in list rows | dynamic via `RESULT_TONE` map + a nested ternary on `readiness.status` | the dominant dashboard shape: dynamic tone, list row, four possible tones on one page |
| 2 | `/plans` | `src/components/abox/plan-card.tsx` (rendered by `plans.index.tsx`) | 6 call sites | literal `muted`/`sage` plus `plan.onExchange ? "info" : "primary"` | shopping surface, conditional rendering, two layout modes in one file, sits next to MetalBadge so the E/F boundary is visible |
| 3 | `/app/employer/ichra` | `src/routes/app.employer.ichra.tsx` | 1 call site | literal `muted` **with `className="mt-3"`** | the only className consumer in the repository; proves passthrough and class ordering |
| 4 | `/app/schedule` | `src/routes/app.schedule.tsx` | 1 call site | `s.available ? "sage" : "primary"` | simplest possible baseline inside a card list; a clean control for the comparison harness |

Not implemented in this phase.

---

## 18. Exact regression contract

Baselines are captured **before** any change, at viewports **1440**, **834** and **390**, for each proof consumer and later for each migrated group.

For every StatusBadge instance on the page, compare before vs after:
- `tagName` of the outer element and of the dot
- complete DOM subtree (`outerHTML`) of the badge
- full `class` attribute string, including token order
- full inline `style` attribute string
- `getBoundingClientRect()` — width, height, x, y
- computed `font-size`, `font-weight`, `letter-spacing`, `text-transform`, `line-height`
- computed `color`, `background-color`, `border-color`, `border-width`, `border-radius`
- dot dimensions and background
- accessible name and accessibility tree node
- `aria-hidden` on the dot
- keyboard behaviour: badge remains non-focusable and absent from the tab order
- focus behaviour of surrounding interactive elements is unchanged
- surrounding layout: sibling positions and the containing row/card height
- responsive behaviour at all three viewports
- browser console: no new warning or error
- full-viewport screenshots, compared

If any difference appears that is not independently reproduced against the unmodified code — the method used and accepted in Phase 17 for the cold-load font artifact — then: **STOP**, leave the consumer as-is, report the exact file and difference, make no compensating edit, do not redesign StatusBadge, do not continue to the next group.

---

## 19. Rollback contract

- Each consumer group is an independent, self-contained set of file edits.
- Reverting a group means restoring those files only. No shared file is touched during migration, so no shared revert is ever required.
- Because the canonical source is the existing file and is not rewritten, there is no component-level rollback surface.
- No partially migrated consumer is left behind: a group either passes validation entirely or is reverted entirely.
- After any rollback the application returns to the exact pre-phase state, verified by an empty `git diff`.

---

## 20. Out of scope

Foundations and tokens · `src/styles.css` · MetalBadge and tier presentation · Button · ActionPill · PageHeader · DataTable · KpiCard · EmptyState · cards · forms · tables · `InternalShell` / `MarketplaceShell` / `MemberShell` · route-local kits (`m06`, `m08`, `lucie`, `lucie-app`, `ai-elements`) · assistants · Branding & White-Label (runtime-owned) · Marketplace Asset Management (runtime-owned) · navigation configuration · unused UI primitives · Prettier/formatting cleanup · the reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`), which stays documentation-only and never becomes a runtime dependency.

---

## 21. Open decisions (recorded, unresolved)

1. Do `warning` and `destructive` overlap at some call sites? Both appear for failure-adjacent states.
2. Is `muted` a tone or the absence of one? It is also the default, so 29 literal uses and every omitted-prop use collapse together.
3. Should `StatusTag`, `StatusChip` and `Tag` ever converge on StatusBadge? Three tone vocabularies currently coexist.
4. Should `ui/badge`'s single remaining consumer stay, move, or be left permanently?
5. Is the inline chip in `src/routes/index.tsx` a status indicator or a marketing element?
6. Should the tone type be exported for consumers that build their own tone maps? Today each consumer re-declares `as const` maps.
7. Should StatusBadge ever forward a ref or spread rest props? No consumer needs it today.
8. Should a live-region announcement exist for status changes?
9. Is the `--foreground`-based `muted` tone intentional, or a placeholder for a dedicated neutral token?

None of these is resolved here and none blocks the canonical declaration.

---

## 22. Future migration sequence

Given the canonical source is the existing file, the sequence is a validation sequence, not a rewrite sequence.

1. Proof gate — the four consumers in section 17, validated against section 18.
2. Agency / organization (21 files).
3. Agent / JET dashboard (27 files).
4. Marketplace admin (20 files) — component usage only.
5. Platform (4 files).
6. Shopping / commerce (7 files + `plan-card.tsx`).
7. Member / account (3 files).
8. Blocked set — untouched; each item requires its own approved decision.

One group at a time. Each group: capture baseline → validate → confirm no unrelated file changed → proceed.

---

## 23. Final implementation file map

| File | Phase 19 role |
|---|---|
| `src/components/abox/status-badge.tsx` | canonical production source — expected diff: none |
| 89 consumer files | expected diff: none (already import the canonical source) |
| `src/components/m06/kit.tsx` (`StatusTag`) | blocked wrapper — untouched |
| `src/components/lucie-app/ui.tsx` (`StatusChip`, `ui/badge`) | blocked wrapper — untouched |
| `src/components/lucie/ui.tsx` (`Tag`, `Note`) | separate vocabulary — untouched |
| `src/components/abox/metal-badge.tsx` | separate system — untouched |
| `src/styles.css` | foundations — untouched |
| `src/lib/design/**`, `src/components/design/**` | documentation only — untouched |

No new production file is proposed.

---

## 24. Validation of this phase

- Files created: exactly one — this document.
- Production diff: empty.
- Reference-layer diff: empty.
- No consumer migrated, no component changed, no token changed, no branding or marketplace behaviour changed.
