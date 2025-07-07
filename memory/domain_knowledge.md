# Domain Knowledge - BabySim Project

*Specialized knowledge for parenting simulation and child development*  
*Last Updated: 2025-01-07*

## Child Development Psychology

### Developmental Stages Overview

#### Infancy (0-2 years)
**Key Development Areas:**
- **Physical**: Motor skills, coordination, sensory development
- **Cognitive**: Object permanence, cause-and-effect understanding
- **Social**: Attachment formation, basic trust vs. mistrust
- **Emotional**: Emotional regulation, self-soothing

**Critical Decisions:**
- Feeding approaches (breastfeeding, formula, solid introduction)
- Sleep training methods (cry-it-out, co-sleeping, gradual)
- Daycare vs. home care choices
- Medical decisions (vaccinations, developmental concerns)

**Personality Formation Factors:**
- Caregiver responsiveness → Security/Anxiety traits
- Consistency in routine → Adaptability/Rigidity traits
- Social exposure → Extroversion/Introversion tendencies

#### Early Childhood (3-5 years)
**Key Development Areas:**
- **Physical**: Fine motor skills, potty training, physical independence
- **Cognitive**: Language explosion, symbolic thinking, pre-academic skills
- **Social**: Parallel play to cooperative play, sharing concepts
- **Emotional**: Emotional vocabulary, tantrum management, empathy development

**Critical Decisions:**
- Discipline approaches (time-out, natural consequences, positive reinforcement)
- Preschool selection and timing
- Social interaction facilitation
- Screen time and media exposure
- Independence vs. protection balance

**Personality Formation Factors:**
- Discipline style → Self-control/Impulsivity traits
- Social opportunities → Social confidence/Anxiety
- Creative encouragement → Creativity/Conventionality
- Problem-solving support → Resilience/Fragility

#### School Age (6-8 years)
**Key Development Areas:**
- **Physical**: Organized sports, body awareness, health habits
- **Cognitive**: Formal education, reading/writing, logical thinking
- **Social**: Peer relationships, group dynamics, cooperation
- **Emotional**: Self-concept formation, competence vs. inferiority

**Critical Decisions:**
- School choice (public, private, homeschool)
- Extracurricular activities (sports, arts, academics)
- Homework support vs. independence
- Friendship guidance and conflict resolution
- Technology introduction and limits

**Personality Formation Factors:**
- Academic support → Confidence/Insecurity in learning
- Social facilitation → Leadership/Follower tendencies
- Challenge level → Growth mindset/Fixed mindset
- Failure handling → Resilience/Perfectionism

#### Pre-Adolescence (9-12 years)
**Key Development Areas:**
- **Physical**: Puberty onset, body image awareness, physical competence
- **Cognitive**: Abstract thinking development, moral reasoning
- **Social**: Best friend relationships, group identity, social hierarchy
- **Emotional**: Identity exploration, emotional complexity, independence seeking

**Critical Decisions:**
- Puberty education and support
- Social media introduction and monitoring
- Increased independence vs. safety concerns
- Academic pressure and achievement expectations
- Peer influence management

**Personality Formation Factors:**
- Autonomy support → Independence/Dependence
- Social navigation → Social intelligence/Awkwardness
- Identity exploration → Self-confidence/Identity confusion
- Moral discussions → Ethical reasoning/Moral flexibility

#### Adolescence (13-15 years)
**Key Development Areas:**
- **Physical**: Puberty completion, sexual development, risk-taking behaviors
- **Cognitive**: Formal operational thinking, future planning, idealistic thinking
- **Social**: Peer group importance, romantic interests, social identity
- **Emotional**: Identity vs. role confusion, emotional intensity, autonomy struggles

**Critical Decisions:**
- Dating and relationship guidance
- Substance use prevention and education
- Academic track selection (advanced, vocational, standard)
- Part-time work and responsibility balance
- Mental health support and intervention

**Personality Formation Factors:**
- Trust and communication → Openness/Secretiveness
- Boundary setting → Responsibility/Recklessness
- Identity support → Self-acceptance/Self-doubt
- Risk guidance → Calculated risk-taking/Risk aversion

#### Late Adolescence (16-18 years)
**Key Development Areas:**
- **Physical**: Adult physical capabilities, health responsibility
- **Cognitive**: Advanced reasoning, career planning, life skills
- **Social**: Intimate relationships, adult social roles, community involvement
- **Emotional**: Identity consolidation, future orientation, value establishment

**Critical Decisions:**
- Driving privileges and responsibilities
- College/career planning and support
- Serious relationship navigation
- Financial responsibility and independence
- Adult transition preparation

**Personality Formation Factors:**
- Independence preparation → Self-reliance/Dependence
- Future planning → Goal orientation/Aimlessness
- Relationship modeling → Relationship skills/Dysfunction
- Value transmission → Value clarity/Value confusion

