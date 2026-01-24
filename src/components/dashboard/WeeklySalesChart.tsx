import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { TrendingUp, TrendingDown } from 'lucide-react';

const getDateString = (date: Date) => date.toISOString().split('T')[0];

export const WeeklySalesChart = () => {
  const { dailyRecords } = useStore();
  const { t, language } = useTranslation();

  const chartData = useMemo(() => {
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getDateString(date);
      
      const record = dailyRecords.find(r => getDateString(new Date(r.date)) === dateStr);
      
      // Format day name based on language
      const dayName = date.toLocaleDateString(
        language === 'en' ? 'en-US' : 'ur-PK', 
        { weekday: 'short' }
      );

      last7Days.push({
        day: dayName,
        date: dateStr,
        earnings: record?.earnings || 0,
        expenses: record?.totalExpenses || 0,
        profit: record?.netProfit || 0,
      });
    }

    return last7Days;
  }, [dailyRecords, language]);

  const totalWeekEarnings = chartData.reduce((sum, d) => sum + d.earnings, 0);
  const totalWeekProfit = chartData.reduce((sum, d) => sum + d.profit, 0);
  
  // Calculate trend (compare last 3 days vs first 4 days)
  const recentAvg = chartData.slice(-3).reduce((sum, d) => sum + d.earnings, 0) / 3;
  const earlierAvg = chartData.slice(0, 4).reduce((sum, d) => sum + d.earnings, 0) / 4;
  const trend = earlierAvg > 0 ? ((recentAvg - earlierAvg) / earlierAvg) * 100 : 0;
  const isPositiveTrend = trend >= 0;

  const chartConfig = {
    earnings: {
      label: t('todayEarnings'),
      color: 'hsl(var(--primary))',
    },
    profit: {
      label: t('netProfit'),
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{t('weeklyReport')}</CardTitle>
          <div className="flex items-center gap-1 text-sm">
            {isPositiveTrend ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={isPositiveTrend ? 'text-primary' : 'text-destructive'}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{t('totalEarnings')}: Rs. {totalWeekEarnings.toLocaleString()}</span>
          <span>{t('netProfit')}: Rs. {totalWeekProfit.toLocaleString()}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />} 
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
