import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Accessibility,
  Volume2,
  Type,
  Eye,
  Ear,
  Brain,
  Languages,
  X,
} from 'lucide-react';
import { AccessibilitySettings } from '@/types/totem';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/i18n/translations';

interface AccessibilityMenuProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
  language?: Language;
}

export const AccessibilityMenu = ({
  settings,
  onSettingsChange,
  language = 'pt',
}: AccessibilityMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(language);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    onSettingsChange(newSettings);

    // Aplica as classes no body
    if (key === 'highContrast') {
      document.body.classList.toggle('high-contrast', newSettings.highContrast);
    }
    if (key === 'largeText') {
      document.body.classList.toggle('large-text', newSettings.largeText);
    }
    if (key === 'dyslexiaFont') {
      document.body.classList.toggle('dyslexia-font', newSettings.dyslexiaFont);
    }
  };

  const accessibilityOptions = [
    {
      key: 'highContrast' as const,
      label: t('highContrast'),
      icon: Eye,
      description: t('highContrastDesc'),
    },
    {
      key: 'largeText' as const,
      label: t('largeText'),
      icon: Type,
      description: t('largeTextDesc'),
    },
    {
      key: 'screenReader' as const,
      label: t('screenReader'),
      icon: Volume2,
      description: t('screenReaderDesc'),
    },
    {
      key: 'libras' as const,
      label: t('vlibras'),
      icon: Languages,
      description: t('vlibrasDesc'),
    },
    {
      key: 'reducedMotion' as const,
      label: t('reducedMotion'),
      icon: Brain,
      description: t('reducedMotionDesc'),
    },
    {
      key: 'dyslexiaFont' as const,
      label: t('dyslexiaFont'),
      icon: Type,
      description: t('dyslexiaFontDesc'),
    },
  ];

  return (
    <>
      {/* Botão flutuante de acessibilidade */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[9999] rounded-full w-24 h-24 bg-primary hover:bg-primary-hover shadow-lg"
        aria-label="Menu de Acessibilidade"
        aria-expanded={isOpen}
        style={{ position: 'fixed' }}
      >
        <Accessibility className="w-14 h-14" aria-hidden="true" />
      </Button>

      {/* Menu de acessibilidade */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-menu-title"
        >
          <Card
            className="absolute top-20 right-4 max-w-md w-full p-6 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="accessibility-menu-title"
                className="text-2xl font-bold text-foreground"
              >
                {t('accessibility')}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label={t('close')}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-4" role="group" aria-label="Opções de acessibilidade">
              {accessibilityOptions.map((option) => {
                const Icon = option.icon;
                const isActive = settings[option.key];

                return (
                  <button
                    key={option.key}
                    onClick={() => toggleSetting(option.key)}
                    className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                      isActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:bg-muted'
                    }`}
                    aria-pressed={isActive}
                    aria-label={`${option.label}: ${isActive ? 'ativado' : 'desativado'}`}
                  >
                    <div className="flex items-start gap-4">
                      <Icon
                        className={`w-8 h-8 mt-1 ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                        aria-hidden="true"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-xl">
                          {option.label}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">
                          {option.description}
                        </div>
                      </div>
                      <div
                        className={`w-16 h-8 rounded-full transition-colors ${
                          isActive ? 'bg-primary' : 'bg-muted'
                        }`}
                        role="presentation"
                      >
                        <div
                          className={`w-7 h-7 rounded-full bg-white shadow-md transition-transform mt-0.5 ${
                            isActive ? 'translate-x-8 ml-0.5' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
