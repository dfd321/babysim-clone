import { 
  GameState, 
  ChildCharacter, 
  SiblingRelationship, 
  FamilyDynamics, 
  ChildBirthEvent,
  ScenarioOption,
  PersonalityTrait
} from '../types/game';
import { CharacterDevelopmentService } from './characterDevelopmentService';

export class FamilyManagementService {
  
  // Enhanced family psychology modeling based on family systems theory
  private static readonly PARENTING_STYLE_TRAITS = {
    'authoritative': { cohesion: 80, stress: 30, attachmentSecurity: 85, boundaryClarity: 80 },
    'authoritarian': { cohesion: 60, stress: 50, attachmentSecurity: 60, boundaryClarity: 90 },
    'permissive': { cohesion: 70, stress: 60, attachmentSecurity: 70, boundaryClarity: 40 },
    'neglectful': { cohesion: 30, stress: 80, attachmentSecurity: 30, boundaryClarity: 20 },
    'adaptive': { cohesion: 85, stress: 40, attachmentSecurity: 80, boundaryClarity: 75 }
  };
  
  private static readonly BIRTH_ORDER_EFFECTS = {
    'firstborn': { responsibility: 15, achievement: 10, conformity: 8 },
    'middle': { diplomacy: 12, flexibility: 10, attention_seeking: 8 },
    'youngest': { creativity: 12, charm: 10, dependency: 5 },
    'only': { maturity: 15, achievement: 12, social_skills: -5 }
  };
  
  // Initialize family system for new game
  static initializeFamily(firstChild: ChildCharacter): {
    children: { [childId: string]: ChildCharacter };
    activeChildId: string;
    siblingRelationships: SiblingRelationship[];
    familyDynamics: FamilyDynamics;
    childBirthEvents: ChildBirthEvent[];
  } {
    const childId = this.generateChildId();
    const childWithId = { ...firstChild, id: childId };
    
    return {
      children: { [childId]: childWithId },
      activeChildId: childId,
      siblingRelationships: [],
      familyDynamics: this.initializeEnhancedFamilyDynamics(),
      childBirthEvents: [{
        id: childId,
        name: firstChild.name,
        birthAge: 0,
        circumstances: 'planned',
        impact: {
          happiness: 20,
          finances: -5000,
          familyDynamics: { cohesion: 10 }
        }
      }]
    };
  }

  // Add a new child to the family
  static addChild(
    gameState: GameState, 
    newChild: Omit<ChildCharacter, 'id'>, 
    circumstances: 'planned' | 'surprise' | 'twins' | 'adoption'
  ): GameState {
    const childId = this.generateChildId();
    const childWithId = { 
      ...CharacterDevelopmentService.initializeCharacterDevelopment(newChild as ChildCharacter),
      id: childId 
    };

    const updatedChildren = { ...gameState.children, [childId]: childWithId };
    
    // Create enhanced sibling relationships with existing children
    const newSiblingRelationships = [...gameState.siblingRelationships];
    Object.keys(gameState.children).forEach(existingChildId => {
      newSiblingRelationships.push(this.createEnhancedSiblingRelationship(
        existingChildId, 
        childId, 
        gameState.children[existingChildId].age, 
        newChild.age,
        gameState.familyDynamics
      ));
    });

    // Update family dynamics based on circumstances
    const dynamicsImpact = this.calculateNewChildImpact(circumstances, Object.keys(gameState.children).length);
    const updatedFamilyDynamics = {
      ...gameState.familyDynamics,
      cohesion: Math.max(0, Math.min(100, gameState.familyDynamics.cohesion + dynamicsImpact.cohesion)),
      stress: Math.max(0, Math.min(100, gameState.familyDynamics.stress + dynamicsImpact.stress)),
      resourceStrain: Math.max(0, Math.min(100, gameState.familyDynamics.resourceStrain + dynamicsImpact.resourceStrain))
    };

    const birthEvent: ChildBirthEvent = {
      id: childId,
      name: newChild.name,
      birthAge: gameState.currentAge,
      circumstances,
      impact: {
        happiness: dynamicsImpact.happiness,
        finances: dynamicsImpact.finances,
        familyDynamics: dynamicsImpact
      }
    };

    return {
      ...gameState,
      children: updatedChildren,
      activeChildId: childId, // Focus on new child
      siblingRelationships: newSiblingRelationships,
      familyDynamics: updatedFamilyDynamics,
      childBirthEvents: [...gameState.childBirthEvents, birthEvent],
      happiness: Math.max(0, Math.min(100, gameState.happiness + dynamicsImpact.happiness)),
      finances: gameState.finances + dynamicsImpact.finances
    };
  }

