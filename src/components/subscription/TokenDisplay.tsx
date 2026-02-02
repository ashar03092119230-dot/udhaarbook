import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Coins, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

export const TokenDisplay = () => {
  const { t } = useTranslation();
  const { tokenState, refreshTokensIfNeeded, isSubscribed } = useStore();
  
  useEffect(() => {
    refreshTokensIfNeeded();
  }, [refreshTokensIfNeeded]);

  const isPremium = isSubscribed();
  const tokensLeft = tokenState.tokensRemaining;
  const maxTokens = tokenState.maxDailyTokens;

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-3 py-2 rounded-xl border border-amber-500/30">
        <Crown className="h-5 w-5 text-amber-500" />
        <span className="font-semibold text-amber-600 dark:text-amber-400 text-sm">
          {t('premiumMember')}
        </span>
        <Badge className="bg-amber-500 text-white text-xs">
          {t('unlimited')}
        </Badge>
      </div>
    );
  }

  const tokenPercentage = (tokensLeft / maxTokens) * 100;
  const isLow = tokensLeft <= 3;
  const isEmpty = tokensLeft === 0;

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
      isEmpty 
        ? 'bg-destructive/10 border-destructive/30' 
        : isLow 
          ? 'bg-orange-500/10 border-orange-500/30'
          : 'bg-primary/10 border-primary/30'
    }`}>
      <div className="relative">
        <Coins className={`h-5 w-5 ${
          isEmpty ? 'text-destructive' : isLow ? 'text-orange-500' : 'text-primary'
        }`} />
        {isEmpty && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{t('tokensToday')}</span>
          <span className={`font-bold text-sm ${
            isEmpty ? 'text-destructive' : isLow ? 'text-orange-500' : 'text-primary'
          }`}>
            {tokensLeft}/{maxTokens}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isEmpty ? 'bg-destructive' : isLow ? 'bg-orange-500' : 'bg-primary'
            }`}
            style={{ width: `${tokenPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
