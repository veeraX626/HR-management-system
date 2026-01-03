import { useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import {
  DollarSign,
  Download,
  Mail,
  Share2,
  TrendingUp,
  Briefcase,
  Calendar,
  Search,
  Filter,
  FileText,
  Edit2,
  Save,
  X,
  Check,
  BarChart3,
  Users,
  AlertCircle,
  ArrowUpRight,
  Eye,
  FileSpreadsheet,
  Zap,
} from 'lucide-react'

// Mock data - Replace with actual API calls
const mockEmployeePayroll = {
  employee: {
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Senior Developer',
  },
  currentMonth: 'July 2026',
  earnings: {
    basicPay: 50000,
    hra: 10000,
    da: 5000,
    allowances: 3000,
  },
  deductions: {
    pf: 6000,
    pt: 200,
    esi: 500,
    tds: 2300,
  },
  netSalary: 59000,
  status: 'PROCESSED',
}

const mockSalaryHistory = [
  { month: 'Jul 2026', netSalary: 59000, status: 'PROCESSED' },
  { month: 'Jun 2026', netSalary: 58500, status: 'PROCESSED' },
  { month: 'May 2026', netSalary: 58500, status: 'PROCESSED' },
  { month: 'Apr 2026', netSalary: 57000, status: 'PROCESSED' },
  { month: 'Mar 2026', netSalary: 57000, status: 'PROCESSED' },
  { month: 'Feb 2026', netSalary: 57000, status: 'PROCESSED' },
]

const mockAdminPayrollData = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    basicPay: 50000,
    totalSalary: 75000,
    status: 'READY',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    basicPay: 45000,
    totalSalary: 68000,
    status: 'READY',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Bob Wilson',
    department: 'Sales',
    basicPay: 55000,
    totalSalary: 82000,
    status: 'PENDING',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Alice Brown',
    department: 'Marketing',
    basicPay: 48000,
    totalSalary: 72000,
    status: 'READY',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Charlie Davis',
    department: 'Engineering',
    basicPay: 52000,
    totalSalary: 78000,
    status: 'PROCESSED',
  },
]

