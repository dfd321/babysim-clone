/**
 * Security Test Suite
 * Tests for XSS, injection attacks, data integrity, and input validation
 */

import { ValidationService } from '../../src/services/validationService';
import { saveGameService } from '../../src/services/saveGameService';

describe('Security Tests', () => {
  
  describe('XSS Prevention', () => {
    test('should sanitize script tags', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello World';
      const result = ValidationService.sanitizeText(maliciousInput);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid characters or patterns detected');
      expect(result.sanitizedValue).not.toContain('<script');
      expect(result.sanitizedValue).not.toContain('alert');
    });

    test('should sanitize iframe tags', () => {
      const maliciousInput = '<iframe src="javascript:alert(1)"></iframe>';
      const result = ValidationService.sanitizeText(maliciousInput);
      
      expect(result.isValid).toBe(false);
      expect(result.sanitizedValue).not.toContain('<iframe');
      expect(result.sanitizedValue).not.toContain('javascript:');
    });

    test('should sanitize event handlers', () => {
      const maliciousInput = '<img src="x" onerror="alert(1)">';
      const result = ValidationService.sanitizeText(maliciousInput);
      
      expect(result.isValid).toBe(false);
      expect(result.sanitizedValue).not.toContain('onerror');
    });

    test('should sanitize javascript: protocol', () => {
      const maliciousInput = '<a href="javascript:alert(1)">Click me</a>';
      const result = ValidationService.sanitizeText(maliciousInput);
      
      expect(result.isValid).toBe(false);
      expect(result.sanitizedValue).not.toContain('javascript:');
    });

    test('should encode HTML entities', () => {
      const input = 'Hello & "World" <test>';
      const result = ValidationService.sanitizeText(input);
      
      expect(result.sanitizedValue).toContain('&amp;');
      expect(result.sanitizedValue).toContain('&quot;');
      expect(result.sanitizedValue).toContain('&lt;');
      expect(result.sanitizedValue).toContain('&gt;');
    });
  });

  describe('Input Validation', () => {
    test('should validate required fields', () => {
      const result = ValidationService.sanitizeText('', { required: true });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('This field is required');
    });

    test('should enforce maximum length', () => {
      const longText = 'a'.repeat(101);
      const result = ValidationService.sanitizeText(longText, { maxLength: 100 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Maximum length is 100 characters');
      expect(result.sanitizedValue?.length).toBe(100);
    });

    test('should enforce minimum length', () => {
      const result = ValidationService.sanitizeText('ab', { minLength: 5 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Minimum length is 5 characters');
    });

    test('should enforce allowed characters', () => {
      const result = ValidationService.sanitizeText('Hello123!@#', {
        allowedCharacters: /^[a-zA-Z0-9]+$/
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid characters found: !, @, #');
      expect(result.sanitizedValue).toBe('Hello123');
    });

    test('should trim whitespace when specified', () => {
      const result = ValidationService.sanitizeText('  hello world  ', { trim: true });
      
      expect(result.sanitizedValue).toBe('hello world');
    });
  });

  describe('Email Validation', () => {
    test('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@domain.org',
        'test123@domain-name.com'
      ];

      validEmails.forEach(email => {
        const result = ValidationService.validateEmail(email);
        expect(result.isValid).toBe(true);
      });
    });

    test('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'test@',
        'test..test@domain.com',
        'test@domain',
        'test@.com'
      ];

      invalidEmails.forEach(email => {
        const result = ValidationService.validateEmail(email);
        expect(result.isValid).toBe(false);
      });
    });

    test('should normalize email addresses', () => {
      const result = ValidationService.validateEmail('  TEST@EXAMPLE.COM  ');
      
      expect(result.sanitizedValue).toBe('test@example.com');
    });

    test('should reject XSS in email', () => {
      const maliciousEmail = 'test<script>alert(1)</script>@example.com';
      const result = ValidationService.validateEmail(maliciousEmail);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid characters in email');
    });
  });

  describe('Save Name Validation', () => {
    test('should accept valid save names', () => {
      const validNames = [
        'My Save Game',
        'Level-1_Progress',
        'Game (Backup)',
        'Save123'
      ];

      validNames.forEach(name => {
        const result = ValidationService.validateSaveName(name);
        expect(result.isValid).toBe(true);
      });
    });

    test('should reject invalid save names', () => {
      const result = ValidationService.validateSaveName('Invalid<script>Name');
      
      expect(result.isValid).toBe(false);
    });

    test('should reject empty save names', () => {
      const result = ValidationService.validateSaveName('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('This field is required');
    });
  });

  describe('Game State Validation', () => {
    const validGameState = {
      currentAge: 5,
      phase: 'gameplay',
      timeline: [],
      happiness: 75,
      finances: 10000,
      parentCharacter: {
        name: 'John Doe',
        age: 30
      },
      childCharacter: {
        name: 'Jane Doe',
        age: 5,
        personalityTraits: [
          { id: 'curiosity', name: 'Curiosity', value: 80 }
        ],
        skills: [
          { id: 'reading', name: 'Reading', level: 3 }
        ]
      }
    };

    test('should accept valid game state', () => {
      const result = ValidationService.validateGameState(validGameState);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject missing required fields', () => {
      const invalidState = { ...validGameState };
      delete invalidState.currentAge;
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: currentAge');
    });

    test('should reject invalid age values', () => {
      const invalidState = { ...validGameState, currentAge: -1 };
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid age value');
    });

    test('should reject invalid happiness values', () => {
      const invalidState = { ...validGameState, happiness: 150 };
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid happiness value');
    });

    test('should reject invalid phase values', () => {
      const invalidState = { ...validGameState, phase: 'invalid-phase' };
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid game phase');
    });

    test('should validate character names', () => {
      const invalidState = {
        ...validGameState,
        parentCharacter: { ...validGameState.parentCharacter, name: '<script>alert(1)</script>' }
      };
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Invalid character name'))).toBe(true);
    });

    test('should validate trait values', () => {
      const invalidState = {
        ...validGameState,
        childCharacter: {
          ...validGameState.childCharacter,
          personalityTraits: [
            { id: 'curiosity', name: 'Curiosity', value: 150 }
          ]
        }
      };
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Trait value out of range'))).toBe(true);
    });

    test('should validate skill levels', () => {
      const invalidState = {
        ...validGameState,
        childCharacter: {
          ...validGameState.childCharacter,
          skills: [
            { id: 'reading', name: 'Reading', level: 15 }
          ]
        }
      };
      
      const result = ValidationService.validateGameState(invalidState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Skill level out of range'))).toBe(true);
    });
  });

  describe('Save Data Validation', () => {
    const validSaveData = JSON.stringify({
      version: '1.0.0',
      exportedAt: '2023-01-01T00:00:00.000Z',
      saveGame: {
        id: 'save_123',
        name: 'Test Save',
        gameState: {
          currentAge: 5,
          phase: 'gameplay',
          timeline: [],
          happiness: 75,
          finances: 10000
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        lastModified: '2023-01-01T00:00:00.000Z',
        version: '1.0.0'
      }
    });

    test('should accept valid save data', () => {
      const result = ValidationService.validateSaveData(validSaveData);
      
      expect(result.isValid).toBe(true);
    });

    test('should reject malformed JSON', () => {
      const invalidData = '{"invalid": json}';
      const result = ValidationService.validateSaveData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid JSON format');
    });

    test('should reject XSS in save data', () => {
      const maliciousData = JSON.stringify({
        version: '1.0.0',
        saveGame: {
          gameState: {
            currentAge: 5,
            phase: '<script>alert(1)</script>',
            timeline: [],
            happiness: 75,
            finances: 10000
          }
        }
      });
      
      const result = ValidationService.validateSaveData(maliciousData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid or suspicious patterns in save data');
    });

    test('should reject path traversal attempts', () => {
      const maliciousData = JSON.stringify({
        version: '1.0.0',
        filename: '../../../etc/passwd',
        saveGame: { gameState: {} }
      });
      
      const result = ValidationService.validateSaveData(maliciousData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid or suspicious patterns in save data');
    });
  });

  describe('File Upload Validation', () => {
    test('should accept valid JSON files', () => {
      const validFile = new File(['{"test": "data"}'], 'save.json', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(validFile);
      
      expect(result.isValid).toBe(true);
    });

    test('should reject non-JSON files', () => {
      const invalidFile = new File(['malicious code'], 'malware.exe', { type: 'application/octet-stream' });
      const result = ValidationService.validateFileUpload(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only JSON files are allowed');
    });

    test('should reject oversized files', () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
      const largeFile = new File([largeContent], 'large.json', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File size exceeds 5MB limit');
    });

    test('should reject files with suspicious filenames', () => {
      const suspiciousFile = new File(['{}'], '../../../evil.json', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(suspiciousFile);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid filename');
    });
  });

  describe('Secure ID Generation', () => {
    test('should generate unique secure IDs', () => {
      const id1 = ValidationService.generateSecureId();
      const id2 = ValidationService.generateSecureId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^save_\d+_[a-z0-9]+_[a-z0-9]+$/);
      expect(id2).toMatch(/^save_\d+_[a-z0-9]+_[a-z0-9]+$/);
    });

    test('should not contain predictable patterns', () => {
      const ids = Array.from({ length: 100 }, () => ValidationService.generateSecureId());
      
      // Check that no two IDs are identical
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
      
      // Check that random parts are different
      const randomParts = ids.map(id => id.split('_').slice(2).join('_'));
      const uniqueRandomParts = new Set(randomParts);
      expect(uniqueRandomParts.size).toBe(100);
    });
  });

  describe('Custom Decision Validation', () => {
    test('should accept valid custom decisions', () => {
      const validDecision = 'Talk to the teacher about the issue';
      const result = ValidationService.validateCustomDecision(validDecision);
      
      expect(result.isValid).toBe(true);
    });

    test('should reject empty custom decisions', () => {
      const result = ValidationService.validateCustomDecision('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('This field is required');
    });

    test('should reject overly long custom decisions', () => {
      const longDecision = 'a'.repeat(201);
      const result = ValidationService.validateCustomDecision(longDecision);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Maximum length is 200 characters');
    });

    test('should sanitize XSS in custom decisions', () => {
      const maliciousDecision = 'Call police <script>alert("hacked")</script>';
      const result = ValidationService.validateCustomDecision(maliciousDecision);
      
      expect(result.isValid).toBe(false);
      expect(result.sanitizedValue).not.toContain('<script');
    });
  });

  describe('Content Security Policy', () => {
    test('should generate appropriate CSP header', () => {
      const csp = ValidationService.getContentSecurityPolicy();
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-src 'none'");
      expect(csp).toContain("base-uri 'self'");
    });
  });
});

describe('Save Game Service Security Integration', () => {
  const mockGameState = {
    currentAge: 5,
    phase: 'gameplay' as const,
    timeline: [],
    happiness: 75,
    finances: 10000,
    parentCharacter: {
      name: 'John Doe',
      age: 30,
      profession: 'Engineer',
      background: 'Test background',
      financialLevel: 5 as const
    },
    childCharacter: {
      name: 'Jane Doe',
      age: 5,
      gender: 'girl',
      personality: 'curious',
      traits: ['loves reading'],
      interests: ['books'],
      personalityTraits: [],
      skills: [],
      relationships: {},
      milestones: [],
      developmentHistory: []
    }
  };

  test('should reject invalid save names', async () => {
    const maliciousName = '<script>alert("xss")</script>';
    
    await expect(saveGameService.saveGame(mockGameState, maliciousName))
      .rejects.toThrow('Invalid save name');
  });

  test('should use secure ID generation', async () => {
    const saveGame = await saveGameService.saveGame(mockGameState);
    
    expect(saveGame.id).toMatch(/^save_\d+_[a-z0-9]+_[a-z0-9]+$/);
  });
});