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
    const scenarios: Record<number, Record<string, string>> = {
      2: { Realistic: "Daycare Disaster", Fantasy: "Magical Outbursts", Thrilling: "Life-Threatening Tantrum" },
      5: { Realistic: "Learning Disability Crisis", Fantasy: "The Forbidden Sight", Thrilling: "Kidnapping Attempt" },
      8: { Realistic: "Cyberbullying Nightmare", Fantasy: "The Dark Prophecy", Thrilling: "Witness Protection" },
      12: { Realistic: "Teen Pregnancy Scare", Fantasy: "The Soul Bond Ritual", Thrilling: "International Incident" },
      16: { Realistic: "Fatal Car Accident", Fantasy: "The Darkness Awakens", Thrilling: "Terrorism Accusation" },
      18: { Realistic: "Addiction and Overdose", Fantasy: "The Final Ascension", Thrilling: "Nuclear Crisis" }
    };
    
    const ageScenarios = scenarios[gameState.currentAge];
    return ageScenarios?.[gameState.gameStyle || ''] || "Growing Up";
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
      currentAge: nextAge,
      finances: prev.finances + (effects.finances || 0),
      happiness: Math.max(0, Math.min(100, prev.happiness + (effects.happiness || 0)))
    }));

    // Check if game should end
    if (nextAge >= 19) {
      setGameState(prev => ({ ...prev, phase: 'ended' }));
    }
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'setup':
        return (
          <OnboardingPhase
            role={gameState.role}
            gameStyle={gameState.gameStyle}
            specialRequirements={gameState.specialRequirements}
            onRoleSelect={handleRoleSelect}
            onStyleSelect={handleStyleSelect}
            onRequirementsChange={handleRequirementsChange}
            onStartGame={handleStartGame}
          />
        );

      case 'character-gen':
        return (
          <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Generating Characters...</h2>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          </div>
        );

      case 'gameplay':
        return (
          <GameplayPhase
            gameState={gameState}
            onDecision={handleDecision}
          />
        );

      case 'ended':
        return (
          <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-4xl font-bold mb-6">Journey Complete</h1>
              <p className="text-xl mb-4">Your child has reached adulthood!</p>
              <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Timeline Summary</h2>
                <div className="text-left space-y-3 max-h-96 overflow-y-auto">
                  {gameState.timeline.map((entry, index) => (
                    <div key={index} className="border-l-2 border-purple-500 pl-4">
                      <h3 className="font-semibold">{entry.stage} - {entry.scenario}</h3>
                      <p className="text-gray-300">Choice: {entry.choice}</p>
                      <p className="text-gray-400 text-sm">{entry.consequence}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
              >
                Play Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      {renderPhase()}
    </ErrorBoundary>
  );
};