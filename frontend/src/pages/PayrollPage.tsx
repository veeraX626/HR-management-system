import { useAuthStore } from '@/stores/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import { DollarSign } from 'lucide-react'

export const PayrollPage = () => {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payroll</h1>

        {isAdmin ? (
          <>
            {/* Admin View: Employee Salary Management */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={24} />
                  Employee Salary Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          Employee
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          Employee ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          Monthly Salary
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">John Doe</td>
                          <td className="py-3 px-4">EMP00{i}</td>
                          <td className="py-3 px-4 font-semibold">$5,000.00</td>
                          <td className="py-3 px-4">Engineering</td>
                          <td className="py-3 px-4">
                            <button className="text-primary-600 hover:underline text-sm font-medium">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Employee View: Payslips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={24} />
                  Your Payslips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">December 2024</p>
                        <p className="text-sm text-gray-600">Monthly Payslip</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">$5,000.00</p>
                        <button className="text-primary-600 hover:underline text-sm font-medium mt-1">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary Breakdown */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Latest Salary Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-semibold">$5,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allowances</span>
                    <span className="font-semibold">$800.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductions</span>
                    <span className="font-semibold text-red-600">-$300.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Net Salary</span>
                    <span className="font-bold text-lg text-green-600">$5,500.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
