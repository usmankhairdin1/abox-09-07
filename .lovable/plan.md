# Restructure ABox into a real product: landing → flows → workspace

## What's wrong today

- `/` opens straight into an internal operations dashboard. There is no public landing page and no shopper entry point.
- Headings still carry authoring tags (`SCR_DASHBOARD`, `SCR_DASHBOARD_FILTERS`, `KPI_QUOTES`, `KPI_SUBMITTED`, etc.) that are meaningless to a user.
- Most pages render placeholder bars and grey blocks instead of records.
- Body copy across internal pages sits at 10–12px, so content reads as cramped notes rather than an application.
- Navigation is grouped by build artifacts (`/m1`, `/p1`, `/hf`, `/gov`, `/m00`, `/m06`) instead of by what a user is trying to do.

## Target order of the application

```text
PUBLIC (no login)
  /                landing page (ported from the reference, ABox content)
  /select          product + guided vs. browse path
  /quote           multi-step quote wizard
  /plans           plan results  → /plans/:id detail → /compare
  /cart            cart → /review → /handoff (confirmation)
  /schedule        talk to an agent · /ichra employer · /faq /privacy /terms

MEMBER (after a completed flow / sign-in)
  /member          coverage, quotes, messages, settings

WORKSPACE (agency / operator)
  /auth            sign in
  /app/dashboard   performance
  /app/my-work     tasks + queues
  /app/customers   list → detail
  /app/quotes, /app/applications, /app/products,
  /app/agency (entities · producers · statements),
  /app/commissions, /app/admin (branding, ACL, audit, integrations)

GOVERNANCE (unchanged, kept for traceability)
  /lucie /gov /m00 /m06
```

## Work

### 1. Public landing + shopper flow
- Port the reference landing composition (hero with orbital instrument, path ticker, product bento, assistant orbital, employer plate, trust ladder) into `src/routes/index.tsx` with a `MarketplaceShell`, rewriting the copy for this app and using PlanAI naming.
- Build the ordered consumer flow as real routes: `/select`, `/quote` (stepped wizard with progress, validation, back/next), `/plans`, `/plans/$planId`, `/compare`, `/cart`, `/review`, `/handoff`, plus `/schedule`, `/ichra`, `/faq`, `/privacy`, `/terms`.
- Wizard state persists across steps and drives the plan results and cart, so the flow completes end to end.

### 2. Internal workspace reorganised
- Move the current internal pages under `/app/*` with a single, task-based left nav; keep the existing shell, drawer, and PlanAI assistant.
- The dashboard is no longer the entry point; it is reached after sign-in or from the landing header.
- Old paths (`/dashboard`, `/my-work`, `/object`, `/admin`) redirect to their new homes so nothing breaks.

### 3. Remove authoring tags everywhere
- Delete `SCR_*`, `KPI_*`, `UX-*` chips and `id=` props from all headings, panels, cards, and tables — including the governance estates.
- Keep the stable IDs in code and register data (they still drive traceability logic), just never render them as UI chrome.
- Remove the "Annotation" / implementation-note blocks from product surfaces.

### 4. Real, seeded data
- Add a demo seed migration with believable records: customers/members, quotes, applications, plans and products, agencies and producers, commission statements, tasks, and activity.
- Pages read those rows live through server functions, so lists, detail pages, KPIs, and charts show actual content, with proper loading and empty states.

### 5. Typography and density pass
- Raise base internal content to 14–16px, headings to the reference display scale, and drop the 10–11px mono labels except where a tiny caption is genuinely correct.
- Rebuild placeholder rows/panels as real cards, tables, and stat blocks with reference spacing.

### 6. Auth, ready but off
- Keep `/auth` (email + Google) working and add a route gate that can protect `/app/*` and `/member/*`.
- The gate ships **disabled** behind a single flag so everything stays open for demo; flip the flag when you ask and login is enforced.

## Technical notes

- New routes are TanStack file routes under `src/routes/`; wizard step state lives in typed search params so steps are shareable and back/forward work.
- Seed data goes in a migration with explicit INSERTs plus GRANTs; reads go through `createServerFn`.
- Presentation uses existing semantic tokens in `src/styles.css` and the ported `abox` component kit — no hardcoded colors.
- Governance data modules (`src/lib/lucie`, `src/lib/governed`, M00/M05/M06 registers) are untouched apart from removing rendered ID chips.
