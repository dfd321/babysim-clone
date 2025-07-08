import { 
  ChildCharacter, 
  PersonalityTrait, 
  Skill, 
  RelationshipMetric, 
  DevelopmentMilestone, 
  DevelopmentEvent,
  ScenarioOption 
} from '../types/game';

export class CharacterDevelopmentService {
  
  // Base personality traits that all children start with
  private static readonly BASE_TRAITS: Omit<PersonalityTrait, 'value'>[] = [
    { id: 'curiosity', name: 'Curiosity', category: 'intellectual', description: 'Eagerness to learn and explore' },
    { id: 'empathy', name: 'Empathy', category: 'emotional', description: 'Ability to understand others\' feelings' },
    { id: 'confidence', name: 'Confidence', category: 'social', description: 'Self-assurance in interactions' },
    { id: 'creativity', name: 'Creativity', category: 'creative', description: 'Imaginative and artistic thinking' },
    { id: 'resilience', name: 'Resilience', category: 'emotional', description: 'Ability to bounce back from challenges' },
    { id: 'independence', name: 'Independence', category: 'social', description: 'Self-reliance and autonomy' },
    { id: 'cooperation', name: 'Cooperation', category: 'social', description: 'Ability to work well with others' },
    { id: 'focus', name: 'Focus', category: 'intellectual', description: 'Concentration and attention span' },
    { id: 'compassion', name: 'Compassion', category: 'emotional', description: 'Caring and kindness toward others' },
    { id: 'determination', name: 'Determination', category: 'physical', description: 'Persistence in achieving goals' }
  ];

  // Skills that can be developed over time
  private static readonly AVAILABLE_SKILLS: Omit<Skill, 'level' | 'experience' | 'unlocked'>[] = [
    { id: 'reading', name: 'Reading', category: 'academic' },
    { id: 'math', name: 'Mathematics', category: 'academic' },
    { id: 'writing', name: 'Writing', category: 'academic' },
    { id: 'music', name: 'Music', category: 'artistic' },
    { id: 'art', name: 'Visual Art', category: 'artistic' },
    { id: 'sports', name: 'Sports', category: 'athletic' },
    { id: 'leadership', name: 'Leadership', category: 'social' },
    { id: 'communication', name: 'Communication', category: 'social' },
    { id: 'cooking', name: 'Cooking', category: 'practical' },
    { id: 'problem_solving', name: 'Problem Solving', category: 'academic' },
    { id: 'teamwork', name: 'Teamwork', category: 'social' },
    { id: 'science', name: 'Science', category: 'academic' }
  ];

  // Age-based milestones
  private static readonly MILESTONES: DevelopmentMilestone[] = [
    {
      id: 'first_words',
      name: 'First Words',
      age: 1,
      achieved: false,
      impact: {
        traits: { 'communication': 10, 'confidence': 5 },
        skills: { 'communication': 5 }
      }
    },
    {
      id: 'social_play',
      name: 'Social Play',
      age: 3,
      achieved: false,
      impact: {
        traits: { 'cooperation': 15, 'empathy': 10 },
        relationships: { 'peer': { quality: 10, communication: 15 } }
      }
    },
    {
      id: 'reading_readiness',
      name: 'Reading Readiness',
      age: 5,
      achieved: false,
      impact: {
        traits: { 'curiosity': 10, 'focus': 15 },
        skills: { 'reading': 10 }
      }
    },
    {
      id: 'peer_relationships',
      name: 'Strong Peer Relationships',
      age: 7,
      achieved: false,
      impact: {
        traits: { 'empathy': 10, 'cooperation': 10 },
        relationships: { 'peer': { quality: 20, trust: 15 } }
      }
    },
    {
      id: 'academic_foundation',
      name: 'Academic Foundation',
      age: 8,
      achieved: false,
      impact: {
        traits: { 'focus': 15, 'determination': 10 },
        skills: { 'reading': 15, 'math': 15, 'writing': 10 }
      }
    },
    {
      id: 'independence',
      name: 'Personal Independence',
      age: 10,
      achieved: false,
      impact: {
        traits: { 'independence': 20, 'confidence': 15 },
        relationships: { 'parent-child': { quality: 5, trust: 10 } }
      }
    }
  ];

