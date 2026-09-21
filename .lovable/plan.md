# Phase 54 / Batch B7 — Shells Plan Only

## Locked scope

- Plugin layer only. No files under `src/**` change.
- B1–B6 are protected and read-only: no recreate, rename, delete, move, mutation, property change, binding change, property-id rewrite, or visual correction.
- B7 may populate only the existing B0 page `03 Shells`.
- `00 Foundations`, `01 Components`, `02 Patterns`, `04 Experiences`, `05 Screens`, and `06 Documentation` remain unchanged by B7, except for normal instance relationships from shell components to already-existing live B4/B5/B6 assets.
- No publishing, no application route/navigation/layout/style/business-logic change, no B8 screen work, no generic responsive system, and no invented interaction.
- Offline/mock ids are never presented as real Figma ids. Real evidence still requires Figma Desktop plugin execution.

## Source audit summary

### Shell source files inspected

| Shell | Source evidence | Owned structure | Props / state | Decision |
|---|---|---|---|---|
| Internal Shell | `src/components/abox/internal-shell.tsx:30-140`, rail `:146-237`, mobile nav `:294-331`, top-bar controls `:342-501` | Root app workspace shell with detached desktop rail, mobile sheet trigger, top bar, workspace/entity control, search, action orbs, optional page-header region, content region, assistant launcher | `children`, `workspace`, `entity`, `pageTitle`, `eyebrow`, `actions`; local state `railCollapsed`, `activeEntity`; route-driven active nav | CREATE |
| Marketplace Shell | `src/components/abox/marketplace-shell.tsx:26-190`, `PillLink` `:193-203`, footer column `:205-223`; product rail source `src/components/abox/product-switcher.tsx:20-78` | Root marketplace shell with floating pill header, marketplace nav, cart/sign-in/account branch, optional product switcher rail, content region, footer plate, assistant launcher | `children`, `variant`, `showAssistant`, `product`, `showProducts`; session/cart/brand-derived branches | CREATE |
| Member Shell | `src/components/abox/member-shell.tsx:35-145`; member nav source `src/lib/nav-config.ts:251-257` | Root member workspace shell with sticky pill header, greeting/actions, horizontal-to-side member navigation rail, card content region, assistant launcher | `children`; session/loading redirect; route-driven active nav; theme/sign-out behavior | CREATE |

### Consumer audit

| Shell | Route files | Render sites | Consumer evidence | Qualification |
|---|---:|---:|---|---|
| Internal Shell | 87 | 107 | Direct `InternalShell` imports/renders across agency, agent, JET, employer, partner, marketplace-admin, and platform routes; workspaces used: agency 74, agent 14, jet 17, employer 1, partner 1; every render site passes `eyebrow` and `pageTitle`; 24 render sites pass `actions` | Reusable production shell consumed by many real routes |
| Marketplace Shell | 30 | 35 | Direct `MarketplaceShell` imports/renders across public shopping, auth, legal/help, sharing, quote/plan/review, unavailable, and referral routes; source prop type is `variant?: "landing" | "flow"`; observed shell render sites use default/flow and landing; `showAssistant` appears as true/default and false; `product` is passed by several shopping routes; `showProducts` is available in the shell API though no observed route passes it explicitly | Reusable production shell consumed by many real routes |
| Member Shell | 4 | 4 | Direct `MemberShell` imports/renders in `member.index.tsx`, `member.quotes.tsx`, `member.messages.tsx`, `member.settings.tsx` | Reusable production shell consumed by multiple member routes |

