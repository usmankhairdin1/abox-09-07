import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MemberShell } from "@/components/abox/member-shell";
import { PageHeader } from "@/components/abox/page-header";
import { useAuthSession } from "@/lib/auth-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/member/settings")({
  head: () => ({ meta: [{ title: "Settings — ABox Member" }, { name: "description", content: "Profile, notifications, and privacy." }] }),
  component: Page,
});

function Page() {
  const { session } = useAuthSession();
  const sessionFullName = (session?.user.user_metadata?.full_name as string | undefined) ?? "";
  const [fullName, setFullName] = useState(sessionFullName);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // The session's metadata can resolve a tick after this page's first
  // render (auth state settles asynchronously) — keep the field in sync
  // with the real session until the user starts editing it themselves.
  useEffect(() => {
    if (!touched) setFullName(sessionFullName);
  }, [sessionFullName, touched]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
    setSaving(false);
    if (!error) setSaved(true);
  };

  return (
    <MemberShell>
      <PageHeader eyebrow="Preferences" title="Settings" />
      <div className="grid gap-6 md:grid-cols-2">
        <section className={surfaceClass()}>
          <h2 className="text-display text-2xl">Profile</h2>
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-eyebrow">Full name</span>
              <input
                value={fullName} onChange={(e) => { setTouched(true); setFullName(e.target.value); }}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block">
              <span className="text-eyebrow">Email</span>
              <input
                disabled value={session?.user.email ?? "—"}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-muted px-3 text-muted-foreground outline-none"
              />
            </label>
            <label className="block">
              <span className="text-eyebrow">Mobile</span>
              <input
                disabled value={session?.user.phone ?? "—"}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-muted px-3 text-muted-foreground outline-none"
              />
            </label>
            <button
              type="button" onClick={save} disabled={saving}
              className="mt-2 inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && <p className="text-xs text-sage">Saved.</p>}
          </div>
        </section>
        <section className={surfaceClass()}>
          <h2 className="text-display text-2xl">Notifications</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Toggle label="Email — quote updates" defaultChecked />
            <Toggle label="Email — agent messages" defaultChecked />
            <Toggle label="SMS — appointment reminders" defaultChecked />
            <Toggle label="Marketing — new products & tips" />
          </div>
        </section>
        <section className={cn(surfaceClass(), "md:col-span-2")}>
          <h2 className="text-display text-2xl">Privacy & security</h2>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>Two-factor authentication: <span className="text-foreground">Off</span> — <span className="text-muted-foreground/70">Coming soon</span></p>
            <p>Data export: <span className="text-muted-foreground/70">Coming soon</span></p>
            <p>Delete account: <span className="text-muted-foreground/70">Coming soon</span></p>
          </div>
        </section>
      </div>
    </MemberShell>
  );
}
function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--primary)]" />
    </label>
  );
}
