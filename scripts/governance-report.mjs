#!/usr/bin/env node
// Governance Batch C (Phase 47) — REPORT-ONLY drift diagnostics.
//
// E5 raw colour-literal drift, E6 canonical consumer counts, E7 duplicate
// canonical definitions. This script only reads the repository and writes two
// report artifacts under .lovable/. It never modifies src/, never fails a
// build, is not wired into build/dev/CI, and no finding authorises a migration.
//
// Deterministic: inputs are file contents only. No timestamps, git state,
// environment values or network access. Output ordering is fixed.
//
// Run: node scripts/governance-report.mjs

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SCAN_DIRS = ["src/routes", "src/components"];
const OUT_JSON = ".lovable/governance-report.json";
const OUT_MD = ".lovable/governance-report.md";

// --------------------------------------------------------------------------
// Shared exception taxonomy (Phase 44). Declared once; used by all analyzers.
// --------------------------------------------------------------------------

const REFERENCE_PATHS = [
  "src/lib/design/",
  "src/components/design/",
  "src/lib/design-tokens.ts",
  "src/routes/design-system.tsx",
  "src/routes/design-guide.tsx",
];

const INDEPENDENT_SYSTEMS = [
  { prefix: "src/components/abox/internal-shell.tsx", label: "independent shell" },
  { prefix: "src/components/abox/marketplace-shell.tsx", label: "independent shell" },
  { prefix: "src/components/abox/member-shell.tsx", label: "independent shell" },
  { prefix: "src/components/lucie", label: "Lucie subtree" },
  { prefix: "src/components/m06", label: "M06 governed subtree" },
  { prefix: "src/components/m08", label: "M08 governed subtree" },
  { prefix: "src/components/ai-elements", label: "AI elements (vendored)" },
  { prefix: "src/components/ui/", label: "shadcn/Radix primitive" },
];

// E5 frozen allowlist. Each entry records the exact snippet observed at
// implementation time; a new literal in the same file still reports as
// review-required, so the allowlist cannot silently absorb future drift.
const E5_ALLOWLIST = [
  {
    file: "src/components/abox/carrier-mark.tsx",
    match: "oklch(",
    reason: "Computed per-carrier hue; intentional one-off visual treatment (Phase 44).",
  },
  {
    file: "src/routes/app.jet.branding.tsx",
    match: "oklch(",
    reason: "Foundation token values shown as display copy, not applied as style.",
  },
  {
    file: "src/components/abox/plan-o-assistant.tsx",
    match: "rgb(0 0 0 / 0.6)",
    reason: "Shadow composition alongside var(--shadow-glow).",
  },
  {
    file: "src/routes/marketplace.admin.brand.tsx",
    match: "#fff",
    reason: "Runtime brand preview; fixed contrast colour over a tenant-supplied background.",
  },
  {
    file: "src/routes/marketplace.admin.preview.tsx",
    match: "#fff",
    reason: "Runtime brand preview; fixed contrast colour over a tenant-supplied background.",
  },
];

// E6 canonical sources. Helper/class sources are counted as their own source,
// never folded into a component.
const CANONICAL_SOURCES = [
  { module: "@/components/abox/action-pill-component", symbols: ["ActionPill", "actionPillClass"] },
  { module: "@/components/abox/action-pill", symbols: ["ACTION_PILL"] },
  { module: "@/components/abox/status-badge", symbols: ["StatusBadge"] },
  { module: "@/components/abox/kpi-card", symbols: ["KpiCard"] },
  { module: "@/components/abox/page-header", symbols: ["PageHeader"] },
  { module: "@/components/abox/data-table", symbols: ["DataTable", "Column"] },
  { module: "@/components/abox/empty-state", symbols: ["EmptyState"] },
  { module: "@/components/abox/surface", symbols: ["Surface", "surfaceClass"] },
  { module: "@/components/abox/control", symbols: ["controlClass"] },
  { module: "@/components/abox/field", symbols: ["LabeledField"] },
  { module: "@/components/abox/notice-page", symbols: ["NoticePage"] },
  { module: "@/components/abox/marketplace-page-layout", symbols: ["MARKETPLACE_PAGE_LAYOUT"] },
  {
    module: "@/components/abox/motion",
    symbols: ["FadeRise", "Stagger", "StaggerItem", "CountUp"],
  },
  { module: "@/components/abox/logo", symbols: ["AboxMark", "AboxWordmark"] },
];