Internal route files: `agency.downlines.new.activate.tsx`, `agency.downlines.new.administrator.tsx`, `agency.downlines.new.contacts.tsx`, `agency.downlines.new.identity.tsx`, `agency.downlines.new.legal.tsx`, `agency.downlines.new.locations.tsx`, `agency.downlines.new.readiness.tsx`, `agency.downlines.new.settings.tsx`, `agency.marketplace-participation.tsx`, `agency.my-organization.tsx`, `agency.organization-admin.tsx`, `agency.organization-defaults.apply.tsx`, `agency.organization-imports.$importJobId.tsx`, `agency.organization-imports.index.tsx`, `agency.organization-structure.tsx`, `agency.organization-work.tsx`, `agency.organizations.$organizationId.contacts.tsx`, `agency.organizations.$organizationId.ending.tsx`, `agency.organizations.$organizationId.history.tsx`, `agency.organizations.$organizationId.identifiers.tsx`, `agency.organizations.$organizationId.index.tsx`, `agency.organizations.$organizationId.lifecycle.tsx`, `agency.organizations.$organizationId.locations.tsx`, `agency.organizations.$organizationId.readiness.tsx`, `agency.organizations.$organizationId.relationships.tsx`, `agency.organizations.$organizationId.settings.tsx`, `agency.organizations.index.tsx`, `agency.reference-organizations.request.tsx`, `app.agency.entities.tsx`, `app.agency.index.tsx`, `app.agency.producers.tsx`, `app.agency.revenue.tsx`, `app.agency.statements.tsx`, `app.agent-profile.tsx`, `app.commissions.tsx`, `app.communications.tsx`, `app.customers.$id.tsx`, `app.customers.index.tsx`, `app.dashboard.tsx`, `app.employer.ichra.tsx`, `app.index.tsx`, `app.jet.acl.tsx`, `app.jet.ai-governance.tsx`, `app.jet.appointments.tsx`, `app.jet.audit.tsx`, `app.jet.branding.tsx`, `app.jet.form-configurator.tsx`, `app.jet.integrations.tsx`, `app.jet.module1.tsx`, `app.jet.notifications.tsx`, `app.jet.platform.tsx`, `app.jet.product-builder.tsx`, `app.jet.products.tsx`, `app.my-work.tsx`, `app.off-exchange.tsx`, `app.partner.tsx`, `app.quick-quote.tsx`, `app.schedule.tsx`, `app.send-quote.tsx`, `app.tasks.tsx`, `marketplace.admin.activation.tsx`, `marketplace.admin.assets.tsx`, `marketplace.admin.availability.$availabilityEntryId.tsx`, `marketplace.admin.availability.index.tsx`, `marketplace.admin.brand.tsx`, `marketplace.admin.content.tsx`, `marketplace.admin.domains.index.tsx`, `marketplace.admin.domains.request.tsx`, `marketplace.admin.health.tsx`, `marketplace.admin.history.tsx`, `marketplace.admin.index.tsx`, `marketplace.admin.lifecycle.tsx`, `marketplace.admin.participants.$participantId.tsx`, `marketplace.admin.participants.index.tsx`, `marketplace.admin.preview.tsx`, `marketplace.admin.readiness.tsx`, `marketplace.admin.referral-links.$referralLinkId.tsx`, `marketplace.admin.referral-links.index.tsx`, `marketplace.admin.releases.compare.tsx`, `marketplace.admin.releases.review.tsx`, `marketplace.admin.releases.schedule.tsx`, `marketplace.admin.routing-support.tsx`, `marketplace.admin.work.tsx`, `platform.marketplaces.$marketplaceId.override.tsx`, `platform.marketplaces.index.tsx`, `platform.organizations.$organizationId.override.tsx`, `platform.organizations.index.tsx`.

Marketplace route files: `accessibility.tsx`, `agent-unavailable.tsx`, `ai-review.tsx`, `apply.tsx`, `auth.tsx`, `cart.tsx`, `compare.tsx`, `compliance.tsx`, `coverage.tsx`, `faq.tsx`, `handoff.tsx`, `ichra.tsx`, `index.tsx`, `journey-choice.tsx`, `no-options.tsx`, `plans.$planId.tsx`, `plans.index.tsx`, `privacy.tsx`, `quote.tsx`, `r.$referralToken.tsx`, `review.tsx`, `schedule.tsx`, `select.tsx`, `shared.$token.tsx`, `start.$pathway.tsx`, `support.tsx`, `terms.tsx`, `unavailable.pathway.tsx`, `unavailable.suspended.tsx`, `unavailable.unresolved.tsx`.

Member route files: `member.index.tsx`, `member.messages.tsx`, `member.quotes.tsx`, `member.settings.tsx`.

## Shell API → Figma representation audit

