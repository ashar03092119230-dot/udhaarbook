import { useTranslation } from '@/lib/i18n/useTranslation';
import { Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SUBSCRIPTION_PRICE_PKR } from '@/types';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

interface UpgradePromptProps {
  onClose?: () => void;
}

export const UpgradePrompt = ({ onClose }: UpgradePromptProps) => {
  const { t } = useTranslation();
  const { subscribe } = useStore();

  const handleSubscribe = () => {
    subscribe();
    toast.success(t('subscriptionActivated'));
    onClose?.();
  };

  return (
    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
      <CardContent className="p-6 text-center">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Crown className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-lg font-bold mb-2">{t('tokensFinished')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('upgradeForUnlimited')}
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-2xl font-bold">₨{SUBSCRIPTION_PRICE_PKR}</span>
          <span className="text-muted-foreground">/{t('month')}</span>
        </div>

        <Button 
          onClick={handleSubscribe}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <Crown className="h-4 w-4 mr-2" />
          {t('subscribeNow')}
        </Button>
      </CardContent>
    </Card>
  );
};
