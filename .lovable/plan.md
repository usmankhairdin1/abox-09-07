# Phase 54 / Batch B7 — Shells Plan Only

## Locked scope

- Plugin layer only. No files under `src/**` change.
- B1–B6 are protected and read-only: no recreate, rename, delete, move, mutation, property change, binding change, or id rewrite.
- B7 may populate only the existing B0 page `03 Shells`.
- `00 Foundations`, `01 Components`, `02 Patterns`, `04 Experiences`, `05 Screens`, and `06 Documentation` remain unchanged by B7, except for normal instance references from shell components to already-existing live B4/B5/B6 assets.
- No publishing, no application route/navigation/layout/style/business-logic change, no B8 screen work, no generic responsive system, and no invented interaction.

## Source audit summary

### Shell source files inspected

| Shell | Source evidence | Owned structure | Props / state | Decision |
|---|---|---|---|---|
| Internal Shell | `src/components/abox/internal-shell.tsx:39-140`, rail `:146-237`, mobile nav `:294-331`, top-bar controls `:342-501` | Root app workspace shell with detached desktop rail, mobile sheet trigger, top bar, workspace/entity control, search, action orbs, optional page-header region, content region, assistant launcher | `workspace`, `entity`, `pageTitle`, `eyebrow`, `actions`; local state `railCollapsed`, `activeEntity`; route-driven active nav | CREATE |
| Marketplace Shell | `src/components/abox/marketplace-shell.tsx:35-190`, `PillLink` `:193-203`, footer column `:205-223`; product rail source `src/components/abox/product-switcher.tsx:20-78` | Root marketplace shell with floating pill header, marketplace nav, cart/sign-in/account branch, optional product switcher rail, content region, footer plate, assistant launcher | `variant`, `showAssistant`, `product`, `showProducts`; session/cart/brand-derived branches | CREATE |
| Member Shell | `src/components/abox/member-shell.tsx:35-145`; member nav source `src/lib/nav-config.ts:251-257` | Root member workspace shell with sticky pill header, greeting/actions, horizontal-to-side member navigation rail, card content region, assistant launcher | `children`; session/loading redirect; route-driven active nav | CREATE |

### Consumer audit

| Shell | Route files | Render sites | Consumer evidence | Qualification |
|---|---:|---:|---|---|
| Internal Shell | 87 | 107 | Direct `InternalShell` imports/renders across agency, agent, JET, employer, partner, marketplace-admin, and platform routes; workspaces used: agency 74, agent 14, jet 17, employer 1, partner 1; every render site passes `eyebrow` and `pageTitle`; 24 render sites pass `actions` | Reusable production shell consumed by many real routes |
| Marketplace Shell | 30 | 35 | Direct `MarketplaceShell` imports/renders across public shopping, auth, legal/help, sharing, quote/plan/review, unavailable, and referral routes; prop usage: `variant` 12, `showAssistant` 10, `product` 7 | Reusable production shell consumed by many real routes |
| Member Shell | 4 | 4 | Direct `MemberShell` imports/renders in `member.index.tsx`, `member.quotes.tsx`, `member.messages.tsx`, `member.settings.tsx` | Reusable production shell consumed by multiple member routes |

