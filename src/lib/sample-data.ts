/**
 * Placeholder / representative data so every screen renders complete
 * before Lovable Cloud is enabled and populated in Wave 2.
 * All content is fabricated. Not real plans, not real people.
 */
import type { PriorityKey, UsageLevel } from "./quote-store";

export interface SamplePlan {
  id: string;
  carrier: string;
  name: string;
  metalTier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Catastrophic";
  networkType: "HMO" | "PPO" | "EPO" | "POS";
  onExchange: boolean;
  monthlyPremium: number;
  deductible: number;
  oopMax: number;
  pcpCopay: number;
  specialistCopay: number;
  genericRx: number;
  rating: number;
  /** Baseline plan-quality prior (network breadth, carrier standing) used
   *  as an input to `planMatchScore` — not the final match shown to the
   *  shopper, which also weighs their priorities/usage. */
  planOMatch: number;
  highlights: string[];
  hsaEligible: boolean;
}

export const SAMPLE_PLANS: SamplePlan[] = [
  {
    id: "plan-01",
    carrier: "Meridian Health",
    name: "Meridian Silver 2500 PPO",
    metalTier: "Silver",
    networkType: "PPO",
    onExchange: true,
    monthlyPremium: 412,
    deductible: 2500,
    oopMax: 8700,
    pcpCopay: 25,
    specialistCopay: 55,
    genericRx: 10,
    rating: 4.4,
    planOMatch: 92,
    highlights: ["Broad PPO network", "$0 preventive", "Telehealth included"],
    hsaEligible: false,
  },
  {
    id: "plan-02",
    carrier: "BluePeak",
    name: "BluePeak Gold Choice HMO",
    metalTier: "Gold",
    networkType: "HMO",
    onExchange: true,
    monthlyPremium: 548,
    deductible: 1200,
    oopMax: 6500,
    pcpCopay: 15,
    specialistCopay: 40,
    genericRx: 5,
    rating: 4.6,
    planOMatch: 88,
    highlights: ["Low deductible", "In-network specialists $40", "Rx tier 1 = $5"],
    hsaEligible: false,
  },
  {
    id: "plan-03",
    carrier: "SunState",
    name: "SunState Bronze HSA 6900",
    metalTier: "Bronze",
    networkType: "EPO",
    onExchange: true,
    monthlyPremium: 289,
    deductible: 6900,
    oopMax: 9200,
    pcpCopay: 0,
    specialistCopay: 0,
    genericRx: 0,
    rating: 4.1,
    planOMatch: 76,
    highlights: ["HSA eligible", "Lowest monthly premium", "Preventive $0"],
    hsaEligible: true,
  },
  {
    id: "plan-04",
    carrier: "Meridian Health",
    name: "Meridian Gold Advantage PPO",
    metalTier: "Gold",
    networkType: "PPO",
    onExchange: false,
    monthlyPremium: 612,
    deductible: 900,
    oopMax: 5500,
    pcpCopay: 15,
    specialistCopay: 35,
    genericRx: 5,
    rating: 4.7,
    planOMatch: 84,
    highlights: ["Off-exchange only", "Nationwide PPO", "Low OOP max"],
    hsaEligible: false,
  },
  {
    id: "plan-05",
    carrier: "Aeris",
    name: "Aeris Silver 3500 POS",
    metalTier: "Silver",
    networkType: "POS",
    onExchange: true,
    monthlyPremium: 385,
    deductible: 3500,
    oopMax: 8500,
    pcpCopay: 30,
    specialistCopay: 60,
    genericRx: 12,
    rating: 4.0,
    planOMatch: 81,
    highlights: ["POS flexibility", "Mid-range premium", "Rx generic $12"],
    hsaEligible: false,
  },
  {
    id: "plan-06",
    carrier: "BluePeak",
    name: "BluePeak Bronze Essentials",
    metalTier: "Bronze",
    networkType: "HMO",
    onExchange: true,
    monthlyPremium: 268,
    deductible: 7500,
    oopMax: 9450,
    pcpCopay: 40,
    specialistCopay: 80,
    genericRx: 20,
    rating: 3.9,
    planOMatch: 68,
    highlights: ["Lowest starting premium", "In-network only", "Rx after deductible"],
    hsaEligible: false,
  },
  {
    id: "plan-07",
    carrier: "SunState",
    name: "SunState Platinum 500",
    metalTier: "Platinum",
    networkType: "PPO",
    onExchange: false,
    monthlyPremium: 842,
    deductible: 500,
    oopMax: 3500,
    pcpCopay: 10,
    specialistCopay: 25,
    genericRx: 3,
    rating: 4.8,
    planOMatch: 79,
    highlights: ["Lowest deductible tier", "Best cost sharing", "Off-exchange"],
    hsaEligible: false,
  },
  {
    id: "plan-08",
    carrier: "Aeris",
    name: "Aeris Gold HMO 1000",
    metalTier: "Gold",
    networkType: "HMO",
    onExchange: true,
    monthlyPremium: 495,
    deductible: 1000,
    oopMax: 6000,
    pcpCopay: 20,
    specialistCopay: 45,
    genericRx: 8,
    rating: 4.5,
    planOMatch: 90,
    highlights: ["Strong Rx coverage", "Low deductible", "In-network gold"],
    hsaEligible: false,
  },
];

