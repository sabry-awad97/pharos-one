import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Plus,
  Minus,
  Square,
  Trash2,
  ChevronDown,
  ChevronRight,
  User,
  Truck,
  CreditCard,
  Printer,
  ReceiptText,
  ShoppingCart,
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Phone,
  MapPin,
  Star,
  Tag,
  Barcode,
  FileText,
  Percent,
  DollarSign,
  ArrowRight,
  UserCheck,
  Bike,
  Home,
  Store,
  Zap,
  RefreshCw,
  Save,
  MoreVertical,
  Edit2,
  ScanLine,
  Filter,
  Grid,
  List,
  ChevronUp,
  Badge,
  Info,
  Calendar,
  Hash,
  Shield,
  Activity,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Dialog =
  | null
  | "productSearch"
  | "customerSelect"
  | "deliveryService"
  | "payment";
interface CartItem {
  id: number;
  drugId: number;
  name: string;
  sku: string;
  batch: string;
  expiry: string;
  qty: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  prescription: boolean;
  category: string;
}
interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: string;
  address: string;
  lastVisit: string;
}
interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  zone: string;
  active: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const DRUGS = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    sku: "AMX-500",
    batch: "BT-2401",
    expiry: "2026-03",
    price: 12.5,
    stock: 240,
    category: "Antibiotic",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 2,
    name: "Paracetamol 650mg",
    sku: "PCT-650",
    batch: "BT-2402",
    expiry: "2025-09",
    price: 4.2,
    stock: 18,
    category: "Analgesic",
    taxRate: 5,
    prescription: false,
  },
  {
    id: 3,
    name: "Metformin 500mg",
    sku: "MET-500",
    batch: "BT-2403",
    expiry: "2026-08",
    price: 8.75,
    stock: 302,
    category: "Antidiabetic",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    sku: "OMZ-020",
    batch: "BT-2404",
    expiry: "2025-06",
    price: 15.0,
    stock: 85,
    category: "GI",
    taxRate: 12,
    prescription: false,
  },
  {
    id: 5,
    name: "Lisinopril 5mg",
    sku: "LSN-005",
    batch: "BT-2405",
    expiry: "2027-01",
    price: 9.9,
    stock: 145,
    category: "ACE Inhibitor",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 6,
    name: "Cetirizine 10mg",
    sku: "CTZ-010",
    batch: "BT-2406",
    expiry: "2025-08",
    price: 6.4,
    stock: 12,
    category: "Antihistamine",
    taxRate: 5,
    prescription: false,
  },
  {
    id: 7,
    name: "Azithromycin 250mg",
    sku: "AZT-250",
    batch: "BT-2407",
    expiry: "2025-05",
    price: 18.6,
    stock: 67,
    category: "Antibiotic",
    taxRate: 12,
    prescription: true,
  },
  {
    id: 8,
    name: "Ibuprofen 400mg",
    sku: "IBU-400",
    batch: "BT-2408",
    expiry: "2027-03",
    price: 5.1,
    stock: 389,
    category: "NSAID",
    taxRate: 5,
    prescription: false,
  },
  {
    id: 9,
    name: "Losartan 50mg",
    sku: "LST-050",
    batch: "BT-2409",
    expiry: "2026-06",
    price: 11.2,
    stock: 203,
    category: "ARB",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 10,
    name: "Atorvastatin 10mg",
    sku: "ATV-010",
    batch: "BT-2410",
    expiry: "2026-11",
    price: 22.3,
    stock: 54,
    category: "Statin",
    taxRate: 12,
    prescription: true,
  },
  {
    id: 11,
    name: "Pantoprazole 40mg",
    sku: "PNT-040",
    batch: "BT-2411",
    expiry: "2025-07",
    price: 19.8,
    stock: 7,
    category: "GI",
    taxRate: 12,
    prescription: false,
  },
  {
    id: 12,
    name: "Sertraline 50mg",
    sku: "SRT-050",
    batch: "BT-2412",
    expiry: "2026-10",
    price: 28.5,
    stock: 94,
    category: "SSRI",
    taxRate: 12,
    prescription: true,
  },
  {
    id: 13,
    name: "Vitamin D3 60K IU",
    sku: "VTD-060",
    batch: "BT-2413",
    expiry: "2027-06",
    price: 7.5,
    stock: 412,
    category: "Supplement",
    taxRate: 0,
    prescription: false,
  },
  {
    id: 14,
    name: "Metronidazole 400mg",
    sku: "MTZ-400",
    batch: "BT-2414",
    expiry: "2026-02",
    price: 6.8,
    stock: 188,
    category: "Antibiotic",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 15,
    name: "Salbutamol Inhaler",
    sku: "SBT-INH",
    batch: "BT-2415",
    expiry: "2025-11",
    price: 85.0,
    stock: 23,
    category: "Respiratory",
    taxRate: 12,
    prescription: true,
  },
  {
    id: 16,
    name: "Clonazepam 0.5mg",
    sku: "CLZ-005",
    batch: "BT-2416",
    expiry: "2026-07",
    price: 14.2,
    stock: 41,
    category: "CNS",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 17,
    name: "Amlodipine 5mg",
    sku: "AML-005",
    batch: "BT-2417",
    expiry: "2027-02",
    price: 8.4,
    stock: 267,
    category: "CCB",
    taxRate: 5,
    prescription: true,
  },
  {
    id: 18,
    name: "Folic Acid 5mg",
    sku: "FOL-005",
    batch: "BT-2418",
    expiry: "2027-09",
    price: 2.9,
    stock: 340,
    category: "Supplement",
    taxRate: 0,
    prescription: false,
  },
];

const CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Anjali Sharma",
    phone: "98765 43210",
    email: "anjali@email.com",
    points: 1240,
    tier: "Gold",
    address: "12A, MG Road, Bengaluru",
    lastVisit: "2026-03-15",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    phone: "91234 56789",
    email: "rajesh@email.com",
    points: 450,
    tier: "Silver",
    address: "45, Park Street, Mumbai",
    lastVisit: "2026-03-10",
  },
  {
    id: 3,
    name: "Priya Nair",
    phone: "87654 32109",
    email: "priya@email.com",
    points: 3890,
    tier: "Platinum",
    address: "8, Anna Nagar, Chennai",
    lastVisit: "2026-03-20",
  },
  {
    id: 4,
    name: "Suresh Mehta",
    phone: "76543 21098",
    email: "suresh@email.com",
    points: 120,
    tier: "Bronze",
    address: "22, Civil Lines, Delhi",
    lastVisit: "2026-02-28",
  },
  {
    id: 5,
    name: "Meena Krishnan",
    phone: "65432 10987",
    email: "meena@email.com",
    points: 2100,
    tier: "Gold",
    address: "5, Koregaon Park, Pune",
    lastVisit: "2026-03-18",
  },
  {
    id: 6,
    name: "Arjun Patel",
    phone: "54321 09876",
    email: "arjun@email.com",
    points: 780,
    tier: "Silver",
    address: "3, Residency Road, Hyd",
    lastVisit: "2026-03-12",
  },
];

