import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, LogOut, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const isAdmin = user?.role === 'ADMIN'

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', admin: false },
    { label: 'Profile', icon: Settings, path: '/profile', admin: false },
    { label: 'Attendance', icon: Calendar, path: '/attendance', admin: false },
    { label: 'Leaves', icon: FileText, path: '/leaves', admin: false },
    { label: 'Payroll', icon: DollarSign, path: '/payroll', admin: false },
    { label: 'Admin', icon: Users, path: '/admin', admin: true },
  ]

  const filteredMenu = isAdmin
    ? menuItems
    : menuItems.filter(item => !item.admin)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-6 left-6 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed md:relative left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 flex flex-col z-40 md:translate-x-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50 flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center"
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Dayflow</h1>
            <p className="text-xs text-blue-200">{isAdmin ? 'Admin' : 'Employee'}</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {filteredMenu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition relative ${
                  isActive
                    ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute right-0 w-1 h-6 bg-gradient-to-b from-blue-300 to-blue-500 rounded-l"
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
