 import { useState } from 'react';
 import { Sparkles, Crown } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
 import { AIInsightButtons } from './AIInsightButtons';
 import { TokenDisplay } from '@/components/subscription/TokenDisplay';
 import { SubscriptionBanner } from '@/components/subscription/SubscriptionBanner';
 import { useTranslation } from '@/lib/i18n/useTranslation';
 import { useSubscription } from '@/hooks/useSubscription';
 import { Badge } from '@/components/ui/badge';
 
 export const AISidebar = () => {
   const { t, rtl } = useTranslation();
   const { subscribed: isPremium } = useSubscription();
   const [open, setOpen] = useState(false);
 
   return (
     <Sheet open={open} onOpenChange={setOpen}>
       <SheetTrigger asChild>
         <Button
           className={`fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg ${
             isPremium 
               ? 'bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
               : 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
           }`}
           size="icon"
         >
           {isPremium ? (
             <Crown className="h-6 w-6 text-white" />
           ) : (
             <Sparkles className="h-6 w-6" />
           )}
         </Button>
       </SheetTrigger>
       <SheetContent 
         side={rtl ? "left" : "right"} 
         className="w-full sm:w-[400px] overflow-y-auto"
       >
         <SheetHeader className="pb-4">
           <SheetTitle className="flex items-center gap-2 text-xl">
             <div className={`p-2 rounded-full ${
               isPremium ? 'bg-amber-500/20' : 'bg-primary/20'
             }`}>
               {isPremium ? (
                 <Crown className="h-5 w-5 text-amber-500" />
               ) : (
                 <Sparkles className="h-5 w-5 text-primary" />
               )}
             </div>
             {t('aiHelper')}
             {isPremium && (
               <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs ml-2">
                 PRO
               </Badge>
             )}
           </SheetTitle>
         </SheetHeader>
 
         <div className="space-y-6 pb-8">
           <section>
             <TokenDisplay />
           </section>
 
           {!isPremium && (
             <section>
               <SubscriptionBanner />
             </section>
           )}
 
           <section>
             <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
               🤖 {t('aiInsights')}
             </h3>
             <AIInsightButtons />
           </section>
         </div>
       </SheetContent>
     </Sheet>
   );
 };