## Parenting Styles & Their Effects

### Authoritative Parenting
**Characteristics:**
- High responsiveness, high demands
- Clear expectations with emotional support
- Democratic decision-making with child input
- Consistent boundaries with explanations

**Typical Outcomes:**
- Higher self-esteem and confidence
- Better academic performance
- Stronger social skills
- Lower rates of behavioral problems

**Game Implementation:**
```typescript
const authoritativeDecision = {
  effects: {
    happiness: +5,
    traits: { confidence: +8, self_control: +6, social_skills: +7 },
    relationships: { 'parent-child': { trust: +5, communication: +8 } }
  }
};
```

### Authoritarian Parenting
**Characteristics:**
- Low responsiveness, high demands
- Strict rules without explanation
- Punishment-based discipline
- Limited child autonomy

**Typical Outcomes:**
- Lower self-esteem
- Difficulty with decision-making
- Higher anxiety levels
- Potential rebellion in adolescence

**Game Implementation:**
```typescript
const authoritarianDecision = {
  effects: {
    happiness: -3,
    traits: { confidence: -4, independence: -6, anxiety: +4 },
    relationships: { 'parent-child': { trust: -3, communication: -5 } }
  }
};
```

### Permissive Parenting
**Characteristics:**
- High responsiveness, low demands
- Few rules or expectations
- Avoidance of confrontation
- Child-led decision making

**Typical Outcomes:**
- Difficulty with self-regulation
- Higher impulsivity
- Academic challenges
- Potential substance use issues

**Game Implementation:**
```typescript
const permissiveDecision = {
  effects: {
    happiness: +3,
    traits: { self_control: -5, impulsivity: +6, creativity: +3 },
    relationships: { 'parent-child': { quality: +2, respect: -3 } }
  }
};
```

### Neglectful Parenting
**Characteristics:**
- Low responsiveness, low demands
- Minimal involvement in child's life
- Lack of emotional support
- Inconsistent or absent boundaries

**Typical Outcomes:**
- Attachment difficulties
- Behavioral problems
- Academic struggles
- Higher risk behaviors

**Game Implementation:**
```typescript
const neglectfulDecision = {
  effects: {
    happiness: -8,
    traits: { security: -10, self_worth: -8, resilience: -6 },
    relationships: { 'parent-child': { quality: -8, trust: -10 } }
  }
};
```

## Cultural Considerations

### Western Individualistic Cultures
**Values:**
- Independence and self-reliance
- Personal achievement and competition
- Individual rights and freedoms
- Direct communication styles

**Parenting Approaches:**
- Emphasis on child's unique talents
- Encouragement of self-expression
- Early independence training
- Achievement-oriented goals

### Eastern Collectivistic Cultures
**Values:**
- Family harmony and interdependence
- Group success over individual achievement
- Respect for authority and tradition
- Indirect communication styles

**Parenting Approaches:**
- Family reputation considerations
- Educational achievement emphasis
- Respect and obedience training
- Long-term family planning

### Game Style Implications

#### Realistic Style
- Evidence-based developmental psychology
- Cultural sensitivity without stereotypes
- Real-world consequence modeling
- Age-appropriate challenges

#### Fantasy Style
- Magical elements that metaphorically represent real development
- Creative problem-solving scenarios
- Imaginative but psychologically sound outcomes
- Wonder and creativity emphasis

#### Thrilling Style
- High-stakes scenarios with real psychological principles
- Dramatic but realistic consequences
- Intense emotional situations
- Resilience and crisis management focus

## Scenario Generation Guidelines

### Age-Appropriate Content Rules

#### Ages 0-5
**Allowed Topics:**
- Sleep routines and challenges
- Feeding and nutrition decisions
- Social interaction basics
- Learning environment setup
- Safety and health choices

**Prohibited Topics:**
- Complex social conflicts
- Academic pressure
- Serious behavioral issues
- Advanced moral dilemmas

#### Ages 6-12
**Allowed Topics:**
- School-related challenges
- Friendship dynamics
- Extracurricular choices
- Basic responsibility training
- Simple moral decisions

**Prohibited Topics:**
- Romantic relationships
- Substance use
- Serious mental health issues
- Adult-level conflicts

#### Ages 13-18
**Allowed Topics:**
- Identity exploration
- Peer pressure situations
- Academic and career planning
- Relationship guidance
- Risk behavior education

**Content Sensitivity:**
- No graphic descriptions
- Focus on decision-making process
- Emphasize learning opportunities
- Maintain hopeful outcomes

### Consequence Modeling

