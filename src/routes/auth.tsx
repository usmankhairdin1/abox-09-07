import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Id, Note } from "@/components/lucie/ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Operator sign in | ABox platform foundation" },
      {
        name: "description",
        content:
          "Sign in as an ABox platform operator to invoke governed M00 foundation operations against the live platform database.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Operator sign in — ABox" },
      { property: "og:description", content: "Authenticate to run governed M00 platform foundation operations." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "good" | "stop" | "info"; text: string } | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/m00/console" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/m00/console` },
        });
        if (error) throw error;
        setMessage({ tone: "info", text: "Account created. Confirm the email, then sign in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        void navigate({ to: "/m00/console" });
      }
    } catch (err) {
      setMessage({ tone: "stop", text: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-hairline bg-card p-5 shadow-card">
        <div className="mb-4 flex items-baseline gap-2">
          <h1 className="text-sm font-semibold tracking-tight">ABox operator sign in</h1>
          <Id>M00</Id>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Authentication establishes the server-resolved request context used by every governed foundation operation.
        </p>

        {message ? <Note tone={message.tone}>{message.text}</Note> : null}

        <form onSubmit={submit} className="mt-3 flex flex-col gap-2.5">
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-hairline bg-background px-2.5 py-2 text-sm normal-case tracking-normal text-foreground"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-hairline bg-background px-2.5 py-2 text-sm normal-case tracking-normal text-foreground"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
          <button type="button" className="underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create an operator account" : "I already have an account"}
          </button>
          <Link to="/m00" className="underline">
            Back to foundation
          </Link>
        </div>
      </div>
    </main>
  );
}
