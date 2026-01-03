import { useState } from 'react'
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout'
import { useAdminEmployees, useDeleteEmployee, useUpdateEmployee, Employee } from '@/hooks/useAdmin'
import { EmployeesTable } from '@/components/Admin/EmployeesTable'
import { AttendanceTab } from '@/components/Admin/AttendanceTab'
import { LeavesTab } from '@/components/Admin/LeavesTab'
import { PayrollTab } from '@/components/Admin/PayrollTab'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Users, Clock, FileText, DollarSign } from 'lucide-react'

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leaves' | 'payroll'>('employees')
  const [pageSize, setPageSize] = useState(50)
  const [skip, setSkip] = useState(0)

  // Employee management state
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
  })

  const { data: employeeData, isLoading, refetch: refetchEmployees } = useAdminEmployees(skip, pageSize)
  const { mutate: deleteEmployee } = useDeleteEmployee('')
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee('')

  const employees = employeeData ?? []

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      name: `${employee.profile?.firstName || ''} ${employee.profile?.lastName || ''}`,
      email: employee.email,
      password: '',
      phone: employee.profile?.phone || '',
      employeeId: employee.employeeId,
    })
    setModalMode('view')
    setShowModal(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      name: `${employee.profile?.firstName || ''} ${employee.profile?.lastName || ''}`,
      email: employee.email,
      password: '',
      phone: employee.profile?.phone || '',
      employeeId: employee.employeeId,
    })
    setModalMode('edit')
    setShowModal(true)
  }

  const handleDeleteEmployee = () => {
    deleteEmployee(undefined, {
      onSuccess: () => {
        refetchEmployees()
      },
    })
  }

  const handleSaveEmployee = () => {
    if (!selectedEmployee) return

    updateEmployee(
      {
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
      },
      {
        onSuccess: () => {
          setShowModal(false)
          refetchEmployees()
        },
      }
    )
  }

  const tabs = [
    { id: 'employees' as const, label: 'Employees', icon: Users },
    { id: 'attendance' as const, label: 'Attendance', icon: Clock },
    { id: 'leaves' as const, label: 'Leaves', icon: FileText },
    { id: 'payroll' as const, label: 'Payroll', icon: DollarSign },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employees, attendance, leaves, and payroll
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSkip(0)
                }}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                  isActive
                    ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'text-gray-600 border-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Records per page:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setSkip(0)
                    }}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                  </select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  + Add Employee
                </Button>
              </div>
              <EmployeesTable
                employees={employees}
                isLoading={isLoading}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                pageSize={pageSize}
              />
            </div>
          )}

          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'leaves' && <LeavesTab />}
          {activeTab === 'payroll' && <PayrollTab />}
        </div>
      </div>

      {/* Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {modalMode === 'view'
                  ? 'Employee Details'
                  : modalMode === 'edit'
                  ? 'Edit Employee'
                  : 'Create Employee'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {modalMode === 'view' ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Employee ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.phone || '—'}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={modalMode !== 'edit'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={modalMode !== 'edit'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={modalMode !== 'edit'}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                {modalMode === 'edit' && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleSaveEmployee}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </Button>
                )}
                <Button
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                  onClick={() => setShowModal(false)}
                  disabled={isUpdating}
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
