import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { useAttendanceRecords } from '@/hooks/useAttendance'

export const AttendancePage = () => {
  const { data, isLoading, error } = useAttendanceRecords()
  const records = data?.data ?? []

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>

        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && <p className="text-gray-500">Loading attendance...</p>}
            {error && <p className="text-red-600">Unable to load attendance.</p>}
            {!isLoading && records.length === 0 && !error && (
              <p className="text-gray-500">No records yet.</p>
            )}
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{record.date}</p>
                    <p className="text-sm text-gray-600">Status: {record.status}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>Check-in: {record.checkInTime || '—'}</p>
                    <p>Check-out: {record.checkOutTime || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
