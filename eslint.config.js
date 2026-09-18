import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// --- Governance Batch A (Phase 45): static import & ownership boundaries -----
// Each entry protects one exact invariant. These rules freeze the current,
// already-compliant state; they never inspect classes, DOM, or visual similarity.

const SERVER_ONLY_PATHS = [
  {
    name: "server-only",
    message:
      "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
  },
];

// E1 — reference/design layers are documentation-only.
const REFERENCE_LAYER_PATTERNS = [
  {
    group: [
      "@/lib/design",
      "@/lib/design/*",
      "@/lib/design-tokens",
      "@/components/design",
      "@/components/design/*",
    ],
    message:
      "Reference/design layers (src/lib/design/**, src/lib/design-tokens.ts, src/components/design/**) are documentation-only. Production code must not import them.",
  },
];

// E2 — DataTable is the only ABox table source; no pagination system exists.
const UNCONSUMED_PRIMITIVE_PATTERNS = [
  {
    group: ["@/components/ui/table", "@/components/ui/pagination"],
    message:
      "src/components/abox/data-table.tsx is the only table source and no pagination system exists in production. Adopting these shadcn primitives requires an explicitly approved phase.",
  },
];

// E3 — reference/design material must not depend on runtime branding ownership.
const RUNTIME_BRANDING_PATTERNS = [
  {
    group: [
      "@/lib/marketplace-store",
      "@/routes/marketplace.admin.*",
      "**/lib/marketplace-store",
      "**/marketplace.admin.*",
    ],
    message:
      "Reference/design material is documentation-only. Runtime branding (the Brand record, getActiveBrand/getDraftBrand) and Marketplace Asset Management are production-owned and must not be imported here.",
  },
];

// E4 — the three shells are intentionally independent and must never merge.
const shellRestriction = (siblings) => [
  {
    group: siblings,
    message:
      "The three shells (InternalShell, MarketplaceShell, MemberShell) are intentionally independent. A shell must not import another shell; do not merge them or introduce a universal shell.",
  },
];

const shellOverride = (file, siblings) => ({
  files: [file],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: SERVER_ONLY_PATHS,
        patterns: [
          ...REFERENCE_LAYER_PATTERNS,
          ...UNCONSUMED_PRIMITIVE_PATTERNS,
          ...shellRestriction(siblings),
        ],
      },
    ],
  },
});

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: SERVER_ONLY_PATHS,
          patterns: [...REFERENCE_LAYER_PATTERNS, ...UNCONSUMED_PRIMITIVE_PATTERNS],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // Documented reference surfaces: E1 does not apply (E2 still does).
  {
    files: [
      "src/routes/design-system.tsx",
      "src/routes/design-guide.tsx",
      "src/components/design/**/*.{ts,tsx}",
      "src/lib/design/**/*.{ts,tsx}",
      "src/lib/design-tokens.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: SERVER_ONLY_PATHS,
          patterns: [...UNCONSUMED_PRIMITIVE_PATTERNS],
        },
      ],
    },
  },
  shellOverride("src/components/abox/internal-shell.tsx", [
    "./marketplace-shell",
    "./member-shell",
    "@/components/abox/marketplace-shell",
    "@/components/abox/member-shell",
  ]),
  shellOverride("src/components/abox/marketplace-shell.tsx", [
    "./internal-shell",
    "./member-shell",
    "@/components/abox/internal-shell",
    "@/components/abox/member-shell",
  ]),
  shellOverride("src/components/abox/member-shell.tsx", [
    "./internal-shell",
    "./marketplace-shell",
    "@/components/abox/internal-shell",
    "@/components/abox/marketplace-shell",
  ]),
  eslintPluginPrettier,
);