Internal route files: `agency.downlines.new.activate.tsx`, `agency.downlines.new.administrator.tsx`, `agency.downlines.new.contacts.tsx`, `agency.downlines.new.identity.tsx`, `agency.downlines.new.legal.tsx`, `agency.downlines.new.locations.tsx`, `agency.downlines.new.readiness.tsx`, `agency.downlines.new.settings.tsx`, `agency.marketplace-participation.tsx`, `agency.my-organization.tsx`, `agency.organization-admin.tsx`, `agency.organization-defaults.apply.tsx`, `agency.organization-imports.$importJobId.tsx`, `agency.organization-imports.index.tsx`, `agency.organization-structure.tsx`, `agency.organization-work.tsx`, `agency.organizations.$organizationId.contacts.tsx`, `agency.organizations.$organizationId.ending.tsx`, `agency.organizations.$organizationId.history.tsx`, `agency.organizations.$organizationId.identifiers.tsx`, `agency.organizations.$organizationId.index.tsx`, `agency.organizations.$organizationId.lifecycle.tsx`, `agency.organizations.$organizationId.locations.tsx`, `agency.organizations.$organizationId.readiness.tsx`, `agency.organizations.$organizationId.relationships.tsx`, `agency.organizations.$organizationId.settings.tsx`, `agency.organizations.index.tsx`, `agency.reference-organizations.request.tsx`, `app.agency.entities.tsx`, `app.agency.index.tsx`, `app.agency.producers.tsx`, `app.agency.revenue.tsx`, `app.agency.statements.tsx`, `app.agent-profile.tsx`, `app.commissions.tsx`, `app.communications.tsx`, `app.customers.$id.tsx`, `app.customers.index.tsx`, `app.dashboard.tsx`, `app.employer.ichra.tsx`, `app.index.tsx`, `app.jet.acl.tsx`, `app.jet.ai-governance.tsx`, `app.jet.appointments.tsx`, `app.jet.audit.tsx`, `app.jet.branding.tsx`, `app.jet.form-configurator.tsx`, `app.jet.integrations.tsx`, `app.jet.module1.tsx`, `app.jet.notifications.tsx`, `app.jet.platform.tsx`, `app.jet.product-builder.tsx`, `app.jet.products.tsx`, `app.my-work.tsx`, `app.off-exchange.tsx`, `app.partner.tsx`, `app.quick-quote.tsx`, `app.schedule.tsx`, `app.send-quote.tsx`, `app.tasks.tsx`, `marketplace.admin.activation.tsx`, `marketplace.admin.assets.tsx`, `marketplace.admin.availability.$availabilityEntryId.tsx`, `marketplace.admin.availability.index.tsx`, `marketplace.admin.brand.tsx`, `marketplace.admin.content.tsx`, `marketplace.admin.domains.index.tsx`, `marketplace.admin.domains.request.tsx`, `marketplace.admin.health.tsx`, `marketplace.admin.history.tsx`, `marketplace.admin.index.tsx`, `marketplace.admin.lifecycle.tsx`, `marketplace.admin.participants.$participantId.tsx`, `marketplace.admin.participants.index.tsx`, `marketplace.admin.preview.tsx`, `marketplace.admin.readiness.tsx`, `marketplace.admin.referral-links.$referralLinkId.tsx`, `marketplace.admin.referral-links.index.tsx`, `marketplace.admin.releases.compare.tsx`, `marketplace.admin.releases.review.tsx`, `marketplace.admin.releases.schedule.tsx`, `marketplace.admin.routing-support.tsx`, `marketplace.admin.work.tsx`, `platform.marketplaces.$marketplaceId.override.tsx`, `platform.marketplaces.index.tsx`, `platform.organizations.$organizationId.override.tsx`, `platform.organizations.index.tsx`.

Marketplace route files: `accessibility.tsx`, `agent-unavailable.tsx`, `ai-review.tsx`, `apply.tsx`, `auth.tsx`, `cart.tsx`, `compare.tsx`, `compliance.tsx`, `coverage.tsx`, `faq.tsx`, `handoff.tsx`, `ichra.tsx`, `index.tsx`, `journey-choice.tsx`, `no-options.tsx`, `plans.$planId.tsx`, `plans.index.tsx`, `privacy.tsx`, `quote.tsx`, `r.$referralToken.tsx`, `review.tsx`, `schedule.tsx`, `select.tsx`, `shared.$token.tsx`, `start.$pathway.tsx`, `support.tsx`, `terms.tsx`, `unavailable.pathway.tsx`, `unavailable.suspended.tsx`, `unavailable.unresolved.tsx`.

Member route files: `member.index.tsx`, `member.messages.tsx`, `member.quotes.tsx`, `member.settings.tsx`.

## Candidate inventory

