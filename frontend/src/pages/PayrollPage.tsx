import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'

export const PayrollPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Payroll</h1>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>Payroll data will appear here once connected to your backend.</p>
            <p>Use this page to show payout history, upcoming pay cycles, and slips.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
