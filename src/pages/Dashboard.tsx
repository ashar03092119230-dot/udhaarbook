import { BottomNav } from '@/components/layout/BottomNav';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentCustomers } from '@/components/dashboard/RecentCustomers';
import { WeeklySalesChart } from '@/components/dashboard/WeeklySalesChart';
import { AISidebar } from '@/components/ai/AISidebar';
import { TokenDisplay } from '@/components/subscription/TokenDisplay';
import { SubscriptionBanner } from '@/components/subscription/SubscriptionBanner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Card } from '@/components/ui/card';
import { Truck, Gift, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { shopSettings, isSubscribed } = useStore();
  const { t, rtl } = useTranslation();
  const isPremium = isSubscribed();

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Enhanced Header with Gradient */}
        <header className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground px-4 py-6 rounded-b-[2rem] shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm opacity-90 font-medium">{t('welcome')} 👋</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="scale-90 origin-right">
                  <TokenDisplay />
                </div>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {shopSettings.shopName || 'Udhaar Khata'}
            </h1>
            <p className="text-sm opacity-75 mt-1">Apni dukaan ka hisaab kitaab</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6 pb-4">
          {/* Subscription Banner (for non-premium users) */}
          {!isPremium && (
            <section className="pt-8">
              <SubscriptionBanner />
            </section>
          )}

          {/* Stats Cards */}
          <section className={isPremium ? 'pt-8' : ''}>
            <StatsCards />
          </section>

          {/* Quick Actions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
              <h2 className="text-lg font-bold">{t('addCustomer').split(' ')[0]} ➕</h2>
            </div>
            <QuickActions />
          </section>

          {/* Weekly Sales Chart */}
          <section>
            <WeeklySalesChart />
          </section>

          {/* Extra Features Row */}
          <section className="grid grid-cols-2 gap-3">
            <Link to="/suppliers">
              <Card className="group p-4 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-card to-card/80">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{t('suppliers')}</h3>
                    <p className="text-xs text-muted-foreground">{t('manageSuppliers')}</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to="/inaam">
              <Card className="group p-4 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent/20 bg-gradient-to-br from-card to-card/80">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Gift className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{t('inaam')}</h3>
                    <p className="text-xs text-muted-foreground">{t('loyaltyRewards')}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </section>

          {/* Recent Customers */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                <h2 className="text-lg font-bold">{t('recentCustomers')}</h2>
              </div>
            </div>
            <RecentCustomers />
          </section>
        </div>

        {/* AI Sidebar Trigger */}
        <AISidebar />
      </div>
    </BottomNav>
  );
};

export default Dashboard;
