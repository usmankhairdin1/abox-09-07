import { createFileRoute, useParams } from "@tanstack/react-router";

import { RegisterTable } from "@/components/governed/RegisterTable";
import { Annotation, WBox, WPanel } from "@/components/wireframe/primitives";
import { moduleIndex, useRegisters, type GovernedModuleKey } from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/traceability")({
  component: TraceabilityPage,
});

function TraceabilityPage() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const idx = moduleIndex(module);
  const { data, isLoading, isError } = useRegisters(module);

  if (isLoading) return <WBox className="h-32" label="loading traceability register" />;
  if (isError || !data) return <WBox className="h-32" label="register load failed — retry available" />;

  const trace = data.registers["Traceability_Register"] ?? [];
  const tests = data.registers["Test_Register"] ?? [];
  const gates = data.registers["Launch_Gates"] ?? [];
  const screensWithReq = idx.screens.filter((s) => s.requirements.length).length;

  return (
    <div className="space-y-3">
      <Annotation>
        Requirement → acceptance → test → screen coverage for this packet, plus the launch gates that
        must pass before activation.
      </Annotation>

      <WPanel title="Coverage summary" id={`${module.toUpperCase()}-COVERAGE`}>
        <dl className="grid gap-2 sm:grid-cols-4">
          {[
            ["Traceability rows", trace.length],
            ["Test scenarios", tests.length],
            ["Launch gates", gates.length],
            ["Screens with REQ links", `${screensWithReq}/${idx.screens.length}`],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded border border-dashed border-hairline p-2">
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</dt>
              <dd className="font-mono text-sm">{String(v)}</dd>
            </div>
          ))}
        </dl>
      </WPanel>

      {trace.length ? (
        <WPanel title="Traceability register" id={`${module.toUpperCase()}-TRACE`}>
          <RegisterTable id="Traceability_Register" rows={trace} />
        </WPanel>
      ) : null}

      {gates.length ? (
        <WPanel title="Launch gates" id={`${module.toUpperCase()}-GATES`}>
          <RegisterTable id="Launch_Gates" rows={gates} limit={30} />
        </WPanel>
      ) : null}
    </div>
  );
}
