import { useState } from 'react';
import { 
  Sparkles, X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HeroDecision } from './HeroDecision';
import { AIInsightButtons } from './AIInsightButtons';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const AISidebar = () => {
  const { t, rtl } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={rtl ? "left" : "right"} 
        className="w-full sm:w-[400px] overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <div className="bg-primary/20 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {t('aiHelper')}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-8">
          {/* Hero Decision */}
          <section>
            <HeroDecision onActionTaken={() => setOpen(false)} />
          </section>

          {/* AI Insight Buttons */}
          <section>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              🤖 {t('aiInsights')}
            </h3>
            <AIInsightButtons />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};
