import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSignup } from '@/hooks/useAuth'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'

const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email'),
    employeeId: z.string().min(3, 'Employee ID is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          placeholder="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        type="email"
        placeholder="Email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        placeholder="Employee ID"
        {...register('employeeId')}
        error={errors.employeeId?.message}
      />

      <Input
        type="password"
        placeholder="Password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        type="password"
        placeholder="Confirm Password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? 'Creating account...' : 'Sign Up'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
