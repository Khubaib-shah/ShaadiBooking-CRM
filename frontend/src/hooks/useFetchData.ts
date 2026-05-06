import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import api from "@/lib/utils/api";

/**
 * API Response Shape
 * ──────────────────
 * All our API responses follow this structure.
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Generic data fetching hook.
 * Wraps React Query's useQuery with our Axios instance.
 *
 * @param queryKey – Unique key for caching/deduplication
 * @param url – API endpoint (relative to base URL)
 * @param config – Optional Axios config (params, headers, etc.)
 * @param options – Optional React Query options
 *
 * @example
 *   const { data, isLoading } = useFetchData<EventsResponse>(
 *     ["events", { page: 1 }],
 *     "/events",
 *     { params: { page: 1, limit: 10 } }
 *   );
 */
export function useFetchData<TData>(
  queryKey: readonly unknown[],
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) {
  return useQuery<TData, AxiosError<ApiErrorResponse>>({
    queryKey,
    queryFn: async () => {
      const response = await api.get<TData>(url, config);
      return response.data;
    },
    ...options,
  });
}

/**
 * Generic mutation hook (POST/PUT/PATCH/DELETE).
 * Supports optimistic updates and automatic cache invalidation.
 *
 * @param method – HTTP method
 * @param url – API endpoint
 * @param invalidateKeys – Query keys to invalidate on success
 *
 * @example
 *   const createBooking = useMutateData<BookingPayload, BookingResponse>(
 *     "post",
 *     "/bookings",
 *     [["bookings"]]
 *   );
 *
 *   createBooking.mutate({ eventId: "...", vendorId: "..." });
 */
export function useMutateData<TPayload, TResponse>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  invalidateKeys?: readonly (readonly unknown[])[]
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, AxiosError<ApiErrorResponse>, TPayload>({
    mutationFn: async (payload) => {
      const response = await api[method]<TResponse>(url, payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries to trigger refetch
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [...key] });
        });
      }
    },
  });
}

export type { ApiResponse, PaginatedResponse, ApiErrorResponse };
