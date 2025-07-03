import { 
  GameState, 
  TimelineEntry, 
  PersonalityTrait, 
  Skill, 
  SiblingRelationship
} from '../types/game';

export interface ChildOutcomeAnalysis {
  childId: string;
  name: string;
  age: number;
  
  // Development metrics
  personalityScore: number; // 0-100 based on trait values
  skillsScore: number; // 0-100 based on skill levels
  relationshipsScore: number; // 0-100 based on relationship quality
  overallDevelopmentScore: number; // weighted average
  
  // Specific outcomes
  strongestTraits: PersonalityTrait[];
  topSkills: Skill[];
  milestonesAchieved: number;
  totalMilestones: number;
  
  // Relationship metrics
  bestRelationships: string[];
  challengingRelationships: string[];
  siblingBondStrength: number; // average bond with siblings
  
  // Decision impact analysis
  positiveDecisions: number;
  negativeDecisions: number;
  neutralDecisions: number;
  majorLifeEvents: TimelineEntry[];
}

export interface FamilyOutcomeAnalysis {
  familyId: string;
  totalChildren: number;
  familyAge: number;
  
  // Family-wide metrics
  familyHappiness: number;
  familyStability: number;
  resourceManagement: number;
  
  // Cross-child comparisons
  highestAchiever: ChildOutcomeAnalysis | null;
  mostChallenged: ChildOutcomeAnalysis | null;
  averageDevelopmentScore: number;
  developmentVariance: number; // how different children's outcomes are
  
  // Sibling dynamics
  strongestSiblingBond: SiblingRelationship | null;
  mostRivalrous: SiblingRelationship | null;
  averageSiblingBond: number;
  
  // Parenting patterns
  favoritism: { [childId: string]: number };
  resourceDistribution: { [childId: string]: number };
  attentionDistribution: { [childId: string]: number };
  
  // Decision patterns
  parentingStyle: 'Authoritative' | 'Permissive' | 'Authoritarian' | 'Neglectful' | 'Balanced';
  consistencyScore: number; // how consistent decisions are across children
  riskTolerance: 'Conservative' | 'Moderate' | 'Adventurous';
}

export interface DecisionPatternAnalysis {
  totalDecisions: number;
  happinessImpact: {
    positive: number;
    negative: number;
    neutral: number;
  };
  financialImpact: {
    gained: number;
    spent: number;
    netChange: number;
  };
  developmentImpact: {
    traitsImproved: number;
    skillsGained: number;
    relationshipsStrengthened: number;
  };
  
  // Pattern recognition
  mostFrequentDecisionTypes: string[];
  riskiestDecisions: TimelineEntry[];
  bestDecisions: TimelineEntry[];
  worstDecisions: TimelineEntry[];
  
  // Consistency analysis
  inconsistentDecisions: Array<{
    situation: string;
    decisions: TimelineEntry[];
    reason: string;
  }>;
}

export interface WhatIfScenario {
  scenarioId: string;
  name: string;
  description: string;
  originalOutcome: ChildOutcomeAnalysis;
  alternativeOutcome: ChildOutcomeAnalysis;
  impactDifference: {
    personalityChange: number;
    skillsChange: number;
    relationshipsChange: number;
    overallChange: number;
  };
}

export class AnalyticsService {
  
