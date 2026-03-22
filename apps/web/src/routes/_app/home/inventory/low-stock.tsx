import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/inventory/low-stock")({
  component: InventoryLowStockRoute,
});

function InventoryLowStockRoute() {
  return <WorkspaceContainer moduleId="inventory-low-stock" split={false} />;
}
