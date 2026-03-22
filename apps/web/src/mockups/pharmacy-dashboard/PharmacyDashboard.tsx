import { useState } from "react";
import {
  Package,
  ShoppingCart,
  BarChart2,
  Users,
  Truck,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  X,
  Minus,
  Square,
  Plus,
  Edit2,
  Trash2,
  Download,
  Filter,
  Pill,
  CreditCard,
  LayoutDashboard,
  ChevronLeft,
  Zap,
  UserCheck,
  Settings,
  HelpCircle,
  RefreshCw,
  SortAsc,
  Maximize2,
} from "lucide-react";

type Module =
  | "dashboard"
  | "inventory"
  | "pos"
  | "purchases"
  | "reports"
  | "customers"
  | "suppliers";

const drugs = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    sku: "AMX-500",
    stock: 240,
    exp: "2026-03",
    price: 12.5,
    supplier: "MedSupply Co",
    status: "ok",
    category: "Antibiotic",
  },
  {
    id: 2,
    name: "Paracetamol 650mg",
    sku: "PCT-650",
    stock: 18,
    exp: "2025-09",
    price: 4.2,
    supplier: "PharmGen",
    status: "low",
    category: "Analgesic",
  },
  {
    id: 3,
    name: "Metformin 500mg",
    sku: "MET-500",
    stock: 302,
    exp: "2026-08",
    price: 8.75,
    supplier: "GeneriCo",
    status: "ok",
    category: "Antidiabetic",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    sku: "OMZ-020",
    stock: 85,
    exp: "2025-06",
    price: 15.0,
    supplier: "MedSupply Co",
    status: "expiring",
    category: "GI",
  },
  {
    id: 5,
    name: "Atorvastatin 10mg",
    sku: "ATV-010",
    stock: 0,
    exp: "2026-11",
    price: 22.3,
    supplier: "CardioPharm",
    status: "out",
    category: "Statin",
  },
  {
    id: 6,
    name: "Lisinopril 5mg",
    sku: "LSN-005",
    stock: 145,
    exp: "2027-01",
    price: 9.9,
    supplier: "CardioPharm",
    status: "ok",
    category: "ACE Inhibitor",
  },
  {
    id: 7,
    name: "Cetirizine 10mg",
    sku: "CTZ-010",
    stock: 12,
    exp: "2025-08",
    price: 6.4,
    supplier: "AllergyRx",
    status: "low",
    category: "Antihistamine",
  },
  {
    id: 8,
    name: "Azithromycin 250mg",
    sku: "AZT-250",
    stock: 67,
    exp: "2025-05",
    price: 18.6,
    supplier: "PharmGen",
    status: "expiring",
    category: "Antibiotic",
  },
  {
    id: 9,
    name: "Ibuprofen 400mg",
    sku: "IBU-400",
    stock: 389,
    exp: "2027-03",
    price: 5.1,
    supplier: "GeneriCo",
    status: "ok",
    category: "NSAID",
  },
  {
    id: 10,
    name: "Losartan 50mg",
    sku: "LST-050",
    stock: 203,
    exp: "2026-06",
    price: 11.2,
    supplier: "CardioPharm",
    status: "ok",
    category: "ARB",
  },
  {
    id: 11,
    name: "Pantoprazole 40mg",
    sku: "PNT-040",
    stock: 7,
    exp: "2025-07",
    price: 19.8,
    supplier: "MedSupply Co",
    status: "low",
    category: "GI",
  },
  {
    id: 12,
    name: "Sertraline 50mg",
    sku: "SRT-050",
    stock: 94,
    exp: "2026-10",
    price: 28.5,
    supplier: "NeuroPharma",
    status: "ok",
    category: "SSRI",
  },
];

const cartItems = [
  { id: 1, name: "Amoxicillin 500mg", qty: 2, price: 12.5 },
  { id: 2, name: "Paracetamol 650mg", qty: 3, price: 4.2 },
  { id: 3, name: "Omeprazole 20mg", qty: 1, price: 15.0 },
];

