import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewCustomerPage = () => {
  const navigate = useNavigate();
  const { addCustomer } = useStore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter customer name',
        variant: 'destructive',
      });
      return;
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
      title: 'Customer Added! ✓',
      description: `${name} has been added successfully`,
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
              <h1 className="text-xl font-bold text-foreground">New Customer</h1>
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
                Customer Name
                <span className="text-muted-foreground font-normal font-urdu text-sm">گاہک کا نام</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name..."
                className="input-lg"
                autoFocus
              />
            </div>

            {/* Phone */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
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

            {/* Initial Balance */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Label htmlFor="balance" className="text-base font-semibold flex items-center gap-2">
                💰 Opening Balance (Optional)
                <span className="text-muted-foreground font-normal font-urdu text-sm">پرانا بقایا</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  Rs
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
                Enter if customer already has pending udhaar
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="xl" 
              className="w-full mt-8 animate-slide-up"
              style={{ animationDelay: '150ms' }}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Customer
              <span className="font-urdu ml-2">گاہک شامل کریں</span>
            </Button>
          </form>
        </div>
      </div>
    </BottomNav>
  );
};

export default NewCustomerPage;
