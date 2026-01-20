import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Share2, FileDown, QrCode, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useRef } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const SlipPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomer, getCustomerEntries, shopSettings } = useStore();
  const { toast } = useToast();
  const { t, rtl } = useTranslation();
  const slipRef = useRef<HTMLDivElement>(null);

  const customer = id ? getCustomer(id) : undefined;
  const entries = id ? getCustomerEntries(id) : [];

  // Get today's entries
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(
    (e) => new Date(e.date).toISOString().split('T')[0] === today && e.type === 'udhaar'
  );
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.amount, 0);

  if (!customer) {
    return (
      <BottomNav>
        <div className="page-container flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Customer not found</p>
            <Button onClick={() => navigate('/customers')} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </BottomNav>
    );
  }

  const generateWhatsAppText = () => {
    const text = `
📋 *اُدھار پرچی / Udhaar Slip*
━━━━━━━━━━━━━━━━

🏪 *${shopSettings.shopName}*
📅 ${format(new Date(), 'dd MMMM yyyy')}

👤 *Customer:* ${customer.name}
📱 ${customer.phone || 'N/A'}

💰 *Today's Udhaar:* Rs ${todayTotal.toLocaleString('en-PK')}
📊 *Total Pending:* Rs ${customer.balance.toLocaleString('en-PK')}

━━━━━━━━━━━━━━━━
شکریہ! Thank you!
    `.trim();
    return text;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(generateWhatsAppText());
    toast({
      title: `${t('slip')} ✓`,
      description: t('shareWhatsApp'),
    });
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateWhatsAppText());
    // If customer has phone number, open WhatsApp with that number
    if (customer?.phone) {
      // Clean phone number - remove spaces, dashes
      const cleanPhone = customer.phone.replace(/[\s\-]/g, '');
      // Pakistani numbers - add country code if needed
      const formattedPhone = cleanPhone.startsWith('+') 
        ? cleanPhone.slice(1) 
        : cleanPhone.startsWith('0') 
          ? '92' + cleanPhone.slice(1) 
          : '92' + cleanPhone;
      window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
    } else {
      // Open WhatsApp with just the text (user selects contact)
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('slip'),
          text: generateWhatsAppText(),
        });
      } catch (error) {
        handleCopyWhatsApp();
      }
    } else {
      handleCopyWhatsApp();
    }
  };

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('slip')}</h1>
              <p className="text-sm text-muted-foreground font-urdu">اُدھار پرچی</p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          {/* Slip Card */}
          <div
            ref={slipRef}
            className="bg-card rounded-3xl p-6 shadow-lg border border-border animate-scale-in"
          >
            {/* Shop Header */}
            <div className="text-center border-b border-dashed border-border pb-4 mb-4">
              <h2 className="text-2xl font-bold text-primary font-urdu">
                {shopSettings.shopName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(), 'dd MMMM yyyy')}
              </p>
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Customer / گاہک</p>
              <p className="text-xl font-bold text-foreground">{customer.name}</p>
              {customer.phone && (
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              )}
            </div>

            {/* Amounts */}
            <div className="space-y-3 border-t border-dashed border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Today's Udhaar / آج کا اُدھار</span>
                <span className="font-bold text-lg text-accent">
                  Rs {todayTotal.toLocaleString('en-PK')}
                </span>
              </div>
              <div className="flex justify-between items-center bg-warning/10 -mx-6 px-6 py-3">
                <span className="font-semibold text-foreground">Total Pending / کُل بقایا</span>
                <span className="font-bold text-2xl text-warning">
                  Rs {customer.balance.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            {shopSettings.qrCodeUrl ? (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Scan to Pay / ادائیگی کے لیے</p>
                <img
                  src={shopSettings.qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-32 h-32 mx-auto rounded-lg border border-border"
                />
              </div>
            ) : (
              <div className="mt-6 text-center">
                <div className="bg-secondary/50 rounded-xl p-4 inline-flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Add QR code in settings
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center border-t border-dashed border-border pt-4">
              <p className="text-sm text-muted-foreground">شکریہ! Thank you!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Primary WhatsApp Button - BIG */}
            <Button
              size="xl"
              className="w-full h-16 text-lg gap-3 bg-[#25D366] hover:bg-[#20BD5A]"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="w-7 h-7" />
              {t('shareWhatsApp')}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" onClick={handleCopyWhatsApp}>
                <Copy className="w-5 h-5 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BottomNav>
  );
};

export default SlipPage;
