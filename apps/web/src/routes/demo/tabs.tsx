import { PharmacyTabs } from "@/mockups/pharmacy-tabs/PharmacyTabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/tabs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PharmacyTabs />;
}
