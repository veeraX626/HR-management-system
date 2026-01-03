import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { Menu, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">Dayflow HRMS</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.firstName}</span>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Profile"
            >
              <User size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                navigate('/profile')
                setMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
