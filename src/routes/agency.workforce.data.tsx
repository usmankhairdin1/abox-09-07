import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { ImportRoster, ImportResults, ExportRequest, FixedReports } from "@/components/m06/screens/dataops";

const TITLE = "Import, export and reports — ABox";
const DESC = "Bulk roster import with validation results, governed exports and fixed reports.";

export const Route = createFileRoute("/agency/workforce/data")({
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
  component: () => <WorkforcePage title="Import, export and reports" lede={DESC} screens={[ImportRoster, ImportResults, ExportRequest, FixedReports]} />,
});
