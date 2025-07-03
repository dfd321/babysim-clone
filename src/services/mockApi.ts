// Mock API service for development and testing
import { 
  SessionInitRequest, 
  SessionInitResponse, 
  CharacterGenerationData, 
  DecisionRequest,
  DecisionResponse,
  ParentCharacter,
  ChildCharacter,
  FinancialLevel,
  ParentRole,
} from '../types/game';
import { MOCK_CONFIG } from '../utils/constants';
import { CharacterDevelopmentService } from './characterDevelopmentService';

class MockGameAPIService {
  private delay = MOCK_CONFIG.DELAY_MS;

  private async mockDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  private generateParentCharacter(role: ParentRole): ParentCharacter {
    const names = {
      'Mom': ['Maya', 'Alex', 'Jordan', 'Cameron', 'Sarah', 'Emma', 'Lisa'],
      'Dad': ['James', 'Michael', 'David', 'Chris', 'Daniel', 'Matt', 'Ryan'],
      'Non-binary': ['Riley', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Avery', 'Sage'],
      'Random': ['Maya', 'Alex', 'Jordan', 'Cameron', 'Riley', 'Sam', 'Taylor', 'Morgan', 'Chris', 'Sarah']
    };
    
    const professions = [
      'Graphic Designer', 'Teacher', 'Engineer', 'Nurse', 'Writer', 
      'Chef', 'Architect', 'Therapist', 'Marketing Manager', 'Software Developer'
    ];
    
    const backgrounds = [
      'grew up in a loving family and values connection',
      'overcame challenges in childhood and built resilience', 
      'comes from a creative background with artistic talents',
      'has a strong educational foundation and loves learning',
      'traveled extensively and brings diverse perspectives',
      'values work-life balance and family time',
      'is community-oriented and socially conscious'
    ];

    const namePool = role === 'Random' ? names.Random : names[role] || names.Random;
    
    return {
      name: namePool[Math.floor(Math.random() * namePool.length)],
      age: Math.floor(Math.random() * 15) + 25,
      profession: professions[Math.floor(Math.random() * professions.length)],
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      financialLevel: (Math.floor(Math.random() * 5) + 3) as FinancialLevel
    };
  }

  private generateChildCharacter(): ChildCharacter {
    const names = ['Luna', 'Zoe', 'River', 'Sage', 'Quinn', 'Ember', 'Nova', 'Kai', 'Rowan', 'Phoenix'];
    const genders = ['boy', 'girl', 'non-binary'];
    const personalities = [
      'curious and energetic',
      'thoughtful and creative', 
      'outgoing and friendly',
      'determined and independent',
      'gentle and empathetic',
      'adventurous and bold'
    ];
    const traits = [
      'loves animals', 'enjoys building things', 'has a great imagination',
      'is very social', 'loves music', 'enjoys reading', 'is athletic',
      'loves art', 'is scientifically minded', 'has a great sense of humor'
    ];

    const baseCharacter: ChildCharacter = {
      name: names[Math.floor(Math.random() * names.length)],
      age: 0,
      gender: genders[Math.floor(Math.random() * genders.length)],
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      traits: this.getRandomItems(traits, 2),
      interests: ['playing', 'exploring', 'learning new things'],
      
      // Initialize enhanced character development
      personalityTraits: [],
      skills: [],
      relationships: {},
      milestones: [],
      developmentHistory: []
    };

    // Initialize character development system
    return CharacterDevelopmentService.initializeCharacterDevelopment(baseCharacter);
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private generateConsequence(): DecisionResponse {
    const consequences = [
      'Your approach works well and strengthens your bond with your child. Happiness +15, finances -1000',
      'The solution is partially effective but requires ongoing effort. Happiness +10, finances -2000', 
      'Your choice leads to mixed results with some challenges. Happiness +5, finances -500',
      'The approach is challenging but builds character. Happiness +20, finances -3000'
    ];

    const consequence = consequences[Math.floor(Math.random() * consequences.length)];
    
    const happinessMatch = consequence.match(/Happiness ([+-]\d+)/);
    const financeMatch = consequence.match(/finances ([+-]\d+)/);
    
    return {
      consequence,
      effects: {
        happiness: happinessMatch ? parseInt(happinessMatch[1]) : 0,
        finances: financeMatch ? parseInt(financeMatch[1]) : 0,
        development: ['emotional growth', 'character building']
      },
      success: true
    };
  }

  async initializeSession(request: SessionInitRequest): Promise<SessionInitResponse> {
    await this.mockDelay();
    
    const parentCharacter = this.generateParentCharacter(request.role);
    const childCharacter = this.generateChildCharacter();
    
    return {
      sessionId: 'mock_session_' + Date.now(),
      parentCharacter,
      childCharacter,
      success: true,
      message: 'Session initialized successfully'
    };
  }

  async makeDecision(request: DecisionRequest): Promise<DecisionResponse> {
    await this.mockDelay();
    
    const ageProgression = [1, 3, 4, 6, 7, 9, 10, 12, 16, 18];
    const currentIndex = ageProgression.indexOf(request.age);
    const nextAge = currentIndex < ageProgression.length - 1 ? ageProgression[currentIndex + 1] : undefined;
    
    const baseResponse = this.generateConsequence();
    
    return {
      ...baseResponse,
      nextAge,
      gameEnded: request.age >= 18,
      success: true
    };
  }

  async generateCharacters(request: { role: ParentRole; gameStyle: any; specialRequirements: string }): Promise<CharacterGenerationData> {
    await this.mockDelay();
    
    return {
      parentCharacter: this.generateParentCharacter(request.role),
      childCharacter: this.generateChildCharacter()
    };
  }
}

export const mockGameAPI = new MockGameAPIService();
export const mockApi = mockGameAPI;
