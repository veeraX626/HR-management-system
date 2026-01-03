import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { SignupForm } from '@/components/Auth/SignupForm'

export const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
          <p className="text-center text-gray-600 mt-2">Join the workspace and get started</p>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  )
}
