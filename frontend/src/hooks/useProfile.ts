import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient, handleApiError } from '@/utils/axios'
import { Profile, ApiResponse } from '@/types'
import toast from 'react-hot-toast'

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const url = userId ? `/profile/${userId}` : '/profile'
      const response = await apiClient.get<Profile>(url)
      return response.data
    },
    enabled: !!userId || true,
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const response = await apiClient.put<ApiResponse<Profile>>('/profile', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post<ApiResponse<Profile>>('/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Profile image updated')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}