  static initializeCharacterDevelopment(character: ChildCharacter): ChildCharacter {
    // Initialize personality traits with age-appropriate values
    const personalityTraits: PersonalityTrait[] = this.BASE_TRAITS.map(trait => ({
      ...trait,
      value: this.generateInitialTraitValue(trait.id, character.age)
    }));

    // Initialize basic skills for age
    const skills: Skill[] = this.AVAILABLE_SKILLS
      .filter(skill => this.isSkillUnlockedAtAge(skill.id, character.age))
      .map(skill => ({
        ...skill,
        level: 1,
        experience: 0,
        unlocked: true
      }));

    // Initialize relationships
    const relationships: { [key: string]: RelationshipMetric } = {
      'parent-child': {
        type: 'parent-child',
        quality: 80,
        trust: 85,
        communication: 70,
        lastUpdated: character.age
      }
    };

    // Initialize milestones based on age
    const milestones = this.MILESTONES.map(milestone => ({
      ...milestone,
      achieved: character.age >= milestone.age
    }));

    return {
      ...character,
      personalityTraits,
      skills,
      relationships,
      milestones,
      developmentHistory: []
    };
  }

  static applyDecisionEffects(
    character: ChildCharacter, 
    option: ScenarioOption, 
    age: number
  ): ChildCharacter {
    const updatedCharacter = { ...character };
    const developmentEvent: DevelopmentEvent = {
      age,
      type: 'trait_change',
      description: `Decision: ${option.label}`,
      impact: {}
    };

    // Apply trait changes
    if (option.effects?.traits) {
      updatedCharacter.personalityTraits = updatedCharacter.personalityTraits.map(trait => {
        const change = option.effects!.traits![trait.id];
        if (change !== undefined) {
          const newValue = Math.max(0, Math.min(100, trait.value + change));
          developmentEvent.impact.traits = { ...developmentEvent.impact.traits, [trait.id]: change };
          return { ...trait, value: newValue };
        }
        return trait;
      });
    }

    // Apply skill changes
    if (option.effects?.skills) {
      Object.entries(option.effects.skills).forEach(([skillId, change]) => {
        const skillIndex = updatedCharacter.skills.findIndex(s => s.id === skillId);
        if (skillIndex >= 0) {
          const skill = updatedCharacter.skills[skillIndex];
          const newExperience = Math.max(0, Math.min(100, skill.experience + change));
          
          // Level up if experience reaches 100
          let newLevel = skill.level;
          let finalExperience = newExperience;
          if (newExperience >= 100 && skill.level < 10) {
            newLevel++;
            finalExperience = newExperience - 100;
          }

          updatedCharacter.skills[skillIndex] = {
            ...skill,
            level: newLevel,
            experience: finalExperience
          };
          
          developmentEvent.impact.skills = { ...developmentEvent.impact.skills, [skillId]: change };
        } else {
          // Unlock new skill if mentioned
          const availableSkill = this.AVAILABLE_SKILLS.find(s => s.id === skillId);
          if (availableSkill) {
            updatedCharacter.skills.push({
              ...availableSkill,
              level: 1,
              experience: Math.max(0, change),
              unlocked: true
            });
            developmentEvent.impact.skills = { ...developmentEvent.impact.skills, [skillId]: change };
          }
        }
      });
    }

    // Apply relationship changes
    if (option.effects?.relationships) {
      Object.entries(option.effects.relationships).forEach(([relType, changes]) => {
        if (updatedCharacter.relationships[relType]) {
          const relationship = updatedCharacter.relationships[relType];
          updatedCharacter.relationships[relType] = {
            ...relationship,
            quality: Math.max(0, Math.min(100, relationship.quality + (changes.quality || 0))),
            trust: Math.max(0, Math.min(100, relationship.trust + (changes.trust || 0))),
            communication: Math.max(0, Math.min(100, relationship.communication + (changes.communication || 0))),
            lastUpdated: age
          };
          developmentEvent.impact.relationships = { 
            ...developmentEvent.impact.relationships, 
            [relType]: changes 
          };
        }
      });
    }

    // Check for milestone achievements
    updatedCharacter.milestones = updatedCharacter.milestones.map(milestone => {
      if (!milestone.achieved && age >= milestone.age) {
        // Check if conditions are met (for now, just age-based)
        const shouldAchieve = this.checkMilestoneConditions(milestone, updatedCharacter);
        if (shouldAchieve) {
          this.applyMilestoneEffects(updatedCharacter, milestone);
          return { ...milestone, achieved: true };
        }
      }
      return milestone;
    });

    // Add development event to history
    updatedCharacter.developmentHistory.push(developmentEvent);

    // Apply natural trait evolution based on age
    updatedCharacter.personalityTraits = this.applyNaturalTraitEvolution(
      updatedCharacter.personalityTraits, 
      age
    );

    return updatedCharacter;
  }

  private static generateInitialTraitValue(traitId: string, age: number): number {
    // Base values vary by trait and age
    const baseValues: { [key: string]: number } = {
      'curiosity': 70,
      'empathy': 60,
      'confidence': 50,
      'creativity': 75,
      'resilience': 45,
      'independence': 30 + (age * 3),
      'cooperation': 55,
      'focus': 35 + (age * 2),
      'compassion': 65,
      'determination': 50
    };

    const base = baseValues[traitId] || 50;
    return Math.max(10, Math.min(90, base + (Math.random() * 20 - 10)));
  }

