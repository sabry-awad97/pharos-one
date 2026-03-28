import { CustomerManagementStudio } from "@/mockups/pharamcy-cms/CustomerManagementStudio";
import { PharmacyDashboard } from "@/mockups/pharmacy-dashboard/PharmacyDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/cms")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerManagementStudio />;
}