| Shell | Production prop/state | Source file/line | Type | Affects structure/visibility/content/interaction | Exact Figma representation | Target node | Default/construction value | Reason / limitation |
|---|---|---|---|---|---|---|---|---|
| Internal | `children` | `internal-shell.tsx:31`, rendered `:131-132` | `React.ReactNode` prop | Content | No component property. Use explicit structural frame labelled `content-region — shell placeholder`. | `ABox/Shell/Internal/content-region` frame | Empty placeholder frame | React children are arbitrary route content; a generic Figma children property would fabricate a slot API not present in the current Figma architecture. |
| Internal | `workspace` | `internal-shell.tsx:32`, default `:40`, lookup `:45`, rail `:57`, mobile nav `:83`, workspace pill `:87` | `WorkspaceKey` prop | Content, navigation set, active-workspace selection | No shell variant axis. Record as dynamic metadata and construct with source-backed sample `agency` so the represented nav matches the largest observed route group. Displayed workspace text layer may be a TEXT property only if attached to the exact `WorkspacePill` workspace label TextNode. | `workspace-label` TextNode in WorkspacePill; nav inventory metadata | Construction value `Agency Workspace`, source key `agency`; not a production default | Source has six workspace keys, but shell structure is the same shell; changing workspace swaps nav data and labels, not a separately authored reusable shell mode. No invented finite variant set. |
| Internal | `entity` | `internal-shell.tsx:33`, default `:40`, state seed `:44`, displayed `:359` | optional `string` prop | Content | TEXT component property `entity` attached to exact entity TextNode `characters` if target resolves unambiguously. | `workspace-pill/entity-label` TextNode | `Cedar Grove Insurance` | Source declares this default. Property id, target node id/name, field `characters`, and source line must print. |
| Internal | `pageTitle` | `internal-shell.tsx:34`, destructured `:41`, conditional/rendered `:111-121` | optional `string` prop | Visibility and content | TEXT component property `pageTitle` attached to exact title TextNode `characters`. Header region remains present in the B7 construction because every observed render site supplies `pageTitle`. | `page-header/title` TextNode | `Performance` from `app.dashboard.tsx:30` | Production text prop. Do not call this a production default; it is an approved real construction literal. Property id, target node id/name, field `characters`, and source line must print. |
| Internal | `eyebrow` | `internal-shell.tsx:35`, destructured `:41`, conditional/rendered `:111-118` | optional `string` prop | Visibility and content | TEXT component property `eyebrow` attached to exact eyebrow TextNode `characters`. Header region remains present in the B7 construction because every observed render site supplies `eyebrow`. | `page-header/eyebrow` TextNode | `Dashboard` from `app.dashboard.tsx:30` | Production text prop. Do not call this a production default; it is an approved real construction literal. Property id, target node id/name, field `characters`, and source line must print. |
| Internal | `actions` | `internal-shell.tsx:36`, destructured `:41`, rendered `:124`; observed in 24 render sites | optional `ReactNode` prop | Visibility and content | Audit live Figma SLOT support before write. If supported faithfully, create `hasActions` BOOLEAN attached to `actions-region.visible` and `actions` SLOT attached to the existing actions content region. If SLOT is unsupported or cannot attach to the exact region without rebuilding architecture, create only the named structural `actions-region` placeholder and record the limitation; no detached/fake property. | `page-header/actions-region` frame | Construction value: visible region with no fake child content unless SLOT attaches; sample source-backed action not converted to an instance swap | `actions` accepts arbitrary React nodes; call sites include `ActionPill`, links, raw buttons, `StatusBadge`, and route-specific groups. No INSTANCE_SWAP is invented from incidental call-site components. |
| Internal | `railCollapsed` | state `internal-shell.tsx:43`, toggle `:59-60`, rail layout `:160-184`, content offset `:63`, label visibility `:168-172`, nav labels `:216-224`, switcher `:241-263` | local boolean state | Structure, visibility, layout, interaction | Canonical construction remains expanded (`false`). Record collapsed behavior as interaction metadata: rail width 268→80, padding/alignment changes, content offset 292→104, labels hidden, tooltip labels appear, icon size 36→44, collapse/expand icon changes. No B7 state axis. | `desktop-rail` metadata and `root/content-offset` metadata | Expanded (`false`) | Production owns the state, but no explicit reusable shell variant API exists; a variant axis would invent shell modes. No prototype connection unless a faithful state transition is supported without new architecture. |
| Internal | `activeEntity` | state `internal-shell.tsx:44`, dropdown selection `:367-374`, label `:359` | local string state | Content and menu selection interaction | TEXT property is covered by `entity` display if target resolves. Dropdown selected-check behavior is metadata only. | `workspace-pill/entity-label` TextNode; entity-dropdown metadata | `Cedar Grove Insurance` seeded from `entity` | Dynamic menu state; dropdown frame is not created/prototyped unless supported by existing overlay architecture. |
| Internal | route-driven active navigation | `internal-shell.tsx:154`, `:201-213`; helper `:285-292`; mobile `:295-319` | derived router state | Visual selection and navigation interaction | One source-backed static active sample in the desktop nav; metadata records exact route-match rule. No B7 state axis. | `desktop-rail/nav-item[active-sample]` | Sample active item: `Dashboard` for agent workspace or first agency section item if `workspace=agency` construction is selected; exact sample printed in tokens | Route state is runtime-derived and not a reusable shell prop. Destinations are app screens outside B7. |
| Marketplace | `children` | `marketplace-shell.tsx:27`, rendered `:143-144` | `React.ReactNode` prop | Content | No component property. Use explicit structural frame labelled `content-region — shell placeholder`. | `ABox/Shell/Marketplace/*/content-region` frame in each variant | Empty placeholder frame | React children are arbitrary route content; no generic children property is invented. |
| Marketplace | `variant` | prop type `marketplace-shell.tsx:28`, default `:35`, header branch `:57`, nav branch `:68-70`, product default `:38` | union prop `"landing" | "flow"` | Structure and positioning | CREATE as a real shell-level Component Set `ABox/Shell/Marketplace` with exactly one VARIANT axis `variant` and exactly two values: `flow`, `landing`. `flow` includes the default flow product switcher region; `landing` uses top offset `top-6`, includes the `Shop plans` nav item, and has product rail hidden by default through `showProducts=false` construction. | `ABox/Shell/Marketplace` Component Set; variant nodes `variant=flow`, `variant=landing` | Default construction for flow: `flow`; landing construction: `landing` | Source explicitly declares two authored values and they produce reusable structural differences. No Boolean substitute and no third value. |
| Marketplace | `showAssistant` | prop `marketplace-shell.tsx:29`, default `:35`, render `:188` | optional boolean prop | Visibility | BOOLEAN component property `showAssistant` attached to exact assistant launcher region `visible` in each Marketplace variant, if the target launcher node resolves unambiguously. | `assistant-launcher-region.visible` on `variant=flow` and `variant=landing` | `true` | Source default is `true`; call sites pass false on auth/apply/handoff/schedule/shared/unavailable variants. Open/closed assistant behavior remains metadata. |
| Marketplace | `product` | prop `marketplace-shell.tsx:31`, pass-through `:140`; ProductSwitcher active comparison `product-switcher.tsx:29`, labels `:51`, products `src/lib/products.ts:28-37` | optional string prop; observed product keys from catalogue include `ifp`, `dental`, `vision`, `life`, `critical`, `accident`, `hospital`, `ichra` | Selected product state, navigation, content labels inside product rail | Do not create a shell variant axis. If the product rail exists, set one static source-backed selected product sample and record the rest as dynamic metadata. Do not create TEXT property unless an exact shell-owned product text layer exists; ProductSwitcher owns labels, not the shell. | `product-switcher-region/product-item[active-sample]` metadata | `ifp` for flow construction when product sample is required | Runtime/consumer data controls active state and links in a child composition. The shell does not declare a finite structural product-mode API suitable for shell variants. |
| Marketplace | `showProducts` | prop `marketplace-shell.tsx:32`, derived `:38`, render `:140` | optional boolean prop | Visibility and region existence | BOOLEAN component property `showProducts` attached to exact product switcher region `visible` in each Marketplace variant. Flow construction value is `true` because `showProducts ?? variant === "flow"`; landing construction value is `false` because `showProducts` is absent and `variant === "landing"`. | `product-switcher-region.visible` on `variant=flow` and `variant=landing` | `true` for flow, `false` for landing | Real Boolean prop controls the region. Do not create a second shell component for products/no-products. If target region cannot resolve, STOP and record limitation instead of detached property. |
| Marketplace | session/auth branch | session read `marketplace-shell.tsx:39`, branch `:96-137` | runtime auth state | Visibility/content/interaction | Static signed-out construction by default; signed-in account branch documented as dynamic metadata. No shell variant. | `marketplace-nav/auth-region` metadata | Signed-out sign-in button sample | Auth state is not exposed as shell prop and is not a reusable finite shell mode. |
| Marketplace | cart branch | cart read `marketplace-shell.tsx:36-38`, branch `:73-95` | runtime cart state | Visibility/content | Static empty-cart construction by default; non-empty label/count/monthly behavior documented. No shell variant. | `marketplace-nav/cart-region` metadata | Empty cart | Cart data is runtime state, not a shell prop or reusable shell mode. |
| Marketplace | runtime brand values | brand read `marketplace-shell.tsx:41-45`, display `:59-64`, footer `:153-158` | runtime data state | Content | Static sample text only; live `ABox/Brand/AboxMark` instance for mark. No foundation or component property transfer. | Header/footer brand text nodes | `ABox`, `Agency in a Box` | Branding/White-Label remains runtime-owned; no Figma foundation transfer. |
| Member | `children` | `member-shell.tsx:20`, rendered `:138` | `React.ReactNode` prop | Content | No component property. Use explicit structural frame labelled `content-region — shell placeholder`. | `ABox/Shell/Member/content-region` frame | Empty placeholder frame | Required decision: no generic `children` component property. |
| Member | session/loading redirect | session/loading `member-shell.tsx:37`, redirect `:40-56` | runtime auth state | Visibility/interaction | Metadata only. No shell variant. | Root shell metadata | Authenticated shell view | Auth gate/loading state is runtime behavior, not reusable shell structure. |
| Member | route-driven active navigation | router state `member-shell.tsx:36`, active rule `:103-122`; nav items `nav-config.ts:251-257` | derived router state | Visual selection and navigation interaction | One source-backed static active sample in member nav; metadata records exact route equality rule. No B7 state axis. | `member-nav/item[active-sample]` | `My Dashboard` active sample | Runtime route selection is not a reusable shell prop. |
| Member | sign-out behavior | `member-shell.tsx:44-47`, button `:83-90` | event handler | Interaction | Static control affordance; behavior metadata only. | `member-header/sign-out` | Label `Sign out` | Runtime auth action, not shell variant or prototype destination. |
| Member | theme behavior | `member-shell.tsx:82`, `theme-toggle.tsx:35-58` | child component state | Interaction/content icon | Static control affordance; behavior metadata only. | `member-header/theme-toggle` | Default icon from hydrated state not asserted | Theme state changes global app theme and is not a B7 shell variant. |
| Member | assistant state | `member-shell.tsx:142`, `plan-o-assistant.tsx:14-98` | shared assistant open state | Visibility/interaction | Launcher affordance documented; open panel deferred. | `assistant-launcher-region` metadata | Launcher visible | Overlay content is not a shell layout primitive. |

