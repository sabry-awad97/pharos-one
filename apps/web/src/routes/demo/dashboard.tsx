import { PharmacyDashboard } from "@/mockups/pharmacy-dashboard/PharmacyDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PharmacyDashboard />;
}
