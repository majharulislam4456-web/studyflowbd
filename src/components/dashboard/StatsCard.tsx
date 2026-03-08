import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  titleBn?: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({ 
  title, 
  titleBn,
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className,
  iconClassName
}: StatsCardProps) {
  return (
    <div className={cn(
      "glass-card p-5 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 group animate-fade-in-up",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {title}
            {titleBn && <span className="font-bengali ml-1 opacity-70">({titleBn})</span>}
          </p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-primary/10 text-primary transition-smooth group-hover:scale-110",
          iconClassName
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
