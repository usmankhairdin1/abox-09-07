/**
 * UX-001 — Marketplace Landing. Meridian Navy.
 * A hero built around an orbital chart, a horizontal path selector,
 * an asymmetric product bento, a large split employer plate, and a
 * trust ladder — nothing reuses the old three-card layout.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, ShieldCheck, MessageSquareHeart,
  Building2, HeartPulse, ArrowUpRight, Compass,
  Smile, Eye, HandHeart, Activity, Ambulance, HeartHandshake, Check,
} from "lucide-react";

import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { AboxMark } from "@/components/abox/logo";
import {
  Aurora, DotField, OrbitalRings, RadialTicks, MastheadMark,
  HealthPulseShield, CoverageWeave, BlueprintGrid, PolicyLines, FamilySilhouette,
} from "@/components/abox/decor";
import { FadeRise, Stagger, StaggerItem } from "@/components/abox/motion";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { useMarketplaceState, getMarketplace, getActiveBrand, getAvailability } from "@/lib/marketplace-store";
import { SuspendedMarketplaceNotice } from "@/components/abox/suspended-marketplace-notice";

/** M04 REQ-M04-AVL-002: only these product keys are governed by marketplace
 *  availability config; ancillary products (life/critical/accident/hospital)
 *  and the employer-only ICHRA card sit outside M04's fixed catalogue. */
const GOVERNED_PRODUCT_LINES: Record<string, ("IFP_ON_EXCHANGE" | "IFP_OFF_EXCHANGE" | "DENTAL" | "VISION")[]> = {
  ifp: ["IFP_ON_EXCHANGE", "IFP_OFF_EXCHANGE"],
  dental: ["DENTAL"],
  vision: ["VISION"],
};

const PRODUCT_ICONS: Record<string, typeof HeartPulse> = {
  ifp: HeartPulse,
  dental: Smile,
  vision: Eye,
  life: HandHeart,
  critical: Activity,
  accident: Ambulance,
  hospital: HeartHandshake,
  ichra: Building2,
};


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABox — Shop insurance with a guide, not a spreadsheet" },
      { name: "description", content: "ABox is an AI-enabled insurance marketplace. Compare individual and family plans, get guidance from Plan-AI, and pick coverage with confidence — or talk to a licensed agent in a click." },
      { property: "og:title", content: "ABox — Shop insurance with a guide, not a spreadsheet" },
      { property: "og:description", content: "ABox is an AI-enabled insurance marketplace. Compare individual and family plans, get guidance from Plan-AI, and pick coverage with confidence — or talk to a licensed agent in a click." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const mkt = useMarketplaceState();
  const marketplace = getMarketplace(mkt);

  if (marketplace.lifecycle_status === "SUSPENDED" || marketplace.lifecycle_status === "ENDED") {
    return (
      <MarketplaceShell variant="landing" showAssistant={false}>
        <SuspendedMarketplaceNotice ended={marketplace.lifecycle_status === "ENDED"} />
      </MarketplaceShell>
    );
  }

  return (
    <MarketplaceShell variant="landing">
      <Hero />
      <PathTicker />
      <ProductBento />
      <PlanOOrbital />
      <EmployerPlate />
      <TrustLadder />
    </MarketplaceShell>
  );
}

