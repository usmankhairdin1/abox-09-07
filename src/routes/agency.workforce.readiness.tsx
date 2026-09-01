import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { ReadinessDetail, OperationalEligibilityDetail, CredentialSellingSetup, ReferralLinkComponent } from "@/components/m06/screens/readiness";

const TITLE = "Operational readiness — ABox";
const DESC = "Operational eligibility, credential-based selling setup and referral link participation.";

export const Route = createFileRoute("/agency/workforce/readiness")({
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
  component: () => <WorkforcePage title="Operational readiness" lede={DESC} screens={[ReadinessDetail, OperationalEligibilityDetail, CredentialSellingSetup, ReferralLinkComponent]} />,
});
