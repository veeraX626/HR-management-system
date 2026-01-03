export const Card = ({
  children,
  className = '',
  hover = true,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) => (
  <div
    className={`
      bg-white/80 dark:bg-slate-900/80 
      backdrop-blur-xl 
      rounded-2xl 
      border border-white/20 
      shadow-lg hover:shadow-2xl
      p-6
      transition-all duration-300
      ${hover ? 'hover:scale-105 hover:bg-white/90 dark:hover:bg-slate-900/90' : ''}
      ${className}
    `}
  >
    {children}
  </div>
)

export const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-6 pb-4 border-b border-gray-200 dark:border-slate-700 ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent ${className}`}>{children}</h3>
)

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)
