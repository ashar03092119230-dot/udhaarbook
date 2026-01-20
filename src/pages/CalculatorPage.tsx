import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Minus, 
  X, 
  Divide, 
  Delete, 
  Equal, 
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

const expenseCategories = [
  { value: 'stock', labelKey: 'expStock' },
  { value: 'electricity', labelKey: 'expElectricity' },
  { value: 'rent', labelKey: 'expRent' },
  { value: 'salary', labelKey: 'expSalary' },
  { value: 'maintenance', labelKey: 'expMaintenance' },
  { value: 'other', labelKey: 'expOther' },
];

const CalculatorPage = () => {
  const { getTodayRecord, getMonthlyStats, addDailyEarnings, addExpense } = useStore();
  const { toast } = useToast();
  const { t, rtl } = useTranslation();

  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseLabel, setExpenseLabel] = useState('');

  const todayRecord = getTodayRecord();
  const now = new Date();
  const monthlyStats = getMonthlyStats(now.getFullYear(), now.getMonth());

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '*': return prev * current;
      case '/': return current !== 0 ? prev / current : 0;
      default: return current;
    }
  };

  const handleEquals = () => {
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleAddToBalance = () => {
    const amount = parseFloat(display);
    if (!amount || amount <= 0) {
      toast({
        title: t('enterAmount') || 'Enter Amount',
        description: t('enterValidAmount') || 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    addDailyEarnings(new Date(), (todayRecord?.earnings || 0) + amount);
    toast({
      title: `${t('earningsAdded') || 'Added!'} ✓`,
      description: `Rs ${amount.toLocaleString('en-PK')} ${t('addedToBalance') || 'added to balance'}`,
    });
    clear();
  };

  const handleAddExpense = () => {
    const amount = parseFloat(display);
    if (!amount || amount <= 0) {
      toast({
        title: t('enterAmount') || 'Enter Amount',
        variant: 'destructive',
      });
      return;
    }

    if (!expenseCategory) {
      toast({
        title: t('selectCategory') || 'Select Category',
        variant: 'destructive',
      });
      return;
    }

    addExpense(new Date(), {
      category: expenseCategory,
      amount,
      description: expenseLabel.trim() || undefined,
    });

    toast({
      title: `${t('expenseAdded') || 'Expense Added!'} ✓`,
      description: `Rs ${amount.toLocaleString('en-PK')} ${t('expenseRecorded') || 'recorded'}`,
    });
    setExpenseCategory('');
    setExpenseLabel('');
    setIsExpenseOpen(false);
    clear();
  };

  const CalcButton = ({ 
    children, 
    onClick, 
    variant = 'default',
    className = ''
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    variant?: 'default' | 'operator' | 'action';
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "h-16 rounded-2xl text-2xl font-bold transition-all active:scale-95",
        variant === 'default' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === 'operator' && "bg-accent text-accent-foreground hover:bg-accent/80",
        variant === 'action' && "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-primary text-primary-foreground px-4 py-4 rounded-b-3xl">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-xl font-bold">{t('calculator')}</h1>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-4">
          {/* Today's Balance Card */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-success/10 rounded-2xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t('todayEarning')}</p>
              <p className="font-bold text-lg text-success">
                Rs {(todayRecord?.earnings || 0).toLocaleString('en-PK')}
              </p>
            </div>
            <div className="bg-destructive/10 rounded-2xl p-4 text-center">
              <TrendingDown className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t('expenses')}</p>
              <p className="font-bold text-lg text-destructive">
                Rs {(todayRecord?.totalExpenses || 0).toLocaleString('en-PK')}
              </p>
            </div>
          </div>

          {/* Display */}
          <div className="bg-card rounded-3xl p-6 mb-4 border border-border">
            <p className="text-right text-4xl font-bold text-foreground overflow-hidden">
              {display.length > 12 ? parseFloat(display).toExponential(6) : display}
            </p>
            {operator && (
              <p className="text-right text-sm text-muted-foreground mt-1">
                {previousValue} {operator}
              </p>
            )}
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <CalcButton onClick={clear} className="bg-destructive/20 text-destructive">C</CalcButton>
            <CalcButton onClick={backspace} className="bg-destructive/20 text-destructive">
              <Delete className="w-6 h-6 mx-auto" />
            </CalcButton>
            <CalcButton onClick={() => performOperation('/')} variant="operator">
              <Divide className="w-6 h-6 mx-auto" />
            </CalcButton>
            <CalcButton onClick={() => performOperation('*')} variant="operator">
              <X className="w-6 h-6 mx-auto" />
            </CalcButton>

            <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
            <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
            <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
            <CalcButton onClick={() => performOperation('-')} variant="operator">
              <Minus className="w-6 h-6 mx-auto" />
            </CalcButton>

            <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
            <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
            <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
            <CalcButton onClick={() => performOperation('+')} variant="operator">
              <Plus className="w-6 h-6 mx-auto" />
            </CalcButton>

            <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
            <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
            <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
            <CalcButton onClick={handleEquals} variant="action" className="row-span-2">
              <Equal className="w-6 h-6 mx-auto" />
            </CalcButton>

            <CalcButton onClick={() => inputDigit('0')} className="col-span-2">0</CalcButton>
            <CalcButton onClick={inputDecimal}>.</CalcButton>
          </div>

          {/* Add to Balance Button - BIG */}
          <Button
            size="xl"
            className="w-full h-16 text-xl gap-3 mb-3"
            onClick={handleAddToBalance}
          >
            <Wallet className="w-7 h-7" />
            {t('addToBalance')}
          </Button>

          {/* Add Expense Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={() => setIsExpenseOpen(true)}
          >
            <Receipt className="w-5 h-5" />
            {t('addExpense')}
          </Button>

          {/* Monthly Summary */}
          <div className="bg-card rounded-2xl p-4 mt-6 border border-border">
            <h3 className="font-bold text-sm mb-3 text-muted-foreground">
              📊 {format(now, 'MMMM')} {t('monthlySummary')}
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">{t('income')}</p>
                <p className="font-bold text-success">Rs {monthlyStats.earnings.toLocaleString('en-PK')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('expenses')}</p>
                <p className="font-bold text-destructive">Rs {monthlyStats.expenses.toLocaleString('en-PK')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('netProfit')}</p>
                <p className={cn("font-bold", monthlyStats.profit >= 0 ? "text-success" : "text-destructive")}>
                  Rs {monthlyStats.profit.toLocaleString('en-PK')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Dialog */}
        <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addExpense')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="bg-secondary rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">{t('amount')}</p>
                <p className="text-3xl font-bold">Rs {parseFloat(display).toLocaleString('en-PK')}</p>
              </div>
              
              <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                <SelectTrigger className="h-14">
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {t(cat.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={expenseLabel}
                onChange={(e) => setExpenseLabel(e.target.value)}
                placeholder={`${t('description')} (${t('optional')})`}
                className="h-12"
              />

              <Button 
                onClick={handleAddExpense} 
                variant="destructive" 
                size="lg" 
                className="w-full"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('addExpense')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BottomNav>
  );
};

export default CalculatorPage;