const PREMIUMS = SAMPLE_PLANS.map((p) => p.monthlyPremium);
const DEDUCTIBLES = SAMPLE_PLANS.map((p) => p.deductible);
const OOP_MAXES = SAMPLE_PLANS.map((p) => p.oopMax);
const PREMIUM_RANGE: [number, number] = [Math.min(...PREMIUMS), Math.max(...PREMIUMS)];
const DEDUCTIBLE_RANGE: [number, number] = [Math.min(...DEDUCTIBLES), Math.max(...DEDUCTIBLES)];
const OOP_RANGE: [number, number] = [Math.min(...OOP_MAXES), Math.max(...OOP_MAXES)];

/** Lower raw value -> higher score. Flat range collapses to a neutral 50. */
function scoreLowerIsBetter(value: number, [min, max]: [number, number]): number {
  if (max === min) return 50;
  return 100 * (1 - (value - min) / (max - min));
}

export interface PlanMatchInputs {
  priorities: PriorityKey[];
  usage?: UsageLevel;
  keepDoctor: boolean;
}

/**
 * PlanAI match score for a shopper. Combines the plan's baseline quality
 * prior (`planOMatch`) with how well it actually fits the priorities,
 * expected usage, and keep-my-doctor preference collected in the quote
 * wizard — recomputed whenever those inputs change (UX-005 goals /
 * UX-007 usage), rather than a fixed per-plan constant. `null` inputs
 * (pure browse mode, no quote on file) fall back to the baseline prior.
 */
export function planMatchScore(plan: SamplePlan, inputs: PlanMatchInputs | null): number {
  if (!inputs || inputs.priorities.length === 0) return plan.planOMatch;

  let priorityTotal = 0;
  for (const p of inputs.priorities) {
    switch (p) {
      case "premium": priorityTotal += scoreLowerIsBetter(plan.monthlyPremium, PREMIUM_RANGE); break;
      case "deductible": priorityTotal += scoreLowerIsBetter(plan.deductible, DEDUCTIBLE_RANGE); break;
      case "doctor": priorityTotal += plan.networkType === "PPO" || plan.networkType === "POS" ? 90 : 55; break;
      case "rx": priorityTotal += scoreLowerIsBetter(plan.genericRx, [0, 25]); break;
      case "network": priorityTotal += plan.networkType === "PPO" ? 95 : plan.networkType === "POS" ? 80 : plan.networkType === "EPO" ? 60 : 45; break;
      case "hsa": priorityTotal += plan.hsaEligible ? 100 : 20; break;
    }
  }
  const priorityAvg = priorityTotal / inputs.priorities.length;

  let usageAdj: number;
  if (inputs.usage === "high") usageAdj = scoreLowerIsBetter(plan.oopMax, OOP_RANGE) * 0.15;
  else if (inputs.usage === "low") usageAdj = scoreLowerIsBetter(plan.monthlyPremium, PREMIUM_RANGE) * 0.15;
  else usageAdj = 7.5;

  const keepDoctorAdj = inputs.keepDoctor
    ? (plan.networkType === "PPO" ? 6 : plan.networkType === "POS" ? 3 : -4)
    : 0;

  const score = plan.planOMatch * 0.45 + priorityAvg * 0.4 + usageAdj + keepDoctorAdj;
  return Math.round(Math.max(35, Math.min(99, score)));
}

