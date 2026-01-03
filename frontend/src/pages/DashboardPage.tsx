import { useAuthStore } from '@/stores/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import {
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  Calendar,
  User,
} from 'lucide-react'

export const DashboardPage = () => {
  const { user } = useAuthStore()

  const isAdmin = user?.role === 'ADMIN'

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 md:ml-64 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-300">Welcome back, {user?.firstName}! Here's your performance overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Employees Card */}
            <Card hover className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Employees</p>
                  <p className="text-3xl font-bold text-white mt-2">245</p>
                  <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-semibold">
                    <ArrowUpRight size={16} />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users size={32} className="text-white" />
                </div>
              </div>
            </Card>

            {/* Present Today Card */}
            <Card hover className="!bg-gradient-to-br !from-green-500/20 !to-green-600/20 !border-green-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Present Today</p>
                  <p className="text-3xl font-bold text-white mt-2">132</p>
                  <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-semibold">
                    <ArrowUpRight size={16} />
                    <span>98% attendance</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp size={32} className="text-white" />
                </div>
              </div>
            </Card>

            {/* Pending Leaves Card */}
            <Card hover className="!bg-gradient-to-br !from-orange-500/20 !to-orange-600/20 !border-orange-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">Pending Leaves</p>
                  <p className="text-3xl font-bold text-white mt-2">12</p>
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-xs font-semibold">
                    <ArrowDownRight size={16} />
                    <span>-2 from last week</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText size={32} className="text-white" />
                </div>
              </div>
            </Card>

            {/* Attendance Rate Card */}
            <Card hover className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Avg Attendance</p>
                  <p className="text-3xl font-bold text-white mt-2">98%</p>
                  <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-semibold">
                    <ArrowUpRight size={16} />
                    <span>+1.2% vs target</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 size={32} className="text-white" />
                </div>
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
                  <div className="flex justify-between items-center pb-4 border-b border-slate-700 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                    <div>
                      <p className="font-medium text-white">John Doe</p>
                      <p className="text-sm text-slate-400">Annual Leave - 5 days</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold border border-yellow-500/30">
                      Pending
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-700 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                    <div>
                      <p className="font-medium text-white">Sarah Smith</p>
                      <p className="text-sm text-slate-400">Sick Leave - 2 days</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                      Approved
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-300 font-medium mb-2">Processing Status</p>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-400 mt-2 font-semibold">47/47 employees processed</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 md:ml-64 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-slate-300">Here's your complete performance overview for today</p>
        </div>

        {/* Quick Stats Grid - 4x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Attendance Card */}
          <Card hover className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-blue-200 text-sm font-medium">Attendance Rate</p>
                <p className="text-3xl font-bold text-white mt-2">92%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <Calendar size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Leave Balance Card */}
          <Card hover className="!bg-gradient-to-br !from-green-500/20 !to-green-600/20 !border-green-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-green-200 text-sm font-medium">Leave Balance</p>
                <p className="text-3xl font-bold text-white mt-2">12 days</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <FileText size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Monthly Hours Card */}
          <Card hover className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-purple-200 text-sm font-medium">Hours This Month</p>
                <p className="text-3xl font-bold text-white mt-2">160 hrs</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <Clock size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Salary Card */}
          <Card hover className="!bg-gradient-to-br !from-orange-500/20 !to-orange-600/20 !border-orange-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-orange-200 text-sm font-medium">Monthly Salary</p>
                <p className="text-3xl font-bold text-white mt-2">₹75,000</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <DollarSign size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Overtime Card */}
          <Card hover className="!bg-gradient-to-br !from-red-500/20 !to-red-600/20 !border-red-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-red-200 text-sm font-medium">Overtime This Month</p>
                <p className="text-3xl font-bold text-white mt-2">8 hrs</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Tasks Completed Card */}
          <Card hover className="!bg-gradient-to-br !from-cyan-500/20 !to-cyan-600/20 !border-cyan-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-cyan-200 text-sm font-medium">Tasks Completed</p>
                <p className="text-3xl font-bold text-white mt-2">45</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <BarChart3 size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Performance Score Card */}
          <Card hover className="!bg-gradient-to-br !from-pink-500/20 !to-pink-600/20 !border-pink-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-pink-200 text-sm font-medium">Performance</p>
                <p className="text-3xl font-bold text-white mt-2">4.8/5</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
          </Card>

          {/* Pending Requests Card */}
          <Card hover className="!bg-gradient-to-br !from-indigo-500/20 !to-indigo-600/20 !border-indigo-400/30">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Pending Approvals</p>
                <p className="text-3xl font-bold text-white mt-2">3</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg mt-4">
                <FileText size={24} className="text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert 1 */}
          <Card>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Leave Approved</p>
                <p className="text-sm text-slate-300 mt-1">Your leave request for Jan 15-17 has been approved</p>
                <p className="text-xs text-slate-400 mt-2">2 hours ago</p>
              </div>
            </div>
          </Card>

          {/* Alert 2 */}
          <Card>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Attendance Marked</p>
                <p className="text-sm text-slate-300 mt-1">Today's attendance has been successfully marked at 09:15 AM</p>
                <p className="text-xs text-slate-400 mt-2">Today</p>
              </div>
            </div>
          </Card>

          {/* Alert 3 */}
          <Card>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Profile Updated</p>
                <p className="text-sm text-slate-300 mt-1">Your profile has been updated successfully</p>
                <p className="text-xs text-slate-400 mt-2">1 day ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
