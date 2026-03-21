import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/dashboard/overview")({
  component: DashboardOverviewRoute,
});

function DashboardOverviewRoute() {
  return <WorkspaceContainer moduleId="dashboard-overview" split={false} />;
}
