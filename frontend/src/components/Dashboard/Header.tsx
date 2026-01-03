import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { motion } from 'framer-motion'

export const Header = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
    : 'U'

  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/30 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo for desktop */}
        <div className="hidden md:block">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Dayflow HRMS
          </h2>
        </div>

        {/* Right Side: User Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.firstName || 'User'}
            </p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30"
          >
            {initials}
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}