  // Apply decision effects across family
  static applyFamilyDecisionEffects(
    gameState: GameState,
    option: ScenarioOption,
    targetChildId: string,
    age: number
  ): GameState {
    let updatedGameState = { ...gameState };
    
    // Apply effects to target child
    if (updatedGameState.children[targetChildId]) {
      updatedGameState.children[targetChildId] = CharacterDevelopmentService.applyDecisionEffects(
        updatedGameState.children[targetChildId],
        option,
        age
      );
    }

    // Apply sibling effects
    if (option.effects?.siblingEffects) {
      Object.entries(option.effects.siblingEffects).forEach(([siblingId, effects]) => {
        if (updatedGameState.children[siblingId]) {
          // Apply trait effects to sibling
          if (effects.traits) {
            updatedGameState.children[siblingId] = this.applyTraitEffectsToChild(
              updatedGameState.children[siblingId],
              effects.traits
            );
          }
          
          // Update sibling relationship
          if (effects.relationship) {
            updatedGameState.siblingRelationships = this.updateSiblingRelationship(
              updatedGameState.siblingRelationships,
              targetChildId,
              siblingId,
              effects.relationship,
              age
            );
          }
        }
      });
    }

    // Apply family dynamics effects
    if (option.effects?.familyDynamics) {
      updatedGameState.familyDynamics = {
        ...updatedGameState.familyDynamics,
        cohesion: Math.max(0, Math.min(100, 
          updatedGameState.familyDynamics.cohesion + (option.effects.familyDynamics.cohesion || 0)
        )),
        stress: Math.max(0, Math.min(100, 
          updatedGameState.familyDynamics.stress + (option.effects.familyDynamics.stress || 0)
        )),
        resourceStrain: Math.max(0, Math.min(100, 
          updatedGameState.familyDynamics.resourceStrain + (option.effects.familyDynamics.resourceStrain || 0)
        ))
      };
    }

    // Update favoritism if decision affects it
    updatedGameState.familyDynamics = this.updateFavoritism(
      updatedGameState.familyDynamics,
      targetChildId,
      option,
      Object.keys(updatedGameState.children)
    );

    return updatedGameState;
  }
  
  // Initialize enhanced family dynamics with psychological modeling
  private static initializeEnhancedFamilyDynamics(): FamilyDynamics {
    const parentingStyle = this.determineInitialParentingStyle();
    const baseTraits = this.PARENTING_STYLE_TRAITS[parentingStyle];
    
    return {
      cohesion: baseTraits.cohesion + (Math.random() * 20 - 10),
      stress: baseTraits.stress + (Math.random() * 20 - 10),
      favoritism: {},
      resourceStrain: 20 + (Math.random() * 20 - 10),
      parentingStyle,
      communicationPattern: this.determineInitialCommunicationPattern(parentingStyle),
      attachmentSecurity: baseTraits.attachmentSecurity + (Math.random() * 15 - 7),
      resilience: 60 + (Math.random() * 30 - 15),
      emotionalExpressiveness: 50 + (Math.random() * 40 - 20),
      boundaryClarity: baseTraits.boundaryClarity + (Math.random() * 15 - 7),
      traditionalValues: 40 + (Math.random() * 40 - 20),
      adaptability: 60 + (Math.random() * 30 - 15)
    };
  }
  
  private static determineInitialParentingStyle(): FamilyDynamics['parentingStyle'] {
    const styles: FamilyDynamics['parentingStyle'][] = 
      ['authoritative', 'authoritarian', 'permissive', 'neglectful', 'adaptive'];
    const weights = [35, 20, 25, 5, 15]; // Authoritative most common in healthy families
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < styles.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return styles[i];
    }
    
