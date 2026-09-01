import { EmployerFrame } from "@/components/lucie-app/frames";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { DataTable, Money, PageHeader, Section, StatCard, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contributionTotals, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/app/employer/results")({
  head: () => ({
    meta: [
      { title: "Cost results — Cedarline Logistics" },
      { name: "description", content: "Per-employee allowance, employer cost and the likely out-of-pocket gap for each person on your census." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Cost results" },
      { property: "og:description", content: "What your allowance design costs, per employee and in total." },
    ],
  }),
  component: () => (
    <EmployerFrame title="Cost results">
      <ResultsPage />
    </EmployerFrame>
  ),
});

const benchmark = (age: number) => Math.round(320 + (age - 25) * 9);

function ResultsPage() {
  const { state } = useLucie();
  const totals = contributionTotals(state);
  const covered = totals.rows.filter((r) => r.amount >= benchmark(r.age)).length;

  return (
    <>
      <PageHeader
        eyebrow="Step 3 of 4"
        title="Cost results"
        lede="Compared against a benchmark silver premium in each employee's area, so you can see who is fully covered and who pays a balance."
        actions={
          <Button variant="outline" asChild>
            <Link to="/app/employer/contribution">Adjust the model</Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly employer cost" value={<Money value={totals.monthly} />} />
        <StatCard label="Annual employer cost" value={<Money value={totals.annual} />} />
        <StatCard label="Fully covered" value={`${covered} of ${totals.rows.length}`} tone={covered === totals.rows.length ? "good" : "warn"} />
        <StatCard
          label="Average allowance"
          value={<Money value={totals.rows.length ? Math.round(totals.monthly / totals.rows.length) : 0} per="mo" />}
        />
      </div>

      <Section title="Per employee">
        <DataTable
          rows={totals.rows}
          keyOf={(r) => r.id}
          columns={[
            { head: "Employee", cell: (r) => <span className="font-medium">{r.name}</span> },
            { head: "Age", cell: (r) => r.age },
            { head: "Class", cell: (r) => r.class },
            { head: "Allowance", cell: (r) => <Money value={r.amount} per="mo" /> },
            { head: "Benchmark premium", cell: (r) => <Money value={benchmark(r.age)} per="mo" /> },
            {
              head: "Employee pays",
              cell: (r) => {
                const gap = benchmark(r.age) - r.amount;
                return gap > 0 ? (
                  <span className="text-warning-foreground">
                    <Money value={gap} per="mo" />
                  </span>
                ) : (
                  <StatusChip tone="good">Fully covered</StatusChip>
                );
              },
            },
          ]}
        />
      </Section>

      <Card className="p-5 text-xs leading-relaxed text-muted-foreground">
        Benchmark premiums are illustrative for this prototype. Final costs depend on the plans each employee actually
        chooses on the marketplace, which is why the proposal step routes this design to a licensed adviser.
      </Card>

      <div className="flex justify-end">
        <Button asChild>
          <Link to="/app/employer/proposal">
            Build the proposal <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
