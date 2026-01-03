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
  const { user } = useAuthStore()
  const [open, setOpen] = useState(true)

  const items = user?.role === 'ADMIN' ? adminMenuItems : menuItems

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white h-screen fixed left-0 top-0 pt-16">
        <div className="p-6 space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-600 font-semibold'
                    : 'hover:bg-primary-700 text-primary-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full z-30"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setOpen(false)}>
            <div
              className="bg-primary-900 text-white w-64 h-screen pt-20 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-primary-600 font-semibold'
                          : 'hover:bg-primary-700 text-primary-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
