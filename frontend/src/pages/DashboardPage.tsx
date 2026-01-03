import { useAuthStore } from '@/stores/auth'
import { useAttendanceStats } from '@/hooks/useAttendance'
import { useProfile } from '@/hooks/useProfile'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import {
  BarChart3,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react'

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const { data: stats, isLoading: statsLoading } = useAttendanceStats()
  const { data: profile } = useProfile()

  const isAdmin = user?.role === 'ADMIN'

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">145</p>
                </div>
                <Users size={32} className="text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Present Today</p>
                  <p className="text-3xl font-bold text-gray-900">132</p>
                </div>
                <TrendingUp size={32} className="text-green-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Leaves</p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                </div>
                <FileText size={32} className="text-orange-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Attendance Rate</p>
                  <p className="text-3xl font-bold text-gray-900">91%</p>
                </div>
                <BarChart3 size={32} className="text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-600">Annual Leave</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Database</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">API Response Time</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Employee Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.firstName}! 👋</h1>
        <p className="text-gray-600 mb-8">Here's your dashboard summary</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Attendance Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Leaves Remaining</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-bold">160 hrs</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Employee ID</p>
                <p className="text-lg font-semibold">{user?.employeeId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Department</p>
                <p className="text-lg font-semibold">{profile?.department || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Job Title</p>
                <p className="text-lg font-semibold">{profile?.jobTitle || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
