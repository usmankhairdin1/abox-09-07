import { EmployerFrame } from "@/components/lucie-app/frames";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, Field, PageHeader, Section, StatCard } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CensusRow } from "@/lib/lucie-app/data";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/app/employer/census")({
  head: () => ({
    meta: [
      { title: "Employee census — Cedarline Logistics" },
      { name: "description", content: "Maintain the list of eligible employees, their age, location, coverage tier and class." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Employee census" },
      { property: "og:description", content: "The eligible employee list behind your allowance model." },
    ],
  }),
  component: () => (
    <EmployerFrame title="Employee census">
      <CensusPage />
    </EmployerFrame>
  ),
});

const EMPTY = { name: "", age: "30", zip: "78701", tier: "Employee", class: "Full-time", salary: "60000" };

function CensusPage() {
  const { state, dispatch } = useLucie();
  const [row, setRow] = useState(EMPTY);

  const add = () => {
    if (!row.name.trim()) {
      toast.error("Enter the employee's name.");
      return;
    }
    const next: CensusRow = {
      id: `EMP-${String(state.census.length + 1).padStart(2, "0")}`,
      name: row.name.trim(),
      age: Number(row.age) || 30,
      zip: row.zip,
      tier: row.tier as CensusRow["tier"],
      class: row.class as CensusRow["class"],
      salary: Number(row.salary) || 0,
    };
    dispatch({ type: "census:add", row: next });
    setRow(EMPTY);
    toast.success(`${next.name} added to the census.`);
  };

  const avgAge = state.census.length
    ? Math.round(state.census.reduce((s, r) => s + r.age, 0) / state.census.length)
    : 0;

  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 4"
        title="Employee census"
        lede="Age and location drive individual market pricing, so the closer this list is to reality the closer your cost estimate will be."
        actions={
          <Button variant="outline" onClick={() => toast.success("Spreadsheet template downloaded.")}>
            <Upload className="h-4 w-4" /> Import from spreadsheet
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Employees" value={state.census.length} />
        <StatCard label="Average age" value={avgAge} />
        <StatCard label="Full-time" value={state.census.filter((r) => r.class === "Full-time").length} />
      </div>

      <Section title="Eligible employees">
        <DataTable
          rows={state.census}
          keyOf={(r) => r.id}
          columns={[
            { head: "Employee", cell: (r) => <span className="font-medium">{r.name}</span> },
            { head: "Age", cell: (r) => r.age },
            { head: "Zip", cell: (r) => r.zip },
            { head: "Tier", cell: (r) => r.tier },
            { head: "Class", cell: (r) => r.class },
            { head: "Salary", cell: (r) => `$${r.salary.toLocaleString()}` },
            {
              head: "",
              cell: (r) => (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${r.name}`}
                  onClick={() => dispatch({ type: "census:remove", id: r.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Add an employee">
        <Card className="grid gap-4 p-5 sm:grid-cols-6">
          <Field label="Name" className="sm:col-span-2">
            <Input value={row.name} onChange={(e) => setRow({ ...row, name: e.target.value })} />
          </Field>
          <Field label="Age">
            <Input value={row.age} inputMode="numeric" onChange={(e) => setRow({ ...row, age: e.target.value.replace(/\D/g, "") })} />
          </Field>
          <Field label="Zip">
            <Input value={row.zip} onChange={(e) => setRow({ ...row, zip: e.target.value })} />
          </Field>
          <Field label="Tier">
            <Select value={row.tier} onValueChange={(v) => setRow({ ...row, tier: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Employee", "Employee + spouse", "Family"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Class">
            <Select value={row.class} onValueChange={(v) => setRow({ ...row, class: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Full-time", "Part-time", "Seasonal"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="sm:col-span-6">
            <Button size="sm" onClick={add}>
              <Plus className="h-3.5 w-3.5" /> Add to census
            </Button>
          </div>
        </Card>
      </Section>

      <div className="flex justify-end">
        <Button asChild>
          <Link to="/lucie-app/employer/contribution">
            Continue to contribution model <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
