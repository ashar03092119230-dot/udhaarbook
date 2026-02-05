 import { useState } from 'react';
 import { Flame, Snail, AlertTriangle, Lightbulb, Loader2, Package, DollarSign, Ban, Share2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { useTranslation } from '@/lib/i18n/useTranslation';
 import { useStore } from '@/store/useStore';
 import { useSubscription } from '@/hooks/useSubscription';
 import { useNavigate } from 'react-router-dom';
 import { toast } from 'sonner';
 import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
 
 type InsightType = 'popular' | 'slow' | 'loss' | 'tips';
 
 interface InsightResult {
   type: InsightType;
   text: string;
   suggestedAction?: string;
 }
 
 export const AIInsightButtons = () => {
   const { t, language } = useTranslation();
   const { products, customers, consumeToken, getTokensRemaining } = useStore();
   const { subscribed } = useSubscription();
   const navigate = useNavigate();
   const [loading, setLoading] = useState<InsightType | null>(null);
   const [result, setResult] = useState<InsightResult | null>(null);
   const [showUpgrade, setShowUpgrade] = useState(false);
 
   const fetchInsight = async (type: InsightType) => {
     if (products.length === 0) {
       toast.error(t('noProductsForAI'));
       return;
     }
 
     // Check if user can use AI (has tokens or is subscribed via Stripe)
     if (!subscribed && getTokensRemaining() <= 0) {
       setShowUpgrade(true);
       return;
     }
 
     // Consume a token for free users only
     if (!subscribed) {
       const canProceed = consumeToken();
       if (!canProceed) {
         setShowUpgrade(true);
         return;
       }
     }
 
     setLoading(type);
     setResult(null);
     setShowUpgrade(false);
 
     try {
       const response = await fetch(
         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-insights`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
           },
           body: JSON.stringify({
             products: products.map((p) => ({
               id: p.id,
               name: p.name,
               supplier: p.supplier,
               totalSold: p.totalSold,
               quantity: p.quantity,
               price: p.price,
               soldOut: p.soldOut,
             })),
             customers: customers.map((c) => ({
               id: c.id,
               name: c.name,
               balance: c.balance,
             })),
             language,
             insightType: type,
           }),
         }
       );
 
       if (!response.ok) {
         if (response.status === 429) {
           toast.error(t('rateLimitError'));
         } else if (response.status === 402) {
           toast.error(t('creditsError'));
         } else {
           toast.error(t('aiError'));
         }
         return;
       }
 
       const data = await response.json();
       setResult({
         type,
         text: data.insight,
         suggestedAction: data.suggestedAction,
       });
     } catch (error) {
       console.error('AI insight error:', error);
       toast.error(t('aiError'));
     } finally {
       setLoading(null);
     }
   };
 
   const getButtonConfig = (type: InsightType) => {
     switch (type) {
       case 'popular':
         return {
           icon: <Flame className="h-6 w-6" />,
           label: t('fastSelling'),
           color: 'text-orange-500',
           bgColor: 'bg-orange-500/10 border-orange-500/30',
           hoverColor: 'hover:bg-orange-500/20',
         };
       case 'slow':
         return {
           icon: <Snail className="h-6 w-6" />,
           label: t('slowSelling'),
           color: 'text-blue-500',
           bgColor: 'bg-blue-500/10 border-blue-500/30',
           hoverColor: 'hover:bg-blue-500/20',
         };
       case 'loss':
         return {
           icon: <AlertTriangle className="h-6 w-6" />,
           label: t('lossReason'),
           color: 'text-red-500',
           bgColor: 'bg-red-500/10 border-red-500/30',
           hoverColor: 'hover:bg-red-500/20',
         };
       case 'tips':
         return {
           icon: <Lightbulb className="h-6 w-6" />,
           label: t('marketingTips'),
           color: 'text-yellow-500',
           bgColor: 'bg-yellow-500/10 border-yellow-500/30',
           hoverColor: 'hover:bg-yellow-500/20',
         };
     }
   };
 
   const getResultIcon = () => {
     if (!result) return null;
     const config = getButtonConfig(result.type);
     return <span className={config.color}>{config.icon}</span>;
   };
 
   const handleQuickAction = (actionType: string) => {
     switch (actionType) {
       case 'add_stock':
         navigate('/products/new');
         break;
       case 'update_price':
         navigate('/products');
         break;
       case 'stop_udhaar':
         navigate('/reminders');
         break;
       case 'share':
         if (customers.length > 0) {
           navigate(`/slip/${customers[0].id}`);
         }
         break;
     }
   };
 
   const insightTypes: InsightType[] = ['popular', 'slow', 'loss', 'tips'];
 
   // Show upgrade prompt if tokens are finished
   if (showUpgrade) {
     return (
       <div className="space-y-4">
         <UpgradePrompt onClose={() => setShowUpgrade(false)} />
         <Button
           variant="ghost"
           className="w-full"
           onClick={() => setShowUpgrade(false)}
         >
           {t('back')}
         </Button>
       </div>
     );
   }
 
   return (
     <div className="space-y-4">
       <div className="grid grid-cols-2 gap-3">
         {insightTypes.map((type) => {
           const config = getButtonConfig(type);
           return (
             <Button
               key={type}
               variant="outline"
               className={`h-16 flex flex-col items-center justify-center gap-1 ${config.bgColor} ${config.hoverColor} border-2 transition-all`}
               onClick={() => fetchInsight(type)}
               disabled={loading !== null}
             >
               {loading === type ? (
                 <Loader2 className={`h-6 w-6 animate-spin ${config.color}`} />
               ) : (
                 <span className={config.color}>{config.icon}</span>
               )}
               <span className="text-sm font-medium">{config.label}</span>
             </Button>
           );
         })}
       </div>
 
       {result && (
         <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
           <CardContent className="p-4">
             <div className="flex items-start gap-3 mb-3">
               {getResultIcon()}
               <h3 className="font-semibold">{getButtonConfig(result.type).label}</h3>
             </div>
             <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-4">
               {result.text}
             </p>
 
             <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
               <Button
                 variant="ghost"
                 size="sm"
                 className="flex flex-col h-14 gap-1"
                 onClick={() => handleQuickAction('add_stock')}
               >
                 <Package className="h-5 w-5 text-primary" />
                 <span className="text-xs">{t('addStock')}</span>
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 className="flex flex-col h-14 gap-1"
                 onClick={() => handleQuickAction('update_price')}
               >
                 <DollarSign className="h-5 w-5 text-green-500" />
                 <span className="text-xs">{t('updatePrice')}</span>
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 className="flex flex-col h-14 gap-1"
                 onClick={() => handleQuickAction('stop_udhaar')}
               >
                 <Ban className="h-5 w-5 text-red-500" />
                 <span className="text-xs">{t('stopUdhaar')}</span>
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 className="flex flex-col h-14 gap-1"
                 onClick={() => handleQuickAction('share')}
               >
                 <Share2 className="h-5 w-5 text-blue-500" />
                 <span className="text-xs">{t('shareSlip')}</span>
               </Button>
             </div>
           </CardContent>
         </Card>
       )}
     </div>
   );
 };