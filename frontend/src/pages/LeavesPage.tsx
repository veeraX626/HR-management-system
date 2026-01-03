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
import { FileText, Plus } from 'lucide-react'

const leaveSchema = z.object({
  type: z.enum(['ANNUAL', 'SICK', 'EMERGENCY', 'UNPAID']),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

type LeaveFormData = z.infer<typeof leaveSchema>

export const LeavesPage = () => {
  const { user } = useAuthStore()
  const { data: myLeaves } = useMyLeaves()
  const { data: allLeaves } = useAllLeaves()
  const { mutate: applyLeave, isPending: applyLoading } = useApplyLeave()
  const { mutate: approveLeave } = useApproveLeave()
  const { mutate: rejectLeave } = useRejectLeave()
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  })

  const onSubmit = (data: LeaveFormData) => {
    applyLeave(data, {
      onSuccess: () => {
        setShowForm(false)
        reset()
      },
    })
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-64">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaves Management</h1>

        {!isAdmin && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Apply for Leave</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                {showForm ? 'Cancel' : 'New Request'}
              </Button>
            </CardHeader>

            {showForm && (
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leave Type
                      </label>
                      <select
                        {...register('type')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ANNUAL">Annual Leave</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="EMERGENCY">Emergency Leave</option>
                        <option value="UNPAID">Unpaid Leave</option>
                      </select>
                    </div>

                    <div>
                      <Input
                        label="Start Date"
                        type="date"
                        {...register('startDate')}
                        error={errors.startDate?.message}
                      />
                    </div>

                    <Input
                      label="End Date"
                      type="date"
                      {...register('endDate')}
                      error={errors.endDate?.message}
                    />

                    <div>
                      <Input
                        label="Reason"
                        placeholder="Reason for leave"
                        {...register('reason')}
                        error={errors.reason?.message}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={applyLoading}>
                    {applyLoading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        )}

        {/* My Leaves / All Leaves */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={24} />
              {isAdmin ? 'All Leave Requests' : 'My Leave Requests'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAdmin && allLeaves?.data && allLeaves.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Employee</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Dates</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLeaves.data.map((leave) => (
                      <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">Employee {leave.userId.slice(0, 8)}</td>
                        <td className="py-3 px-4">{leave.type}</td>
                        <td className="py-3 px-4">
                          {dayjs(leave.startDate).format('MMM DD')} -{' '}
                          {dayjs(leave.endDate).format('MMM DD')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              leave.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : leave.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {leave.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => approveLeave({ leaveId: leave.id })}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => rejectLeave({ leaveId: leave.id })}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : myLeaves?.data && myLeaves.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Dates</th>
                      <th className="text-left py-3 px-4 font-semibold">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeaves.data.map((leave) => (
                      <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{leave.type}</td>
                        <td className="py-3 px-4">
                          {dayjs(leave.startDate).format('MMM DD, YYYY')} -{' '}
                          {dayjs(leave.endDate).format('MMM DD, YYYY')}
                        </td>
                        <td className="py-3 px-4">{leave.duration} days</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              leave.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : leave.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No leave requests found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
