import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, User, Phone, MapPin, QrCode, Save, Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Language, languageNames } from '@/lib/i18n/translations';

const SettingsPage = () => {
  const { shopSettings, setShopSettings, language, setLanguage } = useStore();
  const { toast } = useToast();
  const { t, rtl } = useTranslation();

  const [shopName, setShopName] = useState(shopSettings.shopName);
  const [ownerName, setOwnerName] = useState(shopSettings.ownerName);
  const [phone, setPhone] = useState(shopSettings.phone);
  const [address, setAddress] = useState(shopSettings.address);
  const [qrCodeUrl, setQrCodeUrl] = useState(shopSettings.qrCodeUrl || '');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  const handleSave = () => {
    setShopSettings({
      shopName: shopName.trim() || 'My Shop',
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      qrCodeUrl: qrCodeUrl.trim() || undefined,
    });
    setLanguage(selectedLanguage);

    toast({
      title: t('settingsSaved') + ' ✓',
      description: t('saveSettings'),
    });
  };

  const languages: Language[] = ['roman_urdu', 'ur', 'en', 'sindhi', 'pashto'];

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="space-y-3 animate-slide-up">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                {t('language')}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                      selectedLanguage === lang
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold">{languageNames[lang]}</span>
                    {selectedLanguage === lang && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Name */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <Label htmlFor="shopName" className="text-base font-semibold flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                {t('shopName')}
              </Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={t('enterShopName')}
                className="h-14 text-lg rounded-xl"
              />
            </div>

            {/* Owner Name */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Label htmlFor="ownerName" className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {t('ownerName')}
              </Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={t('enterOwnerName')}
                className="h-14 text-lg rounded-xl"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {t('phoneNumber')}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('enterPhone')}
                className="h-14 text-lg rounded-xl"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t('address')}
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('address')}
                className="h-14 text-lg rounded-xl"
              />
            </div>

            {/* QR Code URL */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '250ms' }}>
              <Label htmlFor="qrCode" className="text-base font-semibold flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                {t('qrCode')}
              </Label>
              <Input
                id="qrCode"
                type="url"
                value={qrCodeUrl}
                onChange={(e) => setQrCodeUrl(e.target.value)}
                placeholder="https://..."
                className="h-14 text-lg rounded-xl"
              />
            </div>

            {/* QR Preview */}
            {qrCodeUrl && (
              <div className="bg-secondary rounded-2xl p-4 text-center animate-scale-in">
                <p className="text-sm text-muted-foreground mb-2">{t('qrCode')}</p>
                <img
                  src={qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-32 h-32 mx-auto rounded-lg border border-border object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              size="xl"
              className="w-full mt-8 h-16 text-xl rounded-2xl animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              <Save className="w-6 h-6 mr-2" />
              {t('saveSettings')}
            </Button>
          </div>

          {/* App Info */}
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-sm mb-1">📒 Udhaar Khata v1.0</p>
            <p className="text-xs">Made with ❤️ for Pakistani Shopkeepers</p>
          </div>
        </div>
      </div>
    </BottomNav>
  );
};

export default SettingsPage;
