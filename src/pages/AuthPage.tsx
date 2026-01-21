import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, validatePhoneNumber, validatePin } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Phone, Lock, Eye, EyeOff, Smartphone, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type AuthStep = 'phone' | 'otp' | 'pin' | 'login';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<AuthStep>('phone');
  const [isNewUser, setIsNewUser] = useState(true);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handlePhoneSubmit = () => {
    setError('');
    const validation = validatePhoneNumber(phone);
    
    if (!validation.valid) {
      setError(t(validation.error || 'invalidPhone'));
      return;
    }
    
    // For MVP, simulate OTP sent
    setStep('otp');
    toast({
      title: t('otpSent'),
      description: t('otpSentMessage'),
    });
  };

  const handleOtpVerify = () => {
    setError('');
    
    // For MVP, accept any 4-digit OTP (mock verification)
    if (otp.length !== 4) {
      setError(t('enterCompleteOtp'));
      return;
    }
    
    // Simulate OTP verification success
    if (isNewUser) {
      setStep('pin');
    } else {
      setStep('login');
    }
  };

  const handlePinSetup = async () => {
    setError('');
    
    const validation = validatePin(pin);
    if (!validation.valid) {
      setError(t(validation.error || 'invalidPin'));
      return;
    }
    
    if (pin !== confirmPin) {
      setError(t('pinNoMatch'));
      return;
    }
    
    setIsLoading(true);
    
    const { error: signUpError } = await signUp(phone, pin);
    
    setIsLoading(false);
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError(t('phoneAlreadyRegistered'));
        setIsNewUser(false);
        setStep('login');
      } else {
        setError(t('signupError'));
      }
      return;
    }
    
    toast({
      title: t('accountCreated'),
      description: t('welcomeBack'),
    });
    
    // Navigation handled by useEffect
  };

  const handleLogin = async () => {
    setError('');
    
    if (!pin) {
      setError(t('enterPin'));
      return;
    }
    
    setIsLoading(true);
    
    const { error: signInError } = await signIn(phone, pin);
    
    setIsLoading(false);
    
    if (signInError) {
      if (signInError.message.includes('Invalid login')) {
        setError(t('wrongPin'));
      } else {
        setError(t('loginError'));
      }
      return;
    }
    
    // Navigation handled by useEffect
  };

  const switchToLogin = () => {
    setIsNewUser(false);
    setStep('login');
    setPin('');
    setConfirmPin('');
    setError('');
  };

  const switchToSignup = () => {
    setIsNewUser(true);
    setStep('phone');
    setPhone('');
    setOtp('');
    setPin('');
    setConfirmPin('');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">UdhaarBook</h1>
        <p className="text-muted-foreground">{t('appTagline')}</p>
      </div>

      {/* Progress */}
      {isNewUser && step !== 'login' && (
        <div className="px-6">
          <div className="flex gap-2 justify-center mb-6">
            {['phone', 'otp', 'pin'].map((s, i) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-all ${
                  ['phone', 'otp', 'pin'].indexOf(step) >= i ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="max-w-md mx-auto">
          {/* Phone Step */}
          {step === 'phone' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('enterPhone')}</h2>
                    <p className="text-sm text-muted-foreground">{t('phoneAsId')}</p>
                  </div>
                </div>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="03XX-XXXXXXX"
                  className="h-16 text-xl rounded-2xl border-2 focus:border-primary text-center tracking-wider"
                  autoFocus
                />
                {error && (
                  <p className="text-destructive text-sm mt-2 text-center">{error}</p>
                )}
              </div>
              
              <Button
                onClick={handlePhoneSubmit}
                size="xl"
                className="w-full h-16 text-xl rounded-2xl shadow-lg"
                disabled={!phone.trim()}
              >
                {t('sendOtp')}
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              
              <button
                onClick={switchToLogin}
                className="w-full text-center text-muted-foreground py-2"
              >
                {t('alreadyHaveAccount')}
              </button>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('enterOtp')}</h2>
                    <p className="text-sm text-muted-foreground">{t('otpSentTo')} {phone}</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setError('');
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={1} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={2} className="w-14 h-14 text-2xl" />
                      <InputOTPSlot index={3} className="w-14 h-14 text-2xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                {error && (
                  <p className="text-destructive text-sm mt-4 text-center">{error}</p>
                )}
                
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {t('otpHint')}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('phone')}
                  variant="outline"
                  size="xl"
                  className="h-16 px-6 rounded-2xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleOtpVerify}
                  size="xl"
                  className="flex-1 h-16 text-xl rounded-2xl shadow-lg"
                  disabled={otp.length !== 4}
                >
                  {t('verify')}
                  <CheckCircle className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* PIN Setup Step */}
          {step === 'pin' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('setPin')}</h2>
                    <p className="text-sm text-muted-foreground">{t('pinInfo')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPin(val);
                        setError('');
                      }}
                      placeholder={t('enterNewPin')}
                      className="h-16 text-xl rounded-2xl border-2 focus:border-primary text-center tracking-widest pr-12"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <Input
                    type={showPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setConfirmPin(val);
                      setError('');
                    }}
                    placeholder={t('confirmPin')}
                    className="h-16 text-xl rounded-2xl border-2 focus:border-primary text-center tracking-widest"
                    inputMode="numeric"
                  />
                </div>
                
                {error && (
                  <p className="text-destructive text-sm mt-4 text-center">{error}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('otp')}
                  variant="outline"
                  size="xl"
                  className="h-16 px-6 rounded-2xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handlePinSetup}
                  size="xl"
                  className="flex-1 h-16 text-xl rounded-2xl shadow-lg"
                  disabled={isLoading || !pin || !confirmPin}
                >
                  {isLoading ? t('creating') : t('createAccount')}
                </Button>
              </div>
            </div>
          )}

          {/* Login Step */}
          {step === 'login' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t('welcomeBack')}</h2>
                    <p className="text-sm text-muted-foreground">{t('loginWithPhone')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    placeholder="03XX-XXXXXXX"
                    className="h-16 text-xl rounded-2xl border-2 focus:border-primary text-center tracking-wider"
                  />
                  
                  <div className="relative">
                    <Input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPin(val);
                        setError('');
                      }}
                      placeholder={t('enterPin')}
                      className="h-16 text-xl rounded-2xl border-2 focus:border-primary text-center tracking-widest pr-12"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <p className="text-destructive text-sm mt-4 text-center">{error}</p>
                )}
              </div>
              
              <Button
                onClick={handleLogin}
                size="xl"
                className="w-full h-16 text-xl rounded-2xl shadow-lg"
                disabled={isLoading || !phone || !pin}
              >
                {isLoading ? t('loggingIn') : t('login')}
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              
              <button
                onClick={switchToSignup}
                className="w-full text-center text-muted-foreground py-2"
              >
                {t('createNewAccount')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t('dataSecure')}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
