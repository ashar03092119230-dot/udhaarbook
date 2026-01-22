import { BottomNav } from '@/components/layout/BottomNav';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentCustomers } from '@/components/dashboard/RecentCustomers';
import { AISidebar } from '@/components/ai/AISidebar';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

const Dashboard = () => {
  const { shopSettings } = useStore();
  const { t, rtl } = useTranslation();

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

        <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6 pb-4">
          {/* Stats Cards */}
          <section>
            <StatsCards />
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold mb-3">{t('addCustomer').split(' ')[0]} ➕</h2>
            <QuickActions />
          </section>

          {/* Recent Customers */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{t('recentCustomers')}</h2>
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
