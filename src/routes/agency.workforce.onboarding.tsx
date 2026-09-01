import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import type { M06ScreenProps } from "@/components/m06/screens/common";
import { AddPersonWizard, RosterOnlyConversion } from "@/components/m06/screens/roster";
import { DuplicateReview } from "@/components/m06/screens/dataops";

const TITLE = "Onboarding — ABox";
const DESC =
  "Guided add for agents and staff, roster-only conversion and duplicate resolution.";

function AddAgent(props: M06ScreenProps) {
  return <AddPersonWizard {...props} />;
}

function AddStaff(props: M06ScreenProps) {
  return <AddPersonWizard {...props} staff />;
}

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
  component: () => (
    <WorkforcePage
      title="Onboarding"
      lede={DESC}
      screens={[AddAgent, AddStaff, RosterOnlyConversion, DuplicateReview]}
    />
  ),
});
