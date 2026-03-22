import { createFileRoute } from "@tanstack/react-router";
import { DashboardWorkspace } from "@/features/modules/dashboard";
import { AnnotationCallouts } from "@/features/modules/components/AnnotationCallouts";

export const Route = createFileRoute("/_app/home/dashboard/")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Main workspace content - fills available space */}
      <div className="flex-1 min-h-0 flex flex-col">
        <DashboardWorkspace split={false} />
      </div>

      {/* AnnotationCallouts section - fixed height at bottom above status bar */}
      <div className="flex-none px-4 pb-3" data-testid="callouts-section">
        <AnnotationCallouts />
      </div>
    </div>
  );
}
