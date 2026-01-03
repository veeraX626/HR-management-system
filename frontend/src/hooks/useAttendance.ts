import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient, handleApiError } from '@/utils/axios'
import { AttendanceRecord, ApiResponse, PaginatedResponse } from '@/types'
import toast from 'react-hot-toast'

export const useAttendanceRecords = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['attendance', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<AttendanceRecord>>('/attendance', {
        params: { page, limit },
      })
      return response.data
    },
  })
}

export const useAttendanceByDate = (date: string) => {
  return useQuery({
    queryKey: ['attendance', date],
    queryFn: async () => {
      const response = await apiClient.get<AttendanceRecord>(`/attendance/${date}`)
      return response.data
    },
  })
}

export const useCheckIn = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<AttendanceRecord>>('/attendance/check-in')
      return response.data
    },
    onSuccess: () => {
      toast.success('Checked in successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useCheckOut = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<AttendanceRecord>>('/attendance/check-out')
      return response.data
    },
    onSuccess: () => {
      toast.success('Checked out successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useAttendanceStats = () => {
  return useQuery({
    queryKey: ['attendanceStats'],
    queryFn: async () => {
      const response = await apiClient.get('/attendance/stats')
      return response.data
    },
  })
}
