import { useState, useEffect } from 'react';
import { AccessibilityMenu } from '@/components/totem/AccessibilityMenu';
import { LanguageSelector } from '@/components/totem/LanguageSelector';
import { PersonaCard } from '@/components/totem/PersonaCard';
import { ScreenHeader } from '@/components/totem/ScreenHeader';
import { ProgressBar } from '@/components/totem/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { personas } from '@/data/personas';
import { AccessibilitySettings, TotemState, Persona } from '@/types/totem';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/i18n/translations';
import { 
  FileText, 
  Camera, 
  CreditCard, 
  CheckCircle2,
  Volume2,
  IdCard,
  User
} from 'lucide-react';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');
  const { t } = useTranslation(currentLanguage);
  
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    libras: false,
    audioDescriptions: false,
    keyboardOnly: false,
    dyslexiaFont: false,
  });

  const [totemState, setTotemState] = useState<TotemState>({
    currentScreen: 'welcome',
    selectedPersona: null,
    accessibilityModes: [],
    serviceType: null,
    userData: {
      name: '',
      cpf: '',
      phone: '',
    },
    documents: [],
    paymentMethod: null,
  });

  // Aplica modo neurodivergente se a persona Samuel for selecionada
  useEffect(() => {
    if (selectedPersona?.id === 'samuel') {
      document.body.classList.add('neuro-mode');
    } else {
      document.body.classList.remove('neuro-mode');
    }
  }, [selectedPersona]);

  // Anúncio de tela para leitores de tela
  useEffect(() => {
    if (accessibilitySettings.screenReader) {
      announceScreen();
    }
  }, [currentScreen, accessibilitySettings.screenReader]);

  const announceScreen = () => {
    const screenTitles: Record<string, string> = {
      welcome: 'Bem-vindo ao Totem de Autoatendimento. Por favor, selecione como deseja ser atendido.',
      service: 'Selecione o serviço desejado: RG ou CPF',
      documents: 'Documentos necessários para o atendimento',
      data: 'Preencha seus dados pessoais',
      photo: 'Captura de foto',
      payment: 'Escolha a forma de pagamento',
      protocol: 'Atendimento concluído com sucesso',
    };

    const announcement = screenTitles[currentScreen] || '';
    const ariaLive = document.getElementById('aria-live-announcer');
    if (ariaLive) {
      ariaLive.textContent = announcement;
    }
  };

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    setTotemState({ ...totemState, selectedPersona: persona });
    setCurrentScreen('service');
  };

  const handleServiceSelect = (service: 'rg' | 'cpf') => {
    setTotemState({ ...totemState, serviceType: service });
    setCurrentScreen('documents');
  };

  const handleBack = () => {
    const screens = ['welcome', 'service', 'documents', 'data', 'photo', 'payment', 'protocol'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex > 0) {
      setCurrentScreen(screens[currentIndex - 1]);
    }
  };

  const handleHome = () => {
    setCurrentScreen('welcome');
    setSelectedPersona(null);
    setTotemState({
      currentScreen: 'welcome',
      selectedPersona: null,
      accessibilityModes: [],
      serviceType: null,
      userData: { name: '', cpf: '', phone: '' },
      documents: [],
      paymentMethod: null,
    });
  };

  const steps = [
    t('steps.service'),
    t('steps.documents'),
    t('steps.data'),
    t('steps.photo'),
    t('steps.payment'),
    t('steps.protocol'),
  ];
  const currentStepIndex = ['service', 'documents', 'data', 'photo', 'payment', 'protocol'].indexOf(currentScreen) + 1;

  // Função para ler texto em voz alta
  const speakText = (text: string) => {
    // Cancela qualquer fala em andamento
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Velocidade um pouco mais lenta para melhor compreensão
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  // Função para explicar os documentos necessários
  const explainDocuments = () => {
    const serviceType = totemState.serviceType === 'rg' ? 'RG' : 'CPF';
    const text = `Para emitir sua ${serviceType}, você vai precisar dos seguintes documentos: 
    Primeiro, certidão de nascimento ou casamento, original ou cópia autenticada. 
    Segundo, comprovante de residência atualizado. 
    E terceiro, documento anterior, ${serviceType} antigo, se você tiver.`;
    
    speakText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Anunciador para leitores de tela */}
      <div
        id="aria-live-announcer"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Seletor de Idioma */}
      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => setCurrentLanguage(lang)}
      />

      {/* Menu de Acessibilidade */}
      <AccessibilityMenu
        settings={accessibilitySettings}
        onSettingsChange={setAccessibilitySettings}
        language={currentLanguage}
      />

      {/* Tela de Boas-vindas - Seleção de Persona */}
      {currentScreen === 'welcome' && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                {t('welcomeTitle')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('welcomeSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {personas.map((persona, index) => (
                <div
                  key={persona.id}
                  className="animate-fade-in h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PersonaCard
                    persona={{
                      ...persona,
                      description: t(`personas.${persona.id}.description`),
                    }}
                    onSelect={() => handlePersonaSelect(persona)}
                    largeText={accessibilitySettings.largeText}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tela de Seleção de Serviço */}
      {currentScreen === 'service' && selectedPersona && (
        <>
          <ScreenHeader
            title={t('serviceTitle')}
            subtitle={t('serviceSubtitle')}
            onBack={handleBack}
            onHome={handleHome}
            showBackButton={false}
          />
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} steps={steps} />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="p-12 cursor-pointer hover:scale-105 transition-all border-2 hover:border-primary hover:shadow-xl"
                onClick={() => handleServiceSelect('rg')}
                role="button"
                tabIndex={0}
                aria-label="Emitir segunda via do RG - Registro Geral"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleServiceSelect('rg');
                  }
                }}
              >
                <div className="flex flex-col items-center text-center gap-6">
                  <IdCard className="w-24 h-24 text-primary" aria-hidden="true" />
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{t('rgTitle')}</h2>
                    <p className="text-lg text-muted-foreground">
                      {t('rgDescription')}
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-12 cursor-pointer hover:scale-105 transition-all border-2 hover:border-secondary hover:shadow-xl"
                onClick={() => handleServiceSelect('cpf')}
                role="button"
                tabIndex={0}
                aria-label="Emitir segunda via do CPF - Cadastro de Pessoa Física"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleServiceSelect('cpf');
                  }
                }}
              >
                <div className="flex flex-col items-center text-center gap-6">
                  <User className="w-24 h-24 text-secondary" aria-hidden="true" />
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{t('cpfTitle')}</h2>
                    <p className="text-lg text-muted-foreground">
                      {t('cpfDescription')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Tela de Documentos Necessários */}
      {currentScreen === 'documents' && (
        <>
          <ScreenHeader
            title={t('documentsTitle')}
            subtitle={t('documentsSubtitle')}
            onBack={handleBack}
            onHome={handleHome}
          />
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} steps={steps} />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {t('documentsFor')} {totemState.serviceType === 'rg' ? 'RG' : 'CPF'}, {t('documentsBring')}
                    </h3>
                    <ul className="space-y-3 text-lg" role="list">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <span>{t('doc1')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <span>{t('doc2')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <span>{t('doc3')} ({totemState.serviceType === 'rg' ? 'RG' : 'CPF'} {t('doc3Suffix')})</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {selectedPersona?.language.audioSupport && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 mt-6"
                    aria-label={t('listenExplanation')}
                    onClick={explainDocuments}
                  >
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                    <span>{t('listenExplanation')}</span>
                  </Button>
                )}
              </Card>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => setCurrentScreen('data')}
                  className="flex-1"
                >
                  {t('haveDocuments')}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tela de Coleta de Dados */}
      {currentScreen === 'data' && (
        <>
          <ScreenHeader
            title={t('dataTitle')}
            subtitle={t('dataSubtitle')}
            onBack={handleBack}
            onHome={handleHome}
          />
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} steps={steps} />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCurrentScreen('photo');
                  }}
                >
                  <div>
                    <Label htmlFor="name" className="text-lg font-semibold">
                      {t('fullName')}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      className="mt-2 text-lg h-14"
                      value={totemState.userData.name}
                      onChange={(e) =>
                        setTotemState({
                          ...totemState,
                          userData: { ...totemState.userData, name: e.target.value },
                        })
                      }
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <Label htmlFor="social-name" className="text-lg font-semibold">
                      {t('socialName')}
                    </Label>
                    <Input
                      id="social-name"
                      type="text"
                      className="mt-2 text-lg h-14"
                      value={totemState.userData.socialName || ''}
                      onChange={(e) =>
                        setTotemState({
                          ...totemState,
                          userData: { ...totemState.userData, socialName: e.target.value },
                        })
                      }
                    />
                  </div>

                  {selectedPersona?.id === 'aruana' && (
                    <div>
                      <Label htmlFor="indigenous-name" className="text-lg font-semibold">
                        {t('indigenousName')}
                      </Label>
                      <Input
                        id="indigenous-name"
                        type="text"
                        className="mt-2 text-lg h-14"
                        value={totemState.userData.indigenousName || ''}
                        onChange={(e) =>
                          setTotemState({
                            ...totemState,
                            userData: { ...totemState.userData, indigenousName: e.target.value },
                          })
                        }
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="cpf" className="text-lg font-semibold">
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      className="mt-2 text-lg h-14"
                      value={totemState.userData.cpf}
                      onChange={(e) =>
                        setTotemState({
                          ...totemState,
                          userData: { ...totemState.userData, cpf: e.target.value },
                        })
                      }
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-lg font-semibold">
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      className="mt-2 text-lg h-14"
                      value={totemState.userData.phone}
                      onChange={(e) =>
                        setTotemState({
                          ...totemState,
                          userData: { ...totemState.userData, phone: e.target.value },
                        })
                      }
                      aria-required="true"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    {t('continue')}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Tela de Foto */}
      {currentScreen === 'photo' && (
        <>
          <ScreenHeader
            title={t('photoTitle')}
            subtitle={t('photoSubtitle')}
            onBack={handleBack}
            onHome={handleHome}
          />
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} steps={steps} />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <Camera className="w-32 h-32 text-primary" aria-hidden="true" />
                  <p className="text-xl text-center text-muted-foreground">
                    {t('photoInstruction')}
                  </p>
                  <div className="w-full max-w-md aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">{t('cameraArea')}</span>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setCurrentScreen('payment')}
                    className="w-full"
                  >
                    {t('capturePhoto')}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Tela de Pagamento */}
      {currentScreen === 'payment' && (
        <>
          <ScreenHeader
            title={t('paymentTitle')}
            subtitle={t('paymentSubtitle')}
            onBack={handleBack}
            onHome={handleHome}
          />
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} steps={steps} />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'pix', label: 'PIX', icon: '💳' },
                  { id: 'card', label: 'Cartão', icon: '💳' },
                  { id: 'boleto', label: 'Boleto', icon: '📄' },
                ].map((method) => (
                  <Card
                    key={method.id}
                    className="p-8 cursor-pointer hover:scale-105 transition-all border-2 hover:border-primary hover:shadow-xl"
                    onClick={() => {
                      setTotemState({ ...totemState, paymentMethod: method.id as any });
                      setCurrentScreen('protocol');
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Pagar com ${method.label}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setTotemState({ ...totemState, paymentMethod: method.id as any });
                        setCurrentScreen('protocol');
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-5xl" aria-hidden="true">{method.icon}</div>
                      <span className="text-2xl font-bold">{method.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tela de Protocolo */}
      {currentScreen === 'protocol' && (
        <>
          <ScreenHeader
            title={t('protocolTitle')}
            subtitle={t('protocolSubtitle')}
            onHome={handleHome}
            showBackButton={false}
          />
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} steps={steps} />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <Card className="p-12 text-center">
                <CheckCircle2 className="w-24 h-24 text-success mx-auto mb-6" aria-hidden="true" />
                <h2 className="text-4xl font-bold text-foreground mb-4">{t('allSet')}</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('protocolGenerated')}
                </p>
                
                <div className="bg-muted p-8 rounded-lg mb-8">
                  <p className="text-sm text-muted-foreground mb-2">{t('protocolNumber')}</p>
                  <p className="text-4xl font-mono font-bold text-foreground">
                    {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </p>
                </div>

                <p className="text-lg text-muted-foreground mb-6">
                  {t('protocolSent')}{' '}
                  <strong>{totemState.userData.phone}</strong>
                </p>

                <Button size="lg" onClick={handleHome} className="w-full">
                  {t('finish')}
                </Button>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
