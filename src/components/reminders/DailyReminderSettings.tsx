import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DailyReminderSettings = () => {
  const { shopSettings, setShopSettings } = useStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [isEnabled, setIsEnabled] = useState(shopSettings.closingReminderEnabled ?? false);
  const [closingTime, setClosingTime] = useState(shopSettings.closingTime ?? '21:00');
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Schedule notification when enabled
  useEffect(() => {
    if (!isEnabled || !permissionGranted) return;

    const checkAndNotify = () => {
      const now = new Date();
      const [hours, minutes] = closingTime.split(':').map(Number);
      
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        showReminderNotification();
      }
    };

    // Check every minute
    const interval = setInterval(checkAndNotify, 60000);
    
    return () => clearInterval(interval);
  }, [isEnabled, closingTime, permissionGranted]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: t('notSupported'),
        description: t('browserNotSupported'),
        variant: 'destructive',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionGranted(permission === 'granted');
    
    if (permission === 'granted') {
      toast({
        title: t('notificationsEnabled') + ' ✓',
        description: t('willRemindYou'),
      });
    } else {
      toast({
        title: t('permissionDenied'),
        description: t('enableInSettings'),
        variant: 'destructive',
      });
    }
  };

  const showReminderNotification = () => {
    if (permissionGranted) {
      new Notification(t('closingTimeReminder'), {
        body: t('dontForgetEarnings'),
        icon: '/favicon.ico',
        tag: 'daily-reminder',
      });
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled && !permissionGranted) {
      await requestPermission();
      if (Notification.permission !== 'granted') return;
    }
    
    setIsEnabled(enabled);
    setShopSettings({
      ...shopSettings,
      closingReminderEnabled: enabled,
      closingTime,
    });
    
    toast({
      title: enabled ? t('reminderEnabled') : t('reminderDisabled'),
      description: enabled ? `${t('willRemindAt')} ${closingTime}` : undefined,
    });
  };

  const handleTimeChange = (time: string) => {
    setClosingTime(time);
    setShopSettings({
      ...shopSettings,
      closingReminderEnabled: isEnabled,
      closingTime: time,
    });
  };

  const testNotification = () => {
    if (permissionGranted) {
      new Notification(t('testNotification'), {
        body: t('notificationsWorking'),
        icon: '/favicon.ico',
      });
      toast({
        title: t('testSent') + ' ✓',
      });
    } else {
      requestPermission();
    }
  };

  const timeOptions = [
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('dailyReminder')}</h3>
              <p className="text-sm text-muted-foreground">{t('remindToAddEarnings')}</p>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>

      {/* Time Selection */}
      {isEnabled && (
        <div className="bg-card rounded-2xl p-4 border border-border animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">{t('closingTime')}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeChange(time)}
                className={`p-3 rounded-xl text-center transition-all ${
                  closingTime === time
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Test Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full mt-4"
            onClick={testNotification}
          >
            <Bell className="w-5 h-5 mr-2" />
            {t('testNotification')}
          </Button>
        </div>
      )}

      {/* Permission Status */}
      {isEnabled && (
        <div className={`flex items-center gap-2 text-sm ${
          permissionGranted ? 'text-success' : 'text-warning'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          {permissionGranted ? t('notificationsEnabled') : t('notificationsDisabled')}
        </div>
      )}
    </div>
  );
};
