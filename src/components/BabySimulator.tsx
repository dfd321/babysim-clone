import { useState } from 'react';
import { GameState, ParentRole, GameStyle } from '../types/game';
import { ErrorBoundary } from './ErrorBoundary';
import { OnboardingPhase } from './OnboardingPhase';
import { GameplayPhase } from './GameplayPhase';

interface BabySimulatorProps {
  // Main orchestrator component props
}

export const BabySimulator: React.FC<BabySimulatorProps> = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    role: null,
    gameStyle: null,
    specialRequirements: '',
    parentCharacter: null,
    childCharacter: null,
    currentAge: 2,
    timeline: [],
    finances: 50000,
    happiness: 75
  });

  const handleRoleSelect = (role: ParentRole) => {
    setGameState(prev => ({ ...prev, role }));
  };

  const handleStyleSelect = (gameStyle: GameStyle) => {
    setGameState(prev => ({ ...prev, gameStyle }));
  };

  const handleRequirementsChange = (requirements: string) => {
    setGameState(prev => ({ ...prev, specialRequirements: requirements }));
  };

  const getCurrentScenarioTitle = () => {
    const scenarios = {
      2: { Realistic: "Daycare Disaster", Fantasy: "Magical Outbursts", Thrilling: "Life-Threatening Tantrum" },
      5: { Realistic: "Learning Disability Crisis", Fantasy: "The Forbidden Sight", Thrilling: "Kidnapping Attempt" },
      8: { Realistic: "Cyberbullying Nightmare", Fantasy: "The Dark Prophecy", Thrilling: "Witness Protection" },
      12: { Realistic: "Teen Pregnancy Scare", Fantasy: "The Soul Bond Ritual", Thrilling: "International Incident" },
      16: { Realistic: "Fatal Car Accident", Fantasy: "The Darkness Awakens", Thrilling: "Terrorism Accusation" },
      18: { Realistic: "Addiction and Overdose", Fantasy: "The Final Ascension", Thrilling: "Nuclear Crisis" }
    };
    
    const ageScenarios = scenarios[gameState.currentAge];
    return ageScenarios?.[gameState.gameStyle] || "Growing Up";
  };

  const handleStartGame = async () => {
    setGameState(prev => ({ ...prev, phase: 'character-gen' }));
    
    // Simulate character generation
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        phase: 'gameplay',
        parentCharacter: {
          name: 'Sarah Johnson',
          age: 32,
          profession: 'Teacher',
          background: 'Caring and organized with a love for education',
          financialLevel: 6
        },
        childCharacter: {
          name: 'Emma',
          age: 2,
          gender: 'girl',
          personality: 'Curious and energetic',
          traits: ['Creative', 'Social'],
          interests: ['Drawing', 'Playing with toys']
        }
      }));
    }, 2000);
  };

  const handleDecision = (choice: string, consequence: string, effects: any) => {
    // Add timeline entry
    const timelineEntry = {
      age: gameState.currentAge,
      stage: `Age ${gameState.currentAge}`,
      scenario: getCurrentScenarioTitle(),
      choice,
      consequence,
      effects
    };

    // Calculate next age
    const nextAge = gameState.currentAge === 18 ? 19 : 
                   gameState.currentAge === 16 ? 18 : 
                   gameState.currentAge === 12 ? 16 : 
                   gameState.currentAge === 8 ? 12 : 
                   gameState.currentAge === 5 ? 8 : 
                   gameState.currentAge === 2 ? 5 : gameState.currentAge;

    // Update game state
    setGameState(prev => ({
      ...prev,
      timeline: [...prev.timeline, timelineEntry],
      happiness: Math.max(0, Math.min(100, prev.happiness + effects.happiness)),
      finances: Math.max(-100000, prev.finances + effects.finances),
      currentAge: nextAge
    }));

    // Check if game should end
    if (nextAge > 18) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, phase: 'ended' }));
      }, 1000);
    }
  };

  const handleRestart = () => {
    setGameState({
      phase: 'setup',
      role: null,
      gameStyle: null,
      specialRequirements: '',
      parentCharacter: null,
      childCharacter: null,
      currentAge: 2,
      timeline: [],
      finances: 50000,
      happiness: 75
    });
  };

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold text-center mb-8'>BabySim - Parenting Simulator</h1>
          
          {gameState.phase === 'setup' && (
            <OnboardingPhase
              gameState={gameState}
              onRoleSelect={handleRoleSelect}
              onStyleSelect={handleStyleSelect}
              onRequirementsChange={handleRequirementsChange}
              onStartGame={handleStartGame}
            />
          )}
          
          {gameState.phase === 'character-gen' && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Generating Your Characters...
                </h2>
                <p className="text-gray-600">
                  Creating your unique parenting journey based on your selections
                </p>
              </div>
            </div>
          )}
          
          {gameState.phase === 'gameplay' && (
            <GameplayPhase
              gameState={gameState}
              onDecision={handleDecision}
              onRestart={handleRestart}
            />
          )}
          
          {gameState.phase === 'ended' && (
            <div className='max-w-2xl mx-auto text-center'>
              <p>Game completed!</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
