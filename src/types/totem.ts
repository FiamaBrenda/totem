// Tipos e interfaces para o sistema de totem

export type PersonaId = 
  | 'clementina'
  | 'aruana'
  | 'mariana'
  | 'samuel'
  | 'aissatou'
  | 'damiao'
  | 'julia'
  | 'kadu';

export type AccessibilityMode = 
  | 'normal'
  | 'high-contrast'
  | 'large-text'
  | 'low-vision'
  | 'neuro'
  | 'blind'
  | 'deaf'
  | 'low-literacy';

export type ServiceType = 'rg' | 'cpf' | 'both';

export type PaymentMethod = 'pix' | 'card' | 'boleto';

export interface Persona {
  id: PersonaId;
  description: string;
  color: string;
  icon: string;
  accessibility: AccessibilityMode[];
  language: {
    style: 'simple' | 'visual' | 'detailed' | 'calm';
    speed: 'slow' | 'normal' | 'fast';
    audioSupport: boolean;
    libras: boolean;
    icons: boolean;
  };
}

export interface TotemState {
  currentScreen: string;
  selectedPersona: Persona | null;
  accessibilityModes: AccessibilityMode[];
  serviceType: ServiceType | null;
  userData: {
    name?: string;
    socialName?: string;
    indigenousName?: string;
    traditionalName?: string;
    cpf: string;
    phone: string;
    email?: string;
  };
  documents: string[];
  photoUrl?: string;
  paymentMethod: PaymentMethod | null;
  protocol?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  libras: boolean;
  audioDescriptions: boolean;
  keyboardOnly: boolean;
  dyslexiaFont: boolean;
}
