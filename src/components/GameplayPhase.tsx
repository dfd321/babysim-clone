import React, { useState, useEffect } from 'react';
import { GameplayPhaseProps, GameStyle } from '../types/game';
import { Timeline } from './Timeline';
import { CharacterDevelopment } from './CharacterDevelopment';
import { useTranslation } from '../contexts/TranslationContext';
import ScenarioOptionButton from './ScenarioOptionButton';
import { DynamicScenarioLoader } from '../services/dynamicScenarioLoader';
import { ScenarioData } from '../scenarios/types';

// Loading component for scenarios
const ScenarioLoadingComponent: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Story...</h2>
      <p className="text-gray-600">Preparing age-appropriate scenarios for your child's journey</p>
    </div>
  </div>
);

export const GameplayPhase: React.FC<GameplayPhaseProps> = React.memo(({
  gameState,
  onDecision,
  onRestart
}) => {
  const { t } = useTranslation();
  const [currentScenario, setCurrentScenario] = useState<ScenarioData | null>(null);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<{ label: string; consequence: string } | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load scenario when age or game style changes
  useEffect(() => {
    if (gameState.gameStyle && gameState.currentAge) {
      loadScenario(gameState.currentAge, gameState.gameStyle);
    }
  }, [gameState.currentAge, gameState.gameStyle]);

  // Preload next age group scenarios for performance
  useEffect(() => {
    if (gameState.currentAge) {
      DynamicScenarioLoader.preloadNextAgeGroup(gameState.currentAge).catch(error => {
        console.warn('Failed to preload next age group:', error);
      });
    }
  }, [gameState.currentAge]);

  const loadScenario = async (age: number, gameStyle: GameStyle) => {
    setIsLoadingScenario(true);
    setShowResult(false);
    setSelectedOptionIndex(null);
    setIsProcessing(false);

    try {
      const scenarioData = await DynamicScenarioLoader.getScenario(age, gameStyle);
      setCurrentScenario(scenarioData);
    } catch (error) {
      console.error('Failed to load scenario:', error);
      // Fallback scenario
      setCurrentScenario({
        title: "Growing Up",
        description: `Your child is now ${age} years old and facing new challenges appropriate for their age.`,
        options: [
          { label: "A) Handle with care and patience", consequence: "Steady progress. Happiness +10, finances -1000" },
          { label: "B) Seek professional guidance", consequence: "Expert help improves situation. Happiness +15, finances -5000" },
          { label: "C) Let them figure it out themselves", consequence: "Mixed results from independence. Happiness +5, finances -500" },
          { label: "D) Ignore the problem", consequence: "Issues worsen over time. Happiness -10, finances -200" }
        ]
      });
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const handleChoice = (option: { label: string; consequence: string }) => {
    if (isProcessing) return; // Prevent multiple selections
    
    const optionIndex = currentScenario?.options.findIndex(opt => opt.label === option.label) ?? -1;
    setSelectedOptionIndex(optionIndex);
    setIsProcessing(true);
    setLastChoice(option);
    
    // Show processing state briefly before showing result
    setTimeout(() => {
      setShowResult(true);
      
      // Parse effects from consequence text
      const happinessMatch = option.consequence.match(/Happiness ([+-]\d+)/);
      const financesMatch = option.consequence.match(/finances ([+-]\d+)/);
      
      const effects = {
        happiness: happinessMatch ? parseInt(happinessMatch[1]) : 0,
        finances: financesMatch ? parseInt(financesMatch[1]) : 0
      };

      // Call parent handler after showing result
      setTimeout(() => {
        onDecision(option.label, option.consequence, effects);
      }, 2000);
    }, 1000);
  };

  const getAgeStage = (age: number) => {
    if (age <= 2) return t('toddler');
    if (age <= 5) return t('preschooler'); 
    if (age <= 8) return t('young_child');
    if (age <= 12) return t('preteen');
    if (age <= 16) return t('teenager');
    return t('young_adult');
  };

  // Show loading state while scenario is being loaded
  if (isLoadingScenario || !currentScenario) {
    return <ScenarioLoadingComponent />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with Character Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <h3 className="font-bold text-gray-700">Child</h3>
              <p className="text-lg">{gameState.childCharacter?.name}</p>
              <p className="text-sm text-gray-600">Age {gameState.currentAge} • {getAgeStage(gameState.currentAge)}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">{t('happiness')}</h3>
              <div className="text-2xl font-bold text-blue-600">{gameState.happiness}/100</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(0, Math.min(100, gameState.happiness))}%` }}
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">{t('finances')}</h3>
              <div className={`text-lg font-bold ${gameState.finances >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${gameState.finances.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                {gameState.finances >= 50000 ? t('comfortable') : 
                 gameState.finances >= 0 ? t('managing') : t('struggling')}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">{t('development')}</h3>
              {gameState.childCharacter && (
                <CharacterDevelopment 
                  character={gameState.childCharacter} 
                  compact={true} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Scenario Column (2/4 width) */}
          <div className="lg:col-span-2">
            {!showResult ? (
              /* Scenario Presentation */
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Age {gameState.currentAge} • {gameState.gameStyle}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {currentScenario.title}
                  </h1>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {currentScenario.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    How do you respond?
                  </h3>
                  
                  {currentScenario.options.map((option: { label: string; consequence: string }, index: number) => (
                    <ScenarioOptionButton
                      key={index}
                      option={option}
                      index={index}
                      isSelected={selectedOptionIndex === index}
                      isProcessing={isProcessing && selectedOptionIndex === index}
                      onClick={handleChoice}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={onRestart}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              /* Result Display */
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">
                    {lastChoice?.consequence.includes('+') ? '😊' : '😟'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Decision Made!
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-blue-800 mb-2">You chose:</p>
                    <p className="text-blue-700">{lastChoice?.label}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{lastChoice?.consequence}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
                  <p className="text-gray-600">Processing decision and advancing time...</p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Column (1/4 width) */}
          <div className="lg:col-span-1">
            <Timeline 
              entries={gameState.timeline} 
              currentAge={gameState.currentAge}
            />
          </div>

          {/* Character Development Column (1/4 width) */}
          <div className="lg:col-span-1">
            {gameState.childCharacter && (
              <CharacterDevelopment 
                character={gameState.childCharacter} 
                compact={false} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});