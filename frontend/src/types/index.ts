export type UserRole = 'employee' | 'admin'

export interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: UserRole
  department: string
  position: string
  avatar?: string
  joinDate: string
  salary?: number
  phone?: string
  address?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  status: 'active' | 'inactive' | 'on-leave'
  avatar?: string
  phone?: string
  salary?: number
}

export interface DashboardStats {
  totalEmployees: number
  employeesChange: number
  pendingLeaves: number
  leavesChange: number
  attendanceRate: number
  attendanceChange: number
  payrollStatus: string
}

export interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut?: string
  status: 'present' | 'absent' | 'late' | 'half-day'
  hoursWorked?: number
}

export interface Leave {
  id: string
  employeeId: string
  employeeName: string
  leaveType: 'sick' | 'casual' | 'annual' | 'unpaid'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  appliedDate: string
  approvedBy?: string
}

export interface Activity {
  id: string
  type: 'leave' | 'attendance' | 'profile' | 'system'
  message: string
  timestamp: string
  user: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupData {
  employeeId: string
  name: string
  email: string
  password: string
  department: string
  position: string
  phone?: string
  joinDate: string
}
