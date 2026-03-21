import * as React from "react";
import type { TabStatistics } from "../types";
import { cn } from "@pharos-one/ui/lib/utils";

interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  statistics?: TabStatistics;
  keyboardShortcuts?: string;
}

const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  (
    {
      className,
      statistics = { totalTabs: 0, pinnedTabs: 0, unsavedTabs: 0 },
      keyboardShortcuts = "Ctrl+T New · Ctrl+W Close · Ctrl+Tab Switch · Ctrl+\\ Split",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-[22px] flex-none items-center gap-4 bg-primary px-3 text-[10px]",
          className,
        )}
        {...props}
      >
        {/* Tab statistics */}
        <StatusBarStat label="Tabs Open" value={statistics.totalTabs} />
        <StatusBarStat label="Pinned" value={statistics.pinnedTabs} />
        <StatusBarStat label="Unsaved" value={statistics.unsavedTabs} />

        <div className="flex-1" />

        {/* Keyboard shortcuts hint */}
        <span className="text-primary-foreground/60">{keyboardShortcuts}</span>
      </div>
    );
  },
);
StatusBar.displayName = "StatusBar";

// Status bar stat component
interface StatusBarStatProps {
  label: string;
  value: number | string;
}

const StatusBarStat = React.forwardRef<HTMLSpanElement, StatusBarStatProps>(
  ({ label, value }, ref) => {
    return (
      <span ref={ref} className="text-primary-foreground/85">
        <b className="font-semibold text-primary-foreground">{label}:</b>{" "}
        {value}
      </span>
    );
  },
);
StatusBarStat.displayName = "StatusBarStat";

export { StatusBar, StatusBarStat };
