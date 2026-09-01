import { createFileRoute } from "@tanstack/react-router";

import { WorkforcePage } from "@/components/m06/workforce-page";
import { TasksAndExceptions } from "@/components/m06/screens/lifecycle";
import { NotificationPreferences, SupportContext } from "@/components/m06/screens/dataops";

const TITLE = "Tasks and exceptions — ABox";
const DESC = "The workforce work queue: tasks, exceptions, notes, notifications and support context.";

export const Route = createFileRoute("/agency/workforce/work")({
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
  component: () => <WorkforcePage title="Tasks and exceptions" lede={DESC} screens={[TasksAndExceptions, NotificationPreferences, SupportContext]} />,
});
