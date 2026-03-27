/**
 * POSSidebar component
 * Context-aware sidebar for POS workspace with cart and customer info
 */

import { ShoppingCart, User, CreditCard, DollarSign } from "lucide-react";
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

export type POSView = "cart" | "customer" | "payment" | "history";

export interface POSSidebarProps {
  /** Currently active view */
  activeView: POSView;
  /** View change handler */
  onViewChange: (view: POSView) => void;
  /** Cart items count */
  cartItemsCount?: number;
  /** Current customer name */
  customerName?: string;
  /** Cart total */
  cartTotal?: string;
  /** Items in cart */
  itemsCount?: number;
}

/**
 * POS workspace sidebar with cart and customer info
 */
export function POSSidebar({
  activeView,
  onViewChange,
  cartItemsCount = 0,
  customerName,
  cartTotal = "$0.00",
  itemsCount = 0,
}: POSSidebarProps) {
  // Stats for footer
  const stats: StatItem[] = [
    {
      label: "Items",
      value: itemsCount.toString(),
    },
    {
      label: "Total",
      value: cartTotal,
    },
  ];

  return (
    <SidebarContainer workspaceId="pos" defaultWidth={220}>
      <SidebarContent>
        <SidebarNav>
          {/* Main views */}
          <SidebarNavItem
            icon={ShoppingCart}
            label="Cart"
            badge={cartItemsCount}
            active={activeView === "cart"}
            onClick={() => onViewChange("cart")}
          />

          {/* Customer & Payment group */}
          <SidebarNavGroup label="Transaction" defaultExpanded>
            <SidebarNavItem
              icon={User}
              label={customerName || "Customer"}
              active={activeView === "customer"}
              onClick={() => onViewChange("customer")}
            />
            <SidebarNavItem
              icon={CreditCard}
              label="Payment"
              active={activeView === "payment"}
              onClick={() => onViewChange("payment")}
            />
          </SidebarNavGroup>

          {/* History */}
          <SidebarNavItem
            icon={DollarSign}
            label="History"
            active={activeView === "history"}
            onClick={() => onViewChange("history")}
          />
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarStats stats={stats} />
      </SidebarFooter>
    </SidebarContainer>
  );
}