// Windows 11 status tokens
const statusChip: Record<string, string> = {
  ok: "bg-[#dff6dd] text-[#107c10] border border-[#107c10]/20",
  low: "bg-[#fff4ce] text-[#7a5e00] border border-[#d4a017]/30",
  expiring: "bg-[#fed9cc] text-[#c43501] border border-[#d83b01]/25",
  out: "bg-[#fde7e9] text-[#a4262c] border border-[#a4262c]/25",
};
const statusDot: Record<string, string> = {
  ok: "bg-[#107c10]",
  low: "bg-[#d4a017]",
  expiring: "bg-[#d83b01]",
  out: "bg-[#a4262c]",
};
const statusLabel: Record<string, string> = {
  ok: "In Stock",
  low: "Low",
  expiring: "Expiring",
  out: "Out of Stock",
};

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "pos", icon: ShoppingCart, label: "Point of Sale" },
  { id: "inventory", icon: Package, label: "Inventory" },
  { id: "purchases", icon: Truck, label: "Purchases" },
  { id: "reports", icon: BarChart2, label: "Reports" },
  { id: "customers", icon: Users, label: "Customers" },
  { id: "suppliers", icon: Truck, label: "Suppliers" },
];

export function PharmacyDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>("inventory");
  const [selectedRow, setSelectedRow] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrugs = drugs.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const selectedDrug = drugs.find((d) => d.id === selectedRow);

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden select-none"
      style={{
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        background: "#f3f3f3",
        color: "#1a1a1a",
        fontSize: "12px",
      }}
    >
      {/* ── WINDOWS TITLE BAR ── */}
      <div
        style={{
          background: "#f0f0f0",
          borderBottom: "1px solid #d1d1d1",
          height: "32px",
        }}
        className="flex items-center shrink-0"
      >
        <div className="flex items-center gap-1.5 px-3">
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 3,
              background: "#0078d4",
            }}
            className="flex items-center justify-center"
          >
            <Pill style={{ width: 10, height: 10, color: "white" }} />
          </div>
          <span style={{ fontSize: 12, color: "#333", fontWeight: 400 }}>
            PharmOS — Pharmacy Management System
          </span>
        </div>
        <div className="flex-1" />
        {/* Window controls */}
        <div className="flex">
          {[
            { icon: Minus, title: "Minimize", hover: "#e5e5e5" },
            { icon: Square, title: "Maximize", hover: "#e5e5e5" },
            { icon: X, title: "Close", hover: "#c42b1c", textHover: "white" },
          ].map(({ icon: Icon, title, hover, textHover }) => (
            <button
              key={title}
              title={title}
              className="flex items-center justify-center transition-colors"
              style={{ width: 46, height: 32 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = hover;
                if (textHover)
                  (e.currentTarget as HTMLButtonElement).style.color =
                    textHover;
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
      </div>

      {/* ── RIBBON / COMMAND BAR ── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #d1d1d1",
          height: 44,
        }}
        className="flex items-center gap-1 px-2 shrink-0"
      >
        {/* Logo word */}
        <div
          className="flex items-center gap-2 pr-3 mr-1"
          style={{ borderRight: "1px solid #e0e0e0" }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#0078d4",
              letterSpacing: "-0.2px",
            }}
          >
            PharmOS
          </span>
        </div>

        {/* Ribbon buttons */}
        <RibbonBtn
          icon={ShoppingCart}
          label="New Sale"
          accent
          onClick={() => setActiveModule("pos")}
          hotkey="F1"
        />
        <RibbonBtn
          icon={Plus}
          label="Add Drug"
          onClick={() => setActiveModule("inventory")}
          hotkey="F2"
        />
        <div
          style={{
            width: 1,
            height: 28,
            background: "#e0e0e0",
            margin: "0 4px",
          }}
        />
        <RibbonBtn icon={RefreshCw} label="Refresh" />
        <RibbonBtn icon={Download} label="Export" />
        <RibbonBtn icon={Printer} label="Print" />
        <div
          style={{
            width: 1,
            height: 28,
            background: "#e0e0e0",
            margin: "0 4px",
          }}
        />

        {/* Search */}
        <div className="relative flex-1 max-w-xs mx-2">
          <Search
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: "#616161",
            }}
          />
          <input
            type="text"
            placeholder="Search drugs, SKUs, patients…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              height: 28,
              paddingLeft: 28,
              paddingRight: 36,
              fontSize: 12,
              border: "1px solid #c8c8c8",
              borderRadius: 4,
              background: "#fafafa",
              color: "#1a1a1a",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0078d4")}
            onBlur={(e) => (e.target.style.borderColor = "#c8c8c8")}
          />
          <span
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 10,
              color: "#919191",
              background: "#ebebeb",
              padding: "1px 4px",
              borderRadius: 3,
              border: "1px solid #d1d1d1",
            }}
          >
            F3
          </span>
        </div>

        <div className="flex-1" />

        {/* Alert pills */}
        <div className="flex items-center gap-1.5 mr-1">
          <AlertPill
            label="3 Expiring"
            color="#c43501"
            bg="#fed9cc"
            border="#d83b01"
          />
          <AlertPill
            label="4 Low Stock"
            color="#7a5e00"
            bg="#fff4ce"
            border="#d4a017"
          />
        </div>

        {/* Bell */}
        <button
          className="relative flex items-center justify-center transition-colors"
          style={{ width: 32, height: 32, borderRadius: 4, color: "#616161" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "#f0f0f0")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "transparent")
          }
        >
          <Bell style={{ width: 16, height: 16 }} />
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              background: "#c42b1c",
              borderRadius: "50%",
              border: "1.5px solid white",
            }}
          />
        </button>

        {/* User */}
        <div
          className="flex items-center gap-1.5 cursor-pointer rounded transition-colors"
          style={{ padding: "3px 8px" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background = "#f0f0f0")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              "transparent")
          }
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#0078d4,#6b69d6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "white",
            }}
          >
            RK
          </div>
          <span style={{ fontSize: 12, color: "#333" }}>Dr. Ravi K.</span>
          <ChevronDown style={{ width: 12, height: 12, color: "#919191" }} />
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT NAVIGATION PANE — Windows Explorer style */}
        <div
          style={{
            background: "white",
            borderRight: "1px solid #d1d1d1",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            width: sidebarExpanded ? 180 : 48,
            transition: "width 0.15s ease",
          }}
        >
          <nav style={{ flex: 1, paddingTop: 6 }}>
            {navItems.map(({ id, icon: Icon, label }) => {
              const active = activeModule === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveModule(id as Module)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 12px",
                    textAlign: "left",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 0,
                    background: active ? "rgba(0,120,212,0.1)" : "transparent",
                    color: active ? "#0078d4" : "#333",
                    borderLeft: active
                      ? "3px solid #0078d4"
                      : "3px solid transparent",
                    transition: "background 0.1s",
                    fontSize: 12,
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  <Icon
                    style={{
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                      color: active ? "#0078d4" : "#616161",
                    }}
                  />
                  {sidebarExpanded && (
                    <span style={{ fontWeight: active ? 600 : 400 }}>
                      {label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Today's Stats — mini panel */}
          {sidebarExpanded && (
            <div
              style={{ padding: "8px 12px", borderTop: "1px solid #e8e8e8" }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: "#919191",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                Today
              </p>
              {[
                { label: "Sales", value: "₹14,820", up: true },
                { label: "Profit", value: "₹3,940", up: true },
                { label: "Orders", value: "47", up: false },
              ].map(({ label, value, up }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#616161" }}>
                    {label}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#1a1a1a",
                      }}
                    >
                      {value}
                    </span>
                    {up ? (
                      <TrendingUp
                        style={{ width: 11, height: 11, color: "#107c10" }}
                      />
                    ) : (
                      <TrendingDown
                        style={{ width: 11, height: 11, color: "#a4262c" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            style={{
              height: 32,
              borderTop: "1px solid #e8e8e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#919191",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#f5f5f5")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "transparent")
            }
          >
            {sidebarExpanded ? (
              <ChevronLeft style={{ width: 14, height: 14 }} />
            ) : (
              <ChevronRight style={{ width: 14, height: 14 }} />
            )}
          </button>
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        {activeModule === "pos" ? (
          <POSView onClose={() => setActiveModule("inventory")} />
        ) : activeModule === "dashboard" ? (
          <DashboardView />
        ) : (
          <>
            {/* DATA GRID */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                background: "#fafafa",
                overflow: "hidden",
              }}
            >
              {/* Breadcrumb + Toolbar */}
              <div
                style={{
                  background: "white",
                  borderBottom: "1px solid #e0e0e0",
                  padding: "0 12px",
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 11, color: "#919191" }}>PharmOS</span>
                <ChevronRight
                  style={{ width: 12, height: 12, color: "#c8c8c8" }}
                />
                <span
                  style={{ fontSize: 11, color: "#0078d4", fontWeight: 600 }}
                >
                  Inventory
                </span>
                <span
                  style={{
                    width: 1,
                    height: 16,
                    background: "#e0e0e0",
                    margin: "0 4px",
                  }}
                />
                <span style={{ fontSize: 11, color: "#919191" }}>
                  {filteredDrugs.length} items
                </span>
                <div style={{ flex: 1 }} />
                <ToolbarBtn icon={Filter} label="Filter" />
                <ToolbarBtn icon={SortAsc} label="Sort" />
                <ToolbarBtn icon={Download} label="Export" />
                <ToolbarBtn icon={Maximize2} label="Expand" />
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: "#e0e0e0",
                    margin: "0 2px",
                  }}
                />
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    height: 26,
                    padding: "0 10px",
                    background: "#0078d4",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "#106ebe")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "#0078d4")
                  }
                >
                  <Plus style={{ width: 12, height: 12 }} />
                  Add Drug
                </button>
              </div>

              {/* Table */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        background: "white",
                        borderBottom: "1px solid #e0e0e0",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                      }}
                    >
                      {[
                        { label: "Drug Name", w: "auto" },
                        { label: "SKU", w: 90 },
                        { label: "Stock", w: 70 },
                        { label: "Expiry", w: 80 },
                        { label: "Price", w: 80 },
                        { label: "Category", w: 100 },
                        { label: "Supplier", w: 110 },
                        { label: "Status", w: 90 },
                        { label: "", w: 56 },
                      ].map(({ label, w }) => (
                        <th
                          key={label}
                          style={{
                            textAlign: "left",
                            padding: "6px 12px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#616161",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            width: typeof w === "number" ? w : undefined,
                            whiteSpace: "nowrap",
                            cursor: label ? "pointer" : "default",
                            userSelect: "none",
                          }}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrugs.map((drug, idx) => {
                      const selected = selectedRow === drug.id;
                      return (
                        <tr
                          key={drug.id}
                          onClick={() => setSelectedRow(drug.id)}
                          style={{
                            borderBottom: "1px solid #ebebeb",
                            background: selected
                              ? "rgba(0,120,212,0.07)"
                              : idx % 2 === 1
                                ? "#f9f9f9"
                                : "white",
                            cursor: "pointer",
                            boxShadow: selected
                              ? "inset 0 0 0 1.5px #0078d4"
                              : "none",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => {
                            if (!selected)
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = "#f0f6ff";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLTableRowElement
                            ).style.background = selected
                              ? "rgba(0,120,212,0.07)"
                              : idx % 2 === 1
                                ? "#f9f9f9"
                                : "white";
                          }}
                        >
                          <td
                            style={{
                              padding: "5px 12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  background:
                                    statusDot[drug.status] === "bg-[#107c10]"
                                      ? "#107c10"
                                      : statusDot[drug.status] ===
                                          "bg-[#d4a017]"
                                        ? "#d4a017"
                                        : statusDot[drug.status] ===
                                            "bg-[#d83b01]"
                                          ? "#d83b01"
                                          : "#a4262c",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "#1a1a1a",
                                }}
                              >
                                {drug.name}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "5px 12px",
                              fontSize: 11,
                              color: "#616161",
                              fontFamily: "Consolas, monospace",
                            }}
                          >
                            {drug.sku}
                          </td>
                          <td style={{ padding: "5px 12px" }}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color:
                                  drug.stock === 0
                                    ? "#a4262c"
                                    : drug.stock < 20
                                      ? "#7a5e00"
                                      : "#1a1a1a",
                              }}
                            >
                              {drug.stock}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "5px 12px",
                              fontSize: 11,
                              color:
                                drug.status === "expiring"
                                  ? "#c43501"
                                  : "#616161",
                            }}
                          >
                            {drug.exp}
                          </td>
                          <td
                            style={{
                              padding: "5px 12px",
                              fontSize: 12,
                              color: "#1a1a1a",
                              fontWeight: 500,
                            }}
                          >
                            ₹{drug.price.toFixed(2)}
                          </td>
                          <td style={{ padding: "5px 12px" }}>
                            <span
                              style={{
                                fontSize: 10,
                                padding: "2px 6px",
                                borderRadius: 3,
                                background: "#f0f0f0",
                                color: "#616161",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              {drug.category}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "5px 12px",
                              fontSize: 11,
                              color: "#616161",
                            }}
                          >
                            {drug.supplier}
                          </td>
                          <td style={{ padding: "5px 12px" }}>
                            <StatusChip status={drug.status} />
                          </td>
                          <td style={{ padding: "5px 8px" }}>
                            <div style={{ display: "flex", gap: 2 }}>
                              <IconBtn
                                icon={Edit2}
                                title="Edit"
                                color="#0078d4"
                              />
                              <IconBtn
                                icon={Trash2}
                                title="Delete"
                                color="#a4262c"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Status Bar */}
              <div
                style={{
                  height: 26,
                  background: "#0078d4",
                  borderTop: "1px solid #006ac1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 12px",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", gap: 16 }}>
                  {[
                    { icon: Plus, label: "New", key: "Ctrl+N" },
                    { icon: Edit2, label: "Edit", key: "F2" },
                    { icon: Trash2, label: "Delete", key: "Del" },
                  ].map(({ icon: Icon, label, key }) => (
                    <button
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 11,
                        cursor: "pointer",
                        padding: "0 4px",
                      }}
                    >
                      <Icon style={{ width: 11, height: 11 }} />
                      {label}
                      <span
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.55)",
                          marginLeft: 2,
                        }}
                      >
                        {key}
                      </span>
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                  ↑↓ Navigate · Enter Select · Esc Deselect
                </span>
              </div>
            </div>

            {/* RIGHT DETAILS PANE */}
            <div
              style={{
                width: 256,
                background: "white",
                borderLeft: "1px solid #d1d1d1",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {selectedDrug ? (
                <>
                  {/* Pane header */}
                  <div
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #e8e8e8",
                      background: "#f9f9f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                        <h3
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {selectedDrug.name}
                        </h3>
                        <p
                          style={{
                            fontSize: 10,
                            color: "#919191",
                            marginTop: 2,
                            fontFamily: "Consolas, monospace",
                          }}
                        >
                          {selectedDrug.sku}
                        </p>
                      </div>
                      <StatusChip status={selectedDrug.status} />
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {/* Key metrics grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        background: "#e8e8e8",
                        borderBottom: "1px solid #e8e8e8",
                      }}
                    >
                      {[
                        {
                          label: "Stock",
                          value: `${selectedDrug.stock}`,
                          sub: "units",
                        },
                        {
                          label: "Price",
                          value: `₹${selectedDrug.price}`,
                          sub: "per unit",
                        },
                        { label: "Expiry", value: selectedDrug.exp, sub: "" },
                        {
                          label: "Category",
                          value: selectedDrug.category,
                          sub: "",
                        },
                      ].map(({ label, value, sub }) => (
                        <div
                          key={label}
                          style={{ background: "white", padding: "8px 10px" }}
                        >
                          <p
                            style={{
                              fontSize: 9,
                              color: "#919191",
                              textTransform: "uppercase",
                              letterSpacing: 0.8,
                              margin: 0,
                            }}
                          >
                            {label}
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#1a1a1a",
                              margin: "2px 0 0",
                            }}
                          >
                            {value}
                          </p>
                          {sub && (
                            <p
                              style={{
                                fontSize: 9,
                                color: "#c8c8c8",
                                margin: 0,
                              }}
                            >
                              {sub}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Sales chart */}
                    <div
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #e8e8e8",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          color: "#919191",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          margin: "0 0 6px",
                        }}
                      >
                        Sales — 7 Days
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 4,
                          height: 52,
                        }}
                      >
                        {[18, 24, 15, 32, 28, 40, 35].map((h, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              height: "100%",
                            }}
                          >
                            <div
                              style={{
                                background:
                                  i === 5 ? "#0078d4" : "rgba(0,120,212,0.25)",
                                borderRadius: "2px 2px 0 0",
                                height: `${(h / 40) * 100}%`,
                                transition: "background 0.1s",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) =>
                                ((
                                  e.currentTarget as HTMLDivElement
                                ).style.background = "#0078d4")
                              }
                              onMouseLeave={(e) =>
                                ((
                                  e.currentTarget as HTMLDivElement
                                ).style.background =
                                  i === 5 ? "#0078d4" : "rgba(0,120,212,0.25)")
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", marginTop: 3 }}>
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                          <span
                            key={i}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              fontSize: 9,
                              color: "#919191",
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Alternatives */}
                    <div
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #e8e8e8",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          color: "#919191",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          margin: "0 0 6px",
                        }}
                      >
                        Alternatives
                      </p>
                      {["Generic Alt A", "Generic Alt B"].map((alt) => (
                        <div
                          key={alt}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "5px 8px",
                            background: "#f5f5f5",
                            borderRadius: 4,
                            border: "1px solid #e0e0e0",
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontSize: 11, color: "#333" }}>
                            {alt}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: "#107c10",
                              fontWeight: 500,
                            }}
                          >
                            Available
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Supplier */}
                    <div style={{ padding: "10px 12px" }}>
                      <p
                        style={{
                          fontSize: 10,
                          color: "#919191",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          margin: "0 0 4px",
                        }}
                      >
                        Supplier
                      </p>
                      <p style={{ fontSize: 12, color: "#333", margin: 0 }}>
                        {selectedDrug.supplier}
                      </p>
                      <button
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          color: "#0078d4",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        View Supplier →
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: "1px solid #e0e0e0",
                      display: "flex",
                      gap: 6,
                      background: "#f9f9f9",
                    }}
                  >
                    <button
                      style={{
                        flex: 1,
                        height: 28,
                        background: "#0078d4",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) =>
                        ((
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#106ebe")
                      }
                      onMouseLeave={(e) =>
                        ((
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#0078d4")
                      }
                    >
                      <ShoppingCart style={{ width: 12, height: 12 }} />
                      Add to Sale
                    </button>
                    <IconBtn
                      icon={Edit2}
                      title="Edit"
                      color="#0078d4"
                      size={28}
                    />
                    <IconBtn
                      icon={Trash2}
                      title="Delete"
                      color="#a4262c"
                      size={28}
                    />
                  </div>
                </>
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: "#919191",
                      textAlign: "center",
                      padding: "0 16px",
                    }}
                  >
                    Select a row to view details
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    ok: { bg: "#dff6dd", color: "#107c10", label: "In Stock" },
    low: { bg: "#fff4ce", color: "#7a5e00", label: "Low Stock" },
    expiring: { bg: "#fed9cc", color: "#c43501", label: "Expiring" },
    out: { bg: "#fde7e9", color: "#a4262c", label: "Out of Stock" },
  };
  const { bg, color, label } = map[status] || map.ok;
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 6px",
        borderRadius: 3,
        background: bg,
        color,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function RibbonBtn({
  icon: Icon,
  label,
  accent,
  onClick,
  hotkey,
}: {
  icon: any;
  label: string;
  accent?: boolean;
  onClick?: () => void;
  hotkey?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        height: 30,
        padding: "0 10px",
        borderRadius: 4,
        background: accent ? "#0078d4" : "transparent",
        color: accent ? "white" : "#333",
        border: accent ? "none" : "1px solid transparent",
        fontSize: 12,
        cursor: "pointer",
        fontWeight: accent ? 500 : 400,
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = accent
          ? "#106ebe"
          : "#f0f0f0";
        if (!accent)
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d1d1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = accent
          ? "#0078d4"
          : "transparent";
        if (!accent)
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "transparent";
      }}
    >
      <Icon style={{ width: 14, height: 14 }} />
      {label}
      {hotkey && (
        <span
          style={{
            fontSize: 10,
            color: accent ? "rgba(255,255,255,0.65)" : "#c8c8c8",
            marginLeft: 2,
          }}
        >
          {hotkey}
        </span>
      )}
    </button>
  );
}

function ToolbarBtn({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button
      title={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 26,
        padding: "0 8px",
        borderRadius: 4,
        background: "transparent",
        border: "1px solid transparent",
        color: "#616161",
        fontSize: 12,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d1d1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "transparent";
      }}
    >
      <Icon style={{ width: 13, height: 13 }} />
      <span style={{ fontSize: 11 }}>{label}</span>
    </button>
  );
}

function IconBtn({
  icon: Icon,
  title,
  color,
  size = 24,
}: {
  icon: any;
  title: string;
  color: string;
  size?: number;
}) {
  return (
    <button
      title={title}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        background: "transparent",
        border: "1px solid transparent",
        cursor: "pointer",
        color: "#919191",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = color;
        (e.currentTarget as HTMLButtonElement).style.background = `${color}15`;
        (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}30`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#919191";
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "transparent";
      }}
    >
      <Icon style={{ width: 12, height: 12 }} />
    </button>
  );
}

function AlertPill({
  label,
  color,
  bg,
  border,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}40`,
        cursor: "pointer",
      }}
    >
      <AlertTriangle style={{ width: 11, height: 11, color }} />
      <span style={{ fontSize: 11, color, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ── POS View ── */
function POSView({ onClose }: { onClose: () => void }) {
  const [cart, setCart] = useState(cartItems);
  const [payMethod, setPayMethod] = useState("Cash");
  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = total * 0.18;

  return (
    <div
      style={{ flex: 1, display: "flex", minHeight: 0, background: "#f3f3f3" }}
    >
      {/* Drug list */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #d1d1d1",
        }}
      >
        <div
          style={{
            background: "white",
            borderBottom: "1px solid #e0e0e0",
            padding: "0 12px",
            height: 36,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <ShoppingCart style={{ width: 14, height: 14, color: "#0078d4" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0078d4" }}>
            Point of Sale
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              background: "none",
              border: "none",
              color: "#616161",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#f0f0f0")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "none")
            }
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>
        <div
          style={{
            padding: 12,
            background: "white",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ position: "relative" }}>
            <Zap
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 14,
                height: 14,
                color: "#0078d4",
              }}
            />
            <input
              autoFocus
              placeholder="Scan barcode or type drug name…"
              style={{
                width: "100%",
                height: 32,
                paddingLeft: 30,
                paddingRight: 12,
                fontSize: 12,
                border: "1.5px solid #0078d4",
                borderRadius: 4,
                background: "white",
                color: "#1a1a1a",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          <p
            style={{
              fontSize: 10,
              color: "#919191",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Quick Select
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
            }}
          >
            {drugs
              .filter((d) => d.status !== "out")
              .slice(0, 9)
              .map((drug) => (
                <div
                  key={drug.id}
                  style={{
                    padding: "8px 10px",
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "border-color 0.1s, box-shadow 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "#0078d4";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 0 0 1px #0078d420";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "#e0e0e0";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                      margin: "0 0 4px",
                    }}
                  >
                    {drug.name}
                  </p>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0078d4",
                      }}
                    >
                      ₹{drug.price}
                    </span>
                    <span style={{ fontSize: 10, color: "#919191" }}>
                      {drug.stock} left
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Cart */}
      <div
        style={{
          width: 260,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #d1d1d1",
          background: "white",
        }}
      >
        <div
          style={{
            padding: "0 12px",
            height: 36,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#616161",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontWeight: 600,
            }}
          >
            Cart Items
          </span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              background: "#0078d4",
              color: "white",
              padding: "1px 6px",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            {cart.length}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#1a1a1a",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </p>
                <p
                  style={{ fontSize: 10, color: "#919191", margin: "1px 0 0" }}
                >
                  ₹{item.price} × {item.qty}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <button
                  onClick={() =>
                    setCart(
                      cart.map((c) =>
                        c.id === item.id
                          ? { ...c, qty: Math.max(1, c.qty - 1) }
                          : c,
                      ),
                    )
                  }
                  style={{
                    width: 20,
                    height: 20,
                    background: "#f0f0f0",
                    border: "1px solid #d1d1d1",
                    borderRadius: 3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    lineHeight: 1,
                    color: "#333",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    width: 18,
                    textAlign: "center",
                  }}
                >
                  {item.qty}
                </span>
                <button
                  onClick={() =>
                    setCart(
                      cart.map((c) =>
                        c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
                      ),
                    )
                  }
                  style={{
                    width: 20,
                    height: 20,
                    background: "#f0f0f0",
                    border: "1px solid #d1d1d1",
                    borderRadius: 3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    lineHeight: 1,
                    color: "#333",
                  }}
                >
                  +
                </button>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  width: 52,
                  textAlign: "right",
                }}
              >
                ₹{(item.qty * item.price).toFixed(2)}
              </span>
              <button
                onClick={() => setCart(cart.filter((c) => c.id !== item.id))}
                style={{
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#c8c8c8",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "#a4262c")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "#c8c8c8")
                }
              >
                <X style={{ width: 11, height: 11 }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary panel */}
      <div
        style={{
          width: 220,
          display: "flex",
          flexDirection: "column",
          background: "#f9f9f9",
        }}
      >
        <div
          style={{
            padding: "0 12px",
            height: 36,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <UserCheck style={{ width: 13, height: 13, color: "#0078d4" }} />
          <span
            style={{
              fontSize: 11,
              color: "#616161",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontWeight: 600,
            }}
          >
            Summary
          </span>
        </div>
        <div
          style={{
            flex: 1,
            padding: 12,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[
            { label: "Patient", placeholder: "Patient name…" },
            { label: "Doctor Ref.", placeholder: "Optional…" },
          ].map((f) => (
            <div key={f.label}>
              <p
                style={{
                  fontSize: 10,
                  color: "#919191",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  margin: "0 0 4px",
                }}
              >
                {f.label}
              </p>
              <input
                placeholder={f.placeholder}
                style={{
                  width: "100%",
                  height: 26,
                  border: "1px solid #c8c8c8",
                  borderRadius: 4,
                  padding: "0 8px",
                  fontSize: 12,
                  background: "white",
                  color: "#1a1a1a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0078d4")}
                onBlur={(e) => (e.target.style.borderColor = "#c8c8c8")}
              />
            </div>
          ))}
          <div>
            <p
              style={{
                fontSize: 10,
                color: "#919191",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                margin: "0 0 4px",
              }}
            >
              Discount
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                placeholder="0"
                style={{
                  flex: 1,
                  height: 26,
                  border: "1px solid #c8c8c8",
                  borderRadius: 4,
                  padding: "0 8px",
                  fontSize: 12,
                  background: "white",
                  color: "#1a1a1a",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0078d4")}
                onBlur={(e) => (e.target.style.borderColor = "#c8c8c8")}
              />
              <span
                style={{
                  height: 26,
                  padding: "0 8px",
                  background: "#f0f0f0",
                  border: "1px solid #d1d1d1",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  color: "#616161",
                }}
              >
                %
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 10 }}>
            {[
              { label: "Subtotal", value: `₹${total.toFixed(2)}` },
              { label: "GST (18%)", value: `₹${tax.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 11, color: "#919191" }}>{label}</span>
                <span style={{ fontSize: 11, color: "#333" }}>{value}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #e0e0e0",
                paddingTop: 6,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
                Total
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0078d4" }}>
                ₹{(total + tax).toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                color: "#919191",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                margin: "0 0 4px",
              }}
            >
              Payment Method
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              {["Cash", "Card", "UPI"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  style={{
                    flex: 1,
                    height: 28,
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: `1px solid ${payMethod === m ? "#0078d4" : "#d1d1d1"}`,
                    background: payMethod === m ? "#0078d4" : "white",
                    color: payMethod === m ? "white" : "#333",
                    transition: "all 0.1s",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "8px 10px",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <button
            style={{
              width: "100%",
              height: 32,
              background: "#107c10",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#0e6a0e")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#107c10")
            }
          >
            <CreditCard style={{ width: 14, height: 14 }} /> Process Payment
          </button>
          <div style={{ display: "flex", gap: 5 }}>
            {[
              { label: "Hold", bg: "#f0f0f0", color: "#333" },
              { label: "Cancel", bg: "#fde7e9", color: "#a4262c" },
            ].map(({ label, bg, color }) => (
              <button
                key={label}
                style={{
                  flex: 1,
                  height: 26,
                  background: bg,
                  color,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard View ── */
function DashboardView() {
  return (
    <div
      style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f3f3f3" }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 11, color: "#919191" }}>PharmOS</span>
        <ChevronRight style={{ width: 12, height: 12, color: "#c8c8c8" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#0078d4" }}>
          Dashboard
        </span>
      </div>
      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {[
          {
            label: "Today's Sales",
            value: "₹14,820",
            sub: "+12% vs yesterday",
            icon: DollarSign,
            accent: "#0078d4",
            bg: "#cce4f7",
          },
          {
            label: "Profit",
            value: "₹3,940",
            sub: "+8% vs yesterday",
            icon: TrendingUp,
            accent: "#107c10",
            bg: "#dff6dd",
          },
          {
            label: "Total Orders",
            value: "47",
            sub: "12 pending",
            icon: ShoppingCart,
            accent: "#6b69d6",
            bg: "#ebe9fc",
          },
          {
            label: "Low Stock Alerts",
            value: "7",
            sub: "Needs reorder",
            icon: AlertTriangle,
            accent: "#c43501",
            bg: "#fed9cc",
          },
        ].map(({ label, value, sub, icon: Icon, accent, bg }) => (
          <div
            key={label}
            style={{
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: 6,
              padding: "12px 14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <p style={{ fontSize: 11, color: "#616161", margin: 0 }}>
                {label}
              </p>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: bg,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon style={{ width: 14, height: 14, color: accent }} />
              </div>
            </div>
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 2px",
              }}
            >
              {value}
            </p>
            <p style={{ fontSize: 10, color: "#919191", margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>
      {/* Alerts */}
      <div
        style={{
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          padding: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#616161",
            textTransform: "uppercase",
            letterSpacing: 1,
            margin: "0 0 10px",
          }}
        >
          Smart Alerts
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            {
              type: "expiring",
              msg: "Omeprazole 20mg expires in 3 months — 85 units at risk",
            },
            {
              type: "low",
              msg: "Paracetamol 650mg below threshold (18 units) — avg daily use: 4 units",
            },
            {
              type: "low",
              msg: "Cetirizine 10mg running low (12 units) — consider restock",
            },
          ].map(({ type, msg }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 4,
                background: type === "expiring" ? "#fed9cc" : "#fff4ce",
                border: `1px solid ${type === "expiring" ? "#d83b0125" : "#d4a01730"}`,
              }}
            >
              <AlertTriangle
                style={{
                  width: 14,
                  height: 14,
                  flexShrink: 0,
                  color: type === "expiring" ? "#c43501" : "#7a5e00",
                }}
              />
              <span style={{ fontSize: 11, color: "#333", flex: 1 }}>
                {msg}
              </span>
              <button
                style={{
                  fontSize: 11,
                  color: "#0078d4",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Reorder →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Printer({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
