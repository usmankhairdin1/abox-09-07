# Phase 17 (Revised) — Canonical ActionPill Contract Without Slot

The Slot/`asChild` proposal is withdrawn. This revision answers the six questions from the actual code and defines an API that keeps each consumer's existing DOM element exactly where it is today.

## Answers from the current code

**1. What do button consumers render today?**
A native `<button>` with `className={ACTION_PILL.<variant>}` and, per site, `onClick`, sometimes `type`, `disabled`, `title`, `aria-*`; children are text plus an optional leading lucide icon. Example, `routes/marketplace.admin.readiness.tsx:27`:
`<button onClick={…} className={ACTION_PILL.primaryMd}><RotateCw className="h-4 w-4" aria-hidden /> Recalculate</button>`. 52 such elements.

**2. What do Link consumers render today?**
TanStack Router `<Link>` with typed routing props (`to`, `params`, `search`) plus `className={ACTION_PILL.<variant>}`. `<Link>` renders an `<a>` and additionally owns active-state handling, prefetch behaviour and click interception. 22 such elements.

**3. Can one component preserve both without changing emitted DOM?**
Not without risk. A native-element component preserves `<button>` perfectly. For `<Link>`, any wrapper must hand the class to the router component itself; that is only exactly preservable if the consumer keeps rendering `<Link>`.

**4. Does Radix Slot preserve everything the test requires?**
Reading `@radix-ui/react-slot` (already used by `ui/button.tsx:42` and `ui/sidebar.tsx`), Slot merges parent props into the single child: `className` is concatenated parent-then-child, `style` merged, refs composed, and overlapping event handlers are **chained** — both the parent's and the child's run. Non-handler props from the child win. So className and DOM element would match, but three deltas cannot be asserted as identical without proof per site: handler chaining semantics, ref composition, and the requirement of exactly one child element. On top of that, Slot erases TanStack Router's typed link props from the call site's type surface. That is more behavioural delta than this phase permits.

**5. Does the app already use a comparable pattern in production?**
Yes — `ui/button.tsx` and `ui/sidebar.tsx` use `asChild`, and `Button asChild` wraps `Link` in `app.index.tsx`, `app.employer.results.tsx`, `app.employer.census.tsx`, `app.employer.contribution.tsx`. Those are existing, already-shipped usages; they demonstrate the pattern works in this app, but they are not proof that converting an existing bare `<Link className=…>` to a Slot-wrapped `<Link>` is behaviourally identical, which is the standard here.

**6. Safer alternative**
Keep the element type at the consumer boundary. One canonical source, two entry points into it.

## Revised canonical contract

One new file: `src/components/abox/action-pill.tsx`. `action-pill.ts` is not modified, not moved, not deleted; it stays the sole owner of the class strings and the new file imports them.

Two exports, both resolving to the same `ACTION_PILL` map:

```tsx
// 1. For the 52 native button consumers — renders <button>, nothing else.
export const ActionPill = React.forwardRef<HTMLButtonElement, ActionPillProps>(
  ({ variant, className, ...props }, ref) => (
    <button ref={ref} className={cn(ACTION_PILL[variant], className)} {...props} />
  ),
);

// 2. For the 22 Link consumers and any non-button element — returns the class string.
export function actionPillClass(variant: ActionPillVariant, className?: string): string;
```

- No Slot, no `asChild`, no wrapper element, no polymorphism.
- `variant` required, no defaults, no renames, no new variants, class strings untouched.
- `className` optional; with no caller class `cn(ACTION_PILL[variant])` returns the identical string, so the rendered `class` attribute is byte-identical.
- All props spread straight onto `<button>`: `onClick`, `type`, `disabled`, `title`, `aria-*`, `data-*`. No prop is injected, defaulted, chained or intercepted. Ref forwards to the same element.
- Keyboard, focus, disabled and accessibility semantics come from the same native `<button>` the consumer renders today.

### Button consumers

`<button className={ACTION_PILL.primaryXs} onClick={…}>…</button>`
→ `<ActionPill variant="primaryXs" onClick={…}>…</ActionPill>`
Same element, same attributes, same class string, same handler identity.

### Link consumers

`<Link to="…" className={ACTION_PILL.outlineXs}>…</Link>`
→ `<Link to="…" className={actionPillClass("outlineXs")}>…</Link>`
The `<Link>` element, its typed routing props, active handling and prefetch behaviour are untouched; only the source of the class string moves to the canonical module. Zero DOM, prop, event, ref or navigation delta by construction.

This is a genuine shared source, not documentation: both call-site forms resolve through `action-pill.tsx`, so a future change to the canonical source reaches every verified consumer.

## First-consumer proof before any wider migration

1. Capture baselines for `/marketplace/admin/readiness` (button, `primaryMd`) and `/platform/organizations` (Link, `outlineXs`) at 1440 / 834 / 390, in default, hover, focus-visible and disabled where present.
2. Create `action-pill.tsx` with zero consumers; typecheck and build.
3. Migrate exactly those two consumers — one button, one Link.
4. Prove preservation: compare the rendered `class` attribute string and `tagName` of each pill before and after, compare screenshots, exercise the click handler and the link navigation, check tab order, accessible name and console.
5. Report the proof and stop. No further consumer is migrated until this contract and its proof are approved.

## Rollback

Revert the two consumer files to their prior `ACTION_PILL` call sites and leave or remove `action-pill.tsx`; nothing else was touched, so the app returns to its exact pre-phase state. No consumer is left partially migrated, and no compensating edit is made to consumers, foundations or unrelated components.

## Out of scope

Foundations and tokens, `ACTION_PILL` string values, Button, StatusBadge, PageHeader, cards, forms, tables, shells, route-local kits, landing hero pills, branding and white-label, marketplace assets, and the remaining 31 consumers.
