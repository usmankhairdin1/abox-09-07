/**
 * /accessibility — WCAG statement & keyboard reference.
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, Keyboard, Ear, Eye, Hand } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — ABox" },
      { name: "description", content: "ABox commits to WCAG 2.2 AA. Read our accessibility statement, supported assistive tech, and how to report a barrier." },
      { property: "og:title", content: "Accessibility at ABox" },
      { property: "og:description", content: "Our commitment to WCAG 2.2 AA and inclusive shopping." },
    ],
  }),
  component: Page,
});

const PILLARS = [
  { icon: Eye, title: "Perceivable", body: "AA color contrast, resizable text to 200% without loss of content, alt text on non-decorative images, and no color-only meaning." },
  { icon: Hand, title: "Operable", body: "Full keyboard support, visible focus rings, 44×44px tap targets, skip links, and no keyboard traps." },
  { icon: Ear, title: "Understandable", body: "Plain-language copy, consistent navigation, form errors that identify the field and suggest a fix." },
  { icon: Accessibility, title: "Robust", body: "Semantic HTML, ARIA only when native semantics fall short, and testing with screen readers on every release." },
];

const KEYS = [
  ["Tab / Shift+Tab", "Move focus"],
  ["Enter / Space", "Activate the focused control"],
  ["Esc", "Close a dialog, drawer, or menu"],
  ["Arrow keys", "Move within menus, tabs, and steps"],
  ["/", "Focus the search field (where present)"],
];

function Page() {
  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-6 md:px-8 md:pt-8">
        <PageHeader eyebrow="Statement" title="Accessibility at ABox"
          description="We design and build ABox to conform with WCAG 2.2 AA. Everyone should be able to shop for coverage — with or without assistive technology." />

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <article key={title} className={surfaceClass()}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                <p className="font-medium">{title}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </section>

        <section className={cn("mt-10", surfaceClass({ padding: "lg" }))}>
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-display text-2xl">Keyboard shortcuts</h2>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {KEYS.map(([k, d]) => (
              <div key={k} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm">
                <kbd className="rounded border border-border bg-background px-2 py-1 font-mono text-xs">{k}</kbd>
                <dd className="text-muted-foreground text-right">{d}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className={surfaceClass({ padding: "lg" })}>
            <p className="text-eyebrow">Supported assistive tech</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>· NVDA & JAWS on Windows</li>
              <li>· VoiceOver on macOS &amp; iOS</li>
              <li>· TalkBack on Android</li>
              <li>· Voice Control &amp; Switch Control</li>
              <li>· 200% zoom and system font scaling</li>
            </ul>
          </div>
          <div className={surfaceClass({ padding: "lg" })}>
            <p className="text-eyebrow">Known gaps</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>· PDF plan summaries follow carrier accessibility — request an alternate format via an agent.</li>
              <li>· Some carrier logos are decorative and marked <code className="text-xs">aria-hidden</code>.</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-primary-soft p-6">
          <p className="text-display text-xl">Report a barrier</p>
          <p className="mt-1 text-sm text-muted-foreground">
            If something isn't working for you, email <a href="mailto:accessibility@abox.example" className="story-link text-primary">accessibility@abox.example</a>.
            We aim to acknowledge within one business day.
          </p>
        </section>
      </div>
    </MarketplaceShell>
  );
}
