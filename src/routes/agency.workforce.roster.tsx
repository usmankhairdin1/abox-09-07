import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { AgencyRoster } from "@/components/m06/screens/roster";

const TITLE = "Workforce roster — ABox";
const DESC = "Everyone affiliated with the agency, with status, captivity and affiliation state.";

export const Route = createFileRoute("/agency/workforce/roster")({
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
  component: () => <WorkforcePage title="Workforce roster" lede={DESC} screens={[AgencyRoster]} />,
});
