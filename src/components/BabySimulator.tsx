import { useState, useEffect } from 'react';
import { GameState, ParentRole, GameStyle, SaveGameMetadata } from '../types/game';
import { ErrorBoundary } from './ErrorBoundary';
import { OnboardingPhase } from './OnboardingPhase';
import { GameplayPhase } from './GameplayPhase';
import { SaveLoadMenu } from './SaveLoadMenu';
import { saveGameService } from '../services/saveGameService';

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
    currentAge: 1,
    timeline: [],
    finances: 50000,
    happiness: 75
  });

  const [saveGameMetadata, setSaveGameMetadata] = useState<SaveGameMetadata[]>([]);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load auto-save on component mount
  useEffect(() => {
    const loadAutoSave = async () => {
      try {
        const autoSaveState = await saveGameService.getAutoSave();
        if (autoSaveState && autoSaveState.phase !== 'setup') {
          setGameState(autoSaveState);
        }
      } catch (error) {
        console.warn('Failed to load auto-save:', error);
      }
    };

    loadAutoSave();
    refreshSaveMetadata();
  }, []);

  // Auto-save on significant game state changes
  useEffect(() => {
    if (gameState.phase === 'gameplay' && gameState.currentAge > 1) {
      const autoSave = async () => {
        try {
          await saveGameService.setAutoSave(gameState);
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      };
      
      const timeoutId = setTimeout(autoSave, 2000); // Debounce auto-save
      return () => clearTimeout(timeoutId);
    }
  }, [gameState]);

  const refreshSaveMetadata = async () => {
    try {
      const metadata = await saveGameService.getAllSaves();
      setSaveGameMetadata(metadata);
    } catch (error) {
      console.error('Failed to load save metadata:', error);
    }
  };

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
      1: { Realistic: "First Steps Crisis", Fantasy: "The First Magic", Thrilling: "Baby Kidnapping Plot" },
      3: { Realistic: "Preschool Preparation Panic", Fantasy: "Elemental Powers Emerge", Thrilling: "Bioweapon Exposure" },
      4: { Realistic: "Aggressive Behavior Crisis", Fantasy: "Dragon Companion Bond", Thrilling: "International Spy Ring" },
      6: { Realistic: "Learning Differences Discovery", Fantasy: "Prophecy Academy Admission", Thrilling: "Corporate Espionage Target" },
      7: { Realistic: "Social Bullying Situation", Fantasy: "Familiar Creature Selection", Thrilling: "Witness to Assassination" },
      8: { Realistic: "Academic Excellence Pressure", Fantasy: "Dark Magic Temptation", Thrilling: "Alien Contact Discovery" },
      9: { Realistic: "Friend Group Drama", Fantasy: "Time Magic Awakening", Thrilling: "Underground Fighting Ring" },
      10: { Realistic: "Middle School Transition Anxiety", Fantasy: "Ancient Magic Artifact Discovery", Thrilling: "Corporate Heir Target" },
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
    const ageProgression = [1, 3, 4, 6, 7, 9, 10, 12, 16, 18];
    const currentIndex = ageProgression.indexOf(gameState.currentAge);
    const nextAge = currentIndex < ageProgression.length - 1 ? ageProgression[currentIndex + 1] : 19;

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

  const handleSaveGame = async (customName?: string) => {
    try {
      setSaveError(null);
      await saveGameService.saveGame(gameState, customName);
      await refreshSaveMetadata();
      setShowSaveMenu(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save game');
    }
  };

  const handleLoadGame = async (saveId: string) => {
    try {
      setLoadError(null);
      const loadedState = await saveGameService.loadGame(saveId);
      setGameState(loadedState);
      setShowLoadMenu(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load game');
    }
  };

  const handleDeleteSave = async (saveId: string) => {
    try {
      await saveGameService.deleteSave(saveId);
      await refreshSaveMetadata();
    } catch (error) {
      console.error('Failed to delete save:', error);
    }
  };

  const handleExportSave = async (saveId: string) => {
    try {
      const exportData = await saveGameService.exportSave(saveId);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `babysim-save-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export save:', error);
    }
  };

  const handleImportSave = async (file: File) => {
    try {
      const text = await file.text();
      await saveGameService.importSave(text);
      await refreshSaveMetadata();
    } catch (error) {
      console.error('Failed to import save:', error);
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
      currentAge: 1,
      timeline: [],
      finances: 50000,
      happiness: 75
    });
  };

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          {/* Header with Save/Load Controls */}
          <div className="flex justify-between items-center mb-8">
            <h1 className='text-3xl font-bold text-gray-800'>BabySim - Parenting Simulator</h1>
            
            {/* Save/Load Buttons - only show during gameplay */}
            {gameState.phase === 'gameplay' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveMenu(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setShowLoadMenu(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  📂 Load
                </button>
              </div>
            )}
          </div>
          
          {gameState.phase === 'setup' && (
            <>
              <OnboardingPhase
                gameState={gameState}
                onRoleSelect={handleRoleSelect}
                onStyleSelect={handleStyleSelect}
                onRequirementsChange={handleRequirementsChange}
                onStartGame={handleStartGame}
              />
              
              {/* Load Game Option */}
              {saveGameMetadata.length > 0 && (
                <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Continue Your Journey
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    You have {saveGameMetadata.length} saved game{saveGameMetadata.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => setShowLoadMenu(true)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    📂 Load Saved Game
                  </button>
                </div>
              )}
            </>
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

        {/* Save/Load Menu Modals */}
        {showSaveMenu && (
          <SaveLoadMenu
            saves={saveGameMetadata}
            onSave={handleSaveGame}
            onLoad={handleLoadGame}
            onDelete={handleDeleteSave}
            onExport={handleExportSave}
            onImport={handleImportSave}
            onClose={() => setShowSaveMenu(false)}
            mode="save"
            saveError={saveError}
            loadError={loadError}
          />
        )}

        {showLoadMenu && (
          <SaveLoadMenu
            saves={saveGameMetadata}
            onSave={handleSaveGame}
            onLoad={handleLoadGame}
            onDelete={handleDeleteSave}
            onExport={handleExportSave}
            onImport={handleImportSave}
            onClose={() => setShowLoadMenu(false)}
            mode="load"
            saveError={saveError}
            loadError={loadError}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};
