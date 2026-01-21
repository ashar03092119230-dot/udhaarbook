import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { MessageCircle, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface OverdueCustomer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  lastTransactionDate: Date;
  daysOverdue: number;
}

export const OverdueReminders = () => {
  const { customers, shopSettings } = useStore();
  const { t, rtl } = useTranslation();
  const { toast } = useToast();
  const [sentReminders, setSentReminders] = useState<Set<string>>(new Set());

  // Find customers with overdue balance (no payment in last 7 days)
  const overdueCustomers: OverdueCustomer[] = customers
    .filter((c) => c.balance > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      balance: c.balance,
      lastTransactionDate: new Date(c.lastTransactionDate),
      daysOverdue: differenceInDays(new Date(), new Date(c.lastTransactionDate)),
    }))
    .filter((c) => c.daysOverdue >= 7)
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const generateReminderText = (customer: OverdueCustomer) => {
    const text = `
🔔 *${t('paymentReminder')}*
━━━━━━━━━━━━━━━━

${t('dear')} ${customer.name},

${t('reminderMessage')}

💰 *${t('pendingAmount')}:* Rs ${customer.balance.toLocaleString('en-PK')}
📅 *${t('lastPayment')}:* ${format(customer.lastTransactionDate, 'dd MMM yyyy')}

🏪 *${shopSettings.shopName}*
${shopSettings.phone ? `📞 ${shopSettings.phone}` : ''}

${t('thankYou')}
━━━━━━━━━━━━━━━━
    `.trim();
    return text;
  };

  const handleSendReminder = (customer: OverdueCustomer) => {
    const text = encodeURIComponent(generateReminderText(customer));
    
    if (customer.phone) {
      const cleanPhone = customer.phone.replace(/[\s\-]/g, '');
      const formattedPhone = cleanPhone.startsWith('+')
        ? cleanPhone.slice(1)
        : cleanPhone.startsWith('0')
          ? '92' + cleanPhone.slice(1)
          : '92' + cleanPhone;
      window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
      
      // Mark as sent
      setSentReminders((prev) => new Set([...prev, customer.id]));
      
      toast({
        title: t('reminderSent') + ' ✓',
        description: `${customer.name}`,
      });
    } else {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const handleSendAll = () => {
    if (overdueCustomers.length === 0) return;
    
    // For bulk, we'll just open WhatsApp with the first customer
    // User can manually send to others
    const firstCustomer = overdueCustomers[0];
    handleSendReminder(firstCustomer);
    
    toast({
      title: t('bulkReminderStarted'),
      description: `${overdueCustomers.length} ${t('customersToRemind')}`,
    });
  };

  if (overdueCustomers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-success/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{t('noOverdue')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('allPaymentsOnTime')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Summary Header */}
      <div className="bg-warning/10 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <div>
            <p className="font-semibold text-foreground">
              {overdueCustomers.length} {t('overdueCustomers')}
            </p>
            <p className="text-sm text-muted-foreground">{t('needsReminder')}</p>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={handleSendAll}
          className="bg-[#25D366] hover:bg-[#20BD5A]"
        >
          <Send className="w-4 h-4 mr-1" />
          {t('sendAll')}
        </Button>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {overdueCustomers.map((customer, index) => (
          <div
            key={customer.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl bg-card border animate-slide-up",
              sentReminders.has(customer.id) 
                ? "border-success/50 bg-success/5" 
                : "border-warning/50"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
              customer.daysOverdue > 30 
                ? "bg-destructive/20 text-destructive"
                : "bg-warning/20 text-warning"
            )}>
              {customer.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{customer.name}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-warning font-medium">
                  Rs {customer.balance.toLocaleString('en-PK')}
                </span>
                <span>•</span>
                <span className={cn(
                  customer.daysOverdue > 30 ? "text-destructive" : "text-warning"
                )}>
                  {customer.daysOverdue} {t('daysAgo')}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full",
                sentReminders.has(customer.id)
                  ? "bg-success hover:bg-success/80"
                  : "bg-[#25D366] hover:bg-[#20BD5A]"
              )}
              onClick={() => handleSendReminder(customer)}
            >
              {sentReminders.has(customer.id) ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
