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
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    desc: "Drug catalog and stock levels",
  },
  {
    id: "pos",
    icon: ShoppingCart,
    label: "Point of Sale",
    desc: "New checkout terminal session",
  },
  {
    id: "reports",
    icon: BarChart2,
    label: "Reports",
    desc: "Analytics, charts and exports",
  },
  {
    id: "purchases",
    icon: Truck,
    label: "Purchase Orders",
    desc: "Supplier orders and receipts",
  },
  {
    id: "customers",
    icon: User,
    label: "Customers",
    desc: "Patient profiles and loyalty",
  },
];

/**
 * Maximum number of visible tabs before overflow
 */
export const VISIBLE_TAB_COUNT = 5;
