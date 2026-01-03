import { useState } from 'react'
import { useAdminEmployees, useUpdateEmployeeSalary } from '@/hooks/useAdmin'
import { Card, CardContent } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Edit2, Save, X } from 'lucide-react'

export const PayrollTab = () => {
  const [pageSize, setPageSize] = useState(50)
  const [skip, setSkip] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingSalary, setEditingSalary] = useState<string>('')

  const { data, isLoading, refetch } = useAdminEmployees(skip, pageSize)
  const { mutate: updateSalary, isPending } = useUpdateEmployeeSalary('')

  const employees = data ?? []

  const handleEditSalary = (employeeId: string, currentSalary: number) => {
    setEditingId(employeeId)
    setEditingSalary(currentSalary.toString())
  }

  const handleSaveSalary = () => {
    const salary = parseFloat(editingSalary)
    if (isNaN(salary) || salary < 0) {
      alert('Please enter a valid salary')
      return
    }

    updateSalary(salary, {
      onSuccess: () => {
        setEditingId(null)
        setEditingSalary('')
        refetch()
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Employee
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Job Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Department
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Monthly Salary
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        <div>
                          <p className="font-medium">
                            {employee.profile?.firstName} {employee.profile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{employee.employeeId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{employee.email}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {employee.profile?.jobTitle || '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {employee.profile?.department || '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        {editingId === employee.id ? (
                          <input
                            type="number"
                            value={editingSalary}
                            onChange={(e) => setEditingSalary(e.target.value)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-24 text-right"
                            placeholder="0"
                          />
                        ) : (
                          `$${(employee.profile?.salary || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === employee.id ? (
                            <>
                              <button
                                onClick={() => handleSaveSalary()}
                                disabled={isPending}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 rounded transition"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null)
                                  setEditingSalary('')
                                }}
                                disabled={isPending}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded transition"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                handleEditSalary(employee.id, employee.profile?.salary || 0)
                              }
                              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded transition"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && employees.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Showing {skip + 1} to {Math.min(skip + pageSize, employees.length)} employees
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSkip(Math.max(0, skip - pageSize))}
              disabled={skip === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSkip(skip + pageSize)}
              disabled={skip + pageSize >= (employees.length || 0)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
