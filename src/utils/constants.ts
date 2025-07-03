import { ParentRole, GameStyle, FinancialLevel } from '../types/game';

// Game configuration
export const GAME_CONFIG = {
  MAX_CHILD_AGE: 18,
  MAX_REQUIREMENTS_LENGTH: 200,
  DEFAULT_FINANCIAL_LEVEL: 5 as FinancialLevel,
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  AUTO_SAVE_INTERVAL_MS: 30 * 1000, // 30 seconds
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://www.babysim.fun/api',
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'wss://www.babysim.fun/ws',
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// Mock API configuration
export const MOCK_CONFIG = {
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.DEV,
  DELAY_MS: parseInt(import.meta.env.VITE_MOCK_DELAY_MS || '1200'),
  ENABLE_WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET === 'true',
  ENABLE_PHOTO_GENERATION: import.meta.env.VITE_ENABLE_PHOTO_GENERATION === 'true',
} as const;

// Parent role options
export const PARENT_ROLES: Array<{ id: ParentRole; label: string; emoji: string }> = [
  { id: 'Random', label: 'Random', emoji: '🎲' },
  { id: 'Mom', label: 'Mom', emoji: '👩' },
  { id: 'Dad', label: 'Dad', emoji: '👨' },
  { id: 'Non-binary', label: 'Non-binary Parent', emoji: '🧑' },
] as const;

// Game style options
export const GAME_STYLES: Array<{ id: GameStyle; label: string; emoji: string; description: string }> = [
  { 
    id: 'Realistic', 
    label: 'Realistic', 
    emoji: '🏠',
    description: 'Based on real-world parenting challenges and outcomes'
  },
  { 
    id: 'Fantasy', 
    label: 'Fantasy', 
    emoji: '🧙',
    description: 'Magical elements and fantastical scenarios'
  },
  { 
    id: 'Thrilling', 
    label: 'Thrilling', 
    emoji: '⚡',
    description: 'High-stakes dramatic situations and adventures'
  },
] as const;

// Financial status levels
export const FINANCIAL_LEVELS: Record<FinancialLevel, { label: string; emoji: string; color: string }> = {
  1: { label: 'Very Poor', emoji: '💸', color: 'text-red-700' },
  2: { label: 'Poor', emoji: '💰', color: 'text-red-600' },
  3: { label: 'Below Average', emoji: '💵', color: 'text-orange-600' },
  4: { label: 'Average', emoji: '💴', color: 'text-yellow-600' },
  5: { label: 'Middle', emoji: '💶', color: 'text-blue-600' },
  6: { label: 'Upper Middle', emoji: '💷', color: 'text-green-600' },
  7: { label: 'Comfortable', emoji: '💳', color: 'text-green-700' },
  8: { label: 'Well-off', emoji: '💎', color: 'text-emerald-700' },
  9: { label: 'Wealthy', emoji: '👑', color: 'text-purple-700' },
  10: { label: 'Very Wealthy', emoji: '🏰', color: 'text-purple-800' },
} as const;

// Child development stages
export const CHILD_STAGES: Record<number, { label: string; emoji: string; description: string }> = {
  0: { label: 'Newborn', emoji: '👶', description: 'First weeks of life' },
  1: { label: 'Infant', emoji: '🍼', description: 'Learning basic skills' },
  2: { label: 'Toddler', emoji: '🧸', description: 'Walking and talking' },
  3: { label: 'Preschooler', emoji: '🎨', description: 'Creativity and curiosity' },
  4: { label: 'Preschooler', emoji: '📚', description: 'Preparing for school' },
  5: { label: 'Elementary', emoji: '🎒', description: 'Starting formal education' },
  6: { label: 'Elementary', emoji: '✏️', description: 'Building foundational skills' },
  7: { label: 'Elementary', emoji: '🔬', description: 'Developing interests' },
  8: { label: 'Elementary', emoji: '🏃', description: 'Physical and social growth' },
  9: { label: 'Elementary', emoji: '🌟', description: 'Discovering talents' },
  10: { label: 'Middle School', emoji: '📱', description: 'Early adolescence' },
  11: { label: 'Middle School', emoji: '👥', description: 'Peer relationships' },
  12: { label: 'Middle School', emoji: '🎭', description: 'Identity exploration' },
  13: { label: 'High School', emoji: '🚗', description: 'Increasing independence' },
  14: { label: 'High School', emoji: '📖', description: 'Academic focus' },
  15: { label: 'High School', emoji: '💼', description: 'Future planning' },
  16: { label: 'High School', emoji: '🎓', description: 'College preparation' },
  17: { label: 'High School', emoji: '🗳️', description: 'Young adult decisions' },
  18: { label: 'Adult', emoji: '🎊', description: 'Ready for independence' },
} as const;

// Decision option letters
export const DECISION_OPTIONS = ['A', 'B', 'C', 'D'] as const;
export const CUSTOM_OPTION = 'E' as const;

// Default placeholder texts
export const PLACEHOLDERS = {
  REQUIREMENTS: 'I want an ugly cute kid',
  CUSTOM_DECISION: 'Enter your idea...',
  EMAIL_SUBSCRIPTION: "If you'd like to keep in touch...",
} as const;

// UI text content
export const UI_TEXT = {
  TITLE: 'The Baby Simulator',
  SUBTITLE: 'A text-based game about the parenting journey from birth to adulthood',
  GAME_INTRO_TITLE: '🍼 Game Introduction',
  GAME_INTRO_TEXT: [
    'In this game, you will play as a parent raising your baby until 18 years old.',
    'Each year you will face a parenting choice that will deeply affect your child\'s personality, interests, and future development.'
  ],
  GAME_FEATURES_TITLE: '✨ Game Features',
  GAME_FEATURES: [
    'AI-generated character backgrounds, parenting scenarios, and storylines',
    'Every decision affects your child\'s path',
    'See a timeline of your parenting journey until your child reaches adulthood at 18, and reflect on what kind of parent you are',
    '[Updated + in Beta] Generate a photo of your 18-year-old child at a style of your liking'
  ],
  CHOOSE_ROLE: 'Choose Your Role',
  CHOOSE_STYLE: 'Choose a Style',
  SPECIAL_REQUIREMENTS: 'Special Requirements (Optional)',
  REQUIREMENTS_HINT: 'You can describe what you\'d like for yourself or your baby. AI will try to meet them. (Of course, AI can sometimes be unpredictable too, just like babies...)',
  READY_QUESTION: 'Ready to take on the challenge to become a parent?',
  START_BUTTON: "I'm ready to meet my baby!",
  RESTART_BUTTON: 'Give up {childName} and restart',
  CONTINUE_BUTTON: 'Continue',
  TIMELINE_TITLE: 'Growth Timeline',
  FINANCIAL_STATUS: 'Check current financial status',
  CUSTOM_OPTION_TEXT: 'I have other ideas',
  CHARACTER_COUNTER: '{count}/{max} characters',
  CUSTOM_SUBMIT: "I'll do this",
  GENERATING: 'Generating...',
  DEVELOPER_MESSAGE_TITLE: 'Words from developers',
  PRIVACY_POLICY: 'Privacy Policy',
  TERMS_OF_SERVICE: 'Terms of Service',
  DISCLAIMER: 'Disclaimer',
  SUBSCRIBE: 'Subscribe',
  CLOSE: 'Close',
  FEEDBACK_EMAIL: 'Send Feedback via Email',
  INFO_CENTER: 'Open Information Center',
  LANGUAGE_TOGGLE: 'Switch to 中文',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  SESSION_EXPIRED: 'Your session has expired. Please restart the game.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  GENERATION_FAILED: 'Failed to generate content. Please try again.',
  INVALID_DECISION: 'Invalid decision selected. Please choose a valid option.',
  CUSTOM_TEXT_TOO_LONG: 'Custom text is too long. Please keep it under {max} characters.',
  CUSTOM_TEXT_EMPTY: 'Please enter your custom idea before submitting.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait a Moment before trying again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SESSION_CREATED: 'Game session created successfully!',
  CHARACTER_GENERATED: 'Your family has been created!',
  DECISION_SAVED: 'Your decision has been recorded.',
  PROGRESS_SAVED: 'Game progress saved automatically.',
} as const;

// Analytics event names
export const ANALYTICS_EVENTS = {
  GAME_STARTED: 'game_started',
  CHARACTER_GENERATED: 'character_generated',
  DECISION_MADE: 'decision_made',
  CUSTOM_DECISION: 'custom_decision_entered',
  TIMELINE_VIEWED: 'timeline_viewed',
  GAME_RESTARTED: 'game_restarted',
  INFO_OPENED: 'info_center_opened',
  FINANCIAL_CHECKED: 'financial_status_checked',
  LANGUAGE_TOGGLED: 'language_toggled',
  DECISION_HOVERED: 'decision_hovered',
  GAME_COMPLETED: 'game_completed',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'babysim_game_state',
  USER_PREFERENCES: 'babysim_user_preferences',
  ANALYTICS_ID: 'babysim_analytics_id',
} as const;

// CSS classes for consistent styling
export const CSS_CLASSES = {
  BUTTON_PRIMARY: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  BUTTON_SECONDARY: 'border-2 border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50',
  BUTTON_SELECTED: 'border-2 border-blue-500 bg-blue-50 text-blue-700 px-6 py-3 rounded-lg font-medium',
  CARD: 'bg-white rounded-lg p-6 shadow-lg',
  TIMELINE_ITEM: 'bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500',
  DECISION_BUTTON: 'w-full text-left p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all',
  INPUT: 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors',
  TEXTAREA: 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-vertical transition-colors',
  AGE_INDICATOR: 'bg-blue-500 text-white px-4 py-2 rounded-lg text-center min-w-[120px]',
  LOADING_SPINNER: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500',
} as const;

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FADE_IN: 300,
  SLIDE_IN: 400,
  BUTTON_HOVER: 200,
  MODAL_OPEN: 250,
  TIMELINE_ITEM: 500,
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
} as const;