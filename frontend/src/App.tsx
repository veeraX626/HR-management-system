import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth'
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute'
import { Navbar } from '@/components/UI/Navbar'
import { Sidebar } from '@/components/UI/Sidebar'

// Pages
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EmployeeDashboard } from '@/pages/EmployeeDashboard'
import { ProfilePage } from '@/pages/ProfilePage'
import { AttendancePage } from '@/pages/AttendancePage'
import { LeavesPage } from '@/pages/LeavesPage'
import { PayrollPage } from '@/pages/PayrollPage'

function App() {
  const { hydrate, isAuthenticated } = useAuthStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute>
              <LeavesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <PayrollPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  )
}

export default App
