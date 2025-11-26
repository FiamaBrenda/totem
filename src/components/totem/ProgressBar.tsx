interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressBar = ({ currentStep, totalSteps, steps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <nav aria-label="Progresso do atendimento" className="w-full bg-card p-6 border-b border-border">
      <div className="container mx-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-label={`Progresso: ${currentStep} de ${totalSteps} etapas concluídas`}
            />
          </div>
        </div>

        <ol className="flex justify-between text-xs" aria-label="Lista de etapas">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`flex-1 text-center ${
                index + 1 === currentStep
                  ? 'text-primary font-bold'
                  : index + 1 < currentStep
                  ? 'text-success'
                  : 'text-muted-foreground'
              }`}
              aria-current={index + 1 === currentStep ? 'step' : undefined}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
