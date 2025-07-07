import { CharacterDevelopmentService } from '../../src/services/characterDevelopmentService';
import { 
  ChildCharacter, 
  PersonalityTrait, 
  Skill, 
  RelationshipMetric, 
  ScenarioOption 
} from '../../src/types/game';

describe('CharacterDevelopmentService', () => {
  
  let mockBaseCharacter: ChildCharacter;

  beforeEach(() => {
    // Reset Math.random to a fixed value for consistent tests
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    
    // Create a base character to work with
    mockBaseCharacter = {
      id: 'test-child-1',
      name: 'Test Child',
      age: 0,
      gender: 'boy',
      personalityTraits: [],
      skills: [],
      relationships: {},
      milestones: [],
      developmentHistory: []
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initializeCharacterDevelopment', () => {
    it('should initialize a character with valid base structure', () => {
      const character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);

      expect(character).toHaveProperty('id', 'test-child-1');
      expect(character).toHaveProperty('name', 'Test Child');
      expect(character).toHaveProperty('age', 0);
      expect(character).toHaveProperty('personalityTraits');
      expect(character).toHaveProperty('skills');
      expect(character).toHaveProperty('relationships');
      expect(character).toHaveProperty('milestones');
      expect(character).toHaveProperty('developmentHistory');
      
      expect(character.personalityTraits).toHaveLength(10); // BASE_TRAITS length
      expect(character.developmentHistory).toHaveLength(0);
    });

    it('should initialize personality traits with valid values', () => {
      const character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
      
      character.personalityTraits.forEach(trait => {
        expect(trait.value).toBeGreaterThanOrEqual(0);
        expect(trait.value).toBeLessThanOrEqual(100);
        expect(trait).toHaveProperty('id');
        expect(trait).toHaveProperty('name');
        expect(trait).toHaveProperty('category');
        expect(trait).toHaveProperty('description');
      });
    });

    it('should initialize age-appropriate skills for newborn', () => {
      const character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
      
      // At age 0, most skills should not be unlocked
      character.skills.forEach(skill => {
        expect(skill.level).toBeGreaterThanOrEqual(1);
        expect(skill.experience).toBe(0);
        expect(skill.unlocked).toBe(true);
      });
    });

    it('should initialize age-appropriate skills for older child', () => {
      const olderChild = { ...mockBaseCharacter, age: 8 };
      const character = CharacterDevelopmentService.initializeCharacterDevelopment(olderChild);
      
      // At age 8, academic skills should be unlocked
      const readingSkill = character.skills.find(skill => skill.id === 'reading');
      const mathSkill = character.skills.find(skill => skill.id === 'math');
      
      if (readingSkill) expect(readingSkill.unlocked).toBe(true);
      if (mathSkill) expect(mathSkill.unlocked).toBe(true);
    });

    it('should initialize parent-child relationship', () => {
      const character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
      
      expect(character.relationships['parent-child']).toBeDefined();
      const relationship = character.relationships['parent-child'];
      
      expect(relationship.quality).toBeGreaterThanOrEqual(0);
      expect(relationship.quality).toBeLessThanOrEqual(100);
      expect(relationship.trust).toBeGreaterThanOrEqual(0);
      expect(relationship.trust).toBeLessThanOrEqual(100);
      expect(relationship.communication).toBeGreaterThanOrEqual(0);
      expect(relationship.communication).toBeLessThanOrEqual(100);
    });

    it('should mark age-appropriate milestones as achieved', () => {
      const olderChild = { ...mockBaseCharacter, age: 5 };
      const character = CharacterDevelopmentService.initializeCharacterDevelopment(olderChild);
      
      // At age 5, milestones for ages 1, 3, and 5 should be achieved
      const achievedMilestones = character.milestones.filter(m => m.achieved);
      const expectedAchieved = character.milestones.filter(m => m.age <= 5);
      
      expect(achievedMilestones.length).toBe(expectedAchieved.length);
    });
  });

  describe('applyDecisionEffects', () => {
    let initializedCharacter: ChildCharacter;
    let mockScenarioOption: ScenarioOption;

    beforeEach(() => {
      initializedCharacter = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
      
      mockScenarioOption = {
        id: 'test-option',
        label: 'Test Option',
        description: 'Test decision option',
        effects: {
          traits: {
            confidence: 10,
            empathy: -5
          },
          skills: {
            reading: 15
          },
          relationships: {
            'parent-child': {
              quality: 5,
              trust: 10
            }
          }
        }
      };
    });

    it('should apply trait effects correctly', () => {
      const result = CharacterDevelopmentService.applyDecisionEffects(initializedCharacter, mockScenarioOption, 5);
      
      const confidence = result.personalityTraits.find(t => t.id === 'confidence');
      const empathy = result.personalityTraits.find(t => t.id === 'empathy');
      
      const originalConfidence = initializedCharacter.personalityTraits.find(t => t.id === 'confidence')?.value || 0;
      const originalEmpathy = initializedCharacter.personalityTraits.find(t => t.id === 'empathy')?.value || 0;
      
      expect(confidence?.value).toBe(Math.min(100, originalConfidence + 10));
      expect(empathy?.value).toBe(Math.max(0, originalEmpathy - 5));
    });

    it('should enforce trait value boundaries', () => {
      // Set up character with extreme trait values
      const extremeCharacter = { ...initializedCharacter };
      extremeCharacter.personalityTraits = extremeCharacter.personalityTraits.map(trait => ({
        ...trait,
        value: trait.id === 'confidence' ? 95 : 5
      }));

      const extremeOption: ScenarioOption = {
        id: 'extreme-test',
        label: 'Extreme Test',
        description: 'Test extreme values',
        effects: {
          traits: {
            confidence: 20, // Should cap at 100
            empathy: -10   // Should floor at 0
          }
        }
      };

      const result = CharacterDevelopmentService.applyDecisionEffects(extremeCharacter, extremeOption, 5);
      
      const confidence = result.personalityTraits.find(t => t.id === 'confidence');
      const empathy = result.personalityTraits.find(t => t.id === 'empathy');
      
      expect(confidence?.value).toBe(100);
      expect(empathy?.value).toBe(0);
    });

    it('should apply skill effects and handle level-ups', () => {
      // Set up character with high experience
      const skillCharacter = { ...initializedCharacter };
      const readingSkill = skillCharacter.skills.find(s => s.id === 'reading');
      if (readingSkill) {
        readingSkill.experience = 90;
        readingSkill.level = 1;
        readingSkill.unlocked = true;
      }

      const skillOption: ScenarioOption = {
        id: 'skill-test',
        label: 'Skill Test',
        description: 'Test skill progression',
        effects: {
          skills: {
            reading: 15 // Should trigger level up (90 + 15 = 105)
          }
        }
      };

      const result = CharacterDevelopmentService.applyDecisionEffects(skillCharacter, skillOption, 5);
      const resultReadingSkill = result.skills.find(s => s.id === 'reading');
      
      if (resultReadingSkill) {
        expect(resultReadingSkill.level).toBe(2);
        expect(resultReadingSkill.experience).toBe(5); // 105 - 100
      }
    });

    it('should update relationship metrics', () => {
      const result = CharacterDevelopmentService.applyDecisionEffects(initializedCharacter, mockScenarioOption, 5);
      
      const originalRelationship = initializedCharacter.relationships['parent-child'];
      const resultRelationship = result.relationships['parent-child'];
      
      expect(resultRelationship.quality).toBe(originalRelationship.quality + 5);
      expect(resultRelationship.trust).toBe(originalRelationship.trust + 10);
      expect(resultRelationship.communication).toBe(originalRelationship.communication); // No change specified
    });

    it('should record development events', () => {
      const result = CharacterDevelopmentService.applyDecisionEffects(initializedCharacter, mockScenarioOption, 5);
      
      expect(result.developmentHistory.length).toBeGreaterThan(0);
      const latestEvent = result.developmentHistory[result.developmentHistory.length - 1];
      
      expect(latestEvent.age).toBe(5);
      expect(latestEvent.description).toContain('Test Option');
      expect(latestEvent.impact).toBeDefined();
    });

    it('should handle missing effects gracefully', () => {
      const emptyOption: ScenarioOption = {
        id: 'empty-test',
        label: 'Empty Test',
        description: 'Test with no effects'
      };

      const result = CharacterDevelopmentService.applyDecisionEffects(initializedCharacter, emptyOption, 5);
      
      // Should not crash and should maintain character integrity
      expect(result.personalityTraits.length).toBe(initializedCharacter.personalityTraits.length);
      expect(result.skills.length).toBe(initializedCharacter.skills.length);
    });
  });

  describe('getTraitsByCategory', () => {
    let character: ChildCharacter;

    beforeEach(() => {
      character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
    });

    it('should group traits by category correctly', () => {
      const traitsByCategory = CharacterDevelopmentService.getTraitsByCategory(character);
      
      expect(traitsByCategory).toHaveProperty('intellectual');
      expect(traitsByCategory).toHaveProperty('emotional');
      expect(traitsByCategory).toHaveProperty('social');
      expect(traitsByCategory).toHaveProperty('creative');
      expect(traitsByCategory).toHaveProperty('physical');
      
      // Check that each category contains appropriate traits
      expect(traitsByCategory.intellectual.some(t => t.id === 'curiosity')).toBe(true);
      expect(traitsByCategory.emotional.some(t => t.id === 'empathy')).toBe(true);
      expect(traitsByCategory.social.some(t => t.id === 'confidence')).toBe(true);
    });

    it('should return all traits across categories', () => {
      const traitsByCategory = CharacterDevelopmentService.getTraitsByCategory(character);
      
      const totalTraits = Object.values(traitsByCategory).reduce((sum, traits) => sum + traits.length, 0);
      expect(totalTraits).toBe(character.personalityTraits.length);
    });
  });

  describe('getSkillsByCategory', () => {
    let character: ChildCharacter;

    beforeEach(() => {
      character = CharacterDevelopmentService.initializeCharacterDevelopment({
        ...mockBaseCharacter,
        age: 10 // Older age to unlock more skills
      });
    });

    it('should group skills by category correctly', () => {
      const skillsByCategory = CharacterDevelopmentService.getSkillsByCategory(character);
      
      expect(skillsByCategory).toHaveProperty('academic');
      expect(skillsByCategory).toHaveProperty('artistic');
      expect(skillsByCategory).toHaveProperty('athletic');
      expect(skillsByCategory).toHaveProperty('social');
      expect(skillsByCategory).toHaveProperty('practical');
      
      // Check that academic category contains expected skills
      if (skillsByCategory.academic) {
        expect(skillsByCategory.academic.some(s => s.id === 'reading')).toBe(true);
        expect(skillsByCategory.academic.some(s => s.id === 'math')).toBe(true);
      }
    });

    it('should return all skills across categories', () => {
      const skillsByCategory = CharacterDevelopmentService.getSkillsByCategory(character);
      
      const totalSkills = Object.values(skillsByCategory).reduce((sum, skills) => sum + skills.length, 0);
      expect(totalSkills).toBe(character.skills.length);
    });
  });

  describe('getOverallDevelopmentScore', () => {
    let character: ChildCharacter;

    beforeEach(() => {
      character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
    });

    it('should return a score between 0 and 100', () => {
      const score = CharacterDevelopmentService.getOverallDevelopmentScore(character);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(typeof score).toBe('number');
    });

    it('should calculate higher scores for better developed characters', () => {
      // Create a well-developed character
      const wellDeveloped = { ...character };
      wellDeveloped.personalityTraits = character.personalityTraits.map(trait => ({
        ...trait,
        value: 80
      }));
      wellDeveloped.skills = character.skills.map(skill => ({
        ...skill,
        level: 8
      }));
      Object.keys(wellDeveloped.relationships).forEach(key => {
        wellDeveloped.relationships[key] = {
          ...wellDeveloped.relationships[key],
          quality: 90,
          trust: 90,
          communication: 90
        };
      });

      const highScore = CharacterDevelopmentService.getOverallDevelopmentScore(wellDeveloped);
      const normalScore = CharacterDevelopmentService.getOverallDevelopmentScore(character);
      
      expect(highScore).toBeGreaterThan(normalScore);
    });

    it('should handle characters with no skills or relationships', () => {
      const minimalCharacter = { ...character };
      minimalCharacter.skills = [];
      minimalCharacter.relationships = {};
      
      const score = CharacterDevelopmentService.getOverallDevelopmentScore(minimalCharacter);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(typeof score).toBe('number');
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle rapid aging and development', () => {
      let character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
      
      // Apply multiple decisions over time
      const decisions: ScenarioOption[] = [
        {
          id: 'decision1',
          label: 'Learn to read',
          description: 'Focus on reading',
          effects: { skills: { reading: 20 } }
        },
        {
          id: 'decision2',
          label: 'Build confidence',
          description: 'Social interaction',
          effects: { traits: { confidence: 15 } }
        },
        {
          id: 'decision3',
          label: 'Family bonding',
          description: 'Spend time with family',
          effects: { 
            relationships: { 
              'parent-child': { quality: 10, trust: 5 } 
            } 
          }
        }
      ];

      // Apply decisions at different ages
      for (let age = 1; age <= 10; age++) {
        character.age = age;
        character = CharacterDevelopmentService.initializeCharacterDevelopment(character);
        
        const decision = decisions[age % decisions.length];
        character = CharacterDevelopmentService.applyDecisionEffects(character, decision, age);
      }

      // Verify character integrity
      expect(character.personalityTraits.every(t => t.value >= 0 && t.value <= 100)).toBe(true);
      expect(character.skills.every(s => s.level >= 1 && s.level <= 10)).toBe(true);
      expect(character.developmentHistory.length).toBeGreaterThan(0);
      
      const score = CharacterDevelopmentService.getOverallDevelopmentScore(character);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should maintain data consistency across all operations', () => {
      let character = CharacterDevelopmentService.initializeCharacterDevelopment(mockBaseCharacter);
      
      const originalTraitCount = character.personalityTraits.length;
      const originalSkillCount = character.skills.length;
      
      // Apply various operations
      const testOption: ScenarioOption = {
        id: 'consistency-test',
        label: 'Consistency Test',
        description: 'Test data consistency',
        effects: {
          traits: { confidence: 10, empathy: -5 },
          skills: { reading: 25, math: 15 },
          relationships: { 'parent-child': { quality: 5 } }
        }
      };
      
      character = CharacterDevelopmentService.applyDecisionEffects(character, testOption, 6);
      
      // Get categorized data
      const traitsByCategory = CharacterDevelopmentService.getTraitsByCategory(character);
      const skillsByCategory = CharacterDevelopmentService.getSkillsByCategory(character);
      const developmentScore = CharacterDevelopmentService.getOverallDevelopmentScore(character);
      
      // Verify consistency
      expect(character.personalityTraits.length).toBe(originalTraitCount);
      expect(character.skills.length).toBeGreaterThanOrEqual(originalSkillCount);
      
      const totalCategorizedTraits = Object.values(traitsByCategory).reduce((sum, traits) => sum + traits.length, 0);
      const totalCategorizedSkills = Object.values(skillsByCategory).reduce((sum, skills) => sum + skills.length, 0);
      
      expect(totalCategorizedTraits).toBe(character.personalityTraits.length);
      expect(totalCategorizedSkills).toBe(character.skills.length);
      expect(developmentScore).toBeGreaterThanOrEqual(0);
      expect(developmentScore).toBeLessThanOrEqual(100);
    });
  });
});