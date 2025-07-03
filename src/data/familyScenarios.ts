import { Scenario, GameStyle } from '../types/game';

// Family scenarios that involve multiple children and resource allocation
export const getFamilyScenario = (
  _age: number, 
  gameStyle: GameStyle, 
  numberOfChildren: number,
  familyStress: number
): Scenario | null => {
  
  // Only return family scenarios if there are multiple children
  if (numberOfChildren < 2) return null;

  const familyScenarios: Record<string, Record<string, Scenario[]>> = {
    'multi_child': {
      'Realistic': [
        {
          title: "Sibling Rivalry Over Attention",
          description: `Your children are constantly fighting for your attention. ${numberOfChildren === 2 ? 'Both children' : 'The children'} are acting out, and every family activity becomes a competition. Meal times are stressful, bedtime is chaotic, and you're exhausted from mediating conflicts all day.`,
          options: [
            {
              label: "A) Implement one-on-one time with each child",
              consequence: "Individual attention reduces rivalry but requires careful scheduling. Happiness +20, finances -3000",
              effects: {
                happiness: 20,
                finances: -3000,
                familyDynamics: { cohesion: 15, stress: -10 },
                siblingEffects: {
                  // Will be populated dynamically based on actual child IDs
                }
              }
            },
            {
              label: "B) Set strict family rules about sharing attention",
              consequence: "Structure helps but children feel restricted. Happiness +5, finances +0",
              effects: {
                happiness: 5,
                finances: 0,
                familyDynamics: { cohesion: -5, stress: 5 },
                traits: { 'cooperation': -3 }
              }
            },
            {
              label: "C) Let them work it out themselves",
              consequence: "Children learn independence but relationships suffer. Happiness -10, finances +0",
              effects: {
                happiness: -10,
                finances: 0,
                familyDynamics: { cohesion: -10, stress: 10 },
                traits: { 'independence': 8, 'empathy': -5 }
              }
            },
            {
              label: "D) Seek family counseling",
              consequence: "Professional help improves family dynamics significantly. Happiness +25, finances -5000",
              effects: {
                happiness: 25,
                finances: -5000,
                familyDynamics: { cohesion: 20, stress: -15 },
                traits: { 'cooperation': 10, 'empathy': 8 }
              }
            }
          ]
        },
        {
          title: "Financial Strain with Multiple Children",
          description: `Supporting ${numberOfChildren} children is putting serious strain on your finances. You need to make tough choices about spending - from school activities to basic necessities. The children are starting to notice the tension.`,
          options: [
            {
              label: "A) Cut back on activities but maintain essentials",
              consequence: "Children miss opportunities but family stability maintained. Happiness -5, finances +2000",
              effects: {
                happiness: -5,
                finances: 2000,
                familyDynamics: { resourceStrain: -10, stress: 5 },
                traits: { 'resilience': 5 }
              }
            },
            {
              label: "B) Take on extra work to maintain lifestyle",
              consequence: "More money but less family time. Happiness -15, finances +8000",
              effects: {
                happiness: -15,
                finances: 8000,
                familyDynamics: { cohesion: -15, stress: 20 },
                relationships: { 'parent-child': { quality: -10, communication: -5 } }
              }
            },
            {
              label: "C) Have older children help with younger ones",
              consequence: "Builds family bonds but adds pressure to older kids. Happiness +5, finances +1000",
              effects: {
                happiness: 5,
                finances: 1000,
                familyDynamics: { cohesion: 10, stress: 5 },
                traits: { 'cooperation': 8, 'independence': -3 }
              }
            },
            {
              label: "D) Apply for financial assistance programs",
              consequence: "Help available but affects family pride. Happiness -10, finances +5000",
              effects: {
                happiness: -10,
                finances: 5000,
                familyDynamics: { stress: -10, cohesion: -5 },
                traits: { 'resilience': 10 }
              }
            }
          ]
        },
        {
          title: "Different Needs, Limited Resources",
          description: `Each of your children has different needs and interests. One needs expensive therapy, another wants to join sports, and you can't afford everything. The children are aware of the inequality and it's causing resentment.`,
          options: [
            {
              label: "A) Prioritize based on necessity (therapy first)",
              consequence: "Practical choice but creates perceived favoritism. Happiness +10, finances -8000",
              effects: {
                happiness: 10,
                finances: -8000,
                familyDynamics: { favoritism: { /* specific child favoritism will be added dynamically */ }, stress: 10 },
                traits: { 'empathy': 5 }
              }
            },
            {
              label: "B) Try to give something to everyone equally",
              consequence: "Fair but insufficient for anyone's real needs. Happiness -5, finances -6000",
              effects: {
                happiness: -5,
                finances: -6000,
                familyDynamics: { cohesion: 5, stress: 5 },
                traits: { 'cooperation': 3 }
              }
            },
            {
              label: "C) Let children earn money for their own activities",
              consequence: "Builds work ethic but places burden on children. Happiness +5, finances +0",
              effects: {
                happiness: 5,
                finances: 0,
                familyDynamics: { stress: -5 },
                traits: { 'independence': 15, 'determination': 10 }
              }
            },
            {
              label: "D) Seek community resources and scholarships",
              consequence: "Creative solution that helps everyone. Happiness +15, finances +2000",
              effects: {
                happiness: 15,
                finances: 2000,
                familyDynamics: { cohesion: 10, stress: -10 },
                traits: { 'creativity': 8, 'cooperation': 5 }
              }
            }
          ]
        }
      ],
      'Fantasy': [
        {
          title: "Magical Inheritance Dispute",
          description: `Your children have inherited different magical abilities, and the Magical Council says only one can receive advanced training due to resource limitations. The children are competing to prove who is most worthy, creating dangerous magical conflicts in your home.`,
          options: [
            {
              label: "A) Let the Council choose based on ability tests",
              consequence: "Fair process but creates winner-loser dynamic. Happiness -10, finances +5000",
              effects: {
                happiness: -10,
                finances: 5000,
                familyDynamics: { favoritism: {}, stress: 15 },
                traits: { 'competition': 10, 'cooperation': -8 }
              }
            },
            {
              label: "B) Find alternative training for all children",
              consequence: "Everyone gets training but quality varies. Happiness +20, finances -15000",
              effects: {
                happiness: 20,
                finances: -15000,
                familyDynamics: { cohesion: 15, stress: 5 },
                traits: { 'cooperation': 12, 'creativity': 8 }
              }
            },
            {
              label: "C) Refuse magical training entirely",
              consequence: "Family unity but children's potential limited. Happiness +5, finances +0",
              effects: {
                happiness: 5,
                finances: 0,
                familyDynamics: { cohesion: 10, stress: -5 },
                traits: { 'independence': -10, 'resilience': 5 }
              }
            },
            {
              label: "D) Have children share training in rotation",
              consequence: "Creative solution that builds cooperation. Happiness +15, finances -8000",
              effects: {
                happiness: 15,
                finances: -8000,
                familyDynamics: { cohesion: 20, stress: -10 },
                traits: { 'cooperation': 15, 'empathy': 10 }
              }
            }
          ]
        }
      ],
      'Thrilling': [
        {
          title: "Family Under Surveillance",
          description: `Government agents are monitoring your family because one of your children has demonstrated unusual abilities. They want to separate the children for individual study, claiming it's for national security. The family is under constant watch.`,
          options: [
            {
              label: "A) Cooperate with authorities fully",
              consequence: "Safety but family separation. Happiness -25, finances +10000",
              effects: {
                happiness: -25,
                finances: 10000,
                familyDynamics: { cohesion: -30, stress: 40 },
                traits: { 'trust': -15, 'resilience': 5 }
              }
            },
            {
              label: "B) Go underground as a family",
              consequence: "Family stays together but life is dangerous. Happiness -10, finances -20000",
              effects: {
                happiness: -10,
                finances: -20000,
                familyDynamics: { cohesion: 25, stress: 25 },
                traits: { 'cooperation': 20, 'resilience': 15 }
              }
            },
            {
              label: "C) Negotiate for family to stay together",
              consequence: "Compromise keeps family intact with monitoring. Happiness +5, finances +5000",
              effects: {
                happiness: 5,
                finances: 5000,
                familyDynamics: { cohesion: 10, stress: 15 },
                traits: { 'cooperation': 8, 'independence': -5 }
              }
            },
            {
              label: "D) Expose the government program publicly",
              consequence: "Dangerous but potentially stops the persecution. Happiness +20, finances -15000",
              effects: {
                happiness: 20,
                finances: -15000,
                familyDynamics: { cohesion: 20, stress: 30 },
                traits: { 'courage': 20, 'determination': 15 }
              }
            }
          ]
        }
      ]
    }
  };

  const scenarios = familyScenarios['multi_child'][gameStyle];
  if (!scenarios) return null;

  // Adjust scenario selection based on family stress level
  let scenarioIndex = 0;
  if (familyStress > 60) {
    scenarioIndex = Math.min(scenarios.length - 1, 2); // High stress scenarios
  } else if (familyStress > 30) {
    scenarioIndex = Math.min(scenarios.length - 1, 1); // Medium stress scenarios
  }

  return scenarios[scenarioIndex] || scenarios[0];
};

