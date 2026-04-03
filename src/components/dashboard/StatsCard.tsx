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
      "stat-card group animate-fade-in-up",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
            {titleBn && <span className="font-bengali ml-1 opacity-70 normal-case">({titleBn})</span>}
          </p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-2xl bg-primary/8 text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
          iconClassName
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
