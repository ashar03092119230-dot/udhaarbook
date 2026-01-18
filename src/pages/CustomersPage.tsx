import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  UserPlus, 
  ChevronRight, 
  AlertCircle,
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomersPage = () => {
  const { customers } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  // Sort by balance (highest first)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => b.balance - a.balance);

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Customers</h1>
                <p className="text-sm text-muted-foreground font-urdu">گاہکوں کی فہرست</p>
              </div>
              <Button onClick={() => navigate('/customers/new')} size="icon-lg">
                <UserPlus className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-lg pl-12"
              />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-4">
          {sortedCustomers.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-secondary/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">
                {searchQuery ? 'No customers found' : 'No Customers Yet'}
              </h3>
              <p className="text-muted-foreground mb-6 font-urdu">
                {searchQuery ? 'کوئی گاہک نہیں ملا' : 'ابھی کوئی گاہک نہیں'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/customers/new')} size="lg">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add First Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCustomers.map((customer, index) => (
                <button
                  key={customer.id}
                  onClick={() => navigate(`/customers/${customer.id}`)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-secondary/50 transition-all duration-200 animate-slide-up border border-border/50 shadow-card"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold',
                      customer.balance > 0
                        ? 'bg-warning/20 text-warning'
                        : 'bg-success/20 text-success'
                    )}
                  >
                    {customer.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-lg text-foreground">
                      {customer.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>

                  <div className="text-right">
                    {customer.balance > 0 ? (
                      <>
                        <div className="flex items-center gap-1 justify-end">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          <span className="text-xs text-warning font-medium">Pending</span>
                        </div>
                        <p className="font-bold text-lg text-warning">
                          Rs {customer.balance.toLocaleString('en-PK')}
                        </p>
                      </>
                    ) : (
                      <span className="text-success font-medium">All Paid ✓</span>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </BottomNav>
  );
};

export default CustomersPage;
