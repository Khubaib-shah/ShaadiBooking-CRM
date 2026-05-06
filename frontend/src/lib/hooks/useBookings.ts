import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/lib/api/bookings.api'
import { toast } from 'sonner'
import type { ApiResponse, Booking, CreateBookingInput, RecordPaymentInput } from '@/types'

export const bookingKeys = {
  all:      () => ['bookings'] as const,
  lists:    (filters?: object) => ['bookings', 'list', filters] as const,
  detail:   (id: string) => ['bookings', 'detail', id] as const,
  calendar: (start: string, end: string) => ['bookings', 'calendar', start, end] as const,
  conflict: (date: string, excludeId?: string) => ['bookings', 'conflict', date, excludeId] as const,
}

export function useBookings(filters?: { status?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: bookingKeys.lists(filters),
    queryFn: () => bookingsApi.getAll(filters),
    staleTime: 30_000,
  })
}

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingsApi.getById(id),
    staleTime: 20_000,
    enabled: !!id,
  })
}

export function useCalendarBookings(start: string, end: string) {
  return useQuery({
    queryKey: bookingKeys.calendar(start, end),
    queryFn: () => bookingsApi.getCalendar(start, end),
    staleTime: 60_000,
  })
}

export function useConflictCheck(date: string, excludeId?: string) {
  return useQuery({
    queryKey: bookingKeys.conflict(date, excludeId),
    queryFn: () => bookingsApi.checkConflict(date, excludeId),
    enabled: !!date,
    staleTime: 10_000,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookingInput) => bookingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all() })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['calendar'] })
      toast.success('Booking created successfully')
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Failed to create booking'
      toast.error(message)
    },
  })
}

export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateBookingInput>) => bookingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: bookingKeys.all() })
      toast.success('Booking updated')
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Update failed'
      toast.error(message)
    },
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<Booking>, unknown, RecordPaymentInput, { snapshot: unknown; bookingId: string }>({
    mutationFn: (data) => bookingsApi.recordPayment(data),
    onMutate: async ({ bookingId }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.detail(bookingId) })
      const snapshot = queryClient.getQueryData(bookingKeys.detail(bookingId))
      return { snapshot, bookingId }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) queryClient.setQueryData(bookingKeys.detail(ctx.bookingId), ctx.snapshot)
      toast.error('Failed to record payment')
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(vars.bookingId) })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onSuccess: () => toast.success('Payment recorded! SMS receipt sent to client.'),
  })
}

export function useAddNote(bookingId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { content: string; noteType: string }) =>
      bookingsApi.addNote(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) })
      toast.success('Note added')
    },
  })
}

export function useCancelBooking(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => bookingsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) })
      toast.success('Booking cancelled')
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Cancellation failed'
      toast.error(message)
    },
  })
}
