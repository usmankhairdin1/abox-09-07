/**
 * Session state for the Lucie prototype. Everything lives in memory and resets
 * on reload — it exists so a stakeholder can perform actions and see results.
 */
import { createContext, useContext } from "react";

import {
  AGENTS,
  AUDIT,
  CENSUS,
  EXCEPTIONS,
  GATES,
  MARKETPLACES,
  PERSONAS,
  SUBMISSIONS,
  type Agent,
  type AuditEntry,
  type CensusRow,
  type ExceptionItem,
  type LaunchGate,
  type MarketplaceSite,
  type Persona,
  type Submission,
} from "./data";

export interface Household {
  zip: string;
  county: string;
  state: string;
  household: number;
  income: number;
  coverageStart: string;
  applicants: { id: string; name: string; age: number; tobacco: boolean; relationship: string }[];
  submitted: boolean;
}

export interface CartLine {
  planId: string;
  members: number;
  ready: boolean;
  issue?: string;
}

export interface ApplicationState {
  step: number;
  personal: { legalName: string; dob: string; ssnLast4: string; phone: string; email: string };
  address: { line1: string; city: string; state: string; zip: string };
  answers: { citizen: string; tobacco: string; otherCoverage: string; conditions: string };
  documents: { id: string; name: string; size: string; kind: string }[];
  signature: string;
  signedAt?: string;
  submissionId?: string;
  consent: boolean;
}

export interface MarketplaceDraft {
  name: string;
  domain: string;
  primaryColor: string;
  tagline: string;
  supportEmail: string;
  products: string[];
  published: boolean;
}

export interface LucieState {
  persona: Persona;
  household: Household;
  cart: CartLine[];
  compare: string[];
  registered: boolean;
  application: ApplicationState;
  agents: Agent[];
  marketplaces: MarketplaceSite[];
  marketplaceDraft: MarketplaceDraft;
  census: CensusRow[];
  contribution: { model: "flat" | "age" | "class"; base: number; ageFactor: number; classUplift: number };
  submissions: Submission[];
  exceptions: ExceptionItem[];
  gates: LaunchGate[];
  audit: AuditEntry[];
  ichraRouted: boolean;
}

export const initialState = (): LucieState => ({
  persona: "consumer",
  household: {
    zip: "78701",
    county: "Travis",
    state: "TX",
    household: 2,
    income: 54000,
    coverageStart: "2026-10-01",
    applicants: [
      { id: "A1", name: "Dana Whitfield", age: 36, tobacco: false, relationship: "Self" },
      { id: "A2", name: "Ilya Whitfield", age: 34, tobacco: false, relationship: "Spouse" },
    ],
    submitted: false,
  },
  cart: [],
  compare: [],
  registered: false,
  application: {
    step: 0,
    personal: { legalName: "Dana Whitfield", dob: "1990-04-12", ssnLast4: "", phone: "", email: "dana.w@example.com" },
    address: { line1: "", city: "Austin", state: "TX", zip: "78701" },
    answers: { citizen: "", tobacco: "no", otherCoverage: "", conditions: "" },
    documents: [],
    signature: "",
    consent: false,
  },
  agents: AGENTS,
  marketplaces: MARKETPLACES,
  marketplaceDraft: {
    name: "Northgate Dental & Vision",
    domain: "dv.northgate-ins.example",
    primaryColor: "#1f3a5f",
    tagline: "Everyday cover for everyday people.",
    supportEmail: "help@northgate-ins.example",
    products: ["PL-7001", "PL-7010"],
    published: false,
  },
  census: CENSUS,
  contribution: { model: "age", base: 400, ageFactor: 1.4, classUplift: 0 },
  submissions: SUBMISSIONS,
  exceptions: EXCEPTIONS,
  gates: GATES,
  audit: AUDIT,
  ichraRouted: false,
});