const DELIVERY_PERSONS: DeliveryPerson[] = [
  {
    id: 1,
    name: "Ravi Singh",
    phone: "90000 11111",
    vehicle: "Two-Wheeler",
    zone: "Zone A – North",
    active: true,
  },
  {
    id: 2,
    name: "Kiran Das",
    phone: "90000 22222",
    vehicle: "Bicycle",
    zone: "Zone B – South",
    active: true,
  },
  {
    id: 3,
    name: "Mohan Lal",
    phone: "90000 33333",
    vehicle: "Two-Wheeler",
    zone: "Zone C – East",
    active: false,
  },
  {
    id: 4,
    name: "Sunil Yadav",
    phone: "90000 44444",
    vehicle: "Three-Wheeler",
    zone: "Zone D – West",
    active: true,
  },
];

const CATEGORIES = [
  "All",
  "Antibiotic",
  "Analgesic",
  "GI",
  "Antidiabetic",
  "Supplement",
  "Respiratory",
  "NSAID",
  "CCB",
  "Statin",
  "SSRI",
  "CNS",
  "ARB",
  "ACE Inhibitor",
  "Antihistamine",
];
const SERVICES = [
  {
    id: "store_pickup",
    icon: Store,
    label: "Store Pickup",
    sub: "Ready in 10 min",
    fee: 0,
  },
  {
    id: "home_delivery",
    icon: Home,
    label: "Home Delivery",
    sub: "45–60 min estimated",
    fee: 40,
  },
  {
    id: "express_delivery",
    icon: Zap,
    label: "Express Delivery",
    sub: "20 min guaranteed",
    fee: 80,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const W = {
  // Windows 11 color tokens
  bg: "#f3f3f3",
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  border: "#e0e0e0",
  borderLight: "#ebebeb",
  accent: "#0078d4",
  accentHover: "#106ebe",
  accentLight: "#cce4f7",
  text: "#1a1a1a",
  textSub: "#616161",
  textMuted: "#919191",
  success: "#107c10",
  successBg: "#dff6dd",
  warn: "#7a5e00",
  warnBg: "#fff4ce",
  danger: "#a4262c",
  dangerBg: "#fde7e9",
  info: "#0078d4",
  infoBg: "#cce4f7",
  titleBar: "#f0f0f0",
  statusBar: "#0078d4",
};
const seg: React.CSSProperties = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
};
const tierColor: Record<string, string> = {
  Bronze: "#b5651d",
  Silver: "#718096",
  Gold: "#b8860b",
  Platinum: "#6b69d6",
};

function TBtn({
  children,
  accent,
  ghost,
  danger,
  onClick,
  disabled,
  style,
}: any) {
  const [hov, setHov] = useState(false);
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 14px",
    height: 30,
    borderRadius: 4,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 12,
    fontWeight: accent ? 600 : 400,
    transition: "background 0.1s",
    opacity: disabled ? 0.5 : 1,
    background: accent
      ? hov
        ? W.accentHover
        : W.accent
      : danger
        ? hov
          ? "#fde7e9"
          : "#fff0f0"
        : ghost
          ? hov
            ? "#f0f0f0"
            : "transparent"
          : hov
            ? "#f0f0f0"
            : W.surface,
    color: accent ? "white" : danger ? W.danger : W.text,
    boxShadow:
      !accent && !ghost
        ? "0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px #d1d1d1"
        : undefined,
    ...style,
  };
  return (
    <button
      style={base}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

function IBtn({
  icon: Icon,
  title,
  color = "#616161",
  size = 28,
  onClick,
}: any) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        background: hov ? `${color}15` : "transparent",
        color: hov ? color : W.textMuted,
        transition: "all 0.1s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Icon style={{ width: 13, height: 13 }} />
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function PharmacyPOS() {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      drugId: 1,
      name: "Amoxicillin 500mg",
      sku: "AMX-500",
      batch: "BT-2401",
      expiry: "2026-03",
      qty: 2,
      unitPrice: 12.5,
      discount: 0,
      taxRate: 5,
      prescription: true,
      category: "Antibiotic",
    },
    {
      id: 2,
      drugId: 2,
      name: "Paracetamol 650mg",
      sku: "PCT-650",
      batch: "BT-2402",
      expiry: "2025-09",
      qty: 3,
      unitPrice: 4.2,
      discount: 10,
      taxRate: 5,
      prescription: false,
      category: "Analgesic",
    },
    {
      id: 3,
      drugId: 4,
      name: "Omeprazole 20mg",
      sku: "OMZ-020",
      batch: "BT-2404",
      expiry: "2025-06",
      qty: 1,
      unitPrice: 15.0,
      discount: 0,
      taxRate: 12,
      prescription: false,
      category: "GI",
    },
    {
      id: 4,
      drugId: 8,
      name: "Ibuprofen 400mg",
      sku: "IBU-400",
      batch: "BT-2408",
      expiry: "2027-03",
      qty: 2,
      unitPrice: 5.1,
      discount: 5,
      taxRate: 5,
      prescription: false,
      category: "NSAID",
    },
  ]);
  const [customer, setCustomer] = useState<Customer | null>(CUSTOMERS[2]);
  const [delivery, setDelivery] = useState<DeliveryPerson | null>(null);
  const [service, setService] = useState("store_pickup");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [catalogQ, setCatalogQ] = useState("");
  const [catalogCat, setCatalogCat] = useState("All");
  const [cartView, setCartView] = useState<"table" | "compact">("table");
  const nextId = useRef(10);

  // Computed totals
  const lineTotal = (item: CartItem) => item.qty * item.unitPrice;
  const lineDisc = (item: CartItem) => (lineTotal(item) * item.discount) / 100;
  const lineTax = (item: CartItem) =>
    ((lineTotal(item) - lineDisc(item)) * item.taxRate) / 100;
  const lineNet = (item: CartItem) =>
    lineTotal(item) - lineDisc(item) + lineTax(item);
  const subtotal = cart.reduce((s, i) => s + lineTotal(i), 0);
  const totalDisc = cart.reduce((s, i) => s + lineDisc(i), 0);
  const totalTax = cart.reduce((s, i) => s + lineTax(i), 0);
  const delivFee = SERVICES.find((s) => s.id === service)?.fee ?? 0;
  const couponDisc = couponApplied ? (subtotal - totalDisc) * 0.05 : 0;
  const grandTotal = subtotal - totalDisc + totalTax + delivFee - couponDisc;

  const addToCart = (drug: (typeof DRUGS)[0]) => {
    const existing = cart.find((c) => c.drugId === drug.id);
    if (existing) {
      setCart(
        cart.map((c) => (c.drugId === drug.id ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([
        ...cart,
        {
          id: nextId.current++,
          drugId: drug.id,
          name: drug.name,
          sku: drug.sku,
          batch: drug.batch,
          expiry: drug.expiry,
          qty: 1,
          unitPrice: drug.price,
          discount: 0,
          taxRate: drug.taxRate,
          prescription: drug.prescription,
          category: drug.category,
        },
      ]);
    }
    setDialog(null);
  };

  const updateCart = (id: number, field: keyof CartItem, val: any) =>
    setCart(cart.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  const removeFromCart = (id: number) =>
    setCart(cart.filter((c) => c.id !== id));

  const filteredCatalog = DRUGS.filter(
    (d) =>
      (catalogCat === "All" || d.category === catalogCat) &&
      (d.name.toLowerCase().includes(catalogQ.toLowerCase()) ||
        d.sku.toLowerCase().includes(catalogQ.toLowerCase())),
  );

  return (
    <div
      style={{
        ...seg,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: W.bg,
        color: W.text,
        fontSize: 12,
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* ── TITLE BAR ── */}
      <TitleBar />

      {/* ── RIBBON ── */}
      <div
        style={{
          background: W.surface,
          borderBottom: `1px solid ${W.border}`,
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingRight: 12,
            marginRight: 4,
            borderRight: `1px solid ${W.border}`,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: W.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pill style={{ width: 10, height: 10, color: "white" }} />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: W.accent,
              letterSpacing: "-0.2px",
            }}
          >
            POS
          </span>
        </div>

        <TBtn accent onClick={() => setDialog("productSearch")}>
          <Search style={{ width: 13, height: 13 }} /> Add Product{" "}
          <span style={{ fontSize: 10, opacity: 0.7 }}>F1</span>
        </TBtn>
        <TBtn onClick={() => setDialog("customerSelect")}>
          <User style={{ width: 13, height: 13 }} />
          {customer ? customer.name.split(" ")[0] : "Select Customer"}
          <ChevronDown style={{ width: 11, height: 11, color: W.textMuted }} />
        </TBtn>
        <TBtn onClick={() => setDialog("deliveryService")}>
          <Truck style={{ width: 13, height: 13 }} />
          {SERVICES.find((s) => s.id === service)?.label ?? "Service"}
          <ChevronDown style={{ width: 11, height: 11, color: W.textMuted }} />
        </TBtn>

        <div
          style={{
            width: 1,
            height: 28,
            background: W.border,
            margin: "0 4px",
          }}
        />
        <TBtn ghost>
          <Save style={{ width: 13, height: 13 }} /> Hold
        </TBtn>
        <TBtn ghost>
          <Printer style={{ width: 13, height: 13 }} /> Print
        </TBtn>
        <TBtn ghost>
          <RefreshCw style={{ width: 13, height: 13 }} /> New
        </TBtn>

        <div style={{ flex: 1 }} />

        {/* Session info */}
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingRight: 8,
            color: W.textSub,
            fontSize: 11,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock style={{ width: 11, height: 11 }} /> Shift 2 &nbsp;·&nbsp;
            14:32
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <UserCheck style={{ width: 11, height: 11 }} /> Dr. Ravi K.
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Hash style={{ width: 11, height: 11 }} /> TXN-2026-0847
          </span>
        </div>

        <TBtn
          accent
          onClick={() => setDialog("payment")}
          disabled={cart.length === 0}
        >
          <CreditCard style={{ width: 13, height: 13 }} /> Pay &nbsp;₹
          {grandTotal.toFixed(2)}{" "}
          <span style={{ fontSize: 10, opacity: 0.7 }}>F10</span>
        </TBtn>
      </div>

      {/* ── BODY: 3-panel ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* LEFT — Product Catalog */}
        <div
          style={{
            width: 300,
            background: W.surface,
            borderRight: `1px solid ${W.border}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: `1px solid ${W.borderLight}`,
              background: W.surfaceAlt,
            }}
          >
            <div style={{ position: "relative" }}>
              <ScanLine
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 14,
                  height: 14,
                  color: W.accent,
                }}
              />
              <input
                autoFocus
                placeholder="Scan barcode or drug name…"
                value={catalogQ}
                onChange={(e) => setCatalogQ(e.target.value)}
                style={{
                  width: "100%",
                  height: 30,
                  paddingLeft: 30,
                  paddingRight: 10,
                  fontSize: 12,
                  border: `1.5px solid ${W.accent}`,
                  borderRadius: 4,
                  background: W.surface,
                  color: W.text,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Category filters */}
          <div
            style={{
              padding: "6px 8px",
              borderBottom: `1px solid ${W.borderLight}`,
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setCatalogCat(cat)}
                style={{
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "none",
                  background: catalogCat === cat ? W.accent : "#f0f0f0",
                  color: catalogCat === cat ? "white" : W.textSub,
                  transition: "all 0.1s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Drug list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredCatalog.length === 0 ? (
              <div
                style={{
                  padding: 20,
                  textAlign: "center",
                  color: W.textMuted,
                  fontSize: 11,
                }}
              >
                No drugs found
              </div>
            ) : (
              filteredCatalog.map((drug) => {
                const inCart = cart.some((c) => c.drugId === drug.id);
                return (
                  <CatalogRow
                    key={drug.id}
                    drug={drug}
                    inCart={inCart}
                    onAdd={() => addToCart(drug)}
                  />
                );
              })
            )}
          </div>

          {/* Advanced search link */}
          <div
            style={{
              padding: "8px 10px",
              borderTop: `1px solid ${W.borderLight}`,
              background: W.surfaceAlt,
            }}
          >
            <button
              onClick={() => setDialog("productSearch")}
              style={{
                width: "100%",
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                border: `1px dashed ${W.border}`,
                borderRadius: 4,
                background: "transparent",
                color: W.textSub,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              <Search style={{ width: 12, height: 12 }} /> Advanced Search &
              Batch Selection
            </button>
          </div>
        </div>

        {/* CENTER — Cart Table */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: W.bg,
          }}
        >
          {/* Cart toolbar */}
          <div
            style={{
              background: W.surface,
              borderBottom: `1px solid ${W.border}`,
              height: 34,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11, color: W.textSub }}>
              <b style={{ color: W.text }}>{cart.length}</b> items in cart
            </span>
            {cart.some((c) => c.prescription) && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 10,
                  color: "#6b69d6",
                  background: "#ebe9fc",
                  padding: "2px 7px",
                  borderRadius: 10,
                }}
              >
                <Shield style={{ width: 10, height: 10 }} /> Rx Required
              </span>
            )}
            <div style={{ flex: 1 }} />
            <button
              onClick={() =>
                setCartView(cartView === "table" ? "compact" : "table")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "0 8px",
                height: 24,
                border: `1px solid ${W.border}`,
                borderRadius: 4,
                background: W.surface,
                color: W.textSub,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {cartView === "table" ? (
                <List style={{ width: 12, height: 12 }} />
              ) : (
                <Grid style={{ width: 12, height: 12 }} />
              )}
              {cartView === "table" ? "Compact" : "Detailed"}
            </button>
            <button
              onClick={() => setCart([])}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "0 8px",
                height: 24,
                border: `1px solid ${W.border}`,
                borderRadius: 4,
                background: W.surface,
                color: W.danger,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              <Trash2 style={{ width: 11, height: 11 }} /> Clear Cart
            </button>
          </div>

          {/* Cart Table */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: W.textMuted,
                }}
              >
                <ShoppingCart
                  style={{
                    width: 40,
                    height: 40,
                    marginBottom: 12,
                    opacity: 0.25,
                  }}
                />
                <p style={{ fontSize: 13, margin: 0 }}>Cart is empty</p>
                <p style={{ fontSize: 11, margin: "4px 0 0" }}>
                  Add products from the catalog
                </p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: W.surface,
                      borderBottom: `1px solid ${W.border}`,
                      position: "sticky",
                      top: 0,
                      zIndex: 5,
                    }}
                  >
                    {[
                      { l: "#", w: 30 },
                      { l: "Drug / Item", w: "auto" },
                      { l: "Batch", w: 80 },
                      { l: "Expiry", w: 72 },
                      { l: "Qty", w: 72 },
                      { l: "Unit Price", w: 80 },
                      { l: "Disc %", w: 68 },
                      { l: "Tax %", w: 60 },
                      { l: "Total", w: 86 },
                      { l: "", w: 50 },
                    ].map(({ l, w }) => (
                      <th
                        key={l}
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          fontSize: 10,
                          fontWeight: 600,
                          color: W.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          width: typeof w === "number" ? w : undefined,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <CartRow
                      key={item.id}
                      item={item}
                      idx={idx}
                      lineNet={lineNet(item)}
                      onQty={(v: number) =>
                        updateCart(item.id, "qty", Math.max(1, v))
                      }
                      onDisc={(v: number) =>
                        updateCart(
                          item.id,
                          "discount",
                          Math.min(100, Math.max(0, v)),
                        )
                      }
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr
                    style={{
                      background: W.surfaceAlt,
                      borderTop: `2px solid ${W.border}`,
                    }}
                  >
                    <td colSpan={4} style={{ padding: "8px 8px" }}>
                      <span style={{ fontSize: 11, color: W.textSub }}>
                        {cart.filter((c) => c.prescription).length > 0 && (
                          <span style={{ color: "#6b69d6" }}>
                            ⚕ {cart.filter((c) => c.prescription).length} Rx
                            item(s) — prescription verification required
                          </span>
                        )}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: W.text,
                      }}
                    >
                      {cart.reduce((s, i) => s + i.qty, 0)} units
                    </td>
                    <td
                      style={{
                        padding: "8px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: W.text,
                      }}
                    >
                      ₹{subtotal.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "8px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: W.danger,
                      }}
                    >
                      −₹{totalDisc.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "8px 8px",
                        fontSize: 12,
                        color: W.textSub,
                      }}
                    >
                      ₹{totalTax.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "8px 8px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: W.accent,
                      }}
                    >
                      ₹{(subtotal - totalDisc + totalTax).toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Status bar */}
          <div
            style={{
              height: 26,
              background: W.accent,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {[
              { l: "Items", v: cart.length },
              { l: "Units", v: cart.reduce((s, i) => s + i.qty, 0) },
              { l: "Subtotal", v: `₹${subtotal.toFixed(2)}` },
              { l: "Discount", v: `₹${totalDisc.toFixed(2)}` },
              { l: "Tax", v: `₹${totalTax.toFixed(2)}` },
            ].map(({ l, v }) => (
              <span
                key={l}
                style={{ fontSize: 11, color: "rgba(255,255,255,.85)" }}
              >
                <b style={{ color: "white" }}>{l}:</b> {v}
              </span>
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.55)" }}>
              Del ← Remove · F2 Edit · Ctrl+Z Undo
            </span>
          </div>
        </div>

        {/* RIGHT — Summary & Payment */}
        <div
          style={{
            width: 272,
            background: W.surface,
            borderLeft: `1px solid ${W.border}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Customer card */}
          <SectionHeader
            icon={User}
            label="Customer"
            action="Change"
            onAction={() => setDialog("customerSelect")}
          />
          <div
            style={{
              padding: "8px 12px",
              borderBottom: `1px solid ${W.borderLight}`,
            }}
          >
            {customer ? (
              <div
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: W.accentLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: W.accent,
                    flexShrink: 0,
                  }}
                >
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 600, color: W.text }}
                    >
                      {customer.name}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "1px 6px",
                        borderRadius: 10,
                        background:
                          customer.tier === "Platinum"
                            ? "#ebe9fc"
                            : customer.tier === "Gold"
                              ? "#fff4ce"
                              : customer.tier === "Silver"
                                ? "#f0f0f0"
                                : "#fed9cc",
                        color: tierColor[customer.tier],
                        fontWeight: 600,
                      }}
                    >
                      {customer.tier}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: W.textSub }}>
                    {customer.phone}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <Star style={{ width: 10, height: 10, color: "#b8860b" }} />
                    <span style={{ fontSize: 10, color: W.textSub }}>
                      {customer.points.toLocaleString()} pts
                    </span>
                    <span style={{ fontSize: 10, color: W.textMuted }}>
                      · Last: {customer.lastVisit}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDialog("customerSelect")}
                style={{
                  width: "100%",
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  border: `1px dashed ${W.border}`,
                  borderRadius: 4,
                  background: W.surfaceAlt,
                  color: W.textSub,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <Plus style={{ width: 13, height: 13 }} /> Select Customer or
                Walk-in
              </button>
            )}
          </div>

          {/* Service */}
          <SectionHeader
            icon={Truck}
            label="Fulfillment"
            action="Edit"
            onAction={() => setDialog("deliveryService")}
          />
          <div
            style={{
              padding: "6px 12px",
              borderBottom: `1px solid ${W.borderLight}`,
            }}
          >
            {(() => {
              const svc = SERVICES.find((s) => s.id === service)!;
              const Icon = svc.icon;
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: W.accentLight,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon style={{ width: 14, height: 14, color: W.accent }} />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 500,
                        color: W.text,
                      }}
                    >
                      {svc.label}
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: W.textSub }}>
                      {svc.sub}
                      {svc.fee > 0 ? ` · ₹${svc.fee} fee` : " · Free"}
                    </p>
                  </div>
                </div>
              );
            })()}
            {delivery && service !== "store_pickup" && (
              <div
                style={{
                  marginTop: 6,
                  padding: "4px 8px",
                  background: W.surfaceAlt,
                  borderRadius: 4,
                  border: `1px solid ${W.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Bike style={{ width: 12, height: 12, color: W.textSub }} />
                <span style={{ fontSize: 11, color: W.textSub }}>
                  {delivery.name}
                </span>
                <span style={{ fontSize: 10, color: W.textMuted }}>
                  · {delivery.zone}
                </span>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: `1px solid ${W.borderLight}`,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: W.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                margin: "0 0 5px",
              }}
            >
              Promo / Coupon
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter code…"
                style={{
                  flex: 1,
                  height: 28,
                  border: `1px solid ${W.border}`,
                  borderRadius: 4,
                  padding: "0 8px",
                  fontSize: 12,
                  color: W.text,
                  background: W.surface,
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = W.accent)}
                onBlur={(e) => (e.target.style.borderColor = W.border)}
              />
              <button
                onClick={() => {
                  if (coupon) setCouponApplied(true);
                }}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 4,
                  border: "none",
                  background: couponApplied ? W.success : W.accent,
                  color: "white",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {couponApplied ? (
                  <CheckCircle style={{ width: 12, height: 12 }} />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            {couponApplied && (
              <p style={{ margin: "4px 0 0", fontSize: 10, color: W.success }}>
                ✓ SAVE5 applied — 5% off
              </p>
            )}
          </div>

          {/* Order summary */}
          <SectionHeader icon={ReceiptText} label="Order Summary" />
          <div style={{ padding: "8px 12px", flex: 1, overflowY: "auto" }}>
            {[
              { l: "Subtotal", v: `₹${subtotal.toFixed(2)}`, c: W.text },
              { l: "Discount", v: `−₹${totalDisc.toFixed(2)}`, c: W.danger },
              { l: "GST / Tax", v: `₹${totalTax.toFixed(2)}`, c: W.textSub },
              {
                l: "Delivery Fee",
                v: delivFee > 0 ? `₹${delivFee}` : "Free",
                c: delivFee > 0 ? W.text : W.success,
              },
              ...(couponApplied
                ? [
                    {
                      l: "Coupon (SAVE5)",
                      v: `−₹${couponDisc.toFixed(2)}`,
                      c: W.success,
                    },
                  ]
                : []),
            ].map(({ l, v, c }) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: 11, color: W.textSub }}>{l}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: c }}>
                  {v}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: `2px solid ${W.border}`,
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: W.text }}>
                Total
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: W.accent }}>
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
            {customer && (
              <div
                style={{
                  marginTop: 6,
                  padding: "4px 8px",
                  background: W.surfaceAlt,
                  borderRadius: 4,
                  border: `1px solid ${W.borderLight}`,
                  fontSize: 10,
                  color: W.textSub,
                }}
              >
                <Star
                  style={{
                    width: 9,
                    height: 9,
                    color: "#b8860b",
                    display: "inline",
                    marginRight: 3,
                  }}
                />
                Earn ~{Math.floor(grandTotal / 10)} loyalty pts · Balance:{" "}
                {customer.points} pts
              </div>
            )}
          </div>

          {/* Pay actions */}
          <div
            style={{
              padding: "10px 10px 12px",
              borderTop: `1px solid ${W.border}`,
              background: W.surfaceAlt,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <button
              onClick={() => setDialog("payment")}
              disabled={cart.length === 0}
              style={{
                width: "100%",
                height: 38,
                background: cart.length === 0 ? "#c8c8c8" : W.accent,
                color: "white",
                border: "none",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 700,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background .1s",
              }}
              onMouseEnter={(e) => {
                if (cart.length > 0)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.accentHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  cart.length === 0 ? "#c8c8c8" : W.accent;
              }}
            >
              <CreditCard style={{ width: 16, height: 16 }} />
              Process Payment &nbsp;·&nbsp; ₹{grandTotal.toFixed(2)}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={{
                  flex: 1,
                  height: 28,
                  background: W.surface,
                  border: `1px solid ${W.border}`,
                  borderRadius: 4,
                  fontSize: 11,
                  color: W.textSub,
                  cursor: "pointer",
                }}
              >
                Hold Sale
              </button>
              <button
                onClick={() => {
                  setCart([]);
                  setCustomer(null);
                  setDelivery(null);
                  setCouponApplied(false);
                  setCoupon("");
                }}
                style={{
                  flex: 1,
                  height: 28,
                  background: W.dangerBg,
                  border: `1px solid ${W.danger}30`,
                  borderRadius: 4,
                  fontSize: 11,
                  color: W.danger,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DIALOGS ── */}
      {dialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialog(null);
          }}
        >
          {dialog === "productSearch" && (
            <ProductSearchDialog
              onAdd={addToCart}
              onClose={() => setDialog(null)}
            />
          )}
          {dialog === "customerSelect" && (
            <CustomerSelectDialog
              selected={customer}
              onSelect={(c) => {
                setCustomer(c);
                setDialog(null);
              }}
              onClose={() => setDialog(null)}
            />
          )}
          {dialog === "deliveryService" && (
            <DeliveryServiceDialog
              service={service}
              delivery={delivery}
              onSelect={(svc: any, dlv: any) => {
                setService(svc);
                setDelivery(dlv);
                setDialog(null);
              }}
              onClose={() => setDialog(null)}
            />
          )}
          {dialog === "payment" && (
            <PaymentDialog
              total={grandTotal}
              customer={customer}
              cart={cart}
              onClose={() => setDialog(null)}
              onDone={() => {
                setPaymentDone(true);
                setDialog(null);
                setCart([]);
                setCustomer(null);
              }}
            />
          )}
        </div>
      )}

      {/* Success toast */}
      {paymentDone && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: W.surface,
            border: `1px solid ${W.success}`,
            borderRadius: 6,
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,.15)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 200,
            minWidth: 260,
          }}
          onClick={() => setPaymentDone(false)}
        >
          <CheckCircle
            style={{ width: 20, height: 20, color: W.success, flexShrink: 0 }}
          />
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: W.text,
              }}
            >
              Payment Successful
            </p>
            <p style={{ margin: 0, fontSize: 11, color: W.textSub }}>
              Receipt printed · TXN-2026-0847
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TitleBar() {
  return (
    <div
      style={{
        background: "#f0f0f0",
        borderBottom: "1px solid #d1d1d1",
        height: 32,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 12px",
        }}
      >
        <Pill style={{ width: 13, height: 13, color: "#0078d4" }} />
        <span style={{ fontSize: 12, color: "#333" }}>
          PharmOS — Point of Sale
        </span>
      </div>
      <div style={{ flex: 1 }} />
      {[
        { icon: Minus, hov: "#e5e5e5" },
        { icon: Square, hov: "#e5e5e5" },
        { icon: X, hov: "#c42b1c" },
      ].map(({ icon: Icon, hov }, i) => (
        <button
          key={i}
          style={{
            width: 46,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#333",
            transition: "background .1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = hov;
            if (i === 2)
              (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#333";
          }}
        >
          <Icon style={{ width: 10, height: 10 }} />
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ icon: Icon, label, action, onAction }: any) {
  return (
    <div
      style={{
        height: 30,
        background: "#f5f5f5",
        borderBottom: "1px solid #e8e8e8",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 6,
        flexShrink: 0,
      }}
    >
      <Icon style={{ width: 12, height: 12, color: W.textMuted }} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: W.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          flex: 1,
        }}
      >
        {label}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{
            fontSize: 10,
            color: W.accent,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

function CatalogRow({
  drug,
  inCart,
  onAdd,
}: {
  drug: (typeof DRUGS)[0];
  inCart: boolean;
  onAdd: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onAdd}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderBottom: `1px solid ${W.borderLight}`,
        cursor: "pointer",
        background: hov ? W.accentLight : "transparent",
        transition: "background .1s",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: W.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {drug.name}
          </span>
          {drug.prescription && (
            <Shield
              style={{ width: 10, height: 10, color: "#6b69d6", flexShrink: 0 }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
          <span
            style={{
              fontSize: 10,
              color: W.textMuted,
              fontFamily: "Consolas,monospace",
            }}
          >
            {drug.sku}
          </span>
          <span
            style={{
              fontSize: 10,
              padding: "0 4px",
              background: "#f0f0f0",
              borderRadius: 2,
              color: W.textSub,
            }}
          >
            {drug.category}
          </span>
          <span
            style={{
              fontSize: 10,
              color: drug.stock < 20 ? W.danger : W.textMuted,
            }}
          >
            Qty: {drug.stock}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{ margin: 0, fontSize: 13, fontWeight: 700, color: W.accent }}
        >
          ₹{drug.price}
        </p>
        {inCart ? (
          <span style={{ fontSize: 9, color: W.success, fontWeight: 500 }}>
            ✓ In cart
          </span>
        ) : (
          <Plus
            style={{
              width: 14,
              height: 14,
              color: W.accent,
              marginLeft: "auto",
            }}
          />
        )}
      </div>
    </div>
  );
}

function CartRow({ item, idx, lineNet, onQty, onDisc, onRemove }: any) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${W.borderLight}`,
        background: hov ? "#f0f6ff" : idx % 2 === 1 ? W.surfaceAlt : W.surface,
        transition: "background .1s",
      }}
    >
      <td style={{ padding: "4px 8px", fontSize: 11, color: W.textMuted }}>
        {idx + 1}
      </td>
      <td style={{ padding: "4px 8px", maxWidth: 180 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 500,
                color: W.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 160,
              }}
            >
              {item.name}
            </p>
            <div style={{ display: "flex", gap: 4, marginTop: 1 }}>
              <span
                style={{
                  fontSize: 9,
                  color: W.textMuted,
                  fontFamily: "Consolas,monospace",
                }}
              >
                {item.sku}
              </span>
              {item.prescription && (
                <span
                  style={{
                    fontSize: 9,
                    color: "#6b69d6",
                    background: "#ebe9fc",
                    padding: "0 4px",
                    borderRadius: 2,
                    fontWeight: 500,
                  }}
                >
                  Rx
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: "4px 8px" }}>
        <span
          style={{
            fontSize: 10,
            color: W.textSub,
            fontFamily: "Consolas,monospace",
          }}
        >
          {item.batch}
        </span>
      </td>
      <td style={{ padding: "4px 8px" }}>
        <span
          style={{
            fontSize: 10,
            color:
              new Date(item.expiry) < new Date("2025-08-01")
                ? W.danger
                : W.textSub,
          }}
        >
          {item.expiry}
        </span>
      </td>
      <td style={{ padding: "4px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <button
            onClick={() => onQty(item.qty - 1)}
            style={{
              width: 20,
              height: 20,
              border: `1px solid ${W.border}`,
              borderRadius: 3,
              background: W.surface,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: W.text,
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            −
          </button>
          <span
            style={{
              width: 24,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: W.text,
            }}
          >
            {item.qty}
          </span>
          <button
            onClick={() => onQty(item.qty + 1)}
            style={{
              width: 20,
              height: 20,
              border: `1px solid ${W.border}`,
              borderRadius: 3,
              background: W.surface,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: W.text,
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>
      </td>
      <td style={{ padding: "4px 8px", fontSize: 12, color: W.text }}>
        ₹{item.unitPrice.toFixed(2)}
      </td>
      <td style={{ padding: "4px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="number"
            min={0}
            max={100}
            value={item.discount}
            onChange={(e) => onDisc(Number(e.target.value))}
            style={{
              width: 40,
              height: 22,
              border: `1px solid ${W.border}`,
              borderRadius: 3,
              padding: "0 4px",
              fontSize: 11,
              textAlign: "right",
              background: W.surface,
              color: W.text,
              outline: "none",
            }}
          />
          <span style={{ fontSize: 10, color: W.textMuted }}>%</span>
        </div>
      </td>
      <td style={{ padding: "4px 8px", fontSize: 11, color: W.textSub }}>
        {item.taxRate}%
      </td>
      <td style={{ padding: "4px 8px" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: item.discount > 0 ? W.success : W.text,
          }}
        >
          ₹{lineNet.toFixed(2)}
        </span>
      </td>
      <td style={{ padding: "4px 8px" }}>
        <div
          style={{
            display: "flex",
            gap: 2,
            opacity: hov ? 1 : 0,
            transition: "opacity .15s",
          }}
        >
          <IBtn icon={Edit2} title="Edit" color={W.accent} />
          <IBtn
            icon={Trash2}
            title="Remove"
            color={W.danger}
            onClick={onRemove}
          />
        </div>
      </td>
    </tr>
  );
}

// ─── Product Search Dialog ─────────────────────────────────────────────────────
function ProductSearchDialog({
  onAdd,
  onClose,
}: {
  onAdd: (d: any) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [rx, setRx] = useState<boolean | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const results = DRUGS.filter(
    (d) =>
      (cat === "All" || d.category === cat) &&
      (rx === null || d.prescription === rx) &&
      (d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.sku.toLowerCase().includes(q.toLowerCase()) ||
        d.batch.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Dialog
      width={760}
      title="Product Search"
      subtitle="Search by name, SKU, or barcode"
      onClose={onClose}
      icon={Search}
    >
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid ${W.border}`,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: W.accent,
            }}
          />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Drug name, SKU, barcode, batch number…"
            style={{
              width: "100%",
              height: 32,
              paddingLeft: 30,
              fontSize: 12,
              border: `1.5px solid ${W.accent}`,
              borderRadius: 4,
              background: W.surface,
              color: W.text,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{
            height: 32,
            padding: "0 10px",
            border: `1px solid ${W.border}`,
            borderRadius: 4,
            fontSize: 12,
            color: W.text,
            background: W.surface,
            outline: "none",
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={rx === null ? "all" : rx ? "rx" : "otc"}
          onChange={(e) =>
            setRx(e.target.value === "all" ? null : e.target.value === "rx")
          }
          style={{
            height: 32,
            padding: "0 10px",
            border: `1px solid ${W.border}`,
            borderRadius: 4,
            fontSize: 12,
            color: W.text,
            background: W.surface,
            outline: "none",
          }}
        >
          <option value="all">All Types</option>
          <option value="rx">Rx Only</option>
          <option value="otc">OTC Only</option>
        </select>
      </div>

      <div style={{ overflowY: "auto", maxHeight: 360 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: W.surfaceAlt,
                borderBottom: `1px solid ${W.border}`,
                position: "sticky",
                top: 0,
              }}
            >
              {[
                "Drug Name",
                "SKU",
                "Batch",
                "Expiry",
                "Stock",
                "Price",
                "Tax",
                "Type",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: W.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((drug, i) => (
              <SearchResultRow
                key={drug.id}
                drug={drug}
                idx={i}
                onAdd={() => onAdd(drug)}
              />
            ))}
          </tbody>
        </table>
        {results.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: W.textMuted,
              fontSize: 12,
            }}
          >
            No results found
          </div>
        )}
      </div>

      <div
        style={{
          padding: "10px 16px",
          borderTop: `1px solid ${W.border}`,
          background: W.surfaceAlt,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: W.textMuted }}>
          {results.length} result(s) found
        </span>
        <TBtn ghost onClick={onClose}>
          Close
        </TBtn>
      </div>
    </Dialog>
  );
}

function SearchResultRow({
  drug,
  idx,
  onAdd,
}: {
  drug: (typeof DRUGS)[0];
  idx: number;
  onAdd: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${W.borderLight}`,
        background: hov
          ? W.accentLight
          : idx % 2 === 1
            ? W.surfaceAlt
            : W.surface,
        cursor: "pointer",
        transition: "background .1s",
      }}
      onClick={onAdd}
    >
      <td style={{ padding: "7px 10px" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: W.text }}>
          {drug.name}
        </p>
        <p style={{ margin: 0, fontSize: 10, color: W.textMuted }}>
          {drug.category}
        </p>
      </td>
      <td
        style={{
          padding: "7px 10px",
          fontSize: 11,
          color: W.textSub,
          fontFamily: "Consolas,monospace",
        }}
      >
        {drug.sku}
      </td>
      <td
        style={{
          padding: "7px 10px",
          fontSize: 11,
          color: W.textSub,
          fontFamily: "Consolas,monospace",
        }}
      >
        {drug.batch}
      </td>
      <td
        style={{
          padding: "7px 10px",
          fontSize: 11,
          color:
            new Date(drug.expiry) < new Date("2025-08-01")
              ? W.danger
              : W.textSub,
        }}
      >
        {drug.expiry}
      </td>
      <td style={{ padding: "7px 10px" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color:
              drug.stock < 20 ? W.danger : drug.stock < 50 ? W.warn : W.success,
          }}
        >
          {drug.stock}
        </span>
      </td>
      <td
        style={{
          padding: "7px 10px",
          fontSize: 13,
          fontWeight: 700,
          color: W.accent,
        }}
      >
        ₹{drug.price.toFixed(2)}
      </td>
      <td style={{ padding: "7px 10px", fontSize: 11, color: W.textSub }}>
        {drug.taxRate}%
      </td>
      <td style={{ padding: "7px 10px" }}>
        <span
          style={{
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 3,
            fontWeight: 500,
            background: drug.prescription ? "#ebe9fc" : "#f0f0f0",
            color: drug.prescription ? "#6b69d6" : W.textSub,
          }}
        >
          {drug.prescription ? "Rx" : "OTC"}
        </span>
      </td>
      <td style={{ padding: "7px 10px" }}>
        <button
          style={{
            height: 26,
            padding: "0 12px",
            background: W.accent,
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Add
        </button>
      </td>
    </tr>
  );
}

// ─── Customer Select Dialog ────────────────────────────────────────────────────
function CustomerSelectDialog({
  selected,
  onSelect,
  onClose,
}: {
  selected: Customer | null;
  onSelect: (c: Customer) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const results = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Dialog
      width={600}
      title="Select Customer"
      subtitle="Search by name, phone, or email"
      onClose={onClose}
      icon={User}
    >
      <div
        style={{ padding: "10px 16px", borderBottom: `1px solid ${W.border}` }}
      >
        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: W.textMuted,
            }}
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customer name, phone, email…"
            style={{
              width: "100%",
              height: 32,
              paddingLeft: 30,
              fontSize: 12,
              border: `1.5px solid ${W.accent}`,
              borderRadius: 4,
              background: W.surface,
              color: W.text,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ overflowY: "auto", maxHeight: 340 }}>
        {/* Walk-in option */}
        <div
          onClick={() =>
            onSelect({
              id: 0,
              name: "Walk-in Customer",
              phone: "—",
              email: "—",
              points: 0,
              tier: "Bronze",
              address: "—",
              lastVisit: "—",
            })
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderBottom: `1px solid ${W.borderLight}`,
            cursor: "pointer",
            background: "#fffde7",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background = "#fff9c4")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background = "#fffde7")
          }
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User style={{ width: 18, height: 18, color: W.textMuted }} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                color: W.text,
              }}
            >
              Walk-in Customer
            </p>
            <p style={{ margin: 0, fontSize: 10, color: W.textSub }}>
              No loyalty account · Cash transaction
            </p>
          </div>
        </div>

        {results.map((c, i) => {
          const isSelected = selected?.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                borderBottom: `1px solid ${W.borderLight}`,
                cursor: "pointer",
                background: isSelected ? W.accentLight : "transparent",
                transition: "background .1s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLDivElement).style.background =
                    "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  isSelected ? W.accentLight : "transparent";
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: W.accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: W.accent,
                  flexShrink: 0,
                }}
              >
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: W.text }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      padding: "1px 6px",
                      borderRadius: 10,
                      background:
                        c.tier === "Platinum"
                          ? "#ebe9fc"
                          : c.tier === "Gold"
                            ? "#fff4ce"
                            : "#f0f0f0",
                      color: tierColor[c.tier],
                      fontWeight: 600,
                    }}
                  >
                    {c.tier}
                  </span>
                  {isSelected && (
                    <CheckCircle
                      style={{ width: 12, height: 12, color: W.accent }}
                    />
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: W.textSub }}>
                    {c.phone}
                  </span>
                  <span style={{ fontSize: 10, color: W.textMuted }}>·</span>
                  <span style={{ fontSize: 10, color: W.textSub }}>
                    {c.email}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: W.accent,
                  }}
                >
                  {c.points.toLocaleString()} pts
                </p>
                <p style={{ margin: 0, fontSize: 10, color: W.textMuted }}>
                  Last: {c.lastVisit}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: "10px 16px",
          borderTop: `1px solid ${W.border}`,
          background: W.surfaceAlt,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TBtn ghost>
          <Plus style={{ width: 12, height: 12 }} /> New Customer
        </TBtn>
        <TBtn ghost onClick={onClose}>
          Cancel
        </TBtn>
      </div>
    </Dialog>
  );
}

