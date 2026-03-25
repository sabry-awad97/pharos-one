import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BadgeCheck,
  BarChart2,
  Bell,
  BellRing,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Droplets,
  Edit,
  ExternalLink,
  FileText,
  Filter,
  FlaskConical,
  Grid3x3,
  Heart,
  History,
  Info,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Minus,
  MoreHorizontal,
  Package,
  Paperclip,
  Phone,
  PhoneCall,
  PhoneOff,
  Pill,
  Plus,
  RefreshCw,
  Repeat2,
  Search,
  Send,
  Settings,
  Shield,
  ShoppingCart,
  Siren,
  Square,
  Star,
  Target,
  TrendingUp,
  User,
  UserPlus,
  Users,
  Wifi,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

/* ─────────────────────────────────────────────
   Windows 11 Fluent Design Tokens
──────────────────────────────────────────────*/
const W = {
  appBg: "#F3F3F3",
  navBg: "rgba(238,238,238,0.85)",
  surfaceBg: "#FFFFFF",
  titleBarBg: "#F9F9F9",
  cardBg: "#FFFFFF",
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
  r4: "4px",
  r6: "6px",
  r8: "8px",
  shadowCard: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07)",
};

/* ─────────────────────────────────────────────
   Mock Data ── Customers (with tier + risk)
──────────────────────────────────────────────*/
const customers = [
  {
    id: 1,
    name: "Ahmed Hassan",
    phone: "010 1234 5678",
    tags: ["Chronic", "VIP"],
    insurance: "Misr Insurance",
    lastVisit: "2 hrs ago",
    balance: -120,
    status: "active",
    age: 54,
    gender: "Male",
    initials: "AH",
    color: "#0078D4",
    hasAlert: true,
    allergies: ["Penicillin", "Aspirin"],
    conditions: ["Diabetes Type 2", "Hypertension"],
    totalSpent: 12400,
    activeRx: 3,
    tier: "Platinum",
    riskLevel: "Medium",
    riskScore: 58,
  },
  {
    id: 2,
    name: "Sara Mohamed",
    phone: "011 9876 5432",
    tags: ["VIP"],
    insurance: "AXA Medical",
    lastVisit: "1 day ago",
    balance: 0,
    status: "active",
    age: 32,
    gender: "Female",
    initials: "SM",
    color: "#C42B6E",
    hasAlert: false,
    allergies: [],
    conditions: ["Hypothyroidism"],
    totalSpent: 5820,
    activeRx: 1,
    tier: "Gold",
    riskLevel: "Low",
    riskScore: 22,
  },
  {
    id: 3,
    name: "Khaled Ibrahim",
    phone: "012 3456 7890",
    tags: ["Chronic"],
    insurance: "None",
    lastVisit: "3 days ago",
    balance: -450,
    status: "active",
    age: 67,
    gender: "Male",
    initials: "KI",
    color: "#107C10",
    hasAlert: true,
    allergies: ["Sulfa"],
    conditions: ["COPD", "Heart Failure"],
    totalSpent: 28900,
    activeRx: 5,
    tier: "Platinum",
    riskLevel: "High",
    riskScore: 84,
  },
  {
    id: 4,
    name: "Nadia Farouk",
    phone: "015 5678 1234",
    tags: [],
    insurance: "MetLife",
    lastVisit: "1 week ago",
    balance: 200,
    status: "inactive",
    age: 28,
    gender: "Female",
    initials: "NF",
    color: "#7719AA",
    hasAlert: false,
    allergies: [],
    conditions: [],
    totalSpent: 1240,
    activeRx: 0,
    tier: "Bronze",
    riskLevel: "Low",
    riskScore: 10,
  },
  {
    id: 5,
    name: "Omar Sayed",
    phone: "010 1122 3344",
    tags: ["Chronic", "VIP"],
    insurance: "BUPA",
    lastVisit: "Today",
    balance: 0,
    status: "active",
    age: 45,
    gender: "Male",
    initials: "OS",
    color: "#835400",
    hasAlert: true,
    allergies: ["Codeine"],
    conditions: ["Epilepsy", "Asthma"],
    totalSpent: 19500,
    activeRx: 4,
    tier: "Gold",
    riskLevel: "High",
    riskScore: 76,
  },
  {
    id: 6,
    name: "Mona Wahba",
    phone: "012 8765 4321",
    tags: [],
    insurance: "Allianz",
    lastVisit: "2 weeks ago",
    balance: 50,
    status: "active",
    age: 41,
    gender: "Female",
    initials: "MW",
    color: "#E3008C",
    hasAlert: false,
    allergies: [],
    conditions: ["Rheumatoid Arthritis"],
    totalSpent: 7640,
    activeRx: 2,
    tier: "Gold",
    riskLevel: "Low",
    riskScore: 31,
  },
];

/* ─────────────────────────────────────────────
   Mock Data ── Medication Intelligence
──────────────────────────────────────────────*/
const drugInteractions = [
  {
    id: 1,
    drug1: "Aspirin 81mg",
    drug2: "Metformin 1000mg",
    severity: "moderate",
    description: "Aspirin may potentiate the hypoglycemic effect of Metformin.",
    guidance:
      "Monitor blood glucose levels closely. Counsel patient on hypoglycemia symptoms (sweating, tremor, confusion). May require Metformin dose reduction.",
    source: "Lexicomp 2026",
    dismissed: false,
  },
  {
    id: 2,
    drug1: "Amlodipine 5mg",
    drug2: "Atorvastatin 40mg",
    severity: "minor",
    description:
      "Amlodipine may moderately increase atorvastatin plasma AUC by ~15%.",
    guidance:
      "Current Atorvastatin dose (40mg) remains within safe range. No dose adjustment required. Routine monitoring.",
    source: "Lexicomp 2026",
    dismissed: false,
  },
];

const allergyContraindications = [
  {
    drug: "Aspirin 81mg",
    allergen: "Aspirin",
    severity: "critical",
    description:
      "Patient has documented Aspirin allergy. Current prescription contains Aspirin.",
    guidance:
      "STOP — This medication is contraindicated. Contact prescribing physician Dr. Khaled Nasser immediately before dispensing.",
    dismissed: false,
    dismissedBy: null as string | null,
    dismissReason: null as string | null,
  },
];

const adherenceData = [
  {
    drug: "Metformin 1000mg",
    pdc: 0.87,
    mpr: 0.91,
    lastFill: "Mar 10, 2026",
    daysSupply: 30,
    daysUntilDue: 15,
    status: "adherent",
    fillCount: 14,
    condition: "Diabetes",
  },
  {
    drug: "Amlodipine 5mg",
    pdc: 0.72,
    mpr: 0.74,
    lastFill: "Feb 15, 2026",
    daysSupply: 30,
    daysUntilDue: -8,
    status: "overdue",
    fillCount: 12,
    condition: "Hypertension",
  },
  {
    drug: "Atorvastatin 40mg",
    pdc: 0.93,
    mpr: 0.95,
    lastFill: "Mar 5, 2026",
    daysSupply: 30,
    daysUntilDue: 10,
    status: "adherent",
    fillCount: 15,
    condition: "Cardiovascular",
  },
  {
    drug: "Aspirin 81mg",
    pdc: 0.55,
    mpr: 0.58,
    lastFill: "Jan 20, 2026",
    daysSupply: 30,
    daysUntilDue: -34,
    status: "non-adherent",
    fillCount: 8,
    condition: "Cardiovascular",
  },
  {
    drug: "Januvia 50mg",
    pdc: 0.81,
    mpr: 0.84,
    lastFill: "Mar 1, 2026",
    daysSupply: 30,
    daysUntilDue: 6,
    status: "adherent",
    fillCount: 10,
    condition: "Diabetes",
  },
];

const rxTimeline = [
  {
    date: "Mar 20, 2026",
    drug: "Amlodipine 5mg",
    dose: "5mg once daily",
    doctor: "Dr. Khaled Nasser",
    specialty: "Cardiology",
    fills: 1,
    authorized: 6,
    status: "active",
    color: "#0078D4",
  },
  {
    date: "Mar 10, 2026",
    drug: "Metformin 1000mg",
    dose: "1000mg twice daily",
    doctor: "Dr. Heba Mostafa",
    specialty: "Endocrinology",
    fills: 3,
    authorized: 6,
    status: "active",
    color: "#107C10",
  },
  {
    date: "Mar 5, 2026",
    drug: "Atorvastatin 40mg",
    dose: "40mg at bedtime",
    doctor: "Dr. Khaled Nasser",
    specialty: "Cardiology",
    fills: 2,
    authorized: 6,
    status: "active",
    color: "#0078D4",
  },
  {
    date: "Jan 10, 2026",
    drug: "Januvia 50mg",
    dose: "50mg once daily",
    doctor: "Dr. Heba Mostafa",
    specialty: "Endocrinology",
    fills: 1,
    authorized: 6,
    status: "active",
    color: "#107C10",
  },
  {
    date: "Oct 5, 2025",
    drug: "Amoxicillin 500mg",
    dose: "500mg 3× daily (10 days)",
    doctor: "Dr. Samir Halim",
    specialty: "General Practice",
    fills: 1,
    authorized: 1,
    status: "completed",
    color: "#767676",
  },
  {
    date: "Jul 2, 2025",
    drug: "Cozaar 50mg",
    dose: "50mg once daily",
    doctor: "Dr. Khaled Nasser",
    specialty: "Cardiology",
    fills: 3,
    authorized: 6,
    status: "discontinued",
    color: "#C42B1C",
  },
];

/* ─────────────────────────────────────────────
   Mock Data ── Analytics
──────────────────────────────────────────────*/
const analyticsData = {
  engagementScore: 76,
  visitFrequency: 12,
  visitUnit: "visits/yr",
  avgDaysBetween: 21,
  abandonmentRate: 8,
  ltv: 12400,
  avgTransaction: 245,
  yearlyGrowth: 14,
  overallPDC: 78,
  topCategories: [
    { name: "Diabetes Mgmt", pct: 42, amt: 5210 },
    { name: "Cardiovascular", pct: 35, amt: 4340 },
    { name: "General Health", pct: 23, amt: 2850 },
  ],
  careGaps: [
    {
      gap: "Annual diabetic eye exam overdue",
      priority: "high",
      dueDate: "Jan 2026",
    },
    {
      gap: "Flu vaccination not on file",
      priority: "medium",
      dueDate: "Oct 2025",
    },
    {
      gap: "HbA1c test overdue by 45 days",
      priority: "high",
      dueDate: "Feb 2026",
    },
    {
      gap: "Blood pressure home monitoring log",
      priority: "low",
      dueDate: "Ongoing",
    },
  ],
  popAdherence: [
    { class: "Diabetes (Metformin)", rate: 87, benchmark: 80 },
    { class: "Statins (Atorvastatin)", rate: 93, benchmark: 80 },
    { class: "Antihypertensives", rate: 72, benchmark: 80 },
    { class: "Antiplatelets (Aspirin)", rate: 55, benchmark: 80 },
  ],
};

/* ─────────────────────────────────────────────
   Mock Data ── Outreach
──────────────────────────────────────────────*/
const outreachData = {
  upcoming: [
    {
      type: "refill",
      channel: "SMS",
      content: "Amlodipine refill due",
      scheduledFor: "Mar 27, 2026",
      daysAway: 2,
      status: "scheduled",
    },
    {
      type: "refill",
      channel: "SMS",
      content: "Januvia refill due",
      scheduledFor: "Mar 31, 2026",
      daysAway: 6,
      status: "scheduled",
    },
    {
      type: "followup",
      channel: "Email",
      content: "HbA1c lab test reminder",
      scheduledFor: "Apr 1, 2026",
      daysAway: 7,
      status: "pending_consent",
    },
    {
      type: "appointment",
      channel: "Phone",
      content: "MTM consultation booking",
      scheduledFor: "Apr 8, 2026",
      daysAway: 14,
      status: "scheduled",
    },
    {
      type: "care_gap",
      channel: "SMS",
      content: "Flu vaccination reminder",
      scheduledFor: "Apr 15, 2026",
      daysAway: 21,
      status: "draft",
    },
  ],
  history: [
    {
      type: "refill",
      channel: "SMS",
      content: "Metformin refill reminder",
      sentAt: "Mar 8, 2026",
      outcome: "Filled Mar 10 — converted ✓",
      status: "converted",
    },
    {
      type: "refill",
      channel: "SMS",
      content: "Aspirin overdue refill alert",
      sentAt: "Feb 20, 2026",
      outcome: "No response after 7 days",
      status: "no_response",
    },
    {
      type: "campaign",
      channel: "Email",
      content: "Flu shot season invitation",
      sentAt: "Feb 1, 2026",
      outcome: "Opened — link not clicked",
      status: "opened",
    },
    {
      type: "followup",
      channel: "Phone",
      content: "Blood pressure check reminder",
      sentAt: "Jan 15, 2026",
      outcome: "Rescheduled for Feb 8",
      status: "rescheduled",
    },
  ],
  messages: [
    {
      from: "patient",
      text: "Hi, when will my Metformin be ready for pickup?",
      time: "10:30 AM",
      date: "Mar 25",
    },
    {
      from: "pharmacy",
      text: "Your Metformin 1000mg (60 tablets) is ready. We're open until 9 PM today.",
      time: "10:45 AM",
      date: "Mar 25",
    },
    {
      from: "patient",
      text: "Perfect, thank you! I'll be there by 6.",
      time: "10:47 AM",
      date: "Mar 25",
    },
    {
      from: "pharmacy",
      text: "⚠️ Reminder: Your Amlodipine refill is overdue by 8 days. Reply REFILL to request, or call us.",
      time: "9:00 AM",
      date: "Mar 17",
    },
  ],
};

