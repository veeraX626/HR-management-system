import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { useMyLeaves } from '@/hooks/useLeaves'

export const LeavesPage = () => {
  const { data, isLoading, error } = useMyLeaves()
  const leaves = data?.data ?? []

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Leaves</h1>

        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && <p className="text-gray-500">Loading leave requests...</p>}
            {error && <p className="text-red-600">Unable to load leave data.</p>}
            {!isLoading && leaves.length === 0 && !error && (
              <p className="text-gray-500">No leave requests yet.</p>
            )}
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{leave.type}</p>
                    <p className="text-sm text-gray-600">{leave.startDate} → {leave.endDate}</p>
                    <p className="text-sm text-gray-600">Duration: {leave.duration} days</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-700">{leave.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