export type Action =
  | { type: "persona"; persona: Persona }
  | { type: "household"; patch: Partial<Household> }
  | { type: "cart:add"; planId: string; members: number }
  | { type: "cart:remove"; planId: string }
  | { type: "compare:toggle"; planId: string }
  | { type: "register" }
  | { type: "app:patch"; patch: Partial<ApplicationState> }
  | { type: "app:doc"; doc: { id: string; name: string; size: string; kind: string } }
  | { type: "app:submit"; id: string }
  | { type: "agent:add"; agent: Agent }
  | { type: "agent:status"; id: string; status: Agent["status"]; reason?: string }
  | { type: "mkt:patch"; patch: Partial<MarketplaceDraft> }
  | { type: "mkt:publish" }
  | { type: "census:add"; row: CensusRow }
  | { type: "census:remove"; id: string }
  | { type: "contribution"; patch: Partial<LucieState["contribution"]> }
  | { type: "ichra:route" }
  | { type: "exception:resolve"; id: string }
  | { type: "gate:set"; id: string; state: LaunchGate["state"] }
  | { type: "restore"; state: LucieState }
  | { type: "reset" };

const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

let auditSeq = 90300;

const logged = (
  state: LucieState,
  entry: { actor?: string; action: string; object: string; workspace: string; detail: string },
): LucieState => ({
  ...state,
  audit: [
    {
      id: `AUD-${auditSeq++}`,
      when: stamp(),
      actor: entry.actor ?? PERSONAS.find((p) => p.id === state.persona)?.name ?? "System",
      action: entry.action,
      object: entry.object,
      workspace: entry.workspace,
      detail: entry.detail,
    },
    ...state.audit,
  ],
});

