import React, { useState } from 'react';
import { ChildCharacter } from '../types/game';
import { CharacterDevelopmentService } from '../services/characterDevelopmentService';

interface CharacterDevelopmentProps {
  character: ChildCharacter;
  compact?: boolean;
}

export const CharacterDevelopment: React.FC<CharacterDevelopmentProps> = ({ 
  character, 
  compact = false 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'traits' | 'skills' | 'relationships' | 'milestones'>('overview');
  const overallScore = CharacterDevelopmentService.getOverallDevelopmentScore(character);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-800 mb-3">Character Development</h3>
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-indigo-600">
            {Math.round(overallScore)}
          </div>
          <div className="text-xs text-gray-600">Overall Development Score</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Top Traits</h4>
            {character.personalityTraits
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map(trait => (
                <div key={trait.id} className="flex justify-between mb-1">
                  <span className="text-gray-600">{trait.name}</span>
                  <span className="font-medium">{Math.round(trait.value)}</span>
                </div>
              ))}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Top Skills</h4>
            {character.skills
              .sort((a, b) => b.level - a.level)
              .slice(0, 3)
              .map(skill => (
                <div key={skill.id} className="flex justify-between mb-1">
                  <span className="text-gray-600">{skill.name}</span>
                  <span className="font-medium">Lv.{skill.level}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-4">
      {/* Key Metrics in Simple Rows */}
      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Overall Development Score</span>
          <span className="text-lg font-bold text-blue-600">{Math.round(overallScore)}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Average Personality Score</span>
          <span className="text-lg font-bold text-purple-600">
            {Math.round(character.personalityTraits.reduce((sum, trait) => sum + trait.value, 0) / character.personalityTraits.length || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Skills Unlocked</span>
          <span className="text-lg font-bold text-green-600">
            {character.skills.filter(s => s.unlocked).length}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Milestones Achieved</span>
          <span className="text-lg font-bold text-orange-600">
            {character.milestones.filter(m => m.achieved).length}
          </span>
        </div>
      </div>

      {/* Top Traits and Skills */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Strongest Traits</h3>
          <div className="space-y-2">
            {character.personalityTraits
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map(trait => (
                <div key={trait.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{trait.name}</span>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(trait.value)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Top Skills</h3>
          <div className="space-y-2">
            {character.skills
              .filter(s => s.unlocked)
              .sort((a, b) => b.level - a.level)
              .slice(0, 5)
              .map(skill => (
                <div key={skill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{skill.name}</span>
                  <span className="text-sm font-bold text-green-600">
                    Level {skill.level}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TraitsTab = () => {
    const traitsByCategory = CharacterDevelopmentService.getTraitsByCategory(character);
    
    return (
      <div className="space-y-4">
        {Object.entries(traitsByCategory).map(([category, traits]) => (
          <div key={category} className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3 capitalize">{category} Traits</h3>
            <div className="space-y-2">
              {traits.map(trait => (
                <div key={trait.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{trait.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${trait.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 min-w-0">
                      {Math.round(trait.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SkillsTab = () => {
    const skillsByCategory = CharacterDevelopmentService.getSkillsByCategory(character);
    
    return (
      <div className="space-y-4">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3 capitalize">{category} Skills</h3>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id} className={`flex justify-between items-center p-2 rounded ${
                  skill.unlocked ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-green-600">
                      Level {skill.level}
                    </span>
                    {!skill.unlocked && (
                      <span className="text-xs text-gray-400">🔒</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RelationshipsTab = () => (
    <div className="space-y-4">
      {Object.entries(character.relationships).map(([key, relationship]) => (
        <div key={key} className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            {key.split('-').join(' ').toUpperCase()}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm font-medium text-gray-700">Quality</span>
              <span className="text-sm font-bold text-blue-600">{relationship.quality}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm font-medium text-gray-700">Trust</span>
              <span className="text-sm font-bold text-green-600">{relationship.trust}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="text-sm font-medium text-gray-700">Communication</span>
              <span className="text-sm font-bold text-purple-600">{relationship.communication}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const MilestonesTab = () => (
    <div className="space-y-2">
      {character.milestones.map(milestone => (
        <div 
          key={milestone.id} 
          className={`flex justify-between items-center p-3 rounded-lg ${
            milestone.achieved 
              ? 'bg-green-50' 
              : 'bg-gray-50'
          }`}
        >
          <div className="flex-1">
            <span className={`text-sm font-medium ${
              milestone.achieved ? 'text-green-800' : 'text-gray-600'
            }`}>
              {milestone.name}
            </span>
            <div className="text-xs text-gray-500">Age {milestone.age}</div>
          </div>
          <div className="flex items-center">
            {milestone.achieved ? (
              <span className="text-green-600">✅</span>
            ) : (
              <span className="text-gray-400">⭕</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Character Development</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'traits', label: 'Traits' },
            { id: 'skills', label: 'Skills' },
            { id: 'relationships', label: 'Relationships' },
            { id: 'milestones', label: 'Milestones' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-3 font-medium text-sm border-b-2 ${
                selectedTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {selectedTab === 'overview' && <OverviewTab />}
        {selectedTab === 'traits' && <TraitsTab />}
        {selectedTab === 'skills' && <SkillsTab />}
        {selectedTab === 'relationships' && <RelationshipsTab />}
        {selectedTab === 'milestones' && <MilestonesTab />}
      </div>
    </div>
  );
};