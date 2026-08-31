import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field, PageHeader, Section, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/application")({
  head: () => ({
    meta: [
      { title: "Application — Northgate Marketplace" },
      { name: "description", content: "Complete the application for the plans in your cart. Progress is saved as you go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Application" },
      { property: "og:description", content: "A single guided application for every item in your cart." },
    ],
  }),
  component: ApplicationPage,
});

function ApplicationPage() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const app = state.application;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patchPersonal = (patch: Partial<typeof app.personal>) =>
    dispatch({ type: "app:patch", patch: { personal: { ...app.personal, ...patch } } });
  const patchAddress = (patch: Partial<typeof app.address>) =>
    dispatch({ type: "app:patch", patch: { address: { ...app.address, ...patch } } });
  const patchAnswers = (patch: Partial<typeof app.answers>) =>
    dispatch({ type: "app:patch", patch: { answers: { ...app.answers, ...patch } } });

  const submit = () => {
    const next: Record<string, string> = {};
    if (!app.personal.legalName.trim()) next.legalName = "Enter your full legal name.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(app.personal.dob)) next.dob = "Use the date picker to set your date of birth.";
    if (!/^\d{4}$/.test(app.personal.ssnLast4)) next.ssnLast4 = "Enter the last four digits.";
    if (!app.address.line1.trim()) next.line1 = "Enter your street address.";
    if (!app.answers.citizen) next.citizen = "Answer this question to continue.";
    if (!app.answers.otherCoverage) next.otherCoverage = "Answer this question to continue.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Some answers are still missing.");
      return;
    }
    void navigate({ to: "/lucie-app/shop/documents" });
  };

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={4} />
      <PageHeader
        eyebrow="Step 5 of 9"
        title="Your application"
        lede="One application covers everything in your cart. You can save and come back — nothing is sent until you sign."
        actions={
          <Button variant="outline" onClick={() => toast.success("Progress saved. You can return any time.")}>
            <Save className="h-4 w-4" /> Save and finish later
          </Button>
        }
      />

      <div className="grid gap-6">
        <Section title="About you">
          <Card className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Full legal name" required hint={errors.legalName}>
              <Input
                value={app.personal.legalName}
                aria-invalid={Boolean(errors.legalName)}
                onChange={(e) => patchPersonal({ legalName: e.target.value })}
              />
            </Field>
            <Field label="Date of birth" required hint={errors.dob}>
              <Input
                type="date"
                value={app.personal.dob}
                aria-invalid={Boolean(errors.dob)}
                onChange={(e) => patchPersonal({ dob: e.target.value })}
              />
            </Field>
            <Field label="Last 4 of social security number" required hint={errors.ssnLast4}>
              <Input
                value={app.personal.ssnLast4}
                inputMode="numeric"
                maxLength={4}
                aria-invalid={Boolean(errors.ssnLast4)}
                onChange={(e) => patchPersonal({ ssnLast4: e.target.value.replace(/\D/g, "") })}
              />
            </Field>
            <Field label="Contact phone">
              <Input value={app.personal.phone} onChange={(e) => patchPersonal({ phone: e.target.value })} />
            </Field>
          </Card>
        </Section>

        <Section title="Home address">
          <Card className="grid gap-4 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_120px]">
            <Field label="Street address" required hint={errors.line1}>
              <Input
                value={app.address.line1}
                aria-invalid={Boolean(errors.line1)}
                onChange={(e) => patchAddress({ line1: e.target.value })}
                placeholder="1200 Barton Springs Rd"
              />
            </Field>
            <Field label="City">
              <Input value={app.address.city} onChange={(e) => patchAddress({ city: e.target.value })} />
            </Field>
            <Field label="State">
              <Select value={app.address.state} onValueChange={(v) => patchAddress({ state: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["TX", "OK", "NM"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Zip">
              <Input value={app.address.zip} onChange={(e) => patchAddress({ zip: e.target.value })} />
            </Field>
          </Card>
        </Section>

        <Section title="Eligibility questions">
          <Card className="grid gap-5 p-5">
            <Field label="Are you a US citizen or lawfully present?" required hint={errors.citizen}>
              <RadioGroup
                className="flex gap-6"
                value={app.answers.citizen}
                onValueChange={(v) => patchAnswers({ citizen: v })}
              >
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm capitalize">
                    <RadioGroupItem value={v} /> {v}
                  </label>
                ))}
              </RadioGroup>
            </Field>
            <Field label="Has anyone on this application used tobacco in the last 6 months?">
              <RadioGroup
                className="flex gap-6"
                value={app.answers.tobacco}
                onValueChange={(v) => patchAnswers({ tobacco: v })}
              >
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm capitalize">
                    <RadioGroupItem value={v} /> {v}
                  </label>
                ))}
              </RadioGroup>
            </Field>
            <Field label="Do you have other coverage starting on or before your coverage date?" required hint={errors.otherCoverage}>
              <RadioGroup
                className="flex gap-6"
                value={app.answers.otherCoverage}
                onValueChange={(v) => patchAnswers({ otherCoverage: v })}
              >
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm capitalize">
                    <RadioGroupItem value={v} /> {v}
                  </label>
                ))}
              </RadioGroup>
            </Field>
            <Field label="Anything else the carrier should know?" hint="Optional. Free text is reviewed by the carrier.">
              <Textarea
                rows={3}
                value={app.answers.conditions}
                onChange={(e) => patchAnswers({ conditions: e.target.value })}
                placeholder="For example, a planned procedure or a recent address change."
              />
            </Field>
          </Card>
        </Section>

        <div className="flex justify-end">
          <Button size="lg" onClick={submit}>
            Continue to documents <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
