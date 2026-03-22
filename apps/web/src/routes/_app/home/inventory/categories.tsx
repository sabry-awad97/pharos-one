import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/inventory/categories")({
  component: InventoryCategoriesRoute,
});

function InventoryCategoriesRoute() {
  return <WorkspaceContainer moduleId="inventory-categories" split={false} />;
}
