import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { SellingSetup } from "@/components/m08/selling-setup";

const TITLE = "Selling setup — ABox";
const DESC =
  "Licences, appointments, product authority, E&O, training, documents and NPN attribution for one person in your roster.";

function AgencySellingSetup() {
  return <SellingSetup role="AGENCY_ADMIN" />;
}

export const Route = createFileRoute("/agency/workforce/selling-setup")({
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
  component: () => <WorkforcePage title="Selling setup" lede={DESC} screens={[AgencySellingSetup]} />,
});
