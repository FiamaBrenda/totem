import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Languages } from 'lucide-react';
import { Language } from '@/i18n/translations';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageSelect = (code: Language) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[9999]" style={{ position: 'fixed' }}>
      {!isOpen ? (
        <Button
          size="lg"
          variant="outline"
          className="h-24 w-24 rounded-full shadow-lg hover:scale-110 transition-all"
          onClick={() => setIsOpen(true)}
          aria-label="Selecionar idioma"
        >
          <Languages className="w-14 h-14" />
        </Button>
      ) : (
        <Card className="p-6 shadow-xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2 pb-3 border-b">
              <h3 className="font-bold text-2xl">Idioma</h3>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar seletor de idioma"
                className="text-2xl"
              >
                ✕
              </Button>
            </div>
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? 'default' : 'outline'}
                className="justify-start gap-4 h-16 text-xl"
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span>{lang.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
