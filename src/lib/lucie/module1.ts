/**
 * Module 1 protection appendix.
 *
 * Module 1 is the only protected detailed module baseline
 * (protected_detailed_module_baselines = [M01]). Posture for Lucie: strictly
 * frozen — no approved Module 1 delta exists. A Lucie simplification may never
 * weaken a control listed here; if a slice appears to require it, the change
 * goes back to the main ABox project as a proposed M01 delta.
 */

export const M01_POSTURE = "Strictly frozen for Lucie. No approved Module 1 delta.";

export interface M01Control {
  id: string;
  control: string;
  requirement: string;
  weakeningWouldLookLike: string;
  surfaces: string[];
  workstreams: string[];
}

export const M01_CONTROLS: M01Control[] = [
  {
    id: "M01-CTL-CONSENT",
    control: "Typed consent",
    requirement:
      "Contact and data-use consent is captured as a typed, versioned, timestamped record with actor, channel and text version — never an implied or bundled checkbox.",
    weakeningWouldLookLike:
      "Reusing one generic consent flag for SMS, email and data sharing, or letting a canned workflow message a lead without a matching consent record.",
    surfaces: [
      "LUC-SCR_REGISTRATION",
      "LUC-SCR_CONSENT_POLICY",
      "LUC-SCR_SHARED_QUOTE_VIEW",
      "LUC-SCR_APPLICATION_REVIEW",
    ],
    workstreams: ["WS-01", "WS-02", "WS-05"],
  },
  {
    id: "M01-CTL-SAFE-URL",
    control: "Safe URL",
    requirement:
      "Shared quote and resume links carry opaque, expiring, revocable tokens; no PII, PHI, member identifiers or quote parameters in the URL or query string.",
    weakeningWouldLookLike:
      "Encoding household data in a share link, non-expiring links, or a public link that exposes more than the shared quote scope.",
    surfaces: [
      "LUC-SCR_SHARED_QUOTE_VIEW",
      "LUC-SCR_SHARED_QUOTE_CONTINUE",
      "LUC-SCR_AGENT_SHARED_QUOTES",
    ],
    workstreams: ["WS-02", "WS-05"],
  },
  {
    id: "M01-CTL-EDE",
    control: "EDE handoff boundary",
    requirement:
      "On-exchange ends in a JET EDE handoff using an opaque token, an approved packet, a declared legal role, explicit disclosures and defined failure/return behavior. ABox never claims Exchange enrollment.",
    weakeningWouldLookLike:
      "Rendering 'enrolled' after handoff, silently retrying a handoff, or losing the return status so the record stalls with no owner.",
    surfaces: [
      "LUC-SCR_EDE_HANDOFF_REVIEW",
      "LUC-SCR_SUBMISSION_STATUS",
      "LUC-SCR_WEBHOOK_MONITOR",
    ],
    workstreams: ["WS-02", "WS-05", "WS-08"],
  },
  {
    id: "M01-CTL-AUDIT",
    control: "Audit and evidence",
    requirement:
      "Every consequential action — quote, share, consent, signature, handoff, configuration change, support access — writes an immutable audit event with actor, tenant, object, before/after and source.",
    weakeningWouldLookLike:
      "Fixed-asset or canned-workflow edits that bypass audit because they are 'just configuration'.",
    surfaces: ["LUC-SCR_AUDIT_EXPLORER", "LUC-SCR_SUPPORT_ACCESS", "LUC-SCR_FEATURE_FLAGS"],
    workstreams: ["WS-01", "WS-08"],
  },
  {
    id: "M01-CTL-PLANAI-EVIDENCE",
    control: "PlanAI evidence",
    requirement:
      "Every recommendation or explanation is non-definitive, traceable to the inputs, knowledge version, prompt version and model configuration used, and carries the approved disclaimer.",
    weakeningWouldLookLike:
      "Free-text advice without evidence, definitive 'best plan' language, or an unversioned knowledge set behind a production answer.",
    surfaces: ["LUC-SCR_PLANO_GUIDED_INTAKE", "LUC-SCR_PLANAI_CONFIG", "LUC-SCR_PLAN_COMPARE"],
    workstreams: ["WS-07"],
  },
  {
    id: "M01-CTL-STALE-QUOTE",
    control: "Stale quote handling",
    requirement:
      "Quote results are pinned to an immutable snapshot. When rates, plan data or effective dates move, the snapshot is marked stale and re-quoted explicitly — never silently repriced.",
    weakeningWouldLookLike:
      "Recomputing a cart total on read, or carrying an old snapshot into an application without a staleness check.",
    surfaces: ["LUC-SCR_QUOTE_RESULTS", "LUC-SCR_CART_REVIEW", "LUC-SCR_AGENT_QUOTE_DETAIL"],
    workstreams: ["WS-02", "WS-04"],
  },
  {
    id: "M01-CTL-PHI-PII",
    control: "PHI and PII minimization",
    requirement:
      "Collect only what the journey needs, scrub sensitive data from logs, notifications and AI prompts, mask in read surfaces, and scope every read by tenant, entity and assignment.",
    weakeningWouldLookLike:
      "Household detail in an SMS body, PHI inside an AI prompt or an exception queue that shows other tenants' records.",
    surfaces: [
      "LUC-SCR_AGENT_CUSTOMER_360",
      "LUC-SCR_APPLICATION_EXCEPTION_QUEUE",
      "LUC-SCR_TWILIO_CONFIG",
      "LUC-SCR_PLANAI_CONFIG",
    ],
    workstreams: ["WS-01", "WS-05", "WS-07"],
  },
];

/**
 * Module 1 scope items that Lucie explicitly does NOT carry forward as
 * production behavior, per the module slice map. Not a weakening of a control —
 * a scope statement.
 */
export const M01_SCOPE_NOTES: string[] = [
  "Provider and drug lookup is out of Lucie scope unless separately approved (module slice map, M01).",
  "The formal on-exchange application stays outside ABox; the boundary is the JET EDE handoff.",
  "Ancillary breadth in Lucie is dental and vision only; other supplemental lines stay excluded (M21).",
];
