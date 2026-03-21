/**
 * POS module
 * Registers the POS module with the module registry
 */

import { ShoppingCart } from "lucide-react";
import { registerModule } from "../registry";
import { PosWorkspace } from "./PosWorkspace";

// Register POS module on import
registerModule({
  id: "pos",
  label: "Point of Sale",
  icon: ShoppingCart,
  component: PosWorkspace,
});

// Export components for direct use if needed
export { PosWorkspace };
