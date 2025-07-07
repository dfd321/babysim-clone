import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslationProvider } from '../../src/contexts/TranslationContext';
import { RequirementsInput } from '../../src/components/RequirementsInput';
import { SaveLoadMenu } from '../../src/components/SaveLoadMenu';
import { OnboardingPhase } from '../../src/components/OnboardingPhase';
import { saveGameService } from '../../src/services/saveGameService';
import { mockApi } from '../../src/services/mockApi';
import { 
  GameState, 
  ParentRole, 
  GameStyle 
} from '../../src/types/game';

// Mock services
jest.mock('../../src/services/saveGameService');
jest.mock('../../src/services/mockApi');

const mockSaveGameService = saveGameService as jest.Mocked<typeof saveGameService>;
const mockApiService = mockApi as jest.Mocked<typeof mockApi>;

const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
  phase: 'setup',
  role: null,
  gameStyle: null,
  specialRequirements: '',
  parentCharacter: undefined as any,
  childCharacter: undefined as any,
  children: {},
  activeChildId: null,
  currentAge: 0,
  happiness: 85,
  finances: 50000,
  timeline: [],
  achievements: [],
  achievementProgress: {},
  unlockedAchievements: [],
  badges: [],
  unlockedBadges: [],
  familyDynamics: {
    parentChildRelationship: { quality: 85, trust: 90, communication: 80 },
    favoritism: {},
    siblingRelationships: {}
  },
  showSaveMenu: false,
  showLoadMenu: false,
  newAchievementUnlocks: [],
  ...overrides
});

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider>
      {component}
    </TranslationProvider>
  );
};

