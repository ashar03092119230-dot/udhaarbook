import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus, Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { validatePhoneNumber } from '@/hooks/useAuth';

const NewCustomerPage = () => {
  const navigate = useNavigate();
  const { addCustomer, customers } = useStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);

  const validatePhone = (value: string) => {
    setPhone(value);
    setPhoneError('');
    setPhoneValid(false);

    if (!value.trim()) {
      return;
    }

    const validation = validatePhoneNumber(value);
    
    if (!validation.valid) {
      setPhoneError(t(validation.error || 'invalidPhone'));
      return;
    }

    // Check for duplicates
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    const duplicate = customers.find(c => {
      const existingClean = c.phone.replace(/[\s\-\(\)]/g, '');
      return existingClean === cleanPhone || 
             existingClean.endsWith(cleanPhone.slice(-10)) ||
             cleanPhone.endsWith(existingClean.slice(-10));
    });

    if (duplicate) {
      setPhoneError(`${t('duplicatePhone')}: ${duplicate.name}`);
      return;
    }

    setPhoneValid(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: t('nameRequired'),
        description: t('enterCustomerName'),
        variant: 'destructive',
      });
      return;
    }

    // Validate phone if provided
    if (phone.trim()) {
      const validation = validatePhoneNumber(phone);
      if (!validation.valid) {
        toast({
          title: t('invalidPhone'),
          description: t(validation.error || 'checkNumber'),
          variant: 'destructive',
        });
        return;
      }
    }

    const balance = parseFloat(initialBalance) || 0;

    addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      totalDue: balance,
      totalPaid: 0,
      balance: balance,
    });

    toast({
      title: `${t('customerAdded')} ✓`,
      description: `${name} ${t('addedSuccessfully')}`,
    });

    navigate('/customers');
  };

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('newCustomer')}</h1>
              <p className="text-sm text-muted-foreground font-urdu">نیا گاہک</p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {t('customerName')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterCustomerName')}
                className="input-lg"
                autoFocus
              />
            </div>

            {/* Phone with validation */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {t('phoneNumber')}
                <span className="text-muted-foreground font-normal text-sm">({t('optional')})</span>
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => validatePhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className={`input-lg pr-12 ${phoneError ? 'border-destructive' : ''} ${phoneValid ? 'border-green-500' : ''}`}
                />
                {phone && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {phoneError && <AlertCircle className="w-5 h-5 text-destructive" />}
                    {phoneValid && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                )}
              </div>
              {phoneError && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {phoneError}
                </p>
              )}
              {phoneValid && (
                <p className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {t('phoneValid')}
                </p>
              )}
            </div>

            {/* Initial Balance */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Label htmlFor="balance" className="text-base font-semibold flex items-center gap-2">
                💰 {t('openingBalance')}
                <span className="text-muted-foreground font-normal text-sm">({t('optional')})</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  {t('rs')}
                </span>
                <Input
                  id="balance"
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0"
                  className="input-lg pl-12 text-xl font-bold"
                  min="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('existingBalance')}
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="xl" 
              className="w-full mt-8 animate-slide-up"
              style={{ animationDelay: '150ms' }}
              disabled={!!phoneError}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {t('addCustomer')}
            </Button>
          </form>
        </div>
      </div>
    </BottomNav>
  );
};

export default NewCustomerPage;
