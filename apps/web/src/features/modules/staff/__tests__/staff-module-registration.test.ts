/**
 * Staff module registration tests
 */

import { describe, expect, it } from "vitest";
import { getModule } from "../../registry";
// Import staff module to trigger registration
import "../../staff";

describe("Staff module registration", () => {
  it("should register staff module in the module registry", () => {
    const staffModule = getModule("staff");
    expect(staffModule).toBeDefined();
    expect(staffModule?.id).toBe("staff");
    expect(staffModule?.label).toBe("Staff");
  });

  it("should have a component", () => {
    const staffModule = getModule("staff");
    expect(staffModule?.component).toBeDefined();
  });

  it("should have an icon", () => {
    const staffModule = getModule("staff");
    expect(staffModule?.icon).toBeDefined();
  });
});
