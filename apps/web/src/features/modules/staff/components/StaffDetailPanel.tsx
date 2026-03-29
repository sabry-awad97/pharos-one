/**
 * StaffDetailPanel Component
 * Right-side panel displaying staff details with tabbed content
 *
 * ARCHITECTURE: Inline panel component (not overlay)
 * - Displays next to directory in workspace
 * - Uses Tabs component for navigation
 * - Shows Profile, Credentials, Attendance, Metrics tabs
 */

import { X } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@pharos-one/ui/components/tabs";
import type { Staff } from "../types";
import { ProfileTab } from "./ProfileTab";
import { CredentialsTab } from "./CredentialsTab";
import { AttendanceTab } from "./AttendanceTab";
import { MetricsTab } from "./MetricsTab";

export interface StaffDetailPanelProps {
  staff: Staff;
  onClose: () => void;
}

export function StaffDetailPanel({ staff, onClose }: StaffDetailPanelProps) {
  return (
    <Tabs
      defaultValue="profile"
      className="flex flex-col h-full bg-card border-l border-border"
    >
      {/* Header */}
      <div className="flex-none border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
              {staff.initials}
            </div>

            {/* Staff Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {staff.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {staff.role}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {staff.dutyStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <TabsList variant="line" className="px-4 h-auto gap-6">
          <TabsTrigger
            value="profile"
            className="font-semibold data-active:text-primary after:bg-primary after:h-[2px]"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="credentials"
            className="font-semibold data-active:text-primary after:bg-primary after:h-[2px]"
          >
            Credentials
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="font-semibold data-active:text-primary after:bg-primary after:h-[2px]"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="font-semibold data-active:text-primary after:bg-primary after:h-[2px]"
          >
            Metrics
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Content */}
      <TabsContent
        value="profile"
        className="flex-1 m-0 p-0 overflow-auto custom-scrollbar"
      >
        <ProfileTab staff={staff} />
      </TabsContent>
      <TabsContent
        value="credentials"
        className="flex-1 m-0 p-0 overflow-auto custom-scrollbar"
      >
        <CredentialsTab staff={staff} />
      </TabsContent>
      <TabsContent
        value="attendance"
        className="flex-1 m-0 p-0 overflow-auto custom-scrollbar"
      >
        <AttendanceTab staff={staff} />
      </TabsContent>
      <TabsContent
        value="metrics"
        className="flex-1 m-0 p-0 overflow-auto custom-scrollbar"
      >
        <MetricsTab staff={staff} />
      </TabsContent>
    </Tabs>
  );
}
