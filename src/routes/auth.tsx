/**
 * UX-015 — Registration / Login
 * Design and behaviour aligned to the ABox reference marketplace auth screen:
 * email+password or phone OTP, with light consent capture on registration.
 */
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Phone, Lock, ArrowRight, ShieldCheck } from "lucide-react";

import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Sign in or register | ABox";
const DESC =
  "Sign in to ABox to save quotes, compare plans across sessions, message your agent, and manage policies and renewals.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Sign in or register — ABox" },
      { property: "og:description", content: DESC },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/member" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (method === "email") {
      if (mode === "register" && !fullName.trim()) return setError("Enter your full name.");
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return setError("Enter a valid email address.");
      if (pw.length < 8) return setError("Password must be at least 8 characters.");
      if (mode === "register" && !consent)
        return setError("Please agree to the terms and privacy notice to continue.");

      setBusy(true);
      if (mode === "register") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password: pw,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/member`,
          },
        });
        setBusy(false);
        if (authError) return setError(authError.message);
        if (!data.session) {
          setNotice("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pw });
        setBusy(false);
        if (authError) return setError(authError.message);
      }
      void navigate({ to: "/member" });
    } else {
      if (mode === "register" && !fullName.trim()) return setError("Enter your full name.");
      if (!phone.match(/^\+?\d{7,15}$/)) return setError("Enter a valid phone number.");
      if (!otpSent) {
        setBusy(true);
        const { error: otpError } = await supabase.auth.signInWithOtp({ phone });
        setBusy(false);
        if (otpError) return setError(otpError.message);
        setOtpSent(true);
        setNotice("We sent a 6-digit code to your phone.");
        return;
      }
      if (otp.length !== 6) return setError("Enter the 6-digit code.");
      setBusy(true);
      const { error: verifyError } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (!verifyError && mode === "register" && fullName.trim()) {
        await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
      }
      setBusy(false);
      if (verifyError) return setError(verifyError.message);
      void navigate({ to: "/member" });
    }
  };

  return (
    <MarketplaceShell showAssistant={false}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-8">
        <div>
          <PageHeader
            eyebrow={mode === "signin" ? "Welcome back" : "Create your ABox"}
            title={mode === "signin" ? "Sign in" : "Start your account"}
            description="ABox keeps your quotes, cart, and messages together across every product."
          />
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-surface p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode("signin")}
                aria-pressed={mode === "signin"}
                className={cn(
                  "rounded-full py-2",
                  mode === "signin" ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground",
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                aria-pressed={mode === "register"}
                className={cn(
                  "rounded-full py-2",
                  mode === "register" ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground",
                )}
              >
                Register
              </button>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-surface p-1 text-sm">
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setOtpSent(false);
                }}
                aria-pressed={method === "email"}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-full py-2",
                  method === "email" ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground",
                )}
              >
                <Mail className="h-4 w-4" aria-hidden /> Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("phone");
                  setOtpSent(false);
                }}
                aria-pressed={method === "phone"}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-full py-2",
                  method === "phone" ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground",
                )}
              >
                <Phone className="h-4 w-4" aria-hidden /> Phone OTP
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3" noValidate>
              {mode === "register" && (
                <label className="block text-sm">
                  <span className="text-eyebrow">Full name</span>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Jordan Rivera"
                  />
                </label>
              )}
              {method === "email" ? (
                <>
                  <label className="block text-sm">
                    <span className="text-eyebrow">Email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-eyebrow">Password</span>
                    <div className="relative mt-1">
                      <Lock
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <input
                        type="password"
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        required
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 outline-none focus:ring-2 focus:ring-ring"
                        placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
                      />
                    </div>
                  </label>
                </>
              ) : (
                <>
                  <label className="block text-sm">
                    <span className="text-eyebrow">Mobile phone</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
                      placeholder="+1 (555) 123-4567"
                    />
                  </label>
                  {otpSent && (
                    <label className="block text-sm">
                      <span className="text-eyebrow">Verification code</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 tracking-widest tabular-nums outline-none focus:ring-2 focus:ring-ring"
                        placeholder="000000"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">6-digit code sent to your phone.</p>
                    </label>
                  )}
                </>
              )}

              {mode === "register" && (
                <label className="flex items-start gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5"
                  />
                  I agree to the ABox terms and privacy notice. Plan-AI guidance is educational, not legal or medical
                  advice.
                </label>
              )}

              {notice && <p className="text-xs text-muted-foreground">{notice}</p>}
              {error && (
                <p role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {busy
                  ? "Please wait…"
                  : method === "phone" && !otpSent
                    ? "Send code"
                    : mode === "signin"
                      ? "Sign in"
                      : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              We use industry-standard encryption. No SSN required to browse or quote.
            </div>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="rounded-3xl border border-border bg-secondary p-8">
            <p className="text-eyebrow">Why register</p>
            <h2 className="text-display mt-2 text-3xl">Save your progress. Enroll faster.</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Save quotes and pick up where you left off",
                "Compare plans across sessions",
                "Get shared links from an agent",
                "Manage messages, policies, and renewals",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-sage" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Registration is optional to shop; required to enroll.
              <br />
              Working at an agency?{" "}
              <Link to="/app/dashboard" className="story-link">
                Go to your workspace
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </MarketplaceShell>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M7.293 13.293 4 10l1.414-1.414 1.879 1.879 6.293-6.293L15 5.586l-7.707 7.707z" />
    </svg>
  );
}