    return 'authoritative';
  }
  
  private static determineInitialCommunicationPattern(
    parentingStyle: FamilyDynamics['parentingStyle']
  ): FamilyDynamics['communicationPattern'] {
    const patterns = {
      'authoritative': ['open', 'healthy', 'open', 'healthy'],
      'authoritarian': ['restricted', 'conflict-avoidant'],
      'permissive': ['chaotic', 'open'],
      'neglectful': ['restricted', 'chaotic', 'conflict-avoidant'],
      'adaptive': ['healthy', 'open']
    };
    
    const options = patterns[parentingStyle];
    return options[Math.floor(Math.random() * options.length)] as FamilyDynamics['communicationPattern'];
  }
  
  // Enhanced sibling relationship creation with birth order psychology
  private static createEnhancedSiblingRelationship(
    childId1: string,
    childId2: string,
    age1: number,
    age2: number,
    familyDynamics: FamilyDynamics
  ): SiblingRelationship {
    const ageDifference = Math.abs(age1 - age2);
    const olderChildId = age1 > age2 ? childId1 : childId2;
    const youngerChildId = age1 > age2 ? childId2 : childId1;
    
    // Base relationship metrics influenced by age gap and family dynamics
    let baseBond = 60;
    let baseRivalry = 30;
    let baseCooperation = 50;
    
    // Age gap effects on relationship quality
    if (ageDifference <= 2) {
      baseRivalry += 20; // Close in age = more rivalry
      baseCooperation += 10;
    } else if (ageDifference >= 5) {
      baseBond += 15; // Large gap = more protective
      baseRivalry -= 15;
    }
    
    // Family dynamics influence
    baseBond += (familyDynamics.cohesion - 50) * 0.3;
    baseRivalry += (familyDynamics.stress - 50) * 0.2;
    baseCooperation += (familyDynamics.attachmentSecurity - 50) * 0.2;
    
    // Determine developmental stage based on ages
    const developmentalStage = this.determineSiblingDevelopmentalStage(age1, age2, ageDifference);
    
    // Determine conflict resolution style based on family communication
    const conflictResolution = this.determineConflictResolutionStyle(
      familyDynamics.communicationPattern,
      ageDifference
    );
    
    return {
      childId1,
      childId2,
      bond: Math.max(10, Math.min(90, baseBond)),
      rivalry: Math.max(5, Math.min(80, baseRivalry)),
      cooperation: Math.max(20, Math.min(90, baseCooperation)),
      lastInteraction: Math.max(age1, age2),
      relationshipType: this.determineRelationshipType(baseBond, baseRivalry, ageDifference),
      jealousy: Math.max(10, Math.min(70, baseRivalry + (Math.random() * 20 - 10))),
      supportiveness: Math.max(20, Math.min(90, baseBond + (Math.random() * 15 - 7))),
      conflictResolution,
      sharedInterests: this.generateSharedInterests(age1, age2),
      birthOrderDynamics: {
        dominancePattern: ageDifference > 3 ? 'older-leads' : 
                         ageDifference < 1.5 ? 'equal' : 'situational',
        responsibilitySharing: Math.max(20, Math.min(80, 40 + ageDifference * 5)),
        protectiveness: Math.max(30, Math.min(90, baseBond + ageDifference * 3))
      },
      developmentalStage
    };
  }
  
  private static determineSiblingDevelopmentalStage(
    age1: number, 
    age2: number, 
    ageDifference: number
  ): SiblingRelationship['developmentalStage'] {
    const youngerAge = Math.min(age1, age2);
    const olderAge = Math.max(age1, age2);
    
    if (youngerAge < 3) return 'parallel-play';
    if (youngerAge < 6 && ageDifference < 3) return 'cooperative';
    if (youngerAge < 10 && ageDifference < 4) return 'competitive';
    if (ageDifference > 5) return 'mentoring';
    return 'independent';
  }
  
  private static determineConflictResolutionStyle(
    communication: FamilyDynamics['communicationPattern'],
    ageDifference: number
  ): SiblingRelationship['conflictResolution'] {
    if (communication === 'open' || communication === 'healthy') {
      return ageDifference > 4 ? 'collaborative' : 'independent';
    }
    if (communication === 'restricted') return 'avoidant';
    if (communication === 'chaotic') return 'aggressive';
    return 'parent-mediated';
  }
  
  private static generateSharedInterests(age1: number, age2: number): string[] {
    const youngerAge = Math.min(age1, age2);
    const ageDifference = Math.abs(age1 - age2);
    
    const ageAppropriateInterests = {
      early: ['toys', 'cartoons', 'playground', 'stories'],
      middle: ['games', 'sports', 'music', 'art', 'reading'],
      late: ['technology', 'movies', 'hobbies', 'social activities']
    };
    
    let baseInterests: string[];
    if (youngerAge <= 5) baseInterests = ageAppropriateInterests.early;
    else if (youngerAge <= 10) baseInterests = ageAppropriateInterests.middle;
    else baseInterests = ageAppropriateInterests.late;
    
    // Closer in age = more shared interests
    const sharedCount = ageDifference < 3 ? 2 + Math.floor(Math.random() * 2) : 
                       ageDifference < 5 ? 1 + Math.floor(Math.random() * 2) :
                       Math.floor(Math.random() * 2);
    
    return baseInterests.slice(0, sharedCount);
  }
  
  private static determineRelationshipType(
    bond: number, 
    rivalry: number, 
    ageDifference: number
  ): SiblingRelationship['relationshipType'] {
    if (bond > 70 && rivalry < 30) return 'close';
    if (bond > 60 && ageDifference > 4) return 'protective';
    if (rivalry > 60) return 'competitive';
    if (bond < 40 && rivalry < 40) return 'distant';
    return 'neutral';
  }
  
  // Apply birth order effects to child development
  static applyBirthOrderEffects(
    child: ChildCharacter, 
    birthOrder: 'firstborn' | 'middle' | 'youngest' | 'only',
    familyDynamics: FamilyDynamics
  ): ChildCharacter {
    const effects = this.BIRTH_ORDER_EFFECTS[birthOrder];
    const updatedTraits = [...child.personalityTraits];
    
    // Apply birth order trait modifications
    if (effects.responsibility) {
      const responsibilityTrait = updatedTraits.find(t => t.id === 'cooperation');
      if (responsibilityTrait) {
        responsibilityTrait.value = Math.min(100, responsibilityTrait.value + effects.responsibility);
      }
    }
    
    if (effects.achievement) {
      const achievementTrait = updatedTraits.find(t => t.id === 'determination');
      if (achievementTrait) {
        achievementTrait.value = Math.min(100, achievementTrait.value + effects.achievement);
      }
    }
    
    if (effects.creativity) {
      const creativityTrait = updatedTraits.find(t => t.id === 'creativity');
      if (creativityTrait) {
        creativityTrait.value = Math.min(100, creativityTrait.value + effects.creativity);
      }
    }
    
    // Family dynamics amplify or dampen birth order effects
    const amplificationFactor = (familyDynamics.boundaryClarity + familyDynamics.traditionalValues) / 200;
    
    updatedTraits.forEach(trait => {
      if (trait.id === 'independence' && birthOrder === 'youngest') {
        trait.value = Math.max(20, trait.value - (effects.dependency || 0) * amplificationFactor);
      }
    });
    
    return { ...child, personalityTraits: updatedTraits };
  }
  
  // Enhanced family crisis and resilience modeling
  static handleFamilyCrisis(
    gameState: GameState,
    crisisType: 'financial' | 'health' | 'relationship' | 'external',
    severity: 'minor' | 'moderate' | 'severe'
  ): GameState {
    const updatedGameState = { ...gameState };
    const familyResilience = updatedGameState.familyDynamics.resilience;
    
    // Crisis impact based on family resilience and type
    const baseImpact = severity === 'minor' ? 15 : severity === 'moderate' ? 30 : 50;
    const resilienceModifier = (100 - familyResilience) / 100;
    const actualImpact = baseImpact * (0.5 + resilienceModifier);
    
    // Update family dynamics
    updatedGameState.familyDynamics = {
      ...updatedGameState.familyDynamics,
      stress: Math.min(100, updatedGameState.familyDynamics.stress + actualImpact),
      cohesion: crisisType === 'relationship' ? 
        Math.max(20, updatedGameState.familyDynamics.cohesion - actualImpact * 0.8) :
        Math.max(30, updatedGameState.familyDynamics.cohesion - actualImpact * 0.3)
    };
    
    // Crisis effects on children based on age and attachment security
    Object.values(updatedGameState.children).forEach(child => {
      const ageVulnerability = child.age < 8 ? 1.5 : child.age < 12 ? 1.2 : 1.0;
      const attachmentProtection = (updatedGameState.familyDynamics.attachmentSecurity / 100) * 0.5;
      const childImpact = actualImpact * ageVulnerability * (1 - attachmentProtection);
      
      // Apply stress effects to child traits
      const resilience = child.personalityTraits.find(t => t.id === 'resilience');
      const confidence = child.personalityTraits.find(t => t.id === 'confidence');
      
      if (resilience && childImpact > 20) {
        resilience.value = Math.max(20, resilience.value - childImpact * 0.3);
      }
      if (confidence && childImpact > 25) {
        confidence.value = Math.max(25, confidence.value - childImpact * 0.2);
      }
    });
    
    return updatedGameState;
  }

  // Get family overview statistics
  static getFamilyOverview(gameState: GameState): {
    totalChildren: number;
    averageHappiness: number;
    oldestChild: ChildCharacter | null;
    youngestChild: ChildCharacter | null;
    familyStressLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    cohesionLevel: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    strongestBond: SiblingRelationship | null;
    weakestBond: SiblingRelationship | null;
  } {
    const children = Object.values(gameState.children);
    const totalChildren = children.length;
    
    if (totalChildren === 0) {
      return {
        totalChildren: 0,
        averageHappiness: 0,
        oldestChild: null,
        youngestChild: null,
        familyStressLevel: 'Low',
        cohesionLevel: 'Good',
        strongestBond: null,
        weakestBond: null
      };
    }

    const averageHappiness = children.reduce((sum, child) => {
      const childHappiness = Object.values(child.relationships).reduce((relSum, rel) => 
        relSum + rel.quality, 0) / Object.values(child.relationships).length;
      return sum + childHappiness;
    }, 0) / totalChildren;

    const oldestChild = children.reduce((oldest, child) => 
      !oldest || child.age > oldest.age ? child : oldest
    );
    
    const youngestChild = children.reduce((youngest, child) => 
      !youngest || child.age < youngest.age ? child : youngest
    );

    const familyStressLevel = gameState.familyDynamics.stress >= 80 ? 'Critical' :
                             gameState.familyDynamics.stress >= 60 ? 'High' :
                             gameState.familyDynamics.stress >= 30 ? 'Moderate' : 'Low';

    const cohesionLevel = gameState.familyDynamics.cohesion >= 80 ? 'Excellent' :
                         gameState.familyDynamics.cohesion >= 60 ? 'Good' :
                         gameState.familyDynamics.cohesion >= 40 ? 'Fair' : 'Poor';

    let strongestBond: SiblingRelationship | null = null;
    let weakestBond: SiblingRelationship | null = null;

    if (gameState.siblingRelationships.length > 0) {
      strongestBond = gameState.siblingRelationships.reduce((strongest, rel) => 
        !strongest || rel.bond > strongest.bond ? rel : strongest
      );
      
      weakestBond = gameState.siblingRelationships.reduce((weakest, rel) => 
        !weakest || rel.bond < weakest.bond ? rel : weakest
      );
    }

    return {
      totalChildren,
      averageHappiness,
      oldestChild,
      youngestChild,
      familyStressLevel,
      cohesionLevel,
      strongestBond,
      weakestBond
    };
  }

  // Private helper methods
  private static generateChildId(): string {
    return `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static createInitialSiblingRelationship(
    childId1: string, 
    childId2: string, 
    age1: number, 
    age2: number
  ): SiblingRelationship {
    const ageDiff = Math.abs(age1 - age2);
    
    // Age difference affects initial relationship
    let baseBond = 70;
    let baseRivalry = 20;
    let baseCooperation = 60;
    let relationshipType: SiblingRelationship['relationshipType'] = 'neutral';

    if (ageDiff <= 2) {
      // Close in age - more rivalry but also more bonding
      baseRivalry += 15;
      baseBond += 10;
      relationshipType = 'competitive';
    } else if (ageDiff <= 5) {
      // Moderate gap - balanced relationship
      relationshipType = 'neutral';
    } else {
      // Large gap - protective/distant
      if (age1 > age2) {
        relationshipType = 'protective';
        baseBond += 15;
        baseRivalry -= 10;
      } else {
        relationshipType = 'distant';
        baseBond -= 10;
      }
    }

    return {
      childId1,
      childId2,
      bond: Math.max(0, Math.min(100, baseBond + (Math.random() * 20 - 10))),
      rivalry: Math.max(0, Math.min(100, baseRivalry + (Math.random() * 20 - 10))),
      cooperation: Math.max(0, Math.min(100, baseCooperation + (Math.random() * 20 - 10))),
      lastInteraction: 0,
      relationshipType
    };
  }

  private static calculateNewChildImpact(circumstances: string, existingChildCount: number): {
    cohesion: number;
    stress: number;
    resourceStrain: number;
    happiness: number;
    finances: number;
  } {
    const baseImpact = {
      cohesion: -5 * existingChildCount, // More stress with more children
      stress: 10 + (5 * existingChildCount),
      resourceStrain: 15 + (5 * existingChildCount),
      happiness: 15,
      finances: -8000
    };

    switch (circumstances) {
      case 'surprise':
        return {
          ...baseImpact,
          cohesion: baseImpact.cohesion - 10,
          stress: baseImpact.stress + 15,
          happiness: baseImpact.happiness - 10,
          finances: baseImpact.finances - 2000
        };
      case 'twins':
        return {
          ...baseImpact,
          cohesion: baseImpact.cohesion - 15,
          stress: baseImpact.stress + 25,
          resourceStrain: baseImpact.resourceStrain + 20,
          happiness: baseImpact.happiness + 5,
          finances: baseImpact.finances - 5000
        };
      case 'adoption':
        return {
          ...baseImpact,
          cohesion: baseImpact.cohesion + 5,
          stress: baseImpact.stress + 5,
          happiness: baseImpact.happiness + 10,
          finances: baseImpact.finances - 10000
        };
      default: // planned
        return baseImpact;
    }
  }

  private static applyTraitEffectsToChild(
    child: ChildCharacter, 
    traitEffects: { [traitId: string]: number }
  ): ChildCharacter {
    const updatedTraits = child.personalityTraits.map(trait => {
      const effect = traitEffects[trait.id];
      if (effect !== undefined) {
        return {
          ...trait,
          value: Math.max(0, Math.min(100, trait.value + effect))
        };
      }
      return trait;
    });

    return { ...child, personalityTraits: updatedTraits };
  }

  private static updateSiblingRelationship(
    relationships: SiblingRelationship[],
    childId1: string,
    childId2: string,
    effects: Partial<SiblingRelationship>,
    age: number
  ): SiblingRelationship[] {
    return relationships.map(rel => {
      if ((rel.childId1 === childId1 && rel.childId2 === childId2) ||
          (rel.childId1 === childId2 && rel.childId2 === childId1)) {
        return {
          ...rel,
          bond: Math.max(0, Math.min(100, rel.bond + (effects.bond || 0))),
          rivalry: Math.max(0, Math.min(100, rel.rivalry + (effects.rivalry || 0))),
          cooperation: Math.max(0, Math.min(100, rel.cooperation + (effects.cooperation || 0))),
          lastInteraction: age,
          relationshipType: effects.relationshipType || rel.relationshipType
        };
      }
      return rel;
    });
  }

  private static updateFavoritism(
    familyDynamics: FamilyDynamics,
    targetChildId: string,
    option: ScenarioOption,
    allChildIds: string[]
  ): FamilyDynamics {
    // Check if decision shows favoritism
    const isPositiveDecision = (option.effects?.happiness || 0) > 0;
    const isExpensiveDecision = (option.effects?.finances || 0) < -5000;
    
    if (isPositiveDecision || isExpensiveDecision) {
      const updatedFavoritism = { ...familyDynamics.favoritism };
      
      // Increase favoritism for target child
      updatedFavoritism[targetChildId] = (updatedFavoritism[targetChildId] || 0) + 5;
      
      // Other children might perceive favoritism
      allChildIds.forEach(childId => {
        if (childId !== targetChildId) {
          updatedFavoritism[childId] = (updatedFavoritism[childId] || 0) + 2;
        }
      });

      return { ...familyDynamics, favoritism: updatedFavoritism };
    }

    return familyDynamics;
  }

  // Get child by ID with null safety
  static getChildById(gameState: GameState, childId: string): ChildCharacter | null {
    return gameState.children[childId] || null;
  }

  // Get active child (currently focused child)
  static getActiveChild(gameState: GameState): ChildCharacter | null {
    return gameState.activeChildId ? this.getChildById(gameState, gameState.activeChildId) : null;
  }

  // Switch active child focus
  static switchActiveChild(gameState: GameState, childId: string): GameState {
    if (gameState.children[childId]) {
      return { ...gameState, activeChildId: childId };
    }
    return gameState;
  }

  // Get sibling relationships for a specific child
  static getSiblingRelationshipsForChild(
    gameState: GameState, 
    childId: string
  ): (SiblingRelationship & { siblingId: string; siblingName: string })[] {
    return gameState.siblingRelationships
      .filter(rel => rel.childId1 === childId || rel.childId2 === childId)
      .map(rel => {
        const siblingId = rel.childId1 === childId ? rel.childId2 : rel.childId1;
        const sibling = gameState.children[siblingId];
        return {
          ...rel,
          siblingId,
          siblingName: sibling ? sibling.name : 'Unknown'
        };
      });
  }
}