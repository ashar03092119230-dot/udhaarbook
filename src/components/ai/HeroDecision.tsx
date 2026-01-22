import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Loader2, Package, DollarSign, Ban, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ActionButton {
  type: 'add_stock' | 'update_price' | 'stop_udhaar' | 'share_slip';
  label: string;
  icon: React.ReactNode;
  productId?: string;
  customerId?: string;
}

interface HeroDecisionProps {
  onActionTaken?: () => void;
}

export const HeroDecision = ({ onActionTaken }: HeroDecisionProps) => {
  const { t, language } = useTranslation();
  const { products, customers, shopSettings } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<string | null>(null);
  const [actions, setActions] = useState<ActionButton[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchHeroDecision = async () => {
    if (products.length === 0 && customers.length === 0) {
      setDecision(null);
      return;
    }

    setLoading(true);
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
              lastTransactionDate: c.lastTransactionDate,
            })),
            language,
            insightType: 'hero',
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(t('rateLimitError'));
        } else if (response.status === 402) {
          toast.error(t('creditsError'));
        }
        return;
      }

      const data = await response.json();
      setDecision(data.insight);
      
      // Parse suggested actions from AI response
      const suggestedActions: ActionButton[] = [];
      if (data.suggestedAction) {
        if (data.suggestedAction.includes('stock') || data.suggestedAction.includes('maal')) {
          suggestedActions.push({
            type: 'add_stock',
            label: t('addStock'),
            icon: <Package className="h-5 w-5" />,
          });
        }
        if (data.suggestedAction.includes('price') || data.suggestedAction.includes('qeemat')) {
          suggestedActions.push({
            type: 'update_price',
            label: t('updatePrice'),
            icon: <DollarSign className="h-5 w-5" />,
          });
        }
        if (data.suggestedAction.includes('udhaar') || data.suggestedAction.includes('credit')) {
          suggestedActions.push({
            type: 'stop_udhaar',
            label: t('stopUdhaar'),
            icon: <Ban className="h-5 w-5" />,
          });
        }
      }
      
      // Always add share option
      suggestedActions.push({
        type: 'share_slip',
        label: t('shareSlip'),
        icon: <Share2 className="h-5 w-5" />,
      });
      
      setActions(suggestedActions);
    } catch (error) {
      console.error('Hero decision error:', error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    if (!hasLoaded) {
      fetchHeroDecision();
    }
  }, [hasLoaded]);

  const handleAction = (action: ActionButton) => {
    switch (action.type) {
      case 'add_stock':
        navigate('/products/new');
        break;
      case 'update_price':
        navigate('/products');
        break;
      case 'stop_udhaar':
        navigate('/reminders');
        break;
      case 'share_slip':
        if (customers.length > 0) {
          navigate(`/slip/${customers[0].id}`);
        } else {
          navigate('/customers');
        }
        break;
    }
    onActionTaken?.();
  };

  if (products.length === 0 && customers.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-6 text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">{t('addDataForAI')}</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button onClick={() => navigate('/products/new')} className="gap-2">
              <Package className="h-4 w-4" />
              {t('addProduct')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/customers/new')} className="gap-2">
              {t('addCustomer')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20 shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary">{t('todayDecision')}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchHeroDecision}
            disabled={loading}
            className="text-primary hover:bg-primary/10"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Decision Text */}
        {loading && !decision ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : decision ? (
          <>
            <div className="bg-background/80 rounded-xl p-4 mb-4 border border-primary/10">
              <p className="text-lg font-medium text-foreground leading-relaxed">
                {decision}
              </p>
            </div>

            {/* One-Tap Actions */}
            {actions.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    className="h-14 flex items-center justify-center gap-2 text-base"
                    onClick={() => handleAction(action)}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">{t('tapToGetAdvice')}</p>
            <Button onClick={fetchHeroDecision} className="mt-3 gap-2">
              <Sparkles className="h-4 w-4" />
              {t('getAdvice')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
