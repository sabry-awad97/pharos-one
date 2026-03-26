import {
  Activity,
  AlarmClock,
  AlertTriangle,
  AlignLeft,
  Award,
  BarChart2,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Clock,
  Coffee,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Grid,
  LayoutGrid,
  LogOut,
  Mail,
  MapPin,
  Moon,
  MoreHorizontal,
  PauseCircle,
  Phone,
  PlayCircle,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sunrise,
  Sunset,
  Timer,
  TrendingUp,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

const W = {
  appBg: "#F3F3F3",
  surfaceBg: "#FFFFFF",
  titleBarBg: "#F9F9F9",
  subtleBg: "#F5F5F5",
  layerBg: "#FAFAFA",
  accent: "#0078D4",
  accentHover: "#106EBE",
  accentLight: "#EFF6FC",
  accentLightBorder: "#C7E2F5",
  textPrimary: "#1A1A1A",
  textSecondary: "#616161",
  textDisabled: "#ABABAB",
  textOnAccent: "#FFFFFF",
  textCaption: "#767676",
  borderSubtle: "rgba(0,0,0,0.08)",
  borderDefault: "rgba(0,0,0,0.12)",
  hoverFill: "rgba(0,0,0,0.04)",
  selectedFill: "rgba(0,120,212,0.08)",
  danger: "#C42B1C",
  dangerBg: "#FFF0EE",
  dangerBorder: "#F6BFBC",
  warning: "#835400",
  warningBg: "#FFF4CE",
  warningBorder: "#F8E0A0",
  success: "#0F7B0F",
  successBg: "#DFF6DD",
  successBorder: "#A8D5A2",
  caution: "#9D5D00",
  cautionBg: "#FFF4CE",
  cautionBorder: "#F8C96B",
  purple: "#7B61FF",
  purpleBg: "#F4EBFF",
  purpleBorder: "#D4BBFF",
  r4: "4px",
  r6: "6px",
  r8: "8px",
  shadowCard: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07)",
  shadowElevated: "0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
};

type StaffRole = "Pharmacist" | "Technician" | "Manager" | "Owner";
type DutyStatus = "On Duty" | "Off Duty" | "On Break";
type LicenseStatus = "valid" | "expiring" | "critical" | "expired";
type TabId =
  | "overview"
  | "staff"
  | "credentials"
  | "attendance"
  | "metrics"
  | "audit";
type AttSubTab = "live" | "schedule" | "leave" | "analytics";
type LeaveStatus = "pending" | "approved" | "rejected";
type AttStatus =
  | "present"
  | "late"
  | "early_departure"
  | "absent"
  | "auto_closed";

interface Credential {
  type: string;
  number: string;
  expiry: string;
  status: LicenseStatus;
  daysLeft: number;
}
interface Staff {
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
interface ShiftTemplate {
  id: string;
  name: string;
  icon: any;
  start: string;
  end: string;
  color: string;
  bg: string;
  border: string;
}
interface AttRecord {
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
interface LeaveReq {
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

const staffData: Staff[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "Pharmacist",
    email: "s.chen@rxpharmacy.com",
    phone: "+1 (555) 001-0001",
    avatar: "",
    initials: "SC",
    dutyStatus: "On Duty",
    clockedIn: "08:30 AM",
    hoursThisWeek: 32,
    credentials: [
      {
        type: "Pharmacist License",
        number: "PH-****-4892",
        expiry: "Dec 31, 2025",
        status: "expiring",
        daysLeft: 279,
      },
      {
        type: "DEA Registration",
        number: "DE-****-1120",
        expiry: "Mar 15, 2026",
        status: "valid",
        daysLeft: 354,
      },
      {
        type: "CPR Certification",
        number: "CP-****-0091",
        expiry: "Jun 1, 2025",
        status: "critical",
        daysLeft: 67,
      },
    ],
    competencies: ["Immunizations", "Compounding", "MTM"],
    lastActive: "Now",
    complianceScore: 88,
    branch: "Main Street",
    otHours: 2.5,
    punctualityScore: 96,
    leaveBalance: 12,
  },
  {
    id: "2",
    name: "Marcus Williams",
    role: "Technician",
    email: "m.williams@rxpharmacy.com",
    phone: "+1 (555) 002-0002",
    avatar: "",
    initials: "MW",
    dutyStatus: "On Break",
    clockedIn: "09:00 AM",
    hoursThisWeek: 28,
    credentials: [
      {
        type: "Pharmacy Tech License",
        number: "PT-****-7731",
        expiry: "Aug 22, 2025",
        status: "critical",
        daysLeft: 149,
      },
      {
        type: "Controlled Sub Training",
        number: "CS-****-3340",
        expiry: "Jan 10, 2026",
        status: "valid",
        daysLeft: 290,
      },
    ],
    competencies: ["Dispensing", "IV Prep"],
    lastActive: "12 min ago",
    complianceScore: 75,
    branch: "Main Street",
    otHours: 0,
    punctualityScore: 78,
    leaveBalance: 8,
  },
  {
    id: "3",
    name: "Priya Sharma",
    role: "Manager",
    email: "p.sharma@rxpharmacy.com",
    phone: "+1 (555) 003-0003",
    avatar: "",
    initials: "PS",
    dutyStatus: "On Duty",
    clockedIn: "07:45 AM",
    hoursThisWeek: 40,
    credentials: [
      {
        type: "Pharmacist License",
        number: "PH-****-2281",
        expiry: "Nov 14, 2026",
        status: "valid",
        daysLeft: 598,
      },
      {
        type: "DEA Registration",
        number: "DE-****-8870",
        expiry: "Sep 30, 2026",
        status: "valid",
        daysLeft: 553,
      },
      {
        type: "HIPAA Cert",
        number: "HP-****-0012",
        expiry: "Apr 5, 2025",
        status: "expired",
        daysLeft: -10,
      },
    ],
    competencies: ["Immunizations", "Compounding", "Counseling", "MTM"],
    lastActive: "Now",
    complianceScore: 95,
    branch: "Main Street",
    otHours: 3.0,
    punctualityScore: 99,
    leaveBalance: 18,
  },
  {
    id: "4",
    name: "James O'Brien",
    role: "Technician",
    email: "j.obrien@rxpharmacy.com",
    phone: "+1 (555) 004-0004",
    avatar: "",
    initials: "JO",
    dutyStatus: "Off Duty",
    clockedIn: null,
    hoursThisWeek: 16,
    credentials: [
      {
        type: "Pharmacy Tech License",
        number: "PT-****-5503",
        expiry: "Feb 28, 2026",
        status: "valid",
        daysLeft: 339,
      },
    ],
    competencies: ["Dispensing"],
    lastActive: "2 hours ago",
    complianceScore: 100,
    branch: "Main Street",
    otHours: 0,
    punctualityScore: 100,
    leaveBalance: 14,
  },
  {
    id: "5",
    name: "Linda Park",
    role: "Pharmacist",
    email: "l.park@rxpharmacy.com",
    phone: "+1 (555) 005-0005",
    avatar: "",
    initials: "LP",
    dutyStatus: "Off Duty",
    clockedIn: null,
    hoursThisWeek: 36,
    credentials: [
      {
        type: "Pharmacist License",
        number: "PH-****-9021",
        expiry: "Jul 4, 2025",
        status: "critical",
        daysLeft: 99,
      },
      {
        type: "DEA Registration",
        number: "DE-****-4430",
        expiry: "Dec 18, 2025",
        status: "expiring",
        daysLeft: 266,
      },
    ],
    competencies: ["Immunizations", "Counseling"],
    lastActive: "Yesterday",
    complianceScore: 82,
    branch: "Main Street",
    otHours: 4.0,
    punctualityScore: 85,
    leaveBalance: 6,
  },
];

const shiftTemplates: ShiftTemplate[] = [
  {
    id: "morning",
    name: "Morning",
    icon: Sunrise,
    start: "8:00 AM",
    end: "4:00 PM",
    color: W.caution,
    bg: W.warningBg,
    border: W.warningBorder,
  },
  {
    id: "evening",
    name: "Evening",
    icon: Sunset,
    start: "4:00 PM",
    end: "12:00 AM",
    color: W.accent,
    bg: W.accentLight,
    border: W.accentLightBorder,
  },
  {
    id: "night",
    name: "Night",
    icon: Moon,
    start: "12:00 AM",
    end: "8:00 AM",
    color: W.purple,
    bg: W.purpleBg,
    border: W.purpleBorder,
  },
];

const attendanceRecords: AttRecord[] = [
  {
    staffId: "1",
    date: "Today",
    scheduledStart: "8:00 AM",
    scheduledEnd: "4:00 PM",
    actualIn: "8:28 AM",
    actualOut: null,
    breakMins: 30,
    status: "present",
    hoursWorked: 6.5,
    otHours: 0,
    note: "",
  },
  {
    staffId: "2",
    date: "Today",
    scheduledStart: "9:00 AM",
    scheduledEnd: "5:00 PM",
    actualIn: "9:03 AM",
    actualOut: null,
    breakMins: 45,
    status: "present",
    hoursWorked: 5.5,
    otHours: 0,
    note: "",
  },
  {
    staffId: "3",
    date: "Today",
    scheduledStart: "7:30 AM",
    scheduledEnd: "3:30 PM",
    actualIn: "7:44 AM",
    actualOut: null,
    breakMins: 30,
    status: "present",
    hoursWorked: 7.3,
    otHours: 0,
    note: "",
  },
  {
    staffId: "4",
    date: "Today",
    scheduledStart: "2:00 PM",
    scheduledEnd: "10:00 PM",
    actualIn: null,
    actualOut: null,
    breakMins: 0,
    status: "absent",
    hoursWorked: 0,
    otHours: 0,
    note: "Day off",
  },
  {
    staffId: "5",
    date: "Today",
    scheduledStart: "8:00 AM",
    scheduledEnd: "4:00 PM",
    actualIn: null,
    actualOut: null,
    breakMins: 0,
    status: "absent",
    hoursWorked: 0,
    otHours: 0,
    note: "Sick leave",
  },
  {
    staffId: "1",
    date: "Yesterday",
    scheduledStart: "8:00 AM",
    scheduledEnd: "4:00 PM",
    actualIn: "7:58 AM",
    actualOut: "4:32 PM",
    breakMins: 30,
    status: "present",
    hoursWorked: 8.5,
    otHours: 0.5,
    note: "",
  },
  {
    staffId: "2",
    date: "Yesterday",
    scheduledStart: "9:00 AM",
    scheduledEnd: "5:00 PM",
    actualIn: "9:18 AM",
    actualOut: "5:00 PM",
    breakMins: 45,
    status: "late",
    hoursWorked: 7.7,
    otHours: 0,
    note: "Late arrival — 18 min",
  },
  {
    staffId: "3",
    date: "Yesterday",
    scheduledStart: "7:30 AM",
    scheduledEnd: "3:30 PM",
    actualIn: "7:30 AM",
    actualOut: "5:15 PM",
    breakMins: 30,
    status: "present",
    hoursWorked: 9.25,
    otHours: 1.75,
    note: "",
  },
  {
    staffId: "4",
    date: "Yesterday",
    scheduledStart: "2:00 PM",
    scheduledEnd: "10:00 PM",
    actualIn: "2:00 PM",
    actualOut: "10:00 PM",
    breakMins: 30,
    status: "present",
    hoursWorked: 7.5,
    otHours: 0,
    note: "",
  },
  {
    staffId: "5",
    date: "Yesterday",
    scheduledStart: "8:00 AM",
    scheduledEnd: "4:00 PM",
    actualIn: "8:05 AM",
    actualOut: "2:45 PM",
    breakMins: 30,
    status: "early_departure",
    hoursWorked: 6.17,
    otHours: 0,
    note: "Left early — 75 min",
  },
];

const leaveRequests: LeaveReq[] = [
  {
    id: "l1",
    staffId: "5",
    type: "Sick Leave",
    startDate: "Mar 26",
    endDate: "Mar 27",
    days: 2,
    reason: "Feeling unwell, doctor visit",
    status: "approved",
    submittedOn: "Mar 25",
  },
  {
    id: "l2",
    staffId: "2",
    type: "Vacation",
    startDate: "Apr 5",
    endDate: "Apr 9",
    days: 5,
    reason: "Family trip — booked in advance",
    status: "pending",
    submittedOn: "Mar 20",
  },
  {
    id: "l3",
    staffId: "4",
    type: "Personal",
    startDate: "Mar 26",
    endDate: "Mar 26",
    days: 1,
    reason: "Personal errand",
    status: "approved",
    submittedOn: "Mar 24",
  },
  {
    id: "l4",
    staffId: "1",
    type: "Vacation",
    startDate: "Apr 15",
    endDate: "Apr 18",
    days: 4,
    reason: "Spring break travel",
    status: "pending",
    submittedOn: "Mar 22",
  },
  {
    id: "l5",
    staffId: "3",
    type: "Emergency",
    startDate: "Mar 15",
    endDate: "Mar 15",
    days: 1,
    reason: "Family emergency",
    status: "approved",
    submittedOn: "Mar 15",
  },
  {
    id: "l6",
    staffId: "2",
    type: "Sick Leave",
    startDate: "Feb 10",
    endDate: "Feb 12",
    days: 3,
    reason: "Flu — medical certificate attached",
    status: "approved",
    submittedOn: "Feb 10",
  },
];

const navItems = [
  { icon: LayoutGrid, label: "Overview", id: "overview" as TabId },
  { icon: Users, label: "Staff Directory", id: "staff" as TabId },
  { icon: Shield, label: "Credentials", id: "credentials" as TabId },
  { icon: Clock, label: "Attendance", id: "attendance" as TabId },
  { icon: BarChart2, label: "Metrics", id: "metrics" as TabId },
  { icon: FileText, label: "Audit Trail", id: "audit" as TabId },
];

const avatarColors = [
  ["#EFF6FC", "#0078D4"],
  ["#DFF6DD", "#0F7B0F"],
  ["#FFF4CE", "#835400"],
  ["#FFF0EE", "#C42B1C"],
  ["#F4EBFF", "#7B61FF"],
];

function Avatar({ staff, size = 32 }: { staff: Staff; size?: number }) {
  const [bg, fg] = avatarColors[parseInt(staff.id) % avatarColors.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: fg,
        fontSize: size * 0.36,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        letterSpacing: 0.3,
      }}
    >
      {staff.initials}
    </div>
  );
}