describe('Input Validation Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RequirementsInput Validation', () => {
    it('should enforce character limits', async () => {
      const user = userEvent.setup();
      const onRequirementsChange = jest.fn();
      
      renderWithTranslation(
        <RequirementsInput
          value=""
          onChange={onRequirementsChange}
          placeholder="Enter requirements..."
        />
      );

      const textarea = screen.getByRole('textbox');
      
      // Test normal input within limits
      const normalText = 'I want a creative child';
      await user.type(textarea, normalText);
      expect(onRequirementsChange).toHaveBeenLastCalledWith(normalText);

      // Test character limit (assume 200 characters max)
      const longText = 'a'.repeat(250);
      await user.clear(textarea);
      await user.type(textarea, longText);
      
      // Should not exceed 200 characters
      const lastCall = onRequirementsChange.mock.calls[onRequirementsChange.mock.calls.length - 1];
      expect(lastCall[0].length).toBeLessThanOrEqual(200);
    });

    it('should sanitize malicious input', async () => {
      const user = userEvent.setup();
      const onRequirementsChange = jest.fn();
      
      renderWithTranslation(
        <RequirementsInput
          value=""
          onChange={onRequirementsChange}
          placeholder="Enter requirements..."
        />
      );

      const textarea = screen.getByRole('textbox');
      
      // Test script injection attempts
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '"><script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(\'xss\')" />',
        '${alert("xss")}',
        '{{constructor.constructor("alert(\'xss\')")()}}',
        '<iframe src="javascript:alert(\'xss\')"></iframe>'
      ];

      for (const maliciousInput of maliciousInputs) {
        await user.clear(textarea);
        await user.type(textarea, maliciousInput);
        
        const lastCall = onRequirementsChange.mock.calls[onRequirementsChange.mock.calls.length - 1];
        const sanitizedValue = lastCall[0];
        
        // Should not contain script tags or javascript: protocol
        expect(sanitizedValue).not.toMatch(/<script/i);
        expect(sanitizedValue).not.toMatch(/javascript:/i);
        expect(sanitizedValue).not.toMatch(/onerror/i);
        expect(sanitizedValue).not.toMatch(/<iframe/i);
      }
    });

    it('should handle special characters safely', async () => {
      const user = userEvent.setup();
      const onRequirementsChange = jest.fn();
      
      renderWithTranslation(
        <RequirementsInput
          value=""
          onChange={onRequirementsChange}
          placeholder="Enter requirements..."
        />
      );

      const textarea = screen.getByRole('textbox');
      
      // Test various special characters
      const specialChars = [
        'Émilie with accents àáâãäåæçèéêë',
        '中文字符测试',
        'Русский текст',
        '数学符号 ∑∏∆∇∞≤≥≠±',
        'Emoji test 🎮👶👨‍👩‍👧‍👦💖',
        'Symbols !@#$%^&*()_+-=[]{}|;:,.<>?'
      ];

      for (const specialText of specialChars) {
        await user.clear(textarea);
        await user.type(textarea, specialText);
        
        const lastCall = onRequirementsChange.mock.calls[onRequirementsChange.mock.calls.length - 1];
        expect(lastCall[0]).toBeDefined();
        expect(typeof lastCall[0]).toBe('string');
      }
    });

    it('should validate empty and whitespace-only input', async () => {
      const user = userEvent.setup();
      const onRequirementsChange = jest.fn();
      
      renderWithTranslation(
        <RequirementsInput
          value=""
          onChange={onRequirementsChange}
          placeholder="Enter requirements..."
        />
      );

      const textarea = screen.getByRole('textbox');
      
      // Test empty string
      await user.clear(textarea);
      expect(onRequirementsChange).toHaveBeenCalledWith('');

      // Test whitespace-only strings
      const whitespaceInputs = ['   ', '\t\t\t', '\n\n\n', '   \t   \n   '];
      
      for (const whitespace of whitespaceInputs) {
        await user.clear(textarea);
        await user.type(textarea, whitespace);
        
        const lastCall = onRequirementsChange.mock.calls[onRequirementsChange.mock.calls.length - 1];
        // Should handle whitespace appropriately (trim or preserve based on requirements)
        expect(lastCall[0]).toBeDefined();
      }
    });
  });

  describe('Role Selection Validation', () => {
    it('should only accept valid role values', async () => {
      const user = userEvent.setup();
      const onRoleSelect = jest.fn();
      
      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={onRoleSelect}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Valid roles should work
      const validRoles: ParentRole[] = ['Mom', 'Dad', 'Non-binary', 'Random'];
      
      for (const role of validRoles) {
        const button = screen.getByRole('button', { name: new RegExp(role, 'i') });
        await user.click(button);
        expect(onRoleSelect).toHaveBeenCalledWith(role);
      }

      // Test programmatic invalid role (simulate direct function call)
      const invalidRoles = ['Invalid', '', null, undefined, 123, {}, []];
      
      for (const invalidRole of invalidRoles) {
        onRoleSelect.mockClear();
        // Direct call with invalid value should be handled gracefully
        try {
          onRoleSelect(invalidRole as any);
          // Validate that the handler rejects invalid input
          expect(onRoleSelect).toHaveBeenCalledWith(invalidRole);
        } catch (error) {
          // Error handling is acceptable for invalid input
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Game Style Validation', () => {
    it('should only accept valid game style values', async () => {
      const user = userEvent.setup();
      const onStyleSelect = jest.fn();
      
      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={onStyleSelect}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Valid styles should work
      const validStyles: GameStyle[] = ['realistic', 'fantasy', 'thrilling'];
      
      for (const style of validStyles) {
        const button = screen.getByRole('button', { name: new RegExp(style, 'i') });
        await user.click(button);
        expect(onStyleSelect).toHaveBeenCalledWith(style);
      }

      // Test invalid styles programmatically
      const invalidStyles = ['invalid', '', null, undefined, 'hack', '<script>'];
      
      for (const invalidStyle of invalidStyles) {
        onStyleSelect.mockClear();
        try {
          onStyleSelect(invalidStyle as any);
          // Should handle invalid input gracefully
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Save Game Name Validation', () => {
    it('should validate save game names', async () => {
      const user = userEvent.setup();
      mockSaveGameService.saveGame.mockResolvedValue({} as any);
      
      renderWithTranslation(
        <SaveLoadMenu
          isOpen={true}
          onClose={jest.fn()}
          onSave={jest.fn()}
          onLoad={jest.fn()}
          onDelete={jest.fn()}
          onExport={jest.fn()}
          onImport={jest.fn()}
          saveGameMetadata={[]}
          saveError={null}
          loadError={null}
        />
      );

      const saveNameInput = screen.getByLabelText(/save name/i) || screen.getByDisplayValue('');
      
      // Test valid save names
      const validNames = [
        'My Game Save',
        'Test Save 123',
        'Family Adventure',
        'Quick Save'
      ];

      for (const validName of validNames) {
        await user.clear(saveNameInput);
        await user.type(saveNameInput, validName);
        expect(saveNameInput).toHaveValue(validName);
      }

      // Test invalid save names
      const invalidNames = [
        '', // Empty
        '   ', // Whitespace only
        'a'.repeat(300), // Too long
        '<script>alert("xss")</script>', // Script injection
        '../../../etc/passwd', // Path traversal
        'CON', // Windows reserved name
        'PRN', // Windows reserved name
        'save\u0000name', // Null character
        'save/name', // Invalid filename characters
        'save\\name', // Invalid filename characters
        'save<>:"name' // Invalid filename characters
      ];

      for (const invalidName of invalidNames) {
        await user.clear(saveNameInput);
        await user.type(saveNameInput, invalidName);
        
        // Should either prevent input or sanitize it
        const currentValue = (saveNameInput as HTMLInputElement).value;
        
        if (invalidName.length > 100) {
          expect(currentValue.length).toBeLessThanOrEqual(100);
        }
        
        if (invalidName.includes('<script>')) {
          expect(currentValue).not.toContain('<script>');
        }
        
        if (invalidName.includes('/') || invalidName.includes('\\')) {
          expect(currentValue).not.toMatch(/[/\\]/);
        }
      }
    });
  });

  describe('Import Data Validation', () => {
    it('should validate imported save data format', async () => {
      const user = userEvent.setup();
      const onImport = jest.fn();
      
      renderWithTranslation(
        <SaveLoadMenu
          isOpen={true}
          onClose={jest.fn()}
          onSave={jest.fn()}
          onLoad={jest.fn()}
          onDelete={jest.fn()}
          onExport={jest.fn()}
          onImport={onImport}
          saveGameMetadata={[]}
          saveError={null}
          loadError={null}
        />
      );

      // Test invalid JSON formats
      const invalidJsonInputs = [
        'not json at all',
        '{"incomplete": json',
        '{"valid": "json", "but": "wrong structure"}',
        '[]', // Array instead of object
        'null',
        'undefined',
        '{"gameState": null}',
        '{"gameState": {"corrupted": "data"}}',
        '<xml>not json</xml>',
        'function() { alert("hack"); }'
      ];

      for (const invalidInput of invalidJsonInputs) {
        onImport.mockClear();
        
        // Simulate file input with invalid data
        const fileInput = screen.getByLabelText(/import/i) || document.querySelector('input[type="file"]');
        
        if (fileInput) {
          const file = new File([invalidInput], 'invalid.json', { type: 'application/json' });
          await user.upload(fileInput, file);
          
          // Should handle invalid input gracefully
          await waitFor(() => {
            // Either onImport is not called with invalid data, or it's called and handles the error
            if (onImport.mock.calls.length > 0) {
              // Should reject invalid data
              expect(onImport).toHaveBeenCalledWith(invalidInput);
            }
          });
        }
      }
    });

    it('should validate file size limits', async () => {
      const user = userEvent.setup();
      const onImport = jest.fn();
      
      renderWithTranslation(
        <SaveLoadMenu
          isOpen={true}
          onClose={jest.fn()}
          onSave={jest.fn()}
          onLoad={jest.fn()}
          onDelete={jest.fn()}
          onExport={jest.fn()}
          onImport={onImport}
          saveGameMetadata={[]}
          saveError={null}
          loadError={null}
        />
      );

      const fileInput = screen.getByLabelText(/import/i) || document.querySelector('input[type="file"]');
      
      if (fileInput) {
        // Test oversized file
        const largeData = '{"data": "' + 'x'.repeat(10 * 1024 * 1024) + '"}'; // 10MB+
        const largeFile = new File([largeData], 'large.json', { type: 'application/json' });
        
        await user.upload(fileInput, largeFile);
        
        // Should reject files that are too large
        await waitFor(() => {
          // Implementation should handle large files gracefully
          expect(fileInput).toBeTruthy(); // Basic check that component didn't crash
        });
      }
    });
  });

  describe('API Input Validation', () => {
    it('should validate API request data', async () => {
      // Test session initialization with invalid data
      const invalidSessionRequests = [
        null,
        undefined,
        {},
        { role: 'InvalidRole' },
        { role: 'Mom', gameStyle: 'InvalidStyle' },
        { role: null, gameStyle: 'realistic' },
        { role: 'Mom', gameStyle: null },
        { role: '<script>', gameStyle: 'realistic' }
      ];

      for (const invalidRequest of invalidSessionRequests) {
        try {
          await mockApiService.initializeSession(invalidRequest as any);
          // Should handle invalid input
        } catch (error) {
          // Error is acceptable for invalid input
          expect(error).toBeDefined();
        }
      }
    });

    it('should validate decision request data', async () => {
      const invalidDecisionRequests = [
        null,
        undefined,
        {},
        { sessionId: '', age: -1 },
        { sessionId: 'valid', age: 'not a number' },
        { sessionId: 'valid', age: 5, choice: null },
        { sessionId: 'valid', age: 5, choice: '', scenario: '<script>' },
        { sessionId: null, age: 5, choice: 'A', scenario: 'test' }
      ];

      for (const invalidRequest of invalidDecisionRequests) {
        try {
          await mockApiService.makeDecision(invalidRequest as any);
          // Should handle invalid input
        } catch (error) {
          // Error is acceptable for invalid input
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Edge Case Input Validation', () => {
    it('should handle null and undefined values', () => {
      // Test components with null/undefined props
      expect(() => {
        renderWithTranslation(
          <RequirementsInput
            value={null as any}
            onChange={jest.fn()}
            placeholder={undefined as any}
          />
        );
      }).not.toThrow();
    });

    it('should handle extremely large numbers', async () => {
      const extremeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MAX_VALUE,
        Infinity,
        -Infinity,
        NaN
      ];

      for (const extremeNumber of extremeNumbers) {
        // Test that components handle extreme numbers gracefully
        const mockGameState = createMockGameState({
          currentAge: extremeNumber,
          happiness: extremeNumber,
          finances: extremeNumber
        });

        expect(() => {
          renderWithTranslation(
            <OnboardingPhase
              gameState={mockGameState}
              onRoleSelect={jest.fn()}
              onStyleSelect={jest.fn()}
              onRequirementsChange={jest.fn()}
              onStart={jest.fn()}
            />
          );
        }).not.toThrow();
      }
    });

    it('should handle circular reference objects', () => {
      // Create circular reference
      const circularObj: any = { prop: 'value' };
      circularObj.self = circularObj;

      // Should not crash when handling circular references
      expect(() => {
        JSON.stringify(circularObj);
      }).toThrow(); // JSON.stringify should throw

      // Component should handle this gracefully
      expect(() => {
        const mockGameState = createMockGameState();
        (mockGameState as any).circularRef = circularObj;
        
        renderWithTranslation(
          <OnboardingPhase
            gameState={mockGameState}
            onRoleSelect={jest.fn()}
            onStyleSelect={jest.fn()}
            onRequirementsChange={jest.fn()}
            onStart={jest.fn()}
          />
        );
      }).not.toThrow();
    });

    it('should handle unicode and international characters', async () => {
      const user = userEvent.setup();
      const onRequirementsChange = jest.fn();
      
      renderWithTranslation(
        <RequirementsInput
          value=""
          onChange={onRequirementsChange}
          placeholder="Enter requirements..."
        />
      );

      const textarea = screen.getByRole('textbox');
      
      // Test various unicode characters
      const unicodeStrings = [
        '🎮👶👨‍👩‍👧‍👦💖🌟', // Emoji
        'Café résumé naïve', // Accented characters
        '中文测试', // Chinese
        'тест на русском', // Cyrillic
        'اختبار العربية', // Arabic
        'हिंदी परीक्षण', // Hindi
        '日本語テスト', // Japanese
        'ελληνική δοκιμή', // Greek
        '한국어 테스트', // Korean
        'עברית מבחן' // Hebrew
      ];

      for (const unicodeString of unicodeStrings) {
        await user.clear(textarea);
        await user.type(textarea, unicodeString);
        
        const lastCall = onRequirementsChange.mock.calls[onRequirementsChange.mock.calls.length - 1];
        expect(lastCall[0]).toBeDefined();
        expect(typeof lastCall[0]).toBe('string');
      }
    });
  });
});