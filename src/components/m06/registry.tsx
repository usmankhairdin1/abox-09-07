import type { ComponentType } from "react";

import { M06_INDEX } from "@/lib/governed/m06.index";
import type { M06ScreenProps } from "@/components/m06/screens/common";
import {
  AddPersonWizard,
  AgencyAdministrationHome,
  AgencyDefaults,
  AgencyProfile,
  AgencyRoster,
  AgentProfile,
  AgentWorkspace,
  RosterOnlyConversion,
} from "@/components/m06/screens/roster";
import {
  AccessAudit,
  CustomRoleBuilder,
  EffectiveAccessInspector,
  RoleAssignments,
  RolesAndAccessHome,
  RoleVersionCompare,
  SystemRoleDetail,
} from "@/components/m06/screens/access";
import {
  BusinessUnitDetail,
  BusinessUnits,
  TeamDetail,
  Teams,
} from "@/components/m06/screens/structure";
import {
  OffboardingCase,
  OnboardingCases,
  TasksAndExceptions,
  TransferCase,
} from "@/components/m06/screens/lifecycle";
import {
  CredentialSellingSetup,
  OperationalEligibilityDetail,
  ReadinessDetail,
  ReferralLinkComponent,
} from "@/components/m06/screens/readiness";
import {
  DuplicateReview,
  ExportRequest,
  FixedReports,
  ImportResults,
  ImportRoster,
  NotificationPreferences,
  SupportContext,
} from "@/components/m06/screens/dataops";

const COMPONENTS: Record<string, ComponentType<M06ScreenProps>> = {
  "SCR-M06-001": AgencyAdministrationHome,
  "SCR-M06-002": AgencyRoster,
  "SCR-M06-003": AgentProfile,
  "SCR-M06-004": AgencyProfile,
  "SCR-M06-005": (props) => <AddPersonWizard {...props} />,
  "SCR-M06-006": (props) => <AddPersonWizard {...props} staff />,
  "SCR-M06-007": RosterOnlyConversion,
  "SCR-M06-008": RolesAndAccessHome,
  "SCR-M06-009": SystemRoleDetail,
  "SCR-M06-010": CustomRoleBuilder,
  "SCR-M06-011": RoleVersionCompare,
  "SCR-M06-012": RoleAssignments,
  "SCR-M06-013": EffectiveAccessInspector,
  "SCR-M06-014": AccessAudit,
  "SCR-M06-015": BusinessUnits,
  "SCR-M06-016": BusinessUnitDetail,
  "SCR-M06-017": Teams,
  "SCR-M06-018": TeamDetail,
  "SCR-M06-019": OnboardingCases,
  "SCR-M06-020": TransferCase,
  "SCR-M06-021": OffboardingCase,
  "SCR-M06-022": TasksAndExceptions,
  "SCR-M06-023": ReadinessDetail,
  "SCR-M06-024": OperationalEligibilityDetail,
  "SCR-M06-025": ReferralLinkComponent,
  "SCR-M06-026": CredentialSellingSetup,
  "SCR-M06-027": ImportRoster,
  "SCR-M06-028": ImportResults,
  "SCR-M06-029": ExportRequest,
  "SCR-M06-030": FixedReports,
  "SCR-M06-031": NotificationPreferences,
  "SCR-M06-032": SupportContext,
  "SCR-M06-033": DuplicateReview,
  "SCR-M06-034": AgencyDefaults,
  "SCR-M06-035": AgentWorkspace,
};

export interface M06ScreenEntry {
  id: string;
  key: string;
  name: string;
  purpose: string;
  workspace: string;
  permission: string;
  Component: ComponentType<M06ScreenProps>;
}

function keyOf(route: string) {
  return route.split("/").filter(Boolean).pop() ?? "";
}

export const M06_SCREENS: M06ScreenEntry[] = (M06_INDEX.screens ?? [])
  .filter((s) => COMPONENTS[s.id])
  .map((s) => ({
    id: s.id,
    key: keyOf(s.route ?? s.slug ?? s.id),
    name: s.name,
    purpose: s.purpose ?? "",
    workspace: s.workspace ?? "",
    permission: (s.roles ?? [])[0] ?? "workforce.profile.read",
    Component: COMPONENTS[s.id],
  }));

export function findM06Screen(key: string) {
  return M06_SCREENS.find((s) => s.key === key || s.id.toLowerCase() === key.toLowerCase());
}

export const M06_WORKSPACE_NAMES: Record<string, string> = Object.fromEntries(
  (M06_INDEX.workspaces ?? []).map((w) => [w.workspace_id, w.name]),
);
