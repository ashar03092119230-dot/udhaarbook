import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Receipt, PlusCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function QuickActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      labelKey: 'addCustomer',
      icon: UserPlus,
      path: '/customers/new',
      variant: 'default' as const,
    },
    {
      labelKey: 'addUdhaar',
      icon: Receipt,
      path: '/udhaar/new',
      variant: 'accent' as const,
    },
    {
      labelKey: 'addProduct',
      icon: PlusCircle,
      path: '/products/new',
      variant: 'outline' as const,
    },
    {
      labelKey: 'aiHelper',
      icon: Sparkles,
      path: '/ai-helper',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <Button
          key={action.path}
          variant={action.variant}
          size="lg"
          onClick={() => navigate(action.path)}
          className="flex-col h-auto py-5 gap-2 animate-scale-in text-lg"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <action.icon className="w-7 h-7" />
          <span className="font-semibold">{t(action.labelKey)}</span>
        </Button>
      ))}
    </div>
  );
}
