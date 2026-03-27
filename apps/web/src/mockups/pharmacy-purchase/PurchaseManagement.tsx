import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit2,
  Eye,
  FileText,
  Filter,
  Layers,
  Minus,
  MoreHorizontal,
  Package,
  Pill,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Trash2,
  Truck,
  X,
  XCircle
} from "lucide-react";
import { type CSSProperties, useState } from "react";

/* ─── Windows 11 Fluent Design Tokens ───────────────────────────────────*/
const W = {
  appBg: "#F3F3F3",
  navBg: "rgba(238,238,238,0.95)",
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
  borderSubtle: "rgba(0,0,0,0.06)",
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
  cautionBorder: "#F8E0A0",
  r4: "4px",
  r6: "6px",
  r8: "8px",
  shadowCard: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07)",
  shadowElevated: "0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
};

/* ─── Types ──────────────────────────────────────────────────────────────*/
type PaymentStatus = "paid" | "partial" | "pending" | "overdue";
type OrderStatus = "draft" | "pending" | "received" | "paid" | "cancelled";
type MainTab = "orders" | "create" | "invoices" | "analytics";
type StatusTab = "all" | OrderStatus | "overdue";
type DetailTab = "items" | "payments" | "history";

interface Supplier {
  id: string;
  name: string;
  code: string;
  initials: string;
  color: string;
  contact: string;
  phone: string;
  email: string;
  terms: string;
  license: string;
  rating: number;
  pendingOrders: number;
  totalPayable: number;
  lastOrder: string;
}
interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier: string;
  date: string;
  expectedDelivery: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  balance: number;
  invoiceRef: string;
  itemCount: number;
  terms: string;
  notes: string;
}
interface LineItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  unit: string;
  unitCost: number;
  total: number;
  receivedQty: number;
  expiry: string;
  lot: string;
  currentStock: number;
  pendingStock: number;
}
interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  ref: string;
}
interface HistoryEvent {
  date: string;
  time: string;
  event: string;
  user: string;
  type:
    | "create"
    | "submit"
    | "approve"
    | "receive"
    | "payment"
    | "note"
    | "cancel";
}
interface NewOrderItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  unitCost: number;
  currentStock: number;
}
interface InvoiceRow {
  id: string;
  invoiceRef: string;
  poNumber: string;
  supplier: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  paid: number;
  balance: number;
  paymentStatus: PaymentStatus;
  supplierId: string;
}

/* ─── Sample Data ────────────────────────────────────────────────────────*/
const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "MedSupply Corp",
    code: "MSC-001",
    initials: "MS",
    color: "#0078D4",
    contact: "Sarah Johnson",
    phone: "+1 (555) 248-8100",
    email: "orders@medsupply.com",
    terms: "Net 30",
    license: "DEA-F2891023",
    rating: 4.2,
    pendingOrders: 3,
    totalPayable: 19013.4,
    lastOrder: "Mar 25",
  },
  {
    id: "s2",
    name: "PharmaDist LLC",
    code: "PDL-004",
    initials: "PD",
    color: "#107C10",
    contact: "Mark Williams",
    phone: "+1 (555) 391-2200",
    email: "purchase@pharmadist.com",
    terms: "Net 45",
    license: "DEA-G3921045",
    rating: 3.8,
    pendingOrders: 1,
    totalPayable: 9318.4,
    lastOrder: "Mar 22",
  },
  {
    id: "s3",
    name: "BioPharm Supplies",
    code: "BPS-002",
    initials: "BP",
    color: "#C42B1C",
    contact: "Amanda Torres",
    phone: "+1 (555) 774-5500",
    email: "billing@biopharm.com",
    terms: "Net 30",
    license: "DEA-H4812034",
    rating: 4.6,
    pendingOrders: 1,
    totalPayable: 6160.0,
    lastOrder: "Mar 20",
  },
  {
    id: "s4",
    name: "NovaMed Distributors",
    code: "NMD-009",
    initials: "NM",
    color: "#8764B8",
    contact: "Robert Chen",
    phone: "+1 (555) 512-9900",
    email: "orders@novamed.com",
    terms: "Net 60",
    license: "DEA-J5723019",
    rating: 4.0,
    pendingOrders: 1,
    totalPayable: 24310.0,
    lastOrder: "Mar 18",
  },
  {
    id: "s5",
    name: "GlobalRx Partners",
    code: "GRP-007",
    initials: "GR",
    color: "#835400",
    contact: "Lisa Park",
    phone: "+1 (555) 663-4400",
    email: "supply@globalrx.com",
    terms: "COD",
    license: "DEA-K6614028",
    rating: 4.5,
    pendingOrders: 0,
    totalPayable: 0,
    lastOrder: "Mar 15",
  },
];

const allOrders: PurchaseOrder[] = [
  {
    id: "o1",
    poNumber: "PO-2026-0341",
    supplierId: "s1",
    supplier: "MedSupply Corp",
    date: "Mar 25, 2026",
    expectedDelivery: "Apr 10, 2026",
    status: "received",
    paymentStatus: "partial",
    subtotal: 12450.0,
    tax: 1494.0,
    discount: 249.0,
    total: 13695.0,
    paid: 8000.0,
    balance: 5695.0,
    invoiceRef: "INV-88291",
    itemCount: 14,
    terms: "Net 30",
    notes: "Priority order — restock antibiotics.",
  },
  {
    id: "o2",
    poNumber: "PO-2026-0340",
    supplierId: "s2",
    supplier: "PharmaDist LLC",
    date: "Mar 22, 2026",
    expectedDelivery: "Apr 05, 2026",
    status: "pending",
    paymentStatus: "pending",
    subtotal: 8320.0,
    tax: 998.4,
    discount: 0,
    total: 9318.4,
    paid: 0,
    balance: 9318.4,
    invoiceRef: "INV-88104",
    itemCount: 8,
    terms: "Net 45",
    notes: "",
  },
  {
    id: "o3",
    poNumber: "PO-2026-0339",
    supplierId: "s3",
    supplier: "BioPharm Supplies",
    date: "Mar 20, 2026",
    expectedDelivery: "Mar 31, 2026",
    status: "received",
    paymentStatus: "overdue",
    subtotal: 5600.0,
    tax: 672.0,
    discount: 112.0,
    total: 6160.0,
    paid: 0,
    balance: 6160.0,
    invoiceRef: "INV-87944",
    itemCount: 6,
    terms: "Net 30",
    notes: "Partial delivery — item BPS-Lot-8 missing.",
  },
  {
    id: "o4",
    poNumber: "PO-2026-0338",
    supplierId: "s4",
    supplier: "NovaMed Distributors",
    date: "Mar 18, 2026",
    expectedDelivery: "Apr 18, 2026",
    status: "pending",
    paymentStatus: "pending",
    subtotal: 22100.0,
    tax: 2652.0,
    discount: 442.0,
    total: 24310.0,
    paid: 0,
    balance: 24310.0,
    invoiceRef: "",
    itemCount: 21,
    terms: "Net 60",
    notes: "",
  },
  {
    id: "o5",
    poNumber: "PO-2026-0337",
    supplierId: "s5",
    supplier: "GlobalRx Partners",
    date: "Mar 15, 2026",
    expectedDelivery: "Mar 28, 2026",
    status: "paid",
    paymentStatus: "paid",
    subtotal: 3200.0,
    tax: 384.0,
    discount: 0,
    total: 3584.0,
    paid: 3584.0,
    balance: 0,
    invoiceRef: "INV-87801",
    itemCount: 5,
    terms: "COD",
    notes: "",
  },
  {
    id: "o6",
    poNumber: "PO-2026-0336",
    supplierId: "s1",
    supplier: "MedSupply Corp",
    date: "Mar 12, 2026",
    expectedDelivery: "Mar 26, 2026",
    status: "cancelled",
    paymentStatus: "paid",
    subtotal: 1800.0,
    tax: 0,
    discount: 0,
    total: 1800.0,
    paid: 1800.0,
    balance: 0,
    invoiceRef: "INV-87650",
    itemCount: 3,
    terms: "Net 30",
    notes: "Cancelled — item discontinued.",
  },
  {
    id: "o7",
    poNumber: "PO-2026-0335",
    supplierId: "s1",
    supplier: "MedSupply Corp",
    date: "Mar 10, 2026",
    expectedDelivery: "Mar 24, 2026",
    status: "draft",
    paymentStatus: "pending",
    subtotal: 4200.0,
    tax: 504.0,
    discount: 0,
    total: 4704.0,
    paid: 0,
    balance: 4704.0,
    invoiceRef: "",
    itemCount: 7,
    terms: "Net 30",
    notes: "",
  },
];

const lineItems: LineItem[] = [
  {
    id: "i1",
    name: "Amoxicillin 500mg Capsules",
    sku: "AMX-500-100",
    category: "Antibiotics",
    qty: 200,
    unit: "Box",
    unitCost: 12.5,
    total: 2500.0,
    receivedQty: 200,
    expiry: "2028-06",
    lot: "L2024A01",
    currentStock: 240,
    pendingStock: 180,
  },
  {
    id: "i2",
    name: "Metformin HCl 850mg Tablets",
    sku: "MET-850-500",
    category: "Antidiabetics",
    qty: 50,
    unit: "Pack",
    unitCost: 28.0,
    total: 1400.0,
    receivedQty: 50,
    expiry: "2027-12",
    lot: "L2024B22",
    currentStock: 120,
    pendingStock: 0,
  },
  {
    id: "i3",
    name: "Omeprazole 20mg Capsules",
    sku: "OMP-020-030",
    category: "Antacids",
    qty: 300,
    unit: "Strip",
    unitCost: 4.15,
    total: 1245.0,
    receivedQty: 280,
    expiry: "2027-08",
    lot: "L2024C09",
    currentStock: 80,
    pendingStock: 60,
  },
  {
    id: "i4",
    name: "Atorvastatin 40mg Tablets",
    sku: "ATV-040-030",
    category: "Statins",
    qty: 100,
    unit: "Pack",
    unitCost: 22.8,
    total: 2280.0,
    receivedQty: 100,
    expiry: "2028-03",
    lot: "L2024D15",
    currentStock: 45,
    pendingStock: 0,
  },
  {
    id: "i5",
    name: "Lisinopril 10mg Tablets",
    sku: "LSN-010-028",
    category: "ACE Inhibitors",
    qty: 80,
    unit: "Pack",
    unitCost: 18.4,
    total: 1472.0,
    receivedQty: 80,
    expiry: "2027-11",
    lot: "L2024E07",
    currentStock: 200,
    pendingStock: 0,
  },
];

