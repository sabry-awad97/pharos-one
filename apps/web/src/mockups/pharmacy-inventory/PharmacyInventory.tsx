import { useState, useRef, useCallback } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  BarChart2,
  Settings,
  Search,
  Plus,
  ArrowLeftRight,
  ChevronDown,
  Download,
  Columns,
  AlignJustify,
  AlignStartVertical,
  Filter,
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ChevronUp,
  ChevronRight,
  MoreHorizontal,
  History,
  Layers,
  Edit2,
  Shuffle,
  ArrowDownUp,
  Activity,
  Pill,
  Minus,
  Square,
  RefreshCw,
  Zap,
  Wifi,
  ShieldCheck,
  Hash,
  ArrowRight,
  FlaskConical,
  MapPin,
  Barcode,
  Tag,
  TrendingDown,
} from "lucide-react";

// ─── Mica Dark Design Tokens ───────────────────────────────────────────────
const M = {
  base: "#0F1115", // deepest background
  mica0: "#131619", // sidebar
  mica1: "#1B1F26", // panels
  mica2: "#222730", // elevated surfaces
  mica3: "#2a2f3a", // hover/selected
  border: "#2a2d35", // separators
  borderB: "#1f2229", // subtle border
  accent: "#0078d4", // Windows blue
  accentH: "#1a86db", // accent hover
  accentG: "#0067bb", // accent active
  accentL: "#0078d420", // accent glow
  text: "#f0f0f0", // primary text
  textSub: "#ababab", // secondary
  textMuted: "#666c7a", // muted
  success: "#6ccb5f",
  warn: "#fcba19",
  danger: "#f55656",
  info: "#4fc3f7",
  purple: "#b39ddb",
  strip: {
    danger: "#f55656",
    warn: "#fcba19",
    none: "transparent",
  },
};
const seg: React.CSSProperties = {
  fontFamily:
    "'Segoe UI Variable','Segoe UI',system-ui,-apple-system,sans-serif",
};