## Property attachment standard

Any B7 TEXT, BOOLEAN, or SLOT property must follow this process:

1. Read live component properties first.
2. If the property exists, verify exact type and existing binding.
3. If missing, create it.
4. Immediately attach it to the exact target layer using `componentPropertyReferences`.
5. BOOLEAN properties attach only to `visible`.
6. TEXT properties attach only to `characters`.
7. Wrong target or detached property = FAIL/STOP.
8. Missing or ambiguous target = STOP.
9. Never create a detached property just to represent the source API.
10. Print property id, type, target node id/name, reference field, construction value, and source line.

For any SLOT:

- use the actual supported SLOT mechanism only;
- attach it to the real intended region;
- do not create detached/probe slots;
- if unsupported or structurally impossible, record the limitation and create no fabricated fallback.

## Candidate inventory

| Shell | Source | Consumers | Reusable structure | Existing B4/B5/B6 assets used | Responsive behavior | Interaction | Decision |
|---|---|---|---|---|---|---|---|
| Internal Shell | `internal-shell.tsx:30-140`, `:146-237`, `:294-331`, `:342-501` | 87 route files / 107 render sites | Root + detached desktop rail + mobile sheet trigger + top bar + optional page-header band + content slot + assistant launcher | `ABox/Brand/AboxMark`; no B6 pattern because the shell source does not consume one; B4/B5 controls only if exact source-owned regions resolve without duplicating primitives | Desktop rail at `lg:flex`; mobile/tablet sheet trigger at `lg:hidden`; left content offset switches `lg:pl-[104px]`/`lg:pl-[292px]`; search visible at `lg:flex`; workspace label visible at `xl:inline`; account label visible at `lg:inline` | Rail collapse toggle, workspace dropdown, mobile sheet, notifications popover, account dropdown, theme toggle, route-driven active nav; documented only unless a destination is already represented in B7 without inventing screen frames | CREATE |
| Marketplace Shell | `marketplace-shell.tsx:26-190`, product rail `product-switcher.tsx:20-78`, product catalogue `products.ts:28-37` | 30 route files / 35 render sites | Root + floating pill header + marketplace nav + cart/account/sign-in branch + product switcher region + content slot + footer plate + assistant launcher | `ABox/Brand/AboxMark`; no B6 pattern because the shell source does not consume B6 patterns | `variant="flow"` and `variant="landing"` are represented as the only shell Component Set axis; other breakpoint behavior recorded as metadata | Auth branch, cart-count branch, account dropdown, sign-out, assistant open/closed, link navigation; documented only, no prototype destinations invented | CREATE as Component Set |
| Member Shell | `member-shell.tsx:35-145`, `nav-config.ts:251-257` | 4 route files / 4 render sites | Root + sticky pill header + member greeting/actions + member nav rail + content canvas + assistant launcher | `ABox/Brand/AboxMark`; no B6 pattern because the shell source does not consume B6 patterns | Shell body changes `flex-col` to `md:flex-row`; nav changes horizontal scroll to `md:flex-col`; connector arc hidden below `md`; content padding changes at `md`; sign-out text hidden below `sm`; greeting hidden below `md` | Auth redirect/loading branch, route-driven active member nav, theme toggle, sign-out, assistant launcher; documented only, no prototype destinations invented | CREATE |

