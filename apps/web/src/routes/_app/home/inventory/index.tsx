import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/home/inventory/")({
  component: InventoryRoute,
});

function InventoryRoute() {
  // Redirect to "All Products" sub-item
  return <Navigate to="/home/inventory/all" />;
}
