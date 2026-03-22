import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the router hooks
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: any) => ({
    ...options,
    path,
  }),
  useNavigate: () => mockNavigate,
  Navigate: ({ to }: { to: string }) => {
    mockNavigate({ to });
    return null;
  },
}));

describe("Inventory Parent Route Redirect", () => {
  it("should redirect from /home/inventory to /home/inventory/all", async () => {
    const { Route } = await import("../routes/_app/home/inventory/index");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    render(<RouteComponent />);

    // Verify navigation was called with the redirect target
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/home/inventory/all",
      }),
    );
  });
});
