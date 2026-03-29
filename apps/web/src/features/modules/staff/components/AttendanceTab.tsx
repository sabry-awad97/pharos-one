/**
 * AttendanceTab Component
 * Displays staff attendance records filtered by staffId
 */

import type { Staff } from "../types";
import { ATTENDANCE_RECORDS } from "../mock-data";

export interface AttendanceTabProps {
  staff: Staff;
}

export function AttendanceTab({ staff }: AttendanceTabProps) {
  const staffRecords = ATTENDANCE_RECORDS.filter(
    (record) => record.staffId === staff.id,
  );

  return (
    <div className="p-4 space-y-3">
      {staffRecords.map((record, index) => (
        <div key={index} className="border-b pb-3">
          <div>{record.date}</div>
          <div>{record.status}</div>
          <div>
            {record.scheduledStart} - {record.scheduledEnd}
          </div>
          <div>{record.hoursWorked} hours</div>
        </div>
      ))}
    </div>
  );
}