/* ============================ Hero ============================ */
function Hero() {
  const mkt = useMarketplaceState();
  const brand = getActiveBrand(mkt);
  const headline = brand?.headline_en || "Insurance, tuned to you.";
  const intro = brand?.intro_en || "Health, dental, vision, life — compared side by side. Plan-AI helps you think it through without pushing. If you'd rather talk to a person, a licensed agent is one tap away.";
  const [headlineLead, ...headlineRest] = headline.split(",");
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-14 md:pb-32 md:pt-24">
      <Aurora />
      <DotField className="opacity-30" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[1.15fr_1fr] lg:gap-14 md:px-8">
        <div>
          <MastheadMark label="Marketplace of marketplaces" />
          <h1 className="text-display mt-8 text-[52px] leading-[0.96] md:text-[104px]">
            {headlineLead}{headlineRest.length > 0 && ","}
            <br />
            {headlineRest.length > 0 && (
              <span className="italic font-normal" style={{ color: "var(--primary)" }}>
                {headlineRest.join(",").trim()}
              </span>
            )}
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl">
            {intro}
          </p>
          <div className="mt-8">
            <p className="text-eyebrow mb-3">Products available today</p>
            <ProductSwitcher variant="chips" />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/select"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground transition-all hover:scale-[1.03] min-h-11"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              Start shopping
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-base font-medium text-foreground transition-colors hover:bg-accent min-h-11"
            >
              Talk to an agent
            </Link>
          </div>
          <ul className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sage" aria-hidden /> Licensed in 50 states</li>
            <li className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" aria-hidden /> Guidance, not a sales pitch</li>
            <li className="inline-flex items-center gap-2"><MessageSquareHeart className="h-4 w-4 text-primary" aria-hidden /> No spam, no gotchas</li>
          </ul>
        </div>

        {/* Orbital instrument */}
        <FadeRise className="relative aspect-square w-full max-w-[560px] justify-self-center md:justify-self-end">
          <OrbitalRings size={560} tone="hairline" className="left-0 top-0" />
          <RadialTicks size={420} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          {/* Center console */}
          <div className="absolute left-1/2 top-1/2 w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-3xl glass p-5 animate-drift" style={{ boxShadow: "var(--shadow-plate)" }}>
            <div className="flex items-center gap-3 border-b border-hairline pb-4">
              <AboxMark size={40} tone="primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Plan-AI</p>
                <p className="text-serial">Guidance · not binding</p>
              </div>
              <span className="rounded-full glass px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-sage">Live</span>
            </div>
            <ul className="space-y-2.5 py-4 text-sm">
              <li className="flex items-center justify-between rounded-2xl bg-background/40 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium">Meridian Silver PPO</p>
                  <p className="text-xs text-muted-foreground">HSA · Statewide network</p>
                </div>
                <div className="text-right">
                  <p className="text-display text-xl tabular-nums">$412</p>
                  <p className="text-[10px] text-primary">92% match</p>
                </div>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-background/40 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium">Aeris Silver POS</p>
                  <p className="text-xs text-muted-foreground">Regional · low deductible</p>
                </div>
                <div className="text-right">
                  <p className="text-display text-xl tabular-nums">$385</p>
                  <p className="text-[10px] text-primary">81% match</p>
                </div>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-primary/15 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium">BluePeak Gold HMO</p>
                  <p className="text-xs text-muted-foreground">Best fit · your PCP kept</p>
                </div>
                <div className="text-right">
                  <p className="text-display text-xl tabular-nums text-primary">$548</p>
                  <p className="text-[10px]">88% match</p>
                </div>
              </li>
            </ul>
            <Link
              to="/select"
              className="mt-1 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              Try Plan-AI with your own priorities
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </FadeRise>
      </div>
    </section>
  );
}