function StatusBadge({ status }: { status: DutyStatus }) {
  const map: Record<DutyStatus, { bg: string; text: string; dot: string }> = {
    "On Duty": { bg: W.successBg, text: W.success, dot: W.success },
    "On Break": { bg: W.warningBg, text: W.warning, dot: W.caution },
    "Off Duty": { bg: W.subtleBg, text: W.textSecondary, dot: W.textDisabled },
  };
  const s = map[status];
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        borderRadius: 100,
        padding: "2px 9px",
        fontSize: 11,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 6,
          height: 6,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {status === "On Duty" && (
          <span
            className="ping"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: s.dot,
              opacity: 0.5,
            }}
          />
        )}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: s.dot,
            position: "relative",
            zIndex: 1,
          }}
        />
      </span>
      {status}
    </span>
  );
}

function CredBadge({
  status,
  daysLeft,
}: {
  status: LicenseStatus;
  daysLeft: number;
}) {
  const map: Record<
    LicenseStatus,
    { bg: string; text: string; border: string; label: string }
  > = {
    valid: {
      bg: W.successBg,
      text: W.success,
      border: W.successBorder,
      label: `${daysLeft}d`,
    },
    expiring: {
      bg: W.warningBg,
      text: W.warning,
      border: W.warningBorder,
      label: `${daysLeft}d`,
    },
    critical: {
      bg: W.dangerBg,
      text: W.danger,
      border: W.dangerBorder,
      label: `${daysLeft}d`,
    },
    expired: {
      bg: "#F0F0F0",
      text: W.textDisabled,
      border: W.borderDefault,
      label: "Expired",
    },
  };
  const m = map[status];
  return (
    <span
      style={{
        background: m.bg,
        color: m.text,
        border: `1px solid ${m.border}`,
        borderRadius: W.r4,
        padding: "1px 6px",
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      {m.label}
    </span>
  );
}

function CredIcon({ status }: { status: LicenseStatus }) {
  if (status === "valid") return <CheckCircle size={13} color={W.success} />;
  if (status === "expiring")
    return <AlertTriangle size={13} color={W.warning} />;
  if (status === "critical")
    return <AlertTriangle size={13} color={W.danger} />;
  return <XCircle size={13} color={W.textDisabled} />;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? W.success : score >= 70 ? W.caution : W.danger;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: W.subtleBg,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          minWidth: 22,
          textAlign: "right",
        }}
      >
        {score}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.7,
        color: W.textCaption,
        marginBottom: 8,
        marginTop: 16,
      }}
    >
      {children}
    </div>
  );
}