  // Analyze individual child outcomes
  static analyzeChildOutcome(gameState: GameState, childId: string): ChildOutcomeAnalysis | null {
    const child = gameState.children[childId];
    if (!child) return null;
    
    // Calculate personality score (average of all traits)
    const personalityScore = child.personalityTraits.length > 0 
      ? child.personalityTraits.reduce((sum, trait) => sum + trait.value, 0) / child.personalityTraits.length
      : 0;
    
    // Calculate skills score (weighted by level and unlocked status)
    const skillsScore = child.skills.length > 0 
      ? child.skills.reduce((sum, skill) => {
          const weight = skill.unlocked ? 1 : 0.5;
          return sum + (skill.level * 10 * weight);
        }, 0) / child.skills.length
      : 0;
    
    // Calculate relationships score (average quality)
    const relationshipsScore = Object.values(child.relationships).length > 0
      ? Object.values(child.relationships).reduce((sum, rel) => sum + rel.quality, 0) / Object.values(child.relationships).length
      : 0;
    
    // Overall development score (weighted average)
    const overallDevelopmentScore = (personalityScore * 0.4) + (skillsScore * 0.3) + (relationshipsScore * 0.3);
    
    // Get strongest traits (top 3)
    const strongestTraits = child.personalityTraits
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    
    // Get top skills (top 3 by level)
    const topSkills = child.skills
      .filter(skill => skill.unlocked)
      .sort((a, b) => b.level - a.level)
      .slice(0, 3);
    
    // Count milestones
    const milestonesAchieved = child.milestones.filter(m => m.achieved).length;
    const totalMilestones = child.milestones.length;
    
    // Analyze relationships
    const relationships = Object.entries(child.relationships);
    const bestRelationships = relationships
      .filter(([_, rel]) => rel.quality >= 70)
      .map(([type, _]) => type);
    
    const challengingRelationships = relationships
      .filter(([_, rel]) => rel.quality < 50)
      .map(([type, _]) => type);
    
    // Calculate sibling bond strength
    const siblingRelationships = gameState.siblingRelationships.filter(rel => 
      rel.childId1 === childId || rel.childId2 === childId
    );
    const siblingBondStrength = siblingRelationships.length > 0
      ? siblingRelationships.reduce((sum, rel) => sum + rel.bond, 0) / siblingRelationships.length
      : 0;
    
    // Analyze decisions affecting this child
    const childDecisions = gameState.timeline.filter(entry => 
      entry.childId === childId || !entry.childId // include family-wide decisions
    );
    
    const positiveDecisions = childDecisions.filter(entry => entry.effects.happiness > 0).length;
    const negativeDecisions = childDecisions.filter(entry => entry.effects.happiness < 0).length;
    const neutralDecisions = childDecisions.filter(entry => entry.effects.happiness === 0).length;
    
    // Identify major life events
    const majorLifeEvents = childDecisions.filter(entry => 
      Math.abs(entry.effects.happiness) >= 10 || 
      Math.abs(entry.effects.finances) >= 5000 ||
      entry.effects.development.length >= 3
    );
    
    return {
      childId,
      name: child.name,
      age: child.age,
      personalityScore,
      skillsScore,
      relationshipsScore,
      overallDevelopmentScore,
      strongestTraits,
      topSkills,
      milestonesAchieved,
      totalMilestones,
      bestRelationships,
      challengingRelationships,
      siblingBondStrength,
      positiveDecisions,
      negativeDecisions,
      neutralDecisions,
      majorLifeEvents
    };
  }
  
