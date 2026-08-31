/**
 * Save & Continue Later (FR-077, BR-012). Cart/quote state already
 * autosaves to sessionStorage on every change — this gives the shopper a
 * discoverable, explicit action that confirms it and stamps when they
 * last asked for it, rather than leaving "save" purely implicit.
 */
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { markProgressSaved } from "@/lib/quote-store";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function SaveContinueButton({ className }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        markProgressSaved();
        toast.success("Progress saved", {
          description: "This browser will remember your quote and cart — come back anytime.",
        });
      }}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm hover:bg-accent",
        className,
      )}
    >
      <Bookmark className="h-4 w-4" aria-hidden />
      Save & continue later
    </button>
  );
}
