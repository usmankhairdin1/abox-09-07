import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { AgencyAdministrationHome } from "@/components/m06/screens/roster";

const TITLE = "Agency network overview — ABox";
const DESC = "Live roster health, open lifecycle work and readiness across the agency network.";

export const Route = createFileRoute("/agency/workforce/")({
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
  component: () => <WorkforcePage title="Agency network overview" lede={DESC} screens={[AgencyAdministrationHome]} />,
});