// ─── Types ─────────────────────────────────────────────────────────────────
type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expiring";
type PanelTab = "details" | "lots" | "history";
interface Drug {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorder: number;
  unit: string;
  expiry: string;
  expiryMs: number;
  location: string;
  supplier: string;
  price: number;
  status: StockStatus;
  strip: "danger" | "warn" | "none";
  movements: number;
  lastSold: string;
}
interface Lot {
  id: string;
  drugId: string;
  lotNo: string;
  expiry: string;
  qty: number;
  urgent: boolean;
}
interface HistoryEntry {
  date: string;
  type: "Sale" | "Received" | "Adjusted" | "Transferred";
  qty: number;
  note: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const DRUGS: Drug[] = [
  {
    id: "d1",
    name: "Amoxicillin 500mg",
    sku: "AMX-500",
    category: "Antibiotics",
    stock: 240,
    reorder: 100,
    unit: "Strips",
    expiry: "Dec 2026",
    expiryMs: 1798761600000,
    location: "A1",
    supplier: "MedSupply Co.",
    price: 12.5,
    status: "In Stock",
    strip: "none",
    movements: 42,
    lastSold: "Today",
  },
  {
    id: "d2",
    name: "Paracetamol 650mg",
    sku: "PCT-650",
    category: "Analgesics",
    stock: 18,
    reorder: 80,
    unit: "Strips",
    expiry: "Mar 2026",
    expiryMs: 1743465600000,
    location: "A2",
    supplier: "PharmGen",
    price: 4.2,
    status: "Low Stock",
    strip: "warn",
    movements: 91,
    lastSold: "Today",
  },
  {
    id: "d3",
    name: "Metformin 500mg",
    sku: "MET-500",
    category: "Antidiabetics",
    stock: 302,
    reorder: 120,
    unit: "Strips",
    expiry: "Jun 2027",
    expiryMs: 1814112000000,
    location: "B1",
    supplier: "GeneriCo Labs",
    price: 8.75,
    status: "In Stock",
    strip: "none",
    movements: 38,
    lastSold: "Yesterday",
  },
  {
    id: "d4",
    name: "Omeprazole 20mg",
    sku: "OMP-020",
    category: "Gastro",
    stock: 0,
    reorder: 60,
    unit: "Strips",
    expiry: "—",
    expiryMs: 0,
    location: "B2",
    supplier: "AlphaPharm",
    price: 15.0,
    status: "Out of Stock",
    strip: "danger",
    movements: 29,
    lastSold: "3 days",
  },
  {
    id: "d5",
    name: "Atorvastatin 20mg",
    sku: "ATOR-020",
    category: "Cardiovascular",
    stock: 120,
    reorder: 150,
    unit: "Strips",
    expiry: "Jan 2026",
    expiryMs: 1738368000000,
    location: "A1",
    supplier: "MedSupply Co.",
    price: 22.0,
    status: "Expiring",
    strip: "warn",
    movements: 55,
    lastSold: "Today",
  },
  {
    id: "d6",
    name: "Amlodipine 5mg",
    sku: "AML-005",
    category: "Cardiovascular",
    stock: 88,
    reorder: 100,
    unit: "Strips",
    expiry: "Aug 2026",
    expiryMs: 1786003200000,
    location: "A3",
    supplier: "BioMed Dist.",
    price: 18.5,
    status: "Low Stock",
    strip: "warn",
    movements: 33,
    lastSold: "2 days",
  },
  {
    id: "d7",
    name: "Azithromycin 500mg",
    sku: "AZT-500",
    category: "Antibiotics",
    stock: 0,
    reorder: 50,
    unit: "Strips",
    expiry: "—",
    expiryMs: 0,
    location: "C1",
    supplier: "PharmGen",
    price: 28.0,
    status: "Out of Stock",
    strip: "danger",
    movements: 18,
    lastSold: "5 days",
  },
  {
    id: "d8",
    name: "Cetirizine 10mg",
    sku: "CET-010",
    category: "Antihistamines",
    stock: 310,
    reorder: 80,
    unit: "Strips",
    expiry: "Nov 2027",
    expiryMs: 1825027200000,
    location: "C2",
    supplier: "AlphaPharm",
    price: 6.0,
    status: "In Stock",
    strip: "none",
    movements: 47,
    lastSold: "Today",
  },
  {
    id: "d9",
    name: "Pantoprazole 40mg",
    sku: "PAN-040",
    category: "Gastro",
    stock: 42,
    reorder: 80,
    unit: "Strips",
    expiry: "Feb 2026",
    expiryMs: 1740787200000,
    location: "B3",
    supplier: "GeneriCo Labs",
    price: 12.0,
    status: "Expiring",
    strip: "warn",
    movements: 24,
    lastSold: "Yesterday",
  },
  {
    id: "d10",
    name: "Losartan 50mg",
    sku: "LOS-050",
    category: "Cardiovascular",
    stock: 194,
    reorder: 100,
    unit: "Strips",
    expiry: "Sep 2027",
    expiryMs: 1820121600000,
    location: "A4",
    supplier: "MedSupply Co.",
    price: 14.5,
    status: "In Stock",
    strip: "none",
    movements: 62,
    lastSold: "Today",
  },
  {
    id: "d11",
    name: "Dolo 650",
    sku: "DOL-650",
    category: "Analgesics",
    stock: 512,
    reorder: 200,
    unit: "Strips",
    expiry: "Jan 2027",
    expiryMs: 1798761600000,
    location: "A2",
    supplier: "AlphaPharm",
    price: 3.8,
    status: "In Stock",
    strip: "none",
    movements: 128,
    lastSold: "Today",
  },
  {
    id: "d12",
    name: "Vitamin D3 60K IU",
    sku: "VTD-60K",
    category: "Supplements",
    stock: 22,
    reorder: 50,
    unit: "Caps",
    expiry: "Apr 2026",
    expiryMs: 1746057600000,
    location: "D1",
    supplier: "BioMed Dist.",
    price: 38.0,
    status: "Low Stock",
    strip: "warn",
    movements: 15,
    lastSold: "3 days",
  },
  {
    id: "d13",
    name: "Metronidazole 400mg",
    sku: "MTR-400",
    category: "Antibiotics",
    stock: 165,
    reorder: 80,
    unit: "Strips",
    expiry: "Oct 2027",
    expiryMs: 1822732800000,
    location: "C3",
    supplier: "GeneriCo Labs",
    price: 7.5,
    status: "In Stock",
    strip: "none",
    movements: 31,
    lastSold: "Yesterday",
  },
  {
    id: "d14",
    name: "Insulin Glargine",
    sku: "INS-GLR",
    category: "Antidiabetics",
    stock: 8,
    reorder: 20,
    unit: "Vials",
    expiry: "May 2026",
    expiryMs: 1748649600000,
    location: "REF",
    supplier: "BioMed Dist.",
    price: 480.0,
    status: "Low Stock",
    strip: "warn",
    movements: 12,
    lastSold: "Today",
  },
  {
    id: "d15",
    name: "Clonazepam 0.5mg",
    sku: "CLN-005",
    category: "Neuro",
    stock: 44,
    reorder: 40,
    unit: "Strips",
    expiry: "Jul 2027",
    expiryMs: 1814112000000,
    location: "SAFE",
    supplier: "PharmGen",
    price: 9.0,
    status: "In Stock",
    strip: "none",
    movements: 8,
    lastSold: "2 days",
  },
];

const LOTS: Lot[] = [
  {
    id: "l1",
    drugId: "d1",
    lotNo: "AMX-A12",
    expiry: "Dec 2026",
    qty: 140,
    urgent: false,
  },
  {
    id: "l2",
    drugId: "d1",
    lotNo: "AMX-B34",
    expiry: "Mar 2027",
    qty: 100,
    urgent: false,
  },
  {
    id: "l3",
    drugId: "d5",
    lotNo: "AT-001",
    expiry: "Jan 2026",
    qty: 70,
    urgent: true,
  },
  {
    id: "l4",
    drugId: "d5",
    lotNo: "AT-002",
    expiry: "Jun 2026",
    qty: 50,
    urgent: false,
  },
  {
    id: "l5",
    drugId: "d2",
    lotNo: "PCT-X1",
    expiry: "Mar 2026",
    qty: 10,
    urgent: true,
  },
  {
    id: "l6",
    drugId: "d2",
    lotNo: "PCT-X2",
    expiry: "Sep 2026",
    qty: 8,
    urgent: false,
  },
  {
    id: "l7",
    drugId: "d9",
    lotNo: "PAN-03",
    expiry: "Feb 2026",
    qty: 42,
    urgent: true,
  },
  {
    id: "l8",
    drugId: "d3",
    lotNo: "MET-A1",
    expiry: "Jun 2027",
    qty: 302,
    urgent: false,
  },
];

const HISTORY: HistoryEntry[] = [
  { date: "22 Mar 14:30", type: "Sale", qty: -3, note: "POS Terminal 1" },
  { date: "22 Mar 11:12", type: "Sale", qty: -2, note: "POS Terminal 2" },
  {
    date: "21 Mar 09:00",
    type: "Received",
    qty: 100,
    note: "PO-2026-0041 / MedSupply",
  },
  {
    date: "20 Mar 16:45",
    type: "Adjusted",
    qty: -5,
    note: "Damaged — pharmacist audit",
  },
  {
    date: "18 Mar 10:30",
    type: "Transferred",
    qty: 20,
    note: "Branch: Koramangala",
  },
  { date: "15 Mar 14:00", type: "Sale", qty: -4, note: "POS Terminal 1" },
];

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ShoppingCart, label: "Point of Sale" },
  { icon: Package, label: "Inventory", active: true },
  { icon: Truck, label: "Purchases" },
  { icon: BarChart2, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

// ─── Status helpers ────────────────────────────────────────────────────────
function statusStyle(s: StockStatus): { color: string; dot: string } {
  if (s === "In Stock") return { color: M.success, dot: M.success };
  if (s === "Low Stock") return { color: M.warn, dot: M.warn };
  if (s === "Out of Stock") return { color: M.danger, dot: M.danger };
  return { color: M.warn, dot: M.warn };
}

// ═══════════════════════════════════════════════════════════════════════════
export function PharmacyInventory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out" | "expiring">(
    "all",
  );
  const [catFilter, setCatFilter] = useState("All");
  const [selId, setSelId] = useState<string | null>("d5");
  const [panelTab, setPanelTab] = useState<PanelTab>("details");
  const [density, setDensity] = useState<"compact" | "ultra">("compact");
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [ctxMenu, setCtxMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [showColMenu, setShowColMenu] = useState(false);
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);

  const ROW_H = density === "ultra" ? 26 : 30;
  const sel = DRUGS.find((d) => d.id === selId);
  const selLots = LOTS.filter((l) => l.drugId === selId);

  const CATS = [
    "All",
    ...Array.from(new Set(DRUGS.map((d) => d.category))).sort(),
  ];

  const filtered = DRUGS.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.sku.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "low" && d.status === "Low Stock") ||
      (filter === "out" && d.status === "Out of Stock") ||
      (filter === "expiring" && d.status === "Expiring");
    const matchCat = catFilter === "All" || d.category === catFilter;
    return matchSearch && matchFilter && matchCat;
  }).sort((a, b) => {
    const av = (a as any)[sortCol],
      bv = (b as any)[sortCol];
    return (av > bv ? 1 : -1) * sortDir;
  });

  const closeAll = () => {
    setCtxMenu(null);
    setShowColMenu(false);
  };

  const kpi = {
    low: DRUGS.filter((d) => d.status === "Low Stock").length,
    out: DRUGS.filter((d) => d.status === "Out of Stock").length,
    expiring: DRUGS.filter((d) => d.status === "Expiring").length,
    total: DRUGS.length,
  };

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortCol(col);
      setSortDir(1);
    }
  };

  return (
    <div
      onClick={closeAll}
      style={{
        ...seg,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: M.base,
        color: M.text,
        fontSize: 13,
        userSelect: "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Title bar ───────────────────────────────────────────────────── */}
      <div
        style={
          {
            height: 32,
            background: M.mica0,
            borderBottom: `1px solid ${M.border}`,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            WebkitAppRegion: "drag",
          } as any
        }
      >
        <div
          style={
            {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 14px",
              WebkitAppRegion: "no-drag",
            } as any
          }
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: M.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pill style={{ width: 9, height: 9, color: "white" }} />
          </div>
          <span style={{ fontSize: 12, color: M.textSub, letterSpacing: 0.1 }}>
            PharmOS
          </span>
          <span style={{ fontSize: 11, color: M.border, margin: "0 2px" }}>
            ·
          </span>
          {/* Inline KPI strip in titlebar */}
          <span style={{ fontSize: 11, color: M.textMuted }}>Inventory</span>
          <span style={{ fontSize: 11, color: M.textMuted, margin: "0 4px" }}>
            |
          </span>
          <span style={{ fontSize: 11, color: M.textMuted }}>
            Low: <b style={{ color: M.warn }}>{kpi.low}</b>
          </span>
          <span style={{ fontSize: 11, color: M.border, margin: "0 3px" }}>
            ·
          </span>
          <span style={{ fontSize: 11, color: M.textMuted }}>
            Out: <b style={{ color: M.danger }}>{kpi.out}</b>
          </span>
          <span style={{ fontSize: 11, color: M.border, margin: "0 3px" }}>
            ·
          </span>
          <span style={{ fontSize: 11, color: M.textMuted }}>
            Exp: <b style={{ color: M.warn }}>{kpi.expiring}</b>
          </span>
          <span style={{ fontSize: 11, color: M.border, margin: "0 3px" }}>
            ·
          </span>
          <span style={{ fontSize: 11, color: M.textMuted }}>
            Total: <b style={{ color: M.info }}>{kpi.total}</b>
          </span>
        </div>
        <div style={{ flex: 1 }} />
        {/* Window controls */}
        {[{ icon: Minus }, { icon: Square }, { icon: X }].map(
          ({ icon: Icon }, i) => (
            <button
              key={i}
              style={winBtn}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  i === 2 ? "#c42b1c" : "rgba(255,255,255,.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              <Icon style={{ width: 10, height: 10, color: M.textSub }} />
            </button>
          ),
        )}
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* ── Icon sidebar (56px) ────────────────────────────────────────── */}
        <div
          style={{
            width: 52,
            background: M.mica0,
            borderRight: `1px solid ${M.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 8,
            flexShrink: 0,
            gap: 4,
            position: "relative",
          }}
        >
          {NAV.map((n, i) => {
            const Icon = n.icon;
            const active = !!n.active;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onMouseEnter={(e) => {
                    setTooltip({
                      label: n.label,
                      x: 58,
                      y: e.currentTarget.getBoundingClientRect().top + 13,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    width: 36,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: active ? "rgba(0,120,212,.18)" : "transparent",
                    outline: active ? `1px solid rgba(0,120,212,.4)` : "none",
                    transition: "background 120ms",
                  }}
                  onClick={() => {}}
                >
                  <Icon
                    style={{
                      width: 16,
                      height: 16,
                      color: active ? M.accent : M.textMuted,
                    }}
                  />
                </button>
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 18,
                      background: M.accent,
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                )}
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#0078d4,#6b69d6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "white",
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            RK
          </div>
        </div>

        {/* ── Main workspace ─────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: M.base,
          }}
        >
          {/* Command bar */}
          <div
            style={{
              height: 44,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 14px",
              borderBottom: `1px solid ${M.border}`,
              flexShrink: 0,
              background: M.mica1,
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: "0 0 260px" }}>
              <Search
                style={{
                  position: "absolute",
                  left: 9,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 13,
                  height: 13,
                  color: M.textMuted,
                }}
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search inventory, SKU, barcode…"
                style={{
                  width: "100%",
                  height: 30,
                  paddingLeft: 30,
                  paddingRight: search ? 28 : 10,
                  fontSize: 12,
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${M.border}`,
                  borderRadius: 4,
                  color: M.text,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = M.accent)}
                onBlur={(e) => (e.target.style.borderColor = M.border)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 7,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: M.textMuted,
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X style={{ width: 12, height: 12 }} />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <CmdBtn icon={Plus} label="Add" primary />
            <CmdBtn icon={ArrowLeftRight} label="Transfer" />
            <div style={{ position: "relative" }}>
              <CmdBtn
                icon={ChevronDown}
                label="Actions"
                dropdown
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                }}
              />
            </div>

            <div style={{ flex: 1 }} />

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* Column visibility */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setShowColMenu(!showColMenu);
                  }}
                  title="Toggle columns"
                  style={{
                    ...iconBtnD,
                    background: showColMenu
                      ? "rgba(255,255,255,.1)"
                      : "transparent",
                  }}
                >
                  <Columns style={{ width: 14, height: 14 }} />
                </button>
                {showColMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "calc(100%+6px)",
                      right: 0,
                      background: M.mica2,
                      border: `1px solid ${M.border}`,
                      borderRadius: 6,
                      padding: "8px 12px",
                      zIndex: 300,
                      minWidth: 160,
                      boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: 10,
                        color: M.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        fontWeight: 600,
                      }}
                    >
                      Visible Columns
                    </p>
                    {[
                      "Name",
                      "SKU",
                      "Stock",
                      "Expiry",
                      "Location",
                      "Supplier",
                      "Status",
                    ].map((c) => (
                      <label
                        key={c}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "4px 0",
                          cursor: "pointer",
                          fontSize: 12,
                          color: M.textSub,
                        }}
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          style={{ accentColor: M.accent }}
                        />{" "}
                        {c}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Density */}
              <div
                style={{
                  display: "flex",
                  border: `1px solid ${M.border}`,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                {(["compact", "ultra"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    title={d === "compact" ? "Compact" : "Ultra-compact"}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      background:
                        density === d ? "rgba(0,120,212,.25)" : "transparent",
                      color: density === d ? M.accent : M.textMuted,
                    }}
                  >
                    {d === "compact" ? (
                      <AlignJustify style={{ width: 13, height: 13 }} />
                    ) : (
                      <AlignStartVertical style={{ width: 13, height: 13 }} />
                    )}
                  </button>
                ))}
              </div>

              <button title="Export" style={iconBtnD}>
                <Download style={{ width: 14, height: 14 }} />
              </button>
              <button title="Refresh" style={iconBtnD}>
                <RefreshCw style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          {/* Filter layer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              padding: "0 14px",
              height: 34,
              borderBottom: `1px solid ${M.borderB}`,
              flexShrink: 0,
              background: M.mica1,
            }}
          >
            {/* Segmented tabs — underline style */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                height: "100%",
                gap: 0,
                marginRight: 16,
              }}
            >
              {(
                [
                  { k: "all", label: `All (${DRUGS.length})` },
                  { k: "low", label: `Low (${kpi.low})`, color: M.warn },
                  { k: "out", label: `Out (${kpi.out})`, color: M.danger },
                  {
                    k: "expiring",
                    label: `Expiring (${kpi.expiring})`,
                    color: M.warn,
                  },
                ] as const
              ).map((item) => {
                const { k, label } = item;
                const color = "color" in item ? item.color : undefined;
                const active = filter === (k as any);
                return (
                  <button
                    key={k}
                    onClick={() => setFilter(k as any)}
                    style={{
                      height: "100%",
                      padding: "0 14px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      background: "transparent",
                      color: active ? (color ?? M.accent) : M.textMuted,
                      fontWeight: active ? 600 : 400,
                      borderBottom: active
                        ? `2px solid ${color ?? M.accent}`
                        : "2px solid transparent",
                      transition: "all 120ms",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                width: 1,
                height: 16,
                background: M.border,
                marginRight: 12,
              }}
            />
            {/* Category + supplier dropdowns */}
            <div style={{ display: "flex", gap: 6 }}>
              {/* Category dropdown */}
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                style={{
                  height: 24,
                  padding: "0 8px",
                  fontSize: 11,
                  background: M.mica2,
                  border: `1px solid ${M.border}`,
                  borderRadius: 4,
                  color: M.textSub,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <DropBtn label="Supplier" />
              <DropBtn label="Location" />
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: M.textMuted }}>
              {filtered.length} items
            </span>
          </div>

          {/* Table */}
          <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 700,
                }}
              >
                <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                  <tr
                    style={{
                      background: M.mica2,
                      borderBottom: `1px solid ${M.border}`,
                    }}
                  >
                    <th style={{ width: 3, padding: 0 }} />
                    {[
                      { label: "Drug Name", col: "name", flex: true },
                      { label: "SKU", col: "sku", mono: true },
                      { label: "Stock", col: "stock", num: true },
                      { label: "Expiry", col: "expiry" },
                      { label: "Location", col: "location" },
                      { label: "Supplier", col: "supplier" },
                      { label: "Status", col: "status" },
                    ].map(({ label, col, flex: fl, mono, num }) => {
                      const sorted = sortCol === col;
                      return (
                        <th
                          key={col}
                          onClick={() => handleSort(col)}
                          style={{
                            padding: `5px ${fl ? "10px" : "10px"}`,
                            fontSize: 10,
                            color: sorted ? M.accent : M.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                            fontWeight: 600,
                            textAlign: num ? "right" : "left",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            background: sorted
                              ? "rgba(0,120,212,.08)"
                              : undefined,
                            borderRight: `1px solid ${M.borderB}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              justifyContent: num ? "flex-end" : "flex-start",
                            }}
                          >
                            {label}
                            {sorted ? (
                              sortDir === 1 ? (
                                <ChevronUp style={{ width: 10, height: 10 }} />
                              ) : (
                                <ChevronDown
                                  style={{ width: 10, height: 10 }}
                                />
                              )
                            ) : null}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((drug, i) => {
                    const active = selId === drug.id;
                    const ss = statusStyle(drug.status);
                    return (
                      <tr
                        key={drug.id}
                        onClick={() => setSelId(active ? null : drug.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCtxMenu({
                            id: drug.id,
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }}
                        style={{
                          height: ROW_H,
                          cursor: "pointer",
                          borderBottom: `1px solid ${M.borderB}`,
                          background: active
                            ? "rgba(0,120,212,.12)"
                            : i % 2 === 1
                              ? "rgba(255,255,255,.02)"
                              : M.base,
                          transition: "background 120ms",
                          boxShadow: active
                            ? `inset 0 0 0 1px rgba(0,120,212,.3)`
                            : undefined,
                        }}
                        onMouseEnter={(e) => {
                          if (!active)
                            (
                              e.currentTarget as HTMLTableRowElement
                            ).style.background = "rgba(255,255,255,.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active)
                            (
                              e.currentTarget as HTMLTableRowElement
                            ).style.background =
                              i % 2 === 1 ? "rgba(255,255,255,.02)" : M.base;
                        }}
                      >
                        {/* Left strip */}
                        <td style={{ width: 3, padding: 0 }}>
                          <div
                            style={{
                              width: 3,
                              height: ROW_H,
                              background: M.strip[drug.strip],
                            }}
                          />
                        </td>
                        {/* Drug name */}
                        <td style={{ padding: `0 10px`, maxWidth: 220 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                            }}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                background: "rgba(0,120,212,.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Pill
                                style={{
                                  width: 11,
                                  height: 11,
                                  color: M.accent,
                                }}
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: M.text,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {drug.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            fontFamily: "monospace",
                            fontSize: 11,
                            color: M.textMuted,
                            borderLeft: `1px solid ${M.borderB}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {drug.sku}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            textAlign: "right",
                            borderLeft: `1px solid ${M.borderB}`,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                drug.stock === 0
                                  ? M.danger
                                  : drug.stock <= drug.reorder
                                    ? M.warn
                                    : M.text,
                              fontSize: 13,
                            }}
                          >
                            {drug.stock === 0 ? "—" : drug.stock}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: M.textMuted,
                              marginLeft: 3,
                            }}
                          >
                            {drug.unit}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            borderLeft: `1px solid ${M.borderB}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {drug.status === "Expiring" ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: M.warn,
                                fontSize: 12,
                              }}
                            >
                              <Clock style={{ width: 11, height: 11 }} />
                              {drug.expiry}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: 12,
                                color:
                                  drug.expiryMs === 0 ? M.textMuted : M.textSub,
                              }}
                            >
                              {drug.expiry}
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            borderLeft: `1px solid ${M.borderB}`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: M.textMuted,
                              fontFamily: "monospace",
                            }}
                          >
                            {drug.location}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            borderLeft: `1px solid ${M.borderB}`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: M.textMuted,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 120,
                              display: "block",
                            }}
                          >
                            {drug.supplier}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            borderLeft: `1px solid ${M.borderB}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: ss.dot,
                                flexShrink: 0,
                                boxShadow: `0 0 4px ${ss.dot}60`,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                color: ss.color,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {drug.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Right context panel (256px) ──────────────────────────── */}
            {sel && (
              <div
                style={{
                  width: 256,
                  borderLeft: `1px solid ${M.border}`,
                  display: "flex",
                  flexDirection: "column",
                  background: M.mica1,
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {/* Panel header */}
                <div
                  style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${M.border}`,
                    background: M.mica2,
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
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: "rgba(0,120,212,.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Pill
                        style={{ width: 15, height: 15, color: M.accent }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 600,
                          color: M.text,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sel.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 10,
                          color: M.textMuted,
                          fontFamily: "monospace",
                        }}
                      >
                        {sel.sku}
                      </p>
                    </div>
                  </div>
                  {/* Status row */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {(() => {
                      const ss = statusStyle(sel.status);
                      return (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 10,
                            color: ss.color,
                          }}
                        >
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: ss.dot,
                              boxShadow: `0 0 4px ${ss.dot}`,
                            }}
                          />
                          {sel.status}
                        </span>
                      );
                    })()}
                    <span style={{ flex: 1 }} />
                    <span
                      style={{
                        fontSize: 10,
                        color: M.textMuted,
                        fontFamily: "monospace",
                      }}
                    >
                      {sel.location}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    borderBottom: `1px solid ${M.border}`,
                    background: M.mica2,
                    flexShrink: 0,
                  }}
                >
                  {(["details", "lots", "history"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPanelTab(t)}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        background: "transparent",
                        color: panelTab === t ? M.accent : M.textMuted,
                        fontWeight: panelTab === t ? 600 : 400,
                        borderBottom:
                          panelTab === t
                            ? `2px solid ${M.accent}`
                            : "2px solid transparent",
                        textTransform: "capitalize",
                        transition: "all 120ms",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Panel content */}
                <div
                  style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}
                >
                  {panelTab === "details" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <DRow label="Category" val={sel.category} />
                      <DRow label="SKU" val={sel.sku} mono />
                      <DRow label="Unit" val={sel.unit} />
                      <DRow
                        label="Price"
                        val={`₹${sel.price.toFixed(2)}`}
                        accent
                      />
                      <div
                        style={{
                          height: 1,
                          background: M.border,
                          margin: "2px 0",
                        }}
                      />
                      <DRow
                        label="Current Stock"
                        val={`${sel.stock} ${sel.unit}`}
                        bold
                        color={
                          sel.stock === 0
                            ? M.danger
                            : sel.stock <= sel.reorder
                              ? M.warn
                              : M.success
                        }
                      />
                      <DRow
                        label="Reorder Level"
                        val={`${sel.reorder} ${sel.unit}`}
                      />
                      <DRow
                        label="Expiry"
                        val={sel.expiry}
                        color={sel.status === "Expiring" ? M.warn : undefined}
                      />
                      <DRow label="Location" val={sel.location} mono />
                      <DRow label="Supplier" val={sel.supplier} />
                      <div
                        style={{
                          height: 1,
                          background: M.border,
                          margin: "2px 0",
                        }}
                      />
                      <DRow label="Monthly Moves" val={`${sel.movements}×`} />
                      <DRow label="Last Sold" val={sel.lastSold} />

                      {/* Stock level bar */}
                      <div style={{ marginTop: 4 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 10,
                            color: M.textMuted,
                            marginBottom: 4,
                          }}
                        >
                          <span>Stock Level</span>
                          <span
                            style={{
                              color:
                                sel.stock <= sel.reorder ? M.warn : M.success,
                            }}
                          >
                            {Math.round(
                              (sel.stock / Math.max(sel.reorder * 2, 1)) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            background: "rgba(255,255,255,.06)",
                            borderRadius: 4,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 4,
                              transition: "width .3s",
                              background:
                                sel.stock === 0
                                  ? M.danger
                                  : sel.stock <= sel.reorder
                                    ? M.warn
                                    : M.success,
                              width: `${Math.min(100, Math.round((sel.stock / Math.max(sel.reorder * 2, 1)) * 100))}%`,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 9,
                            color: M.textMuted,
                            marginTop: 3,
                          }}
                        >
                          <span>0</span>
                          <span>Reorder: {sel.reorder}</span>
                          <span>{sel.reorder * 2}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {panelTab === "lots" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 10,
                          color: M.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontWeight: 600,
                        }}
                      >
                        Lots · FEFO Order
                      </p>
                      {selLots.length === 0 ? (
                        <p
                          style={{
                            fontSize: 11,
                            color: M.textMuted,
                            fontStyle: "italic",
                          }}
                        >
                          No lot data available
                        </p>
                      ) : (
                        selLots
                          .sort(
                            (a, b) =>
                              new Date(a.expiry).getTime() -
                              new Date(b.expiry).getTime(),
                          )
                          .map((lot, i) => (
                            <div
                              key={lot.id}
                              style={{
                                padding: "8px 10px",
                                borderRadius: 4,
                                border: `1px solid ${lot.urgent ? M.warn + "60" : M.border}`,
                                background: lot.urgent
                                  ? "rgba(252,186,25,.06)"
                                  : M.mica2,
                                cursor: "pointer",
                                transition: "background 120ms",
                              }}
                              onMouseEnter={(e) =>
                                ((
                                  e.currentTarget as HTMLDivElement
                                ).style.background = lot.urgent
                                  ? "rgba(252,186,25,.1)"
                                  : "rgba(255,255,255,.04)")
                              }
                              onMouseLeave={(e) =>
                                ((
                                  e.currentTarget as HTMLDivElement
                                ).style.background = lot.urgent
                                  ? "rgba(252,186,25,.06)"
                                  : M.mica2)
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: 4,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontFamily: "monospace",
                                    color: M.text,
                                    fontWeight: 600,
                                  }}
                                >
                                  {lot.lotNo}
                                </span>
                                {lot.urgent && (
                                  <span
                                    style={{
                                      fontSize: 9,
                                      color: M.warn,
                                      background: "rgba(252,186,25,.15)",
                                      padding: "1px 5px",
                                      borderRadius: 3,
                                      fontWeight: 600,
                                    }}
                                  >
                                    FEFO
                                  </span>
                                )}
                                {i === 0 && !lot.urgent && (
                                  <span
                                    style={{
                                      fontSize: 9,
                                      color: M.accent,
                                      background: M.accentL,
                                      padding: "1px 5px",
                                      borderRadius: 3,
                                    }}
                                  >
                                    First Out
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: 11,
                                  color: M.textSub,
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    color: lot.urgent ? M.warn : M.textSub,
                                  }}
                                >
                                  <Clock style={{ width: 10, height: 10 }} />
                                  {lot.expiry}
                                </span>
                                <span
                                  style={{ fontWeight: 600, color: M.text }}
                                >
                                  {lot.qty} {sel.unit}
                                </span>
                              </div>
                            </div>
                          ))
                      )}
                      {selLots.length > 0 && (
                        <div
                          style={{
                            marginTop: 4,
                            padding: "6px 10px",
                            background: "rgba(0,120,212,.08)",
                            borderRadius: 4,
                            border: `1px solid ${M.accentL}`,
                            fontSize: 11,
                            color: M.textSub,
                          }}
                        >
                          Total across lots:{" "}
                          <b style={{ color: M.text }}>
                            {selLots.reduce((s, l) => s + l.qty, 0)} {sel.unit}
                          </b>
                        </div>
                      )}
                    </div>
                  )}

                  {panelTab === "history" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 10,
                          color: M.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontWeight: 600,
                        }}
                      >
                        Stock Movements
                      </p>
                      {HISTORY.map((h, i) => {
                        const pos = h.qty > 0;
                        const typeColor =
                          h.type === "Sale"
                            ? "#f7a"
                            : h.type === "Received"
                              ? M.success
                              : h.type === "Adjusted"
                                ? M.warn
                                : M.purple;
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 8,
                              padding: "7px 0",
                              borderBottom: `1px solid ${M.borderB}`,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 4,
                                background: "rgba(255,255,255,.04)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {h.type === "Sale" ? (
                                <ShoppingCart
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: typeColor,
                                  }}
                                />
                              ) : h.type === "Received" ? (
                                <Package
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: typeColor,
                                  }}
                                />
                              ) : h.type === "Adjusted" ? (
                                <Edit2
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: typeColor,
                                  }}
                                />
                              ) : (
                                <ArrowLeftRight
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: typeColor,
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: typeColor,
                                  }}
                                >
                                  {h.type}
                                </span>
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: pos ? M.success : M.danger,
                                  }}
                                >
                                  {pos ? "+" : ""}
                                  {h.qty}
                                </span>
                              </div>
                              <p
                                style={{
                                  margin: "1px 0 0",
                                  fontSize: 10,
                                  color: M.textMuted,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {h.note}
                              </p>
                              <p
                                style={{
                                  margin: "1px 0 0",
                                  fontSize: 9,
                                  color: M.textMuted,
                                  opacity: 0.6,
                                }}
                              >
                                {h.date}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Panel actions */}
                <div
                  style={{
                    padding: "8px 10px",
                    borderTop: `1px solid ${M.border}`,
                    display: "flex",
                    gap: 5,
                    flexShrink: 0,
                    background: M.mica2,
                  }}
                >
                  <button style={{ ...panelPrimBtn, flex: 1 }}>
                    <Edit2 style={{ width: 11, height: 11 }} /> Edit
                  </button>
                  <button style={panelSecBtn} title="Adjust stock">
                    <ArrowDownUp style={{ width: 11, height: 11 }} />
                  </button>
                  <button style={panelSecBtn} title="Transfer">
                    <ArrowLeftRight style={{ width: 11, height: 11 }} />
                  </button>
                  <button style={panelSecBtn} title="History">
                    <Activity style={{ width: 11, height: 11 }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Status bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 22,
          background: M.mica0,
          borderTop: `1px solid ${M.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <StatusItem
          icon={
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: M.success,
                boxShadow: `0 0 4px ${M.success}`,
              }}
            />
          }
          label="Connected"
          color={M.success}
        />
        <StatusItem
          icon={<RefreshCw style={{ width: 10, height: 10 }} />}
          label="Sync OK"
        />
        <StatusSep />
        <StatusItem
          icon={<AlertTriangle style={{ width: 10, height: 10 }} />}
          label={`Low: ${kpi.low}`}
          color={M.warn}
        />
        <StatusItem
          icon={<AlertCircle style={{ width: 10, height: 10 }} />}
          label={`Out: ${kpi.out}`}
          color={M.danger}
        />
        <StatusItem
          icon={<Clock style={{ width: 10, height: 10 }} />}
          label={`Exp: ${kpi.expiring}`}
          color={M.warn}
        />
        <StatusItem
          icon={<Package style={{ width: 10, height: 10 }} />}
          label={`Total: ${kpi.total}`}
          color={M.info}
        />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: M.textMuted }}>
          Shift 2 · Dr. Ravi K. · 14:35
        </span>
        <StatusSep />
        <span style={{ fontSize: 10, color: M.textMuted }}>
          Dbl-click to edit · Right-click for actions
        </span>
      </div>

      {/* ── Right-click context menu ────────────────────────────────────── */}
      {ctxMenu &&
        (() => {
          const drug = DRUGS.find((d) => d.id === ctxMenu.id);
          if (!drug) return null;
          return (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                left: ctxMenu.x,
                top: ctxMenu.y,
                width: 200,
                background: M.mica2,
                border: `1px solid ${M.border}`,
                borderRadius: 6,
                padding: "4px 0",
                zIndex: 500,
                boxShadow: "0 8px 24px rgba(0,0,0,.5)",
              }}
            >
              <div
                style={{
                  padding: "5px 12px 7px",
                  borderBottom: `1px solid ${M.border}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: M.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {drug.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: M.textMuted,
                    fontFamily: "monospace",
                  }}
                >
                  {drug.sku}
                </p>
              </div>
              {[
                {
                  icon: Edit2,
                  label: "Edit",
                  action: () => {
                    setSelId(drug.id);
                    setPanelTab("details");
                    closeAll();
                  },
                },
                { icon: ArrowDownUp, label: "Adjust Stock", action: closeAll },
                { icon: ArrowLeftRight, label: "Transfer", action: closeAll },
                {
                  icon: History,
                  label: "View History",
                  action: () => {
                    setSelId(drug.id);
                    setPanelTab("history");
                    closeAll();
                  },
                },
                {
                  icon: Layers,
                  label: "View Lots",
                  action: () => {
                    setSelId(drug.id);
                    setPanelTab("lots");
                    closeAll();
                  },
                },
              ].map(({ icon: Icon, label, action }, i) => (
                <div
                  key={i}
                  onClick={action}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background =
                      "rgba(255,255,255,.06)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background =
                      "transparent")
                  }
                >
                  <Icon style={{ width: 13, height: 13, color: M.textMuted }} />
                  <span style={{ fontSize: 12, color: M.text }}>{label}</span>
                </div>
              ))}
            </div>
          );
        })()}

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y - 14,
            background: M.mica2,
            border: `1px solid ${M.border}`,
            borderRadius: 4,
            padding: "4px 8px",
            fontSize: 11,
            color: M.text,
            zIndex: 600,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,.4)",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function CmdBtn({ icon: Icon, label, primary, dropdown, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        height: 30,
        padding: "0 12px",
        borderRadius: 4,
        border: `1px solid ${primary ? M.accent : M.border}`,
        background: primary ? "rgba(0,120,212,.25)" : "rgba(255,255,255,.04)",
        color: primary ? M.accent : M.textSub,
        fontSize: 12,
        cursor: "pointer",
        fontWeight: primary ? 500 : 400,
        transition: "background 120ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = primary
          ? "rgba(0,120,212,.35)"
          : "rgba(255,255,255,.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = primary
          ? "rgba(0,120,212,.25)"
          : "rgba(255,255,255,.04)";
      }}
    >
      <Icon style={{ width: 13, height: 13 }} />
      {label}
      {dropdown && (
        <ChevronDown style={{ width: 10, height: 10, opacity: 0.6 }} />
      )}
    </button>
  );
}

function DropBtn({ label }: { label: string }) {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 24,
        padding: "0 9px",
        border: `1px solid ${M.border}`,
        borderRadius: 4,
        fontSize: 11,
        background: "rgba(255,255,255,.04)",
        color: M.textMuted,
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,.08)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,.04)")
      }
    >
      {label} <ChevronDown style={{ width: 9, height: 9 }} />
    </button>
  );
}

function DRow({
  label,
  val,
  bold,
  accent,
  mono,
  color,
}: {
  label: string;
  val: string;
  bold?: boolean;
  accent?: boolean;
  mono?: boolean;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontSize: 11, color: M.textMuted, flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: bold ? 700 : 400,
          color: color ?? (accent ? M.accent : M.text),
          fontFamily: mono ? "monospace" : "inherit",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {val}
      </span>
    </div>
  );
}

function StatusItem({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        color: color ?? M.textMuted,
      }}
    >
      {icon}
      {label}
    </span>
  );
}
function StatusSep() {
  return <span style={{ width: 1, height: 12, background: M.border }} />;
}

// ─── Style constants ────────────────────────────────────────────────────────
const winBtn: React.CSSProperties = {
  width: 46,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  transition: "background 120ms",
};
const iconBtnD: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${M.border}`,
  borderRadius: 4,
  background: "rgba(255,255,255,.04)",
  color: M.textMuted,
  cursor: "pointer",
};
const panelPrimBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  height: 26,
  padding: "0 10px",
  borderRadius: 4,
  border: `1px solid ${M.accent}`,
  background: "rgba(0,120,212,.2)",
  color: M.accent,
  fontSize: 11,
  cursor: "pointer",
};
const panelSecBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 26,
  width: 28,
  borderRadius: 4,
  border: `1px solid ${M.border}`,
  background: "rgba(255,255,255,.04)",
  color: M.textMuted,
  cursor: "pointer",
};
