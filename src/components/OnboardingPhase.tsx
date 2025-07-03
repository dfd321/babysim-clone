import React from 'react';
import { OnboardingPhaseProps } from '../types/game';
import { RoleSelector } from './RoleSelector';
import { StyleSelector } from './StyleSelector';
import { RequirementsInput } from './RequirementsInput';

export const OnboardingPhase: React.FC<OnboardingPhaseProps> = ({
  gameState,
  onRoleSelect,
  onStyleSelect,
  onRequirementsChange,
  onStartGame
}) => {
  const canStart = gameState.role && gameState.gameStyle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to BabySim
          </h1>
          <p className="text-xl text-gray-600">
            Experience the journey of parenting through interactive decisions
          </p>
        </div>

        <div className="space-y-8">
          {/* Role Selection Step */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-semibold text-gray-800">Choose Your Role</h2>
              </div>
            </div>
            <RoleSelector
              selectedRole={gameState.role}
              onRoleSelect={onRoleSelect}
            />
          </div>

          {/* Style Selection Step */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                gameState.role 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                2
              </div>
              <div className="ml-3">
                <h2 className={`text-xl font-semibold ${
                  gameState.role ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  Choose Game Style
                </h2>
              </div>
            </div>
            <StyleSelector
              selectedStyle={gameState.gameStyle}
              onStyleSelect={onStyleSelect}
              disabled={!gameState.role}
            />
          </div>

          {/* Special Requirements Step */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                gameState.gameStyle 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                3
              </div>
              <div className="ml-3">
                <h2 className={`text-xl font-semibold ${
                  gameState.gameStyle ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  Special Requirements (Optional)
                </h2>
              </div>
            </div>
            <RequirementsInput
              requirements={gameState.specialRequirements}
              onRequirementsChange={onRequirementsChange}
              disabled={!gameState.gameStyle}
            />
          </div>

          {/* Start Game Button */}
          <div className="text-center pt-4">
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200
                ${canStart
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {canStart ? '🍼 Ready to Meet Your Baby!' : '👶 Complete Steps Above'}
            </button>
            
            {canStart && (
              <p className="text-sm text-gray-600 mt-2">
                Your characters will be generated and your parenting journey will begin!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};