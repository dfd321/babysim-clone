/**
 * Security & Validation Service
 * Provides comprehensive input sanitization, data validation, and security measures
 */


export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export interface ValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowedCharacters?: RegExp;
  required?: boolean;
  trim?: boolean;
}

export class ValidationService {
  // XSS Prevention patterns
  private static readonly XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ];

  // SQL Injection patterns (for future backend integration)
  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /--.*$/gm, // SQL comments
    /\/\*[\s\S]*?\*\//g, // Multi-line comments
    /;.*$/gm // Multiple statements
  ];

  // File path traversal patterns
  private static readonly PATH_TRAVERSAL_PATTERNS = [
    /\.\./g,
    /\.\.%2F/gi,
    /\.\.%5C/gi,
    /%2e%2e/gi
  ];

  /**
   * Sanitize text input to prevent XSS attacks
   */
  static sanitizeText(input: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    let sanitized = input;

    // Check for required
    if (options.required && !input.trim()) {
      errors.push('This field is required');
      return { isValid: false, errors };
    }

    // Trim if specified
    if (options.trim) {
      sanitized = sanitized.trim();
    }

    // Check length constraints
    if (options.minLength && sanitized.length < options.minLength) {
      errors.push(`Minimum length is ${options.minLength} characters`);
    }

    if (options.maxLength && sanitized.length > options.maxLength) {
      errors.push(`Maximum length is ${options.maxLength} characters`);
      // Truncate but still mark as invalid
      sanitized = sanitized.substring(0, options.maxLength);
    }

    // Check for XSS patterns
    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.test(sanitized)) {
        errors.push('Invalid characters or patterns detected');
        sanitized = sanitized.replace(pattern, '');
      }
    }

    // Check allowed characters if specified
    if (options.allowedCharacters) {
      const invalidChars = sanitized.split('').filter(char => !options.allowedCharacters!.test(char));
      if (invalidChars.length > 0) {
        errors.push(`Invalid characters found: ${invalidChars.join(', ')}`);
        sanitized = sanitized.split('').filter(char => options.allowedCharacters!.test(char)).join('');
      }
    }

    // HTML encode special characters
    sanitized = this.htmlEncode(sanitized);

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate email addresses
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    let sanitized = email.trim().toLowerCase();

    // Basic email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(sanitized)) {
      errors.push('Invalid email format');
    }

    // Check for XSS in email
    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.test(sanitized)) {
        errors.push('Invalid characters in email');
        return { isValid: false, errors };
      }
    }

    // Additional security checks
    if (sanitized.length > 254) { // RFC 5321
      errors.push('Email address too long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate save game name
   */
  static validateSaveName(name: string): ValidationResult {
    return this.sanitizeText(name, {
      maxLength: 50,
      minLength: 1,
      required: true,
      trim: true,
      allowedCharacters: /^[a-zA-Z0-9\s\-_()]+$/
    });
  }

  /**
   * Validate special requirements input
   */
  static validateRequirements(requirements: string): ValidationResult {
    return this.sanitizeText(requirements, {
      maxLength: 500,
      trim: true
    });
  }

  /**
   * Validate and sanitize JSON data for save/load operations
   */
  static validateSaveData(data: string): ValidationResult {
    const errors: string[] = [];

    try {
      // Check for suspicious patterns before parsing
      for (const pattern of [...this.XSS_PATTERNS, ...this.PATH_TRAVERSAL_PATTERNS]) {
        if (pattern.test(data)) {
          errors.push('Invalid or suspicious patterns in save data');
          return { isValid: false, errors };
        }
      }

      // Attempt to parse JSON
      const parsed = JSON.parse(data);

      // Validate structure
      if (!parsed.saveGame || !parsed.version) {
        errors.push('Invalid save file structure');
        return { isValid: false, errors };
      }

      // Deep validate game state
      const gameStateValidation = this.validateGameState(parsed.saveGame.gameState);
      if (!gameStateValidation.isValid) {
        errors.push(...gameStateValidation.errors);
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: parsed
      };
    } catch (e) {
      errors.push('Invalid JSON format');
      return { isValid: false, errors };
    }
  }

  /**
   * Validate game state integrity
   */
  static validateGameState(gameState: any): ValidationResult {
    const errors: string[] = [];

    // Required fields
    const requiredFields = ['currentAge', 'phase', 'timeline', 'happiness', 'finances'];
    for (const field of requiredFields) {
      if (!(field in gameState)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Type validations
    if (typeof gameState.currentAge !== 'number' || gameState.currentAge < 0 || gameState.currentAge > 100) {
      errors.push('Invalid age value');
    }

    if (typeof gameState.happiness !== 'number' || gameState.happiness < 0 || gameState.happiness > 100) {
      errors.push('Invalid happiness value');
    }

    if (typeof gameState.finances !== 'number') {
      errors.push('Invalid finances value');
    }

    if (!Array.isArray(gameState.timeline)) {
      errors.push('Timeline must be an array');
    }

    // Validate phase
    const validPhases = ['onboarding', 'characterGeneration', 'gameplay', 'gameEnd'];
    if (!validPhases.includes(gameState.phase)) {
      errors.push('Invalid game phase');
    }

    // Deep validation of character data
    if (gameState.parentCharacter) {
      const parentValidation = this.validateCharacterData(gameState.parentCharacter, 'parent');
      errors.push(...parentValidation.errors);
    }

    if (gameState.childCharacter) {
      const childValidation = this.validateCharacterData(gameState.childCharacter, 'child');
      errors.push(...childValidation.errors);
    }

    // Validate children object if multiple children
    if (gameState.children) {
      if (typeof gameState.children !== 'object') {
        errors.push('Invalid children data structure');
      } else {
        Object.entries(gameState.children).forEach(([id, child]: [string, any]) => {
          const childValidation = this.validateCharacterData(child, `child_${id}`);
          errors.push(...childValidation.errors);
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate character data integrity
   */
  private static validateCharacterData(character: any, context: string): ValidationResult {
    const errors: string[] = [];

    if (!character.name || typeof character.name !== 'string') {
      errors.push(`${context}: Invalid character name`);
    } else {
      // Sanitize character name
      const nameValidation = this.sanitizeText(character.name, {
        maxLength: 50,
        required: true,
        allowedCharacters: /^[a-zA-Z0-9\s\-']+$/
      });
      if (!nameValidation.isValid) {
        errors.push(`${context}: ${nameValidation.errors.join(', ')}`);
      }
    }

    if (character.age !== undefined && (typeof character.age !== 'number' || character.age < 0 || character.age > 150)) {
      errors.push(`${context}: Invalid age`);
    }

    // Validate traits if present
    if (character.personalityTraits && Array.isArray(character.personalityTraits)) {
      character.personalityTraits.forEach((trait: any, index: number) => {
        if (!trait.id || !trait.name || typeof trait.value !== 'number') {
          errors.push(`${context}: Invalid trait at index ${index}`);
        } else if (trait.value < 0 || trait.value > 100) {
          errors.push(`${context}: Trait value out of range at index ${index}`);
        }
      });
    }

    // Validate skills if present
    if (character.skills && Array.isArray(character.skills)) {
      character.skills.forEach((skill: any, index: number) => {
        if (!skill.id || !skill.name || typeof skill.level !== 'number') {
          errors.push(`${context}: Invalid skill at index ${index}`);
        } else if (skill.level < 1 || skill.level > 10) {
          errors.push(`${context}: Skill level out of range at index ${index}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * HTML encode special characters
   */
  private static htmlEncode(str: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return str.replace(/[&<>"'`=\/]/g, (match) => htmlEntities[match] || match);
  }

  /**
   * Validate file upload for save game import
   */
  static validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];

    // Check file type
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      errors.push('Only JSON files are allowed');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('File size exceeds 5MB limit');
    }

    // Check filename for suspicious patterns
    const filenameValidation = this.sanitizeText(file.name, {
      allowedCharacters: /^[a-zA-Z0-9\s\-_.()]+$/
    });
    if (!filenameValidation.isValid) {
      errors.push('Invalid filename');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate secure ID for saves
   */
  static generateSecureId(): string {
    const timestamp = Date.now();
    const random = crypto.getRandomValues(new Uint32Array(2));
    return `save_${timestamp}_${random[0].toString(36)}_${random[1].toString(36)}`;
  }

  /**
   * Validate and sanitize custom decision input
   */
  static validateCustomDecision(decision: string): ValidationResult {
    return this.sanitizeText(decision, {
      maxLength: 200,
      minLength: 1,
      required: true,
      trim: true
    });
  }

  /**
   * Create a content security policy for the app
   */
  static getContentSecurityPolicy(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: unsafe-inline and eval should be removed in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ');
  }
}

// Export singleton instance
export const validationService = new ValidationService();