function AttStatusBadge({ status }: { status: AttStatus }) {
  const map: Record<
    AttStatus,
    { label: string; color: string; bg: string; border: string }
  > = {
    present: {
      label: "Present",
      color: W.success,
      bg: W.successBg,
      border: W.successBorder,
    },
    late: {
      label: "Late",
      color: W.warning,
      bg: W.warningBg,
      border: W.warningBorder,
    },
    early_departure: {
      label: "Early Out",
      color: W.caution,
      bg: W.cautionBg,
      border: W.cautionBorder,
    },
    absent: {
      label: "Absent",
      color: W.danger,
      bg: W.dangerBg,
      border: W.dangerBorder,
    },
    auto_closed: {
      label: "Auto-Closed",
      color: W.textSecondary,
      bg: W.subtleBg,
      border: W.borderDefault,
    },
  };
  const m = map[status];
  return (
    <span
      style={{
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        borderRadius: W.r4,
        padding: "1px 7px",
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      {m.label}
    </span>
  );
}

function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const map: Record<
    LeaveStatus,
    { label: string; color: string; bg: string; border: string }
  > = {
    pending: {
      label: "Pending",
      color: W.warning,
      bg: W.warningBg,
      border: W.warningBorder,
    },
    approved: {
      label: "Approved",
      color: W.success,
      bg: W.successBg,
      border: W.successBorder,
    },
    rejected: {
      label: "Rejected",
      color: W.danger,
      bg: W.dangerBg,
      border: W.dangerBorder,
    },
  };
  const m = map[status];
  return (
    <span
      style={{
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        borderRadius: W.r4,
        padding: "1px 7px",
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      {m.label}
    </span>
  );
}

// ── Attendance Detail Panel ─────────────────────────────────────────────────
function AttendanceDetailPanel({
  staff,
  records,
  leaves,
  onClose,
}: {
  staff: Staff | null;
  records: AttRecord[];
  leaves: LeaveReq[];
  onClose: () => void;
}) {
  if (!staff) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 12,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: W.subtleBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Clock size={22} color={W.textDisabled} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: W.textSecondary }}>
          No staff selected
        </div>
        <div style={{ fontSize: 12, color: W.textDisabled, lineHeight: 1.5 }}>
          Click any staff member
          <br />
          to view attendance
        </div>
      </div>
    );
  }
  const myRecords = records.filter((r) => r.staffId === staff.id);
  const myLeaves = leaves.filter((l) => l.staffId === staff.id);
  const todayRec = myRecords.find((r) => r.date === "Today");
  const weekHrs = myRecords.reduce((a, r) => a + r.hoursWorked, 0);
  const totalOT = myRecords.reduce((a, r) => a + r.otHours, 0);
  const lateCount = myRecords.filter((r) => r.status === "late").length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          background: W.layerBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Avatar staff={staff} size={40} />
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 700, color: W.textPrimary }}
              >
                {staff.name}
              </div>
              <div
                style={{ fontSize: 11, color: W.textSecondary, marginTop: 1 }}
              >
                {staff.role}
              </div>
              <div style={{ marginTop: 5 }}>
                <StatusBadge status={staff.dutyStatus} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: W.textSecondary,
              borderRadius: W.r4,
            }}
          >
            <X size={14} />
          </button>
        </div>
        {/* Today's shift */}
        {todayRec && (
          <div
            style={{
              marginTop: 12,
              background:
                todayRec.status === "absent" ? W.dangerBg : W.successBg,
              border: `1px solid ${todayRec.status === "absent" ? W.dangerBorder : W.successBorder}`,
              borderRadius: W.r6,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: todayRec.status === "absent" ? W.danger : W.success,
                marginBottom: 4,
              }}
            >
              Today's Shift
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
              }}
            >
              <span style={{ color: W.textSecondary }}>Scheduled</span>
              <span style={{ fontWeight: 600 }}>
                {todayRec.scheduledStart} – {todayRec.scheduledEnd}
              </span>
            </div>
            {todayRec.actualIn && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                <span style={{ color: W.textSecondary }}>Clocked In</span>
                <span style={{ fontWeight: 700, color: W.success }}>
                  {todayRec.actualIn}
                </span>
              </div>
            )}
            {todayRec.note && (
              <div style={{ fontSize: 10, color: W.textCaption, marginTop: 4 }}>
                {todayRec.note}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="custom-scroll"
        style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}
      >
        <SectionTitle>This Period</SectionTitle>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {[
            {
              label: "Hours Worked",
              val: `${weekHrs.toFixed(1)}h`,
              sub: "This week",
            },
            {
              label: "OT Hours",
              val: `${totalOT.toFixed(1)}h`,
              sub: "This week",
            },
            {
              label: "Punctuality",
              val: `${staff.punctualityScore}%`,
              sub: "30-day score",
            },
            {
              label: "Leave Balance",
              val: `${staff.leaveBalance}d`,
              sub: "Remaining",
            },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                background: W.subtleBg,
                borderRadius: W.r6,
                padding: "8px 10px",
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, color: W.textPrimary }}
              >
                {m.val}
              </div>
              <div
                style={{ fontSize: 10, color: W.textSecondary, marginTop: 1 }}
              >
                {m.label}
              </div>
              <div style={{ fontSize: 9, color: W.textCaption }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <SectionTitle>Attendance Log</SectionTitle>
        {myRecords.map((r, i) => (
          <div
            key={i}
            style={{
              padding: "7px 10px",
              background: W.subtleBg,
              borderRadius: W.r6,
              marginBottom: 5,
              borderLeft: `2px solid ${r.status === "present" ? W.success : r.status === "late" ? W.warning : r.status === "absent" ? W.danger : W.caution}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 11, fontWeight: 700, color: W.textPrimary }}
              >
                {r.date}
              </span>
              <AttStatusBadge status={r.status} />
            </div>
            <div style={{ fontSize: 10, color: W.textSecondary, marginTop: 3 }}>
              {r.actualIn ? `In ${r.actualIn}` : "No clock-in"}
              {r.actualOut
                ? ` · Out ${r.actualOut}`
                : r.actualIn
                  ? " · Still on shift"
                  : ""}
            </div>
            <div style={{ fontSize: 10, color: W.textCaption }}>
              {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(1)}h worked` : "—"}
              {r.otHours > 0 ? ` · +${r.otHours}h OT` : ""}
            </div>
            {r.note && (
              <div style={{ fontSize: 9, color: W.danger, marginTop: 2 }}>
                {r.note}
              </div>
            )}
          </div>
        ))}

        <SectionTitle>Leave Requests</SectionTitle>
        {myLeaves.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: W.textDisabled,
              textAlign: "center",
              padding: "10px 0",
            }}
          >
            No leave requests
          </div>
        ) : (
          myLeaves.map((l, i) => (
            <div
              key={i}
              style={{
                padding: "8px 10px",
                background: W.subtleBg,
                borderRadius: W.r6,
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700 }}>{l.type}</span>
                <LeaveStatusBadge status={l.status} />
              </div>
              <div
                style={{ fontSize: 10, color: W.textSecondary, marginTop: 2 }}
              >
                {l.startDate} – {l.endDate} · {l.days} day
                {l.days > 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: 10, color: W.textCaption, marginTop: 1 }}>
                {l.reason}
              </div>
            </div>
          ))
        )}

        <SectionTitle>Quick Actions</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {staff.dutyStatus === "Off Duty" && (
            <button
              style={{
                padding: "7px 12px",
                background: W.successBg,
                color: W.success,
                border: `1px solid ${W.successBorder}`,
                borderRadius: W.r6,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              ▶ Clock In
            </button>
          )}
          {staff.dutyStatus === "On Duty" && (
            <button
              style={{
                padding: "7px 12px",
                background: W.warningBg,
                color: W.warning,
                border: `1px solid ${W.warningBorder}`,
                borderRadius: W.r6,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              ⏸ Start Break
            </button>
          )}
          {(staff.dutyStatus === "On Duty" ||
            staff.dutyStatus === "On Break") && (
            <button
              style={{
                padding: "7px 12px",
                background: W.dangerBg,
                color: W.danger,
                border: `1px solid ${W.dangerBorder}`,
                borderRadius: W.r6,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              ⏹ Clock Out
            </button>
          )}
          <button
            style={{
              padding: "7px 12px",
              background: W.subtleBg,
              color: W.textPrimary,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r6,
              fontSize: 11,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            + Submit Leave Request
          </button>
          <button
            style={{
              padding: "7px 12px",
              background: W.subtleBg,
              color: W.textPrimary,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r6,
              fontSize: 11,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            ✎ Adjust Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Staff Detail Panel (for non-attendance tabs) ────────────────────────────
function StaffDetailPanel({
  staff,
  onClose,
}: {
  staff: Staff | null;
  onClose: () => void;
}) {
  if (!staff) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 12,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: W.subtleBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Users size={22} color={W.textDisabled} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: W.textSecondary }}>
          No staff selected
        </div>
        <div style={{ fontSize: 12, color: W.textDisabled, lineHeight: 1.5 }}>
          Click any staff member
          <br />
          to view their profile
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          background: W.layerBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Avatar staff={staff} size={40} />
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 700, color: W.textPrimary }}
              >
                {staff.name}
              </div>
              <div
                style={{ fontSize: 11, color: W.textSecondary, marginTop: 1 }}
              >
                {staff.role} · {staff.branch}
              </div>
              <div style={{ marginTop: 5 }}>
                <StatusBadge status={staff.dutyStatus} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: W.textSecondary,
              borderRadius: W.r4,
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button
            style={{
              flex: 1,
              padding: "5px 0",
              background: W.accent,
              color: "white",
              border: "none",
              borderRadius: W.r6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Edit size={11} />
            Edit
          </button>
          <button
            style={{
              flex: 1,
              padding: "5px 0",
              background: W.subtleBg,
              color: W.textPrimary,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r6,
              fontSize: 11,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Upload size={11} />
            Upload
          </button>
          {(staff.dutyStatus === "On Duty" ||
            staff.dutyStatus === "On Break") && (
            <button
              style={{
                padding: "5px 10px",
                background: W.warningBg,
                color: W.warning,
                border: `1px solid ${W.warningBorder}`,
                borderRadius: W.r6,
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Clock size={11} />
              Out
            </button>
          )}
        </div>
      </div>
      <div
        className="custom-scroll"
        style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}
      >
        <SectionTitle>Contact</SectionTitle>
        {[
          { icon: Mail, val: staff.email },
          { icon: Phone, val: staff.phone },
          { icon: MapPin, val: `${staff.branch} Branch` },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 5,
              fontSize: 12,
            }}
          >
            <r.icon size={12} color={W.textSecondary} />
            <span
              style={{
                color: W.textPrimary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {r.val}
            </span>
          </div>
        ))}
        <SectionTitle>Activity</SectionTitle>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {[
            { label: "This Week", val: `${staff.hoursThisWeek}h` },
            { label: "Last Active", val: staff.lastActive },
            { label: "Clock-In", val: staff.clockedIn || "—" },
            { label: "Compliance", val: `${staff.complianceScore}%` },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                background: W.subtleBg,
                borderRadius: W.r6,
                padding: "8px 10px",
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, color: W.textPrimary }}
              >
                {m.val}
              </div>
              <div
                style={{ fontSize: 10, color: W.textSecondary, marginTop: 1 }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
        <SectionTitle>Credentials</SectionTitle>
        {staff.credentials.map((c, i) => (
          <div
            key={i}
            style={{
              padding: "9px 11px",
              background:
                c.status === "expired"
                  ? W.dangerBg
                  : c.status === "critical"
                    ? "#FFF8F7"
                    : c.status === "expiring"
                      ? W.warningBg
                      : W.subtleBg,
              borderRadius: W.r6,
              border: `1px solid ${c.status === "expired" || c.status === "critical" ? W.dangerBorder : c.status === "expiring" ? W.warningBorder : W.borderSubtle}`,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontWeight: 600, fontSize: 12, color: W.textPrimary }}
              >
                {c.type}
              </span>
              <CredBadge status={c.status} daysLeft={c.daysLeft} />
            </div>
            <div style={{ fontSize: 10, color: W.textSecondary, marginTop: 3 }}>
              {c.number} · Expires {c.expiry}
            </div>
            {(c.status === "expired" || c.status === "critical") && (
              <button
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  color: W.accent,
                  background: W.accentLight,
                  border: `1px solid ${W.accentLightBorder}`,
                  borderRadius: W.r4,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Start Renewal →
              </button>
            )}
          </div>
        ))}
        <SectionTitle>Competencies</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {staff.competencies.map((c, i) => (
            <span
              key={i}
              style={{
                background: W.accentLight,
                color: W.accent,
                border: `1px solid ${W.accentLightBorder}`,
                borderRadius: W.r4,
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────────────
function OverviewTab({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
}) {
  const onDuty = allStaff.filter((s) => s.dutyStatus === "On Duty").length;
  const onBreak = allStaff.filter((s) => s.dutyStatus === "On Break").length;
  const allCreds = allStaff.flatMap((s) => s.credentials);
  const expired = allCreds.filter((c) => c.status === "expired").length;
  const critical = allCreds.filter((c) => c.status === "critical").length;
  const expiring = allCreds.filter((c) => c.status === "expiring").length;
  const avgScore = Math.round(
    allStaff.reduce((a, s) => a + s.complianceScore, 0) / allStaff.length,
  );

  return (
    <div
      className="custom-scroll"
      style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Total Staff",
            val: allStaff.length,
            icon: Users,
            color: W.accent,
            bg: W.accentLight,
            border: W.accentLightBorder,
            sub: "Main Street Branch",
          },
          {
            label: "On Duty Now",
            val: onDuty,
            icon: CheckCircle,
            color: W.success,
            bg: W.successBg,
            border: W.successBorder,
            sub: `${onBreak} on break`,
          },
          {
            label: "Compliance Alerts",
            val: expired + critical + expiring,
            icon: AlertTriangle,
            color: W.danger,
            bg: W.dangerBg,
            border: W.dangerBorder,
            sub: `${expired} expired`,
          },
          {
            label: "Avg Compliance",
            val: `${avgScore}%`,
            icon: Award,
            color: avgScore >= 85 ? W.success : W.caution,
            bg: avgScore >= 85 ? W.successBg : W.cautionBg,
            border: avgScore >= 85 ? W.successBorder : W.cautionBorder,
            sub: "Target: 90%",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: W.textSecondary,
                    marginBottom: 6,
                  }}
                >
                  {kpi.label}
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 700, color: kpi.color }}
                >
                  {kpi.val}
                </div>
                <div
                  style={{ fontSize: 11, color: W.textSecondary, marginTop: 3 }}
                >
                  {kpi.sub}
                </div>
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: W.r6,
                  background: kpi.bg,
                  border: `1px solid ${kpi.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <kpi.icon size={16} color={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            Duty Status Breakdown
          </div>
          {[
            { label: "On Duty", val: onDuty, color: W.success },
            { label: "On Break", val: onBreak, color: W.caution },
            {
              label: "Off Duty",
              val: allStaff.filter((s) => s.dutyStatus === "Off Duty").length,
              color: W.textSecondary,
            },
          ].map((d, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 3,
                }}
              >
                <span>{d.label}</span>
                <span style={{ fontWeight: 700, color: d.color }}>
                  {d.val} / {allStaff.length}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: W.subtleBg,
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(d.val / allStaff.length) * 100}%`,
                    height: "100%",
                    background: d.color,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            Credential Alerts
          </div>
          {[
            {
              label: "Expired",
              val: expired,
              color: W.danger,
              bg: W.dangerBg,
              border: W.dangerBorder,
            },
            {
              label: "Critical (<30d)",
              val: critical,
              color: W.danger,
              bg: "#FFF8F7",
              border: W.dangerBorder,
            },
            {
              label: "Expiring (30–90d)",
              val: expiring,
              color: W.warning,
              bg: W.warningBg,
              border: W.warningBorder,
            },
            {
              label: "Valid (>90d)",
              val: allCreds.filter((c) => c.status === "valid").length,
              color: W.success,
              bg: W.successBg,
              border: W.successBorder,
            },
          ].map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 8px",
                background: a.bg,
                border: `1px solid ${a.border}`,
                borderRadius: W.r6,
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 12, color: a.color, fontWeight: 500 }}>
                {a.label}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: a.color }}>
                {a.val}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          Staff Compliance Scorecard
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
          }}
        >
          {allStaff.map((s) => {
            const color =
              s.complianceScore >= 90
                ? W.success
                : s.complianceScore >= 70
                  ? W.caution
                  : W.danger;
            return (
              <div
                key={s.id}
                onClick={() =>
                  onSelectStaff(selectedStaff?.id === s.id ? null : s)
                }
                style={{
                  background: W.subtleBg,
                  borderRadius: W.r8,
                  padding: 10,
                  cursor: "pointer",
                  border: `1.5px solid ${selectedStaff?.id === s.id ? W.accent : "transparent"}`,
                  textAlign: "center",
                }}
              >
                <Avatar staff={s} size={32} />
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    marginTop: 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.name.split(" ")[0]}
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color, marginTop: 2 }}
                >
                  {s.complianceScore}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          padding: "14px 16px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          Recent Alerts
        </div>
        {allStaff
          .flatMap((s) =>
            s.credentials
              .filter((c) => c.status !== "valid")
              .map((c) => ({ staff: s, cred: c })),
          )
          .slice(0, 5)
          .map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 0",
                borderBottom: `1px solid ${W.borderSubtle}`,
              }}
            >
              <CredIcon status={item.cred.status} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>
                  {item.staff.name} — {item.cred.type}
                </div>
                <div style={{ fontSize: 10, color: W.textCaption }}>
                  Expires {item.cred.expiry}
                </div>
              </div>
              <CredBadge
                status={item.cred.status}
                daysLeft={item.cred.daysLeft}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

// ── Staff Directory Tab ─────────────────────────────────────────────────────
function StaffDirectoryTab({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
}) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [view, setView] = useState<"list" | "grid">("list");
  const filtered = allStaff.filter((s) => {
    const mq =
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.role.toLowerCase().includes(q.toLowerCase());
    return (
      mq &&
      (role === "All" || s.role === role) &&
      (status === "All" || s.dutyStatus === status)
    );
  });
  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={13}
            color={W.textSecondary}
            style={{ position: "absolute", left: 8 }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            style={{
              paddingLeft: 28,
              paddingRight: 10,
              height: 28,
              background: W.subtleBg,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r6,
              fontSize: 12,
              color: W.textPrimary,
              width: 160,
              outline: "none",
            }}
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            height: 28,
            padding: "0 8px",
            background: W.subtleBg,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <option value="All">All Roles</option>
          {["Pharmacist", "Technician", "Manager"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            height: 28,
            padding: "0 8px",
            background: W.subtleBg,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <option value="All">All Statuses</option>
          {["On Duty", "On Break", "Off Duty"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span
          style={{
            padding: "2px 8px",
            background: W.subtleBg,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: 100,
            fontSize: 11,
            color: W.textSecondary,
          }}
        >
          {filtered.length} shown
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            background: W.subtleBg,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            padding: 2,
          }}
        >
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "3px 6px",
                borderRadius: W.r4,
                background: view === v ? W.surfaceBg : "transparent",
                border: "none",
                cursor: "pointer",
                color: view === v ? W.accent : W.textSecondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              {v === "list" ? <AlignLeft size={13} /> : <Grid size={13} />}
            </button>
          ))}
        </div>
      </div>
      <div
        className="custom-scroll"
        style={{ flex: 1, overflow: "auto", padding: 16 }}
      >
        {view === "list" ? (
          <div
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr 1fr 0.7fr 1.2fr 1.4fr 52px",
                padding: "7px 14px",
                background: W.subtleBg,
                borderBottom: `1px solid ${W.borderDefault}`,
                fontSize: 10,
                fontWeight: 700,
                color: W.textSecondary,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              <span>Member</span>
              <span>Role</span>
              <span>Status</span>
              <span>Hrs/Wk</span>
              <span>Credentials</span>
              <span>Compliance</span>
              <span />
            </div>
            {filtered.map((s, i) => {
              const worst = s.credentials.reduce((w, c) => {
                const ord: Record<LicenseStatus, number> = {
                  expired: 0,
                  critical: 1,
                  expiring: 2,
                  valid: 3,
                };
                return ord[c.status] < ord[w.status] ? c : w;
              }, s.credentials[0]);
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2.2fr 1fr 1fr 0.7fr 1.2fr 1.4fr 52px",
                    padding: "10px 14px",
                    borderBottom:
                      i < filtered.length - 1
                        ? `1px solid ${W.borderSubtle}`
                        : "none",
                    cursor: "pointer",
                    alignItems: "center",
                    background: isSelected ? W.selectedFill : "transparent",
                    borderLeft: `2.5px solid ${isSelected ? W.accent : "transparent"}`,
                    transition: "background 0.1s",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 9 }}
                  >
                    <Avatar staff={s} size={30} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 10, color: W.textSecondary }}>
                        {s.email}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: W.textSecondary,
                      background: W.subtleBg,
                      padding: "2px 7px",
                      borderRadius: W.r4,
                    }}
                  >
                    {s.role}
                  </span>
                  <StatusBadge status={s.dutyStatus} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    {s.hoursThisWeek}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: W.textSecondary,
                      }}
                    >
                      h
                    </span>
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    {worst && (
                      <>
                        <CredIcon status={worst.status} />
                        <CredBadge
                          status={worst.status}
                          daysLeft={worst.daysLeft}
                        />
                      </>
                    )}
                    {s.credentials.length > 1 && (
                      <span style={{ fontSize: 10, color: W.textSecondary }}>
                        +{s.credentials.length - 1}
                      </span>
                    )}
                  </div>
                  <ScoreBar score={s.complianceScore} />
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStaff(s);
                      }}
                      style={{
                        padding: 4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: W.textSecondary,
                        borderRadius: W.r4,
                      }}
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: 4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: W.textSecondary,
                        borderRadius: W.r4,
                      }}
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {filtered.map((s) => {
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  style={{
                    background: W.surfaceBg,
                    borderRadius: W.r8,
                    boxShadow: isSelected ? W.shadowElevated : W.shadowCard,
                    padding: 14,
                    cursor: "pointer",
                    border: `1.5px solid ${isSelected ? W.accent : "transparent"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Avatar staff={s} size={36} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 10, color: W.textSecondary }}>
                        {s.role}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={s.dutyStatus} />
                  <div style={{ marginTop: 8 }}>
                    <ScoreBar score={s.complianceScore} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Credentials Tab ─────────────────────────────────────────────────────────
function CredentialsTab({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
}) {
  const [filter, setFilter] = useState<LicenseStatus | "all">("all");
  const allCreds = allStaff.flatMap((s) =>
    s.credentials.map((c) => ({ ...c, staff: s })),
  );
  const shown =
    filter === "all" ? allCreds : allCreds.filter((c) => c.status === filter);
  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <Shield size={14} color={W.textSecondary} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: W.textPrimary,
            marginRight: 4,
          }}
        >
          Filter
        </span>
        {(
          [
            ["all", "All", W.textSecondary, W.subtleBg, W.borderDefault],
            ["expired", "Expired", W.danger, W.dangerBg, W.dangerBorder],
            ["critical", "Critical", W.danger, "#FFF8F7", W.dangerBorder],
            ["expiring", "Expiring", W.warning, W.warningBg, W.warningBorder],
            ["valid", "Valid", W.success, W.successBg, W.successBorder],
          ] as const
        ).map(([val, label, color, bg, border]) => (
          <button
            key={val}
            onClick={() => setFilter(val as any)}
            style={{
              padding: "3px 10px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: filter === val ? 700 : 500,
              color: filter === val ? color : W.textSecondary,
              background: filter === val ? bg : "transparent",
              border: `1px solid ${filter === val ? border : W.borderDefault}`,
              cursor: "pointer",
            }}
          >
            {label}{" "}
            {val !== "all" &&
              `(${allCreds.filter((c) => c.status === val).length})`}
          </button>
        ))}
        <button
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            background: W.subtleBg,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
            color: W.textPrimary,
          }}
        >
          <Download size={12} />
          Export
        </button>
      </div>
      <div
        className="custom-scroll"
        style={{ flex: 1, overflow: "auto", padding: 16 }}
      >
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 2fr 1fr 1fr 1fr 100px",
              padding: "7px 14px",
              background: W.subtleBg,
              borderBottom: `1px solid ${W.borderDefault}`,
              fontSize: 10,
              fontWeight: 700,
              color: W.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            <span>Staff Member</span>
            <span>Credential Type</span>
            <span>License #</span>
            <span>Expiry Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {shown.map((c, i) => {
            const isSelected = selectedStaff?.id === c.staff.id;
            return (
              <div
                key={i}
                onClick={() => onSelectStaff(isSelected ? null : c.staff)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 2fr 1fr 1fr 1fr 100px",
                  padding: "10px 14px",
                  borderBottom:
                    i < shown.length - 1
                      ? `1px solid ${W.borderSubtle}`
                      : "none",
                  cursor: "pointer",
                  alignItems: "center",
                  background: isSelected
                    ? W.selectedFill
                    : c.status === "expired"
                      ? "#FFFBFB"
                      : "transparent",
                  borderLeft: `2.5px solid ${isSelected ? W.accent : "transparent"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar staff={c.staff} size={26} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                    {c.staff.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CredIcon status={c.status} />
                  <span style={{ fontSize: 12 }}>{c.type}</span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: W.textSecondary,
                    fontFamily: "monospace",
                  }}
                >
                  {c.number}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: c.status === "expired" ? W.danger : W.textPrimary,
                  }}
                >
                  {c.expiry}
                </span>
                <CredBadge status={c.status} daysLeft={c.daysLeft} />
                {c.status === "expired" || c.status === "critical" ? (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: 11,
                      color: W.accent,
                      background: W.accentLight,
                      border: `1px solid ${W.accentLightBorder}`,
                      borderRadius: W.r4,
                      padding: "3px 8px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Renew →
                  </button>
                ) : (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: 11,
                      color: W.textSecondary,
                      background: W.subtleBg,
                      border: `1px solid ${W.borderDefault}`,
                      borderRadius: W.r4,
                      padding: "3px 8px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Attendance Tab — 4 sub-views ────────────────────────────────────────────
function AttendanceTab({
  allStaff,
  selectedStaff,
  onSelectStaff,
  records,
  leaves,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
  records: AttRecord[];
  leaves: LeaveReq[];
}) {
  const [sub, setSub] = useState<AttSubTab>("live");

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sub-nav */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          borderBottom: `1px solid ${W.borderSubtle}`,
          background: W.surfaceBg,
          paddingLeft: 20,
          flexShrink: 0,
        }}
      >
        {(
          [
            { id: "live", label: "Live View", icon: Activity },
            { id: "schedule", label: "Shift Schedule", icon: Calendar },
            { id: "leave", label: "Leave Requests", icon: ClipboardList },
            { id: "analytics", label: "Analytics", icon: BarChart2 },
          ] as { id: AttSubTab; label: string; icon: any }[]
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => setSub(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 14px",
              height: 36,
              background: "transparent",
              border: "none",
              borderBottom:
                sub === item.id
                  ? `2px solid ${W.accent}`
                  : "2px solid transparent",
              color: sub === item.id ? W.accent : W.textSecondary,
              fontWeight: sub === item.id ? 700 : 400,
              cursor: "pointer",
              fontSize: 11,
              transition: "color 0.1s",
              whiteSpace: "nowrap",
            }}
          >
            <item.icon size={12} />
            {item.label}
            {item.id === "leave" &&
              leaves.filter((l) => l.status === "pending").length > 0 && (
                <span
                  style={{
                    background: W.warning,
                    color: "white",
                    borderRadius: 100,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "1px 5px",
                  }}
                >
                  {leaves.filter((l) => l.status === "pending").length}
                </span>
              )}
          </button>
        ))}
      </div>

      {/* Sub content */}
      {sub === "live" && (
        <LiveView
          allStaff={allStaff}
          selectedStaff={selectedStaff}
          onSelectStaff={onSelectStaff}
          records={records}
        />
      )}
      {sub === "schedule" && (
        <ScheduleView
          allStaff={allStaff}
          selectedStaff={selectedStaff}
          onSelectStaff={onSelectStaff}
          records={records}
        />
      )}
      {sub === "leave" && (
        <LeaveView
          allStaff={allStaff}
          selectedStaff={selectedStaff}
          onSelectStaff={onSelectStaff}
          leaves={leaves}
        />
      )}
      {sub === "analytics" && (
        <AnalyticsView allStaff={allStaff} records={records} />
      )}
    </div>
  );
}

function LiveView({
  allStaff,
  selectedStaff,
  onSelectStaff,
  records,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
  records: AttRecord[];
}) {
  const todayRecs = records.filter((r) => r.date === "Today");
  const present = allStaff.filter((s) => s.dutyStatus !== "Off Duty").length;
  const absent = allStaff.filter((s) => s.dutyStatus === "Off Duty").length;
  const totalHrs = todayRecs.reduce((a, r) => a + r.hoursWorked, 0);
  const totalOT = todayRecs.reduce((a, r) => a + r.otHours, 0);

  return (
    <div
      className="custom-scroll"
      style={{ flex: 1, overflow: "auto", padding: 16 }}
    >
      {/* Live stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Present Today",
            val: present,
            icon: UserCheck,
            color: W.success,
            bg: W.successBg,
            border: W.successBorder,
          },
          {
            label: "Absent Today",
            val: absent,
            icon: UserX,
            color: W.danger,
            bg: W.dangerBg,
            border: W.dangerBorder,
          },
          {
            label: "Hours Clocked",
            val: `${totalHrs.toFixed(1)}h`,
            icon: Timer,
            color: W.accent,
            bg: W.accentLight,
            border: W.accentLightBorder,
          },
          {
            label: "OT Hours Today",
            val: `${totalOT.toFixed(1)}h`,
            icon: Zap,
            color: W.caution,
            bg: W.cautionBg,
            border: W.cautionBorder,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: W.textSecondary,
                    marginBottom: 6,
                  }}
                >
                  {m.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>
                  {m.val}
                </div>
              </div>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: W.r6,
                  background: m.bg,
                  border: `1px solid ${m.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <m.icon size={14} color={m.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shift columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {(["On Duty", "On Break", "Off Duty"] as DutyStatus[]).map((status) => {
          const staff = allStaff.filter((s) => s.dutyStatus === status);
          const styleMap: Record<
            DutyStatus,
            { color: string; bg: string; border: string }
          > = {
            "On Duty": {
              color: W.success,
              bg: W.successBg,
              border: W.successBorder,
            },
            "On Break": {
              color: W.caution,
              bg: W.cautionBg,
              border: W.cautionBorder,
            },
            "Off Duty": {
              color: W.textSecondary,
              bg: W.subtleBg,
              border: W.borderDefault,
            },
          };
          const gs = styleMap[status];
          return (
            <div
              key={status}
              style={{
                background: W.surfaceBg,
                borderRadius: W.r8,
                boxShadow: W.shadowCard,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  background: gs.bg,
                  borderBottom: `1px solid ${gs.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: gs.color }}
                >
                  {status}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: gs.color,
                    background: "white",
                    border: `1px solid ${gs.border}`,
                    borderRadius: 100,
                    padding: "0 6px",
                    fontWeight: 700,
                  }}
                >
                  {staff.length}
                </span>
              </div>
              {staff.length === 0 ? (
                <div
                  style={{
                    padding: "16px 12px",
                    textAlign: "center",
                    color: W.textDisabled,
                    fontSize: 11,
                  }}
                >
                  No staff
                </div>
              ) : (
                staff.map((s, i) => {
                  const rec = todayRecs.find((r) => r.staffId === s.id);
                  const isSelected = selectedStaff?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => onSelectStaff(isSelected ? null : s)}
                      style={{
                        padding: "9px 12px",
                        borderBottom:
                          i < staff.length - 1
                            ? `1px solid ${W.borderSubtle}`
                            : "none",
                        cursor: "pointer",
                        background: isSelected ? W.selectedFill : "transparent",
                        borderLeft: `2.5px solid ${isSelected ? W.accent : "transparent"}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <Avatar staff={s} size={28} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700 }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: 10, color: W.textSecondary }}>
                            {s.role}
                          </div>
                        </div>
                      </div>
                      {rec?.actualIn && (
                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 10,
                            color: W.textSecondary,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Clock size={9} />
                          In {rec.actualIn} · {rec.hoursWorked.toFixed(1)}h
                          {rec.otHours > 0 && (
                            <span style={{ color: W.caution, fontWeight: 700 }}>
                              +{rec.otHours}h OT
                            </span>
                          )}
                        </div>
                      )}
                      {rec?.note && (
                        <div
                          style={{ fontSize: 9, color: W.danger, marginTop: 2 }}
                        >
                          {rec.note}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Clock event log */}
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          padding: "14px 16px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          Today's Clock Events
        </div>
        {[
          {
            staff: staffData[2],
            action: "Clocked In",
            time: "07:45 AM",
            icon: PlayCircle,
            color: W.success,
          },
          {
            staff: staffData[0],
            action: "Clocked In",
            time: "08:28 AM",
            icon: PlayCircle,
            color: W.success,
          },
          {
            staff: staffData[1],
            action: "Clocked In",
            time: "09:03 AM",
            icon: PlayCircle,
            color: W.success,
          },
          {
            staff: staffData[1],
            action: "Break Started",
            time: "12:15 PM",
            icon: PauseCircle,
            color: W.caution,
          },
          {
            staff: staffData[4],
            action: "Sick Leave (Approved)",
            time: "—",
            icon: UserX,
            color: W.danger,
          },
          {
            staff: staffData[3],
            action: "Day Off (Approved)",
            time: "—",
            icon: Calendar,
            color: W.textSecondary,
          },
        ].map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
              borderBottom: i < 5 ? `1px solid ${W.borderSubtle}` : "none",
            }}
          >
            <e.icon size={14} color={e.color} />
            <Avatar staff={e.staff} size={22} />
            <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>
              {e.staff.name}
            </span>
            <span style={{ fontSize: 11, color: e.color, fontWeight: 500 }}>
              {e.action}
            </span>
            <span
              style={{
                fontSize: 10,
                color: W.textCaption,
                fontFamily: "monospace",
                minWidth: 60,
                textAlign: "right",
              }}
            >
              {e.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleView({
  allStaff,
  selectedStaff,
  onSelectStaff,
  records,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
  records: AttRecord[];
}) {
  const [dateView, setDateView] = useState<"today" | "yesterday">("today");
  const shown = records.filter(
    (r) => r.date === (dateView === "today" ? "Today" : "Yesterday"),
  );

  return (
    <div
      className="custom-scroll"
      style={{ flex: 1, overflow: "auto", padding: 16 }}
    >
      {/* Shift templates */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {shiftTemplates.map((t) => (
          <div
            key={t.id}
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: W.r6,
                background: t.bg,
                border: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <t.icon size={16} color={t.color} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>
                {t.name} Shift
              </div>
              <div style={{ fontSize: 11, color: W.textSecondary }}>
                {t.start} – {t.end}
              </div>
            </div>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                color: t.color,
                background: t.bg,
                border: `1px solid ${t.border}`,
                borderRadius: W.r4,
                padding: "2px 6px",
                fontWeight: 700,
              }}
            >
              8h
            </span>
          </div>
        ))}
      </div>

      {/* Date toggle + attendance table */}
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            borderBottom: `1px solid ${W.borderSubtle}`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700 }}>
            Attendance Record — Actual vs Scheduled
          </div>
          <div
            style={{
              display: "flex",
              background: W.subtleBg,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r6,
              padding: 2,
              gap: 1,
            }}
          >
            {(["today", "yesterday"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setDateView(v)}
                style={{
                  padding: "3px 10px",
                  borderRadius: W.r4,
                  background: dateView === v ? W.surfaceBg : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: dateView === v ? W.accent : W.textSecondary,
                  fontSize: 11,
                  fontWeight: dateView === v ? 700 : 400,
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1.8fr 1.2fr 1.2fr 1.2fr 1.2fr 0.8fr 1fr 100px",
            padding: "7px 16px",
            background: W.subtleBg,
            borderBottom: `1px solid ${W.borderDefault}`,
            fontSize: 9,
            fontWeight: 700,
            color: W.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          <span>Staff</span>
          <span>Sched. Start</span>
          <span>Sched. End</span>
          <span>Actual In</span>
          <span>Actual Out</span>
          <span>Break</span>
          <span>Hours / OT</span>
          <span>Status</span>
        </div>
        {shown.map((r, i) => {
          const staff = allStaff.find((s) => s.id === r.staffId);
          if (!staff) return null;
          const isSelected = selectedStaff?.id === staff.id;
          const lateMin = r.actualIn
            ? parseInt(r.actualIn.split(":")[0]) * 60 +
              parseInt(r.actualIn.split(":")[1]) -
              (parseInt(r.scheduledStart.split(":")[0]) * 60 +
                parseInt(r.scheduledStart.split(":")[1].split(" ")[0]))
            : 0;
          return (
            <div
              key={i}
              onClick={() => onSelectStaff(isSelected ? null : staff)}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1.8fr 1.2fr 1.2fr 1.2fr 1.2fr 0.8fr 1fr 100px",
                padding: "9px 16px",
                borderBottom:
                  i < shown.length - 1 ? `1px solid ${W.borderSubtle}` : "none",
                cursor: "pointer",
                alignItems: "center",
                background: isSelected
                  ? W.selectedFill
                  : r.status === "absent"
                    ? "#FFFBFB"
                    : "transparent",
                borderLeft: `2.5px solid ${isSelected ? W.accent : r.status === "absent" ? W.danger : "transparent"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Avatar staff={staff} size={24} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>
                  {staff.name}
                </span>
              </div>
              <span style={{ fontSize: 11 }}>{r.scheduledStart}</span>
              <span style={{ fontSize: 11 }}>{r.scheduledEnd}</span>
              <span
                style={{
                  fontSize: 11,
                  color:
                    r.status === "late" && lateMin > 10
                      ? W.danger
                      : W.textPrimary,
                  fontWeight: r.status === "late" ? 700 : 400,
                }}
              >
                {r.actualIn || <span style={{ color: W.textDisabled }}>—</span>}
              </span>
              <span style={{ fontSize: 11 }}>
                {r.actualOut || (
                  <span
                    style={{
                      color: r.actualIn ? W.success : W.textDisabled,
                      fontStyle: r.actualIn ? "italic" : "normal",
                      fontSize: 10,
                    }}
                  >
                    {r.actualIn ? "On shift" : "—"}
                  </span>
                )}
              </span>
              <span style={{ fontSize: 11, color: W.textSecondary }}>
                {r.breakMins > 0 ? `${r.breakMins}m` : "—"}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>
                {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(1)}h` : "—"}
                {r.otHours > 0 && (
                  <span style={{ color: W.caution, fontSize: 10 }}>
                    {" "}
                    +{r.otHours}h OT
                  </span>
                )}
              </span>
              <AttStatusBadge status={r.status} />
            </div>
          );
        })}
      </div>

      {/* Absence alerts */}
      {shown.some((r) => r.status !== "present" && r.status !== "absent") && (
        <div
          style={{
            marginTop: 12,
            background: W.warningBg,
            border: `1px solid ${W.warningBorder}`,
            borderRadius: W.r8,
            padding: "10px 14px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: W.warning,
              marginBottom: 6,
            }}
          >
            ⚠ Variance Flags
          </div>
          {shown
            .filter((r) => r.note)
            .map((r, i) => {
              const staff = allStaff.find((s) => s.id === r.staffId);
              return (
                <div
                  key={i}
                  style={{ fontSize: 11, color: W.warning, marginBottom: 2 }}
                >
                  <strong>{staff?.name}</strong> — {r.note}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function LeaveView({
  allStaff,
  selectedStaff,
  onSelectStaff,
  leaves,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
  leaves: LeaveReq[];
}) {
  const [filter, setFilter] = useState<LeaveStatus | "all">("all");
  const shown =
    filter === "all" ? leaves : leaves.filter((l) => l.status === filter);
  const pending = leaves.filter((l) => l.status === "pending");

  return (
    <div
      className="custom-scroll"
      style={{ flex: 1, overflow: "auto", padding: 16 }}
    >
      {/* Leave balance overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {allStaff.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectStaff(selectedStaff?.id === s.id ? null : s)}
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              padding: "10px 12px",
              cursor: "pointer",
              border: `1.5px solid ${selectedStaff?.id === s.id ? W.accent : "transparent"}`,
              textAlign: "center",
            }}
          >
            <Avatar staff={s} size={28} />
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: W.textPrimary,
                marginTop: 5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {s.name.split(" ")[0]}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: (s.leaveBalance || 0) < 5 ? W.danger : W.accent,
                marginTop: 2,
              }}
            >
              {s.leaveBalance}d
            </div>
            <div style={{ fontSize: 9, color: W.textCaption }}>leave left</div>
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div
          style={{
            background: W.warningBg,
            border: `1px solid ${W.warningBorder}`,
            borderRadius: W.r8,
            padding: "12px 14px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: W.warning,
              marginBottom: 8,
            }}
          >
            ⏳ {pending.length} Pending Approval{pending.length > 1 ? "s" : ""}
          </div>
          {pending.map((l) => {
            const staff = allStaff.find((s) => s.id === l.staffId);
            return (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 0",
                  borderBottom: `1px solid ${W.warningBorder}`,
                }}
              >
                {staff && <Avatar staff={staff} size={24} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>
                    {staff?.name} — {l.type}
                  </div>
                  <div style={{ fontSize: 10, color: W.textSecondary }}>
                    {l.startDate} – {l.endDate} · {l.days} day
                    {l.days > 1 ? "s" : ""}
                  </div>
                  <div style={{ fontSize: 10, color: W.textCaption }}>
                    {l.reason}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button
                    style={{
                      padding: "4px 10px",
                      background: W.successBg,
                      color: W.success,
                      border: `1px solid ${W.successBorder}`,
                      borderRadius: W.r6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      padding: "4px 10px",
                      background: W.dangerBg,
                      color: W.danger,
                      border: `1px solid ${W.dangerBorder}`,
                      borderRadius: W.r6,
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All requests */}
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            borderBottom: `1px solid ${W.borderSubtle}`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700 }}>
            All Leave Requests
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "2px 8px",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: filter === f ? 700 : 400,
                  color: filter === f ? W.accent : W.textSecondary,
                  background: filter === f ? W.accentLight : "transparent",
                  border: `1px solid ${filter === f ? W.accentLightBorder : W.borderDefault}`,
                  cursor: "pointer",
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr",
            padding: "6px 16px",
            background: W.subtleBg,
            borderBottom: `1px solid ${W.borderDefault}`,
            fontSize: 9,
            fontWeight: 700,
            color: W.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          <span>Staff</span>
          <span>Type</span>
          <span>Dates</span>
          <span>Days</span>
          <span>Reason</span>
          <span>Status</span>
        </div>
        {shown.map((l, i) => {
          const staff = allStaff.find((s) => s.id === l.staffId);
          if (!staff) return null;
          const isSelected = selectedStaff?.id === staff.id;
          return (
            <div
              key={l.id}
              onClick={() => onSelectStaff(isSelected ? null : staff)}
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr",
                padding: "9px 16px",
                borderBottom:
                  i < shown.length - 1 ? `1px solid ${W.borderSubtle}` : "none",
                cursor: "pointer",
                alignItems: "center",
                background: isSelected ? W.selectedFill : "transparent",
                borderLeft: `2.5px solid ${isSelected ? W.accent : "transparent"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Avatar staff={staff} size={24} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>
                  {staff.name}
                </span>
              </div>
              <span style={{ fontSize: 11, color: W.textSecondary }}>
                {l.type}
              </span>
              <span style={{ fontSize: 11 }}>
                {l.startDate} – {l.endDate}
              </span>
              <span
                style={{ fontSize: 12, fontWeight: 700, color: W.textPrimary }}
              >
                {l.days}d
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: W.textSecondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {l.reason}
              </span>
              <LeaveStatusBadge status={l.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsView({
  allStaff,
  records,
}: {
  allStaff: Staff[];
  records: AttRecord[];
}) {
  const weeklyTrend = [
    { day: "Mon", rate: 100, hours: 40 },
    { day: "Tue", rate: 80, hours: 35 },
    { day: "Wed", rate: 100, hours: 41 },
    { day: "Thu", rate: 80, hours: 34 },
    { day: "Fri", rate: 80, hours: 32 },
    { day: "Today", rate: 60, hours: 19 },
  ];
  const maxH = Math.max(...weeklyTrend.map((d) => d.hours));
  const totalOT = records.reduce((a, r) => a + r.otHours, 0);
  const lateCount = records.filter((r) => r.status === "late").length;
  const earlyCount = records.filter(
    (r) => r.status === "early_departure",
  ).length;

  return (
    <div
      className="custom-scroll"
      style={{ flex: 1, overflow: "auto", padding: 16 }}
    >
      {/* Summary KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Attendance Rate",
            val: "80%",
            sub: "This week avg",
            color: W.caution,
          },
          {
            label: "Total OT Hours",
            val: `${totalOT.toFixed(1)}h`,
            sub: "This week",
            color: W.accent,
          },
          {
            label: "Late Arrivals",
            val: lateCount,
            sub: "This week",
            color: W.warning,
          },
          {
            label: "Early Departures",
            val: earlyCount,
            sub: "This week",
            color: W.danger,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: W.textSecondary,
                marginBottom: 4,
              }}
            >
              {m.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>
              {m.val}
            </div>
            <div style={{ fontSize: 10, color: W.textCaption, marginTop: 2 }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Attendance rate trend */}
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
            Daily Attendance Rate — This Week
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 80,
            }}
          >
            {weeklyTrend.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: d.rate < 100 ? W.danger : W.success,
                    fontWeight: 700,
                  }}
                >
                  {d.rate}%
                </span>
                <div
                  style={{
                    width: "100%",
                    background:
                      d.rate === 100
                        ? W.success
                        : d.rate >= 80
                          ? W.caution
                          : W.danger,
                    borderRadius: "3px 3px 0 0",
                    height: `${(d.rate / 100) * 60}px`,
                    opacity: i === weeklyTrend.length - 1 ? 0.7 : 1,
                  }}
                />
                <span style={{ fontSize: 9, color: W.textSecondary }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hours worked chart */}
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
            Total Hours Per Day
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 80,
            }}
          >
            {weeklyTrend.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: W.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  {d.hours}h
                </span>
                <div
                  style={{
                    width: "100%",
                    background: W.accentLight,
                    border: `1px solid ${W.accentLightBorder}`,
                    borderRadius: "3px 3px 0 0",
                    height: `${(d.hours / maxH) * 60}px`,
                    opacity: i === weeklyTrend.length - 1 ? 0.7 : 1,
                  }}
                />
                <span style={{ fontSize: 9, color: W.textSecondary }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Punctuality leaderboard */}
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          padding: "14px 16px",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          Punctuality Scores — 30 Day
        </div>
        {[...allStaff]
          .sort((a, b) => (b.punctualityScore || 0) - (a.punctualityScore || 0))
          .map((s, i) => {
            const score = s.punctualityScore || 0;
            const color =
              score >= 95 ? W.success : score >= 80 ? W.caution : W.danger;
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: W.textDisabled,
                    width: 14,
                    textAlign: "right",
                  }}
                >
                  {i + 1}
                </span>
                <Avatar staff={s} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{s.name}</div>
                  <div
                    style={{
                      height: 4,
                      background: W.subtleBg,
                      borderRadius: 99,
                      marginTop: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${score}%`,
                        height: "100%",
                        background: color,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color,
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {score}%
                </span>
                {score === 100 && <span style={{ fontSize: 12 }}>🏆</span>}
              </div>
            );
          })}
      </div>

      {/* OT by staff */}
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            Overtime Hours — This Week
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              background: W.subtleBg,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r6,
              fontSize: 11,
              cursor: "pointer",
              color: W.textPrimary,
            }}
          >
            <Download size={11} />
            Export Payroll CSV
          </button>
        </div>
        {allStaff.map((s, i) => {
          const ot = s.otHours || 0;
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 7,
              }}
            >
              <Avatar staff={s} size={24} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{s.name}</div>
                <div
                  style={{
                    height: 4,
                    background: W.subtleBg,
                    borderRadius: 99,
                    marginTop: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: ot > 0 ? `${(ot / 5) * 100}%` : "0%",
                      height: "100%",
                      background: W.caution,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: ot > 0 ? W.caution : W.textDisabled,
                  minWidth: 36,
                  textAlign: "right",
                }}
              >
                {ot > 0 ? `+${ot}h` : "—"}
              </span>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 10,
            padding: "8px 10px",
            background: W.cautionBg,
            border: `1px solid ${W.cautionBorder}`,
            borderRadius: W.r6,
            fontSize: 11,
            color: W.caution,
          }}
        >
          ⚡ Total OT this week: <strong>{totalOT.toFixed(1)}h</strong> across{" "}
          {allStaff.filter((s) => (s.otHours || 0) > 0).length} staff members
        </div>
      </div>
    </div>
  );
}

// ── Metrics Tab ─────────────────────────────────────────────────────────────
function MetricsTab({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
}) {
  const maxHours = Math.max(...allStaff.map((s) => s.hoursThisWeek));
  const weeklyData = [
    { day: "Mon", h: 38 },
    { day: "Tue", h: 42 },
    { day: "Wed", h: 35 },
    { day: "Thu", h: 44 },
    { day: "Fri", h: 40 },
    { day: "Sat", h: 22 },
    { day: "Sun", h: 10 },
  ];
  const maxW = Math.max(...weeklyData.map((d) => d.h));
  return (
    <div
      className="custom-scroll"
      style={{ flex: 1, overflow: "auto", padding: 16 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Total Hrs This Week",
            val: allStaff.reduce((a, s) => a + s.hoursThisWeek, 0),
            unit: "h",
            icon: Clock,
            color: W.accent,
          },
          {
            label: "Avg Hrs Per Staff",
            val: Math.round(
              allStaff.reduce((a, s) => a + s.hoursThisWeek, 0) /
                allStaff.length,
            ),
            unit: "h",
            icon: TrendingUp,
            color: W.success,
          },
          {
            label: "Compliance Score",
            val: Math.round(
              allStaff.reduce((a, s) => a + s.complianceScore, 0) /
                allStaff.length,
            ),
            unit: "%",
            icon: Award,
            color: W.caution,
          },
          {
            label: "Active Today",
            val: allStaff.filter((s) => s.dutyStatus !== "Off Duty").length,
            unit: "",
            icon: Activity,
            color: W.success,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: W.surfaceBg,
              borderRadius: W.r8,
              boxShadow: W.shadowCard,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: W.textSecondary,
                marginBottom: 4,
              }}
            >
              {m.label}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: m.color }}>
                {m.val}
              </span>
              <span style={{ fontSize: 13, color: W.textSecondary }}>
                {m.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
            Pharmacy Hours — This Week
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 80,
            }}
          >
            {weeklyData.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    background: i === 3 ? W.accent : W.accentLight,
                    borderRadius: "3px 3px 0 0",
                    height: `${(d.h / maxW) * 70}px`,
                    border: `1px solid ${i === 3 ? W.accentHover : W.accentLightBorder}`,
                  }}
                />
                <span style={{ fontSize: 10, color: W.textSecondary }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            Hours This Week — By Staff
          </div>
          {[...allStaff]
            .sort((a, b) => b.hoursThisWeek - a.hoursThisWeek)
            .map((s, i) => {
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 7,
                    cursor: "pointer",
                    padding: "3px 5px",
                    borderRadius: W.r6,
                    background: isSelected ? W.selectedFill : "transparent",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: W.textDisabled,
                      width: 14,
                      textAlign: "right",
                    }}
                  >
                    {i + 1}
                  </span>
                  <Avatar staff={s} size={24} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>
                      {s.name}
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: W.subtleBg,
                        borderRadius: 99,
                        marginTop: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(s.hoursThisWeek / maxHours) * 100}%`,
                          height: "100%",
                          background: W.accent,
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: W.accent }}
                  >
                    {s.hoursThisWeek}h
                  </span>
                </div>
              );
            })}
        </div>
      </div>
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowCard,
          padding: "14px 16px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          Compliance Score Leaderboard
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
          }}
        >
          {[...allStaff]
            .sort((a, b) => b.complianceScore - a.complianceScore)
            .map((s, i) => {
              const color =
                s.complianceScore >= 90
                  ? W.success
                  : s.complianceScore >= 70
                    ? W.caution
                    : W.danger;
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  style={{
                    background: W.subtleBg,
                    borderRadius: W.r8,
                    padding: "10px 8px",
                    cursor: "pointer",
                    textAlign: "center",
                    border: `1.5px solid ${isSelected ? W.accent : "transparent"}`,
                  }}
                >
                  {i === 0 && (
                    <div style={{ fontSize: 14, marginBottom: 4 }}>🏆</div>
                  )}
                  <Avatar staff={s} size={30} />
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      marginTop: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name.split(" ")[0]}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color,
                      marginTop: 2,
                    }}
                  >
                    {s.complianceScore}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ── Audit Trail Tab ─────────────────────────────────────────────────────────
function AuditTrailTab({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (s: Staff | null) => void;
}) {
  const [filter, setFilter] = useState("All");
  const events = [
    {
      id: 1,
      user: "Priya Sharma",
      action: "Clocked In",
      type: "Clock",
      time: "Today 07:45 AM",
      detail: "Shift started",
      icon: CheckCircle,
      color: W.success,
    },
    {
      id: 2,
      user: "Dr. Sarah Chen",
      action: "Clocked In",
      type: "Clock",
      time: "Today 08:28 AM",
      detail: "Shift started — 28 min late",
      icon: CheckCircle,
      color: W.success,
    },
    {
      id: 3,
      user: "Marcus Williams",
      action: "Clocked In",
      type: "Clock",
      time: "Today 09:03 AM",
      detail: "Shift started",
      icon: CheckCircle,
      color: W.success,
    },
    {
      id: 4,
      user: "Priya Sharma",
      action: "Credential Viewed",
      type: "Security",
      time: "Today 09:14 AM",
      detail: "HIPAA Cert — HP-****-0012",
      icon: Eye,
      color: W.accent,
    },
    {
      id: 5,
      user: "Admin",
      action: "Role Updated",
      type: "Admin",
      time: "Today 09:30 AM",
      detail: "Marcus Williams → Technician",
      icon: Edit,
      color: W.caution,
    },
    {
      id: 6,
      user: "Marcus Williams",
      action: "Break Started",
      type: "Clock",
      time: "Today 12:15 PM",
      detail: "Break started",
      icon: Coffee,
      color: W.caution,
    },
    {
      id: 7,
      user: "Admin",
      action: "Leave Approved",
      type: "Compliance",
      time: "Yesterday 11:00 AM",
      detail: "Linda Park sick leave Mar 26–27",
      icon: CheckCircle,
      color: W.success,
    },
    {
      id: 8,
      user: "Linda Park",
      action: "Credential Expired",
      type: "Compliance",
      time: "Yesterday 11:59 PM",
      detail: "Pharmacist License PH-****-9021",
      icon: AlertTriangle,
      color: W.danger,
    },
    {
      id: 9,
      user: "Admin",
      action: "Attendance Adjusted",
      type: "Admin",
      time: "Yesterday 09:00 AM",
      detail: "Linda Park early departure flagged",
      icon: Edit,
      color: W.caution,
    },
    {
      id: 10,
      user: "James O'Brien",
      action: "Clocked Out",
      type: "Clock",
      time: "Mar 25, 5:00 PM",
      detail: "8h shift completed",
      icon: LogOut,
      color: W.textSecondary,
    },
    {
      id: 11,
      user: "Admin",
      action: "Staff Added",
      type: "Admin",
      time: "Mar 20, 10:00 AM",
      detail: "Linda Park added to Main Street",
      icon: UserPlus,
      color: W.success,
    },
    {
      id: 12,
      user: "Marcus Williams",
      action: "Leave Requested",
      type: "Compliance",
      time: "Mar 20, 3:00 PM",
      detail: "Vacation Apr 5–9 (5 days)",
      icon: Calendar,
      color: W.accent,
    },
  ];
  const filterTypes = ["All", "Clock", "Compliance", "Security", "Admin"];
  const shown =
    filter === "All" ? events : events.filter((e) => e.type === filter);
  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <FileText size={14} color={W.textSecondary} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: W.textPrimary,
            marginRight: 4,
          }}
        >
          Event Filter
        </span>
        {filterTypes.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "3px 10px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: filter === f ? 700 : 500,
              color: filter === f ? W.accent : W.textSecondary,
              background: filter === f ? W.accentLight : "transparent",
              border: `1px solid ${filter === f ? W.accentLightBorder : W.borderDefault}`,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
        <button
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            background: W.subtleBg,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
            color: W.textPrimary,
          }}
        >
          <Download size={12} />
          Export PDF
        </button>
      </div>
      <div
        className="custom-scroll"
        style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}
      >
        <div
          style={{
            background: W.surfaceBg,
            borderRadius: W.r8,
            boxShadow: W.shadowCard,
            overflow: "hidden",
          }}
        >
          {shown.map((e, i) => {
            const staffMember = allStaff.find((s) => s.name === e.user);
            const isSelected =
              staffMember && selectedStaff?.id === staffMember.id;
            return (
              <div
                key={e.id}
                onClick={() =>
                  staffMember && onSelectStaff(isSelected ? null : staffMember)
                }
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "11px 16px",
                  borderBottom:
                    i < shown.length - 1
                      ? `1px solid ${W.borderSubtle}`
                      : "none",
                  cursor: staffMember ? "pointer" : "default",
                  background: isSelected ? W.selectedFill : "transparent",
                  borderLeft: `2.5px solid ${isSelected ? W.accent : "transparent"}`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${e.color}18`,
                    border: `1px solid ${e.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <e.icon size={13} color={e.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600 }}>
                      {e.user}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: e.color,
                        background: `${e.color}12`,
                        border: `1px solid ${e.color}25`,
                        borderRadius: W.r4,
                        padding: "1px 6px",
                      }}
                    >
                      {e.action}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: W.textSecondary,
                      marginTop: 2,
                    }}
                  >
                    {e.detail}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: W.textCaption,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.time}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: W.textDisabled,
                      background: W.subtleBg,
                      borderRadius: W.r4,
                      padding: "1px 5px",
                    }}
                  >
                    {e.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Root Component ──────────────────────────────────────────────────────────
export function StaffManagementStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("attendance");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(
    staffData[0],
  );

  const allCreds = staffData.flatMap((s) => s.credentials);
  const alertCount = allCreds.filter((c) => c.status !== "valid").length;
  const pendingLeaves = leaveRequests.filter(
    (l) => l.status === "pending",
  ).length;

  const tabCommands: Record<TabId, React.ReactNode> = {
    overview: (
      <>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.accent,
            color: "white",
            border: "none",
            borderRadius: W.r6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <UserPlus size={12} />
          Add Staff
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </>
    ),
    staff: (
      <>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.accent,
            color: "white",
            border: "none",
            borderRadius: W.r6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <UserPlus size={12} />
          Add Staff
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Download size={12} />
          Export
        </button>
      </>
    ),
    credentials: (
      <>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.accent,
            color: "white",
            border: "none",
            borderRadius: W.r6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Upload size={12} />
          Upload
        </button>
        {alertCount > 0 && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "0 12px",
              height: 26,
              background: W.dangerBg,
              color: W.danger,
              border: `1px solid ${W.dangerBorder}`,
              borderRadius: W.r6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <AlertTriangle size={12} />
            {alertCount} Alerts
          </button>
        )}
      </>
    ),
    attendance: (
      <>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.accent,
            color: "white",
            border: "none",
            borderRadius: W.r6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <PlayCircle size={12} />
          Clock In
        </button>
        {pendingLeaves > 0 && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "0 12px",
              height: 26,
              background: W.warningBg,
              color: W.warning,
              border: `1px solid ${W.warningBorder}`,
              borderRadius: W.r6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <AlarmClock size={12} />
            {pendingLeaves} Pending
          </button>
        )}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Download size={12} />
          Payroll CSV
        </button>
      </>
    ),
    metrics: (
      <>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Calendar size={12} />
          This Week
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Download size={12} />
          Export
        </button>
      </>
    ),
    audit: (
      <>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Download size={12} />
          Export PDF
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 12px",
            height: 26,
            background: W.subtleBg,
            color: W.textPrimary,
            border: `1px solid ${W.borderDefault}`,
            borderRadius: W.r6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          <Filter size={12} />
          Date Range
        </button>
      </>
    ),
  };

  const isAttendance = activeTab === "attendance";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: W.appBg,
        fontFamily:
          "'Segoe UI Variable Display','Segoe UI Variable Text','Segoe UI',system-ui,-apple-system,sans-serif",
        color: W.textPrimary,
        fontSize: 13,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes ping { 0%{transform:scale(1);opacity:.8} 70%,100%{transform:scale(2.5);opacity:0} }
        .ping { animation: ping 2s cubic-bezier(0,0,.2,1) infinite; }
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.22); }
        input:focus,select:focus,button:focus-visible { outline: 2px solid #C7E2F5; outline-offset: 1px; }
      `}</style>

      {/* App Bar */}
      <div
        style={{
          height: 36,
          background: W.titleBarBg,
          backdropFilter: "blur(30px) saturate(150%)",
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          paddingRight: 12,
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: W.r4,
              background: W.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={11} color="white" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700 }}>RxPharmacy</span>
          <div style={{ height: 14, width: 1, background: W.borderDefault }} />
          <span style={{ fontSize: 12, color: W.textSecondary }}>
            Staff Management Studio
          </span>
          <div style={{ height: 14, width: 1, background: W.borderDefault }} />
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              background: W.subtleBg,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: 100,
              fontSize: 11,
              color: W.textSecondary,
              cursor: "pointer",
            }}
          >
            Main Street <ChevronDown size={10} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <button
            style={{
              width: 28,
              height: 28,
              borderRadius: W.r4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: W.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Bell size={14} />
            {alertCount + pendingLeaves > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: W.danger,
                }}
              />
            )}
          </button>
          <button
            style={{
              width: 28,
              height: 28,
              borderRadius: W.r4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: W.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings size={14} />
          </button>
          <div
            style={{
              height: 16,
              width: 1,
              background: W.borderDefault,
              margin: "0 4px",
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            {["#ED6A5E", "#F4BF4F", "#62C554"].map((c) => (
              <div
                key={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nav + Command Strip */}
      <div
        style={{
          height: 40,
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "stretch",
          paddingLeft: 20,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 14px",
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? `2px solid ${W.accent}`
                    : "2px solid transparent",
                  color: isActive ? W.textPrimary : W.textSecondary,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  fontSize: 12,
                  position: "relative",
                  transition: "color 0.1s",
                }}
              >
                <item.icon
                  size={13}
                  color={isActive ? W.accent : W.textSecondary}
                />
                {item.label}
                {item.id === "credentials" && alertCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 7,
                      right: 7,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: W.danger,
                    }}
                  />
                )}
                {item.id === "attendance" && pendingLeaves > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 7,
                      right: 7,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: W.warning,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            paddingLeft: 12,
            borderLeft: `1px solid ${W.borderSubtle}`,
          }}
        >
          {tabCommands[activeTab]}
        </div>
      </div>

      {/* Body: 2/3 content + 1/3 detail panel */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        <div
          style={{
            flex: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${W.borderDefault}`,
          }}
        >
          {activeTab === "overview" && (
            <OverviewTab
              allStaff={staffData}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          )}
          {activeTab === "staff" && (
            <StaffDirectoryTab
              allStaff={staffData}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          )}
          {activeTab === "credentials" && (
            <CredentialsTab
              allStaff={staffData}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          )}
          {activeTab === "attendance" && (
            <AttendanceTab
              allStaff={staffData}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
              records={attendanceRecords}
              leaves={leaveRequests}
            />
          )}
          {activeTab === "metrics" && (
            <MetricsTab
              allStaff={staffData}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          )}
          {activeTab === "audit" && (
            <AuditTrailTab
              allStaff={staffData}
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
          )}
        </div>

        {/* Right 1/3 — context-aware detail panel */}
        <div
          style={{
            flex: 1,
            background: W.surfaceBg,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 280,
            maxWidth: 360,
          }}
        >
          {isAttendance ? (
            <AttendanceDetailPanel
              staff={selectedStaff}
              records={attendanceRecords}
              leaves={leaveRequests}
              onClose={() => setSelectedStaff(null)}
            />
          ) : (
            <StaffDetailPanel
              staff={selectedStaff}
              onClose={() => setSelectedStaff(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