  // Analyze family-wide outcomes
  static analyzeFamilyOutcome(gameState: GameState): FamilyOutcomeAnalysis {
    const children = Object.values(gameState.children);
    const childAnalyses = children.map(child => 
      this.analyzeChildOutcome(gameState, child.id!)
    ).filter(analysis => analysis !== null) as ChildOutcomeAnalysis[];
    
    // Calculate family metrics
    const familyHappiness = gameState.happiness;
    const familyStability = (gameState.familyDynamics.cohesion + (100 - gameState.familyDynamics.stress)) / 2;
    const resourceManagement = Math.max(0, 100 - gameState.familyDynamics.resourceStrain);
    
    // Cross-child comparisons
    const highestAchiever = childAnalyses.reduce((best, current) => 
      !best || current.overallDevelopmentScore > best.overallDevelopmentScore ? current : best
    , null as ChildOutcomeAnalysis | null);
    
    const mostChallenged = childAnalyses.reduce((worst, current) => 
      !worst || current.overallDevelopmentScore < worst.overallDevelopmentScore ? current : worst
    , null as ChildOutcomeAnalysis | null);
    
    const averageDevelopmentScore = childAnalyses.length > 0 
      ? childAnalyses.reduce((sum, analysis) => sum + analysis.overallDevelopmentScore, 0) / childAnalyses.length
      : 0;
    
    // Calculate development variance
    const developmentVariance = childAnalyses.length > 1 
      ? Math.sqrt(
          childAnalyses.reduce((sum, analysis) => 
            sum + Math.pow(analysis.overallDevelopmentScore - averageDevelopmentScore, 2), 0
          ) / childAnalyses.length
        )
      : 0;
    
    // Sibling dynamics analysis
    const strongestSiblingBond = gameState.siblingRelationships.reduce((strongest, rel) => 
      !strongest || rel.bond > strongest.bond ? rel : strongest
    , null as SiblingRelationship | null);
    
    const mostRivalrous = gameState.siblingRelationships.reduce((most, rel) => 
      !most || rel.rivalry > most.rivalry ? rel : most
    , null as SiblingRelationship | null);
    
    const averageSiblingBond = gameState.siblingRelationships.length > 0
      ? gameState.siblingRelationships.reduce((sum, rel) => sum + rel.bond, 0) / gameState.siblingRelationships.length
      : 0;
    
    // Analyze parenting patterns
    const favoritism = gameState.familyDynamics.favoritism;
    
    // Calculate resource distribution based on timeline spending
    const resourceDistribution: { [childId: string]: number } = {};
    const attentionDistribution: { [childId: string]: number } = {};
    
    children.forEach(child => {
      const childDecisions = gameState.timeline.filter(entry => entry.childId === child.id);
      const totalSpending = childDecisions.reduce((sum, entry) => sum + Math.abs(entry.effects.finances), 0);
      resourceDistribution[child.id!] = totalSpending;
      attentionDistribution[child.id!] = childDecisions.length;
    });
    
    // Determine parenting style
    const parentingStyle = this.determineParentingStyle(gameState);
    
    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(gameState);
    
    // Determine risk tolerance
    const riskTolerance = this.determineRiskTolerance(gameState);
    
    return {
      familyId: gameState.sessionId || 'unknown',
      totalChildren: children.length,
      familyAge: gameState.currentAge,
      familyHappiness,
      familyStability,
      resourceManagement,
      highestAchiever,
      mostChallenged,
      averageDevelopmentScore,
      developmentVariance,
      strongestSiblingBond,
      mostRivalrous,
      averageSiblingBond,
      favoritism,
      resourceDistribution,
      attentionDistribution,
      parentingStyle,
      consistencyScore,
      riskTolerance
    };
  }
  
  // Analyze decision patterns
  static analyzeDecisionPatterns(gameState: GameState): DecisionPatternAnalysis {
    const timeline = gameState.timeline;
    const totalDecisions = timeline.length;
    
    // Happiness impact analysis
    const happinessImpact = {
      positive: timeline.filter(entry => entry.effects.happiness > 0).length,
      negative: timeline.filter(entry => entry.effects.happiness < 0).length,
      neutral: timeline.filter(entry => entry.effects.happiness === 0).length
    };
    
    // Financial impact analysis
    const financialImpact = {
      gained: timeline.filter(entry => entry.effects.finances > 0).reduce((sum, entry) => sum + entry.effects.finances, 0),
      spent: timeline.filter(entry => entry.effects.finances < 0).reduce((sum, entry) => sum + Math.abs(entry.effects.finances), 0),
      netChange: timeline.reduce((sum, entry) => sum + entry.effects.finances, 0)
    };
    
    // Development impact analysis
    const developmentImpact = {
      traitsImproved: timeline.reduce((sum, entry) => sum + (entry.effects.development?.length || 0), 0),
      skillsGained: timeline.filter(entry => entry.effects.development?.some(dev => dev.includes('skill'))).length,
      relationshipsStrengthened: timeline.filter(entry => entry.effects.development?.some(dev => dev.includes('relationship'))).length
    };
    
    // Pattern recognition
    const decisionTypes = timeline.map(entry => this.categorizeDecision(entry));
    const mostFrequentDecisionTypes = this.getMostFrequent(decisionTypes);
    
    // Identify risky, best, and worst decisions
    const riskiestDecisions = timeline
      .filter(entry => Math.abs(entry.effects.happiness) >= 15 || Math.abs(entry.effects.finances) >= 10000)
      .sort((a, b) => (Math.abs(b.effects.happiness) + Math.abs(b.effects.finances) / 1000) - 
                     (Math.abs(a.effects.happiness) + Math.abs(a.effects.finances) / 1000))
      .slice(0, 5);
    
    const bestDecisions = timeline
      .filter(entry => entry.effects.happiness >= 10 && entry.effects.finances >= -5000)
      .sort((a, b) => (b.effects.happiness - a.effects.happiness))
      .slice(0, 5);
    
    const worstDecisions = timeline
      .filter(entry => entry.effects.happiness <= -10 || entry.effects.finances <= -10000)
      .sort((a, b) => (a.effects.happiness - b.effects.happiness))
      .slice(0, 5);
    
    // Analyze inconsistencies
    const inconsistentDecisions = this.findInconsistentDecisions(timeline);
    
    return {
      totalDecisions,
      happinessImpact,
      financialImpact,
      developmentImpact,
      mostFrequentDecisionTypes,
      riskiestDecisions,
      bestDecisions,
      worstDecisions,
      inconsistentDecisions
    };
  }
  
