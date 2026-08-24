# ABox Phase 1 — Design System Direction (proposal)

Status: proposal for approval. No high-fidelity screens are produced from this yet.
Scope: governs both surfaces — the internal unified shell (workspaces) and the
externally branded consumer/member marketplaces — from one token set.

Source hierarchy: North Star > Phase 1 Blueprint > Phase 1 IA Handoff > Module 1 V4
Hardening > Module 1 Reconciliation. Nothing here changes active Module 1 behaviour;
it changes only how Module 1 screens are rendered when they are taken to high fidelity.

---

## 1. Overall visual style

Two skins, one system.

- **Internal shell — "instrument panel".** Calm, dense-but-quiet. Near-neutral surfaces,
  a single decisive accent used only for primary action and active state, structure carried
  by hairline borders and elevation-by-contrast rather than heavy shadows or boxed panels.
  Type does the hierarchy work, not color. Radius small (6–8px), borders 1px, shadows
  reserved for overlays only (drawer, dialog, assistant).
- **External marketplace — "confident retail".** Same grid and components, larger type
  scale, more whitespace, more generous radius (12–16px), one brand image band, and a
  visible progress spine. Fewer elements per screen than internal, never more.
- **Anti-legacy rules (explicit):** no gradient page headers, no icon-in-a-colored-square
  metric tiles, no tab strips inside tab strips, no zebra tables, no modal-inside-modal, no
  sidebar accordion trees more than two levels deep, no dead grey chrome bars. Density is
  achieved by removing decoration, not by shrinking type below 13px.
- **Color discipline:** color is semantic, never decorative. Accent = action. Amber =
  attention/needs-review. Red = blocked/failed. Green = complete/verified. Violet-tinted
  neutral = AI-assisted content. Everything else is neutral. A screen with nothing wrong
  on it should show at most one accent color.
- **Token model:** all values in `src/styles.css` as oklch semantic tokens
  (`--background`, `--foreground`, `--card`, `--border`, `--primary`, `--accent`,
  `--warning`, `--destructive`, `--success`, `--ai`, plus `--surface-1/2/3`,
  `--radius-*`, `--shadow-overlay`). Components consume tokens only — never literal colors.
  A second layer, `--brand-*`, is tenant-supplied and maps into the token set at runtime.

## 2. Layout grid

- 12-column fluid grid, 24px gutter desktop / 16px tablet / 12px mobile.
- Internal content max-width 1440px; text-heavy reading blocks capped at 76ch.
- Consumer content max-width 1200px, hero band full-bleed.
- 4px spacing base; the allowed spacing set is 4/8/12/16/24/32/48/64 only.
- Shell frame: left nav 264px expanded / 64px collapsed, top bar 56px, right drawer
  400px overlay under 1600px and push-mode at or above 1600px, assistant docked
  bottom-right at 56px collapsed.
- Three canonical content widths: **full** (tables, graphs, boards), **split 60/40**
  (object page: record + rail), **narrow 720px** (wizards, forms, single decisions).

## 3. Navigation behavior

- **Top global bar (fixed, platform-owned):** workspace switcher, entity switcher,
  global search, notifications, tasks, AI assistant entry, profile. Order is fixed;
  labels are configurable.
- **Left nav = modules only**, grouped (Work / Sales / Administration), max two levels.
  Nested modules (Appointments–Paper–Referrals, AI–Plan-O–Governance) never appear at
  top level. A module the role cannot access is **absent**, not disabled.
- Workspace switch is a context change, not a page: nav, labels and entity scope swap,
  the user lands on that workspace's configured default landing page, and the workspace
  is reflected in the URL so links are shareable and restorable.
- Entity switch keeps the current module and re-scopes data; if the module does not exist
  for that entity, the user is told which module they were moved to and why.
- In-page navigation: tabs for peer views of one object, never for separate objects.
  Breadcrumb shows workspace → object type → object. Back always returns to the list with
  filters and scroll position intact.
- Consumer surfaces get no left nav and no workspace switcher: a slim branded header,
  a step spine when in a flow, and a footer carrying licensure and disclosures.

## 4. Card patterns

Four card types only, so the system stays legible:

1. **Metric card** — label, value, delta, sparkline slot, one drill-through. No icon tile.
2. **Object card** — title, 3–5 key/value facts, status chip, one primary + overflow menu.
   Used for entities, agents, appointments, leads.
3. **Plan/product card** — consumer-facing: carrier, plan name, premium, deductible,
   out-of-pocket max, network and drug indicators, compare checkbox, select. The comparison
   fields sit in the same slots on every card so the eye can scan a column.
4. **Task/needs-attention card** — reason, object link, age, owner, single resolving action.

Rules: cards do not nest; a card has at most one primary action; a card never hides
information behind hover; card grids collapse to a list below 640px.

## 5. Table / list patterns

- Dense table is the default for internal data: 40px rows, sticky header, sticky first
  column, right-aligned numerics with tabular figures, no zebra striping — hairline row
  rules instead.