const CANONICAL_NAMES = new Map();
for (const src of CANONICAL_SOURCES) {
  for (const s of src.symbols) CANONICAL_NAMES.set(s, src.module);
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const entry of fs
    .readdirSync(abs, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const isReference = (file) => REFERENCE_PATHS.some((p) => file === p || file.startsWith(p));
const independentSystem = (file) =>
  INDEPENDENT_SYSTEMS.find((s) => file.startsWith(s.prefix))?.label ?? null;

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function finding(o) {
  return {
    rule: o.rule,
    file: o.file,
    line: o.line ?? null,
    type: o.type,
    canonicalOwner: o.canonicalOwner ?? null,
    exception: o.exception ?? null,
    reason: o.reason,
    futureAction: o.futureAction,
    category: o.category,
  };
}

// --------------------------------------------------------------------------
// E5 — raw colour literal drift (classification only, never a verdict)
// --------------------------------------------------------------------------

const COLOUR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/g;

function analyzeE5(files) {
  const out = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    COLOUR_RE.lastIndex = 0;
    let m;
    while ((m = COLOUR_RE.exec(text))) {
      const line = lineOf(text, m.index);
      const lineText = text.split("\n")[line - 1] ?? "";
      const literal = m[0];
      let type,
        reason,
        exception = null,
        futureAction = "monitor",
        category = "classified";

      const allow = E5_ALLOWLIST.find((a) => a.file === file && lineText.includes(a.match));
      if (isReference(file)) {
        type = "reference-content";
        reason = "Reference/design material is documentation-only; not a production finding.";
        futureAction = "no-action";
      } else if (file.startsWith("src/components/ui/")) {
        type = "library-owned";
        reason = "Vendored shadcn/Radix source; library-owned.";
        futureAction = "no-action";
      } else if (allow) {
        type = "documented-exception";
        exception = "documented-exception";
        reason = allow.reason;
        futureAction = "no-action";
      } else if (/primary_color|accent_color|brand\./.test(lineText)) {
        type = "runtime-branding";
        reason = "Value originates from the runtime Brand record; runtime-owned.";
        futureAction = "no-action";
      } else if (/var\(--/.test(lineText)) {
        type = "token-usage";
        reason = "Literal appears alongside a design-token reference.";
        futureAction = "no-action";
      } else {
        type = "review-required";
        reason =
          "Unclassified colour literal outside styles.css; human review required. Not a violation.";
        futureAction = "review-required";
        category = "candidate-drift";
      }

      out.push(
        finding({
          rule: "E5",
          file,
          line,
          type,
          exception,
          reason,
          futureAction,
          category: `${category}:${literal}`,
        }),
      );
    }
  }
  return out;
}

// --------------------------------------------------------------------------
// E6 — canonical consumer counts (two counting units, never merged)
// --------------------------------------------------------------------------

function analyzeE6(files) {
  const table = new Map();
  for (const src of CANONICAL_SOURCES) {
    for (const s of src.symbols) {
      table.set(`${src.module}#${s}`, {
        module: src.module,
        symbol: s,
        importerFiles: [],
        usageSites: 0,
        typeOnlyImporters: [],
        referenceImporters: [],
        reExports: [],
      });
    }
  }

  for (const file of files) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const stmt of sf.statements) {
      const spec =
        ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt)
          ? stmt.moduleSpecifier
          : undefined;
      if (!spec || !ts.isStringLiteral(spec)) continue;
      const src = CANONICAL_SOURCES.find((c) => c.module === spec.text);
      if (!src) continue;

      if (ts.isExportDeclaration(stmt)) {
        for (const s of src.symbols) table.get(`${src.module}#${s}`)?.reExports.push(file);
        continue;
      }
      const clause = stmt.importClause;
      if (!clause?.namedBindings || !ts.isNamedImports(clause.namedBindings)) continue;
      for (const el of clause.namedBindings.elements) {
        const canonical = (el.propertyName ?? el.name).text;
        const local = el.name.text;
        const rec = table.get(`${src.module}#${canonical}`);
        if (!rec) continue;
        const typeOnly = clause.isTypeOnly || el.isTypeOnly;
        if (isReference(file)) {
          if (!rec.referenceImporters.includes(file)) rec.referenceImporters.push(file);
        } else {
          if (!rec.importerFiles.includes(file)) rec.importerFiles.push(file);
          if (typeOnly && !rec.typeOnlyImporters.includes(file)) rec.typeOnlyImporters.push(file);
          const uses = text.match(new RegExp(`\\b${local}\\b`, "g"))?.length ?? 0;
          rec.usageSites += Math.max(0, uses - 1); // subtract the import specifier itself
        }
      }
    }
  }

  const out = [];
  for (const rec of [...table.values()].sort((a, b) =>
    a.module + a.symbol < b.module + b.symbol ? -1 : 1,
  )) {
    const sys = INDEPENDENT_SYSTEMS.filter((s) =>
      rec.importerFiles.some((f) => f.startsWith(s.prefix)),
    ).map((s) => s.label);
    out.push(
      finding({
        rule: "E6",
        file: rec.module,
        type: "canonical-consumer-count",
        canonicalOwner: rec.module,
        reason:
          `symbol=${rec.symbol}; importerFiles=${rec.importerFiles.length}; usageSites=${rec.usageSites}; ` +
          `typeOnlyImporters=${rec.typeOnlyImporters.length}; referenceImporters=${rec.referenceImporters.length}; ` +
          `reExports=${rec.reExports.length}; independentSystems=${sys.length ? sys.join(", ") : "none"}. ` +
          "importerFiles and usageSites are distinct counting units; neither corrects the other.",
        futureAction: "no-action",
        category: "inventory",
      }),
    );
  }
  return out;
}

// --------------------------------------------------------------------------
// E7 — duplicate canonical definitions (exact exported names only)
// --------------------------------------------------------------------------

