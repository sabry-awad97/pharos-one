/**
 * MetricsTab Component
 * Displays staff performance metrics
 */

import type { Staff } from "../types";

export interface MetricsTabProps {
  staff: Staff;
}

export function MetricsTab({ staff }: MetricsTabProps) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <div>Punctuality Score</div>
        <div>{staff.punctualityScore}</div>
      </div>

      <div>
        <div>Hours This Week</div>
        <div>{staff.hoursThisWeek}</div>
      </div>

      <div>
        <div>OT Hours</div>
        <div>{staff.otHours}</div>
      </div>

      <div>
        <div>Leave Balance</div>
        <div>{staff.leaveBalance}</div>
      </div>
    </div>
  );
}