export const PayrollPage = () => {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN'

  // Employee View Component
  const EmployeeView = () => {
    const { earnings, deductions, netSalary, currentMonth, employee } = mockEmployeePayroll
    const grossSalary = Object.values(earnings).reduce((sum, val) => sum + val, 0)
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0)

    return (
      <div className="space-y-8">
        {/* Current Salary Slip */}
        <Card className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Current Salary Slip - {currentMonth}
                </h2>
                <p className="text-blue-200">
                  {employee.name} ({employee.employeeId}) • {employee.department}
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="!bg-green-500/30 !border-green-400/50 hover:!bg-green-500/40">
                  <Download size={18} className="mr-2" />
                  PDF
                </Button>
                <Button className="!bg-purple-500/30 !border-purple-400/50 hover:!bg-purple-500/40">
                  <Mail size={18} className="mr-2" />
                  Email
                </Button>
                <Button className="!bg-orange-500/30 !border-orange-400/50 hover:!bg-orange-500/40">
                  <Share2 size={18} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-4">
                  <TrendingUp size={20} />
                  Earnings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">Basic Pay</span>
                    <span className="text-white font-bold">₹{earnings.basicPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">HRA (House Rent Allowance)</span>
                    <span className="text-white font-bold">₹{earnings.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">DA (Dearness Allowance)</span>
                    <span className="text-white font-bold">₹{earnings.da.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">Other Allowances</span>
                    <span className="text-white font-bold">₹{earnings.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-green-500/20 border border-green-400/30 mt-4">
                    <span className="text-green-200 font-semibold">Gross Salary</span>
                    <span className="text-green-100 font-bold text-xl">₹{grossSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-4">
                  <AlertCircle size={20} />
                  Deductions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">PF (Provident Fund)</span>
                    <span className="text-red-300 font-bold">-₹{deductions.pf.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">PT (Professional Tax)</span>
                    <span className="text-red-300 font-bold">-₹{deductions.pt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">ESI (Health Insurance)</span>
                    <span className="text-red-300 font-bold">-₹{deductions.esi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-300">TDS (Tax Deduction)</span>
                    <span className="text-red-300 font-bold">-₹{deductions.tds.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-red-500/20 border border-red-400/30 mt-4">
                    <span className="text-red-200 font-semibold">Total Deductions</span>
                    <span className="text-red-100 font-bold text-xl">-₹{totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-400/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/30 flex items-center justify-center">
                    <DollarSign size={24} className="text-green-300" />
                  </div>
                  <div>
                    <p className="text-green-200 text-sm uppercase tracking-wide font-semibold">Net Salary</p>
                    <p className="text-white text-3xl font-bold">₹{netSalary.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-200 text-xs uppercase mb-1">Credited On</p>
                  <p className="text-white font-semibold">Last day of month</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Salary History */}
        <Card className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Calendar className="text-purple-300" size={28} />
              Salary History
            </h3>

            <div className="space-y-3">
              {mockSalaryHistory.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-102"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                      <Calendar size={20} className="text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{record.month}</p>
                      <p className="text-gray-400 text-sm">Processed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-white font-bold text-lg">₹{record.netSalary.toLocaleString()}</p>
                    <Button className="!bg-purple-500/30 !border-purple-400/50 hover:!bg-purple-500/40">
                      <Eye size={18} className="mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Tax Summary */}
        <Card className="!bg-gradient-to-br !from-orange-500/20 !to-orange-600/20 !border-orange-400/30">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="text-orange-300" size={28} />
              Tax Summary & Projections
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-orange-200 text-sm uppercase tracking-wide mb-2">Annual CTC</p>
                <p className="text-white text-2xl font-bold">₹{(netSalary * 12).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-orange-200 text-sm uppercase tracking-wide mb-2">Tax Slab</p>
                <p className="text-white text-2xl font-bold">20%</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-orange-200 text-sm uppercase tracking-wide mb-2">Annual Tax</p>
                <p className="text-white text-2xl font-bold">₹{(deductions.tds * 12).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Admin View Component
  const AdminView = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedSalary, setEditedSalary] = useState<any>(null)

    const filteredEmployees = mockAdminPayrollData.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (employee: any) => {
      setSelectedEmployee(employee)
      setEditedSalary({
        basicPay: 50000,
        hra: 10000,
        da: 5000,
        allowances: 3000,
        pf: 6000,
        tds: 2300,
      })
      setIsEditing(true)
    }

    const handleSave = () => {
      console.log('Saving salary changes:', editedSalary)
      setIsEditing(false)
      setSelectedEmployee(null)
    }

    const calculateTotals = () => {
      if (!editedSalary) return { gross: 0, net: 0 }
      const gross = editedSalary.basicPay + editedSalary.hra + editedSalary.da + editedSalary.allowances
      const deductions = editedSalary.pf + editedSalary.tds
      return { gross, net: gross - deductions }
    }

    const totals = calculateTotals()

    return (
      <div className="space-y-8">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover className="!bg-gradient-to-br !from-green-500/20 !to-green-600/20 !border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total Payroll</p>
                <p className="text-3xl font-bold text-white mt-2">₹45L</p>
                <p className="text-green-300 text-xs mt-2">+5% vs last month</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign size={32} className="text-white" />
              </div>
            </div>
          </Card>

          <Card hover className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Avg Salary</p>
                <p className="text-3xl font-bold text-white mt-2">₹68k</p>
                <p className="text-blue-300 text-xs mt-2">Across all depts</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={32} className="text-white" />
              </div>
            </div>
          </Card>

          <Card hover className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Processed</p>
                <p className="text-3xl font-bold text-white mt-2">42/50</p>
                <p className="text-purple-300 text-xs mt-2">84% complete</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Check size={32} className="text-white" />
              </div>
            </div>
          </Card>

          <Card hover className="!bg-gradient-to-br !from-orange-500/20 !to-orange-600/20 !border-orange-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">8</p>
                <p className="text-orange-300 text-xs mt-2">Needs review</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle size={32} className="text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Employee Payroll Table */}
        <Card className="!bg-gradient-to-br !from-slate-700/20 !to-slate-800/20 !border-slate-600/30">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Briefcase className="text-slate-300" size={28} />
                Employee Payroll Management
              </h2>
              <div className="flex gap-2">
                <Button className="!bg-green-500/30 !border-green-400/50 hover:!bg-green-500/40">
                  <Zap size={18} className="mr-2" />
                  Generate All
                </Button>
                <Button className="!bg-blue-500/30 !border-blue-400/50 hover:!bg-blue-500/40">
                  <FileSpreadsheet size={18} className="mr-2" />
                  Export CSV
                </Button>
                <Button className="!bg-purple-500/30 !border-purple-400/50 hover:!bg-purple-500/40">
                  <BarChart3 size={18} className="mr-2" />
                  Reports
                </Button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search employees by name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-10 !bg-white/5 !border-white/10 !text-white !placeholder-white/40"
                />
              </div>
              <Button className="!bg-white/10 !border-white/20">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm">#</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm">Employee</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm">Department</th>
                    <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm">Basic Pay</th>
                    <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm">Total Salary</th>
                    <th className="text-center py-4 px-4 text-slate-300 font-semibold text-sm">Status</th>
                    <th className="text-center py-4 px-4 text-slate-300 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4 text-white">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-semibold">{employee.name}</p>
                          <p className="text-gray-400 text-sm">{employee.employeeId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{employee.department}</td>
                      <td className="py-4 px-4 text-right text-white font-semibold">
                        ₹{employee.basicPay.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-white font-bold">
                        ₹{employee.totalSalary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            employee.status === 'READY'
                              ? 'bg-green-500/30 text-green-100 border border-green-400/50'
                              : employee.status === 'PROCESSED'
                                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50'
                                : 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50'
                          }`}
                        >
                          {employee.status === 'READY' && <Check size={14} />}
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors">
                            <Download size={16} />
                          </button>
                          <button className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Salary Structure Editor */}
        {isEditing && selectedEmployee && editedSalary && (
          <Card className="!bg-gradient-to-br !from-indigo-500/20 !to-indigo-600/20 !border-indigo-400/30">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Edit2 className="text-indigo-300" size={28} />
                  Salary Structure Editor - {selectedEmployee.name}
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="!bg-green-500/30 !border-green-400/50 hover:!bg-green-500/40"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedEmployee(null)
                    }}
                    className="!bg-red-500/30 !border-red-400/50 hover:!bg-red-500/40"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-green-300 mb-4">Earnings Components</h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Basic Pay</label>
                    <Input
                      type="number"
                      value={editedSalary.basicPay}
                      onChange={(e) =>
                        setEditedSalary({ ...editedSalary, basicPay: Number(e.target.value) })
                      }
                      className="!bg-white/5 !border-white/10 !text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">HRA</label>
                    <Input
                      type="number"
                      value={editedSalary.hra}
                      onChange={(e) => setEditedSalary({ ...editedSalary, hra: Number(e.target.value) })}
                      className="!bg-white/5 !border-white/10 !text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">DA</label>
                    <Input
                      type="number"
                      value={editedSalary.da}
                      onChange={(e) => setEditedSalary({ ...editedSalary, da: Number(e.target.value) })}
                      className="!bg-white/5 !border-white/10 !text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Allowances</label>
                    <Input
                      type="number"
                      value={editedSalary.allowances}
                      onChange={(e) =>
                        setEditedSalary({ ...editedSalary, allowances: Number(e.target.value) })
                      }
                      className="!bg-white/5 !border-white/10 !text-white"
                    />
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-red-300 mb-4">Deduction Components</h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">PF</label>
                    <Input
                      type="number"
                      value={editedSalary.pf}
                      onChange={(e) => setEditedSalary({ ...editedSalary, pf: Number(e.target.value) })}
                      className="!bg-white/5 !border-white/10 !text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">TDS</label>
                    <Input
                      type="number"
                      value={editedSalary.tds}
                      onChange={(e) => setEditedSalary({ ...editedSalary, tds: Number(e.target.value) })}
                      className="!bg-white/5 !border-white/10 !text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-400/30">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-indigo-200 text-sm uppercase tracking-wide mb-2">Gross Salary</p>
                    <p className="text-white text-2xl font-bold">₹{totals.gross.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-200 text-sm uppercase tracking-wide mb-2">Total Deductions</p>
                    <p className="text-red-300 text-2xl font-bold">
                      -₹{(totals.gross - totals.net).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-200 text-sm uppercase tracking-wide mb-2">Net Salary</p>
                    <p className="text-green-300 text-2xl font-bold">₹{totals.net.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Bulk Operations */}
        <Card className="!bg-gradient-to-br !from-pink-500/20 !to-pink-600/20 !border-pink-400/30">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="text-pink-300" size={28} />
              Bulk Operations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 text-left">
                <ArrowUpRight className="text-green-300 mb-3" size={28} />
                <p className="text-white font-bold mb-1">Annual Increment</p>
                <p className="text-gray-400 text-sm">Apply 5% hike to all employees</p>
              </button>

              <button className="p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 text-left">
                <Download className="text-blue-300 mb-3" size={28} />
                <p className="text-white font-bold mb-1">Generate All Slips</p>
                <p className="text-gray-400 text-sm">Create PDF for all employees</p>
              </button>

              <button className="p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 text-left">
                <Mail className="text-purple-300 mb-3" size={28} />
                <p className="text-white font-bold mb-1">Email Notifications</p>
                <p className="text-gray-400 text-sm">Send salary slips to all</p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-2">
            {isAdmin ? 'Payroll Management' : 'My Payroll'}
          </h1>
          <p className="text-gray-300">
            {isAdmin
              ? 'Manage employee salaries, generate slips, and view analytics'
              : 'View your salary details, download slips, and track history'}
          </p>
        </div>

        {/* Conditional Rendering */}
        {isAdmin ? <AdminView /> : <EmployeeView />}
      </div>
    </div>
  )
}