const payments: PaymentRecord[] = [
  {
    id: "p1",
    date: "Mar 27, 2026",
    amount: 8000.0,
    method: "Bank Transfer",
    ref: "TXN-99281A",
  },
];

const history: HistoryEvent[] = [
  {
    date: "Mar 27",
    time: "10:30 AM",
    event: "Partial payment of $8,000.00 recorded",
    user: "R. Martinez",
    type: "payment",
  },
  {
    date: "Mar 26",
    time: "3:45 PM",
    event: "Invoice INV-88291 attached",
    user: "System",
    type: "note",
  },
  {
    date: "Mar 25",
    time: "2:15 PM",
    event: "Order received — 14/14 items verified",
    user: "A. Chen",
    type: "receive",
  },
  {
    date: "Mar 23",
    time: "9:00 AM",
    event: "Order approved by Pharmacy Director",
    user: "Dr. Walsh",
    type: "approve",
  },
  {
    date: "Mar 21",
    time: "4:30 PM",
    event: "Purchase order submitted",
    user: "R. Martinez",
    type: "submit",
  },
  {
    date: "Mar 20",
    time: "11:00 AM",
    event: "Draft purchase order created",
    user: "R. Martinez",
    type: "create",
  },
];

const catalogProducts: NewOrderItem[] = [
  {
    id: "c1",
    name: "Amoxicillin 500mg Capsules",
    sku: "AMX-500-100",
    qty: 0,
    unitCost: 12.5,
    currentStock: 240,
  },
  {
    id: "c2",
    name: "Metformin HCl 850mg Tablets",
    sku: "MET-850-500",
    qty: 0,
    unitCost: 28.0,
    currentStock: 120,
  },
  {
    id: "c3",
    name: "Omeprazole 20mg Capsules",
    sku: "OMP-020-030",
    qty: 0,
    unitCost: 4.15,
    currentStock: 80,
  },
  {
    id: "c4",
    name: "Atorvastatin 40mg Tablets",
    sku: "ATV-040-030",
    qty: 0,
    unitCost: 22.8,
    currentStock: 45,
  },
  {
    id: "c5",
    name: "Lisinopril 10mg Tablets",
    sku: "LSN-010-028",
    qty: 0,
    unitCost: 18.4,
    currentStock: 200,
  },
  {
    id: "c6",
    name: "Paracetamol 500mg Tablets",
    sku: "PAR-500-100",
    qty: 0,
    unitCost: 3.2,
    currentStock: 310,
  },
  {
    id: "c7",
    name: "Ibuprofen 400mg Tablets",
    sku: "IBU-400-030",
    qty: 0,
    unitCost: 5.8,
    currentStock: 160,
  },
];

const invoices: InvoiceRow[] = [
  {
    id: "inv1",
    invoiceRef: "INV-88291",
    poNumber: "PO-2026-0341",
    supplier: "MedSupply Corp",
    supplierId: "s1",
    invoiceDate: "Mar 26, 2026",
    dueDate: "Apr 25, 2026",
    total: 13695.0,
    paid: 8000.0,
    balance: 5695.0,
    paymentStatus: "partial",
  },
  {
    id: "inv2",
    invoiceRef: "INV-88104",
    poNumber: "PO-2026-0340",
    supplier: "PharmaDist LLC",
    supplierId: "s2",
    invoiceDate: "Mar 22, 2026",
    dueDate: "May 06, 2026",
    total: 9318.4,
    paid: 0,
    balance: 9318.4,
    paymentStatus: "pending",
  },
  {
    id: "inv3",
    invoiceRef: "INV-87944",
    poNumber: "PO-2026-0339",
    supplier: "BioPharm Supplies",
    supplierId: "s3",
    invoiceDate: "Mar 21, 2026",
    dueDate: "Mar 31, 2026",
    total: 6160.0,
    paid: 0,
    balance: 6160.0,
    paymentStatus: "overdue",
  },
  {
    id: "inv4",
    invoiceRef: "INV-87801",
    poNumber: "PO-2026-0337",
    supplier: "GlobalRx Partners",
    supplierId: "s5",
    invoiceDate: "Mar 15, 2026",
    dueDate: "Mar 15, 2026",
    total: 3584.0,
    paid: 3584.0,
    balance: 0,
    paymentStatus: "paid",
  },
  {
    id: "inv5",
    invoiceRef: "INV-87650",
    poNumber: "PO-2026-0336",
    supplier: "MedSupply Corp",
    supplierId: "s1",
    invoiceDate: "Mar 12, 2026",
    dueDate: "Apr 11, 2026",
    total: 1800.0,
    paid: 1800.0,
    balance: 0,
    paymentStatus: "paid",
  },
];

