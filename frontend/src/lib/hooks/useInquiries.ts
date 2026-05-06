import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inquiriesApi } from '@/lib/api/inquiries.api'
import { toast } from 'sonner'
import type { ApiResponse, Inquiry } from '@/types'

export const inquiryKeys = {
  all: () => ['inquiries'] as const,
  lists: (filters?: object) => ['inquiries', 'list', filters] as const,
}

export function useInquiries(filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: inquiryKeys.all(),
    queryFn: () => inquiriesApi.getAll(filters),
    staleTime: 5000,
  })
}

export function useCreateInquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Inquiry>) => inquiriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.all() })
      toast.success('Inquiry created successfully')
    },
    onError: () => {
      toast.error('Failed to create inquiry')
    }
  })
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => inquiriesApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.all() })
    },
    onError: () => {
      toast.error('Failed to update status')
    }
  })
}

export function useConvertToBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => inquiriesApi.convertToBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.all() })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['calendar'] })
      toast.success('Inquiry converted to Booking successfully')
    },
    onError: () => {
      toast.error('Failed to convert inquiry')
    }
  })
}
