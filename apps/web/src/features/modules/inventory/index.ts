/**
 * Inventory module
 * Registers the inventory module with the module registry
 */

import { Package } from "lucide-react";
import { registerModule } from "../registry";
import { InventoryWorkspace } from "./InventoryWorkspace";

// Register inventory module on import
// Note: No toolbar - action buttons are in the workspace header itself (matching old implementation)
registerModule({
  id: "inventory",
  label: "Inventory",
  icon: Package,
  component: InventoryWorkspace,
});

// Register inventory sub-item modules
registerModule({
  id: "inventory-all",
  label: "Inventory - All Products",
  icon: Package,
  component: InventoryWorkspace,
});

registerModule({
  id: "inventory-low-stock",
  label: "Inventory - Low Stock Alerts",
  icon: Package,
  component: InventoryWorkspace,
});

registerModule({
  id: "inventory-expiring",
  label: "Inventory - Expiring Soon",
  icon: Package,
  component: InventoryWorkspace,
});

registerModule({
  id: "inventory-categories",
  label: "Inventory - Categories",
  icon: Package,
  component: InventoryWorkspace,
});

// Export components for direct use if needed
export { InventoryWorkspace };
