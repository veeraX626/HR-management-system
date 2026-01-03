import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types'

interface RoleGuardProps {
  children: ReactNode
  requiredRoles: UserRole[]
}

export const RoleGuard = ({ children, requiredRoles }: RoleGuardProps) => {
  const { user } = useAuthStore()

  if (!user || !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