function exportedNames(file, text) {
  const names = [];
  let sf;
  try {
    sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  } catch {
    return null;
  }
  for (const stmt of sf.statements) {
    const mods = ts.canHaveModifiers(stmt) ? (ts.getModifiers(stmt) ?? []) : [];
    if (!mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    if (
      ts.isFunctionDeclaration(stmt) ||
      ts.isClassDeclaration(stmt) ||
      ts.isInterfaceDeclaration(stmt) ||
      ts.isTypeAliasDeclaration(stmt)
    ) {
      if (stmt.name) names.push({ name: stmt.name.text, line: lineOf(text, stmt.getStart(sf)) });
    } else if (ts.isVariableStatement(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        if (ts.isIdentifier(d.name))
          names.push({ name: d.name.text, line: lineOf(text, d.getStart(sf)) });
      }
    }
  }
  return names;
}

function classifyDefinition(file) {
  if (isReference(file))
    return { type: "documented-exception", reason: "Reference/design layer definition." };
  const sys = independentSystem(file);
  if (sys)
    return { type: "documented-exception", reason: `Intentionally independent system: ${sys}.` };
  if (file.startsWith("src/routes/"))
    return { type: "route-local-implementation", reason: "Declared inside a route module." };
  return {
    type: "review-required",
    reason: "Definition shares a canonical export name; human review required. Not a violation.",
  };
}

function analyzeE7(files) {
  const byName = new Map();
  const out = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    const names = exportedNames(file, text);
    if (names === null) {
      out.push(
        finding({
          rule: "E7",
          file,
          type: "parse-skipped",
          reason: "File could not be parsed; reported rather than guessed at.",
          futureAction: "review-required",
          category: "parse",
        }),
      );
      continue;
    }
    for (const n of names) {
      if (!byName.has(n.name)) byName.set(n.name, []);
      byName.get(n.name).push({ file, line: n.line });
    }
  }

  for (const [name, sites] of [...byName.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const canonicalOwner = CANONICAL_NAMES.get(name) ?? null;
    const duplicate = sites.length > 1;
    const shadowsCanonical =
      canonicalOwner &&
      sites.some((s) => !canonicalOwner.endsWith(path.basename(s.file).replace(/\.(ts|tsx)$/, "")));
    if (!duplicate && !shadowsCanonical) continue;
    for (const site of sites.sort((a, b) => (a.file < b.file ? -1 : 1))) {
      const owns =
        canonicalOwner &&
        canonicalOwner.endsWith(path.basename(site.file).replace(/\.(ts|tsx)$/, ""));
      if (owns) continue;
      const c = classifyDefinition(site.file);
      out.push(
        finding({
          rule: "E7",
          file: site.file,
          line: site.line,
          type: canonicalOwner
            ? `canonical-name-collision:${name}`
            : `duplicate-export-name:${name}`,
          canonicalOwner,
          exception: c.type === "documented-exception" ? "documented-exception" : null,
          reason: `${c.reason} Detection is exact-name based only; no similarity heuristic was used.`,
          futureAction: c.type === "review-required" ? "review-required" : "no-action",
          category: c.type,
        }),
      );
    }
  }
  return out;
}

// --------------------------------------------------------------------------
// Report emission
// --------------------------------------------------------------------------

const files = SCAN_DIRS.flatMap(walk).sort();
const findings = [...analyzeE5(files), ...analyzeE6(files), ...analyzeE7(files)].sort((a, b) => {
  if (a.rule !== b.rule) return a.rule < b.rule ? -1 : 1;
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  return (a.line ?? 0) - (b.line ?? 0);
});

fs.writeFileSync(path.join(ROOT, OUT_JSON), JSON.stringify(findings, null, 2) + "\n");

const md = [];
md.push("# Governance report (Phase 47, Batch C — REPORT ONLY)");
md.push("");
md.push(
  "Generated by `scripts/governance-report.mjs`. Deterministic: identical repository state produces byte-identical output.",
);
md.push(
  "No finding in this report authorises a migration, an import change, a component replacement, or any enforcement.",
);
md.push("No numeric score or ranking is assigned.");
md.push("");
for (const rule of ["E5", "E6", "E7"]) {
  const group = findings.filter((f) => f.rule === rule);
  const title = {
    E5: "E5 — raw colour literal classification",
    E6: "E6 — canonical consumer counts (two counting units)",
    E7: "E7 — duplicate / colliding canonical definitions",
  }[rule];
  md.push(`## ${title}`);
  md.push("");
  md.push(`Findings: ${group.length}`);
  md.push("");
  md.push("| File | Line | Type | Canonical owner | Exception | Future action | Reason |");
  md.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const f of group) {
    md.push(
      `| ${f.file} | ${f.line ?? ""} | ${f.type} | ${f.canonicalOwner ?? ""} | ${f.exception ?? ""} | ${f.futureAction} | ${f.reason} |`,
    );
  }
  md.push("");
}
fs.writeFileSync(path.join(ROOT, OUT_MD), md.join("\n"));

console.log(`governance report: ${findings.length} findings -> ${OUT_JSON}, ${OUT_MD}`);