export function reducer(state: LucieState, action: Action): LucieState {
  switch (action.type) {
    case "restore":
      return action.state;

    case "persona":
      return { ...state, persona: action.persona };

    case "household":
      return { ...state, household: { ...state.household, ...action.patch } };

    case "cart:add": {
      if (state.cart.some((l) => l.planId === action.planId)) return state;
      return logged(
        { ...state, cart: [...state.cart, { planId: action.planId, members: action.members, ready: true }] },
        {
          action: "Plan added to cart",
          object: action.planId,
          workspace: "Marketplace",
          detail: `Coverage for ${action.members} people added to the cart.`,
        },
      );
    }

    case "cart:remove":
      return { ...state, cart: state.cart.filter((l) => l.planId !== action.planId) };

    case "compare:toggle": {
      const on = state.compare.includes(action.planId);
      if (on) return { ...state, compare: state.compare.filter((id) => id !== action.planId) };
      if (state.compare.length >= 3) return state;
      return { ...state, compare: [...state.compare, action.planId] };
    }

    case "register":
      return logged(
        { ...state, registered: true },
        {
          action: "Account created",
          object: state.application.personal.email,
          workspace: "Marketplace",
          detail: "Shopper registered and consented to electronic communication.",
        },
      );

    case "app:patch":
      return { ...state, application: { ...state.application, ...action.patch } };

    case "app:doc":
      return {
        ...state,
        application: { ...state.application, documents: [...state.application.documents, action.doc] },
      };

    case "app:submit": {
      const next: Submission = {
        id: action.id,
        applicant: state.application.personal.legalName,
        product: state.cart[0] ? state.cart[0].planId : "—",
        carrier: "Brightline Assurance",
        channel: "Off-exchange",
        submitted: stamp(),
        status: "In review",
        note: "Received by the carrier queue. A confirmation will appear here when it is acknowledged.",
      };
      return logged(
        {
          ...state,
          application: { ...state.application, submissionId: action.id, signedAt: stamp() },
          submissions: [next, ...state.submissions],
        },
        {
          action: "Application submitted",
          object: action.id,
          workspace: "Marketplace",
          detail: "Application signed and dispatched to the carrier.",
        },
      );
    }

    case "agent:add":
      return logged(
        { ...state, agents: [action.agent, ...state.agents] },
        {
          action: "Producer onboarded",
          object: action.agent.name,
          workspace: "Agency",
          detail: `Producer record created for ${action.agent.states.join(", ")}.`,
        },
      );

    case "agent:status":
      return logged(
        {
          ...state,
          agents: state.agents.map((a) =>
            a.id === action.id ? { ...a, status: action.status, blockReason: action.reason } : a,
          ),
        },
        {
          action: action.status === "ready" ? "Producer cleared to sell" : "Producer readiness updated",
          object: state.agents.find((a) => a.id === action.id)?.name ?? action.id,
          workspace: "Agency",
          detail: action.reason ?? `Readiness set to ${action.status.replace("_", " ")}.`,
        },
      );

    case "mkt:patch":
      return { ...state, marketplaceDraft: { ...state.marketplaceDraft, ...action.patch } };

    case "mkt:publish": {
      const d = state.marketplaceDraft;
      return logged(
        {
          ...state,
          marketplaceDraft: { ...d, published: true },
          marketplaces: state.marketplaces.map((m) =>
            m.domain === d.domain
              ? { ...m, status: "live", products: d.products.length, updated: stamp().slice(0, 10), name: d.name }
              : m,
          ),
        },
        {
          action: "Marketplace published",
          object: d.name,
          workspace: "Agency",
          detail: `Published to ${d.domain} with ${d.products.length} products.`,
        },
      );
    }

    case "census:add":
      return { ...state, census: [...state.census, action.row] };

    case "census:remove":
      return { ...state, census: state.census.filter((r) => r.id !== action.id) };

    case "contribution":
      return { ...state, contribution: { ...state.contribution, ...action.patch } };

    case "ichra:route":
      return logged(
        { ...state, ichraRouted: true },
        {
          action: "Proposal routed to agency",
          object: "Cedarline Logistics",
          workspace: "ICHRA",
          detail: "Contribution proposal shared with Northgate Insurance Group for follow-up.",
        },
      );

    case "exception:resolve":
      return logged(
        {
          ...state,
          exceptions: state.exceptions.map((e) => (e.id === action.id ? { ...e, status: "resolved" } : e)),
        },
        {
          action: "Exception resolved",
          object: action.id,
          workspace: "Platform",
          detail: "Marked resolved after the runbook step completed.",
        },
      );

    case "gate:set":
      return logged(
        { ...state, gates: state.gates.map((g) => (g.id === action.id ? { ...g, state: action.state } : g)) },
        {
          action: "Launch gate updated",
          object: state.gates.find((g) => g.id === action.id)?.name ?? action.id,
          workspace: "Platform",
          detail: `Gate state set to ${action.state}.`,
        },
      );

    case "reset":
      return initialState();

    default:
      return state;
  }
}

export const LucieContext = createContext<{
  state: LucieState;
  dispatch: (a: Action) => void;
} | null>(null);

export function useLucie() {
  const ctx = useContext(LucieContext);
  if (!ctx) throw new Error("useLucie must be used inside the Lucie prototype shell");
  return ctx;
}

/* ------------------------------------------------------------ derivations */

export function subsidyEstimate(h: Household) {
  const fpl = 15060 + (h.household - 1) * 5380;
  const pct = Math.round((h.income / fpl) * 100);
  if (pct > 400) return { fplPct: pct, monthly: 0, eligible: false };
  const expectedShare = Math.max(0.02, Math.min(0.085, (pct - 100) / 300 * 0.085 + 0.02));
  const benchmark = 512;
  const monthly = Math.max(0, Math.round(benchmark - (h.income * expectedShare) / 12));
  return { fplPct: pct, monthly, eligible: true };
}

export function contributionTotals(state: LucieState) {
  const { base, ageFactor, classUplift, model } = state.contribution;
  const rows = state.census.map((r) => {
    let amount = base;
    if (model === "age") amount = Math.round(base * (1 + ((r.age - 30) / 100) * ageFactor));
    if (model === "class") amount = Math.round(base + (r.class === "Full-time" ? classUplift : 0));
    return { ...r, amount: Math.max(0, amount) };
  });
  const monthly = rows.reduce((s, r) => s + r.amount, 0);
  return { rows, monthly, annual: monthly * 12 };
}
