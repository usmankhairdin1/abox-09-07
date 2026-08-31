import { ADMIN } from "./admin";
import { AGENCY } from "./agency";
import { AI } from "./ai";
import { COMMISSIONS } from "./commissions";
import { COMMS } from "./comms";
import { FORM_CONFIGURATOR } from "./form-configurator";
import { OFF_EXCHANGE } from "./off-exchange";
import { OUTPUTS } from "./outputs";
import { PAPER } from "./paper";
import { PRODUCTS } from "./products";
import type { P1Group, P1Screen } from "./types";

export * from "./types";

/** Ordered exactly as requested: groups 1 through 10. */
export const P1_SCREENS: P1Screen[] = [
  ...OFF_EXCHANGE,
  ...FORM_CONFIGURATOR,
  ...PRODUCTS,
  ...AGENCY,
  ...PAPER,
  ...COMMISSIONS,
  ...COMMS,
  ...OUTPUTS,
  ...AI,
  ...ADMIN,
];

export const P1_GROUP_ORDER: P1Group[] = [
  "Off-exchange enrollment",
  "Form configurator",
  "Products, plans & rates",
  "Agency & agent management",
  "Appointments, paper, referrals & splits",
  "Commissions & revenue",
  "Notifications, comms & scheduling",
  "Outputs, documents & reporting",
  "AI, Plan-AI & governance",
  "Admin, configuration, integrations & audit",
];

export const P1_BY_SLUG: Record<string, P1Screen> = Object.fromEntries(
  P1_SCREENS.map((s) => [s.slug, s]),
);

export const P1_SLUGS = P1_SCREENS.map((s) => s.slug);

export function p1ByGroup(group: P1Group): P1Screen[] {
  return P1_SCREENS.filter((s) => s.group === group);
}

export const P1_GROUPS = P1_GROUP_ORDER.map((group) => ({ group, screens: p1ByGroup(group) }));
