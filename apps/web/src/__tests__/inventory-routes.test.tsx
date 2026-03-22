import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the router hooks
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: { component: any }) => ({
    ...options,
    path,
  }),
}));

describe("Inventory Sub-Routes", () => {
  it("should render inventory-all route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/all");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    render(<RouteComponent />);

    // Verify WorkspaceContainer is rendered (it has a specific structure)
    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });

  it("should render inventory-low-stock route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/low-stock");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    render(<RouteComponent />);

    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });

  it("should render inventory-expiring route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/expiring");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    render(<RouteComponent />);

    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });

  it("should render inventory-categories route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/categories");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    render(<RouteComponent />);

    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });
});