// New child arrival scenarios
export const getChildBirthScenario = (
  circumstances: 'planned' | 'surprise' | 'twins' | 'adoption',
  gameStyle: GameStyle,
  existingChildCount: number
): Scenario => {
  
  const birthScenarios: Record<string, Record<string, Scenario>> = {
    'planned': {
      'Realistic': {
        title: "A New Addition to the Family",
        description: `You're expecting another child! While this was planned, you're realizing the challenges of managing ${existingChildCount + 1} children. Your existing ${existingChildCount === 1 ? 'child is' : 'children are'} excited but also anxious about sharing attention.`,
        options: [
          {
            label: "A) Prepare extensively with family meetings",
            consequence: "Smooth transition with good preparation. Happiness +15, finances -3000",
            effects: { happiness: 15, finances: -3000, familyDynamics: { cohesion: 10, stress: -5 } }
          },
          {
            label: "B) Let the transition happen naturally",
            consequence: "Some challenges but family adapts. Happiness +5, finances -1000",
            effects: { happiness: 5, finances: -1000, familyDynamics: { stress: 5 } }
          },
          {
            label: "C) Focus on maintaining routines",
            consequence: "Stability helps but children need more support. Happiness +10, finances -2000",
            effects: { happiness: 10, finances: -2000, familyDynamics: { cohesion: 5 } }
          }
        ]
      },
      'Fantasy': {
        title: "The Prophesied Child",
        description: `Magical seers have foretold the birth of a child with extraordinary powers. Your family has been chosen to welcome this prophesied child, but it means your other children will grow up in the shadow of their sibling's destiny.`,
        options: [
          {
            label: "A) Embrace the prophecy fully",
            consequence: "Magical benefits but family dynamics challenging. Happiness +10, finances +5000",
            effects: { happiness: 10, finances: 5000, familyDynamics: { stress: 15, favoritism: {} } }
          },
          {
            label: "B) Try to treat all children equally",
            consequence: "Balanced approach but prophecy complications. Happiness +20, finances -2000",
            effects: { happiness: 20, finances: -2000, familyDynamics: { cohesion: 15 } }
          },
          {
            label: "C) Hide the child's true nature",
            consequence: "Family normalcy but magical consequences. Happiness +5, finances -5000",
            effects: { happiness: 5, finances: -5000, familyDynamics: { stress: 10 } }
          }
        ]
      },
      'Thrilling': {
        title: "Strategic Addition",
        description: `In this dangerous world, having another child is both a risk and a strategic advantage for your family's survival. More hands for defense, but also more vulnerabilities to protect.`,
        options: [
          {
            label: "A) Train all children for family defense",
            consequence: "Strong family unit but childhood sacrificed. Happiness -5, finances -8000",
            effects: { happiness: -5, finances: -8000, familyDynamics: { cohesion: 20, stress: 10 } }
          },
          {
            label: "B) Keep the new child sheltered",
            consequence: "One child preserved but family divided. Happiness +5, finances -12000",
            effects: { happiness: 5, finances: -12000, familyDynamics: { favoritism: {}, stress: 15 } }
          },
          {
            label: "C) Relocate to safer area",
            consequence: "Family safety but starting over. Happiness +15, finances -25000",
            effects: { happiness: 15, finances: -25000, familyDynamics: { cohesion: 10, stress: -10 } }
          }
        ]
      }
    },
    'surprise': {
      'Realistic': {
        title: "Unexpected News",
        description: `You just found out you're pregnant unexpectedly! With ${existingChildCount} ${existingChildCount === 1 ? 'child' : 'children'} already, this creates financial and emotional challenges you weren't prepared for.`,
        options: [
          {
            label: "A) Adjust family budget and prepare quickly",
            consequence: "Quick adaptation but financial stress. Happiness +5, finances -5000",
            effects: { happiness: 5, finances: -5000, familyDynamics: { stress: 15, resourceStrain: 20 } }
          },
          {
            label: "B) Seek family support network",
            consequence: "Help from relatives but dependency. Happiness +15, finances +2000",
            effects: { happiness: 15, finances: 2000, familyDynamics: { cohesion: 10, stress: 5 } }
          },
          {
            label: "C) Embrace the chaos and go with the flow",
            consequence: "Stressful but builds family resilience. Happiness +10, finances -3000",
            effects: { happiness: 10, finances: -3000, familyDynamics: { stress: 10 }, traits: { 'resilience': 10 } }
          }
        ]
      }
    },
    'twins': {
      'Realistic': {
        title: "Double Surprise",
        description: `Twins! What you thought was one baby is actually two. Your family of ${existingChildCount + 1} just became ${existingChildCount + 2}, and you need to rapidly adjust everything from budget to living space.`,
        options: [
          {
            label: "A) Embrace the chaos with humor",
            consequence: "Positive attitude helps but resources stretched. Happiness +20, finances -10000",
            effects: { happiness: 20, finances: -10000, familyDynamics: { cohesion: 15, stress: 25, resourceStrain: 30 } }
          },
          {
            label: "B) Get organized with military precision",
            consequence: "Efficiency helps manage the chaos. Happiness +10, finances -8000",
            effects: { happiness: 10, finances: -8000, familyDynamics: { cohesion: 20, stress: 15 } }
          },
          {
            label: "C) Ask for extensive help from family",
            consequence: "Support system activated but loss of independence. Happiness +15, finances +5000",
            effects: { happiness: 15, finances: 5000, familyDynamics: { cohesion: 5, stress: -10 } }
          }
        ]
      }
    },
    'adoption': {
      'Realistic': {
        title: "Opening Your Heart and Home",
        description: `You've decided to adopt a child in need. This brings joy but also unique challenges as your new child adjusts to the family while your existing ${existingChildCount === 1 ? 'child learns' : 'children learn'} to share their home and parents.`,
        options: [
          {
            label: "A) Intensive integration therapy for all",
            consequence: "Professional help smooths transition. Happiness +25, finances -12000",
            effects: { happiness: 25, finances: -12000, familyDynamics: { cohesion: 20, stress: -10 } }
          },
          {
            label: "B) Focus on patience and time",
            consequence: "Gradual adjustment with some struggles. Happiness +15, finances -3000",
            effects: { happiness: 15, finances: -3000, familyDynamics: { cohesion: 10, stress: 10 } }
          },
          {
            label: "C) Treat everyone the same from day one",
            consequence: "Equal treatment but may miss special needs. Happiness +10, finances -5000",
            effects: { happiness: 10, finances: -5000, familyDynamics: { cohesion: 5, stress: 15 } }
          }
        ]
      }
    }
  };

  return birthScenarios[circumstances]?.[gameStyle] || birthScenarios[circumstances]?.['Realistic'] || {
    title: "New Family Member",
    description: "Your family is growing!",
    options: [
      {
        label: "A) Welcome the change",
        consequence: "Family adapts to new dynamics. Happiness +10, finances -5000",
        effects: { happiness: 10, finances: -5000 }
      }
    ]
  };
};