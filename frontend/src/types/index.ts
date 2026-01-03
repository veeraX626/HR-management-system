export type UserRole = 'ADMIN' | 'EMPLOYEE'

export interface User {
  id: string
  email: string
  employeeId?: string
  firstName: string
  lastName: string
  role: UserRole
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  userId: string
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  jobTitle?: string
  department?: string
  salary?: number
  joiningDate?: string
  reportsTo?: string
  updatedAt: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  date: string
  checkInTime?: string
  checkOutTime?: string
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE'
  createdAt: string
  updatedAt: string
}

export interface Leave {
  id: string
  userId: string
  type: 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'UNPAID'
  startDate: string
  endDate: string
  duration: number
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedBy?: string
  approvalDate?: string
  comments?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface SignupData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  employeeId: string
  role: UserRole
}

export interface LoginData {
  email: string
  password: string
}

export interface LeaveRequest {
  type: 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'UNPAID'
  startDate: string
  endDate: string
  reason: string
}
