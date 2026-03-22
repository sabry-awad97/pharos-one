import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/inventory/all")({
  component: InventoryAllRoute,
});

function InventoryAllRoute() {
  return <WorkspaceContainer moduleId="inventory-all" split={false} />;
}
