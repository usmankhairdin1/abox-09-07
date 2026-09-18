/**
 * UX-022 — Schedule Time / Request Call
 */
import { controlClass } from "@/components/abox/control";
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Calendar } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { SAMPLE_SLOTS } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-022"].name} — ABox` }, { name: "description", content: SCREENS["UX-022"].purpose }] }),
  component: Page,
});

function Page() {
  const [step, setStep] = useState<"pick" | "form" | "done">("pick");
  const [slotId, setSlotId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", topic: "General questions" });
  const slot = SAMPLE_SLOTS.find((s) => s.id === slotId);

  return (
    <MarketplaceShell showAssistant={false}>
      <div className="mx-auto max-w-4xl px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
        <PageHeader
          scrId="UX-022" eyebrow="Talk to an agent"
          title={step === "done" ? "You're on the calendar" : "Schedule a call"}
          description={step === "done"
            ? "You'll receive a confirmation email and calendar invite."
            : "Pick a time that works. Calls are 20 minutes with a licensed agent."}
        />

        {step === "pick" && (
          <>
            <p className="text-eyebrow mb-2">Available slots</p>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {SAMPLE_SLOTS.map((s) => (
                <button
                  key={s.id}
                  disabled={!s.available}
                  aria-pressed={slotId === s.id}
                  onClick={() => setSlotId(s.id)}
                  className={cn(
                    "flex flex-col rounded-xl border p-4 text-left transition-colors",
                    slotId === s.id ? "border-primary bg-primary-soft/40"
                    : s.available ? "border-border bg-card hover:bg-accent"
                    : "border-border bg-muted/50 opacity-60",
                  )}
                >
                  <span className="text-eyebrow">{s.day}</span>
                  <span className="mt-1 text-display text-2xl tabular-nums">{s.when}</span>
                  <span className="mt-1 text-xs text-muted-foreground">with {s.producer}</span>
                  {!s.available && <span className="mt-1 text-xs text-muted-foreground">Booked</span>}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => slot && setStep("form")}
                disabled={!slot}
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === "form" && slot && (
          <form
            onSubmit={(e) => { e.preventDefault(); setStep("done"); }}
            className={cn("space-y-4", surfaceClass())}
          >
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" aria-hidden />
              <span>{slot.day} at <span className="font-medium">{slot.when}</span> with {slot.producer}</span>
            </div>
            <label className="block text-sm">
              <span className="text-eyebrow">Your name</span>
              <input required autoComplete="name" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={cn("mt-1", controlClass({ height: "lg", focusRing: true }))} />
            </label>
            <label className="block text-sm">
              <span className="text-eyebrow">Best phone</span>
              <input required inputMode="tel" autoComplete="tel" value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={cn("mt-1", controlClass({ height: "lg", focusRing: true }))} />
            </label>
            <label className="block text-sm">
              <span className="text-eyebrow">What's the call about?</span>
              <select value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                className={cn("mt-1", controlClass({ height: "lg", focusRing: true }))}>
                <option>General questions</option>
                <option>Compare specific plans</option>
                <option>Subsidy questions</option>
                <option>Employer ICHRA</option>
                <option>Ready to enroll</option>
              </select>
            </label>
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep("pick")} className="text-sm text-muted-foreground hover:text-foreground">
                ← Pick a different slot
              </button>
              <button type="submit" className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">
                Confirm call
              </button>
            </div>
          </form>
        )}

        {step === "done" && slot && (
          <div className="rounded-2xl border border-sage/40 bg-sage-soft/40 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-sage" aria-hidden />
              <div>
                <p className="font-medium">{slot.day} at {slot.when} — confirmed</p>
                <p className="mt-1 text-sm">A calendar invite is on the way. {slot.producer} will call you at the number you provided.</p>
                <p className="mt-3 text-xs text-muted-foreground">Need to reschedule? Reply to the confirmation email or open your <a className="story-link" href="/member">member workspace</a>.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketplaceShell>
  );
}
