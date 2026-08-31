import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DataTable,
  Field,
  PageHeader,
  Section,
  StatusChip,
  Stepper,
  toneFor,
} from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Agent } from "@/lib/lucie-app/data";
import { AGENT_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/agency/producers")({
  head: () => ({
    meta: [
      { title: "Producers — Northgate Insurance Group" },
      { name: "description", content: "Onboard producers, track licences and appointments, and control who is cleared to sell." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Producers" },
      { property: "og:description", content: "Producer roster with licence, appointment and readiness state." },
    ],
  }),
  component: ProducersPage,
});

const ALL = "__all";

function ProducersPage() {
  const { state, dispatch } = useLucie();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(ALL);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({ name: "", email: "", npn: "", state: "TX", captive: "Independent" });

  const rows = useMemo(
    () =>
      state.agents.filter((a) => {
        if (status !== ALL && a.status !== status) return false;
        const n = q.trim().toLowerCase();
        return !n || [a.name, a.email, a.npn, a.states.join(" ")].join(" ").toLowerCase().includes(n);
      }),
    [state.agents, q, status],
  );

  const createAgent = () => {
    if (!draft.name.trim() || !/^\d{6,}$/.test(draft.npn)) {
      toast.error("A name and a valid NPN are required.");
      return;
    }
    const agent: Agent = {
      id: `AGT-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: draft.name.trim(),
      email: draft.email.trim() || `${draft.name.trim().toLowerCase().replace(/\s+/g, ".")}@northgate-ins.example`,
      npn: draft.npn,
      states: [draft.state],
      status: "in_review",
      captive: draft.captive,
      onboarded: new Date().toISOString().slice(0, 10),
      licenses: [],
      appointments: [],
      blockReason: "Licence verification not yet returned.",
    };
    dispatch({ type: "agent:add", agent });
    setOpen(false);
    setStep(0);
    setDraft({ name: "", email: "", npn: "", state: "TX", captive: "Independent" });
    toast.success(`${agent.name} added. Licence check requested.`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Agency"
        title="Producers"
        lede="A producer can only be quoted against once their licence and carrier appointment both check out. Readiness here is what the storefront enforces."
        actions={
          <Button onClick={() => setOpen(true)}>
            <UserPlus className="h-4 w-4" /> Onboard a producer
          </Button>
        }
      />

      <Section title={`${rows.length} producer${rows.length === 1 ? "" : "s"}`}>
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, NPN, state…" className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All readiness states</SelectItem>
              {["ready", "pending_license", "pending_appointment", "blocked"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          rows={rows}
          keyOf={(a) => a.id}
          onRowClick={(a) => setSelected(a)}
          columns={[
            {
              head: "Producer",
              cell: (a) => (
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    NPN {a.npn} · {a.captive}
                  </p>
                </div>
              ),
            },
            { head: "States", cell: (a) => a.states.join(", ") },
            { head: "Licences", cell: (a) => `${a.licenses.filter((l) => l.status === "active").length} active` },
            { head: "Appointments", cell: (a) => `${a.appointments.filter((x) => x.status === "appointed").length} appointed` },
            {
              head: "Readiness",
              cell: (a) => <StatusChip tone={toneFor(a.status)}>{a.status.replace("_", " ")}</StatusChip>,
            },
          ]}
        />
      </Section>

      <Sheet open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-5 px-4 pb-8">
                <div className="flex flex-wrap gap-2">
                  <StatusChip tone={toneFor(selected.status)}>{selected.status.replace("_", " ")}</StatusChip>
                  <StatusChip>{selected.captive}</StatusChip>
                  <StatusChip>Onboarded {selected.onboarded}</StatusChip>
                </div>
                {selected.blockReason ? (
                  <p className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
                    {selected.blockReason}
                  </p>
                ) : null}

                <div className="grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Licences</p>
                  {selected.licenses.length ? (
                    selected.licenses.map((l) => (
                      <Card key={l.id} className="grid gap-1 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {l.state} · {l.lineOfAuthority}
                          </span>
                          <StatusChip tone={toneFor(l.status)}>{l.status}</StatusChip>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {l.number} · expires {l.expires}
                        </p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No licence on file yet.</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Carrier appointments</p>
                  {selected.appointments.length ? (
                    selected.appointments.map((ap) => (
                      <Card key={ap.id} className="grid gap-1 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{ap.carrier}</span>
                          <StatusChip tone={toneFor(ap.status)}>{ap.status}</StatusChip>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {ap.state} · effective {ap.effective}
                        </p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No appointments recorded.</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={selected.status === "ready"}
                    onClick={() => {
                      dispatch({ type: "agent:status", id: selected.id, status: "ready" });
                      setSelected({ ...selected, status: "ready", blockReason: undefined });
                      toast.success(`${selected.name} is cleared to sell.`);
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Clear to sell
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dispatch({
                        type: "agent:status",
                        id: selected.id,
                        status: "blocked",
                        reason: "Blocked by agency admin pending compliance review.",
                      });
                      setSelected({
                        ...selected,
                        status: "blocked",
                        blockReason: "Blocked by agency admin pending compliance review.",
                      });
                      toast.success("Producer blocked from selling.");
                    }}
                  >
                    Block from selling
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Onboard a producer</DialogTitle>
          </DialogHeader>
          <Stepper steps={AGENT_STEPS} current={step} />
          <div className="grid gap-4 py-2">
            {step === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </Field>
                <Field label="Work email">
                  <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                </Field>
                <Field label="National producer number" required hint="Digits only.">
                  <Input
                    value={draft.npn}
                    inputMode="numeric"
                    onChange={(e) => setDraft({ ...draft, npn: e.target.value.replace(/\D/g, "") })}
                  />
                </Field>
                <Field label="Relationship">
                  <Select value={draft.captive} onValueChange={(v) => setDraft({ ...draft, captive: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Independent", "Captive", "Downline"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            ) : null}
            {step === 1 ? (
              <Field label="Resident licence state" hint="We verify the licence against the state register before the producer can quote.">
                <Select value={draft.state} onValueChange={(v) => setDraft({ ...draft, state: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["TX", "OK", "NM", "AZ"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}
            {step === 2 ? (
              <p className="text-sm text-muted-foreground">
                Appointment requests will be raised with Brightline Assurance and Cordell Health once the licence check
                returns. No action is needed now.
              </p>
            ) : null}
            {step === 3 ? (
              <p className="text-sm text-muted-foreground">
                The producer inherits the agency selling rules: marketplace medical, dental, vision and accident. Product
                access can be narrowed later from their record.
              </p>
            ) : null}
            {step === 4 ? (
              <div className="grid gap-2 rounded-lg border border-border p-4 text-sm">
                <p className="font-medium">{draft.name || "New producer"}</p>
                <p className="text-xs text-muted-foreground">
                  NPN {draft.npn || "—"} · {draft.state} · {draft.captive}
                </p>
                <p className="text-xs text-muted-foreground">
                  Will be created as <strong>pending licence</strong> and cannot sell until verification returns.
                </p>
              </div>
            ) : null}
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < AGENT_STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button onClick={createAgent}>Create producer</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
