/**
 * Tab Context
 * Provides active tab information to child components
 */

import { createContext, useContext } from "react";

interface TabContextValue {
  activeTabLabel?: string;
}

const TabContext = createContext<TabContextValue>({});

export function TabProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TabContextValue;
}) {
  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}

export function useTabContext() {
  return useContext(TabContext);
}
