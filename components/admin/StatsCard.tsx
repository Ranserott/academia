interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon?: string
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  )
}
