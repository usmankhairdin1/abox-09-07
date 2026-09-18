/**
 * UX-022 (internal side) — Agent schedule
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_SLOTS } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/schedule")({
  head: () => ({ meta: [{ title: `Schedule — ABox` }, { name: "description", content: SCREENS["UX-022"].purpose }] }),
  component: Page,
});

function Page() {
  const byDay = SAMPLE_SLOTS.reduce<Record<string, typeof SAMPLE_SLOTS>>((acc, s) => {
    (acc[s.day] = acc[s.day] ?? []).push(s); return acc;
  }, {});
  return (
    <InternalShell workspace="agent" pageTitle="Schedule" eyebrow="Relationships">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(byDay).map(([day, slots]) => (
          <section key={day} className={surfaceClass()}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-display text-2xl">{day}</h2>
              <span className="text-xs text-muted-foreground">{slots.filter((s) => !s.available).length} booked</span>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {slots.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium tabular-nums">{s.when}</p>
                    <p className="text-xs text-muted-foreground">{s.producer}</p>
                  </div>
                  <StatusBadge tone={s.available ? "sage" : "primary"}>{s.available ? "Open" : "Booked"}</StatusBadge>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </InternalShell>
  );
}
