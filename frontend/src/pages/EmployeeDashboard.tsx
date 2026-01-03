import { useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import {
  Plus,
  Search,
  ChevronDown,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  User,
  Mail,
  Building,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Plane,
  Users,
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
    joinDate: '2023-01-15',
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
    joinDate: '2022-06-10',
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
    joinDate: '2023-03-20',
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
    joinDate: '2023-02-14',
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
    joinDate: '2022-09-05',
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
    joinDate: '2023-04-01',
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
    joinDate: '2022-11-22',
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
    joinDate: '2023-05-10',
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
    joinDate: '2022-08-18',
  },
]

export const EmployeeDashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null)

  const filteredEmployees = mockEmployees
    .filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter

      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter

      return matchesSearch && matchesDepartment && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'department') return a.department.localeCompare(b.department)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  const departments = ['all', ...new Set(mockEmployees.map((e) => e.department))]

  const presentCount = mockEmployees.filter((e) => e.status === 'present').length
  const leaveCount = mockEmployees.filter((e) => e.status === 'leave').length
  const absentCount = mockEmployees.filter((e) => e.status === 'absent').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500'
      case 'leave':
        return 'bg-amber-500'
      case 'absent':
        return 'bg-rose-500'
      default:
        return 'bg-slate-500'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30'
      case 'leave':
        return 'bg-amber-500/10 text-amber-200 border-amber-400/30'
      case 'absent':
        return 'bg-rose-500/10 text-rose-200 border-rose-400/30'
      default:
        return 'bg-slate-500/10 text-slate-200 border-slate-400/30'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 md:ml-64 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent mb-2">
                Employee Management
              </h1>
              <p className="text-slate-400">Manage and track all employees in your organization</p>
            </div>
            <Button className="flex items-center gap-2 w-fit">
              <Plus size={20} />
              Add Employee
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card hover className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Employees</p>
                  <p className="text-3xl font-bold text-white mt-2">{mockEmployees.length}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <Users size={28} className="text-blue-300" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card hover className="!bg-gradient-to-br !from-emerald-500/20 !to-emerald-600/20 !border-emerald-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-200 text-sm font-medium">Present</p>
                  <p className="text-3xl font-bold text-white mt-2">{presentCount}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-emerald-300" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card hover className="!bg-gradient-to-br !from-amber-500/20 !to-amber-600/20 !border-amber-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm font-medium">On Leave</p>
                  <p className="text-3xl font-bold text-white mt-2">{leaveCount}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-amber-500/30 flex items-center justify-center">
                  <Plane size={28} className="text-amber-300" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card hover className="!bg-gradient-to-br !from-rose-500/20 !to-rose-600/20 !border-rose-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-200 text-sm font-medium">Absent</p>
                  <p className="text-3xl font-bold text-white mt-2">{absentCount}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-rose-500/30 flex items-center justify-center">
                  <AlertCircle size={28} className="text-rose-300" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="!bg-gradient-to-br !from-slate-800/50 !to-slate-900/50 !border-white/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-12 !bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400"
                />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-primary-400 transition-colors text-sm"
                >
                  <option value="all">All Departments</option>
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-primary-400 transition-colors text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="leave">On Leave</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-primary-400 transition-colors text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="department">Sort by Department</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>Showing {filteredEmployees.length} of {mockEmployees.length} employees</span>
              <Button className="!bg-white/10 !border-white/20 hover:!bg-white/20 text-xs flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="!bg-gradient-to-br !from-slate-800/50 !to-slate-900/50 !border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Employee ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="w-10 h-10 rounded-full border border-primary-400/50"
                              />
                              <div>
                                <p className="font-medium text-white">{employee.name}</p>
                                <p className="text-xs text-slate-400">{employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-primary-300">{employee.employeeId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-300">{employee.position}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-300">{employee.department}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusBgColor(
                                employee.status
                              )}`}
                            >
                              {getStatusIcon(employee.status)}
                              {getStatusLabel(employee.status)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setExpandedEmployee(employee.id)}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary-300 transition-colors"
                                title="View details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary-300 transition-colors"
                                title="Edit employee"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete employee"
                              >
                                <Trash2 size={18} />
                              </button>
                              <div className="relative group/menu">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
                                  <MoreVertical size={18} />
                                </button>
                                <div className="absolute right-0 mt-1 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-300 text-sm first:rounded-t-lg">
                                    Promote
                                  </button>
                                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-300 text-sm">
                                    Send Leave
                                  </button>
                                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-300 text-sm">
                                    Attendance Report
                                  </button>
                                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-rose-400 text-sm last:rounded-b-lg">
                                    Terminate
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle size={48} className="text-slate-500 mb-4" />
                            <p className="text-slate-400 text-lg">No employees found</p>
                            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
