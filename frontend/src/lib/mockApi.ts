import type { User, Employee, DashboardStats, Attendance, Leave, Activity, LoginCredentials, SignupData } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'admin@dayflow.com',
    role: 'admin',
    department: 'HR',
    position: 'HR Manager',
    avatar: '',
    joinDate: '2023-01-15',
    salary: 85000,
    phone: '+1 234 567 8900',
    address: '123 Admin St, NY',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'employee@dayflow.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Engineer',
    avatar: '',
    joinDate: '2023-03-20',
    salary: 75000,
    phone: '+1 234 567 8901',
    address: '456 Dev Ave, SF',
  },
]

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@dayflow.com',
    department: 'HR',
    position: 'HR Manager',
    joinDate: '2023-01-15',
    status: 'active',
    phone: '+1 234 567 8900',
    salary: 85000,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@dayflow.com',
    department: 'Engineering',
    position: 'Software Engineer',
    joinDate: '2023-03-20',
    status: 'active',
    phone: '+1 234 567 8901',
    salary: 75000,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Mike Johnson',
    email: 'mike.j@dayflow.com',
    department: 'Sales',
    position: 'Sales Executive',
    joinDate: '2023-05-10',
    status: 'on-leave',
    phone: '+1 234 567 8902',
    salary: 65000,
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Sarah Williams',
    email: 'sarah.w@dayflow.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    joinDate: '2023-06-01',
    status: 'active',
    phone: '+1 234 567 8903',
    salary: 70000,
  },
]

const mockDashboardStats: DashboardStats = {
  totalEmployees: 245,
  employeesChange: 12,
  pendingLeaves: 12,
  leavesChange: -3,
  attendanceRate: 98.5,
  attendanceChange: 2.1,
  payrollStatus: 'Ready',
}

const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    date: '2026-01-03',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'present',
    hoursWorked: 9,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    date: '2026-01-03',
    checkIn: '09:15',
    checkOut: '18:10',
    status: 'late',
    hoursWorked: 8.9,
  },
]

const mockLeaves: Leave[] = [
  {
    id: '1',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    leaveType: 'sick',
    startDate: '2026-01-05',
    endDate: '2026-01-07',
    days: 3,
    reason: 'Medical appointment',
    status: 'pending',
    appliedDate: '2026-01-02',
  },
  {
    id: '2',
    employeeId: 'EMP004',
    employeeName: 'Sarah Williams',
    leaveType: 'annual',
    startDate: '2026-01-15',
    endDate: '2026-01-20',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    appliedDate: '2025-12-20',
    approvedBy: 'John Doe',
  },
]

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'leave',
    message: 'Mike Johnson applied for sick leave',
    timestamp: '2026-01-02T14:30:00',
    user: 'Mike Johnson',
  },
  {
    id: '2',
    type: 'attendance',
    message: 'Jane Smith checked in',
    timestamp: '2026-01-03T09:15:00',
    user: 'Jane Smith',
  },
  {
    id: '3',
    type: 'profile',
    message: 'Sarah Williams updated profile',
    timestamp: '2026-01-02T10:20:00',
    user: 'Sarah Williams',
  },
]

export const mockApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(1000)

    const user = mockUsers.find((u) => u.email === credentials.email)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    return user
  },

  signup: async (data: SignupData): Promise<User> => {
    await delay(1000)

    if (mockUsers.find((u) => u.email === data.email)) {
      throw new Error('Email already registered')
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      ...data,
      role: 'employee',
      avatar: '',
    }

    mockUsers.push(newUser)
    return newUser
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500)
    return mockDashboardStats
  },

  getRecentActivities: async (): Promise<Activity[]> => {
    await delay(500)
    return mockActivities
  },

  getEmployees: async (): Promise<Employee[]> => {
    await delay(800)
    return mockEmployees
  },

  getEmployee: async (id: string): Promise<Employee> => {
    await delay(500)
    const employee = mockEmployees.find((e) => e.id === id)
    if (!employee) {
      throw new Error('Employee not found')
    }
    return employee
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    await delay(800)
    const index = mockEmployees.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    mockEmployees[index] = { ...mockEmployees[index], ...data }
    return mockEmployees[index]
  },

  getAttendance: async (employeeId?: string): Promise<Attendance[]> => {
    await delay(800)
    if (employeeId) {
      return mockAttendance.filter((a) => a.employeeId === employeeId)
    }
    return mockAttendance
  },

  checkIn: async (employeeId: string): Promise<Attendance> => {
    await delay(500)
    const now = new Date()
    const checkInTime = now.toTimeString().slice(0, 5)

    const newAttendance: Attendance = {
      id: String(mockAttendance.length + 1),
      employeeId,
      employeeName: mockEmployees.find((e) => e.employeeId === employeeId)?.name || 'Unknown',
      date: now.toISOString().split('T')[0],
      checkIn: checkInTime,
      status: 'present',
    }

    mockAttendance.push(newAttendance)
    return newAttendance
  },

  checkOut: async (attendanceId: string): Promise<Attendance> => {
    await delay(500)
    const index = mockAttendance.findIndex((a) => a.id === attendanceId)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }

    const now = new Date()
    const checkOutTime = now.toTimeString().slice(0, 5)
    mockAttendance[index].checkOut = checkOutTime

    return mockAttendance[index]
  },

  getLeaves: async (employeeId?: string): Promise<Leave[]> => {
    await delay(800)
    if (employeeId) {
      return mockLeaves.filter((l) => l.employeeId === employeeId)
    }
    return mockLeaves
  },

  applyLeave: async (leaveData: Omit<Leave, 'id' | 'status' | 'appliedDate'>): Promise<Leave> => {
    await delay(1000)
    const newLeave: Leave = {
      ...leaveData,
      id: String(mockLeaves.length + 1),
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    }

    mockLeaves.push(newLeave)
    return newLeave
  },

  updateLeaveStatus: async (leaveId: string, status: Leave['status'], approvedBy?: string): Promise<Leave> => {
    await delay(800)
    const index = mockLeaves.findIndex((l) => l.id === leaveId)
    if (index === -1) {
      throw new Error('Leave request not found')
    }

    mockLeaves[index].status = status
    if (approvedBy) {
      mockLeaves[index].approvedBy = approvedBy
    }

    return mockLeaves[index]
  },
}
