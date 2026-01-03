<<<<<<< HEAD
import { useMyLeaves, useAllLeaves, useApplyLeave, useApproveLeave, useRejectLeave } from '@/hooks/useLeaves'
import { useAuthStore } from '@/stores/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'
import { FileText, Plus, Check, X, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react'

const leaveSchema = z.object({
  type: z.enum(['ANNUAL', 'SICK', 'EMERGENCY', 'UNPAID']),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

type LeaveFormData = z.infer<typeof leaveSchema>
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { useMyLeaves } from '@/hooks/useLeaves'
>>>>>>> 23e07a23744ef28d70fc82216f1ea6bbdb137e7e

export const LeavesPage = () => {
  const { data, isLoading, error } = useMyLeaves()
  const leaves = data?.data ?? []

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-2">
            Leave Management
          </h1>
          <p className="text-gray-300">
            {isAdmin
              ? 'Review and approve employee leave requests'
              : 'Manage your leave requests and view history'}
          </p>
        </div>

        {!isAdmin && (
          <>
            {/* Apply Leave Card */}
            <Card
              className={`!bg-gradient-to-br !from-green-500/20 !to-green-600/20 !border-green-400/30 mb-8 transition-all duration-300 ${
                showForm ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Calendar className="text-green-300" size={28} />
                    Apply for Leave
                  </h2>
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    className="!bg-gradient-to-r !from-green-500 !to-green-600 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'New Request'}
                  </Button>
                </div>

                {showForm && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-green-200 mb-3 uppercase tracking-wide">
                          Leave Type
                        </label>
                        <select
                          {...register('type')}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder-white/30"
                        >
                          <option className="bg-slate-900" value="ANNUAL">
                            Annual Leave
                          </option>
                          <option className="bg-slate-900" value="SICK">
                            Sick Leave
                          </option>
                          <option className="bg-slate-900" value="EMERGENCY">
                            Emergency Leave
                          </option>
                          <option className="bg-slate-900" value="UNPAID">
                            Unpaid Leave
                          </option>
                        </select>
                      </div>

                      <Input
                        label="Start Date"
                        type="date"
                        {...register('startDate')}
                        error={errors.startDate?.message}
                        className="!bg-white/5 !border-white/10 !text-white focus:!border-green-400 !rounded-lg"
                      />

                      <Input
                        label="End Date"
                        type="date"
                        {...register('endDate')}
                        error={errors.endDate?.message}
                        className="!bg-white/5 !border-white/10 !text-white focus:!border-green-400 !rounded-lg"
                      />

                      <Input
                        label="Reason"
                        placeholder="Describe the reason for your leave request..."
                        {...register('reason')}
                        error={errors.reason?.message}
                        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-green-400 !rounded-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={applyLoading}
                      className="w-full sm:w-auto !bg-gradient-to-r !from-green-500 !to-green-600"
                    >
                      {applyLoading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </form>
                )}
              </div>
            </Card>

            {/* My Leaves */}
            <Card className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FileText className="text-blue-300" size={28} />
                  My Leave Requests
                </h2>

                {myLeaves?.data && myLeaves.data.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {myLeaves.data.map((leave) => (
                      <div
                        key={leave.id}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-102"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-blue-200 text-sm uppercase font-semibold tracking-wide mb-1">
                              {leave.type}
                            </p>
                            <p className="text-white font-semibold mb-2">
                              {dayjs(leave.startDate).format('MMM DD')} → {dayjs(leave.endDate).format('MMM DD, YYYY')}
                            </p>
                            <p className="text-gray-300 text-sm">{leave.duration} days</p>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border whitespace-nowrap ${
                              leave.status === 'APPROVED'
                                ? 'bg-green-500/30 border-green-400 text-green-100'
                                : leave.status === 'REJECTED'
                                  ? 'bg-red-500/30 border-red-400 text-red-100'
                                  : 'bg-yellow-500/30 border-yellow-400 text-yellow-100'
                            }`}
                          >
                            {leave.status === 'APPROVED' && <CheckCircle size={16} />}
                            {leave.status === 'PENDING' && <Clock size={16} />}
                            {leave.status === 'REJECTED' && <X size={16} />}
                            {leave.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-blue-300 mb-3 opacity-50" size={48} />
                    <p className="text-blue-200">No leave requests yet</p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {/* Admin: All Leave Requests */}
        {isAdmin && (
          <Card className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <AlertCircle className="text-purple-300" size={28} />
                Pending Leave Requests
              </h2>

              {allLeaves?.data && allLeaves.data.length > 0 ? (
                <div className="space-y-4 max-h-screen overflow-y-auto">
                  {allLeaves.data.map((leave) => (
                    <div
                      key={leave.id}
                      className="p-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-102"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">
                            Employee ID
                          </p>
                          <p className="text-white font-bold">
                            {leave.userId?.slice(0, 8) || 'Unknown'}
                          </p>
                        </div>

                        <div>
                          <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">
                            Type
                          </p>
                          <p className="text-white font-bold">{leave.type}</p>
                        </div>

                        <div>
                          <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">
                            Duration
                          </p>
                          <p className="text-white font-bold">
                            {dayjs(leave.startDate).format('MMM DD')} →{' '}
                            {dayjs(leave.endDate).format('MMM DD')} ({leave.duration} days)
                          </p>
                        </div>

                        <div>
                          <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">
                            Status
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                              leave.status === 'APPROVED'
                                ? 'bg-green-500/30 text-green-100'
                                : leave.status === 'REJECTED'
                                  ? 'bg-red-500/30 text-red-100'
                                  : 'bg-yellow-500/30 text-yellow-100'
                            }`}
                          >
                            {leave.status === 'APPROVED' && <CheckCircle size={14} />}
                            {leave.status === 'PENDING' && <Clock size={14} />}
                            {leave.status === 'REJECTED' && <X size={14} />}
                            {leave.status}
                          </span>
                        </div>

                        {leave.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveLeave({ leaveId: leave.id })}
                              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <Check size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectLeave({ leaveId: leave.id })}
                              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <X size={16} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-purple-300 mb-3 opacity-50" size={48} />
                  <p className="text-purple-200">All leave requests have been processed!</p>
                </div>
              )}
            </div>
          </Card>
        )}
=======
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
>>>>>>> 23e07a23744ef28d70fc82216f1ea6bbdb137e7e
      </div>
    </div>
  )
}