/* ─────────────────────────────────────────────
   Mock Data ── Profile / Family / History
──────────────────────────────────────────────*/
const patientProfile = {
  dob: "Mar 12, 1972",
  nationalId: "27203120112345",
  bloodType: "A+",
  maritalStatus: "Married",
  occupation: "Civil Engineer",
  address: "14 El-Tahrir St., Apt 3B, Dokki, Giza 12311",
  primaryPhysician: "Dr. Khaled Nasser (Cardiology)",
  registeredSince: "Jan 15, 2022",
  preferredLanguage: "Arabic",
  preferredBranch: "Cairo Downtown",
  notes: "Patient prefers morning appointments. Always picks up for himself.",
};
const phoneNumbers = [
  {
    id: 1,
    type: "Mobile",
    number: "010 1234 5678",
    isPrimary: true,
    smsConsent: true,
    consentDate: "Jan 15, 2024",
    consentBy: "Dr. Rania",
    active: true,
  },
  {
    id: 2,
    type: "Home",
    number: "02 2345 6789",
    isPrimary: false,
    smsConsent: false,
    active: true,
  },
  {
    id: 3,
    type: "Work",
    number: "02 9876 5432",
    isPrimary: false,
    smsConsent: false,
    active: false,
  },
];
const emailContacts = [
  {
    id: 1,
    email: "ahmed.hassan@gmail.com",
    type: "Personal",
    isPrimary: true,
    marketingConsent: true,
    consentDate: "Jan 15, 2024",
  },
  {
    id: 2,
    email: "a.hassan@engineering.com",
    type: "Work",
    isPrimary: false,
    marketingConsent: false,
  },
];
const insuranceData = {
  primary: {
    provider: "Misr Insurance Co.",
    policyNo: "MI-2024-00123",
    groupNo: "GRP-ENG-445",
    copay: "20%",
    coverageType: "Family Plan — Comprehensive",
    expiryDate: "Dec 31, 2026",
    coversDrugs: true,
    coversLabWork: true,
    coversConsultation: true,
  },
  secondary: {
    provider: "Engineers Syndicate",
    policyNo: "SYN-2024-445",
    groupNo: "SYN-ENG",
    copay: "15%",
    coverageType: "Supplemental",
    expiryDate: "Dec 31, 2026",
    coversDrugs: true,
    coversLabWork: false,
    coversConsultation: false,
  },
};
const emergencyContacts = [
  {
    name: "Fatma Hassan",
    relation: "Spouse",
    phone: "010 9876 1234",
    altPhone: "",
    isPrimary: true,
    initials: "FH",
    color: "#E3008C",
  },
  {
    name: "Mahmoud Hassan",
    relation: "Son",
    phone: "012 5544 3321",
    altPhone: "010 7788 4455",
    isPrimary: false,
    initials: "MH",
    color: "#107C10",
  },
];
const familyGroup = {
  groupName: "Hassan Household",
  groupId: "HH-2022-0041",
  address: "14 El-Tahrir St., Apt 3B, Dokki, Giza 12311",
  primaryContact: "Ahmed Hassan",
  sharedInsurance: "Misr Insurance — Family Plan",
  paymentMethod: "Visa ····9981 (Ahmed Hassan)",
  members: [
    {
      name: "Ahmed Hassan",
      relation: "Head",
      age: 54,
      initials: "AH",
      color: "#0078D4",
      status: "active",
      activeRx: 3,
      allergies: ["Penicillin", "Aspirin"],
      lastVisit: "2 hrs ago",
      isCurrentPatient: true,
    },
    {
      name: "Fatma Hassan",
      relation: "Spouse",
      age: 49,
      initials: "FH",
      color: "#E3008C",
      status: "active",
      activeRx: 2,
      allergies: [],
      lastVisit: "1 week ago",
      isCurrentPatient: false,
    },
    {
      name: "Mahmoud Hassan",
      relation: "Son",
      age: 26,
      initials: "MH",
      color: "#107C10",
      status: "active",
      activeRx: 0,
      allergies: ["Latex"],
      lastVisit: "2 months ago",
      isCurrentPatient: false,
    },
    {
      name: "Nour Hassan",
      relation: "Daughter",
      age: 19,
      initials: "NH",
      color: "#7719AA",
      status: "active",
      activeRx: 1,
      allergies: [],
      lastVisit: "3 weeks ago",
      isCurrentPatient: false,
    },
  ],
  sharedPrescriptions: [
    {
      drug: "Vitamin D3 2000 IU",
      forMembers: ["Ahmed", "Fatma", "Nour"],
      prescribedBy: "Dr. Heba",
      date: "Feb 2026",
    },
    {
      drug: "Omega-3 1000mg",
      forMembers: ["Ahmed", "Fatma"],
      prescribedBy: "Dr. Khaled",
      date: "Jan 2026",
    },
  ],
};
const historyData = [
  {
    date: "Mar 25, 2026",
    type: "Sale",
    items: "Metformin 500mg ×2, Amlodipine 5mg ×1",
    amount: 145,
    pharmacist: "Dr. Rania",
  },
  {
    date: "Mar 10, 2026",
    type: "Sale",
    items: "Glucophage 1000mg ×3, Atorvastatin 20mg ×1",
    amount: 289,
    pharmacist: "Dr. Ahmed",
  },
  {
    date: "Feb 28, 2026",
    type: "Return",
    items: "Cozaar 50mg ×1",
    amount: -85,
    pharmacist: "Dr. Rania",
  },
  {
    date: "Feb 15, 2026",
    type: "Consultation",
    items: "Blood pressure check + advice",
    amount: 0,
    pharmacist: "Dr. Ahmed",
  },
  {
    date: "Jan 30, 2026",
    type: "Sale",
    items: "Lipitor 40mg ×2, Concor 5mg ×2, Aspirin",
    amount: 412,
    pharmacist: "Dr. Sara",
  },
];
const notes = [
  {
    date: "Mar 25, 2026",
    time: "10:42 AM",
    author: "Dr. Rania",
    type: "note",
    text: "Patient reported dizziness when standing. Advised to take Amlodipine with food. Scheduled follow-up in 2 weeks.",
  },
  {
    date: "Mar 10, 2026",
    time: "3:15 PM",
    author: "Dr. Ahmed",
    type: "followup",
    text: "Follow-up reminder: Check HbA1c results. Patient will bring lab results next visit.",
  },
  {
    date: "Feb 28, 2026",
    time: "11:00 AM",
    author: "Dr. Rania",
    type: "alert",
    text: "Patient returned Cozaar — ineffective. Switching to Losartan per cardiologist. Monitor BP weekly.",
  },
];

/* ─────────────────────────────────────────────
   Tier + Risk config
──────────────────────────────────────────────*/
const tierCfg: Record<
  string,
  { color: string; bg: string; border: string; points: number; nextAt: number }
> = {
  Platinum: {
    color: "#7719AA",
    bg: "#F3E8FF",
    border: "#DDD0EF",
    points: 2840,
    nextAt: 5000,
  },
  Gold: {
    color: "#835400",
    bg: "#FFF4CE",
    border: "#F8E0A0",
    points: 1200,
    nextAt: 2000,
  },
  Silver: {
    color: "#616161",
    bg: "#F5F5F5",
    border: "#D0D0D0",
    points: 480,
    nextAt: 500,
  },
  Bronze: {
    color: "#8B4513",
    bg: "#FDF0E8",
    border: "#E8C9A0",
    points: 180,
    nextAt: 500,
  },
};
const riskCfg: Record<string, { color: string; bg: string; border: string }> = {
  High: { color: W.danger, bg: W.dangerBg, border: W.dangerBorder },
  Medium: { color: W.caution, bg: W.warningBg, border: W.warningBorder },
  Low: { color: W.success, bg: W.successBg, border: W.successBorder },
};

/* ─────────────────────────────────────────────
   UI Atoms
──────────────────────────────────────────────*/
function WinButton({
  children,
  variant = "default",
  size = "md",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "ghost" | "subtle" | "danger";
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const v: Record<string, React.CSSProperties> = {
    accent: { background: W.accent, color: W.textOnAccent },
    default: {
      background: W.cardBg,
      color: W.textPrimary,
      borderColor: W.borderDefault,
      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
    },
    ghost: { background: "transparent", color: W.textPrimary },
    subtle: {
      background: W.subtleBg,
      color: W.textPrimary,
      borderColor: W.borderSubtle,
    },
    danger: {
      background: W.dangerBg,
      color: W.danger,
      borderColor: W.dangerBorder,
    },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        cursor: disabled ? "default" : "pointer",
        border: "1px solid transparent",
        borderRadius: W.r4,
        fontFamily: "'Segoe UI Variable','Segoe UI',sans-serif",
        fontWeight: 400,
        lineHeight: 1,
        transition: "background 0.1s",
        userSelect: "none",
        padding: size === "sm" ? "4px 10px" : "6px 14px",
        fontSize: size === "sm" ? "12px" : "14px",
        opacity: disabled ? 0.4 : 1,
        ...v[variant],
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLElement).style.background =
            variant === "accent" ? W.accentHover : W.hoverFill;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          (v[variant].background as string) || "";
      }}
    >
      {children}
    </button>
  );
}

function InfoBar({
  type,
  title,
  message,
}: {
  type: "error" | "warning" | "info" | "success";
  title: string;
  message?: string;
}) {
  const c = {
    error: {
      bg: W.dangerBg,
      border: W.dangerBorder,
      icon: <XCircle size={13} style={{ color: W.danger }} />,
      tc: W.danger,
    },
    warning: {
      bg: W.warningBg,
      border: W.warningBorder,
      icon: <AlertTriangle size={13} style={{ color: W.caution }} />,
      tc: W.caution,
    },
    info: {
      bg: W.accentLight,
      border: W.accentLightBorder,
      icon: <Info size={13} style={{ color: W.accent }} />,
      tc: W.accent,
    },
    success: {
      bg: W.successBg,
      border: W.successBorder,
      icon: <CheckCircle size={13} style={{ color: W.success }} />,
      tc: W.success,
    },
  }[type];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "7px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: W.r4,
        padding: "7px 10px",
      }}
    >
      <span style={{ marginTop: "1px", flexShrink: 0 }}>{c.icon}</span>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 600, color: c.tc }}>
          {title}
        </span>
        {message && (
          <span
            style={{
              fontSize: "12px",
              color: W.textSecondary,
              marginLeft: "5px",
            }}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

function WinTag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "11px",
        fontWeight: 600,
        padding: "1px 8px",
        borderRadius: "999px",
        background: color + "18",
        color,
        border: `1px solid ${color}28`,
        lineHeight: "18px",
      }}
    >
      {children}
    </span>
  );
}

function CAvatar({
  initials,
  color,
  size = 32,
  status,
}: {
  initials: string;
  color: string;
  size?: number;
  status?: string;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFF",
          fontSize: size * 0.35,
          fontWeight: 600,
          fontFamily: "'Segoe UI Variable',sans-serif",
        }}
      >
        {initials}
      </div>
      {status && (
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: status === "active" ? "#107C10" : "#767676",
            border: "2px solid #F3F3F3",
          }}
        />
      )}
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
  icon,
  noPad,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  noPad?: boolean;
}) {
  return (
    <div
      style={{
        background: W.cardBg,
        border: `1px solid ${W.borderSubtle}`,
        borderRadius: W.r8,
        overflow: "hidden",
        boxShadow: W.shadowCard,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 14px",
          borderBottom: `1px solid ${W.borderSubtle}`,
          background: W.layerBg,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {icon && <span style={{ color: W.accent }}>{icon}</span>}
          <span
            style={{ fontSize: "13px", fontWeight: 600, color: W.textPrimary }}
          >
            {title}
          </span>
        </div>
        {action}
      </div>
      <div style={noPad ? {} : { padding: "12px 14px" }}>{children}</div>
    </div>
  );
}

function KVRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: `1px solid ${W.borderSubtle}`,
        gap: "12px",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: W.textSecondary,
          flexShrink: 0,
          width: "140px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          color: W.textPrimary,
          fontWeight: 500,
          textAlign: "right",
          fontFamily: mono ? "'Courier New',monospace" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const t = tierCfg[tier] || tierCfg.Bronze;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "10px",
        fontWeight: 700,
        padding: "1px 7px",
        borderRadius: "999px",
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
      }}
    >
      <Award size={9} />
      {tier}
    </span>
  );
}

