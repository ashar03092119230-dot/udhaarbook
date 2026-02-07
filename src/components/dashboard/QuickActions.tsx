import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Receipt, Calculator, Bell } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

export function QuickActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      labelKey: 'addCustomer',
      icon: UserPlus,
      path: '/customers/new',
      gradient: 'from-primary to-primary/80',
      shadow: 'shadow-primary/25',
    },
    {
      labelKey: 'addUdhaar',
      icon: Receipt,
      path: '/udhaar/new',
      gradient: 'from-accent to-accent/80',
      shadow: 'shadow-accent/25',
    },
    {
      labelKey: 'calculator',
      icon: Calculator,
      path: '/calculator',
      gradient: 'from-muted-foreground/80 to-muted-foreground/60',
      shadow: 'shadow-muted-foreground/15',
      isOutline: true,
    },
    {
      labelKey: 'reminders',
      icon: Bell,
      path: '/reminders',
      gradient: 'from-muted-foreground/80 to-muted-foreground/60',
      shadow: 'shadow-muted-foreground/15',
      isOutline: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <Button
          key={action.path}
          variant={action.isOutline ? 'outline' : 'default'}
          size="lg"
          onClick={() => navigate(action.path)}
          className={cn(
            "relative flex-col h-auto py-6 gap-3 animate-scale-in text-lg overflow-hidden group",
            "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
            !action.isOutline && `bg-gradient-to-br ${action.gradient} shadow-lg ${action.shadow}`,
            action.isOutline && "border-2 hover:bg-muted/50"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            action.isOutline ? "bg-muted" : "bg-white/20"
          )}>
            <action.icon className="w-6 h-6" />
          </div>
          <span className="font-bold">{t(action.labelKey)}</span>
        </Button>
      ))}
    </div>
  );
}
