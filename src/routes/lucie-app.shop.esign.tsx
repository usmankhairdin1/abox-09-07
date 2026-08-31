import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileSignature, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field, PageHeader, Section, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/esign")({
  head: () => ({
    meta: [
      { title: "Sign your application — Northgate Marketplace" },
      { name: "description", content: "Read the attestations and sign your application electronically to send it to the carrier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Sign your application" },
      { property: "og:description", content: "Electronic attestation and signature." },
    ],
  }),
  component: EsignPage,
});

const ATTESTATIONS = [
  "The information in this application is true and complete to the best of my knowledge.",
  "I understand that giving false information may end my coverage and require repayment of any assistance.",
  "I authorise the carrier and marketplace to verify the details I have provided.",
  "I accept the plan documents, privacy notice and terms of enrolment.",
];

function EsignPage() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const [checked, setChecked] = useState<boolean[]>(ATTESTATIONS.map(() => false));
  const [signature, setSignature] = useState(state.application.signature || state.application.personal.legalName);
  const [busy, setBusy] = useState(false);

  const allChecked = checked.every(Boolean);
  const nameMatches =
    signature.trim().toLowerCase() === state.application.personal.legalName.trim().toLowerCase() &&
    signature.trim().length > 0;

  const sign = () => {
    if (!allChecked || !nameMatches) {
      toast.error("Accept every statement and type your legal name exactly.");
      return;
    }
    setBusy(true);
    const id = `SUB-${Math.floor(Math.random() * 9000 + 1000)}`;
    window.setTimeout(() => {
      dispatch({ type: "app:patch", patch: { signature } });
      dispatch({ type: "app:submit", id });
      setBusy(false);
      toast.success("Signed and submitted.");
      void navigate({ to: "/lucie-app/shop/status" });
    }, 900);
  };

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={7} />
      <PageHeader
        eyebrow="Step 8 of 9"
        title="Sign your application"
        lede="Your signature is recorded with a timestamp and an audit entry. A signed copy is emailed to you immediately."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Section title="Attestations">
          <Card className="grid gap-4 p-5">
            {ATTESTATIONS.map((a, i) => (
              <label key={a} className="flex items-start gap-3 text-sm leading-relaxed">
                <Checkbox
                  className="mt-0.5"
                  checked={checked[i]}
                  onCheckedChange={(v) =>
                    setChecked((prev) => prev.map((c, idx) => (idx === i ? Boolean(v) : c)))
                  }
                />
                <span>{a}</span>
              </label>
            ))}

            <div className="grid gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <Field
                label="Type your full legal name to sign"
                required
                hint={
                  nameMatches
                    ? "Signature matches the name on the application."
                    : `Must match exactly: ${state.application.personal.legalName}`
                }
              >
                <Input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="font-display text-lg"
                  aria-invalid={!nameMatches}
                />
              </Field>
              <p className="text-[11px] text-muted-foreground">
                Signing on {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} ·
                recorded with your device and time of signing.
              </p>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={sign} disabled={busy || !allChecked || !nameMatches}>
                <FileSignature className="h-4 w-4" />
                {busy ? "Submitting…" : "Sign and submit application"}
              </Button>
            </div>
          </Card>
        </Section>

        <aside className="grid content-start gap-3">
          <Card className="gap-2 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-success" /> What happens next
            </p>
            <ol className="grid list-decimal gap-1.5 pl-4 text-xs leading-relaxed text-muted-foreground">
              <li>Your application is packaged and sent to the carrier.</li>
              <li>You get a submission reference you can track on this site.</li>
              <li>Marketplace medical items hand over to the exchange for the final step.</li>
              <li>The carrier confirms effective dates, usually within two business days.</li>
            </ol>
          </Card>
        </aside>
      </div>
    </>
  );
}
