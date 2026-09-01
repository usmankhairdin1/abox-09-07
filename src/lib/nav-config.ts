/**
 * Workspace + navigation configuration.
 * ACL/role-driven filtering is applied at render time. Labels here are
 * defaults; a JET admin can override via Branding/Config in Phase 1.
 */
import type { ComponentType } from "react";
import {
  Home,
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquare,
  CheckSquare,
  DollarSign,
  FileText,
  Building2,
  UserCheck,
  Percent,
  Receipt,
  Package,
  Wrench,
  Handshake,
  FileCog,
  Bell,
  Palette,
  Shield,
  History,
  Sparkles,
  Plug,
  Briefcase,
  Landmark,
  Settings,
  Zap,
  Network,
  GitBranch,
  UserCircle,
  Upload,
  ListTodo,
  Store,
  ListTree,
  Link as LinkIcon,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export type WorkspaceKey =
  | "agent"
  | "agency"
  | "jet"
  | "carrier"
  | "employer"
  | "partner";

export interface NavItem {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  scrId?: string;
  badge?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface WorkspaceConfig {
  key: WorkspaceKey;
  name: string;
  tagline: string;
  sections: NavSection[];
}

export const WORKSPACES: WorkspaceConfig[] = [
  {
    key: "agent",
    name: "Agent Workspace",
    tagline: "Sell, quote, and follow up",
    sections: [
      {
        label: "Today",
        items: [
          { label: "My Work", to: "/app/my-work", icon: Home, scrId: "SCR_APP_MY_WORK" },
          { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard, scrId: "SCR_APP_DASHBOARD" },
        ],
      },
      {
        label: "Selling",
        items: [
          { label: "Quick Quote", to: "/app/quick-quote", icon: Zap, scrId: "UX-017" },
          { label: "Send Quote", to: "/app/send-quote", icon: FileText, scrId: "UX-019" },
          { label: "Off-Exchange", to: "/app/off-exchange", icon: Briefcase, scrId: "SCR_APP_OFF_EXCHANGE" },
        ],
      },
      {
        label: "Relationships",
        items: [
          { label: "Customers & Leads", to: "/app/customers", icon: Users, scrId: "SCR_APP_CUSTOMERS" },
          { label: "Communications", to: "/app/communications", icon: MessageSquare, scrId: "SCR_APP_COMMUNICATIONS" },
          { label: "Tasks", to: "/app/tasks", icon: CheckSquare, scrId: "SCR_APP_TASKS" },
          { label: "Schedule", to: "/app/schedule", icon: ClipboardList, scrId: "UX-022" },
        ],
      },
      {
        label: "Earnings",
        items: [
          { label: "Commissions", to: "/app/commissions", icon: DollarSign, scrId: "SCR_APP_COMMISSIONS" },
        ],
      },
    ],
  },
  {
    key: "agency",
    name: "Agency Workspace",
    tagline: "Run the agency and network",
    sections: [
      {
        label: "Overview",
        items: [
          { label: "Agency Home", to: "/app/agency", icon: Home, scrId: "SCR_AGENCY_SETUP" },
        ],
      },
      {
        label: "Organization (M05)",
        items: [
          { label: "Root Agency Admin", to: "/agency/organization-admin", icon: Home, scrId: "SCR-M05-002" },
          { label: "My Organization", to: "/agency/my-organization", icon: UserCircle, scrId: "SCR-M05-003" },
          { label: "Organization Directory", to: "/agency/organizations", icon: Network, scrId: "SCR-M05-004" },
          { label: "Organization Structure", to: "/agency/organization-structure", icon: GitBranch, scrId: "SCR-M05-005" },
          { label: "Imports", to: "/agency/organization-imports", icon: Upload, scrId: "SCR-M05-023" },
          { label: "Tasks & Exceptions", to: "/agency/organization-work", icon: ListTodo, scrId: "SCR-M05-026" },
          { label: "Reference Organizations", to: "/agency/reference-organizations/request", icon: Handshake, scrId: "SCR-M05-029" },
        ],
      },
      {
        label: "Marketplace (M04)",
        items: [
          { label: "Marketplace Admin", to: "/marketplace/admin", icon: Store, scrId: "SCR-M04-002" },
          { label: "My Participation", to: "/agency/marketplace-participation", icon: UserCircle, scrId: "SCR-M04-003" },
          { label: "Availability", to: "/marketplace/admin/availability", icon: ListTree, scrId: "SCR-M04-009" },
          { label: "Participants", to: "/marketplace/admin/participants", icon: Users, scrId: "SCR-M04-011" },
          { label: "Referral Links", to: "/marketplace/admin/referral-links", icon: LinkIcon, scrId: "SCR-M04-013" },
          { label: "Readiness", to: "/marketplace/admin/readiness", icon: ShieldCheck, scrId: "SCR-M04-016" },
        ],
      },
      {
        label: "Workforce & Network",
        items: [
          { label: "Workforce Home", to: "/agency/workforce", icon: Home, scrId: "SCR-M06-001" },
          { label: "Roster", to: "/agency/workforce/roster", icon: Users, scrId: "SCR-M06-002" },
          { label: "Person Record", to: "/agency/workforce/person", icon: UserCircle, scrId: "SCR-M06-003" },
          { label: "Onboarding", to: "/agency/workforce/onboarding", icon: UserCheck, scrId: "SCR-M06-005" },
          { label: "Business Units & Teams", to: "/agency/workforce/structure", icon: GitBranch, scrId: "SCR-M06-015" },
          { label: "Lifecycle Cases", to: "/agency/workforce/lifecycle", icon: ListTree, scrId: "SCR-M06-019" },
          { label: "Readiness & Eligibility", to: "/agency/workforce/readiness", icon: ShieldCheck, scrId: "SCR-M06-023" },
          { label: "Roles & Access", to: "/agency/workforce/access", icon: Shield, scrId: "SCR-M06-008" },
          { label: "Tasks & Exceptions", to: "/agency/workforce/work", icon: ListTodo, scrId: "SCR-M06-027" },
          { label: "Imports & Reports", to: "/agency/workforce/data", icon: Upload, scrId: "SCR-M06-029" },
          { label: "Workforce Settings", to: "/agency/workforce/settings", icon: Settings, scrId: "SCR-M06-004" },
        ],
      },
      {

        label: "Structure",
        items: [
          { label: "Entities & Hierarchy", to: "/app/agency/entities", icon: Building2, scrId: "SCR_AGENCY_SETUP" },
          { label: "Producers & Licenses", to: "/app/agency/producers", icon: UserCheck, scrId: "SCR_AGENCY_PRODUCERS" },
        ],
      },
      {
        label: "Money",
        items: [
          { label: "Revenue & Referrals", to: "/app/agency/revenue", icon: Percent, scrId: "SCR_AGENCY_REVENUE" },
          { label: "Statements", to: "/app/agency/statements", icon: Receipt, scrId: "SCR_AGENCY_STATEMENTS" },
        ],
      },
    ],
  },
  {
    key: "jet",
    name: "JET Platform",
    tagline: "Configure the platform",
    sections: [
      {
        label: "Catalog",
        items: [
          { label: "Products", to: "/app/jet/products", icon: Package, scrId: "SCR_JET_PRODUCTS" },
          { label: "Product Builder", to: "/app/jet/product-builder", icon: Wrench, scrId: "SCR_JET_PRODUCT_BUILDER" },
          { label: "Carrier Appointments", to: "/app/jet/appointments", icon: Handshake, scrId: "SCR_JET_APPOINTMENTS" },
        ],
      },
      {
        label: "Configuration",
        items: [
          { label: "Form Configurator", to: "/app/jet/form-configurator", icon: FileCog, scrId: "SCR_JET_FORM_CONFIG" },
          { label: "Notifications", to: "/app/jet/notifications", icon: Bell, scrId: "SCR_JET_NOTIFICATIONS" },
          { label: "Branding & White-Label", to: "/app/jet/branding", icon: Palette, scrId: "SCR_JET_BRANDING" },
          { label: "Module 1 Config", to: "/app/jet/module1", icon: Settings, scrId: "UX-024" },
        ],
      },
      {
        label: "Governance",
        items: [
          { label: "Platform Foundation (M00)", to: "/app/jet/platform", icon: Landmark, scrId: "SCR_PLATFORM_HOME" },
          { label: "Tenant & Organization Ops", to: "/platform/organizations", icon: Network, scrId: "SCR-M05-001" },
          { label: "Marketplace Operations", to: "/platform/marketplaces", icon: Store, scrId: "SCR-M04-001" },
          { label: "ACL & Roles", to: "/app/jet/acl", icon: Shield, scrId: "SCR_JET_ACL" },
          { label: "AI / Plan-AI Governance", to: "/app/jet/ai-governance", icon: Sparkles, scrId: "SCR_JET_AI_GOV" },
          { label: "Audit Log", to: "/app/jet/audit", icon: History, scrId: "SCR_JET_AUDIT" },
          { label: "Integrations", to: "/app/jet/integrations", icon: Plug, scrId: "SCR_JET_INTEGRATIONS" },
          { label: "Entitlements", to: "/app/jet/entitlements", icon: BookOpen, scrId: "SCR_JET_ENTITLEMENTS" },
          { label: "Exception Queue", to: "/app/jet/exceptions", icon: Shield, scrId: "SCR_JET_EXCEPTIONS" },
          { label: "Launch Readiness", to: "/app/jet/launch-readiness", icon: Landmark, scrId: "SCR_JET_LAUNCH" },

        ],
      },
    ],
  },
  {
    key: "employer",
    name: "Employer / Group",
    tagline: "ICHRA quoting for groups",
    sections: [
      {
        label: "Group",
        items: [
          { label: "ICHRA Quote", to: "/app/employer/ichra", icon: Building2, scrId: "SCR_EMPLOYER_ICHRA" },
          { label: "Employee Census", to: "/app/employer/census", icon: Users, scrId: "SCR_EMPLOYER_CENSUS" },
          { label: "Contribution Model", to: "/app/employer/contribution", icon: Percent, scrId: "SCR_EMPLOYER_CONTRIB" },
          { label: "Cost Results", to: "/app/employer/results", icon: DollarSign, scrId: "SCR_EMPLOYER_RESULTS" },
          { label: "Proposal", to: "/app/employer/proposal", icon: FileText, scrId: "SCR_EMPLOYER_PROPOSAL" },
        ],
      },
    ],
  },
  {
    key: "partner",
    name: "Partner / Referral",
    tagline: "Refer and track rewards",
    sections: [
      {
        label: "Refer",
        items: [
          { label: "Partner Home", to: "/app/partner", icon: Handshake, scrId: "SCR_PARTNER_HOME" },
        ],
      },
    ],
  },
];

export const MEMBER_NAV: NavItem[] = [
  { label: "My Dashboard", to: "/member", icon: Home, scrId: "UX-016" },
  { label: "Saved Quotes", to: "/member/quotes", icon: FileText, scrId: "UX-016" },
  { label: "My Cart", to: "/cart", icon: Package, scrId: "UX-013" },
  { label: "Messages", to: "/member/messages", icon: MessageSquare, scrId: "UX-016" },
  { label: "Settings", to: "/member/settings", icon: Settings, scrId: "SCR_SYS_SETTINGS" },
];
