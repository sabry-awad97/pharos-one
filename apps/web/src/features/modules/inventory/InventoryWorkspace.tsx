/**
 * Inventory workspace component
 * Displays drug catalog table with stock levels
 * Enhanced table layout based on PharmacyDashboard.tsx mockup but using project styles
 */

import { useState } from "react";
import { Hash, Filter, Download, RefreshCw } from "lucide-react";
import { AnnotationCallouts } from "../components/AnnotationCallouts";

// Color constants matching ModuleWorkspace.tsx
const W = {
  bg: "#f3f3f3",
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  surfaceHov: "#f0f0f0",
  border: "#e0e0e0",
  borderLight: "#ebebeb",
  text: "#1a1a1a",
  textSub: "#616161",
  textMuted: "#919191",
  success: "#107c10",
  warn: "#7a5e00",
  danger: "#a4262c",
  expiring: "#c43501",
};

// Drug data structure
interface Drug {
  id: number;
  name: string;
  sku: string;
  stock: number;
  expiry: string;
  price: number;
  category: string;
  supplier: string;
  status: "ok" | "low" | "expiring" | "out";
}

// Sample data
const drugs: Drug[] = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    sku: "AMX-500",
    stock: 240,
    expiry: "2026-03",
    price: 12.5,
    category: "Antibiotic",
    supplier: "MedSupply Co",
    status: "ok",
  },
  {
    id: 2,
    name: "Paracetamol 650mg",
    sku: "PCT-650",
    stock: 18,
    expiry: "2025-09",
    price: 4.2,
    category: "Analgesic",
    supplier: "PharmGen",
    status: "low",
  },
  {
    id: 3,
    name: "Metformin 500mg",
    sku: "MET-500",
    stock: 302,
    expiry: "2026-08",
    price: 8.75,
    category: "Antidiabetic",
    supplier: "GeneriCo",
    status: "ok",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    sku: "OMZ-020",
    stock: 85,
    expiry: "2025-06",
    price: 15.0,
    category: "GI",
    supplier: "MedSupply Co",
    status: "expiring",
  },
  {
    id: 5,
    name: "Atorvastatin 10mg",
    sku: "ATV-010",
    stock: 0,
    expiry: "2026-11",
    price: 22.3,
    category: "Statin",
    supplier: "CardioPharm",
    status: "out",
  },
  {
    id: 6,
    name: "Lisinopril 5mg",
    sku: "LSN-005",
    stock: 145,
    expiry: "2027-01",
    price: 9.9,
    category: "ACE Inhibitor",
    supplier: "CardioPharm",
    status: "ok",
  },
  {
    id: 7,
    name: "Cetirizine 10mg",
    sku: "CTZ-010",
    stock: 12,
    expiry: "2025-08",
    price: 6.4,
    category: "Antihistamine",
    supplier: "AllergyRx",
    status: "low",
  },
  {
    id: 8,
    name: "Azithromycin 250mg",
    sku: "AZT-250",
    stock: 67,
    expiry: "2025-05",
    price: 18.6,
    category: "Antibiotic",
    supplier: "PharmGen",
    status: "expiring",
  },
  {
    id: 9,
    name: "Ibuprofen 400mg",
    sku: "IBU-400",
    stock: 389,
    expiry: "2027-03",
    price: 5.1,
    category: "NSAID",
    supplier: "GeneriCo",
    status: "ok",
  },
  {
    id: 10,
    name: "Losartan 50mg",
    sku: "LST-050",
    stock: 203,
    expiry: "2026-06",
    price: 11.2,
    category: "ARB",
    supplier: "CardioPharm",
    status: "ok",
  },
];

// Status dot colors
const statusDot: Record<string, string> = {
  ok: "#107c10",
  low: "#d4a017",
  expiring: "#d83b01",
  out: "#a4262c",
};

// Status badge component
function StatusBadge({ status }: { status: Drug["status"] }) {
  const config = {
    ok: {
      bg: "#dff6dd",
      color: statusDot.ok,
      border: statusDot.ok,
      label: "In Stock",
    },
    low: {
      bg: "#fff4ce",
      color: statusDot.low,
      border: statusDot.low,
      label: "Low Stock",
    },
    expiring: {
      bg: "#fed9cc",
      color: statusDot.expiring,
      border: statusDot.expiring,
      label: "Expiring",
    },
    out: {
      bg: "#fde7e9",
      color: statusDot.out,
      border: statusDot.out,
      label: "Out of Stock",
    },
  };

  const { bg, color, border, label } = config[status];

  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium border"
      style={{
        background: bg,
        color: color,
        borderColor: `${border}20`,
      }}
    >
      {label}
    </span>
  );
}

/**
 * Inventory workspace showing drug catalog with enhanced table
 * Based on PharmacyDashboard.tsx mockup structure but using project's established styles
 */
