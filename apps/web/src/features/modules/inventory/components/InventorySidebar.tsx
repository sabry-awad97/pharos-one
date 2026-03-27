/**
 * InventorySidebar component
 * Context-aware sidebar for inventory workspace with product-specific navigation
 */

import { Package, AlertTriangle, Clock, FolderOpen } from "lucide-react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarFooter,
} from "@/features/workspace/components/SidebarContainer";
import {
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarStats,
  type StatItem,
} from "@/features/workspace/components/SidebarNavComponents";

export type InventoryFilter =
  | "all"
  | "low-stock"
  | "expiring"
  | "prescription"
  | "otc";

export interface InventorySidebarProps {
  /** Currently active filter */
  activeFilter: InventoryFilter;
  /** Filter change handler */
  onFilterChange: (filter: InventoryFilter) => void;
  /** Low stock count for badge */
  lowStockCount?: number;
  /** Expiring soon count for badge */
  expiringCount?: number;
  /** Total products count */
  totalProducts?: number;
  /** Total value */
  totalValue?: string;
}

/**
 * Inventory workspace sidebar with product-specific navigation
 */
export function InventorySidebar({
  activeFilter,
  onFilterChange,
  lowStockCount = 0,
  expiringCount = 0,
  totalProducts = 0,
  totalValue = "$0",
}: InventorySidebarProps) {
  // Stats for footer
  const stats: StatItem[] = [
    {
      label: "Total Products",
      value: totalProducts.toString(),
    },
    {
      label: "Total Value",
      value: totalValue,
    },
  ];

  return (
    <SidebarContainer workspaceId="inventory" defaultWidth={220}>
      <SidebarContent>
        <SidebarNav>
          {/* Main view */}
          <SidebarNavItem
            icon={Package}
            label="All Products"
            active={activeFilter === "all"}
            onClick={() => onFilterChange("all")}
          />

          {/* Filters group */}
          <SidebarNavGroup label="Filters" defaultExpanded>
            <SidebarNavItem
              icon={AlertTriangle}
              label="Low Stock"
              badge={lowStockCount > 0 ? lowStockCount : undefined}
              active={activeFilter === "low-stock"}
              onClick={() => onFilterChange("low-stock")}
            />
            <SidebarNavItem
              icon={Clock}
              label="Expiring Soon"
              badge={expiringCount > 0 ? expiringCount : undefined}
              active={activeFilter === "expiring"}
              onClick={() => onFilterChange("expiring")}
            />
          </SidebarNavGroup>

          {/* Categories group */}
          <SidebarNavGroup label="Categories" defaultExpanded>
            <SidebarNavItem
              icon={FolderOpen}
              label="Prescription"
              active={activeFilter === "prescription"}
              onClick={() => onFilterChange("prescription")}
            />
            <SidebarNavItem
              icon={FolderOpen}
              label="OTC"
              active={activeFilter === "otc"}
              onClick={() => onFilterChange("otc")}
            />
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarStats stats={stats} />
      </SidebarFooter>
    </SidebarContainer>
  );
}
