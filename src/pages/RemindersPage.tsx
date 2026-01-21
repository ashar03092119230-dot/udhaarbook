import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, MessageCircle } from 'lucide-react';
import { OverdueReminders } from '@/components/reminders/OverdueReminders';
import { DailyReminderSettings } from '@/components/reminders/DailyReminderSettings';
import { cn } from '@/lib/utils';

type TabType = 'overdue' | 'daily';

const RemindersPage = () => {
  const navigate = useNavigate();
  const { t, rtl } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overdue');

  const tabs = [
    { id: 'overdue' as TabType, label: t('paymentReminders'), icon: MessageCircle },
    { id: 'daily' as TabType, label: t('dailyReminder'), icon: Bell },
  ];

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('reminders')}</h1>
                <p className="text-sm text-muted-foreground">{t('remindersDesc')}</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-secondary rounded-2xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-md mx-auto px-4 py-6">
          {activeTab === 'overdue' ? (
            <OverdueReminders />
          ) : (
            <DailyReminderSettings />
          )}
        </div>
      </div>
    </BottomNav>
  );
};

export default RemindersPage;
