import { LoginForm } from '@/components/Auth/LoginForm'
import { Card } from '@/components/UI/Card'

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-4xl font-bold text-white">D</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 via-primary-200 to-blue-200 bg-clip-text text-transparent mb-3">
            Dayflow HRMS
          </h1>
          <p className="text-lg text-slate-300">Employee Management System</p>
        </div>

        {/* Glass Card */}
        <Card hover={false} className="!bg-white/10 !backdrop-blur-2xl !border-white/20 !shadow-2xl">
          <LoginForm />
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-8">
          © 2024 Dayflow HRMS. All rights reserved.
        </p>
      </div>
    </div>
  )
}
