/**
 * Workspace feature public interface
 * Exports only the public API for the workspace tab system
 */

export { useTabs } from "./hooks/use-tabs";
export { TabBar } from "./components/TabBar";
export { TabItem } from "./components/TabItem";
export { TabContextMenu } from "./components/TabContextMenu";
export { SplitView } from "./components/SplitView";
export type { Tab, TabState } from "./types";
export type { UseTabsReturn } from "./hooks/use-tabs";
export type { TabBarProps } from "./components/TabBar";
export type { TabItemProps } from "./components/TabItem";
export type { TabContextMenuProps } from "./components/TabContextMenu";
export type { SplitViewProps } from "./components/SplitView";
