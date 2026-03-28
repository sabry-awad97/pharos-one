/**
 * Staff module
 * Registers the staff module with the module registry
 */

import { Users } from "lucide-react";
import { registerModule } from "../registry";
import { StaffWorkspace } from "./StaffWorkspace";

// Register staff module on import
registerModule({
  id: "staff",
  label: "Staff",
  icon: Users,
  component: StaffWorkspace,
});

// Export components for direct use if needed
export { StaffWorkspace };

// Export types
export type {
  Staff,
  Credential,
  AttRecord,
  LeaveReq,
  ShiftTemplate,
  StaffRole,
  DutyStatus,
  LicenseStatus,
  LeaveStatus,
  AttStatus,
  StaffTabId,
} from "./types";

// Export mock data
export {
  STAFF_DATA,
  ATTENDANCE_RECORDS,
  LEAVE_REQUESTS,
  SHIFT_TEMPLATES,
} from "./mock-data";
