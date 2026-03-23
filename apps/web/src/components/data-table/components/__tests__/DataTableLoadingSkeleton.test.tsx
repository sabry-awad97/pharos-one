import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DataTableLoadingSkeleton } from "../DataTableLoadingSkeleton";
import type { ColumnDef } from "@tanstack/react-table";

type TestData = {
  id: number;
  name: string;
  value: number;
};

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
  },
  {
    accessorKey: "value",
    header: "Value",
    size: 100,
  },
];

describe("DataTableLoadingSkeleton", () => {
  describe("Basic Rendering", () => {
    it("should render table structure", () => {
      const { container } = render(
        <DataTableLoadingSkeleton columns={mockColumns} />,
      );

      const table = container.querySelector("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass("w-full", "border-collapse");
    });

    it("should render column headers from column definitions", () => {
      render(<DataTableLoadingSkeleton columns={mockColumns} />);

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("should render default 25 skeleton rows", () => {
      const { container } = render(
        <DataTableLoadingSkeleton columns={mockColumns} />,
      );

      const rows = container.querySelectorAll("tbody tr");
      expect(rows).toHaveLength(25);
    });

    it("should render custom number of skeleton rows", () => {
      const { container } = render(
        <DataTableLoadingSkeleton columns={mockColumns} rowCount={10} />,
      );

      const rows = container.querySelectorAll("tbody tr");
      expect(rows).toHaveLength(10);
    });
  });

  describe("Theme Variables", () => {
    it("should use theme variables for colors", () => {
      const { container } = render(
        <DataTableLoadingSkeleton columns={mockColumns} />,
      );

      const table = container.querySelector("table");
      expect(table).not.toHaveStyle({ borderColor: "#e0e0e0" });

      const headerRow = container.querySelector("thead tr");
      expect(headerRow).toHaveClass("border-border");
    });

    it("should use animate-pulse for skeleton cells", () => {
      const { container } = render(
        <DataTableLoadingSkeleton columns={mockColumns} />,
      );

      const skeletonCells = container.querySelectorAll(
        "tbody td div.animate-pulse",
      );
      expect(skeletonCells.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should render semantic table structure", () => {
      const { container } = render(
        <DataTableLoadingSkeleton columns={mockColumns} />,
      );

      expect(container.querySelector("table")).toBeInTheDocument();
      expect(container.querySelector("thead")).toBeInTheDocument();
      expect(container.querySelector("tbody")).toBeInTheDocument();
      expect(container.querySelector("th")).toBeInTheDocument();
      expect(container.querySelector("td")).toBeInTheDocument();
    });
  });
});
