/**
 * Member Workspace Shell — arc side navigation with progress dots.
 * The left column is a dot-progression rail; each nav item is a labeled
 * dot connected by a hairline arc. Content is contained in a rounded
 * glass canvas plate.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AboxMark } from "./logo";
import { PlanAiAssistant } from "./planai-assistant";
import { ThemeToggle } from "./theme-toggle";
import { DotField, Aurora } from "./decor";
import { MEMBER_NAV } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  memberName?: string;
}

export function MemberShell({ children, memberName = "Renata" }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <DotField className="fixed inset-0 -z-10" />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>

      <header className="sticky top-4 z-30 flex justify-center px-4">
        <div className="glass flex w-full max-w-6xl items-center justify-between gap-3 rounded-full pl-4 pr-2 py-2">
          <Link to="/" className="flex items-center gap-2.5">
            <AboxMark size={32} tone="primary" />
            <div className="hidden flex-col leading-tight md:flex">
              <span className="text-display text-base">ABox</span>
              <span className="text-serial">Member workspace</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground md:inline">
              <span className="text-serial mr-2">Hello</span>
              <span className="text-foreground">{memberName}</span>
            </span>
            <ThemeToggle />
            <button
              className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-sm font-medium hover:bg-accent min-h-10"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 md:flex-row md:px-8 md:py-12">
        {/* Arc dot rail */}
        <aside className="md:w-60 md:shrink-0" aria-label="Member navigation">
          <nav className="relative">
            {/* connecting arc */}
            <span aria-hidden className="pointer-events-none absolute left-[13px] top-4 bottom-4 hidden w-px bg-gradient-to-b from-primary/60 via-hairline to-transparent md:block" />
            <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-3 md:overflow-visible">
              {MEMBER_NAV.map((item: (typeof MEMBER_NAV)[number]) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <li key={item.to} className="relative">
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-4 whitespace-nowrap rounded-2xl px-2 py-2 text-sm transition-all",
                        active ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface text-muted-foreground group-hover:text-foreground border border-hairline",
                        )}
                        style={active ? { boxShadow: "var(--shadow-glow)" } : undefined}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="font-medium">{item.label}</span>

                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main id="main" className="relative min-w-0 flex-1 overflow-hidden rounded-3xl border border-hairline bg-card p-6 md:p-10">
          <Aurora className="opacity-50" />
          <div className="relative">{children}</div>
        </main>
      </div>

      <PlanAiAssistant context="your coverage shopping" />
    </div>
  );
}
