import { translations, Language } from '@/i18n/translations';

export const useTranslation = (language: Language = 'pt') => {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t };
};