  // Generate comparative analysis across children
  static generateCrossChildComparison(gameState: GameState): {
    developmentComparison: Array<{
      childId: string;
      name: string;
      strengths: string[];
      weaknesses: string[];
      recommendedFocus: string[];
    }>;
    siblingDynamicsInsights: string[];
    familyBalanceRecommendations: string[];
  } {
    const children = Object.values(gameState.children);
    const childAnalyses = children.map(child => 
      this.analyzeChildOutcome(gameState, child.id!)
    ).filter(analysis => analysis !== null) as ChildOutcomeAnalysis[];
    
    const developmentComparison = childAnalyses.map(analysis => {
      const strengths = [];
      const weaknesses = [];
      const recommendedFocus = [];
      
      // Identify strengths and weaknesses
      if (analysis.personalityScore >= 70) strengths.push('Strong personality development');
      else if (analysis.personalityScore < 50) weaknesses.push('Personality development needs attention');
      
      if (analysis.skillsScore >= 70) strengths.push('Excellent skill development');
      else if (analysis.skillsScore < 50) weaknesses.push('Skills need development');
      
      if (analysis.relationshipsScore >= 70) strengths.push('Strong relationships');
      else if (analysis.relationshipsScore < 50) weaknesses.push('Relationship challenges');
      
      // Generate recommendations
      if (analysis.personalityScore < 60) recommendedFocus.push('Personality-building activities');
      if (analysis.skillsScore < 60) recommendedFocus.push('Skill-building opportunities');
      if (analysis.relationshipsScore < 60) recommendedFocus.push('Relationship strengthening');
      if (analysis.siblingBondStrength < 50) recommendedFocus.push('Sibling bonding activities');
      
      return {
        childId: analysis.childId,
        name: analysis.name,
        strengths,
        weaknesses,
        recommendedFocus
      };
    });
    
    // Generate sibling dynamics insights
    const siblingDynamicsInsights = this.generateSiblingInsights(gameState);
    
    // Generate family balance recommendations
    const familyBalanceRecommendations = this.generateFamilyRecommendations(gameState);
    
    return {
      developmentComparison,
      siblingDynamicsInsights,
      familyBalanceRecommendations
    };
  }
  
  // Private helper methods
  private static determineParentingStyle(gameState: GameState): 'Authoritative' | 'Permissive' | 'Authoritarian' | 'Neglectful' | 'Balanced' {
    const decisions = gameState.timeline;
    const strictDecisions = decisions.filter(entry => entry.choice.toLowerCase().includes('strict') || entry.choice.toLowerCase().includes('discipline')).length;
    const supportiveDecisions = decisions.filter(entry => entry.choice.toLowerCase().includes('support') || entry.choice.toLowerCase().includes('encourage')).length;
    const permissiveDecisions = decisions.filter(entry => entry.choice.toLowerCase().includes('allow') || entry.choice.toLowerCase().includes('freedom')).length;
    
    const total = decisions.length;
    if (total === 0) return 'Balanced';
    
    const strictRatio = strictDecisions / total;
    const supportiveRatio = supportiveDecisions / total;
    const permissiveRatio = permissiveDecisions / total;
    
    if (strictRatio > 0.4 && supportiveRatio > 0.4) return 'Authoritative';
    if (strictRatio > 0.5) return 'Authoritarian';
    if (permissiveRatio > 0.5) return 'Permissive';
    if (supportiveRatio < 0.3 && strictRatio < 0.3) return 'Neglectful';
    
    return 'Balanced';
  }
  
