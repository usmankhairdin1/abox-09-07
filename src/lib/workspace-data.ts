/**
 * Workspace demo records used across the internal /app estate.
 * Realistic content so every internal surface shows records, not placeholders.
 */

export const BOOK_OF_BUSINESS = {
  activeMembers: 2418,
  openOpportunities: 47,
  inFlightApplications: 18,
  placementRate: 86,
  placedPremium: "$184.6k",
  goal: "$225k",
  pending: "$41k",
  daysLeft: 12,
  goalProgress: 82,
};

export type PriorityItem = {
  title: string;
  detail: string;
  meta: string;
  tone: "warning" | "primary" | "info";
  icon: "FileCheck2" | "Users" | "Building2";
};

export const PRIORITY_WORK: PriorityItem[] = [
  {
    title: "Rivera family application",
    detail: "Eligibility response needs review before submission",
    meta: "Due today",
    tone: "warning",
    icon: "FileCheck2",
  },
  {
    title: "Morgan Lee renewal",
    detail: "New plan recommendations are ready to share",
    meta: "Due Sep 3",
    tone: "primary",
    icon: "Users",
  },
  {
    title: "Harbor Point appointment",
    detail: "Carrier documentation is awaiting approval",
    meta: "2 documents",
    tone: "info",
    icon: "Building2",
  },
];

export const RECENT_ACTIVITY = [
  { event: "Quote created", subject: "Sofia Patel", detail: "Individual & Family", time: "8 min ago" },
  { event: "Application submitted", subject: "James Wilson", detail: "Off-exchange", time: "24 min ago" },
  { event: "Producer added", subject: "Maya Chen", detail: "Harbor Point", time: "1 hr ago" },
  { event: "Commission statement", subject: "August statement ready", detail: "$18,420", time: "2 hrs ago" },
  { event: "Policy effectuated", subject: "Rivera family", detail: "Silver 2500 PPO", time: "4 hrs ago" },
];

export type TaskRow = {
  id: string;
  title: string;
  customer: string;
  queue: "Applications" | "Leads" | "Renewals" | "Appointments";
  due: string;
  status: "Open" | "In progress" | "Blocked" | "Done";
  owner: string;
};

export const TASKS: TaskRow[] = [
  { id: "T-1042", title: "Review eligibility response", customer: "Rivera family", queue: "Applications", due: "Today", status: "Open", owner: "Elena Ruiz" },
  { id: "T-1039", title: "Share renewal shortlist", customer: "Morgan Lee", queue: "Renewals", due: "Sep 3", status: "In progress", owner: "Elena Ruiz" },
  { id: "T-1036", title: "Upload carrier appointment docs", customer: "Harbor Point Agency", queue: "Appointments", due: "Sep 4", status: "Blocked", owner: "Maya Chen" },
  { id: "T-1031", title: "Call back inbound lead", customer: "Sofia Patel", queue: "Leads", due: "Today", status: "Open", owner: "Daniel Okafor" },
  { id: "T-1024", title: "Collect dependent SSNs", customer: "James Wilson", queue: "Applications", due: "Sep 5", status: "In progress", owner: "Elena Ruiz" },
  { id: "T-1018", title: "Confirm effectuation payment", customer: "Nguyen household", queue: "Applications", due: "Sep 6", status: "Done", owner: "Daniel Okafor" },
];

export type CustomerRow = {
  id: string;
  name: string;
  household: number;
  state: string;
  product: string;
  status: "Member" | "Applicant" | "Lead";
  premium: string;
  updated: string;
};

export const CUSTOMERS: CustomerRow[] = [
  { id: "C-88214", name: "Rivera family", household: 4, state: "TX", product: "Individual & Family", status: "Applicant", premium: "$612/mo", updated: "Today" },
  { id: "C-88190", name: "Morgan Lee", household: 1, state: "CA", product: "Individual & Family", status: "Member", premium: "$318/mo", updated: "Yesterday" },
  { id: "C-88155", name: "Sofia Patel", household: 2, state: "NY", product: "Dental + Vision", status: "Lead", premium: "—", updated: "8 min ago" },
  { id: "C-88101", name: "James Wilson", household: 3, state: "FL", product: "Off-exchange", status: "Applicant", premium: "$489/mo", updated: "24 min ago" },
  { id: "C-87994", name: "Nguyen household", household: 5, state: "WA", product: "Individual & Family", status: "Member", premium: "$744/mo", updated: "2 days ago" },
  { id: "C-87950", name: "Harbor Point Agency", household: 0, state: "IL", product: "ICHRA", status: "Lead", premium: "—", updated: "3 days ago" },
];

export const FUNNEL = [
  { stage: "Shopping sessions", value: 4820 },
  { stage: "Quotes", value: 2140 },
  { stage: "Carts", value: 1180 },
  { stage: "Applications", value: 690 },
  { stage: "Submitted", value: 542 },
  { stage: "Effectuated", value: 466 },
];

export const QUOTE_ACTIVITY = [
  { label: "Mon", d2c: 68, assisted: 41 },
  { label: "Tue", d2c: 74, assisted: 52 },
  { label: "Wed", d2c: 91, assisted: 47 },
  { label: "Thu", d2c: 83, assisted: 61 },
  { label: "Fri", d2c: 102, assisted: 58 },
  { label: "Sat", d2c: 44, assisted: 19 },
  { label: "Sun", d2c: 38, assisted: 12 },
];

export const LEAD_SOURCES = [
  { source: "Marketplace search", count: 184, status: "Open" },
  { source: "Agent referral", count: 122, status: "Working" },
  { source: "Employer ICHRA", count: 78, status: "Open" },
  { source: "Partner storefront", count: 54, status: "Nurture" },
];

export const COMMISSION_SNAPSHOT = {
  projectedMtd: "$18,420",
  projectedAnnualised: "$221,040",
  pendingOverrides: "$3,180",
  months: [12.1, 13.4, 15.2, 14.8, 16.9, 17.4, 18.4],
};

export const MARKETPLACE_STOREFRONTS = [
  { name: "Northwind Direct", sessions: 2140, quotes: 812, placed: 214 },
  { name: "Harbor Point", sessions: 1180, quotes: 402, placed: 118 },
  { name: "Sunbelt Partners", sessions: 940, quotes: 288, placed: 74 },
  { name: "Employer ICHRA hub", sessions: 560, quotes: 141, placed: 40 },
];