export interface SampleAncillary {
  id: string;
  type: "Dental" | "Vision" | "Life" | "Critical Illness" | "Accident" | "Hospital Indemnity";
  name: string;
  carrier: string;
  monthly: number;
  highlight: string;
}

export const SAMPLE_ANCILLARY: SampleAncillary[] = [
  { id: "anc-01", type: "Dental", name: "SmileGuard Preferred", carrier: "SmileGuard", monthly: 32, highlight: "$50 deductible" },
  { id: "anc-02", type: "Vision", name: "ClearView Basic", carrier: "ClearView", monthly: 14, highlight: "$10 exam copay" },
  { id: "anc-03", type: "Life", name: "Aeris Term 20", carrier: "Aeris", monthly: 21, highlight: "$100k term" },
  { id: "anc-04", type: "Critical Illness", name: "SunState Critical Care", carrier: "SunState", monthly: 18, highlight: "$20k lump sum" },
  { id: "anc-05", type: "Accident", name: "BluePeak Accident+", carrier: "BluePeak", monthly: 12, highlight: "AD&D included" },
  { id: "anc-06", type: "Hospital Indemnity", name: "Meridian Hospital Care", carrier: "Meridian", monthly: 16, highlight: "$200/day" },
];

export interface SampleLead {
  id: string;
  name: string;
  stage: "New" | "Contacted" | "Quoted" | "Shared" | "Enrolled" | "Lost";
  product: string;
  premium?: number;
  updatedAgo: string;
  planO: boolean;
  agent: string;
  nextAction: string;
}

export const SAMPLE_LEADS: SampleLead[] = [
  { id: "L-1042", name: "Renata Alvarez", stage: "Quoted", product: "IFP · Silver", premium: 412, updatedAgo: "2h", planO: true, agent: "You", nextAction: "Send shared quote" },
  { id: "L-1041", name: "Marcus Chen", stage: "Contacted", product: "IFP · Bronze", updatedAgo: "5h", planO: false, agent: "You", nextAction: "Book call" },
  { id: "L-1040", name: "Priya Shah", stage: "Shared", product: "IFP · Gold", premium: 548, updatedAgo: "1d", planO: true, agent: "You", nextAction: "Nudge — expires in 3 days" },
  { id: "L-1039", name: "Jonah Beckett", stage: "New", product: "IFP", updatedAgo: "1d", planO: false, agent: "Unassigned", nextAction: "Claim lead" },
  { id: "L-1038", name: "Aisha Traoré", stage: "Enrolled", product: "IFP · Silver + Dental", premium: 444, updatedAgo: "2d", planO: true, agent: "You", nextAction: "Onboarding" },
  { id: "L-1037", name: "Devon Wright", stage: "Contacted", product: "IFP · Platinum", updatedAgo: "3d", planO: false, agent: "You", nextAction: "Follow up on subsidy" },
  { id: "L-1036", name: "Sofia Rinaldi", stage: "Quoted", product: "IFP · Silver", premium: 385, updatedAgo: "4d", planO: true, agent: "Elena K.", nextAction: "Handoff to consumer" },
  { id: "L-1035", name: "Toma Kovač", stage: "Lost", product: "IFP · Bronze", updatedAgo: "6d", planO: false, agent: "You", nextAction: "Archive" },
];

