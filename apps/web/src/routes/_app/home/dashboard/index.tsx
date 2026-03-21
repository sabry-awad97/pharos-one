import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/dashboard/")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return <WorkspaceContainer moduleId="dashboard" split={false} />;
}
