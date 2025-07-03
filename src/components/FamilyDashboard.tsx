import React, { useState } from 'react';
import { GameState } from '../types/game';
import { FamilyManagementService } from '../services/familyManagementService';
import { CharacterDevelopment } from './CharacterDevelopment';

interface FamilyDashboardProps {
  gameState: GameState;
  onChildSelect: (childId: string) => void;
  onAddChild?: () => void;
}

export const FamilyDashboard: React.FC<FamilyDashboardProps> = ({
  gameState,
  onChildSelect,
  onAddChild
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'children' | 'relationships'>('overview');
  
  const familyOverview = FamilyManagementService.getFamilyOverview(gameState);
  const children = Object.values(gameState.children);
  const activeChild = FamilyManagementService.getActiveChild(gameState);

  const FamilyOverviewPanel = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Family Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{familyOverview.totalChildren}</div>
          <div className="text-sm text-gray-600">Children</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(familyOverview.averageHappiness)}</div>
          <div className="text-sm text-gray-600">Avg Happiness</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            familyOverview.familyStressLevel === 'Critical' ? 'text-red-600' :
            familyOverview.familyStressLevel === 'High' ? 'text-orange-600' :
            familyOverview.familyStressLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {familyOverview.familyStressLevel}
          </div>
          <div className="text-sm text-gray-600">Stress Level</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            familyOverview.cohesionLevel === 'Excellent' ? 'text-green-600' :
            familyOverview.cohesionLevel === 'Good' ? 'text-blue-600' :
            familyOverview.cohesionLevel === 'Fair' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {familyOverview.cohesionLevel}
          </div>
          <div className="text-sm text-gray-600">Cohesion</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Family Dynamics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cohesion</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${gameState.familyDynamics.cohesion}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{gameState.familyDynamics.cohesion}/100</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stress</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${gameState.familyDynamics.stress}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{gameState.familyDynamics.stress}/100</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resource Strain</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${gameState.familyDynamics.resourceStrain}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{gameState.familyDynamics.resourceStrain}/100</span>
              </div>
            </div>
          </div>
        </div>

        {familyOverview.strongestBond && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Strongest Sibling Bond</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">
                  {gameState.children[familyOverview.strongestBond.childId1]?.name} & {gameState.children[familyOverview.strongestBond.childId2]?.name}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {familyOverview.strongestBond.bond}/100 bond
                </span>
              </div>
              <div className="text-xs text-green-600 mt-1 capitalize">
                {familyOverview.strongestBond.relationshipType} relationship
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ChildrenPanel = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Children</h3>
        {onAddChild && (
          <button
            onClick={onAddChild}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Child
          </button>
        )}
      </div>
      
      <div className="grid gap-4">
        {children.map(child => (
          <div 
            key={child.id} 
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${
              child.id === gameState.activeChildId 
                ? 'border-2 border-blue-500' 
                : 'border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => child.id && onChildSelect(child.id)}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-gray-800">{child.name}</h4>
                <p className="text-sm text-gray-600">Age {child.age} • {child.gender}</p>
              </div>
              {child.id === gameState.activeChildId && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-gray-600">Top Trait</div>
                <div className="font-medium">
                  {child.personalityTraits.length > 0 
                    ? child.personalityTraits.reduce((top, trait) => 
                        trait.value > top.value ? trait : top
                      ).name
                    : 'Developing'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-600">Skills</div>
                <div className="font-medium">{child.skills.length} skills</div>
              </div>
              <div>
                <div className="text-gray-600">Relationships</div>
                <div className="font-medium">
                  {Object.values(child.relationships).reduce((sum, rel) => sum + rel.quality, 0) / Object.values(child.relationships).length || 0}/100
                </div>
              </div>
            </div>

            {gameState.familyDynamics.favoritism[child.id || ''] && (
              <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                Perceived favoritism: {gameState.familyDynamics.favoritism[child.id || '']}/100
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const RelationshipsPanel = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Sibling Relationships</h3>
      
      {gameState.siblingRelationships.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No sibling relationships yet.</p>
          <p className="text-sm">Add more children to see sibling dynamics!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gameState.siblingRelationships.map((relationship, index) => {
            const child1 = gameState.children[relationship.childId1];
            const child2 = gameState.children[relationship.childId2];
            
            if (!child1 || !child2) return null;
            
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {child1.name} & {child2.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    relationship.relationshipType === 'close' ? 'bg-green-100 text-green-800' :
                    relationship.relationshipType === 'protective' ? 'bg-blue-100 text-blue-800' :
                    relationship.relationshipType === 'competitive' ? 'bg-orange-100 text-orange-800' :
                    relationship.relationshipType === 'distant' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {relationship.relationshipType}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Bond</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${relationship.bond}%` }}
                      />
                    </div>
                    <div className="text-center mt-1 font-medium">{relationship.bond}/100</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Rivalry</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${relationship.rivalry}%` }}
                      />
                    </div>
                    <div className="text-center mt-1 font-medium">{relationship.rivalry}/100</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Cooperation</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${relationship.cooperation}%` }}
                      />
                    </div>
                    <div className="text-center mt-1 font-medium">{relationship.cooperation}/100</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'overview' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('children')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'children' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Children ({familyOverview.totalChildren})
          </button>
          <button
            onClick={() => setSelectedView('relationships')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'relationships' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Relationships
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && <FamilyOverviewPanel />}
      {selectedView === 'children' && <ChildrenPanel />}
      {selectedView === 'relationships' && <RelationshipsPanel />}

      {/* Active Child Detail */}
      {activeChild && selectedView === 'children' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {activeChild.name} - Character Development
          </h3>
          <CharacterDevelopment character={activeChild} compact={false} />
        </div>
      )}
    </div>
  );
};