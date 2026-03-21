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
      { id: "dashboard-alerts", label: "Alerts & Notifications" },
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    desc: "Drug catalog and stock levels",
    subItems: [
      { id: "inventory-all", label: "All Products" },
      { id: "inventory-low-stock", label: "Low Stock Alerts" },
      { id: "inventory-expiring", label: "Expiring Soon" },
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
      { id: "pos-hold", label: "Hold Transactions" },
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
      { id: "purchases-active", label: "Active Orders" },
      { id: "purchases-create", label: "Create Order" },
      { id: "purchases-suppliers", label: "Supplier Management" },
      { id: "purchases-receiving", label: "Receiving" },
    ],
  },
  {
    id: "customers",
    icon: User,
    label: "Customers",
    desc: "Patient profiles and loyalty",
    subItems: [
      { id: "customers-list", label: "Customer List" },
      { id: "customers-loyalty", label: "Loyalty Program" },
      { id: "customers-prescriptions", label: "Prescriptions" },
    ],
  },
];

/**
 * Maximum number of visible tabs before overflow
 */
export const VISIBLE_TAB_COUNT = 5;
