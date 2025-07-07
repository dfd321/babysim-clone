import { mockGameAPI, mockApi } from '../../src/services/mockApi';
import { 
  SessionInitRequest, 
  SessionInitResponse,
  DecisionRequest,
  DecisionResponse,
  CharacterGenerationData,
  ParentRole,
  FinancialLevel
} from '../../src/types/game';

// Mock the delay to speed up tests
jest.mock('../../src/utils/constants', () => ({
  MOCK_CONFIG: {
    DELAY_MS: 0 // Remove delay for tests
  }
}));

describe('MockGameAPIService', () => {
  
  beforeEach(() => {
    // Reset Math.random for consistent test results
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initializeSession', () => {
    it('should initialize session with valid parent and child characters', async () => {
      const request: SessionInitRequest = {
        role: 'Mom',
        gameStyle: 'realistic',
        specialRequirements: 'A creative and artistic child'
      };

      const response = await mockGameAPI.initializeSession(request);

      expect(response.success).toBe(true);
      expect(response.sessionId).toMatch(/^mock_session_\d+$/);
      expect(response.message).toBe('Session initialized successfully');
      expect(response.parentCharacter).toBeDefined();
      expect(response.childCharacter).toBeDefined();
    });

    it('should generate parent character with correct role', async () => {
      const request: SessionInitRequest = {
        role: 'Dad',
        gameStyle: 'realistic',
        specialRequirements: ''
      };

      const response = await mockGameAPI.initializeSession(request);
      
      expect(response.parentCharacter.name).toBeDefined();
      expect(response.parentCharacter.age).toBeGreaterThanOrEqual(25);
      expect(response.parentCharacter.age).toBeLessThanOrEqual(40);
      expect(response.parentCharacter.profession).toBeDefined();
      expect(response.parentCharacter.background).toBeDefined();
      expect(response.parentCharacter.financialLevel).toBeGreaterThanOrEqual(3);
      expect(response.parentCharacter.financialLevel).toBeLessThanOrEqual(7);
    });

    it('should generate child character with development system initialized', async () => {
      const request: SessionInitRequest = {
        role: 'Mom',
        gameStyle: 'fantasy',
        specialRequirements: ''
      };

      const response = await mockGameAPI.initializeSession(request);
      const child = response.childCharacter;
      
      expect(child.name).toBeDefined();
      expect(child.age).toBe(0);
      expect(['boy', 'girl', 'non-binary']).toContain(child.gender);
      expect(child.personality).toBeDefined();
      expect(child.traits).toHaveLength(2);
      expect(child.interests).toContain('playing');
      
      // Check character development system
      expect(child.personalityTraits).toBeDefined();
      expect(child.personalityTraits.length).toBeGreaterThan(0);
      expect(child.skills).toBeDefined();
      expect(child.relationships).toBeDefined();
      expect(child.milestones).toBeDefined();
      expect(child.developmentHistory).toBeDefined();
    });

    it('should handle different parent roles correctly', async () => {
      const roles: ParentRole[] = ['Mom', 'Dad', 'Non-binary', 'Random'];
      
      for (const role of roles) {
        const request: SessionInitRequest = {
          role,
          gameStyle: 'realistic',
          specialRequirements: ''
        };

        const response = await mockGameAPI.initializeSession(request);
        
        expect(response.success).toBe(true);
        expect(response.parentCharacter).toBeDefined();
        expect(response.childCharacter).toBeDefined();
      }
    });

    it('should generate unique session IDs', async () => {
      const request: SessionInitRequest = {
        role: 'Mom',
        gameStyle: 'realistic',
        specialRequirements: ''
      };

      const response1 = await mockGameAPI.initializeSession(request);
      const response2 = await mockGameAPI.initializeSession(request);

      expect(response1.sessionId).not.toBe(response2.sessionId);
    });
  });

  describe('makeDecision', () => {
    it('should return valid decision response', async () => {
      const request: DecisionRequest = {
        sessionId: 'test_session',
        age: 5,
        choice: 'Option A',
        scenario: 'Test scenario'
      };

      const response = await mockGameAPI.makeDecision(request);

      expect(response.success).toBe(true);
      expect(response.consequence).toBeDefined();
      expect(typeof response.consequence).toBe('string');
      expect(response.effects).toBeDefined();
      expect(response.effects.happiness).toBeDefined();
      expect(response.effects.finances).toBeDefined();
      expect(response.effects.development).toBeDefined();
      expect(Array.isArray(response.effects.development)).toBe(true);
    });

    it('should handle age progression correctly', async () => {
      const ageProgression = [1, 3, 4, 6, 7, 9, 10, 12, 16, 18];
      
      for (let i = 0; i < ageProgression.length - 1; i++) {
        const currentAge = ageProgression[i];
        const expectedNextAge = ageProgression[i + 1];
        
        const request: DecisionRequest = {
          sessionId: 'test_session',
          age: currentAge,
          choice: 'Test choice',
          scenario: 'Test scenario'
        };

        const response = await mockGameAPI.makeDecision(request);
        
        expect(response.nextAge).toBe(expectedNextAge);
        expect(response.gameEnded).toBe(false);
      }
    });

    it('should end game at age 18', async () => {
      const request: DecisionRequest = {
        sessionId: 'test_session',
        age: 18,
        choice: 'Final choice',
        scenario: 'Final scenario'
      };

      const response = await mockGameAPI.makeDecision(request);

      expect(response.gameEnded).toBe(true);
      expect(response.nextAge).toBeUndefined();
    });

    it('should parse happiness and finance effects from consequence text', async () => {
      // Mock to return a specific consequence for testing
      jest.spyOn(Math, 'random').mockReturnValue(0); // Forces first consequence
      
      const request: DecisionRequest = {
        sessionId: 'test_session',
        age: 5,
        choice: 'Test choice',
        scenario: 'Test scenario'
      };

      const response = await mockGameAPI.makeDecision(request);

      // Should extract happiness and finance values from consequence text
      expect(typeof response.effects.happiness).toBe('number');
      expect(typeof response.effects.finances).toBe('number');
    });

    it('should handle edge case ages gracefully', async () => {
      const edgeCases = [0, 19, 25];
      
      for (const age of edgeCases) {
        const request: DecisionRequest = {
          sessionId: 'test_session',
          age,
          choice: 'Test choice',
          scenario: 'Test scenario'
        };

        const response = await mockGameAPI.makeDecision(request);
        
        expect(response.success).toBe(true);
        expect(response.consequence).toBeDefined();
        expect(response.effects).toBeDefined();
      }
    });
  });

  describe('generateCharacters', () => {
    it('should generate characters for different roles and styles', async () => {
      const request = {
        role: 'Mom' as ParentRole,
        gameStyle: 'realistic',
        specialRequirements: 'Loves music and art'
      };

      const response = await mockGameAPI.generateCharacters(request);

      expect(response.parentCharacter).toBeDefined();
      expect(response.childCharacter).toBeDefined();
      
      // Verify parent character structure
      expect(response.parentCharacter.name).toBeDefined();
      expect(response.parentCharacter.age).toBeGreaterThanOrEqual(25);
      expect(response.parentCharacter.profession).toBeDefined();
      expect(response.parentCharacter.background).toBeDefined();
      expect(response.parentCharacter.financialLevel).toBeGreaterThanOrEqual(3);
      
      // Verify child character structure
      expect(response.childCharacter.name).toBeDefined();
      expect(response.childCharacter.age).toBe(0);
      expect(response.childCharacter.personalityTraits).toBeDefined();
    });

    it('should handle different game styles', async () => {
      const gameStyles = ['realistic', 'fantasy', 'thrilling'];
      
      for (const gameStyle of gameStyles) {
        const request = {
          role: 'Dad' as ParentRole,
          gameStyle,
          specialRequirements: ''
        };

        const response = await mockGameAPI.generateCharacters(request);
        
        expect(response.parentCharacter).toBeDefined();
        expect(response.childCharacter).toBeDefined();
      }
    });

    it('should generate different characters on multiple calls', async () => {
      const request = {
        role: 'Random' as ParentRole,
        gameStyle: 'realistic',
        specialRequirements: ''
      };

      // Reset random to ensure different results
      jest.spyOn(Math, 'random').mockRestore();
      
      const response1 = await mockGameAPI.generateCharacters(request);
      const response2 = await mockGameAPI.generateCharacters(request);

      // Names should potentially be different (not guaranteed, but likely)
      expect(response1.parentCharacter).toBeDefined();
      expect(response2.parentCharacter).toBeDefined();
      expect(response1.childCharacter).toBeDefined();
      expect(response2.childCharacter).toBeDefined();
    });
  });

  describe('Data Validation and Edge Cases', () => {
    it('should generate valid financial levels within range', async () => {
      const validFinancialLevels: FinancialLevel[] = [3, 4, 5, 6, 7];
      
      for (let i = 0; i < 10; i++) { // Test multiple generations
        const request: SessionInitRequest = {
          role: 'Mom',
          gameStyle: 'realistic',
          specialRequirements: ''
        };

        const response = await mockGameAPI.initializeSession(request);
        
        expect(validFinancialLevels).toContain(response.parentCharacter.financialLevel);
      }
    });

    it('should generate parent ages within realistic range', async () => {
      for (let i = 0; i < 10; i++) {
        const request: SessionInitRequest = {
          role: 'Dad',
          gameStyle: 'realistic',
          specialRequirements: ''
        };

        const response = await mockGameAPI.initializeSession(request);
        
        expect(response.parentCharacter.age).toBeGreaterThanOrEqual(25);
        expect(response.parentCharacter.age).toBeLessThanOrEqual(39); // 25 + 14
      }
    });

    it('should handle empty and undefined special requirements', async () => {
      const testCases = ['', undefined, null];
      
      for (const specialRequirements of testCases) {
        const request: SessionInitRequest = {
          role: 'Mom',
          gameStyle: 'realistic',
          specialRequirements: specialRequirements as string
        };

        const response = await mockGameAPI.initializeSession(request);
        
        expect(response.success).toBe(true);
        expect(response.parentCharacter).toBeDefined();
        expect(response.childCharacter).toBeDefined();
      }
    });

    it('should always generate exactly 2 traits for child character', async () => {
      for (let i = 0; i < 5; i++) {
        const request: SessionInitRequest = {
          role: 'Random',
          gameStyle: 'fantasy',
          specialRequirements: ''
        };

        const response = await mockGameAPI.initializeSession(request);
        
        expect(response.childCharacter.traits).toHaveLength(2);
        expect(response.childCharacter.traits.every(trait => typeof trait === 'string')).toBe(true);
      }
    });

    it('should generate valid consequence effects', async () => {
      for (let i = 0; i < 10; i++) {
        const request: DecisionRequest = {
          sessionId: 'test_session',
          age: Math.floor(Math.random() * 18) + 1,
          choice: 'Random choice',
          scenario: 'Random scenario'
        };

        const response = await mockGameAPI.makeDecision(request);
        
        expect(typeof response.effects.happiness).toBe('number');
        expect(typeof response.effects.finances).toBe('number');
        expect(Array.isArray(response.effects.development)).toBe(true);
        expect(response.effects.development.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Service Instance', () => {
    it('should export both mockGameAPI and mockApi references', () => {
      expect(mockGameAPI).toBeDefined();
      expect(mockApi).toBeDefined();
      expect(mockGameAPI).toBe(mockApi);
    });

    it('should have all required methods', () => {
      expect(typeof mockGameAPI.initializeSession).toBe('function');
      expect(typeof mockGameAPI.makeDecision).toBe('function');
      expect(typeof mockGameAPI.generateCharacters).toBe('function');
    });
  });

  describe('Integration with CharacterDevelopmentService', () => {
    it('should initialize child character with development system', async () => {
      const request: SessionInitRequest = {
        role: 'Mom',
        gameStyle: 'realistic',
        specialRequirements: ''
      };

      const response = await mockGameAPI.initializeSession(request);
      const child = response.childCharacter;
      
      // Should have personality traits from CharacterDevelopmentService
      expect(child.personalityTraits.length).toBeGreaterThan(0);
      child.personalityTraits.forEach(trait => {
        expect(trait).toHaveProperty('id');
        expect(trait).toHaveProperty('name');
        expect(trait).toHaveProperty('category');
        expect(trait).toHaveProperty('value');
        expect(trait.value).toBeGreaterThanOrEqual(0);
        expect(trait.value).toBeLessThanOrEqual(100);
      });
      
      // Should have initialized relationships
      expect(child.relationships['parent-child']).toBeDefined();
      
      // Should have milestones
      expect(child.milestones.length).toBeGreaterThan(0);
      
      // Should have empty development history initially
      expect(child.developmentHistory).toEqual([]);
    });
  });
});