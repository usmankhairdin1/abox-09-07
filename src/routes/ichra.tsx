/**
 * Employer ICHRA landing — for the /ichra marketplace path.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Check, ArrowRight, Users, DollarSign, ShieldCheck } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";

export const Route = createFileRoute("/ichra")({
  head: () => ({
    meta: [
      { title: "ICHRA for Employers — ABox" },
      { name: "description", content: "Set a monthly allowance. Let your team pick a plan that fits. ICHRA quoting powered by JET." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-8">
          <PageHeader
            eyebrow="For employers"
            title="ICHRA: set an allowance. Team picks the plan."
            description="Give employees defined-contribution funding for individual health insurance — with less admin, and real choice for your team."
            actions={
              <Link to="/app/employer/ichra" className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Start a group quote <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: <DollarSign className="h-5 w-5" />, title: "Fixed cost", body: "Set a per-employee monthly allowance you can budget." },
              { icon: <Users className="h-5 w-5" />, title: "Real choice", body: "Employees shop the individual marketplace — Plan-AI helps." },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Compliant", body: "ACA-compliant reimbursement model, class-based rules supported." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">{c.icon}</div>
                <p className="mt-3 text-display text-xl">{c.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <p className="text-eyebrow">How ICHRA works</p>
          <ul className="mt-4 space-y-4">
          {[
            "You set a monthly allowance per employee class (full-time, part-time, seasonal, etc.).",
            "Employees shop individual & family plans in their zip code — with subsidy awareness.",
            "You reimburse premiums (and optionally out-of-pocket) up to the allowance.",
            "ABox handles the enrollment paperwork and provides your admin dashboard.",
           ].map((s) => (
            <li key={s} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="text-sm">{s}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-3xl border border-border bg-secondary p-8">
          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-6 w-6 text-primary" aria-hidden />
            <div>
              <h2 className="text-display text-3xl">Ready to see the numbers?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a simple census, tell us the allowance, and see illustrative costs by class.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/app/employer/ichra" className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">
                  Start a group quote
                </Link>
                <Link to="/schedule" className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-medium">
                  Talk to us first
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-10 space-y-2 text-sm">
          {[
            "Class-based allowances (FT, PT, seasonal, salaried, hourly)",
            "Reimbursement of premiums; optional QSEHRA-style OOP",
            "Employee shopping via the ABox marketplace with Plan-AI guidance",
            "Admin dashboard for approvals, reimbursements, and reporting",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2 text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 text-sage" aria-hidden /><span>{f}</span>
            </li>
          ))}
        </ul>
      </section>
    </MarketplaceShell>
  );
}
