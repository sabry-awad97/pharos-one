import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import { ThemeProvider } from "@/components/theme-provider";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "@pharos-one/ui/components/sonner";
import { productTypeApi } from "@/features/modules/inventory/tauri-api/product-type.api";

import "../index.css";

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "pharos-one",
      },
      {
        name: "description",
        content: "pharos-one is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const testProductTypeApi = async () => {
    try {
      console.log("Testing Product Type API...");

      // Test: Get all product types
      const productTypes = await productTypeApi.getAll();
      console.log("All Product Types:", productTypes);

      // Test: Get active product types
      const activeTypes = await productTypeApi.getActive();
      console.log("Active Product Types:", activeTypes);

      alert(
        `Success! Found ${productTypes.length} product types (${activeTypes.length} active)`,
      );
    } catch (error) {
      console.error("API Test Error:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <>
      <HeadContent />
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            storageKey="vite-ui-theme"
          >
            <div className="grid h-svh grid-rows-[auto_1fr]">
              {/* Test Button */}
              <div className="fixed bottom-4 right-4 z-50">
                <button
                  onClick={testProductTypeApi}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700"
                >
                  Test Product Type API
                </button>
              </div>
              <Outlet />
            </div>
            <Toaster richColors />
          </ThemeProvider>
        </NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
