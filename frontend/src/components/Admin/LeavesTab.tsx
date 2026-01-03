import { useState } from 'react'
import { useAdminLeaves, useApproveLeave } from '@/hooks/useAdmin'
import { Card, CardContent } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { CheckCircle2, XCircle } from 'lucide-react'

export const LeavesTab = () => {
  const [pageSize, setPageSize] = useState(50)
  const [skip, setSkip] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [remarksId, setRemarksId] = useState<string | null>(null)
  const [remarks, setRemarks] = useState('')

  const { data, isLoading, refetch } = useAdminLeaves(statusFilter || undefined, skip, pageSize)
  const { mutate: approveLeave, isPending } = useApproveLeave()

  const leaves = data?.data ?? []
  const pagination = data?.pagination

  const handleApprove = (leaveId: string) => {
    approveLeave(
      { id: leaveId, action: 'APPROVED', remarks: remarks || undefined },
      {
        onSuccess: () => {
          setRemarks('')
          setRemarksId(null)
          refetch()
        },
      }
    )
  }

  const handleReject = (leaveId: string) => {
    approveLeave(
      { id: leaveId, action: 'REJECTED', remarks: remarks || undefined },
      {
        onSuccess: () => {
          setRemarks('')
          setRemarksId(null)
          refetch()
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setSkip(0)
              }}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
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
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
              Loading leave requests...
            </CardContent>
          </Card>
        ) : leaves.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
              No leave requests found
            </CardContent>
          </Card>
        ) : (
          leaves.map((leave) => (
            <Card key={leave.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {leave.user?.profile?.firstName} {leave.user?.profile?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{leave.user?.email}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          leave.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : leave.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">{leave.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">From</p>
                        <p className="font-medium text-gray-900 dark:text-white">{leave.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">To</p>
                        <p className="font-medium text-gray-900 dark:text-white">{leave.endDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">{leave.duration} days</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-600 dark:text-gray-400">Reason</p>
                      <p className="text-gray-900 dark:text-white">{leave.reason}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {leave.status === 'PENDING' && (
                    <div className="flex flex-col gap-3 md:w-48">
                      {remarksId === leave.id ? (
                        <>
                          <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add remarks (optional)..."
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(leave.id)}
                              disabled={isPending}
                            >
                              <CheckCircle2 size={16} />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 gap-2 bg-red-600 hover:bg-red-700"
                              onClick={() => handleReject(leave.id)}
                              disabled={isPending}
                            >
                              <XCircle size={16} />
                              Reject
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRemarksId(null)
                              setRemarks('')
                            }}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => setRemarksId(leave.id)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && pagination && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total: {pagination.total} requests
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
