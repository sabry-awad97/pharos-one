/**
 * Staff module types
 * Extracted from StaffManagementStudio mockup
 */

import type { LucideIcon } from "lucide-react";

export type StaffRole = "Pharmacist" | "Technician" | "Manager" | "Owner";
export type DutyStatus = "On Duty" | "Off Duty" | "On Break";
export type LicenseStatus = "valid" | "expiring" | "critical" | "expired";
export type StaffTabId =
  | "overview"
  | "staff"
  | "credentials"
  | "attendance"
  | "leave"
  | "metrics";
export type AttSubTab = "live" | "schedule" | "leave" | "analytics";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type AttStatus =
  | "present"
  | "late"
  | "early_departure"
  | "absent"
  | "auto_closed";

export interface Credential {
  type: string;
  number: string;
  expiry: string;
  status: LicenseStatus;
  daysLeft: number;
}

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  avatar: string;
  initials: string;
  dutyStatus: DutyStatus;
  clockedIn: string | null;
  hoursThisWeek: number;
  credentials: Credential[];
  competencies: string[];
  lastActive: string;
  complianceScore: number;
  branch: string;
  otHours?: number;
  punctualityScore?: number;
  leaveBalance?: number;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  start: string;
  end: string;
  color: string;
  bg: string;
  border: string;
}

export interface AttRecord {
  staffId: string;
  date: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualIn: string | null;
  actualOut: string | null;
  breakMins: number;
  status: AttStatus;
  hoursWorked: number;
  otHours: number;
  note?: string;
}

export interface LeaveReq {
  id: string;
  staffId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submittedOn: string;
}