const monthlySpend = [28400, 31200, 24800, 35600, 42100, 58557];
const monthLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const categoryData = [
  { label: "Antibiotics", value: 22400, color: "#0078D4", pct: 38 },
  { label: "Antidiabetics", value: 14200, color: "#107C10", pct: 24 },
  { label: "Antacids", value: 8900, color: "#8764B8", pct: 15 },
  { label: "Statins", value: 7100, color: "#835400", pct: 12 },
  { label: "Other", value: 5957, color: "#767676", pct: 11 },
];
const supplierVol = [
  { name: "NovaMed", value: 24310, color: "#8764B8" },
  { name: "MedSupply", value: 19195, color: "#0078D4" },
  { name: "PharmaDist", value: 9318, color: "#107C10" },
  { name: "BioPharm", value: 6160, color: "#C42B1C" },
  { name: "GlobalRx", value: 3584, color: "#835400" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────*/
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtK = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${fmt(n)}`;
const supplierColorMap: Record<string, string> = Object.fromEntries(
  suppliers.map((s) => [s.id, s.color]),
);

/* ─── Badge / Tag ────────────────────────────────────────────────────────*/
const orderStatusCfg: Record<
  OrderStatus,
  {
    label: string;
    bg: string;
    color: string;
    border: string;
    icon: React.ReactNode;
  }
> = {
  draft: {
    label: "Draft",
    bg: W.subtleBg,
    color: W.textCaption,
    border: W.borderDefault,
    icon: <Edit2 size={10} />,
  },
  pending: {
    label: "Pending",
    bg: W.cautionBg,
    color: W.caution,
    border: W.cautionBorder,
    icon: <Clock size={10} />,
  },
  received: {
    label: "Received",
    bg: W.successBg,
    color: W.success,
    border: W.successBorder,
    icon: <Check size={10} />,
  },
  paid: {
    label: "Paid",
    bg: W.accentLight,
    color: W.accent,
    border: W.accentLightBorder,
    icon: <CheckCheck size={10} />,
  },
  cancelled: {
    label: "Cancelled",
    bg: W.dangerBg,
    color: W.danger,
    border: W.dangerBorder,
    icon: <Ban size={10} />,
  },
};
const payStatusCfg: Record<
  PaymentStatus,
  {
    label: string;
    bg: string;
    color: string;
    border: string;
    icon: React.ReactNode;
  }
> = {
  paid: {
    label: "Paid",
    bg: W.successBg,
    color: W.success,
    border: W.successBorder,
    icon: <CheckCircle2 size={10} />,
  },
  partial: {
    label: "Partial",
    bg: W.cautionBg,
    color: W.caution,
    border: W.cautionBorder,
    icon: <Minus size={10} />,
  },
  pending: {
    label: "Pending",
    bg: W.subtleBg,
    color: W.textCaption,
    border: W.borderDefault,
    icon: <Clock size={10} />,
  },
  overdue: {
    label: "Overdue",
    bg: W.dangerBg,
    color: W.danger,
    border: W.dangerBorder,
    icon: <XCircle size={10} />,
  },
};

function Tag({
  children,
  bg,
  color,
  border,
}: {
  children: React.ReactNode;
  bg: string;
  color: string;
  border: string;
}) {
  return (
    <span
      style={{
        background: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: W.r4,
        padding: "2px 7px",
        fontSize: 11,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </span>
  );
}
function OrderTag({ status }: { status: OrderStatus }) {
  const c = orderStatusCfg[status];
  return (
    <Tag bg={c.bg} color={c.color} border={c.border}>
      {c.icon}
      {c.label}
    </Tag>
  );
}
function PayTag({ status }: { status: PaymentStatus }) {
  const c = payStatusCfg[status];
  return (
    <Tag bg={c.bg} color={c.color} border={c.border}>
      {c.icon}
      {c.label}
    </Tag>
  );
}

/* ─── Modals ─────────────────────────────────────────────────────────────*/
function ReceivingModal({
  order,
  onClose,
}: {
  order: PurchaseOrder;
  onClose: () => void;
}) {
  const [qtys, setQtys] = useState<Record<string, number>>(
    Object.fromEntries(lineItems.map((i) => [i.id, i.qty])),
  );
  const [condition, setCondition] = useState(true);
  const [notes, setNotes] = useState("");
  const [trackBatch, setTrackBatch] = useState(false);
  const hasDisc = lineItems.some((i) => qtys[i.id] !== i.qty);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowElevated,
          width: 560,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: `1px solid ${W.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{ fontSize: 14, fontWeight: 600, color: W.textPrimary }}
            >
              Receive Order {order.poNumber}
            </div>
            <div style={{ fontSize: 12, color: W.textCaption, marginTop: 2 }}>
              {order.supplier} · {order.date}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: W.textSecondary,
              borderRadius: W.r4,
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ overflow: "auto", flex: 1, padding: "16px 20px" }}>
          {hasDisc && (
            <div
              style={{
                background: W.warningBg,
                border: `1px solid ${W.warningBorder}`,
                borderRadius: W.r6,
                padding: "10px 12px",
                marginBottom: 12,
                display: "flex",
                gap: 8,
              }}
            >
              <AlertTriangle
                size={14}
                style={{ color: W.warning, flexShrink: 0, marginTop: 1 }}
              />
              <span style={{ fontSize: 12, color: W.warning }}>
                Quantity discrepancy detected. A supplier note will be created.
              </span>
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: W.textCaption,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Verify Quantities
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${W.borderSubtle}` }}>
                {["Product", "Ordered", "Received", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign:
                        h === "Received" || h === "Ordered" ? "center" : "left",
                      padding: "6px 8px",
                      color: W.textCaption,
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => {
                const rcv = qtys[item.id];
                const ok = rcv === item.qty;
                return (
                  <tr
                    key={item.id}
                    style={{ borderBottom: `1px solid ${W.borderSubtle}` }}
                  >
                    <td style={{ padding: 8 }}>
                      <div style={{ fontWeight: 500, color: W.textPrimary }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: W.textCaption }}>
                        {item.sku}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: W.textSecondary,
                      }}
                    >
                      {item.qty} {item.unit}
                    </td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      <input
                        type="number"
                        min={0}
                        value={rcv}
                        onChange={(e) =>
                          setQtys((q) => ({
                            ...q,
                            [item.id]: Number(e.target.value),
                          }))
                        }
                        style={{
                          width: 64,
                          textAlign: "center",
                          padding: "3px 6px",
                          border: `1px solid ${ok ? W.borderDefault : W.dangerBorder}`,
                          borderRadius: W.r4,
                          fontSize: 12,
                          background: ok ? W.subtleBg : W.dangerBg,
                          color: ok ? W.textPrimary : W.danger,
                          outline: "none",
                        }}
                      />
                    </td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      {ok ? (
                        <CheckCircle2 size={14} style={{ color: W.success }} />
                      ) : (
                        <AlertCircle size={14} style={{ color: W.danger }} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              <input
                type="checkbox"
                checked={condition}
                onChange={(e) => setCondition(e.target.checked)}
                style={{ accentColor: W.accent }}
              />
              All items received in good condition
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              <input
                type="checkbox"
                checked={trackBatch}
                onChange={(e) => setTrackBatch(e.target.checked)}
                style={{ accentColor: W.accent }}
              />
              Record batch numbers and expiry dates
            </label>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: W.textSecondary,
                  marginBottom: 5,
                }}
              >
                Discrepancy Notes
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe any issues…"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: `1px solid ${W.borderDefault}`,
                  borderRadius: W.r6,
                  fontSize: 12,
                  resize: "none",
                  height: 60,
                  background: W.subtleBg,
                  boxSizing: "border-box" as CSSProperties["boxSizing"],
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${W.borderSubtle}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>
          {hasDisc && (
            <button
              style={{
                ...secondaryBtn,
                color: W.danger,
                borderColor: W.dangerBorder,
                background: W.dangerBg,
              }}
            >
              Report Issue
            </button>
          )}
          <button onClick={onClose} style={primaryBtn}>
            Confirm Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({
  order,
  onClose,
}: {
  order: PurchaseOrder;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(order.balance.toFixed(2));
  const [method, setMethod] = useState("Bank Transfer");
  const [ref, setRef] = useState("");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: W.surfaceBg,
          borderRadius: W.r8,
          boxShadow: W.shadowElevated,
          width: 420,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: `1px solid ${W.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: W.textPrimary }}>
            Record Payment
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: W.textSecondary,
              borderRadius: W.r4,
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              background: W.accentLight,
              border: `1px solid ${W.accentLightBorder}`,
              borderRadius: W.r6,
              padding: "10px 14px",
            }}
          >
            <div style={{ fontSize: 11, color: W.accent }}>
              Outstanding Balance
            </div>
            <div
              style={{ fontSize: 22, fontWeight: 700, color: W.textPrimary }}
            >
              ${fmt(order.balance)}
            </div>
            <div style={{ fontSize: 11, color: W.textCaption }}>
              {order.poNumber} · {order.invoiceRef}
            </div>
          </div>
          {[
            {
              label: "Amount",
              node: (
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={inputStyle}
                />
              ),
            },
            {
              label: "Payment Method",
              node: (
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  style={inputStyle}
                >
                  {["Bank Transfer", "Cash", "Check", "Credit Card"].map(
                    (m) => (
                      <option key={m}>{m}</option>
                    ),
                  )}
                </select>
              ),
            },
            {
              label: "Reference / Check No.",
              node: (
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Optional"
                  style={inputStyle}
                />
              ),
            },
          ].map(({ label, node }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 12,
                  color: W.textSecondary,
                  marginBottom: 5,
                }}
              >
                {label}
              </div>
              {node}
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${W.borderSubtle}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>
          <button onClick={onClose} style={primaryBtn}>
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: New Order ─────────────────────────────────────────────────────*/
function NewOrderTab() {
  const [selectedSupplier, setSelectedSupplier] = useState("s1");
  const [deliveryDate, setDeliveryDate] = useState("2026-04-15");
  const [terms, setTerms] = useState("Net 30");
  const [notes, setNotes] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orderItems, setOrderItems] = useState<
    (NewOrderItem & { qty: number })[]
  >([
    { ...catalogProducts[0], qty: 120 },
    { ...catalogProducts[1], qty: 60 },
  ]);
  const [showCatalog, setShowCatalog] = useState(false);
  const TAX_RATE = 0.12;

  const subtotal = orderItems.reduce((a, i) => a + i.qty * i.unitCost, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const sup = suppliers.find((s) => s.id === selectedSupplier)!;

  const filteredCatalog = catalogProducts.filter(
    (p) =>
      !orderItems.find((oi) => oi.id === p.id) &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase())),
  );

  function addItem(p: NewOrderItem) {
    setOrderItems((prev) => [...prev, { ...p, qty: 1 }]);
    setShowCatalog(false);
    setProductSearch("");
  }
  function removeItem(id: string) {
    setOrderItems((prev) => prev.filter((i) => i.id !== id));
  }
  function updateQty(id: string, qty: number) {
    setOrderItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        background: W.layerBg,
      }}
    >
      {/* Form Column */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ fontSize: 18, fontWeight: 700, color: W.textPrimary }}
              >
                Create Purchase Order
              </div>
              <div style={{ fontSize: 12, color: W.textCaption, marginTop: 2 }}>
                Draft · PO-2026-0342
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={secondaryBtn}>Cancel</button>
              <button style={secondaryBtn}>Save Draft</button>
              <button style={primaryBtn}>
                <Send size={12} />
                Submit Order
              </button>
            </div>
          </div>

          {/* Order Details Card */}
          <div style={card}>
            <div style={cardHeader}>Order Details</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label style={labelStyle}>Supplier *</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  style={inputStyle}
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {sup && (
                  <div
                    style={{ fontSize: 11, color: W.textCaption, marginTop: 4 }}
                  >
                    {sup.terms} · {sup.contact}
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Expected Delivery *</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Payment Terms</label>
                <select
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  style={inputStyle}
                >
                  {["Net 30", "Net 45", "Net 60", "COD", "Prepaid"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          <div style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={cardHeader}>Products</div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowCatalog(!showCatalog)}
                  style={{ ...primaryBtn, fontSize: 12 }}
                >
                  <Plus size={12} />
                  Add Product
                </button>
                {showCatalog && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: 4,
                      width: 340,
                      background: W.surfaceBg,
                      borderRadius: W.r8,
                      boxShadow: W.shadowElevated,
                      zIndex: 50,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 10px",
                        borderBottom: `1px solid ${W.borderSubtle}`,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <Search
                          size={12}
                          style={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: W.textDisabled,
                          }}
                        />
                        <input
                          autoFocus
                          placeholder="Search products…"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          style={{ ...inputStyle, paddingLeft: 28 }}
                        />
                      </div>
                    </div>
                    <div style={{ maxHeight: 220, overflowY: "auto" }}>
                      {filteredCatalog.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => addItem(p)}
                          style={{
                            padding: "9px 12px",
                            cursor: "pointer",
                            borderBottom: `1px solid ${W.borderSubtle}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = W.hoverFill)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: W.textPrimary,
                              }}
                            >
                              {p.name}
                            </div>
                            <div style={{ fontSize: 11, color: W.textCaption }}>
                              {p.sku} · Stock: {p.currentStock}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: W.accent,
                            }}
                          >
                            ${fmt(p.unitCost)}
                          </div>
                        </div>
                      ))}
                      {filteredCatalog.length === 0 && (
                        <div
                          style={{
                            padding: 16,
                            textAlign: "center",
                            fontSize: 12,
                            color: W.textCaption,
                          }}
                        >
                          No matching products
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: W.subtleBg,
                    borderBottom: `1px solid ${W.borderSubtle}`,
                  }}
                >
                  {[
                    "Product",
                    "SKU",
                    "Current Stock",
                    "Qty",
                    "Unit Cost",
                    "Projected Stock",
                    "Subtotal",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 10px",
                        textAlign: ["Unit Cost", "Subtotal", "Qty"].includes(h)
                          ? "right"
                          : "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: W.textCaption,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => {
                  const projected = item.currentStock + item.qty;
                  const overstocked =
                    projected > item.currentStock * 2.5 &&
                    item.currentStock > 100;
                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: `1px solid ${W.borderSubtle}` }}
                    >
                      <td style={{ padding: "10px" }}>
                        <div style={{ fontWeight: 600, color: W.textPrimary }}>
                          {item.name}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 11,
                            color: W.textCaption,
                          }}
                        >
                          {item.sku}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ fontWeight: 500 }}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(
                              item.id,
                              Math.max(1, Number(e.target.value)),
                            )
                          }
                          style={{
                            width: 64,
                            textAlign: "right",
                            padding: "4px 8px",
                            border: `1px solid ${W.borderDefault}`,
                            borderRadius: W.r4,
                            fontSize: 12,
                            background: W.subtleBg,
                            outline: "none",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          color: W.textSecondary,
                        }}
                      >
                        ${fmt(item.unitCost)}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: overstocked ? W.danger : W.success,
                            }}
                          >
                            {projected}
                          </span>
                          {overstocked && (
                            <span
                              style={{
                                fontSize: 10,
                                color: W.danger,
                                background: W.dangerBg,
                                border: `1px solid ${W.dangerBorder}`,
                                borderRadius: W.r4,
                                padding: "1px 5px",
                              }}
                            >
                              Overstock ⚠
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: W.textPrimary,
                        }}
                      >
                        ${fmt(item.qty * item.unitCost)}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            padding: "3px 6px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: W.textDisabled,
                            borderRadius: W.r4,
                          }}
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {orderItems.length === 0 && (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: W.textCaption,
                  fontSize: 13,
                }}
              >
                No products added yet. Click "Add Product" to start.
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={card}>
            <div style={cardHeader}>Notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for this purchase order…"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `1px solid ${W.borderDefault}`,
                borderRadius: W.r6,
                fontSize: 12,
                resize: "none",
                height: 72,
                background: W.subtleBg,
                boxSizing: "border-box" as CSSProperties["boxSizing"],
                color: W.textPrimary,
              }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar: Order Summary */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          background: W.surfaceBg,
          borderLeft: `1px solid ${W.borderSubtle}`,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: W.textPrimary }}>
          Order Summary
        </div>

        {/* Supplier Recap */}
        {sup && (
          <div
            style={{
              background: W.subtleBg,
              borderRadius: W.r8,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: W.r6,
                  background: sup.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: sup.color }}
                >
                  {sup.initials}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: W.textPrimary,
                  }}
                >
                  {sup.name}
                </div>
                <div style={{ fontSize: 11, color: W.textCaption }}>
                  {sup.terms}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: W.textCaption,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span>{sup.email}</span>
              <span>{sup.phone}</span>
            </div>
          </div>
        )}

        {/* Financials */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { l: "Subtotal", v: `$${fmt(subtotal)}` },
            { l: `Tax (12%)`, v: `+$${fmt(tax)}` },
          ].map((r) => (
            <div
              key={r.l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: W.textSecondary }}>{r.l}</span>
              <span style={{ color: W.textPrimary }}>{r.v}</span>
            </div>
          ))}
          <div
            style={{
              borderTop: `1px solid ${W.borderSubtle}`,
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ fontWeight: 700, fontSize: 14, color: W.textPrimary }}
            >
              Total
            </span>
            <span
              style={{ fontWeight: 800, fontSize: 18, color: W.textPrimary }}
            >
              ${fmt(total)}
            </span>
          </div>
        </div>

        {/* Items summary */}
        <div
          style={{
            background: W.subtleBg,
            borderRadius: W.r8,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: W.textCaption,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Items ({orderItems.length})
          </div>
          {orderItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  color: W.textSecondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                  marginRight: 8,
                }}
              >
                {item.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>
                ×{item.qty}
              </span>
            </div>
          ))}
        </div>

        {total > 0 && total > 5000 && (
          <div
            style={{
              background: W.cautionBg,
              border: `1px solid ${W.cautionBorder}`,
              borderRadius: W.r6,
              padding: "10px 12px",
              display: "flex",
              gap: 8,
            }}
          >
            <AlertTriangle
              size={13}
              style={{ color: W.caution, flexShrink: 0 }}
            />
            <span style={{ fontSize: 11, color: W.caution }}>
              Order exceeds $5,000 — approval required before submission.
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: "auto",
          }}
        >
          <button style={{ ...secondaryBtn, justifyContent: "center" }}>
            Save Draft
          </button>
          <button
            style={{ ...primaryBtn, justifyContent: "center", width: "100%" }}
          >
            <Send size={13} />
            Submit Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Invoices & Payments ───────────────────────────────────────────*/
function InvoicesTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PaymentStatus | "all">("all");
  const [selectedInv, setSelectedInv] = useState<InvoiceRow>(invoices[0]);
  const [showPay, setShowPay] = useState(false);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceRef.toLowerCase().includes(search.toLowerCase()) ||
      inv.supplier.toLowerCase().includes(search.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || inv.paymentStatus === filter;
    return matchSearch && matchFilter;
  });

  const totalOutstanding = invoices.reduce((a, i) => a + i.balance, 0);
  const overdueAmt = invoices
    .filter((i) => i.paymentStatus === "overdue")
    .reduce((a, i) => a + i.balance, 0);
  const paidThisMonth = invoices
    .filter((i) => i.paymentStatus === "paid")
    .reduce((a, i) => a + i.paid, 0);

  const fakeOrder = {
    ...allOrders[0],
    balance: selectedInv.balance,
    invoiceRef: selectedInv.invoiceRef,
    poNumber: selectedInv.poNumber,
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: W.layerBg,
      }}
    >
      {showPay && (
        <PaymentModal order={fakeOrder} onClose={() => setShowPay(false)} />
      )}

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          padding: "14px 18px",
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        {[
          {
            label: "Total Outstanding",
            value: `$${fmt(totalOutstanding)}`,
            icon: <CreditCard size={14} />,
            color: W.accent,
            bg: W.accentLight,
            sub: `${invoices.filter((i) => i.balance > 0).length} invoices unpaid`,
          },
          {
            label: "Overdue",
            value: `$${fmt(overdueAmt)}`,
            icon: <AlertTriangle size={14} />,
            color: W.danger,
            bg: W.dangerBg,
            sub: `${invoices.filter((i) => i.paymentStatus === "overdue").length} overdue`,
          },
          {
            label: "Paid This Month",
            value: `$${fmt(paidThisMonth)}`,
            icon: <CheckCircle2 size={14} />,
            color: W.success,
            bg: W.successBg,
            sub: `${invoices.filter((i) => i.paymentStatus === "paid").length} settled`,
          },
          {
            label: "Total Invoices",
            value: `${invoices.length}`,
            icon: <Receipt size={14} />,
            color: W.caution,
            bg: W.cautionBg,
            sub: "This period",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: W.subtleBg,
              borderRadius: W.r8,
              border: `1px solid ${W.borderSubtle}`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: W.r8,
                background: k.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: k.color,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: W.textCaption }}>
                {k.label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: W.textPrimary,
                  lineHeight: 1.2,
                }}
              >
                {k.value}
              </div>
              <div style={{ fontSize: 10, color: W.textCaption }}>{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main split: list + detail */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Invoice List */}
        <div
          style={{
            width: 480,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: W.surfaceBg,
            borderRight: `1px solid ${W.borderSubtle}`,
            overflow: "hidden",
          }}
        >
          {/* Search + Filter */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: `1px solid ${W.borderSubtle}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search
                  size={12}
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: W.textDisabled,
                  }}
                />
                <input
                  placeholder="Search invoice, supplier, PO…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 28 }}
                />
              </div>
              <button style={toolBtn}>
                <Download size={12} />
              </button>
              <button style={toolBtn}>
                <Printer size={12} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "pending", "partial", "overdue", "paid"] as const).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: W.r4,
                      border: "none",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: filter === f ? 600 : 400,
                      background: filter === f ? W.accent : W.subtleBg,
                      color: filter === f ? W.textOnAccent : W.textSecondary,
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            <div
              style={{
                padding: "5px 12px",
                fontSize: 11,
                color: W.textCaption,
                borderBottom: `1px solid ${W.borderSubtle}`,
              }}
            >
              {filtered.length} invoices
            </div>
            {filtered.map((inv) => {
              const isSelected = selectedInv.id === inv.id;
              const supColor =
                supplierColorMap[inv.supplierId] || W.textCaption;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInv(inv)}
                  style={{
                    padding: "11px 12px",
                    borderBottom: `1px solid ${W.borderSubtle}`,
                    borderLeft: `2px solid ${isSelected ? W.accent : "transparent"}`,
                    background: isSelected ? W.selectedFill : "transparent",
                    cursor: "pointer",
                    transition: "all 0.1s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: W.textPrimary,
                          }}
                        >
                          {inv.invoiceRef}
                        </span>
                        <PayTag status={inv.paymentStatus} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          marginBottom: 3,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: supColor,
                          }}
                        />
                        <span style={{ fontSize: 12, color: W.textSecondary }}>
                          {inv.supplier}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          fontSize: 11,
                          color: W.textCaption,
                        }}
                      >
                        <span>{inv.poNumber}</span>
                        <span>Due: {inv.dueDate}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: W.textPrimary,
                        }}
                      >
                        ${fmt(inv.total)}
                      </div>
                      {inv.balance > 0 && (
                        <div
                          style={{
                            fontSize: 11,
                            color:
                              inv.paymentStatus === "overdue"
                                ? W.danger
                                : W.textCaption,
                            marginTop: 2,
                          }}
                        >
                          Due: ${fmt(inv.balance)}
                        </div>
                      )}
                      {inv.balance === 0 && (
                        <div
                          style={{
                            fontSize: 11,
                            color: W.success,
                            marginTop: 2,
                          }}
                        >
                          Settled
                        </div>
                      )}
                    </div>
                  </div>
                  {inv.total > 0 && (
                    <div style={{ marginTop: 7 }}>
                      <div
                        style={{
                          height: 3,
                          background: W.subtleBg,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            background:
                              inv.paymentStatus === "overdue"
                                ? W.danger
                                : W.success,
                            width: `${(inv.paid / inv.total) * 100}%`,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: W.textCaption,
                          marginTop: 2,
                        }}
                      >
                        {Math.round((inv.paid / inv.total) * 100)}% paid
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Detail */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minWidth: 0,
          }}
        >
          {/* Invoice header */}
          <div style={{ ...card, padding: "16px 18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: W.textPrimary,
                    }}
                  >
                    {selectedInv.invoiceRef}
                  </span>
                  <PayTag status={selectedInv.paymentStatus} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px 16px",
                    fontSize: 12,
                    color: W.textSecondary,
                  }}
                >
                  <span>
                    <strong style={{ color: W.textPrimary }}>
                      {selectedInv.supplier}
                    </strong>
                  </span>
                  <span>PO: {selectedInv.poNumber}</span>
                  <span>Issued: {selectedInv.invoiceDate}</span>
                  <span>Due: {selectedInv.dueDate}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {selectedInv.balance > 0 && (
                  <button onClick={() => setShowPay(true)} style={primaryBtn}>
                    <CreditCard size={12} />
                    Pay Now
                  </button>
                )}
                <button style={secondaryBtn}>
                  <Printer size={12} />
                  Print
                </button>
                <button style={toolBtn}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {/* Financials */}
            <div style={card}>
              <div style={cardHeader}>Payment Status</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 12,
                }}
              >
                {[
                  { l: "Invoice Total", v: `$${fmt(selectedInv.total)}` },
                  {
                    l: "Amount Paid",
                    v: `$${fmt(selectedInv.paid)}`,
                    color: W.success,
                  },
                  {
                    l: "Balance Due",
                    v: `$${fmt(selectedInv.balance)}`,
                    color: selectedInv.balance > 0 ? W.danger : W.success,
                    bold: true,
                  },
                ].map((r) => (
                  <div
                    key={r.l}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: W.textSecondary }}>{r.l}</span>
                    <span
                      style={{
                        color: r.color || W.textPrimary,
                        fontWeight: r.bold ? 700 : 500,
                      }}
                    >
                      {r.v}
                    </span>
                  </div>
                ))}
                {selectedInv.total > 0 && (
                  <>
                    <div
                      style={{
                        height: 6,
                        background: W.subtleBg,
                        borderRadius: 6,
                        marginTop: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: `linear-gradient(90deg, ${W.success}, #34C759)`,
                          width: `${(selectedInv.paid / selectedInv.total) * 100}%`,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: W.textCaption,
                        textAlign: "right",
                      }}
                    >
                      {Math.round((selectedInv.paid / selectedInv.total) * 100)}
                      % paid
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Supplier Contact */}
            <div style={card}>
              <div style={cardHeader}>Supplier</div>
              {(() => {
                const sup = suppliers.find(
                  (s) => s.id === selectedInv.supplierId,
                )!;
                return sup ? (
                  <div
                    style={{
                      fontSize: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    {[
                      { l: "Contact", v: sup.contact },
                      { l: "Phone", v: sup.phone },
                      { l: "Email", v: sup.email, accent: true },
                      { l: "Terms", v: sup.terms },
                    ].map((r) => (
                      <div
                        key={r.l}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: W.textCaption }}>{r.l}</span>
                        <span
                          style={{
                            color: r.accent ? W.accent : W.textPrimary,
                            fontWeight: 500,
                          }}
                        >
                          {r.v}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Payment history */}
          <div style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={cardHeader}>Payment History</div>
              {selectedInv.balance > 0 && (
                <button
                  onClick={() => setShowPay(true)}
                  style={{ ...primaryBtn, fontSize: 12 }}
                >
                  <Plus size={11} />
                  Add Payment
                </button>
              )}
            </div>
            {selectedInv.paid > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: W.subtleBg }}>
                    {["Date", "Method", "Reference", "Amount"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "7px 10px",
                          textAlign: h === "Amount" ? "right" : "left",
                          fontSize: 10,
                          fontWeight: 700,
                          color: W.textCaption,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: `1px solid ${W.borderSubtle}` }}>
                    <td style={{ padding: "9px 10px", color: W.textSecondary }}>
                      Mar 27, 2026
                    </td>
                    <td style={{ padding: "9px 10px" }}>Bank Transfer</td>
                    <td
                      style={{
                        padding: "9px 10px",
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: W.textCaption,
                      }}
                    >
                      TXN-99281A
                    </td>
                    <td
                      style={{
                        padding: "9px 10px",
                        textAlign: "right",
                        fontWeight: 700,
                        color: W.success,
                      }}
                    >
                      ${fmt(selectedInv.paid)}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: W.textCaption,
                  fontSize: 12,
                }}
              >
                No payments recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Analytics ─────────────────────────────────────────────────────*/
function AnalyticsTab() {
  const maxSpend = Math.max(...monthlySpend);
  const maxSupVol = Math.max(...supplierVol.map((s) => s.value));
  const totalSpend = monthlySpend.reduce((a, b) => a + b, 0);

  return (
    <div
      style={{ flex: 1, overflowY: "auto", background: W.layerBg, padding: 20 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* KPI Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {[
            {
              label: "This Month",
              value: `$${fmt(monthlySpend[5])}`,
              icon: <DollarSign size={16} />,
              sub: "+12% vs last month",
              trend: "up",
              color: W.accent,
              bg: W.accentLight,
            },
            {
              label: "Pending Orders",
              value: "8",
              icon: <ClipboardList size={16} />,
              sub: "$12,400 in transit",
              trend: "neutral",
              color: W.caution,
              bg: W.cautionBg,
            },
            {
              label: "Overdue Payments",
              value: "2",
              icon: <AlertTriangle size={16} />,
              sub: "$9,360 overdue",
              trend: "down",
              color: W.danger,
              bg: W.dangerBg,
            },
            {
              label: "Avg Order Cycle",
              value: "6.2 days",
              icon: <Activity size={16} />,
              sub: "Order → Receive → Pay",
              trend: "up",
              color: W.success,
              bg: W.successBg,
            },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                background: W.cardBg,
                borderRadius: W.r8,
                boxShadow: W.shadowCard,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: W.r8,
                    background: k.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: k.color,
                  }}
                >
                  {k.icon}
                </div>
                {k.trend === "up" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                      color: W.success,
                      fontWeight: 600,
                    }}
                  >
                    <ArrowUp size={11} />
                    +12%
                  </div>
                )}
                {k.trend === "down" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                      color: W.danger,
                      fontWeight: 600,
                    }}
                  >
                    <ArrowDown size={11} />
                    -3%
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: W.textPrimary,
                  lineHeight: 1,
                }}
              >
                {k.value}
              </div>
              <div style={{ fontSize: 11, color: W.textCaption, marginTop: 4 }}>
                {k.sub}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: W.textSecondary,
                  marginTop: 2,
                }}
              >
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
        >
          {/* Purchase Trend */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={cardHeader}>Monthly Purchase Trend</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["6M", "1Y", "All"].map((p) => (
                  <button
                    key={p}
                    style={{
                      padding: "3px 9px",
                      borderRadius: W.r4,
                      border: `1px solid ${p === "6M" ? W.accent : W.borderDefault}`,
                      background: p === "6M" ? W.accentLight : "transparent",
                      color: p === "6M" ? W.accent : W.textCaption,
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: p === "6M" ? 600 : 400,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                height: 160,
              }}
            >
              {monthlySpend.map((val, i) => {
                const pct = val / maxSpend;
                const barH = Math.round(pct * 140);
                const isLast = i === monthlySpend.length - 1;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: isLast ? W.accent : W.textCaption,
                        fontWeight: isLast ? 700 : 400,
                      }}
                    >
                      {fmtK(val)}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "80%",
                          height: barH,
                          background: isLast ? W.accent : W.accentLight,
                          borderRadius: `${W.r4} ${W.r4} 0 0`,
                          transition: "height 0.3s",
                          border: `1px solid ${isLast ? W.accentHover : W.accentLightBorder}`,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: W.textCaption }}>
                      {monthLabels[i]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${W.borderSubtle}`,
                display: "flex",
                gap: 24,
                fontSize: 12,
              }}
            >
              <div>
                <span style={{ color: W.textCaption }}>6-Month Total: </span>
                <span style={{ fontWeight: 700, color: W.textPrimary }}>
                  ${fmt(totalSpend)}
                </span>
              </div>
              <div>
                <span style={{ color: W.textCaption }}>Monthly Avg: </span>
                <span style={{ fontWeight: 600, color: W.textPrimary }}>
                  ${fmt(totalSpend / 6)}
                </span>
              </div>
              <div>
                <span style={{ color: W.textCaption }}>Peak Month: </span>
                <span style={{ fontWeight: 600, color: W.textPrimary }}>
                  Mar 2026
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={cardHeader}>Category Breakdown</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 14,
              }}
            >
              {categoryData.map((c) => (
                <div key={c.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: W.textPrimary, fontWeight: 500 }}>
                      {c.label}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: W.textCaption }}>{c.pct}%</span>
                      <span style={{ fontWeight: 600, color: W.textPrimary }}>
                        ${fmt(c.value)}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: W.subtleBg,
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: c.color,
                        width: `${c.pct}%`,
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {/* Top Suppliers by Volume */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={cardHeader}>Top Suppliers by Volume</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 14,
              }}
            >
              {supplierVol.map((s, i) => (
                <div
                  key={s.name}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: W.r4,
                      background: s.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ fontSize: 10, fontWeight: 700, color: s.color }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontWeight: 500, color: W.textPrimary }}>
                        {s.name}
                      </span>
                      <span style={{ fontWeight: 700, color: W.textPrimary }}>
                        ${fmt(s.value)}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: W.subtleBg,
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: s.color,
                          width: `${(s.value / maxSupVol) * 100}%`,
                          borderRadius: 5,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Change Alerts */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={cardHeader}>Price Change Alerts</div>
              <Tag bg={W.dangerBg} color={W.danger} border={W.dangerBorder}>
                <AlertTriangle size={10} />3 alerts
              </Tag>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: W.subtleBg }}>
                  {["Product", "Supplier", "Change", "Action"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "6px 8px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: W.textCaption,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    product: "Amoxicillin 500mg",
                    supplier: "MedSupply",
                    prev: 11.8,
                    curr: 12.5,
                    change: +6.0,
                  },
                  {
                    product: "Atorvastatin 40mg",
                    supplier: "PharmaDist",
                    prev: 21.0,
                    curr: 22.8,
                    change: +8.5,
                  },
                  {
                    product: "Omeprazole 20mg",
                    supplier: "BioPharm",
                    prev: 4.4,
                    curr: 4.15,
                    change: -5.7,
                  },
                ].map((row) => (
                  <tr
                    key={row.product}
                    style={{ borderTop: `1px solid ${W.borderSubtle}` }}
                  >
                    <td style={{ padding: "9px 8px" }}>
                      <div style={{ fontWeight: 500, color: W.textPrimary }}>
                        {row.product}
                      </div>
                    </td>
                    <td style={{ padding: "9px 8px", color: W.textSecondary }}>
                      {row.supplier}
                    </td>
                    <td style={{ padding: "9px 8px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {row.change > 0 ? (
                            <ArrowUp size={11} style={{ color: W.danger }} />
                          ) : (
                            <ArrowDown size={11} style={{ color: W.success }} />
                          )}
                          <span
                            style={{
                              fontWeight: 700,
                              color: row.change > 0 ? W.danger : W.success,
                            }}
                          >
                            {Math.abs(row.change).toFixed(1)}%
                          </span>
                        </div>
                        <span style={{ fontSize: 10, color: W.textCaption }}>
                          ${fmt(row.prev)} → ${fmt(row.curr)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "9px 8px" }}>
                      <button
                        style={{
                          ...secondaryBtn,
                          fontSize: 11,
                          padding: "3px 8px",
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────*/
export function PurchaseManagement() {
  const [mainTab, setMainTab] = useState<MainTab>("orders");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>(
    allOrders[0],
  );
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [showReceiving, setShowReceiving] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("items");

  const filteredOrders = allOrders.filter((o) => {
    if (selectedSupplierId && o.supplierId !== selectedSupplierId) return false;
    if (
      search &&
      !o.poNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.supplier.toLowerCase().includes(search.toLowerCase()) &&
      !o.invoiceRef.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (statusTab === "overdue") return o.paymentStatus === "overdue";
    if (statusTab !== "all") return o.status === statusTab;
    return true;
  });

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase()),
  );

  const totalPayable = allOrders.reduce((a, o) => a + o.balance, 0);
  const overdueAmt = allOrders
    .filter((o) => o.paymentStatus === "overdue")
    .reduce((a, o) => a + o.balance, 0);
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const thisMonth = allOrders.reduce((a, o) => a + o.total, 0);

  const tabCounts: Record<StatusTab, number> = {
    all: allOrders.length,
    draft: allOrders.filter((o) => o.status === "draft").length,
    pending: allOrders.filter((o) => o.status === "pending").length,
    received: allOrders.filter((o) => o.status === "received").length,
    paid: allOrders.filter((o) => o.status === "paid").length,
    cancelled: allOrders.filter((o) => o.status === "cancelled").length,
    overdue: allOrders.filter((o) => o.paymentStatus === "overdue").length,
  };

  const selSupplier = suppliers.find((s) => s.id === selectedOrder.supplierId)!;

  function contextActions(order: PurchaseOrder) {
    if (order.status === "draft")
      return [
        {
          label: "Edit",
          icon: <Edit2 size={12} />,
          accent: false,
          danger: false,
        },
        {
          label: "Submit",
          icon: <Send size={12} />,
          accent: true,
          danger: false,
        },
        {
          label: "Delete",
          icon: <Trash2 size={12} />,
          accent: false,
          danger: true,
        },
      ];
    if (order.status === "pending")
      return [
        {
          label: "Mark Received",
          icon: <Package size={12} />,
          accent: true,
          danger: false,
          action: () => setShowReceiving(true),
        },
        {
          label: "Cancel",
          icon: <Ban size={12} />,
          accent: false,
          danger: true,
        },
      ];
    if (order.status === "received")
      return [
        {
          label: "Add Payment",
          icon: <CreditCard size={12} />,
          accent: true,
          danger: false,
          action: () => setShowPayment(true),
        },
        {
          label: "Report Issue",
          icon: <AlertCircle size={12} />,
          accent: false,
          danger: false,
        },
      ];
    return [
      {
        label: "Print Invoice",
        icon: <Printer size={12} />,
        accent: false,
        danger: false,
      },
      {
        label: "Reorder",
        icon: <RefreshCw size={12} />,
        accent: true,
        danger: false,
      },
    ];
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: W.appBg,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        fontSize: 13,
        overflow: "hidden",
        color: W.textPrimary,
      }}
    >
      {showReceiving && (
        <ReceivingModal
          order={selectedOrder}
          onClose={() => setShowReceiving(false)}
        />
      )}
      {showPayment && (
        <PaymentModal
          order={selectedOrder}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* ── Title Bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: W.titleBarBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          padding: "0 16px",
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: W.r6,
              background: W.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pill size={15} color={W.textOnAccent} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 13, color: W.textPrimary }}>
            PharmaCare Pro
          </span>
          <ChevronRight size={13} style={{ color: W.textDisabled }} />
          <span style={{ fontSize: 13, color: W.textSecondary }}>
            Purchase Management Studio
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {[
            { label: "Monthly Spend", value: fmtK(thisMonth), color: W.accent },
            {
              label: "Outstanding",
              value: fmtK(totalPayable),
              color: W.caution,
            },
            { label: "Overdue", value: fmtK(overdueAmt), color: W.danger },
            {
              label: "Pending",
              value: String(pendingCount) + " orders",
              color: W.success,
            },
          ].map((k) => (
            <div
              key={k.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{ fontSize: 10, color: W.textCaption, lineHeight: 1 }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: k.color,
                  lineHeight: 1.3,
                }}
              >
                {k.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {overdueAmt > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: W.dangerBg,
                border: `1px solid ${W.dangerBorder}`,
                borderRadius: W.r6,
                padding: "3px 10px",
                marginRight: 6,
              }}
            >
              <AlertTriangle size={11} style={{ color: W.danger }} />
              <span style={{ fontSize: 11, color: W.danger, fontWeight: 600 }}>
                Payment overdue
              </span>
            </div>
          )}
          <button style={{ ...primaryBtn }}>
            <Plus size={13} />
            New Order
          </button>
          <button style={toolBtn}>
            <Bell size={14} />
          </button>
          <button style={toolBtn}>
            <Settings size={14} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginLeft: 4,
              paddingLeft: 10,
              borderLeft: `1px solid ${W.borderDefault}`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: W.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ color: W.textOnAccent, fontSize: 11, fontWeight: 700 }}
              >
                RM
              </span>
            </div>
            <span style={{ fontSize: 12, color: W.textSecondary }}>
              R. Martinez
            </span>
            <ChevronDown size={11} style={{ color: W.textDisabled }} />
          </div>
        </div>
      </div>

      {/* ── Main Tab Bar ────────────────────────────────────────────────── */}
      <div
        style={{
          background: W.surfaceBg,
          borderBottom: `1px solid ${W.borderSubtle}`,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex" }}>
          {(
            [
              {
                id: "orders",
                label: "Purchase Orders",
                icon: <ClipboardList size={13} />,
              },
              { id: "create", label: "New Order", icon: <Plus size={13} /> },
              {
                id: "invoices",
                label: "Invoices & Payments",
                icon: <Receipt size={13} />,
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: <BarChart3 size={13} />,
              },
            ] as { id: MainTab; label: string; icon: React.ReactNode }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              style={{
                padding: "0 18px",
                height: 42,
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                border: "none",
                borderBottom: `2px solid ${mainTab === tab.id ? W.accent : "transparent"}`,
                background: "transparent",
                color: mainTab === tab.id ? W.accent : W.textSecondary,
                fontWeight: mainTab === tab.id ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.12s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, paddingBottom: 2 }}>
          <button style={toolBtn}>
            <RefreshCw size={13} />
          </button>
          <button style={toolBtn}>
            <Printer size={13} />
          </button>
          <button style={toolBtn}>
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      {mainTab === "create" && <NewOrderTab />}
      {mainTab === "invoices" && <InvoicesTab />}
      {mainTab === "analytics" && <AnalyticsTab />}

      {mainTab === "orders" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* ════ LEFT: Supplier Navigator ════ */}
          <div
            style={{
              width: 236,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              background: W.navBg,
              borderRight: `1px solid ${W.borderSubtle}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 12px 8px",
                borderBottom: `1px solid ${W.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: W.textCaption,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 7,
                }}
              >
                Suppliers
              </div>
              <div style={{ position: "relative" }}>
                <Search
                  size={12}
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: W.textDisabled,
                  }}
                />
                <input
                  placeholder="Search…"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 26 }}
                />
              </div>
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "4px 0" }}>
              {/* All row */}
              <div
                onClick={() => setSelectedSupplierId(null)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background:
                    selectedSupplierId === null
                      ? W.selectedFill
                      : "transparent",
                  borderLeft: `2px solid ${selectedSupplierId === null ? W.accent : "transparent"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: W.r6,
                      background: W.subtleBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Layers size={12} style={{ color: W.textCaption }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    All Suppliers
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: W.textCaption,
                    background: W.subtleBg,
                    padding: "1px 7px",
                    borderRadius: W.r4,
                  }}
                >
                  {allOrders.length}
                </span>
              </div>
              {filteredSuppliers.map((sup) => {
                const isSel = selectedSupplierId === sup.id;
                return (
                  <div
                    key={sup.id}
                    onClick={() => setSelectedSupplierId(isSel ? null : sup.id)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      background: isSel ? W.selectedFill : "transparent",
                      borderLeft: `2px solid ${isSel ? W.accent : "transparent"}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: W.r6,
                          background: sup.color + "22",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: sup.color,
                          }}
                        >
                          {sup.initials}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: W.textPrimary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {sup.name}
                        </div>
                        <div style={{ fontSize: 10, color: W.textCaption }}>
                          {sup.code} · {sup.terms}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                      }}
                    >
                      <span
                        style={{
                          color:
                            sup.pendingOrders > 0 ? W.caution : W.textCaption,
                        }}
                      >
                        {sup.pendingOrders > 0
                          ? `${sup.pendingOrders} pending`
                          : "No pending"}
                      </span>
                      <span
                        style={{
                          color: sup.totalPayable > 0 ? W.danger : W.success,
                          fontWeight: 600,
                        }}
                      >
                        {sup.totalPayable > 0
                          ? fmtK(sup.totalPayable)
                          : "Settled"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderTop: `1px solid ${W.borderSubtle}`,
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "7px 0",
                  borderRadius: W.r6,
                  border: `1px dashed ${W.borderDefault}`,
                  background: "transparent",
                  fontSize: 12,
                  color: W.textSecondary,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Plus size={12} />
                Add Supplier
              </button>
            </div>
          </div>

          {/* ════ CENTER: Purchase Order Master ════ */}
          <div
            style={{
              width: 374,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              background: W.surfaceBg,
              borderRight: `1px solid ${W.borderSubtle}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                borderBottom: `1px solid ${W.borderSubtle}`,
                display: "flex",
                overflowX: "auto",
              }}
            >
              {(
                [
                  "all",
                  "draft",
                  "pending",
                  "received",
                  "paid",
                  "overdue",
                ] as StatusTab[]
              ).map((tab) => {
                const count = tabCounts[tab];
                const active = statusTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setStatusTab(tab)}
                    style={{
                      padding: "10px 11px",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      border: "none",
                      borderBottom: `2px solid ${active ? W.accent : "transparent"}`,
                      background: "transparent",
                      color: active ? W.accent : W.textSecondary,
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {count > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "1px 5px",
                          borderRadius: 10,
                          background:
                            tab === "overdue"
                              ? W.dangerBg
                              : active
                                ? W.accentLight
                                : W.subtleBg,
                          color:
                            tab === "overdue"
                              ? W.danger
                              : active
                                ? W.accent
                                : W.textCaption,
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                padding: "8px 10px",
                borderBottom: `1px solid ${W.borderSubtle}`,
                display: "flex",
                gap: 7,
              }}
            >
              <div style={{ flex: 1, position: "relative" }}>
                <Search
                  size={12}
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: W.textDisabled,
                  }}
                />
                <input
                  placeholder="Search orders, products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 26 }}
                />
              </div>
              <button style={toolBtn}>
                <Filter size={12} />
              </button>
            </div>
            <div
              style={{
                padding: "5px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 11, color: W.textCaption }}>
                {filteredOrders.length} orders
              </span>
              <button
                style={{
                  fontSize: 11,
                  color: W.textCaption,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ArrowUpDown size={10} />
                Latest first
              </button>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filteredOrders.map((order) => {
                const isSel = selectedOrder.id === order.id;
                const isHov = hoveredOrderId === order.id;
                const supColor =
                  supplierColorMap[order.supplierId] || W.textCaption;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    onMouseEnter={() => setHoveredOrderId(order.id)}
                    onMouseLeave={() => setHoveredOrderId(null)}
                    style={{
                      padding: "11px 12px",
                      borderBottom: `1px solid ${W.borderSubtle}`,
                      borderLeft: `2px solid ${isSel ? W.accent : "transparent"}`,
                      background: isSel
                        ? W.selectedFill
                        : isHov
                          ? W.hoverFill
                          : "transparent",
                      cursor: "pointer",
                      transition: "all 0.1s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 12,
                              color: W.textPrimary,
                            }}
                          >
                            {order.poNumber}
                          </span>
                          <OrderTag status={order.status} />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: supColor,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              color: W.textSecondary,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.supplier}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            fontSize: 11,
                            color: W.textCaption,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <CalendarDays size={9} />
                            {order.date}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <Package size={9} />
                            {order.itemCount} items
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 3,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: W.textPrimary,
                          }}
                        >
                          ${fmt(order.total)}
                        </span>
                        <PayTag status={order.paymentStatus} />
                        {order.balance > 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              color:
                                order.paymentStatus === "overdue"
                                  ? W.danger
                                  : W.textCaption,
                            }}
                          >
                            Due: ${fmt(order.balance)}
                          </span>
                        )}
                      </div>
                    </div>
                    {isHov && (
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginTop: 7,
                          paddingTop: 7,
                          borderTop: `1px solid ${W.borderSubtle}`,
                        }}
                      >
                        {order.status === "draft" && (
                          <button style={qbtn}>
                            <Edit2 size={10} /> Edit
                          </button>
                        )}
                        <button style={qbtn}>
                          <Eye size={10} /> View
                        </button>
                        <button style={qbtn}>
                          <Printer size={10} /> Print
                        </button>
                        <button style={qbtn}>
                          <RefreshCw size={10} /> Dupe
                        </button>
                        {order.status === "draft" && (
                          <button
                            style={{
                              ...qbtn,
                              color: W.danger,
                              borderColor: W.dangerBorder,
                              background: W.dangerBg,
                            }}
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ════ RIGHT: Order Detail ════ */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: W.layerBg,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            {/* Detail Header */}
            <div
              style={{
                background: W.surfaceBg,
                borderBottom: `1px solid ${W.borderSubtle}`,
                padding: "12px 18px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: W.textPrimary,
                      }}
                    >
                      {selectedOrder.poNumber}
                    </span>
                    <OrderTag status={selectedOrder.status} />
                    <PayTag status={selectedOrder.paymentStatus} />
                    {selectedOrder.paymentStatus === "overdue" && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11,
                          color: W.danger,
                          fontWeight: 600,
                          background: W.dangerBg,
                          border: `1px solid ${W.dangerBorder}`,
                          borderRadius: 20,
                          padding: "2px 10px",
                        }}
                      >
                        <AlertCircle size={10} />
                        Overdue by 4 days
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px 16px",
                      fontSize: 12,
                      color: W.textSecondary,
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background:
                            supplierColorMap[selectedOrder.supplierId] ||
                            W.textCaption,
                        }}
                      />
                      <strong style={{ color: W.textPrimary }}>
                        {selectedOrder.supplier}
                      </strong>
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <CalendarDays size={11} />
                      Created {selectedOrder.date}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Truck size={11} />
                      Expected {selectedOrder.expectedDelivery}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <CreditCard size={11} />
                      {selectedOrder.terms}
                    </span>
                    {selectedOrder.invoiceRef && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <FileText size={11} />
                        {selectedOrder.invoiceRef}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {contextActions(selectedOrder).map((action, i) => (
                    <button
                      key={i}
                      onClick={action.action}
                      style={{
                        padding: "6px 12px",
                        borderRadius: W.r6,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontWeight: action.accent ? 600 : 400,
                        border: action.danger
                          ? `1px solid ${W.dangerBorder}`
                          : action.accent
                            ? "none"
                            : `1px solid ${W.borderDefault}`,
                        background: action.danger
                          ? W.dangerBg
                          : action.accent
                            ? W.accent
                            : W.surfaceBg,
                        color: action.danger
                          ? W.danger
                          : action.accent
                            ? W.textOnAccent
                            : W.textPrimary,
                      }}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                  <button style={toolBtn}>
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                padding: "12px 18px",
                flexShrink: 0,
              }}
            >
              {/* Supplier */}
              <div
                style={{
                  background: W.cardBg,
                  borderRadius: W.r8,
                  boxShadow: W.shadowCard,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: W.r8,
                      background:
                        (supplierColorMap[selectedOrder.supplierId] ||
                          W.accent) + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color:
                          supplierColorMap[selectedOrder.supplierId] ||
                          W.accent,
                      }}
                    >
                      {selSupplier?.initials}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: W.textPrimary,
                      }}
                    >
                      {selSupplier?.name}
                    </div>
                    <div style={{ fontSize: 11, color: W.textCaption }}>
                      {selSupplier?.code} · {selSupplier?.terms}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px 12px",
                    fontSize: 12,
                  }}
                >
                  {[
                    { l: "Contact", v: selSupplier?.contact },
                    { l: "Phone", v: selSupplier?.phone },
                    { l: "Email", v: selSupplier?.email, accent: true },
                    { l: "License", v: selSupplier?.license, mono: true },
                  ].map((r) => (
                    <div key={r.l}>
                      <div style={{ fontSize: 10, color: W.textCaption }}>
                        {r.l}
                      </div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: r.accent ? W.accent : W.textPrimary,
                          fontFamily: r.mono ? "monospace" : undefined,
                          fontSize: r.mono ? 11 : 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Financials */}
              <div
                style={{
                  background: W.cardBg,
                  borderRadius: W.r8,
                  boxShadow: W.shadowCard,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: W.textCaption,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Financial Summary
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  {[
                    { l: "Subtotal", v: `$${fmt(selectedOrder.subtotal)}` },
                    { l: "Tax", v: `+$${fmt(selectedOrder.tax)}` },
                    {
                      l: "Discount",
                      v: `-$${fmt(selectedOrder.discount)}`,
                      color: W.success,
                    },
                  ].map((r) => (
                    <div
                      key={r.l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: W.textSecondary }}>{r.l}</span>
                      <span style={{ color: r.color || W.textPrimary }}>
                        {r.v}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      borderTop: `1px solid ${W.borderSubtle}`,
                      paddingTop: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: W.textPrimary,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: W.textPrimary,
                      }}
                    >
                      ${fmt(selectedOrder.total)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: W.textSecondary }}>Paid</span>
                    <span style={{ color: W.success, fontWeight: 600 }}>
                      ${fmt(selectedOrder.paid)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: selectedOrder.balance > 0 ? W.danger : W.success,
                      }}
                    >
                      {selectedOrder.balance > 0
                        ? "Balance Due"
                        : "Fully Settled"}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: selectedOrder.balance > 0 ? W.danger : W.success,
                      }}
                    >
                      ${fmt(selectedOrder.balance)}
                    </span>
                  </div>
                  {selectedOrder.total > 0 && (
                    <div>
                      <div
                        style={{
                          height: 4,
                          background: W.subtleBg,
                          borderRadius: 4,
                          marginTop: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${W.success}, #34C759)`,
                            width: `${Math.min((selectedOrder.paid / selectedOrder.total) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: W.textCaption,
                          marginTop: 2,
                          textAlign: "right",
                        }}
                      >
                        {Math.round(
                          (selectedOrder.paid / selectedOrder.total) * 100,
                        )}
                        % paid
                      </div>
                    </div>
                  )}
                </div>
                {selectedOrder.balance > 0 && (
                  <button
                    onClick={() => setShowPayment(true)}
                    style={{
                      ...primaryBtn,
                      width: "100%",
                      justifyContent: "center",
                      marginTop: 8,
                    }}
                  >
                    <CreditCard size={12} />
                    Record Payment
                  </button>
                )}
              </div>
            </div>

            {/* Detail Sub-tabs */}
            <div
              style={{
                background: W.surfaceBg,
                borderBottom: `1px solid ${W.borderSubtle}`,
                padding: "0 18px",
                display: "flex",
                flexShrink: 0,
              }}
            >
              {(
                [
                  {
                    id: "items",
                    label: `Line Items (${lineItems.length})`,
                    icon: <ClipboardList size={12} />,
                  },
                  {
                    id: "payments",
                    label: "Payments",
                    icon: <CreditCard size={12} />,
                  },
                  {
                    id: "history",
                    label: "Activity Log",
                    icon: <Clock size={12} />,
                  },
                ] as { id: DetailTab; label: string; icon: React.ReactNode }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  style={{
                    padding: "9px 14px",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: "none",
                    borderBottom: `2px solid ${detailTab === tab.id ? W.accent : "transparent"}`,
                    background: "transparent",
                    color: detailTab === tab.id ? W.accent : W.textSecondary,
                    fontWeight: detailTab === tab.id ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  paddingBottom: 2,
                }}
              >
                <button style={toolBtn}>
                  <Download size={12} />
                </button>
                <button style={toolBtn}>
                  <Printer size={12} />
                </button>
              </div>
            </div>

            {/* Detail Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px" }}>
              {detailTab === "items" && (
                <div
                  style={{
                    background: W.cardBg,
                    borderRadius: W.r8,
                    boxShadow: W.shadowCard,
                    overflow: "hidden",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 12,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: W.subtleBg,
                          borderBottom: `1px solid ${W.borderSubtle}`,
                        }}
                      >
                        {[
                          "#",
                          "Drug / Product",
                          "Category",
                          "Ordered",
                          "Received",
                          "Unit Cost",
                          "Total",
                          "Inventory Impact",
                          "Lot / Expiry",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "8px 10px",
                              textAlign: ["Unit Cost", "Total"].includes(h)
                                ? "right"
                                : "center" === h
                                  ? "center"
                                  : "left",
                              fontSize: 10,
                              fontWeight: 700,
                              color: W.textCaption,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item, idx) => {
                        const fullRcv = item.receivedQty >= item.qty;
                        const projected =
                          item.currentStock + item.pendingStock + item.qty;
                        const overstock =
                          projected > item.currentStock * 3 &&
                          item.currentStock > 60;
                        return (
                          <tr
                            key={item.id}
                            style={{
                              borderBottom: `1px solid ${W.borderSubtle}`,
                            }}
                          >
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                color: W.textCaption,
                              }}
                            >
                              {idx + 1}
                            </td>
                            <td style={{ padding: "10px" }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: W.textPrimary,
                                }}
                              >
                                {item.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  fontFamily: "monospace",
                                  color: W.textCaption,
                                }}
                              >
                                {item.sku}
                              </div>
                            </td>
                            <td style={{ padding: "10px" }}>
                              <span
                                style={{
                                  background: "#EDE7F6",
                                  color: "#5E35B1",
                                  borderRadius: W.r4,
                                  padding: "2px 8px",
                                  fontSize: 11,
                                  fontWeight: 500,
                                }}
                              >
                                {item.category}
                              </span>
                            </td>
                            <td
                              style={{ padding: "10px", textAlign: "center" }}
                            >
                              <span style={{ fontWeight: 500 }}>
                                {item.qty}
                              </span>
                              <span
                                style={{ color: W.textCaption, marginLeft: 3 }}
                              >
                                {item.unit}
                              </span>
                            </td>
                            <td
                              style={{ padding: "10px", textAlign: "center" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 3,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  {fullRcv ? (
                                    <CheckCircle2
                                      size={11}
                                      style={{ color: W.success }}
                                    />
                                  ) : (
                                    <Clock
                                      size={11}
                                      style={{ color: W.caution }}
                                    />
                                  )}
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: fullRcv ? W.success : W.caution,
                                    }}
                                  >
                                    {item.receivedQty}/{item.qty}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    width: 44,
                                    height: 3,
                                    background: W.subtleBg,
                                    borderRadius: 3,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      height: "100%",
                                      background: fullRcv
                                        ? W.success
                                        : W.caution,
                                      width: `${(item.receivedQty / item.qty) * 100}%`,
                                      borderRadius: 3,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "right",
                                color: W.textSecondary,
                              }}
                            >
                              ${fmt(item.unitCost)}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "right",
                                fontWeight: 700,
                                color: W.textPrimary,
                              }}
                            >
                              ${fmt(item.total)}
                            </td>
                            <td style={{ padding: "10px" }}>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: W.textCaption,
                                  lineHeight: 1.6,
                                }}
                              >
                                <div>
                                  Stock:{" "}
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: W.textPrimary,
                                    }}
                                  >
                                    {item.currentStock}
                                  </span>{" "}
                                  →{" "}
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: overstock ? W.danger : W.success,
                                    }}
                                  >
                                    {projected}
                                  </span>
                                </div>
                                {item.pendingStock > 0 && (
                                  <div>+{item.pendingStock} other PO</div>
                                )}
                                {overstock && (
                                  <span
                                    style={{ fontSize: 10, color: W.danger }}
                                  >
                                    ⚠ Overstock
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "10px" }}>
                              <div
                                style={{
                                  fontSize: 11,
                                  fontFamily: "monospace",
                                  color: W.textCaption,
                                }}
                              >
                                <div>{item.lot}</div>
                                <div>Exp {item.expiry}</div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr
                        style={{
                          background: W.subtleBg,
                          borderTop: `1px solid ${W.borderDefault}`,
                        }}
                      >
                        <td
                          colSpan={6}
                          style={{
                            padding: "9px 10px",
                            textAlign: "right",
                            fontWeight: 700,
                            fontSize: 12,
                            color: W.textSecondary,
                          }}
                        >
                          Order Total
                        </td>
                        <td
                          style={{
                            padding: "9px 10px",
                            textAlign: "right",
                            fontWeight: 800,
                            fontSize: 14,
                            color: W.textPrimary,
                          }}
                        >
                          ${fmt(lineItems.reduce((a, i) => a + i.total, 0))}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {detailTab === "payments" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <div
                    style={{
                      background: W.cardBg,
                      borderRadius: W.r8,
                      boxShadow: W.shadowCard,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 14px",
                        borderBottom: `1px solid ${W.borderSubtle}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        Payment Records
                      </span>
                      <button
                        onClick={() => setShowPayment(true)}
                        style={{ ...primaryBtn, fontSize: 12 }}
                      >
                        <Plus size={11} />
                        Add Payment
                      </button>
                    </div>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 12,
                      }}
                    >
                      <thead>
                        <tr style={{ background: W.subtleBg }}>
                          {[
                            "Date",
                            "Method",
                            "Reference",
                            "Amount",
                            "Status",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "7px 12px",
                                textAlign: h === "Amount" ? "right" : "left",
                                fontSize: 10,
                                fontWeight: 700,
                                color: W.textCaption,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr
                            key={p.id}
                            style={{ borderTop: `1px solid ${W.borderSubtle}` }}
                          >
                            <td
                              style={{
                                padding: "10px 12px",
                                color: W.textSecondary,
                              }}
                            >
                              {p.date}
                            </td>
                            <td
                              style={{ padding: "10px 12px", fontWeight: 500 }}
                            >
                              {p.method}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                fontFamily: "monospace",
                                fontSize: 11,
                                color: W.textCaption,
                              }}
                            >
                              {p.ref}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "right",
                                fontWeight: 700,
                                color: W.success,
                              }}
                            >
                              ${fmt(p.amount)}
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <Tag
                                bg={W.successBg}
                                color={W.success}
                                border={W.successBorder}
                              >
                                <CheckCircle2 size={10} />
                                Cleared
                              </Tag>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedOrder.balance > 0 && (
                    <div
                      style={{
                        background: W.dangerBg,
                        border: `1px solid ${W.dangerBorder}`,
                        borderRadius: W.r8,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            color: W.danger,
                            fontWeight: 600,
                          }}
                        >
                          Outstanding Balance
                        </div>
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: W.danger,
                          }}
                        >
                          ${fmt(selectedOrder.balance)}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: W.textCaption,
                            marginTop: 2,
                          }}
                        >
                          Due: {selectedOrder.expectedDelivery} ·{" "}
                          {selectedOrder.terms}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPayment(true)}
                        style={{
                          padding: "8px 18px",
                          borderRadius: W.r8,
                          border: "none",
                          background: W.danger,
                          color: W.textOnAccent,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <CreditCard size={14} />
                        Record Payment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "history" && (
                <div
                  style={{
                    background: W.cardBg,
                    borderRadius: W.r8,
                    boxShadow: W.shadowCard,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: W.textCaption,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 14,
                    }}
                  >
                    Order Activity
                  </div>
                  {history.map((ev, i) => {
                    const colors: Record<HistoryEvent["type"], string> = {
                      payment: W.success,
                      submit: W.accent,
                      approve: "#8764B8",
                      receive: W.caution,
                      create: W.textCaption,
                      note: W.textCaption,
                      cancel: W.danger,
                    };
                    const icons: Record<HistoryEvent["type"], React.ReactNode> =
                      {
                        payment: <DollarSign size={11} />,
                        submit: <Send size={11} />,
                        approve: <ShieldCheck size={11} />,
                        receive: <Package size={11} />,
                        create: <Plus size={11} />,
                        note: <FileText size={11} />,
                        cancel: <Ban size={11} />,
                      };
                    return (
                      <div key={i} style={{ display: "flex", gap: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: 26,
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: colors[ev.type] + "20",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: colors[ev.type],
                            }}
                          >
                            {icons[ev.type]}
                          </div>
                          {i < history.length - 1 && (
                            <div
                              style={{
                                width: 1,
                                flex: 1,
                                minHeight: 14,
                                background: W.borderSubtle,
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, paddingBottom: 14 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: W.textPrimary,
                            }}
                          >
                            {ev.event}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              fontSize: 11,
                              color: W.textCaption,
                              marginTop: 2,
                            }}
                          >
                            <span>
                              {ev.date} at {ev.time}
                            </span>
                            <span>·</span>
                            <span>{ev.user}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status bar */}
            <div
              style={{
                background: W.titleBarBg,
                borderTop: `1px solid ${W.borderSubtle}`,
                padding: "5px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 11,
                  color: W.textCaption,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={10} style={{ color: W.success }} />
                  PharmaCare ERP · Synced
                </span>
                <span>Last sync: 2 min ago</span>
                <span>FY 2025–2026</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 11,
                  color: W.textCaption,
                }}
              >
                <span>Viewing {selectedOrder.poNumber}</span>
                <span style={{ color: W.accent, cursor: "pointer" }}>
                  Audit Trail
                </span>
                <span style={{ color: W.accent, cursor: "pointer" }}>Help</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Style Atoms ─────────────────────────────────────────────────*/
const primaryBtn: CSSProperties = {
  padding: "6px 14px",
  borderRadius: W.r6,
  border: "none",
  background: W.accent,
  color: W.textOnAccent,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  flexShrink: 0,
};
const secondaryBtn: CSSProperties = {
  padding: "6px 14px",
  borderRadius: W.r6,
  border: `1px solid ${W.borderDefault}`,
  background: W.surfaceBg,
  color: W.textPrimary,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  border: `1px solid ${W.borderDefault}`,
  borderRadius: W.r6,
  fontSize: 12,
  background: W.subtleBg,
  color: W.textPrimary,
  boxSizing: "border-box",
  outline: "none",
};
const toolBtn: CSSProperties = {
  padding: 6,
  borderRadius: W.r4,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: W.textSecondary,
  display: "flex",
  alignItems: "center",
};
const qbtn: CSSProperties = {
  padding: "3px 8px",
  borderRadius: W.r4,
  border: `1px solid ${W.borderDefault}`,
  background: W.surfaceBg,
  fontSize: 11,
  cursor: "pointer",
  color: W.textSecondary,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};
const card: CSSProperties = {
  background: W.cardBg,
  borderRadius: W.r8,
  boxShadow: W.shadowCard,
  padding: "14px 16px",
};
const cardHeader: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: W.textPrimary,
  marginBottom: 12,
  display: "block",
} as CSSProperties;
const labelStyle: CSSProperties = {
  fontSize: 12,
  color: W.textSecondary,
  display: "block",
  marginBottom: 5,
  fontWeight: 500,
};
