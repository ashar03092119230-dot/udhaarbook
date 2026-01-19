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
      bgColor: 'bg-warning/10',
    },
    {
      labelKey: 'totalCustomers',
      value: totalCustomers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      isCount: true,
    },
    {
      labelKey: 'todayEarning',
      value: todayRecord?.earnings || 0,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      labelKey: 'monthlyEarnings',
      value: monthlyStats.profit,
      icon: monthlyStats.profit >= 0 ? TrendingUp : TrendingDown,
      color: monthlyStats.profit >= 0 ? 'text-success' : 'text-destructive',
      bgColor: monthlyStats.profit >= 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.labelKey}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={cn("inline-flex p-2 rounded-xl mb-3", stat.bgColor)}>
            <stat.icon className={cn("w-5 h-5", stat.color)} />
          </div>
          <p className="text-sm text-muted-foreground font-medium mb-2">{t(stat.labelKey)}</p>
          <p className={cn("amount-display", stat.color)}>
            {stat.isCount ? (
              <span className="text-2xl font-bold">{stat.value}</span>
            ) : (
              <>
                <span className="text-lg">{t('rs')}</span> {stat.value.toLocaleString('en-PK')}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