| Shell | Source | Consumers | Reusable structure | Existing B4/B5/B6 assets used | Responsive behavior | Interaction | Decision |
|---|---|---|---|---|---|---|---|
| Internal Shell | `internal-shell.tsx:39-140`, `:146-237`, `:294-331`, `:342-501` | 87 route files / 107 render sites | Root + detached desktop rail + mobile sheet trigger + top bar + optional page-header band + content slot + assistant launcher | `ABox/Brand/AboxMark`; possible B4/B5 `ABox/Action/ActionPill` only for sample action placeholders if required by a source-backed `actions` region; no B6 pattern because the shell source does not consume one | Desktop rail at `lg:flex`; mobile/tablet sheet trigger at `lg:hidden`; left content offset switches `lg:pl-[104px]`/`lg:pl-[292px]`; search visible at `lg:flex`; workspace label visible at `xl:inline`; account label visible at `lg:inline` | Rail collapse toggle, workspace dropdown, mobile sheet, notifications popover, account dropdown, theme toggle, route-driven active nav; documented only unless a destination is already represented in B7 without inventing screen frames | CREATE |
| Marketplace Shell | `marketplace-shell.tsx:35-190`, product rail `product-switcher.tsx:20-78` | 30 route files / 35 render sites | Root + floating pill header + marketplace nav + cart/account/sign-in branch + optional product switcher strip + content slot + footer plate + assistant launcher | `ABox/Brand/AboxMark`; no B6 pattern because the shell source does not consume B6 patterns | Header offset differs for `variant="landing"`; brand text hidden below `md`; pill links hidden below `md`; cart monthly text hidden below `sm`; footer grid changes at `md`; product rail wraps at `md` | Auth branch, cart-count branch, account dropdown, sign-out, assistant open/closed, link navigation; documented only, no prototype destinations invented | CREATE |
| Member Shell | `member-shell.tsx:35-145`, `nav-config.ts:251-257` | 4 route files / 4 render sites | Root + sticky pill header + member greeting/actions + member nav rail + content canvas + assistant launcher | `ABox/Brand/AboxMark`; no B6 pattern because the shell source does not consume B6 patterns | Shell body changes `flex-col` to `md:flex-row`; nav changes horizontal scroll to `md:flex-col`; connector arc hidden below `md`; content padding changes at `md`; sign-out text hidden below `sm`; greeting hidden below `md` | Auth redirect/loading branch, route-driven active member nav, theme toggle, sign-out, assistant launcher; documented only, no prototype destinations invented | CREATE |

## Figma shell assets to create

B7 creates exactly three standalone Figma Components and zero Component Sets:

| Shell asset | Figma object type | Component sets | Physical B7 ComponentNodes | Target page |
|---|---|---:|---:|---|
| `ABox/Shell/Internal` | Component | 0 | 1 | `03 Shells` |
| `ABox/Shell/Marketplace` | Component | 0 | 1 | `03 Shells` |
| `ABox/Shell/Member` | Component | 0 | 1 | `03 Shells` |

No desktop/mobile variants are created. Responsive branches are represented only where static layout, auto-layout, constraints, or documented metadata can express them faithfully without inventing a structural mode.

## Representation details

### Shared shell rules

- Each shell root is a standalone `ComponentNode` named exactly as listed above.
- Each shell includes a named `content-region` frame as a structural placeholder, not a screen and not a new production primitive.
- No generic React `children` property is invented.
- No instance-swap or slot property is created unless the live Figma structure supports it and the shell source itself provides source-backed evidence. Initial B7 defaults to explicit structural frames for content regions.
- Decorative production utilities that lack Figma-native parity, such as fixed `DotField`, `Aurora`, and CSS-only hover/focus effects, are recorded as limitations rather than approximated by new primitives.
- `ABox/Brand/AboxMark` must be resolved live and instanced wherever the shell source renders `AboxMark`.
- All fills/strokes/effects/typography must bind to existing B1/B2/B3 foundations by live style/variable identity where available: `background`, `foreground`, `card`, `surface`, `primary`, `primary-foreground`, `muted-foreground`, `hairline`, `sidebar`, `sidebar-foreground`, `sidebar-border`, `sidebar-accent`, `sidebar-primary`, `shadow-plate`, `shadow-glow`, `shadow-elevated`, and existing text styles.
- Values with no B1/B2/B3 representation are printed as gaps, not hard-coded.

### `ABox/Shell/Internal`

Static representation:

