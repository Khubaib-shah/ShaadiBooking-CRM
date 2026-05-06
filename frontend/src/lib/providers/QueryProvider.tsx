"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * QueryProvider
 * ─────────────
 * Wraps the application tree in React Query's QueryClientProvider.
 * Configured for production: stale time, retry, and GC settings
 * that balance freshness with performance.
 *
 * Must be a Client Component because React Query uses React context.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures one QueryClient per component lifecycle (no re-creation on re-render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 min — data is "fresh" for 60s
            gcTime: 5 * 60 * 1000, // 5 min — unused data is garbage collected after 5m
            retry: 2,
            refetchOnWindowFocus: false, // Avoid aggressive refetching
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
