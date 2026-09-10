/**
 * Selling Setup host — embedded inside the existing M06 Agent and Agency
 * profile surfaces. It does not create a second profile, and it does not
 * introduce a separate credential application.
 */
import { useEffect, useMemo, useState, type ReactElement } from "react";

import { Note, Select } from "@/components/lucie/ui";
import { Btn } from "@/components/m06/kit";
import { LanguageToggle, M08LocaleProvider, ReviewModeBanner, useT } from "@/components/m08/kit";
import {
  AppointmentsScreen,
  BlockersScreen,
  DocumentsScreen,
  EOScreen,
  LicensesScreen,
  NPNScreen,
  OverviewScreen,
  ProductAuthorityScreen,
  TrainingScreen,
  WhereICanSellScreen,
  type M08ScreenProps,
} from "@/components/m08/screens";
import { M08_CONTEXTS, M08_SUBJECTS, subjectById } from "@/lib/m08/data";
import { M08_SCREENS } from "@/lib/m08/registry";
import { t } from "@/lib/m08/strings";

const SCREENS: Record<string, (p: M08ScreenProps) => ReactElement> = {
  overview: OverviewScreen,
  "where-i-can-sell": WhereICanSellScreen,
  blockers: BlockersScreen,
  licenses: LicensesScreen,
  appointments: AppointmentsScreen,
  "product-authority": ProductAuthorityScreen,
  eo: EOScreen,
  training: TrainingScreen,
  documents: DocumentsScreen,
  npn: NPNScreen,
};

export function SellingSetup({
  role = "AGENT",
  personId,
}: {
  role?: "AGENT" | "AGENCY_ADMIN" | "JET_COMPLIANCE";
  personId?: string;
}) {
  return (
    <M08LocaleProvider>
      <SellingSetupBody role={role} personId={personId} />
    </M08LocaleProvider>
  );
}

function SellingSetupBody({
  role,
  personId,
}: {
  role: "AGENT" | "AGENCY_ADMIN" | "JET_COMPLIANCE";
  personId?: string;
}) {
  const { locale, t: tr, pick } = useT();
  const [subjectId, setSubjectId] = useState(personId ?? M08_SUBJECTS[0].person_id);
  const [contextIndex, setContextIndex] = useState(0);
  const [tab, setTab] = useState("overview");
  const [returnPath, setReturnPath] = useState<string | null>(null);

  /* A deficiency opened from quoting or enrolment keeps its return path. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rp = params.get("returnTo");
    if (rp) {
      setReturnPath(rp);
      setTab("blockers");
    }
  }, []);

  const subject = useMemo(() => subjectById(subjectId), [subjectId]);
  const context = M08_CONTEXTS[Math.min(contextIndex, M08_CONTEXTS.length - 1)];
  const Screen = SCREENS[tab] ?? OverviewScreen;

  const props: M08ScreenProps = {
    subject,
    context,
    contexts: M08_CONTEXTS,
    role,
    returnPath,
    onReturn: () => {
      if (returnPath) window.location.assign(returnPath);
    },
  };

  return (
    <section className="grid gap-4" aria-label={t(locale, "module.name")}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-eyebrow tracking-[0.14em]">M08 · {pick("Licensing, appointments and selling authority", "Licencias, nombramientos y autoridad de venta")}</p>
          <h2 className="text-display mt-2 text-2xl sm:text-3xl">{t(locale, "module.name")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(locale, "module.lede")}</p>
        </div>
        <LanguageToggle />
      </header>

      <ReviewModeBanner />

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px]">
          <Select
            label={pick("Person", "Persona")}
            value={subjectId}
            onChange={setSubjectId}
            options={M08_SUBJECTS.map((s) => ({ value: s.person_id, label: `${s.display_name} · NPN ${s.npn.npn}` }))}
          />
        </div>
        <div className="min-w-[280px] flex-1">
          <Select
            label={tr("label.context")}
            value={String(contextIndex)}
            onChange={(v) => setContextIndex(Number(v))}
            options={M08_CONTEXTS.map((c, i) => ({
              value: String(i),
              label: `${c.state_code} · ${c.carrier_name} · ${c.product_scope_key} · ${c.transaction.replaceAll("_", " ").toLowerCase()}`,
            }))}
          />
        </div>
      </div>

      <nav aria-label={t(locale, "module.name")} className="flex flex-wrap gap-2">
        {M08_SCREENS.map((s) => (
          <Btn
            key={s.key}
            variant={s.key === tab ? "primary" : "ghost"}
            onClick={() => setTab(s.key)}
            title={s.id}
          >
            <span aria-current={s.key === tab ? "page" : undefined}>
              {t(locale, s.name_key as Parameters<typeof t>[1])}
            </span>
          </Btn>
        ))}
      </nav>

      {subject.licenses.length === 0 && tab === "overview" ? (
        <Note tone="warn">
          {pick(
            "This person has no credential records yet and their affiliation is still pending agency approval. Nothing is blocked until an approved affiliation exists.",
            "Esta persona aún no tiene registros de credenciales y su afiliación sigue pendiente de aprobación de la agencia. Nada se bloquea hasta que exista una afiliación aprobada.",
          )}
        </Note>
      ) : null}

      <Screen {...props} />
    </section>
  );
}
