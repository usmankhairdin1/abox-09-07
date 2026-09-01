import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { OnboardingCases, TransferCase, OffboardingCase } from "@/components/m06/screens/lifecycle";

const TITLE = "Lifecycle cases — ABox";
const DESC = "Onboarding, transfer, offboarding and suspension cases with their state model.";

export const Route = createFileRoute("/agency/workforce/lifecycle")({
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
  component: () => <WorkforcePage title="Lifecycle cases" lede={DESC} screens={[OnboardingCases, TransferCase, OffboardingCase]} />,
});