1. Root app shell frame: production root `relative min-h-dvh bg-background text-foreground` (`internal-shell.tsx:48`).
2. Detached desktop rail frame: fixed-position production rail from `internal-shell.tsx:157-236`; represent the expanded state as the canonical static shell because it is the default state (`railCollapsed` initial false at `:43`).
3. Mobile sheet trigger branch: document the `lg:hidden` trigger and sheet content (`:72-85`, `:294-331`) as responsive/interaction metadata; do not create a mobile variant.
4. Header/top bar frame: `sticky top-0`, glass rounded pill, max width 1500, spacing and top-bar regions from `:65-106`.
5. Workspace/entity control frame: source `WorkspacePill` (`:342-386`) with text placeholders from the default props and `ENTITIES` list; dropdown menu is documented, not prototyped.
6. Search frame: visible at `lg:flex`, source `:89-97`; represented as a static top-bar child and marked with its responsive visibility metadata.
7. Action-orb group: tasks, notifications, theme toggle, account pill from `:99-104`, `:390-501`; popover/dropdown behavior documented only.
8. Optional page-header band: because every observed render site passes `pageTitle` and `eyebrow`, B7 includes the shell-owned header region from `:111-128` with static sample text and an `actions-region` placeholder. It does not reuse B4 `PageHeader`, because the production shell owns a custom section rather than consuming the B4 component.
9. Content region: frame corresponding to `main id="main"` (`:130-133`) labelled `content-region — shell placeholder`.
10. Assistant launcher region: source `:139`; documented as shell-level floating assistant affordance, with open dialog deferred because the assistant overlay is behavior/screen-adjacent and not a shell layout primitive.

### `ABox/Shell/Marketplace`

Static representation:

1. Root flex column shell: production root `relative flex min-h-dvh flex-col bg-background text-foreground` (`marketplace-shell.tsx:47`).
2. Header pill frame: sticky `top-4` default flow shell, source `:57-141`; `landing` top offset is documented as a prop-driven responsive/position note, not a variant.
3. Brand/home region: live `ABox/Brand/AboxMark` instance and brand text structure from `:59-64`; runtime branding values are sample text only and not transferred into foundations.
4. Marketplace nav region: `PillLink` items and cart/sign-in account branch from `:67-137`, using structural text/icon placeholders where no B4 control exists. Auth/cart dynamic branches are documented, not encoded as variants.
5. Product switcher rail: included because default `variant="flow"` makes `withProducts` true (`:38`) and the source renders `ProductSwitcher` at `:140`; structure comes from `product-switcher.tsx:20-78`. It is built as shell structure, not as a new primitive, because no B4/B6 product-switcher component exists.
6. Content region: `main id="main"` from `:143-145`, labelled `content-region — shell placeholder`.
7. Footer plate: monolithic footer from `:148-186`, including live `ABox/Brand/AboxMark` instance and link-column structure; footer grid responsive behavior documented from `:151` and `:177`.
8. Assistant launcher: source `:188`; represented only as shell-level launcher affordance; open panel documented/deferred.

### `ABox/Shell/Member`

Static representation:

1. Root flex column shell: source `member-shell.tsx:61-62`.
2. Header pill frame: sticky header from `:68-93`, including live `ABox/Brand/AboxMark`, member workspace text, greeting region, theme toggle affordance, and sign-out affordance.
3. Member workspace body: `max-w-[88rem]`, `flex-col` to `md:flex-row`, spacing from `:95`.
4. Member navigation rail: source `:97-134`, driven by `MEMBER_NAV` (`nav-config.ts:251-257`). Include the five member nav items in source order and one route-driven active sample. The connecting arc is documented as a CSS gradient limitation, not approximated by a fake gradient primitive unless existing foundations support it exactly.
5. Content canvas: source `:136-139`, with `bg-card`, `border-hairline`, rounded 3xl, and padding. Include `content-region — shell placeholder` inside.
6. Assistant launcher: source `:142`; represented as shell-level launcher affordance, open panel deferred.

## Responsive audit and classification

