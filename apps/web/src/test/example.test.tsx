import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";

// Simple example component for testing
function ExampleComponent() {
  return <div>Hello Vitest</div>;
}

describe("Vitest Setup", () => {
  it("should render component", () => {
    renderWithProviders(<ExampleComponent />);
    expect(screen.getByText("Hello Vitest")).toBeInTheDocument();
  });

  it("should perform basic assertions", () => {
    expect(1 + 1).toBe(2);
    expect("vitest").toContain("test");
  });
});