- Column set is configurable per user and remembered; ACL removes columns rather than
  masking them, and a masked-but-present value is shown as a lock affordance with the
  permission that would reveal it.
- Filters as a single filter bar with chip summaries, saved views, and a URL-serialised
  state so a filtered list is shareable.
- Bulk selection reveals an action bar in place — never a floating toolbar. Every bulk
  action states its scope and count before it runs.
- Row click opens the object page; secondary actions live in an overflow menu, never as
  four icon buttons per row.
- Below 900px, tables become stacked record rows: primary line, two supporting facts,
  status chip, chevron.
- Every table has three states beyond data: empty, filtered-to-empty (with "clear filters"),
  and permission-limited ("N rows hidden by your access scope").

## 6. Object page patterns

One object framework for every record — lead, member, application, entity, agent,
appointment, policy, statement.

- **Header:** object type eyebrow, name, ID chip, status chip, ownership/entity line,
  primary action, overflow.
- **Body:** tabs for peer views (Overview, Details, Documents, Activity, Related,
  Commissions where permitted).
- **Right rail (in-page, distinct from the drawer):** summary facts, next best action,
  linked objects.
- **Right drawer (overlay):** page-level context, help, guidance, audit, next actions.
- Activity is one merged, filterable stream: events, communications, AI interactions,
  human decisions, audit entries.
- Edit is inline per section with explicit save; long or regulated edits open the narrow
  form pattern instead. No page-wide "edit mode".
- Sensitive sections are separately gated and log a view event when opened.

## 7. Form patterns

- Single column, 720px, one question group per card, labels above fields, help text
  persistent (not tooltip-only).
- Validation on blur; errors sit under the field with the fix stated, plus a summary at
  submit that links to the first failure. Never a bare "invalid input".
- Required/conditional/derived/read-only are visually distinct; conditional fields animate
  in and never shift the field the user is focused on.
- Autosave-with-status for long forms ("Saved 12:04"), explicit submit for anything that
  crosses a compliance boundary.
- Regulated fields carry their disclosure inline, adjacent to the input, not in a footer.
- Configurator-driven forms (form configurator output) render through this same pattern,
  so a carrier-specific form never looks like a different product.

## 8. Wizard patterns

- Horizontal step spine on desktop, compact "Step 3 of 6" on mobile; steps are named,
  not numbered only.
- One decision per step; the primary action is bottom-right and states the outcome
  ("See plans", "Submit application"), never "Next" alone.
- Save-and-resume is a first-class control on every step, with a visible resume token or
  account prompt; leaving mid-flow never loses input.
- Back is always non-destructive. Completed steps are re-enterable; future steps are not.
- A final review step is mandatory for anything that submits externally, and it shows
  exactly what will be sent and to whom.
- Consumer wizards show progress and remaining effort; internal wizards additionally show
  readiness checks (what still blocks submission).

## 9. Timeline patterns

- One vertical timeline component, three densities: full (audit), grouped-by-day
  (activity), compact (drawer).
- Each entry: timestamp, actor (human, system, AI, external partner — visually distinct),
  action, object reference, and an expandable detail with before/after where relevant.
- Filter by actor type, event class and date; AI entries are tinted with the AI token and
  always show the human decision that followed.
- Append-only entries are visually marked as immutable; nothing in the UI implies an audit
  entry can be edited.

## 10. Alert and compliance disclosure patterns

Four ranks, deliberately few:

1. **Inline disclosure** — quiet, always-visible, adjacent to the thing it qualifies
   (estimate caveats, ranking basis, not-advice). Cannot be dismissed.
2. **Banner** — page-scoped state the user must know (synthetic/demo mode, degraded
   integration, expired appointment). Persistent while true.
3. **Blocking dialog** — only for irreversible or externally-committing actions; states
   what happens, who receives it, and what cannot be undone.
4. **Toast** — confirmations only. Never used for errors or compliance content.

Compliance rules: required disclosures are locked content, not configurable copy; they are
rendered from the compliance layer and cannot be hidden by branding or label configuration;
estimate figures always carry their basis and effective date; consent captures show what is
consented to, at what time, and how to withdraw.

## 11. Empty states

Three flavors, each with one action:

- **Nothing yet** — what this space will hold, one action to create the first record.
- **Nothing matches** — restate the active filters, offer clear-filters.
- **Nothing visible to you** — say it is an access scope, name the permission or the
  request path. Never present a permission wall as an error or as "no data".
- Configuration-empty is a fourth, narrower case (no products enabled, no schedule set):
  it names the blocking configuration and links the admin screen if the user may reach it.

No illustrations-with-mascots; a light structural graphic plus one sentence.

## 12. Loading states

- Skeletons that match final layout for first paint; never a full-page spinner.
- Streaming/progressive: shell and nav render immediately, data regions fill in.
- Optimistic UI only for reversible local actions; anything that submits externally or
  moves money shows a determinate pending state with what is happening.
- Long jobs (statement generation, packet build, rate refresh) run in the background with
  a task entry and a notification, never a blocked screen.
