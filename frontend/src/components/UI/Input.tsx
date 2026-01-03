import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            bg-white dark:bg-slate-900 
            border border-gray-300 dark:border-slate-600
            rounded-xl
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
            transition-all duration-300
            disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:opacity-50
            hover:border-gray-400 dark:hover:border-slate-500
            ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium mt-2 flex items-center gap-1">
            <span className="inline-block">⚠️</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
