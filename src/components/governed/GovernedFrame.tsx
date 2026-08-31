import { useState } from "react";

import { Link } from "@tanstack/react-router";

import {
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WBox,
  WLine,
  WPanel,
  WRow,
} from "@/components/wireframe/primitives";
import {
  flowsForScreen,
  type GovernedModuleKey,
  type GovernedScreen,
} from "@/lib/governed";
import { cn } from "@/lib/utils";

const STATE_HINT: Record<string, string> = {
  loading: "Skeleton regions, aria-busy, no layout shift.",
  empty: "Explains why nothing is here and the next permitted action.",
  ready: "Default governed content.",
  success: "Confirmation with polite live-region announcement.",
  warning: "Non-blocking caution, non-colour cue plus icon and text.",
  blocked: "Canonical blocker owner and reason are named; action disabled with explanation.",
  validation_error: "Error summary at top, focus moved to summary, each field associated.",
  permission_denied: "Explains the missing permission; never leaks record content.",
  suspended: "Read-only; existing records keep continuity.",
  ended: "Terminal, historical evidence remains reachable.",
  downstream_pending: "Waiting on a canonical owner outside this module.",
  retry_available: "Safe, idempotent retry with clear last attempt time.",
  draft: "Editable draft release, never public.",
  scheduled: "One future coordinated publication; current active release retained.",
  superseded: "Historical release, read-only.",
  in_review: "Awaiting JET review; root sees the review state and what is required.",
  reconciliation_required: "Operator reconciliation task raised with evidence.",
};

function Chips({ items, tone }: { items: string[]; tone?: "muted" | "warn" }) {
  if (!items.length) return <Annotation>none recorded</Annotation>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <Pill
          key={i}
          className={cn(tone === "warn" && "border-dashed text-muted-foreground")}
        >
          {i}
        </Pill>
      ))}
    </div>
  );
}

/**
 * Low-fidelity governed screen frame. Structure only — every zone is derived
 * from the controlled Screen Register row so the frame carries its SCR, REQ and
 * workspace evidence.
 */
