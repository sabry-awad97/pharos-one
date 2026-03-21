import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/purchases")({
  component: PurchasesRoute,
});

function PurchasesRoute() {
  return <WorkspaceContainer moduleId="purchases" split={false} />;
}
