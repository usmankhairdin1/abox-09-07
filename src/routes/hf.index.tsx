import { Link, createFileRoute } from "@tanstack/react-router";

import { DispositionChip } from "@/components/LucieDisposition";
import { dispositionForScreen } from "@/lib/reconciliation-status";

import { Badge, Btn, Card, Disclosure } from "@/components/hf/ui";
import { HF_BATCH1_GROUPS, HF_BATCH2_GROUPS, HF_SCREENS } from "@/lib/hf";

export const Route = createFileRoute("/hf/")({
  head: () => {
    const title = "ABox higher-fidelity wireframes — batches 1 and 2";
    const description =
      "Thirty-one higher-fidelity ABox Phase 1 screens: the core experience foundation and consumer marketplace flow, plus off-exchange enrollment, forms, products, distribution, commissions, communications, branding, ACL and audit.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HfIndex,
});

function GroupList({ groups }: { groups: string[] }) {
  return (
    <>
      {groups.map((g) => {
        const screens = HF_SCREENS.filter((s) => s.group === g);
        if (screens.length === 0) return null;
        return (
          <section key={g}>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold tracking-tight">{g}</h3>
              <Badge>{screens.length} screens</Badge>
              <Badge tone={g.startsWith("Module 1") ? "warning" : "accent"}>
                {g.startsWith("Module 1") ? "Module 1 scope fenced" : "Broader Phase 1"}
              </Badge>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {screens.map((s) => (
                <li key={s.id}>
                  <Link to="/hf/$screen" params={{ screen: s.slug }} className="block h-full">
                    <Card className="flex h-full flex-col p-4 transition-shadow hover:shadow-[0_6px_20px_-8px_oklch(0_0_0/14%)]">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background">
                          {s.id}
                        </span>
                        <Badge tone={s.shell === "consumer" ? "accent" : "neutral"}>
                          {s.shell === "consumer" ? "Branded" : "Internal"}
                        </Badge>
                        <span className="ml-auto truncate text-[10px] text-muted-foreground">
                          {s.module}
                        </span>
                        <DispositionChip info={dispositionForScreen(s.id)} />
                      </div>
                      <p className="mt-2 font-display text-sm font-semibold tracking-tight">
                        {s.name}
                      </p>
                      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {s.purpose}
                      </p>
                      <p className="mt-3 text-[11px] text-muted-foreground">{s.user}</p>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function HfIndex() {
  const batch2Count = HF_SCREENS.filter((s) => HF_BATCH2_GROUPS.includes(s.group)).length;

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-hairline bg-card">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            ABox Phase 1 · higher fidelity · batches 1 &amp; 2
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight">
            Core experience, operations &amp; configuration
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Thirty-one screens taken from grey-box structure to visual fidelity on the proposed
            design system: Navy Trust tokens, Sora and Manrope, neutral internal chrome with the
            accent reserved for action, and a branded consumer skin driven entirely by tenant
            tokens. Open any screen and use{" "}
            <span className="font-medium text-foreground">Design notes</span> for primary user,
            workspace, module, objects used, configuration points, ACL notes, data flow
            implications, assumptions and source basis.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/hf/$screen" params={{ screen: "internal-shell" }}>
              <Btn>Start with the shell</Btn>
            </Link>
            <Link to="/hf/$screen" params={{ screen: "offex-intake" }}>
              <Btn variant="outline">Open batch 2</Btn>
            </Link>
            <Link to="/m1">
              <Btn variant="ghost">Low-fidelity Module 1</Btn>
            </Link>
            <Link to="/p1">
              <Btn variant="ghost">Low-fidelity Phase 1</Btn>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-12 px-4 py-8">
        <div className="space-y-10">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Batch 1 · core experience foundation
            </h2>
            <Badge>15 screens</Badge>
          </div>
          <GroupList groups={HF_BATCH1_GROUPS} />
        </div>

        <div className="space-y-10 border-t border-hairline pt-10">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Batch 2 · operations &amp; configuration
            </h2>
            <Badge>{batch2Count} screens</Badge>
            <Badge tone="accent">outside Module 1</Badge>
          </div>
          <GroupList groups={HF_BATCH2_GROUPS} />
        </div>

        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold">What batch 2 decides</h2>
          <ul className="mt-3 grid gap-2 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2">
            {[
              "Readiness is shown before work starts — an application never reaches submit and discovers a blocker.",
              "Configured rules read as sentences, so a non-engineer can review a form or a send program.",
              "Preview is the real runtime and the real branded surface, never an approximation.",
              "Paper access and revenue splits are one screen because they are one decision.",
              "Split tables always total 100% with a live remainder; publish is blocked until they do.",
              "Commission model choice changes the rate form — PMPM, PEPM, PCPM and bonuses are not one generic amount field.",
              "Agency and agent statements come from one posting run, so they can never disagree.",
              "Brand is tokens with contrast validated at save; layout is platform-owned across every tenant.",
              "ACL separates permission from data-visibility scope, and the resolution tester proves the answer.",
              "One append-only audit store; every per-screen Audit drawer section is a filtered view of it.",
            ].map((i) => (
              <li key={i} className="flex gap-2">
                <span
                  className="mt-1.5 size-1 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Disclosure>
          Higher-fidelity presentation only. Module 1 scope remains as ratified in the V4 hardening
          and reconciliation packages — nothing in these batches adds a Module 1 capability, and
          every broader Phase 1 surface referenced here is a configuration seam, not new Module 1
          behaviour.
        </Disclosure>
      </main>
    </div>
  );
}
