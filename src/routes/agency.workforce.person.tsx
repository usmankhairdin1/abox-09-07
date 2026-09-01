import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { AgentProfile } from "@/components/m06/screens/roster";

const TITLE = "Person record — ABox";
const DESC = "Profile fields, affiliation, status history and corrections for one person.";

export const Route = createFileRoute("/agency/workforce/person")({
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
  component: () => <WorkforcePage title="Person record" lede={DESC} screens={[AgentProfile]} />,
});
