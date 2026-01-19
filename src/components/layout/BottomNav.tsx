import { ReactNode } from 'react';
import { 
  Home, 
  Users, 
  Package, 
  Wallet, 
  Settings,
  LucideIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface NavItem {
  icon: LucideIcon;
  labelKey: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, labelKey: 'home', path: '/' },
  { icon: Users, labelKey: 'customers', path: '/customers' },
  { icon: Package, labelKey: 'products', path: '/products' },
  { icon: Wallet, labelKey: 'earnings', path: '/earnings' },
  { icon: Settings, labelKey: 'settings', path: '/settings' },
];

interface BottomNavProps {
  children?: ReactNode;
}

export function BottomNav({ children }: BottomNavProps) {
  const location = useLocation();
  const { t, rtl } = useTranslation();

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <main className="pb-24 md:pb-8 md:pl-64">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
          <div className="flex items-center justify-around h-20 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 touch-target",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span className="text-xs font-medium">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex fixed top-0 bottom-0 w-64 flex-col bg-card border-border z-50",
        rtl ? "right-0 border-l" : "left-0 border-r"
      )}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">📒 {t('home')}</h1>
          <p className="text-sm text-muted-foreground mt-1">Udhaar Khata</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary-foreground bg-primary shadow-button" 
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