export function GovernedFrame({
  module,
  screen,
}: {
  module: GovernedModuleKey;
  screen: GovernedScreen;
}) {
  const [lang, setLang] = useState<"EN" | "ES">("EN");
  const [state, setState] = useState<string>(screen.states[0] ?? "ready");
  const flows = flowsForScreen(module, screen.id);
  const isPublic = screen.workspace === "WS-M04-004";

  return (
    <div className="space-y-4">
      <PageHeading
        id={screen.id}
        title={screen.name}
        description={screen.purpose}
      />

      <div className="flex flex-wrap items-center gap-2">
        <IdChip>{screen.workspace}</IdChip>
        {screen.route ? <IdChip>{screen.route}</IdChip> : null}
        <IdChip>{screen.status}</IdChip>
        {screen.capability ? <IdChip>{screen.capability}</IdChip> : null}
        <div className="ml-auto flex items-center gap-1" role="group" aria-label="Language">
          {(["EN", "ES"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                "rounded border border-border px-2 py-1 font-mono text-[10px] uppercase",
                lang === l ? "bg-muted font-semibold" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {l === "EN" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </div>

      {isPublic ? (
        <Annotation>
          Public Marketplace Entry frame. Rendered here inside the governance chrome for review;
          the public surface itself carries only the resolved marketplace brand, language picker,
          owner and attribution, support route and enabled pathways.
        </Annotation>
      ) : null}

      {/* ------------------------------------------------------ state switch */}
      <WPanel title="Required states" id={`${screen.id}-STATES`}>
        <div className="flex flex-wrap gap-1.5">
          {screen.states.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              aria-pressed={state === s}
              className={cn(
                "rounded border border-border px-2 py-1 font-mono text-[10px]",
                state === s ? "bg-muted font-semibold" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <Annotation className="mt-2">
          <strong className="font-semibold">{state}</strong> —{" "}
          {STATE_HINT[state] ?? "Governed state rendered with non-colour cue, label and announcement."}
        </Annotation>
      </WPanel>

      {/* ---------------------------------------------------------- sections */}
      <div className="grid gap-3 lg:grid-cols-2">
        {screen.sections.map((section, i) => (
          <section
            key={section}
            className="rounded-md border border-dashed border-border bg-muted/10 p-3"
          >
            <header className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-tight">{section}</span>
              <IdChip>{`${screen.id}-Z${String(i + 1).padStart(2, "0")}`}</IdChip>
            </header>
            {state === "loading" ? (
              <div className="space-y-2" aria-busy="true">
                <WLine w="80%" />
                <WLine w="60%" />
                <WLine w="70%" />
              </div>
            ) : state === "empty" ? (
              <WBox className="h-20" label="empty state — reason and next permitted action" />
            ) : state === "permission_denied" ? (
              <WBox className="h-20" label="permission denied — no record content shown" />
            ) : (
              <div className="space-y-2">
                <WRow primary="72%" secondary="46%" />
                <WRow primary="58%" secondary="38%" />
                <WRow primary="64%" secondary="30%" />
              </div>
            )}
            <Annotation className="mt-2">
              {lang === "EN" ? "English content keys" : "Claves de contenido en español"} ·{" "}
              {`m04.${screen.id.toLowerCase()}.z${i + 1}.*`}
            </Annotation>
          </section>
        ))}
      </div>

      {/* ---------------------------------------------------------- actions */}
      <WPanel title="Primary actions" id={`${screen.id}-ACTIONS`}>
        <div className="flex flex-wrap gap-2">
          {screen.actions.map((a) => (
            <WBox
              key={a}
              className={cn(
                "h-9 min-w-[9rem] px-3",
                (state === "blocked" || state === "permission_denied" || state === "suspended") &&
                  "opacity-60",
              )}
              label={a}
            />
          ))}
        </div>
        {state === "blocked" ? (
          <Annotation className="mt-2">
            Blocked: the canonical owner and reason for the blocker are named next to each disabled
            action. M04 never resolves a downstream blocker itself.
          </Annotation>
        ) : null}
      </WPanel>

      {/* ------------------------------------------------------ governance */}
      <div className="grid gap-3 lg:grid-cols-2">
        <WPanel title="Roles and ACL" id={`${screen.id}-ACL`}>
          <Chips items={screen.roles} />
        </WPanel>
        <WPanel title="Requirements" id={`${screen.id}-REQ`}>
          <Chips items={screen.requirements} />
        </WPanel>
        <WPanel title="Responsive treatment" id={`${screen.id}-RESP`}>
          <Annotation>{screen.responsive || "Desktop, tablet and mobile."}</Annotation>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <WBox className="h-16" label="desktop" />
            <WBox className="h-16" label="tablet" />
            <WBox className="h-16" label="mobile" />
          </div>
        </WPanel>
        <WPanel title="Localization" id={`${screen.id}-I18N`}>
          <Annotation>
            {screen.localization ||
              "Complete English and Spanish; no partial English fallback on an activated marketplace."}
          </Annotation>
        </WPanel>
        <WPanel title="Accessibility" id={`${screen.id}-A11Y`}>
          <Annotation>
            {screen.accessibility ||
              "WCAG 2.2 AA: landmarks, labels, keyboard, visible focus, error summary, non-colour cues, 200% zoom."}
          </Annotation>
          <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
            <li>Focus order: skip link → context bar → language picker → sections → actions.</li>
            <li>Status announcements: marketplace, language, release, route, participant, async.</li>
            <li>Row actions reachable without hover; destructive actions confirm explicitly.</li>
          </ul>
        </WPanel>
        <WPanel title="Governed flows using this screen" id={`${screen.id}-FLOWS`}>
          {flows.length ? (
            <ul className="space-y-1">
              {flows.map((f) => (
                <li key={f.id}>
                  <Link
                    to="/gov/$module/flows/$flow"
                    params={{ module, flow: f.slug }}
                    className="text-xs underline underline-offset-2 hover:text-foreground"
                  >
                    {f.id} · {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Annotation>No governed flow references this screen directly.</Annotation>
          )}
        </WPanel>
      </div>
    </div>
  );
}