- Explicit timeout and retry states — a stalled region says so rather than shimmering
  forever. AI responses stream with a visible stop control.

## 13. Right drawer patterns

- One drawer, six fixed sections in fixed order: **Context, Summary, Guidance,
  Help & FAQ, Audit, Next actions.** Content is per-screen and configurable; the structure
  never varies, so users learn it once.
- Overlay under 1600px, push-mode above; width 400px; keyboard-dismissable; open state
  remembered per module.
- Read and act: "Next actions" may contain real actions, scoped by ACL, and each states
  its consequence.
- The drawer never contains the only path to a critical action, and never duplicates the
  page's primary action.
- Internal-shell pattern only. Consumer and member surfaces use a simplified help sheet
  instead — the drawer is not a consumer element.

## 14. Bottom assistant patterns

- Docked bottom-right on both surfaces: collapsed pill → panel; the panel never covers the
  primary action of the current screen.
- Three modes in one surface: **FAQ/help browse**, **chat**, and **contextual copilot**
  (screen-aware suggestions). Mode is a segmented control, not three separate widgets.
- Grounded by construction: answers come from approved knowledge sources for that surface
  and audience, cite their source internally, and carry the configured disclaimers.
- Escalation to a licensed human is always one control away and is mandatory on advice,
  eligibility, cost-guarantee, complaint or distress triggers.
- AI-authored content is visually marked with the AI token wherever it lands, and anything
  consumer-reaching requires a human confirm step showing exactly what will be sent.
- The assistant is absent — not disabled — where AI is off for the tenant, module or role.

## 15. White labeling strategy

- **Three layers.** Platform tokens (structure, spacing, states — never tenant-editable);
  brand tokens (logo, brand color set, typography pair, radius scale, image treatment);
  content configuration (labels, help, FAQ, disclosures-that-are-additive).
- **Brand color mapping is validated, not free.** A tenant supplies brand colors; the system
  derives on-color pairs and state variants and refuses a combination that fails contrast,
  offering the nearest compliant value. A tenant cannot ship an unreadable marketplace.
- **Locked set:** regulated terms, required disclosure wording, licensure line, status
  semantics (what red/amber/green mean), and the structural layout of compliance blocks.
- **Label dictionary drives every string.** No hardcoded "Agency"/"Agent"/"Member" in any
  component; labels change display only and never change permissions or object identity.
- **Inheritance:** child entities inherit, override logo only, or run independent —
  a per-entity setting with a visible resolved-brand indicator.
- **Versioned and previewable:** brand and label sets are published as versions, previewable
  per surface and per audience, so a generated document or emailed template is reproducible
  from the version that produced it.
- Internal shell is lightly branded (logo, accent, name); heavy branding is a consumer-surface
  concern. Platform-owned chrome stays recognisably ABox for support and audit reasons.

## 16. Accessibility considerations

- WCAG 2.2 AA as the floor, verified in both skins and in every tenant brand via the
  contrast-validated brand mapping.
- Full keyboard operability: skip links, visible focus rings on tokens (never `outline: none`),
  logical tab order, focus trap and restore for drawer/dialog/assistant, Escape closes overlays.
- Semantic HTML first: one H1 per screen, real landmarks, real tables for tabular data,
  labelled form controls, fieldset/legend for grouped inputs.
- Status is never color-only — always color plus text or shape. Same for required, error and
  AI-generated marking.
- Live regions for autosave, validation summaries, streaming AI output and background job
  completion; announcements are polite except for blocking errors.
- Minimum 14px body internally, 16px on consumer surfaces; 44px touch targets on mobile;
  `prefers-reduced-motion` honoured (motion becomes opacity-only).
- Data density is a user setting (comfortable/compact) rather than a fixed choice, and zoom
  to 200% must not break the shell.
- Consumer flows are tested with screen reader and keyboard end to end, since they are the
  surfaces a member may be legally entitled to use.

## 17. Responsive behavior

- Breakpoints: `<640` mobile, `640–1024` tablet, `1024–1600` desktop, `≥1600` wide.
- Mobile internal: left nav becomes a sheet, top bar keeps search/notifications/profile,
  drawer becomes a full-height sheet, tables become stacked rows, assistant becomes a
  bottom bar entry. Nothing is removed — everything is reachable.
- Tablet: nav collapses to icons with labels on hover/focus, split 60/40 becomes stacked,
  drawer is overlay.
- Wide: drawer moves to push mode, tables gain columns rather than stretching, content stays
  capped so lines never run long.
- Consumer flows are mobile-first: single column throughout, sticky summary/premium bar,
  step spine compacted, compare falls back to a swipeable two-up view with the same field
  slots.
- Internal is desktop-first but must remain fully operable on a phone for agent field work:
  quick quote, send quote, lead review and callback scheduling are explicitly designed for
  one-handed mobile use.

---

## What I need from you before high fidelity

Palette, typography pair and consumer layout archetype. Those three choices resolve the
brand token layer; everything above is independent of them and stays as specified.
