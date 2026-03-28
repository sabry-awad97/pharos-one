import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/staff/overview")({
  component: StaffOverviewRoute,
});

function StaffOverviewRoute() {
  return <WorkspaceContainer moduleId="staff" split={false} />;
}