  private static isSkillUnlockedAtAge(skillId: string, age: number): boolean {
    const unlockAges: { [key: string]: number } = {
      'communication': 0,
      'reading': 3,
      'math': 4,
      'writing': 5,
      'music': 3,
      'art': 2,
      'sports': 4,
      'leadership': 8,
      'cooking': 6,
      'problem_solving': 5,
      'teamwork': 6,
      'science': 7
    };

    return age >= (unlockAges[skillId] || 10);
  }

  private static checkMilestoneConditions(
    _milestone: DevelopmentMilestone, 
    _character: ChildCharacter
  ): boolean {
    // Simple age-based for now, could be enhanced with trait/skill requirements
    return true;
  }

  private static applyMilestoneEffects(
    character: ChildCharacter, 
    milestone: DevelopmentMilestone
  ): void {
    // Apply milestone effects to traits, skills, and relationships
    if (milestone.impact.traits) {
      Object.entries(milestone.impact.traits).forEach(([traitId, change]) => {
        const traitIndex = character.personalityTraits.findIndex(t => t.id === traitId);
        if (traitIndex >= 0) {
          const trait = character.personalityTraits[traitIndex];
          character.personalityTraits[traitIndex] = {
            ...trait,
            value: Math.max(0, Math.min(100, trait.value + change))
          };
        }
      });
    }

    if (milestone.impact.skills) {
      Object.entries(milestone.impact.skills).forEach(([skillId, change]) => {
        const skillIndex = character.skills.findIndex(s => s.id === skillId);
        if (skillIndex >= 0) {
          const skill = character.skills[skillIndex];
          character.skills[skillIndex] = {
            ...skill,
            experience: Math.max(0, Math.min(100, skill.experience + change))
          };
        }
      });
    }

    if (milestone.impact.relationships) {
      Object.entries(milestone.impact.relationships).forEach(([relType, changes]) => {
        if (character.relationships[relType] && changes) {
          const relationship = character.relationships[relType];
          character.relationships[relType] = {
            ...relationship,
            quality: Math.max(0, Math.min(100, relationship.quality + (changes.quality || 0))),
            trust: Math.max(0, Math.min(100, relationship.trust + (changes.trust || 0))),
            communication: Math.max(0, Math.min(100, relationship.communication + (changes.communication || 0)))
          };
        }
      });
    }
  }

  private static applyNaturalTraitEvolution(
    traits: PersonalityTrait[], 
    age: number
  ): PersonalityTrait[] {
    return traits.map(trait => {
      // Small natural changes based on age and trait type
      let naturalChange = 0;
      
      switch (trait.category) {
        case 'intellectual':
          naturalChange = age > 5 ? Math.random() * 2 - 1 : 0;
          break;
        case 'social':
          naturalChange = age > 3 ? Math.random() * 1.5 - 0.75 : 0;
          break;
        case 'emotional':
          naturalChange = Math.random() * 1 - 0.5;
          break;
        case 'physical':
          naturalChange = age > 4 ? Math.random() * 1.5 - 0.75 : 0;
          break;
        case 'creative':
          naturalChange = Math.random() * 1 - 0.5;
          break;
      }

      return {
        ...trait,
        value: Math.max(0, Math.min(100, trait.value + naturalChange))
      };
    });
  }

  static getTraitsByCategory(character: ChildCharacter): { [category: string]: PersonalityTrait[] } {
    const traits = character.personalityTraits || [];
    return traits.reduce((acc, trait) => {
      if (!acc[trait.category]) acc[trait.category] = [];
      acc[trait.category].push(trait);
      return acc;
    }, {} as { [category: string]: PersonalityTrait[] });
  }

  static getSkillsByCategory(character: ChildCharacter): { [category: string]: Skill[] } {
    const skills = character.skills || [];
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as { [category: string]: Skill[] });
  }

  static getOverallDevelopmentScore(character: ChildCharacter): number {
    // Safe array access with fallbacks
    const traits = character.personalityTraits || [];
    const skills = character.skills || [];
    const relationships = character.relationships || {};
    
    const traitAvg = traits.length > 0 
      ? traits.reduce((sum, trait) => sum + trait.value, 0) / traits.length 
      : 50; // Default average score
      
    const skillAvg = skills.length > 0 
      ? skills.reduce((sum, skill) => sum + (skill.level * 10), 0) / skills.length 
      : 30; // Default skill level (level 3 * 10)
      
    const relationshipValues = Object.values(relationships);
    const relationshipAvg = relationshipValues.length > 0 
      ? relationshipValues.reduce((sum, rel) => sum + rel.quality, 0) / relationshipValues.length 
      : 70; // Default relationship quality
    
    return (traitAvg + skillAvg + relationshipAvg) / 3;
  }
}