export function InventoryWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden font-sans"
      style={{
        background: W.bg,
      }}
    >
      {/* Module header - matching ModuleWorkspace.tsx pattern */}
      <div
        className="pt-2.5 px-4 pb-2 flex items-center gap-2.5 shrink-0"
        style={{
          borderBottom: `1px solid ${W.border}`,
          background: W.surface,
        }}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            background: "#107c1020",
          }}
        >
          <Hash style={{ width: 14, height: 14, color: "#107c10" }} />
        </div>
        <div>
          <p
            style={{ margin: 0, fontSize: 13, fontWeight: 600, color: W.text }}
          >
            {label || "Inventory"}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: W.textMuted }}>
            {drugs.length} items • Last updated: just now
          </p>
        </div>
        <div style={{ flex: 1 }} />
        {!split && (
          <div style={{ display: "flex", gap: 4 }}>
            {[Filter, Download, RefreshCw].map((Icon, i) => (
              <button
                key={i}
                className="w-[26px] h-[26px] flex items-center justify-center border rounded cursor-pointer"
                style={{
                  borderColor: W.border,
                  background: W.surface,
                  color: W.textSub,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surfaceHov;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surface;
                }}
              >
                <Icon style={{ width: 12, height: 12 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced data table - based on PharmacyDashboard.tsx structure */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        <div
          className="rounded-md overflow-hidden shadow-sm border"
          style={{
            background: W.surface,
            borderColor: W.border,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                className="bg-[#f5f5f5] sticky top-0 z-10"
                style={{
                  borderBottom: `1px solid ${W.border}`,
                }}
              >
                {[
                  { label: "Drug Name", w: "auto" },
                  { label: "SKU", w: 90 },
                  { label: "Stock", w: 70 },
                  { label: "Expiry", w: 80 },
                  { label: "Price", w: 80 },
                  { label: "Category", w: 110 },
                  { label: "Supplier", w: 120 },
                  { label: "Status", w: 100 },
                ].map(({ label, w }) => (
                  <th
                    key={label}
                    className="text-left py-[7px] px-3 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap cursor-pointer select-none"
                    style={{
                      color: W.textMuted,
                      width: typeof w === "number" ? w : undefined,
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug, idx) => {
                const selected = selectedRow === drug.id;
                return (
                  <tr
                    key={drug.id}
                    onClick={() => setSelectedRow(drug.id)}
                    className="cursor-pointer transition-[background] duration-100"
                    style={{
                      borderBottom: `1px solid ${W.borderLight}`,
                      background: selected
                        ? "rgba(0,120,212,0.07)"
                        : idx % 2 === 1
                          ? W.surfaceAlt
                          : W.surface,
                      outline: selected ? "1.5px solid #0078d4" : "none",
                      outlineOffset: -1,
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
                          ? W.surfaceAlt
                          : W.surface;
                    }}
                  >
                    {/* Drug Name */}
                    <td style={{ padding: "6px 12px", whiteSpace: "nowrap" }}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-[7px] h-[7px] rounded-full shrink-0"
                          style={{
                            background: statusDot[drug.status],
                          }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{
                            color: W.text,
                          }}
                        >
                          {drug.name}
                        </span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td
                      className="py-1.5 px-3 text-[11px] font-mono"
                      style={{
                        color: W.textSub,
                      }}
                    >
                      {drug.sku}
                    </td>

                    {/* Stock */}
                    <td className="py-1.5 px-3">
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color:
                            drug.stock === 0
                              ? W.danger
                              : drug.stock < 20
                                ? W.warn
                                : W.text,
                        }}
                      >
                        {drug.stock}
                      </span>
                    </td>

                    {/* Expiry */}
                    <td
                      className="py-1.5 px-3 text-[11px]"
                      style={{
                        color:
                          drug.status === "expiring" ? W.expiring : W.textSub,
                      }}
                    >
                      {drug.expiry}
                    </td>

                    {/* Price */}
                    <td
                      className="py-1.5 px-3 text-xs font-medium"
                      style={{
                        color: W.text,
                      }}
                    >
                      ₹{drug.price.toFixed(2)}
                    </td>

                    {/* Category */}
                    <td className="py-1.5 px-3">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[#f0f0f0] border"
                        style={{
                          color: W.textSub,
                          borderColor: W.border,
                        }}
                      >
                        {drug.category}
                      </span>
                    </td>

                    {/* Supplier */}
                    <td
                      className="py-1.5 px-3 text-[11px]"
                      style={{
                        color: W.textSub,
                      }}
                    >
                      {drug.supplier}
                    </td>

                    {/* Status */}
                    <td className="py-1.5 px-3">
                      <StatusBadge status={drug.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Annotation callouts - only shown when not in split view */}
        {!split && <AnnotationCallouts />}
      </div>
    </div>
  );
}
