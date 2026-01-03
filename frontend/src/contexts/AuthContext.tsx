import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, AuthState, LoginCredentials, SignupData } from '../types'
import { mockApi } from '../lib/mockApi'
import toast from 'react-hot-toast'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('dayflow_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        localStorage.removeItem('dayflow_user')
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await mockApi.login(credentials)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      localStorage.setItem('dayflow_user', JSON.stringify(user))

      if (credentials.rememberMe) {
        localStorage.setItem('dayflow_remember', 'true')
      }

      toast.success(`Welcome back, ${user.name}!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      await mockApi.signup(data)
      toast.success('Account created successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    localStorage.removeItem('dayflow_user')
    localStorage.removeItem('dayflow_remember')
    toast.success('Logged out successfully')
  }

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates }
      setAuthState({
        ...authState,
        user: updatedUser,
      })
      localStorage.setItem('dayflow_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
