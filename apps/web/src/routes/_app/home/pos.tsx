import { createFileRoute } from "@tanstack/react-router"
import { WorkspaceContainer } from "@/features/modules";
import { useTabContext } from "@/features/workspace/context/TabContext";

export const Route = createFileRoute("/_app/home/pos")({
  component: PosRoute,
});

function PosRoute() {
  const { activeTabLabel } = useTabContext();
  return (
    <WorkspaceContainer
      moduleId="pos"
      split={false}
      label={activeTabLabel}
    />
  );
}