function RiskBadge({ level, score }: { level: string; score: number }) {
  const r = riskCfg[level] || riskCfg.Low;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "10px",
        fontWeight: 700,
        padding: "1px 7px",
        borderRadius: "999px",
        background: r.bg,
        color: r.color,
        border: `1px solid ${r.border}`,
      }}
    >
      <Target size={9} />
      {level} Risk {score}
    </span>
  );
}

function AdherenceBar({
  drug,
  pdc,
  mpr,
  daysUntilDue,
  status,
}: {
  drug: string;
  pdc: number;
  mpr: number;
  daysUntilDue: number;
  status: string;
}) {
  const pct = Math.round(pdc * 100);
  const color = pdc >= 0.8 ? W.success : pdc >= 0.65 ? W.caution : W.danger;
  const statusCfg = {
    adherent: { bg: W.successBg, c: W.success, label: "Adherent" },
    overdue: { bg: W.warningBg, c: W.caution, label: "Overdue" },
    "non-adherent": { bg: W.dangerBg, c: W.danger, label: "Non-Adherent" },
  }[status] || { bg: W.subtleBg, c: W.textCaption, label: status };
  return (
    <div
      style={{ padding: "10px 0", borderBottom: `1px solid ${W.borderSubtle}` }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <span
          style={{ fontSize: "13px", fontWeight: 500, color: W.textPrimary }}
        >
          {drug}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color }}>
            {pct}% PDC
          </span>
          <span style={{ fontSize: "11px", color: W.textCaption }}>
            MPR {Math.round(mpr * 100)}%
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "1px 7px",
              borderRadius: W.r4,
              background: statusCfg.bg,
              color: statusCfg.c,
              border: `1px solid ${statusCfg.c}28`,
            }}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>
      {/* Progress bar with 80% threshold marker */}
      <div
        style={{
          position: "relative",
          height: "6px",
          background: W.subtleBg,
          borderRadius: "3px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "3px",
            transition: "width 0.4s",
          }}
        />
        {/* 80% threshold line */}
        <div
          style={{
            position: "absolute",
            left: "80%",
            top: "-2px",
            bottom: "-2px",
            width: "1px",
            background: W.borderStrong || "rgba(0,0,0,0.3)",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "80%",
            top: "-14px",
            transform: "translateX(-50%)",
            fontSize: "9px",
            color: W.textCaption,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          80%
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <span style={{ fontSize: "11px", color: W.textCaption }}>
          Star Rating threshold: 80% PDC
        </span>
        <span
          style={{
            fontSize: "11px",
            color:
              daysUntilDue < 0
                ? W.danger
                : daysUntilDue < 7
                  ? W.caution
                  : W.textCaption,
            fontWeight: daysUntilDue < 0 ? 700 : 400,
          }}
        >
          {daysUntilDue < 0
            ? `Overdue ${Math.abs(daysUntilDue)} days`
            : daysUntilDue === 0
              ? "Due today"
              : `Due in ${daysUntilDue} days`}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
──────────────────────────────────────────────*/
export function CustomerManagementStudio() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const [filterPreset, setFilterPreset] = useState<string | null>(null);
  const [dismissedInteractions, setDismissedInteractions] = useState<number[]>(
    [],
  );
  const [overrideTarget, setOverrideTarget] = useState<number | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [allergyDismissed, setAllergyDismissed] = useState(false);
  const ff = "'Segoe UI Variable','Segoe UI',system-ui,sans-serif";

  const FILTER_PRESETS = [
    { key: "chronic", label: "Chronic", color: W.caution },
    { key: "high-risk", label: "High Risk", color: W.danger },
    { key: "non-adherent", label: "Non-Adherent", color: "#7719AA" },
    { key: "inactive-90", label: "Inactive 90d", color: W.textCaption },
  ];

  let filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );
  if (filterPreset === "chronic")
    filtered = filtered.filter((c) => c.tags.includes("Chronic"));
  if (filterPreset === "high-risk")
    filtered = filtered.filter((c) => c.riskLevel === "High");
  if (filterPreset === "non-adherent")
    filtered = filtered.filter((c) => c.riskScore > 60);
  if (filterPreset === "inactive-90")
    filtered = filtered.filter((c) => c.status === "inactive");

  const visibleInteractions = drugInteractions.filter(
    (i) => !dismissedInteractions.includes(i.id),
  );

  const TABS = [
    { key: "overview", label: "Overview", icon: <Activity size={12} /> },
    { key: "profile", label: "360° Profile", icon: <User size={12} /> },
    {
      key: "medications",
      label: "Medications",
      icon: <Pill size={12} />,
      badge:
        visibleInteractions.length +
          (!allergyDismissed && allergyContraindications.length ? 1 : 0) ||
        null,
    },
    { key: "analytics", label: "Analytics", icon: <BarChart2 size={12} /> },
    { key: "family", label: "Family", icon: <Users size={12} /> },
    { key: "outreach", label: "Outreach", icon: <Megaphone size={12} /> },
    { key: "history", label: "History", icon: <History size={12} /> },
    { key: "notes", label: "Notes", icon: <MessageSquare size={12} /> },
    { key: "financials", label: "Financials", icon: <CreditCard size={12} /> },
  ];

  const tier = selectedCustomer.tier;
  const tierC = tierCfg[tier] || tierCfg.Bronze;
  const riskC = riskCfg[selectedCustomer.riskLevel] || riskCfg.Low;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: W.appBg,
        fontFamily: ff,
        color: W.textPrimary,
        overflow: "hidden",
      }}
    >
      {/* ── Title Bar ── */}
      <div
        style={{
          height: "32px",
          background: W.titleBarBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "12px",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              background: W.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pill size={10} color="#FFF" />
          </div>
          <span style={{ fontSize: "12px", color: W.textPrimary }}>
            PharmaCMS — Customer Management Studio
          </span>
        </div>
        <div style={{ display: "flex", height: "100%" }}>
          {[
            { icon: <Minus size={10} />, hb: W.hoverFill, hc: W.textSecondary },
            { icon: <Square size={9} />, hb: W.hoverFill, hc: W.textSecondary },
            { icon: <X size={12} />, hb: W.danger, hc: "#FFF" },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                width: "46px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: W.textSecondary,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = b.hb;
                (e.currentTarget as HTMLElement).style.color = b.hc;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color = W.textSecondary;
              }}
            >
              {b.icon}
            </div>
          ))}
        </div>
      </div>

      {/* ── Command Bar ── */}
      <div
        style={{
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          padding: "4px 12px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "relative", marginRight: "4px" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: W.textCaption,
            }}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, medication, DOB… (Ctrl+K)"
            style={{
              width: "280px",
              height: "30px",
              paddingLeft: "28px",
              paddingRight: "8px",
              fontSize: "12px",
              fontFamily: ff,
              background: W.subtleBg,
              border: `1px solid ${W.borderDefault}`,
              borderRadius: W.r4,
              color: W.textPrimary,
              outline: "none",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = W.accent;
              (e.target as HTMLInputElement).style.boxShadow =
                `0 0 0 1px ${W.accent}`;
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                W.borderDefault;
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        </div>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: W.borderSubtle,
            margin: "0 4px",
          }}
        />
        {[
          {
            icon: <Plus size={13} />,
            label: "New Customer",
            v: "accent" as const,
          },
          {
            icon: <ShoppingCart size={12} />,
            label: "New Sale",
            v: "default" as const,
          },
          { icon: <Pill size={12} />, label: "Add Rx", v: "default" as const },
          { icon: <Edit size={12} />, label: "Edit", v: "default" as const },
        ].map(({ icon, label, v }) => (
          <WinButton key={label} variant={v} size="sm">
            {icon}
            {label}
          </WinButton>
        ))}
        <div style={{ flex: 1 }} />
        <WinButton variant="ghost" size="sm">
          <Filter size={12} />
          Filter
          <ChevronDown size={11} />
        </WinButton>
        <WinButton variant="ghost" size="sm">
          <Download size={12} />
          Export
        </WinButton>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: W.borderSubtle,
            margin: "0 4px",
          }}
        />
        <WinButton variant="ghost" size="sm">
          <Grid3x3 size={13} />
        </WinButton>
        <WinButton variant="ghost" size="sm">
          <Settings size={13} />
        </WinButton>
      </div>

      {/* ── 3-Pane Workspace ── */}
      <div
        style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}
      >
        {/* ════════════ LEFT NAV ════════════ */}
        <div
          style={{
            width: "272px",
            flexShrink: 0,
            background: W.navBg,
            backdropFilter: "blur(20px)",
            borderRight: `1px solid ${W.borderSubtle}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Filter presets */}
          <div
            style={{
              padding: "8px 10px 6px",
              borderBottom: `1px solid ${W.borderSubtle}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: W.textCaption,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Customers
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: W.textCaption,
                  background: W.hoverFill,
                  borderRadius: "10px",
                  padding: "1px 7px",
                }}
              >
                {filtered.length}
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {FILTER_PRESETS.map((fp) => (
                <button
                  key={fp.key}
                  onClick={() =>
                    setFilterPreset(filterPreset === fp.key ? null : fp.key)
                  }
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    border: `1px solid ${filterPreset === fp.key ? fp.color : W.borderDefault}`,
                    background:
                      filterPreset === fp.key ? fp.color + "18" : W.cardBg,
                    color: filterPreset === fp.key ? fp.color : W.textSecondary,
                    transition: "all 0.1s",
                  }}
                >
                  {fp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px" }}>
            {filtered.map((c, idx) => {
              const isSel = selectedCustomer.id === c.id,
                isHov = hoveredNav === idx;
              const cRisk = riskCfg[c.riskLevel] || riskCfg.Low;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setActiveTab("overview");
                    setAllergyDismissed(false);
                  }}
                  onMouseEnter={() => setHoveredNav(idx)}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "7px 10px 7px 14px",
                    borderRadius: W.r4,
                    cursor: "pointer",
                    marginBottom: "1px",
                    background: isSel
                      ? W.selectedFill
                      : isHov
                        ? W.hoverFill
                        : "transparent",
                    transition: "background 0.1s",
                  }}
                >
                  {isSel && (
                    <div
                      style={{
                        position: "absolute",
                        left: "3px",
                        top: "6px",
                        bottom: "6px",
                        width: "3px",
                        borderRadius: "2px",
                        background: W.accent,
                      }}
                    />
                  )}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <CAvatar
                      initials={c.initials}
                      color={c.color}
                      size={34}
                      status={c.status}
                    />
                    {/* Risk dot */}
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        right: -1,
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: cRisk.color,
                        border: "1.5px solid #F3F3F3",
                      }}
                      title={`${c.riskLevel} Risk`}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isSel ? 600 : 400,
                          color: isSel ? W.accent : W.textPrimary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.name}
                      </span>
                      {c.hasAlert && (
                        <AlertTriangle
                          size={11}
                          style={{ color: W.caution, flexShrink: 0 }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "2px",
                      }}
                    >
                      <Phone size={10} style={{ color: W.textCaption }} />
                      <span style={{ fontSize: "11px", color: W.textCaption }}>
                        {c.phone}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      {c.tags.map((t) => (
                        <WinTag
                          key={t}
                          color={t === "Chronic" ? W.caution : W.accent}
                        >
                          {t}
                        </WinTag>
                      ))}
                      <TierBadge tier={c.tier} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: W.textCaption,
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Clock size={10} />
                        {c.lastVisit}
                      </span>
                      {c.balance !== 0 && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: c.balance < 0 ? W.danger : W.success,
                          }}
                        >
                          {c.balance < 0
                            ? `−EGP ${Math.abs(c.balance)}`
                            : `+EGP ${c.balance}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════ CENTER WORKSPACE ════════════ */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Customer Header */}
          <div
            style={{
              background: W.surfaceBg,
              borderBottom: `1px solid ${W.borderSubtle}`,
              padding: "11px 18px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <CAvatar
                  initials={selectedCustomer.initials}
                  color={selectedCustomer.color}
                  size={46}
                  status={selectedCustomer.status}
                />
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: W.textPrimary,
                        lineHeight: 1.2,
                      }}
                    >
                      {selectedCustomer.name}
                    </span>
                    {selectedCustomer.tags.map((t) => (
                      <WinTag
                        key={t}
                        color={t === "Chronic" ? W.caution : W.accent}
                      >
                        {t}
                      </WinTag>
                    ))}
                    <TierBadge tier={selectedCustomer.tier} />
                    <RiskBadge
                      level={selectedCustomer.riskLevel}
                      score={selectedCustomer.riskScore}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: W.textSecondary,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Phone size={11} />
                      {selectedCustomer.phone}
                    </span>
                    <span style={{ color: W.borderDefault }}>·</span>
                    <span style={{ fontSize: "12px", color: W.textSecondary }}>
                      {selectedCustomer.age}y {selectedCustomer.gender}
                    </span>
                    <span style={{ color: W.borderDefault }}>·</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: W.textSecondary,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Shield size={11} />
                      {selectedCustomer.insurance}
                    </span>
                    <span style={{ color: W.borderDefault }}>·</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: W.textSecondary,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Droplets size={11} style={{ color: "#C42B1C" }} />
                      A+
                    </span>
                  </div>
                  {(selectedCustomer.allergies.length > 0 ||
                    selectedCustomer.conditions.length > 0) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                        marginTop: "7px",
                      }}
                    >
                      {selectedCustomer.allergies.map((a) => (
                        <div
                          key={a}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 9px",
                            borderRadius: W.r4,
                            background: W.dangerBg,
                            color: W.danger,
                            border: `1px solid ${W.dangerBorder}`,
                          }}
                        >
                          <AlertTriangle size={10} />
                          {a} Allergy
                        </div>
                      ))}
                      {selectedCustomer.conditions.map((c) => (
                        <div
                          key={c}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 9px",
                            borderRadius: W.r4,
                            background: W.warningBg,
                            color: W.warning,
                            border: `1px solid ${W.warningBorder}`,
                          }}
                        >
                          <Heart size={10} />
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  flexShrink: 0,
                }}
              >
                <WinButton variant="accent" size="sm">
                  <ShoppingCart size={12} /> New Sale
                </WinButton>
                <WinButton variant="default" size="sm">
                  <Pill size={12} /> Add Rx
                </WinButton>
                <WinButton variant="default" size="sm">
                  <Edit size={12} /> Edit
                </WinButton>
                <div
                  style={{
                    width: "1px",
                    height: "18px",
                    background: W.borderSubtle,
                  }}
                />
                <WinButton variant="ghost" size="sm">
                  <Bell size={12} />
                </WinButton>
                <WinButton variant="ghost" size="sm">
                  <MoreHorizontal size={12} />
                </WinButton>
              </div>
            </div>
          </div>

          {/* Pivot Tabs */}
          <div
            style={{
              background: W.surfaceBg,
              borderBottom: `1px solid ${W.borderSubtle}`,
              padding: "0 18px",
              flexShrink: 0,
              overflowX: "auto",
            }}
          >
            <div style={{ display: "flex", minWidth: "max-content" }}>
              {TABS.map((tab) => {
                const isA = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "9px 12px 8px",
                      fontSize: "12px",
                      fontWeight: isA ? 600 : 400,
                      fontFamily: ff,
                      color: isA ? W.accent : W.textSecondary,
                      background: "transparent",
                      border: "none",
                      borderBottom: isA
                        ? `2px solid ${W.accent}`
                        : "2px solid transparent",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isA)
                        (e.currentTarget as HTMLElement).style.color =
                          W.textPrimary;
                    }}
                    onMouseLeave={(e) => {
                      if (!isA)
                        (e.currentTarget as HTMLElement).style.color =
                          W.textSecondary;
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.badge && tab.badge > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "2px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: W.danger,
                          color: "#FFF",
                          fontSize: "9px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ════ TAB CONTENT ════ */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 18px",
              background: W.appBg,
            }}
          >
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Loyalty tier hero */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${tierC.color}22 0%, ${tierC.color}08 100%)`,
                    border: `1px solid ${tierC.border}`,
                    borderRadius: W.r8,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: W.r6,
                        background: tierC.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Award size={18} color="#FFF" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: tierC.color,
                        }}
                      >
                        {tier} Member
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: W.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        {tierC.points.toLocaleString()} pts · Next tier at{" "}
                        {tierC.nextAt.toLocaleString()} pts
                      </div>
                    </div>
                  </div>
                  {/* Points bar */}
                  <div style={{ width: "200px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11px",
                        color: W.textCaption,
                        marginBottom: "4px",
                      }}
                    >
                      <span>{tierC.points} pts</span>
                      <span>{tierC.nextAt} pts</span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: W.subtleBg,
                        borderRadius: "3px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, (tierC.points / tierC.nextAt) * 100)}%`,
                          background: tierC.color,
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: W.textCaption,
                        marginTop: "3px",
                      }}
                    >
                      {tierC.nextAt - tierC.points} pts to next tier
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: "10px",
                  }}
                >
                  {[
                    {
                      label: "Last Purchase",
                      value: "Mar 25, 2026",
                      sub: "EGP 145",
                      icon: <ShoppingCart size={15} />,
                      a: W.accent,
                    },
                    {
                      label: "Total Spent",
                      value: `EGP ${selectedCustomer.totalSpent.toLocaleString()}`,
                      sub: "Lifetime",
                      icon: <TrendingUp size={15} />,
                      a: W.success,
                    },
                    {
                      label: "Overall Adherence",
                      value: `${analyticsData.overallPDC}%`,
                      sub:
                        analyticsData.overallPDC >= 80
                          ? "Above threshold"
                          : "Below 80% threshold",
                      icon: <ClipboardList size={15} />,
                      a: analyticsData.overallPDC >= 80 ? W.success : W.danger,
                    },
                    {
                      label: "Active Rx",
                      value: String(selectedCustomer.activeRx),
                      sub: "Prescriptions",
                      icon: <Pill size={15} />,
                      a: "#7719AA",
                    },
                  ].map(({ label, value, sub, icon, a }) => (
                    <div
                      key={label}
                      style={{
                        background: W.cardBg,
                        border: `1px solid ${W.borderSubtle}`,
                        borderRadius: W.r8,
                        padding: "12px",
                        boxShadow: W.shadowCard,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "27px",
                            height: "27px",
                            borderRadius: W.r4,
                            background: a + "18",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: a,
                          }}
                        >
                          {icon}
                        </div>
                        <span
                          style={{ fontSize: "11px", color: W.textSecondary }}
                        >
                          {label}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: 700,
                          color: W.textPrimary,
                        }}
                      >
                        {value}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: W.textCaption,
                          marginTop: "2px",
                        }}
                      >
                        {sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Care gaps alert */}
                {analyticsData.careGaps.filter((g) => g.priority === "high")
                  .length > 0 && (
                  <div
                    style={{
                      background: W.dangerBg,
                      border: `1px solid ${W.dangerBorder}`,
                      borderRadius: W.r8,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <Siren
                      size={16}
                      style={{
                        color: W.danger,
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: W.danger,
                          marginBottom: "4px",
                        }}
                      >
                        Care Gaps Identified
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {analyticsData.careGaps
                          .filter((g) => g.priority === "high")
                          .map((g) => (
                            <span
                              key={g.gap}
                              style={{ fontSize: "12px", color: W.danger }}
                            >
                              • {g.gap}
                            </span>
                          ))}
                      </div>
                    </div>
                    <WinButton
                      variant="danger"
                      size="sm"
                      onClick={() => setActiveTab("analytics")}
                    >
                      View All
                    </WinButton>
                  </div>
                )}

                {/* Recent interactions */}
                <SectionCard
                  title="Recent Interactions"
                  action={
                    <WinButton variant="ghost" size="sm">
                      View All <ChevronRight size={11} />
                    </WinButton>
                  }
                >
                  {historyData.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 0",
                        borderBottom:
                          i < 2 ? `1px solid ${W.borderSubtle}` : "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          W.hoverFill)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "")
                      }
                    >
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: W.r4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          background:
                            item.type === "Sale"
                              ? W.accentLight
                              : item.type === "Return"
                                ? W.dangerBg
                                : W.successBg,
                          color:
                            item.type === "Sale"
                              ? W.accent
                              : item.type === "Return"
                                ? W.danger
                                : W.success,
                        }}
                      >
                        {item.type === "Sale" ? (
                          <Package size={12} />
                        ) : item.type === "Return" ? (
                          <RefreshCw size={12} />
                        ) : (
                          <MessageSquare size={12} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>
                            {item.type}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: W.textSecondary,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.items}
                          </span>
                        </div>
                        <span
                          style={{ fontSize: "11px", color: W.textCaption }}
                        >
                          {item.date} · {item.pharmacist}
                        </span>
                      </div>
                      {item.amount !== 0 && (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: item.amount < 0 ? W.danger : W.textPrimary,
                            flexShrink: 0,
                          }}
                        >
                          {item.amount < 0 ? "−" : "+"}EGP{" "}
                          {Math.abs(item.amount)}
                        </span>
                      )}
                    </div>
                  ))}
                </SectionCard>
              </div>
            )}

            {/* ── MEDICATIONS ── */}
            {activeTab === "medications" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Allergy contraindication — CRITICAL full-width banner */}
                {!allergyDismissed &&
                  allergyContraindications.length > 0 &&
                  allergyContraindications.map((ac, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#5C0A0A",
                        borderRadius: W.r8,
                        overflow: "hidden",
                        boxShadow: `0 0 0 2px ${W.danger}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "12px 16px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: W.r6,
                            background: W.danger,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Siren size={18} color="#FFF" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 800,
                                color: "#FFF",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              ⛔ ALLERGY CONTRAINDICATION — STOP BEFORE
                              DISPENSING
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: W.r4,
                                background: W.danger,
                                color: "#FFF",
                              }}
                            >
                              CRITICAL
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "rgba(255,255,255,0.9)",
                              marginBottom: "4px",
                            }}
                          >
                            {ac.drug} is contraindicated — Patient has
                            documented{" "}
                            <strong style={{ color: "#FFB3B0" }}>
                              {ac.allergen} allergy
                            </strong>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "rgba(255,255,255,0.75)",
                            }}
                          >
                            {ac.guidance}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            flexShrink: 0,
                          }}
                        >
                          {overrideTarget === i ? (
                            <div
                              style={{
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: W.r4,
                                padding: "8px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#FFC",
                                  marginBottom: "4px",
                                  fontWeight: 600,
                                }}
                              >
                                Pharmacist Override — Reason Required:
                              </div>
                              <input
                                value={overrideReason}
                                onChange={(e) =>
                                  setOverrideReason(e.target.value)
                                }
                                placeholder="Clinical justification…"
                                style={{
                                  width: "220px",
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  fontFamily: ff,
                                  borderRadius: W.r4,
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  background: "rgba(255,255,255,0.1)",
                                  color: "#FFF",
                                  outline: "none",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  marginTop: "6px",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    if (overrideReason.trim()) {
                                      setAllergyDismissed(true);
                                      setOverrideTarget(null);
                                      setOverrideReason("");
                                    }
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    background: W.danger,
                                    color: "#FFF",
                                    border: "none",
                                    borderRadius: W.r4,
                                    cursor: "pointer",
                                  }}
                                >
                                  Override & Log
                                </button>
                                <button
                                  onClick={() => {
                                    setOverrideTarget(null);
                                    setOverrideReason("");
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    background: "rgba(255,255,255,0.15)",
                                    color: "#FFF",
                                    border: "none",
                                    borderRadius: W.r4,
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setOverrideTarget(i)}
                              style={{
                                padding: "5px 12px",
                                fontSize: "11px",
                                fontWeight: 600,
                                background: "rgba(255,255,255,0.12)",
                                color: "rgba(255,255,255,0.85)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: W.r4,
                                cursor: "pointer",
                              }}
                            >
                              Pharmacist Override…
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Drug interaction alerts */}
                {visibleInteractions.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {visibleInteractions.map((interaction) => {
                      const sev = {
                        critical: {
                          bg: "#5C0A0A",
                          text: "#FFB3B0",
                          badge: W.danger,
                          label: "CRITICAL",
                        },
                        moderate: {
                          bg: W.warningBg,
                          text: W.warning,
                          badge: W.caution,
                          label: "MODERATE",
                        },
                        minor: {
                          bg: W.accentLight,
                          text: W.accent,
                          badge: W.accent,
                          label: "MINOR",
                        },
                      }[interaction.severity] || {
                        bg: W.subtleBg,
                        text: W.textPrimary,
                        badge: W.textCaption,
                        label: "?",
                      };
                      return (
                        <div
                          key={interaction.id}
                          style={{
                            background: sev.bg,
                            border: `1px solid ${sev.badge}40`,
                            borderRadius: W.r8,
                            padding: "12px 14px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <FlaskConical
                            size={16}
                            style={{
                              color: sev.badge,
                              flexShrink: 0,
                              marginTop: "1px",
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  color: sev.text,
                                }}
                              >
                                Drug Interaction: {interaction.drug1} ↔{" "}
                                {interaction.drug2}
                              </span>
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  padding: "1px 8px",
                                  borderRadius: W.r4,
                                  background: sev.badge,
                                  color: "#FFF",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {sev.label}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: sev.text,
                                opacity: 0.9,
                                marginBottom: "4px",
                              }}
                            >
                              {interaction.description}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: sev.text,
                                opacity: 0.75,
                                fontStyle: "italic",
                              }}
                            >
                              {interaction.guidance}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: W.textCaption,
                                marginTop: "4px",
                              }}
                            >
                              Source: {interaction.source}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setDismissedInteractions((d) => [
                                ...d,
                                interaction.id,
                              ])
                            }
                            style={{
                              fontSize: "11px",
                              padding: "3px 10px",
                              background: "rgba(0,0,0,0.07)",
                              color: W.textSecondary,
                              border: `1px solid ${W.borderDefault}`,
                              borderRadius: W.r4,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            Acknowledge
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Adherence tracking */}
                <SectionCard
                  title="Medication Adherence (PDC / MPR)"
                  icon={<ClipboardList size={13} />}
                  action={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: W.textCaption }}>
                        Overall PDC:
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color:
                            analyticsData.overallPDC >= 80
                              ? W.success
                              : W.danger,
                        }}
                      >
                        {analyticsData.overallPDC}%
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 7px",
                          borderRadius: W.r4,
                          background:
                            analyticsData.overallPDC >= 80
                              ? W.successBg
                              : W.dangerBg,
                          color:
                            analyticsData.overallPDC >= 80
                              ? W.success
                              : W.danger,
                          border: `1px solid ${analyticsData.overallPDC >= 80 ? W.successBorder : W.dangerBorder}`,
                          fontWeight: 600,
                        }}
                      >
                        {analyticsData.overallPDC >= 80
                          ? "Medicare ★ Met"
                          : "Below Threshold"}
                      </span>
                    </div>
                  }
                >
                  {adherenceData.map((a, i) => (
                    <AdherenceBar
                      key={i}
                      drug={a.drug}
                      pdc={a.pdc}
                      mpr={a.mpr}
                      daysUntilDue={a.daysUntilDue}
                      status={a.status}
                    />
                  ))}
                </SectionCard>

                {/* Refill prediction engine */}
                <SectionCard
                  title="Refill Prediction Engine"
                  icon={<BellRing size={13} />}
                  action={
                    <WinButton variant="accent" size="sm">
                      <Send size={11} /> Send All Reminders
                    </WinButton>
                  }
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: "10px",
                    }}
                  >
                    {adherenceData
                      .filter((a) => a.daysUntilDue <= 14)
                      .map((a, i) => {
                        const urgent = a.daysUntilDue < 0,
                          soon = a.daysUntilDue <= 7;
                        const cardColor = urgent
                          ? W.danger
                          : soon
                            ? W.caution
                            : W.accent;
                        const cardBg = urgent
                          ? W.dangerBg
                          : soon
                            ? W.warningBg
                            : W.accentLight;
                        return (
                          <div
                            key={i}
                            style={{
                              background: cardBg,
                              border: `1px solid ${cardColor}30`,
                              borderRadius: W.r6,
                              padding: "10px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                marginBottom: "7px",
                              }}
                            >
                              <Repeat2 size={13} style={{ color: cardColor }} />
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: cardColor,
                                }}
                              >
                                {urgent
                                  ? "OVERDUE"
                                  : soon
                                    ? "Due Soon"
                                    : "Upcoming"}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: W.textPrimary,
                                marginBottom: "3px",
                              }}
                            >
                              {a.drug}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: W.textSecondary,
                                marginBottom: "7px",
                              }}
                            >
                              {a.daysUntilDue < 0
                                ? `${Math.abs(a.daysUntilDue)} days overdue`
                                : a.daysUntilDue === 0
                                  ? "Due today"
                                  : `Due in ${a.daysUntilDue} days`}
                            </div>
                            <WinButton variant="ghost" size="sm">
                              <Send size={10} /> SMS Reminder
                            </WinButton>
                          </div>
                        );
                      })}
                  </div>
                </SectionCard>

                {/* Prescription timeline */}
                <SectionCard
                  title="Prescription History Timeline"
                  icon={<History size={13} />}
                  noPad
                >
                  {rxTimeline.map((rx, i) => {
                    const stCfg = {
                      active: {
                        c: W.success,
                        bg: W.successBg,
                        b: W.successBorder,
                        label: "Active",
                      },
                      completed: {
                        c: W.textCaption,
                        bg: W.subtleBg,
                        b: W.borderDefault,
                        label: "Completed",
                      },
                      discontinued: {
                        c: W.danger,
                        bg: W.dangerBg,
                        b: W.dangerBorder,
                        label: "Discontinued",
                      },
                    }[rx.status] || {
                      c: W.textCaption,
                      bg: W.subtleBg,
                      b: W.borderDefault,
                      label: rx.status,
                    };
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "11px 14px",
                          borderBottom:
                            i < rxTimeline.length - 1
                              ? `1px solid ${W.borderSubtle}`
                              : "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.background =
                            W.hoverFill)
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.background =
                            "")
                        }
                      >
                        {/* Timeline dot */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexShrink: 0,
                            paddingTop: "2px",
                          }}
                        >
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: rx.color,
                              border: `2px solid ${rx.color}40`,
                            }}
                          />
                          {i < rxTimeline.length - 1 && (
                            <div
                              style={{
                                width: "1px",
                                flex: 1,
                                background: W.borderSubtle,
                                marginTop: "3px",
                                minHeight: "20px",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: W.textPrimary,
                              }}
                            >
                              {rx.drug}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  padding: "1px 7px",
                                  borderRadius: W.r4,
                                  background: stCfg.bg,
                                  color: stCfg.c,
                                  border: `1px solid ${stCfg.b}`,
                                }}
                              >
                                {stCfg.label}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: W.textCaption,
                                }}
                              >
                                {rx.date}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: W.textSecondary,
                              marginTop: "2px",
                            }}
                          >
                            {rx.dose}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginTop: "4px",
                            }}
                          >
                            <span
                              style={{ fontSize: "11px", color: W.textCaption }}
                            >
                              {rx.doctor} · {rx.specialty}
                            </span>
                            <span
                              style={{ fontSize: "11px", color: W.textCaption }}
                            >
                              Fills: {rx.fills}/{rx.authorized}
                            </span>
                            {/* Fill progress */}
                            <div style={{ display: "flex", gap: "2px" }}>
                              {Array.from({ length: rx.authorized }).map(
                                (_, j) => (
                                  <div
                                    key={j}
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "2px",
                                      background:
                                        j < rx.fills ? rx.color : W.subtleBg,
                                      border: `1px solid ${W.borderDefault}`,
                                    }}
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </SectionCard>
              </div>
            )}

            {/* ── ANALYTICS ── */}
            {activeTab === "analytics" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Risk + Engagement top row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {/* Risk stratification */}
                  <SectionCard
                    title="Patient Risk Stratification"
                    icon={<Target size={13} />}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "12px",
                      }}
                    >
                      {/* Score ring */}
                      <div
                        style={{
                          position: "relative",
                          width: "70px",
                          height: "70px",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="70" height="70" viewBox="0 0 70 70">
                          <circle
                            cx="35"
                            cy="35"
                            r="28"
                            fill="none"
                            stroke={W.subtleBg}
                            strokeWidth="8"
                          />
                          <circle
                            cx="35"
                            cy="35"
                            r="28"
                            fill="none"
                            stroke={riskC.color}
                            strokeWidth="8"
                            strokeDasharray={`${(selectedCustomer.riskScore / 100) * 176} 176`}
                            strokeLinecap="round"
                            transform="rotate(-90 35 35)"
                            style={{ transition: "stroke-dasharray 0.6s" }}
                          />
                        </svg>
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: 800,
                              color: riskC.color,
                              lineHeight: 1,
                            }}
                          >
                            {selectedCustomer.riskScore}
                          </span>
                          <span
                            style={{ fontSize: "9px", color: W.textCaption }}
                          >
                            / 100
                          </span>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: riskC.color,
                            }}
                          >
                            {selectedCustomer.riskLevel} Risk
                          </span>
                        </div>
                        <div
                          style={{ fontSize: "12px", color: W.textSecondary }}
                        >
                          Intervention recommended
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            marginTop: "6px",
                          }}
                        >
                          {["Non-Adherent", "Polypharmacy", "Chronic"].map(
                            (f) => (
                              <span
                                key={f}
                                style={{
                                  fontSize: "10px",
                                  padding: "1px 7px",
                                  borderRadius: W.r4,
                                  background: riskC.bg,
                                  color: riskC.color,
                                  border: `1px solid ${riskC.border}`,
                                }}
                              >
                                {f}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: W.textCaption,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "6px",
                      }}
                    >
                      Risk Factors
                    </div>
                    {[
                      "Non-adherent: Aspirin (55% PDC)",
                      "Polypharmacy: 5 active drugs",
                      "2 chronic conditions",
                      "Overdue refill: Amlodipine",
                    ].map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          padding: "5px 0",
                          borderBottom: `1px solid ${W.borderSubtle}`,
                          fontSize: "12px",
                          color: W.textPrimary,
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: riskC.color,
                            flexShrink: 0,
                          }}
                        />
                        {f}
                      </div>
                    ))}
                  </SectionCard>

                  {/* Engagement metrics */}
                  <SectionCard
                    title="Engagement & Revenue"
                    icon={<TrendingUp size={13} />}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      {[
                        {
                          label: "Engagement Score",
                          value: `${analyticsData.engagementScore}%`,
                          color:
                            analyticsData.engagementScore >= 75
                              ? W.success
                              : W.caution,
                        },
                        {
                          label: "Visit Frequency",
                          value: `${analyticsData.visitFrequency} ${analyticsData.visitUnit}`,
                          color: W.textPrimary,
                        },
                        {
                          label: "Avg Days Between",
                          value: `${analyticsData.avgDaysBetween} days`,
                          color: W.textPrimary,
                        },
                        {
                          label: "Rx Abandonment",
                          value: `${analyticsData.abandonmentRate}%`,
                          color:
                            analyticsData.abandonmentRate < 10
                              ? W.success
                              : W.danger,
                        },
                        {
                          label: "Lifetime Value",
                          value: `EGP ${analyticsData.ltv.toLocaleString()}`,
                          color: W.accent,
                        },
                        {
                          label: "Avg Transaction",
                          value: `EGP ${analyticsData.avgTransaction}`,
                          color: W.textPrimary,
                        },
                        {
                          label: "YoY Growth",
                          value: `+${analyticsData.yearlyGrowth}%`,
                          color: W.success,
                        },
                        {
                          label: "Overall PDC",
                          value: `${analyticsData.overallPDC}%`,
                          color:
                            analyticsData.overallPDC >= 80
                              ? W.success
                              : W.danger,
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            padding: "7px",
                            background: W.subtleBg,
                            borderRadius: W.r4,
                          }}
                        >
                          <span
                            style={{ fontSize: "10px", color: W.textCaption }}
                          >
                            {label}
                          </span>
                          <span
                            style={{ fontSize: "14px", fontWeight: 700, color }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: W.textCaption,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "7px",
                      }}
                    >
                      Spend by Category
                    </div>
                    {analyticsData.topCategories.map((cat) => (
                      <div key={cat.name} style={{ marginBottom: "7px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            marginBottom: "3px",
                          }}
                        >
                          <span style={{ color: W.textPrimary }}>
                            {cat.name}
                          </span>
                          <span
                            style={{ fontWeight: 600, color: W.textSecondary }}
                          >
                            EGP {cat.amt.toLocaleString()} ({cat.pct}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: "5px",
                            background: W.subtleBg,
                            borderRadius: "3px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${cat.pct}%`,
                              background: W.accent,
                              borderRadius: "3px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </SectionCard>
                </div>

                {/* Adherence by drug class — Medicare Star Ratings */}
                <SectionCard
                  title="Adherence by Drug Class — Medicare Star Rating Report"
                  icon={<Star size={13} />}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: "10px",
                    }}
                  >
                    {analyticsData.popAdherence.map((pa) => {
                      const met = pa.rate >= pa.benchmark;
                      return (
                        <div
                          key={pa.class}
                          style={{
                            background: met ? W.successBg : W.dangerBg,
                            border: `1px solid ${met ? W.successBorder : W.dangerBorder}`,
                            borderRadius: W.r6,
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "24px",
                              fontWeight: 800,
                              color: met ? W.success : W.danger,
                            }}
                          >
                            {pa.rate}%
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: W.textSecondary,
                              margin: "3px 0",
                            }}
                          >
                            {pa.class}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: met ? W.success : W.danger,
                            }}
                          >
                            {met ? "★ Above threshold" : "✗ Below threshold"}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: W.textCaption,
                              marginTop: "2px",
                            }}
                          >
                            Benchmark: {pa.benchmark}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>

                {/* Care gaps */}
                <SectionCard
                  title="Care Gaps"
                  icon={<AlertCircle size={13} />}
                  action={
                    <WinButton variant="accent" size="sm">
                      <Send size={11} /> Notify Patient
                    </WinButton>
                  }
                >
                  {analyticsData.careGaps.map((g, i) => {
                    const pri = {
                      high: {
                        c: W.danger,
                        bg: W.dangerBg,
                        b: W.dangerBorder,
                        icon: <Siren size={12} />,
                      },
                      medium: {
                        c: W.caution,
                        bg: W.warningBg,
                        b: W.warningBorder,
                        icon: <AlertTriangle size={12} />,
                      },
                      low: {
                        c: W.textCaption,
                        bg: W.subtleBg,
                        b: W.borderDefault,
                        icon: <Info size={12} />,
                      },
                    }[g.priority] || {
                      c: W.textCaption,
                      bg: W.subtleBg,
                      b: W.borderDefault,
                      icon: <Info size={12} />,
                    };
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 0",
                          borderBottom:
                            i < analyticsData.careGaps.length - 1
                              ? `1px solid ${W.borderSubtle}`
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: W.r4,
                            background: pri.bg,
                            border: `1px solid ${pri.b}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: pri.c,
                            flexShrink: 0,
                          }}
                        >
                          {pri.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: W.textPrimary,
                            }}
                          >
                            {g.gap}
                          </span>
                          <div
                            style={{
                              fontSize: "11px",
                              color: W.textCaption,
                              marginTop: "1px",
                            }}
                          >
                            Originally due: {g.dueDate}
                          </div>
                        </div>
                        <WinButton variant="ghost" size="sm">
                          <Send size={11} /> Remind
                        </WinButton>
                      </div>
                    );
                  })}
                </SectionCard>
              </div>
            )}

            {/* ── OUTREACH ── */}
            {activeTab === "outreach" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* Upcoming reminders */}
                  <SectionCard
                    title="Scheduled Outreach"
                    icon={<BellRing size={13} />}
                    action={
                      <WinButton variant="accent" size="sm">
                        <Plus size={11} /> Schedule
                      </WinButton>
                    }
                  >
                    {outreachData.upcoming.map((r, i) => {
                      const chCfg = {
                        SMS: {
                          c: "#107C10",
                          bg: "#DFF6DD",
                          icon: <MessageSquare size={12} />,
                        },
                        Email: {
                          c: W.accent,
                          bg: W.accentLight,
                          icon: <Mail size={12} />,
                        },
                        Phone: {
                          c: "#7719AA",
                          bg: "#F3E8FF",
                          icon: <PhoneCall size={12} />,
                        },
                      }[r.channel] || {
                        c: W.textCaption,
                        bg: W.subtleBg,
                        icon: <Bell size={12} />,
                      };
                      const stCfg = {
                        scheduled: { c: W.success, label: "Scheduled" },
                        pending_consent: {
                          c: W.caution,
                          label: "Pending Consent",
                        },
                        draft: { c: W.textCaption, label: "Draft" },
                      }[r.status] || { c: W.textCaption, label: r.status };
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            padding: "9px 0",
                            borderBottom:
                              i < outreachData.upcoming.length - 1
                                ? `1px solid ${W.borderSubtle}`
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: W.r4,
                              background: chCfg.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: chCfg.c,
                              flexShrink: 0,
                            }}
                          >
                            {chCfg.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                marginBottom: "2px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: W.textPrimary,
                                  flex: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {r.content}
                              </span>
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  padding: "1px 6px",
                                  borderRadius: W.r4,
                                  color: stCfg.c,
                                  background: stCfg.c + "18",
                                  flexShrink: 0,
                                }}
                              >
                                {stCfg.label}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: W.textCaption,
                                }}
                              >
                                {r.channel} · {r.scheduledFor}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color:
                                    r.daysAway <= 3
                                      ? W.danger
                                      : r.daysAway <= 7
                                        ? W.caution
                                        : W.textCaption,
                                }}
                              >
                                {r.daysAway === 0
                                  ? "Today"
                                  : r.daysAway === 1
                                    ? "Tomorrow"
                                    : `In ${r.daysAway} days`}
                              </span>
                            </div>
                          </div>
                          <WinButton variant="ghost" size="sm">
                            <MoreHorizontal size={11} />
                          </WinButton>
                        </div>
                      );
                    })}
                  </SectionCard>

                  {/* Campaign history */}
                  <SectionCard
                    title="Outreach History"
                    icon={<History size={13} />}
                  >
                    {outreachData.history.map((h, i) => {
                      const sCfg = {
                        converted: { c: W.success, bg: W.successBg },
                        no_response: { c: W.danger, bg: W.dangerBg },
                        opened: { c: W.accent, bg: W.accentLight },
                        rescheduled: { c: W.caution, bg: W.warningBg },
                      }[h.status] || { c: W.textCaption, bg: W.subtleBg };
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            padding: "8px 0",
                            borderBottom:
                              i < outreachData.history.length - 1
                                ? `1px solid ${W.borderSubtle}`
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              borderRadius: W.r4,
                              background: sCfg.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: sCfg.c,
                              flexShrink: 0,
                            }}
                          >
                            {h.status === "converted" ? (
                              <CheckCircle size={12} />
                            ) : h.status === "no_response" ? (
                              <XCircle size={12} />
                            ) : (
                              <Bell size={12} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: W.textPrimary,
                              }}
                            >
                              {h.content}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: W.textCaption,
                                marginTop: "1px",
                              }}
                            >
                              {h.channel} · {h.sentAt}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 500,
                                color: sCfg.c,
                                marginTop: "2px",
                              }}
                            >
                              {h.outcome}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </SectionCard>
                </div>

                {/* Two-way HIPAA-compliant messaging */}
                <SectionCard
                  title="Secure Messaging (HIPAA-Compliant)"
                  icon={<MessageSquare size={13} />}
                  action={
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: W.r4,
                        background: W.successBg,
                        color: W.success,
                        border: `1px solid ${W.successBorder}`,
                      }}
                    >
                      🔒 Encrypted
                    </span>
                  }
                >
                  {/* Message history */}
                  <div
                    style={{
                      height: "260px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginBottom: "10px",
                      padding: "4px 0",
                    }}
                  >
                    {outreachData.messages.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.from === "pharmacy" ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "80%",
                            background:
                              msg.from === "pharmacy" ? W.accent : W.cardBg,
                            border: `1px solid ${msg.from === "pharmacy" ? "transparent" : W.borderDefault}`,
                            borderRadius:
                              msg.from === "pharmacy"
                                ? "12px 12px 4px 12px"
                                : "12px 12px 12px 4px",
                            padding: "8px 11px",
                            boxShadow: W.shadowCard,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color:
                                msg.from === "pharmacy"
                                  ? "#FFF"
                                  : W.textPrimary,
                              lineHeight: 1.5,
                            }}
                          >
                            {msg.text}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color:
                                msg.from === "pharmacy"
                                  ? "rgba(255,255,255,0.65)"
                                  : W.textCaption,
                              marginTop: "3px",
                              textAlign: "right",
                            }}
                          >
                            {msg.time} · {msg.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      borderTop: `1px solid ${W.borderSubtle}`,
                      paddingTop: "10px",
                    }}
                  >
                    <input
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Type a message…"
                      style={{
                        flex: 1,
                        height: "32px",
                        padding: "0 10px",
                        fontSize: "13px",
                        fontFamily: ff,
                        background: W.subtleBg,
                        border: `1px solid ${W.borderDefault}`,
                        borderRadius: W.r4,
                        color: W.textPrimary,
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLInputElement).style.borderColor =
                          W.accent;
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLInputElement).style.borderColor =
                          W.borderDefault;
                      }}
                    />
                    <WinButton
                      variant="accent"
                      size="sm"
                      disabled={!msgInput.trim()}
                      onClick={() => setMsgInput("")}
                    >
                      <Send size={12} /> Send
                    </WinButton>
                  </div>

                  {/* Appointment section */}
                  <div
                    style={{
                      marginTop: "14px",
                      paddingTop: "10px",
                      borderTop: `1px solid ${W.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: W.textPrimary,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Calendar size={13} style={{ color: W.accent }} />{" "}
                      Upcoming Appointments
                    </div>
                    {[
                      {
                        title: "MTM Consultation",
                        date: "Apr 8, 2026",
                        time: "10:00 AM",
                        with: "Dr. Rania",
                        type: "consultation",
                      },
                      {
                        title: "BP Monitoring Check",
                        date: "Apr 22, 2026",
                        time: "9:30 AM",
                        with: "Technician",
                        type: "screening",
                      },
                    ].map((appt, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          padding: "7px 9px",
                          borderRadius: W.r4,
                          background: W.subtleBg,
                          marginBottom: "5px",
                          border: `1px solid ${W.borderSubtle}`,
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: i === 0 ? W.accent : "#7719AA",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px", fontWeight: 500 }}>
                            {appt.title}
                          </div>
                          <div
                            style={{ fontSize: "11px", color: W.textCaption }}
                          >
                            {appt.date} · {appt.time} · {appt.with}
                          </div>
                        </div>
                        <WinButton variant="ghost" size="sm">
                          <Edit size={10} />
                        </WinButton>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── 360° PROFILE ── */}
            {activeTab === "profile" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <SectionCard
                    title="Demographics"
                    icon={<User size={13} />}
                    action={
                      <WinButton variant="ghost" size="sm">
                        <Edit size={11} /> Edit
                      </WinButton>
                    }
                  >
                    <KVRow label="Date of Birth" value={patientProfile.dob} />
                    <KVRow
                      label="National ID"
                      value={
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {patientProfile.nationalId}
                          <Copy
                            size={11}
                            style={{ color: W.textCaption, cursor: "pointer" }}
                          />
                        </span>
                      }
                      mono
                    />
                    <KVRow
                      label="Blood Type"
                      value={
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            color: W.danger,
                            fontWeight: 700,
                          }}
                        >
                          <Droplets size={12} />
                          {patientProfile.bloodType}
                        </span>
                      }
                    />
                    <KVRow
                      label="Gender / Age"
                      value={`${selectedCustomer.gender}, ${selectedCustomer.age} years`}
                    />
                    <KVRow
                      label="Marital Status"
                      value={patientProfile.maritalStatus}
                    />
                    <KVRow
                      label="Occupation"
                      value={patientProfile.occupation}
                    />
                    <KVRow label="Address" value={patientProfile.address} />
                    <KVRow
                      label="Primary Physician"
                      value={patientProfile.primaryPhysician}
                    />
                    <KVRow
                      label="Registered Since"
                      value={patientProfile.registeredSince}
                    />
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "8px",
                        background: W.subtleBg,
                        borderRadius: W.r4,
                        fontSize: "12px",
                        color: W.textSecondary,
                        fontStyle: "italic",
                      }}
                    >
                      "{patientProfile.notes}"
                    </div>
                  </SectionCard>
                  <SectionCard
                    title="Medical Profile"
                    icon={<Heart size={13} />}
                    action={
                      <WinButton variant="ghost" size="sm">
                        <Plus size={11} /> Add
                      </WinButton>
                    }
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: W.textCaption,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "6px",
                        }}
                      >
                        Allergies
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedCustomer.allergies.map((a) => (
                          <div
                            key={a}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: W.r4,
                              background: W.dangerBg,
                              color: W.danger,
                              border: `1px solid ${W.dangerBorder}`,
                            }}
                          >
                            <AlertTriangle size={11} />
                            {a}
                          </div>
                        ))}
                        {selectedCustomer.allergies.length === 0 && (
                          <span
                            style={{ fontSize: "12px", color: W.textCaption }}
                          >
                            None recorded
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        height: "1px",
                        background: W.borderSubtle,
                        margin: "8px 0",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: W.textCaption,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "6px",
                        }}
                      >
                        Chronic Conditions
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedCustomer.conditions.map((c) => (
                          <div
                            key={c}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: W.r4,
                              background: W.warningBg,
                              color: W.warning,
                              border: `1px solid ${W.warningBorder}`,
                            }}
                          >
                            <Heart size={11} />
                            {c}
                          </div>
                        ))}
                        {selectedCustomer.conditions.length === 0 && (
                          <span
                            style={{ fontSize: "12px", color: W.textCaption }}
                          >
                            None recorded
                          </span>
                        )}
                      </div>
                    </div>
                  </SectionCard>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <SectionCard
                    title="Contact Methods"
                    icon={<PhoneCall size={13} />}
                    action={
                      <WinButton variant="ghost" size="sm">
                        <UserPlus size={11} /> Add
                      </WinButton>
                    }
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: W.textCaption,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "6px",
                        }}
                      >
                        Phone Numbers
                      </div>
                      {phoneNumbers.map((ph, i) => (
                        <div
                          key={ph.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            padding: "8px 0",
                            borderBottom:
                              i < phoneNumbers.length - 1
                                ? `1px solid ${W.borderSubtle}`
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: W.r4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              background: ph.active
                                ? W.accentLight
                                : W.subtleBg,
                              color: ph.active ? W.accent : W.textCaption,
                            }}
                          >
                            {ph.active ? (
                              <PhoneCall size={12} />
                            ) : (
                              <PhoneOff size={12} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: ph.active
                                    ? W.textPrimary
                                    : W.textDisabled,
                                }}
                              >
                                {ph.number}
                              </span>
                              {ph.isPrimary && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    padding: "1px 6px",
                                    borderRadius: "999px",
                                    background: W.accent + "20",
                                    color: W.accent,
                                  }}
                                >
                                  PRIMARY
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: W.textCaption,
                                }}
                              >
                                {ph.type}
                              </span>
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  padding: "1px 7px",
                                  borderRadius: W.r4,
                                  background: ph.smsConsent
                                    ? W.successBg
                                    : W.subtleBg,
                                  color: ph.smsConsent
                                    ? W.success
                                    : W.textCaption,
                                  border: `1px solid ${ph.smsConsent ? W.successBorder : W.borderDefault}`,
                                }}
                              >
                                {ph.smsConsent ? (
                                  <BadgeCheck size={10} />
                                ) : (
                                  <XCircle size={10} />
                                )}
                                {ph.smsConsent
                                  ? `SMS ✓ ${ph.consentDate || ""}`
                                  : "No SMS Consent"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        height: "1px",
                        background: W.borderSubtle,
                        margin: "4px 0 10px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: W.textCaption,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "6px",
                      }}
                    >
                      Email Addresses
                    </div>
                    {emailContacts.map((em, i) => (
                      <div
                        key={em.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "8px 0",
                          borderBottom:
                            i < emailContacts.length - 1
                              ? `1px solid ${W.borderSubtle}`
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: W.r4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: W.accentLight,
                            color: W.accent,
                          }}
                        >
                          <Mail size={12} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span style={{ fontSize: "12px", fontWeight: 500 }}>
                              {em.email}
                            </span>
                            {em.isPrimary && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  padding: "1px 6px",
                                  borderRadius: "999px",
                                  background: W.accent + "20",
                                  color: W.accent,
                                }}
                              >
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "4px",
                            }}
                          >
                            <span
                              style={{ fontSize: "11px", color: W.textCaption }}
                            >
                              {em.type}
                            </span>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "1px 7px",
                                borderRadius: W.r4,
                                background: em.marketingConsent
                                  ? W.successBg
                                  : W.subtleBg,
                                color: em.marketingConsent
                                  ? W.success
                                  : W.textCaption,
                                border: `1px solid ${em.marketingConsent ? W.successBorder : W.borderDefault}`,
                              }}
                            >
                              {em.marketingConsent ? (
                                <CheckCircle size={10} />
                              ) : (
                                <XCircle size={10} />
                              )}
                              Marketing{" "}
                              {em.marketingConsent ? "Opt-in" : "Opt-out"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "7px",
                        marginTop: "10px",
                        padding: "8px 10px",
                        background: W.accentLight,
                        border: `1px solid ${W.accentLightBorder}`,
                        borderRadius: W.r4,
                      }}
                    >
                      <Shield
                        size={12}
                        style={{
                          color: W.accent,
                          marginTop: "1px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{ fontSize: "11px", color: W.textSecondary }}
                      >
                        <span style={{ fontWeight: 700, color: W.accent }}>
                          HIPAA Compliance:
                        </span>{" "}
                        SMS consent documented with audit trail. All
                        communications logged.
                      </span>
                    </div>
                  </SectionCard>
                  <SectionCard
                    title="Insurance Coverage"
                    icon={<Shield size={13} />}
                  >
                    {[insuranceData.primary, insuranceData.secondary].map(
                      (ins, i) => (
                        <div
                          key={i}
                          style={{ marginBottom: i === 0 ? "12px" : "0" }}
                        >
                          {i === 0 && (
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: W.textCaption,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: "7px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <Star size={10} style={{ color: W.caution }} />
                              Primary
                            </div>
                          )}
                          {i === 1 && (
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: W.textCaption,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: "7px",
                                marginTop: "12px",
                                paddingTop: "12px",
                                borderTop: `1px solid ${W.borderSubtle}`,
                              }}
                            >
                              Secondary
                            </div>
                          )}
                          <div
                            style={{
                              background: W.subtleBg,
                              border: `1px solid ${W.borderSubtle}`,
                              borderRadius: W.r4,
                              padding: "10px 12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                              }}
                            >
                              <span
                                style={{ fontSize: "13px", fontWeight: 600 }}
                              >
                                {ins.provider}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  borderRadius: W.r4,
                                  background: W.successBg,
                                  color: W.success,
                                  border: `1px solid ${W.successBorder}`,
                                }}
                              >
                                Active
                              </span>
                            </div>
                            <KVRow
                              label="Policy No."
                              value={ins.policyNo}
                              mono
                            />
                            <KVRow label="Coverage" value={ins.coverageType} />
                            <KVRow
                              label="Co-pay"
                              value={
                                <span
                                  style={{ fontWeight: 700, color: W.accent }}
                                >
                                  {ins.copay}
                                </span>
                              }
                            />
                            <KVRow
                              label="Valid Through"
                              value={ins.expiryDate}
                            />
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                marginTop: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {[
                                ["Drugs", ins.coversDrugs],
                                ["Lab Work", ins.coversLabWork],
                                ["Consult", ins.coversConsultation],
                              ].map(([l, c]) => (
                                <div
                                  key={l as string}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    fontSize: "11px",
                                    padding: "2px 8px",
                                    borderRadius: W.r4,
                                    background: c ? W.successBg : W.dangerBg,
                                    color: c ? W.success : W.danger,
                                    border: `1px solid ${c ? W.successBorder : W.dangerBorder}`,
                                  }}
                                >
                                  {c ? (
                                    <CheckCircle size={10} />
                                  ) : (
                                    <XCircle size={10} />
                                  )}
                                  {l as string}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </SectionCard>
                </div>
              </div>
            )}

            {/* ── FAMILY ── */}
            {activeTab === "family" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background: W.cardBg,
                    border: `1px solid ${W.borderSubtle}`,
                    borderRadius: W.r8,
                    overflow: "hidden",
                    boxShadow: W.shadowCard,
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${W.accent}14 0%, ${W.accent}05 100%)`,
                      borderBottom: `1px solid ${W.accentLightBorder}`,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: W.r8,
                          background: W.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Users size={22} color="#FFF" />
                      </div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "16px", fontWeight: 600 }}>
                            {familyGroup.groupName}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: W.textCaption,
                              fontFamily: "'Courier New',monospace",
                            }}
                          >
                            #{familyGroup.groupId}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            marginTop: "4px",
                          }}
                        >
                          <MapPin size={11} style={{ color: W.textCaption }} />
                          <span
                            style={{ fontSize: "12px", color: W.textSecondary }}
                          >
                            {familyGroup.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <WinButton variant="default" size="sm">
                        <UserPlus size={11} /> Add Member
                      </WinButton>
                      <WinButton variant="ghost" size="sm">
                        <Edit size={11} />
                      </WinButton>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: "0",
                    }}
                  >
                    {[
                      {
                        label: "Shared Insurance",
                        value: familyGroup.sharedInsurance,
                        icon: <Shield size={12} />,
                      },
                      {
                        label: "Payment Method",
                        value: familyGroup.paymentMethod,
                        icon: <CreditCard size={12} />,
                      },
                      {
                        label: "Primary Contact",
                        value: familyGroup.primaryContact,
                        icon: <User size={12} />,
                      },
                    ].map(({ label, value, icon }, i) => (
                      <div
                        key={label}
                        style={{
                          padding: "10px 16px",
                          borderRight:
                            i < 2 ? `1px solid ${W.borderSubtle}` : "none",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: W.textCaption,
                            marginTop: "1px",
                            flexShrink: 0,
                          }}
                        >
                          {icon}
                        </span>
                        <div>
                          <div
                            style={{ fontSize: "11px", color: W.textCaption }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: W.textPrimary,
                              marginTop: "2px",
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <SectionCard
                  title={`Family Members (${familyGroup.members.length})`}
                  icon={<Users size={13} />}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2,1fr)",
                      gap: "10px",
                    }}
                  >
                    {familyGroup.members.map((m, i) => (
                      <div
                        key={i}
                        style={{
                          border: `1px solid ${m.isCurrentPatient ? W.accentLightBorder : W.borderSubtle}`,
                          borderRadius: W.r6,
                          padding: "12px",
                          background: m.isCurrentPatient
                            ? W.accentLight
                            : W.subtleBg,
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        {m.isCurrentPatient && (
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "1px 7px",
                              borderRadius: "999px",
                              background: W.accent,
                              color: "#FFF",
                            }}
                          >
                            Viewing
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "9px",
                          }}
                        >
                          <CAvatar
                            initials={m.initials}
                            color={m.color}
                            size={36}
                            status={m.status}
                          />
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>
                              {m.name}
                            </div>
                            <div
                              style={{ fontSize: "11px", color: W.textCaption }}
                            >
                              {m.relation} · {m.age}y
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4px",
                          }}
                        >
                          {[
                            [
                              "Active Rx",
                              m.activeRx > 0
                                ? `${m.activeRx} prescriptions`
                                : "None",
                              m.activeRx > 0 ? W.accent : W.textCaption,
                            ],
                            ["Last Visit", m.lastVisit, W.textPrimary],
                            [
                              "Allergies",
                              m.allergies.length > 0
                                ? m.allergies.join(", ")
                                : "None",
                              m.allergies.length > 0 ? W.danger : W.textCaption,
                            ],
                          ].map(([l, v, c]) => (
                            <>
                              <div
                                key={`${l}-l`}
                                style={{
                                  fontSize: "11px",
                                  color: W.textCaption,
                                }}
                              >
                                {l as string}
                              </div>
                              <div
                                key={`${l}-v`}
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  color: c as string,
                                  textAlign: "right",
                                }}
                              >
                                {v as string}
                              </div>
                            </>
                          ))}
                        </div>
                        {!m.isCurrentPatient && (
                          <div
                            style={{
                              marginTop: "9px",
                              paddingTop: "9px",
                              borderTop: `1px solid ${W.borderSubtle}`,
                              display: "flex",
                              gap: "5px",
                            }}
                          >
                            <WinButton variant="ghost" size="sm">
                              <ExternalLink size={11} /> Open
                            </WinButton>
                            <WinButton variant="ghost" size="sm">
                              <Pill size={11} /> Rx
                            </WinButton>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── HISTORY ── */}
            {activeTab === "history" && (
              <div
                style={{
                  background: W.cardBg,
                  border: `1px solid ${W.borderSubtle}`,
                  borderRadius: W.r8,
                  overflow: "hidden",
                  boxShadow: W.shadowCard,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    borderBottom: `1px solid ${W.borderSubtle}`,
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    Transaction History
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <WinButton variant="ghost" size="sm">
                      <Filter size={11} /> Filter
                    </WinButton>
                    <WinButton variant="ghost" size="sm">
                      <Download size={11} /> Export
                    </WinButton>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "130px 100px 1fr 110px 24px",
                    gap: "8px",
                    padding: "5px 14px",
                    background: W.subtleBg,
                    borderBottom: `1px solid ${W.borderSubtle}`,
                  }}
                >
                  {["Date", "Type", "Items", "Amount", ""].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: W.textCaption,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {historyData.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 100px 1fr 110px 24px",
                      gap: "8px",
                      alignItems: "center",
                      padding: "9px 14px",
                      borderBottom:
                        i < historyData.length - 1
                          ? `1px solid ${W.borderSubtle}`
                          : "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        W.hoverFill)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "")
                    }
                  >
                    <span style={{ fontSize: "12px", color: W.textSecondary }}>
                      {item.date}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "1px 8px",
                        borderRadius: W.r4,
                        width: "fit-content",
                        background:
                          item.type === "Sale"
                            ? W.accentLight
                            : item.type === "Return"
                              ? W.dangerBg
                              : W.successBg,
                        color:
                          item.type === "Sale"
                            ? W.accent
                            : item.type === "Return"
                              ? W.danger
                              : W.success,
                        border: `1px solid ${item.type === "Sale" ? W.accentLightBorder : item.type === "Return" ? W.dangerBorder : W.successBorder}`,
                      }}
                    >
                      {item.type}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.items}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: item.amount < 0 ? W.danger : W.textPrimary,
                      }}
                    >
                      {item.amount === 0
                        ? "—"
                        : (item.amount < 0 ? "−" : "+") +
                          `EGP ${Math.abs(item.amount)}`}
                    </span>
                    <ChevronRight size={12} style={{ color: W.textCaption }} />
                  </div>
                ))}
              </div>
            )}

            {/* ── NOTES ── */}
            {activeTab === "notes" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background: W.cardBg,
                    border: `1px solid ${W.borderSubtle}`,
                    borderRadius: W.r8,
                    padding: "11px 14px",
                    boxShadow: W.shadowCard,
                  }}
                >
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a clinical note, observation, or follow-up reminder…"
                    style={{
                      width: "100%",
                      height: "68px",
                      fontSize: "13px",
                      fontFamily: ff,
                      background: W.subtleBg,
                      border: `1px solid ${W.borderDefault}`,
                      borderRadius: W.r4,
                      padding: "8px 10px",
                      color: W.textPrimary,
                      resize: "none",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor =
                        W.accent;
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor =
                        W.borderDefault;
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "7px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "4px" }}>
                      <WinButton variant="ghost" size="sm">
                        <Paperclip size={11} /> Attach
                      </WinButton>
                      <WinButton variant="ghost" size="sm">
                        <Bell size={11} /> Remind
                      </WinButton>
                    </div>
                    <WinButton
                      variant="accent"
                      size="sm"
                      disabled={!newNote.trim()}
                    >
                      Save Note
                    </WinButton>
                  </div>
                </div>
                {notes.map((note, i) => (
                  <div
                    key={i}
                    style={{
                      background: W.cardBg,
                      border: `1px solid ${W.borderSubtle}`,
                      borderRadius: W.r8,
                      overflow: "hidden",
                      boxShadow: W.shadowCard,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "7px 14px",
                        borderBottom: `1px solid ${W.borderSubtle}`,
                        background: W.subtleBg,
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: W.r4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            note.type === "note"
                              ? W.accentLight
                              : note.type === "followup"
                                ? W.warningBg
                                : W.dangerBg,
                          color:
                            note.type === "note"
                              ? W.accent
                              : note.type === "followup"
                                ? W.caution
                                : W.danger,
                        }}
                      >
                        {note.type === "note" ? (
                          <MessageSquare size={11} />
                        ) : note.type === "followup" ? (
                          <Bell size={11} />
                        ) : (
                          <AlertTriangle size={11} />
                        )}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>
                        {note.author}
                      </span>
                      <span style={{ fontSize: "11px", color: W.textCaption }}>
                        {note.date} at {note.time}
                      </span>
                      <div style={{ flex: 1 }} />
                      <WinButton variant="ghost" size="sm">
                        <MoreHorizontal size={11} />
                      </WinButton>
                    </div>
                    <div
                      style={{
                        padding: "11px 14px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      {note.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── FINANCIALS ── */}
            {activeTab === "financials" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Loyalty section */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${tierC.color}18 0%, ${tierC.color}06 100%)`,
                    border: `1px solid ${tierC.border}`,
                    borderRadius: W.r8,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: W.shadowCard,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: W.r6,
                        background: tierC.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Award size={20} color="#FFF" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: tierC.color,
                        }}
                      >
                        {tier} Loyalty Member
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: W.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        {tierC.points.toLocaleString()} points accumulated ·{" "}
                        {tierC.nextAt - tierC.points} pts to next tier
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <WinButton variant="default" size="sm">
                      <Award size={11} /> Redeem Points
                    </WinButton>
                    <WinButton variant="ghost" size="sm">
                      <Download size={11} /> History
                    </WinButton>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "10px",
                  }}
                >
                  {[
                    {
                      label: "Current Balance",
                      value:
                        selectedCustomer.balance === 0
                          ? "EGP 0"
                          : `${selectedCustomer.balance < 0 ? "−" : "+"}EGP ${Math.abs(selectedCustomer.balance)}`,
                      sub:
                        selectedCustomer.balance < 0
                          ? "Owes pharmacy"
                          : "No debt",
                      color:
                        selectedCustomer.balance < 0 ? W.danger : W.success,
                      icon: <CreditCard size={15} />,
                    },
                    {
                      label: "Total Spent",
                      value: `EGP ${selectedCustomer.totalSpent.toLocaleString()}`,
                      sub: "All time",
                      color: W.textPrimary,
                      icon: <TrendingUp size={15} />,
                    },
                    {
                      label: "Insurance Claims",
                      value: "EGP 3,200",
                      sub: "Covered this year",
                      color: W.accent,
                      icon: <Shield size={15} />,
                    },
                  ].map(({ label, value, sub, color, icon }) => (
                    <div
                      key={label}
                      style={{
                        background: W.cardBg,
                        border: `1px solid ${W.borderSubtle}`,
                        borderRadius: W.r8,
                        padding: "14px",
                        boxShadow: W.shadowCard,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "10px",
                          color: W.textSecondary,
                        }}
                      >
                        {icon}
                        <span style={{ fontSize: "11px" }}>{label}</span>
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 700, color }}>
                        {value}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: W.textCaption,
                          marginTop: "3px",
                        }}
                      >
                        {sub}
                      </div>
                    </div>
                  ))}
                </div>
                <SectionCard
                  title="Payment Log"
                  action={
                    <WinButton variant="accent" size="sm">
                      <Plus size={11} /> Collect Payment
                    </WinButton>
                  }
                >
                  {[
                    {
                      date: "Mar 25, 2026",
                      method: "Cash",
                      amount: 145,
                      type: "payment",
                    },
                    {
                      date: "Mar 10, 2026",
                      method: "Visa Card",
                      amount: 289,
                      type: "payment",
                    },
                    {
                      date: "Mar 1, 2026",
                      method: "Insurance",
                      amount: 420,
                      type: "insurance",
                    },
                    {
                      date: "Feb 15, 2026",
                      method: "Cash",
                      amount: 200,
                      type: "credit",
                    },
                  ].map((p, i, arr) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 0",
                        borderBottom:
                          i < arr.length - 1
                            ? `1px solid ${W.borderSubtle}`
                            : "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          W.hoverFill)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "")
                      }
                    >
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: W.r4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            p.type === "insurance"
                              ? W.accentLight
                              : p.type === "credit"
                                ? W.successBg
                                : W.subtleBg,
                          color:
                            p.type === "insurance"
                              ? W.accent
                              : p.type === "credit"
                                ? W.success
                                : W.textSecondary,
                        }}
                      >
                        <DollarSign size={12} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px" }}>{p.method}</div>
                        <div style={{ fontSize: "11px", color: W.textCaption }}>
                          {p.date}
                        </div>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        EGP {p.amount}
                      </span>
                    </div>
                  ))}
                </SectionCard>
              </div>
            )}
          </div>
        </div>

        {/* ════════════ RIGHT CONTEXT PANEL ════════════ */}
        <div
          style={{
            width: "205px",
            flexShrink: 0,
            background: W.surfaceBg,
            borderLeft: `1px solid ${W.borderSubtle}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "9px 12px 7px",
              borderBottom: `1px solid ${W.borderSubtle}`,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Zap size={12} style={{ color: W.accent }} />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: W.textCaption,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Context Panel
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {activeTab === "overview" && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Alerts
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginBottom: "12px",
                  }}
                >
                  {selectedCustomer.allergies.map((a) => (
                    <InfoBar key={a} type="error" title="Allergy" message={a} />
                  ))}
                  {selectedCustomer.conditions.map((c) => (
                    <InfoBar
                      key={c}
                      type="warning"
                      title="Condition"
                      message={c}
                    />
                  ))}
                  {selectedCustomer.allergies.length === 0 &&
                    selectedCustomer.conditions.length === 0 && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: W.textCaption,
                          fontStyle: "italic",
                        }}
                      >
                        No alerts on file
                      </span>
                    )}
                </div>
                <div
                  style={{
                    height: "1px",
                    background: W.borderSubtle,
                    margin: "0 0 10px",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Quick Stats
                </div>
                {[
                  ["Visits/year", "12"],
                  ["Avg. order", "EGP 245"],
                  ["Overall PDC", `${analyticsData.overallPDC}%`],
                  ["Tier", selectedCustomer.tier],
                  ["Risk", selectedCustomer.riskLevel],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: `1px solid ${W.borderSubtle}`,
                    }}
                  >
                    <span style={{ fontSize: "11px", color: W.textSecondary }}>
                      {l}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 600 }}>
                      {v}
                    </span>
                  </div>
                ))}
              </>
            )}

            {activeTab === "medications" && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Interaction Summary
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    marginBottom: "12px",
                  }}
                >
                  {visibleInteractions.length === 0 ? (
                    <InfoBar type="success" title="No active alerts" />
                  ) : (
                    visibleInteractions.map((i) => (
                      <InfoBar
                        key={i.id}
                        type={i.severity === "moderate" ? "warning" : "info"}
                        title={`${i.severity.toUpperCase()}`}
                        message={`${i.drug1} ↔ ${i.drug2}`}
                      />
                    ))
                  )}
                  {!allergyDismissed &&
                    allergyContraindications.map((ac) => (
                      <InfoBar
                        key={ac.drug}
                        type="error"
                        title="Contraindication"
                        message={ac.drug}
                      />
                    ))}
                </div>
                <div
                  style={{
                    height: "1px",
                    background: W.borderSubtle,
                    margin: "0 0 10px",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Adherence Summary
                </div>
                {adherenceData.map((a) => (
                  <div
                    key={a.drug}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: `1px solid ${W.borderSubtle}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: W.textSecondary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "110px",
                      }}
                    >
                      {a.drug}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color:
                          a.pdc >= 0.8
                            ? W.success
                            : a.pdc >= 0.65
                              ? W.caution
                              : W.danger,
                      }}
                    >
                      {Math.round(a.pdc * 100)}%
                    </span>
                  </div>
                ))}
              </>
            )}

            {activeTab === "analytics" && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Risk Summary
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 9px",
                      background: riskC.bg,
                      border: `1px solid ${riskC.border}`,
                      borderRadius: W.r4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: riskC.color,
                      }}
                    >
                      {selectedCustomer.riskLevel} Risk
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: riskC.color,
                      }}
                    >
                      {selectedCustomer.riskScore}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Care Gaps
                </div>
                {analyticsData.careGaps.map((g) => (
                  <div
                    key={g.gap}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "5px",
                      padding: "4px 0",
                      borderBottom: `1px solid ${W.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background:
                          g.priority === "high"
                            ? W.danger
                            : g.priority === "medium"
                              ? W.caution
                              : W.textCaption,
                        flexShrink: 0,
                        marginTop: "4px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: W.textPrimary,
                        lineHeight: "1.4",
                      }}
                    >
                      {g.gap}
                    </span>
                  </div>
                ))}
              </>
            )}

            {activeTab === "outreach" && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Upcoming ({outreachData.upcoming.length})
                </div>
                {outreachData.upcoming.slice(0, 3).map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "5px 0",
                      borderBottom: `1px solid ${W.borderSubtle}`,
                      fontSize: "11px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        color: W.textPrimary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.content}
                    </div>
                    <div style={{ color: W.textCaption, marginTop: "1px" }}>
                      {r.channel} · {r.scheduledFor}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "10px" }} />
                <WinButton variant="accent" size="sm">
                  <Send size={11} /> Send All
                </WinButton>
              </>
            )}

            {activeTab === "financials" && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Loyalty
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginBottom: "12px",
                  }}
                >
                  {[
                    ["Tier", selectedCustomer.tier],
                    ["Points", tierC.points.toLocaleString()],
                    ["To Next Tier", `${tierC.nextAt - tierC.points} pts`],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 0",
                        borderBottom: `1px solid ${W.borderSubtle}`,
                      }}
                    >
                      <span
                        style={{ fontSize: "11px", color: W.textSecondary }}
                      >
                        {l}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 600 }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    height: "1px",
                    background: W.borderSubtle,
                    margin: "0 0 10px",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Actions
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <WinButton variant="accent" size="sm">
                    <DollarSign size={11} /> Collect
                  </WinButton>
                  <WinButton variant="default" size="sm">
                    <FileText size={11} /> Invoice
                  </WinButton>
                  <WinButton variant="ghost" size="sm">
                    <Download size={11} /> Statement
                  </WinButton>
                </div>
              </>
            )}

            {(activeTab === "profile" ||
              activeTab === "family" ||
              activeTab === "history" ||
              activeTab === "notes") && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Quick Actions
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <WinButton variant="accent" size="sm">
                    <ShoppingCart size={11} /> New Sale
                  </WinButton>
                  <WinButton variant="default" size="sm">
                    <Pill size={11} /> Add Rx
                  </WinButton>
                  <WinButton variant="ghost" size="sm">
                    <MessageSquare size={11} /> Message
                  </WinButton>
                  <WinButton variant="ghost" size="sm">
                    <Bell size={11} /> Set Reminder
                  </WinButton>
                </div>
                <div
                  style={{
                    height: "1px",
                    background: W.borderSubtle,
                    margin: "12px 0",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "7px",
                  }}
                >
                  Alerts
                </div>
                {selectedCustomer.allergies.map((a) => (
                  <div style={{ marginBottom: "4px" }} key={a}>
                    <InfoBar type="error" title="Allergy" message={a} />
                  </div>
                ))}
                {selectedCustomer.conditions.map((c) => (
                  <div style={{ marginBottom: "4px" }} key={c}>
                    <InfoBar type="warning" title="Condition" message={c} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div
        style={{
          height: "24px",
          background: W.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Wifi size={10} /> Online · Synced just now
          </span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
            Ctrl+K: Search · Ctrl+N: New · Filter presets: Chronic / High Risk /
            Non-Adherent
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Bell size={10} /> 3 alerts
          </span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <User size={10} /> Dr. Rania · Pharmacy Manager
          </span>
        </div>
      </div>
    </div>
  );
}
