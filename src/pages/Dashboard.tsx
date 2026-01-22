import { BottomNav } from '@/components/layout/BottomNav';
import { HeroDecision } from '@/components/ai/HeroDecision';
import { AIInsightButtons } from '@/components/ai/AIInsightButtons';
import { QuickStatsBar } from '@/components/ai/QuickStatsBar';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Package, Calculator, Bell } from 'lucide-react';

const Dashboard = () => {
  const { shopSettings } = useStore();
  const { t, rtl } = useTranslation();
  const navigate = useNavigate();

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-primary text-primary-foreground px-4 py-5 rounded-b-3xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm opacity-80 mb-1">{t('welcome')} 👋</p>
            <h1 className="text-2xl font-bold">{shopSettings.shopName || 'Udhaar Khata'}</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-4 pb-4">
          {/* Hero AI Decision - Main Focus */}
          <section>
            <HeroDecision />
          </section>

          {/* Quick Stats Bar */}
          <section>
            <QuickStatsBar />
          </section>

          {/* AI Sales Insights */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🤖 {t('aiInsights')}
            </h2>
            <AIInsightButtons />
          </section>

          {/* Quick Navigation */}
          <section className="grid grid-cols-4 gap-2 pt-2">
            <Button
              variant="ghost"
              className="flex flex-col h-16 gap-1 border border-border"
              onClick={() => navigate('/customers')}
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs">{t('customers')}</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col h-16 gap-1 border border-border"
              onClick={() => navigate('/products')}
            >
              <Package className="h-5 w-5 text-primary" />
              <span className="text-xs">{t('products')}</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col h-16 gap-1 border border-border"
              onClick={() => navigate('/calculator')}
            >
              <Calculator className="h-5 w-5 text-primary" />
              <span className="text-xs">{t('calculator')}</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col h-16 gap-1 border border-border"
              onClick={() => navigate('/reminders')}
            >
              <Bell className="h-5 w-5 text-primary" />
              <span className="text-xs">{t('reminders')}</span>
            </Button>
          </section>
        </div>
      </div>
    </BottomNav>
  );
};

export default Dashboard;
