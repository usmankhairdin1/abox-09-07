import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { RolesAndAccessHome, SystemRoleDetail, CustomRoleBuilder, RoleVersionCompare, RoleAssignments, EffectiveAccessInspector, AccessAudit } from "@/components/m06/screens/access";

const TITLE = "Roles and access — ABox";
const DESC = "Role catalogue, scoped assignment, effective access and the access audit trail.";

export const Route = createFileRoute("/agency/workforce/access")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <WorkforcePage title="Roles and access" lede={DESC} screens={[RolesAndAccessHome, SystemRoleDetail, CustomRoleBuilder, RoleVersionCompare, RoleAssignments, EffectiveAccessInspector, AccessAudit]} />,
});
