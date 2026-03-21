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

// Export components for direct use if needed
export { InventoryWorkspace };
