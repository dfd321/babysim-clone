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

// Character Development System
export interface PersonalityTrait {
  id: string;
  name: string;
  value: number; // 0-100 scale
  category: 'social' | 'emotional' | 'intellectual' | 'physical' | 'creative';
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-10 scale
  experience: number; // 0-100 for next level
  category: 'academic' | 'artistic' | 'athletic' | 'social' | 'practical';
  unlocked: boolean;
}

export interface RelationshipMetric {
  type: 'parent-child' | 'peer' | 'authority' | 'mentor';
  quality: number; // 0-100 scale
  trust: number; // 0-100 scale
  communication: number; // 0-100 scale
  lastUpdated: number; // age when last modified
}

export interface DevelopmentMilestone {
  id: string;
  name: string;
  age: number;
  achieved: boolean;
  impact: {
    traits?: { [traitId: string]: number };
    skills?: { [skillId: string]: number };
    relationships?: { [type: string]: Partial<RelationshipMetric> };
  };
}

export interface ChildCharacter {
  id?: string; // Unique identifier for multiple children support
  name: string;
  age: number;
  gender: string;
  personality: string; // Keep legacy field for compatibility
  traits: string[]; // Keep legacy field for compatibility
  interests: string[];
  
  // Enhanced Character Development
  personalityTraits: PersonalityTrait[];
  skills: Skill[];
  relationships: { [key: string]: RelationshipMetric };
  milestones: DevelopmentMilestone[];
  developmentHistory: DevelopmentEvent[];
}

export interface DevelopmentEvent {
  age: number;
  type: 'trait_change' | 'skill_gain' | 'milestone' | 'relationship_change';
  description: string;
  impact: {
    traits?: { [traitId: string]: number };
    skills?: { [skillId: string]: number };
    relationships?: { [type: string]: Partial<RelationshipMetric> };
  };
}

// Multiple Children Support
export interface SiblingRelationship {
  childId1: string;
  childId2: string;
  bond: number; // 0-100 scale
  rivalry: number; // 0-100 scale
  cooperation: number; // 0-100 scale
  lastInteraction: number; // age when last updated
  relationshipType: 'protective' | 'competitive' | 'neutral' | 'distant' | 'close';
  // Enhanced sibling psychology
  jealousy: number; // 0-100 scale - jealousy/envy levels
  supportiveness: number; // 0-100 scale - emotional support provided
  conflictResolution: 'avoidant' | 'aggressive' | 'collaborative' | 'parent-mediated' | 'independent';
  sharedInterests: string[]; // Common activities and interests
  birthOrderDynamics: {
    dominancePattern: 'older-leads' | 'younger-leads' | 'equal' | 'situational';
    responsibilitySharing: number; // 0-100 how well they share family duties
    protectiveness: number; // 0-100 how protective they are of each other
  };
  developmentalStage: 'parallel-play' | 'cooperative' | 'competitive' | 'independent' | 'mentoring';
}

export interface FamilyDynamics {
  cohesion: number; // 0-100 scale - how well the family works together
  stress: number; // 0-100 scale - family stress level
  favoritism: { [childId: string]: number }; // perceived favoritism by other children
  resourceStrain: number; // 0-100 scale - financial/time pressure
  // Enhanced family psychology modeling
  parentingStyle: 'authoritative' | 'authoritarian' | 'permissive' | 'neglectful' | 'adaptive';
  communicationPattern: 'open' | 'restricted' | 'chaotic' | 'conflict-avoidant' | 'healthy';
  attachmentSecurity: number; // 0-100 scale - overall family attachment quality
  resilience: number; // 0-100 scale - family's ability to handle crises
  emotionalExpressiveness: number; // 0-100 scale - how freely emotions are expressed
  boundaryClarity: number; // 0-100 scale - clear roles and expectations
  traditionalValues: number; // 0-100 scale - emphasis on traditions and cultural values
  adaptability: number; // 0-100 scale - family's flexibility in changing circumstances
}

export interface ChildBirthEvent {
  id: string;
  name: string;
  birthAge: number; // age of family when this child was born
  circumstances: 'planned' | 'surprise' | 'twins' | 'adoption';
  impact: {
    happiness: number;
    finances: number;
    familyDynamics: Partial<FamilyDynamics>;
  };
}