export interface SampleNotification {
  id: string;
  kind: "quote_viewed" | "call_requested" | "task_due" | "message_received" | "plan_o_note" | "system";
  title: string;
  body: string;
  ago: string;
  unread: boolean;
}

export const SAMPLE_NOTIFICATIONS: SampleNotification[] = [
  { id: "N-01", kind: "quote_viewed", title: "Priya opened your shared quote", body: "Viewed for 4 minutes · compared 3 plans", ago: "12m", unread: true },
  { id: "N-02", kind: "call_requested", title: "Marcus requested a callback", body: "Prefers today after 4pm ET", ago: "1h", unread: true },
  { id: "N-03", kind: "task_due", title: "Follow-up due — Renata Alvarez", body: "Send subsidy education recap", ago: "3h", unread: false },
  { id: "N-04", kind: "plan_o_note", title: "PlanAI flagged an escalation", body: "Household mentioned specialty Rx — human review suggested", ago: "6h", unread: true },
  { id: "N-05", kind: "system", title: "Effective date auto-updated", body: "Default effective date rolled to Aug 1", ago: "1d", unread: false },
];

export interface SampleTimelineEvent {
  id: string;
  /** Which lead's detail page this event belongs to (SampleLead.name). */
  leadName: string;
  when: string;
  actor: string;
  eventType: string;
  summary: string;
  planO?: boolean;
}

export const SAMPLE_TIMELINE: SampleTimelineEvent[] = [
  { id: "T-1", leadName: "Renata Alvarez", when: "Today · 10:12", actor: "Renata Alvarez", eventType: "quote.viewed", summary: "Opened shared quote (3 plans compared)" },
  { id: "T-2", leadName: "Renata Alvarez", when: "Today · 09:44", actor: "You", eventType: "quote.sent", summary: "Shared quote sent via email · expires Aug 3" },
  { id: "T-3", leadName: "Renata Alvarez", when: "Today · 09:31", actor: "PlanAI", eventType: "planO.recommendation", summary: "Recommended 3 plans matching PCP + Rx tier 1 focus", planO: true },
  { id: "T-4", leadName: "Renata Alvarez", when: "Yesterday · 16:20", actor: "You", eventType: "quote.built", summary: "Built quote (Silver PPO, household of 2)" },
  { id: "T-5", leadName: "Renata Alvarez", when: "Yesterday · 15:58", actor: "Renata Alvarez", eventType: "lead.created", summary: "Lead created from marketplace landing" },
];

export interface SampleProduct {
  key: string;
  label: string;
  tagline: string;
  href: string;
  emphasis: "primary" | "secondary" | "group";
  status: "live" | "coming-soon";
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  { key: "ifp", label: "Health Insurance", tagline: "Individual & family plans (IFP)", href: "/select?product=ifp", emphasis: "primary", status: "live" },
  { key: "dental", label: "Dental", tagline: "Preventive to comprehensive", href: "/select?product=dental", emphasis: "secondary", status: "live" },
  { key: "vision", label: "Vision", tagline: "Exams, frames, contacts", href: "/select?product=vision", emphasis: "secondary", status: "live" },
  { key: "life", label: "Life", tagline: "Term life, simple to price", href: "/select?product=life", emphasis: "secondary", status: "live" },
  { key: "critical", label: "Critical Illness", tagline: "Cash benefit if diagnosed", href: "/select?product=critical", emphasis: "secondary", status: "live" },
  { key: "accident", label: "Accident", tagline: "Injury protection", href: "/select?product=accident", emphasis: "secondary", status: "live" },
  { key: "hospital", label: "Hospital Indemnity", tagline: "Fixed daily benefit", href: "/select?product=hospital", emphasis: "secondary", status: "live" },
  { key: "ichra", label: "ICHRA for Employers", tagline: "Set an allowance — team picks the plan", href: "/ichra", emphasis: "group", status: "live" },
];
