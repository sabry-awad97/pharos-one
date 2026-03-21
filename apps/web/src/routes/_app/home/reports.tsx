import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/reports")({
  component: ReportsRoute,
});

function ReportsRoute() {
  return <WorkspaceContainer moduleId="reports" split={false} />;
}
