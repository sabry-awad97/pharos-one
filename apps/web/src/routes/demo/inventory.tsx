import { PharmacyInventory } from "@/mockups/pharmacy-inventory/PharmacyInventory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PharmacyInventory />;
}
