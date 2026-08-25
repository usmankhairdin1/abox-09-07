import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { Badge, Btn, Card } from "@/components/hf/ui";
import {
  AgentQuickQuoteScreen,
  DashboardScreen,
  InternalShellScreen,
  LeadDetailScreen,
  MyWorkScreen,
} from "@/components/hf/screens-internal";
import {
  CartScreen,
  EdeHandoffScreen,
  MarketplaceLandingScreen,
  PlanCompareScreen,
  PlanOScreen,
  PlanResultsScreen,
  ProductSelectionScreen,
  QuoteWizardScreen,
  RegistrationGateScreen,
  SharedQuoteScreen,
} from "@/components/hf/screens-consumer";
import {
  AclConfigScreen,
  AgencyStatementScreen,
  AgentStatementScreen,
  AppointmentSetupScreen,
  AuditLogScreen,
  BrandingSettingsScreen,
  CommissionProjectionScreen,
  CommissionScheduleScreen,
  DynamicFormScreen,
  FormConfiguratorScreen,
  NotificationSchedulerScreen,
  OffexIntakeScreen,
  PaperSplitsScreen,
  ProductBuilderScreen,
  ProductCatalogScreen,
  ReferralRewardsScreen,
} from "@/components/hf/screens-batch2";
import { HF_BY_SLUG, HF_SLUGS, type HfScreen } from "@/lib/hf";

const RENDERERS: Record<string, () => ReactNode> = {
  "internal-shell": InternalShellScreen,
  "my-work": MyWorkScreen,
  dashboard: DashboardScreen,
  "marketplace-landing": MarketplaceLandingScreen,
  "product-selection": ProductSelectionScreen,
  "quote-wizard": QuoteWizardScreen,
  "plan-o": PlanOScreen,
  "plan-results": PlanResultsScreen,
  "plan-compare": PlanCompareScreen,
  cart: CartScreen,
  "registration-gate": RegistrationGateScreen,
  "ede-handoff": EdeHandoffScreen,
  "shared-quote": SharedQuoteScreen,
  "agent-quick-quote": AgentQuickQuoteScreen,
  "lead-detail": LeadDetailScreen,
  "offex-intake": OffexIntakeScreen,
  "dynamic-form": DynamicFormScreen,
  "form-configurator": FormConfiguratorScreen,
  "product-catalog": ProductCatalogScreen,
  "product-builder": ProductBuilderScreen,
  "appointment-setup": AppointmentSetupScreen,
  "paper-splits": PaperSplitsScreen,
  "referral-rewards": ReferralRewardsScreen,
  "commission-schedule": CommissionScheduleScreen,
  "commission-projection": CommissionProjectionScreen,
  "agency-statement": AgencyStatementScreen,
  "agent-statement": AgentStatementScreen,
  "notification-scheduler": NotificationSchedulerScreen,
  "branding-settings": BrandingSettingsScreen,
  "acl-config": AclConfigScreen,
  "audit-log": AuditLogScreen,
};


export const Route = createFileRoute("/hf/$screen")({
  loader: ({ params }) => {
    const screen = HF_BY_SLUG[params.screen];
    if (!screen) throw notFound();
    return { screen };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Screen unavailable — ABox" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = `${loaderData.screen.id} ${loaderData.screen.name} — ABox Batch 1`;
    const d = loaderData.screen.purpose.slice(0, 155);
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HfScreenPage,
});

function HfScreenPage() {
  const { screen } = Route.useLoaderData();
  const Renderer = RENDERERS[screen.slug]!;
  const [notesOpen, setNotesOpen] = useState(false);

  const i = HF_SLUGS.indexOf(screen.slug);
  const prev = i > 0 ? HF_SLUGS[i - 1] : undefined;
  const next = i < HF_SLUGS.length - 1 ? HF_SLUGS[i + 1] : undefined;

  return (
    <div className="relative">
      <Renderer />

      {/* ---------------------------------------------------- annotation rail */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3">
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-2 rounded-full border border-border bg-popover/95 px-3 py-2 shadow-[var(--shadow-overlay)] backdrop-blur">
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background">
            {screen.id}
          </span>
          <span className="hidden max-w-[14rem] truncate text-xs font-medium sm:inline">
            {screen.name}
          </span>
          {prev ? (
            <Link
              to="/hf/$screen"
              params={{ screen: prev }}
              className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-muted"
            >
              ←
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/hf/$screen"
              params={{ screen: next }}
              className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-muted"
            >
              →
            </Link>
          ) : null}
          <Link
            to="/hf"
            className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-muted"
          >
            Index
          </Link>
          <Btn size="sm" onClick={() => setNotesOpen((v) => !v)}>
            {notesOpen ? "Hide notes" : "Design notes"}
          </Btn>
        </div>
      </div>

      {notesOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/25 p-0 sm:p-4">
          <Card className="h-full w-full max-w-lg overflow-y-auto rounded-none p-5 sm:rounded-[var(--radius)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {screen.id} · {screen.group}
                </p>
                <h2 className="mt-0.5 font-display text-lg font-semibold tracking-tight">
                  {screen.name}
                </h2>
              </div>
              <Btn variant="outline" size="sm" onClick={() => setNotesOpen(false)}>
                Close
              </Btn>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="accent">{screen.shell === "consumer" ? "Externally branded" : "Internal shell"}</Badge>
              <Badge>{screen.workspace}</Badge>
              <Badge>{screen.module}</Badge>
              <Badge>{screen.user}</Badge>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{screen.purpose}</p>

            <NoteBlock title="Key design decisions" items={screen.decisions} />
            <NoteBlock title="ACL behavior" items={screen.acl} />
            <NoteBlock title="Configuration points" items={screen.config} />

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Source basis
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">{screen.source}</p>
              <p className="mt-2">
                <Badge tone="warning">{screen.scope}</Badge>
              </p>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function NoteBlock({ title, items }: { title: string; items: HfScreen["decisions"] }) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((d) => (
          <li key={d} className="flex gap-2 text-xs leading-relaxed text-foreground/85">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
