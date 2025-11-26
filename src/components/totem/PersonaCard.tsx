import { Persona } from '@/types/totem';
import { Card } from '@/components/ui/card';

interface PersonaCardProps {
  persona: Persona;
  onSelect: () => void;
  largeText?: boolean;
}

export const PersonaCard = ({ persona, onSelect, largeText = false }: PersonaCardProps) => {
  return (
    <Card
      className="h-full p-8 cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary flex items-center justify-center"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Selecionar atendimento: ${persona.description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex flex-col items-center text-center gap-5">
        <div
          className={`${largeText ? 'w-36 h-36 text-7xl' : 'w-28 h-28 text-5xl'} rounded-full flex items-center justify-center bg-${persona.color}/20 transition-all`}
          aria-hidden="true"
        >
          {persona.icon}
        </div>
        <div>
          <p className={`${largeText ? 'text-3xl' : 'text-2xl'} text-foreground font-semibold transition-all`}>
            {persona.description}
          </p>
        </div>
      </div>
    </Card>
  );
};
