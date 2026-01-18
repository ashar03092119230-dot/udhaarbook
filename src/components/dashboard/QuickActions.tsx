import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Receipt, PlusCircle, Calculator } from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'New Customer',
      labelUrdu: 'نیا گاہک',
      icon: UserPlus,
      path: '/customers/new',
      variant: 'default' as const,
    },
    {
      label: 'Add Udhaar',
      labelUrdu: 'اُدھار لکھیں',
      icon: Receipt,
      path: '/udhaar/new',
      variant: 'accent' as const,
    },
    {
      label: 'Add Product',
      labelUrdu: 'نیا سامان',
      icon: PlusCircle,
      path: '/products/new',
      variant: 'outline' as const,
    },
    {
      label: 'Daily Entry',
      labelUrdu: 'روزانہ اندراج',
      icon: Calculator,
      path: '/earnings/add',
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
          className="flex-col h-auto py-4 gap-2 animate-scale-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <action.icon className="w-6 h-6" />
          <div className="flex flex-col items-center">
            <span>{action.label}</span>
            <span className="text-xs opacity-75 font-urdu">{action.labelUrdu}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
