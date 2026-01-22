import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Users, Package, Wallet } from 'lucide-react';

export const QuickStatsBar = () => {
  const { t } = useTranslation();
  const { customers, products, getTodayRecord } = useStore();
  
  const totalUdhaar = customers.reduce((sum, c) => sum + c.balance, 0);
  const todayRecord = getTodayRecord();
  const todayEarning = todayRecord?.earnings || 0;

  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="flex justify-between bg-background/80 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Wallet className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('totalUdhaar')}</p>
          <p className="font-bold text-primary">₨{formatAmount(totalUdhaar)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="bg-green-500/10 p-2 rounded-lg">
          <Package className="h-4 w-4 text-green-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('todayEarning')}</p>
          <p className="font-bold text-green-500">₨{formatAmount(todayEarning)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="bg-accent/10 p-2 rounded-lg">
          <Users className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('customers')}</p>
          <p className="font-bold text-accent">{customers.length}</p>
        </div>
      </div>
    </div>
  );
};