| Shell | Source behavior | Figma representation | Limitation / deferral |
|---|---|---|---|
| Internal | Desktop rail hidden below `lg`; mobile sheet trigger shown below `lg` (`internal-shell.tsx:55-85`, `:157-162`) | Expanded desktop rail represented; mobile trigger/sheet recorded as metadata | No desktop/mobile variant; sheet open/close not prototyped because B7 has no B8 destination screens |
| Internal | Content offset changes by rail collapse: `lg:pl-[104px]` vs `lg:pl-[292px]` (`:63`) | Default expanded offset represented; collapsed offset documented | Collapse state not a variant; it would require a shell state axis not requested by production as reusable shell mode |
| Internal | Search hidden below `lg`; workspace label only `xl`; account label only `lg` (`:89`, `:356`, `:480`) | Static desktop representation with visibility metadata | No breakpoint variants |
| Marketplace | Landing header top changes `top-6`; default `top-4` (`marketplace-shell.tsx:57`) | Default flow shell represented; landing offset documented | No `variant` axis because the user required no shell Component Set unless needed; B7 uses smallest faithful shell |
| Marketplace | Brand text hidden below `md`; pill links hidden below `md`; cart monthly text hidden below `sm` (`:61`, `:92`, `:197`) | Desktop/default structure represented with visibility metadata | No mobile variant |
| Marketplace | Product switcher wraps at `md`; footer grid changes at `md` (`product-switcher.tsx:24-26`, `marketplace-shell.tsx:151`, `:177`) | Auto-layout/wrap metadata where faithful; static footer structure represented | No breakpoint simulation |
| Member | Body switches `flex-col` to `md:flex-row` (`member-shell.tsx:95`) | Desktop row body represented with metadata for mobile column | No desktop/mobile variant |
| Member | Member nav switches horizontal scroll to vertical rail; connector arc hidden below `md` (`:101`, `:100`) | Desktop side rail represented; mobile scroll documented | No breakpoint variants; gradient arc is a limitation unless exact foundation support exists |
| Member | Greeting hidden below `md`; sign-out text hidden below `sm` (`:78`, `:89`) | Desktop header represented with visibility metadata | No breakpoint variants |

## Interaction audit and classification

| Shell | Source behavior | Figma representation | Exact target | Prototype | Limitation |
|---|---|---|---|---|---|
| Internal | Route-driven active nav via `isNavActive` (`internal-shell.tsx:201-213`, `:285-292`) | One static active sample in nav; metadata records rule | Internal rail item | None | Destinations are app routes/screens not represented in B7 |
| Internal | Rail collapse toggle (`:43`, `:59-60`, `:175-185`) | Documented interaction metadata only | Desktop rail | None | No shell state axis is created; B7 does not create collapsed variant |
| Internal | Mobile sheet trigger (`:72-85`) | Documented interaction metadata only | Mobile trigger/sheet | None | Overlay primitive not represented in B4/B5/B6 and no mobile variant created |
| Internal | Workspace dropdown (`:350-385`), notifications popover (`:403-435`), account dropdown (`:468-499`) | Documented interaction metadata only | Top-bar controls | None | Overlay behavior deferred; no fake dropdown frames |
| Internal | Theme toggle (`theme-toggle.tsx:35-58`) | Static icon/control affordance only | Header action group | None | Theme state changes app theme, not a B7 shell variant |
| Marketplace | Auth branch sign-in vs account dropdown (`marketplace-shell.tsx:96-137`) | Static signed-out branch by default; signed-in branch documented | Header nav | None | Auth/session state not encoded as shell axis |
| Marketplace | Cart count branch (`:73-95`) | Static empty-cart branch by default; filled cart documented | Cart nav item | None | Cart data state not encoded as shell axis |
| Marketplace | Product link active state (`product-switcher.tsx:29-48`) | One static active sample if product rail is rendered | Product rail item | None | No prototype destinations invented |
| Marketplace | Assistant open/close (`plan-o-assistant.tsx:14-98`) | Launcher affordance documented | Floating assistant | None | Open conversation panel is overlay/screen-adjacent and deferred |
| Member | Auth loading/redirect (`member-shell.tsx:40-56`) | Documented only | Root shell | None | Auth gate state is not shell asset content |
| Member | Route-driven active nav (`:103-122`) | One static active sample in member nav | Member nav item | None | No prototype destinations invented |
| Member | Sign out (`:44-47`, `:83-90`) and theme toggle (`theme-toggle.tsx:35-58`) | Static controls documented | Header controls | None | No runtime auth/theme behavior in B7 |

## Deterministic identity and structural signature

Each created shell signature must include:

