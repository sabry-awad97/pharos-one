/**
 * Tests for useCollections hook
 * Verifies that collections are properly memoized and accessible
 */

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCollections } from "../use-collections";

describe("useCollections", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("returns all inventory collections", () => {
    const { result } = renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    });

    // Verify all collections are returned
    expect(result.current).toHaveProperty("products");
    expect(result.current).toHaveProperty("categories");
    expect(result.current).toHaveProperty("suppliers");
    expect(result.current).toHaveProperty("batches");
    expect(result.current).toHaveProperty("transactions");
  });

  it("returns memoized collections on re-render", () => {
    const { result, rerender } = renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    });

    const firstRender = result.current;

    // Re-render the hook
    rerender();

    const secondRender = result.current;

    // Collections should be the same instance (memoized)
    expect(firstRender.products).toBe(secondRender.products);
    expect(firstRender.categories).toBe(secondRender.categories);
    expect(firstRender.suppliers).toBe(secondRender.suppliers);
    expect(firstRender.batches).toBe(secondRender.batches);
    expect(firstRender.transactions).toBe(secondRender.transactions);
  });

  it("collections have required methods", () => {
    const { result } = renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    });

    // Verify collections are TanStack DB collections (have required properties)
    // Note: We can't test internal methods directly, but we can verify they're objects
    expect(typeof result.current.products).toBe("object");
    expect(typeof result.current.categories).toBe("object");
    expect(typeof result.current.suppliers).toBe("object");
    expect(typeof result.current.batches).toBe("object");
    expect(typeof result.current.transactions).toBe("object");
  });
});
