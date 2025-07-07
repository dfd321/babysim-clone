import { 
  ChildCharacter, 
  RelationshipMetric, 
  PersonalityTrait, 
  DevelopmentEvent,
  Scenario,
  ScenarioOption,
  GameStyle
} from '../types/game';

export interface PeerCharacter {
  id: string;
  name: string;
  age: number;
  gender: string;
  personalityTraits: PersonalityTrait[];
  interests: string[];
  socialStatus: 'popular' | 'average' | 'shy' | 'influential' | 'troublemaker';
  relationshipHistory: string[]; // Events that affected this relationship
  // Enhanced peer modeling
  familyBackground: 'supportive' | 'strict' | 'permissive' | 'chaotic' | 'academic';
  socialInfluence: number; // 0-100 how much this peer influences others
  emotionalRegulation: number; // 0-100 ability to manage emotions
  academicFocus: number; // 0-100 emphasis on school performance
  riskTaking: number; // 0-100 willingness to take risks
}

export interface PeerGroup {
  id: string;
  name: string;
  members: string[]; // peer IDs
  type: 'school_friends' | 'neighborhood' | 'activity_group' | 'sports_team' | 'online_friends';
  influence: number; // 0-100 how much this group affects the child
  values: string[]; // What this group values (academic, athletic, creative, social, etc.)
  lastInteraction: number; // age when last active
}

export interface SocialConflict {
  id: string;
  type: 'friendship_dispute' | 'bullying' | 'peer_pressure' | 'exclusion' | 'competition';
  participants: string[]; // peer IDs involved
  severity: 'minor' | 'moderate' | 'serious';
  ageStarted: number;
  resolved: boolean;
  impact: {
    traits?: { [traitId: string]: number };
    relationships?: { [peerId: string]: Partial<RelationshipMetric> };
  };
}

export class PeerInteractionService {

  // Generate age-appropriate peer characters with enhanced psychological modeling
  static generatePeers(childAge: number, childTraits: PersonalityTrait[], childInterests: string[]): PeerCharacter[] {
    const peers: PeerCharacter[] = [];
    const peerCount = this.getPeerCount(childAge);
    
    for (let i = 0; i < peerCount; i++) {
      peers.push(this.createPeerCharacter(childAge, childTraits, childInterests, i));
    }
    
    // Ensure diverse peer group with different psychological profiles
    return this.balancePeerGroup(peers, childAge);
  }

