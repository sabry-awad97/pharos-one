import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceContainer } from "@/features/modules";

export const Route = createFileRoute("/_app/home/customers")({
  component: CustomersRoute,
});

function CustomersRoute() {
  return <WorkspaceContainer moduleId="customers" split={false} />;
}
