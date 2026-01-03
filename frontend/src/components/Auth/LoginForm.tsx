import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    console.log('🔐 [LOGIN] Attempting login with:', data.email);
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          console.log('✅ [LOGIN] Success, redirecting to dashboard');
          navigate('/dashboard')
        },
        onError: (err) => {
          console.error('❌ [LOGIN] Failed:', err);
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur">
          <p className="text-red-200 text-sm font-medium">
            ❌ {error instanceof Error ? error.message : 'Login failed. Please try again.'}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
        <Input
          type="email"
          placeholder="admin@dayflow-hrms.com"
          {...register('email')}
          error={errors.email?.message}
          className="!bg-white/10 !border-white/20 !text-white !placeholder-slate-400"
        />
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
            className="!bg-white/10 !border-white/20 !text-white !placeholder-slate-400 !pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-300 hover:text-slate-200 cursor-pointer transition-colors">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-600 cursor-pointer"
          />
          <span>Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-primary-300 hover:text-primary-200 transition-colors font-medium">
          Forgot Password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        disabled={isPending}
        isLoading={isPending}
        className="!bg-gradient-to-r !from-primary-600 !to-primary-700 !hover:from-primary-700 !hover:to-primary-800 !shadow-lg !hover:shadow-xl text-lg py-3"
      >
        Sign In
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-slate-300">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-300 hover:text-primary-200 font-semibold transition-colors">
          Create one
        </Link>
      </p>

      {/* Demo Credentials */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 mb-2 font-medium">Demo Credentials:</p>
        <div className="space-y-1 text-xs text-slate-400">
          <p>👤 Admin: <span className="text-slate-300">admin@dayflow-hrms.com</span> / <span className="text-slate-300">Admin@123456</span></p>
          <p>👤 Employee: <span className="text-slate-300">employee1@dayflow-hrms.com</span> / <span className="text-slate-300">Employee@123456</span></p>
        </div>
      </div>
    </form>
  )
}
