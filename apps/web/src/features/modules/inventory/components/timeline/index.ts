/**
 * Timeline Components
 * Reusable timeline UI components for transaction history
 *
 * ARCHITECTURE: Composable components following shadcn/ui patterns
 * - TimelineMarker: Icon + color for transaction type
 * - TimelineItem: Full transaction display
 * - TimelineGroup: Groups transactions by date
 * - Timeline: Main container with automatic grouping
 *
 * USAGE:
 * ```typescript
 * import { Timeline } from './components/timeline';
 * <Timeline transactions={transactions} />
 * ```
 */

export { TimelineMarker } from "./TimelineMarker";
export type { TimelineMarkerProps } from "./TimelineMarker";

export { TimelineItem } from "./TimelineItem";
export type { TimelineItemProps } from "./TimelineItem";

export { TimelineGroup } from "./TimelineGroup";
export type { TimelineGroupProps } from "./TimelineGroup";

export { Timeline } from "./Timeline";
export type { TimelineProps } from "./Timeline";
