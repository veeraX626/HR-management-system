import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout'
import { Clock, Calendar, DollarSign, LogOut, Activity } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import toast from 'react-hot-toast'

export const EmployeeDashboard = () => {
  const { user, logout } = useAuthStore()
  const [time, setTime] = useState<string>('')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString()
    setIsCheckedIn(true)
    setCheckInTime(now)
    toast.success('Checked in successfully!')
  }

  const handleCheckOut = () => {
    setIsCheckedIn(false)
    toast.success('Checked out successfully!')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -8, transition: { duration: 0.3 } },
  }

  const stats = [
    {
      title: 'Leave Balance',
      value: '12',
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Attendance',
      value: '92%',
      icon: Activity,
      gradient: 'from-green-500 to-emerald-500',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Salary',
      value: '$4,500',
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={cardVariants} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90 blur-xl" />
          <div className="relative backdrop-blur-xl bg-gradient-to-r from-blue-600/80 to-blue-800/80 border border-blue-400/30 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
                <p className="text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Clock In/Out Card - Larger */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="lg:col-span-1 group cursor-pointer"
          >
            <div className="relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 h-full flex flex-col items-center justify-center space-y-6">
                {/* Animated Clock Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                  />
                </motion.div>

                {/* Time Display */}
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-bold text-white mb-2 font-mono"
                  >
                    {time}
                  </motion.div>
                  <p className="text-blue-100 text-sm">Current time</p>
                </div>

                {/* Check In/Out Status */}
                <div className="text-center">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`text-sm font-semibold px-4 py-2 rounded-full ${
                      isCheckedIn
                        ? 'bg-green-500/30 text-green-200 border border-green-400/50'
                        : 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                    }`}
                  >
                    {isCheckedIn ? `Checked in at ${checkInTime}` : 'Not checked in'}
                  </motion.div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckIn}
                    disabled={isCheckedIn}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      isCheckedIn
                        ? 'bg-gray-400/20 text-gray-300 cursor-not-allowed'
                        : 'bg-green-500/80 hover:bg-green-500 text-white shadow-lg shadow-green-500/30'
                    }`}
                  >
                    Check In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckOut}
                    disabled={!isCheckedIn}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      !isCheckedIn
                        ? 'bg-gray-400/20 text-gray-300 cursor-not-allowed'
                        : 'bg-red-500/80 hover:bg-red-500 text-white shadow-lg shadow-red-500/30'
                    }`}
                  >
                    Check Out
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={cardVariants} className="lg:col-span-2 grid md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={idx}
                  whileHover="hover"
                  variants={cardVariants}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-300"
                    />
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                          className="text-2xl"
                        >
                          ✨
                        </motion.div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                      <motion.p
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                        className="text-3xl font-bold text-white"
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={cardVariants} className="col-span-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {[
                { time: 'Today 10:30 AM', action: 'Checked in', icon: '✓', color: 'green' },
                { time: 'Today 2:00 PM', action: 'Leave approved', icon: '✓', color: 'blue' },
                { time: 'Yesterday 5:30 PM', action: 'Checked out', icon: '✓', color: 'gray' },
              ].map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      className={`w-10 h-10 rounded-full bg-${activity.color}-500/20 flex items-center justify-center`}
                    >
                      <span className={`text-${activity.color}-400`}>{activity.icon}</span>
                    </motion.div>
                    <div>
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
