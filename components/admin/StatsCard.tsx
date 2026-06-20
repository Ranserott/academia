import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number | string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
}

export function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
  const getTrendColor = () => {
    if (!trend || trend === "neutral") return "text-gray-500";
    return trend === "up" ? "text-green-500" : "text-red-500";
  };

  const getTrendPrefix = () => {
    if (!trend || trend === "neutral" || typeof change === "string") return "";
    return (change ?? 0) >= 0 ? "+" : "";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${getTrendColor()}`}>
              {getTrendPrefix()}{change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
