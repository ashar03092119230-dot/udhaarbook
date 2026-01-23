import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Phone, 
  Receipt, 
  Wallet, 
  FileText,
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomer, getCustomerEntries, deleteCustomer } = useStore();
  const { toast } = useToast();

  const customer = id ? getCustomer(id) : undefined;
  const entries = id ? getCustomerEntries(id) : [];

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!customer) {
    return (
      <BottomNav>
        <div className="page-container flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Customer not found</p>
            <Button onClick={() => navigate('/customers')} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </BottomNav>
    );
  }

  const handleDelete = () => {
    deleteCustomer(customer.id);
    toast({
      title: 'Customer Deleted',
      description: `${customer.name} has been removed`,
    });
    navigate('/customers');
  };

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground px-4 py-6 rounded-b-3xl">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {customer.photoUrl ? (
                <img
                  src={customer.photoUrl}
                  alt={customer.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-foreground/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Phone className="w-4 h-4" />
                  {customer.phone || 'No phone'}
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {customer.name} and all their transaction history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Balance Card */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-sm opacity-80 mb-1">Current Balance / موجودہ بقایا</p>
              <p className={cn(
                "amount-display-lg",
                customer.balance > 0 ? "text-warning" : "text-success"
              )}>
                Rs {customer.balance.toLocaleString('en-PK')}
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 -mt-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="stat-card animate-slide-up">
              <p className="text-xs text-muted-foreground mb-1">Total Udhaar</p>
              <p className="font-bold text-lg text-foreground">
                Rs {customer.totalDue.toLocaleString('en-PK')}
              </p>
            </div>
            <div className="stat-card animate-slide-up" style={{ animationDelay: '50ms' }}>
              <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
              <p className="font-bold text-lg text-success">
                Rs {customer.totalPaid.toLocaleString('en-PK')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate(`/udhaar/new?customer=${customer.id}`)}
              className="flex-col h-auto py-4 gap-2"
            >
              <Receipt className="w-6 h-6" />
              <span>Add Udhaar</span>
              <span className="text-xs opacity-75 font-urdu">اُدھار لکھیں</span>
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => navigate(`/payment/new?customer=${customer.id}`)}
              className="flex-col h-auto py-4 gap-2"
            >
              <Wallet className="w-6 h-6" />
              <span>Add Payment</span>
              <span className="text-xs opacity-75 font-urdu">رقم وصول</span>
            </Button>
          </div>

          {/* Generate Slip */}
          <Button
            variant="outline"
            size="lg"
            className="w-full mb-6"
            onClick={() => navigate(`/slip/${customer.id}`)}
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate Slip
            <span className="font-urdu ml-2">پرچی بنائیں</span>
          </Button>

          {/* Transaction History */}
          <section>
            <h2 className="section-title flex items-center gap-2">
              Transaction History
              <span className="text-sm font-normal text-muted-foreground font-urdu">لین دین</span>
            </h2>

            {sortedEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet</p>
                <p className="text-sm font-urdu">ابھی کوئی لین دین نہیں</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 animate-slide-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      entry.type === 'udhaar' ? "bg-warning/20" : "bg-success/20"
                    )}>
                      {entry.type === 'udhaar' ? (
                        <TrendingUp className="w-5 h-5 text-warning" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-success" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {entry.type === 'udhaar' ? 'Udhaar Added' : 'Payment Received'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), 'dd MMM yyyy, h:mm a')}
                      </p>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                      )}
                    </div>

                    <p className={cn(
                      "font-bold text-lg",
                      entry.type === 'udhaar' ? "text-warning" : "text-success"
                    )}>
                      {entry.type === 'udhaar' ? '+' : '-'}Rs {entry.amount.toLocaleString('en-PK')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </BottomNav>
  );
};

export default CustomerDetailPage;
