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

interface NavItem {
  icon: LucideIcon;
  label: string;
  labelUrdu: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', labelUrdu: 'ہوم', path: '/' },
  { icon: Users, label: 'Customers', labelUrdu: 'گاہک', path: '/customers' },
  { icon: Package, label: 'Products', labelUrdu: 'سامان', path: '/products' },
  { icon: Wallet, label: 'Earnings', labelUrdu: 'آمدنی', path: '/earnings' },
  { icon: Settings, label: 'Settings', labelUrdu: 'ترتیبات', path: '/settings' },
];

interface BottomNavProps {
  children?: ReactNode;
}

export function BottomNav({ children }: BottomNavProps) {
  const location = useLocation();

  return (
    <>
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
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-card border-r border-border z-50">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">اُدھار کھاتہ</h1>
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
                <div className="flex flex-col">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-xs opacity-70 font-urdu">{item.labelUrdu}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
