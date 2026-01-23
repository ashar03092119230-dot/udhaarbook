import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, Gift, Shuffle, Trash2, Plus, Crown, Sparkles, PartyPopper
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoyaltyCustomer } from '@/types';

const InaamPage = () => {
  const navigate = useNavigate();
  const { t, rtl } = useTranslation();
  const { toast } = useToast();
  const { 
    customers, 
    loyaltyCustomers, 
    addLoyaltyCustomer, 
    removeLoyaltyCustomer,
    getRandomLoyaltyWinner 
  } = useStore();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [winner, setWinner] = useState<LoyaltyCustomer | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Filter out customers who have udhaar (balance > 0) and already in loyalty list
  const eligibleCustomers = customers.filter(c => {
    const isLoyaltyMember = loyaltyCustomers.some(lc => lc.customerId === c.id);
    const hasNoUdhaar = c.balance <= 0;
    return hasNoUdhaar && !isLoyaltyMember;
  });

  const handleAddLoyalty = () => {
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) {
      toast({ title: t('selectCustomer'), variant: 'destructive' });
      return;
    }

    addLoyaltyCustomer({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
    });
    
    toast({ title: `${customer.name} ${t('addedToLoyalty')} 🎉` });
    setSelectedCustomerId('');
    setShowAddDialog(false);
  };

  const handleRemove = (id: string) => {
    removeLoyaltyCustomer(id);
    toast({ title: t('removed') + ' ✓' });
  };

  const handleSpin = () => {
    if (loyaltyCustomers.length === 0) {
      toast({ title: t('addLoyaltyFirst'), variant: 'destructive' });
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // Simulate spinning animation
    setTimeout(() => {
      const randomWinner = getRandomLoyaltyWinner();
      setWinner(randomWinner || null);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{t('inaam')}</h1>
              </div>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="rounded-xl"
              disabled={eligibleCustomers.length === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('addNew')}
            </Button>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Spin to Win Section */}
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 ${isSpinning ? 'animate-spin' : ''}`}>
                <Shuffle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-lg font-bold mb-2">{t('spinToWin')}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t('spinDescription')}
              </p>
              <Button 
                onClick={handleSpin} 
                className="rounded-xl px-8"
                disabled={isSpinning || loyaltyCustomers.length === 0}
              >
                {isSpinning ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    {t('spinning')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    {t('spinNow')}
                  </span>
                )}
              </Button>
            </div>
          </Card>

          {/* Winner Display */}
          {winner && (
            <Card className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 animate-scale-in">
              <div className="text-center">
                <PartyPopper className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-1">{t('winner')}! 🎉</h3>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-primary">{winner.customerName}</span>
                </div>
                {winner.customerPhone && (
                  <p className="text-sm text-muted-foreground mt-2">{winner.customerPhone}</p>
                )}
                <p className="text-sm text-muted-foreground mt-4">{t('giveReward')}</p>
              </div>
            </Card>
          )}

          {/* Loyalty List */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              {t('loyaltyList')} ({loyaltyCustomers.length})
            </h3>

            {loyaltyCustomers.length === 0 ? (
              <Card className="p-6 rounded-2xl text-center">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">{t('noLoyaltyCustomers')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('loyaltyHint')}</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {loyaltyCustomers.map((lc) => (
                  <Card key={lc.id} className="p-4 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{lc.customerName}</h4>
                        {lc.customerPhone && (
                          <p className="text-sm text-muted-foreground">{lc.customerPhone}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemove(lc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Info Card */}
          <Card className="p-4 rounded-2xl bg-muted/50">
            <p className="text-sm text-muted-foreground">
              💡 {t('inaamTip')}
            </p>
          </Card>
        </div>

        {/* Add Customer Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {t('addToLoyalty')}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {eligibleCustomers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('noEligibleCustomers')}
                </p>
              ) : (
                <>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder={t('selectCustomer')} />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    className="w-full h-12 rounded-xl" 
                    onClick={handleAddLoyalty}
                    disabled={!selectedCustomerId}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('addToLoyalty')}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BottomNav>
  );
};

export default InaamPage;