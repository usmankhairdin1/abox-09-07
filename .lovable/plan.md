# Next Step — Backfill Internal & Admin Workspace from Reference

## Current state
- Consumer/shopper flow (`/`, `/select`, `/quote`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff`, `/member/*`, `/ichra`, etc.) is complete and equivalent to the reference app.
- Target internal workspace only has five `/app/*` pages: `index`, `dashboard`, `my-work`, `object`, `admin`.
- Nav-config already advertises many `/app/*`, `/agency/*`, `/marketplace/*`, and `/platform/*` routes, but the files do not exist in the target (dead links).
- Reference app contains the missing internal/admin surface: `/app/customers`, `/app/tasks`, `/app/quick-quote`, `/app/off-exchange`, `/app/jet/*`, `/app/agency.*`, `/agency/*` (M05), `/marketplace/*` (M04), `/platform/*`.
- Target-only surfaces (`/lucie/*`, `/gov/*`, `/m00/*`, `/m06/*`, Cloud Postgres schemas for M00/M05/M06) must stay intact.

## Goal
Make every advertised internal/admin link work by porting the reference implementation, then reconcile design, data, and navigation so the target is a single coherent high-fidelity application.

## Plan

### 1. Port missing routes
- Copy reference route files into the target for every missing `/app/*`, `/agency/*`, `/marketplace/*`, and `/platform/*` route.
- Fix import paths to target aliases (`@/components/*`, `@/lib/*`) and design tokens.
- Create route files for nav-config entries that exist in reference but use different path conventions.

### 2. Reconcile the internal shell
- Decide on one internal layout strategy: keep per-page `AppShell` OR add a shared `/app` layout route. Choose the approach that causes the fewest import changes.
- Ensure `ShellProvider` is mounted exactly once at the root and that `useShell` never crosses two provider instances.

### 3. Merge navigation
- Use reference `nav-config.ts` as the source of truth for internal/admin menus.
- Append target-only governance entries (`/lucie`, `/gov`, `/m00`, `/m06`) as a "Governance" section so nothing is lost.
- Remove or hide `scrId`/`KPI_*` tags on product surfaces (`IdChip` already returns null; verify no other labels leak).

### 4. Wire real/demo data
- Replace static placeholder numbers in ported pages with the target's `workspace-data.ts` dataset or equivalent demo records.
- Ensure charts, tables, and KPIs render real-looking values, not authoring IDs.

### 5. Validate end-to-end
- Build and typecheck.
- Run an automated browser sweep of every route in nav-config plus known public flows, confirming 200s and correct H1 titles.
- Fix any runtime errors (`useShell` boundary, missing search params, undefined data).

## Outcome
A fully connected application: public shopper flows → member area → internal operations workspace → governance/data tooling, all with consistent high-fidelity UI and working navigation.
