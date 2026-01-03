import { SignupForm } from '@/components/Auth/SignupForm'
import { Card } from '@/components/UI/Card'

export const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 mx-auto shadow-lg">
            <span className="text-3xl font-bold text-white">D</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-2">
            Dayflow HRMS
          </h1>
          <p className="text-gray-300 text-lg">Create your account to get started</p>
        </div>

        {/* Signup Card */}
        <Card className="!bg-gradient-to-br !from-white/10 !to-white/5 !backdrop-blur-xl !border-white/20 shadow-2xl">
          <SignupForm />
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2024 <span className="font-semibold text-primary-300">Dayflow HRMS</span>. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
              Privacy
            </button>
            <span className="text-gray-600">•</span>
            <button className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
              Terms
            </button>
            <span className="text-gray-600">•</span>
            <button className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
