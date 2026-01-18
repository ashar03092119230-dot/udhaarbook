import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Receipt, Search, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const NewUdhaarPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCustomerId = searchParams.get('customer');
  
  const { customers, addUdhaarEntry, getCustomer } = useStore();
  const { toast } = useToast();

  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedCustomerId || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCustomer = selectedCustomerId ? getCustomer(selectedCustomerId) : undefined;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      toast({
        title: 'Select Customer',
        description: 'Please select a customer first',
        variant: 'destructive',
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: 'Enter Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    addUdhaarEntry({
      customerId: selectedCustomerId,
      amount: amountNum,
      type: 'udhaar',
      description: description.trim() || undefined,
    });

    toast({
      title: 'Udhaar Added! ✓',
      description: `Rs ${amountNum.toLocaleString('en-PK')} added for ${selectedCustomer?.name}`,
    });

    navigate(`/customers/${selectedCustomerId}`);
  };

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-accent text-accent-foreground px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Add Udhaar</h1>
              <p className="text-sm opacity-80 font-urdu">اُدھار لکھیں</p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Selection */}
            {!preselectedCustomerId && (
              <div className="space-y-3 animate-slide-up">
                <Label className="text-base font-semibold">
                  Select Customer
                  <span className="text-muted-foreground font-normal font-urdu text-sm ml-2">گاہک منتخب کریں</span>
                </Label>
                
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-lg pl-12"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-border p-2">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No customers found</p>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                          selectedCustomerId === customer.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                          selectedCustomerId === customer.id
                            ? "bg-primary-foreground/20"
                            : "bg-background"
                        )}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">{customer.name}</p>
                          <p className="text-xs opacity-70">{customer.phone}</p>
                        </div>
                        {selectedCustomerId === customer.id && (
                          <Check className="w-5 h-5" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Selected Customer Display */}
            {selectedCustomer && (
              <div className="bg-secondary rounded-2xl p-4 animate-scale-in">
                <p className="text-sm text-muted-foreground mb-1">Selected Customer</p>
                <p className="font-bold text-lg">{selectedCustomer.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current Balance: <span className="text-warning font-semibold">Rs {selectedCustomer.balance.toLocaleString('en-PK')}</span>
                </p>
              </div>
            )}

            {/* Amount */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <Label htmlFor="amount" className="text-base font-semibold">
                💰 Udhaar Amount
                <span className="text-muted-foreground font-normal font-urdu text-sm ml-2">اُدھار رقم</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-xl">
                  Rs
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="h-16 pl-14 text-3xl font-bold text-center"
                  min="0"
                  autoFocus={!!preselectedCustomerId}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Label htmlFor="description" className="text-base font-semibold">
                📝 Description (Optional)
                <span className="text-muted-foreground font-normal font-urdu text-sm ml-2">تفصیل</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was purchased..."
                className="min-h-[80px] text-base"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="xl"
              className="w-full mt-8 animate-slide-up"
              style={{ animationDelay: '150ms' }}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Add Udhaar Entry
              <span className="font-urdu ml-2">اُدھار شامل کریں</span>
            </Button>
          </form>
        </div>
      </div>
    </BottomNav>
  );
};

export default NewUdhaarPage;
