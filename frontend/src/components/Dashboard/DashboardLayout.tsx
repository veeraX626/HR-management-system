import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="md:ml-64">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="p-4 md:p-8 pb-20">
          {children}
        </main>
      </div>
    </div>
  )
}
