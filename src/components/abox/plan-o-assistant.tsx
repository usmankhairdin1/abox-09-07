/**
 * PlanAI / Help assistant — floating pill launcher with orbital dot,
 * expanding into a glass conversation panel.
 */
import { X, Sparkles } from "lucide-react";
import { AboxMark } from "./logo";
import { cn } from "@/lib/utils";
import { planAiStore, usePlanAiOpen } from "@/lib/shopping-mode";

interface Props {
  surface: "marketplace" | "internal";
}

export function PlanOAssistant({ surface }: Props) {
  const open = usePlanAiOpen();
  const setOpen = (next: boolean) => planAiStore.set(next);
  const isPlanO = surface === "marketplace";

  return (
    <>
      <button
        onClick={() => planAiStore.toggle()}
        className={cn(
          "group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]",
          "bg-primary text-primary-foreground",
        )}
        style={{ boxShadow: "var(--shadow-glow), 0 20px 40px -20px rgb(0 0 0 / 0.6)" }}
        aria-label={isPlanO ? "Open PlanAI assistant" : "Open help assistant"}
        aria-expanded={open}
      >
        <span aria-hidden className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-primary-foreground/60 animate-pulse-ring" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-primary-foreground" />
        </span>
        <Sparkles className="h-4 w-4" aria-hidden />
        <span>{isPlanO ? "Ask PlanAI" : "Help & copilot"}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={isPlanO ? "PlanAI assistant" : "Help assistant"}
          className="fixed bottom-24 right-5 z-40 flex h-[min(560px,calc(100dvh-10rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl glass animate-fade-rise"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
            <AboxMark size={34} tone={isPlanO ? "primary" : "sage"} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{isPlanO ? "PlanAI" : "Help & copilot"}</p>
              <p className="text-serial mt-0.5">
                {isPlanO ? "Guidance only · not binding" : "Search help · quick actions"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-muted-foreground hover:bg-accent" aria-label="Close assistant">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 text-sm">
            {isPlanO ? (
              <>
                <div className="rounded-2xl border border-hairline bg-background/30 px-4 py-3 text-foreground">
                  Hi — I'm PlanAI. I help you think through health plan options. I don't decide for you, and I'll always show you the tradeoffs.
                </div>
                <div className="rounded-2xl bg-primary/15 px-4 py-3 text-foreground/85">
                  Try: "I want to keep my doctor and pay less monthly," or "explain the difference between Bronze and Silver."
                </div>
                <p className="pt-2 text-xs text-muted-foreground">
                  Full conversational PlanAI ships in Wave 2 (Lovable AI Gateway + AI Elements).
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">Search articles, keyboard shortcuts, and quick actions.</p>
                <div className="rounded-2xl border border-hairline bg-background/30 px-4 py-3 text-muted-foreground">
                  Try: "how do I share a quote", "what does APTC mean", "run a quick quote".
                </div>
              </>
            )}
          </div>
          <div className="border-t border-hairline px-4 py-3">
            <div className="flex items-center gap-2 rounded-full glass px-4 py-2">
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={isPlanO ? "Ask PlanAI anything…" : "Search help or run an action…"}
                aria-label="Assistant input"
              />
              <button
                className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:scale-[1.04] transition-transform"
                type="button"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
