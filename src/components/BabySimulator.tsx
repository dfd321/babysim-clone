import { useState, useEffect } from 'react';
import { GameState, ParentRole, GameStyle, SaveGameMetadata, ScenarioOption, RelationshipMetric, UnlockedAchievement } from '../types/game';
import { ErrorBoundary } from './ErrorBoundary';
import { OnboardingPhase } from './OnboardingPhase';
import { GameplayPhase } from './GameplayPhase';
import { SaveLoadMenu } from './SaveLoadMenu';
import { FamilyDashboard } from './FamilyDashboard';
import { StatisticsDashboard } from './StatisticsDashboard';
import AchievementDashboard from './AchievementDashboard';
import { AchievementNotificationManager } from './AchievementNotification';
import { saveGameService } from '../services/saveGameService';
import { CharacterDevelopmentService } from '../services/characterDevelopmentService';
import { FamilyManagementService } from '../services/familyManagementService';
import { achievementService } from '../services/achievementService';

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
    
    // Multiple Children Support
    children: {},
    activeChildId: null,
    siblingRelationships: [],
    familyDynamics: {
      cohesion: 85,
      stress: 15,
      favoritism: {},
      resourceStrain: 20
    },
    childBirthEvents: [],
    
    // Achievement & Badge System
    achievements: {
      unlocked: [],
      progress: [],
      stats: {
        totalPoints: 0,
        achievementsUnlocked: 0,
        achievementsAvailable: 0,
        rarityCount: {
          common: 0,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0
        },
        categoryProgress: {
          family: { unlocked: 0, total: 0, points: 0 },
          individual: { unlocked: 0, total: 0, points: 0 },
          sibling: { unlocked: 0, total: 0, points: 0 },
          parenting: { unlocked: 0, total: 0, points: 0 },
          milestone: { unlocked: 0, total: 0, points: 0 },
          financial: { unlocked: 0, total: 0, points: 0 },
          social: { unlocked: 0, total: 0, points: 0 }
        },
        recentUnlocks: []
      }
    },
    badges: [],
    
    // Legacy support
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
  const [showFamilyDashboard, setShowFamilyDashboard] = useState(false);
  const [showStatisticsDashboard, setShowStatisticsDashboard] = useState(false);
  const [showAchievementDashboard, setShowAchievementDashboard] = useState(false);
  const [newAchievementUnlocks, setNewAchievementUnlocks] = useState<UnlockedAchievement[]>([]);

  // Load auto-save on component mount
  useEffect(() => {
    const loadAutoSave = async () => {
      try {
        const autoSaveState = await saveGameService.getAutoSave();
        if (autoSaveState && autoSaveState.phase !== 'setup') {
          // Initialize achievement system for loaded state
          achievementService.initializeGameStateAchievements(autoSaveState);
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

  // Achievement tracking - update progress and check for unlocks
  useEffect(() => {
    if (gameState.phase === 'gameplay' && gameState.achievements) {
      const checkAchievements = async () => {
        try {
          const newUnlocks = achievementService.updateAchievementProgress(gameState);
          if (newUnlocks.length > 0) {
            setNewAchievementUnlocks(prev => [...prev, ...newUnlocks]);
          }
        } catch (error) {
          console.warn('Achievement tracking failed:', error);
        }
      };
      
      const timeoutId = setTimeout(checkAchievements, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.currentAge, gameState.happiness, gameState.finances, gameState.children, gameState.timeline]);

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
      2: { Realistic: "Daycare Disaster", Fantasy: "Magical Outbursts", Thrilling: "Life-Threatening Tantrum" },
      3: { Realistic: "Preschool Preparation Panic", Fantasy: "Elemental Powers Emerge", Thrilling: "Bioweapon Exposure" },
      4: { Realistic: "Aggressive Behavior Crisis", Fantasy: "Dragon Companion Bond", Thrilling: "International Spy Ring" },
      5: { Realistic: "Learning Disability Crisis", Fantasy: "The Forbidden Sight", Thrilling: "Kidnapping Attempt" },
      6: { Realistic: "Learning Differences Discovery", Fantasy: "Prophecy Academy Admission", Thrilling: "Corporate Espionage Target" },
      7: { Realistic: "Social Bullying Situation", Fantasy: "Familiar Creature Selection", Thrilling: "Witness to Assassination" },
      8: { Realistic: "Academic Excellence Pressure", Fantasy: "Dark Magic Temptation", Thrilling: "Alien Contact Discovery" },
      9: { Realistic: "Friend Group Drama", Fantasy: "Time Magic Awakening", Thrilling: "Underground Fighting Ring" },
      10: { Realistic: "Middle School Transition Anxiety", Fantasy: "Ancient Magic Artifact Discovery", Thrilling: "Corporate Heir Target" },
      11: { Realistic: "Social Media Nightmare", Fantasy: "Dream Walker's Curse", Thrilling: "Gang Recruitment Pressure" },
      12: { Realistic: "Teen Pregnancy Scare", Fantasy: "The Soul Bond Ritual", Thrilling: "International Incident" },
      13: { Realistic: "Gender Identity Crisis", Fantasy: "Shapeshifter's Dilemma", Thrilling: "Dark Web Discovery" },
      14: { Realistic: "Eating Disorder Emergency", Fantasy: "Blood Magic Awakening", Thrilling: "School Shooting Survivor" },
      15: { Realistic: "Teen Romance Turned Abusive", Fantasy: "Prophecy's Chosen Sacrifice", Thrilling: "Human Trafficking Near-Miss" },
      16: { Realistic: "Fatal Car Accident", Fantasy: "The Darkness Awakens", Thrilling: "Terrorism Accusation" },
      17: { Realistic: "College Application Scandal", Fantasy: "Magical Academy Final Trial", Thrilling: "International Spy Recruitment" },
      18: { Realistic: "Addiction and Overdose", Fantasy: "The Final Ascension", Thrilling: "Nuclear Crisis" }
    };
    
    const ageScenarios = scenarios[gameState.currentAge];
    return ageScenarios?.[gameState.gameStyle || ''] || "Growing Up";
  };

  const handleStartGame = async () => {
    setGameState(prev => ({ ...prev, phase: 'character-gen' }));
    
    // Simulate character generation
    setTimeout(() => {
      setGameState(prev => {
        const newGameState = {
          ...prev,
          phase: 'gameplay',
          parentCharacter: {
            name: 'Sarah Johnson',
            age: 32,
            profession: 'Teacher',
            background: 'Caring and organized with a love for education',
            financialLevel: 6
          },
          childCharacter: CharacterDevelopmentService.initializeCharacterDevelopment({
            name: 'Emma',
            age: 2,
            gender: 'girl',
            personality: 'Curious and energetic',
            traits: ['Creative', 'Social'],
            interests: ['Drawing', 'Playing with toys'],
            personalityTraits: [],
            skills: [],
            relationships: {},
            milestones: [],
            developmentHistory: []
          }),
          // Initialize family system
          ...FamilyManagementService.initializeFamily(CharacterDevelopmentService.initializeCharacterDevelopment({
            name: 'Emma',
            age: 2,
            gender: 'girl',
            personality: 'Curious and energetic',
            traits: ['Creative', 'Social'],
            interests: ['Drawing', 'Playing with toys'],
            personalityTraits: [],
            skills: [],
            relationships: {},
            milestones: [],
            developmentHistory: []
          }))
        } as GameState;
        
        // Initialize achievement system
        achievementService.initializeGameStateAchievements(newGameState);
        
        return newGameState;
      });
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
    const ageProgression = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const currentIndex = ageProgression.indexOf(gameState.currentAge);
    const nextAge = currentIndex < ageProgression.length - 1 ? ageProgression[currentIndex + 1] : 19;

    // Create scenario option for character development
    const scenarioOption: ScenarioOption = {
      label: choice,
      consequence,
      effects: {
        happiness: effects.happiness || 0,
        finances: effects.finances || 0,
        development: effects.development || [],
        // Add character development effects based on the decision
        traits: generateTraitEffectsFromDecision(choice, consequence),
        skills: generateSkillEffectsFromDecision(choice, consequence),
        relationships: generateRelationshipEffectsFromDecision(choice, consequence)
      }
    };

    // Update game state using family management system
    setGameState(prev => {
      let updatedGameState = { ...prev };
      
      // Apply family decision effects if using multiple children system
      if (prev.activeChildId && prev.children[prev.activeChildId]) {
        updatedGameState = FamilyManagementService.applyFamilyDecisionEffects(
          prev,
          scenarioOption,
          prev.activeChildId,
          nextAge
        );
      } else if (prev.childCharacter) {
        // Legacy single child support
        let updatedChildCharacter = CharacterDevelopmentService.applyDecisionEffects(
          prev.childCharacter,
          scenarioOption,
          nextAge
        );
        
        updatedChildCharacter = {
          ...updatedChildCharacter,
          age: nextAge
        };
        
        updatedGameState.childCharacter = updatedChildCharacter;
      }

      // Update active child age
      if (updatedGameState.activeChildId && updatedGameState.children[updatedGameState.activeChildId]) {
        updatedGameState.children[updatedGameState.activeChildId] = {
          ...updatedGameState.children[updatedGameState.activeChildId],
          age: nextAge
        };
      }

      return {
        ...updatedGameState,
        timeline: [...updatedGameState.timeline, {
          ...timelineEntry,
          childId: updatedGameState.activeChildId || undefined
        }],
        happiness: Math.max(0, Math.min(100, updatedGameState.happiness + effects.happiness)),
        finances: Math.max(-100000, updatedGameState.finances + effects.finances),
        currentAge: nextAge
      };
    });

    // Check if game should end
    if (nextAge > 18) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, phase: 'ended' }));
      }, 1000);
    }
  };

  // Helper functions to generate character development effects from decisions
  const generateTraitEffectsFromDecision = (choice: string, consequence: string): { [traitId: string]: number } => {
    const effects: { [traitId: string]: number } = {};
    
    // Analyze choice and consequence for trait implications
    const choiceLower = choice.toLowerCase();
    const consequenceLower = consequence.toLowerCase();
    
    if (choiceLower.includes('therapy') || choiceLower.includes('professional')) {
      effects.confidence = 5;
      effects.resilience = 8;
    }
    
    if (choiceLower.includes('wait') || choiceLower.includes('patience')) {
      effects.resilience = 3;
      effects.independence = -2;
    }
    
    if (choiceLower.includes('independent') || choiceLower.includes('alone')) {
      effects.independence = 10;
      effects.confidence = 5;
    }
    
    if (consequenceLower.includes('success') || consequenceLower.includes('improves')) {
      effects.confidence = 3;
    }
    
    if (consequenceLower.includes('stress') || consequenceLower.includes('worry')) {
      effects.resilience = -3;
    }

    return effects;
  };

  const generateSkillEffectsFromDecision = (choice: string, _consequence: string): { [skillId: string]: number } => {
    const effects: { [skillId: string]: number } = {};
    
    const choiceLower = choice.toLowerCase();
    
    if (choiceLower.includes('school') || choiceLower.includes('education')) {
      effects.reading = 5;
      effects.math = 5;
    }
    
    if (choiceLower.includes('art') || choiceLower.includes('creative')) {
      effects.art = 8;
      effects.music = 3;
    }
    
    if (choiceLower.includes('sports') || choiceLower.includes('physical')) {
      effects.sports = 10;
    }
    
    if (choiceLower.includes('social') || choiceLower.includes('friends')) {
      effects.communication = 5;
      effects.teamwork = 5;
    }

    return effects;
  };

  const generateRelationshipEffectsFromDecision = (choice: string, consequence: string): { [type: string]: Partial<RelationshipMetric> } => {
    const effects: { [type: string]: any } = {};
    
    const choiceLower = choice.toLowerCase();
    const consequenceLower = consequence.toLowerCase();
    
    if (choiceLower.includes('together') || choiceLower.includes('support')) {
      effects['parent-child'] = { quality: 5, trust: 3, communication: 5 };
    }
    
    if (choiceLower.includes('strict') || choiceLower.includes('force')) {
      effects['parent-child'] = { quality: -3, trust: -5, communication: -2 };
    }
    
    if (consequenceLower.includes('bond') || consequenceLower.includes('closer')) {
      effects['parent-child'] = { quality: 8, trust: 5 };
    }
    
    if (choiceLower.includes('school') || choiceLower.includes('social')) {
      effects['peer'] = { quality: 3, communication: 5 };
    }

    return effects;
  };

  // Family management functions
  const handleChildSelect = (childId: string) => {
    setGameState(prev => FamilyManagementService.switchActiveChild(prev, childId));
  };

  const handleAddChild = () => {
    const newChild = {
      name: 'New Child',
      age: 0,
      gender: Math.random() > 0.5 ? 'boy' : 'girl',
      personality: 'Curious and energetic',
      traits: ['Creative'],
      interests: ['Playing', 'Learning'],
      personalityTraits: [],
      skills: [],
      relationships: {},
      milestones: [],
      developmentHistory: []
    };

    setGameState(prev => 
      FamilyManagementService.addChild(prev, newChild, 'planned')
    );
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
      
      // Initialize achievement system for loaded state if not present
      achievementService.initializeGameStateAchievements(loadedState);
      
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
      
      // Multiple Children Support
      children: {},
      activeChildId: null,
      siblingRelationships: [],
      familyDynamics: {
        cohesion: 85,
        stress: 15,
        favoritism: {},
        resourceStrain: 20
      },
      childBirthEvents: [],
      
      // Achievement & Badge System
      achievements: {
        unlocked: [],
        progress: [],
        stats: {
          totalPoints: 0,
          achievementsUnlocked: 0,
          achievementsAvailable: 0,
          rarityCount: {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0
          },
          categoryProgress: {
            family: { unlocked: 0, total: 0, points: 0 },
            individual: { unlocked: 0, total: 0, points: 0 },
            sibling: { unlocked: 0, total: 0, points: 0 },
            parenting: { unlocked: 0, total: 0, points: 0 },
            milestone: { unlocked: 0, total: 0, points: 0 },
            financial: { unlocked: 0, total: 0, points: 0 },
            social: { unlocked: 0, total: 0, points: 0 }
          },
          recentUnlocks: []
        }
      },
      badges: [],
      
      // Legacy support
      childCharacter: null,
      
      currentAge: 1,
      timeline: [],
      finances: 50000,
      happiness: 75
    });
    
    // Clear achievement notifications
    setNewAchievementUnlocks([]);
    setShowAchievementDashboard(false);
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
            <div className="relative">
              <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">
                  BabySim - {Object.keys(gameState.children).length > 1 ? 'Managing Your Family' : `Raising ${gameState.childCharacter?.name || FamilyManagementService.getActiveChild(gameState)?.name}`}
                </h1>
                <div className="flex gap-2">
                  {Object.keys(gameState.children).length > 0 && (
                    <>
                      <button
                        onClick={() => {
                          setShowFamilyDashboard(!showFamilyDashboard);
                          setShowStatisticsDashboard(false);
                          setShowAchievementDashboard(false);
                        }}
                        className={`px-4 py-2 rounded transition-colors ${
                          showFamilyDashboard 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        Family ({Object.keys(gameState.children).length})
                      </button>
                      <button
                        onClick={() => {
                          setShowStatisticsDashboard(!showStatisticsDashboard);
                          setShowFamilyDashboard(false);
                          setShowAchievementDashboard(false);
                        }}
                        className={`px-4 py-2 rounded transition-colors ${
                          showStatisticsDashboard 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        }`}
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => {
                          setShowAchievementDashboard(!showAchievementDashboard);
                          setShowFamilyDashboard(false);
                          setShowStatisticsDashboard(false);
                        }}
                        className={`px-4 py-2 rounded transition-colors ${
                          showAchievementDashboard 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                        }`}
                      >
                        🏆 Achievements ({gameState.achievements.stats.achievementsUnlocked})
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowSaveMenu(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Save Game
                  </button>
                  <button
                    onClick={() => setShowLoadMenu(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Load Game
                  </button>
                </div>
              </div>
              
              {showFamilyDashboard ? (
                <FamilyDashboard
                  gameState={gameState}
                  onChildSelect={handleChildSelect}
                  onAddChild={handleAddChild}
                />
              ) : showStatisticsDashboard ? (
                <StatisticsDashboard
                  gameState={gameState}
                />
              ) : showAchievementDashboard ? (
                <AchievementDashboard
                  gameState={gameState}
                  onClose={() => setShowAchievementDashboard(false)}
                />
              ) : (
                <GameplayPhase
                  gameState={gameState}
                  onDecision={handleDecision}
                  onRestart={handleRestart}
                />
              )}
            </div>
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

        {/* Achievement Notifications */}
        <AchievementNotificationManager
          newUnlocks={newAchievementUnlocks}
          onClearNotifications={() => setNewAchievementUnlocks([])}
        />
      </div>
    </ErrorBoundary>
  );
};
