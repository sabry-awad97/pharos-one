import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/inventory")({
  component: InventoryRoute,
});

function InventoryRoute() {
  return <WorkspaceContainer moduleId="inventory" split={false} />;
}
