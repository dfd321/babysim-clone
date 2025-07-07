import React, { useState } from 'react';
import { ChildCharacter } from '../types/game';
import { CharacterDevelopmentService } from '../services/characterDevelopmentService';
import { useTranslation } from '../contexts/TranslationContext';

interface CharacterDevelopmentProps {
  character: ChildCharacter;
  compact?: boolean;
}

const CharacterDevelopmentComponent: React.FC<CharacterDevelopmentProps> = ({ 
  character, 
  compact = false 
}) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'traits' | 'skills' | 'relationships' | 'milestones'>('overview');
  const overallScore = CharacterDevelopmentService.getOverallDevelopmentScore(character);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-gray-800 mb-3">{t('character_development')}</h3>
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-indigo-600">
            {Math.round(overallScore)}
          </div>
          <div className="text-xs text-gray-600">{t('overall_development_score')}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-xs">{t('strongest_traits')}</h4>
            {character.personalityTraits
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map(trait => (
                <div key={trait.id} className="text-center mb-2">
                  <div className="text-gray-600 text-xs">{trait.name}</div>
                  <div className="font-bold text-blue-600 text-xs">{Math.round(trait.value)}</div>
                </div>
              ))}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-xs">{t('top_skills')}</h4>
            {character.skills
              .sort((a, b) => b.level - a.level)
              .slice(0, 3)
              .map(skill => (
                <div key={skill.id} className="text-center mb-2">
                  <div className="text-gray-600 text-xs">{skill.name}</div>
                  <div className="font-bold text-green-600 text-xs">{t('level')} {skill.level}</div>
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
          <span className="text-sm font-medium text-gray-700">{t('overall_development_score')}</span>
          <span className="text-lg font-bold text-blue-600">{Math.round(overallScore)}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">{t('average_personality_score')}</span>
          <span className="text-lg font-bold text-purple-600">
            {Math.round(character.personalityTraits.reduce((sum, trait) => sum + trait.value, 0) / character.personalityTraits.length || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">{t('skills_unlocked')}</span>
          <span className="text-lg font-bold text-green-600">
            {character.skills.filter(s => s.unlocked).length}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">{t('milestones_achieved')}</span>
          <span className="text-lg font-bold text-orange-600">
            {character.milestones.filter(m => m.achieved).length}
          </span>
        </div>
      </div>

      {/* Top Traits and Skills */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t('strongest_traits')}</h3>
          <div className="space-y-2">
            {character.personalityTraits
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map(trait => (
                <div key={trait.id} className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm text-gray-700">{trait.name}</div>
                  <div className="text-sm font-bold text-blue-600">
                    {Math.round(trait.value)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t('top_skills')}</h3>
          <div className="space-y-2">
            {character.skills
              .filter(s => s.unlocked)
              .sort((a, b) => b.level - a.level)
              .slice(0, 5)
              .map(skill => (
                <div key={skill.id} className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm text-gray-700">{skill.name}</div>
                  <div className="text-sm font-bold text-green-600">
                    {t('level')} {skill.level}
                  </div>
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
            <h3 className="font-semibold text-gray-800 mb-3 capitalize">{category} {t('traits_category')}</h3>
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
            <h3 className="font-semibold text-gray-800 mb-3 capitalize">{category} {t('skills_category')}</h3>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id} className={`text-center p-2 rounded ${
                  skill.unlocked ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className="text-sm font-medium text-gray-700">{skill.name}</div>
                  <div className="text-sm font-bold text-green-600">
                    {t('level')} {skill.level}
                    {!skill.unlocked && (
                      <span className="text-xs text-gray-400 ml-1">🔒</span>
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
              <span className="text-sm font-medium text-gray-700">{t('quality')}</span>
              <span className="text-sm font-bold text-blue-600">{relationship.quality}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm font-medium text-gray-700">{t('trust')}</span>
              <span className="text-sm font-bold text-green-600">{relationship.trust}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="text-sm font-medium text-gray-700">{t('communication')}</span>
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
            <div className="text-xs text-gray-500">{t('age')} {milestone.age}</div>
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
        <h2 className="text-2xl font-bold text-gray-800">{t('character_development')}</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-0 overflow-x-auto">
          {[
            { id: 'overview', label: t('overview') },
            { id: 'traits', label: t('traits') },
            { id: 'skills', label: t('skills') },
            { id: 'relationships', label: t('relationships') },
            { id: 'milestones', label: t('milestones') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-2 py-3 font-medium text-xs whitespace-nowrap border-b-2 ${
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

// Memoize CharacterDevelopment component to prevent unnecessary re-renders
// Only re-render when character data changes significantly
export const CharacterDevelopment = React.memo(CharacterDevelopmentComponent, (prevProps, nextProps) => {
  // Check if compact mode changed
  if (prevProps.compact !== nextProps.compact) {
    return false;
  }
  
  // Check if character reference changed
  if (prevProps.character === nextProps.character) {
    return true;
  }
  
  // Deep comparison of character properties that affect display
  const prevChar = prevProps.character;
  const nextChar = nextProps.character;
  
  return (
    prevChar.name === nextChar.name &&
    prevChar.age === nextChar.age &&
    prevChar.personalityTraits.length === nextChar.personalityTraits.length &&
    prevChar.skills.length === nextChar.skills.length &&
    prevChar.milestones.length === nextChar.milestones.length &&
    Object.keys(prevChar.relationships).length === Object.keys(nextChar.relationships).length &&
    // Compare last trait values for changes
    JSON.stringify(prevChar.personalityTraits.map(t => t.value)) === 
    JSON.stringify(nextChar.personalityTraits.map(t => t.value))
  );
});

CharacterDevelopment.displayName = 'CharacterDevelopment';