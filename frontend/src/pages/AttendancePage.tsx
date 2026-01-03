import { useState } from 'react'
import { useCheckIn, useCheckOut, useAttendanceRecords } from '@/hooks/useAttendance'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { LogIn, LogOut, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import dayjs from 'dayjs'

export const AttendancePage = () => {
  const { mutate: checkIn, isPending: checkInLoading } = useCheckIn()
  const { mutate: checkOut, isPending: checkOutLoading } = useCheckOut()
  const { data: records, isLoading } = useAttendanceRecords()
  const [currentDate] = useState(new Date())
  const [calendarMonth, setCalendarMonth] = useState(dayjs())

  // Generate calendar days
  const getDaysInMonth = () => {
    const firstDay = calendarMonth.startOf('month')
    const lastDay = calendarMonth.endOf('month')
    const daysInMonth = lastDay.date()
    const startingDayOfWeek = firstDay.day()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(calendarMonth.date(i))
    }
    return days
  }

  const getAttendanceStatus = (date: any) => {
    if (!records?.data) return null
    const record = records.data.find(
      (r) => dayjs(r.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    )
    return record?.status
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-gradient-to-br from-green-500/40 to-green-600/40 border-green-400/50 text-green-100'
      case 'ABSENT':
        return 'bg-gradient-to-br from-red-500/40 to-red-600/40 border-red-400/50 text-red-100'
      case 'HALF':
        return 'bg-gradient-to-br from-yellow-500/40 to-yellow-600/40 border-yellow-400/50 text-yellow-100'
      case 'LATE':
        return 'bg-gradient-to-br from-orange-500/40 to-orange-600/40 border-orange-400/50 text-orange-100'
      default:
        return 'bg-slate-700/30 border-slate-500/30 text-slate-300'
    }
  }

  const days = getDaysInMonth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-2">
            Attendance Tracking
          </h1>
          <p className="text-gray-300">Check in/out and view your attendance records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Check In/Out */}
          <div className="lg:col-span-2 space-y-6">
            {/* Check In/Out Card */}
            <Card className="!bg-gradient-to-br !from-blue-500/20 !to-blue-600/20 !border-blue-400/30">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Clock className="text-blue-300" size={28} />
                  Today's Attendance
                </h2>

                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-2xl p-8 mb-8">
                  <p className="text-blue-200 text-center mb-4 text-sm uppercase tracking-wide font-semibold">
                    {dayjs(currentDate).format('dddd, MMMM D, YYYY')}
                  </p>
                  <p className="text-5xl font-bold text-center bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-8">
                    {dayjs().format('hh:mm A')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => checkIn()}
                      disabled={checkInLoading}
                      className="!bg-gradient-to-r !from-green-500 !to-green-600 flex items-center gap-2 justify-center flex-1 sm:flex-none"
                    >
                      <LogIn size={20} />
                      {checkInLoading ? 'Checking In...' : 'Check In'}
                    </Button>
                    <Button
                      onClick={() => checkOut()}
                      disabled={checkOutLoading}
                      className="!bg-gradient-to-r !from-red-500 !to-red-600 flex items-center gap-2 justify-center flex-1 sm:flex-none"
                    >
                      <LogOut size={20} />
                      {checkOutLoading ? 'Checking Out...' : 'Check Out'}
                    </Button>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                    <p className="text-green-200 text-xs uppercase tracking-wide mb-1">Present</p>
                    <p className="text-2xl font-bold text-green-100">
                      {records?.data?.filter((r) => r.status === 'PRESENT').length || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 text-center">
                    <p className="text-yellow-200 text-xs uppercase tracking-wide mb-1">Half Day</p>
                    <p className="text-2xl font-bold text-yellow-100">
                      {records?.data?.filter((r) => r.status === 'HALF').length || 0}
                    </p>
                  </div>
                  <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-center">
                    <p className="text-red-200 text-xs uppercase tracking-wide mb-1">Absent</p>
                    <p className="text-2xl font-bold text-red-100">
                      {records?.data?.filter((r) => r.status === 'ABSENT').length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Attendance Records Table */}
            <Card className="!bg-gradient-to-br !from-purple-500/20 !to-purple-600/20 !border-purple-400/30">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Calendar className="text-purple-300" size={28} />
                  Recent Records
                </h2>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-purple-300 animate-spin">
                      <Calendar size={32} />
                    </div>
                  </div>
                ) : records?.data && records.data.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {records.data.slice(0, 10).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-102"
                      >
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {dayjs(record.date).format('ddd, MMM DD')}
                          </p>
                          <p className="text-gray-300 text-sm">
                            {record.checkInTime
                              ? `${dayjs(record.checkInTime).format('hh:mm A')} - ${
                                  record.checkOutTime
                                    ? dayjs(record.checkOutTime).format('hh:mm A')
                                    : 'Not checked out'
                                }`
                              : 'No check-in'}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border ${getStatusColor(record.status)}`}
                        >
                          {record.status === 'PRESENT' && <CheckCircle size={16} />}
                          {record.status === 'ABSENT' && <XCircle size={16} />}
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-300 text-center py-12">No attendance records found</p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Calendar */}
          <Card className="!bg-gradient-to-br !from-orange-500/20 !to-orange-600/20 !border-orange-400/30 !h-fit !sticky !top-24">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-orange-300" size={24} />
      </div>
    </div>
  )
}
                            ? `${getStatusColor(status)} border-current`
                            : isToday
                              ? 'bg-blue-500/40 border-blue-400 text-blue-100'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {day?.date()}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2 pt-6 border-t border-white/10">
                <p className="text-xs uppercase text-gray-400 font-semibold mb-3">Legend</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-xs text-gray-300">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-xs text-gray-300">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <span className="text-xs text-gray-300">Half Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500"></div>
                  <span className="text-xs text-gray-300">Late</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
=======
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
>>>>>>> 23e07a23744ef28d70fc82216f1ea6bbdb137e7e
      </div>
    </div>
  )
}
