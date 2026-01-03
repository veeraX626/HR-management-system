import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { LogOut, User, Settings, Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary-600 to-primary-700 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <span className="text-xl font-bold text-white">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dayflow</h1>
              <p className="text-xs text-primary-100">HRMS</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Notifications */}
            <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-400 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-900" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold">{user?.firstName}</p>
                  <p className="text-xs text-primary-100 capitalize">{user?.role}</p>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    >
                      <User size={18} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <User size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
