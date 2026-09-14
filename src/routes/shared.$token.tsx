/**
 * UX-020 — Shared Quote (read-only, tokenized)
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { StatusBadge } from "@/components/abox/status-badge";
import { EmptyState } from "@/components/abox/empty-state";
import { PlanCard } from "@/components/abox/plan-card";
import { SAMPLE_PLANS, type SamplePlan } from "@/lib/sample-data";
import { loadSharedQuote, isSharedQuoteExpired } from "@/lib/shared-quote-store";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/shared/$token")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-020"].name} — ABox` }, { name: "description", content: SCREENS["UX-020"].purpose }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { token } = Route.useParams();
  const pkg = typeof window === "undefined" ? null : loadSharedQuote(token);
  const expired = pkg ? isSharedQuoteExpired(pkg) : false;
  const plans: SamplePlan[] = pkg && !expired
    ? pkg.planIds.map((id) => SAMPLE_PLANS.find((p) => p.id === id)).filter((p): p is SamplePlan => !!p)
    : [];
  const daysLeft = pkg
    ? Math.max(0, Math.ceil((new Date(pkg.createdAt).getTime() + pkg.expiresInDays * 86400000 - Date.now()) / 86400000))
    : 0;

  if (!pkg || expired) {
    return (
      <MarketplaceShell showAssistant={false}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <StatusBadge tone="muted">Shared quote</StatusBadge>
          <EmptyState
            className="mt-6"
            title={expired ? "This shared quote has expired" : "This link isn't available"}
            body={
              expired
                ? "Ask your agent to send a fresh link — quote links expire for your security."
                : "This link may be invalid, or it was opened in a different browser than the one it was sent from."
            }
            action={<Link to="/schedule" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Talk to an agent</Link>}
          />
        </div>
      </MarketplaceShell>
    );
  }

  return (
    <MarketplaceShell showAssistant={false}>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge tone="info">Shared quote</StatusBadge>
          <span>Token · <span className="tabular-nums text-foreground">{token}</span></span>
          <span>·</span>
          <span>Expires in {daysLeft} day{daysLeft === 1 ? "" : "s"}</span>
        </div>
        <PageHeader
          scrId="UX-020" eyebrow={`From ${pkg.agentName} at Cedar Grove Insurance`}
          title={`Here ${plans.length === 1 ? "is one plan" : `are ${plans.length} plans`} I think fit best`}
          description="Take your time — nothing changes until you tell me. If any look good, I'll walk you through enrollment."
        />

        <div className="rounded-2xl border border-primary/25 bg-primary-soft/40 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <p className="text-sm font-medium">Why {plans.length === 1 ? "this plan" : "the selected plans"}</p>
          </div>
          <p className="mt-2 text-sm">
            You mentioned keeping your PCP, low Rx tier 1, and a predictable deductible. {plans.length === 1 ? "This plan leads" : "They lead"} on all three.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ActionCard
            title="I'm interested" body="Let Elena know which plan looks best."
            icon={<ShieldCheck className="h-5 w-5" />}
            href="/schedule" cta="Send interest"
          />
          <ActionCard
            title="Book a call" body="Grab a 20-minute slot with Elena."
            icon={<Phone className="h-5 w-5" />}
            href="/schedule" cta="Schedule"
          />
          <ActionCard
            title="Register to enroll" body="You'll be able to add them to your cart."
            icon={<ArrowRight className="h-5 w-5" />}
            href="/auth" cta="Create account"
          />
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Shared quotes are read-only. To add plans to a cart or start enrollment, register or sign in.
          Plan-AI is educational, not a substitute for licensed advice.
        </p>
      </div>
    </MarketplaceShell>
  );
}

function ActionCard({ title, body, icon, href, cta }: { title: string; body: string; icon: React.ReactNode; href: string; cta: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <p className="mt-3 text-display text-xl">{title}</p>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{body}</p>
      <Link to={href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary story-link">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