/* ============================ Path ticker ============================ */
function PathTicker() {
  const paths = [
    { title: "Guide me", body: "Plan-AI narrows the list to plans that fit your priorities.", to: "/select?path=guided", icon: Sparkles },
    { title: "Browse myself", body: "See every plan in your ZIP with filters and compare.", to: "/select?path=browse", icon: Compass },
    { title: "Talk to an agent", body: "A licensed human, one click away — Plan-AI escalates.", to: "/schedule", icon: MessageSquareHeart },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow">Choose your path</p>
          <h2 className="text-display mt-3 text-4xl md:text-5xl">Three ways in. One outcome.</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Switch modes whenever you like — Plan-AI and a licensed agent are always on the side.
        </p>
      </div>
      <Stagger className="grid gap-5 md:grid-cols-3">
        {paths.map((p) => (
          <StaggerItem key={p.title} className="h-full">
            <Link
              to={p.to}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 card-brackets edge-sheen"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute right-0 top-0 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-primary/8 text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <p.icon className="h-8 w-8" />
                </span>
                <h3 className="text-display max-w-[calc(100%-5rem)] pt-1 text-3xl">{p.title}</h3>
                <p className="mt-3 max-w-[calc(100%-5rem)] text-sm text-muted-foreground">{p.body}</p>
              </div>

              <div className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Enter this path
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

    </section>
  );
}

/* ============================ Product bento ============================ */
function ProductBento() {
  const mkt = useMarketplaceState();
  const availability = getAvailability(mkt);
  const isEnabled = (key: string) => {
    const lines = GOVERNED_PRODUCT_LINES[key];
    if (!lines) return true; // outside M04's fixed catalogue — not gated
    return availability.some((a) => lines.includes(a.product_line as never) && a.status === "ENABLED" && a.channels.includes("CONSUMER_DIRECT"));
  };
  const products = SAMPLE_PRODUCTS.filter((p) => p.emphasis !== "group" && isEnabled(p.key));
  const [feature, ...rest] = products;
  return (
    <section className="relative mx-4 overflow-hidden rounded-3xl border border-hairline bg-card md:mx-8">
      <div className="absolute inset-0 aurora" aria-hidden />
      <div className="absolute inset-0 contour opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <MastheadMark label="One cart. Many products." />
            <h2 className="text-display mt-6 text-4xl md:text-5xl">Shop by product</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            One login. Add health, dental, vision and more — check out once.
          </p>
        </div>

        {/* Feature hero — editorial split: content left, custom health illustration right */}
        {feature && (
          <Link
            to={feature.href}
            className="group relative mb-4 grid gap-8 overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/8 via-card to-card p-8 md:grid-cols-[1.15fr_1fr] md:gap-10 md:p-12 md:min-h-[360px] card-brackets edge-sheen"
            style={{ boxShadow: "var(--shadow-plate)" }}
          >
            <BlueprintGrid className="opacity-40" />
            <div className="relative flex flex-col justify-between">
              <div className="max-w-xl">
                <p className="text-eyebrow inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Most people start here · Featured
                </p>
                <h3 className="text-display mt-6 text-5xl md:text-7xl leading-[1.02]">{feature.label}</h3>
                <p className="mt-4 max-w-md text-base text-muted-foreground">{feature.tagline}</p>
                <ul className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  {["ACA · on & off exchange", "HSA-ready plans", "Doctor & Rx search", "Subsidy estimator"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform group-hover:scale-[1.03]" style={{ boxShadow: "var(--shadow-glow)" }}>
                  Shop {feature.label.toLowerCase()}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-serial">Avg. quote · 2 min</span>
              </div>
            </div>
            {/* Custom illustration column */}
            <div className="relative min-h-[220px]">
              <HealthPulseShield size={360} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              <FamilySilhouette size={200} className="bottom-2 right-2 opacity-90" />
            </div>
          </Link>
        )}

        {/* Secondary grid — uniform cards with prominent icon tile */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => {
            const Icon = PRODUCT_ICONS[p.key] ?? ShieldCheck;
            return (
              <Link
                key={p.key}
                to={p.href}
                className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-background/60 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 card-brackets edge-sheen"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden
                    className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-primary/8 text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Icon className="h-8 w-8" />
                  </span>
                  <p className="text-eyebrow">Coverage</p>
                </div>
                <div>
                  <h3 className="text-display mt-4 text-2xl leading-tight">{p.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Shop {p.label.toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ============================ Plan-AI orbital ============================ */
function PlanOOrbital() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <div className="grid items-center gap-14 md:grid-cols-[1fr_1.1fr]">
        <div>
          <MastheadMark label="Meet Plan-AI" />
          <h2 className="text-display mt-6 text-4xl md:text-6xl">
            A guide,
            <br />
            <span className="italic font-normal" style={{ color: "var(--primary)" }}>
              not a recommendation engine.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            Plan-AI explains tradeoffs, translates jargon, and shortlists options. It never pretends
            to be a licensed agent, and it will hand you to one when the question calls for it.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Explains benefits in plain language",
              "Ranks by what you said mattered most",
              "Shows subsidy estimates as education, not promises",
              "Escalates to a human when it should",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}

          </ul>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          {[
            { label: "Plans compared", value: "220K+" },
            { label: "Avg. shortlist size", value: "3" },
            { label: "Escalations to agent", value: "1 in 6", tone: "sage" as const },
            { label: "Time to first quote", value: "~2 min", tone: "sage" as const },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-3xl border border-hairline bg-card p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span
                aria-hidden
                className="absolute right-5 top-5 h-12 w-12 rounded-2xl border"
                style={{ borderColor: s.tone === "sage" ? "var(--sage)" : "var(--primary)", opacity: 0.36 }}
              />
              <p className="text-eyebrow max-w-[70%]">{s.label}</p>
              <p className="text-display mt-6 text-4xl tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        All numbers are illustrative placeholders. Real metrics wire in from JET analytics.
      </p>
    </section>
  );
}

/* ============================ Employer plate ============================ */
function EmployerPlate() {
  return (
    <section className="mx-4 mb-8 overflow-hidden rounded-3xl border border-hairline bg-card text-foreground md:mx-8" style={{ boxShadow: "var(--shadow-plate)" }}>
      <div className="relative">
        <Aurora className="opacity-80" />
        <BlueprintGrid tone="hairline" className="opacity-45" />
        <CoverageWeave size={340} labels={["W", "H", "L"]} className="-right-6 -top-4 opacity-70 hidden md:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-[1.2fr_1fr] md:px-12 md:py-28">
          <div>
            <MastheadMark label="For employers" />
            <h2 className="text-display mt-6 text-4xl md:text-6xl">
              Set an allowance.
              <br />
              <span className="italic font-normal" style={{ color: "var(--primary)" }}>
                Your team picks the plan.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              ICHRA on ABox lets you give every employee a monthly allowance to shop the individual
              marketplace — with Plan-AI guidance and a licensed agent for anyone who wants one.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/ichra"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.03] min-h-11"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                <Building2 className="h-4 w-4" aria-hidden /> Explore ICHRA
              </Link>
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-base font-medium text-foreground transition-colors hover:bg-accent min-h-11"
              >
                Talk to a specialist
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-hairline bg-card/85 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-eyebrow">Illustrative · 24-person team · $500 allowance</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Enrolled", value: "22 / 24" },
                { label: "Avg. plan", value: "Silver" },
                { label: "Est. savings", value: "$18k / yr" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-hairline bg-background/65 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <p className="text-display mt-1 text-xl">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ Trust ladder ============================ */
function TrustLadder() {
  const cards = [
    { icon: ShieldCheck, title: "Every plan follows the display rules", body: "On-exchange QHPs are shown consistent with federal display and disclosure requirements. Off-exchange is clearly labeled." },
    { icon: HeartPulse, title: "Real doctors, real formularies", body: "Optional provider and prescription lookup uses NPPES and formulary data — with a clear skip for shoppers who don't want to bother." },
    { icon: MessageSquareHeart, title: "A person, whenever you want one", body: "Every screen has a licensed-agent handoff. Plan-AI tells you when it's the right call — and gets out of the way." },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <BlueprintGrid tone="hairline" className="opacity-30" />
      <div className="relative mb-10 max-w-xl">
        <MastheadMark label="Trust ladder" />
        <h2 className="text-display mt-6 text-4xl md:text-5xl">Built on rules, not vibes.</h2>
      </div>
      <div className="relative grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.title}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-hairline bg-card p-7 transition-all hover:-translate-y-0.5",
            )}
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-sage-soft text-sage transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" aria-hidden>
                <c.icon className="h-8 w-8" />
              </span>
            </div>
            <h3 className="text-display mt-6 text-xl leading-snug">{c.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
