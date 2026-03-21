/**
 * Customers module
 * Registers the customers module with the module registry
 */

import { User } from "lucide-react";
import { registerModule } from "../registry";
import { CustomersWorkspace } from "./CustomersWorkspace";
import { CustomersToolbar } from "./CustomersToolbar";

// Register customers module on import
registerModule({
  id: "customers",
  label: "Customers",
  icon: User,
  component: CustomersWorkspace,
  toolbar: CustomersToolbar,
});

// Export components for direct use if needed
export { CustomersWorkspace, CustomersToolbar };
