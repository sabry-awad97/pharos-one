import { PurchaseManagement } from "@/mockups/pharmacy-purchase/PurchaseManagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/purchase")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PurchaseManagement />;
}
