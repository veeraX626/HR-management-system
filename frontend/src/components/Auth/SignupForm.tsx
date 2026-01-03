import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSignup } from '@/hooks/useAuth'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email'),
    yearOfJoining: z.number().int().min(2000).max(new Date().getFullYear()),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export const SignupForm = () => {
  const navigate = useNavigate()
  const { mutate: signup, isPending } = useSignup()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch('password')
  const passwordValidation = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const onSubmit = (data: SignupFormData) => {
    signup(
      { ...data, role: 'EMPLOYEE' },
      {
        onSuccess: () => {
          navigate('/dashboard')
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full p-8">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          {...register('firstName')}
          error={errors.firstName?.message}
          className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
        />
        <Input
          placeholder="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
          className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
        />
      </div>

      {/* Email */}
      <Input
        type="email"
        placeholder="Corporate Email"
        {...register('email')}
        error={errors.email?.message}
        className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg"
      />

      {/* Year of Joining */}
      <div className="relative">
        <select
          {...register('yearOfJoining', { valueAsNumber: true })}
          defaultValue={new Date().getFullYear()}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all outline-none"
        >
          <option value="" disabled>
            Year of Joining
          </option>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year} className="bg-slate-900">
              {year}
            </option>
          ))}
        </select>
        {errors.yearOfJoining && (
          <p className="mt-1 text-xs text-red-400">{errors.yearOfJoining.message}</p>
        )}
      </div>

      {/* Employee ID Info */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/30">
        <p className="text-xs text-blue-300 uppercase tracking-wide font-semibold mb-1">
          Employee ID Auto-Generated
        </p>
        <p className="text-xs text-blue-200">
          Format: OI + Initials + Year + Serial (e.g., OIJOD20260001)
        </p>
      </div>

      {/* Password */}
      <div className="relative">
        <div className="flex gap-2 items-center">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message}
            className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg !pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Requirements */}
        {password && (
          <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold mb-2">
              Password Requirements:
            </p>
            <div className="space-y-1">
              <div
                className={`flex items-center gap-2 text-xs ${
                  passwordValidation.length ? 'text-green-300' : 'text-gray-400'
                }`}
              >
                {passwordValidation.length ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                At least 8 characters
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  passwordValidation.uppercase ? 'text-green-300' : 'text-gray-400'
                }`}
              >
                {passwordValidation.uppercase ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                One uppercase letter
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  passwordValidation.number ? 'text-green-300' : 'text-gray-400'
                }`}
              >
                {passwordValidation.number ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                One number
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <div className="flex gap-2 items-center">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            className="!bg-white/5 !border-white/10 !text-white !placeholder-white/40 focus:!border-primary-400 !rounded-lg !pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 text-sm text-gray-300">
        <input type="checkbox" className="mt-1" required />
        <span>
          I agree to the{' '}
          <Link to="/terms" className="text-primary-300 hover:text-primary-200">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary-300 hover:text-primary-200">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full !bg-gradient-to-r !from-primary-600 !to-primary-700 !hover:from-primary-700 !hover:to-primary-800 py-3 text-base font-semibold"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-300 hover:text-primary-200 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
