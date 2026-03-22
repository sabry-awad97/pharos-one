import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/inventory/expiring")({
  component: InventoryExpiringRoute,
});

function InventoryExpiringRoute() {
  return <WorkspaceContainer moduleId="inventory-expiring" split={false} />;
}