## Figma shell assets to create

B7 creates exactly one shell Component Set and two standalone shell Components:

| Shell asset | Figma object type | Variant axis | Variant values | Physical B7 ComponentNodes | Target page |
|---|---|---|---|---:|---|
| `ABox/Shell/Internal` | Component | none | none | 1 | `03 Shells` |
| `ABox/Shell/Marketplace` | Component Set | `variant` | `flow`, `landing` | 2 Variant ComponentNodes | `03 Shells` |
| `ABox/Shell/Member` | Component | none | none | 1 | `03 Shells` |

Object arithmetic:

- Shell assets total: 3 (`ABox/Shell/Internal`, `ABox/Shell/Marketplace`, `ABox/Shell/Member`).
- Shell Component Sets created: 1 (`ABox/Shell/Marketplace`).
- Standalone shell Components created: 2 (`ABox/Shell/Internal`, `ABox/Shell/Member`).
- Variant ComponentNodes inside shell Component Sets: 2 (`variant=flow`, `variant=landing`).
- Physical B7 ComponentNodes total: 4.
- Top-level B7 objects on `03 Shells`: 3.
- Run 1 creation count when absent: 4 physical ComponentNodes plus 1 Component Set through the supported combine-as-variants mechanism.
- Run 2 creation count: 0.

