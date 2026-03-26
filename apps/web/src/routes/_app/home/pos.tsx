import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/pos")({
  component: PosRoute,
});

function PosRoute() {
  return <WorkspaceContainer moduleId="pos" split={false} />;
}
