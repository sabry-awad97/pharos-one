/**
 * Purchases module
 * Registers the purchases module with the module registry
 */

import { Truck } from "lucide-react";
import { registerModule } from "../registry";
import { PurchasesWorkspace } from "./PurchasesWorkspace";

// Register purchases module on import
registerModule({
  id: "purchases",
  label: "Purchase Orders",
  icon: Truck,
  component: PurchasesWorkspace,
});

// Export components for direct use if needed
export { PurchasesWorkspace };
