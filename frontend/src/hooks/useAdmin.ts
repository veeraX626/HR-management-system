import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient, handleApiError } from '@/utils/axios'
import { ApiResponse } from '@/types'
import toast from 'react-hot-toast'

export interface Employee {
  id: string
  employeeId: string
  email: string
  role: string
  createdAt: string
  profile?: {
    firstName: string
    lastName: string
    phone?: string
    gender?: string
    jobTitle?: string
    department?: string
    salary?: number
  }
}

export interface LeaveRequest {
  id: string
  userId: string
  type: string
  startDate: string
  endDate: string
  duration: number
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedBy?: string
  approvalDate?: string
  remarks?: string
  user?: {
    id: string
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
  }
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  date: string
  checkInTime?: string
  checkOutTime?: string
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE'
  user?: {
    id: string
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
  }
  createdAt: string
}

// ==================== EMPLOYEES ====================

export const useAdminEmployees = (skip = 0, take = 50) => {
  return useQuery({
    queryKey: ['admin-employees', skip, take],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Employee[]>>('/admin/employees', {
        params: { skip, take }
      })
      return response.data.data || []
    },
  })
}

export const useAdminEmployee = (id: string) => {
  return useQuery({
    queryKey: ['admin-employee', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Employee>>(`/admin/employees/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateEmployee = () => {
  return useMutation({
    mutationFn: async (data: Partial<Employee> & { password: string }) => {
      const response = await apiClient.post<ApiResponse<Employee>>('/admin/employees', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Employee created successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useUpdateEmployee = (id: string) => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put<ApiResponse<Employee>>(`/admin/employees/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Employee updated successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useDeleteEmployee = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<null>>(`/admin/employees/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success('Employee deleted successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useUpdateEmployeeSalary = (id: string) => {
  return useMutation({
    mutationFn: async (salary: number) => {
      const response = await apiClient.put<ApiResponse<Employee>>(`/admin/employees/${id}/salary`, { salary })
      return response.data
    },
    onSuccess: () => {
      toast.success('Salary updated successfully')
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

// ==================== LEAVES ====================

export const useAdminLeaves = (status?: string, skip = 0, take = 50) => {
  return useQuery({
    queryKey: ['admin-leaves', status, skip, take],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<LeaveRequest[]> & { pagination: any }>('/admin/leaves', {
        params: { status, skip, take }
      })
      return response.data
    },
  })
}

export const useApproveLeave = () => {
  return useMutation({
    mutationFn: async (data: { id: string; action: 'APPROVED' | 'REJECTED'; remarks?: string }) => {
      const response = await apiClient.post<ApiResponse<LeaveRequest>>(
        `/admin/leaves/${data.id}/approve`,
        { action: data.action, remarks: data.remarks }
      )
      return response.data
    },
    onSuccess: (data) => {
      toast.success(`Leave ${data?.data?.status?.toLowerCase() || 'updated'}`)
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}

export const useRejectLeave = () => {
  return useMutation({
    mutationFn: async (data: { id: string; remarks?: string }) => {
      const response = await apiClient.post<ApiResponse<LeaveRequest>>(
        `/admin/leaves/${data.id}/approve`,
        { action: 'REJECTED', remarks: data.remarks }
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

// ==================== ATTENDANCE ====================

export const useAdminAttendance = (skip = 0, take = 50) => {
  return useQuery({
    queryKey: ['admin-attendance', skip, take],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceRecord[]> & { pagination: any }>('/admin/attendance', {
        params: { skip, take }
      })
      return response.data
    },
  })
}
