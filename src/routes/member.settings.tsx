import { createFileRoute } from "@tanstack/react-router";
import { MemberShell } from "@/components/abox/member-shell";
import { PageHeader } from "@/components/abox/page-header";

export const Route = createFileRoute("/member/settings")({
  head: () => ({ meta: [{ title: "Settings — ABox Member" }, { name: "description", content: "Profile, notifications, and privacy." }] }),
  component: Page,
});

function Page() {
  return (
    <MemberShell>
      <PageHeader eyebrow="Preferences" title="Settings" />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display text-2xl">Profile</h2>
          <form className="mt-4 space-y-3 text-sm">
            <Field label="Full name" defaultValue="Renata Alvarez" />
            <Field label="Email" type="email" defaultValue="renata@example.com" />
            <Field label="Mobile" type="tel" defaultValue="+1 555 012 4477" />
            <button type="button" className="mt-2 inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
              Save changes
            </button>
          </form>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display text-2xl">Notifications</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Toggle label="Email — quote updates" defaultChecked />
            <Toggle label="Email — agent messages" defaultChecked />
            <Toggle label="SMS — appointment reminders" defaultChecked />
            <Toggle label="Marketing — new products & tips" />
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 md:col-span-2">
          <h2 className="text-display text-2xl">Privacy & security</h2>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>Two-factor authentication: <span className="text-foreground">Off</span> — <button className="story-link text-primary">Enable</button></p>
            <p>Data export: <button className="story-link text-primary">Request download</button></p>
            <p>Delete account: <button className="story-link text-destructive">Start request</button></p>
          </div>
        </section>
      </div>
    </MemberShell>
  );
}
function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-eyebrow">{label}</span>
      <input {...rest} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}
function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-[oklch(0.585_0.145_42)]" />
    </label>
  );
}
