import { PharmacyPOS } from "@/mockups/pharmacy-pos/PharmacyPOS";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/pos")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PharmacyPOS />;
}
