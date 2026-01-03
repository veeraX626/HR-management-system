import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    console.log('🔐 [LOGIN] Attempting login with:', data.email);
    login(data, {
      onSuccess: () => {
        console.log('✅ [LOGIN] Success, redirecting to dashboard');
        navigate('/dashboard')
      },
      onError: (err) => {
        console.error('❌ [LOGIN] Failed:', err);
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            Error: {error instanceof Error ? error.message : 'Login failed'}
          </p>
        </div>
      )}

      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
