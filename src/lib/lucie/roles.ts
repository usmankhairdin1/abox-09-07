/** Lucie role and access baseline (6 templates). */
export interface RoleBaseline {
  roleId: string;
  role: string;
  scope: string;
  allowed: string;
  restricted: string;
}

export const ROLE_BASELINE: RoleBaseline[] = [
  {
    "roleId": "ROLE-JET-ADMIN",
    "role": "JET Platform Administrator",
    "scope": "All configured Lucie tenants and platform operations",
    "allowed": "Tenants, agencies, users, product data, pathways, disclaimers, templates, integrations, PlanAI, audit, reports, release controls",
    "restricted": "Cannot bypass audit, consent, data-protection or production locks."
  },
  {
    "roleId": "ROLE-AGENCY-ADMIN",
    "role": "Agency Administrator",
    "scope": "Own agency and permitted downlines",
    "allowed": "Agency profile, roster, basic roles, branding, product access, routing, templates, reports and compliance readiness",
    "restricted": "Cannot edit JET-locked product facts, deep PlanAI controls, cross-tenant data or platform secrets."
  },
  {
    "roleId": "ROLE-SELLING-AGENT",
    "role": "Selling Agent",
    "scope": "Assigned/permitted agency, marketplace, lead and product contexts",
    "allowed": "Leads, quotes, compare, cart, applications, shared quotes, notes, tasks, communications and permitted ICHRA work",
    "restricted": "Blocked when license, appointment, captive or sellability rules fail."
  },
  {
    "roleId": "ROLE-UNLICENSED-STAFF",
    "role": "Unlicensed Agency Staff",
    "scope": "Permitted support and administrative records",
    "allowed": "Lead intake, notes, tasks, documents, scheduling/help and non-selling support actions",
    "restricted": "Cannot recommend, quote as producer, select plans for a consumer, attest or submit regulated transactions."
  },
  {
    "roleId": "ROLE-CONSUMER",
    "role": "Consumer",
    "scope": "Own identity, household and shopping/application records",
    "allowed": "Shop, quote, compare, cart, register, save/resume, review shared quote, complete permitted fixed applications and e-sign",
    "restricted": "Cannot access internal agency data, sellability details, other consumers or operational configuration."
  },
  {
    "roleId": "ROLE-EMPLOYER",
    "role": "Employer Contact",
    "scope": "Own employer account, census, contribution strategy and ICHRA quote",
    "allowed": "Manage permitted employer quote inputs, compare proposals and express interest",
    "restricted": "No employee enrollment administration, agency operations or other employer accounts."
  }
];