#### Short-term Effects (Immediate)
```typescript
interface ImmediateEffect {
  happiness: number;           // -10 to +10
  stress: number;             // -10 to +10
  parent_child_bond: number;  // -5 to +5
  immediate_skill: string;    // Skill immediately practiced
}
```

#### Medium-term Effects (Next 1-2 years)
```typescript
interface MediumTermEffect {
  personality_shift: { [trait: string]: number };  // -5 to +5
  skill_development: { [skill: string]: number };  // -3 to +3
  relationship_changes: { [type: string]: number }; // -3 to +3
  habit_formation: string[];  // New habits developed
}
```

#### Long-term Effects (Adulthood outcomes)
```typescript
interface LongTermEffect {
  adult_personality: { [trait: string]: number };   // Final trait scores
  life_outcomes: {
    education_level: string;
    career_success: number;     // 1-10 scale
    relationship_quality: number; // 1-10 scale
    mental_health: number;      // 1-10 scale
    life_satisfaction: number;  // 1-10 scale
  };
  generational_effects: string[]; // How they parent their own children
}
```

## Content Moderation Guidelines

### Automatic Filtering Rules
```typescript
const contentFilters = {
  prohibited_keywords: [
    // Violence
    'abuse', 'violence', 'harm', 'hurt', 'kill', 'death',
    // Sexual content
    'sexual', 'sex', 'intimate', 'adult content',
    // Substance abuse
    'drugs', 'alcohol', 'smoking', 'addiction',
    // Mental health crises
    'suicide', 'self-harm', 'depression crisis',
  ],
  
  required_review_keywords: [
    // Sensitive topics requiring human review
    'therapy', 'counseling', 'medication', 'diagnosis',
    'bullying', 'aggression', 'conflict', 'punishment',
    'divorce', 'separation', 'loss', 'grief',
  ],
  
  age_inappropriate: {
    under_10: ['dating', 'romance', 'puberty', 'body image'],
    under_13: ['serious relationships', 'identity crisis', 'peer pressure'],
    under_16: ['adult responsibilities', 'serious consequences']
  }
};
```

### Human Review Triggers
1. **AI Confidence < 80%**: Requires human validation
2. **Sensitive Keywords**: Flagged for expert review
3. **Cultural Content**: Reviewed by cultural consultants
4. **User Reports**: Community-flagged content reviewed within 24h
5. **New Scenarios**: First 10 of each type require approval

### Quality Assurance Metrics
```typescript
interface ContentQuality {
  psychological_accuracy: number;    // 1-5 expert rating
  age_appropriateness: number;      // 1-5 expert rating
  cultural_sensitivity: number;     // 1-5 diversity audit
  educational_value: number;        // 1-5 learning assessment
  engagement_score: number;         // User rating average
  completion_rate: number;          // % users who complete scenario
}
```

## Educational Integration

### Learning Objectives by Age
```typescript
const learningObjectives = {
  early_childhood: [
    'Understand attachment importance',
    'Recognize developmental milestones',
    'Learn positive discipline techniques',
    'Appreciate individual differences'
  ],
  
  school_age: [
    'Support academic development',
    'Foster social skills',
    'Encourage independence',
    'Build resilience and coping skills'
  ],
  
  adolescence: [
    'Navigate identity development',
    'Manage peer pressure situations',
    'Prepare for adult transition',
    'Maintain family relationships'
  ]
};
```

### Assessment Integration
```typescript
interface LearningAssessment {
  pre_scenario_quiz: {
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }[];
  
  post_scenario_reflection: {
    open_ended_questions: string[];
    self_assessment_scales: {
      confidence: number;  // 1-5 scale
      understanding: number;
      application_likelihood: number;
    };
  };
  
  knowledge_retention_check: {
    delayed_quiz: Date;  // 1 week later
    scenario_recall: string[];
    principle_application: string[];
  };
}
```

## Research Integration Opportunities

### Data Collection for Research
```typescript
interface ResearchData {
  anonymous_decision_patterns: {
    age_group: string;
    decision_type: string;
    choice_distribution: number[];
    outcome_satisfaction: number;
  };
  
  learning_effectiveness: {
    pre_knowledge_score: number;
    post_knowledge_score: number;
    retention_score: number;
    confidence_change: number;
  };
  
  user_demographics: {
    parenting_status: 'expecting' | 'new_parent' | 'experienced' | 'student';
    education_level: string;
    cultural_background: string;
    primary_language: string;
  };
}
```

### Partnership Opportunities
- **Universities**: Child development research collaboration
- **Parenting Organizations**: Content validation and distribution
- **Healthcare Providers**: Educational resource integration
- **Policy Makers**: Evidence-based parenting program development

---

*This domain knowledge serves as the foundation for all content creation and game mechanics. All agents should reference this when working on scenario generation, character development, or educational features.*