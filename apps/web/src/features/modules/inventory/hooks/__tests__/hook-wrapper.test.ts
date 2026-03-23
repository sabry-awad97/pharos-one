/**
 * Tests for hook abstraction wrapper
 * Ensures backward-compatible API with TanStack Query hooks
 */

import { describe, it, expect } from "vitest";
import { wrapLiveQuery } from "../utils/hook-wrapper";

describe("Hook Wrapper", () => {
  describe("wrapLiveQuery", () => {
    // Test 3: Hook wrapper maintains backward-compatible API
    it("returns same shape as TanStack Query", () => {
      const mockQueryResult = {
        data: [{ id: 1, name: "Test" }],
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: "success" as const,
      };

      const wrapped = wrapLiveQuery(mockQueryResult);

      // Should have all TanStack Query properties
      expect(wrapped).toHaveProperty("data");
      expect(wrapped).toHaveProperty("isLoading");
      expect(wrapped).toHaveProperty("error");
      expect(wrapped).toHaveProperty("isError");
      expect(wrapped).toHaveProperty("isSuccess");
      expect(wrapped).toHaveProperty("status");

      // Values should match
      expect(wrapped.data).toEqual(mockQueryResult.data);
      expect(wrapped.isLoading).toBe(false);
      expect(wrapped.error).toBe(null);
    });

    it("handles loading state", () => {
      const mockQueryResult = {
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
        status: "pending" as const,
      };

      const wrapped = wrapLiveQuery(mockQueryResult);

      expect(wrapped.isLoading).toBe(true);
      expect(wrapped.data).toBeUndefined();
    });

    it("handles error state", () => {
      const mockError = new Error("Test error");
      const mockQueryResult = {
        data: undefined,
        isLoading: false,
        error: mockError,
        isError: true,
        isSuccess: false,
        status: "error" as const,
      };

      const wrapped = wrapLiveQuery(mockQueryResult);

      expect(wrapped.isError).toBe(true);
      expect(wrapped.error).toBe(mockError);
    });
  });
});
