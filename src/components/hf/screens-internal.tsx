import { Filter, MoreHorizontal, Plus, Send } from "lucide-react";
import type { ReactNode } from "react";

import { HfShell } from "@/components/hf/HfShell";
import {
  Alert,
  Badge,
  Bars,
  Btn,
  Card,
  Check,
  Disclosure,
  EmptyState,
  Field,
  Panel,
  PLANS,
  PlanCard,
  Skeleton,
  Stat,
  Table,
  Timeline,
  type TimelineEntry,
} from "@/components/hf/ui";

/* ------------------------------------------------------------------ helpers */

function PageHead({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-0.5 font-display text-[1.375rem] font-semibold tracking-tight">{title}</h1>
        {sub ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function DrawerList({ heading, items }: { heading?: string; items: string[] }) {
  return (
    <div className="space-y-2">
      {heading ? (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {heading}
        </p>
      ) : null}
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-xs leading-relaxed text-foreground/80">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------- HF-01 */

export function InternalShellScreen() {
  return (
    <HfShell
      activeModule="MOD_MY_WORK"
      drawerTitle="Shell anatomy"
      assistantContext="the platform shell"
      drawer={{
        Context: (
          <DrawerList
            heading="Shell regions"
            items={[
              "Global bar — workspace, entity, search, notifications, tasks, assistant, profile.",
              "Left nav — modules only, single level, permission-filtered.",
              "Right drawer — six fixed sections, same order on every screen.",
              "Bottom right — assistant: chat, FAQs, copilot actions.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Try the workspace switcher: modules and defaults change, the chrome does not.",
              "Switch the simulated role in the profile menu and watch Commissions and Admin leave the nav.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Foundation · HF-01"
        title="Internal platform shell"
        sub="One shell for every internal workspace. Everything below is inside this chrome — switch workspace, entity or role in the bar above and the page re-scopes without ever changing product."
        actions={<Badge tone="accent">interactive</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Workspace, not portal",
            "Workspace switching re-scopes modules, data, labels, defaults and actions. There is no second application to log into.",
          ],
          [
            "Permission by absence",
            "A module or drawer section a role cannot use is not rendered. Nothing is greyed out to hint at what you are missing.",
          ],
          [
            "Accent spent on action",
            "Chrome is neutral. The brand accent appears on the primary action and the active nav rail, so the eye always finds the next step.",
          ],
        ].map(([t, b]) => (
          <Panel key={t} title={t}>
            <p className="text-xs leading-relaxed text-muted-foreground">{b}</p>
          </Panel>
        ))}
      </div>

      <Panel
        title="Region map"
        meta="What lives where, and why it lives there"
        actions={<Btn size="sm" variant="outline">Open help model</Btn>}
      >
        <Table
          columns={["Region", "Holds", "Rule"]}
          rows={[
            [
              "Global bar",
              "Workspace, entity, search, notifications, tasks, assistant, profile",
              "Context and cross-cutting only. Never page actions.",
            ],
            [
              "Left nav",
              "Modules",
              "Single level, permission-filtered, admin-relabelable. No sub-object trees.",
            ],
            [
              "Page canvas",
              "Page title, primary action, content",
              "Max 5xl for lists and objects; 720px for forms and wizards.",
            ],
            [
              "Right drawer",
              "Context, Summary, Guidance, Help & FAQ, Audit, Next actions",
              "Fixed section order everywhere. Content authored per screen ID.",
            ],
            [
              "Bottom right",
              "Assistant: chat, FAQs, copilot",
              "Always grounded, always logged, always escalatable to a person.",
            ],
          ]}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Status vocabulary" meta="One meaning per token, product-wide">
          <div className="flex flex-wrap gap-2">
            <Badge dot>Draft</Badge>
            <Badge tone="accent" dot>
              In progress
            </Badge>
            <Badge tone="warning" dot>
              Needs review
            </Badge>
            <Badge tone="danger" dot>
              Blocked
            </Badge>
            <Badge tone="success" dot>
              Complete
            </Badge>
            <Badge tone="ai" dot>
              AI-assisted
            </Badge>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Every chip carries a word and a dot; colour is reinforcement, never the only signal.
          </p>
        </Panel>
        <Panel title="Permission-scoped empty state" meta="Distinct from 'no data'">
          <EmptyState
            tone="acl"
            title="Nothing visible in this scope"
            body="You are viewing Harbor Point as an agency manager, which shows your own entity only. Records owned by downline agencies exist but are outside your data visibility."
            action={<Btn size="sm" variant="outline">Request wider access</Btn>}
          />
        </Panel>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-02 */

export function MyWorkScreen() {
  return (
    <HfShell
      activeModule="MOD_MY_WORK"
      drawerTitle="My Work"
      assistantContext="your work queues"
      drawer={{
        Context: (
          <DrawerList
            heading="Scope in effect"
            items={[
              "Agency Workspace · Northwind Master + 2 downline agencies.",
              "Queues below include downline records because your role is agency admin.",
            ]}
          />
        ),
        "Next actions": (
          <DrawerList
            items={[
              "Call J. Whitfield — requested a call 2 hours ago.",
              "Re-send Q-10391 before it expires Friday.",
              "Review 3 off-exchange applications waiting on documents.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Tuesday, 24 August"
        title="Good morning, Dana"
        sub="Six things need you today across Northwind and its two downline agencies."
        actions={
          <>
            <Btn variant="outline">
              <Plus className="size-4" /> New lead
            </Btn>
            <Btn>Quick quote</Btn>
          </>
        }
      />

      <Alert
        tone="warning"
        title="Needs you — 6 items"
        action={<Btn size="sm" variant="outline">Review all</Btn>}
      >
        2 callback requests overdue · 3 applications waiting on documents · 1 quote expires in 2 days
      </Alert>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open quotes" value="38" delta="+6 this week" deltaTone="success" hint="Across 3 agencies" />
        <Stat label="Awaiting handoff" value="9" hint="On-exchange, redirected" />
        <Stat label="Submitted, off-exchange" value="14" delta="+2" deltaTone="success" />
        <Stat label="Conversion, 30 days" value="21%" delta="−2 pts" deltaTone="danger" />
      </div>

      <Panel
        title="Your work queue"
        meta="Assembled from records you can already see — not a separate list"
        actions={
          <>
            <Btn size="sm" variant="ghost">
              <Filter className="size-3.5" /> Filters
            </Btn>
            <Btn size="sm" variant="outline">Assign</Btn>
          </>
        }
        bodyClassName="p-0"
      >
        <div className="px-4 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {["All (17)", "Callbacks (2)", "Documents (3)", "Expiring (4)", "New leads (8)"].map((t, i) => (
              <span
                key={t}
                className={
                  i === 0
                    ? "rounded-full border border-primary bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                    : "rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <Table
            columns={["Person", "What is needed", "Product", "Owner", "Age", "Status"]}
            rows={[
              [
                "Jordan Whitfield",
                "Requested a call back",
                "IFP on-exchange",
                "You",
                "2h",
                <Badge key="s" tone="danger" dot>Overdue</Badge>,
              ],
              [
                "Maria Delgado",
                "Viewed shared quote, no action",
                "IFP on-exchange",
                "You",
                "1d",
                <Badge key="s" tone="warning" dot>Needs review</Badge>,
              ],
              [
                "Aaron Beck",
                "Dental application missing ID document",
                "Dental",
                "Harbor Point",
                "2d",
                <Badge key="s" tone="warning" dot>Needs review</Badge>,
              ],
              [
                "The Nakamura household",
                "Quote expires Friday",
                "IFP off-exchange",
                "R. Ellis",
                "5d",
                <Badge key="s" tone="accent" dot>In progress</Badge>,
              ],
              [
                "Priya Raman",
                "New lead from guided shopping",
                "IFP on-exchange",
                "Unassigned",
                "3h",
                <Badge key="s" dot>New</Badge>,
              ],
            ]}
          />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="My tasks" meta="Created by events, or by you" actions={<Btn size="sm" variant="ghost">Add</Btn>}>
          <ul className="space-y-3">
            {[
              ["Call J. Whitfield", "Auto-created from callback request · due today"],
              ["Re-send Q-10391", "Auto-created from expiry rule · due Thursday"],
              ["Confirm Cedar Ridge appointment", "Manual · no due date"],
            ].map(([a, b]) => (
              <li key={a}>
                <Check label={a!} hint={b} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Recently touched" meta="Resume where you left off">
          <ul className="divide-y divide-border">
            {[
              ["Q-10428 · Delgado household", "Shared quote sent, viewed twice"],
              ["L-7712 · Priya Raman", "Guided shopping lead, unassigned"],
              ["A-3391 · Beck dental application", "Waiting on documents"],
            ].map(([a, b]) => (
              <li key={a} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a}</p>
                  <p className="truncate text-xs text-muted-foreground">{b}</p>
                </div>
                <Btn size="sm" variant="ghost">Open</Btn>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-03 */

export function DashboardScreen() {
  return (
    <HfShell
      activeModule="MOD_REPORTING"
      drawerTitle="Report context"
      assistantContext="this dashboard"
      drawer={{
        Context: (
          <DrawerList
            heading="Applied scope"
            items={[
              "Entity: Northwind Master + downline (2)",
              "Period: 1 Jul – 24 Aug 2026, compared to prior period",
              "Product: all lines · Channel: all",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "Export requested 22 Aug by D. Okafor — scope recorded with the export.",
              "Panel visibility last changed 14 Aug by platform admin.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Dashboards & analytics · HF-03"
        title="Production overview"
        sub="Everything on this page is scoped by the bar below and drills through to the underlying records."
        actions={
          <>
            <Btn variant="outline">Export</Btn>
            <Btn>Save view</Btn>
          </>
        }
      />

      <Card className="flex flex-wrap items-center gap-2 p-3">
        {[
          ["Entity", "Northwind + downline"],
          ["Period", "1 Jul – 24 Aug 2026"],
          ["Product", "All lines"],
          ["Channel", "All"],
        ].map(([l, v]) => (
          <span
            key={l}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs"
          >
            <span className="text-muted-foreground">{l}</span>
            <span className="font-medium">{v}</span>
          </span>
        ))}
        <Btn size="sm" variant="ghost" className="ml-auto">
          Reset scope
        </Btn>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Quotes created" value="1,284" delta="+11%" deltaTone="success" hint="vs prior period" />
        <Stat label="Enrollments" value="268" delta="+4%" deltaTone="success" />
        <Stat label="Handoff completion" value="64%" delta="−3 pts" deltaTone="danger" hint="On-exchange only" />
        <Stat label="Plan O sessions" value="411" delta="+38%" deltaTone="success" hint="32% of all quotes" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          title="Quotes and enrollments"
          meta="Accent = current period, neutral = prior period"
          className="lg:col-span-3"
          actions={<Btn size="sm" variant="ghost">Drill through</Btn>}
        >
          <Bars
            series={[142, 168, 155, 190, 176, 205, 188, 248]}
            compare={[128, 141, 149, 162, 170, 166, 181, 192]}
            labels={["Jul 1", "Jul 8", "Jul 15", "Jul 22", "Jul 29", "Aug 5", "Aug 12", "Aug 19"]}
          />
          <p className="mt-3 text-[11px] text-muted-foreground">
            Every chart has a table beneath it — the table is the accessible and exportable form of
            the same data.
          </p>
        </Panel>

        <Panel title="Attribution" meta="Requires hierarchy visibility" className="lg:col-span-2">
          <Table
            dense
            columns={["Source", "Quotes", "Enrolled"]}
            rows={[
              ["Guided (Plan O)", "411", "104"],
              ["Direct marketplace", "486", "88"],
              ["Agent quick quote", "297", "61"],
              ["Referral partner", "90", "15"],
            ]}
          />
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            A manager without downline visibility sees this panel scoped to their own entity, with
            the downline dimension removed from the scope bar rather than disabled.
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Production by agency" meta="Drill-through enabled" bodyClassName="p-0">
          <div className="pt-1">
            <Table
              columns={["Agency", "Quotes", "Enrolled", "Rate", "Trend"]}
              rows={[
                ["Northwind Master", "612", "148", "24%", <Badge key="a" tone="success" dot>Up</Badge>],
                ["Harbor Point", "398", "79", "20%", <Badge key="b" dot>Flat</Badge>],
                ["Cedar Ridge", "274", "41", "15%", <Badge key="c" tone="danger" dot>Down</Badge>],
              ]}
            />
          </div>
        </Panel>

        <Panel title="AI interaction reporting" meta="Governance view of assistant and Plan O usage">
          <div className="rounded-[var(--radius)] border border-ai/30 bg-ai/[0.06] px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ai">
              <span className="size-1.5 rounded-full bg-ai" aria-hidden="true" /> AI-derived insight
            </p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
              Cedar Ridge conversion fell 6 points after 4 Aug, concentrated in on-exchange handoffs
              that were started but never returned.
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Derived from 274 quotes and 61 handoff events · view source records
            </p>
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
            <p className="text-[11px] text-muted-foreground">
              Skeletons match final layout geometry so the page never reflows when data lands.
            </p>
          </div>
        </Panel>
      </div>

      <Disclosure>
        Figures are reporting estimates from platform events and are not a statement of commission
        earned or payable. Export events record the requesting user and the scope applied.
      </Disclosure>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-14 */

export function AgentQuickQuoteScreen() {
  return (
    <HfShell
      activeModule="MOD_MARKETPLACE_SALES"
      drawerTitle="Internal context"
      assistantContext="this quote"
      drawer={{
        Context: (
          <DrawerList
            heading="Selling context"
            items={[
              "Selling agency: Northwind Master · Selling agent: you",
              "Paper: Blue Summit (own appointment), Meridian (Harbor Point paper, write access granted)",
              "Cascade Care is not appointed for this agency — its plans are absent from results.",
            ]}
          />
        ),
        Summary: (
          <div className="space-y-3">
            <DrawerList
              heading="Projected commission"
              items={[
                "Blue Summit Silver 3500 — $22.40 PMPM · schedule NW-IFP-2026",
                "Meridian Silver Select — $19.00 PMPM · schedule NW-IFP-2026",
              ]}
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Visible because your role holds commission.view. Without it this section is absent, not
              zeroed — and it never renders inside the quote body, so it cannot leak into a shared
              output.
            </p>
          </div>
        ),
        "Next actions": (
          <DrawerList
            items={[
              "Send as shared quote (email or SMS)",
              "Schedule a callback",
              "Attach to an existing lead",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Marketplace & sales · HF-14"
        title="Quick quote"
        sub="Built for a live call: inputs and results share the screen, results refresh in place, and send is always in reach."
        actions={
          <>
            <Btn variant="outline">Save to lead</Btn>
            <Btn>
              <Send className="size-4" /> Send quote
            </Btn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[19rem_1fr]">
        <div className="space-y-3">
          <Panel title="Inputs" meta="Enter re-quotes from any field">
            <div className="space-y-3">
              <Field label="ZIP code" value="98104" hint="King County, WA" />
              <Field label="Effective date" value="1 October 2026" />
              <Field label="Household" value="2 adults, 1 child" />
              <Field
                label="Estimated annual income"
                value="$•••,•••"
                sensitive
                hint="Masked by default. Reveal is audited."
              />
              <Field label="Product line" value="IFP on-exchange" />
              <Btn full>Re-quote</Btn>
            </div>
          </Panel>
          <Panel title="Attribution">
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                Lead: <span className="font-medium text-foreground">Delgado household (L-7688)</span>
              </li>
              <li>
                Selling agency: <span className="font-medium text-foreground">Northwind Master</span>
              </li>
              <li>
                Selling agent: <span className="font-medium text-foreground">You</span>
              </li>
            </ul>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Attribution is written once and audited. Agents cannot re-attribute their own quotes.
            </p>
          </Panel>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm">
              <span className="font-semibold">14 plans</span>{" "}
              <span className="text-muted-foreground">
                available for this household, sorted by lowest net premium
              </span>
            </p>
            <Badge tone="accent" className="ml-auto">
              Subsidy estimate applied
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLANS.slice(0, 4).map((p) => (
              <PlanCard key={p.name} plan={p} compact />
            ))}
          </div>
          <Panel title="Send this quote" meta="Creates a branded, read-only shared quote link">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Send to" value="maria.d@example.com" />
              <Field label="Channel" value="Email + SMS" />
              <Field label="Link valid for" value="14 days" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Btn>
                <Send className="size-4" /> Send 3 selected plans
              </Btn>
              <Btn variant="outline">Preview as recipient</Btn>
              <p className="text-[11px] text-muted-foreground">
                Send is logged with recipient, channel and timestamp.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-15 */

const TIMELINE: TimelineEntry[] = [
  {
    kind: "human",
    title: "Shared quote sent",
    body: "3 plans sent by email and SMS. Link valid until 7 September.",
    meta: "24 Aug, 09:12",
    actor: "You",
  },
  {
    kind: "system",
    title: "Shared quote viewed",
    body: "Opened twice from mobile. No plan selected.",
    meta: "24 Aug, 11:48",
    actor: "System event",
  },
  {
    kind: "ai",
    title: "Plan O ranking produced",
    body: "Ranked 3 of 14 plans using stated budget, 2 preferred providers and 1 prescription. Consumer chose to view all plans afterwards.",
    meta: "23 Aug, 20:34",
    actor: "Plan O · logged to AI interaction log",
  },
  {
    kind: "status",
    title: "Status changed: New → Quoted",
    meta: "23 Aug, 20:41",
    actor: "You",
  },
  {
    kind: "human",
    title: "Callback requested",
    body: "\"Best after 6pm.\" Task auto-created and assigned to you.",
    meta: "23 Aug, 18:02",
    actor: "Consumer",
  },
  {
    kind: "system",
    title: "Lead created from guided shopping",
    body: "Marketplace: northwind.abox.market · ZIP 98104 · household of 3",
    meta: "23 Aug, 17:55",
    actor: "System event",
  },
];

export function LeadDetailScreen() {
  return (
    <HfShell
      activeModule="MOD_LEADS_CUSTOMERS"
      drawerTitle="Lead L-7688"
      assistantContext="this lead"
      drawer={{
        Summary: (
          <DrawerList
            heading="At a glance"
            items={[
              "Maria Delgado · household of 3 · ZIP 98104",
              "Stage: Quoted · Owner: you · Source: guided shopping",
              "1 shared quote, viewed twice, no selection",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "A viewed-but-not-acted quote is the highest-yield follow-up on this page.",
              "Callback was requested for after 6pm — the task is already assigned to you.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "Income field revealed 24 Aug 09:08 by you — reveal recorded.",
              "Owner set 23 Aug 20:41 by routing rule NW-ROUND-ROBIN.",
            ]}
          />
        ),
        "Next actions": (
          <DrawerList
            items={["Call after 6pm today", "Re-send quote with 2 lower-deductible options", "Add dental to cart"]}
          />
        ),
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-3 font-display text-sm font-semibold">
            MD
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Lead · L-7688
            </p>
            <h1 className="mt-0.5 font-display text-[1.375rem] font-semibold tracking-tight">
              Maria Delgado
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge tone="accent" dot>
                Quoted
              </Badge>
              <Badge>Owner: you</Badge>
              <Badge>Guided shopping</Badge>
              <Badge>Northwind Master</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="outline">Log a call</Btn>
          <Btn>Re-send quote</Btn>
          <Btn variant="outline" size="md" className="px-2.5">
            <MoreHorizontal className="size-4" />
          </Btn>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {["Overview", "Quotes (1)", "Applications (0)", "Documents (2)", "Messages (4)"].map((t, i) => (
          <span
            key={t}
            className={
              i === 0
                ? "border-b-2 border-primary px-2.5 pb-1.5 text-[13px] font-semibold"
                : "px-2.5 pb-1.5 text-[13px] text-muted-foreground"
            }
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <Alert
            tone="warning"
            title="Quote viewed twice with no action"
            action={<Btn size="sm">Follow up</Btn>}
          >
            Q-10428 was opened on 24 Aug at 11:48 and no plan was selected. Callback requested for
            after 6pm.
          </Alert>

          <Panel
            title="Timeline"
            meta="One timeline for every event type — no separate notes tab"
            actions={
              <div className="flex flex-wrap gap-1.5">
                {["All", "Quotes", "Messages", "AI", "System"].map((f, i) => (
                  <span
                    key={f}
                    className={
                      i === 0
                        ? "rounded-full border border-primary bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                        : "rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                    }
                  >
                    {f}
                  </span>
                ))}
              </div>
            }
          >
            <Timeline entries={TIMELINE} />
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Entries are permission-filtered: commission events are absent for roles without
              commission.view, so the history a user sees is always one they are allowed to see.
            </p>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Details" meta="Inline edit, saves on blur">
            <div className="space-y-3">
              <Field label="Email" value="maria.d@example.com" />
              <Field label="Phone" value="(206) 555-0188" />
              <Field label="Household" value="2 adults, 1 child" />
              <Field
                label="Estimated income"
                value="$•••,•••"
                sensitive
                hint="Reveal is audited and named in the drawer."
              />
              <Field label="Effective date" value="1 October 2026" />
            </div>
          </Panel>
          <Panel title="Related">
            <ul className="divide-y divide-border text-xs">
              {[
                ["Q-10428", "Shared quote · 3 plans · viewed"],
                ["T-4410", "Task · call after 6pm · due today"],
                ["Cart C-2201", "Silver 3500 + dental line"],
              ].map(([a, b]) => (
                <li key={a} className="py-2.5">
                  <p className="font-medium">{a}</p>
                  <p className="mt-0.5 text-muted-foreground">{b}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}
