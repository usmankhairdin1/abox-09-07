import { createFileRoute, useParams } from "@tanstack/react-router";

import { RegisterTable } from "@/components/governed/RegisterTable";
import { Annotation, WBox, WPanel } from "@/components/wireframe/primitives";
import { DELTA_REGISTERS, useRegisters, type GovernedModuleKey } from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/deltas")({
  component: DeltasPage,
});

function DeltasPage() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const { data, isLoading, isError } = useRegisters(module);

  if (isLoading) return <WBox className="h-32" label="loading impact and delta registers" />;
  if (isError || !data) return <WBox className="h-32" label="register load failed — retry available" />;

  const present = DELTA_REGISTERS.filter((n) => data.registers[n]?.length);

  return (
    <div className="space-y-3">
      <Annotation>
        Prior-module impacts and proposed deltas. Every proposed delta is unapproved and not started:
        it is recorded as a proposal, never rendered as current production behaviour. Protected M01
        keeps its immutable baseline until a delta is approved through change control.
      </Annotation>

      {present.map((n) => (
        <WPanel key={n} title={n.replace(/_/g, " ")} id={`${module.toUpperCase()}-${n}`}>
          <RegisterTable id={n} rows={data.registers[n] ?? []} />
        </WPanel>
      ))}

      {present.length === 0 ? (
        <WBox className="h-24" label="this packet publishes no prior-module impact registers" />
      ) : null}
    </div>
  );
}