// Game state management
export interface GameState {
  phase: GamePhase;
  role: ParentRole | null;
  gameStyle: GameStyle | null;
  specialRequirements: string;
  parentCharacter: ParentCharacter | null;
  
  // Multiple Children Support
  children: { [childId: string]: ChildCharacter };
  activeChildId: string | null; // currently focused child for scenarios
  siblingRelationships: SiblingRelationship[];
  familyDynamics: FamilyDynamics;
  childBirthEvents: ChildBirthEvent[];
  
  // Achievement & Badge System
  achievements: {
    unlocked: UnlockedAchievement[];
    progress: AchievementProgress[];
    stats: AchievementStats;
  };
  badges: Badge[];
  
  // Legacy support (will be deprecated)
  childCharacter: ChildCharacter | null;
  
  currentAge: number; // family age (time since first child)
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
  childId?: string; // which child this entry relates to
  effects: {
    happiness: number;
    finances: number;
    development: string[];
    familyDynamics?: Partial<FamilyDynamics>;
    siblingImpact?: { [childId: string]: string };
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
    // Enhanced Character Development Effects
    traits?: { [traitId: string]: number };
    skills?: { [skillId: string]: number };
    relationships?: { [type: string]: Partial<RelationshipMetric> };
    milestones?: string[];
    // Multiple Children Effects
    familyDynamics?: Partial<FamilyDynamics>;
    siblingEffects?: { [childId: string]: { 
      traits?: { [traitId: string]: number };
      relationship?: Partial<SiblingRelationship>;
    }};
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

// Save/Load system types
export interface SaveGame {
  id: string;
  name: string;
  gameState: GameState;
  createdAt: Date;
  lastModified: Date;
  version: string;
  thumbnail?: string;
}

export interface SaveGameMetadata {
  id: string;
  name: string;
  createdAt: Date;
  lastModified: Date;
  currentAge: number;
  childName: string;
  parentName: string;
  gameStyle: GameStyle;
  progress: number; // percentage completion
}

export interface SaveGameService {
  saveGame(gameState: GameState, name?: string): Promise<SaveGame>;
  loadGame(saveId: string): Promise<GameState>;
  getAllSaves(): Promise<SaveGameMetadata[]>;
  deleteSave(saveId: string): Promise<void>;
  renameSave(saveId: string, newName: string): Promise<void>;
  exportSave(saveId: string): Promise<string>;
  importSave(saveData: string): Promise<SaveGame>;
  getAutoSave(): Promise<GameState | null>;
  setAutoSave(gameState: GameState): Promise<void>;
}

// Achievement & Badge System Types
export type AchievementCategory = 'family' | 'individual' | 'sibling' | 'parenting' | 'milestone' | 'financial' | 'social';
export type AchievementType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  type: AchievementType;
  rarity: AchievementRarity;
  icon: string;
  requirements: AchievementRequirement[];
  rewards?: AchievementReward[];
  hidden?: boolean; // Hidden until unlocked
  points: number; // Achievement points value
}

export interface AchievementRequirement {
  type: 'trait_level' | 'skill_level' | 'milestone_count' | 'relationship_quality' | 
        'family_stat' | 'age_reached' | 'scenario_choice' | 'financial_level' | 'custom';
  target: string | number;
  value: number;
  childId?: string; // For specific child requirements
  description: string;
}

export interface AchievementReward {
  type: 'points' | 'trait_boost' | 'skill_unlock' | 'financial_bonus' | 'special_scenario';
  value: number;
  description: string;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
  gameAge: number;
  childId?: string;
  progress: number; // 0-100%
  milestoneSnapshot?: {
    childName: string;
    parentName: string;
    familySize: number;
    totalProgress: number;
  };
}

export interface AchievementProgress {
  achievementId: string;
  progress: number; // 0-100%
  currentValues: { [key: string]: number };
  lastUpdated: Date;
  isCompleted: boolean;
  canUnlock: boolean;
}

export interface AchievementStats {
  totalPoints: number;
  achievementsUnlocked: number;
  achievementsAvailable: number;
  rarityCount: { [key in AchievementRarity]: number };
  categoryProgress: { [key in AchievementCategory]: {
    unlocked: number;
    total: number;
    points: number;
  }};
  recentUnlocks: UnlockedAchievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
  unlockedAt?: Date;
  displayOrder: number;
}
