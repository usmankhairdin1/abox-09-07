import { Link, createFileRoute } from "@tanstack/react-router";

import { Badge, Btn, Card, Disclosure } from "@/components/hf/ui";
import { HF_SCREENS } from "@/lib/hf";

export const Route = createFileRoute("/hf/")({
  head: () => {
    const title = "ABox Batch 1 — higher-fidelity core experience wireframes";
    const description =
      "Fifteen higher-fidelity ABox Phase 1 screens: internal shell, My Work, dashboards, the branded consumer marketplace flow, agent quick quote and lead detail.";
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

function HfIndex() {
  const groups = ["Foundation", "Module 1 · consumer", "Module 1 · internal"];

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            ABox Phase 1 · higher fidelity · batch 1
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight">
            Core experience foundation
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Fifteen screens taken from grey-box structure to visual fidelity on the proposed design
            system: Navy Trust tokens, Sora and Manrope, neutral internal chrome with the accent
            reserved for action, and a branded consumer skin driven entirely by tenant tokens. Open
            any screen and use <span className="font-medium text-foreground">Design notes</span> for
            the design decisions, ACL behavior, configuration points and source basis.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/hf/$screen" params={{ screen: "internal-shell" }}>
              <Btn>Start with the shell</Btn>
            </Link>
            <Link to="/hf/$screen" params={{ screen: "marketplace-landing" }}>
              <Btn variant="outline">Open the consumer flow</Btn>
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

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8">
        {groups.map((g) => {
          const screens = HF_SCREENS.filter((s) => s.group === g);
          return (
            <section key={g}>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-semibold tracking-tight">{g}</h2>
                <Badge>{screens.length} screens</Badge>
                <Badge tone={g === "Foundation" ? "accent" : "warning"}>
                  {g === "Foundation" ? "IA foundation" : "Module 1 scope fenced"}
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
                        </div>
                        <p className="mt-2 font-display text-sm font-semibold tracking-tight">{s.name}</p>
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

        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold">What this batch decides</h2>
          <ul className="mt-3 grid gap-2 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2">
            {[
              "One internal shell for all workspaces — permission by absence, never greyed-out modules.",
              "Six fixed drawer sections in the same order on every screen.",
              "Accent reserved for action; status carries a word plus a dot, never colour alone.",
              "Consumer skin is the same token set with a different scale — white label changes tokens, not layout.",
              "Plan cards use identical field slots so a card list scans like a table.",
              "EDE handoff is a full page, never a modal, and names the destination before the redirect.",
              "Internal-only data (paper, appointment, commission) lives in the drawer, never in a quote body.",
              "One object page framework and one timeline, proven on the lead object.",
            ].map((i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Disclosure>
          Higher-fidelity presentation only. Module 1 scope remains as ratified in the V4 hardening
          and reconciliation packages — nothing in this batch adds a capability, and every broader
          Phase 1 surface referenced here is a configuration seam, not new Module 1 behavior.
        </Disclosure>
      </main>
    </div>
  );
}