  private static calculateConsistencyScore(gameState: GameState): number {
    const decisions = gameState.timeline;
    const childDecisions: { [childId: string]: TimelineEntry[] } = {};
    
    // Group decisions by child
    decisions.forEach(entry => {
      if (entry.childId) {
        if (!childDecisions[entry.childId]) childDecisions[entry.childId] = [];
        childDecisions[entry.childId].push(entry);
      }
    });
    
    // Calculate consistency for similar situations
    let totalConsistency = 0;
    let comparisons = 0;
    
    Object.values(childDecisions).forEach(childEntries => {
      for (let i = 0; i < childEntries.length; i++) {
        for (let j = i + 1; j < childEntries.length; j++) {
          const entry1 = childEntries[i];
          const entry2 = childEntries[j];
          
          // Check if situations are similar
          if (this.areSituationsSimilar(entry1, entry2)) {
            const consistency = this.calculateDecisionConsistency(entry1, entry2);
            totalConsistency += consistency;
            comparisons++;
          }
        }
      }
    });
    
    return comparisons > 0 ? totalConsistency / comparisons : 100;
  }
  
  private static determineRiskTolerance(gameState: GameState): 'Conservative' | 'Moderate' | 'Adventurous' {
    const decisions = gameState.timeline;
    const riskyDecisions = decisions.filter(entry => 
      Math.abs(entry.effects.happiness) >= 15 || Math.abs(entry.effects.finances) >= 10000
    ).length;
    
    const riskRatio = riskyDecisions / decisions.length;
    
    if (riskRatio < 0.2) return 'Conservative';
    if (riskRatio < 0.4) return 'Moderate';
    return 'Adventurous';
  }
  
  private static categorizeDecision(entry: TimelineEntry): string {
    const choice = entry.choice.toLowerCase();
    
    if (choice.includes('education') || choice.includes('school')) return 'Education';
    if (choice.includes('health') || choice.includes('medical')) return 'Health';
    if (choice.includes('social') || choice.includes('friend')) return 'Social';
    if (choice.includes('activity') || choice.includes('hobby')) return 'Activities';
    if (choice.includes('discipline') || choice.includes('behavior')) return 'Discipline';
    if (choice.includes('financial') || choice.includes('money')) return 'Financial';
    
    return 'General';
  }
  