  // Create a single peer character with realistic personality
  private static createPeerCharacter(
    childAge: number, 
    childTraits: PersonalityTrait[], 
    childInterests: string[], 
    index: number
  ): PeerCharacter {
    const names = {
      boys: ['Alex', 'Ben', 'Charlie', 'David', 'Ethan', 'Felix', 'Gabriel', 'Henry', 'Ian', 'Jack'],
      girls: ['Alice', 'Bella', 'Chloe', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hannah', 'Ivy', 'Julia'],
      neutral: ['Riley', 'Jordan', 'Casey', 'Morgan', 'Avery', 'Quinn', 'Sage', 'River', 'Phoenix', 'Rowan']
    };
    
    const genders = ['boy', 'girl', 'non-binary'];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    
    let namePool: string[];
    if (gender === 'boy') namePool = names.boys;
    else if (gender === 'girl') namePool = names.girls;
    else namePool = names.neutral;
    
    const name = namePool[index % namePool.length];
    
    // Generate personality traits with some similarity to child for friendship potential
    const peerTraits = this.generatePeerTraits(childTraits, childAge);
    
    // Generate interests with some overlap for shared activities
    const peerInterests = this.generatePeerInterests(childInterests, childAge);
    
    // Determine social status based on traits
    const socialStatus = this.determineSocialStatus(peerTraits);
    
    return {
      id: `peer_${Date.now()}_${index}`,
      name,
      age: childAge + Math.floor(Math.random() * 3) - 1, // ±1 year
      gender,
      personalityTraits: peerTraits,
      interests: peerInterests,
      socialStatus,
      relationshipHistory: [],
      // Enhanced psychological attributes
      familyBackground: this.generateFamilyBackground(),
      socialInfluence: this.calculateSocialInfluence(peerTraits, socialStatus),
      emotionalRegulation: this.calculateEmotionalRegulation(peerTraits, childAge),
      academicFocus: this.generateAcademicFocus(peerTraits),
      riskTaking: this.calculateRiskTaking(peerTraits, socialStatus)
    };
  }

  // Generate peer traits with realistic variation and some similarity to child
  private static generatePeerTraits(childTraits: PersonalityTrait[], age: number): PersonalityTrait[] {
    const basePeerTraits = [
      { id: 'curiosity', name: 'Curiosity', category: 'intellectual' as const, description: 'Eagerness to learn and explore' },
      { id: 'empathy', name: 'Empathy', category: 'emotional' as const, description: 'Ability to understand others\' feelings' },
      { id: 'confidence', name: 'Confidence', category: 'social' as const, description: 'Self-assurance in interactions' },
      { id: 'cooperation', name: 'Cooperation', category: 'social' as const, description: 'Ability to work well with others' },
      { id: 'creativity', name: 'Creativity', category: 'creative' as const, description: 'Imaginative and artistic thinking' }
    ];

    return basePeerTraits.map(trait => {
      const childTrait = childTraits.find(ct => ct.id === trait.id);
      let baseValue = 40 + Math.random() * 20; // Random base 40-60
      
      // Add similarity bonus (friends tend to have similar traits)
      if (childTrait && Math.random() < 0.4) {
        const similarity = Math.random() * 30 - 15; // ±15 points
        baseValue = Math.max(20, Math.min(80, childTrait.value + similarity));
      }
      
      // Age adjustments
      if (trait.id === 'confidence' && age < 6) baseValue -= 10;
      if (trait.id === 'empathy' && age < 4) baseValue -= 15;
      
      return {
        ...trait,
        value: Math.round(Math.max(10, Math.min(90, baseValue)))
      };
    });
  }

  // Generate peer interests with some overlap for friendship potential
  private static generatePeerInterests(childInterests: string[], age: number): string[] {
    const ageAppropriateInterests = {
      early: ['toys', 'cartoons', 'playground', 'coloring', 'stories'],
      middle: ['games', 'sports', 'music', 'art', 'reading', 'nature', 'building'],
      late: ['technology', 'fashion', 'movies', 'social media', 'clubs', 'hobbies', 'volunteering']
    };
    
    let availableInterests: string[];
    if (age <= 5) availableInterests = ageAppropriateInterests.early;
    else if (age <= 10) availableInterests = [...ageAppropriateInterests.early, ...ageAppropriateInterests.middle];
    else availableInterests = [...ageAppropriateInterests.middle, ...ageAppropriateInterests.late];
    
    const peerInterests: string[] = [];
    
    // 30% chance to share an interest with child
    if (Math.random() < 0.3 && childInterests.length > 0) {
      const sharedInterest = childInterests[Math.floor(Math.random() * childInterests.length)];
      if (availableInterests.includes(sharedInterest)) {
        peerInterests.push(sharedInterest);
      }
    }
    
    // Add 2-4 random interests
    const numInterests = 2 + Math.floor(Math.random() * 3);
    while (peerInterests.length < numInterests) {
      const interest = availableInterests[Math.floor(Math.random() * availableInterests.length)];
      if (!peerInterests.includes(interest)) {
        peerInterests.push(interest);
      }
    }
    
    return peerInterests;
  }

  // Determine social status based on personality traits
  private static determineSocialStatus(traits: PersonalityTrait[]): PeerCharacter['socialStatus'] {
    const confidence = traits.find(t => t.id === 'confidence')?.value || 50;
    const empathy = traits.find(t => t.id === 'empathy')?.value || 50;
    const cooperation = traits.find(t => t.id === 'cooperation')?.value || 50;
    
    if (confidence > 75 && empathy > 60) return 'popular';
    if (confidence > 70 && cooperation < 40) return 'troublemaker';
    if (confidence > 75) return 'influential';
    if (confidence < 40) return 'shy';
    return 'average';
  }

  // Get appropriate number of peers for age
  private static getPeerCount(age: number): number {
    if (age <= 3) return 1; // Parallel play stage
    if (age <= 6) return 2; // Small friend groups
    if (age <= 10) return 3; // Expanding social circle
    return 4; // More complex social dynamics
  }

  // Initialize peer relationships for a child
  static initializePeerRelationships(character: ChildCharacter): ChildCharacter {
    if (character.age < 2) return character; // Too young for peer relationships
    
    const peers = this.generatePeers(character.age, character.personalityTraits, character.interests);
    const updatedRelationships = { ...character.relationships };
    
    peers.forEach(peer => {
      const compatibility = this.calculateCompatibility(character, peer);
      const initialQuality = 30 + compatibility * 40; // 30-70 range based on compatibility
      
      updatedRelationships[peer.id] = {
        type: 'peer',
        quality: Math.round(initialQuality),
        trust: Math.round(initialQuality - 5 + Math.random() * 10),
        communication: Math.round(initialQuality - 5 + Math.random() * 10),
        lastUpdated: character.age
      };
    });
    
    return { ...character, relationships: updatedRelationships };
  }

  // Calculate compatibility between child and peer
  private static calculateCompatibility(child: ChildCharacter, peer: PeerCharacter): number {
    let compatibility = 0.5; // Base compatibility
    
    // Trait similarity bonus
    child.personalityTraits.forEach(childTrait => {
      const peerTrait = peer.personalityTraits.find(pt => pt.id === childTrait.id);
      if (peerTrait) {
        const difference = Math.abs(childTrait.value - peerTrait.value);
        const similarity = 1 - (difference / 100);
        compatibility += similarity * 0.1; // Up to 0.5 bonus from traits
      }
    });
    
    // Shared interests bonus
    const sharedInterests = child.interests.filter(interest => 
      peer.interests.includes(interest)
    ).length;
    compatibility += sharedInterests * 0.15; // 0.15 per shared interest
    
    // Age difference penalty
    const ageDifference = Math.abs(child.age - peer.age);
    compatibility -= ageDifference * 0.1;
    
    return Math.max(0, Math.min(1, compatibility));
  }

  // Generate peer-based scenarios
  static generatePeerScenario(
    character: ChildCharacter,
    gameStyle: GameStyle,
    availablePeers: PeerCharacter[]
  ): Scenario | null {
    
    if (character.age < 3 || availablePeers.length === 0) return null;
    
    // Find the most relevant peer relationship
    const peerRelationships = Object.entries(character.relationships)
      .filter(([_, rel]) => rel.type === 'peer')
      .sort(([_, a], [__, b]) => b.quality - a.quality);
    
    if (peerRelationships.length === 0) return null;
    
    const [bestPeerId, bestRelationship] = peerRelationships[0];
    const peer = availablePeers.find(p => p.id === bestPeerId);
    
    if (!peer) return null;
    
    // Generate scenario based on relationship quality and peer traits
    if (bestRelationship.quality > 70) {
      return this.generateFriendshipScenario(character, peer, gameStyle);
    } else if (bestRelationship.quality < 40) {
      return this.generateConflictScenario(character, peer, gameStyle);
    } else {
      return this.generateSocialGrowthScenario(character, peer, gameStyle);
    }
  }

  // Generate friendship strengthening scenarios
  private static generateFriendshipScenario(
    character: ChildCharacter,
    peer: PeerCharacter,
    gameStyle: GameStyle
  ): Scenario {
    
    const sharedInterests = character.interests.filter(interest => 
      peer.interests.includes(interest)
    );
    
    const scenario = {
      'Realistic': {
        title: `Best Friends Forever`,
        description: `${character.name} and ${peer.name} have become best friends. They want to do everything together, but ${peer.name}'s family has different rules and expectations than yours.`,
        options: [
          {
            label: "A) Arrange regular playdates and family meetings",
            consequence: "Strong friendship develops with parental support. Happiness +20, finances -2000",
            effects: {
              happiness: 20,
              finances: -2000,
              traits: { 'cooperation': 8, 'empathy': 5 },
              relationships: { [peer.id]: { quality: 10, trust: 8, communication: 6 } }
            }
          },
          {
            label: "B) Let them figure out their friendship independently",
            consequence: "Natural development with some challenges. Happiness +10, finances -500",
            effects: {
              happiness: 10,
              finances: -500,
              traits: { 'independence': 10, 'resilience': 5 },
              relationships: { [peer.id]: { quality: 5, trust: 3 } }
            }
          },
          {
            label: "C) Set clear boundaries about friendship time",
            consequence: "Balanced approach but some disappointment. Happiness +5, finances +0",
            effects: {
              happiness: 5,
              finances: 0,
              traits: { 'cooperation': -3, 'focus': 8 },
              relationships: { [peer.id]: { quality: -5, communication: 5 } }
            }
          }
        ]
      },
      'Fantasy': {
        title: `Magical Bond`,
        description: `${character.name} and ${peer.name} have discovered they can share magical energy, making their abilities stronger when they're together. Other magical beings are taking notice.`,
        options: [
          {
            label: "A) Encourage their magical partnership",
            consequence: "Powerful magical bond but attracts attention. Happiness +25, finances -5000",
            effects: {
              happiness: 25,
              finances: -5000,
              traits: { 'cooperation': 15, 'confidence': 10 },
              relationships: { [peer.id]: { quality: 15, trust: 12 } }
            }
          },
          {
            label: "B) Teach them to control their combined power",
            consequence: "Disciplined approach builds strong foundation. Happiness +15, finances -3000",
            effects: {
              happiness: 15,
              finances: -3000,
              traits: { 'focus': 12, 'cooperation': 8 },
              relationships: { [peer.id]: { quality: 8, trust: 10 } }
            }
          }
        ]
      },
      'Thrilling': {
        title: `Partner in Danger`,
        description: `${character.name} and ${peer.name} have become close allies in this dangerous world. When ${peer.name}'s family is threatened, they look to yours for help.`,
        options: [
          {
            label: "A) Take in the friend's family",
            consequence: "Strong bonds but increased risk. Happiness +30, finances -10000",
            effects: {
              happiness: 30,
              finances: -10000,
              traits: { 'empathy': 15, 'courage': 10 },
              relationships: { [peer.id]: { quality: 20, trust: 18 } }
            }
          },
          {
            label: "B) Help them find other safe shelter",
            consequence: "Supportive but maintains distance. Happiness +15, finances -3000",
            effects: {
              happiness: 15,
              finances: -3000,
              traits: { 'empathy': 8, 'independence': 5 },
              relationships: { [peer.id]: { quality: 8, trust: 12 } }
            }
          }
        ]
      }
    };
    
    return scenario[gameStyle] || scenario['Realistic'];
  }

  // Generate conflict resolution scenarios
  private static generateConflictScenario(
    character: ChildCharacter,
    peer: PeerCharacter,
    gameStyle: GameStyle
  ): Scenario {
    
    const scenario = {
      'Realistic': {
        title: `Friendship Troubles`,
        description: `${character.name} and ${peer.name} have been having frequent arguments. What started as a small disagreement has escalated, and now they're not talking to each other.`,
        options: [
          {
            label: "A) Facilitate a mediated conversation",
            consequence: "Adult guidance helps resolve the conflict. Happiness +15, finances -1000",
            effects: {
              happiness: 15,
              finances: -1000,
              traits: { 'communication': 10, 'empathy': 8 },
              relationships: { [peer.id]: { quality: 20, trust: 10, communication: 15 } }
            }
          },
          {
            label: "B) Let them work it out themselves",
            consequence: "Natural resolution but some lasting tension. Happiness +5, finances +0",
            effects: {
              happiness: 5,
              finances: 0,
              traits: { 'independence': 8, 'resilience': 5 },
              relationships: { [peer.id]: { quality: 10, trust: 5 } }
            }
          },
          {
            label: "C) Encourage your child to find new friends",
            consequence: "Moving on but missed learning opportunity. Happiness +10, finances -500",
            effects: {
              happiness: 10,
              finances: -500,
              traits: { 'resilience': 10, 'empathy': -5 },
              relationships: { [peer.id]: { quality: -10, trust: -5 } }
            }
          }
        ]
      }
    };
    
    return scenario[gameStyle] || scenario['Realistic'];
  }

  // Generate social growth scenarios
  private static generateSocialGrowthScenario(
    character: ChildCharacter,
    peer: PeerCharacter,
    gameStyle: GameStyle
  ): Scenario {
    
    const scenario = {
      'Realistic': {
        title: `Growing Social Circle`,
        description: `${character.name} is developing friendships with ${peer.name} and others. They're learning to navigate group dynamics, sharing, and the complexities of childhood relationships.`,
        options: [
          {
            label: "A) Support their social development actively",
            consequence: "Strong social skills develop with guidance. Happiness +12, finances -2000",
            effects: {
              happiness: 12,
              finances: -2000,
              traits: { 'cooperation': 10, 'confidence': 8, 'empathy': 5 },
              relationships: { [peer.id]: { quality: 8, communication: 10 } }
            }
          },
          {
            label: "B) Observe and intervene only when necessary",
            consequence: "Balanced approach allows natural growth. Happiness +8, finances -500",
            effects: {
              happiness: 8,
              finances: -500,
              traits: { 'independence': 8, 'resilience': 5 },
              relationships: { [peer.id]: { quality: 5, trust: 8 } }
            }
          }
        ]
      }
    };
    
    return scenario[gameStyle] || scenario['Realistic'];
  }

  // Apply enhanced peer influence on character development with psychological modeling
  static applyPeerInfluence(
    character: ChildCharacter,
    peers: PeerCharacter[],
    ageIncrement: number = 1
  ): ChildCharacter {
    
    const updatedCharacter = { ...character };
    
    // Find peers with strong relationships
    const influentialPeers = peers.filter(peer => {
      const relationship = character.relationships[peer.id];
      return relationship && relationship.quality > 50;
    });
    
    if (influentialPeers.length === 0) return updatedCharacter;
    
    // Apply sophisticated peer influence based on psychological research
    influentialPeers.forEach(peer => {
      const relationship = character.relationships[peer.id];
      
      // Calculate influence strength based on multiple factors
      const baseInfluence = (relationship.quality / 100) * 0.2; // Base influence
      const socialInfluenceBonus = (peer.socialInfluence / 100) * 0.15; // Popular peers have more influence
      const trustModifier = (relationship.trust / 100) * 0.1; // Trust amplifies influence
      const ageModifier = this.getAgeInfluenceModifier(character.age); // Age affects susceptibility
      
      const totalInfluence = (baseInfluence + socialInfluenceBonus + trustModifier) * ageModifier;
      
      // Different types of influence based on peer characteristics
      this.applyTraitInfluence(updatedCharacter, peer, totalInfluence, ageIncrement);
      this.applyBehavioralInfluence(updatedCharacter, peer, totalInfluence, ageIncrement);
      this.applyAcademicInfluence(updatedCharacter, peer, totalInfluence, ageIncrement);
    });
    
    return updatedCharacter;
  }

  // Update peer relationships based on character development
  static updatePeerRelationships(
    character: ChildCharacter,
    peers: PeerCharacter[],
    age: number
  ): ChildCharacter {
    
    const updatedRelationships = { ...character.relationships };
    
    Object.keys(updatedRelationships).forEach(peerId => {
      const relationship = updatedRelationships[peerId];
      if (relationship.type !== 'peer') return;
      
      const peer = peers.find(p => p.id === peerId);
      if (!peer) return;
      
      // Natural relationship evolution over time
      const compatibility = this.calculateCompatibility(character, peer);
      const ageGap = Math.abs(character.age - peer.age);
      
      // Relationships naturally drift if compatibility is low or age gap increases
      let qualityChange = 0;
      if (compatibility < 0.3) qualityChange -= 5;
      if (ageGap > 2) qualityChange -= 3;
      if (compatibility > 0.7) qualityChange += 2;
      
      // Update relationship
      updatedRelationships[peerId] = {
        ...relationship,
        quality: Math.max(10, Math.min(100, relationship.quality + qualityChange)),
        lastUpdated: age
      };
    });
    
    return { ...character, relationships: updatedRelationships };
  }

  // Enhanced helper methods for sophisticated peer modeling
  
  private static generateFamilyBackground(): PeerCharacter['familyBackground'] {
    const backgrounds: PeerCharacter['familyBackground'][] = ['supportive', 'strict', 'permissive', 'chaotic', 'academic'];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }
  
  private static calculateSocialInfluence(traits: PersonalityTrait[], status: PeerCharacter['socialStatus']): number {
    const confidence = traits.find(t => t.id === 'confidence')?.value || 50;
    const cooperation = traits.find(t => t.id === 'cooperation')?.value || 50;
    
    let influence = (confidence + cooperation) / 2;
    
    // Status modifiers
    switch (status) {
      case 'popular': influence += 20; break;
      case 'influential': influence += 15; break;
      case 'troublemaker': influence += 10; break;
      case 'shy': influence -= 15; break;
      default: break;
    }
    
    return Math.max(10, Math.min(90, influence));
  }
  
  private static calculateEmotionalRegulation(traits: PersonalityTrait[], age: number): number {
    const empathy = traits.find(t => t.id === 'empathy')?.value || 50;
    const confidence = traits.find(t => t.id === 'confidence')?.value || 50;
    
    let regulation = (empathy + confidence) / 2;
    
    // Age adjustments - emotional regulation develops with age
    if (age < 5) regulation -= 20;
    else if (age < 8) regulation -= 10;
    else if (age < 12) regulation -= 5;
    
    return Math.max(10, Math.min(90, regulation));
  }
  
  private static generateAcademicFocus(traits: PersonalityTrait[]): number {
    const curiosity = traits.find(t => t.id === 'curiosity')?.value || 50;
    const creativity = traits.find(t => t.id === 'creativity')?.value || 50;
    
    // Base academic focus with some randomness
    return Math.max(20, Math.min(80, (curiosity + creativity) / 2 + (Math.random() * 30 - 15)));
  }
  
  private static calculateRiskTaking(traits: PersonalityTrait[], status: PeerCharacter['socialStatus']): number {
    const confidence = traits.find(t => t.id === 'confidence')?.value || 50;
    const cooperation = traits.find(t => t.id === 'cooperation')?.value || 50;
    
    let riskTaking = confidence - cooperation / 2;
    
    // Status modifiers
    switch (status) {
      case 'troublemaker': riskTaking += 25; break;
      case 'influential': riskTaking += 10; break;
      case 'shy': riskTaking -= 20; break;
      default: break;
    }
    
    return Math.max(10, Math.min(90, riskTaking));
  }
  
  private static balancePeerGroup(peers: PeerCharacter[], age: number): PeerCharacter[] {
    // Ensure diversity in peer group - avoid all similar personalities
    if (peers.length <= 1) return peers;
    
    const avgConfidence = peers.reduce((sum, p) => 
      sum + (p.personalityTraits.find(t => t.id === 'confidence')?.value || 50), 0
    ) / peers.length;
    
    // If all peers are too similar, adjust one to be different
    if (Math.abs(avgConfidence - 50) > 25) {
      const peerToAdjust = peers[peers.length - 1];
      const confidenceTrait = peerToAdjust.personalityTraits.find(t => t.id === 'confidence');
      if (confidenceTrait) {
        confidenceTrait.value = avgConfidence > 50 ? 30 : 70;
        peerToAdjust.socialStatus = this.determineSocialStatus(peerToAdjust.personalityTraits);
      }
    }
    
    return peers;
  }
  
  private static getAgeInfluenceModifier(age: number): number {
    // Peer influence is strongest during certain developmental periods
    if (age >= 10 && age <= 14) return 1.3; // Pre-teen peak susceptibility
    if (age >= 6 && age <= 9) return 1.1; // School age moderate influence
    if (age >= 15 && age <= 18) return 1.2; // Teenage peer pressure
    return 0.8; // Younger or older = less susceptible
  }
  
  private static applyTraitInfluence(
    character: ChildCharacter, 
    peer: PeerCharacter, 
    influence: number, 
    ageIncrement: number
  ): void {
    peer.personalityTraits.forEach(peerTrait => {
      const childTraitIndex = character.personalityTraits.findIndex(
        ct => ct.id === peerTrait.id
      );
      
      if (childTraitIndex >= 0) {
        const childTrait = character.personalityTraits[childTraitIndex];
        const difference = peerTrait.value - childTrait.value;
        const traitInfluence = difference * influence * ageIncrement * 0.1;
        
        character.personalityTraits[childTraitIndex] = {
          ...childTrait,
          value: Math.max(0, Math.min(100, childTrait.value + traitInfluence))
        };
      }
    });
  }
  
  private static applyBehavioralInfluence(
    character: ChildCharacter, 
    peer: PeerCharacter, 
    influence: number, 
    ageIncrement: number
  ): void {
    // Risk-taking behavior influence
    if (peer.riskTaking > 70) {
      const resilience = character.personalityTraits.find(t => t.id === 'resilience');
      if (resilience && resilience.value < 60) {
        resilience.value = Math.max(0, resilience.value - influence * 10);
      }
    }
    
    // Emotional regulation influence
    if (peer.emotionalRegulation > 70) {
      const empathy = character.personalityTraits.find(t => t.id === 'empathy');
      if (empathy) {
        empathy.value = Math.min(100, empathy.value + influence * 5);
      }
    }
  }
  
  private static applyAcademicInfluence(
    character: ChildCharacter, 
    peer: PeerCharacter, 
    influence: number, 
    ageIncrement: number
  ): void {
    // Academic focus can influence curiosity and learning motivation
    if (peer.academicFocus > 70) {
      const curiosity = character.personalityTraits.find(t => t.id === 'curiosity');
      if (curiosity) {
        curiosity.value = Math.min(100, curiosity.value + influence * 8);
      }
    } else if (peer.academicFocus < 30) {
      const curiosity = character.personalityTraits.find(t => t.id === 'curiosity');
      if (curiosity && curiosity.value > 40) {
        curiosity.value = Math.max(20, curiosity.value - influence * 5);
      }
    }
  }
}