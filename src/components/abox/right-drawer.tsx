/**
 * Right Context Drawer — translucent floating panel with an ember tab.
 */
import type { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

export function RightDrawer({ title = "Context", children }: Props) {
  return (
    <aside
      className="relative hidden w-[340px] shrink-0 border-l border-hairline bg-surface/50 backdrop-blur-sm lg:block"
      aria-label={title}
    >
      <span aria-hidden className="absolute -left-0.5 top-14 h-16 w-1 rounded-r bg-primary" />
      <div className="sticky top-16 flex flex-col">
        <div className="border-b border-hairline px-6 py-5">
          <p className="text-serial">Context</p>
          <h2 className="text-display mt-2 text-2xl leading-tight">{title}</h2>
        </div>
        <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </aside>
  );
}
