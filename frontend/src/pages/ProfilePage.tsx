import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { useAuthStore } from '@/stores/auth'

export const ProfilePage = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            {user ? (
              <>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{user.employeeId || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No profile data available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
