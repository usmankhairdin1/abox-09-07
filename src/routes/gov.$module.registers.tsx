import { createFileRoute, useNavigate, useParams, useSearch } from "@tanstack/react-router";

import { RegisterTable } from "@/components/governed/RegisterTable";
import { Annotation, WBox, WPanel } from "@/components/wireframe/primitives";
import { useRegisters, type GovernedModuleKey } from "@/lib/governed";
import { cn } from "@/lib/utils";

type Search = { r: string };

export const Route = createFileRoute("/gov/$module/registers")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    r: typeof search["r"] === "string" ? (search["r"] as string) : "",
  }),
  component: RegistersPage,
});

function RegistersPage() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const search = useSearch({ from: "/gov/$module/registers" });
  const navigate = useNavigate();
  const { data, isLoading, isError } = useRegisters(module);

  if (isLoading) return <WBox className="h-32" label="loading controlled registers" />;
  if (isError || !data) return <WBox className="h-32" label="register load failed — retry available" />;

  const names = Object.keys(data.registers).sort();
  const active = names.includes(search.r) ? search.r : (names[0] ?? "");
  const rows = data.registers[active] ?? [];

  return (
    <div className="space-y-3">
      <Annotation>
        Every controlled register shipped in the packet, verbatim. Use the filter to trace a stable ID
        across requirements, acceptance criteria, rules, permissions, APIs and events.
      </Annotation>

      <nav aria-label="Registers" className="flex flex-wrap gap-1.5">
        {names.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() =>
              navigate({ to: "/gov/$module/registers", params: { module }, search: { r: n } })
            }
            aria-current={n === active ? "true" : undefined}
            className={cn(
              "rounded border border-hairline px-2 py-1 font-mono text-[10px] hover:bg-accent",
              n === active && "bg-muted font-semibold",
            )}
          >
            {n.replace(/_/g, " ")} · {(data.registers[n] ?? []).length}
          </button>
        ))}
      </nav>

      {active ? (
        <WPanel title={active.replace(/_/g, " ")} id={`${module.toUpperCase()}-${active}`}>
          <RegisterTable id={active} rows={rows} />
        </WPanel>
      ) : (
        <WBox className="h-24" label="no registers published for this module" />
      )}
    </div>
  );
}
