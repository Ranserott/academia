'use client'

interface ProgressBarProps {
  progress: number // 0-100
  className?: string
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
