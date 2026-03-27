/**
 * Unit tests for calculateTabOverflow
 * Covers overflow mode logic, visible/overflow tab splitting, and edge cases.
 */

import { describe, it, expect } from "vitest";
import {
  calculateTabOverflow,
  SCROLLABLE_THRESHOLD,
} from "../tabs-store";
import { VISIBLE_TAB_COUNT } from "../../constants";
import type { Tab } from "../../types";
import { LayoutDashboard } from "lucide-react";

function makeTabs(count: number): Tab[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tab-${i + 1}`,
    label: `Tab ${i + 1}`,
    icon: LayoutDashboard,
    module: `module-${i + 1}`,
  }));
}

describe("calculateTabOverflow", () => {
  describe("mode: none (no overflow)", () => {
    it("returns mode=none for 0 tabs", () => {
      const result = calculateTabOverflow([]);
      expect(result.mode).toBe("none");
      expect(result.hasOverflow).toBe(false);
      expect(result.visibleTabs).toHaveLength(0);
      expect(result.overflowTabs).toHaveLength(0);
    });

    it("returns mode=none when tabs <= VISIBLE_TAB_COUNT", () => {
      for (let n = 1; n <= VISIBLE_TAB_COUNT; n++) {
        const result = calculateTabOverflow(makeTabs(n));
        expect(result.mode).toBe("none");
        expect(result.hasOverflow).toBe(false);
        expect(result.visibleTabs).toHaveLength(n);
        expect(result.overflowTabs).toHaveLength(0);
      }
    });
  });

  describe("mode: scrollable (VISIBLE_TAB_COUNT+1 to SCROLLABLE_THRESHOLD)", () => {
    it("returns mode=scrollable for VISIBLE_TAB_COUNT+1 tabs", () => {
      const result = calculateTabOverflow(makeTabs(VISIBLE_TAB_COUNT + 1));
      expect(result.mode).toBe("scrollable");
      expect(result.hasOverflow).toBe(true);
      expect(result.overflowTabs).toHaveLength(0);
      expect(result.visibleTabs).toHaveLength(VISIBLE_TAB_COUNT + 1);
    });

    it("returns mode=scrollable for exactly SCROLLABLE_THRESHOLD tabs", () => {
      const result = calculateTabOverflow(makeTabs(SCROLLABLE_THRESHOLD));
      expect(result.mode).toBe("scrollable");
      expect(result.hasOverflow).toBe(true);
      expect(result.overflowTabs).toHaveLength(0);
      expect(result.visibleTabs).toHaveLength(SCROLLABLE_THRESHOLD);
    });

    it("returns all tabs as visible in scrollable mode", () => {
      const tabs = makeTabs(7);
      const result = calculateTabOverflow(tabs);
      expect(result.visibleTabs).toEqual(tabs);
      expect(result.overflowTabs).toHaveLength(0);
    });
  });

  describe("mode: dropdown (SCROLLABLE_THRESHOLD+1+)", () => {
    it("returns mode=dropdown for SCROLLABLE_THRESHOLD+1 tabs", () => {
      const result = calculateTabOverflow(makeTabs(SCROLLABLE_THRESHOLD + 1));
      expect(result.mode).toBe("dropdown");
      expect(result.hasOverflow).toBe(true);
    });

    it("splits tabs into visible and overflow in dropdown mode", () => {
      const tabs = makeTabs(SCROLLABLE_THRESHOLD + 1);
      const result = calculateTabOverflow(tabs);
      expect(result.visibleTabs).toHaveLength(VISIBLE_TAB_COUNT);
      expect(result.overflowTabs).toHaveLength(
        SCROLLABLE_THRESHOLD + 1 - VISIBLE_TAB_COUNT,
      );
    });

    it("visible tabs are the first VISIBLE_TAB_COUNT tabs", () => {
      const tabs = makeTabs(10);
      const result = calculateTabOverflow(tabs);
      expect(result.visibleTabs.map((t) => t.id)).toEqual(
        tabs.slice(0, VISIBLE_TAB_COUNT).map((t) => t.id),
      );
    });

    it("overflow tabs are the remaining tabs after visible", () => {
      const tabs = makeTabs(10);
      const result = calculateTabOverflow(tabs);
      expect(result.overflowTabs.map((t) => t.id)).toEqual(
        tabs.slice(VISIBLE_TAB_COUNT).map((t) => t.id),
      );
    });
  });

  describe("edge cases", () => {
    it("exactly 6 tabs — scrollable mode, all visible", () => {
      const result = calculateTabOverflow(makeTabs(6));
      expect(result.mode).toBe("scrollable");
      expect(result.visibleTabs).toHaveLength(6);
      expect(result.overflowTabs).toHaveLength(0);
    });

    it("exactly 8 tabs — scrollable mode (SCROLLABLE_THRESHOLD), all visible", () => {
      const result = calculateTabOverflow(makeTabs(8));
      expect(result.mode).toBe("scrollable");
      expect(result.visibleTabs).toHaveLength(8);
      expect(result.overflowTabs).toHaveLength(0);
    });

    it("exactly 9 tabs — dropdown mode", () => {
      const result = calculateTabOverflow(makeTabs(9));
      expect(result.mode).toBe("dropdown");
      expect(result.visibleTabs).toHaveLength(VISIBLE_TAB_COUNT);
      expect(result.overflowTabs).toHaveLength(9 - VISIBLE_TAB_COUNT);
    });

    it("respects custom visibleCount parameter", () => {
      const tabs = makeTabs(4);
      const result = calculateTabOverflow(tabs, 3);
      expect(result.mode).toBe("scrollable");
      expect(result.hasOverflow).toBe(true);
    });
  });
});
