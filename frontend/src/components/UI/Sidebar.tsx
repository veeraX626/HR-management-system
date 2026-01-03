import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  DollarSign,
  Users,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: FileText, label: 'Leaves', path: '/leaves' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
]

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: FileText, label: 'Leaves', path: '/leaves' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
]

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(true)

  const items = user?.role === 'ADMIN' ? adminMenuItems : menuItems

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 pt-20 bg-gradient-to-b from-primary-900/90 to-primary-800/90 backdrop-blur-xl border-r border-white/10 text-white">
        <div className="p-6 space-y-1 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
              Dayflow
            </h2>
            <p className="text-xs text-primary-200 mt-1">HR Management System</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 font-semibold shadow-lg scale-105'
                        : 'hover:bg-primary-700/50 text-primary-100 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-red-100 transition-all duration-300 mt-4 border border-red-500/30"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-4 right-4 z-30 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-all duration-300"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-gradient-to-b from-primary-900 to-primary-800 text-white w-72 h-screen fixed bottom-0 left-0 p-6 pt-24 backdrop-blur-xl border-r border-white/10 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
                  Dayflow
                </h2>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1 mb-8">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path)
                        setOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 font-semibold shadow-lg'
                            : 'hover:bg-primary-700/50 text-primary-100 hover:text-white'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-red-100 transition-all duration-300 border border-red-500/30"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
