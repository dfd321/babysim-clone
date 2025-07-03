// Real API service for production use
import { 
  SessionInitRequest, 
  SessionInitResponse, 
  CharacterGenerationData, 
  ScenarioData, 
  DecisionData,
  GameAPIError
} from '../types/game';
import { API_CONFIG, MOCK_CONFIG } from '../utils/constants';

class GameAPIService {
  private baseURL = API_CONFIG.BASE_URL;
  private timeout = API_CONFIG.TIMEOUT_MS;

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new GameAPIError('TIMEOUT', 'Request timed out');
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parsing errors for error responses
      }
      
      throw new GameAPIError(
        `HTTP_${response.status}`,
        errorMessage,
        { status: response.status, statusText: response.statusText }
      );
    }

    try {
      return await response.json();
    } catch (error) {
      throw new GameAPIError('PARSE_ERROR', 'Failed to parse response as JSON');
    }
  }

  async initSession(preferences: SessionInitRequest): Promise<SessionInitResponse> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/session-init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    return this.handleResponse<SessionInitResponse>(response);
  }

  async generateCharacter(sessionId: string): Promise<CharacterGenerationData> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        action: 'generate_character',
        sessionId,
      }),
    });
    
    const result = await this.handleResponse<{ success: boolean; data: CharacterGenerationData }>(response);
    if (!result.success) {
      throw new GameAPIError('GENERATION_FAILED', 'Character generation failed');
    }
    
    return result.data;
  }

  async getNextScenario(sessionId: string, childAge: number): Promise<ScenarioData['scenario']> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        action: 'next_scenario',
        sessionId,
        childAge,
      }),
    });
    
    const result = await this.handleResponse<{ success: boolean; data: ScenarioData }>(response);
    if (!result.success) {
      throw new GameAPIError('SCENARIO_FAILED', 'Scenario generation failed');
    }
    
    return result.data.scenario;
  }

  async makeDecision(
    sessionId: string, 
    childAge: number, 
    decision: string, 
    customText?: string
  ): Promise<DecisionData> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        action: 'make_decision',
        sessionId,
        childAge,
        decision,
        customDecision: customText,
      }),
    });
    
    const result = await this.handleResponse<{ success: boolean; data: DecisionData }>(response);
    if (!result.success) {
      throw new GameAPIError('DECISION_FAILED', 'Decision processing failed');
    }
    
    return result.data;
  }

  async logEvent(sessionId: string, event: string, metadata: Record<string, any>): Promise<void> {
    try {
      await this.fetchWithTimeout(`${this.baseURL}/log-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          event,
          sessionId,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      // Log events are non-critical, so we don't throw errors
      console.warn('Failed to log event:', error);
    }
  }
}

// Mock API service for development
class MockGameAPIService {
  private sessions = new Map<string, any>();
  private delay = MOCK_CONFIG.DELAY_MS;
  
  private generateSessionId(): string {
    return `sess_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async delay_ms(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async initSession(preferences: SessionInitRequest): Promise<SessionInitResponse> {
    await this.delay_ms(200);
    
    const sessionId = this.generateSessionId();
    this.sessions.set(sessionId, {
      preferences,
      timeline: [],
      financialLevel: 5,
    });
    
    return {
      sessionId,
      success: true,
      message: 'Session initialized successfully',
    };
  }

  async generateCharacter(sessionId: string): Promise<CharacterGenerationData> {
    await this.delay_ms(this.delay);
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new GameAPIError('SESSION_NOT_FOUND', 'Session not found');
    }

    const characters = this.generateMockCharacters(session.preferences);
    session.characters = characters;
    
    return characters;
  }

  async getNextScenario(sessionId: string, childAge: number): Promise<ScenarioData['scenario']> {
    await this.delay_ms(this.delay);
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new GameAPIError('SESSION_NOT_FOUND', 'Session not found');
    }

    return this.generateMockScenario(childAge, session.financialLevel);
  }

  async makeDecision(
    sessionId: string, 
    childAge: number, 
    decision: string, 
    customText?: string
  ): Promise<DecisionData> {
    await this.delay_ms(this.delay);
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new GameAPIError('SESSION_NOT_FOUND', 'Session not found');
    }

    const result = this.generateMockConsequence(childAge, decision, customText);
    
    // Update session state
    session.financialLevel = result.effects.finances?.level || session.financialLevel;
    session.timeline.push({
      age: childAge,
      decision,
      customText,
      consequence: result.consequence,
    });
    
    return result;
  }

  async logEvent(sessionId: string, event: string, metadata: Record<string, any>): Promise<void> {
    await this.delay_ms(45);
    console.log('Mock event logged:', { sessionId, event, metadata });
  }

  private generateMockCharacters(preferences: SessionInitRequest): CharacterGenerationData {
    const parentNames = ['Maya', 'Sarah', 'Emily', 'Jessica', 'David', 'Michael', 'Alex', 'Jordan'];
    const childNames = ['Luna', 'Emma', 'Oliver', 'Sophia', 'Liam', 'Ava', 'Noah', 'Isabella'];
    const occupations = [
      'freelance graphic designer', 'software engineer', 'teacher', 'nurse', 'accountant',
      'marketing manager', 'chef', 'therapist', 'architect', 'writer'
    ];
    
    const parentName = parentNames[Math.floor(Math.random() * parentNames.length)];
    const childName = childNames[Math.floor(Math.random() * childNames.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    const childGender = Math.random() > 0.5 ? 'girl' : 'boy';
    const parentAge = 25 + Math.floor(Math.random() * 10);

    return {
      parent: {
        name: parentName,
        age: parentAge,
        occupation,
        location: 'modest apartment in a quiet neighborhood',
        financeLevel: 4 + Math.floor(Math.random() * 3),
        partner: 'Alex',
        background: `You are a ${parentAge}-year-old ${preferences.role} named ${parentName}, working as a ${occupation}. You live in a modest apartment in a quiet neighborhood. Your income is stable but not lavish. You and your partner, Alex, share parenting duties, though Alex travels often for work. Your family is supportive but lives far away. You value creativity and education, hoping to nurture these traits in your child.`,
      },
      child: {
        name: childName,
        gender: childGender,
        age: 'just born',
        personality: `${childName} is a bright and curious baby with a natural love for exploration.`,
        traits: `${childName} babbles constantly, as if asking questions, and is fascinated by colors, shapes, and sounds.`,
        health: 'excellent',
        potential: `You sense ${childName} will grow into a thoughtful, inquisitive child who thrives on learning.`,
      },
    };
  }

  private generateMockScenario(age: number, financialLevel: number): ScenarioData['scenario'] {
    const scenarios = {
      2: {
        stage: 'Toddler',
        situation: `Luna has been babbling nonstop and pointing at everything, clearly eager to learn. However, she's also started throwing tantrums when she can't communicate her thoughts fully. Your pediatrician suggests enrolling her in an early language development class, but it's expensive. Meanwhile, Alex is away for work, and you're swamped with a client deadline. How do you handle this?`,
        options: [
          { id: 'A', text: "Enroll her in the class—it's a worthy investment for her curiosity, even if it strains the budget." },
          { id: 'B', text: 'Try free alternatives: library storytimes and educational YouTube videos for now, saving money.' },
          { id: 'C', text: "Ask Alex to cut his trip short to help, even if it risks his job stability." },
          { id: 'D', text: 'Delay the decision—focus on your work deadline and revisit this when less overwhelmed.' },
        ],
      },
      3: {
        stage: 'Preschooler',
        situation: `At 4, Luna's creativity explodes—she constantly draws, asks 'why' about everything, and begs for piano lessons after hearing a neighbor play. Her preschool teacher suggests nurturing her talents, but options are limited in your area. A prestigious arts-focused kindergarten has an opening, but it's pricey and far away. Meanwhile, Alex's job offers a relocation to a city with better schools but less stability. What do you prioritize?`,
        options: [
          { id: 'A', text: "Scrimp and send her to the arts kindergarten—her potential comes first" },
          { id: 'B', text: "Relocate for better opportunities, even if it means Alex's unpredictable schedule" },
          { id: 'C', text: 'Stay put but invest in weekend art classes and library trips' },
          { id: 'D', text: 'Focus on stability—encourage her curiosity at home for now' },
        ],
      },
      5: {
        stage: 'Elementary',
        situation: `Luna is excelling in kindergarten but struggling socially. She's advanced academically but has trouble connecting with peers who don't share her interests. The teacher suggests she might benefit from a gifted program, but it would mean leaving her current school and friends. You're also concerned about the pressure it might put on her. How do you support her development?`,
        options: [
          { id: 'A', text: "Enroll her in the gifted program—she needs intellectual challenges" },
          { id: 'B', text: "Keep her in regular classes but arrange enrichment activities outside school" },
          { id: 'C', text: "Focus on developing her social skills through playdates and activities" },
          { id: 'D', text: "Let her decide what she wants to do" },
        ],
      },
    };

    const scenario = scenarios[age as keyof typeof scenarios] || scenarios[2];
    const financialStatusText = ['Poor', 'Low', 'Below Average', 'Average', 'Middle', 'Upper Middle', 'Comfortable', 'Well-off', 'Wealthy', 'Very Wealthy'][financialLevel - 1] || 'Middle';

    return {
      age,
      stage: scenario.stage,
      situation: scenario.situation,
      options: scenario.options,
      customOptionEnabled: true,
      financialStatus: financialStatusText,
    };
  }

  private generateMockConsequence(age: number, decision: string, customText?: string): DecisionData {
    const consequences = {
      A: {
        2: "You enroll Luna in the language development class, tightening the budget elsewhere. The classes are a hit—Luna soaks up new words like a sponge, and her tantrums lessen as she learns to express herself. She starts stringing together simple sentences by age 3, astonishing her teachers with her curiosity. However, the financial strain is real. You take on extra freelance work, leaving you exhausted. Alex helps when home, but the distance weighs on you both. Still, seeing Luna proudly name every color in her crayon box makes the sacrifice feel worth it.",
        3: "You decide to invest in the arts kindergarten despite the financial strain. Luna thrives in the creative environment, her artistic skills blossoming under expert guidance. She makes friends with other creative children and seems genuinely happy. However, the long commute and high tuition fees put significant stress on your family budget and daily routine. You find yourself working longer hours to afford it, and Alex expresses concern about the sustainability of this choice.",
      },
      B: {
        2: "You opt for free alternatives, spending Saturday mornings at library storytimes and using educational apps during the week. Luna enjoys the library trips and gradually improves her communication skills, though more slowly than she might have in formal classes. The financial relief allows you to take on fewer projects and spend more quality time with her. Alex appreciates the stability when he returns from trips. While Luna's language development is steady, you sometimes wonder if you're limiting her potential.",
        3: "You decide to relocate for better educational opportunities. The move is stressful, but Luna adapts quickly to the new environment. The schools are indeed better, and she has access to more programs and resources. However, Alex's new position comes with unpredictable hours and frequent travel, putting more parenting responsibility on you. Luna misses her old friends initially but gradually settles in. The family dynamic shifts as you navigate the challenges of a new city.",
      },
      C: {
        2: "You ask Alex to return early, and after some discussion, he agrees to cut his business trip short. Having both parents present helps manage Luna's tantrums and allows you to research language development options together. You find a middle-ground solution: a part-time program that's more affordable. Luna benefits from the increased attention and structure. However, Alex's early return costs his company a important deal, creating tension about work priorities and financial planning.",
        3: "You choose to stay in your current neighborhood and invest in weekend art classes and regular library trips. Luna thrives in this routine—her drawings fill every notebook, and she memorizes entire storybooks after just a few reads. The community center classes are affordable and provide good creative outlet. However, you notice she's sometimes bored in her regular preschool, and the librarian jokes she's the youngest 'regular' they've ever had. The local school options still concern you for the future.",
      },
      D: {
        2: "You decide to delay the decision while focusing on your work deadline. For a few weeks, Luna's tantrums continue while you're swamped with client work. Alex returns to help, but by then, the enrollment period for the language class has passed. You manage Luna's communication challenges at home with books and games. While the immediate crisis passes, you worry about missing a critical development window. Luna eventually improves on her own timeline, but you carry some regret about not acting sooner.",
        3: "You prioritize stability and decide to encourage Luna's creativity at home rather than making big changes. You set up an art corner in your apartment and spend evenings doing creative projects together. Luna enjoys this focused attention and continues to develop her skills. While she doesn't have access to specialized programs, she seems content and secure. You save money for future opportunities and maintain your current support network. However, you sometimes wonder if you're being too cautious with her obvious talents.",
      },
      E: {
        2: customText || "You implement your own creative solution to Luna's language development needs.",
        3: customText || "You find your own unique approach to nurturing Luna's creativity and educational growth.",
      },
    };

    const ageConsequences = consequences[decision as keyof typeof consequences];
    const consequence = ageConsequences?.[age as keyof typeof ageConsequences] || "Your decision leads to unexpected outcomes that shape Luna's development in unique ways.";

    // Generate effects based on decision type
    const effects = {
      childDevelopment: {},
      familyDynamics: {},
      finances: { level: 5 },
    };

    if (decision === 'A') {
      effects.childDevelopment = { language: 2, creativity: 1 };
      effects.familyDynamics = { stress: 1, bonding: 1 };
      effects.finances.level = 4;
    } else if (decision === 'B') {
      effects.childDevelopment = { creativity: 1, social: 1 };
      effects.familyDynamics = { stability: 1 };
      effects.finances.level = 6;
    }

    return {
      consequence,
      effects,
    };
  }
}

// Export the appropriate service based on environment
export const gameAPI = MOCK_CONFIG.USE_MOCK_API ? new MockGameAPIService() : new GameAPIService();