// ─── Delivery & Service Dialog ─────────────────────────────────────────────────
function DeliveryServiceDialog({ service, delivery, onSelect, onClose }: any) {
  const [svc, setSvc] = useState(service);
  const [dlv, setDlv] = useState<DeliveryPerson | null>(delivery);

  return (
    <Dialog
      width={580}
      title="Fulfillment & Delivery"
      subtitle="Choose service type and assign delivery personnel"
      onClose={onClose}
      icon={Truck}
    >
      <div
        style={{ padding: "14px 16px", borderBottom: `1px solid ${W.border}` }}
      >
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 11,
            color: W.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontWeight: 600,
          }}
        >
          Service Type
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const active = svc === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSvc(s.id)}
                style={{
                  padding: "12px 14px",
                  border: `2px solid ${active ? W.accent : W.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: active ? W.accentLight : W.surface,
                  transition: "all .1s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <Icon
                    style={{
                      width: 18,
                      height: 18,
                      color: active ? W.accent : W.textSub,
                    }}
                  />
                  {active && (
                    <CheckCircle
                      style={{
                        width: 14,
                        height: 14,
                        color: W.accent,
                        marginLeft: "auto",
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: active ? W.accent : W.text,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 10, color: W.textSub }}
                >
                  {s.sub}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 11,
                    fontWeight: 600,
                    color: s.fee === 0 ? W.success : W.text,
                  }}
                >
                  {s.fee === 0 ? "Free" : `₹${s.fee} fee`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {svc !== "store_pickup" && (
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${W.border}`,
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 11,
              color: W.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontWeight: 600,
            }}
          >
            Assign Delivery Personnel
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DELIVERY_PERSONS.map((p) => {
              const active = dlv?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => (p.active ? setDlv(active ? null : p) : null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    border: `1.5px solid ${active ? W.accent : W.border}`,
                    borderRadius: 6,
                    cursor: p.active ? "pointer" : "not-allowed",
                    background: active
                      ? W.accentLight
                      : p.active
                        ? W.surface
                        : W.surfaceAlt,
                    opacity: p.active ? 1 : 0.55,
                    transition: "all .1s",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: active ? W.accentLight : "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: active ? W.accent : W.textSub,
                      flexShrink: 0,
                    }}
                  >
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{ fontSize: 12, fontWeight: 500, color: W.text }}
                      >
                        {p.name}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 5px",
                          borderRadius: 10,
                          background: p.active ? W.successBg : W.dangerBg,
                          color: p.active ? W.success : W.danger,
                          fontWeight: 500,
                        }}
                      >
                        {p.active ? "Active" : "Unavailable"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: W.textSub }}>
                        {p.phone}
                      </span>
                      <span style={{ fontSize: 10, color: W.textMuted }}>
                        ·
                      </span>
                      <span style={{ fontSize: 10, color: W.textSub }}>
                        {p.vehicle}
                      </span>
                      <span style={{ fontSize: 10, color: W.textMuted }}>
                        ·
                      </span>
                      <span style={{ fontSize: 10, color: W.textSub }}>
                        {p.zone}
                      </span>
                    </div>
                  </div>
                  {active && (
                    <CheckCircle
                      style={{
                        width: 16,
                        height: 16,
                        color: W.accent,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          padding: "10px 16px",
          borderTop: `1px solid ${W.border}`,
          background: W.surfaceAlt,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <TBtn ghost onClick={onClose}>
          Cancel
        </TBtn>
        <TBtn accent onClick={() => onSelect(svc, dlv)}>
          <CheckCircle style={{ width: 13, height: 13 }} /> Confirm Selection
        </TBtn>
      </div>
    </Dialog>
  );
}

// ─── Payment Dialog ────────────────────────────────────────────────────────────
function PaymentDialog({ total, customer, cart, onClose, onDone }: any) {
  const [method, setMethod] = useState<"cash" | "card" | "upi">("cash");
  const [tendered, setTendered] = useState(Math.ceil(total / 10) * 10);
  const change = Math.max(0, tendered - total);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(onDone, 1800);
    }, 1400);
  };

  return (
    <Dialog
      width={520}
      title="Payment Processing"
      subtitle={`Order total: ₹${total.toFixed(2)}`}
      onClose={onClose}
      icon={CreditCard}
    >
      {done ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: W.successBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle style={{ width: 36, height: 36, color: W.success }} />
          </div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: W.text,
              margin: "0 0 6px",
            }}
          >
            Payment Successful!
          </p>
          <p style={{ fontSize: 12, color: W.textSub, margin: 0 }}>
            Receipt printed · TXN-2026-0847
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${W.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 11,
                color: W.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                fontWeight: 600,
              }}
            >
              Payment Method
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 6,
              }}
            >
              {[
                { id: "cash", icon: DollarSign, label: "Cash" },
                { id: "card", icon: CreditCard, label: "Card / POS" },
                { id: "upi", icon: Zap, label: "UPI / QR" },
              ].map(({ id, icon: Icon, label }) => {
                const active = method === id;
                return (
                  <button
                    key={id}
                    onClick={() => setMethod(id as any)}
                    style={{
                      padding: "10px 0",
                      border: `2px solid ${active ? W.accent : W.border}`,
                      borderRadius: 6,
                      background: active ? W.accentLight : W.surface,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                      transition: "all .1s",
                    }}
                  >
                    <Icon
                      style={{
                        width: 20,
                        height: 20,
                        color: active ? W.accent : W.textSub,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: active ? 600 : 400,
                        color: active ? W.accent : W.text,
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${W.border}`,
            }}
          >
            {/* Bill summary */}
            <div
              style={{
                background: W.surfaceAlt,
                borderRadius: 6,
                padding: "10px 12px",
                marginBottom: 12,
                border: `1px solid ${W.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 11, color: W.textSub }}>
                  Items ({cart.length})
                </span>
                <span style={{ fontSize: 11, color: W.textSub }}>
                  {cart.reduce((s: number, i: any) => s + i.qty, 0)} units
                </span>
              </div>
              {customer && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 11, color: W.textSub }}>
                    Customer
                  </span>
                  <span
                    style={{ fontSize: 11, color: W.text, fontWeight: 500 }}
                  >
                    {customer.name}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: `1px solid ${W.border}`,
                  paddingTop: 6,
                  marginTop: 4,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: W.text }}>
                  Amount Due
                </span>
                <span
                  style={{ fontSize: 18, fontWeight: 700, color: W.accent }}
                >
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            {method === "cash" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: W.textMuted,
                      margin: "0 0 5px",
                    }}
                  >
                    Amount Tendered (₹)
                  </p>
                  <input
                    type="number"
                    value={tendered}
                    onChange={(e) => setTendered(Number(e.target.value))}
                    style={{
                      width: "100%",
                      height: 36,
                      border: `1.5px solid ${W.accent}`,
                      borderRadius: 4,
                      padding: "0 10px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: W.text,
                      background: W.surface,
                      outline: "none",
                      boxSizing: "border-box",
                      textAlign: "right",
                    }}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    {[500, 1000, 2000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setTendered(v)}
                        style={{
                          flex: 1,
                          height: 24,
                          border: `1px solid ${W.border}`,
                          borderRadius: 3,
                          background: W.surface,
                          fontSize: 11,
                          cursor: "pointer",
                          color: W.textSub,
                        }}
                      >
                        ₹{v}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    background: change > 0 ? W.successBg : W.surfaceAlt,
                    borderRadius: 6,
                    padding: "10px 14px",
                    border: `1px solid ${change > 0 ? W.success + "40" : W.border}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: W.textMuted,
                      margin: "0 0 4px",
                    }}
                  >
                    Return Change
                  </p>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: change > 0 ? W.success : W.textMuted,
                      margin: 0,
                    }}
                  >
                    ₹{change.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            {method === "card" && (
              <div
                style={{
                  padding: "16px",
                  background: W.surfaceAlt,
                  borderRadius: 6,
                  border: `1px solid ${W.border}`,
                  textAlign: "center",
                }}
              >
                <CreditCard
                  style={{
                    width: 36,
                    height: 36,
                    color: W.accent,
                    margin: "0 auto 8px",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: W.text,
                    margin: "0 0 4px",
                  }}
                >
                  Swipe / Tap / Insert card
                </p>
                <p style={{ fontSize: 11, color: W.textSub, margin: 0 }}>
                  POS terminal ready · Amount: <b>₹{total.toFixed(2)}</b>
                </p>
              </div>
            )}
            {method === "upi" && (
              <div
                style={{
                  padding: "16px",
                  background: W.surfaceAlt,
                  borderRadius: 6,
                  border: `1px solid ${W.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 8px",
                    background: "#1a1a1a",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "white",
                    letterSpacing: 2,
                  }}
                >
                  [QR CODE]
                </div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: W.text,
                    margin: "0 0 4px",
                  }}
                >
                  Scan UPI QR · ₹{total.toFixed(2)}
                </p>
                <p style={{ fontSize: 11, color: W.textSub, margin: 0 }}>
                  pharmos@ybl · Awaiting payment confirmation
                </p>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "10px 16px",
              background: W.surfaceAlt,
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              alignItems: "center",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: W.textSub,
                cursor: "pointer",
              }}
            >
              <input type="checkbox" defaultChecked /> Print receipt
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <TBtn ghost onClick={onClose}>
                Cancel
              </TBtn>
              <TBtn
                accent
                onClick={handlePay}
                disabled={processing || (method === "cash" && tendered < total)}
              >
                {processing ? (
                  <>
                    <RefreshCw style={{ width: 12, height: 12 }} /> Processing…
                  </>
                ) : (
                  <>
                    <CheckCircle style={{ width: 12, height: 12 }} /> Confirm
                    Payment
                  </>
                )}
              </TBtn>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}

// ─── Generic Dialog Shell ──────────────────────────────────────────────────────
function Dialog({
  children,
  width,
  title,
  subtitle,
  onClose,
  icon: Icon,
}: any) {
  return (
    <div
      style={{
        width,
        maxWidth: "95vw",
        background: W.surface,
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.12)",
        border: `1px solid ${W.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
      }}
    >
      {/* Dialog title bar */}
      <div
        style={{
          height: 42,
          background: "#f0f0f0",
          borderBottom: `1px solid ${W.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 15, height: 15, color: W.accent }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: W.text }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ fontSize: 11, color: W.textMuted, marginLeft: 10 }}>
              {subtitle}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 4,
            background: "transparent",
            cursor: "pointer",
            color: W.textMuted,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fde7e9";
            (e.currentTarget as HTMLButtonElement).style.color = W.danger;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = W.textMuted;
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>
      <div
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