No desktop/mobile variants are created. Responsive branches are represented only where static layout, auto-layout, constraints, or documented metadata can express them faithfully without inventing a structural mode.

## Representation details

### Shared shell rules

- `ABox/Shell/Internal` and `ABox/Shell/Member` are standalone `ComponentNode` objects named exactly as listed.
- `ABox/Shell/Marketplace` is one `ComponentSetNode` named exactly `ABox/Shell/Marketplace` with a single `variant` axis and exactly two variant ComponentNodes.
- Each shell includes a named `content-region` frame as a structural placeholder, not a screen and not a new production primitive.
- No generic React `children` property is invented.
- No instance-swap or slot property is created unless the live Figma structure supports it and the shell source itself provides source-backed evidence.
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
5. Workspace/entity control frame: source `WorkspacePill` (`:342-386`) with text values governed by the shell API audit; dropdown menu is documented, not prototyped.
6. Search frame: visible at `lg:flex`, source `:89-97`; represented as a static top-bar child and marked with its responsive visibility metadata.
7. Action-orb group: tasks, notifications, theme toggle, account pill from `:99-104`, `:390-501`; popover/dropdown behavior documented only.
8. Optional page-header band: because every observed render site passes `pageTitle` and `eyebrow`, B7 includes the shell-owned header region from `:111-128` with `pageTitle` and `eyebrow` TEXT properties and an `actions-region` handled by the SLOT/limitation decision above. It does not reuse B4 `PageHeader`, because the production shell owns a custom section rather than consuming the B4 component.
9. Content region: frame corresponding to `main id="main"` (`:130-133`) labelled `content-region — shell placeholder`.
10. Assistant launcher region: source `:139`; documented as shell-level floating assistant affordance, with open dialog deferred because the assistant overlay is behavior/screen-adjacent and not a shell layout primitive.

### `ABox/Shell/Marketplace`

Component Set creation sequence:

1. Resolve `03 Shells`.
2. Resolve required live B4/B5/B6 component identities before shell creation.
3. Read live `03 Shells` inventory and detect existing `ABox/Shell/Marketplace` by deterministic identity.
4. If absent, create exactly two root ComponentNode objects named exactly `variant=flow` and `variant=landing`.
5. Construct each root with its source-backed shell structure.
6. Combine only those two new ComponentNodes into one Component Set using the supported Figma variant mechanism.
7. Verify the set is named exactly `ABox/Shell/Marketplace` and its single VARIANT property is exactly `variant` with values `flow` and `landing`.
8. If present, resolve the live set, verify exactly one variant axis named `variant` with values exactly `flow` and `landing`, and resolve the two existing variant nodes by exact variant-property matrix.
9. Any conflicting set, duplicate variant matrix, wrong axis name/type, or materially different structure = STOP. Do not overwrite, delete, or create another set.

Variant representation:

- `variant=flow`: source default `variant = "flow"` (`marketplace-shell.tsx:35`), header `top-4` (`:57`), no `Shop plans` `PillLink` (`:68-70` false), product switcher region visible by source-derived default (`showProducts ?? variant === "flow"`, `:38`, `:140`).
- `variant=landing`: source `variant="landing"` render sites in `index.tsx`, header `top-6` (`:57`), includes `Shop plans` `PillLink` (`:68-70`), product switcher region hidden by source-derived default (`showProducts` absent and `variant !== "flow"`).
- Both variants keep the same root shell, brand/home region, marketplace navigation structure, content region, footer plate, and assistant launcher region unless source conditionals require otherwise.

Static structure per variant:

