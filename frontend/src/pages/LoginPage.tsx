import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { LoginForm } from '@/components/Auth/LoginForm'

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <p className="text-center text-gray-600 mt-2">Sign in to access your workspace</p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
