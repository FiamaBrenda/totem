import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onHome?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  onHome,
  showBackButton = true,
  showHomeButton = true,
}: ScreenHeaderProps) => {
  return (
    <header className="bg-card border-b-2 border-border p-6 shadow-sm" role="banner">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex gap-3">
            {showBackButton && onBack && (
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="gap-2"
                aria-label="Voltar para tela anterior"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                <span>Voltar</span>
              </Button>
            )}

            {showHomeButton && onHome && (
              <Button
                variant="outline"
                size="lg"
                onClick={onHome}
                className="gap-2"
                aria-label="Voltar ao início"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                <span>Início</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