1. Root flex column shell: production root `relative flex min-h-dvh flex-col bg-background text-foreground` (`marketplace-shell.tsx:47`).
2. Header pill frame: sticky source `:57-141`; top offset is recorded per variant.
3. Brand/home region: live `ABox/Brand/AboxMark` instance and brand text structure from `:59-64`; runtime branding values are sample text only and not transferred into foundations.
4. Marketplace nav region: `PillLink` items and cart/sign-in/account branch from `:67-137`, using structural text/icon placeholders where no B4 control exists. Auth/cart dynamic branches are documented, not encoded as variants.
5. Product switcher rail region: structure comes from `product-switcher.tsx:20-78`; represented as a shell region with `showProducts` BOOLEAN visibility, not as a new primitive.
6. Content region: `main id="main"` from `:143-145`, labelled `content-region — shell placeholder`.
7. Footer plate: monolithic footer from `:148-186`, including live `ABox/Brand/AboxMark` instance and link-column structure; footer grid responsive behavior documented from `:151` and `:177`.
8. Assistant launcher: source `:188`; region visible is controlled by `showAssistant` BOOLEAN; open panel documented/deferred.

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
| Marketplace | Landing header top changes `top-6`; default flow uses `top-4`; landing adds `Shop plans`; flow shows products by default (`marketplace-shell.tsx:57`, `:68-70`, `:38`, `:140`) | Represented as the exact `variant=flow | landing` axis on `ABox/Shell/Marketplace` | No extra responsive or Boolean substitute axis |
| Marketplace | Brand text hidden below `md`; pill links hidden below `md`; cart monthly text hidden below `sm` (`:61`, `:92`, `:197`) | Desktop/default structure represented with visibility metadata | No mobile variant |
| Marketplace | Product switcher wraps at `md`; footer grid changes at `md` (`product-switcher.tsx:24-26`, `marketplace-shell.tsx:151`, `:177`) | Auto-layout/wrap metadata where faithful; static footer structure represented | No breakpoint simulation |
| Member | Body switches `flex-col` to `md:flex-row` (`member-shell.tsx:95`) | Desktop row body represented with metadata for mobile column | No desktop/mobile variant |
| Member | Member nav switches horizontal scroll to vertical rail; connector arc hidden below `md` (`:101`, `:100`) | Desktop side rail represented; mobile scroll documented | No breakpoint variants; gradient arc is a limitation unless exact foundation support exists |
| Member | Greeting hidden below `md`; sign-out text hidden below `sm` (`:78`, `:89`) | Desktop header represented with visibility metadata | No breakpoint variants |

## Interaction audit and classification

| Shell | Source behavior | Figma representation | Exact target | Prototype | Limitation |
|---|---|---|---|---|---|
| Internal | Route-driven active nav via `isNavActive` (`internal-shell.tsx:201-213`, `:285-292`) | One static active sample in nav; metadata records rule | Internal rail item | None | Destinations are app routes/screens not represented in B7; no B7 state axis |
| Internal | Rail collapse toggle (`:43`, `:59-60`, `:175-185`) | Documented interaction metadata only | Desktop rail | None | No shell state axis is created; B7 does not create collapsed variant |
| Internal | Mobile sheet trigger (`:72-85`) | Documented interaction metadata only | Mobile trigger/sheet | None | Overlay primitive not represented in B4/B5/B6 and no mobile variant created |
| Internal | Workspace dropdown (`:350-385`), notifications popover (`:403-435`), account dropdown (`:468-499`) | Documented interaction metadata only | Top-bar controls | None | Overlay behavior deferred; no fake dropdown frames |
| Internal | Theme toggle (`theme-toggle.tsx:35-58`) | Static icon/control affordance only | Header action group | None | Theme state changes app theme, not a B7 shell variant |
| Marketplace | Auth branch sign-in vs account dropdown (`marketplace-shell.tsx:96-137`) | Static signed-out branch by default; signed-in branch documented | Header nav | None | Auth/session state not encoded as shell axis |
| Marketplace | Cart count branch (`:73-95`) | Static empty-cart branch by default; filled cart documented | Cart nav item | None | Cart data state not encoded as shell axis |
| Marketplace | Product link active state (`product-switcher.tsx:29-48`) | One static active sample in product rail metadata; no shell variant | Product rail item | None | Product value is consumer/runtime data; no prototype destinations invented |
| Marketplace | Assistant open/close (`plan-o-assistant.tsx:14-98`) | Launcher visibility may be controlled by `showAssistant`; open/closed state documented | Floating assistant | None | Open conversation panel is overlay/screen-adjacent and deferred |
| Member | Auth loading/redirect (`member-shell.tsx:40-56`) | Documented only | Root shell | None | Auth gate state is not shell asset content |
| Member | Route-driven active nav (`:103-122`) | One static active sample in member nav; metadata records rule | Member nav item | None | No B7 state axis and no prototype destinations invented |
| Member | Sign out (`:44-47`, `:83-90`) and theme toggle (`theme-toggle.tsx:35-58`) | Static controls documented | Header controls | None | No runtime auth/theme behavior in B7 |

## Deterministic identity and structural signature

Each created shell signature must include:

