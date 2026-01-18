import { useStore } from '@/store/useStore';
import { TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatsCards() {
  const { customers, getTodayRecord, getMonthlyStats } = useStore();
  
  const todayRecord = getTodayRecord();
  const now = new Date();
  const monthlyStats = getMonthlyStats(now.getFullYear(), now.getMonth());
  
  const totalCustomers = customers.length;
  const totalPending = customers.reduce((sum, c) => sum + c.balance, 0);
  const overdueCount = customers.filter(c => c.balance > 0).length;

  const stats = [
    {
      label: 'Total Pending',
      labelUrdu: 'کُل بقایا',
      value: totalPending,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Customers',
      labelUrdu: 'گاہک',
      value: totalCustomers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      isCount: true,
    },
    {
      label: "Today's Earnings",
      labelUrdu: 'آج کی کمائی',
      value: todayRecord?.earnings || 0,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Monthly Profit',
      labelUrdu: 'ماہانہ منافع',
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
          key={stat.label}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={cn("inline-flex p-2 rounded-xl mb-3", stat.bgColor)}>
            <stat.icon className={cn("w-5 h-5", stat.color)} />
          </div>
          <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
          <p className="text-xs text-muted-foreground font-urdu mb-1">{stat.labelUrdu}</p>
          <p className={cn("amount-display", stat.color)}>
            {stat.isCount ? (
              stat.value
            ) : (
              <>
                <span className="text-lg">Rs</span> {stat.value.toLocaleString('en-PK')}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
