import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Language, languageNames } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, User, Phone, Globe, ChevronRight, Check } from 'lucide-react';

type Step = 'shopName' | 'ownerName' | 'phone' | 'language';

const OnboardingFlow = () => {
  const { shopSettings, setShopSettings, setLanguage, setOnboardingCompleted, language } = useStore();
  const { t } = useTranslation();
  
  const [step, setStep] = useState<Step>('shopName');
  const [shopName, setShopName] = useState(shopSettings.shopName);
  const [ownerName, setOwnerName] = useState(shopSettings.ownerName);
  const [phone, setPhone] = useState(shopSettings.phone);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  const handleNext = () => {
    if (step === 'shopName' && shopName.trim()) {
      setStep('ownerName');
    } else if (step === 'ownerName') {
      setStep('phone');
    } else if (step === 'phone') {
      setStep('language');
    }
  };

  const handleFinish = () => {
    setShopSettings({
      ...shopSettings,
      shopName: shopName.trim() || 'My Shop',
      ownerName: ownerName.trim(),
      phone: phone.trim(),
    });
    setLanguage(selectedLanguage);
    setOnboardingCompleted(true);
  };

  const languages: Language[] = ['roman_urdu', 'ur', 'en', 'sindhi', 'pashto'];

  const getStepNumber = () => {
    const steps: Step[] = ['shopName', 'ownerName', 'phone', 'language'];
    return steps.indexOf(step) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">
      {/* Progress Indicator */}
      <div className="p-6 pt-12">
        <div className="flex gap-2 justify-center mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`h-2 w-12 rounded-full transition-all duration-300 ${
                num <= getStepNumber() ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
            {step === 'shopName' && '🏪'}
            {step === 'ownerName' && '👤'}
            {step === 'phone' && '📱'}
            {step === 'language' && '🌍'}
          </h1>
          <p className="text-xl font-semibold text-foreground">
            {step === 'language' ? t('chooseLanguage') : t('letsSetup')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="max-w-md mx-auto">
          {step === 'shopName' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('shopName')}</h2>
                    <p className="text-sm text-muted-foreground">Dukaan Ka Naam</p>
                  </div>
                </div>
                <Input
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder={t('enterShopName')}
                  className="h-16 text-xl rounded-2xl border-2 focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 'ownerName' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('ownerName')}</h2>
                    <p className="text-sm text-muted-foreground">Maalik Ka Naam</p>
                  </div>
                </div>
                <Input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={t('enterOwnerName')}
                  className="h-16 text-xl rounded-2xl border-2 focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 'phone' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('phoneNumber')}</h2>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('enterPhone')}
                  className="h-16 text-xl rounded-2xl border-2 focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 'language' && (
            <div className="space-y-4 animate-slide-up">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                    selectedLanguage === lang
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedLanguage === lang ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Globe className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-semibold">{languageNames[lang]}</span>
                  </div>
                  {selectedLanguage === lang && (
                    <Check className="w-6 h-6 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 pb-10">
        <div className="max-w-md mx-auto">
          {step === 'language' ? (
            <Button
              onClick={handleFinish}
              size="xl"
              className="w-full h-16 text-xl rounded-2xl shadow-lg"
            >
              {t('start')} 🚀
            </Button>
          ) : (
            <div className="flex gap-3">
              {step !== 'shopName' && (
                <Button
                  onClick={() => {
                    const steps: Step[] = ['shopName', 'ownerName', 'phone', 'language'];
                    const currentIndex = steps.indexOf(step);
                    if (currentIndex > 0) {
                      setStep(steps[currentIndex - 1]);
                    }
                  }}
                  variant="outline"
                  size="xl"
                  className="h-16 px-6 rounded-2xl"
                >
                  {t('back')}
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="xl"
                className="flex-1 h-16 text-xl rounded-2xl shadow-lg"
                disabled={step === 'shopName' && !shopName.trim()}
              >
                {t('next')}
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          )}
          
          {/* Skip option for optional fields */}
          {(step === 'ownerName' || step === 'phone') && (
            <button
              onClick={handleNext}
              className="w-full mt-4 text-muted-foreground text-lg py-2"
            >
              {t('skip')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
