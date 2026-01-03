import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Calendar, FileText, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

interface NavItem {
  name: string
  path: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Attendance', path: '/attendance', icon: Calendar },
  { name: 'Leaves', path: '/leaves', icon: FileText },
  { name: 'Employees', path: '/employees', icon: Users, adminOnly: true },
  { name: 'Settings', path: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAdmin = user?.role === 'admin'

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    return true
  })

  const NavContent = () => (
    <>
      <div className="px-6 py-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white">D</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Dayflow</h2>
            <p className="text-xs text-gray-500">HRMS</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                'px-2 py-1 rounded-lg font-medium',
                isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              )}
            >
              {isAdmin ? 'Admin' : 'Employee'}
            </span>
            <span className="text-gray-500">{user?.department}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className="hidden lg:flex flex-col w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200 h-screen sticky top-0">
        <NavContent />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-2xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
