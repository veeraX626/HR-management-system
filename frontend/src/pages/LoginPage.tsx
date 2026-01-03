import { LoginForm } from '@/components/Auth/LoginForm'
import { Card } from '@/components/UI/Card'

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dayflow HRMS</h1>
          <p className="text-primary-100">Sign in to your account</p>
        </div>

        <Card>
          <LoginForm />
        </Card>

        <p className="text-center text-sm text-primary-100 mt-6">
          © 2024 Dayflow HRMS. All rights reserved.
        </p>
      </div>
    </div>
  )
}
