import { EmployerFrame } from "@/components/lucie-app/frames";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download, Send } from "lucide-react";
import { toast } from "sonner";

import { Money, PageHeader, Section, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contributionTotals, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/app/employer/proposal")({
  head: () => ({
    meta: [
      { title: "Proposal — Cedarline Logistics" },
      { name: "description", content: "Package your allowance design into a proposal and route it to your agency to set enrolment dates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Benefits proposal" },
      { property: "og:description", content: "A shareable summary of your allowance design and its cost." },
    ],
  }),
  component: () => (
    <EmployerFrame title="Proposal">
      <ProposalPage />
    </EmployerFrame>
  ),
});

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-3 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0">{value}</span>
    </div>
  );
}

function ProposalPage() {
  const { state, dispatch } = useLucie();
  const totals = contributionTotals(state);
  const modelLabel =
    state.contribution.model === "age" ? "Age banded" : state.contribution.model === "class" ? "Class based" : "Flat";

  return (
    <>
      <PageHeader
        eyebrow="Step 4 of 4"
        title="Benefits proposal"
        lede="This is what your adviser sees. Routing it does not commit you to anything — it starts the conversation with real numbers attached."
        actions={
          <Button variant="outline" onClick={() => toast.success("Proposal PDF downloaded.")}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Section title="Proposal summary">
          <Card className="grid gap-0 p-6">
            <Row label="Employer" value="Cedarline Logistics · Austin, TX" />
            <Row label="Eligible employees" value={`${state.census.length} on the current census`} />
            <Row label="Contribution model" value={modelLabel} />
            <Row label="Base allowance" value={<Money value={state.contribution.base} per="mo" />} />
            <Row label="Monthly employer cost" value={<Money value={totals.monthly} />} />
            <Row label="Annual employer cost" value={<Money value={totals.annual} />} />
            <Row label="Proposed effective date" value="1 January 2027" />
            <Row
              label="Enrolment support"
              value="Northgate Insurance Group provides a branded storefront and licensed advisers for each employee."
            />
          </Card>
        </Section>

        <aside className="grid content-start gap-3">
          <Card className="grid gap-3 p-5">
            {state.ichraRouted ? (
              <>
                <StatusChip tone="good">Routed to your agency</StatusChip>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Northgate Insurance Group has the proposal. An adviser will confirm effective dates and open a
                  storefront for your employees.
                </p>
                <p className="flex items-center gap-2 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Sent {new Date().toLocaleDateString("en-US")}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ready to send</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Routing shares the census summary and cost design with your agency. Individual employee salaries are
                  not included.
                </p>
                <Button
                  onClick={() => {
                    dispatch({ type: "ichra:route" });
                    toast.success("Proposal routed to Northgate Insurance Group.");
                  }}
                >
                  <Send className="h-4 w-4" /> Route to my agency
                </Button>
              </>
            )}
          </Card>

          <Button variant="ghost" asChild>
            <Link to="/lucie-app/employer">Back to overview</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
