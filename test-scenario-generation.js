// Quick test for multi-child scenario generation
import { ScenarioGenerationService } from './src/services/scenarioGenerationService.js';

// Mock game state with multiple children
const mockGameState = {
  gameStyle: 'Realistic',
  children: {
    'child1': {
      id: 'child1',
      name: 'Alice',
      age: 7,
      personalityTraits: [
        { id: 'curiosity', name: 'Curiosity', value: 85, category: 'intellectual' },
        { id: 'empathy', name: 'Empathy', value: 35, category: 'emotional' },
        { id: 'creativity', name: 'Creativity', value: 70, category: 'creative' },
        { id: 'confidence', name: 'Confidence', value: 25, category: 'social' },
        { id: 'resilience', name: 'Resilience', value: 60, category: 'emotional' },
        { id: 'cooperation', name: 'Cooperation', value: 40, category: 'social' },
        { id: 'focus', name: 'Focus', value: 80, category: 'intellectual' },
        { id: 'compassion', name: 'Compassion', value: 45, category: 'emotional' },
        { id: 'determination', name: 'Determination', value: 75, category: 'physical' },
        { id: 'adaptability', name: 'Adaptability', value: 30, category: 'intellectual' }
      ],
      interests: ['reading', 'science', 'puzzles'],
      skills: [
        { id: 'reading', name: 'Reading', level: 8, category: 'academic' },
        { id: 'math', name: 'Math', level: 6, category: 'academic' }
      ],
      relationships: {},
      milestones: [],
      developmentHistory: []
    },
    'child2': {
      id: 'child2', 
      name: 'Bob',
      age: 5,
      personalityTraits: [
        { id: 'curiosity', name: 'Curiosity', value: 45, category: 'intellectual' },
        { id: 'empathy', name: 'Empathy', value: 80, category: 'emotional' },
        { id: 'creativity', name: 'Creativity', value: 60, category: 'creative' },
        { id: 'confidence', name: 'Confidence', value: 70, category: 'social' },
        { id: 'resilience', name: 'Resilience', value: 30, category: 'emotional' },
        { id: 'cooperation', name: 'Cooperation', value: 85, category: 'social' },
        { id: 'focus', name: 'Focus', value: 40, category: 'intellectual' },
        { id: 'compassion', name: 'Compassion', value: 90, category: 'emotional' },
        { id: 'determination', name: 'Determination', value: 35, category: 'physical' },
        { id: 'adaptability', name: 'Adaptability', value: 75, category: 'intellectual' }
      ],
      interests: ['art', 'animals', 'music'],
      skills: [
        { id: 'art', name: 'Art', level: 5, category: 'artistic' },
        { id: 'music', name: 'Music', level: 4, category: 'artistic' }
      ],
      relationships: {},
      milestones: [],
      developmentHistory: []
    }
  },
  familyDynamics: {
    cohesion: 70,
    stress: 45,
    favoritism: {},
    resourceStrain: 55,
    parentingStyle: 'authoritative',
    communicationPattern: 'open',
    attachmentSecurity: 75,
    resilience: 65,
    emotionalExpressiveness: 60,
    boundaryClarity: 80,
    traditionalValues: 50,
    adaptability: 70
  },
  siblingRelationships: [
    {
      childId1: 'child1',
      childId2: 'child2',
      bond: 65,
      rivalry: 40,
      cooperation: 60,
      lastInteraction: 7,
      relationshipType: 'close',
      jealousy: 35,
      supportiveness: 70,
      conflictResolution: 'collaborative',
      sharedInterests: ['games', 'stories'],
      birthOrderDynamics: {
        dominancePattern: 'older-leads',
        responsibilitySharing: 60,
        protectiveness: 75
      },
      developmentalStage: 'cooperative'
    }
  ]
};

console.log('Testing Multi-Child Scenario Generation');
console.log('=====================================');

try {
  // Test scenario generation coverage
  const testResults = ScenarioGenerationService.testMultiChildScenarioGeneration(mockGameState);
  
  console.log('\n📊 Test Results:');
  console.log(`Total scenarios generated: ${testResults.scenarioCount}`);
  console.log(`Family scenarios: ${testResults.familyScenarios}`);
  console.log(`Trait scenarios: ${testResults.traitScenarios}`);
  console.log(`Peer scenarios: ${testResults.peerScenarios}`);
  
  console.log('\n🎯 Trait Coverage Report:');
  Object.entries(testResults.coverageReport).forEach(([trait, covered]) => {
    console.log(`  ${trait}: ${covered ? '✅ Covered' : '❌ Not covered'}`);
  });
  
  // Test specific scenario generation
  console.log('\n🎭 Sample Scenario Generation:');
  
  // Test high curiosity trait scenario for Alice
  const aliceScenario = ScenarioGenerationService.getContextualScenario(
    7, 'Realistic', mockGameState.children.child1, mockGameState
  );
  
  console.log('\nAlice (High Curiosity) Scenario:');
  console.log(`Title: ${aliceScenario.title}`);
  console.log(`Description: ${aliceScenario.description.substring(0, 100)}...`);
  console.log(`Options: ${aliceScenario.options.length}`);
  
  // Test high cooperation trait scenario for Bob
  const bobScenario = ScenarioGenerationService.getContextualScenario(
    5, 'Realistic', mockGameState.children.child2, mockGameState
  );
  
  console.log('\nBob (High Cooperation) Scenario:');
  console.log(`Title: ${bobScenario.title}`);
  console.log(`Description: ${bobScenario.description.substring(0, 100)}...`);
  console.log(`Options: ${bobScenario.options.length}`);
  
  // Test family contextual scenario
  const familyScenario = ScenarioGenerationService.generateFamilyContextualScenario(
    mockGameState, 'child1'
  );
  
  if (familyScenario) {
    console.log('\nFamily Contextual Scenario:');
    console.log(`Title: ${familyScenario.title}`);
    console.log(`Description: ${familyScenario.description.substring(0, 100)}...`);
    console.log(`Options: ${familyScenario.options.length}`);
  } else {
    console.log('\nNo family contextual scenario generated (family dynamics healthy)');
  }
  
  console.log('\n✅ All tests completed successfully!');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}