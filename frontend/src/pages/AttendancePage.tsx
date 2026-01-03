import { useState } from 'react'
import { useCheckIn, useCheckOut, useAttendanceRecords } from '@/hooks/useAttendance'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { LogIn, LogOut, Calendar } from 'lucide-react'
import dayjs from 'dayjs'

export const AttendancePage = () => {
  const { mutate: checkIn, isPending: checkInLoading } = useCheckIn()
  const { mutate: checkOut, isPending: checkOutLoading } = useCheckOut()
  const { data: records, isLoading } = useAttendanceRecords()
  const [currentDate] = useState(new Date())

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance</h1>

        {/* Check In/Out Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-6">
              <p className="text-gray-600 text-center mb-2">
                {dayjs(currentDate).format('dddd, MMMM D, YYYY')}
              </p>
              <p className="text-4xl font-bold text-center text-gray-900 mb-8">
                {dayjs().format('hh:mm A')}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => checkIn()}
                  disabled={checkInLoading}
                  className="flex items-center gap-2"
                >
                  <LogIn size={20} />
                  Check In
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => checkOut()}
                  disabled={checkOutLoading}
                  className="flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Check Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={24} />
              Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-600">Loading records...</p>
            ) : records?.data && records.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Check In
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Check Out
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.data.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {dayjs(record.date).format('MMM DD, YYYY')}
                        </td>
                        <td className="py-3 px-4">
                          {record.checkInTime
                            ? dayjs(record.checkInTime).format('hh:mm A')
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {record.checkOutTime
                            ? dayjs(record.checkOutTime).format('hh:mm A')
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              record.status === 'PRESENT'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No attendance records found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
