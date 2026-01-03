import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient, handleApiError } from '@/utils/axios'
import { Leave, LeaveRequest, ApiResponse, PaginatedResponse } from '@/types'
import toast from 'react-hot-toast'

export const useMyLeaves = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['myLeaves', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Leave>>('/leaves', {
        params: { page, limit },
      })
      return response.data
    },
  })
}

export const useAllLeaves = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ['allLeaves', page, limit, status],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Leave>>('/leaves/all', {
        params: { page, limit, status },
      })
      return response.data
    },
  })
}

export const useApplyLeave = () => {
  return useMutation({
    mutationFn: async (data: LeaveRequest) => {
      const response = await apiClient.post<ApiResponse<Leave>>('/leaves/apply', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Leave request submitted')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useApproveLeave = () => {
  return useMutation({
    mutationFn: async ({ leaveId, comments }: { leaveId: string; comments?: string }) => {
      const response = await apiClient.post<ApiResponse<Leave>>(
        `/leaves/${leaveId}/approve`,
        { comments }
      )
      return response.data
    },
    onSuccess: () => {
      toast.success('Leave approved')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useRejectLeave = () => {
  return useMutation({
    mutationFn: async ({ leaveId, comments }: { leaveId: string; comments?: string }) => {
      const response = await apiClient.post<ApiResponse<Leave>>(
        `/leaves/${leaveId}/reject`,
        { comments }
      )
      return response.data
    },
    onSuccess: () => {
      toast.success('Leave rejected')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useCancelLeave = () => {
  return useMutation({
    mutationFn: async (leaveId: string) => {
      const response = await apiClient.post<ApiResponse<Leave>>(
        `/leaves/${leaveId}/cancel`
      )
      return response.data
    },
    onSuccess: () => {
      toast.success('Leave cancelled')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}