- exact shell name;
- source component file and export name;
- production prop/state inventory;
- root component id, node type, root name;
- variant matrix for `ABox/Shell/Marketplace`: `variant=flow`, `variant=landing`;
- layout mode, sizing modes, wrapping, padding, gaps;
- fills, strokes, effects and their live style/variable identities;
- child order and child node types;
- nested live component names and ids, especially `ABox/Brand/AboxMark`;
- nested component property values where an existing B4/B5/B6 instance is used;
- every created B7 component-property id;
- component-property type;
- target node id/name;
- reference field (`characters` or `visible`);
- property default/construction value;
- actual instance property values where applicable;
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
- Create only missing approved shell objects: two standalone Components plus the two Marketplace variant ComponentNodes, then combine Marketplace variants into one Component Set.
- Capture ids, property ids, target node ids, and structural signatures.
- Stop on duplicate shell identity anywhere in the file.

Run 2:

- Resolve existing shell Components / Component Set by deterministic identity/name plus structural signature.
- Create zero B7 objects.
- Preserve all shell ids and component-property ids.
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
10. No primitive or protected Component Set duplication.
11. Only `03 Shells` receives B7 content.
12. Exactly the approved CREATE shell inventory exists: `ABox/Shell/Internal`, `ABox/Shell/Marketplace`, `ABox/Shell/Member`.
13. `ABox/Shell/Marketplace` is exactly one Component Set with exactly one VARIANT axis `variant` and values exactly `flow` and `landing`.
14. `ABox/Shell/Internal` and `ABox/Shell/Member` are standalone Components, not Component Sets.
15. B7 top-level object count on `03 Shells` is exactly 3.
16. B7 physical ComponentNode count is exactly 4.
17. No production shell prop/state is silently omitted from the Shell API → Figma representation audit.
18. Every represented TEXT/BOOLEAN property is attached to the correct target node.
19. No represented property is detached.
20. Every omitted/deferred prop has an explicit documented reason.
21. `Marketplace.variant` is represented as the exact source-backed `flow | landing` variant axis.
22. `Marketplace.showProducts` is either bound to exact product-region `visible` fields or STOPs with explicit limitation if the target cannot be resolved.
23. `Marketplace.showAssistant` is either bound to exact launcher-region `visible` fields or STOPs with explicit limitation if the target cannot be resolved.
24. `Internal.pageTitle` and `Internal.eyebrow` are either bound TEXT properties or STOP with explicit limitation if exact targets cannot be resolved.
25. `Internal.actions` is either faithfully attached through `hasActions` BOOLEAN + `actions` SLOT, or explicitly deferred because exact SLOT representation is unsupported.
26. `Member.children` remains structural content-region only and is not fabricated into a generic property.
27. Every shell matches its source-backed structural signature.
28. Every nested component resolves to the expected live component id.
29. No hard-coded duplicate foundation value.
30. No invented responsive variant.
31. No invented interaction.
32. No screen-level content is embedded.
33. No B6 pattern is mutated.
34. No B4/B5 primitive is mutated.
35. No B4/B5/B6 object is mutated to support shell properties.
36. Run 2 creates zero objects and reports identical ids and property ids.
37. Real Figma ids are explicitly distinguished from offline/mock ids.
38. Responsive and interaction audit rows are printed for every shell.
39. No deferred/rejected B8 screen content is created on `03 Shells`.

Failure line:

`RESULT: B7 FAILED — do not proceed to B8.`

Success line:

`RESULT: B7 PASSED`

## Final inventory output

B7 must print:

| Shell | Root id | Root name | Nested component ids | B7 properties | Content region | Responsive behavior | Interaction metadata | Source evidence |
|---|---|---|---|---|---|---|---|---|
| ABox/Shell/Internal | live id | exact name | live nested ids | `pageTitle`, `eyebrow`, `entity` if attached; `hasActions`/`actions` only if faithfully supported | content-region placeholder | printed audit rows | printed audit rows | `internal-shell.tsx` line evidence |
| ABox/Shell/Marketplace | live Component Set id plus variant ids | exact set and variant names | live nested ids | `variant`; `showProducts` and `showAssistant` if attached | content-region placeholder per variant | printed audit rows | printed audit rows | `marketplace-shell.tsx`, `product-switcher.tsx`, `products.ts` line evidence |
| ABox/Shell/Member | live id | exact name | live nested ids | none for `children`; documented metadata only | content-region placeholder | printed audit rows | printed audit rows | `member-shell.tsx` and `nav-config.ts` line evidence |

Also print:

- shell assets total: 3;
- shell Component Sets created: 1;
- standalone shell Components created: 2;
- shell Variant ComponentNodes created: 2;
- physical B7 ComponentNodes total: 4;
- top-level B7 objects on `03 Shells`: 3;
- Run 1 creation count;
- Run 2 creation count;
- identical-id result;
- component-property ids, type, target node, reference field, and construction value for each represented property;
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
