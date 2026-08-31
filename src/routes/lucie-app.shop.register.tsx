import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field, PageHeader, Section, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Northgate Marketplace" },
      { name: "description", content: "Create an account to save your quote, resume later and track your application." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Create your account" },
      { property: "og:description", content: "Save your quote and consent to electronic documents." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const [email, setEmail] = useState(state.application.personal.email);
  const [phone, setPhone] = useState(state.application.personal.phone);
  const [password, setPassword] = useState("");
  const [consentComms, setConsentComms] = useState(false);
  const [consentShare, setConsentShare] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = () => {
    const next: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (!/^[\d\s()+-]{7,}$/.test(phone)) next.phone = "Enter a phone number we can reach you on.";
    if (!consentComms) next.consent = "You need to accept electronic documents to continue online.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("A few things still need your attention.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      dispatch({ type: "app:patch", patch: { personal: { ...state.application.personal, email, phone }, consent: true } });
      dispatch({ type: "register" });
      setBusy(false);
      toast.success("Account created. Your quote is saved.");
      void navigate({ to: "/lucie-app/shop/application" });
    }, 600);
  };

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={3} />
      <PageHeader
        eyebrow="Step 4 of 9"
        title="Create your account"
        lede="Your quote and cart are saved to this account, so you can leave and pick up exactly where you stopped."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Section title="Sign-in details">
          <Card className="grid gap-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email address" required hint={errors.email}>
                <Input value={email} aria-invalid={Boolean(errors.email)} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Mobile number" required hint={errors.phone}>
                <Input value={phone} aria-invalid={Boolean(errors.phone)} onChange={(e) => setPhone(e.target.value)} placeholder="(512) 555-0148" />
              </Field>
            </div>
            <Field label="Password" required hint={errors.password ?? "At least 8 characters."}>
              <Input
                type="password"
                value={password}
                aria-invalid={Boolean(errors.password)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <div className="grid gap-3 border-t border-border pt-4">
              <label className="flex items-start gap-2.5 text-xs leading-relaxed">
                <Checkbox checked={consentComms} onCheckedChange={(v) => setConsentComms(Boolean(v))} className="mt-0.5" />
                <span>
                  I agree to receive my policy documents, notices and signature requests electronically.
                  {errors.consent ? <span className="block text-destructive">{errors.consent}</span> : null}
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-xs leading-relaxed">
                <Checkbox checked={consentShare} onCheckedChange={(v) => setConsentShare(Boolean(v))} className="mt-0.5" />
                <span>
                  A licensed agent from Northgate Insurance Group may contact me about my quote.{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <Button onClick={submit} disabled={busy}>
                {busy ? "Creating account…" : "Create account and continue"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </Section>

        <aside className="grid content-start gap-3">
          <Card className="gap-2 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-success" /> What is saved
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your household details, the plans in your cart and the price you were quoted. If prices change before you
              apply, we tell you and re-quote rather than quietly changing the number.
            </p>
          </Card>
          <Card className="gap-2 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <Lock className="h-4 w-4 text-primary" /> Already have an account?
            </p>
            <p className="text-xs text-muted-foreground">
              Signing in restores your saved quote. This prototype signs you in automatically.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => {
                dispatch({ type: "register" });
                toast.success("Signed in. Saved quote restored.");
                void navigate({ to: "/lucie-app/shop/application" });
              }}
            >
              Sign in instead
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}
