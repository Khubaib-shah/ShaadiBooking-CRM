import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard.api'

export const dashboardKeys = {
  all: () => ['dashboard'] as const,
  stats: () => ['dashboard', 'stats'] as const,
  revenue: () => ['dashboard', 'revenue'] as const,
  upcoming: () => ['dashboard', 'upcoming'] as const,
  alerts: () => ['dashboard', 'alerts'] as const,
}

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
    staleTime: 10_000,
  })
}

export function useDashboardRevenue(months = 6) {
  return useQuery({
    queryKey: [...dashboardKeys.revenue(), months] as const,
    queryFn: () => dashboardApi.getRevenue(months),
    staleTime: 30_000,
  })
}

export function useDashboardUpcoming(days = 30) {
  return useQuery({
    queryKey: [...dashboardKeys.upcoming(), days] as const,
    queryFn: () => dashboardApi.getUpcoming(days),
    staleTime: 10_000,
  })
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: () => dashboardApi.getPaymentAlerts(),
    staleTime: 10_000,
  })
}
