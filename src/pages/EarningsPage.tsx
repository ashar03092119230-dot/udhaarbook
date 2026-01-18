import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calculator,
  Wallet,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const expenseCategories = [
  { value: 'stock', label: 'Stock Purchase', labelUrdu: 'مال خریداری' },
  { value: 'electricity', label: 'Electricity', labelUrdu: 'بجلی' },
  { value: 'rent', label: 'Rent', labelUrdu: 'کرایہ' },
  { value: 'salary', label: 'Salary', labelUrdu: 'تنخواہ' },
  { value: 'maintenance', label: 'Maintenance', labelUrdu: 'مرمت' },
  { value: 'other', label: 'Other', labelUrdu: 'دیگر' },
];

const EarningsPage = () => {
  const { getTodayRecord, getMonthlyStats, addDailyEarnings, addExpense, dailyRecords } = useStore();
  const { toast } = useToast();

  const [earningsInput, setEarningsInput] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const todayRecord = getTodayRecord();
  const now = new Date();
  const monthlyStats = getMonthlyStats(now.getFullYear(), now.getMonth());

  // Get recent records
  const recentRecords = [...dailyRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  const handleAddEarnings = () => {
    const amount = parseFloat(earningsInput);
    if (!amount || amount <= 0) {
      toast({
        title: 'Enter Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    addDailyEarnings(new Date(), amount);
    toast({
      title: 'Earnings Added! ✓',
      description: `Rs ${amount.toLocaleString('en-PK')} added to today's earnings`,
    });
    setEarningsInput('');
    setIsEarningsOpen(false);
  };

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Enter Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (!expenseCategory) {
      toast({
        title: 'Select Category',
        description: 'Please select expense category',
        variant: 'destructive',
      });
      return;
    }

    addExpense(new Date(), {
      category: expenseCategory,
      amount,
      description: expenseDescription.trim() || undefined,
    });

    toast({
      title: 'Expense Added! ✓',
      description: `Rs ${amount.toLocaleString('en-PK')} expense recorded`,
    });
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDescription('');
    setIsExpenseOpen(false);
  };

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground px-4 py-6 rounded-b-3xl">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Daily Earnings</h1>
            <p className="text-sm opacity-80 font-urdu">روزانہ آمدنی و اخراجات</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 -mt-4">
          {/* Today's Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="stat-card animate-slide-up text-center">
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Today Earnings</p>
              <p className="font-bold text-lg text-success">
                Rs {(todayRecord?.earnings || 0).toLocaleString('en-PK')}
              </p>
            </div>
            <div className="stat-card animate-slide-up text-center" style={{ animationDelay: '50ms' }}>
              <TrendingDown className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Today Expenses</p>
              <p className="font-bold text-lg text-destructive">
                Rs {(todayRecord?.totalExpenses || 0).toLocaleString('en-PK')}
              </p>
            </div>
            <div className="stat-card animate-slide-up text-center" style={{ animationDelay: '100ms' }}>
              <Calculator className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
              <p className={cn(
                "font-bold text-lg",
                (todayRecord?.netProfit || 0) >= 0 ? "text-success" : "text-destructive"
              )}>
                Rs {(todayRecord?.netProfit || 0).toLocaleString('en-PK')}
              </p>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-card rounded-2xl p-5 mb-6 border border-border animate-scale-in">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              📊 {format(now, 'MMMM yyyy')} Summary
              <span className="text-sm font-normal text-muted-foreground font-urdu">ماہانہ خلاصہ</span>
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <p className="font-bold text-xl text-success">
                  Rs {monthlyStats.earnings.toLocaleString('en-PK')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="font-bold text-xl text-destructive">
                  Rs {monthlyStats.expenses.toLocaleString('en-PK')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Net Profit</p>
                <p className={cn(
                  "font-bold text-xl",
                  monthlyStats.profit >= 0 ? "text-success" : "text-destructive"
                )}>
                  Rs {monthlyStats.profit.toLocaleString('en-PK')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Dialog open={isEarningsOpen} onOpenChange={setIsEarningsOpen}>
              <DialogTrigger asChild>
                <Button variant="success" size="lg" className="flex-col h-auto py-4 gap-2">
                  <Wallet className="w-6 h-6" />
                  <span>Add Earnings</span>
                  <span className="text-xs opacity-75 font-urdu">آمدنی</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Today's Earnings / آج کی آمدنی</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-xl">
                      Rs
                    </span>
                    <Input
                      type="number"
                      value={earningsInput}
                      onChange={(e) => setEarningsInput(e.target.value)}
                      placeholder="0"
                      className="h-16 pl-14 text-3xl font-bold text-center"
                      min="0"
                      autoFocus
                    />
                  </div>
                  <Button onClick={handleAddEarnings} size="lg" className="w-full">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Earnings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="flex-col h-auto py-4 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                  <Receipt className="w-6 h-6" />
                  <span>Add Expense</span>
                  <span className="text-xs opacity-75 font-urdu">خرچہ</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense / خرچہ شامل کریں</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Category / قسم</Label>
                    <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label} - {cat.labelUrdu}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount / رقم</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                        Rs
                      </span>
                      <Input
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="0"
                        className="h-14 pl-12 text-2xl font-bold"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Input
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      placeholder="Notes..."
                    />
                  </div>
                  <Button onClick={handleAddExpense} variant="destructive" size="lg" className="w-full">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Records */}
          <section>
            <h2 className="section-title flex items-center gap-2">
              Recent Records
              <span className="text-sm font-normal text-muted-foreground font-urdu">حالیہ ریکارڈ</span>
            </h2>

            {recentRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No records yet</p>
                <p className="text-sm font-urdu">ابھی کوئی ریکارڈ نہیں</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 animate-slide-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {format(new Date(record.date), 'EEEE, dd MMM')}
                      </p>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span className="text-success">+Rs {record.earnings.toLocaleString('en-PK')}</span>
                        <span className="text-destructive">-Rs {record.totalExpenses.toLocaleString('en-PK')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Net</p>
                      <p className={cn(
                        "font-bold text-lg",
                        record.netProfit >= 0 ? "text-success" : "text-destructive"
                      )}>
                        Rs {record.netProfit.toLocaleString('en-PK')}
                      </p>
                    </div>
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

export default EarningsPage;
