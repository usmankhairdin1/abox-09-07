/**
 * Internal Design System reference — /design-system (unlisted).
 *
 * A live technical mirror of the implementation: every token value is read
 * from `src/styles.css` at runtime and every example renders the actual
 * production component. Nothing here is a demo copy, and nothing here is
 * linked from the application navigation.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Search,
  Plus,
  ArrowRight,
  Check,
  AlertTriangle,
  ShieldCheck,
  Users,
  Building2,
  ShoppingCart,
  Store,
  FileText,
  Settings,
  Bell,
  Eye,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { PageHeader } from "@/components/abox/page-header";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { MetalBadge } from "@/components/abox/metal-badge";
import { CarrierMark } from "@/components/abox/carrier-mark";
import { PlanCard } from "@/components/abox/plan-card";
import { EmptyState } from "@/components/abox/empty-state";
import { DataTable } from "@/components/abox/data-table";
import { AboxMark, AboxWordmark } from "@/components/abox/logo";
import { OverflowText } from "@/components/abox/overflow-text";
import { ACTION_PILL } from "@/components/abox/action-pill";

import { SAMPLE_PLANS, type SamplePlan } from "@/lib/sample-data";
import { SHOP_PRODUCTS } from "@/lib/products";
import {
  COLOR_GROUPS,
  METAL_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  SPACING_STEPS,
  TYPOGRAPHY_SPECIMENS,
} from "@/lib/design-tokens";
import {
  RefBlock,
  RefContainer,
  RefPage,
  RefSection,
  RefStage,
  RefToc,
  Swatch,
  SwatchGrid,
  useTokenValue,
  FoundationTable,
  RelationshipTable,
  InventoryTable,
  DefinitionRows,
  MaturityCallout,
  MetaChip,
  SpacingTable,
  ContainerTable,
  ResponsiveTable,
  DensityTable,
  DimensionTable,
  LayoutPatternList,
  RuleList,
  IconTable,
  AssetTable,
  ComponentTable,
  AnatomyList,
  VariantTable,
  ComponentStateTable,
  ArchLayerList,
  CanonicalMapTable,
  CriteriaTable,
  BlueprintTable,
  ArchRelationshipTable,
  OverlapList,
  KitTable,
  ShellTable,
  NamingTable,
  FigmaSectionTable,
  FigmaVariableTable,
  MigrationList,
  ExperienceArchTable,
  TokenSpecTable,
  RoleChainTable,
  ComponentRoleList,
  FoundationA11yTable,
  FoundationMaturityTable,
  ComponentSpecCard,
  SpecMatrixTable,
  DuplicateRegisterTable,
  ArchLabelChip,
  DependencyChainList,
  TraceabilityCard,
  ImpactTable,
} from "@/components/design/reference-kit";

import { SPEC_REGISTRY, SPEC_SUMMARY, SPEC_LABEL_COUNTS } from "@/lib/design/spec-registry";
import { ANATOMY_VOCABULARY, ANATOMY_RULES } from "@/lib/design/spec-anatomy";
import { PROPERTY_CLASSES, PROPERTY_RULES } from "@/lib/design/spec-properties";
import { VARIANT_KINDS, VARIANT_GOVERNANCE } from "@/lib/design/spec-variants";
import { STATE_VOCABULARY, STATE_GOVERNANCE } from "@/lib/design/spec-states";
import {
  CONTROL_SIZE_EVIDENCE,
  DENSITY_MODES as SPEC_DENSITY_MODES,
  SIZING_GOVERNANCE,
} from "@/lib/design/spec-sizing";
import { ICON_BEHAVIOR, ICON_GOVERNANCE } from "@/lib/design/spec-icons";
import { COMPOSITION_RULES, RELATIONSHIP_RULES } from "@/lib/design/spec-composition";
import { DEPENDENCY_CHAINS, DEPENDENCY_GOVERNANCE } from "@/lib/design/spec-dependencies";
import { DUPLICATE_REGISTER } from "@/lib/design/spec-duplicates";
import { ROUTE_KITS, KIT_ARCHITECTURE } from "@/lib/design/spec-route-kits";
import { EXPERIENCE_BOUNDARIES, EXPERIENCE_RULES } from "@/lib/design/spec-experience";
import { CATEGORY_ACCESSIBILITY, A11Y_CROSS_RULES } from "@/lib/design/spec-accessibility";
import { CONTENT_RULES } from "@/lib/design/spec-content";
import {
  FIGMA_LIBRARY_BLUEPRINT as SPEC_FIGMA_LIBRARY,
  FIGMA_LIMITS,
} from "@/lib/design/spec-figma-library";
import { FIGMA_COMPONENT_MAPPINGS, FIGMA_MAPPING_RULES } from "@/lib/design/spec-figma-mapping";
import {
  NAMING_CONVENTIONS as SPEC_NAMING_CONVENTIONS,
  NAMING_RULES_NOTES,
} from "@/lib/design/spec-naming";
import {
  MATURITY_CATEGORIES,
  DOCUMENTATION_TEMPLATE,
  SPEC_GOVERNANCE_RULES,
  OPEN_DECISIONS,
} from "@/lib/design/spec-governance";

import {
  GRAPH_LAYERS,
  GRAPH_NODES,
  GRAPH_EDGES,
  GRAPH_SUMMARY,
  EDGE_STATUS_COUNTS,
  STATUS_LEGEND,
  TRACED_CHAINS,
  IMPACT_MODEL,
  nodeName,
} from "@/lib/design/graph-registry";
import { CONSUMER_GRAPH } from "@/lib/design/graph-components";
import { SCREEN_TRACEABILITY } from "@/lib/design/graph-screens";
import { DUPLICATE_MAPPINGS, DUPLICATE_GRAPH_RULES } from "@/lib/design/graph-duplicates";
import { KIT_ARCHITECTURE_RULES } from "@/lib/design/graph-kits";
import { BRAND_BOUNDARY, OWNERSHIP_MODEL } from "@/lib/design/graph-brand-boundary";
import { ACCESSIBILITY_TRACES } from "@/lib/design/graph-accessibility";
import { RESPONSIVE_OWNERSHIP, RESPONSIVE_TRACES } from "@/lib/design/graph-responsive";
import { TYPOGRAPHY_TRACES } from "@/lib/design/graph-typography";
import { SPACING_TRACES } from "@/lib/design/graph-spacing";
import { FIGMA_TRACES, FIGMA_GRAPH_RULES } from "@/lib/design/graph-figma";
import {
  PROPAGATION_RULES,
  MIGRATION_STAGES,
  MIGRATION_BOUNDARY,
} from "@/lib/design/graph-governance";
import { SHARED_VERSUS_SPECIFIC } from "@/lib/design/graph-experiences";

import {
  PATTERN_TAXONOMY,
  PATTERN_SUMMARY,
  PATTERN_DOSSIERS,
  REGISTRY_INTEGRITY,
  REGISTRY_RULES,
} from "@/lib/design/pattern-registry";
import { PATTERN_ANATOMY } from "@/lib/design/pattern-anatomy";
import { PATTERN_COMPOSITION, COMPOSITION_RULES as PATTERN_COMPOSITION_RULES } from "@/lib/design/pattern-composition";
import { PATTERN_VARIANTS } from "@/lib/design/pattern-variants";
import { PATTERN_STATES } from "@/lib/design/pattern-states";
import { PATTERN_RESPONSIVE, RESPONSIVE_PATTERN_NOTES } from "@/lib/design/pattern-responsive";
import { PATTERN_DENSITY, DENSITY_OPEN_QUESTIONS } from "@/lib/design/pattern-density";
import { EXPERIENCE_PATTERNS } from "@/lib/design/experience-patterns";
import { EXPERIENCE_EXTENSIONS, EXTENSION_RULES } from "@/lib/design/experience-extensions";
import { SCREEN_PATTERN_MAP, SCREEN_MAP_RULES, chainForScreen } from "@/lib/design/screen-pattern-map";
import { PATTERN_DUPLICATES, DUPLICATE_HANDLING_RULES } from "@/lib/design/pattern-duplicates";
import {
  PATTERN_DEFINITION_RULES,
  CANONICALIZATION_EVIDENCE,
  PATTERN_OWNERSHIP_RULES,
  PATTERN_DOCUMENTATION_DUTIES,
  APPROVAL_GATE,
} from "@/lib/design/pattern-governance";
import { PATTERN_FIGMA_MAPPINGS, FIGMA_PATTERN_RULES } from "@/lib/design/pattern-figma";

import { FOUNDATION_MODEL, FOUNDATION_CURRENT_STATE } from "@/lib/design/foundation-model";
import { COLOR_FOUNDATION, COLOR_TOKEN_COUNT } from "@/lib/design/color-foundation";
import { COLOR_ROLE_CHAINS, COLOR_ROLE_OVERLAPS, THEME_MODE_MAP } from "@/lib/design/color-roles";
import {
  TONE_VOCABULARY,
  TONE_OVERLAPS,
  TIER_FOUNDATION,
  TIER_GOVERNANCE,
} from "@/lib/design/status-tone";
import {
  TYPE_FAMILY_SPEC,
  TYPE_WEIGHT_SPEC,
  TYPE_SIZE_SPEC,
  TYPE_RHYTHM_SPEC,
  TYPE_ROLE_SPEC,
  RESPONSIVE_TYPE_SPEC,
} from "@/lib/design/typography-foundation";
import { SPACING_SCALE_SPEC, SPACING_RELATIONSHIP_SPEC } from "@/lib/design/spacing-foundation";
import { CONTAINER_SPEC, BREAKPOINT_SPEC, SHAPE_SPEC } from "@/lib/design/layout-foundation";
import {
  ICON_FOUNDATION_SPEC,
  MOTION_FOUNDATION_SPEC,
  DENSITY_FOUNDATION_SPEC,
} from "@/lib/design/icon-motion-density";
import { COMPONENT_FOUNDATION_ROLES } from "@/lib/design/component-roles";
import { TOKEN_NAMING_RULES, PRIMITIVE_SEMANTIC_MAP } from "@/lib/design/token-naming";
import { FIGMA_VARIABLE_MAP } from "@/lib/design/figma-variables";
import { FOUNDATION_ACCESSIBILITY } from "@/lib/design/foundation-accessibility";
import { FOUNDATION_BOUNDARIES } from "@/lib/design/foundation-boundaries";
import { FOUNDATION_EXPERIENCE_GUIDANCE } from "@/lib/design/foundation-experience";
import {
  FOUNDATION_MATURITY,
  FOUNDATION_GOVERNANCE_RULES,
} from "@/lib/design/foundation-governance";

import {
  COMPONENT_TAXONOMY,
  COMPONENT_GROUPS,
  CONSUMER_MAP,
  COMPONENT_ANATOMY,
  COMPOSITION_CLASSIFICATION,
  DUPLICATION_FINDINGS,
  UNUSED_FINDINGS,
  COMPONENT_MATURITY,
} from "@/lib/design/components";
import { COMPONENT_VARIANTS, COMPONENT_SIZES } from "@/lib/design/component-variants";
import {
  COMPONENT_STATES,
  COMPONENT_RESPONSIVE,
  COMPONENT_ACCESSIBILITY,
} from "@/lib/design/component-states";
import {
  COMPONENT_COMPOSITION,
  COMPONENT_TYPOGRAPHY_CROSSREF,
  COMPONENT_SPACING_CROSSREF,
  COMPONENT_ICON_CROSSREF,
  COMPONENT_EXPERIENCE_SPLIT,
} from "@/lib/design/component-relationships";
import { FOUNDATION } from "@/lib/design/foundation";
import { SPACING_RELATIONSHIPS, TYPOGRAPHY_RELATIONSHIPS } from "@/lib/design/relationships";
import { COMPONENT_INVENTORY, PATTERN_INVENTORY, STATE_INVENTORY } from "@/lib/design/inventory";
import { SPACING_GROUPS } from "@/lib/design/spacing";
import {
  CONTAINERS,
  DIMENSIONS,
  GRID_FLEX_RELATIONSHIPS,
  LAYOUT_PATTERNS,
} from "@/lib/design/layout";
import {
  DENSITY_MODES,
  RESPONSIVE_PATTERNS,
  STRUCTURAL_RELATIONSHIPS,
} from "@/lib/design/spatial-relationships";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  TYPE_SCALE,
  LINE_HEIGHT_AND_TRACKING,
  TYPOGRAPHY_UTILITIES,
  SEMANTIC_TYPOGRAPHY,
  NUMERIC_TYPOGRAPHY,
} from "@/lib/design/typography";
import {
  ICON_SOURCES,
  ICON_CATEGORIES,
  ICON_SIZES,
  ICON_TREATMENT,
} from "@/lib/design/iconography";
import {
  ICON_ACCESSIBILITY,
  ICON_STATES,
  ICON_RELATIONSHIPS,
  ICON_EXPERIENCES,
} from "@/lib/design/iconography-behavior";
import {
  BRAND_ASSETS,
  MEDIA_ASSETS,
  ASSET_ORGANIZATION,
  ASSET_BEHAVIOR,
  ASSET_UNUSED_FINDINGS,
  ASSET_OWNERSHIP,
  ICON_ASSET_MATURITY,
  ICON_ASSET_DEFERRED,
  FIGMA_ICON_ASSET_MAPPING,
} from "@/lib/design/assets";
import {
  RESPONSIVE_TYPOGRAPHY,
  TYPOGRAPHY_STATES,
  TEXT_BEHAVIOR,
  READABILITY_CONVENTIONS,
  COMPONENT_TYPOGRAPHY,
} from "@/lib/design/typography-behavior";
import {
  OWNERSHIP_HIERARCHY,
  SAFE_CHANGE_RULES,
  INTENTIONAL_ONE_OFFS,
  DEFERRED_OPPORTUNITIES,
  EXPERIENCES,
  FIGMA_MAPPING,
  FIGMA_LAYOUT_MAPPING,
  LAYOUT_GOVERNANCE_RULES,
  LAYOUT_DEFERRED_OPPORTUNITIES,
  LAYOUT_UNOWNED_AREAS,
  FIGMA_TYPOGRAPHY_MAPPING,
  TYPOGRAPHY_GOVERNANCE_RULES,
  TYPOGRAPHY_MATURITY,
  TYPOGRAPHY_UNOWNED_AREAS,
  TYPOGRAPHY_DEFERRED_OPPORTUNITIES,
  COMPONENT_GOVERNANCE_RULES,
  COMPONENT_UNOWNED_AREAS,
  COMPONENT_DEFERRED_OPPORTUNITIES,
  FIGMA_COMPONENT_MAPPING,
  FUTURE_FIGMA_ORGANIZATION,
  ARCHITECTURE_GOVERNANCE_RULES,
  CHANGE_PROPAGATION_MODEL,
  EXPERIENCE_ARCHITECTURE,
} from "@/lib/design/governance";
import {
  CORE_ARCHITECTURE,
  COMPONENT_HIERARCHY,
  DEPENDENCY_RULES,
  CROSS_PHASE_TRACEABILITY,
} from "@/lib/design/architecture";
import { CLASSIFICATION_CRITERIA, CLASSIFICATION_RESULTS } from "@/lib/design/classification";
import { CANONICAL_COMPONENT_MAP, CANONICAL_SUMMARY } from "@/lib/design/canonical-components";
import { ALL_BLUEPRINTS } from "@/lib/design/blueprints";
import {
  ARCH_RELATIONSHIPS,
  DEPENDENCY_MODEL,
  LITERAL_VALUE_FINDINGS,
} from "@/lib/design/architecture-relationships";
import {
  OVERLAP_MAP,
  ROUTE_LOCAL_KITS,
  SHELL_ARCHITECTURE,
  SHELL_SHARED_CONCERNS,
  MIGRATION_ROADMAP,
  OPEN_FUTURE_DECISIONS,
} from "@/lib/design/normalization";
import {
  BRAND_ARCHITECTURE,
  ASSET_ARCHITECTURE,
  ASSET_OWNERSHIP_RULES,
} from "@/lib/design/brand-asset-architecture";
import { NAMING_CONVENTIONS } from "@/lib/design/naming";
import { FIGMA_LIBRARY_BLUEPRINT, FIGMA_VARIABLE_MAPPINGS } from "@/lib/design/figma-library";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "ABox Design System — Live Component Reference" },
      {
        name: "description",
        content:
          "Live technical reference for ABox design tokens, UI primitives and production components.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "ABox Design System — Live Component Reference" },
      {
        property: "og:description",
        content:
          "Live technical reference for ABox design tokens, UI primitives and production components.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystemPage,
});

const TOC = [
  { id: "tokens", label: "Tokens" },
  { id: "metal", label: "Metal tiers" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius & shadow" },
  { id: "icons", label: "Icons" },
  { id: "primitives", label: "UI primitives" },
  { id: "abox", label: "ABox components" },
  { id: "states", label: "States" },
  { id: "patterns", label: "Patterns" },
  { id: "foundation-audit", label: "Foundation audit" },
  { id: "spacing-relationships", label: "Spacing relationships" },
  { id: "type-relationships", label: "Type relationships" },
  { id: "component-inventory", label: "Component inventory" },
  { id: "state-inventory", label: "State inventory" },
  { id: "pattern-inventory", label: "Pattern inventory" },
  { id: "spacing-audit", label: "Spacing audit" },
  { id: "layout-containers", label: "Containers" },
  { id: "layout-structure", label: "Grid & structure" },
  { id: "responsive-audit", label: "Responsive" },
  { id: "density-audit", label: "Density" },
  { id: "dimensions-audit", label: "Dimensions" },
  { id: "layout-patterns", label: "Layout patterns" },
  { id: "governance", label: "Governance" },
  { id: "layout-governance", label: "Layout governance" },
  { id: "type-families", label: "Font families" },
  { id: "type-scale-audit", label: "Type scale" },
  { id: "type-utilities", label: "Type utilities" },
  { id: "type-semantic", label: "Semantic type" },
  { id: "type-responsive", label: "Responsive type" },
  { id: "type-components", label: "Component type" },
  { id: "type-states", label: "Type states" },
  { id: "type-data", label: "Numeric & data type" },
  { id: "type-readability", label: "Readability" },
  { id: "type-governance", label: "Type governance" },
  { id: "icon-sources", label: "Icon sources" },
  { id: "icon-inventory", label: "Icon inventory" },
  { id: "icon-sizes", label: "Icon sizes" },
  { id: "icon-treatment", label: "Icon treatment" },
  { id: "icon-a11y", label: "Icon accessibility" },
  { id: "icon-states", label: "Icon states" },
  { id: "icon-relationships", label: "Icon relationships" },
  { id: "brand-assets", label: "Logos & marks" },
  { id: "media-assets", label: "Imagery & media" },
  { id: "asset-organization", label: "Asset organization" },
  { id: "asset-behavior", label: "Asset behaviour" },
  { id: "icon-experiences", label: "Icon by experience" },
  { id: "asset-governance", label: "Asset governance" },
  { id: "experiences", label: "Experiences" },
  { id: "figma", label: "Figma mapping" },
  { id: "component-taxonomy", label: "Component taxonomy" },
  { id: "component-source-inventory", label: "Component inventory (full)" },
  { id: "component-consumers", label: "Consumer map" },
  { id: "component-experience", label: "Shared vs experience" },
  { id: "component-anatomy", label: "Anatomy" },
  { id: "component-variants", label: "Variants" },
  { id: "component-sizes", label: "Sizes" },
  { id: "component-state-audit", label: "Component states" },
  { id: "component-responsive", label: "Component responsive" },
  { id: "component-composition", label: "Composition relationships" },
  { id: "component-classification", label: "Composition vs component" },
  { id: "component-duplication", label: "Duplicates & overlap" },
  { id: "component-unused", label: "Installed but unused" },
  { id: "component-a11y", label: "Component accessibility" },
  { id: "component-crossref", label: "Type / space / icon cross-ref" },
  { id: "component-maturity", label: "Component maturity" },
  { id: "component-governance", label: "Component governance" },
  { id: "component-figma", label: "Figma components" },
  { id: "future-figma-library", label: "Future Figma library" },
  { id: "arch-core", label: "ABox Core architecture" },
  { id: "arch-hierarchy", label: "Component hierarchy" },
  { id: "arch-classification", label: "Component vs pattern" },
  { id: "arch-canonical", label: "Canonical component map" },
  { id: "arch-blueprints", label: "Structural blueprints" },
  { id: "arch-dependencies", label: "Dependency model" },
  { id: "arch-relationships", label: "Architecture relationships" },
  { id: "arch-overlap", label: "Duplicate & overlap map" },
  { id: "arch-kits", label: "Route-local kit architecture" },
  { id: "arch-shells", label: "Shell architecture" },
  { id: "arch-brand", label: "Brand & asset architecture" },
  { id: "arch-naming", label: "Naming conventions" },
  { id: "arch-figma-library", label: "Figma library blueprint" },
  { id: "arch-figma-variables", label: "Figma variable mapping" },
  { id: "arch-experiences", label: "Experience architecture" },
  { id: "arch-governance", label: "Architecture governance" },
  { id: "arch-migration", label: "Migration roadmap" },
  { id: "arch-traceability", label: "Cross-phase traceability" },
  { id: "fnd-model", label: "Foundation model" },
  { id: "fnd-color", label: "Colour foundation" },
  { id: "fnd-color-roles", label: "Colour role chains" },
  { id: "fnd-theme", label: "Theme modes" },
  { id: "fnd-tone", label: "Status tone vocabulary" },
  { id: "fnd-tier", label: "Tier foundation" },
  { id: "fnd-type", label: "Typography foundation" },
  { id: "fnd-space", label: "Spacing foundation" },
  { id: "fnd-layout", label: "Layout & shape foundation" },
  { id: "fnd-icon-motion", label: "Icon, motion & density" },
  { id: "fnd-component-roles", label: "Component foundation roles" },
  { id: "fnd-naming", label: "Token naming system" },
  { id: "fnd-map", label: "Primitive → semantic map" },
  { id: "fnd-figma", label: "Figma variable mapping" },
  { id: "fnd-a11y", label: "Foundation accessibility" },
  { id: "fnd-boundaries", label: "Ownership boundaries" },
  { id: "fnd-experience", label: "Experience expression" },
  { id: "fnd-maturity", label: "Foundation maturity" },
  { id: "fnd-governance", label: "Foundation governance" },
  { id: "spec-overview", label: "ABox Core specification" },
  { id: "spec-anatomy", label: "Anatomy vocabulary" },
  { id: "spec-properties", label: "Property model" },
  { id: "spec-variants", label: "Variant governance" },
  { id: "spec-states", label: "State vocabulary" },
  { id: "spec-sizing", label: "Size & density" },
  { id: "spec-icons", label: "Icon behavior" },
  { id: "spec-actions", label: "Spec: Actions" },
  { id: "spec-forms", label: "Spec: Forms" },
  { id: "spec-display", label: "Spec: Display" },
  { id: "spec-containers", label: "Spec: Containers" },
  { id: "spec-data", label: "Spec: Data" },
  { id: "spec-navigation", label: "Spec: Navigation" },
  { id: "spec-overlays", label: "Spec: Overlays" },
  { id: "spec-feedback", label: "Spec: Feedback" },
  { id: "spec-brand", label: "Spec: Brand" },
  { id: "spec-commerce", label: "Spec: Commerce" },
  { id: "spec-shell", label: "Spec: Shells" },
  { id: "spec-composition", label: "Composition & relationships" },
  { id: "spec-dependencies", label: "Dependency chains" },
  { id: "spec-duplicates", label: "Duplicate register" },
  { id: "spec-kits", label: "Route-local kits" },
  { id: "spec-experience", label: "Experience boundaries" },
  { id: "spec-a11y", label: "Accessibility by category" },
  { id: "spec-content", label: "Content & text behavior" },
  { id: "spec-figma-library", label: "Figma library blueprint" },
  { id: "spec-figma-mapping", label: "Figma property mapping" },
  { id: "spec-naming", label: "Naming governance" },
  { id: "spec-template", label: "Documentation template" },
  { id: "spec-governance", label: "Governance & maturity" },
  { id: "graph-model", label: "Integrated model" },
  { id: "graph-layers", label: "Dependency hierarchy" },
  { id: "graph-foundation", label: "Foundation to roles" },
  { id: "graph-roles", label: "Roles to components" },
  { id: "graph-compounds", label: "Components to compounds" },
  { id: "graph-patterns", label: "Compounds to patterns" },
  { id: "graph-experiences", label: "Patterns to experiences" },
  { id: "graph-screens", label: "Experiences to screens" },
  { id: "graph-chains", label: "Traced chains" },
  { id: "graph-traceability", label: "Screen traceability" },
  { id: "graph-consumers", label: "Consumer graph" },
  { id: "graph-duplicates", label: "Duplicates in the graph" },
  { id: "graph-kits", label: "Kits & shells" },
  { id: "graph-brand", label: "Brand & asset boundary" },
  { id: "graph-a11y", label: "Accessibility traceability" },
  { id: "graph-responsive", label: "Responsive traceability" },
  { id: "graph-type", label: "Typography traceability" },
  { id: "graph-space", label: "Spacing traceability" },
  { id: "graph-figma", label: "Figma traceability" },
  { id: "graph-impact", label: "Change impact" },
  { id: "graph-governance", label: "Change propagation" },
  { id: "graph-migration", label: "Migration boundary" },
  { id: "pat-taxonomy", label: "Pattern taxonomy" },
  { id: "pat-anatomy", label: "Pattern anatomy" },
  { id: "pat-composition", label: "Pattern composition" },
  { id: "pat-variants", label: "Pattern variants" },
  { id: "pat-states", label: "Pattern states" },
  { id: "pat-responsive", label: "Pattern responsive" },
  { id: "pat-density", label: "Pattern density" },
  { id: "pat-experience", label: "Experience patterns" },
  { id: "pat-extensions", label: "Experience extensions" },
  { id: "pat-screens", label: "Screen to pattern" },
  { id: "pat-duplicates", label: "Pattern duplicates" },
  { id: "pat-governance", label: "Pattern governance" },
  { id: "pat-figma", label: "Figma pattern blueprint" },
];

function DesignSystemPage() {
  const plan = SAMPLE_PLANS[0] as SamplePlan;
  return (
    <RefPage>
      <RefContainer className="py-10 md:py-14">
        <header className="mb-10">
          <p className="text-eyebrow mb-3">Internal reference · not in navigation</p>
          <h1 className="text-display text-3xl md:text-4xl">ABox Design System</h1>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
            The live implementation. Token values are read from the running stylesheet and every
            example below renders the same component the application ships. Source of truth:
            <span className="text-serial ml-1">src/styles.css</span>,
            <span className="text-serial ml-1">src/components/ui</span>,
            <span className="text-serial ml-1">src/components/abox</span>.
          </p>
        </header>

        <RefToc items={TOC} />

        <RefSection
          id="tokens"
          eyebrow="Layer 1"
          title="Design tokens"
          intro="All color decisions are CSS custom properties in src/styles.css, themed for light and dark. Components consume tokens, never literal colors."
        >
          {COLOR_GROUPS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.intro}>
              <SwatchGrid>
                {group.tokens.map((t) => (
                  <Swatch
                    key={t.name}
                    name={t.name}
                    label={t.label}
                    usage={t.usage}
                    foreground={t.foreground}
                  />
                ))}
              </SwatchGrid>
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="metal"
          eyebrow="Layer 1"
          title="Metal tiers"
          intro="Plan tiers are solid, token-backed colors with a paired foreground so text contrast holds in both themes. The MetalBadge component is the only consumer."
        >
          <SwatchGrid>
            {METAL_TOKENS.map((t) => (
              <Swatch
                key={t.name}
                name={t.name}
                label={t.label}
                usage={t.usage}
                foreground={t.foreground}
              />
            ))}
          </SwatchGrid>
          <RefStage className="mt-6">
            {METAL_TOKENS.map((t) => (
              <MetalBadge key={t.name} tier={t.label as SamplePlan["metalTier"]} />
            ))}
          </RefStage>
        </RefSection>

        <RefSection
          id="typography"
          eyebrow="Layer 1"
          title="Typography"
          intro="Two families: Bricolage Grotesque for display and headings, Inter Tight for everything else. The text-display, text-eyebrow and text-serial utilities carry the specialised styles."
        >
          <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-card">
            {TYPOGRAPHY_SPECIMENS.map((t) => (
              <div key={t.id} className="grid gap-2 p-5 md:grid-cols-[200px_1fr] md:items-baseline">
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.usage}</p>
                  <p className="text-serial mt-1">{t.className}</p>
                </div>
                <p className={t.className}>{t.sample}</p>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="spacing"
          eyebrow="Layer 1"
          title="Spacing"
          intro="A 4px base. These are the steps the application actually uses; anything outside the set is an exception, not a scale value."
        >
          <div className="space-y-2">
            {SPACING_STEPS.map((s) => (
              <div
                key={s.px}
                className="flex items-center gap-4 rounded-xl border border-hairline bg-card px-4 py-2.5"
              >
                <span className="w-16 text-sm font-medium tabular-nums">{s.px}px</span>
                <span className="w-16 text-xs text-muted-foreground tabular-nums">{s.rem}rem</span>
                <span
                  className="h-3 rounded-sm bg-primary"
                  style={{ width: `${s.px}px` }}
                  aria-hidden
                />
                <span className="text-xs text-muted-foreground">{s.usage}</span>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="radius"
          eyebrow="Layer 1"
          title="Radius & elevation"
          intro="Radius climbs with surface size. Shadows are cool navy-tinted and reserved for cards and overlays — no halos or glows on flat content."
        >
          <RefBlock title="Radius">
            <div className="flex flex-wrap gap-4">
              {RADIUS_TOKENS.map((r) => (
                <div key={r.name} className="w-40">
                  <div
                    className="flex h-20 items-center justify-center border border-hairline bg-surface"
                    style={{ borderRadius: `var(--${r.name})` }}
                  >
                    <RadiusValue name={r.name} />
                  </div>
                  <p className="mt-2 text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.usage}</p>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock title="Shadows">
            <div className="flex flex-wrap gap-6">
              {SHADOW_TOKENS.map((s) => (
                <div key={s.name} className="w-56">
                  <div
                    className="h-20 rounded-2xl border border-hairline bg-card"
                    style={{ boxShadow: `var(--${s.name})` }}
                  />
                  <p className="mt-3 text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.usage}</p>
                  <p className="text-serial mt-1">--{s.name}</p>
                </div>
              ))}
            </div>
          </RefBlock>
        </RefSection>

        <RefSection
          id="icons"
          eyebrow="Layer 1"
          title="Iconography"
          intro="Lucide is the icon library, at 16px inside controls and 20–24px for headers and feature tiles. Product icons come from the single catalogue in src/lib/products.ts; the dental symbol is Tabler's IconDental."
        >
          <RefBlock title="Sizes">
            <RefStage>
              {[14, 16, 20, 24, 28].map((s) => (
                <span key={s} className="flex flex-col items-center gap-1.5">
                  <ShieldCheck
                    style={{ width: s, height: s }}
                    className="text-primary"
                    aria-hidden
                  />
                  <span className="text-serial">{s}px</span>
                </span>
              ))}
            </RefStage>
          </RefBlock>
          <RefBlock
            title="Product icons"
            note="Single source: SHOP_PRODUCTS. Used by the landing hero chips, the product switcher and the shopping flows."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SHOP_PRODUCTS.map((p) => (
                <div
                  key={p.key}
                  className="flex items-center gap-3 rounded-xl border border-hairline bg-card p-3"
                >
                  <p.icon className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-sm font-medium">{p.label}</span>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock
            title="Interface icons"
            note="Navigation, status and action icons in common use."
          >
            <RefStage>
              {[
                Home,
                Search,
                Plus,
                ArrowRight,
                Check,
                AlertTriangle,
                ShieldCheck,
                Users,
                Building2,
                ShoppingCart,
                Store,
                FileText,
                Settings,
                Bell,
                Eye,
                Star,
              ].map((Icon, i) => (
                <Icon key={i} className="h-5 w-5 text-muted-foreground" aria-hidden />
              ))}
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="primitives"
          eyebrow="Layer 2"
          title="UI primitives"
          intro="shadcn primitives in src/components/ui. These own focus, keyboard and disabled behaviour; ABox components compose them."
        >
          <RefBlock
            title="Button — variants"
            note="Button variants: default, secondary, outline, ghost, link, destructive."
          >
            <RefStage>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </RefStage>
          </RefBlock>
          <RefBlock title="Button — sizes">
            <RefStage>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add">
                <Plus />
              </Button>
            </RefStage>
          </RefBlock>
          <RefBlock
            title="Action pill"
            note="The rounded action treatment used across routes, now owned by ACTION_PILL in src/components/abox/action-pill.ts."
          >
            <RefStage>
              <button type="button" className={ACTION_PILL.primaryMd}>
                Primary md
              </button>
              <button type="button" className={ACTION_PILL.primaryLg}>
                Primary lg
              </button>
              <button type="button" className={ACTION_PILL.primaryXs}>
                Primary xs
              </button>
              <button type="button" className={ACTION_PILL.outlineMd}>
                Outline md
              </button>
              <button type="button" className={ACTION_PILL.outlineLg}>
                Outline lg
              </button>
              <button type="button" className={ACTION_PILL.outlineSm}>
                Outline sm
              </button>
              <button type="button" className={ACTION_PILL.outlineSmCard}>
                Outline sm (card)
              </button>
              <button type="button" className={ACTION_PILL.outlineXs}>
                Outline xs
              </button>
            </RefStage>
          </RefBlock>
          <RefBlock title="Form controls">
            <div className="grid gap-5 rounded-2xl border border-hairline bg-card p-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ds-input">Text input</Label>
                <Input id="ds-input" placeholder="ZIP code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-select">Select</Label>
                <Select>
                  <SelectTrigger id="ds-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="lowest">Lowest premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ds-textarea">Textarea</Label>
                <Textarea id="ds-textarea" placeholder="Notes for the agent" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="ds-check" />
                <Label htmlFor="ds-check">Checkbox</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="ds-switch" />
                <Label htmlFor="ds-switch">Switch</Label>
              </div>
            </div>
          </RefBlock>
          <RefBlock title="Tabs">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="readiness">Readiness</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">
                Overview panel content.
              </TabsContent>
              <TabsContent value="readiness" className="pt-4 text-sm text-muted-foreground">
                Readiness panel content.
              </TabsContent>
              <TabsContent value="history" className="pt-4 text-sm text-muted-foreground">
                History panel content.
              </TabsContent>
            </Tabs>
          </RefBlock>
          <RefBlock title="Alert">
            <Alert>
              <AlertTriangle className="h-4 w-4" aria-hidden />
              <AlertTitle>Readiness incomplete</AlertTitle>
              <AlertDescription>
                Two controls still need evidence before this organization can transact.
              </AlertDescription>
            </Alert>
          </RefBlock>
          <RefBlock title="Overlays">
            <RefStage>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm handoff</DialogTitle>
                    <DialogDescription>
                      The selected plan and quote context are passed to the agent.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filters</DrawerTitle>
                    <DrawerDescription>
                      The mobile filter pattern used on the plans page.
                    </DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="abox"
          eyebrow="Layer 3"
          title="ABox components"
          intro="Business-aware components in src/components/abox. Each one is the single owner of its pattern — pages compose these rather than re-implementing them."
        >
          <RefBlock title="Brand mark — AboxMark">
            <RefStage>
              <AboxMark />
              <AboxMark tone="sage" />
              <AboxMark tone="foreground" />
              <AboxMark size={56} />
            </RefStage>
          </RefBlock>
          <RefBlock
            title="StatusBadge"
            note="Six semantic tones. Used for lifecycle, readiness, network type, exchange status and HSA eligibility."
          >
            <RefStage>
              <StatusBadge tone="sage">Ready</StatusBadge>
              <StatusBadge tone="primary">Off-exchange</StatusBadge>
              <StatusBadge tone="info">On-exchange</StatusBadge>
              <StatusBadge tone="warning">Needs review</StatusBadge>
              <StatusBadge tone="destructive">Blocked</StatusBadge>
              <StatusBadge tone="muted">HMO</StatusBadge>
            </RefStage>
          </RefBlock>
          <RefBlock
            title="CarrierMark"
            note="Deterministic illustrative monograms — not official carrier logos. Used in plan tiles and the cart."
          >
            <RefStage>
              {["Meridian Health", "BluePeak", "Sunstate Mutual", "Aries Care"].map((c) => (
                <span key={c} className="flex items-center gap-2">
                  <CarrierMark carrier={c} size={36} />
                  <span className="text-serial">{c}</span>
                </span>
              ))}
            </RefStage>
          </RefBlock>
          <RefBlock title="KpiCard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Lifecycle" value="ACTIVE" icon={Building2} tone="sage" />
              <KpiCard label="Readiness" value="READY" icon={ShieldCheck} />
              <KpiCard label="Open issues" value={3} icon={AlertTriangle} tone="warning" />
              <KpiCard label="Downlines" value={12} icon={Users} tone="primary" />
            </div>
          </RefBlock>
          <RefBlock
            title="PageHeader"
            note="Default variant for marketplace and member flows; compact variant for dense result screens."
          >
            <div className="rounded-2xl border border-hairline bg-card p-6">
              <PageHeader
                eyebrow="Marketplace"
                title="Explore add-on coverage"
                description="Pair extra coverage with your medical plan."
                icon={Store}
              />
              <PageHeader
                variant="compact"
                title="Plan available"
                description="8 Plans Available · for 30301 · 2 Persons · effective 01/01/2027."
                icon={ShoppingCart}
              />
            </div>
          </RefBlock>
          <RefBlock
            title="PlanCard"
            note="The production plan tile in both layouts — horizontal for the results list, stacked for grids."
          >
            <div className="space-y-4">
              <PlanCard plan={plan} horizontal isBestMatch />
              <div className="max-w-md">
                <PlanCard plan={SAMPLE_PLANS[1] as SamplePlan} />
              </div>
            </div>
          </RefBlock>
          <RefBlock title="DataTable">
            <DataTable
              ariaLabel="Sample organizations"
              getRowId={(r) => r.code}
              columns={[
                {
                  key: "name",
                  header: "Organization",
                  cell: (r) => <OverflowText text={r.name} />,
                },
                {
                  key: "code",
                  header: "Reference",
                  cell: (r) => <span className="text-serial">{r.code}</span>,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (r) => <StatusBadge tone={r.tone}>{r.status}</StatusBadge>,
                },
              ]}
              rows={[
                {
                  name: "Cedar Grove Insurance",
                  code: "ORG-1001",
                  status: "Active",
                  tone: "sage" as const,
                },
                {
                  name: "Northwind Health Group",
                  code: "ORG-1002",
                  status: "Needs review",
                  tone: "warning" as const,
                },
              ]}
            />
          </RefBlock>
          <RefBlock title="EmptyState">
            <EmptyState
              icon={Search}
              title="No plans match these filters"
              body="Clear a filter or widen the metal tier selection to see more results."
            />
          </RefBlock>
        </RefSection>

        <RefSection
          id="states"
          eyebrow="Layer 3"
          title="Component states"
          intro="The states that exist in the implementation. Hover and focus are shown live — interact with the examples."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Interactive</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button className="hover:bg-primary/90">Hover me</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline">Focus me</Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Focus uses the shared ring token; disabled reduces opacity and blocks pointer
                events.
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Loading</p>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Validation</p>
              <div className="mt-4 space-y-2">
                <Input aria-invalid placeholder="Invalid input" />
                <p className="text-xs text-destructive">Postal code must be 5 digits.</p>
                <Input placeholder="Valid input" defaultValue="30301" />
                <p className="text-xs text-sage">Looks good.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Selection</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card">
                  <MetalBadge tier="Silver" />
                </span>
                <MetalBadge tier="Gold" />
                <MetalBadge tier="Bronze" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Selected filters are announced with aria-pressed; the ring is used only where the
                pattern calls for it.
              </p>
            </div>
          </div>
        </RefSection>

        <RefSection
          id="patterns"
          eyebrow="Layer 4"
          title="Layout & page patterns"
          intro="Three shells frame the application. They are components, not per-page markup, so header, navigation and width behaviour stay identical everywhere."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "MarketplaceShell",
                body: "Consumer shopping surface. Full-width header, 88rem content container, product switcher and cart affordance.",
              },
              {
                title: "MemberShell",
                body: "Signed-in member area. Full-width header, left icon rail with connecting arc, 88rem content.",
              },
              {
                title: "InternalShell",
                body: "Internal workspaces. Navy sidebar rail from nav-config, workspace-scoped page title and actions.",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-hairline bg-surface/60 p-5">
            <p className="text-eyebrow mb-3">Content width</p>
            <p className="text-sm text-muted-foreground">
              Web experience pages use a centred <span className="text-serial">max-w-[88rem]</span>{" "}
              container with
              <span className="text-serial ml-1">px-4 md:px-8</span>. Headers stay full width.
              Internal dashboards keep their own shell widths.
            </p>
          </div>
        </RefSection>

        <RefSection
          id="foundation-audit"
          eyebrow="Audit"
          title="Foundation inventory"
          intro="Every foundation category audited against the running implementation: what it is, where the source of truth lives, who consumes it, and whether it is a true shared token, a recurring convention or an intentional one-off. Values are recorded as measured — nothing here was normalized."
        >
          {FOUNDATION.map((cat) => (
            <RefBlock key={cat.id} title={cat.title} note={cat.summary}>
              <FoundationTable entries={cat.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="spacing-relationships"
          eyebrow="Audit"
          title="Spacing relationships"
          intro="Beyond the raw scale: the recurring spacing pairings the application actually uses, measured at real call sites. Where the implementation varies, the variation is recorded as found and left untouched."
        >
          {SPACING_RELATIONSHIPS.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <RelationshipTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="type-relationships"
          eyebrow="Audit"
          title="Typography relationships"
          intro="Which size, weight and colour follows which, as implemented today."
        >
          {TYPOGRAPHY_RELATIONSHIPS.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <RelationshipTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="component-inventory"
          eyebrow="Audit"
          title="Component inventory"
          intro="Consumer counts are import counts across src/routes and src/components, excluding each component's own folder and these reference pages. 'Available' means the primitive is installed and themed but no application screen imports it yet — a fact, not a defect."
        >
          {COMPONENT_INVENTORY.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <InventoryTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="state-inventory"
          eyebrow="Audit"
          title="State inventory"
          intro="The interaction and feedback states that exist in the implementation, and where each one is defined."
        >
          <DefinitionRows
            rows={STATE_INVENTORY.map((s) => ({
              term: s.state,
              detail: "note" in s && s.note ? `${s.implementation} — ${s.note}` : s.implementation,
              meta: s.source,
            }))}
          />
        </RefSection>

        <RefSection
          id="pattern-inventory"
          eyebrow="Audit"
          title="Pattern inventory"
          intro="Repeated arrangements across the product. Some already have a component owner; others remain route-level conventions and are recorded as such."
        >
          {PATTERN_INVENTORY.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <InventoryTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="spacing-audit"
          eyebrow="Phase 2 audit"
          title="Spacing foundation"
          intro="Measured from src/routes and src/components. The application has no spacing token in src/styles.css — spacing is expressed with Tailwind utilities at each call site, so these tables are the actual source of truth. Counts are approximate and describe scale."
        >
          {SPACING_GROUPS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.summary}>
              <SpacingTable entries={group.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="layout-containers"
          eyebrow="Phase 2 audit"
          title="Layout foundation — containers"
          intro="Every recurring container behaviour as implemented. The web experience and the admin shell deliberately use different ceilings; both are preserved."
        >
          <ContainerTable entries={CONTAINERS} />
        </RefSection>

        <RefSection
          id="layout-structure"
          eyebrow="Phase 2 audit"
          title="Structural relationships, grid & flex"
          intro="Observed spacing between adjacent structural elements, and the grid and flex conventions that produce them. Consistency is reported as found and is not normalized."
        >
          <RefBlock title={STRUCTURAL_RELATIONSHIPS.title} note={STRUCTURAL_RELATIONSHIPS.summary}>
            <RelationshipTable entries={STRUCTURAL_RELATIONSHIPS.entries} />
          </RefBlock>
          <RefBlock title={GRID_FLEX_RELATIONSHIPS.title} note={GRID_FLEX_RELATIONSHIPS.summary}>
            <RelationshipTable entries={GRID_FLEX_RELATIONSHIPS.entries} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="responsive-audit"
          eyebrow="Phase 2 audit"
          title="Responsive foundation"
          intro="Breakpoint usage measured in the codebase: md carries 246 modifiers, sm 173, lg 87, xl 22 and 2xl 2. These are the real responsive relationships, not Tailwind's defaults listed generically."
        >
          <ResponsiveTable entries={RESPONSIVE_PATTERNS} />
        </RefSection>

        <RefSection
          id="density-audit"
          eyebrow="Phase 2 audit"
          title="Density"
          intro="Observed contextual density modes. These are descriptions of what ships, not tokens — no density token exists in the implementation."
        >
          <DensityTable entries={DENSITY_MODES} />
        </RefSection>

        <RefSection
          id="dimensions-audit"
          eyebrow="Phase 2 audit"
          title="Dimensional relationships"
          intro="Recurring dimensions that set layout quality, cross-referenced with the foundation audit's control-height and icon-size records."
        >
          <DimensionTable entries={DIMENSIONS} />
        </RefSection>

        <RefSection
          id="layout-patterns"
          eyebrow="Phase 2 audit"
          title="Layout patterns"
          intro="Structural patterns present in the application today. Nothing here is a new runtime pattern — each entry points at the code that already implements it."
        >
          <LayoutPatternList entries={LAYOUT_PATTERNS} />
        </RefSection>

        <RefSection
          id="governance"
          eyebrow="Governance"
          title="Ownership & safe change"
          intro="Which layer owns which decision, and the rules that keep a change from leaking into the shipped product unintentionally."
        >
          <RefBlock title="Ownership hierarchy">
            <DefinitionRows
              rows={OWNERSHIP_HIERARCHY.map((l) => ({
                term: l.layer,
                detail: `${l.owns}. ${l.changeRule}`,
                meta: l.source,
              }))}
            />
          </RefBlock>
          <RefBlock title="Safe centralization rules">
            <ul className="space-y-2 rounded-2xl border border-hairline bg-card p-5 text-sm text-muted-foreground">
              {SAFE_CHANGE_RULES.map((r) => (
                <li key={r} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </RefBlock>
          <RefBlock
            title="Intentional one-offs"
            note="Deliberate local decisions. They look like inconsistencies and must not be normalized."
          >
            <MaturityCallout kind="current" title="Leave these exactly as they are">
              <ul className="mt-2 space-y-2">
                {INTENTIONAL_ONE_OFFS.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <span className="text-serial">{o.source}</span>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
          <RefBlock
            title="Deferred opportunities"
            note="Identified during the audit and intentionally NOT applied, because each could change rendered output or behaviour."
          >
            <MaturityCallout
              kind="opportunity"
              title="Not implemented — candidates for a future phase"
            >
              <ul className="mt-2 space-y-2">
                {DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>

        <RefSection
          id="icon-sources"
          eyebrow="Phase 4 audit"
          title="Iconography sources"
          intro="Three icon packages are installed and one carries the product. Everything else visual is inline SVG authored in components so it can read design tokens."
        >
          <FoundationTable entries={ICON_SOURCES.entries} />
        </RefSection>

        <RefSection
          id="icon-inventory"
          eyebrow="Phase 4 audit"
          title="Icon inventory by semantic category"
          intro="149 distinct icons ship across 144 files. Representative records per category rather than every occurrence — exceptions and dual-purpose glyphs are kept visible rather than summarised away. Counts are import sites, not render counts."
        >
          {ICON_CATEGORIES.map((c) => (
            <RefBlock key={c.id} title={c.title} note={c.summary}>
              <IconTable entries={c.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="icon-sizes"
          eyebrow="Phase 4 audit"
          title="Icon size audit"
          intro="h-4 w-4 accounts for 281 of the measured occurrences — more than four times the next size. Wrapper dimensions are recorded separately from glyph dimensions."
        >
          <SpacingTable entries={ICON_SIZES.entries} />
        </RefSection>

        <RefSection
          id="icon-treatment"
          eyebrow="Phase 4 audit"
          title="Stroke, fill & colour treatment"
          intro="The strongest convention in the product: stroke width is never overridden on an icon, and no icon carries a literal colour."
        >
          <FoundationTable entries={ICON_TREATMENT.entries} />
        </RefSection>

        <RefSection
          id="icon-a11y"
          eyebrow="Phase 4 audit"
          title="Interaction & accessibility"
          intro="aria-hidden appears 257 times across 99 files. Icon-only controls carry an aria-label (90) or an sr-only label (28); that labelling is applied per call site rather than enforced by a component."
        >
          <RelationshipTable entries={ICON_ACCESSIBILITY.entries} />
        </RefSection>

        <RefSection
          id="icon-states"
          eyebrow="Phase 4 audit"
          title="Icon states"
          intro="State is colour, and sometimes the wrapper. No icon changes size or stroke between states, and no glyph is swapped to express one."
        >
          <RelationshipTable entries={ICON_STATES.entries} />
        </RefSection>

        <RefSection
          id="icon-relationships"
          eyebrow="Phase 4 audit"
          title="Icon, mark & artwork relationships"
          intro="Measured pairings between an icon or mark and the element beside it."
        >
          <RelationshipTable entries={ICON_RELATIONSHIPS.entries} />
        </RefSection>

        <RefSection
          id="brand-assets"
          eyebrow="Phase 4 audit"
          title="Logos & brand marks"
          intro="Every mark is drawn in code from CSS variables. That is why the product needs no dark-mode logo file and why white-labelling re-themes the mark without a new asset."
        >
          <AssetTable entries={BRAND_ASSETS.entries} />
          <RefBlock
            title="Live marks"
            note="Rendered from the production components — the same code the application ships."
          >
            <RefStage>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <AboxMark />
                  <AboxWordmark />
                </div>
                <AboxMark tone="sage" />
                <AboxMark tone="foreground" />
                <CarrierMark carrier="Cedar Grove Health" />
                <CarrierMark carrier="Northwind Mutual" />
                <CarrierMark carrier="—" />
              </div>
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="media-assets"
          eyebrow="Phase 4 audit"
          title="Imagery & media"
          intro="The defining finding of this phase: the product ships no imagery at all. No raster file, no committed SVG file, no img element, no assets directory. Visual identity is tokens, type, icons and code-drawn SVG."
        >
          <AssetTable entries={MEDIA_ASSETS.entries} />
        </RefSection>

        <RefSection
          id="asset-organization"
          eyebrow="Phase 4 audit"
          title="Asset naming & organization"
          intro="Assets are components, so naming follows React conventions rather than a file taxonomy. Variants are props, never filename suffixes."
        >
          <FoundationTable entries={ASSET_ORGANIZATION.entries} />
        </RefSection>

        <RefSection
          id="asset-behavior"
          eyebrow="Phase 4 audit"
          title="Asset behaviour & fallbacks"
          intro="Cropping and object-fit conventions do not exist because no bitmap renders. Scaling, layering and fallback behaviour do."
        >
          <RelationshipTable entries={ASSET_BEHAVIOR.entries} />
        </RefSection>

        <RefSection
          id="icon-experiences"
          eyebrow="Phase 4 audit"
          title="Iconography by experience"
          intro="One shared icon system. These records document context of use only — no experience has its own icon library, stroke convention or brand mark."
        >
          <DensityTable entries={ICON_EXPERIENCES} />
        </RefSection>

        <RefSection
          id="asset-governance"
          eyebrow="Phase 4 governance"
          title="Iconography & asset governance"
          intro="Ownership per asset category, maturity in descriptive terms, unused findings, the Figma blueprint, and the changes deliberately not made."
        >
          <RefBlock
            title="Ownership"
            note="Branding & White-Label and Marketplace Asset Management are existing runtime systems. The design system documents them; it never duplicates them."
          >
            <DefinitionRows
              rows={ASSET_OWNERSHIP.map((o) => ({
                term: o.category,
                detail: `Source of truth: ${o.sourceOfTruth}. Owner: ${o.owner}. Safe to change: ${o.safeToChange}. Needs review: ${o.needsReview}. Centralized: ${o.centralized}.`,
              }))}
            />
          </RefBlock>
          <RefBlock title="Maturity" note="Descriptive categories only — no scores, no rankings.">
            <DefinitionRows
              rows={ICON_ASSET_MATURITY.map((m) => ({
                term: m.item,
                detail: m.detail,
                meta: m.maturity,
              }))}
            />
          </RefBlock>
          <RefBlock
            title="Installed but unused, possibly unused & duplicates"
            note="Recorded from measurable evidence. Nothing was deleted or uninstalled."
          >
            <RuleList items={ASSET_UNUSED_FINDINGS} tone="warning" />
          </RefBlock>
          <RefBlock
            title="Figma icon & asset mapping"
            note="A mapping specification only. Nothing was converted and no Figma component was generated."
          >
            <DefinitionRows
              rows={FIGMA_ICON_ASSET_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout
              kind="opportunity"
              title="Not applied — would change production code or rendered output"
            >
              <ul className="mt-2 space-y-2">
                {ICON_ASSET_DEFERRED.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>
        <RefSection
          id="experiences"
          eyebrow="Governance"
          title="Experience guidance"
          intro="One core system, three shipped experiences plus a slot for future ones. Experiences share every token and component; only context-specific usage differs."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {EXPERIENCES.map((e) => (
              <div key={e.id} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-base font-semibold">{e.title}</p>
                <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground">Surfaces: </dt>
                    <dd className="inline">{e.surfaces}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Container: </dt>
                    <dd className="inline">{e.container}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Density: </dt>
                    <dd className="inline">{e.density}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Shell: </dt>
                    <dd className="inline">{e.shellAndChrome}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Components: </dt>
                    <dd className="inline">{e.typicalComponents}</dd>
                  </div>
                </dl>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {e.guidance.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="figma"
          eyebrow="Blueprint"
          title="Future Figma mapping"
          intro="How this implementation will map into a Figma library when that work begins. Blueprint only — no conversion has been performed and no Figma file exists yet."
        >
          <RefBlock
            title="Tokens, components and states"
            note="Established in the foundation phase."
          >
            <DefinitionRows
              rows={FIGMA_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
          <RefBlock
            title="Spacing, layout and responsive behaviour"
            note="Added in Phase 2. Blueprint only — no Figma file, no conversion, and no runtime code was altered to make conversion easier later."
          >
            <DefinitionRows
              rows={FIGMA_LAYOUT_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
        </RefSection>

        <RefSection
          id="layout-governance"
          eyebrow="Phase 2 governance"
          title="Spacing & layout governance"
          intro="Rules that keep the audit honest, the areas that still have no owner, and the opportunities that were deliberately not taken because they would have re-spaced shipping screens."
        >
          <RefBlock title="Governance rules">
            <RuleList items={LAYOUT_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock
            title="Unowned recurring areas"
            note="Recurring spacing and layout that no component or token currently owns. Recorded, not centralized."
          >
            <RuleList items={LAYOUT_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout kind="opportunity" title="Not applied — would change rendered output">
              <ul className="mt-2 space-y-2">
                {LAYOUT_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-families"
          eyebrow="Phase 3 audit"
          title="Font families & weights"
          intro="Two real families ship: Inter Tight for everything and Bricolage Grotesque for headings. The serif and mono tokens alias those stacks — there is no serif or monospace face in the product."
        >
          <RefBlock title="Families">
            <FoundationTable entries={FONT_FAMILIES} />
          </RefBlock>
          <RefBlock title="Weights">
            <FoundationTable entries={FONT_WEIGHTS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-scale-audit"
          eyebrow="Phase 3 audit"
          title="Type scale as measured"
          intro="Every size that ships, with its occurrence count. text-sm (779 uses) is the real body size; text-base is used as a heading size, not for body copy. Sub-scale literals exist because Tailwind's scale stops at 12px."
        >
          <RefBlock title="Sizes">
            <SpacingTable entries={TYPE_SCALE} />
          </RefBlock>
          <RefBlock title="Line height & tracking">
            <FoundationTable entries={LINE_HEIGHT_AND_TRACKING} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-utilities"
          eyebrow="Phase 3 audit"
          title="Typography utilities"
          intro="The three shipping typography utilities, plus the link utilities. One of them — .story-link — is referenced 89 times and has no definition anywhere."
        >
          <FoundationTable entries={TYPOGRAPHY_UTILITIES} />
        </RefSection>

        <RefSection
          id="type-semantic"
          eyebrow="Phase 3 audit"
          title="Semantic typography hierarchy"
          intro="Each role as implemented. Where two surfaces use different values for the same role, that is recorded as an observed variation rather than resolved."
        >
          <RelationshipTable entries={SEMANTIC_TYPOGRAPHY.entries} />
        </RefSection>

        <RefSection
          id="type-responsive"
          eyebrow="Phase 3 audit"
          title="Responsive typography"
          intro="Body text never changes size across breakpoints. Only display, title, subtitle and the input primitive step — and the input deliberately runs larger on mobile to stop iOS zooming on focus."
        >
          <ResponsiveTable entries={RESPONSIVE_TYPOGRAPHY} />
        </RefSection>

        <RefSection
          id="type-components"
          eyebrow="Phase 3 audit"
          title="Component typography cross-reference"
          intro="Typography as applied by each shipping component, cross-referenced with the component inventory. Inventory only — no component was altered."
        >
          <RelationshipTable entries={COMPONENT_TYPOGRAPHY.entries} />
        </RefSection>

        <RefSection
          id="type-states"
          eyebrow="Phase 3 audit"
          title="Typography states & text behaviour"
          intro="State is carried by colour and opacity. Weight and size do not change between states anywhere in the application."
        >
          <RefBlock title={TYPOGRAPHY_STATES.title} note={TYPOGRAPHY_STATES.summary}>
            <RelationshipTable entries={TYPOGRAPHY_STATES.entries} />
          </RefBlock>
          <RefBlock title={TEXT_BEHAVIOR.title} note={TEXT_BEHAVIOR.summary}>
            <RelationshipTable entries={TEXT_BEHAVIOR.entries} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-data"
          eyebrow="Phase 3 audit"
          title="Numeric & data typography"
          intro="tabular-nums appears 90 times and is the only numeric alignment convention. Figures align through tabular figures in Inter Tight, not a monospace face."
        >
          <RelationshipTable entries={NUMERIC_TYPOGRAPHY.entries} />
        </RefSection>

        <RefSection
          id="type-readability"
          eyebrow="Phase 3 audit"
          title="Readability & accessibility conventions"
          intro="What the implementation already does for legibility, contrast, screen readers, touch and reduced motion."
        >
          <DensityTable entries={READABILITY_CONVENTIONS} />
        </RefSection>

        <RefSection
          id="type-governance"
          eyebrow="Phase 3 governance"
          title="Typography governance & maturity"
          intro="Rules, maturity of each role using the existing governance language, areas with no owner, the Figma text-style blueprint, and the changes deliberately not made."
        >
          <RefBlock title="Governance rules">
            <RuleList items={TYPOGRAPHY_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock
            title="Maturity"
            note="Implementation maturity, not a judgement of design quality."
          >
            <DefinitionRows
              rows={TYPOGRAPHY_MATURITY.map((m) => ({
                term: m.item,
                detail: m.detail,
                meta: m.maturity,
              }))}
            />
          </RefBlock>
          <RefBlock
            title="Unowned typography areas"
            note="Recurring typography that no component or utility currently owns."
          >
            <RuleList items={TYPOGRAPHY_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock
            title="Figma text-style mapping"
            note="Blueprint only. Nothing has been converted and no runtime class was renamed."
          >
            <DefinitionRows
              rows={FIGMA_TYPOGRAPHY_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout kind="opportunity" title="Not applied — would change rendered type">
              <ul className="mt-2 space-y-2">
                {TYPOGRAPHY_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>
        <RefSection
          id="component-taxonomy"
          eyebrow="Phase 5 audit"
          title="Component taxonomy"
          intro="Fifteen categories, one per component. Where the category is genuinely arguable the record says so rather than forcing a choice."
        >
          <FoundationTable entries={COMPONENT_TAXONOMY.entries} />
        </RefSection>

        <RefSection
          id="component-source-inventory"
          eyebrow="Phase 5 audit"
          title="Complete component source inventory"
          intro="Every reusable component discovered in the codebase: ABox business components, shadcn primitives, shells, the one icon component, the module kits and the reference-only layer. Consumer counts were measured by import path with each component's own folder and both reference pages excluded."
        >
          {COMPONENT_GROUPS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.summary}>
              <ComponentTable entries={[...group.entries]} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="component-consumers"
          eyebrow="Phase 5 audit"
          title="Consumer map"
          intro="Direct means the file imports the component. Indirect means it renders through another component — a distinction that matters for motion, OverflowText and ToothIcon, whose direct counts understate their reach."
        >
          <RelationshipTable entries={CONSUMER_MAP.entries} />
        </RefSection>

        <RefSection
          id="component-experience"
          eyebrow="Phase 5 audit"
          title="Shared vs experience-specific"
          intro="Derived from actual consumers, not from naming. One core system; the experience sections below are contextual usage guidance only."
        >
          <DefinitionRows
            rows={COMPONENT_EXPERIENCE_SPLIT.map((e) => ({
              term: e.experience,
              detail: e.guidance,
              meta: e.components,
            }))}
          />
        </RefSection>

        <RefSection
          id="component-anatomy"
          eyebrow="Phase 5 audit"
          title="Component anatomy"
          intro="The parts that actually exist, in render order. Missing parts — a table toolbar, a pagination row, a loading part on Button — are recorded as absent rather than invented."
        >
          <AnatomyList entries={COMPONENT_ANATOMY} />
        </RefSection>

        <RefSection
          id="component-variants"
          eyebrow="Phase 5 audit"
          title="Variant inventory"
          intro="Variant names are recorded exactly as written in code. Nothing was renamed, normalized or consolidated."
        >
          <VariantTable entries={[...COMPONENT_VARIANTS]} />
        </RefSection>

        <RefSection
          id="component-sizes"
          eyebrow="Phase 5 audit"
          title="Size inventory"
          intro="Actual control heights, padding, gaps and icon dimensions. Cross-references the Phase 2 spacing ladder and the Phase 4 icon sizes."
        >
          <DimensionTable entries={[...COMPONENT_SIZES]} />
        </RefSection>

        <RefSection
          id="component-state-audit"
          eyebrow="Phase 5 audit"
          title="Component state inventory"
          intro="Only the states that exist today. No missing state was added, and gaps are recorded as future opportunities."
        >
          <ComponentStateTable entries={[...COMPONENT_STATES]} />
        </RefSection>

        <RefSection
          id="component-responsive"
          eyebrow="Phase 5 audit"
          title="Responsive component behaviour"
          intro="Measured behaviour only. Cross-references the Phase 2 responsive audit; no breakpoint was changed."
        >
          <RelationshipTable entries={COMPONENT_RESPONSIVE.entries} />
        </RefSection>

        <RefSection
          id="component-composition"
          eyebrow="Phase 5 audit"
          title="Component relationships"
          intro="Recurring parent to child relationships, each marked shared, experience-specific, or repeated without an owning component."
        >
          <RelationshipTable entries={COMPONENT_COMPOSITION.entries} />
        </RefSection>

        <RefSection
          id="component-classification"
          eyebrow="Phase 5 audit"
          title="Composition vs component"
          intro="Not everything reusable should become a Figma component, and not everything repeated should become a production component. This classification is the input to that decision."
        >
          <RelationshipTable entries={COMPOSITION_CLASSIFICATION.entries} />
        </RefSection>

        <RefSection
          id="component-duplication"
          eyebrow="Phase 5 audit"
          title="Duplication and overlap findings"
          intro="Recorded only. No component was consolidated, renamed or removed, and no winner was chosen."
        >
          <RuleList items={DUPLICATION_FINDINGS} tone="warning" />
        </RefSection>

        <RefSection
          id="component-unused"
          eyebrow="Phase 5 audit"
          title="Installed but unused"
          intro="Components, variants and states that exist and have no located consumer. Confidence is stated per finding; nothing was deleted or uninstalled."
        >
          <RuleList items={UNUSED_FINDINGS} tone="warning" />
        </RefSection>

        <RefSection
          id="component-a11y"
          eyebrow="Phase 5 audit"
          title="Component accessibility inventory"
          intro="What the components actually do. Cross-references the Phase 4 icon accessibility findings; nothing was repaired in this phase."
        >
          <RelationshipTable entries={COMPONENT_ACCESSIBILITY.entries} />
        </RefSection>

        <RefSection
          id="component-crossref"
          eyebrow="Phase 5 audit"
          title="Typography, spacing and iconography cross-reference"
          intro="How representative components consume the Phase 2, 3 and 4 findings. Values are recorded as implemented."
        >
          <RefBlock title="Typography" note="Cross-reference to the Phase 3 type audit.">
            <RelationshipTable entries={COMPONENT_TYPOGRAPHY_CROSSREF.entries} />
          </RefBlock>
          <RefBlock title="Spacing" note="Cross-reference to the Phase 2 spacing audit.">
            <RelationshipTable entries={COMPONENT_SPACING_CROSSREF.entries} />
          </RefBlock>
          <RefBlock title="Iconography" note="Cross-reference to the Phase 4 icon audit.">
            <RelationshipTable entries={COMPONENT_ICON_CROSSREF.entries} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="component-maturity"
          eyebrow="Phase 5 audit"
          title="Component maturity"
          intro="Descriptive categories only — no scores, rankings or overall grades."
        >
          <DefinitionRows
            rows={COMPONENT_MATURITY.map((m) => ({
              term: m.area,
              detail: m.detail,
              meta: m.state,
            }))}
          />
        </RefSection>

        <RefSection
          id="component-governance"
          eyebrow="Phase 5 audit"
          title="Component governance"
          intro="Rules that describe how the component layer is kept coherent. Documentation, not a runtime mechanism."
        >
          <RefBlock title="Governance rules">
            <RuleList items={COMPONENT_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock title="Unowned areas">
            <RuleList items={COMPONENT_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout
              kind="opportunity"
              title="Not applied — every item would change rendered screens"
            >
              <ul className="mt-2 space-y-2">
                {COMPONENT_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.title}>
                    <span className="font-medium text-foreground">{o.title}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>

        <RefSection
          id="component-figma"
          eyebrow="Phase 5 audit"
          title="Figma component mapping"
          intro="A mapping specification only. Nothing has been converted, no Figma component exists, and no DOM-to-Figma conversion is implied."
        >
          <DefinitionRows
            rows={FIGMA_COMPONENT_MAPPING.map((m) => ({
              term: m.production,
              detail: `→ ${m.figma}. ${m.note}`,
            }))}
          />
        </RefSection>

        <RefSection
          id="future-figma-library"
          eyebrow="Future Figma organization"
          title="Core component library blueprint"
          intro="A proposed organization for a future Figma library, derived strictly from the discovered production inventory. This hierarchy does not exist in production today."
        >
          <MaturityCallout kind="opportunity" title="Future Figma organization — not yet built">
            <p>
              One core library plus contextual experience guidance. No experience gets its own
              competing system.
            </p>
          </MaturityCallout>
          <DefinitionRows
            rows={FUTURE_FIGMA_ORGANIZATION.map((f) => ({ term: f.level, detail: f.detail }))}
          />
        </RefSection>

        <RefSection
          id="arch-core"
          eyebrow="Phase 6 blueprint"
          title="ABox Core architecture"
          intro="One unified system: Foundations, Components, Patterns and Experience Guidance. This section describes what a future canonical system should target. Nothing here has been applied to the application."
        >
          <MaturityCallout kind="opportunity" title="Blueprint only — the application is unchanged">
            <p>
              Rows labelled CURRENT IMPLEMENTATION are measured from production. Every other label
              is a proposal. No production component, route, token or behaviour was modified to
              produce this architecture.
            </p>
          </MaturityCallout>
          <ArchLayerList entries={CORE_ARCHITECTURE} />
        </RefSection>

        <RefSection
          id="arch-hierarchy"
          eyebrow="Phase 6 blueprint"
          title="Component hierarchy and dependency direction"
          intro="Seven levels from token to screen. Dependencies point in one direction only; the rules below state what may never depend on what."
        >
          <ArchLayerList entries={COMPONENT_HIERARCHY} />
          <RuleList items={DEPENDENCY_RULES} />
        </RefSection>

        <RefSection
          id="arch-classification"
          eyebrow="Phase 6 blueprint"
          title="Component vs pattern framework"
          intro="Observable criteria for deciding what is a primitive, a component, a compound component, a pattern or an experience pattern — applied to the real inventory."
        >
          <CriteriaTable entries={CLASSIFICATION_CRITERIA} />
          <BlueprintTable rows={CLASSIFICATION_RESULTS} />
        </RefSection>

        <RefSection
          id="arch-canonical"
          eyebrow="Phase 6 blueprint"
          title="Future canonical component map"
          intro={`${CANONICAL_SUMMARY.candidates} candidates — ${CANONICAL_SUMMARY.core} ABox Core, ${CANONICAL_SUMMARY.experience} experience-specific. Each entry pairs the measured current implementation with the canonical target a future phase would work towards. No component has been renamed, replaced or consolidated.`}
        >
          <CanonicalMapTable entries={CANONICAL_COMPONENT_MAP} />
        </RefSection>

        <RefSection
          id="arch-blueprints"
          eyebrow="Phase 6 blueprint"
          title="Anatomy, variant, state, accessibility, responsive and density blueprints"
          intro="Current production evidence on the left, the future canonical target on the right. The two are never merged, so the reader always knows which is which."
        >
          {ALL_BLUEPRINTS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.summary}>
              <BlueprintTable rows={group.rows} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="arch-dependencies"
          eyebrow="Phase 6 blueprint"
          title="Token → component → pattern → screen dependency model"
          intro="How a change at the token level reaches a screen today, and where the chain currently breaks because a value is written as a literal rather than owned by a token."
        >
          <DefinitionRows
            rows={DEPENDENCY_MODEL.map((d) => ({
              term: d.level,
              detail: `${d.detail} Example: ${d.example}. Depends on: ${d.depends}.`,
            }))}
          />
          <RefBlock
            title="Literal values that bypass the chain"
            note="Recorded as findings. None of these has been changed."
          >
            <RuleList items={LITERAL_VALUE_FINDINGS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="arch-relationships"
          eyebrow="Phase 6 blueprint"
          title="Architecture relationship map"
          intro="Containment, composition, dependency and sibling relationships. Each edge is marked as existing today or proposed."
        >
          <ArchRelationshipTable entries={ARCH_RELATIONSHIPS} />
        </RefSection>

        <RefSection
          id="arch-overlap"
          eyebrow="Phase 6 blueprint"
          title="Duplicate and overlap normalization map"
          intro="Every overlapping implementation is documented with its consumers, differences, risks and the decision a future phase must make. No winner has been chosen and nothing has been consolidated."
        >
          <MaturityCallout kind="opportunity" title="No production winner selected">
            <p>
              Choosing between duplicate implementations is deliberately deferred. Each area below
              records what a decision would require, not what the decision is.
            </p>
          </MaturityCallout>
          <OverlapList entries={OVERLAP_MAP} />
        </RefSection>

        <RefSection
          id="arch-kits"
          eyebrow="Phase 6 blueprint"
          title="Route-local kit architecture"
          intro="Module-scoped kits described as architecture rather than as defects: what each owns, what is genuinely reusable and what is legitimately experience-specific."
        >
          <KitTable entries={ROUTE_LOCAL_KITS} />
        </RefSection>

        <RefSection
          id="arch-shells"
          eyebrow="Phase 6 blueprint"
          title="Shell architecture and route coverage"
          intro="Three shell families cover 123 routes. Shells own structure, navigation and responsive frame; they never own component definitions."
        >
          <ShellTable entries={SHELL_ARCHITECTURE} />
          <RefBlock
            title="Shared shell concerns"
            note="Common responsibilities across all three shells."
          >
            <RuleList items={SHELL_SHARED_CONCERNS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="arch-brand"
          eyebrow="Phase 6 blueprint"
          title="Brand and asset architecture boundaries"
          intro="What belongs to the design system and what stays owned by Branding & White-Label and Marketplace Asset Management at runtime. Neither system was modified."
        >
          <BlueprintTable rows={BRAND_ARCHITECTURE} />
          <BlueprintTable rows={ASSET_ARCHITECTURE} />
          <RuleList items={ASSET_OWNERSHIP_RULES} />
        </RefSection>

        <RefSection
          id="arch-naming"
          eyebrow="Phase 6 blueprint"
          title="Naming conventions"
          intro="A convention designed to fit the codebase as it already is, so adopting it forces no rename. Where an existing name does not fit, the row says so instead of proposing a correction."
        >
          <NamingTable entries={NAMING_CONVENTIONS} />
        </RefSection>

        <RefSection
          id="arch-figma-library"
          eyebrow="Future Figma organization"
          title="Figma library structure blueprint"
          intro="A specification for a library that does not exist. Nothing has been drawn, converted, exported or synchronised, and no DOM-to-Figma conversion is implied."
        >
          <MaturityCallout kind="opportunity" title="No Figma component exists">
            <p>
              This is a written structure derived from the audited implementation. Building the
              library is a separate future phase.
            </p>
          </MaturityCallout>
          <FigmaSectionTable entries={FIGMA_LIBRARY_BLUEPRINT} />
        </RefSection>

        <RefSection
          id="arch-figma-variables"
          eyebrow="Future Figma organization"
          title="Token and style to Figma variable mapping"
          intro="Where a one-to-one mapping holds and, just as importantly, where it does not."
        >
          <FigmaVariableTable entries={FIGMA_VARIABLE_MAPPINGS} />
        </RefSection>

        <RefSection
          id="arch-experiences"
          eyebrow="Phase 6 blueprint"
          title="Experience architecture"
          intro="One core system applied at three densities. Each experience composes and configures Core; none of them forks it."
        >
          <ExperienceArchTable entries={EXPERIENCE_ARCHITECTURE} />
        </RefSection>

        <RefSection
          id="arch-governance"
          eyebrow="Phase 6 blueprint"
          title="Architecture governance and change propagation"
          intro="The rules a future canonical system would follow, and how a change travels from decision to screen — including where it currently stops."
        >
          <RuleList items={ARCHITECTURE_GOVERNANCE_RULES} />
          <RefBlock
            title="Change propagation model"
            note="Steps 1–3 exist today. Step 4 does not. Step 5 is partial by design."
          >
            <DefinitionRows
              rows={CHANGE_PROPAGATION_MODEL.map((c) => ({
                term: c.step,
                detail: `${c.detail} [${c.label}]`,
              }))}
            />
          </RefBlock>
        </RefSection>

        <RefSection
          id="arch-migration"
          eyebrow="Future migration"
          title="Normalization migration roadmap"
          intro="A proposed sequence for a future controlled normalization phase. Nothing in this roadmap has been executed."
        >
          <MigrationList entries={MIGRATION_ROADMAP} />
          <RefBlock
            title="Open decisions"
            note="Questions a future phase must answer before it can begin."
          >
            <RuleList items={OPEN_FUTURE_DECISIONS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="arch-traceability"
          eyebrow="Phase 6 blueprint"
          title="Cross-phase traceability"
          intro="Which audit phase supplies the evidence behind each part of this architecture."
        >
          <DefinitionRows
            rows={CROSS_PHASE_TRACEABILITY.map((t) => ({
              term: t.phase,
              detail: `Feeds: ${t.feeds}. Artifacts: ${t.artifacts}.`,
            }))}
          />
        </RefSection>

        <RefSection
          id="fnd-model"
          eyebrow="Phase 7 foundation"
          title="Foundation model"
          intro="How a value travels from a primitive to a screen. The layers on the left are proposed; the state below records what production actually does today."
        >
          <ArchLayerList entries={FOUNDATION_MODEL} />
          <RefBlock
            title="Current state, stated plainly"
            note="The system is already semantic in colour and shape, and call-site based in type, space and density."
          >
            <BlueprintTable rows={FOUNDATION_CURRENT_STATE} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-color"
          eyebrow="Phase 7 foundation"
          title="Colour foundation"
          intro={`Every colour token in styles.css, with its copied value, both theme values, its purpose, its measured usage and its future role. ${COLOR_TOKEN_COUNT} tokens are recorded.`}
        >
          {COLOR_FOUNDATION.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.summary}>
              <TokenSpecTable tokens={group.tokens} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="fnd-color-roles"
          eyebrow="Phase 7 foundation"
          title="Colour role chains"
          intro="Which component slot consumes which colour role, and where two roles overlap in meaning."
        >
          <RoleChainTable entries={COLOR_ROLE_CHAINS} />
          <RefBlock title="Overlapping roles" note="Recorded, not resolved.">
            <BlueprintTable rows={COLOR_ROLE_OVERLAPS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-theme"
          eyebrow="Phase 7 foundation"
          title="Theme modes"
          intro="What changes between light and dark, and what deliberately does not."
        >
          <BlueprintTable rows={THEME_MODE_MAP} />
        </RefSection>

        <RefSection
          id="fnd-tone"
          eyebrow="Phase 7 foundation"
          title="Status tone vocabulary"
          intro="The six tones StatusBadge accepts, how each is mixed, and which meanings currently share a tone."
        >
          <BlueprintTable rows={TONE_VOCABULARY} />
          <RefBlock title="Tone overlaps" note="Where one tone carries more than one meaning.">
            <BlueprintTable rows={TONE_OVERLAPS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-tier"
          eyebrow="Phase 7 foundation"
          title="Tier foundation"
          intro="Metal tier colours are a separate foundation from status colour. They carry product meaning, are identical in both themes and always render at full opacity."
        >
          <TokenSpecTable tokens={TIER_FOUNDATION} />
          <RefBlock title="Tier governance" note="Why tiers stay separate and non-configurable.">
            <BlueprintTable rows={TIER_GOVERNANCE} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-type"
          eyebrow="Phase 7 foundation"
          title="Typography foundation"
          intro="Families, weights, the measured size scale, rhythm, semantic roles and responsive behaviour."
        >
          <RefBlock title="Families">
            <BlueprintTable rows={TYPE_FAMILY_SPEC} />
          </RefBlock>
          <RefBlock title="Weights">
            <BlueprintTable rows={TYPE_WEIGHT_SPEC} />
          </RefBlock>
          <RefBlock title="Size scale">
            <BlueprintTable rows={TYPE_SIZE_SPEC} />
          </RefBlock>
          <RefBlock title="Line height & tracking">
            <BlueprintTable rows={TYPE_RHYTHM_SPEC} />
          </RefBlock>
          <RefBlock title="Semantic roles">
            <BlueprintTable rows={TYPE_ROLE_SPEC} />
          </RefBlock>
          <RefBlock title="Responsive typography">
            <BlueprintTable rows={RESPONSIVE_TYPE_SPEC} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-space"
          eyebrow="Phase 7 foundation"
          title="Spacing foundation"
          intro="The spacing ladder as actually used, and the relationships between elements that the ladder alone does not express."
        >
          <BlueprintTable rows={SPACING_SCALE_SPEC} />
          <RefBlock
            title="Spacing relationships"
            note="Rules implied by the markup, stated explicitly."
          >
            <BlueprintTable rows={SPACING_RELATIONSHIP_SPEC} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-layout"
          eyebrow="Phase 7 foundation"
          title="Layout & shape foundation"
          intro="Containers, breakpoints, radii, borders, elevation and opacity."
        >
          <RefBlock title="Containers">
            <BlueprintTable rows={CONTAINER_SPEC} />
          </RefBlock>
          <RefBlock title="Breakpoints">
            <BlueprintTable rows={BREAKPOINT_SPEC} />
          </RefBlock>
          <RefBlock title="Shape, elevation & opacity">
            <BlueprintTable rows={SHAPE_SPEC} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-icon-motion"
          eyebrow="Phase 7 foundation"
          title="Icon, motion & density foundation"
          intro="Icon libraries and sizes, animation and easing, and the control heights that set density."
        >
          <RefBlock title="Iconography">
            <BlueprintTable rows={ICON_FOUNDATION_SPEC} />
          </RefBlock>
          <RefBlock title="Motion">
            <BlueprintTable rows={MOTION_FOUNDATION_SPEC} />
          </RefBlock>
          <RefBlock title="Density & controls">
            <BlueprintTable rows={DENSITY_FOUNDATION_SPEC} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="fnd-component-roles"
          eyebrow="Phase 7 foundation"
          title="Component foundation roles"
          intro="For each canonical component candidate: which foundation role each slot would consume, and what production uses for that slot today."
        >
          <ComponentRoleList specs={COMPONENT_FOUNDATION_ROLES} />
        </RefSection>

        <RefSection
          id="fnd-naming"
          eyebrow="Phase 7 foundation"
          title="Token naming system"
          intro="A proposed naming convention per category, tested against the current codebase and against Figma's constraints. No production token is renamed."
        >
          <NamingTable entries={TOKEN_NAMING_RULES} />
        </RefSection>

        <RefSection
          id="fnd-map"
          eyebrow="Phase 7 foundation"
          title="Primitive → semantic → component map"
          intro="The complete chain for the values with the strongest production evidence."
        >
          <RoleChainTable entries={PRIMITIVE_SEMANTIC_MAP} />
        </RefSection>

        <RefSection
          id="fnd-figma"
          eyebrow="Phase 7 foundation"
          title="Figma variable & style mapping"
          intro="How this foundation would map into collections, modes, variables and styles — including what cannot be mapped at all. Nothing has been created in Figma."
        >
          <BlueprintTable rows={FIGMA_VARIABLE_MAP} />
        </RefSection>

        <RefSection
          id="fnd-a11y"
          eyebrow="Phase 7 foundation"
          title="Foundation accessibility"
          intro="Accessibility treated as a foundation property rather than a component detail. Observations only."
        >
          <FoundationA11yTable records={FOUNDATION_ACCESSIBILITY} />
        </RefSection>

        <RefSection
          id="fnd-boundaries"
          eyebrow="Phase 7 foundation"
          title="Ownership boundaries"
          intro="What the core foundation owns, what white-label configuration may change, and what stays fixed. Branding and Marketplace Asset Management remain the runtime sources of truth."
        >
          <BlueprintTable rows={FOUNDATION_BOUNDARIES} />
        </RefSection>

        <RefSection
          id="fnd-experience"
          eyebrow="Phase 7 foundation"
          title="Experience expression"
          intro="One core foundation, expressed differently per experience. These are contextual notes, not separate systems."
        >
          <BlueprintTable rows={FOUNDATION_EXPERIENCE_GUIDANCE} />
        </RefSection>

        <RefSection
          id="fnd-maturity"
          eyebrow="Phase 7 foundation"
          title="Foundation maturity"
          intro="A descriptive read of each category: what exists, how centralised it is, what varies and what decision remains open. No scores, no ranking."
        >
          <FoundationMaturityTable records={FOUNDATION_MATURITY} />
        </RefSection>

        <RefSection
          id="fnd-governance"
          eyebrow="Phase 7 foundation"
          title="Foundation governance"
          intro="How tokens would be added, changed, deprecated and approved in a future controlled system."
        >
          <BlueprintTable rows={FOUNDATION_GOVERNANCE_RULES} />
        </RefSection>

        {/* ---------------- Phase 8 — canonical component specification ---------------- */}

        <RefSection
          id="spec-overview"
          eyebrow="Phase 8 specification"
          title="ABox Core specification"
          intro="A structured specification of what a future ABox Core library would define, written from the current codebase. Each entry states what exists today and, separately, what a future canonical version would look like. Nothing here has been built, renamed or migrated."
        >
          <DefinitionRows
            rows={[
              {
                term: "Categories",
                detail: `${SPEC_SUMMARY.categories} specification categories`,
                meta: "actions, forms, display, containers, data, navigation, overlays, feedback, brand, commerce, shell",
              },
              {
                term: "Components specified",
                detail: `${SPEC_SUMMARY.components} entries`,
                meta: `${SPEC_SUMMARY.withCurrentImplementation} with a production implementation, ${SPEC_SUMMARY.withoutEvidence} without evidence`,
              },
              {
                term: "Open decisions",
                detail: `${SPEC_SUMMARY.openDecisions} entries marked FUTURE DECISION`,
                meta: "no value was chosen silently",
              },
              {
                term: "Unowned areas",
                detail: `${SPEC_SUMMARY.unownedAreas} patterns with no component owner today`,
                meta: "recorded, not created",
              },
              {
                term: "Duplicates and overlaps",
                detail: `${SPEC_SUMMARY.duplicatesOrOverlaps} entries`,
                meta: "recorded side by side with no winner",
              },
              {
                term: "Experience extensions",
                detail: `${SPEC_SUMMARY.experienceExtensions} entries live outside the shared core`,
                meta: "commerce and dashboard domain meaning",
              },
            ]}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Controlled label", "Entries"]}
              rows={SPEC_LABEL_COUNTS.map((l) => ({
                key: l.label,
                cells: [l.label, String(l.count)],
                label: l.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-anatomy"
          eyebrow="Phase 8 specification"
          title="Anatomy vocabulary"
          intro="One shared set of named slots, used by every specification below. Parts are never forced onto a component that does not have them."
        >
          <SpecMatrixTable
            columns={["Part", "Definition", "Applies to", "Never forced onto", "Current evidence"]}
            rows={ANATOMY_VOCABULARY.map((a) => ({
              key: a.part,
              cells: [a.part, a.definition, a.appliesTo, a.neverForce, a.currentEvidence],
              label: a.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={ANATOMY_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="spec-properties"
          eyebrow="Phase 8 specification"
          title="Property model"
          intro="How a future component would express what a consumer can set, and which of those concepts a designer could manipulate in Figma."
        >
          <SpecMatrixTable
            columns={["Class", "Definition", "Examples", "Figma"]}
            rows={PROPERTY_CLASSES.map((p) => ({
              key: p.propertyClass,
              cells: [p.propertyClass, p.definition, p.examples, p.figma],
              label: p.label,
              note: p.note,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Topic", "Current implementation", "Future rule"]}
              rows={PROPERTY_RULES.map((r) => ({
                key: r.topic,
                cells: [r.topic, r.current, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-variants"
          eyebrow="Phase 8 specification"
          title="Variant governance"
          intro="Five kinds of variant, and the test a production variation must pass before it could ever become a canonical one."
        >
          <SpecMatrixTable
            columns={["Kind", "Definition", "Current evidence", "Future rule"]}
            rows={VARIANT_KINDS.map((v) => ({
              key: v.kind,
              cells: [v.kind, v.definition, v.currentEvidence, v.futureRule],
              label: v.label,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Topic", "Current implementation", "Future rule"]}
              rows={VARIANT_GOVERNANCE.map((r) => ({
                key: r.topic,
                cells: [r.topic, r.current, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-states"
          eyebrow="Phase 8 specification"
          title="State vocabulary"
          intro="The states a future component may declare, what each may affect, and how each is communicated to assistive technology."
        >
          <SpecMatrixTable
            columns={["State", "Definition", "May affect", "Accessibility", "Current evidence"]}
            rows={STATE_VOCABULARY.map((s) => ({
              key: s.state,
              cells: [s.state, s.definition, s.mayAffect, s.accessibility, s.currentEvidence],
              label: s.label,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Topic", "Current implementation", "Future rule"]}
              rows={STATE_GOVERNANCE.map((r) => ({
                key: r.topic,
                cells: [r.topic, r.current, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-sizing"
          eyebrow="Phase 8 specification"
          title="Size & density"
          intro="Every control height that ships today, recorded as measured. The differences are deliberate and are preserved; whether a single ladder could ever absorb them is left open."
        >
          <SpecMatrixTable
            columns={["Step", "Height", "Padding", "Typography", "Used by", "Source"]}
            rows={CONTROL_SIZE_EVIDENCE.map((s) => ({
              key: s.step,
              cells: [s.step, s.height, s.padding, s.typography, s.usedBy, s.source],
              label: s.label,
              note: s.note,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Density mode", "Scale", "Padding", "Typography", "Used by", "Source"]}
              rows={SPEC_DENSITY_MODES.map((s) => ({
                key: s.step,
                cells: [s.step, s.height, s.padding, s.typography, s.usedBy, s.source],
                label: s.label,
              }))}
            />
          </div>
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Topic", "Current implementation", "Future position"]}
              rows={SIZING_GOVERNANCE.map((r) => ({
                key: r.topic,
                cells: [r.topic, r.current, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-icons"
          eyebrow="Phase 8 specification"
          title="Icon behavior"
          intro="Icon rules for a future library, measured against what the codebase actually imports and renders today."
        >
          <SpecMatrixTable
            columns={["Topic", "Current implementation", "Future rule", "Evidence"]}
            rows={ICON_BEHAVIOR.map((i) => ({
              key: i.topic,
              cells: [i.topic, i.current, i.future, i.evidence],
              label: i.label,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Topic", "Current implementation", "Future rule"]}
              rows={ICON_GOVERNANCE.map((r) => ({
                key: r.topic,
                cells: [r.topic, r.current, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        {SPEC_REGISTRY.map((group) => (
          <RefSection
            key={group.id}
            id={group.id}
            eyebrow="Phase 8 specification"
            title={group.title}
            intro={group.summary}
          >
            <div className="space-y-4">
              {group.specs.map((spec) => (
                <ComponentSpecCard key={spec.name} spec={spec} />
              ))}
            </div>
          </RefSection>
        ))}

        <RefSection
          id="spec-composition"
          eyebrow="Phase 8 specification"
          title="Composition & relationships"
          intro="How components would nest, and the recurring spatial relationships each rule depends on. An observed composition is not automatically canonical."
        >
          <SpecMatrixTable
            columns={["Parent", "Child", "Future rule", "Current implementation"]}
            rows={COMPOSITION_RULES.map((c) => ({
              key: `${c.parent}-${c.child}`,
              cells: [c.parent, c.child, c.rule, c.current],
              label: c.label,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Relationship", "Observed", "Future target"]}
              rows={RELATIONSHIP_RULES.map((r) => ({
                key: r.relationship,
                cells: [r.relationship, r.observed, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-dependencies"
          eyebrow="Phase 8 specification"
          title="Foundation dependency chains"
          intro="Foundation → semantic role → component role → component → compound → pattern → experience pattern → screen, per component."
        >
          <SpecMatrixTable
            columns={[
              "Component",
              "Foundation",
              "Semantic role",
              "Component role",
              "Compound",
              "Pattern",
              "Experience",
              "Screen",
            ]}
            rows={DEPENDENCY_CHAINS.map((d) => ({
              key: d.component,
              cells: [
                d.component,
                d.foundation,
                d.semanticRole,
                d.componentRole,
                d.compound,
                d.pattern,
                d.experiencePattern,
                d.screen,
              ],
              label: d.label,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Topic", "Current implementation", "Future rule"]}
              rows={DEPENDENCY_GOVERNANCE.map((r) => ({
                key: r.topic,
                cells: [r.topic, r.current, r.future],
                label: r.label,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="spec-duplicates"
          eyebrow="Phase 8 specification"
          title="Duplicate & overlap register"
          intro="Parallel implementations recorded side by side, in no meaningful order. Nothing here is ranked, preferred, deprecated or consolidated."
        >
          <DuplicateRegisterTable entries={DUPLICATE_REGISTER} />
        </RefSection>

        <RefSection
          id="spec-kits"
          eyebrow="Phase 8 specification"
          title="Route-local kits"
          intro="How the existing module kits would relate to a future core. No kit is modified, merged or retired."
        >
          <SpecMatrixTable
            columns={["Kit", "Source", "Scope", "Overlaps with", "Future relationship"]}
            rows={ROUTE_KITS.map((k) => ({
              key: k.kit,
              cells: [k.kit, k.source, k.scope, k.overlapsWith, k.futureRelationship],
              label: k.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={KIT_ARCHITECTURE} />
          </div>
        </RefSection>

        <RefSection
          id="spec-experience"
          eyebrow="Phase 8 specification"
          title="Experience extension boundaries"
          intro="What each experience shares from the core, what it may legitimately extend, and what must never diverge."
        >
          <SpecMatrixTable
            columns={[
              "Experience",
              "Shell",
              "Shared from core",
              "Legitimate extensions",
              "Must not diverge",
            ]}
            rows={EXPERIENCE_BOUNDARIES.map((e) => ({
              key: e.experience,
              cells: [
                e.experience,
                e.shell,
                e.sharedFromCore,
                e.legitimateExtensions,
                e.mustNotDiverge,
              ],
              label: e.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={EXPERIENCE_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="spec-a11y"
          eyebrow="Phase 8 specification"
          title="Accessibility by category"
          intro="Current behavior and future governance stated separately for every component category."
        >
          <SpecMatrixTable
            columns={[
              "Category",
              "Keyboard",
              "Semantics",
              "Naming",
              "State communication",
              "Current behavior",
              "Future governance",
            ]}
            rows={CATEGORY_ACCESSIBILITY.map((a) => ({
              key: a.category,
              cells: [
                a.category,
                a.keyboard,
                a.semantics,
                a.naming,
                a.stateCommunication,
                a.currentBehavior,
                a.futureGovernance,
              ],
              label: a.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={A11Y_CROSS_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="spec-content"
          eyebrow="Phase 8 specification"
          title="Content & text behavior"
          intro="Long labels, truncation, localization, numbers, and the difference between empty, missing, loading and failed content. No production copy is altered."
        >
          <SpecMatrixTable
            columns={["Topic", "Current implementation", "Future rule", "Applies to"]}
            rows={CONTENT_RULES.map((c) => ({
              key: c.topic,
              cells: [c.topic, c.current, c.future, c.appliesTo],
              label: c.label,
            }))}
          />
        </RefSection>

        <RefSection
          id="spec-figma-library"
          eyebrow="Phase 8 specification"
          title="Figma library blueprint"
          intro="How a future library would be organised, and what it honestly cannot hold. Nothing has been created in Figma."
        >
          <SpecMatrixTable
            columns={["Page", "Contains", "Organisation", "Source of truth"]}
            rows={SPEC_FIGMA_LIBRARY.map((f) => ({
              key: f.page,
              cells: [f.page, f.contains, f.organisation, f.sourceOfTruth],
              label: f.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={FIGMA_LIMITS} tone="warning" />
          </div>
        </RefSection>

        <RefSection
          id="spec-figma-mapping"
          eyebrow="Phase 8 specification"
          title="Figma property mapping"
          intro="Per component family: what becomes a Figma property, and what must stay code-only."
        >
          <SpecMatrixTable
            columns={[
              "Component",
              "Component properties",
              "Variant properties",
              "Boolean",
              "Instance swap",
              "Text",
              "Variables & modes",
              "Code-only",
            ]}
            rows={FIGMA_COMPONENT_MAPPINGS.map((f) => ({
              key: f.component,
              cells: [
                f.component,
                f.componentProperties,
                f.variantProperties,
                f.booleanProperties,
                f.instanceSwap,
                f.textProperties,
                f.variablesAndModes,
                f.codeOnly,
              ],
              label: f.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={FIGMA_MAPPING_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="spec-naming"
          eyebrow="Phase 8 specification"
          title="Naming governance"
          intro="Naming conventions for a future library, in code and in Figma. No production name is changed."
        >
          <SpecMatrixTable
            columns={["Subject", "Convention", "Example", "Avoid"]}
            rows={SPEC_NAMING_CONVENTIONS.map((n) => ({
              key: n.subject,
              cells: [n.subject, n.convention, n.example, n.avoid],
              label: n.label,
            }))}
          />
          <div className="mt-4">
            <RuleList items={NAMING_RULES_NOTES} />
          </div>
        </RefSection>

        <RefSection
          id="spec-template"
          eyebrow="Phase 8 specification"
          title="Documentation template"
          intro="The eighteen questions every future component page answers, in order, each bound to a field of the structured specification."
        >
          <DefinitionRows
            rows={DOCUMENTATION_TEMPLATE.map((t) => ({
              term: `${t.order}. ${t.heading}`,
              detail: t.question,
              meta: `field: ${t.source}`,
            }))}
          />
        </RefSection>

        <RefSection
          id="spec-governance"
          eyebrow="Phase 8 specification"
          title="Governance & maturity"
          intro="Descriptive maturity categories, the rules for adding or reusing a component, and the decisions still open. No scores, no ranking, no winners."
        >
          <SpecMatrixTable
            columns={["Status", "Meaning", "What it implies", "What it does not imply"]}
            rows={MATURITY_CATEGORIES.map((m) => ({
              key: m.status,
              cells: [m.status, m.meaning, m.whatItImplies, m.whatItDoesNotImply],
              label: "GOVERNANCE RULE",
            }))}
          />
          <div className="mt-4">
            <RuleList items={SPEC_GOVERNANCE_RULES.map((r) => `${r.rule} — ${r.rationale}`)} />
          </div>
          <div className="mt-4">
            <RuleList
              items={OPEN_DECISIONS.map(
                (d) => `FUTURE DECISION — ${d.decision} Blocked by: ${d.blockedBy}`,
              )}
              tone="warning"
            />
          </div>
        </RefSection>

        {/* ---------------- Phase 9 — integrated dependency graph ---------------- */}

        <RefSection
          id="graph-model"
          eyebrow="Phase 9 integration"
          title="Integrated dependency model"
          intro="One graph connecting the layers that Phases 1 to 8 described separately. Every edge carries its own status, so a proposed relationship can never be read as current architecture. An edge exists only where the code shows one — visual similarity never creates an edge."
        >
          <DefinitionRows
            rows={[
              { term: "Layers", detail: `${GRAPH_SUMMARY.layers} layers from foundation to screen` },
              { term: "Nodes", detail: `${GRAPH_SUMMARY.nodes} nodes`, meta: "tokens, roles, components, compounds, patterns, experiences, kits, shells, screens" },
              { term: "Edges", detail: `${GRAPH_SUMMARY.edges} relationships`, meta: `${GRAPH_SUMMARY.currentEdges} current, ${GRAPH_SUMMARY.futureEdges} future` },
              { term: "Recorded duplication", detail: `${GRAPH_SUMMARY.duplicateEdges} edges marked as duplicate or overlap`, meta: "several implementations into one role; no winner chosen" },
              { term: "Unowned relationships", detail: `${GRAPH_SUMMARY.unownedEdges} edges with no component owner` },
              { term: "Left open", detail: `${GRAPH_SUMMARY.openDecisionEdges} edges marked FUTURE DECISION`, meta: "not established from code evidence" },
            ]}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Status", "Edges"]}
              rows={EDGE_STATUS_COUNTS.map((e) => ({ key: e.label, cells: [e.label, String(e.count)], label: e.label }))}
            />
          </div>
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Status", "Meaning", "Read as"]}
              rows={STATUS_LEGEND.map((s) => ({ key: s.status, cells: [s.status, s.meaning, s.readAs], label: s.status }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="graph-layers"
          eyebrow="Phase 9 integration"
          title="Dependency hierarchy"
          intro="The eight layers, in dependency order. Dependencies point one way: a lower layer never depends on a higher one."
        >
          <DefinitionRows
            rows={GRAPH_LAYERS.map((l) => ({
              term: l.title,
              detail: l.meaning,
              meta: `${GRAPH_NODES.filter((n) => n.layer === l.layer).length} nodes`,
            }))}
          />
        </RefSection>

        {[
          { id: "graph-foundation", title: "Foundation → semantic role", layers: ["foundation"], intro: "Which foundation value defines which meaning. Links to the Phase 7 records rather than repeating the token inventory." },
          { id: "graph-roles", title: "Semantic role → component role → component", layers: ["semantic-role", "component-role"], intro: "Where a meaning is consumed, and by which shipping implementation. Where two implementations fill one role, both edges are drawn." },
          { id: "graph-compounds", title: "Component → compound", layers: ["core-component"], intro: "Fixed compositions supported by Phase 8 evidence. Unsupported structures are marked FUTURE DECISION." },
          { id: "graph-patterns", title: "Compound → pattern", layers: ["compound"], intro: "Recurring arrangements that solve one screen problem. Repeated markup alone does not qualify." },
          { id: "graph-experiences", title: "Pattern → experience", layers: ["pattern"], intro: "Which experience uses which pattern, and where a difference is intentional." },
          { id: "graph-screens", title: "Experience → screen", layers: ["experience-pattern"], intro: "How experience guidance reaches real routes. No route is modified." },
        ].map((group) => (
          <RefSection
            key={group.id}
            id={group.id}
            eyebrow="Phase 9 integration"
            title={group.title}
            intro={group.intro}
          >
            <SpecMatrixTable
              columns={["From", "Relation", "To", "Evidence", "Ownership"]}
              rows={GRAPH_EDGES.filter((e) => group.layers.includes(GRAPH_NODES.find((n) => n.id === e.from)?.layer ?? "")).map((e, i) => ({
                key: `${e.from}-${e.to}-${i}`,
                cells: [nodeName(e.from), e.relation, nodeName(e.to), e.evidence, e.ownership],
                label: e.status,
                note: e.note,
              }))}
            />
          </RefSection>
        ))}

        <RefSection
          id="graph-chains"
          eyebrow="Phase 9 integration"
          title="Traced chains"
          intro="Complete walks through the graph, assembled from the same edges shown above so they cannot drift apart from the model."
        >
          <DependencyChainList chains={TRACED_CHAINS} />
        </RefSection>

        <RefSection
          id="graph-traceability"
          eyebrow="Phase 9 integration"
          title="Screen traceability"
          intro="Representative surfaces from every experience, each with the patterns, components and foundation values it depends on, its known variations and its ownership boundary."
        >
          <TraceabilityCard records={SCREEN_TRACEABILITY} />
        </RefSection>

        <RefSection
          id="graph-consumers"
          eyebrow="Phase 9 integration"
          title="Consumer graph"
          intro="Measured consumers from the Phase 5 audit. Direct, indirect, route-local and reference-only usage are kept apart, and reference-page usage is never counted as production consumption."
        >
          <SpecMatrixTable
            columns={["Component", "Source", "Kind", "Measured"]}
            rows={CONSUMER_GRAPH.map((c, i) => ({
              key: `${c.component}-${c.kind}-${i}`,
              cells: [c.component, c.source, c.kind, c.measured],
              label: c.status,
              note: c.note,
            }))}
          />
        </RefSection>

        <RefSection
          id="graph-duplicates"
          eyebrow="Phase 9 integration"
          title="Duplicates inside the graph"
          intro="Several implementations may map to one future conceptual role. The graph draws all of them. It carries no ordering, score or preference, and implies no migration."
        >
          <DuplicateRegisterTable
            entries={DUPLICATE_MAPPINGS.map((d) => ({
              area: d.conceptualRole,
              implementations: d.implementations.map((i) => ({ name: i.name, source: i.source, scope: i.measured })),
              overlap: d.graphEffect,
              future: d.futureRole,
              label: d.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={DUPLICATE_GRAPH_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="graph-kits"
          eyebrow="Phase 9 integration"
          title="Route-local kits & shells"
          intro="Where the module kits and the three shells sit in the model. Nothing is merged, moved or rewritten."
        >
          <SpecMatrixTable
            columns={["From", "Relation", "To", "Evidence", "Ownership"]}
            rows={GRAPH_EDGES.filter((e) => e.from.startsWith("kit.") || e.from.startsWith("shell.") || e.to.startsWith("kit.") || e.to.startsWith("shell.")).map((e, i) => ({
              key: `kit-${e.from}-${e.to}-${i}`,
              cells: [nodeName(e.from), e.relation, nodeName(e.to), e.evidence, e.ownership],
              label: e.status,
              note: e.note,
            }))}
          />
          <div className="mt-4">
            <RuleList items={KIT_ARCHITECTURE_RULES.map((r) => `${r.status} — ${r.rule}`)} />
          </div>
        </RefSection>

        <RefSection
          id="graph-brand"
          eyebrow="Phase 9 integration"
          title="Brand & asset boundary"
          intro="The direction of dependency between the design-system foundation and the runtime features. A tenant value fills a role; it never becomes a token."
        >
          <SpecMatrixTable
            columns={["From", "To", "Direction", "Rule"]}
            rows={BRAND_BOUNDARY.map((b, i) => ({
              key: `${b.from}-${i}`,
              cells: [b.from, b.to, b.direction, b.rule],
              label: b.status,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Layer", "Owned by", "Changes require", "Outside the system"]}
              rows={OWNERSHIP_MODEL.map((o) => ({
                key: o.layer,
                cells: [o.layer, o.ownedBy, o.changesRequire, o.outsideTheSystem],
                label: o.status,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="graph-a11y"
          eyebrow="Phase 9 integration"
          title="Accessibility traceability"
          intro="Accessibility followed through the chain, with current behavior, observed gaps and future governance kept apart."
        >
          <SpecMatrixTable
            columns={["Chain", "Requirement", "Current implementation", "Observed gap", "Future governance"]}
            rows={ACCESSIBILITY_TRACES.map((a) => ({
              key: a.chain,
              cells: [a.chain, a.requirement, a.currentImplementation, a.observedGap, a.futureGovernance],
              label: a.status,
            }))}
          />
        </RefSection>

        <RefSection
          id="graph-responsive"
          eyebrow="Phase 9 integration"
          title="Responsive traceability"
          intro="Which layer owns which responsive decision, using the existing breakpoint evidence. No breakpoint is introduced and no behavior changes."
        >
          <SpecMatrixTable
            columns={["Layer", "Belongs here", "Does not belong here", "Current evidence"]}
            rows={RESPONSIVE_OWNERSHIP.map((r) => ({
              key: r.layer,
              cells: [r.layer, r.belongsHere, r.doesNotBelongHere, r.currentEvidence],
              label: r.status,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Chain", "Behavior"]}
              rows={RESPONSIVE_TRACES.map((r) => ({ key: r.chain, cells: [r.chain, r.behavior], label: r.status }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="graph-type"
          eyebrow="Phase 9 integration"
          title="Typography traceability"
          intro="Each type role followed to the components, patterns and screens that use it. Existing variation is preserved, not normalized."
        >
          <SpecMatrixTable
            columns={["Role", "Foundation", "Component", "Pattern", "Screen", "Variation"]}
            rows={TYPOGRAPHY_TRACES.map((t) => ({
              key: t.role,
              cells: [t.role, t.foundation, t.component, t.pattern, t.screen, t.variation],
              label: t.status,
            }))}
          />
        </RefSection>

        <RefSection
          id="graph-space"
          eyebrow="Phase 9 integration"
          title="Spacing traceability"
          intro="Each spacing relationship followed through the layers, with the measured occurrence counts from the Phase 2 audit."
        >
          <SpecMatrixTable
            columns={["Relationship", "Foundation", "Component", "Pattern", "Screen", "Variation"]}
            rows={SPACING_TRACES.map((t) => ({
              key: t.relationship,
              cells: [t.relationship, t.foundation, t.component, t.pattern, t.screen, t.variation],
              label: t.status,
            }))}
          />
        </RefSection>

        <RefSection
          id="graph-figma"
          eyebrow="Phase 9 integration"
          title="Figma traceability"
          intro="The same chain expressed against the design-file blueprint, including what each layer loses in translation. Nothing exists in Figma."
        >
          <SpecMatrixTable
            columns={["Layer", "In code", "In a design file", "Translation loss"]}
            rows={FIGMA_TRACES.map((f) => ({
              key: f.layer,
              cells: [f.layer, f.codeSide, f.figmaSide, f.translationLoss],
              label: f.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={FIGMA_GRAPH_RULES} tone="warning" />
          </div>
        </RefSection>

        <RefSection
          id="graph-impact"
          eyebrow="Phase 9 integration"
          title="Change impact"
          intro="What each change could reach, computed by walking the edges rather than written by hand. Where the graph cannot answer safely it says so instead of guessing."
        >
          <ImpactTable records={IMPACT_MODEL} />
        </RefSection>

        <RefSection
          id="graph-governance"
          eyebrow="Phase 9 integration"
          title="Change propagation & ownership"
          intro="How a change at one layer spreads, where it should be reviewed, and who owns the decision."
        >
          <SpecMatrixTable
            columns={["Change at", "Propagates to", "Review point", "Owner"]}
            rows={PROPAGATION_RULES.map((p) => ({
              key: p.changeAt,
              cells: [p.changeAt, p.propagatesTo, p.reviewPoint, p.owner],
              label: p.status,
            }))}
          />
          <div className="mt-4">
            <SpecMatrixTable
              columns={["Pattern", "Shared across", "Specific to", "Boundary"]}
              rows={SHARED_VERSUS_SPECIFIC.map((s) => ({
                key: s.pattern,
                cells: [s.pattern, s.sharedAcross, s.specificTo, s.boundary],
                label: s.status,
              }))}
            />
          </div>
        </RefSection>

        <RefSection
          id="graph-migration"
          eyebrow="Phase 9 integration"
          title="Migration boundary"
          intro="Conceptual stages only. None has been started, no component is named as first, and nothing is ranked."
        >
          <DefinitionRows
            rows={MIGRATION_STAGES.map((m) => ({
              term: `${m.stage}. ${m.name}`,
              detail: m.meaning,
              meta: m.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={MIGRATION_BOUNDARY} tone="warning" />
          </div>
        </RefSection>

        {/* ---------------- Phase 10 — pattern & experience architecture ---------------- */}

        <RefSection
          id="pat-taxonomy"
          eyebrow="Phase 10 patterns"
          title="Pattern taxonomy"
          intro="A pattern is a recurring arrangement that solves one screen problem. Repeated markup is not enough, and visual similarity is never evidence. Where the code does not support a pattern, the record says so instead of guessing."
        >
          <DefinitionRows
            rows={[
              { term: "Patterns recorded", detail: `${PATTERN_SUMMARY.patterns} across ${PATTERN_SUMMARY.categories} categories` },
              { term: "Current implementation", detail: `${PATTERN_SUMMARY.current} patterns` },
              { term: "Variation, duplicate or overlap", detail: `${PATTERN_SUMMARY.variationsOrDuplicates} patterns`, meta: "kept as they are; no winner chosen" },
              { term: "Unowned", detail: `${PATTERN_SUMMARY.unowned} patterns with no owning component` },
              { term: "Open", detail: `${PATTERN_SUMMARY.open} recorded as FUTURE DECISION or FUTURE CANONICAL TARGET` },
              { term: "Evidence recorded", detail: `${PATTERN_SUMMARY.anatomyParts} anatomy parts, ${PATTERN_SUMMARY.variants} variants, ${PATTERN_SUMMARY.states} states, ${PATTERN_SUMMARY.responsiveRecords} responsive records, ${PATTERN_SUMMARY.densityRecords} density records` },
              { term: "Registry integrity", detail: REGISTRY_INTEGRITY.specsWithoutGraphNode.length === 0 && REGISTRY_INTEGRITY.graphNodesWithoutSpec.length === 0 ? "Every pattern id exists in both the Phase 9 graph and the Phase 10 specification." : `Specs without a graph node: ${REGISTRY_INTEGRITY.specsWithoutGraphNode.join(", ") || "none"}. Graph nodes without a spec: ${REGISTRY_INTEGRITY.graphNodesWithoutSpec.join(", ") || "none"}.` },
            ]}
          />
          {PATTERN_TAXONOMY.filter((g) => g.patterns.length > 0).map((group) => (
            <div key={group.category} className="mt-6">
              <p className="text-eyebrow">{group.title}</p>
              <div className="mt-3">
                <SpecMatrixTable
                  columns={["Pattern", "Problem it solves", "Ownership", "Evidence"]}
                  rows={group.patterns.map((p) => ({
                    key: p.id,
                    cells: [p.name, p.problem, String(p.ownership), p.evidence],
                    label: p.status,
                    note: p.note,
                  }))}
                />
              </div>
            </div>
          ))}
          <div className="mt-4">
            <RuleList items={REGISTRY_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="pat-anatomy"
          eyebrow="Phase 10 patterns"
          title="Pattern anatomy"
          intro="The named parts of each pattern, in the order the code renders them, with the component that fills each slot. A slot with no owner says so."
        >
          {PATTERN_ANATOMY.map((record) => (
            <div key={record.patternId} className="mb-6 rounded-2xl border border-hairline bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{record.name}</p>
                <ArchLabelChip label={record.status} />
              </div>
              <p className="text-serial mt-1">{record.order}</p>
              <div className="mt-4">
                <SpecMatrixTable
                  columns={["Part", "Filled by", "Required", "Evidence"]}
                  rows={record.parts.map((part) => ({
                    key: `${record.patternId}-${part.part}`,
                    cells: [part.part, part.filledBy, part.required ? "required" : "optional", part.evidence],
                    label: part.status,
                    note: part.note,
                  }))}
                />
              </div>
            </div>
          ))}
        </RefSection>

        <RefSection
          id="pat-composition"
          eyebrow="Phase 10 patterns"
          title="Pattern composition"
          intro="Pattern, compound, component, semantic role and foundation, computed by walking the Phase 9 graph. This view declares no relationships of its own, so the two phases cannot drift apart."
        >
          <SpecMatrixTable
            columns={["Pattern", "Compound", "Components", "Roles", "Foundations", "Evidence"]}
            rows={PATTERN_COMPOSITION.map((row, i) => ({
              key: `${row.patternId}-${row.compound}-${i}`,
              cells: [
                row.pattern,
                row.compound,
                row.components.join(", ") || "no component edge",
                row.roles.join(", ") || "no role edge",
                row.foundations.join(", ") || "no foundation edge",
                row.evidence,
              ],
              label: row.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={PATTERN_COMPOSITION_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="pat-variants"
          eyebrow="Phase 10 patterns"
          title="Pattern variants"
          intro="Structural differences that genuinely exist. Each entry records why both forms are kept. Frequency is evidence of reach, never of correctness, so no winner is chosen here."
        >
          <SpecMatrixTable
            columns={["Pattern", "Variant", "Difference", "Seen in", "Kept because"]}
            rows={PATTERN_VARIANTS.map((v, i) => ({
              key: `${v.patternId}-${v.variant}-${i}`,
              cells: [v.patternId.replace("pat.", ""), v.variant, v.difference, v.seenIn, v.keptBecause],
              label: v.status,
            }))}
          />
        </RefSection>

        <RefSection
          id="pat-states"
          eyebrow="Phase 10 patterns"
          title="Pattern states"
          intro="Only states the code actually handles. A state the code does not handle is recorded as absent rather than described."
        >
          <SpecMatrixTable
            columns={["Pattern", "State", "Behavior", "Evidence"]}
            rows={PATTERN_STATES.map((st, i) => ({
              key: `${st.patternId}-${st.state}-${i}`,
              cells: [st.patternId.replace("pat.", ""), st.state, st.behavior, st.evidence],
              label: st.status,
            }))}
          />
        </RefSection>

        <RefSection
          id="pat-responsive"
          eyebrow="Phase 10 patterns"
          title="Pattern responsive behaviour"
          intro="Transcribed from the breakpoint classes the code already carries. No breakpoint is introduced and nothing is normalised."
        >
          <SpecMatrixTable
            columns={["Pattern", "Breakpoint", "Structural change", "Desktop", "Tablet", "Mobile", "Stacks", "Collapses", "Reorders", "Density"]}
            rows={PATTERN_RESPONSIVE.map((r, i) => ({
              key: `${r.patternId}-${i}`,
              cells: [
                r.patternId.replace("pat.", ""),
                r.breakpoint,
                r.structuralChange,
                r.desktop,
                r.tablet,
                r.mobile,
                r.columnsStack ? "yes" : "no",
                r.controlsCollapse ? "yes" : "no",
                r.reorders ? "yes" : "no",
                r.densityChanges ? "changes" : "same",
              ],
              label: r.status,
              note: r.evidence,
            }))}
          />
          <div className="mt-4">
            <RuleList items={RESPONSIVE_PATTERN_NOTES} tone="warning" />
          </div>
        </RefSection>

        <RefSection
          id="pat-density"
          eyebrow="Phase 10 patterns"
          title="Pattern density"
          intro="Control height, padding, gap, type and icon size per density mode, exactly as the code has them. Differences are preserved, not reconciled."
        >
          <SpecMatrixTable
            columns={["Pattern", "Mode", "Control height", "Padding", "Gap", "Typography", "Icon", "Evidence"]}
            rows={PATTERN_DENSITY.map((d, i) => ({
              key: `${d.patternId}-${d.mode}-${i}`,
              cells: [d.patternId.replace("pat.", ""), d.mode, d.controlHeight, d.padding, d.gap, d.typography, d.iconSize, d.evidence],
              label: d.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={DENSITY_OPEN_QUESTIONS} tone="warning" />
          </div>
        </RefSection>

        <RefSection
          id="pat-experience"
          eyebrow="Phase 10 patterns"
          title="Experience patterns"
          intro="A pattern specialised for one experience: same anatomy, different composition, density or wording. Intentional differences are preserved."
        >
          <SpecMatrixTable
            columns={["Experience", "Pattern", "Purpose", "Composition", "Responsive", "Screens", "Ownership"]}
            rows={EXPERIENCE_PATTERNS.map((e, i) => ({
              key: `${e.experienceId}-${e.patternId}-${i}`,
              cells: [
                e.experienceId.replace("exp.", ""),
                e.patternId.replace("pat.", ""),
                e.purpose,
                e.composition,
                e.responsive,
                e.screens.join(", "),
                e.ownership,
              ],
              label: e.status,
              note: e.variations.length > 0 ? e.variations.join(" · ") : e.note,
            }))}
          />
        </RefSection>

        <RefSection
          id="pat-extensions"
          eyebrow="Phase 10 patterns"
          title="Experience extensions"
          intro="Where one core pattern behaves differently by experience. An extension keeps the anatomy; a separate system is only recorded where the code really shows two independent implementations."
        >
          <SpecMatrixTable
            columns={["Core pattern", "Experience A", "Behaviour A", "Experience B", "Behaviour B", "Classification", "Evidence"]}
            rows={EXPERIENCE_EXTENSIONS.map((e, i) => ({
              key: `${e.corePattern}-${i}`,
              cells: [e.corePattern.replace("pat.", ""), e.experienceA, e.behaviorA, e.experienceB, e.behaviorB, e.classification, e.evidence],
              label: e.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={EXTENSION_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="pat-screens"
          eyebrow="Phase 10 patterns"
          title="Screen to pattern traceability"
          intro="Representative routes followed down through experience, pattern, compound, component, role and foundation. Routes and relationships come from the Phase 9 graph; nothing is re-declared here."
        >
          <div className="space-y-3">
            {SCREEN_PATTERN_MAP.map((trace) => (
              <div key={trace.screenId} className="rounded-2xl border border-hairline bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{trace.route}</p>
                  <MetaChip tone="muted">{trace.experienceId.replace("exp.", "")}</MetaChip>
                  <ArchLabelChip label={trace.status} />
                </div>
                <p className="text-serial mt-2">{chainForScreen(trace.screenId).join(" → ")}</p>
                <dl className="mt-4 grid gap-2 md:grid-cols-4">
                  {[
                    ["Patterns", trace.patternIds.map((p) => p.replace("pat.", ""))],
                    ["Compounds", trace.compounds],
                    ["Components", trace.components],
                    ["Foundation", trace.foundations],
                  ].map(([term, items]) => (
                    <div key={term as string} className="rounded-xl border border-hairline p-3">
                      <dt className="text-eyebrow">{term as string}</dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {(items as string[]).length === 0 ? "no edge recorded" : (items as string[]).join(", ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <RuleList items={SCREEN_MAP_RULES} />
          </div>
        </RefSection>

        <RefSection
          id="pat-duplicates"
          eyebrow="Phase 10 patterns"
          title="Pattern duplicate and overlap register"
          intro="Pattern-level duplication, listed beside the implementations that produce it. Nothing is ranked, scored, merged, renamed, deleted or migrated."
        >
          <DuplicateRegisterTable
            entries={PATTERN_DUPLICATES.map((d) => ({
              area: d.concept,
              implementations: d.implementations.map((i) => ({ name: i.name, source: i.source, scope: i.consumers })),
              overlap: d.differences,
              future: d.resolution === "unresolved" ? "Unresolved — needs an explicit decision" : "Observed and accepted",
              label: d.status,
            }))}
          />
          <div className="mt-4">
            <RuleList items={DUPLICATE_HANDLING_RULES} tone="warning" />
          </div>
        </RefSection>

        <RefSection
          id="pat-governance"
          eyebrow="Phase 10 patterns"
          title="Pattern governance"
          intro="How future pattern work should be conducted. These rules are documentation; no build step enforces them and nothing shipping changes because of them."
        >
          {[
            { title: "Component, compound, pattern or experience pattern", rows: PATTERN_DEFINITION_RULES },
            { title: "Evidence required before canonicalisation", rows: CANONICALIZATION_EVIDENCE },
            { title: "Ownership", rows: PATTERN_OWNERSHIP_RULES },
            { title: "Documentation duties", rows: PATTERN_DOCUMENTATION_DUTIES },
          ].map((block) => (
            <div key={block.title} className="mt-6">
              <p className="text-eyebrow">{block.title}</p>
              <div className="mt-3">
                <SpecMatrixTable
                  columns={["Question", "Rule"]}
                  rows={block.rows.map((r) => ({ key: r.question, cells: [r.question, r.rule], label: r.status }))}
                />
              </div>
            </div>
          ))}
          <div className="mt-6">
            <RuleList items={APPROVAL_GATE} tone="warning" />
          </div>
        </RefSection>

        <RefSection
          id="pat-figma"
          eyebrow="Phase 10 patterns"
          title="Future Figma pattern blueprint"
          intro="A proposal for how each pattern would become a Figma component set. Nothing exists in Figma: no file, component, variant, style or asset has been created."
        >
          <SpecMatrixTable
            columns={["Pattern", "Proposed structure", "Variant properties", "State properties", "Responsive", "Density", "Content model"]}
            rows={PATTERN_FIGMA_MAPPINGS.map((f) => ({
              key: f.patternId,
              cells: [
                f.patternId.replace("pat.", ""),
                f.figmaStructure,
                f.variantProperties.join(", ") || "none",
                f.stateProperties.join(", ") || "none",
                f.responsiveVariants,
                f.densityVariants,
                f.contentModel,
              ],
              label: f.status,
              note: f.componentProperties.join(" · "),
            }))}
          />
          <div className="mt-4">
            <RuleList items={FIGMA_PATTERN_RULES} tone="warning" />
          </div>
          <div className="mt-4">
            <DefinitionRows
              rows={[
                { term: "Dossiers assembled", detail: `${PATTERN_DOSSIERS.length} patterns, each joining specification, graph node, anatomy, variants, states, responsive, density, composition, experiences and Figma proposal.` },
              ]}
            />
          </div>
        </RefSection>
      </RefContainer>
    </RefPage>
  );
}

function RadiusValue({ name }: { name: string }) {
  const value = useTokenValue(name);
  return <span className="text-serial">{value || name}</span>;
}
