import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/dashboard/alerts")({
  component: DashboardAlertsRoute,
});

function DashboardAlertsRoute() {
  return <WorkspaceContainer moduleId="dashboard-alerts" split={false} />;
}
