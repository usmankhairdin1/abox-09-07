import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { BusinessUnits, BusinessUnitDetail, Teams, TeamDetail } from "@/components/m06/screens/structure";

const TITLE = "Business units and teams — ABox";
const DESC = "Non-legal operating structure. Membership is organizational only and grants no authority.";

export const Route = createFileRoute("/agency/workforce/structure")({
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
  component: () => <WorkforcePage title="Business units and teams" lede={DESC} screens={[BusinessUnits, BusinessUnitDetail, Teams, TeamDetail]} />,
});
