import { useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import {
  Plus,
  Search,
  LogOut,
  User,
  Clock,
  AlertCircle,
  Plane,
  CheckCircle2,
  ChevronRight,
  Settings,
} from 'lucide-react'

// Mock employee data with more details
const mockEmployees = [
  {
    id: '1',
    name: 'John Doe',
    employeeId: 'OIJA20230001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'present',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'john.doe@company.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    employeeId: 'OIJD20220001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    status: 'present',
    department: 'HR',
    position: 'HR Manager',
    email: 'jane.smith@company.com',
  },
  {
    id: '3',
    name: 'Michael Brown',
    employeeId: 'OIMD20230002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'leave',
    department: 'Design',
    position: 'UI/UX Designer',
    email: 'michael.brown@company.com',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    employeeId: 'OISW20230003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'present',
    department: 'Marketing',
    position: 'Marketing Manager',
    email: 'sarah.wilson@company.com',
  },
  {
    id: '5',
    name: 'David Lee',
    employeeId: 'OIDL20220002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'absent',
    department: 'Finance',
    position: 'Financial Analyst',
    email: 'david.lee@company.com',
  },
  {
    id: '6',
    name: 'Emma Taylor',
    employeeId: 'OIET20230004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    status: 'present',
    department: 'Engineering',
    position: 'Frontend Developer',
    email: 'emma.taylor@company.com',
  },
  {
    id: '7',
    name: 'Chris Martin',
    employeeId: 'OICM20220003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    status: 'leave',
    department: 'Sales',
    position: 'Sales Executive',
    email: 'chris.martin@company.com',
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    employeeId: 'OILA20230005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    status: 'present',
    department: 'HR',
    position: 'Recruiter',
    email: 'lisa.anderson@company.com',
  },
  {
    id: '9',
    name: 'Robert Garcia',
    employeeId: 'OIRG20220004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    status: 'absent',
    department: 'Operations',
    position: 'Operations Manager',
    email: 'robert.garcia@company.com',
  },
]

export const EmployeeDashboard = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('employees')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const presentCount = mockEmployees.filter((e) => e.status === 'present').length
  const leaveCount = mockEmployees.filter((e) => e.status === 'leave').length
  const absentCount = mockEmployees.filter((e) => e.status === 'absent').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500'
      case 'leave':
        return 'bg-yellow-500'
      case 'absent':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/20 text-green-200 border-green-400/30'
      case 'leave':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
      case 'absent':
        return 'bg-red-500/20 text-red-200 border-red-400/30'
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 size={16} />
      case 'leave':
        return <Plane size={16} />
      case 'absent':
        return <AlertCircle size={16} />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Present'
      case 'leave':
        return 'On Leave'
      case 'absent':
        return 'Absent'
      default:
        return 'Unknown'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 p-4 md:p-8 md:ml-64 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-2">
                Employee Management
              </h1>
              <p className="text-gray-300">Manage and track all employees</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card hover className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-white mt-2">{mockEmployees.length}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-blue-500/30 flex items-center justify-center">
                <User size={28} className="text-blue-300" />
              </div>
            </div>
          </Card>

          <Card hover className="!bg-gradient-to-br !from-green-500/20 !to-green-600/20 !border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Present</p>
                <p className="text-3xl font-bold text-white mt-2">{presentCount}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-green-500/30 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-green-300" />
              </div>
            </div>
          </Card>

          <Card hover className="!bg-gradient-to-br !from-yellow-500/20 !to-yellow-600/20 !border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">On Leave</p>
                <p className="text-3xl font-bold text-white mt-2">{leaveCount}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-yellow-500/30 flex items-center justify-center">
                <Plane size={28} className="text-yellow-300" />
              </div>
            </div>
          </Card>

          <Card hover className="!bg-gradient-to-br !from-red-500/20 !to-red-600/20 !border-red-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm font-medium">Absent</p>
                <p className="text-3xl font-bold text-white mt-2">{absentCount}</p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-red-500/30 flex items-center justify-center">
                <AlertCircle size={28} className="text-red-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="!bg-gradient-to-br !from-slate-800/50 !to-slate-900/50 !border-white/10">
          <div className="p-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-8 pb-8 border-b border-white/10">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-12 !bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
                />
              </div>

              <div className="flex gap-2">
                <Button className="!bg-gradient-to-r !from-green-500 !to-green-600 hover:!from-green-600 hover:!to-green-700">
                  <Plus size={20} className="mr-2" />
                  Add Employee
                </Button>
                <Button className="!bg-white/10 !border-white/20 hover:!bg-white/20">
                  <Settings size={20} />
                </Button>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className="group cursor-pointer relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                  <div className="p-6 relative">
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 w-10 h-10 rounded-full ${getStatusColor(employee.status)} flex items-center justify-center shadow-lg text-white`}>
                      {getStatusIcon(employee.status)}
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-24 h-24 rounded-full border-3 border-primary-400/50 group-hover:border-primary-300 transition-colors shadow-lg"
                      />
                    </div>

                    {/* Employee Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-1">{employee.name}</h3>
                      <p className="text-sm text-primary-300 font-mono mb-2">{employee.employeeId}</p>
                      <p className="text-xs text-gray-400">{employee.position}</p>
                      <p className="text-xs text-gray-500 mt-1">{employee.department}</p>
                    </div>

                    {/* Status & Email */}
                    <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
                      <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${getStatusBgColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        <span className="text-sm font-semibold">{getStatusLabel(employee.status)}</span>
                      </div>
                      <p className="text-xs text-gray-400 text-center">{employee.email}</p>
                    </div>

                    {/* Action Button */}
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 transition-colors font-semibold group/btn">
                      <span>View Profile</span>
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No employees found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </Card>

        {/* Employee Details Modal */}
        {selectedEmployee && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmployee(null)}
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto !bg-gradient-to-br !from-slate-800 !to-slate-900 !border-primary-400/30">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedEmployee.avatar}
                      alt={selectedEmployee.name}
                      className="w-20 h-20 rounded-full border-2 border-primary-400"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedEmployee.name}</h2>
                      <p className="text-primary-300 font-mono">{selectedEmployee.employeeId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Position</p>
                    <p className="text-white font-semibold">{selectedEmployee.position}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Department</p>
                    <p className="text-white font-semibold">{selectedEmployee.department}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold">{selectedEmployee.email}</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${getStatusBgColor(selectedEmployee.status)}`}>
                    <p className="text-sm mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedEmployee.status)}
                      <span className="font-semibold">{getStatusLabel(selectedEmployee.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button className="flex-1 !bg-gradient-to-r !from-primary-600 !to-primary-700">
                    Edit Employee
                  </Button>
                  <Button className="flex-1 !bg-red-500/20 !border-red-400/50 !text-red-300 hover:!bg-red-500/30">
                    Delete Employee
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
