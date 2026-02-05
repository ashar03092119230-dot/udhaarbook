 import { useTranslation } from '@/lib/i18n/useTranslation';
 import { useSubscription } from '@/hooks/useSubscription';
 import { useStore } from '@/store/useStore';
 import { Crown, Sparkles, Check, Zap, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { SUBSCRIPTION_PRICE_PKR } from '@/types';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
 import { useState } from 'react';
 import { toast } from 'sonner';
 
 export const SubscriptionBanner = () => {
   const { t } = useTranslation();
   const { subscribed, isLoading: isCheckingSubscription, startCheckout } = useSubscription();
   const { tokenState } = useStore();
   const [showDialog, setShowDialog] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
 
   const isTokensLow = tokenState.tokensRemaining <= 3;
 
   const handleSubscribe = async () => {
     try {
       setIsProcessing(true);
       await startCheckout();
       setShowDialog(false);
       toast.info(t('redirectingToPayment'));
     } catch (error) {
       console.error('Checkout error:', error);
       toast.error(t('paymentError'));
     } finally {
       setIsProcessing(false);
     }
   };
 
   if (isCheckingSubscription) {
     return null;
   }
 
   if (subscribed) {
     return null;
   }
 
   const benefits = [
     { icon: <Sparkles className="h-4 w-4" />, text: t('unlimitedAI') },
     { icon: <Zap className="h-4 w-4" />, text: t('unlimitedSuppliers') },
     { icon: <Check className="h-4 w-4" />, text: t('fullReports') },
     { icon: <Crown className="h-4 w-4" />, text: t('loyaltyFeatures') },
   ];
 
   return (
     <Dialog open={showDialog} onOpenChange={setShowDialog}>
       <DialogTrigger asChild>
         <Card className={`cursor-pointer transition-all hover:shadow-md ${
           isTokensLow 
             ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30 animate-pulse' 
             : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30'
         }`}>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl shadow-lg">
                   <Crown className="h-5 w-5 text-white" />
                 </div>
                 <div>
                   <p className="font-bold text-sm">{t('upgradeToPremium')}</p>
                   <p className="text-xs text-muted-foreground">
                     {isTokensLow ? t('tokensRunningLow') : t('unlockAllFeatures')}
                   </p>
                 </div>
               </div>
               <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                 ₨{SUBSCRIPTION_PRICE_PKR}/{t('month')}
               </Button>
             </div>
           </CardContent>
         </Card>
       </DialogTrigger>
 
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2 text-xl">
             <Crown className="h-6 w-6 text-amber-500" />
             {t('premiumSubscription')}
           </DialogTitle>
         </DialogHeader>
 
         <div className="space-y-6 py-4">
           <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center">
             <p className="text-sm opacity-80">{t('monthlyPlan')}</p>
             <p className="text-4xl font-bold mt-1">₨{SUBSCRIPTION_PRICE_PKR}</p>
             <p className="text-sm opacity-80 mt-1">/{t('month')}</p>
           </div>
 
           <div className="space-y-3">
             <p className="font-semibold">{t('premiumBenefits')}:</p>
             {benefits.map((benefit, i) => (
               <div key={i} className="flex items-center gap-3 text-sm">
                 <div className="bg-green-500/20 p-1.5 rounded-lg text-green-500">
                   {benefit.icon}
                 </div>
                 <span>{benefit.text}</span>
               </div>
             ))}
           </div>
 
           <Button 
             onClick={handleSubscribe}
             disabled={isProcessing}
             className="w-full h-12 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
           >
             {isProcessing ? (
               <Loader2 className="h-5 w-5 mr-2 animate-spin" />
             ) : (
               <Crown className="h-5 w-5 mr-2" />
             )}
             {isProcessing ? t('processing') : t('subscribeNow')}
           </Button>
 
           <p className="text-xs text-center text-muted-foreground">
             {t('subscriptionNote')}
           </p>
         </div>
       </DialogContent>
     </Dialog>
   );
 };
