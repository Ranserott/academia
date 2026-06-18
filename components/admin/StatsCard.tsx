import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export const StatsCard = ({ title, value, change, trend, icon: Icon }: StatsCardProps) => {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all group relative overflow-hidden">
      {/* Background Icon Decoration */}
      <Icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
          trend === 'up' ? 'bg-green-500/10 text-green-500' : 
          trend === 'down' ? 'bg-red-500/10 text-red-500' : 
          'bg-slate-500/10 text-slate-500'
        }`}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {trend === 'neutral' && <Minus className="w-3 h-3" />}
          {change}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
      </div>
    </div>
  );
};
