import { useState } from 'react'
import { useAdminAttendance } from '@/hooks/useAdmin'
import { Card, CardContent } from '@/components/UI/Card'
import { Download } from 'lucide-react'
import { Button } from '@/components/UI/Button'

export const AttendanceTab = () => {
  const [pageSize, setPageSize] = useState(50)
  const [skip, setSkip] = useState(0)
  const { data, isLoading } = useAdminAttendance(skip, pageSize)

  const attendance = data?.data ?? []
  const pagination = data?.pagination

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
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Download size={16} />
          Export
        </Button>
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
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Check In
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Check Out
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No attendance records
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        <div>
                          <p className="font-medium">
                            {record.user?.profile?.firstName} {record.user?.profile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{record.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{record.date}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{record.checkInTime || '—'}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{record.checkOutTime || '—'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'PRESENT'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                              : record.status === 'ABSENT'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                          }`}
                        >
                          {record.status}
                        </span>
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
      {!isLoading && pagination && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total: {pagination.total} records
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
              disabled={skip + pageSize >= pagination.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
