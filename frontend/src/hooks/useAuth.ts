import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient, handleApiError } from '@/utils/axios'
import { AuthResponse, LoginData, SignupData, User } from '@/types'
import { useAuthStore } from '@/stores/auth'
import toast from 'react-hot-toast'

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post<AuthResponse>('/auth/signin', data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.token && data.user) {
        setAuth(data.user, data.token)
        toast.success('Login successful')
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useSignup = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const { confirmPassword, ...payload } = data
      const response = await apiClient.post<AuthResponse>('/auth/signup', payload)
      return response.data
    },
    onSuccess: (data) => {
      if (data.token && data.user) {
        setAuth(data.user, data.token)
        toast.success('Account created successfully')
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await apiClient.post('/auth/verify-email', { token })
      return response.data
    },
    onSuccess: () => {
      toast.success('Email verified successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useCurrentUser = () => {
  const { user, token } = useAuthStore()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get<User>('/auth/me')
      return response.data
    },
    enabled: !!token && !user,
    staleTime: Infinity,
  })
}
