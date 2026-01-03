import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { useAuthStore } from '@/stores/auth'

export const DashboardPage = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm text-gray-500">Overview</p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user ? `Hello, ${user.firstName} ${user.lastName}` : 'Dashboard'}
            </h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">--</p>
              <p className="text-sm text-gray-600">Recent check-ins</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">--</p>
              <p className="text-sm text-gray-600">Requests this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">--</p>
              <p className="text-sm text-gray-600">Next payout</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>Use the sidebar to access attendance, leaves, and profile.</p>
            <p>Data will populate once your API is connected.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
