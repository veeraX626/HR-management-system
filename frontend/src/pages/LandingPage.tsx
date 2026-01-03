import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import toast from 'react-hot-toast'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shake, setShake] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (email && !email.includes('@')) newErrors.email = 'Invalid email'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Login failed')

      // Extract token and user from response: {success: true, data: {token, user: {...}}}
      const { token, user } = data.data
      login(token, user)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl"
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-center space-y-6 lg:space-y-8"
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 w-fit"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Dayflow</span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-3">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
                >
                  Every workday, perfectly{' '}
                  <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-white bg-clip-text text-transparent">
                    aligned
                  </span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-blue-100 max-w-lg"
                >
                  Streamline HR operations with real-time attendance tracking, leave management, and payroll insights. All in one beautiful dashboard.
                </motion.p>
              </div>

              {/* Features */}
              <motion.div variants={itemVariants} className="space-y-3 pt-4">
                {[
                  '⚡ Real-time attendance tracking',
                  '📅 Smart leave management',
                  '💼 One-click payroll',
                  '📊 Analytics dashboard',
                ].map((feature, i) => (
                  <motion.p
                    key={i}
                    whileHover={{ x: 10 }}
                    className="text-blue-50 flex items-center space-x-3 text-sm"
                  >
                    <span>{feature}</span>
                  </motion.p>
                ))}
              </motion.div>

              {/* Support Text */}
              <motion.div
                variants={itemVariants}
                className="pt-4 border-t border-blue-400/20"
              >
                <p className="text-sm text-blue-200">
                  HR/Admin signup?{' '}
                  <a href="#" className="text-blue-300 hover:text-blue-200 font-semibold">
                    Contact IT
                  </a>
                </p>
              </motion.div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              variants={itemVariants}
              className="flex items-center"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className={`w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 ${
                  shake ? 'animate-pulse' : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                    <p className="text-blue-100">Sign in to your account</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email */}
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <label className="block text-sm font-medium text-blue-50 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (errors.email) setErrors({ ...errors, email: '' })
                          }}
                          placeholder="admin@dayflow.com"
                          className={`w-full pl-12 pr-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-blue-200/50 focus:outline-none transition ${
                            errors.email
                              ? 'border-red-400/50 focus:border-red-400 focus:bg-red-500/10'
                              : 'border-blue-400/30 focus:border-blue-300 focus:bg-white/20'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-300 text-sm mt-2"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password */}
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <label className="block text-sm font-medium text-blue-50 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (errors.password) setErrors({ ...errors, password: '' })
                          }}
                          placeholder="••••••••"
                          className={`w-full pl-12 pr-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-blue-200/50 focus:outline-none transition ${
                            errors.password
                              ? 'border-red-400/50 focus:border-red-400 focus:bg-red-500/10'
                              : 'border-blue-400/30 focus:border-blue-300 focus:bg-white/20'
                          }`}
                        />
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-300 text-sm mt-2"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center space-x-2"
                      >
                        <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                      </motion.div>
                    </motion.button>
                  </form>

                  <div className="text-center text-sm text-blue-200">
                    Demo: <span className="text-blue-100 font-mono">admin@dayflow.com</span> / <span className="text-blue-100 font-mono">Admin123</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30" />
    </div>
  )
}
