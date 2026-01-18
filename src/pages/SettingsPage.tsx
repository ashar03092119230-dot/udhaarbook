import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, User, Phone, MapPin, QrCode, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { shopSettings, setShopSettings } = useStore();
  const { toast } = useToast();

  const [shopName, setShopName] = useState(shopSettings.shopName);
  const [ownerName, setOwnerName] = useState(shopSettings.ownerName);
  const [phone, setPhone] = useState(shopSettings.phone);
  const [address, setAddress] = useState(shopSettings.address);
  const [qrCodeUrl, setQrCodeUrl] = useState(shopSettings.qrCodeUrl || '');

  const handleSave = () => {
    setShopSettings({
      shopName: shopName.trim() || 'میری دکان',
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      qrCodeUrl: qrCodeUrl.trim() || undefined,
    });

    toast({
      title: 'Settings Saved! ✓',
      description: 'Your shop settings have been updated',
    });
  };

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground font-urdu">دکان کی ترتیبات</p>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Shop Name */}
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="shopName" className="text-base font-semibold flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                Shop Name
                <span className="text-muted-foreground font-normal font-urdu text-sm">دکان کا نام</span>
              </Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Your shop name..."
                className="input-lg"
              />
            </div>

            {/* Owner Name */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <Label htmlFor="ownerName" className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Owner Name
                <span className="text-muted-foreground font-normal font-urdu text-sm">مالک کا نام</span>
              </Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Your name..."
                className="input-lg"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number
                <span className="text-muted-foreground font-normal font-urdu text-sm">فون نمبر</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="input-lg"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Shop Address
                <span className="text-muted-foreground font-normal font-urdu text-sm">پتہ</span>
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your shop address..."
                className="input-lg"
              />
            </div>

            {/* QR Code URL */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Label htmlFor="qrCode" className="text-base font-semibold flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                Payment QR Code URL
                <span className="text-muted-foreground font-normal font-urdu text-sm">ادائیگی QR</span>
              </Label>
              <Input
                id="qrCode"
                type="url"
                value={qrCodeUrl}
                onChange={(e) => setQrCodeUrl(e.target.value)}
                placeholder="https://..."
                className="input-lg"
              />
              <p className="text-xs text-muted-foreground">
                Upload your JazzCash/EasyPaisa QR code image and paste the URL here
              </p>
            </div>

            {/* QR Preview */}
            {qrCodeUrl && (
              <div className="bg-secondary rounded-2xl p-4 text-center animate-scale-in">
                <p className="text-sm text-muted-foreground mb-2">QR Code Preview</p>
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
              className="w-full mt-8 animate-slide-up"
              style={{ animationDelay: '250ms' }}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
              <span className="font-urdu ml-2">محفوظ کریں</span>
            </Button>
          </div>

          {/* App Info */}
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-sm font-urdu mb-1">اُدھار کھاتہ</p>
            <p className="text-xs">Udhaar Khata v1.0</p>
            <p className="text-xs mt-1">Made with ❤️ for Pakistani Shopkeepers</p>
          </div>
        </div>
      </div>
    </BottomNav>
  );
};

export default SettingsPage;
