/**
 * Workspace template constants
 * Predefined workspace templates for quick setup
 */

import {
  Pill,
  Package,
  BarChart2,
  ShoppingCart,
  LayoutDashboard,
  Users,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Tab definition within a template
 */
export interface TemplateTab {
  /** Display label for the tab */
  label: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Module identifier (e.g., 'dashboard', 'inventory', 'pos') */
  module: string;
  /** Whether the tab is pinned by default */
  pinned?: boolean;
}

/**
 * Workspace template definition
 */
export interface WorkspaceTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: LucideIcon;
  /** Short description of the template */
  description: string;
  /** Tabs included in this template */
  tabs: TemplateTab[];
}

/**
 * Available workspace templates
 */
export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: "pharmacist",
    label: "Pharmacist",
    icon: Pill,
    description: "Prescriptions, inventory, and reports",
    tabs: [
      {
        label: "Prescriptions",
        icon: Pill,
        module: "prescriptions",
        pinned: true,
      },
      { label: "Inventory", icon: Package, module: "inventory" },
      { label: "Reports", icon: BarChart2, module: "reports" },
    ],
  },
  {
    id: "cashier",
    label: "Cashier",
    icon: ShoppingCart,
    description: "POS, inventory, and dashboard",
    tabs: [
      {
        label: "Point of Sale",
        icon: ShoppingCart,
        module: "pos",
        pinned: true,
      },
      { label: "Inventory", icon: Package, module: "inventory" },
      { label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
    ],
  },
  {
    id: "manager",
    label: "Manager",
    icon: BarChart2,
    description: "Dashboard, reports, inventory, and staff",
    tabs: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
        pinned: true,
      },
      { label: "Reports", icon: BarChart2, module: "reports" },
      { label: "Inventory", icon: Package, module: "inventory" },
      { label: "Staff", icon: Users, module: "staff" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    icon: Layers,
    description: "Start with an empty workspace",
    tabs: [],
  },
];
