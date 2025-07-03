import { 
  GameState, 
  ChildCharacter, 
  SiblingRelationship, 
  FamilyDynamics, 
  ChildBirthEvent,
  ScenarioOption
} from '../types/game';
import { CharacterDevelopmentService } from './characterDevelopmentService';

export class FamilyManagementService {
  
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
      familyDynamics: {
        cohesion: 85,
        stress: 15,
        favoritism: {},
        resourceStrain: 20
      },
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
    
    // Create sibling relationships with existing children
    const newSiblingRelationships = [...gameState.siblingRelationships];
    Object.keys(gameState.children).forEach(existingChildId => {
      newSiblingRelationships.push(this.createInitialSiblingRelationship(
        existingChildId, 
        childId, 
        gameState.children[existingChildId].age, 
        newChild.age
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