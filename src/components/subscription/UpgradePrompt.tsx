 import { useTranslation } from '@/lib/i18n/useTranslation';
 import { Crown, Sparkles, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { SUBSCRIPTION_PRICE_PKR } from '@/types';
 import { useSubscription } from '@/hooks/useSubscription';
 import { toast } from 'sonner';
 import { useState } from 'react';
 
 interface UpgradePromptProps {
   onClose?: () => void;
 }
 
 export const UpgradePrompt = ({ onClose }: UpgradePromptProps) => {
   const { t } = useTranslation();
   const { startCheckout } = useSubscription();
   const [isLoading, setIsLoading] = useState(false);
 
   const handleSubscribe = async () => {
     try {
       setIsLoading(true);
       await startCheckout();
       toast.info(t('redirectingToPayment'));
       onClose?.();
     } catch (error) {
       console.error('Checkout error:', error);
       toast.error(t('paymentError'));
     } finally {
       setIsLoading(false);
     }
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
           disabled={isLoading}
           className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
         >
           {isLoading ? (
             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
           ) : (
             <Crown className="h-4 w-4 mr-2" />
           )}
           {isLoading ? t('processing') : t('subscribeNow')}
         </Button>
       </CardContent>
     </Card>
   );
 };
