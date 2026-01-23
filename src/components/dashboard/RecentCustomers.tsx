import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RecentCustomers() {
  const { customers } = useStore();
  const navigate = useNavigate();

  // Sort by last transaction date and get recent 5
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.lastTransactionDate).getTime() - new Date(a.lastTransactionDate).getTime())
    .slice(0, 5);

  if (recentCustomers.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="bg-secondary/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">No Customers Yet</h3>
        <p className="text-sm text-muted-foreground">ابھی کوئی گاہک نہیں</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentCustomers.map((customer, index) => (
        <button
          key={customer.id}
          onClick={() => navigate(`/customers/${customer.id}`)}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-all duration-200 animate-slide-up border border-border/50"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {customer.photoUrl ? (
            <img
              src={customer.photoUrl}
              alt={customer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
              customer.balance > 0 
                ? "bg-warning/20 text-warning" 
                : "bg-success/20 text-success"
            )}>
              {customer.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-foreground">{customer.name}</h4>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>

          <div className="text-right">
            {customer.balance > 0 ? (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="font-bold text-warning">
                  Rs {customer.balance.toLocaleString('en-PK')}
                </span>
              </div>
            ) : (
              <span className="text-sm text-success font-medium">Paid ✓</span>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
