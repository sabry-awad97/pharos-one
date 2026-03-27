import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { POSSidebar } from "@/features/modules/pos/components/POSSidebar";

describe("POS Sidebar", () => {
  it("should render sidebar with cart view active", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="cart"
        onViewChange={onViewChange}
        cartItemsCount={3}
        customerName="Walk-in Customer"
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    // Cart should be active
    const cartItem = screen.getByText("Cart").closest("button");
    expect(cartItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display cart items count badge", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="cart"
        onViewChange={onViewChange}
        cartItemsCount={5}
        customerName="Walk-in Customer"
        cartTotal="₹100.00"
        itemsCount={5}
      />,
    );

    const cartItem = screen.getByText("Cart").closest("button");
    const badge = within(cartItem as HTMLElement).getByText("5");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      fontSize: "10px",
      fontWeight: "600",
    });
  });

  it("should display customer name in sidebar", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="customer"
        onViewChange={onViewChange}
        cartItemsCount={3}
        customerName="John Doe"
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should display default customer label when no name provided", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="customer"
        onViewChange={onViewChange}
        cartItemsCount={3}
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    expect(screen.getByText("Customer")).toBeInTheDocument();
  });

  it("should display cart stats in footer", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="cart"
        onViewChange={onViewChange}
        cartItemsCount={3}
        customerName="Walk-in Customer"
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    const statsSection = screen.getByTestId("sidebar-stats");
    expect(within(statsSection).getByText("Items")).toBeInTheDocument();
    expect(within(statsSection).getByText("3")).toBeInTheDocument();
    expect(within(statsSection).getByText("Total")).toBeInTheDocument();
    expect(within(statsSection).getByText("₹52.60")).toBeInTheDocument();
  });

  it("should call onViewChange when clicking different views", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="cart"
        onViewChange={onViewChange}
        cartItemsCount={3}
        customerName="Walk-in Customer"
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    const paymentItem = screen.getByText("Payment").closest("button");
    paymentItem?.click();

    expect(onViewChange).toHaveBeenCalledWith("payment");
  });

  it("should render Transaction group with Customer and Payment items", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="cart"
        onViewChange={onViewChange}
        cartItemsCount={3}
        customerName="Walk-in Customer"
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    // Transaction group should exist (case-insensitive)
    expect(screen.getByText(/transaction/i)).toBeInTheDocument();

    // Customer and Payment should be in the group
    expect(screen.getByText("Walk-in Customer")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("should display History view", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="history"
        onViewChange={onViewChange}
        cartItemsCount={3}
        customerName="Walk-in Customer"
        cartTotal="₹52.60"
        itemsCount={3}
      />,
    );

    const historyItem = screen.getByText("History").closest("button");
    expect(historyItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should show zero counts when no items in cart", () => {
    const onViewChange = vi.fn();

    render(
      <POSSidebar
        activeView="cart"
        onViewChange={onViewChange}
        cartItemsCount={0}
        customerName="Walk-in Customer"
        cartTotal="₹0.00"
        itemsCount={0}
      />,
    );

    // Badge should show 0
    const cartItem = screen.getByText("Cart").closest("button");
    const badge = within(cartItem as HTMLElement).getByText("0");
    expect(badge).toBeInTheDocument();

    // Footer should show 0 items
    const statsSection = screen.getByTestId("sidebar-stats");
    expect(within(statsSection).getByText("0")).toBeInTheDocument();
    expect(within(statsSection).getByText("₹0.00")).toBeInTheDocument();
  });
});
