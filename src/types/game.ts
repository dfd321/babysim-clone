// Core TypeScript definitions for BabySim game
export type ParentRole = 'Random' | 'Mom' | 'Dad' | 'Non-binary';
export type GameStyle = 'Realistic' | 'Fantasy' | 'Thrilling';
export type GamePhase = 'setup' | 'character-gen' | 'gameplay' | 'ended';
export type FinancialLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Character interfaces
export interface ParentCharacter {
  name: string;
  age: number;
  profession: string;
  background: string;
  financialLevel: FinancialLevel;
}

export interface ChildCharacter {
  name: string;
  age: number;
  gender: string;
  personality: string;
  traits: string[];
  interests: string[];
}

// Game state management
export interface GameState {
  phase: GamePhase;
  role: ParentRole | null;
  gameStyle: GameStyle | null;
  specialRequirements: string;
  parentCharacter: ParentCharacter | null;
  childCharacter: ChildCharacter | null;
  currentAge: number;
  timeline: TimelineEntry[];
  finances: number;
  happiness: number;
  sessionId?: string;
}

export interface TimelineEntry {
  age: number;
  stage: string;
  scenario: string;
  choice: string;
  consequence: string;
  effects: {
    happiness: number;
    finances: number;
    development: string[];
  };
}

// Scenario and decision interfaces
export interface ScenarioOption {
  label: string;
  consequence: string;
  effects?: {
    happiness?: number;
    finances?: number;
    development?: string[];
  };
}

export interface Scenario {
  title: string;
  description: string;
  options: ScenarioOption[];
  customAllowed?: boolean;
}

export interface ScenarioData {
  [age: number]: {
    [style in GameStyle]: Scenario;
  };
}

// API request/response interfaces
export interface SessionInitRequest {
  role: ParentRole;
  gameStyle: GameStyle;
  specialRequirements?: string;
}

export interface SessionInitResponse {
  sessionId: string;
  parentCharacter: ParentCharacter;
  childCharacter: ChildCharacter;
  success: boolean;
  message?: string;
}

export interface CharacterGenerationData {
  parentCharacter: ParentCharacter;
  childCharacter: ChildCharacter;
}

export interface DecisionRequest {
  sessionId: string;
  age: number;
  choice: string;
  customResponse?: string;
}

export interface DecisionResponse {
  consequence: string;
  effects: {
    happiness: number;
    finances: number;
    development: string[];
  };
  nextAge?: number;
  gameEnded?: boolean;
  success: boolean;
  message?: string;
}

export interface DecisionData {
  consequence: string;
  effects: TimelineEntry['effects'];
  nextAge?: number;
  gameEnded?: boolean;
}

// Component prop interfaces
export interface RequirementsInputProps {
  requirements: string;
  onRequirementsChange: (requirements: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export interface RoleSelectorProps {
  selectedRole: ParentRole | null;
  onRoleSelect: (role: ParentRole) => void;
  disabled?: boolean;
}

export interface StyleSelectorProps {
  selectedStyle: GameStyle | null;
  onStyleSelect: (style: GameStyle) => void;
  disabled?: boolean;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  currentAge: number;
  maxAge?: number;
}

export interface DecisionInterfaceProps {
  scenario: Scenario;
  onDecision: (choice: string, consequence: string) => void;
  onCustomDecision: (customChoice: string) => void;
  disabled?: boolean;
}

export interface OnboardingPhaseProps {
  gameState: GameState;
  onRoleSelect: (role: ParentRole) => void;
  onStyleSelect: (style: GameStyle) => void;
  onRequirementsChange: (requirements: string) => void;
  onStartGame: () => void;
}

export interface TimelineProps {
  timeline: TimelineEntry[];
  currentAge: number;
}

export interface GameplayPhaseProps {
  gameState: GameState;
  onDecision: (choice: string, consequence: string, effects: any) => void;
  onRestart: () => void;
}

// Error handling
export class GameAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GameAPIError';
  }
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'typing' | 'scenario_ready' | 'error' | 'session_update';
  data?: any;
  sessionId?: string;
}
