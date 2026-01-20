import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, TrendingUp, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { BottomNav } from '@/components/layout/BottomNav';

const AIHelperPage = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { products } = useStore();
  const [loading, setLoading] = useState<'popular' | 'tips' | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightType, setInsightType] = useState<'popular' | 'tips' | null>(null);

  const fetchInsight = async (type: 'popular' | 'tips') => {
    if (products.length === 0) {
      toast.error(t('noProductsForAI'));
      return;
    }

    setLoading(type);
    setInsight(null);
    setInsightType(type);

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
              name: p.name,
              supplier: p.supplier,
              totalSold: p.totalSold,
              quantity: p.quantity,
              price: p.price,
              soldOut: p.soldOut,
            })),
            language,
            insightType: type,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error(t('rateLimitError'));
        } else if (response.status === 402) {
          toast.error(t('creditsError'));
        } else {
          toast.error(errorData.error || t('aiError'));
        }
        return;
      }

      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      console.error('AI insight error:', error);
      toast.error(t('aiError'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary/80"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          <h1 className="text-xl font-bold">{t('aiHelper')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('aiHelperDesc')}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 text-lg border-2 border-primary/30 hover:bg-primary/10"
            onClick={() => fetchInsight('popular')}
            disabled={loading !== null}
          >
            {loading === 'popular' ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <TrendingUp className="h-8 w-8 text-primary" />
            )}
            <span className="font-medium">{t('popularProducts')}</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 text-lg border-2 border-accent/50 hover:bg-accent/10"
            onClick={() => fetchInsight('tips')}
            disabled={loading !== null}
          >
            {loading === 'tips' ? (
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            ) : (
              <Lightbulb className="h-8 w-8 text-accent" />
            )}
            <span className="font-medium">{t('todayTips')}</span>
          </Button>
        </div>

        {/* Insight Result */}
        {insight && (
          <Card className="mt-6 animate-in fade-in-50 duration-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                {insightType === 'popular' ? (
                  <TrendingUp className="h-5 w-5 text-primary" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-accent" />
                )}
                <h3 className="font-semibold">
                  {insightType === 'popular' ? t('popularProducts') : t('todayTips')}
                </h3>
              </div>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {insight}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{t('noProductsForAI')}</p>
              <Button
                variant="link"
                className="mt-2 text-primary"
                onClick={() => navigate('/products/new')}
              >
                {t('addProduct')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default AIHelperPage;
