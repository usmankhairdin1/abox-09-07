import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { AgencyProfile, AgencyDefaults } from "@/components/m06/screens/roster";

const TITLE = "Agency operational profile — ABox";
const DESC = "Operational profile, agency defaults and how they propagate to new people.";

export const Route = createFileRoute("/agency/workforce/settings")({
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
  component: () => <WorkforcePage title="Agency operational profile" lede={DESC} screens={[AgencyProfile, AgencyDefaults]} />,
});
