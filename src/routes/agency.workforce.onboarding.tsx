import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { RosterOnlyConversion } from "@/components/m06/screens/roster";
import { DuplicateReview } from "@/components/m06/screens/dataops";

const TITLE = "Add people — ABox";
const DESC = "Guided add for agents and staff, roster-only conversion and duplicate resolution.";

export const Route = createFileRoute("/agency/workforce/onboarding")({
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
  component: () => <WorkforcePage title="Add people" lede={DESC} screens={[RosterOnlyConversion, DuplicateReview]} />,
});
