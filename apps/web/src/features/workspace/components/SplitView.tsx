/**
 * SplitView component
 * Renders two workspace panes side-by-side with a divider
 * Matches PharmacyTabs.tsx split view (lines 1327-1345)
 */

import { WorkspaceContainer } from "@/features/modules/components/WorkspaceContainer";

export interface SplitViewProps {
  /** Module ID for left pane */
  leftModuleId: string | null;
  /** Module ID for right pane */
  rightModuleId: string | null;
}

/**
 * Split view container with two independent workspace panes
 * Exact match to old implementation structure
 */
export function SplitView({ leftModuleId, rightModuleId }: SplitViewProps) {
  return (
    <>
      <WorkspaceContainer moduleId={leftModuleId} />
      <div style={{ width: 1, background: "#e0e0e0", flexShrink: 0 }} />
      <WorkspaceContainer moduleId={rightModuleId} />
    </>
  );
}