  private static getMostFrequent(items: string[]): string[] {
    const frequency: { [key: string]: number } = {};
    items.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([item, _]) => item);
  }
  
  private static findInconsistentDecisions(timeline: TimelineEntry[]): Array<{
    situation: string;
    decisions: TimelineEntry[];
    reason: string;
  }> {
    const inconsistencies: Array<{
      situation: string;
      decisions: TimelineEntry[];
      reason: string;
    }> = [];
    
    // Group similar situations
    const situationGroups: { [key: string]: TimelineEntry[] } = {};
    
    timeline.forEach(entry => {
      const situation = this.categorizeSituation(entry);
      if (!situationGroups[situation]) situationGroups[situation] = [];
      situationGroups[situation].push(entry);
    });
    
    // Find inconsistencies within each situation type
    Object.entries(situationGroups).forEach(([situation, entries]) => {
      if (entries.length >= 2) {
        const inconsistentPairs = this.findInconsistentPairs(entries);
        if (inconsistentPairs.length > 0) {
          inconsistencies.push({
            situation,
            decisions: inconsistentPairs,
            reason: 'Different approaches to similar situations'
          });
        }
      }
    });
    
    return inconsistencies;
  }
  
  private static categorizeSituation(entry: TimelineEntry): string {
    const scenario = entry.scenario.toLowerCase();
    
    if (scenario.includes('school') || scenario.includes('education')) return 'Education';
    if (scenario.includes('friend') || scenario.includes('social')) return 'Social';
    if (scenario.includes('behavior') || scenario.includes('discipline')) return 'Discipline';
    if (scenario.includes('health') || scenario.includes('medical')) return 'Health';
    if (scenario.includes('activity') || scenario.includes('hobby')) return 'Activities';
    
    return 'General';
  }
  
  private static areSituationsSimilar(entry1: TimelineEntry, entry2: TimelineEntry): boolean {
    return this.categorizeSituation(entry1) === this.categorizeSituation(entry2);
  }
  
  private static calculateDecisionConsistency(entry1: TimelineEntry, entry2: TimelineEntry): number {
    const happiness1 = entry1.effects.happiness;
    const happiness2 = entry2.effects.happiness;
    const finances1 = entry1.effects.finances;
    const finances2 = entry2.effects.finances;
    
    // Calculate similarity in outcomes
    const happinessSimilarity = 100 - Math.abs(happiness1 - happiness2) * 2;
    const financeSimilarity = 100 - Math.abs(finances1 - finances2) / 1000;
    
    return (happinessSimilarity + financeSimilarity) / 2;
  }
  
  private static findInconsistentPairs(entries: TimelineEntry[]): TimelineEntry[] {
    const inconsistent: TimelineEntry[] = [];
    
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const consistency = this.calculateDecisionConsistency(entries[i], entries[j]);
        if (consistency < 50) {
          inconsistent.push(entries[i], entries[j]);
        }
      }
    }
    
    return [...new Set(inconsistent)]; // Remove duplicates
  }
  
  private static generateSiblingInsights(gameState: GameState): string[] {
    const insights: string[] = [];
    const relationships = gameState.siblingRelationships;
    
    if (relationships.length === 0) {
      insights.push('No sibling relationships to analyze yet.');
      return insights;
    }
    
    // Analyze relationship patterns
    const averageBond = relationships.reduce((sum, rel) => sum + rel.bond, 0) / relationships.length;
    const averageRivalry = relationships.reduce((sum, rel) => sum + rel.rivalry, 0) / relationships.length;
    
    if (averageBond >= 70) {
      insights.push('Strong sibling bonds throughout the family - children support each other well.');
    } else if (averageBond < 50) {
      insights.push('Sibling relationships need attention - consider family bonding activities.');
    }
    
    if (averageRivalry >= 60) {
      insights.push('High sibling rivalry detected - may need intervention to reduce competition.');
    }
    
    // Identify specific relationship patterns
    const protectiveRelationships = relationships.filter(rel => rel.relationshipType === 'protective');
    const competitiveRelationships = relationships.filter(rel => rel.relationshipType === 'competitive');
    
    if (protectiveRelationships.length > 0) {
      insights.push('Protective sibling relationships indicate healthy family dynamics.');
    }
    
    if (competitiveRelationships.length > relationships.length * 0.5) {
      insights.push('High competition between siblings - consider individual attention strategies.');
    }
    
    return insights;
  }
  
  private static generateFamilyRecommendations(gameState: GameState): string[] {
    const recommendations: string[] = [];
    const familyDynamics = gameState.familyDynamics;
    
    // Analyze family dynamics
    if (familyDynamics.stress >= 70) {
      recommendations.push('Family stress is high - consider reducing commitments and increasing relaxation time.');
    }
    
    if (familyDynamics.cohesion < 60) {
      recommendations.push('Family cohesion could be improved - plan regular family activities and traditions.');
    }
    
    if (familyDynamics.resourceStrain >= 70) {
      recommendations.push('Resource strain is significant - review budget and prioritize essential expenses.');
    }
    
    // Analyze favoritism
    const favoritism = Object.values(familyDynamics.favoritism);
    if (favoritism.length > 0) {
      const maxFavoritism = Math.max(...favoritism);
      if (maxFavoritism >= 20) {
        recommendations.push('Perceived favoritism detected - ensure equal attention and opportunities for all children.');
      }
    }
    
    // Analyze child count impact
    const childCount = Object.keys(gameState.children).length;
    if (childCount >= 3 && familyDynamics.stress >= 50) {
      recommendations.push('With multiple children, consider delegating responsibilities and creating individual bonding time.');
    }
    
    return recommendations;
  }
}