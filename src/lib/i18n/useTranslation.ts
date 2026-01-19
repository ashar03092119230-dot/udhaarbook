import { useStore } from '@/store/useStore';
import { getTranslation, isRTL, Language, languageNames } from './translations';

export const useTranslation = () => {
  const { language } = useStore();
  
  const t = (key: string): string => {
    return getTranslation(language, key);
  };
  
  const rtl = isRTL(language);
  
  return { t, language, rtl, languageNames };
};

export type { Language };
export { languageNames };
