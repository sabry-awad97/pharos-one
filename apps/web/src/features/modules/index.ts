/**
 * Modules feature
 * Public API for the module system
 */

// Registry functions
export {
  registerModule,
  getModule,
  getAllModules,
  hasModule,
} from "./registry";

// Types
export type { WorkspaceModule } from "./types";

// Components
export { WorkspaceContainer } from "./components/WorkspaceContainer";

// Import modules to trigger registration
import "./dashboard";
import "./inventory";
import "./pos";
import "./reports";
import "./purchases";
import "./customers";
