import { useStore } from '@/store/useStore';
import { TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function StatsCards() {
  const { customers, getTodayRecord, getMonthlyStats } = useStore();
  const { t } = useTranslation();
  
  const todayRecord = getTodayRecord();
  const now = new Date();
  const monthlyStats = getMonthlyStats(now.getFullYear(), now.getMonth());
  
  const totalCustomers = customers.length;
  const totalPending = customers.reduce((sum, c) => sum + c.balance, 0);

  const stats = [
    {
      labelKey: 'totalUdhaar',
      value: totalPending,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/15',
      gradient: 'from-warning/20 via-warning/10 to-transparent',
    },
    {
      labelKey: 'totalCustomers',
      value: totalCustomers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/15',
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      isCount: true,
    },
    {
      labelKey: 'todayEarning',
      value: todayRecord?.earnings || 0,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/15',
      gradient: 'from-success/20 via-success/10 to-transparent',
    },
    {
      labelKey: 'monthlyEarnings',
      value: monthlyStats.profit,
      icon: monthlyStats.profit >= 0 ? TrendingUp : TrendingDown,
      color: monthlyStats.profit >= 0 ? 'text-success' : 'text-destructive',
      bgColor: monthlyStats.profit >= 0 ? 'bg-success/15' : 'bg-destructive/15',
      gradient: monthlyStats.profit >= 0 ? 'from-success/20 via-success/10 to-transparent' : 'from-destructive/20 via-destructive/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.labelKey}
          className={cn(
            "relative overflow-hidden rounded-2xl p-4 transition-all duration-300",
            "bg-card border border-border/50 shadow-sm",
            "hover:shadow-md hover:-translate-y-0.5 hover:border-border",
            "animate-slide-up group"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity",
            stat.gradient
          )} />
          
          <div className="relative">
            <div className={cn("inline-flex p-2.5 rounded-xl mb-3 shadow-sm", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
              {t(stat.labelKey)}
            </p>
            <p className={cn("font-extrabold text-xl md:text-2xl tracking-tight", stat.color)}>
              {stat.isCount ? (
                <span>{stat.value}</span>
              ) : (
                <>
                  <span className="text-base">{t('rs')}</span>{' '}
                  {stat.value.toLocaleString('en-PK')}
                </>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
