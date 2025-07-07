import { ValidationService } from '../../src/services/validationService';

describe('ValidationService', () => {
  describe('validateCustomDecision', () => {
    it('should validate safe custom decision text', () => {
      const result = ValidationService.validateCustomDecision('I would talk to the teacher about this issue');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('I would talk to the teacher about this issue');
      expect(result.errors).toEqual([]);
    });

    it('should reject XSS attempts', () => {
      const result = ValidationService.validateCustomDecision('<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input contains potentially harmful content');
    });

    it('should reject SQL injection attempts', () => {
      const result = ValidationService.validateCustomDecision("'; DROP TABLE users; --");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input contains potentially harmful content');
    });

    it('should reject empty input', () => {
      const result = ValidationService.validateCustomDecision('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input cannot be empty');
    });

    it('should reject input that is too long', () => {
      const longInput = 'a'.repeat(201);
      const result = ValidationService.validateCustomDecision(longInput);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input is too long (maximum 200 characters)');
    });

    it('should reject excessive whitespace', () => {
      const result = ValidationService.validateCustomDecision('   \n\n\n   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input cannot be empty');
    });

    it('should sanitize potentially dangerous characters', () => {
      const result = ValidationService.validateCustomDecision('I would use <b>bold</b> text');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('I would use bold text');
    });
  });

  describe('validateSaveName', () => {
    it('should validate safe save names', () => {
      const result = ValidationService.validateSaveName('My Game Save - Level 1');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('My Game Save - Level 1');
    });

    it('should reject XSS in save names', () => {
      const result = ValidationService.validateSaveName('<script>alert("hack")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Save name contains invalid characters');
    });

    it('should reject save names that are too long', () => {
      const longName = 'a'.repeat(51);
      const result = ValidationService.validateSaveName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Save name is too long (maximum 50 characters)');
    });

    it('should reject empty save names', () => {
      const result = ValidationService.validateSaveName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Save name cannot be empty');
    });

    it('should allow valid special characters', () => {
      const result = ValidationService.validateSaveName('Game_Save-2024 (Final)');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('Game_Save-2024 (Final)');
    });
  });

  describe('validateFileUpload', () => {
    it('should validate JSON files', () => {
      const mockFile = new File(['{}'], 'save.json', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(mockFile);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-JSON files', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = ValidationService.validateFileUpload(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File must be a JSON file');
    });

    it('should reject files that are too large', () => {
      const largeContent = 'a'.repeat(2 * 1024 * 1024); // 2MB
      const mockFile = new File([largeContent], 'large.json', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File is too large (maximum 1MB)');
    });

    it('should reject empty files', () => {
      const mockFile = new File([''], 'empty.json', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File cannot be empty');
    });

    it('should reject files with dangerous names', () => {
      const mockFile = new File(['{}'], '../../../etc/passwd', { type: 'application/json' });
      const result = ValidationService.validateFileUpload(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File name contains invalid characters');
    });
  });

  describe('validateSaveData', () => {
    const validSaveData = JSON.stringify({
      version: '1.0.0',
      exportedAt: '2024-01-01T00:00:00.000Z',
      saveGame: {
        id: 'test-id',
        name: 'Test Save',
        gameState: {
          currentAge: 5,
          childCharacter: { name: 'Test Child' },
          parentCharacter: { name: 'Test Parent' }
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        lastModified: '2024-01-01T00:00:00.000Z',
        version: '1.0.0'
      }
    });

    it('should validate correct save data', () => {
      const result = ValidationService.validateSaveData(validSaveData);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBeDefined();
    });

    it('should reject invalid JSON', () => {
      const result = ValidationService.validateSaveData('invalid json');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid JSON format');
    });

    it('should reject save data without required fields', () => {
      const invalidData = JSON.stringify({ version: '1.0.0' });
      const result = ValidationService.validateSaveData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Save data is missing required fields');
    });

    it('should reject save data that is too large', () => {
      const largeSaveData = JSON.stringify({
        version: '1.0.0',
        exportedAt: '2024-01-01T00:00:00.000Z',
        saveGame: {
          id: 'test-id',
          name: 'Test Save',
          gameState: {
            currentAge: 5,
            childCharacter: { name: 'Test Child' },
            parentCharacter: { name: 'Test Parent' },
            largeData: 'a'.repeat(2 * 1024 * 1024) // 2MB
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          lastModified: '2024-01-01T00:00:00.000Z',
          version: '1.0.0'
        }
      });
      
      const result = ValidationService.validateSaveData(largeSaveData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Save data is too large (maximum 1MB)');
    });
  });

  describe('generateSecureId', () => {
    it('should generate unique IDs', () => {
      const id1 = ValidationService.generateSecureId();
      const id2 = ValidationService.generateSecureId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with expected format', () => {
      const id = ValidationService.generateSecureId();
      expect(id).toMatch(/^[a-zA-Z0-9_-]+$/);
      expect(id.length).toBeGreaterThan(10);
    });

    it('should not generate IDs with dangerous characters', () => {
      const id = ValidationService.generateSecureId();
      expect(id).not.toMatch(/[<>'"&]/);
    });
  });

  describe('XSS Protection', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src=x onerror=alert("xss")>',
      '<svg onload=alert("xss")>',
      '<iframe src="javascript:alert(\'xss\')">',
      'data:text/html,<script>alert("xss")</script>',
      '&lt;script&gt;alert("xss")&lt;/script&gt;',
      '<style>body{background:url("javascript:alert(\'xss\')")}</style>'
    ];

    xssPayloads.forEach(payload => {
      it(`should detect XSS payload: ${payload}`, () => {
        const result = ValidationService.validateCustomDecision(payload);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Input contains potentially harmful content');
      });
    });
  });

  describe('SQL Injection Protection', () => {
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "1; DELETE FROM saves WHERE 1=1; --",
      "' UNION SELECT * FROM users --",
      "'; INSERT INTO users VALUES('hack','hack'); --"
    ];

    sqlPayloads.forEach(payload => {
      it(`should detect SQL injection payload: ${payload}`, () => {
        const result = ValidationService.validateCustomDecision(payload);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Input contains potentially harmful content');
      });
    });
  });

  describe('Path Traversal Protection', () => {
    const pathPayloads = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',
      './.././.././.././etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
    ];

    pathPayloads.forEach(payload => {
      it(`should detect path traversal in filename: ${payload}`, () => {
        const mockFile = new File(['{}'], payload, { type: 'application/json' });
        const result = ValidationService.validateFileUpload(mockFile);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('File name contains invalid characters');
      });
    });
  });
});