- exact shell name;
- source component file and export name;
- root component id, node type, root name;
- layout mode, sizing modes, wrapping, padding, gaps;
- fills, strokes, effects and their live style/variable identities;
- child order and child node types;
- nested live component names and ids, especially `ABox/Brand/AboxMark`;
- nested component property values where an existing B4/B5/B6 instance is used;
- shell content-region identity and label;
- source file/line evidence for every major region;
- responsive classifications;
- interaction metadata;
- limitations and deferred behaviors.

Visual equality is never used for identity.

## Idempotency plan

Run 1:

- Resolve `03 Shells` exactly once.
- Resolve all required live B4/B5/B6 components by exact name and id before creating shell components.
- Read the live `03 Shells` inventory.
- Create only missing approved shell Components.
- Capture ids and print structural signatures.
- Stop on duplicate shell identity anywhere in the file.

Run 2:

- Resolve existing shell Components by deterministic identity/name plus structural signature.
- Create zero B7 objects.
- Preserve all shell ids.
- If a shell exists with materially different structure, STOP, print live vs expected signature, overwrite nothing, delete nothing.

## Verification plan — `b7-verify`

At minimum, `b7-verify` will assert:

1. `src/**` unchanged.
2. B1 still has 9 collections / 200 variables.
3. B2 still has 1 collection / 19 variables.
4. B3 still has 79 styles.
5. B4 unchanged.
6. B5 unchanged.
7. B6 unchanged.
8. Existing B4/B5/B6 ids preserved.
9. Existing B4/B5 component-property ids preserved.
10. No primitive or Component Set duplication.
11. Only `03 Shells` receives B7 content.
12. Exactly the approved CREATE shell inventory exists: `ABox/Shell/Internal`, `ABox/Shell/Marketplace`, `ABox/Shell/Member`.
13. Every shell matches its source-backed structural signature.
14. Every nested component resolves to the expected live component id.
15. No hard-coded duplicate foundation value.
16. No invented responsive variant.
17. No invented interaction.
18. No screen-level content is embedded.
19. No B6 pattern is mutated.
20. No B4/B5 primitive is mutated.
21. Run 2 creates zero objects and reports identical ids.
22. Real Figma ids are explicitly distinguished from offline/mock ids.
23. Responsive and interaction audit rows are printed for every shell.
24. No deferred/rejected B8 screen content is created on `03 Shells`.
25. `03 Shells` contains exactly 3 B7 top-level shell Components and 0 B7 Component Sets.

Failure line:

`RESULT: B7 FAILED — do not proceed to B8.`

Success line:

`RESULT: B7 PASSED`

## Final inventory output

B7 must print:

| Shell | Root id | Root name | Nested component ids | Content region | Responsive behavior | Interaction metadata | Source evidence |
|---|---|---|---|---|---|---|---|
| ABox/Shell/Internal | live id | exact name | live nested ids | content-region placeholder | printed audit rows | printed audit rows | `internal-shell.tsx` line evidence |
| ABox/Shell/Marketplace | live id | exact name | live nested ids | content-region placeholder | printed audit rows | printed audit rows | `marketplace-shell.tsx` and `product-switcher.tsx` line evidence |
| ABox/Shell/Member | live id | exact name | live nested ids | content-region placeholder | printed audit rows | printed audit rows | `member-shell.tsx` and `nav-config.ts` line evidence |

Also print:

- total shell Components created: 3 when absent on Run 1;
- total shell Component Sets created: 0;
- total B7 physical ComponentNodes: 3;
- Run 1 creation count;
- Run 2 creation count;
- identical-id result;
- explicit note that offline/mock ids are not real Figma ids.

## Files for implementation after approval

Smallest plugin-layer change set:

- Add `tools/figma-plugin/extract-b7.mjs`.
- Generate `tools/figma-plugin/tokens-b7.js` from the audited source inventory.
- Extend `tools/figma-plugin/plugin.js` with B7 create/verify routines and entry handlers.
- Add B7 controls to `tools/figma-plugin/ui.html`.
- Extend `tools/figma-plugin/build.mjs` so `code.js` includes `tokens-b7.js`; never hand-edit `code.js`.
- Append B7 usage and verification notes to `tools/figma-plugin/README.md` and `.lovable/manual-work-map.md`.

No implementation occurs in this plan-only step.
