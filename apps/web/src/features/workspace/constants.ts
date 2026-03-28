/**
 * Workspace constants
 * Shared constants for workspace features
 */

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Truck,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Sub-item definition for hierarchical navigation
 */
export interface SubItem {
  /** Unique identifier for the sub-item */
  id: string;
  /** Display label */
  label: string;
  /** Optional filter parameter for filtered views */
  filter?: string;
  /** Optional badge count or label */
  badge?: number | string;
}

/**
 * Workspace template definition
 */
export interface WorkspaceTemplate {
  /** Unique identifier matching module ID */
  id: string;
  /** Icon component */
  icon: LucideIcon;
  /** Display label */
  label: string;
  /** Short description */
  desc: string;
  /** Optional sub-items for hierarchical navigation */
  subItems?: SubItem[];
  /** Optional badge count or label */
  badge?: number | string;
}

/**
 * Available workspace templates
 * Used in the New Workspace dialog
 */
export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    desc: "Overview, KPIs and alerts",
    subItems: [
      { id: "dashboard-overview", label: "Overview" },
      { id: "dashboard-alerts", label: "Alerts & Notifications", badge: 3 },
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    desc: "Drug catalog and stock levels",
    subItems: [
      { id: "inventory-all", label: "All Products" },
      { id: "inventory-low-stock", label: "Low Stock Alerts", badge: 7 },
      { id: "inventory-expiring", label: "Expiring Soon", badge: 12 },
      { id: "inventory-categories", label: "Categories" },
    ],
  },
  {
    id: "pos",
    icon: ShoppingCart,
    label: "Point of Sale",
    desc: "New checkout terminal session",
    subItems: [
      { id: "pos-new", label: "New Sale" },
      { id: "pos-returns", label: "Returns & Refunds" },
      { id: "pos-hold", label: "Hold Transactions", badge: 2 },
    ],
  },
  {
    id: "reports",
    icon: BarChart2,
    label: "Reports",
    desc: "Analytics, charts and exports",
    subItems: [
      { id: "reports-sales", label: "Sales Reports" },
      { id: "reports-inventory", label: "Inventory Reports" },
      { id: "reports-financial", label: "Financial Reports" },
      { id: "reports-custom", label: "Custom Reports" },
    ],
  },
  {
    id: "purchases",
    icon: Truck,
    label: "Purchase Orders",
    desc: "Supplier orders and receipts",
    subItems: [
      { id: "purchases-active", label: "Active Orders", badge: 3 },
      { id: "purchases-create", label: "Create Order" },
      { id: "purchases-suppliers", label: "Supplier Management", badge: 8 },
      { id: "purchases-receiving", label: "Receiving" },
    ],
  },
  {
    id: "customers",
    icon: User,
    label: "Customers",
    desc: "Patient profiles and loyalty",
    badge: 142,
  },
  {
    id: "staff",
    icon: Users,
    label: "Staff",
    desc: "Staff management and scheduling",
  },
];

/**
 * Maximum number of visible tabs before overflow
 */
export const VISIBLE_TAB_COUNT = 5;
